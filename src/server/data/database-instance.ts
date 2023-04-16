import mongoose, {ConnectOptions} from "mongoose";
import Config from "../config";

const options: ConnectOptions = {
    authMechanism: "SCRAM-SHA-256",
};

mongoose.connect(
    `mongodb://${Config.database.credentials.username}:${Config.database.credentials.password}@${Config.database.host}:${Config.database.port}/${Config.database.dbname}?authSource=${Config.database.credentials.authDatabase}`,
    options
);

export default mongoose;
