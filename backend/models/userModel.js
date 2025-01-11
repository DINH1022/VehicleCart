import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username : {
        type: String,
    },
    email : {
        type:String,
        required : true,
        unique : true,
    },
    password :{
        type: String,
    },
    isAdmin :{
        type: Boolean,
        required :true,
        default : false,
    },
}, 
{
    timestamps : true,  //auto create timestamp when user was created
}
);

const User = mongoose.model("User",userSchema);

export default User;
