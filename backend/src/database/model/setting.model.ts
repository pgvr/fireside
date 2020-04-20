import { Document, model, Schema } from "mongoose"

export const DOCUMENT_NAME = "setting"
export const COLLECTION_NAME = "settings"

export default interface Setting extends Document {
    userId: string
    days: number[]
    hours: number[]
    numPerDay: number
}

export const schema = new Schema(
    {
        userId: {
            type: Schema.Types.String,
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
    },
    {
        versionKey: false,
    },
)

export const SettingModel = model<Setting>(DOCUMENT_NAME, schema, COLLECTION_NAME)
