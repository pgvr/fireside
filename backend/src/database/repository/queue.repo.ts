import QueueUser, { QueueModel } from "../model/queue.model"
import User from "../model/user.model"

export default class QueueRepo {
    public static findMatchingParticipant(user: User): Promise<QueueUser> {
        // order by date desc to have FIFO like queuing
        // match either city or interests
        return QueueModel.find({ phone: { $ne: user.phone } })
            .sort({ date: "ascending" })
            .findOneAndRemove({
                $or: [{ city: user.city }, { interests: { $in: user.interests } }],
            })
            .exec()
    }

    public static getEntryByPhone(phone: string): Promise<QueueUser> {
        return QueueModel.findOne({ phone }).exec()
    }

    public static async addToQueue(user: User, isScheduled: boolean): Promise<QueueUser> {
        const queueUser = <QueueUser>{
            phone: user.phone,
            city: user.city,
            interests: user.interests,
            job: user.job,
            language: user.language,
            isScheduled,
        }
        return QueueModel.create(queueUser)
    }

    public static removeFromQueue(user: QueueUser): Promise<QueueUser> {
        return QueueModel.findOneAndDelete({ phone: user.phone }).exec()
    }
}
