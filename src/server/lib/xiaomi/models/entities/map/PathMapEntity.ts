import MapEntity from "./MapEntity";

class PathMapEntity extends MapEntity {
    static TYPE: Readonly<{ PATH: string; PREDICTED_PATH: string }> = Object.freeze({
        PATH: "path",
        PREDICTED_PATH: "predicted_path"
    });

    /**
     *
     * @param {object} options
     * @param {Array<number>} options.points
     * @param {PathMapEntityType} options.type
     * @param {object} [options.metaData]
     */
    constructor(options: any) {
        super(options);
    }
}

export default PathMapEntity;