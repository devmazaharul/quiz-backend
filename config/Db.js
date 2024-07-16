require("dotenv").config()
const mongoose=require("mongoose")
const dbCon=async()=>{
    try {
        await mongoose.connect(process.env.mongo_url).then((da)=>{
            console.log("connected db")
        })
    } catch (error) {
        console.log("db not connected")
        // process.exit(1)
    }
}

dbCon()