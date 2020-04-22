import { Document, model, Schema, Types } from "mongoose"

export const DOCUMENT_NAME = "setting"
export const COLLECTION_NAME = "settings"

export default interface Setting extends Document {
    userId: Types.ObjectId
    days: number[]
    startTime: string
    endTime: string
    numPerDay: number
    updatedAt: Date
}

export const schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
        },
        days: {
            type: [Schema.Types.Number],
            min: 0,
            max: 6,
            required: true,
        },
        startTime: {
            type: Schema.Types.String,
            required: true,
        },
        endTime: {
            type: Schema.Types.String,
            required: true,
        },
        numPerDay: {
            type: Schema.Types.Number,
            required: true,
            min: 1,
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
