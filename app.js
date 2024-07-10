const express=require("express")
const app=express()
require("./config/Db")
app.use(express.urlencoded({extended:false}))
app.use(express.json())
const cors=require("cors")

const user_router=require("./route/userRoute")
app.use(user_router)



app.use(cors())

app.get("/user",(req,res)=>{
    return res.json("hellow world")
})
app.get("/",(req,res)=>{
     res.json("hellow world")
})

app.listen(3001,()=>{
    console.log(`server is running at ${3001}`)
})
  
