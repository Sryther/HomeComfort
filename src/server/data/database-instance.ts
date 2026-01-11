import mongoose, { ConnectOptions } from "mongoose";
import { log } from "../lib/logger";
import Configuration from "../configuration";

export default class DatabaseInstance {
    private static instance: DatabaseInstance;

    private constructor() {}

    public static getInstance(): DatabaseInstance {
        if (!DatabaseInstance.instance) DatabaseInstance.instance = new DatabaseInstance();
        return DatabaseInstance.instance;
    }

    public async connect(): Promise<void> {
        const scope = "MONGO";

        const host = Configuration.getInstance().getDatabaseUri();
        const port = Configuration.getInstance().getDatabasePort();
        const dbname = Configuration.getInstance().getDatabaseDbname();
        const user = Configuration.getInstance().getDatabaseUser();
        const password = Configuration.getInstance().getDatabasePassword();
        const authDb = Configuration.getInstance().getDatabaseAuth();

        const uri =
            `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}` +
            `@${host}:${port}/${dbname}?authSource=${authDb}&retryReads=true`;

        const options: ConnectOptions = {
            authMechanism: "SCRAM-SHA-256",

            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 15000,

            maxIdleTimeMS: 30000,
            maxPoolSize: 10,

            heartbeatFrequencyMS: 10000,
        };

        mongoose.set('strictQuery', false);

        log.info(scope, "Initializing MongoDB connection");
        log.info(scope, `URI=${uri.replace(/:([^:@/]+)@/, ":<redacted>@")}`); // masque mot de passe
        log.info(scope, "Options", options);

        // Events Mongoose pour diagnostic
        const db = mongoose.connection;
        db.on("connected", () => log.info(scope, "connected"));
        db.on("disconnected", () => log.warn(scope, "disconnected"));
        db.on("reconnected", () => log.info(scope, "reconnected"));
        db.on("error", (err) => log.error(scope, "error", err));

        log.info(scope, "Connecting…");
        await mongoose.connect(uri, options);
    }
}
