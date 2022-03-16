import iFunUtilities from "../interfaces/iFunUtilities"

export default class Utilities implements iFunUtilities
{
    private emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    validateEmail(email: string|null): boolean
    {
        if(email == null || email.length == 0) return false
        else{
            if(this.emailPattern.test(email)) return true
            else return false
        }
    }
}