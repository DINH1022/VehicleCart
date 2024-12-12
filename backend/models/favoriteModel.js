import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

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
