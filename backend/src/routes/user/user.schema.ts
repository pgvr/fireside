import Joi from "@hapi/joi"

export default {
    phone: Joi.object().keys({
        phone: Joi.string().required(),
    }),
    update: Joi.object().keys({
        city: Joi.string().required(),
        interests: Joi.array().required().items(Joi.string()).min(2),
        job: Joi.string().required(),
    }),
}
