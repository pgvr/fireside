import Joi from "@hapi/joi"
import { JoiAuthBearer } from "../../helpers/validator"

export default {
    userCredential: Joi.object().keys({
        phone: Joi.string().required(),
        password: Joi.string().required().min(6),
    }),
    refreshToken: Joi.object().keys({
        refreshToken: Joi.string().required().min(1),
    }),
    auth: Joi.object()
        .keys({
            authorization: JoiAuthBearer().required(),
        })
        .unknown(true),
    signup: Joi.object().keys({
        phone: Joi.string().required(),
        city: Joi.string().required(),
        interests: Joi.array().required().items(Joi.string()),
        job: Joi.string().required(),
        language: Joi.string().required(),
        password: Joi.string().required().min(6),
    }),
}
