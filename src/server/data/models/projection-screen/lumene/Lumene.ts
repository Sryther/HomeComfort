import { Document, model, Schema } from 'mongoose';

export interface LumeneDocument extends Document {
    name: string,
    serialPortPath: string
}

const LumeneSchema = new Schema<LumeneDocument>({
    name: {
        type: String,
        required: true
    },
    serialPortPath: {
        type: String,
        required: true
    }
});

const Lumene = model<LumeneDocument>('Lumene', LumeneSchema);

export default Lumene;
