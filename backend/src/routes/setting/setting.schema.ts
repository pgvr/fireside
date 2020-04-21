import Joi from "@hapi/joi"

export default {
    setting: Joi.object().keys({
        days: Joi.array().required().items(Joi.number().min(0).max(6)),
        hours: Joi.array().required().items(Joi.number().min(0).max(23)),
        numPerDay: Joi.number().required().min(1),
    }),
}
