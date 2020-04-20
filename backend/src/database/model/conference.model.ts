import { Document, model, Schema } from "mongoose"

export const DOCUMENT_NAME = "conference"
export const COLLECTION_NAME = "conferences"

export default interface Conference extends Document {
    conferenceId?: string
    userOne: {
        phone: string
        isScheduled: boolean
    }
    userTwo: {
        phone: string
        isScheduled: boolean
    }
    commonInterests: string[]
    createdAt: Date
    callStartedAt?: Date
}

const schema = new Schema(
    {
        conferenceId: {
            type: Schema.Types.String,
        },
        userOne: {
            type: Schema.Types.Map,
            of: Schema.Types.String,
            required: true,
        },
        userTwo: {
            type: Schema.Types.Map,
            of: Schema.Types.String,
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
