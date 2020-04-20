import Joi from "@hapi/joi"

export default {
    phone: Joi.object().keys({
        phone: Joi.string().required(),
    }),
    update: Joi.object().keys({
        user: Joi.string().required(),
    }),
}
