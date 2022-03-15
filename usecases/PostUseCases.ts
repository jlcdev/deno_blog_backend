import UseCaseError from "../errors/UseCaseError.ts";
import iPost from "../interfaces/iPost.ts";
import iPostRepository from "../interfaces/iPostRepository.ts";

/*
    USE CASE: As a user I want to be able to view all posts sorted by recent date
    owner_id: string
    PostRepository: iPostRepository
*/
export function usecaseGetAllPost(postRepository:iPostRepository):iPost[]
{
    return postRepository.getPosts()
}


/*
    USE CASE: As a user I want to be able to view all my posts sorted by recent date
    owner_id: string
    PostRepository: iPostRepository
*/
export function usecaseGetAllOwnerPost(owner_id:string, postRepository:iPostRepository):iPost[]
{
    return postRepository.getPostsByOwner(owner_id)
}

/*
    USE CASE: As a user I want to be able to create post
    owner_id: string
    title: string|null
    content: string|null
    PostRepository: iPostRepository
*/
export function usecaseCreateNewPost(owner_id:string, title:string, content:string, postRepository:iPostRepository):iPost
{
    const post = postRepository.insertPost(title, content, owner_id)
    if(post == null) throw new UseCaseError('Post not created')
    return post
}


/*
    USE CASE: As a user I want to be able to update a post
    owner_id: string
    post_id: string
    title: string|null
    content: string|null
    PostRepository: iPostRepository
*/
export function usecaseUpdatePost(owner_id:string, post_id:string, title:string|null, content:string|null, postRepository:iPostRepository):iPost
{
    const post = postRepository.getPostById(post_id)
    if(post == null) throw new UseCaseError('Post not found')
    if(post.owner != owner_id) throw new UseCaseError('Post owner it does not match')
    const updatedPost = postRepository.updatePost(post_id, title, content)
    if(updatedPost == null) throw new UseCaseError('Post not updated')
    return updatedPost
}

/*
    USE CASE: As a user I want to be able to delete a post
    owner_id: string
    post_id: string
    PostRepository: iPostRepository
*/
export function usecaseDeletePost(owner_id:string, post_id:string, postRepository:iPostRepository):void
{
    const post = postRepository.getPostById(post_id)
    if(post != null && post.owner === owner_id){
        postRepository.deletePost(post_id)
    }
}

/*
    USE CASE: As a user I want to be able to delete all my posts
    owner_id: string
    PostRepository: iPostRepository
*/
export function usecaseDeleteAllOwnerPosts(owner_id:string, postRepository:iPostRepository):void
{
    postRepository.deleteAllPostFromOwner(owner_id)
}