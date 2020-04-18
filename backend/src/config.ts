// Mapper for environment variables
export const environment = process.env.NODE_ENV
export const port = process.env.PORT

export const db = {
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PWD,
}

const privateKeyBuffer = Buffer.from(process.env.PRIVATE_KEY, "base64")
export const PRIVATE_KEY = privateKeyBuffer.toString("ascii")
const publicKeyBuffer = Buffer.from(process.env.PUBLIC_KEY, "base64")
export const PUBLIC_KEY = publicKeyBuffer.toString("ascii")
export const corsUrl = process.env.CORS_URL
export const baseUrl = process.env.NODE_ENV === "production" ? process.env.BASE_URL_PROD : process.env.BASE_URL_DEV

export const tokenInfo = {
    accessTokenValidityDays: Number(process.env.ACCESS_TOKEN_VALIDITY_DAYS),
    refreshTokenValidityDays: Number(process.env.REFRESH_TOKEN_VALIDITY_DAYS),
    issuer: process.env.TOKEN_ISSUER,
    audience: process.env.TOKEN_AUDIENCE,
}

export const logDirectory = process.env.LOG_DIR
