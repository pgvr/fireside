import Joi from "@hapi/joi"

export default {
    phone: Joi.object().keys({
        phone: Joi.string().required(),
    }),
}
