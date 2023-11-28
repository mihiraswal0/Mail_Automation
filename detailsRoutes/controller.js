const axios = require("axios");
require("dotenv").config();

// to check for label and creation of AUTOREPLY labels
const labelCreation = async (token) => {
  try {
    const getAllLabels = await getLabels(token);
    let existLabel = getAllLabels.find((label) => label.name === "AUTOREPLY");
    let labelId;
    if (!existLabel) {
      const createnewLabel = await createLabel(token);
      labelId = createnewLabel.id;
    } else labelId = existLabel.id;
    return labelId;
  } catch (err) {
    throw err;
  }
};

// to fetch all the unreadMails
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

//to fetch mail details of each thread
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

// to fetch headers from a message thread
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
//to reply to a message thread
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

//to change label for a message
const changeLabel = async (id, token, label) => {
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
    return response.data;
  } catch (err) {
    throw err;
  }
};

// to create a new label
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
    console.log(err.message);
    throw err;
  }
};
// to get all labels
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

// to check whether the user had replied to a message
const checkReplied = async (messagesInThread,token,userMail) => {
  for (i in messagesInThread) {
    const messageHeader = await getMessageHeader(
      messagesInThread[i].id,
      token,
      "From"
    );
    if (
      messageHeader.length &&
      messageHeader[0].value.includes(userMail)
    ) {
      return true;
      break;
    }
  }
  return false;
};

module.exports = {
  getUnreadMail,
  getMailDetails,
  getMessageHeader,
  replyToMessage,
  changeLabel,
  createLabel,
  getLabels,
  labelCreation,
  checkReplied,
};
