export default class UseCaseError extends Error
{
    constructor(msg:string)
    {
        super(msg)
    }
    getMessage():string
    {
        return this.message
    }
}