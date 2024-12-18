import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
  mainCategory :{
    type: ObjectId,
    ref: 'MainCategory',
    required: true
  }
},{
  timestamps: true
});

export default mongoose.model("Category", categorySchema);
