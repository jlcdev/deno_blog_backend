import { Request, Response } from "../deps.ts"
import iFunCrypto from "../interfaces/iFunCrypto.ts"
import iPost from "../interfaces/iPost.ts"
import iPostRepository from "../interfaces/iPostRepository.ts"
import {
    usecaseGetAllOwnerPosts,
    usecaseGetAllPost,
    usecaseCreateNewPost,
    usecaseUpdatePost,
    usecaseDeletePost,
    usecaseDeleteAllOwnerPosts
} from "../usecases/PostUseCases.ts"

export default function mountPostController(postRepository:iPostRepository, crypto:iFunCrypto):any
{
    function extractTokenPayload(req: Request)
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
        allPosts: function(req:Request, res:Response){
            const posts: iPost[] = usecaseGetAllPost(postRepository)
            return res.status(200).send(JSON.stringify({
                status: true,
                posts
            }))
        },
        accountPosts: function(req:Request, res:Response){
            const payload = extractTokenPayload(req)
            const posts: iPost[] = usecaseGetAllOwnerPosts(payload.sub, postRepository)
            return res.status(200).send(JSON.stringify({
                status: true,
                posts
            }))
        },
        createNewPost: async function(req:Request, res:Response){
            const payload = extractTokenPayload(req)
            const body = await getBody(req)
            try {
                const post:iPost =  usecaseCreateNewPost(payload.sub, body.title, body.content, postRepository)
                return res.status(200).send(JSON.stringify({
                    status: true,
                    post
                }))
            } catch (error) {
                return res.status(400).send(JSON.stringify({
                    status: true,
                    msg: error.getMessage()
                }))
            }
        },
        updateExistingPost: async function(req:Request, res:Response)
        {
            const payload = extractTokenPayload(req)
            const body = await getBody(req)
            try {
                const post:iPost = usecaseUpdatePost(payload.sub, body.postid, body.title, body.content, postRepository)
                return res.status(200).send(JSON.stringify({
                    status: true,
                    post
                }))
            } catch (error) {
                return res.status(400).send(JSON.stringify({
                    status: true,
                    msg: error.getMessage()
                }))
            }
        },
        deletePost: function(req:Request, res:Response){
            const payload = extractTokenPayload(req)
            usecaseDeletePost(payload.sub, `${req.params.id}`, postRepository)
            return res.status(200).send(JSON.stringify({
                status: true
            }))
        },
        deleteAllOwnPost: async function(req:Request, res:Response){
            const payload = extractTokenPayload(req)
            usecaseDeleteAllOwnerPosts(payload.sub, postRepository)
            return res.status(200).send(JSON.stringify({
                status: true
            }))
        }
    }
}