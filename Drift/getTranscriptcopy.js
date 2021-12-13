var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://driftapi.com/conversations/3216547153/transcript',
  headers: { 
    'Authorization': 'Bearer qQeg0Oy1VLT04x7fka9GrPetDMo3rnH1'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
  debugger
})
.catch(function (error) {
  console.log(error);
});
