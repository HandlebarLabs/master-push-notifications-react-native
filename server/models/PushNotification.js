const Expo = require("expo-server-sdk");
const db = require("../db");

const dbKey = "pushNotifications";

const addPushToken = ({ token, platform, timezoneOffset }) => {
  if (!Expo.isExpoPushToken(token)) {
    return Promise.reject(new Error("Invalid token."));
  }

  return db
    .table(dbKey)
    .where({ token })
    .then(docs => {
      if (docs.length > 0) {
        return Promise.reject(new Error("Push token already registered."));
      }

      return db.table(dbKey).insert({
        token,
        platform,
        timezoneOffset
      });
    });
};

const sendNewNotificationToAll = ({ questions, nextQuestionTime }) => {
  const expo = new Expo();

  return db
    .table(dbKey)
    .then(docs => {
      const messages = [];
      docs.forEach(doc => {
        messages.push({
          to: doc.token,
          sound: "default",
          body: questions[0].question
        });
      });

      return {
        messages
      };
    })
    .then(({ messages }) => {
      const messageChunks = expo.chunkPushNotifications(messages);

      const expoRequests = messageChunks.map(chunk => {
        return expo.sendPushNotificationsAsync(chunk);
      });

      return Promise.all(expoRequests);
    });
};

module.exports = {
  dbKey,
  addPushToken,
  sendNewNotificationToAll
};
