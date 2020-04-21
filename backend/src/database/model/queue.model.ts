import { Document, model, Schema } from "mongoose"

export const DOCUMENT_NAME = "queueUser"
export const COLLECTION_NAME = "queue"

export default interface QueueUser extends Document {
    phone: string
    city: string
    interests: string[]
    job: string
    language: string
    isScheduled: boolean
}

export const schema = new Schema(
    {
        phone: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 100,
        },
        city: {
            type: Schema.Types.String,
            required: true,
            trim: true,
        },
        interests: {
            type: [Schema.Types.String],
            required: true,
        },
        job: {
            type: Schema.Types.String,
            required: true,
        },
        language: {
            type: Schema.Types.String,
            required: true,
        },
        isScheduled: {
            type: Schema.Types.Boolean,
            required: true,
        },
    },
    {
        versionKey: false,
    },
)

export const QueueModel = model<QueueUser>(DOCUMENT_NAME, schema, COLLECTION_NAME)
