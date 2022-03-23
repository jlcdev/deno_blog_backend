import {
    assertEquals,
    assertNotEquals,
    assertThrows
} from "https://deno.land/std/testing/asserts.ts"
import UseCaseError from "../../errors/UseCaseError.ts"
import { usecaseUserUpdateProfile } from "../../usecases/UserUseCases.ts"
import UserMemoryRepository from "../../repositories/UserMemoryRepository.ts"
import Crypto from "../../functionalities/Crypto.ts"
import Utilities from "../../functionalities/Utilities.ts"

const userMemoryRepository = new UserMemoryRepository()
const utilities = new Utilities()
const crypto = new Crypto('testingsecret', 8)
const password = crypto.hashPassword('1234567')

Deno.test("Check if exception thrown when user not found", ()=>{
    userMemoryRepository.clear()
    //userMemoryRepository.insertUser('fake@email.com', 'fakename', password)
    assertThrows(()=> usecaseUserUpdateProfile('0','fake@email.com', 'fakename', '1234567', userMemoryRepository, crypto, utilities), UseCaseError)
})

Deno.test("Check if exception thrown when email isn't valid", ()=>{
    userMemoryRepository.clear()
    userMemoryRepository.insertUser('fake@email.com', 'fakename', password)
    assertThrows(()=> usecaseUserUpdateProfile('0','fakeemail.com', 'fakename', '1234567', userMemoryRepository, crypto, utilities), UseCaseError)
})

Deno.test("Check if exception thrown when password is too short", ()=>{
    userMemoryRepository.clear()
    userMemoryRepository.insertUser('fake@email.com', 'fakename', password)
    assertThrows(()=> usecaseUserUpdateProfile('0','fake@email.com', 'fakename', '12345', userMemoryRepository, crypto, utilities), UseCaseError)
})

Deno.test("Check correct register case", ()=>{
    userMemoryRepository.clear()
    userMemoryRepository.insertUser('fake2@email.com', 'fakename2', password)
    const user = usecaseUserUpdateProfile('0','fake@email.com', 'fakename', '1234567', userMemoryRepository, crypto, utilities)
    assertNotEquals(user, null)
    assertEquals(user.email,'fake@email.com')
    assertEquals(user.username, 'fakename')
    assertEquals(user.password, password)
})
