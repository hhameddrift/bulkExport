const PLAYVOX_BASE64_KEY = process.env.PLAYVOX_BASE64_KEY
const axios = require('axios');
const headers = {
  'Authorization': `Basic ${PLAYVOX_BASE64_KEY}`,
  'Content-Type': 'application/json'
}

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'ExportFiles.csv',
    header: [
        {id: 'convo_id', title: 'convo_id'},
        {id: 'assignee_id', title: 'assignee_id'},
        {id: 'link_to_full_conversation', title: 'link_to_full_conversation'},
        {id: 'company_name', title: 'company_name'},
        {id: 'updatedat_date', title: 'updatedat_date'},
        {id: 'createdat_date', title: 'createdat_date'},
        {id: 'participant', title: 'participant'},
        {id: 'comments', title: 'total_messages'}
    ]
});

const csvCreate = async (interactions, intId) => {
  let responses = [];
  const url = `https://drift.playvox.com/api/v1/integrations/${intId}/bulk/interactions`;
  
  const body = JSON.stringify(interactions);

  return axios
      .post(url, body, {headers: headers})
      .then((res) => {
        return res;
      })
      .catch(err => {
        console.log(`\x1b[41m%s\x1b[0m`, "Error sending interactions to Playvox.");
        console.log("ERR HITTING URL ---> " + err.config.url);
        console.log("ERR CODE ---> " + err.response.status);
        console.log("ERR DATE ---> " + err.response.headers.date);
        console.log("ERR MSG ---> " + err.message);
        return "Error";
      })
}

module.exports = csvCreate;


