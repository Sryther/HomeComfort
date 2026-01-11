import { Document, Schema, model } from 'mongoose';
import {ActionDocument, ActionSchema} from "../action/Action";

/**
 * Represents a document that defines a scene in the application.
 * Extends the base `Document` interface.
 *
 * @interface SceneDocument
 *
 * @property {string} name
 * The name of the scene.
 *
 * @property {ActionDocument[]} actions
 * An array of actions associated with the scene.
 */
export interface SceneDocument extends Document {
    name: string,
    actions: ActionDocument[]
}

/**
 * Schema definition for a Scene document.
 *
 * This schema is used to define the structure and validation rules
 * for a scene, including its name and associated actions.
 *
 * Properties:
 * - `name`: A string representing the name of the scene.
 *   It is a required field and must be provided when creating a document.
 * - `actions`: An array of ActionSchema objects that defines the actions
 *   associated with the scene. This field is required and defaults to
 *   an empty array if not specified.
 */
const SceneSchema = new Schema<SceneDocument>({
    name: {
        type: String,
        required: true
    },
    actions: {
        type: [ActionSchema],
        default: [],
        required: true
    }
});

const Scene = model<SceneDocument>('Scene', SceneSchema);

export default Scene;
