import Map from "../models/entities/map";

/**
 * @typedef {object} Block
 * @property {number} type
 * @property {number} header_length
 * @property {number} data_length
 * @property {Buffer=} view
 */

const BlockTypes = {
    "CHARGER_LOCATION": 1,
    "IMAGE": 2,
    "PATH": 3,
    "GOTO_PATH": 4,
    "GOTO_PREDICTED_PATH": 5,
    "CURRENTLY_CLEANED_ZONES": 6,
    "GOTO_TARGET": 7,
    "ROBOT_POSITION": 8,
    "NO_GO_AREAS": 9,
    "VIRTUAL_WALLS": 10,
    "CURRENTLY_CLEANED_SEGMENTS": 11,
    "NO_MOP_AREAS": 12,
    "DIGEST": 1024
};

interface Block {
    view: any | undefined;
    type: number,
    header_length: number,
    data_length: number
}

class RRMapParser {
    static DIMENSION_PIXELS: number = 1024;
    static DIMENSION_MM: number = 50 * 1024;
    /**
     * @param {Buffer} mapBuf Should contain map in RRMap Format
     * @returns {null|Map}
     */
    static PARSE(mapBuf: Buffer){
        if (mapBuf[0x00] === 0x72 && mapBuf[0x01] === 0x72) {// rr
            const metaData = RRMapParser.PARSE_METADATA(mapBuf);
            const blocks = RRMapParser.BUILD_BLOCK_INDEX(mapBuf.slice(0x14));
            const processedBlocks = RRMapParser.PROCESS_BLOCKS(blocks);

            return RRMapParser.POST_PROCESS_BLOCKS(metaData, processedBlocks);
        } else {
            return null;
        }
    }

    /**
     * @param {Buffer} buf
     */
    static PARSE_METADATA(buf: Buffer) {
        return {
            header_length: buf.readUInt16LE(0x02),
            data_length: buf.readUInt32LE(0x04),
            version: {
                major: buf.readUInt16LE(0x08),
                minor: buf.readUInt16LE(0x0A)
            },
            map_index: buf.readUInt16LE(0x0C),
            map_sequence: buf.readUInt16LE(0x10)
        };
    }

    /**
     * @param {Buffer} buf
     */
    static BUILD_BLOCK_INDEX(buf: Buffer) {
        const block_index = [];

        while (buf.length > 0) {
            const blockMetadata = RRMapParser.PARSE_BLOCK_METADATA(buf);

            block_index.push(blockMetadata);
            buf = buf.slice(blockMetadata.header_length + blockMetadata.data_length);
        }

        return block_index;
    }

    /**
     * @param {Buffer} buf
     */
    static PARSE_BLOCK_METADATA(buf: Buffer) {
        const block_metadata: Block = {
            type: buf.readUInt16LE(0x00),
            header_length: buf.readUInt16LE(0x02),
            data_length: buf.readUInt32LE(0x04),
            view: undefined
        };

        block_metadata.view = buf.slice(0, block_metadata.header_length + block_metadata.data_length);

        return block_metadata;
    }

    /**
     * @param {Block[]} blocks
     */
    static PROCESS_BLOCKS(blocks: Block[]) {
        const result = {};

        blocks.forEach((block: Block) => {
            // @ts-ignore
            result[block.type] = RRMapParser.PARSE_BLOCK(block);
        });

        return result;
    }

    //TODO: Check if more values are in fact signed
    /**
     * @param {Block} block
     */
    static PARSE_BLOCK(block: Block) {
        switch (block.type) {
            case BlockTypes.ROBOT_POSITION:
            case BlockTypes.CHARGER_LOCATION:
                return RRMapParser.PARSE_POSITION_BLOCK(block);
            case BlockTypes.IMAGE:
                return RRMapParser.PARSE_IMAGE_BLOCK(block);
            case BlockTypes.PATH:
            case BlockTypes.GOTO_PATH:
            case BlockTypes.GOTO_PREDICTED_PATH:
                return this.PARSE_PATH_BLOCK(block);
            case BlockTypes.GOTO_TARGET:
                return this.PARSE_GOTO_TARGET_BLOCK(block);
            case BlockTypes.CURRENTLY_CLEANED_ZONES:
            case BlockTypes.VIRTUAL_WALLS:
                return this.PARSE_STRUCTURES_BLOCK(block, false);
            case BlockTypes.NO_GO_AREAS:
                return this.PARSE_STRUCTURES_BLOCK(block, true);
            case BlockTypes.NO_MOP_AREAS:
                return this.PARSE_STRUCTURES_BLOCK(block, true);
            case BlockTypes.CURRENTLY_CLEANED_SEGMENTS:
                return this.PARSE_SEGMENTS_BLOCK(block);
        }
    }

