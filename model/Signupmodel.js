const mongoose=require("mongoose")

const Signupschima=mongoose.Schema({
    userID:String,
    userName:String,
    userNumber:String,
    signupDate:String
})

const SignupModel=mongoose.models.userTable || mongoose.model("userTable",Signupschima)
module.exports={
    SignupModel
}