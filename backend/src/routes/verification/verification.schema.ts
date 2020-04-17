import Joi from "@hapi/joi"

export default {
    send: Joi.object().keys({
        phone: Joi.string().required(),
    }),
    register: Joi.object().keys({
        phone: Joi.string().required(),
        city: Joi.string().required(),
        interests: Joi.array().required().items(Joi.string()),
        job: Joi.string().required(),
        language: Joi.string().required(),
        code: Joi.string().required(),
        points: Joi.number().required(),
    }),
    login: Joi.object().keys({
        phone: Joi.string().required(),
        code: Joi.number().required(),
    }),
}
