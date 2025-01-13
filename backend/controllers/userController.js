import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import { oauth2client } from "../utils/googleConfig.js";
import axios from "axios";
import https from "https";
import fetch from "node-fetch";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new Error("Please fill all fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);
    try {
      const response = await fetch(
        "https://localhost:4000/api/auth/create-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.PAYMENT_SERVER_API_KEY,
          },
          body: JSON.stringify({
            userId: newUser._id.toString(),
          }),
          agent,
        }
      );

      if (!response.ok) {
        throw new Error(`API call thất bại: ${response.statusText}`);
      }

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      await User.findByIdAndDelete(newUser._id);
      res.status(500);
      throw new Error("Lỗi khi tạo tài khoản payment");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (!existingUser.password) {
    return res.json({
      success: false,
      mes: "Tài khoản này đăng nhập qua google",
    });
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  createToken(res, existingUser._id);
  res.status(201).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    avatar: existingUser.avatar,
  });
});
const loginGoogleUser = asyncHandler(async (req, res) => {
  try {
    const { code } = req.query;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    var existingUser = await User.findOne({ email });
    if (!existingUser) {
      existingUser = await User.create({
        username: "",
        email: email,
        avatar: picture,
      });
      try {
        const tokenResponse = await fetch(
          "https://localhost:4000/api/auth/create-account",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": process.env.PAYMENT_SERVER_API_KEY,
            },
            body: JSON.stringify({
              userId: existingUser._id.toString(),
            }),
            agent,
          }
        );

        if (!tokenResponse.ok) {
          throw new Error(`API call thất bại: ${tokenResponse.statusText}`);
        }
        createToken(res, existingUser._id);
        return res.status(201).json({
          _id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin,
          avatar: existingUser.avatar,
        });
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        await User.findByIdAndDelete(existingUser._id);
        res.status(500);
        throw new Error("Lỗi khi tạo tài khoản payment");
      }
    }
  } catch (error) {
    throw error;
  }
  createToken(res, existingUser._id);
  res.status(201).json({
    _id: existingUser._id,
    username: existingUser.username || "",
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    avatar: existingUser.avatar,
  });
});

const loginFacebookUser = async (req, res) => {
  try {
    const { code } = req.query;
    console.log("Received code:", code);
    
    // Use the exact same redirect URI as registered on Facebook
    const redirectUri = 'http://localhost:5173/';
    
    const tokenUrl = `https://graph.facebook.com/v12.0/oauth/access_token` +
      `?client_id=${process.env.FACEBOOK_APP_ID}` +
      `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code=${code}`;
    
    console.log("Token URL:", tokenUrl);
    
    // Exchange code for access token
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();
    console.log("Token response:", tokenData);

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token from Facebook: ' + JSON.stringify(tokenData.error));
    }

    // Get user data from Facebook with the received access token
    const userResponse = await fetch(
      `https://graph.facebook.com/v12.0/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`
    );
    const userData = await userResponse.json();
    console.log("User data:", userData);

    if (!userData.email) {
      throw new Error('Email not provided by Facebook');
    }

    // Find or create user
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create({
        email: userData.email,
        username: userData.name,
        avatar: userData.picture?.data?.url || undefined,
      });

      // Create payment account after user is created
      try {
        const paymentResponse = await fetch(
          "https://localhost:4000/api/auth/create-account",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": process.env.PAYMENT_SERVER_API_KEY,
            },
            body: JSON.stringify({
              userId: user._id.toString(),
            }),
            agent,
          }
        );

        if (!paymentResponse.ok) {
          await User.findByIdAndDelete(user._id);
          throw new Error('Failed to create payment account');
        }
      } catch (error) {
        await User.findByIdAndDelete(user._id);
        throw new Error('Failed to create payment account: ' + error.message);
      }
    }

    // Create JWT token
    createToken(res, user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Facebook login error:", error);
    res.status(401).json({ message: error.message || 'Facebook login failed' });
  }
};

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    // try {
    //   const response = await fetch(
    //     "https://localhost:4000/api/auth/delete-account",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "X-API-Key": process.env.PAYMENT_SERVER_API_KEY,
    //       },
    //       body: JSON.stringify({
    //         userId: newUser._id.toString(),
    //       }),
    //       agent,
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error(`API call thất bại: ${response.statusText}`);
    //   }
    // } catch (error) {
    //   throw error
    // }
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  //Admin không được đổi mật khẩu người dùng
  const user = await User.findById(req.params.id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const uploadAvatar = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const avatar = req.file.path;
    const user = await User.findById(_id);
    user.avatar = avatar;
    await user.save();

    // Return the new avatar URL in the response
    return res.json({
      success: true,
      avatar: user.avatar,
      newAvatar: avatar,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Failed",
    });
  }
});
export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  loginGoogleUser,
  uploadAvatar,
  loginFacebookUser,
};
