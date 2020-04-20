import Joi from "@hapi/joi"

export default {
    // participant: Joi.object().keys({
    //     phone: Joi.string().required(),
    //     city: Joi.string().required(),
    //     interests: Joi.array().required().items(Joi.string()),
    //     job: Joi.string().required(),
    //     language: Joi.string().required(),
    // }),
    auth: Joi.object()
        .keys({
            apikey: Joi.string().required(),
        })
        .unknown(true),
    scheduledConference: Joi.object().keys({
        phone: Joi.string().required(),
    }),
}
