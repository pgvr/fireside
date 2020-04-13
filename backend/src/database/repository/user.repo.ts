import { Types } from "mongoose"
import Keystore from "../model/keystore.model"
import User, { UserModel } from "../model/user.model"
import KeystoreRepo from "./keystore.repo"

export default class UserRepo {
    // contains critical information of the user
    public static findById(id: Types.ObjectId): Promise<User> {
        return UserModel.findOne({ _id: id }).select("+phone +password").lean<User>().exec()
    }

    public static async create(
        user: User,
        accessTokenKey: string,
        refreshTokenKey: string,
    ): Promise<{ user: User; keystore: Keystore }> {
        const now = new Date()
        user.createdAt = now
        user.updatedAt = now
        const createdUser = await UserModel.create(user)
        const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey)
        return { user: createdUser.toObject(), keystore }
    }

    public static async update(
        user: User,
        accessTokenKey: string,
        refreshTokenKey: string,
    ): Promise<{ user: User; keystore: Keystore }> {
        user.updatedAt = new Date()
        await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
            .lean()
            .exec()
        const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey)
        return { user, keystore }
    }

    public static updateInfo(user: User): Promise<any> {
        user.updatedAt = new Date()
        return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
            .lean()
            .exec()
    }

    public static findMatchingParticipant(user: User): Promise<User> {
        // order by date desc to have FIFO like queuing
        // match either city or interests
        return UserModel.find()
            .sort({ date: "ascending" })
            .findOneAndRemove({
                $or: [{ city: user.city }, { interests: { $in: user.interests } }],
            })
            .exec()
    }

    public static findByPhone(phone: string): Promise<User> {
        return UserModel.findOne({ phone }).exec()
    }
}
