import iUser from "../interfaces/iUser.ts";
import iUserRepository from "../interfaces/iUserRepository.ts";

export default class UserMemoryRepository implements iUserRepository
{
    private userCount:number
    private users:iUser[]

    constructor(){
        this.userCount = 0
        this.users = []
    }

    private findUserIndexById(id:string):number
    {
        return this.users.findIndex((user:iUser)=> user.id === id)
    }

    private findUserIndexByEmail(email:string):number
    {
        return this.users.findIndex((user:iUser)=> user.email === email)
    }

    clear():void
    {
        this.userCount = 0
        this.users = []
    }
    checkUserExist(user_id:string):boolean
    {
        const index = this.findUserIndexById(user_id)
        if(index < 0) return false
        return true
    }
    getUserById(id: string): iUser|null
    {
        const index = this.findUserIndexById(id)
        if(index < 0) return null
        return this.users[index]
    }
    getUserByEmail(email: string):iUser|null
    {
        const index = this.findUserIndexByEmail(email)
        if(index < 0) return null
        return this.users[index]
    }
    insertUser(email:string, username:string, password:string): iUser|null
    {
        const index = this.findUserIndexByEmail(email)
        if(index >= 0) return null

        const actualDate = new Date()
        const newUser: iUser = {
            id: `${this.userCount}`,
            email,
            username,
            password,
            createdAt: actualDate,
            updatedAt: actualDate
        }
        this.users.push(newUser)
        this.userCount += 1
        return newUser
    }
    updateUser(id: string, email:string|null, username:string|null, password:string|null): iUser|null
    {
        const index = this.findUserIndexById(id)
        if(index < 0) return null
        let user = this.users[index]
        if(username) user.username = username
        if(password) user.password = password
        if(email) user.email = email
        user.updatedAt = new Date()
        this.users[index] = user
        return user
    }
    deleteUser(id: string): void
    {
        const index = this.findUserIndexById(id)
        if(index >= 0) this.users.splice(index, 1)
    }
}