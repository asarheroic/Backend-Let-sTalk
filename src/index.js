const express = require('express')
const authRoutes= require('./routes/authRouter')
const messageRoutes = require('./routes/messageRoute')
const {  config } = require('dotenv')
const { connectDB } = require('./lib/connection')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { io,app,server } = require('./lib/socket')
const path =  require('path')





config()
connectDB()
const port = process.env.PORT


app.use(express.json({ limit: '5mb' })); // or more if needed

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin : 'http://localhost:5173',
  credentials : true
}))




app.use("/api/auth" ,authRoutes)
app.use("/api/message" ,messageRoutes)


if(process.env.NODE_ENV=='production'){
  app.use(express.static(path.join(__dirname , '../frontend/dist')))

  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname ,'../frontend','dist',"index.html"))
  }
  )
}





server.listen(port,() => {
  console.log(`server running on ${port}`);
}

)


