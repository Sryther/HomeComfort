import dotenv from "dotenv";

dotenv.config();

enum ENV {
    DEVELOPMENT = 'DEVELOPMENT',
    PRODUCTION = 'PRODUCTION'
}

export default {
    env: process.env.ENV || ENV.DEVELOPMENT,
    database: {
        host: process.env.DATABASE_URI || '127.0.0.1',
        port: process.env.DATABASE_PORT || '27017',
        dbname: process.env.DATABASE_DBNAME || 'helix',
        credentials: {
            username: process.env.DATABASE_USER ||'user',
            password: process.env.DATABASE_PASSWORD || 'password',
            authDatabase: process.env.DATABASE_AUTH || 'admin'
        }
    },
    api: {
        hostname: process.env.API_HOSTNAME !== undefined ? process.env.API_HOSTNAME : 'localhost',
        port: process.env.API_PORT !== undefined ? parseInt(process.env.API_PORT) : 3000
    }
};
