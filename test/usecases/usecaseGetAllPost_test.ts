import {
    assertEquals,
    assertNotEquals
} from "https://deno.land/std/testing/asserts.ts"
import PostMemoryRepository from "../../repositories/PostMemoryRepository.ts"
import { usecaseGetAllPost } from "../../usecases/PostUseCases.ts"

const postMemoryRepository = new PostMemoryRepository()

Deno.test("Check when the database is empty if the posts list is empty", ()=>{
    postMemoryRepository.clear()
    const posts = usecaseGetAllPost(postMemoryRepository)
    assertNotEquals(posts, null)
    assertEquals(posts.length, 0)
})

Deno.test("Check when exist posts then posts list is not empty", ()=>{
    postMemoryRepository.clear()
    postMemoryRepository.insertPost('faketitle', 'fakecontent', '0')
    const posts = usecaseGetAllPost(postMemoryRepository)
    assertNotEquals(posts, null)
    assertNotEquals(posts.length, 0)
    assertEquals(posts[0].title, 'faketitle')
})