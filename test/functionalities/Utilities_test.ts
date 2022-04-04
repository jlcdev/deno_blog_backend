import {
    assertEquals,
    assertNotEquals
} from "https://deno.land/std/testing/asserts.ts"
import Utilities from "../../functionalities/Utilities.ts"

Deno.test("Incorrect email should be return false", ()=>{
    const utilities = new Utilities()
    const response = utilities.validateEmail('fakeemail.com')
    assertNotEquals(response, null)
    assertEquals(response, false)
})

Deno.test("Correct email should be return true", ()=>{
    const utilities = new Utilities()
    const response = utilities.validateEmail('fake@email.com')
    assertNotEquals(response, null)
    assertEquals(response, true)
})