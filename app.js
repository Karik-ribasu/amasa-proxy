const express = require("express");
const cors = require("cors")
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors())

async function getSwapData({
  srcToken,
  dstToken,
  amount,
  from,
  slippage = 1,
}) {
  const token = process.env.ONE_INCH_TOKEN;
  const query = `https://api.1inch.dev/swap/v6.0/42161/swap?src=${srcToken}&dst=${dstToken}&amount=${amount.toString()}&from=${from}&slippage=${slippage}&receiver=${from}&disableEstimate=true&compatibility=true`;
  try {
    const response = await fetch(query, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json"
      },
    });
    const data = await response.json()
    console.log(data)
    return data;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

app.post("/1inch/swap-data", async (req, res) => {
  const { srcToken, dstToken, amount, from } = req.body;
  console.log({ srcToken, dstToken, amount, from })
  try {
    const data = await getSwapData({ srcToken, dstToken, amount, from });
    res.json({ data });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error });
  }
});

const server = app.listen(port, () =>
  console.log(`listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
