import UseCaseError from "../errors/UseCaseError.ts"
import iFunCrypto from "../interfaces/iFunCrypto.ts"
import iFunUtilities from "../interfaces/iFunUtilities.ts"
import iUser from "../interfaces/iUser.ts"
import iUserRepository from "../interfaces/iUserRepository.ts"


/*
    USE CASE: As a user I want to get my user profile
    email: string
    password: string *not encrypted
    UserRepository: iUserRepository
    FunCripto: iFunCrypto
*/
export function usecaseUserProfile(id:string, userRepository:iUserRepository):iUser
{
    const user:iUser|null = userRepository.getUserById(id)
    if(user == null) throw new UseCaseError('User not found')
    return user
}

/*
    USE CASE: As a user I want to be able to login
    email: string
    password: string *not encrypted
    userRepository: iUserRepository
    cripto: iFunCrypto
*/
export function usecaseUserLogin(email:string|null, password:string|null, userRepository:iUserRepository, crypto:iFunCrypto, utilities:iFunUtilities):string
{
    if(!utilities.validateEmail(email)) throw new UseCaseError('Valid email required')
    if(!utilities.validatePassword(password)) throw new UseCaseError('Valid email required')
    const user = userRepository.getUserByEmail(email!)
    if(user == null) throw new UseCaseError('User not found')
    if(!crypto.verifyPassword(password!, user.password)) throw new UseCaseError('Incorrect password')
    return crypto.createToken({ username: user.username, sub: user.id })
}

/*
    USE CASE: As a user I want to be able to register
    email: string
    username: string
    password: string *not encrypted
    UserRepository: iUserRepository
    FunCripto: iFunCrypto
*/
export function usecaseUserRegister(email:string|null, username:string|null, password:string|null, userRepository:iUserRepository, crypto:iFunCrypto, utilities:iFunUtilities):iUser
{
    if(email == null || username == null || password == null) throw new UseCaseError('Register requires email, username and password')
    if(password != null && password.length < 6) throw new UseCaseError('Password is too short')
    const hashedPassword = crypto.hashPassword(password)
    const registeredUser = userRepository.insertUser(email, username, hashedPassword)
    if(registeredUser == null) throw new UseCaseError('User already exist')
    return registeredUser
}

/*
    USE CASE: As a user I want to be able update my profile
    id: string
    username: string|null
    email: string|null
    password: string|null
    UserRepository: iUserRepository
*/
export function usecaseUserUpdateProfile(id:string, email:string|null, username:string|null, password:string|null, userRepository:iUserRepository, crypto: iFunCrypto, utilities:iFunUtilities):iUser
{
    const tokenUser = userRepository.getUserById(id)
    if(tokenUser == null) throw new UseCaseError("User to update not found")
    if(email != null && !utilities.validateEmail(email)) throw new UseCaseError("Email isn't valid")
    if(password != null){
        if(password.length < 6) throw new UseCaseError('Password is too short')
        password = crypto.hashPassword(password)
    }
    const user = userRepository.updateUser(id, email, username, password)
    if(user == null) throw new UseCaseError('User not updated')
    return user
}