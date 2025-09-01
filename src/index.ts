import express from "express";
import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import { ContentModel, LinkModel, UserModel } from "./db.js";
import { JWT_Secret } from "./config.js";
import { userMiddleware } from "./middleware.js";
import { random } from "./utils.js";


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

app.post("/api/v1/content", userMiddleware, async(req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        tittle: req.body.tittle,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })

    return res.json({
        message: "Content Added"
    })
})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId")
    res.json({
        content
    })
})

app.delete("/api/v1/content",userMiddleware, async (req, res) => {
    const contentId = req.body.contentId

    await ContentModel.deleteMany({
        contentId,
        userId: req.userId
    })

    res.json({
        message: "Deleted Succesfully"
    })
})

app.post("/api/v1/brain/share",userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share){
        const existingLink = await LinkModel.findOne({
            userId: req.userId
        });
        if(existingLink){
            res.json({
                hash: existingLink.hash  
            })
            return;
        }
        const hash = random(10)
        await LinkModel.create({
            userId: req.userId,
            hash: hash,
        })
        res.json({
            message: "/share" + hash
        })
    }else{
        await LinkModel.deleteOne({
            userId:req.userId
        });

        res.json({
            message: "Removed Link"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({hash})

    if(!link){
        res.status(411).json({
            message: 'Sorry Incorect Input'
        })
        return;
    }
    //userid
    const content = await ContentModel.find({
        userId:link.userId
    })

    console.log(link);
    const user = await UserModel.findOne({
        _id: link.userId
    })
    if(!user){
        res.status(411).json({
            message: 'User Not Found, error should ideally not happen'
        })
        return;
    }
    res.json({
        username: user.username,
        content: content
    })
})

app.listen(3000);