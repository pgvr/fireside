import Joi from "@hapi/joi"

export default {
    setting: Joi.object().keys({
        userId: Joi.string().required(),
        days: Joi.array().required().items(Joi.number()),
        hours: Joi.array().required().items(Joi.number()),
        numPerDay: Joi.number().required(),
    }),
    userId: Joi.object().keys({
        userId: Joi.string().required(),
    }),
}
