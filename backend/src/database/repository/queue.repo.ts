import { QueueModel } from "../model/queue.model"
import User from "../model/user.model"

export default class QueueRepo {
    public static findMatchingParticipant(user: User): Promise<User> {
        // order by date desc to have FIFO like queuing
        // match either city or interests
        return QueueModel.find({ phone: { $ne: user.phone } })
            .sort({ date: "ascending" })
            .findOneAndRemove({
                $or: [{ city: user.city }, { interests: { $in: user.interests } }],
            })
            .exec()
    }

    public static getEntryByPhone(phone: string): Promise<User> {
        return QueueModel.findOne({ phone }).exec()
    }

    public static async addToQueue(user: User): Promise<User> {
        const now = new Date()
        user.createdAt = now
        user.updatedAt = now
        return QueueModel.create(user)
    }

    public static removeFromQueue(user: User): Promise<User> {
        return QueueModel.findOneAndDelete({ phone: user.phone }).exec()
    }
}
