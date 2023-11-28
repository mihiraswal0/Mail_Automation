const express=require('express');
const router=express.Router();
const {googleLogin,googleCallback,googleLogout}=require('./controller.js');
router.get('/login',googleLogin); //login routes
router.get('/callback',googleCallback); //login callback routes
router.get('/logout',googleLogout);  //logout routes

module.exports = router;