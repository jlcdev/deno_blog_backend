import iFunUtilities from "../interfaces/iFunUtilities.ts"

export default class Utilities implements iFunUtilities
{
    private emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    validateEmail(email: string|null): boolean
    {
        if(email == null || email.length < 5) return false
        if(this.emailPattern.test(email)) return true
        return false
    }

    validatePassword(password: string|null): boolean
    {
        if(password == null || password.length < 6) return false
        return true
    }
}