export default interface iFunCrypto
{
    hashPassword(password:string):string
    verifyPassword(password:string, hashedPassword:string):boolean
    createToken(payload:any):string
    verifyToken(token:string|null):Promise<boolean>
    extractToken(token:string|null):any
}