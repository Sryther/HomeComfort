import MapEntity from "./MapEntity";

class LineMapEntity extends MapEntity {
    static TYPE: Readonly<{ VIRTUAL_WALL: string }> = Object.freeze({
        VIRTUAL_WALL: "virtual_wall"
    });

    /**
     *
     * @param {object} options
     * @param {Array<number>} options.points
     * @param {LineMapEntityType} options.type
     * @param {object} [options.metaData]
     */
    constructor(options: any) {
        super(options);
    }
}

export default LineMapEntity;