import iPostRepository from "../interfaces/iPostRepository.ts"
import iUserRepository from "../interfaces/iUserRepository.ts"
import { usecaseDeleteAllOwnerPosts } from "./PostUseCases.ts"

/*
    USE CASE: As a user I want to be able to delete my account and all my posts
    owner_id: string
    UserRepository: iUserRepository
    PostRepository: iPostRepository
*/
export function usecaseUserDeleteAccount(user_id:string, userRepository:iUserRepository, postRepository:iPostRepository):void
{
    usecaseDeleteAllOwnerPosts(user_id,postRepository)
    userRepository.deleteUser(user_id)
}