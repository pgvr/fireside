import { Document, model, Schema } from "mongoose"

export const DOCUMENT_NAME = "user"
export const COLLECTION_NAME = "users"

export default interface User extends Document {
    phone: string
    city: string
    interests: string[]
    job: string
    language: string
    password: string
    createdAt: Date
    updatedAt: Date
}

const schema = new Schema(
    {
        phone: {
            type: Schema.Types.String,
            required: true,
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
        password: {
            type: Schema.Types.String,
        },
        createdAt: {
            type: Date,
            required: true,
            select: false,
        },
        updatedAt: {
            type: Date,
            required: true,
            select: false,
        },
    },
    {
        versionKey: false,
    },
)

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME)
