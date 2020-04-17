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

    public static async createAnon(user: User): Promise<User> {
        const now = new Date()
        user.createdAt = now
        user.updatedAt = now
        const dbUser = await UserModel.create(user)
        return dbUser
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

    public static findByPhone(phone: string): Promise<User> {
        return UserModel.findOne({ phone }).exec()
    }

    public static async addUsersIfDontExist(users: User[]): Promise<User[]> {
        const dbUsers = []
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            const exists = await UserRepo.findByPhone(user.phone)
            if (!exists) {
                const dbUser = await UserRepo.createAnon(user)
                dbUsers.push(dbUser)
            }
        }
        return dbUsers
    }

    public static async updatePoints(phone: string, addPoints: number): Promise<User> {
        const user = await UserModel.findOne({ phone }).exec()
        const newPoints = (user.points || 0) + addPoints
        return UserModel.findOneAndUpdate({ phone }, { points: newPoints })
    }
}
