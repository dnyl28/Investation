let mongoose = require("mongoose");
let Notification = require("../models/Notification");

const sendNotification = ({
  title,
  subTitle,
  type,
  sentTo,
  sentBy = null,
  data = {},
}) => {
  masailSocket.emit("notification" + sentTo);
  console.log(
    "Notification Body---",
    title,
    subTitle,
    type,
    sentTo,
    sentBy,
    data,
  );
  new Notification({
    title,
    subTitle,
    type,
    sentTo,
    sentBy,
    data,
  })
    .save()
    .then((doc) => {
      // TODO check here if user is online
      //   console.log(doc);
    });
};

module.exports = {
  sendNotification,
};
