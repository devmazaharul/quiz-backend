const express=require("express")
const app=express()
require("./config/Db")
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const cors=require("cors")


app.use(cors())


const {userRoute}=require("./route/userRoute")
app.use(userRoute)



app.get("/",(req,res)=>{
     res.json("hellow world")
})

app.listen(3001,()=>{
    console.log(`server is running at ${3001}`)
})
  
