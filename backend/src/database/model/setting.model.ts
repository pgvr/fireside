import { Document, model, Schema, Types } from "mongoose"

export const DOCUMENT_NAME = "setting"
export const COLLECTION_NAME = "settings"

export default interface Setting extends Document {
    userId: Types.ObjectId
    days: number[]
    hours: number[]
    numPerDay: number
    createdAt: Date
    updatedAt: Date
}

export const schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        days: {
            type: [Schema.Types.Number],
            min: 0,
            max: 6,
            required: true,
        },
        hours: {
            type: [Schema.Types.Number],
            min: 0,
            max: 23,
            required: true,
        },
        numPerDay: {
            type: Schema.Types.Number,
            required: true,
            min: 1,
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

export const SettingModel = model<Setting>(DOCUMENT_NAME, schema, COLLECTION_NAME)
