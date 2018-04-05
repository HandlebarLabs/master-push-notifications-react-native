const express = require("express");
const bodyParser = require("body-parser");

const Question = require("./models/Question");
const PushNotification = require("./models/PushNotification");

/*
 * Express Bootstrap
 */
const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/*
 * New Question Job
 */
const jobs = require("./util/jobs");
const nextQuestionJob = jobs.createNewQuestionJob();

/*
 * Routes
 */
const formatResponse = require("./helpers/formatResponse");

app.get("/", (req, res) => {
  res.send("Hello to the Trivia API!");
});

app.post("/push/add-token", (req, res) => {
  const data = {
    token: req.body.pushToken,
    platform: req.body.platform,
    timezoneOffset: req.body.timezoneOffset
  };

  return PushNotification.addPushToken({
    token: req.body.pushToken,
    platform: req.body.platform,
    timezoneOffset: req.body.timezoneOffset
  })
    .then(() => formatResponse(res, "success"))
    .catch(error => formatResponse(res, "error", error));
});

app.get("/questions/next", (req, res) => {
  return Question.getNextQuestions()
    .then(questions => {
      const data = {
        nextQuestionTime: nextQuestionJob.nextInvocation(),
        questions
      };

      formatResponse(res, "success", data);
    })
    .catch(error => formatResponse(res, "error", error));
});

app.put("/questions/answer/:questionId", (req, res) => {
  return Question.answerQuestion(req.params.questionId, req.body.answer)
    .then(() => formatResponse(res, "success"))
    .catch(error => formatResponse(res, "error", error));
});

app.get("/questions/asked", (req, res) => {
  return Question.getAskedQuestions()
    .then(questions => {
      const data = {
        questions
      };

      formatResponse(res, "success", data);
    })
    .catch(error => formatResponse(res, "error", error));
});

/*
 * Start Server
 */
app.listen(PORT, () => console.log("server started"));
