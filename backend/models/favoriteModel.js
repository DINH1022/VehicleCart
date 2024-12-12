import mongoose from "mongoose";
import { ObjectId } from mongoose.Schema;

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
