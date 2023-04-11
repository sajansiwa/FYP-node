import axios from "axios";

export async function sendPushNotification(props) {
  const { username, token } = props;
  var data = JSON.stringify({
    to: token,
    notification: {
      title: "Incoming Emergency",
      body: `${username} is incoming patient`,
    },
  });

  const config = {
    method: "post",
    url: "https://fcm.googleapis.com/fcm/send",
    headers: {
      Authorization:
        "Bearer AAAAjFWTAOw:APA91bEW5ImSZ-KpP9cSrJIvyuA5Hy6FKsB6qQHLFWQjnMA4KOCk3zoA2jdpmntbcqyZp45j6dffcVW1ba4NH1poh8-3PhMQJ-AN3IfXAXtkHDgLDi0G4UN6dFW2FjK6v-mPELLqlRzR",
      "Content-Type": "application/json",
    },
    data,
  };
  try {
    await axios(config);
    return "Push Notification Sent";
  } catch (error) {
    return "Failed to send Push Notification";
  }
}
