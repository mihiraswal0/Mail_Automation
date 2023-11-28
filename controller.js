const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const {
  getUnreadMail,
  getMailDetails,
  getMessageHeader,
  replyToMessage,
  changeLabel,
  createLabel,
  getLabels,
  labelCreation,
  checkReplied,
} = require("./detailsRoutes/controller.js");

//oauth object
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const mailReply = async (req, res) => {
  setInterval(async () => {
  console.log("Checking for mails");
  oAuth2Client.setCredentials({
    refresh_token: req.session.tokens.refresh_token, //setting oauth credentials
  });
  const { token } = await oAuth2Client.getAccessToken(); //reciving access token
  // res.send("mail");
  console.log("Token Received:" + token);
  try {
    req.session.label = await labelCreation(token); //creation of AUTOREPLY label
    const unReadMails = await getUnreadMail(token); //recieve unread mail thread
    unReadMails.threads.map(async (mail) => {
      const messagesInThread = await getMailDetails(mail.id, token); //decoding each message in thread
      let isReplied = await checkReplied(
        messagesInThread,
        token,
        req.session.user
      ); //to check whether we have replied in the given thread or not

      //to send mail to unread mails threads
      if (!isReplied) {
        const reciever = await getMessageHeader(mail.id, token, "From"); //to get reciever of the thread
        const subject = await getMessageHeader(mail.id, token, "Subject"); //to get subject of the thread
        console.log("Received a mail from:" + reciever[0].value);
        const sendReply = await replyToMessage(
          //to send reply
          mail.id,
          "I am on vacation will get back to you. Thanks",
          req.session.user,
          reciever[0].value,
          subject[0].value,
          token
        );
        console.log("Reply Send:" + reciever[0].value);
        const label = await changeLabel(mail.id, token, req.session.label); //modify the label of current thread
      }
    });

    res.send(
      "Replied to all the unread messages... We will again reply for any unread messages after 45 to 120 seconds"
    );
  } catch (err) {
    res.end(err.message); //to catch any error
  }
  }, Math.round(Math.random() * (120 - 45 + 1) + 45) * 1000);
};

module.exports = { mailReply };
