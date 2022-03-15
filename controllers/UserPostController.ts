import { Request, Response } from "../deps.ts"
import iFunCrypto from "../interfaces/iFunCrypto.ts"
import iUserRepository from "../interfaces/iUserRepository.ts"
import iPostRepository from "../interfaces/iPostRepository.ts"
import {
    usecaseUserDeleteAccount
} from "../usecases/UserPostUseCases.ts"

export default function mountUserPostController(userRepository:iUserRepository, postRepository:iPostRepository, crypto:iFunCrypto):any
{
    function extractTokenPayload(req: Request):any
    {
        const token = req.headers.get('token')
        const payload = crypto.extractToken(token)
        return payload
    }

    return {
        deleteAccount: function(req:Request, res:Response){
            const payload = extractTokenPayload(req)
            usecaseUserDeleteAccount(payload.sub, userRepository, postRepository)
            return res.status(200).send(JSON.stringify({
                status: true
            }))
        }
    }
}