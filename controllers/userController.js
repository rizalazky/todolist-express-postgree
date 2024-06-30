const db = require('../models');  
const UserModel = db.User;


const bcrypt= require('bcrypt')
const saltRounds = 10;

UserModel.sync()

exports.list = async (req,res,next)=>{
    let data = await UserModel.findAll({
        attributes : ["id","email","firstName","lastName"]
    });
   

    res.json(data)
}

exports.detail = async (req,res,next) =>{
    const id = req.params.id;
    let data = await UserModel.findByPk(id,{
        attributes : ["id","email","firstName","lastName"]
    });
    // let data =[]

    res.json(data)
}

exports.add = async (req,res,next)=>{
    const hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
    // bcrypt.compareSync(myPlaintextPassword, hash); // true

    // res.json(req.body)
    let data ={
        email: req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password: hashPassword
    }


    try {
        let createData = await UserModel.create(data)
    
        res.json({
            status : 'OK',
            data : createData
        })
        
    } catch (error) {
        res.json({
            status : 'FAIL',
            errors : error.errors
        })
    }
}


const deleteImage = async(imageName)=>{
    let files = fs.readdirSync('uploads');
    if(files.includes(imageName)){
        fs.unlinkSync('uploads/'+ imageName);
    }
}

exports.update = async (req,res,next)=>{
    let id = req.params.id;
   
    let user = await UserModel.findByPk(id);

    if(req.file){
        let delImage = await deleteImage(user.image)
        user.image = req.file.originalname
    }
    user.usernamae = req.body.usernamae;
    user.name= req.body.name;
    user.role_id= req.body.role_id;
    user.address= req.body.address;

    let execQuery = await user.save();

    // let execQuery = await UserModel.update(data,{where : {id : id}});

    res.json({
        status : 'OK',
        data : execQuery
    })
}

exports.delete = async (req,res,next)=>{
    let id = req.params.id;

    let user = await UserModel.findByPk(id);

    let delImage = await deleteImage(user.image)
       
    let execQuery = await user.destroy();
    res.json({
        status : 'OK',
        data : execQuery
    })
}