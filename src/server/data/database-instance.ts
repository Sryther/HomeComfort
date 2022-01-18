import mongoose from "mongoose";
import Config from "../config";

const options: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(
    `mongodb://${Config.database.credentials.username}:${Config.database.credentials.password}@${Config.database.host}:${Config.database.port}/${Config.database.dbname}`,
    options
);

export default mongoose;
