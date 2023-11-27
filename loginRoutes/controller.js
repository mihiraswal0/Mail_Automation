const {OAuth2Client}=require('google-auth-library');
require('dotenv').config();
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);

const googleLogin=(req,res)=>{
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.compose','https://www.googleapis.com/auth/gmail.readonly']
      });
      res.redirect(authUrl);
}
const googleCallback=async(req,res)=>{
    const code = req.query.code;

    try {
      const { tokens } = await oAuth2Client.getToken(code);  
    //   console.log(tokens);
      req.session.tokens=tokens;
      res.send('Login successful! .');
    } catch (error) {
      console.error(error);
      res.status(500).send('Login failed. Please try again.');
    }
}

const googleLogout=(req,res)=>{
    req.session.destroy(() => {
        res.redirect('/');
      });
}

module.exports={googleCallback,googleLogout,googleLogin};