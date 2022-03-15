import iFunCrypto from '../interfaces/iFunCrypto.ts'
import iFunCryptoInfo from '../interfaces/iFunCryptoInfo.ts'
import { Hash } from '../deps.ts'
import { Bcrypt } from '../deps.ts'

export default class Crypto implements iFunCrypto
{
    private secret:string
    private passwordSalt:number
    private cryptoInfo:iFunCryptoInfo

    constructor(secret:string, passwordSalt:number = 8, cryptoInfo:iFunCryptoInfo){
        this.secret = secret
        this.passwordSalt = passwordSalt
        this.cryptoInfo = cryptoInfo
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
        const salt = Bcrypt.genSaltSync(this.passwordSalt)
        const hashedPassword = Bcrypt.hashSync(password, salt)
        return hashedPassword
    }
    verifyPassword(password: string, hashedPassword: string):boolean
    {
        const result = Bcrypt.compareSync(password, hashedPassword)
        return result
    }
    async createToken(payload: any):Promise<string>
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
        const payload = this.restore_object(token_parts[1])
        if(this.cryptoInfo.checkUserExist(payload.sub)) return true
        else return false
    }
    extractToken(token: string|null):any
    {
        if(token == null) return {}
        const token_parts = token.split(' ')[1].split('.')
        return this.restore_object(token_parts[1])
    }
}