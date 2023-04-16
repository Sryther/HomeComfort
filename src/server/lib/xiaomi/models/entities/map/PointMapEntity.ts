import MapEntity from "./MapEntity";

class PointMapEntity extends MapEntity {
    static TYPE: Readonly<{ CHARGER_LOCATION: string; GO_TO_TARGET: string; ROBOT_POSITION: string }> = Object.freeze({
        CHARGER_LOCATION: "charger_location",
        ROBOT_POSITION: "robot_position",
        GO_TO_TARGET: "go_to_target"
    });

    /**
     *
     * @param {object} options
     * @param {Array<number>} options.points
     * @param {PointMapEntityType} options.type
     * @param {object} [options.metaData]
     * @param {number} [options.metaData.angle] 0-360°. 0° being North
     */
    constructor(options: any) {
        super(options);

        if (this.points.length !== 2) {
            throw new Error("Coordinate count mismatch");
        }
    }
}

export default PointMapEntity;