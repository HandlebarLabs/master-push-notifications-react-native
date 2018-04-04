const schedule = require("node-schedule");
const Question = require("../models/Question");

const createNewQuestionJob = () => {
  // Run at the top of every hour
  const scheduleRule = "0 * * * *";
  const job = schedule.scheduleJob(scheduleRule, () =>
    Question.setNewQuestion()
  );

  return job;
};

module.exports = {
  createNewQuestionJob
};
