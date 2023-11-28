const {OAuth2Client}=require('google-auth-library');
const axios = require('axios');
require('dotenv').config();
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);

const googleLogin=(req,res)=>{
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ["https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.labels",
        "https://mail.google.com/"]
      });
      res.redirect(authUrl);
}
const googleCallback=async(req,res)=>{
    const code = req.query.code;

    try {
      const { tokens } = await oAuth2Client.getToken(code);  
    //   console.log(tokens);
      req.session.tokens=tokens;
      req.session.user=await getUserDetails(tokens.access_token);
      
      res.send('Login successful! .');
    } catch (error) {
      res.status(500).send('Login failed. Please try again.');
    }
}

const googleLogout=(req,res)=>{
    req.session.destroy(() => {
        res.redirect('/');
      });
}
const getUserDetails=async(token)=>{
  try {
    const response = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    return response.data.emailAddress;
  } catch (error) {
    throw(error);
  }
}
module.exports={googleCallback,googleLogout,googleLogin};