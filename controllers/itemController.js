const db = require('../models')
const ItemModel = db.Item


exports.list = async (req,res,next)=>{
    const listId = req.params.listId;

    const data = await ItemModel.findAll({
        where : {
            list_id : listId
        }
    });
    res.json({
        status : "OKE",
        data : data
    });
}

exports.add = async(req,res,next)=>{
    try {
        const insertData = await ItemModel.create({
            list_desc : req.body.itemDesc,
            list_id : req.params.listId,
        })
        res.json({
            status :"OKE",
            data : insertData
        })
    } catch (error) {
        res.json({
            status :"FAIL",
            data : error.errors
        })
    }
}

exports.update = async(req,res,next)=>{
    const id = req.params.id
    try {

        const updateData = await ItemModel.update({
            list_desc : req.body.itemDesc
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
        const deleteData = await ItemModel.destroy({
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