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
        const createdSetting = await SettingModel.create(setting)
        return createdSetting.toObject()
    }

    public static async update(setting: Setting): Promise<Setting> {
        setting.updatedAt = new Date()
        const newSetting = await SettingModel.updateOne({ userId: setting.userId }, { $set: { ...setting } }).exec()
        return newSetting
    }

    public static async delete(userId: Types.ObjectId): Promise<Setting> {
        const setting = await SettingModel.findOneAndDelete({ userId })
        return setting
    }
}
