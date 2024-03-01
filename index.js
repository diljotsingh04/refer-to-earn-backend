const express = require('express');
const database = require('./db/db');
const {validUser} = require('./middleware/validUser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({origin: true, credentials: true}));

// get userid and amount route
app.get('/', (req, res)=>{
    res.send("Server is Running");
});

app.post('/dashboard', validUser, async(req, res)=>{
    // const email = req.body.email;
    // const password = req.body.password;
    const _id = req.body.userId;

    const userId = await database.User.findOne({_id});
    const getAmountFromId = await database.Accounts.findOne({refTo: userId._id});

    res.send({
        amount: getAmountFromId.amount,
        uId: userId._id,
        email: userId.email
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
        if(curUser){
            const initializeAccount = await database.Accounts.create({
                amount: 10,
                refTo: curUser._id
            })

            return res.send({
                message: "User Created Successfully",
                newUserId: curUser._id
            });
        }

    }
    catch(e){
        return res.send({
            message: 'Internal Server Error / Account Already Exists (try with new email and password)'
        })
    }
    
});

// signin route
app.post('/signin', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userExists = await database.User.findOne({
            email,
            password
        });

        if (userExists) {
            const balance = await database.Accounts.findOne({
                refTo: userExists._id
            });

            return res.json({
                userId: userExists._id,
                balance: balance.amount
            });
        } else {
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

// refer route
app.put('/refer', async (req, res) => {
    try {
        const curUserId = req.body.id;
        const referedInd = req.body.referedId;

        const val1 = await database.Accounts.updateOne(
            { refTo: curUserId },
            {
                $inc: { amount: 50 }
            }
        );

        const val2 = await database.Accounts.updateOne(
            { refTo: referedInd },
            {
                $inc: { amount: 50 }
            }
        );
        
        console.log(val1, val2)
        res.json({
            message: 'Value Updated Successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});


app.listen(PORT,()=>{
    console.log("Server running on port " + PORT);
});