const express = require("express");
const bodyParser = require("body-parser");
const { Expo } = require("expo-server-sdk");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/sendpushnotifications", (req, res) => {
  try {
    const payload = req.body;

    let expo = new Expo();
    let messages = [];

    for (let pushToken of payload) {
      messages.push({
        to: pushToken.to,
        body: pushToken.body,
        title: pushToken.title
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(PORT, function() {
  console.log(`Server listening on port: ${PORT}`);
});