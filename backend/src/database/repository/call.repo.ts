/* eslint-disable no-await-in-loop */
import Call, { CallModel } from "../model/call.model"
import Conference from "../model/conference.model"

export default class CallRepo {
    public static async create(numbers: string[], conference: Conference): Promise<Call[]> {
        const now = new Date()

        const dbCalls = []
        for (let i = 0; i < numbers.length; i++) {
            const number = numbers[i]
            const dbCall = await CallModel.create(<Call>{
                phone: number,
                createdAt: conference.callStartedAt,
                completedAt: now,
                commonInterests: conference.commonInterests,
                conferenceId: conference.conferenceId,
            })
            dbCalls.push(dbCall)
        }
        return dbCalls
    }

    /**
     * Calls should only contain 2 documents
     * @param conferenceId
     */
    public static async getCallsByConferenceId(conferenceId: string): Promise<Call[]> {
        const calls = await CallModel.find({ conferenceId }).exec()
        return calls
    }

    public static async completeConference(conferenceId: string): Promise<Call[]> {
        const calls = await CallRepo.getCallsByConferenceId(conferenceId)
        const now = new Date()
        const dbCalls = []
        for (let i = 0; i < calls.length; i++) {
            const call = calls[i]
            // should only ever find 2 calls because conference id is unique
            const dbCall = await CallModel.updateOne({ conferenceId, phone: call.phone }, { completedAt: now })
            dbCalls.push(dbCall)
        }
        return dbCalls
    }

    public static async getCallsByPhone(phone: string): Promise<Call[]> {
        const calls = await CallModel.find({ phone }).sort({ createdAt: "descending" }).exec()
        return calls
    }

    public static async getLatestCall(phone: string): Promise<Call[]> {
        return CallModel.find({ phone }).sort({ completedAt: "descending" }).limit(1).exec()
    }

    public static async submitGuesses(phone: string, guesses: string[]): Promise<Call> {
        return CallModel.find({ phone })
            .sort({ completedAt: "descending" })
            .findOneAndUpdate({ phone }, { guessedInterests: guesses })
    }

    public static async rateLatestCall(phone: string, rating: number): Promise<Call> {
        return CallModel.find({ phone }).sort({ completedAt: "descending" }).findOneAndUpdate({ phone }, { rating })
    }
}
