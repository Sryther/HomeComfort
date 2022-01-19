import {Document, model, Schema, Types} from 'mongoose';

export interface CompositionDocument extends Document {
    name: string,
    maps: [Types.ObjectId],
}

const CompositionSchema = new Schema<CompositionDocument>({
    name: {
        type: String,
        required: true
    },
    maps: {
        type: [Types.ObjectId],
        required: true
    }
});

const Composition = model<CompositionDocument>('Composition', CompositionSchema);

export default Composition;
