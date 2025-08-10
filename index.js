const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost:" + PORT;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get('/index', (req, res) => {
  res.json('Hello! I am Take Taro!');
});

app.get("/install", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.SLACK_CLIENT_ID);
    params.append("client_secret", process.env.SLACK_CLIENT_SECRET);
    params.append("code", code);
    params.append("redirect_uri", process.env.SLACK_REDIRECT_URI);

    const response = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      body: params
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(400).send(`OAuth failed: ${data.error}`);
    }

    console.log("Access Token:", data.access_token);

    res.send("You authorised succesfully. You can close this tab.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.post('/slack/taketaro', (req, res) => {
  console.log('Start GET /slack/taketaro');
  const randomNumber = Math.floor(Math.random() * 78);
  
  const imageUrl = `${BASE_URL}/${randomNumber}.jpg`;

  res.json({
    response_type: "in_channel",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🎲 Random number: *${randomNumber}*`
        }
      },
      {
        type: "image",
        image_url: imageUrl,
        alt_text: `Number ${randomNumber}`
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Slash Command URL: ${BASE_URL}/slack/taketaro`);
});
