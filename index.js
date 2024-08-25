import { createRestAPIClient } from "masto";
// import fetch from 'node-fetch';
import express from 'express';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import cookieSession from 'cookie-session';
import path from 'path';
import { fileURLToPath } from 'url';


const appRoot = process.env.APP_ROOT || "localhost:5000";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(__dirname + '/web'));
// app.use(bodyParser.json());
// app.use(cookieParser);
// app.use(cookieSession({secret:'refulgenceherringglueeffluent'}));


const masto = createRestAPIClient({
    url: 'https://indieweb.social/',
    accessToken: process.env.MASTOTOKEN,
  });
  
//   const status = await masto.v1.statuses.create({
//     status: "testing #noterlive for masto",
//     visibility: "public",
//   });
  
  app.get('/sendtoot', function(req, res, next) {
    console.log("sendtoot: " + req.query.status +" lastid:"+ req.query.lastid );
    const op={};
    const params = {
      status: req.query.status,
      visibility: "public",
    }
    if (req.query.lastid>0){
    params.in_reply_to_id= req.query.lastid;
    }
    op.err="";
    if (!req.query.status) {
      op.response="No status"
      res.send(JSON.stringify(op,null,2))
    }
    else {
      return masto.v1.statuses.create(params).then((result)=>{
        op.response="tooted at "+result.url
        op.result=result;
        res.send(JSON.stringify(op,null,2))
      }) .catch(err =>{
        //catch err 
        console.log(err);
        op.err = err.statuscode;
        op.response="<pre>"+JSON.stringify(err,null,'')+"</pre>";
        res.send(JSON.stringify(op,null,2))
      })
    }
  });
// console.log(status.url);

var port = process.env.PORT || 5001;
app.listen(port, function() {
  console.log("Listening on " + port);
});
