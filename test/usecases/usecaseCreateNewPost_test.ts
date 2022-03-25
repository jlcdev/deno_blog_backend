import {
    assertEquals,
    assertNotEquals,
    assertThrows
} from "https://deno.land/std/testing/asserts.ts"
import PostMemoryRepository from "../../repositories/PostMemoryRepository.ts"
import UseCaseError from "../../errors/UseCaseError.ts"
import { usecaseCreateNewPost } from "../../usecases/PostUseCases.ts"

const postMemoryRepository = new PostMemoryRepository()

Deno.test("Check if exception thrown when post with same title exist", ()=>{
    postMemoryRepository.clear()
    postMemoryRepository.insertPost('0','title','content')
    assertThrows(()=> usecaseCreateNewPost('0', 'title','content', postMemoryRepository), UseCaseError)
})

Deno.test("Check correct post creation case", ()=>{
    postMemoryRepository.clear()
    const post = usecaseCreateNewPost('0', 'title','content', postMemoryRepository)
    assertNotEquals(post, null)
    assertEquals(post.title, 'title')
    assertEquals(post.content, 'content')
})
