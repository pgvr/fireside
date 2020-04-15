/* eslint-disable no-await-in-loop */
import { ParticipantInstance } from "twilio/lib/rest/api/v2010/account/conference/participant"
import Logger from "../../core/Logger"
import { getCall } from "../../helpers/conference.helper"
import Call, { CallModel } from "../model/call.model"
import User from "../model/user.model"
import UserRepo from "./user.repo"

export default class CallRepo {
    public static async create(participants: ParticipantInstance[], conferenceId: string): Promise<Call[]> {
        const now = new Date()
        const calls = []
        const users: User[] = []
        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i]
            const call = await getCall(participant.callSid)
            calls.push(call)
            const user = await UserRepo.findByPhone(call.to)
            users.push(user)
        }

        let commonInterests: string[] = []
        // add city if it matches
        if (users[0].city === users[1].city) {
            commonInterests.push(users[0].city)
        }
        // check all matches and add them
        const intersection = users[0].interests.filter((x) => users[1].interests.includes(x))
        if (intersection.length > 0) {
            commonInterests = [...commonInterests, ...intersection]
        }

        Logger.info("Common Interests:")
        Logger.info(commonInterests)

        const dbCalls = []
        for (let i = 0; i < calls.length; i++) {
            const call = calls[i]
            const dbCall = await CallModel.create(<Call>{
                callId: call.sid,
                phone: call.to,
                createdAt: now,
                commonInterests,
                conferenceId,
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
}
