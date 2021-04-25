import http from "http";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session"
import dotenv from "dotenv"

import Routes from "./routes";

dotenv.config()

const app = express();
const server = http.createServer(app);

app.use(session({
  secret: 'pekopeko',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 4000);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', "POST, PUT, GET, OPTIONS");
  res.header('Access-Control-Allow-Credentials', 'true')
  next();
});
app.options('*', function (req,res) { res.sendStatus(200); });

Routes(app);

server.listen(app.get('port'), function() {
  console.log('Api server listening on port ' + app.get('port'));
});

export default app;