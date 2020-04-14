import Joi from "@hapi/joi"

export default {
    send: Joi.object().keys({
        phone: Joi.string().required(),
    }),
    verify: Joi.object().keys({
        phone: Joi.string().required(),
        code: Joi.number().required(),
    }),
}
