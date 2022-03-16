import { Request, Response } from "../deps.ts"
import iFunCrypto from "../interfaces/iFunCrypto.ts"
import iFunUtilities from "../interfaces/iFunUtilities.ts"
import iUser from "../interfaces/iUser.ts"
import iUserRepository from "../interfaces/iUserRepository.ts"
import {
    usecaseUserProfile,
    usecaseUserLogin,
    usecaseUserRegister,
    usecaseUserUpdateProfile
} from "../usecases/UserUseCases.ts"

export default function mountUserController(userRepository:iUserRepository, crypto:iFunCrypto, utilities: iFunUtilities):any
{
    function extractTokenPayload(req: Request):any
    {
        const token = req.headers.get('token')
        const payload = crypto.extractToken(token)
        return payload
    }

    async function getBody(req:Request):Promise<any>
    {
        const body = await req.body().value
        return body
    }

    return {
        userProfile: function(req:Request, res:Response){
            const payload = extractTokenPayload(req)
            try {
                const user: iUser = usecaseUserProfile(payload.sub, userRepository)
                return res.status(200).send(JSON.stringify({
                    status: true,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }))
            } catch (error) {
                return res.status(404).send(JSON.stringify({
                    status:false,
                    'msg': error.getMessage()
                }))
            }
        },
        login: async function(req:Request, res:Response){
            const body = await getBody(req)
            try {
                const token:string = await usecaseUserLogin(body.email, body.password, userRepository, crypto, utilities)
                return res.status(200).send(JSON.stringify({
                    status: true,
                    token
                }))
            } catch (error) {
                return res.status(400).send(JSON.stringify({
                    status:false,
                    'msg': error.getMessage()
                }))
            }
        },
        register: async function(req:Request, res:Response){
            const body = await getBody(req)
            try {
                const user:iUser = usecaseUserRegister(body.email, body.username, body.password, userRepository, crypto)
                return res.status(200).send(JSON.stringify({
                    status: true
                }))
            } catch (error) {
                return res.status(400).send(JSON.stringify({
                    status:false,
                    'msg': error.getMessage()
                }))
            }
        },
        updateProfile: async function(req:Request, res:Response){
            const payload = extractTokenPayload(req)
            const body = await getBody(req)
            try {
                const user:iUser = usecaseUserUpdateProfile(payload.sub, body.email, body.username, body.password, userRepository)
                return res.status(200).send(JSON.stringify({
                    status: true,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }))
            } catch (error) {
                return res.status(400).send(JSON.stringify({
                    status:false,
                    'msg': error.getMessage()
                }))
            }
        }
    }
}
