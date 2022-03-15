import { Router } from "./deps.ts"
import mountUserController from "./controllers/UserController.ts"
import mountUserPostController from "./controllers/UserPostController.ts"
import mountPostController from "./controllers/PostController.ts"
import mountMiddlewares from "./middlewares/middlewares.ts"
import UserMemoryRepository from "./repositories/UserMemoryRepository.ts"
import PostMemoryRepository from "./repositories/PostMemoryRepository.ts"
import Crypto from "./functionalities/Crypto.ts"

const env = Deno.env.toObject()
const TOKEN_SECRET = env.TOKEN_SECRET || 'supersecret'
const HASH_SALT = parseInt(env.HASH_SALT) || 8

//Dependencies
const userRepository = new UserMemoryRepository()
const postRepository = new PostMemoryRepository()
const crypto = new Crypto(TOKEN_SECRET, HASH_SALT, userRepository)

//Prepare controllers with dependencies
const M = mountMiddlewares(crypto)
const userController = mountUserController(userRepository,crypto)
const userPostController = mountUserPostController(userRepository, postRepository, crypto)
const postController = mountPostController(postRepository, crypto)

//Routes
const api = new Router()

//USER ROUTES
api.post('/login', userController.login)
api.post('/register', userController.register)
api.get('/users', M.checkJWT, userController.userProfile)
api.put('/users', M.checkJWT, userController.updateProfile)
api.delete('/users', M.checkJWT, userPostController.deleteAccount)

//POST ROUTES
api.get('/posts', postController.allPosts)
api.get('/posts/user', M.checkJWT, postController.accountPosts)
api.post('/posts', M.checkJWT, postController.createNewPost)
api.put('/posts', M.checkJWT, postController.updateExistingPost)
api.delete('/posts/:id', M.checkJWT, postController.deletePost)
api.delete('/posts', M.checkJWT, postController.deleteAllOwnPost)

export { api }