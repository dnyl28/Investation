const accountSid = "AC0ebb4a20968f697b23749ec6c7e2ecc6";
const authToken = "566d6de1325723b202237ebe99f7ec3d";
const client = require("twilio")(accountSid, authToken);

const sendSMS = (body) => {
  client.messages
    .create({
      body: body.message,
      from: "+61485868295",
      to: body.to,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err));

  //   try {
  //     client.messages
  //       .create({
  //         body: body.message,
  //         from: "+61485868295",
  //         to: body.to,
  //       })
  //       .then((message) => console.log("message", message.sid))
  //       .catch((err) => console.log("errors", err));
  //   } catch (err) {
  //     console.log("errors", err);
  //   }
};

module.exports = { sendSMS };
