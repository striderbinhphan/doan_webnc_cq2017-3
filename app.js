const express = require('express');
const config =require ('./config/config.json');



const app = express();

const PORT = config.PORT;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
});