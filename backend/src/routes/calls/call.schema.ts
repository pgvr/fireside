import Joi from "@hapi/joi"

export default {
    phone: Joi.object().keys({
        phone: Joi.string().required(),
    }),
    submit: Joi.object().keys({
        phone: Joi.string().required(),
        submittedInterests: Joi.array().required().items(Joi.string()),
    }),
    rate: Joi.object().keys({
        phone: Joi.string().required(),
        rating: Joi.number().required(),
    }),
}
