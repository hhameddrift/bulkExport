
const getParticipants = (convoObj, driftAgents) => {

  if (!convoObj.data.participants  || convoObj.data.participants.length == 0){

    console.log("Error retrieving participants list from conversation id: " + convoObj.data.id);
    return ["Error retrieving participant(s)"];
  }

  let participants = [];

  convoObj.data.participants.forEach(id => {
    if(driftAgents[id]){
      participants.push(driftAgents[id].email.toLowerCase());
    } else {
      participants.push("Unknown Participant")
    }
  });
  return participants;
};

module.exports = {
  getParticipants,
};
