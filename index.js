const express = require('express');
const database = require('./db/db');
const {validUser} = require('./middleware/validUser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// get userid and amount route
app.get('/dashboard', validUser, async(req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const userId = await database.User.findOne({email, password});
    const getAmountFromId = await database.Accounts.findOne({refTo: userId._id});

    res.send({
        amount: getAmountFromId.amount,
        uId: userId._id
    })
});

//signup user route
app.post('/signup', async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    // creating a new user in database
    try{
        const curUser = await database.User.create({
            email,
            password
        }); 
        // initializing users account with 10 ruppees
        const initializeAccount = await database.Accounts.create({
            amount: 10.0,
            refTo: curUser._id
        })

        res.send({
            message: 'User Created Successfully',
            balance: initializeAccount.amount
        });

    }
    catch(e){
        res.send({
            message: 'Internal Server Error / Account Already Exists (try with new email and password)'
        })
    }
    
});

// signin route
app.post('/signin', async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const userExists = await database.User.findOne({
        email,
        password
    });

    if(userExists){
        res.send({
            userId: userExists._id
        })
    }
    else{
        res.send({
            message: "User doesn't exists"
        })
    }
});
// refer route
app.put('/refer', async (req, res)=>{
    const curUserId = req.body.id;
    const referedInd = req.body.referedId;

    await database.Accounts.updateOne(
        {refTo: curUserId}, 
        {$inc: 
            {amount: 50}
        }
    );
    await database.Accounts.updateOne(
        {refTo: referedInd}, 
        {$inc: 
            {amount: 50}
        }
    );
    res.send({
        message: 'Value Updated Successfully'
    })
});

app.listen(PORT,()=>{
    console.log("Server running on port " + PORT);
});