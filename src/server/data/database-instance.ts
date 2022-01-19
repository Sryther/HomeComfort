import mongoose, {ConnectOptions} from "mongoose";
import Config from "../config";

mongoose.connect(
    `mongodb://${Config.database.credentials.username}:${Config.database.credentials.password}@${Config.database.host}:${Config.database.port}/${Config.database.dbname}`
);

export default mongoose;