    /**
     * @param {Block} block
     */
    static PARSE_POSITION_BLOCK(block: Block) {
        return {
            position: [
                block.view.readUInt16LE(0x08),
                block.view.readUInt16LE(0x0c)
            ],
            //If available, the angle needs to be flipped as well
            angle: block.data_length >= 12 ? block.view.readInt32LE(0x10) * -1 : null // gen3+
        };
    }

    /**
     * @param {Block} block
     */
    static PARSE_PATH_BLOCK(block: Block) {
        const points = [];

        for (let i = 0; i < block.data_length; i = i + 4) {
            //to draw these coordinates onto the map pixels, they have to be divided by 50
            points.push(
                block.view.readUInt16LE(0x14 + i),
                block.view.readUInt16LE(0x14 + i + 2)
            );
        }

        return {
            points: points,
            current_angle: block.view.readUInt32LE(0x10), //This is always 0. Roborock didn't bother
        };
    }

    /**
     * @param {Block} block
     */
    static PARSE_IMAGE_BLOCK(block: Block) {
        const parsedBlock = {
            segments: {}
        };
        let view;
        let mayContainSegments = false;

        switch (block.header_length) {
            case 24:
                view = block.view;
                break;
            case 28:
                //Gen3 headers have additional segments header data, which increases its length by 4 bytes
                //Everything else stays at the same relative offsets so we can just throw those additional bytes away
                view = block.view.slice(4);
                //parsedBlock.segments.count = view.readInt32LE(0x04); TODO
                mayContainSegments = true;
                break;

            default:
                throw new Error("Unsupported header length. Please file a bug report");
        }

        // @ts-ignore
        parsedBlock.position = {
            top: view.readInt32LE(0x08),
            left: view.readInt32LE(0x0c)
        };
        // @ts-ignore
        parsedBlock.dimensions = {
            height: view.readInt32LE(0x10),
            width: view.readInt32LE(0x14)
        };

        // position.left has to be position right for supporting the flipped map
        // @ts-ignore
        parsedBlock.position.top = RRMapParser.DIMENSION_PIXELS - parsedBlock.position.top - parsedBlock.dimensions.height;

        //There can only be pixels if there is an image
        // @ts-ignore
        if (parsedBlock.dimensions.height > 0 && parsedBlock.dimensions.width > 0) {
            const imageData = {
                floor: [],
                obstacle_weak: [],
                obstacle_strong: []
            };

            for (let i = 0; i < block.data_length; i++) {
                const val = view[0x18 + i];

                if (val !== 0) {
                    // @ts-ignore
                    const coordsX = (i % parsedBlock.dimensions.width) + parsedBlock.position.left;
                    // @ts-ignore
                    const coordsY = (parsedBlock.dimensions.height-1 - Math.floor(i / parsedBlock.dimensions.width)) + parsedBlock.position.top;

                    const type = val & 0b00000111;
                    switch (type) {
                        case 0:
                            break;
                        case 1:
                            // @ts-ignore
                            imageData.obstacle_strong.push(coordsX, coordsY);
                            break;
                        default: {
                            if (mayContainSegments) {
                                let segmentId = (val & 0b11111000) >> 3;

                                if (segmentId !== 0) {
                                    // @ts-ignore
                                    if (!parsedBlock.segments[segmentId]) {
                                        // @ts-ignore
                                        parsedBlock.segments[segmentId] = [];
                                    }

                                    // @ts-ignore
                                    parsedBlock.segments[segmentId].push(coordsX, coordsY);
                                } else {
                                    // @ts-ignore
                                    imageData.floor.push(coordsX, coordsY);
                                }
                            } else {
                                // @ts-ignore
                                imageData.floor.push(coordsX, coordsY);
                            }

                            break;
                        }
                    }
                }
            }

            // @ts-ignore
            parsedBlock.pixels = imageData;
        }

        return parsedBlock;
    }

    /**
     * @param {Block} block
     */
    static PARSE_GOTO_TARGET_BLOCK(block: Block) {
        return {
            position: [
                block.view.readUInt16LE(0x08),
                block.view.readUInt16LE(0x0a)
            ]
        };
    }

    /**
     * @param {Block} block
     * @param {boolean} extended
     */
    static PARSE_STRUCTURES_BLOCK(block: Block, extended: boolean) {
        const structureCount = block.view.readUInt32LE(0x08);
        const structures = [];

        if (structureCount > 0) {
            for (let i = 0; i < block.data_length; i = i + (extended ? 16 : 8)) {
                const structure = [
                    block.view.readUInt16LE(0x0c + i),
                    block.view.readUInt16LE(0x0c + i + 2),
                    block.view.readUInt16LE(0x0c + i + 4),
                    block.view.readUInt16LE(0x0c + i + 6)
                ];

                if (extended) {
                    structure.push(
                        block.view.readUInt16LE(0x0c + i + 8),
                        block.view.readUInt16LE(0x0c + i + 10),
                        block.view.readUInt16LE(0x0c + i + 12),
                        block.view.readUInt16LE(0x0c + i + 14)
                    );
                }

                structures.push(structure);
            }

            return structures;
        } else {
            return undefined;
        }
    }

