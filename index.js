const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost:" + PORT;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get('/index', (req, res) => {
  res.json('Hello! I am Take Taro!');
});

app.post('/slack/taketaro', (req, res) => {
  console.log('Start /slack/taketaro');
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  console.log(`randomNumber: ${randomNumber}`);
  
  const imageUrl = `${BASE_URL}/${randomNumber}.png`;

  console.log(`imageUrl: ${imageUrl}`);

  res.json({
    response_type: "in_channel",
    text: `Random number: *${randomNumber}*`,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Slash Command URL: ${BASE_URL}/slack/taketaro`);
});
