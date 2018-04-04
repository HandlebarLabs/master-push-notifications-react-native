const schedule = require("node-schedule");
const Question = require("../models/Question");
const PushNotification = require("../models/PushNotification");

const createNewQuestionJob = () => {
  // Run at the top of every hour
  const scheduleRule = "0 * * * *";
  const job = schedule.scheduleJob(scheduleRule, () =>
    Question.setNewQuestion().then(questions => {
      return PushNotification.sendNewNotificationToAll({
        questions,
        nextQuestionTime: job.nextInvocation()
      });
    })
  );

  return job;
};

// const njob = schedule.scheduleJob("0 * * * *", () => null);
// Question.setNewQuestion().then(questions => {
//   return PushNotification.sendNewNotificationToAll({
//     questions,
//     nextQuestionTime: njob.nextInvocation()
//   });
// });

module.exports = {
  createNewQuestionJob
};
