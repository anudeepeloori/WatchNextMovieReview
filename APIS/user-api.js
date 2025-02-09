const exp=require('express')
const { ObjectId } = require('mongodb');
const userApi=exp.Router();
const errorhandler= require("express-async-handler")
const bcryptjs=require("bcryptjs")
const jwt =require("jsonwebtoken")
require("dotenv").config()

//body parser middleware
userApi.use(exp.json())


//getuser
userApi.get('/getusers',errorhandler(async(req,res)=>{
    let userCollectionObj = req.app.get("userCollectionObj")
    let userlist= await userCollectionObj.find().toArray()
    res.send({message:userlist})
}))

//get user by username 
userApi.get('/getuser/:username',errorhandler(async(req,res)=>{
    let userCollectionObj = req.app.get("userCollectionObj")
    let un=req.params.username
    let userobj = await userCollectionObj.findOne({username:un})
    if(userobj===null){
        res.send("no user existed with username" )
    }
    else{
        res.send({message:userobj})
    }
}))


//creating a new user
userApi.post("/createuser",errorhandler(async(req,res)=>{
    let userCollectionObj = req.app.get("userCollectionObj")
    newuser=req.body;
    let user= await userCollectionObj.findOne({username:newuser.username})
    if(user===null){
        //hash password
        let hashedpassword=await bcryptjs.hash(newuser.password,7)
        //replace password
        newuser.password=hashedpassword
        //insert
       await userCollectionObj.insertOne(newuser)
        res.send({message:"regestration is successfull"})
    }
    else{
        res.send({message:"user already existed"})
    }
}))


//login 
userApi.post("/login",errorhandler(async(req,res)=>{
    let userCollectionObj = req.app.get("userCollectionObj")
    let credentials=req.body;
    let user = await userCollectionObj.findOne({username:credentials.username})
    if(user===null){
        res.send({message:"please Register to Login"})
    }
    else{
       let result=await bcryptjs.compare(credentials.password,user.password)
       if(result===false){
           res.send({message:"invalid password"})
       }
       else{
           //create a token 
           let signedtoken=jwt.sign({username:credentials.username},'abcdef',{expiresIn:120})
           //send token to client
           res.send({message:'login success',token:signedtoken,username:credentials.username,userObj: user})
       }
    }
}))

//contact us
userApi.post("/contactform", errorhandler(async(req,res)=>{
    let contactscollection = req.app.get("contactscollection")
    query=req.body;
    await contactscollection.insertOne(query)
    res.send({message:"your query successfully submitted"})
}))

//post App ratings
userApi.post("/apprating",errorhandler(async(req,res)=>{
    let ratingcollectionObj=req.app.get("ratingcollection")
    const rating=req.body;
    let userRating=await ratingcollectionObj.findOne({username:rating.username})
    if(userRating===null){
        await ratingcollectionObj.insertOne(rating)
        res.send({message:"rating is successfull"})
    }
    else{
        await ratingcollectionObj.updateOne(
            { username: rating.username }, 
            { $set: { rating: rating.rating, updatedAt: new Date() } }
        );
        res.send({ message: "Your rating was updated" });
    }
    
}))

//get App ratings
userApi.get("/getappratings",errorhandler(async(req,res)=>{
    let ratingcollectionobj = req.app.get("ratingcollection")
    let ratinglist= await ratingcollectionobj.find().toArray()
    res.send({message:ratinglist})
}))


//post movie ratings
userApi.post("/submitreview", errorhandler(async (req, res) => {
    let reviewCollection = req.app.get("reviewCollection"); // Get collection

    const { username, movieId, reviewText, rating } = req.body;

    if (!username || !movieId) {
        return res.send({ message: "Username and movieId are required." });
    }

    const existingReview = await reviewCollection.findOne({
        username: username,
        movieId: movieId, 
    });

    if (existingReview) {
        await reviewCollection.updateOne(
            { username: username, movieId: movieId },
            { $set: { reviewText, rating, updatedAt: new Date() } }
        );
        return res.send({ message: "Review updated successfully." });
    }

    const result = await reviewCollection.insertOne({
        username,
        movieId, // Keep as a string
        reviewText,
        rating,
        createdAt: new Date()
    });

    res.send({ message: "Review submitted successfully.", reviewId: result.insertedId });
}));



//get movie ratings
userApi.get("/getmoviereview/:username/:movieId", errorhandler(async (req, res) => {
    let reviewCollection = req.app.get("reviewCollection");

    const { username, movieId } = req.params;

    if (!username || !movieId) {
        return res.send({ message: "Invalid username or movieId." });
    }

    const review = await reviewCollection.findOne({
        username: username,
        movieId: movieId, 
    });

    if (review) {
        res.send(review);
    } else {
        res.send({ message: "No review found." });
    }
}));





module.exports=userApi