import SerializableEntity from "../SerializableEntity";
import MapEntity from "./MapEntity";
import MapLayer from "./MapLayer";

/**
 * Represents a standard issue map
 * including MapLayers and MapEntities
 *
 * Everything is int. Coordinates and size are in cm
 *
 * The origin is found on the top-left corner
 *
 */
class Map extends SerializableEntity { //TODO: Current, Historic, Etc.
    private size: any;
    private readonly pixelSize: number;
    private layers: any[];
    private entities: any[];
    /**
     *
     * @param {object} options
     * @param {object} options.size
     * @param {number} options.size.x in cm
     * @param {number} options.size.y in cm
     * @param {number} options.pixelSize in cm
     * @param {Array<import("./MapLayer")>} options.layers
     * @param {Array<import("./MapEntity")>} options.entities
     * @param {any} [options.metaData]
     */
    constructor(options: any) {
        super(options);

        this.size = options.size;
        this.pixelSize = options.pixelSize;

        /** @type {Array<import("./MapLayer")>} */
        this.layers = [];
        /** @type {Array<import("./MapEntity")>} */
        this.entities = [];

        this.metaData.version = 1; // Will probably be incremented some day

        if (Array.isArray(options.layers)) {
            this.addLayers(options.layers);
        }

        if (Array.isArray(options.entities)) {
            this.addEntities(options.entities);
        }
    }

    /**
     * @public
     * @param {import("./MapLayer")} layer
     */
    addLayer(layer: MapLayer) {
        layer.metaData.area = (layer.pixels.length / 2) * (this.pixelSize * this.pixelSize);

        this.layers.push(layer);
    }

    /**
     * @public
     * @param {Array<import("./MapLayer")>} layers
     */
    addLayers(layers: MapLayer[]) {
        layers.forEach(l => this.addLayer(l));
    }

    /**
     * @public
     * @param {import("./MapEntity")} entity
     */
    addEntity(entity: MapEntity) {
        this.entities.push(entity);
    }

    /**
     * @public
     * @param {Array<import("./MapEntity")>} entities
     */
    addEntities(entities: MapEntity[]) {
        entities.forEach(e => this.addEntity(e));
    }
}

export default Map;