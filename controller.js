const axios=require('axios');
const {OAuth2Client}=require('google-auth-library');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
require('dotenv').config();

const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URL
);

const mailReply=async(req,res)=>{
    console.log(req.session.tokens)
    oAuth2Client.setCredentials({refresh_token:req.session.tokens.refresh_token});
    const {token} = await oAuth2Client.getAccessToken();
    // res.send("mail");
    try{
    const response = await axios.get('https://www.googleapis.com/gmail/v1/users/me/threads?q=is:unread is:inbox category:primary', {
        method: 'GET',
        headers:{
            'Authorization': `Bearer ${token}`
        }
  });
  res.send(response.data);
}
catch(err)
{
    res.send(err);
}
}
module.exports ={mailReply}