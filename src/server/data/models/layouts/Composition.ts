import * as mongoose from 'mongoose';
import { Document, Model, Schema, Types } from 'mongoose';

export interface IComposition {
    name: string,
    maps: [Types.ObjectId],
}

export interface CompositionDocument extends IComposition, Document { }

export interface CompositionModel extends Model<CompositionDocument & Document> { }

const CompositionSchema = new Schema<CompositionDocument, CompositionModel>({
    name: {
        type: String,
        required: true
    },
    maps: {
        type: [Types.ObjectId],
        required: true
    }
});

const Composition = mongoose.model('Composition', CompositionSchema);

export default Composition;
