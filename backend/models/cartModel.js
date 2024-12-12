import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const cartItemSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }

});

const cartSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    item: [cartItemSchema],
    totalAmount: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;