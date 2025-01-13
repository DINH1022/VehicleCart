import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String,
      required: false,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    shippingStatus: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
    },
    phone: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Tự động populate user và product khi query
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  }).populate({
    path: "items.product",
    select: "name image price",
  });
  next();
});

// Virtual field để tính tổng số lượng sản phẩm
orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Method để kiểm tra trạng thái đơn hàng
orderSchema.methods.canBeCancelled = function () {
  return ["pending", "processing"].includes(this.shippingStatus);
};

const Order = mongoose.model("Order", orderSchema);

export default Order;
