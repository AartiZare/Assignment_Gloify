const storeModel = require("../models/storeModel");
const ObjectId = require("mongoose").Types.ObjectId;


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false; // "   " => false
    return true;
  };

//--------------------------------------------------Register Book Store---------------------------------------------------------------------//

  const storeRegister = async function(req, res){
  try{
   
      if (Object.keys(req.body).length == 0) {
        return res.status(400).send({ status: false, msg: "Enter some data in request body" });
      }

      let data = req.body;
      let{email, phone, storeName, userId} = data;

      if(!ObjectId.isValid(userId)){
        return res.status(400).send({status: false, msg: "Put valid userId in request body"})
      }
      if(req.userId !== req.body.userId){
        return res.status(404).send({status: false, msg: "Unauhorised"})
      }
      if(!isValid(storeName)){
        return res.status(400).send({msg: false, msg: "store Name is required"});
      }
      // valiation of email
      data.email = data.email.trim()
      if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email)){
        return res.status(400).send({ status: false, msg: "email ID is not valid" });
      }
      let dupEmail = await storeModel.findOne({ email: email });
      if (dupEmail){
        return res.status(400).send({ status: false, msg: "email is already registered" });
      }
    // validation of phone india format
     if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).send({status: false,message: "phone number should be valid number",});
     let dupPhone = await storeModel.findOne({ phone: phone });
     if (dupPhone){
     return res.status(400).send({ status: false, msg: "phone is already registered" });
     }

    const createNewStore = await storeModel.create(data)
    return res.status(201).send({ status: true, msg: "Created succesfully", data: createNewStore });

}
    catch(error){
        return res.status(500).send({status: false, msg: error.message});
    }
}


//-----------------------------------------------------Fetching stores which are registered-----------------------------------------------//
  
const getStore = async function(req,res){
  try{
        const filterStore = {isDeleted: false}
        const queryParams = req.query

        if(Object.keys(queryParams) != 0){
          let {userId} = queryParams

          if(isValid(userId)){
            filterStore['userId'] = userId
          }
        

        const store = await storeModel.find({$and: [filterStore]})
        if(Array.isArray(store) && store.length==0){
          return res.status(404).send({status: false, msg: "No stores found"})
        }
        return res.status(200).send({status: true, msg: "Store List", data: store});
      }
        else{
          const store = await storeModel.find({filterStore})
          if(Array.isArray(store) && store.length == 0){
            return res.status(404).send({status: false, msg:"No stores are there"})
          }
          return res.status(200).send({status: true, msg: "successfully fetched book stores", data: store})
        }
  }
  catch(error){
      return res.status(500).send({status:false,msg:error.message})
  }

}


module.exports = {
  storeRegister,
  getStore
}