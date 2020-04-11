import Participant, { ParticipantModel } from "../model/participant.model"

export default class ParticipantRepo {
    public static createParticipant(participant: Participant): Promise<Participant> {
        return ParticipantModel.create(participant)
    }

    public static findMatchingParticipant(participant: Participant): Promise<Participant> {
        // order by date desc to have FIFO like queuing
        // match either city or interests
        return ParticipantModel.find()
            .sort({ date: "ascending" })
            .findOneAndRemove({
                $or: [{ city: participant.city }, { interests: { $in: participant.interests } }],
            })
            .exec()
    }
}
