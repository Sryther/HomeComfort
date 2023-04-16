export default class FourColorTheoremSolver {
    private readonly stepFunction: (c: any) => any;
    private readonly areaGraph: MapAreaGraph | undefined;

    /**
     * This class determines how to color the different map segments contained in the given layers object.
     * The resulting color mapping will ensure that no two adjacent segments share the same color.
     * The map is evaluated row-by-row and column-by-column in order to find every pair of segments that are in "line of sight" of each other.
     * Each pair of segments is then represented as an edge in a graph where the vertices represent the segments themselves.
     * We then use a simple greedy algorithm to color all vertices so that none of its edges connect it to a vertex with the same color.
     *
     * @param {Array<object>} layers - the data containing the map image (array of pixel offsets)
     * @param {number} resolution - Minimal resolution of the map scanner in pixels. Any number higher than one will lead to this many pixels being skipped when finding segment boundaries.
     * For example: If the robot measures 30cm in length/width, this should be set to 6, as no room can be smaller than 6 pixels. This of course implies that a pixel represents 5cm in the real world.
     */
    constructor(layers: any[], resolution: number) {
        const prec = Math.floor(resolution);
        this.stepFunction = function (c) {
            return c + prec;
        };
        var preparedLayers = this.preprocessLayers(layers);
        if (preparedLayers !== undefined) {
            var mapData = this.createPixelToSegmentMapping(preparedLayers);
            this.areaGraph = this.buildGraph(mapData);
            this.areaGraph.colorAllVertices();
        }
    }

    /**
     * @param {number} segmentId - ID of the segment you want to get the color for.
     * The segment ID is extracted from the layer meta data in the first contructor parameter of this class.
     * @returns {number} The segment color, represented as an integer. Starts at 0 and goes up the minimal number of colors required to color the map without collisions.
     */
    getColor(segmentId: number) {
        if (this.areaGraph === undefined) {
            // Layer preprocessing seems to have failed. Just return a default value for any input.
            return 0;
        }

        var segmentFromGraph = this.areaGraph.getById(segmentId);
        if (segmentFromGraph) {
            return segmentFromGraph.color;
        } else {
            return 0;
        }
    }

    preprocessLayers(layers: any[]) {
        const internalSegments: any[] = [];
        const boundaries = {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity
        };
        const filteredLayers = layers.filter(layer => layer.type === "segment");
        if (filteredLayers.length <= 0) {
            return undefined;
        }
        filteredLayers.forEach(layer => {
            const allPixels = [];
            for (let index = 0; index < layer.pixels.length - 1; index += 2) {
                var p = {
                    x: layer.pixels[index],
                    y: layer.pixels[index + 1]
                };
                this.setBoundaries(boundaries, p);
                allPixels.push(p);
            }
            internalSegments.push({
                segmentId: layer.metaData.segmentId,
                name: layer.metaData.name,
                pixels: allPixels
            });
        });
        return {
            boundaries: boundaries,
            segments: internalSegments
        };
    }

    setBoundaries(res: any, pixel: any) {
        if (pixel.x < res.minX) {
            res.minX = pixel.x;
        }
        if (pixel.y < res.minY) {
            res.minY = pixel.y;
        }
        if (pixel.x > res.maxX) {
            res.maxX = pixel.x;
        }
        if (pixel.y > res.maxY) {
            res.maxY = pixel.y;
        }
    }

    createPixelToSegmentMapping(preparedLayers: any) {
        const pixelData = this.create2DArray(
            preparedLayers.boundaries.maxX + 1,
            // @ts-ignore
            preparedLayers.boundaries.maxY + 1
        );
        const segmentIds: any[] = [];
        preparedLayers.segments.forEach((seg: any) => {
            segmentIds.push(seg.segmentId);
            seg.pixels.forEach((p: any) => {
                pixelData[p.x][p.y] = seg.segmentId;
            });
        });
        return {
            map: pixelData,
            segmentIds: segmentIds,
            boundaries: preparedLayers.boundaries
        };
    }

    buildGraph(mapData: any) {
        const vertices = mapData.segmentIds.map((i: any) => new MapAreaVertex(i));
        const graph = new MapAreaGraph(vertices);
        this.traverseMap(mapData.boundaries, mapData.map, (x: any, y: any, currentSegmentId: any, pixelData: any) => {
            const newSegmentId = pixelData[x][y];
            graph.connectVertices(currentSegmentId, newSegmentId);
            return newSegmentId !== undefined ? newSegmentId : currentSegmentId;
        });
        return graph;
    }

    traverseMap(boundaries: any, pixelData: any, func: any) {
        // row-first traversal
        for (let y = boundaries.minY; y <= boundaries.maxY; y = this.stepFunction(y)) {
            let rowFirstSegmentId = undefined;
            for (let x = boundaries.minX; x <= boundaries.maxX; x = this.stepFunction(x)) {
                rowFirstSegmentId = func(x, y, rowFirstSegmentId, pixelData);
            }
        }
        // column-first traversal
        for (let x = boundaries.minX; x <= boundaries.maxX; x = this.stepFunction(x)) {
            let colFirstSegmentId = undefined;
            for (let y = boundaries.minY; y <= boundaries.maxY; y = this.stepFunction(y)) {
                colFirstSegmentId = func(x, y, colFirstSegmentId, pixelData);
            }
        }
    }

    /**
     * Credit for this function goes to the authors of this StackOverflow answer: https://stackoverflow.com/a/966938
     *
     * @param {number} length
     */
    create2DArray(length: number) {
        const arr = new Array(length || 0);
        let i = length;
        if (arguments.length > 1) {
            const args = Array.prototype.slice.call(arguments, 1);
            while (i--) {
                // @ts-ignore
                arr[length - 1 - i] = this.create2DArray.apply(this, args);
            }
        }
        return arr;
    }
}

