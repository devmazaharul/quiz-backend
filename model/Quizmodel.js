const mongoose=require("mongoose")

const QuizSchima=new mongoose.Schema({
    quizId:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    desc:{
        type:String,
        require:true
    },
    insertDate:{
        require:true,
        type:String
    }
},{timestamps:true})

 const QuizModel=mongoose.models.quiztable || mongoose.model("quiztable",QuizSchima)
 module.exports={
    QuizModel
 }
