const express=require('express');
const app=express();
const session=require('express-session');
const loginRoutes=require('./loginRoutes/routes.js');
const {mailReply}=require('./controller.js');
require('dotenv').config();
const port=8000
app.set("view engine","ejs");
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}));

const isLogin=(req,res,next)=>{
    if(req.session.tokens)
    next();
else
res.redirect("/");
}

app.use('/api/google',loginRoutes);
app.use('/api/mailReply',isLogin,mailReply);


app.use('/',(req,res)=>{
    res.render("pages/index");
})


app.listen(port,()=>{
    console.log('listening on port: '+port);
})