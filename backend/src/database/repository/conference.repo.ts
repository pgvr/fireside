/* eslint-disable no-await-in-loop */
import { Types } from "mongoose"
import { ParticipantInstance } from "twilio/lib/rest/api/v2010/account/conference/participant"
import { getCall } from "../../helpers/conference.helper"
import db from "../firebase"
import Conference, { ConferenceModel } from "../model/conference.model"
import QueueUser from "../model/queue.model"
import User from "../model/user.model"
import UserRepo from "./user.repo"

export default class ConferenceRepo {
    public static async create(
        userOne: { user: QueueUser; isScheduled: boolean },
        userTwo: { user: User; isScheduled: boolean },
    ): Promise<Conference> {
        // make sure users dont already have conf, remove if so
        await ConferenceModel.findOneAndDelete({
            $or: [{ userOnePhone: userOne.user.phone }, { userTwoPhone: userOne.user.phone }],
        }).exec()
        await ConferenceModel.findOneAndDelete({
            $or: [{ userOnePhone: userTwo.user.phone }, { userTwoPhone: userTwo.user.phone }],
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

        // userOne is from the Queue Collection, but we need id from users collection
        const userOneFromUsers = await UserRepo.findByPhone(userOne.user.phone)
        // create 2 entries, one for each user id in conferences
        await Promise.all([
            db.collection("conferences").doc(userOneFromUsers._id).create({ call: true }),
            db.collection("conferences").doc(userTwo.user._id).create({ call: true }),
        ])
        const now = new Date()
        return ConferenceModel.create(<Conference>{
            userOnePhone: userOne.user.phone,
            userOneIsScheduled: userOne.isScheduled,
            userTwoPhone: userTwo.user.phone,
            userTwoIsScheduled: userTwo.isScheduled,
            commonInterests,
            createdAt: now,
        })
    }

    public static async updateStart(participants: ParticipantInstance[], conferenceId: string): Promise<Conference> {
        const calls = []
        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i]
            const call = await getCall(participant.callSid)
            calls.push(call)
        }
        const now = new Date()
        const conference = ConferenceModel.findOneAndUpdate(
            {
                $or: [{ userOnePhone: calls[0].to }, { userTwoPhone: calls[0].to }],
            },
            { callStartedAt: now, conferenceId },
        )
        return conference
    }

    public static async removeConference(conferenceId: string): Promise<Conference> {
        // remove both from firebase
        const conference = await ConferenceModel.findOneAndDelete({
            conferenceId,
        })
        const userOne = await UserRepo.findByPhone(conference.userOnePhone)
        const userTwo = await UserRepo.findByPhone(conference.userTwoPhone)
        await Promise.all([
            db.collection("conferences").doc(userOne._id).delete(),
            db.collection("conferences").doc(userTwo._id).delete(),
        ])
        return conference
    }

    public static async removeConferenceById(id: Types.ObjectId): Promise<Conference> {
        return ConferenceModel.findByIdAndDelete(id)
    }

    public static async getConferenceForPhone(phone: string): Promise<Conference> {
        return ConferenceModel.findOne({
            $or: [{ userOnePhone: phone }, { userTwoPhone: phone }],
        }).exec()
    }
}
