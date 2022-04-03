import {
    assertEquals,
    assertNotEquals
} from "https://deno.land/std/testing/asserts.ts"
import PostMemoryRepository from "../../repositories/PostMemoryRepository.ts"
import { usecaseDeletePost } from "../../usecases/PostUseCases.ts"

const postMemoryRepository = new PostMemoryRepository()

Deno.test("Attempting to delete a post that isn't your own should have no effect", async ()=>{
    postMemoryRepository.clear()
    postMemoryRepository.insertPost('0','title','content')
    postMemoryRepository.insertPost('1','title2','content2')
    await usecaseDeletePost('1','0', postMemoryRepository)
    const posts = postMemoryRepository.getPosts()
    assertNotEquals(posts, null)
    assertEquals(posts.length, 2)
})

Deno.test("When deleting a post as owner should be removed from the system", async ()=>{
    postMemoryRepository.clear()
    postMemoryRepository.insertPost('0','title','content')
    postMemoryRepository.insertPost('1','title2','content2')
    await usecaseDeletePost('0','0', postMemoryRepository)
    const posts = postMemoryRepository.getPosts()
    assertNotEquals(posts, null)
    assertEquals(posts.length, 1)
})