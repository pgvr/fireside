import Joi from "@hapi/joi"
import { JoiAuthBearer } from "../../helpers/validator"

export default {
    refreshToken: Joi.object().keys({
        refreshToken: Joi.string().required().min(1),
    }),
    auth: Joi.object()
        .keys({
            authorization: JoiAuthBearer().required(),
        })
        .unknown(true),
}
