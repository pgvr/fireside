import Joi from "@hapi/joi"

export default {
    setting: Joi.object().keys({
        days: Joi.array().required().items(Joi.number()),
        hours: Joi.array().required().items(Joi.number()),
        numPerDay: Joi.number().required(),
    }),
}
