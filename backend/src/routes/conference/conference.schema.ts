import Joi from "@hapi/joi"
import Participant from "../../database/model/participant.model"

export default {
    participant: Joi.object<Participant>().keys({
        phone: Joi.string().required(),
        city: Joi.string().required(),
        interests: Joi.array().required().items(Joi.string()),
    }),
}
