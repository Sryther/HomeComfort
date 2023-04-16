import SerializableEntity from "../SerializableEntity";

/**
 * Map Entities are everything that is expressed with coordinates such as
 * Go-To Markers, Virtual walls, Paths or no-go areas
 */
class MapEntity extends SerializableEntity {
    protected points: any;
    private type: any;
    /**
     *
     * @param {object} options
     * @param {Array<number>} options.points
     * @param {string} options.type
     * @param {object} [options.metaData]
     */
    constructor(options: any) {
        super(options);

        if (options.points.length === 0 || options.points.length % 2 !== 0) {
            throw new Error("Invalid points array");
        }

        if (!options.points.every((e: any) => Number.isInteger(e))) {
            throw new Error("Only integer coordinates are allowed");
        }

        this.points = options.points;
        this.type = options.type;
    }
}

export default MapEntity