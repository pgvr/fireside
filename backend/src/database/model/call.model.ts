import { Document, model, Schema } from "mongoose"

export const DOCUMENT_NAME = "call"
export const COLLECTION_NAME = "calls"

export default interface Call extends Document {
    conferenceId: string
    phone: string
    commonInterests: string[]
    guessedInterests: string[]
    rating: number
    createdAt: Date
    completedAt: Date
    points: number
    firstCall: boolean
    isScheduled: boolean
}

const schema = new Schema(
    {
        conferenceId: {
            type: Schema.Types.String,
            required: true,
        },
        phone: {
            type: Schema.Types.String,
            required: true,
        },
        commonInterests: {
            type: [Schema.Types.String],
            required: true,
        },
        guessedInterests: {
            type: [Schema.Types.String],
            required: true,
        },
        rating: {
            type: Schema.Types.Number,
            required: true,
        },
        points: {
            type: Schema.Types.Number,
            required: true,
        },
        firstCall: {
            type: Schema.Types.Boolean,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        completedAt: {
            type: Date,
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

export const CallModel = model<Call>(DOCUMENT_NAME, schema, COLLECTION_NAME)