class MapAreaVertex {
    private id: any;
    private adjacentVertexIds: Set<any>;
    private color: undefined;
    constructor(id: any) {
        this.id = id;
        this.adjacentVertexIds = new Set();
        this.color = undefined;
    }

    appendVertex(vertexId: any) {
        if (vertexId !== undefined) {
            this.adjacentVertexIds.add(vertexId);
        }
    }
}

class MapAreaGraph {
    private vertexLookup: Map<any, any>;
    private vertices: any;
    constructor(vertices: any) {
        this.vertices = vertices;
        this.vertexLookup = new Map();
        this.vertices.forEach((v : any)=> {
            this.vertexLookup.set(v.id, v);
        });
    }

    connectVertices(id1: any, id2: any) {
        if (id1 !== undefined && id2 !== undefined && id1 !== id2) {
            if (this.vertexLookup.has(id1)) {
                this.vertexLookup.get(id1).appendVertex(id2);
            }
            if (this.vertexLookup.has(id2)) {
                this.vertexLookup.get(id2).appendVertex(id1);
            }
        }
    }

    /**
     * Color the graphs vertices using a greedy algorithm. Any vertices that have already been assigned a color will not be changed.
     * Color assignment will start with the vertex that is connected with the highest number of edges. In most cases, this will
     * naturally lead to a distribution where only four colors are required for the whole graph. This is relevant for maps with a high
     * number of segments, as the naive, greedy algorithm tends to require a fifth color when starting coloring in a segment far from the map's center.
     *
     */
    colorAllVertices() {
        this.vertices.sort((l: any, r: any) => r.adjacentVertexIds.size - l.adjacentVertexIds.size)
            .forEach((v: any) => {
                if (v.adjacentVertexIds.size <= 0) {
                    v.color = 0;
                } else {
                    const adjs = this.getAdjacentVertices(v);
                    const existingColors = adjs
                        .filter(vert => vert.color !== undefined)
                        .map(vert => vert.color);
                    v.color = this.lowestColor(existingColors);
                }
            });
    }

    getAdjacentVertices(vertex: any) {
        return Array.from(vertex.adjacentVertexIds).map(id => this.getById(id));
    }

    getById(id: any) {
        return this.vertices.find((v: any) => v.id === id);
    }

    lowestColor(colors: any[]) {
        if (colors.length <= 0) {
            return 0;
        }
        for (let index = 0; index < colors.length + 1; index++) {
            if (!colors.includes(index)) {
                return index;
            }
        }
    }
}
