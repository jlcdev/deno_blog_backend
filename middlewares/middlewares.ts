import { Request, Response } from "../deps.ts"
import iFunCrypto from "../interfaces/iFunCrypto.ts"

export default function mountMiddlewares(crypto:iFunCrypto):any
{
    return {
        checkJWT: async function(req: Request, res: Response):Promise<any>{
            const token = req.headers.get('token')
            if(token == null){
                res.status(400).send(JSON.stringify({
                    'status':false,
                    'msg':'Token required'
                }))
            }else{
                const verification = await crypto.verifyToken(token)
                if(!verification){
                    res.status(400).send(JSON.stringify({
                        'status':false,
                        'msg':'Valid token required'
                    }))
                }
            }
        }
    }
}