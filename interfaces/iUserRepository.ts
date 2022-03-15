import iUser from './iUser.ts'

export default interface iUserRepository
{
    getUserById(id:string):iUser|null
    getUserByEmail(email:string):iUser|null
    insertUser(email:string, username:string, password:string):iUser|null
    updateUser(id:string, email:string|null, username:string|null, password:string|null):iUser|null
    deleteUser(id:string):void
}