const { where } = require('sequelize');
const db = require('../models')
const ListModel = db.List


exports.list = async (req,res,next)=>{
    const user = req.user;
    const data = await ListModel.findAll({
        where : {
            user_id : user.id
        },
        order :['id']
    });
    res.json({
        status : "OKE",
        data : data
    });
}

exports.add = async(req,res,next)=>{
    const user = req.user;

    try {
        const insertData = await ListModel.create({
            list_desc : req.body.listDesc,
            user_id : user.id,
        })
        res.json({
            status :"OKE",
            data : insertData
        })
    } catch (error) {
        console.log(error)
        res.json({
            status :"FAIL",
            data : error.errors
        })
    }
}

exports.update = async(req,res,next)=>{
    const id = req.params.id
    try {

        const updateData = await ListModel.update({
            list_desc : req.body.listDesc
        },{
            where : {
                id : id
            }
        });
        res.json({
            status :"OKE",
            data : updateData
        })
    } catch (error) {
        res.json({
            status :"FAIL",
            data : error.errors
        })
    }
}

exports.delete = async(req,res,next)=>{
    try {
        const deleteData = await ListModel.destroy({
            where : {
                id : req.params.id
            }
        });
        res.json({
            status :"OKE",
            data : deleteData
        })
    } catch (error) {
        res.json({
            status :"FAIL",
            data : error.errors
        })
    }
}