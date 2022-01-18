import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface ILumene {
    name: string,
    serialPortPath: string
}

export interface LumeneDocument extends ILumene, Document { }

export interface LumeneModel extends Model<LumeneDocument> { }

const LumeneSchema = new Schema<LumeneDocument, LumeneModel>({
    name: {
        type: String,
        required: true
    },
    serialPortPath: {
        type: String,
        required: true
    }
});

const Lumene = mongoose.model('Lumene', LumeneSchema);

export default Lumene;
