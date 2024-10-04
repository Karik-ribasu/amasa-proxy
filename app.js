const express = require("express");
const cors = require("cors");
const queue = require('express-queue');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getSwapData(requests) {
  const token = process.env.ONE_INCH_TOKEN;
  const result = [];
  try {
    for (let request of requests) {
      const { srcToken, dstToken, amount, from } = request;
      const query = `https://api.1inch.dev/swap/v6.0/42161/swap?src=${srcToken}&dst=${dstToken}&amount=${amount.toString()}&from=${from}&slippage=${2}&receiver=${from}&disableEstimate=true&compatibility=true`;
      const response = await fetch(query, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      await delay(1000);
      const data = await response.json();
      result.push(data);
    }
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

app.post("/1inch/swap-data", (req, res) => {
  const { args } = req.body;
  try {
    getSwapData(args).then((result) => res.json({ data: result }));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

const server = app.listen(port, () => console.log(`listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
