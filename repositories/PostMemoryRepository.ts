import iPost from "../interfaces/iPost.ts";
import iPostRepository from "../interfaces/iPostRepository.ts";

export default class PostMemoryRepository implements iPostRepository
{
    private postCount:number
    private posts:iPost[]

    constructor(){
        this.postCount = 0
        this.posts = []
    }

    private findPostIndexById(id:string):number
    {
        return this.posts.findIndex((post:iPost)=> post.id === id)
    }

    private findPostIndexByTitle(title:string):number
    {
        return this.posts.findIndex((post:iPost)=> post.title === title)
    }

    private findAllPostsIndexByOwner(owner:string)
    {
        let indexes:number[] = []
        for(let i=0;i < this.posts.length; i++){
            if(this.posts[i].owner === owner){
                indexes.push(i)
            }
        }
        indexes.sort()
        indexes.reverse()
        return indexes
    }

    clear():void
    {
        this.postCount = 0
        this.posts = []
    }

    getPosts():iPost[]
    {
        return this.posts
    }
    getPostById(id: string): iPost|null
    {
        const index = this.findPostIndexById(id)
        if(index < 0) return null
        return this.posts[index]
    }
    getPostsByOwner(owner:string):iPost[]
    {
        const indexes = this.findAllPostsIndexByOwner(owner)
        return indexes.map((index:number) => this.posts[index])
    }
    insertPost( owner:string, title:string, content:string): iPost|null
    {
        const index = this.findPostIndexByTitle(title)
        if(index >= 0) return null
        const actualDate = new Date()
        const newPost: iPost = {
            id: `${this.postCount}`,
            title,
            content,
            owner,
            createdAt: actualDate,
            updatedAt: actualDate
        }
        this.posts.push(newPost)
        this.postCount += 1
        return newPost
    }
    updatePost(id:string, title:string|null, content:string|null): iPost|null
    {
        const index = this.findPostIndexById(id)
        if(index < 0) return null
        let post = this.posts[index]
        let anyUpdate = false
        if(title){
            post.title = title
            anyUpdate = true
        }
        if(content){
            post.content = content
            anyUpdate = true
        }
        if(anyUpdate){
            post.updatedAt = new Date()
            this.posts[index] = post
        }
        return this.posts[index]
    }
    deletePost(id: string): void
    {
        const index = this.findPostIndexById(id)
        if(index >= 0) this.posts.splice(index, 1)
    }
    deleteAllPostFromOwner(owner:string): void
    {
        this.findAllPostsIndexByOwner(owner)
        .forEach((index:number)=>{
            this.posts.splice(index, 1)
        })
    }
}