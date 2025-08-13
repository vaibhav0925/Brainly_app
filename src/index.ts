import express from "express";
import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import { UserModel } from "./db.js";
import { JWT_Secret } from "./config.js";


const app = express();
app.use(express.json());

app.post("/api/v1/signup", async(req, res) => {
    // Include zod validation and hash the password
    const username = req.body.username;
    const password = req.body.password;

    try{
        await UserModel.create({
        username: username,
        password: password
        })

        res.json({
            message: "You are signUp"
        })
    }catch(e){
        res.status(411).json({
            message: "User Alreay Exist"
        })
    }
    
})

app.post("/api/v1/signin", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser){
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_Secret)

        res.json({
            token
        })
    }else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
})

app.post("/api/v1/content", (req, res) => {
    const link = req.body.link;
    const type = req.body.type
})

app.get("/api/v1/content", (req, res) => {

})

app.delete("/api/v1/content", (req, res) => {

})

app.post("/api/v1/brain/share", (req, res) => {

})

app.get("/api/v1/brain/:shareLink", (req, res) => {
    
})

app.listen(3000);