import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface IViewSonic {
    name: string,
    serialPortPath: string
}

export interface ViewSonicDocument extends IViewSonic, Document { }

export interface ViewSonicModel extends Model<ViewSonicDocument> { }

const ViewSonicModel = new Schema<ViewSonicDocument, ViewSonicModel>({
    name: {
        type: String,
        required: true
    },
    serialPortPath: {
        type: String,
        required: true
    }
});

const ViewSonic = mongoose.model('ViewSonic', ViewSonicModel);

export default ViewSonic;
