import { Types } from "mongoose"
import Keystore, { KeystoreModel } from "../model/keystore.model"
import User from "../model/user.model"

export default class KeystoreRepo {
    public static findforKey(client: User, key: string): Promise<Keystore> {
        return KeystoreModel.findOne({ client, primaryKey: key, status: true }).exec()
    }

    public static remove(id: Types.ObjectId): Promise<Keystore> {
        return KeystoreModel.findByIdAndRemove(id).lean<Keystore>().exec()
    }

    public static find(client: User, primaryKey: string, secondaryKey: string): Promise<Keystore> {
        return KeystoreModel.findOne({ client, primaryKey, secondaryKey }).lean<Keystore>().exec()
    }

    public static async create(client: User, primaryKey: string, secondaryKey: string): Promise<Keystore> {
        const now = new Date()
        const keystore = await KeystoreModel.create(<Keystore>{
            client,
            primaryKey,
            secondaryKey,
            createdAt: now,
            updatedAt: now,
        })
        return keystore.toObject()
    }
}
