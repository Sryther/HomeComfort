import { Document, Schema, model } from 'mongoose';
import {ActionDocument, ActionSchema} from "../action/Action";

export interface SceneDocument extends Document {
    name: string,
    description: string,
    actions: ActionDocument[]
}

const SceneSchema = new Schema<SceneDocument>({
    name: {
        type: String,
        required: true
    },
    actions: {
        type: [ActionSchema],
        default: [],
        required: false
    }
});

const Scene = model<SceneDocument>('Scene', SceneSchema);

export default Scene;
