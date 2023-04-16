class SerializableEntity {
    private __class: any;
    metaData: any;
    /**
     *
     * @param {object} options
     * @param {object} [options.metaData]
     */
    constructor(options: any) {
        this.__class = this.constructor.name;

        this.metaData = options.metaData ?? {};
    }
}

export default SerializableEntity;