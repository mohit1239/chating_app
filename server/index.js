const socketIO =require( "socket.io");
const express =require( "express");

const dotenv =require( "dotenv");
dotenv.config();

const mongoConnect =require( './config/mongo');
const Message =require( './models/message');
/**
 *
 * @returns {Promise<void>}
 */
const initApp = async () =>{
  try{
    await mongoConnect();
    console.log("DB connection established");
    app.listen(process.env.HTTP_PORT,()=>console.log(`HTTP Server listening on ${process.env.HTTP_PORT}`));
  }catch (e) {
    throw e;
  }
}

initApp().catch(err => console.log(`Error on startup! ${err}`));

const io = socketIO(process.env.SOCKET_PORT);
const app = express();

io.on("connection", (socket) =>{
  console.log("Connection established");

  
  getMostRecentMessages()
    .then(results => {
      socket.emit("mostRecentMessages", results.reverse());
    })
    .catch(error => {
      socket.emit("mostRecentMessages", []);
    });


  socket.on("newChatMessage",(data) => {
    //send event to every single connected socket
    try{
      const message = new Message(
        {
          user_name: data.user_name,
          user_avatar: data.user_avatar,
          message_text: data.message,
        }
      )
      message.save().then(()=>{
        io.emit("newChatMessage",{user_name: data.user_name, user_avatar: data.user_avatar, message_text: data.message});
      }).catch(error => console.log("error: "+error))
    }catch (e) {
      console.log("error: "+e);
    }
  });
  socket.on("disconnect",()=>{
    console.log("connection disconnected");
  });
});

/**
 * get 10 last messages
 * @returns {Promise<Model[]>}
 */
async function getMostRecentMessages (){
  return await Message
    .find()
    .sort({_id:-1})
    .limit(10);
}




