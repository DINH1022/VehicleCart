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
    avatar: {
        type:String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTUE7jXHro7BdwC8kOvXnqQ7m1SwUP6MH6iK_ZLmKKjiG8tkhq7q_tytzMTXBtGsSRp0Y&usqp=CAU"
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
