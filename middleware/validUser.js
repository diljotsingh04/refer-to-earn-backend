const {User} = require('../db/db');

const validUser = async (req, res, next) => {
    // const email = req.body.email;
    // const password = req.body.password;
    const _id = req.body.userId;

    const isValid = await User.findOne({
        _id
    });
    if(isValid){
        next();
    }
    else{
        res.send({
            message: "User doesn't exists"
        })
    }
}

module.exports = {validUser};