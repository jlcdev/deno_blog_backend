import {
    assertEquals,
    assertNotEquals,
    assertThrows
} from "https://deno.land/std/testing/asserts.ts"
import UseCaseError from "../../errors/UseCaseError.ts"
import { usecaseUserRegister } from "../../usecases/UserUseCases.ts"
import UserMemoryRepository from "../../repositories/UserMemoryRepository.ts"
import Crypto from "../../functionalities/Crypto.ts"

const userMemoryRepository = new UserMemoryRepository()
const crypto = new Crypto('testingsecret', 8)
const password = crypto.hashPassword('1234567')

Deno.test("Check if exception thrown when email is null", ()=>{
    assertThrows(()=> usecaseUserRegister(null,'fakename', '1234567', userMemoryRepository, crypto), UseCaseError)
})

Deno.test("Check if exception thrown when username is null", ()=>{
    assertThrows(()=> usecaseUserRegister('fake@email.com', null, '1234567', userMemoryRepository, crypto), UseCaseError)
})

Deno.test("Check if exception thrown when password is null", ()=>{
    assertThrows(()=> usecaseUserRegister('fake@email.com', 'fakename', null, userMemoryRepository, crypto), UseCaseError)
})

Deno.test("Check if exception thrown when password is too short", ()=>{
    assertThrows(()=> usecaseUserRegister('fake@email.com', 'fakename', '12345', userMemoryRepository, crypto), UseCaseError)
})

Deno.test("Check if exception thrown when user exist", ()=>{
    userMemoryRepository.clear()
    userMemoryRepository.insertUser('fake@email.com', 'fakename', password)
    assertThrows(()=> usecaseUserRegister('fake@email.com', 'fakename', '1234567', userMemoryRepository, crypto), UseCaseError)
})

Deno.test("Check correct register case", ()=>{
    userMemoryRepository.clear()
    const user = usecaseUserRegister('fake@email.com', 'fakename', '1234567', userMemoryRepository, crypto)
    assertNotEquals(user, null)
    assertEquals(user.email,'fake@email.com')
    assertEquals(user.username, 'fakename')
    assertEquals(user.password, password)
})
