const express = require('express')
const http = require('http')
const app = module.exports.app = express()
const ROOT_DIR = '/public'
const server = http.createServer(app);
const io = require('socket.io').listen(server)
const PORT = process.env.PORT || 3000
const fs = require('fs')
const path = require("path")



const root = path.join(__dirname, 'public', 'music')
let playlist = fs.readdirSync(root)
let music = {
    src: playlist[0],
    idx: 0,
    time: 0,
    volume: 1,
    paused: true
}


app.use(express.static(path.join(__dirname, ROOT_DIR)))


server.listen(PORT)

io.on('connection', function(socket) {
    socket.emit('playlist', JSON.stringify({
        playlist
    }))
    socket.emit('on', JSON.stringify(music))
    socket.on('play', data => {
        music = JSON.parse(data)
        socket.broadcast.emit('play', data)
    })
    socket.on('switchSong', data => {
        music = JSON.parse(data)
        socket.broadcast.emit('switchSong', data)
    })
})


