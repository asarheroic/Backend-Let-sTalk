const express = require("express")
const { createServer} = require('http')
const {Server}  = require('socket.io')
const cors = require('cors')
const {  config } = require('dotenv')
config()

const app = express()
const server = createServer(app)

const io = new Server(server , {
    cors : {
        origin : process.env.FE_URL

    }
})

 function getReciverSocketId(userId) {
  return userSocketMap[userId]
}

const userSocketMap = {}

io.on('connection',(socket) => {
  console.log('A user connecterd',socket.id);


  const userId = socket.handshake.query.userId

  if (userId) {
    userSocketMap[userId] = socket.id
  }

  io.emit('getOnlineUsers' ,Object.keys(userSocketMap))

  socket.on('disconnect' , () => {
    console.log('A user disconnected' , socket.id);
    delete userSocketMap[userId]

    io.emit('getOnlineUsers' ,Object.keys(userSocketMap))

    
  }
  )
  
}
)

module.exports = {app, server, io , getReciverSocketId}
