const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "ExportFiles.csv",
  header: [
    { id: "convo_id", title: "convo_id" },
    { id: "assignee_id", title: "assignee_id" },
    { id: "link_to_full_conversation", title: "link_to_full_conversation" },
    { id: "company_name", title: "company_name" },
    { id: "updatedat_date", title: "updatedat_date" },
    { id: "createdat_date", title: "createdat_date" },
    { id: "participant", title: "participant" },
    { id: "comments", title: "total_messages" },
  ],
});

const csvCreate = async (interactions) => {
  const body = JSON.stringify(interactions);

  return csvWriter
    .writeRecords(body)
    .then(() => console.log("Data uploaded into csv successfully"))
    .catch((err) => {
      console.log("Error exporting conversations to CSV.");

      return "Error exporting conversations to CSV.";
    });
};

module.exports = csvCreate;
