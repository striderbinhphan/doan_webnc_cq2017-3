
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();

const app = express();


require('express-async-errors') ;
const path = require('path')
const {userGuard, lecturerGuard} = require('./middlewares/auth.mdw')
app.use(express.json());
app.use(cors())
app.use(morgan('dev'));
app.get('/',function(req,res){
  res.json({
      message:'Hello from Online Courses API'
  });
})
app.use('/uploads',express.static(path.resolve(__dirname, './uploads')));
//work
app.use('/auth',require('./routes/auth.route'));
//work
app.use('/courses',require('./routes/course.route'));

app.use('/subcribers',require('./routes/coursesubscribe.route'));
//work
app.use('/sections',require('./routes/section.route'));
//work
app.use('/users',require('./routes/user.route'));
//work
app.use('/videos',require('./routes/video.route'));
//work
app.use('/watchlists',require('./routes/watchlist.route'));

app.use("/category",require ("./routes/category.route"));

app.use("/reviews", require("./routes/review.route"))
app.use("/cart", require("./routes/cart.route"))


app.use('/err',function(req,res){
  throw new Error('Error!');
})
app.use((req,res,next)=>{
  res.status(400).json({
    error: "endpoint not found!"
  });
})
app.use((err,req,res,next)=>{
  console.error(err.stack)
  res.status(500).json({error_message:"something_broke"});
})

const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
      origin: "*",
  }
}); 
server.listen(3030, () => {
  console.log('Socket Server đang chay tren cong 3000');
})
// nhớ thêm cái cors này để tránh bị Exception nhé :D  ở đây mình làm nhanh nên cho phép tất cả các trang đều cors được. 


socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
console.log("New client connected" + socket.id); 

socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
  console.log(data);
  socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
})

socket.on("disconnect", () => {
  console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
});
});

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
});
