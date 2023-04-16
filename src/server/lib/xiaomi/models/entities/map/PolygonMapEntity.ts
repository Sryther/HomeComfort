import MapEntity from "./MapEntity";

class PolygonMapEntity extends MapEntity {
    static TYPE: Readonly<{ NO_GO_AREA: string; ACTIVE_ZONE: string; NO_MOP_AREA: string }> = Object.freeze({
        ACTIVE_ZONE: "active_zone",
        NO_GO_AREA: "no_go_area",
        NO_MOP_AREA: "no_mop_area"
    });

    /**
     *
     * @param {object} options
     * @param {Array<number>} options.points
     * @param {PolygonMapEntityType} options.type
     * @param {object} [options.metaData]
     */
    constructor(options: any) {
        super(options);
    }
}

export default PolygonMapEntity;