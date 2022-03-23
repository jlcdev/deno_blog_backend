import {
    assertEquals,
    assertThrows
} from "https://deno.land/std/testing/asserts.ts"
import UseCaseError from "../errors/UseCaseError.ts"
import { usecaseUserLogin } from "../usecases/UserUseCases.ts"
import UserMemoryRepository from "../repositories/UserMemoryRepository.ts"
import Crypto from "../functionalities/Crypto.ts"
import Utilities from "../functionalities/Utilities.ts"

const userMemoryRepository = new UserMemoryRepository()
const utilities = new Utilities()
const crypto = new Crypto('testingsecret', 8)
const password = crypto.hashPassword('1234567')

Deno.test("Check if exception thrown when email is null", ()=>{
    assertThrows(()=> usecaseUserLogin(null, "1234567", userMemoryRepository, crypto, utilities), UseCaseError)
})

Deno.test("Check if exception thrown when password is null", ()=>{
    assertThrows(()=> usecaseUserLogin('fake@email.com', null, userMemoryRepository, crypto, utilities), UseCaseError)
})

Deno.test("Check if exception thrown when password is too short", ()=>{
    assertThrows(()=> usecaseUserLogin('fake@email.com', "12345", userMemoryRepository, crypto, utilities), UseCaseError)
})

Deno.test("Check if exception thrown when email isn't valid", ()=>{
    assertThrows(()=> usecaseUserLogin('fakeemail.com', "1234567", userMemoryRepository, crypto, utilities), UseCaseError)
})

Deno.test("Check if exception thrown when user not found", ()=>{
    userMemoryRepository.clear()
    assertThrows(()=> usecaseUserLogin('fake@email.com', "1234567", userMemoryRepository, crypto, utilities), UseCaseError)
})

Deno.test("Check if exception thrown when user password isn't correct", ()=>{
    userMemoryRepository.clear()
    userMemoryRepository.insertUser('fake@email.com', 'fakename', 'incorrectPassword')
    assertThrows(()=> usecaseUserLogin('fake@email.com', "1234567", userMemoryRepository, crypto, utilities), UseCaseError)
})

Deno.test("Check correct login case", async ()=>{
    userMemoryRepository.clear()
    userMemoryRepository.insertUser('fake@email.com', 'fakename', password)
    const jwt = await usecaseUserLogin('fake@email.com', "1234567", userMemoryRepository, crypto, utilities)
    assertEquals(jwt.split('.').length,3)
})