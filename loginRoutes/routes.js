const express=require('express');
const router=express.Router();
const {googleLogin,googleCallback,googleLogout}=require('./controller.js');
router.get('/login',googleLogin);
router.get('/callback',googleCallback);
router.get('/logout',googleLogout);

module.exports = router;