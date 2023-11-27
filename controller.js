const mailReply=(req,res)=>{
console.log(req.session.tokens);
res.send("yo mail reply");
}
module.exports ={mailReply}