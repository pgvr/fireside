/* eslint-disable no-await-in-loop */
import { ParticipantInstance } from "twilio/lib/rest/api/v2010/account/conference/participant"
import Logger from "../../core/Logger"
import { getCall } from "../../helpers/conference.helper"
import Conference, { ConferenceModel } from "../model/conference.model"
import User from "../model/user.model"

export default class ConferenceRepo {
    public static async create(userOne: User, userTwo: User) {
        // make sure users dont already have conf, remove if so
        await ConferenceModel.findOneAndDelete({
            $or: [{ phoneOne: userOne.phone }, { phoneTwo: userOne.phone }],
        }).exec()
        await ConferenceModel.findOneAndDelete({
            $or: [{ phoneOne: userTwo.phone }, { phoneTwo: userTwo.phone }],
        }).exec()

        let commonInterests: string[] = []
        // add city if it matches
        if (userOne.city === userTwo.city) {
            commonInterests.push(userTwo.city)
        }
        // check all matches and add them
        const intersection = userOne.interests.filter((x) => userTwo.interests.includes(x))
        if (intersection.length > 0) {
            commonInterests = [...commonInterests, ...intersection]
        }

        Logger.info("Common Interests:")
        Logger.info(commonInterests)

        const now = new Date()

        return ConferenceModel.create(<Conference>{
            phoneOne: userOne.phone,
            phoneTwo: userTwo.phone,
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
