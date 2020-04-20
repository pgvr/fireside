/* eslint-disable no-await-in-loop */
import Logger from "../../core/Logger"
import Call, { CallModel } from "../model/call.model"
import Conference from "../model/conference.model"

export default class CallRepo {
    public static async create(numbers: string[], conference: Conference): Promise<Call[]> {
        const now = new Date()

        const dbCalls = []
        for (let i = 0; i < numbers.length; i++) {
            const number = numbers[i]
            const calls = await CallRepo.getCallsByPhone(number)
            const firstCall = calls.length === 0
            const dbCall = await CallModel.create(<Call>{
                phone: number,
                createdAt: conference.callStartedAt,
                completedAt: now,
                commonInterests: conference.commonInterests,
                conferenceId: conference.conferenceId,
                points: 0,
                firstCall,
                rating: 0,
                isScheduled: conference.isScheduled,
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

    public static async getCallsByPhone(phone: string): Promise<Call[]> {
        const calls = await CallModel.find({ phone }).sort({ createdAt: "descending" }).exec()
        Logger.info(calls)
        return calls
    }

    public static async getCallById(id: string): Promise<Call> {
        return CallModel.findById(id).lean()
    }

    public static async getLatestCall(phone: string): Promise<Call[]> {
        return CallModel.find({ phone }).sort({ completedAt: "descending" }).limit(1).lean()
    }

    public static async submitGuesses(callId: string, guesses: string[], points: number): Promise<Call> {
        return CallModel.findByIdAndUpdate(callId, { guessedInterests: guesses, points })
    }

    public static async rateCall(callId: string, rating: number): Promise<Call> {
        return CallModel.findByIdAndUpdate(callId, { rating })
    }
}
