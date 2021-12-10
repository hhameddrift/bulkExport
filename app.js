require('dotenv').config();
const PLAYVOX_INTEGRATION_ID = process.env.PLAYVOX_INTEGRATION_ID;
const convoReporter = require("./Drift/listConvoIds");
const getConvo = require("./Drift/getConversation");
const getDriftAgents = require("./Drift/getDriftAgents.js");

const getConvoMessages = require("./Drift/getMessages");




(async () => {
  let convoList = await convoReporter.convoReport(); //return list of conversation Ids
  
  if (convoList == "no new conversations"){
    console.log("No new conversations to add.");
    return 
  } else if (convoList == "Error retrieving conversations."){
    console.log("Error retrieving conversations.");
    return
  }

  const driftAgents = await getDriftAgents(); //retrieve a hash of ALL DRIFT Agents in this org
  let interactionsArray = [];
  
  for (const convoId of convoList) {

    const convoObject = await getConvo.getConversation(convoId.conversationId); 

    if(convoObject !== "Error"){
      const contactAttributes = await getAttributes(convoObject.data.contactId)// calls drift contact API to get attributes
      const driftMessages = await getConvoMessages(convoId.conversationId);
      const interactionMessages = pvMessagesBuilder(driftAgents,contactAttributes,driftMessages); //returns an array of PV message objects
      const companyName = contactAttributes.employment_name || "null";
      const convoParticipants = participants.getParticipants(convoObject, driftAgents);
      
      let interactionBase = {
        interaction_id: convoId.conversationId.toString(),
        assignee_id: convoParticipants[0], //this will set the interaction owner to the first agent to join the conversation
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
        comments: interactionMessages.comments,
      }
  
      let interaction = {...interactionBase, ...interactionMessages.tags};
      console.log("Interaction id " + interaction.interaction_id + " created.");
      interactionsArray.push(interaction);
    }
  }
  
  console.log(`Total interactions to send to Playvox: ${interactionsArray.length}`);

  //submit interactions-create-bulk job in batches of 100 interactions
  let loopsNeeded = Math.ceil(interactionsArray.length / 100);
  let totalErrors = 0;
  while (loopsNeeded > 0) {
    const bulkLoadResponse = await bulkInteractionCreate(interactionsArray.splice(0,100), PLAYVOX_INTEGRATION_ID);
    
    if (bulkLoadResponse !== "Error"){
      console.log("Bulk interaction job id: " + bulkLoadResponse.data.result._id);
      totalErrors = totalErrors + bulkLoadResponse.data.result.total_failed;
    }
    loopsNeeded--;
  }
  
  console.log("Total interaction creation failures: " + totalErrors);
  console.log("Playvox data transfer complete.");
  console.log("Total time to execute: ");
  console.timeEnd();
})();
