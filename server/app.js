require("express-async-errors");
const express = require('express');
const app = express();
app.use(express.json());



app.use((req, res, next) =>{
  console.log(`METHOD: ${req.method}`);
  console.log(`URL: ${req.url}`);
  res.on("finish", ()=>{
    console.log(`STATUS CODE: ${res.statusCode}`);
  })
  next();
})

const dogRouter = require("./routes/dogs");
app.use("/dogs", dogRouter);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

app.use("/static", express.static("assets"));

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});



// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use((req, res, next) => {
  let err = new Error("The requested resource could not be found.");
  err.statusCode = 405;
  next(error);
})

app.use((err, req, res) => {
  res.statusCode = err.statusCode;
  let resBody = {
    message: err.message || "Something went wrong",
    statusCode: res.statusCode || 500
  }

  if (environment === "DEVELOPMENT"){
    resBody.stack = err.stack;
  }
  res.json(resBody);
})



const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "DEVELOPMENT";
app.listen(port, () => console.log('Server is listening on port', port));
