const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
require("dotenv").config();

//create oauth object
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

//to create url for login and authorization to scopes
const googleLogin = (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.labels",
      "https://mail.google.com/",
    ],
  });
  res.redirect(authUrl);
};

//google login callback 
const googleCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    req.session.tokens = tokens;                 //storing tokens in session
    req.session.user = await getUserDetails(tokens.access_token);   //storing user email in session

    res.send("Login successful! .");
  } catch (error) {
    res.status(500).send("Login failed. Please try again.");
  }
};


//api call for logout
const googleLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

//api call to get user email address
const getUserDetails = async (token) => {
  try {
    const response = await axios.get(
      "https://gmail.googleapis.com/gmail/v1/users/me/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.emailAddress;
  } catch (error) {
    throw error;
  }
};
module.exports = { googleCallback, googleLogout, googleLogin };