    /**
     * @param {Block} block
     */
    static PARSE_SEGMENTS_BLOCK(block: Block) {
        const segmentsCount = block.view.readUInt32LE(0x08);
        const segments = [];

        if (segmentsCount > 0) {
            for (let i = 0; i < block.data_length; i++) {
                segments.push(block.view.readUInt8(0x0c + i));
            }

            return segments;
        } else {
            return undefined;
        }
    }

    /**
     *
     * @param {object} metaData
     * @param {object} blocks
     * @returns {null|Map}
     */
    static POST_PROCESS_BLOCKS(metaData: any, blocks: any) {
        // @ts-ignore
        if (blocks[BlockTypes.IMAGE] && blocks[BlockTypes.IMAGE].pixels) { //We need the image to flip everything else correctly
            const layers = [];
            const entities = [];
            let angle = null;

            // @ts-ignore
            if (blocks[BlockTypes.IMAGE].pixels.floor.length > 0) {
                layers.push(
                    new Map.MapLayer({
                        // @ts-ignore
                        pixels: blocks[BlockTypes.IMAGE].pixels.floor,
                        type: Map.MapLayer.TYPE.FLOOR,
                    })
                );
            }

            // @ts-ignore
            if (blocks[BlockTypes.IMAGE].pixels.obstacle_strong.length > 0) {
                layers.push(
                    new Map.MapLayer({
                        // @ts-ignore
                        pixels: blocks[BlockTypes.IMAGE].pixels.obstacle_strong,
                        type: Map.MapLayer.TYPE.WALL,
                    })
                );
            }

            // @ts-ignore
            Object.keys(blocks[BlockTypes.IMAGE].segments).forEach(k => {
                // @ts-ignore
                if (blocks[BlockTypes.IMAGE].segments[k].length === 0) {
                    return;
                }

                const segmentId = parseInt(k);
                let isActive = false;

                if (blocks[BlockTypes.CURRENTLY_CLEANED_SEGMENTS]) {
                    // @ts-ignore
                    isActive = blocks[BlockTypes.CURRENTLY_CLEANED_SEGMENTS].includes(segmentId);
                }

                // @ts-ignore
                layers.push(new Map.MapLayer({
                    // @ts-ignore
                    pixels: blocks[BlockTypes.IMAGE].segments[k],
                    type: Map.MapLayer.TYPE.SEGMENT,
                    metaData: {
                        segmentId: segmentId,
                        active: isActive
                    }
                }));
            });

            if (blocks[BlockTypes.PATH]) {
                // @ts-ignore
                const points = blocks[BlockTypes.PATH].points.map((p, i) => {
                    if (i % 2 === 0) {
                        return Math.round(p/10);
                    } else {
                        return Math.round((RRMapParser.DIMENSION_MM - p)/10);
                    }
                });

                //Fallback angle calculation from path if it's not part of the position block
                // @ts-ignore
                if (blocks[BlockTypes.ROBOT_POSITION] && (blocks[BlockTypes.ROBOT_POSITION].angle === null || blocks[BlockTypes.ROBOT_POSITION] === undefined)) {
                    // @ts-ignore
                    if (blocks[BlockTypes.PATH].points.length >= 4) {
                        angle = Math.round(Math.atan2(
                            points[points.length - 1] -
                            points[points.length - 3],

                            points[points.length - 2] -
                            points[points.length - 4]

                        ) * 180 / Math.PI);
                    }
                }

                if (points?.length > 0) {
                    entities.push(new Map.PathMapEntity({
                        points: points,
                        type: Map.PathMapEntity.TYPE.PATH
                    }));
                }
            }

            if (blocks[BlockTypes.GOTO_PREDICTED_PATH]) {
                // @ts-ignore
                const predictedPathPoints = blocks[BlockTypes.GOTO_PREDICTED_PATH].points.map((p, i) => {
                    if (i % 2 === 0) {
                        return Math.round(p/10);
                    } else {
                        return Math.round((RRMapParser.DIMENSION_MM - p)/10);
                    }
                });

                if (predictedPathPoints?.length > 0) {
                    entities.push(new Map.PathMapEntity({
                        points: predictedPathPoints,
                        type: Map.PathMapEntity.TYPE.PREDICTED_PATH
                    }));
                }
            }

            if (blocks[BlockTypes.CHARGER_LOCATION]) {
                entities.push(new Map.PointMapEntity({
                    points: [
                        // @ts-ignore
                        Math.round(blocks[BlockTypes.CHARGER_LOCATION].position[0]/10),
                        // @ts-ignore
                        Math.round((RRMapParser.DIMENSION_MM - blocks[BlockTypes.CHARGER_LOCATION].position[1])/10)
                    ],
                    type: Map.PointMapEntity.TYPE.CHARGER_LOCATION
                }));
            }

            if (blocks[BlockTypes.ROBOT_POSITION]) {
                // @ts-ignore
                if (blocks[BlockTypes.ROBOT_POSITION].angle !== null) {
                    // @ts-ignore
                    angle = blocks[BlockTypes.ROBOT_POSITION].angle;
                }

                angle = angle !== null ? angle : 0; //fallback

                //Roborock uses -180 to +180 with 0 being the robot facing east
                //We're using 0-360 with 0 being the robot facing north
                angle = (angle + 450) % 360;

                entities.push(new Map.PointMapEntity({
                    points: [
                        // @ts-ignore
                        Math.round(blocks[BlockTypes.ROBOT_POSITION].position[0]/10),
                        // @ts-ignore
                        Math.round((RRMapParser.DIMENSION_MM - blocks[BlockTypes.ROBOT_POSITION].position[1])/10)
                    ],
                    metaData: {
                        angle: angle !== null ? angle : 0 //fallback
                    },
                    type: Map.PointMapEntity.TYPE.ROBOT_POSITION
                }));
            }

            if (blocks[BlockTypes.GOTO_TARGET]) {
                entities.push(new Map.PointMapEntity({
                    points: [
                        // @ts-ignore
                        Math.round(blocks[BlockTypes.GOTO_TARGET].position[0]/10),
                        // @ts-ignore
                        Math.round((RRMapParser.DIMENSION_MM - blocks[BlockTypes.GOTO_TARGET].position[1])/10)
                    ],
                    type: Map.PointMapEntity.TYPE.GO_TO_TARGET
                }));
            }

            if (blocks[BlockTypes.CURRENTLY_CLEANED_ZONES]) {
                // @ts-ignore
                blocks[BlockTypes.CURRENTLY_CLEANED_ZONES].forEach(zone => {
                    // @ts-ignore
                    zone = zone.map((p, i) => {
                        if (i % 2 === 0) {
                            return Math.round(p/10);
                        } else {
                            return Math.round((RRMapParser.DIMENSION_MM - p)/10);
                        }
                    });

                    //Roborock specifies zones with only two coordinates so we need to add the missing ones
                    entities.push(new Map.PolygonMapEntity({
                        type: Map.PolygonMapEntity.TYPE.ACTIVE_ZONE,
                        points: [
                            zone[0],
                            zone[1],
                            zone[0],
                            zone[3],
                            zone[2],
                            zone[3],
                            zone[2],
                            zone[1]
                        ]
                    }));
                });
            }

            if (blocks[BlockTypes.NO_GO_AREAS]) {
                // @ts-ignore
                blocks[BlockTypes.NO_GO_AREAS].forEach(area => {
                    entities.push(new Map.PolygonMapEntity({
                        // @ts-ignore
                        points: area.map((p, i) => {
                            if (i % 2 === 0) {
                                return Math.round(p/10);
                            } else {
                                return Math.round((RRMapParser.DIMENSION_MM - p)/10);
                            }
                        }),
                        type: Map.PolygonMapEntity.TYPE.NO_GO_AREA
                    }));
                });
            }

            if (blocks[BlockTypes.NO_MOP_AREAS]) {
                // @ts-ignore
                blocks[BlockTypes.NO_MOP_AREAS].forEach(area => {
                    entities.push(new Map.PolygonMapEntity({
                        // @ts-ignore
                        points: area.map((p, i) => {
                            if (i % 2 === 0) {
                                return Math.round(p/10);
                            } else {
                                return Math.round((RRMapParser.DIMENSION_MM - p)/10);
                            }
                        }),
                        type: Map.PolygonMapEntity.TYPE.NO_MOP_AREA
                    }));
                });
            }

            if (blocks[BlockTypes.VIRTUAL_WALLS]) {
                // @ts-ignore
                blocks[BlockTypes.VIRTUAL_WALLS].forEach(wall => {
                    entities.push(new Map.LineMapEntity({
                        // @ts-ignore
                        points: wall.map((p, i) => {
                            if (i % 2 === 0) {
                                return Math.round(p/10);
                            } else {
                                return Math.round((RRMapParser.DIMENSION_MM - p)/10);
                            }
                        }),
                        type: Map.LineMapEntity.TYPE.VIRTUAL_WALL
                    }));
                });
            }

            return new Map.Map({
                metaData: {
                    vendorMapId: metaData.map_index
                },
                size: {
                    x: 5120,
                    y: 5120
                },
                pixelSize: 5,
                layers: layers,
                entities: entities
            });
        } else {
            return null;
        }
    }
}

export default RRMapParser;