const express = require('express');
const morgan = require('morgan');
const config =require ('./config/config.json');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.get('/',function(req,res){
  res.json({
      message:'Hello from sakila API'
  });
})

app.use('/auth',require('./routes/auth.route'));
app.use('/user',require('./routes/user.route'));
app.use('/student',require('./routes/student.route'));

const PORT = config.PORT;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
});