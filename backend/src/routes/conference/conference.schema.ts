import Joi from "@hapi/joi"

export interface User {
    phone: string
}

export default {
    user: Joi.object<User>().keys({
        phone: Joi.string().required(),
    }),
}
