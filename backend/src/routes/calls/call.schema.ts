import Joi from "@hapi/joi"

export default {
    submit: Joi.object().keys({
        callId: Joi.string().required(),
        submittedInterests: Joi.array().required().items(Joi.string()),
    }),
    rate: Joi.object().keys({
        callId: Joi.string().required(),
        rating: Joi.number().required(),
    }),
}
