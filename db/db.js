const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("Connected with MongoDb Successfully"));

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        unique: true
    },
    password: String,
});

const accountsSchema = mongoose.Schema({
    amount: Number,
    refTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

const User = mongoose.model('user', userSchema);
const Accounts = mongoose.model('accounts', accountsSchema);

module.exports = {
    User, 
    Accounts
}