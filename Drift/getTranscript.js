require('dotenv').config()
const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("axios");
const baseUrl = "https://driftapi.com/conversations/";
const headers = {
  Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

const getTranscript = async (conversationId) => {
  return axios
    .get(baseUrl + conversationId + "/transcript", { headers: headers })
    .then((res) => {
      let transcript = (res.data) ;
      
      return transcript;
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
  getTranscript,
};

