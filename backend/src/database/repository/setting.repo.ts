import Setting, { SettingModel } from "../model/setting.model"

export default class SettingRepo {
    public static findByUserId(userId: string): Promise<Setting> {
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
        await SettingModel.updateOne({ userId: setting.userId }, { $set: { ...setting } })
            .lean()
            .exec()
        return setting
    }

    public static async delete(userId: string): Promise<Setting> {
        const setting = SettingModel.findOneAndDelete({ userId })
        return setting
    }
}
