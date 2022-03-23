import iFunCrypto from '../interfaces/iFunCrypto.ts'
import { Hash } from '../deps.ts'
import { Bcrypt } from '../deps.ts'

export default class Crypto implements iFunCrypto
{
    private secret:string
    private salt:any

    constructor(secret:string, salt:number = 8){
        this.secret = secret
        this.salt = Bcrypt.genSaltSync(salt)
    }
    private prepare_b64(data:any):string
    {
        return btoa(JSON.stringify(data))
    }
    private restore_object(data: string):any
    {
        return JSON.parse(atob(data))
    }

    hashPassword(password: string):string
    {
        const hashedPassword = Bcrypt.hashSync(password, this.salt)
        return hashedPassword
    }
    verifyPassword(password: string, hashedPassword: string):boolean
    {
        const result = Bcrypt.compareSync(password, hashedPassword)
        return result
    }
    createToken(payload: any):string
    {
        const header_b64 = this.prepare_b64({alg:'HS256', typ: 'JWT'})
        const payload_b64 = this.prepare_b64(payload)
        const token_partial =`${header_b64}.${payload_b64}`;
        const verification = (new Hash.HmacSha256(this.secret)).update(token_partial).toString()
        const verification_b64 = this.prepare_b64(verification)
        return `${token_partial}.${verification_b64}`
    }
    async verifyToken(token: string|null):Promise<boolean>
    {
        if(token == null) return false
        const token_parts = token.split(' ')[1].split('.')
        if(token_parts.length !== 3) return false
        const verification = (new Hash.HmacSha256(this.secret)).update(`${token_parts[0]}.${token_parts[1]}`).toString();
        const verification_b64 = this.prepare_b64(verification)

        if(verification_b64 !== token_parts[2]) return false
        return true
    }
    extractToken(token: string|null):any
    {
        if(token == null) return {}
        const token_parts = token.split(' ')[1].split('.')
        return this.restore_object(token_parts[1])
    }
}