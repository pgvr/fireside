/* eslint-disable no-await-in-loop */
import Call, { CallModel } from "../model/call.model"
import Conference from "../model/conference.model"

export default class CallRepo {
    public static async create(conference: Conference): Promise<Call[]> {
        const now = new Date()
        const dbCalls = []

        const numberOne = conference.userOnePhone
        const callsOne = await CallRepo.getCallsByPhone(numberOne)
        const firstCallOne = callsOne.length === 0
        const dbCallOne = await CallModel.create(<Call>{
            phone: numberOne,
            createdAt: conference.callStartedAt,
            completedAt: now,
            commonInterests: conference.commonInterests,
            conferenceId: conference.conferenceId,
            points: 0,
            firstCall: firstCallOne,
            rating: 0,
            isScheduled: conference.userOneIsScheduled,
        })
        dbCalls.push(dbCallOne)

        const numberTwo = conference.userTwoPhone
        const callsTwo = await CallRepo.getCallsByPhone(numberTwo)
        const firstCallTwo = callsTwo.length === 0
        const dbCallTwo = await CallModel.create(<Call>{
            phone: numberTwo,
            createdAt: conference.callStartedAt,
            completedAt: now,
            commonInterests: conference.commonInterests,
            conferenceId: conference.conferenceId,
            points: 0,
            firstCall: firstCallTwo,
            rating: 0,
            isScheduled: conference.userTwoIsScheduled,
        })
        dbCalls.push(dbCallTwo)

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
