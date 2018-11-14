const express = require('express');
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

var list = [];
app.use(express.static("public"))
io.on('connection', socket => {
    list.push({id: socket.id, pseudo: ''})
    console.log('list of users : ', list)
    io.emit('list', list)
    console.log('user connected : ', socket.id)
    socket.on('loaded', (data) => {
        console.log('data from client :', data)
    })
    socket.on('message', (data) => {
        var msg = data.trim();
        if (msg.substr(0,3) === '/w '){
            console.log('whisper');
        }else{
        console.log('new message received', data)
        socket.broadcast.emit('message', data)
    }
    })
   socket.on('disconnect',()=>{
    console.log('user disconnected')
    list= list.filter(element=>{
        return element.id !== socket.id
        
    })
    io.emit('list', list)
   })
    socket.on('pseudoChange', (data) => {
        console.log(socket.id, 'changed pseudo to', data)
        list[list.findIndex(element => {
            return  element.id === socket.id
        })].pseudo = data
        io.emit('list', list)    
    })
})

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/views/index.html')
})

http.listen(3000, () => {
    console.log('server is up and running in http://localhost:3000')
})