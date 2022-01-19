import mongoose, {ConnectOptions} from "mongoose";
import Config from "../config";

const options: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authMechanism: Config.database.credentials.authMechanism
};

mongoose.connect(
    `mongodb://${Config.database.credentials.username}:${Config.database.credentials.password}@${Config.database.host}:${Config.database.port}/${Config.database.dbname}`,
    options
);

export default mongoose;
