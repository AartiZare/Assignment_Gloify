const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRound = 10;
const ObjectId = require("mongoose").Types.ObjectId;


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false; // "   " => false
    return true;
  };

//----------------------------------------------------Creating User-------------------------------------------------------//

const createUser = async function(req, res){
    try{
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Enter valid data" });
          }

          let data = req.body;
          let{fname,lname, email, password, phone, address} = data;

          if(!isValid(fname)){
            return res.status(400).send({msg: false, msg: "Please enter the firstName"});
          }

          if(!isValid(lname)){
            return res.status(400).send({msg: false, msg: "please enter the Last Name"});
          }

          // valiation of email
          data.email = data.email.trim()
          if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email)){
            return res.status(400).send({ status: false, msg: "email ID is not valid" });
          }
          let dupEmail = await userModel.findOne({ email: email });
          if (dupEmail){
            return res.status(400).send({ status: false, msg: "email is already registered" });
          }
        // validation of phone india format
         if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).send({status: false,message: "phone number should be valid number",});
         let dupPhone = await userModel.findOne({ phone: phone });
         if (dupPhone){
         return res.status(400).send({ status: false, msg: "phone is already registered" });
         }

         if(!address) return res.status(400).send({status:false,msg:'enter the address'})
        // if(typeof(address == 'string')) address = JSON.parse(address)
         if(address)
            if(!isValid(address.city)){
            return res.status(400).send({status:false,msg:'enter the city'})
            }
            if(!isValid(address.street)){
            return res.status(400).send({status:false,msg:'enter the street'})
            }
            if(!address.pincode){
             return res.status(400).send({status:false,msg:'enter the pincode'})
            }
            if (!/^[1-9][0-9]{5}$/.test(address.pincode)) {
            return res.status(400).send({status: false,message: "Please enter valid Pincode",}); // 6 digit pincode
            }
        if (!password){
         return res.status(400).send({ status: false, msg: "Please enter the password" });
        }

        if (password.length < 8 || password.length > 15) {
        return res.status(400).send({ status: false, msg: "Password length should be 8 to 15" });
        }

        data.password = await bcrypt.hash(password, saltRound);

        const createNewUser = await userModel.create(data)
        return res.status(201).send({ status: true, msg: "Created succesfully", data: createNewUser });

    }
    catch(error){
        return res.status(500).send({status: false, msg: error.message});
    }
}

//---------------------------------------------Login-User------------------------------------------------------------//

const loginUser = async function (req, res) {
  try {
    
    let data = req.body;
    let { email, password } = data;

    if (!email || !password) return res.status(400).send({ status: false, msg: `Email and Password is mandatory field.` });

    if (!isValid(email)) return res.status(400).send({ status: false, msg: "enter the valid email" });

    if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)) return res.status(400).send({ status: false, msg: "email ID is not valid" });

    if (!isValid(password)) return res.status(400).send({ status: false, msg: "Enter the valid Password" });

    if (password.length < 8 || password.length > 15) return res.status(400).send({ status: false, msg: "Password length should be 8 to 15" });

    let user = await userModel.findOne({ email: email });
    if (!user)return res.status(404).send({ status: false, msg: "unable to find email ID in the collection" });

    let rightPwd = bcrypt.compareSync(password, user.password);
    if (!rightPwd) return res.status(400).send({ status: false, msg: "password is incorrect" });

    let token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours expiration time
        userId: user._id.toString(),
      },
      "Book inventory management"
    );
    return res.status(200).send({status: true,msg: "login succesfully",data: { userId: user._id, token: token }});
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {
  createUser,
  loginUser
}