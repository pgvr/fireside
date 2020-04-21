/* eslint-disable no-await-in-loop */
import { ParticipantInstance } from "twilio/lib/rest/api/v2010/account/conference/participant"
import Logger from "../../core/Logger"
import { getCall } from "../../helpers/conference.helper"
import Conference, { ConferenceModel } from "../model/conference.model"
import QueueUser from "../model/queue.model"
import User from "../model/user.model"

export default class ConferenceRepo {
    public static async create(
        userOne: { user: QueueUser; isScheduled: boolean },
        userTwo: { user: User; isScheduled: boolean },
    ) {
        // make sure users dont already have conf, remove if so
        await ConferenceModel.findOneAndDelete({
            $or: [{ "userOne.phone": userOne.user.phone }, { "userTwo.phone": userOne.user.phone }],
        }).exec()
        await ConferenceModel.findOneAndDelete({
            $or: [{ "userOne.phone": userTwo.user.phone }, { "userTwo.phone": userTwo.user.phone }],
        }).exec()

        let commonInterests: string[] = []
        // add city if it matches
        if (userOne.user.city === userTwo.user.city) {
            commonInterests.push(userTwo.user.city)
        }
        // check all matches and add them
        const intersection = userOne.user.interests.filter((x) => userTwo.user.interests.includes(x))
        if (intersection.length > 0) {
            commonInterests = [...commonInterests, ...intersection]
        }

        Logger.info("Common Interests:")
        Logger.info(commonInterests)

        const now = new Date()

        return ConferenceModel.create(<Conference>{
            userOne: {
                phone: userOne.user.phone,
                isScheduled: userOne.isScheduled,
            },
            userTwo: {
                phone: userTwo.user.phone,
                isScheduled: userTwo.isScheduled,
            },
            commonInterests,
            createdAt: now,
        })
    }

    public static async updateStart(participants: ParticipantInstance[], conferenceId: string) {
        const calls = []
        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i]
            const call = await getCall(participant.callSid)
            calls.push(call)
        }
        const now = new Date()
        const conference = ConferenceModel.findOneAndUpdate(
            {
                $or: [{ phoneOne: calls[0].to }, { phoneTwo: calls[0].to }],
            },
            { callStartedAt: now, conferenceId },
        )
        return conference
    }

    public static async removeConference(conferenceId: string) {
        const conference = ConferenceModel.findOneAndDelete({
            conferenceId,
        })
        return conference
    }

    public static async getConferenceForPhone(phone: string) {
        return ConferenceModel.findOne({
            $or: [{ phoneOne: phone }, { phoneTwo: phone }],
        }).exec()
    }
}
