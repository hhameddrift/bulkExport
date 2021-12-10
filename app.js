require('dotenv').config();
const PLAYVOX_INTEGRATION_ID = process.env.PLAYVOX_INTEGRATION_ID;
const convoReporter = require("./Drift/listConvoIds");
const getConvo = require("./Drift/getConversation");
const getChatAgents = require("./Drift/getChatAgents.js");
const csvCreate = require("./CSVWriter/csvCreate.js");

const getConvoMessages = require("./Drift/getMessages");


console.time();


(async () => {
  let convoList = await convoReporter.convoReport(); //return list of conversation Ids
  
  // Handle error due to no new conversation captured within a specific timeline 
  if (convoList == "no new conversations"){
    console.log("No new conversations to add.");
    return 
  } else if (convoList == "Error retrieving conversations."){
    console.log("Error retrieving conversations.");
    return
  }

  const chatAgents = await getChatAgents(); //retrieve a hash of ALL Chat Agents in this org
  
  for (const convoId of convoList) {

    const convoObject = await getConvo.getConversation(convoId.conversationId); 

    if(convoObject !== "Error"){
      const driftMessages = await getConvoMessages(convoId.conversationId);
      const convoParticipants = participants.getParticipants(convoObject, chatAgents);
      
      //Fields that can be added to the CSV file
      let convoBase = {
        convo_id: convoId.conversationId.toString(),
        assignee_id: convoParticipants[0], //this will set the convo owner to the first agent to join the conversation
        link_to_full_conversation: 'https://app.drift.com/conversations/' + convoId.conversationId,
        company_name: companyName,
        updatedat_date: new Date(convoObject.data.updatedAt).toISOString().slice(0,-5)+"Z",
        createdat_date: new Date(convoObject.data.createdAt).toISOString().slice(0,-5)+"Z",
        status: convoObject.data.status,
        participant: convoParticipants.join(", "),
        total_messages: convoId.metrics.slice(4,7).reduce((a,b)=> a+b ),
        num_agent_messages: convoId.metrics[4],
        num_bot_messages: convoId.metrics[5],
        num_end_user_messages: convoId.metrics[6],
        comments: convoMessages.comments,
      }
  
      let convo = {...convoBase, ...convoMessages.tags};
      console.log("convo id " + convo.convo_id + " created.");
      convosArray.push(convo);
    }
  }
  
  console.log(`Total convos to send to CSV File: ${convosArray.length}`);

  //submit convos-create-bulk job in batches of 100 convos
  let loopsNeeded = Math.ceil(convosArray.length / 100);
  let totalErrors = 0;
  while (loopsNeeded > 0) {
    const bulkExportResponse = await csvCreate(convosArray.splice(0,100));
    
    if (bulkExportResponse !== "Error"){
      console.log("Bulk convo export error. Check your code" )
      // console.log("Bulk convo job id: " + bulkExportResponse);
    }
    loopsNeeded--;
  }
  
  console.log("Total convo creation failures: " + totalErrors);
  console.log("Data Export is complete.");
  console.log("Total time to execute: ");
  console.timeEnd();
})();



// Import csv-writer
import csvwriter from 'csv-writer'

var createCsvWriter = csvwriter.createObjectCsvWriter

// Passing the column names intp the module
const csvWriter = createCsvWriter({

// Output csv file name is geek_data
path: 'geek_data.csv',
header: [

	// Title of the columns (column_names)
	{id: 'id', title: 'ID'},
	{id: 'name', title: 'NAME'},
	{id: 'age', title: 'AGE'},
]
});

// Values for each column through an array
const results = [
{
	id: '7058',
	name: 'Sravan Kumar Gottumukkala',
	age: 22
}, {
	id: '7004',
	name: 'Sudheer',
	age: 29
}, {
	id: '7059',
	name: 'Radha',
	age: 45
},{
	id: '7060',
	name: 'vani',
	age: 34
}
	
];
// Writerecords function to add records
csvWriter.writeRecords(results)
.then(()=> console.log('Data uploaded into csv successfully'));
