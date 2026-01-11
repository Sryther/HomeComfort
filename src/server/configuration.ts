import dotenv from "dotenv";

dotenv.config();

/**
 * Singleton class to manage the application's configuration.
 * Configuration values are obtained primarily from environment variables.
 */
export default class Configuration {
    private static instance: Configuration;

    private readonly apiHostname: string;
    private readonly apiPort: number;

    private readonly databaseUri: string;
    private readonly databasePort: number;
    private readonly databaseDbname: string;
    private readonly databaseUser: string;
    private readonly databasePassword: string;
    private readonly databaseAuth: string;

    private constructor() {
        // API
        this.apiHostname = process.env.API_HOSTNAME || "0.0.0.0";
        this.apiPort = this.readInt("API_PORT", 3000);

        // DATABASE
        this.databaseUri = this.readString("DATABASE_URI");
        this.databasePort = this.readInt("DATABASE_PORT", 27017);
        this.databaseDbname = this.readString("DATABASE_DBNAME");
        this.databaseUser = this.readString("DATABASE_USER");
        this.databasePassword = this.readString("DATABASE_PASSWORD");
        this.databaseAuth = process.env.DATABASE_AUTH || "admin";
    }

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            Configuration.instance = new Configuration();
        }
        return Configuration.instance;
    }

    // ---------- API ----------

    public getApiHostname(): string {
        return this.apiHostname;
    }

    public getApiPort(): number {
        return this.apiPort;
    }

    // ---------- DATABASE ----------

    public getDatabaseUri(): string {
        return this.databaseUri;
    }

    public getDatabasePort(): number {
        return this.databasePort;
    }

    public getDatabaseDbname(): string {
        return this.databaseDbname;
    }

    public getDatabaseUser(): string {
        return this.databaseUser;
    }

    public getDatabasePassword(): string {
        return this.databasePassword;
    }

    public getDatabaseAuth(): string {
        return this.databaseAuth;
    }

    // ---------- Helpers ----------

    private readString(key: string): string {
        const value = process.env[key];
        if (!value || value.trim() === "") {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        return value;
    }

    private readInt(key: string, defaultValue?: number): number {
        const raw = process.env[key];

        if (raw === undefined || raw === "") {
            if (defaultValue !== undefined) {
                return defaultValue;
            }
            throw new Error(`Missing required environment variable: ${key}`);
        }

        const value = Number(raw);
        if (Number.isNaN(value)) {
            throw new Error(`Invalid number for environment variable ${key}: "${raw}"`);
        }

        return value;
    }
}
