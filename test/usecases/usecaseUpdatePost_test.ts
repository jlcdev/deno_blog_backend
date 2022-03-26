import {
    assertEquals,
    assertNotEquals,
    assertThrows
} from "https://deno.land/std/testing/asserts.ts"
import PostMemoryRepository from "../../repositories/PostMemoryRepository.ts"
import UseCaseError from "../../errors/UseCaseError.ts"
import { usecaseUpdatePost } from "../../usecases/PostUseCases.ts"

const postMemoryRepository = new PostMemoryRepository()

Deno.test("Check if exception thrown when post to update not exist", ()=>{
    postMemoryRepository.clear()
    assertThrows(()=> usecaseUpdatePost('0','0', 'title','content', postMemoryRepository), UseCaseError)
})

Deno.test("Check if exception thrown when post to update exist but with incorrect owner", ()=>{
    postMemoryRepository.clear()
    postMemoryRepository.insertPost('0','title','content')
    assertThrows(()=> usecaseUpdatePost('1','0', 'title2','content2', postMemoryRepository), UseCaseError)
})

Deno.test("Check correct post update case", ()=>{
    postMemoryRepository.clear()
    postMemoryRepository.insertPost('0','title','content')
    const post = usecaseUpdatePost('0','0','title2','content2', postMemoryRepository)
    assertNotEquals(post, null)
    assertEquals(post.title, 'title2')
    assertEquals(post.content, 'content2')
})
