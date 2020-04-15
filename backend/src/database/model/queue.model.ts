import { model, Schema } from "mongoose"
import User from "./user.model"

export const DOCUMENT_NAME = "member"
export const COLLECTION_NAME = "queue"

export const schema = new Schema(
    {
        phone: {
            type: Schema.Types.String,
            required: true,
            index: true,
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
        createdAt: {
            type: Schema.Types.Date,
            required: true,
        },
        updatedAt: {
            type: Schema.Types.Date,
            required: true,
        },
    },
    {
        versionKey: false,
    },
)

export const QueueModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME)
