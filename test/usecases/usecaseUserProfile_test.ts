import { assertThrows } from "https://deno.land/std/testing/asserts.ts"
import UseCaseError from "../../errors/UseCaseError.ts"
import { usecaseUserProfile } from "../../usecases/UserUseCases.ts"
import UserMemoryRepository from "../../repositories/UserMemoryRepository.ts"

const userMemoryRepository = new UserMemoryRepository()

Deno.test("Check if exception thrown when user exist", ()=>{
    userMemoryRepository.clear()
    assertThrows(()=> usecaseUserProfile('0', userMemoryRepository), UseCaseError)
})