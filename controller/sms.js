const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "1c21b92a",
  apiSecret: "BE9J7e7FlV7baasU",
});

export const sms = (number) => {
  const from = "hosp";

  const to = number;
  const text = "welcome to hospital navigation";

  async function sendSMS() {
    await vonage.sms
      .send({ to, from, text })
      .then((resp) => {
        console.log("Message sent successfully");
        console.log(resp);
      })
      .catch((err) => {
        console.log("There was an error sending the messages.");
        console.error(err);
      });
  }

  sendSMS();
};
