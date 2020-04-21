import { Document, model, Schema } from "mongoose"

export const DOCUMENT_NAME = "conference"
export const COLLECTION_NAME = "conferences"

export default interface Conference extends Document {
    conferenceId?: string
    userOnePhone: string
    userOneIsScheduled: boolean
    userTwoPhone: string
    userTwoIsScheduled: boolean
    commonInterests: string[]
    createdAt: Date
    callStartedAt?: Date
}

const schema = new Schema(
    {
        conferenceId: {
            type: Schema.Types.String,
        },
        userOnePhone: {
            type: Schema.Types.String,
            required: true,
        },
        userOneIsScheduled: {
            type: Schema.Types.Boolean,
            required: true,
        },
        userTwoPhone: {
            type: Schema.Types.String,
            required: true,
        },
        userTwoIsScheduled: {
            type: Schema.Types.Boolean,
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
