import { Document, model, Schema } from "mongoose"

export const DOCUMENT_NAME = "participant"
export const COLLECTION_NAME = "participants"

export default interface Participant extends Document {
    phone: string
    city: string
    interests: string[]
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
    },
    {
        versionKey: false,
    },
)

export const ParticipantModel = model<Participant>(DOCUMENT_NAME, schema, COLLECTION_NAME)
