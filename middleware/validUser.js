const {User} = require('../db/db');

const validUser = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const isValid = await User.findOne({
        email,
        password
    });
    if(isValid){
        console.log(isValid);
        next();
    }
    else{
        res.send({
            message: "User doesn't exists"
        })
    }
}

module.exports = {validUser};