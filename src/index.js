const express = require('express')
const authRoutes= require('./routes/authRouter')
const messageRoutes = require('./routes/messageRoute')
const {  config } = require('dotenv')
const { connectDB } = require('./lib/connection')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { io,app,server } = require('./lib/socket')





config()
connectDB()
const port = process.env.PORT


app.use(express.json({ limit: '5mb' })); // or more if needed

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin : process.env.FE_URL,
  credentials : true
}))




app.use("/api/auth" ,authRoutes)
app.use("/api/message" ,messageRoutes)








server.listen(port,() => {
  console.log(`server running on ${port}`);
}

)


