const { where } = require('sequelize')
const db = require('../models')
const ItemModel = db.Item
const ListModel = db.List

ItemModel.sync()
ListModel.sync()


exports.list = async (req,res,next)=>{
    const flag = ['myday','completed','important'];
    const listId = req.params.listId;
    let data;
    if(flag.includes(listId)){
        let whereOption = {};
        whereOption[listId] = true;
        data = await ListModel.findAll({
           
            include : [{
                model : ItemModel,
                where : whereOption
            }],
            order :[[ItemModel,'id']]
        });
    }else{
        // find specific id
        data = await ListModel.findOne({
            where : {
                id : listId
            },
            include : [{
                model : ItemModel,
            }],
            order :[[ItemModel,'id']]
        });
    }

    res.json({
        status : "OKE",
        data : data
    });
}

exports.detail = async (req,res,next)=>{
    const id = req.params.id;

    const data = await ItemModel.findByPk(id);
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



exports.update = async (req,res,next)=>{
    const id = req.params.id;
    let data = req.body;
    console.log('DATA',req.body.completed)
    try {
        const task = await ItemModel.findByPk(id);

        if(data.list_desc){
            task.list_desc = data.list_desc;
        }
        if(data.notes){
            task.notes = data.notes;
        }
        if(data.duedate){
            task.duedate = data.duedate;
        }

        if(data.completed){
            task.completed = !task.completed;
        }
        if(data.important){
            task.important = !task.important;
        }
        if(data.myday){
            task.myday = !task.myday;
        }
        
        const updateData = await task.save()
       
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