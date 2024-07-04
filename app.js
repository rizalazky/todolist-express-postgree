require('dotenv').config()

const express = require('express')
const { apiRouter } = require('./routes')
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')

const db = require("./models");
const UserModel = db.User

const bcrypt= require('bcrypt')
const saltRounds = 10;

const app = express()
const port = 3200

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())

let REFRESH_TOKEN = []

const authenticateToken = (req,res,next) =>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]

    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next()
    })
}

const generateToken= (user) =>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn :'40m'});
}

const authLogin = async(req,res,next)=>{

    const email = req.body.email
    const password = req.body.password

    const user =await UserModel.findOne({
        where :{
            email : email
        }
    });
    if(user == null){
        return res.json(
            {
                status : "FAIL",
                message : "Email doesn't exist"
            }
        ) 
    } 

    const verifyPassword =await bcrypt.compareSync(password,user.password);
    
    if(!verifyPassword){
        return res.json(
            {
                status : "FAIL",
                message : "Wrong Password!"
            }
        ) 
    }
    req.user = user;
    next()
}



app.get('/',(req,res)=>{
    res.send('Hello')
})

app.post('/login', authLogin , (req,res,next)=>{
    const user = {
        id: req.user.id,
        email : req.user.email,
        firstName : req.user.firstName,
        lastName : req.user.lastName
    }

    const token = generateToken(user)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
    REFRESH_TOKEN.push(refreshToken)
    res.json({
        status : "OKE",
        data :{
            user : user,
            token : token,
            refreshToken : refreshToken
        }
    })
})

app.post('/knock', authenticateToken , (req,res,next)=>{
    res.sendStatus(200);
})

app.post('/logout',(req,res, next)=>{
    REFRESH_TOKEN = REFRESH_TOKEN.filter(token => token !== req.body.token)

    res.json({
        status : "OKE",
        message : "Success logout"
    })
})

app.post('/token',(req,res,next)=>{
    const refreshToken = req.body.token;

    if(refreshToken == null) return res.sendStatus(401);
    if(!REFRESH_TOKEN.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403);

        console.log('user',user)

        const newToken = generateToken({
            id : user.id,
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
        })
        return res.json({
            status : "OKE",
            token : newToken
        })
    })
})

app.use('/api', authenticateToken, apiRouter);

app.listen(port,()=>{
    console.log('app listening on port '+ port)
})