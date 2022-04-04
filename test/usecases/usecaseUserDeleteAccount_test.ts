import {
    assertEquals,
    assertNotEquals
} from "https://deno.land/std/testing/asserts.ts"
import PostMemoryRepository from "../../repositories/PostMemoryRepository.ts"
import UserMemoryRepository from "../../repositories/UserMemoryRepository.ts"
import { usecaseUserDeleteAccount } from "../../usecases/UserPostUseCases.ts"
import Crypto from "../../functionalities/Crypto.ts"

const postMemoryRepository = new PostMemoryRepository()
const userMemoryRepository = new UserMemoryRepository()
const crypto = new Crypto('testingsecret', 8)
const password = crypto.hashPassword('1234567')

//usecaseUserDeleteAccount(user_id:string, userRepository:iUserRepository, postRepository:iPostRepository):void

Deno.test("Attempting to delete account only affects to your posts and user", async ()=>{
    postMemoryRepository.clear()
    postMemoryRepository.insertPost('0','title','content')
    postMemoryRepository.insertPost('0','title2','content2')
    postMemoryRepository.insertPost('1','title3','content3')
    userMemoryRepository.clear()
    userMemoryRepository.insertUser('fake@email.com', 'fakename', password)
    userMemoryRepository.insertUser('fake2@email.com', 'fakename2', password)
    await usecaseUserDeleteAccount('0',userMemoryRepository, postMemoryRepository)
    const posts = postMemoryRepository.getPosts()
    const user1 = userMemoryRepository.getUserById('0')
    const user2 = userMemoryRepository.getUserById('1')
    assertNotEquals(posts, null)
    assertEquals(posts.length, 1)
    assertEquals(user1, null)
    assertNotEquals(user2, null)
})