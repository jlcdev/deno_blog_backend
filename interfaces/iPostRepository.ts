import iPost from './iPost.ts'

export default interface iPostRepository
{
    getPosts():iPost[]
    getPostById(id:string):iPost|null
    getPostsByOwner(owner:string):iPost[]
    insertPost(title:string, content:string, owner:string):iPost|null
    updatePost(id:string, title:string|null, content:string|null): iPost|null
    deletePost(id:string):void
    deleteAllPostFromOwner(owner:string):void
}