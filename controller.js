const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const { oauth2 } = require("googleapis/build/src/apis/oauth2");
const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);
const labelCreation = async (req, res, next) => {
    oAuth2Client.setCredentials({
        refresh_token: req.session.tokens.refresh_token,
    });
    const { token } = await oAuth2Client.getAccessToken();
    try {
        const getAllLabels = await getLabels(token);
        let existLabel = getAllLabels.find((label) => label.name==='AUTOREPLY');
        let labelId;
        if (!existLabel) {
            const createnewLabel = await createLabel(token);
            console.log(createnewLabel)
            labelId=createnewLabel.id;
        }
        else
        labelId=existLabel.id;
        req.session.label=labelId;
        
        // res.send("stop")
        next();
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
};
const mailReply = async (req, res) => {
    oAuth2Client.setCredentials({
        refresh_token: req.session.tokens.refresh_token,
    });
    const { token } = await oAuth2Client.getAccessToken();
    // res.send("mail");
    try {
        const unReadMails = await getUnreadMail(token);
        unReadMails.threads.map(async (mail) => {
            const messagesInThread = await getMailDetails(mail.id, token);
            let isReplied = false;
            console.log(messagesInThread);
            for (i in messagesInThread) {
                
                const messageHeader = await getMessageHeader(
                    messagesInThread[i].id,
                    token,
                    "From"
                );
                if (
                    messageHeader.length &&
                    messageHeader[0].value.includes(req.session.user)
                ) {
                    isReplied = true;
                    break;
                }
            }
            
            if (!isReplied) {
                const reciever = await getMessageHeader(mail.id, token, "From");
                const subject = await getMessageHeader(mail.id, token, "Subject");
                const sendReply = await replyToMessage(
                    mail.id,
                    "On holdidays",
                    req.session.user,
                    reciever[0].value,
                    subject[0].value,
                    token
                );
                console.log(sendReply);

                const label = await changeLabel(mail.id, token,req.session.label);
                console.log(label);
            }
        });
        res.send("done");
    } catch (err) {
        res.send(err.message);
    }
};
const getUnreadMail = async (token) => {
    try {
        const response = await axios.get(
            "https://www.googleapis.com/gmail/v1/users/me/threads?q=is:unread is:inbox category:primary &maxResults=1",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        throw err;
    }
};
const getMailDetails = async (id, token) => {
    try {
        const response = await axios.get(
            ` https://gmail.googleapis.com/gmail/v1/users/me/threads/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    format: "minimal",
                },
            }
        );
        return response.data.messages;
    } catch (err) {
        throw err;
    }
};
const getMessageHeader = async (id, token, metadata) => {
    try {
        const response = await axios.get(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    format: "metadata",
                    metadataHeaders: metadata,
                },
            }
        );
        return response.data.payload.headers;
    } catch (err) {
        throw err;
    }
};
const replyToMessage = async (
    messageId,
    replyMessage,
    sender,
    reciever,
    subject,
    token
) => {
    try {
        const sendResponse = await axios.post(
            "https://www.googleapis.com/gmail/v1/users/me/messages/send",
            {
                threadId: messageId,
                raw: Buffer.from(
                    `From: ${sender}\r\n` +
                    `To: ${reciever}\r\n` +
                    `Subject: Re: ${subject}\r\n` +
                    `Content-Type: text/plain; charset="UTF-8"\r\n` +
                    `Content-Transfer-Encoding: 7bit\r\n\r\n` +
                    `${replyMessage}\r\n`
                ).toString("base64"),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return sendResponse.data;
    } catch (err) {
        throw err;
    }
};
const changeLabel = async (id, token,label) => {

    try {
        const response = await axios.post(
            `https://www.googleapis.com/gmail/v1/users/me/messages/${id}/modify`,
            {
                addLabelIds: [`${label}`],
                removeLabelIds: ["UNREAD"],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
            console.log(response.data);
        return response.data;
    } catch (err) {
        throw err;
    }
};
const createLabel = async (token) => {
    try {
        const response = await axios.post(
            "https://www.googleapis.com/gmail/v1/users/me/labels",
            {  
                name: "AUTOREPLY",
                labelListVisibility: "labelShow",
                messageListVisibility: "show",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (err) {
        console.log(err.message)
        throw err;
    }
};
const getLabels = async (token) => {
    try {
        const response = await axios.get(
            "https://www.googleapis.com/gmail/v1/users/me/labels",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.labels;
    } catch (err) {
        throw err;
    }
};
module.exports = { mailReply, labelCreation };
