import { App } from './deps.ts'
import { api } from './routes.ts'

const env = Deno.env.toObject()
const PORT = parseInt(env.PORT) || 3000

const app = new App()
app.use('/v1', api)

app.listen(PORT)