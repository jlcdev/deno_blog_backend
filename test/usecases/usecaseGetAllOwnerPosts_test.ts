import {
    assertEquals,
    assertNotEquals
} from "https://deno.land/std/testing/asserts.ts"
import PostMemoryRepository from "../../repositories/PostMemoryRepository.ts"
import { usecaseGetAllOwnerPosts } from "../../usecases/PostUseCases.ts"

const postMemoryRepository = new PostMemoryRepository()

Deno.test("Check when the database is empty if the posts list is empty", ()=>{
    postMemoryRepository.clear()
    const posts = usecaseGetAllOwnerPosts('0', postMemoryRepository)
    assertNotEquals(posts, null)
    assertEquals(posts.length, 0)
})

Deno.test("Check when exist posts then posts list is not empty", ()=>{
    postMemoryRepository.clear()
    postMemoryRepository.insertPost('faketitle', 'fakecontent', '0')
    const posts = usecaseGetAllOwnerPosts('0', postMemoryRepository)
    assertNotEquals(posts, null)
    assertNotEquals(posts.length, 0)
    assertEquals(posts[0].title, 'faketitle')
})