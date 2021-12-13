const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const date = new Date()

const csvWriter = createCsvWriter({
  path: "./ExportFiles/"+"DriftCSV-"+date+".csv",
  header: [
    { id: "convo_id", title: "convo_id" },
    { id: "assignee_id", title: "assignee_id" },
    { id: "link_to_full_conversation", title: "link_to_full_conversation" },
    { id: "company_name", title: "company_name" },
    { id: "updatedat_date", title: "updatedat_date" },
    { id: "createdat_date", title: "createdat_date" },
    { id: "participant", title: "participant" },
    { id: "transcriptObject", title: "transcriptObject" },
    { id: "total_messages", title: "total_messages" },
  ],
});

const csvCreate = async (interactions) => {
  const body = (interactions);
console.log(typeof body)
// debugger


  return csvWriter
    .writeRecords(body)
    .then(() => console.log("Data uploaded into csv successfully"))
    .catch((err) => {
      console.log("Error exporting conversations to CSV.");

      return "Error exporting conversations to CSV.";
    });
};

module.exports = csvCreate;
