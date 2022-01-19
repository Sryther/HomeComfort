import { Document, model, Schema } from 'mongoose';

export interface ViewSonicDocument extends Document {
    name: string,
    serialPortPath: string
}

const ViewSonicModel = new Schema<ViewSonicDocument>({
    name: {
        type: String,
        required: true
    },
    serialPortPath: {
        type: String,
        required: true
    }
});

const ViewSonic = model<ViewSonicDocument>('ViewSonic', ViewSonicModel);

export default ViewSonic;
