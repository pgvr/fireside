import { Document, model, Schema } from "mongoose"
import User from "./user.model"

export const DOCUMENT_NAME = "keystore"
export const COLLECTION_NAME = "keystores"

export default interface Keystore extends Document {
    client: User
    primaryKey: string
    secondaryKey: string
    status?: boolean
    createdAt?: Date
    updatedAt?: Date
}

const schema = new Schema(
    {
        client: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
            index: true,
        },
        primaryKey: {
            type: Schema.Types.String,
            required: true,
            index: true,
        },
        secondaryKey: {
            type: Schema.Types.String,
            required: true,
            index: true,
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
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

export const KeystoreModel = model<Keystore>(DOCUMENT_NAME, schema, COLLECTION_NAME)
