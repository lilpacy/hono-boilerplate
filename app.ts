import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import routes from './src/routes'
// import { errorHandler, notFound } from './middlewares'
// import {supabaseAnon, supabaseService} from './src/supabaseClient'

interface Bindings {
    MY_KV: KVNamespace
    PORT: string
}

// Initialize the Hono app
const app = new Hono<{ Bindings: Bindings }>().basePath('/api/v1')

// Initialize middlewares
app.use('*', logger(), prettyJSON())

// Cors
app.use(
    '*',
    cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
)

// Home Route
app.get('/', (c) => c.text('Welcome to the API!'))

// User Routes
app.route('/', routes)

// Error Handler
// app.onError((err, c) => {
//     const error = errorHandler(c)
//     return error
// })

// Not Found Handler
// app.notFound((c) => {
//     const error = notFound(c)
//     return error
// })

const port = Number(process.env.PORT) || 3000

export default {
    port,
    fetch: app.fetch,
}