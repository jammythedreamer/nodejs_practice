const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const log = require('./utils/log')
const Router = require('koa-router')
const ejs = require('koa-ejs')
const http = require('http')
const io = require('socket.io')

const router = new Router
const app = new Koa
const port = 8001

ejs(app, {

    root: path.join(__dirname, 'static'),
    viewExt: 'ejs',
    layout: false
})

router.get('/', async (ctx, next) =>{
    const rawContent = fs.readFileSync('./static/index.html').toString('utf-8')
    ctx.body = rawContent
})

router.get('/about', async (ctx, next) => {
    const author = 'test_id'
    const ip_list_raw = log.readFromLogFile()
    const ip_list = ip_list_raw.split(/\r\n|\n/)
    await ctx.render('about', {author, ip_list})
})

router.get('/about/:ID',async(ctx, next) =>{
    const ID = ctx.params.ID
    await ctx.render('aboutUser', {ID})
})

router.get('/chat', async (ctx, next) =>{
    await ctx.render('chat')
})
app.use(async (ctx, next) => {

    log.writeLogFile(ctx.request.ip)

    await next()
})


app.use(router.routes())
app.use(router.allowedMethods())

const server = http.createServer(app.callback())

server.listen(port, ()=> {
    console.log('running server')
})

io(server).on('connect', (socket) => {
    console.log(`${socket.id} connected on client`)

    socket.emit('message', 'Hello')

    socket.on('message', (text) => {
        console.log('message receive', text)
        socket.emit('message', 'How are you?')
    })

})




