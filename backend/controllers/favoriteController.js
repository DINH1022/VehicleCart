import asyncHandler from "../middlewares/asyncHandler.js";
import Favorite from "../models/favoriteModel.js";

const getFavorites = asyncHandler(async (req,res) => {
    const favorites = await Favorite.findOne({user : req.user._id}).populate("products", "name price image description branch rating");
    if(!favorites){
        return res.status(200).json({products:[]})
    }
    res.status(200).json(favorites);
});

const addToFavorites = asyncHandler(async (req,res) => {
    const {productId} = req.body;

    let userFavorites = await Favorite.findOne({user : req.user._id});
  
    if(!userFavorites){
        userFavorites = await Favorite.create({
            user : req.user._id,
            products : [productId]
        });

    } else {
        if(!userFavorites.products.includes(productId)){
            userFavorites.products.push(productId);
            await userFavorites.save();
        }
    }
    res.status(200).json(userFavorites);
});

const removeFavorites = asyncHandler(async (req,res) => {
    const {productId} = req.body;
    console.log(productId)
    let userFavorites = await Favorite.findOne({user : req.user._id});
    if(!userFavorites){
        res.status(404);
        throw new Error("Favorites not found");
    } 
    userFavorites.products = userFavorites.products.filter(id => id.toString() !== productId);
    await userFavorites.save();
    
    res.status(200).json(userFavorites);
});

export {
    getFavorites,
    addToFavorites,
    removeFavorites
};