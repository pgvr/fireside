import { Types } from "mongoose"
import Setting, { SettingModel } from "../model/setting.model"

export default class SettingRepo {
    public static findByUserId(userId: Types.ObjectId): Promise<Setting> {
        return SettingModel.findOne({ userId }).lean<Setting>().exec()
    }

    public static async create(setting: Setting): Promise<Setting> {
        const now = new Date()
        setting.createdAt = now
        setting.updatedAt = now
        return SettingModel.create(setting)
    }

    public static async update(setting: Setting): Promise<Setting> {
        setting.updatedAt = new Date()
        return SettingModel.updateOne({ userId: setting.userId }, { $set: { ...setting } }).exec()
    }

    public static async delete(userId: Types.ObjectId): Promise<Setting> {
        return SettingModel.findOneAndDelete({ userId })
    }
}
