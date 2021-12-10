// retrieve all conversations over a set period of time
require('dotenv').config()
const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN
const axios = require('axios');
const url = 'https://driftapi.com/reports/conversations'
const headers = {
  'Authorization': `Bearer ${DRIFT_AUTH_TOKEN}`,
  'Content-Type': 'application/json'
}

const now = new Date().getTime();

const data = JSON.stringify({
  "filters": [
    {
      "property": "status",
      "operation": "IN",
      "values": [
        "closed"
      ]
    },
    {
      "property": "lastAgentId",
      "operation": "HAS_PROPERTY"
    },
    {
      "property": "updatedAt",
      "operation": "BETWEEN",
      "values": [

        //now-(1000*60*60*24*10),  //ensure this aligns with timer settings to run app.js
       // now
        "2021-09-02",
        "2021-09-03"
      ]
    }
  ],
  "metrics": [
    "createdAt",
    "lastAgentId",
    "endUserId",
    "timeToCloseMillis",
    "numAgentMessages",
    "numBotMessages",
    "numEndUserMessages"
  ]
});

const convoReport = async () => {
  return axios
      .post(url, data, {headers: headers})
      .then((res) => {
        console.log("Number of Drift conversations returned: " + res.data.count);
        let fullResponse = (res.data);
        let conversations = [];

        if(fullResponse.count == 0) {
          return "no new conversations";
        };

        fullResponse.data.forEach(conversation => {
          conversations.push({
            conversationId: conversation.conversationId,
            metrics: conversation.metrics
          })
        })
        return conversations
              
      })
      .catch(err => {
        console.log("ERR HITTING URL ---> " + err.config.url);
        console.log("ERR CODE ---> " + err.response.status);
        console.log("ERR DATE ---> " + err.response.headers.date);
        console.log("ERR MSG ---> " + err.message);
        return "Error retrieving conversations."
      })
}

module.exports = {
  convoReport
};

// (async ()=> {
//   let result = await convoReport();
//   debugger
//   console.log(result);
// })();