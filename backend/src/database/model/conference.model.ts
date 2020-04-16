import { Document, model, Schema } from "mongoose"

export const DOCUMENT_NAME = "conference"
export const COLLECTION_NAME = "conferences"

export default interface Conference extends Document {
    conferenceId?: string
    phoneOne: string
    phoneTwo: string
    commonInterests: string[]
    createdAt: Date
    callStartedAt?: Date
}

const schema = new Schema(
    {
        conferenceId: {
            type: Schema.Types.String,
        },
        phoneOne: {
            type: Schema.Types.String,
            required: true,
        },
        phoneTwo: {
            type: Schema.Types.String,
            required: true,
        },
        commonInterests: {
            type: [Schema.Types.String],
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        callStartedAt: {
            type: Date,
        },
    },
    {
        versionKey: false,
    },
)

export const ConferenceModel = model<Conference>(DOCUMENT_NAME, schema, COLLECTION_NAME)
