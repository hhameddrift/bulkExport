require('dotenv').config()
const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("axios");
const baseUrl = "https://driftapiqa.com/conversations/";
const headers = {
  Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

const getConversation = async (conversationId) => {
  return axios
    .get(baseUrl + conversationId, { headers: headers })
    .then((res) => {
      let convoObject = res.data;
      return convoObject;
    })
    .catch((err) => {
      console.log("Error fetching conversation data for conversation " + conversationId);
      console.log("ERR HITTING URL ---> " + err.config.url);
      console.log("ERR CODE ---> " + err.response.status);
      console.log("ERR DATE ---> " + err.response.headers.date);
      console.log("ERR MSG ---> " + err.message);
      return "Error"
    });
};

module.exports = {
  getConversation,
};
