const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

async function getSwapData({
  srcToken,
  dstToken,
  amount,
  from,
  slippage = 1,
}) {
  const token = process.env.ONE_INCH_TOKEN;
  const query = `https://api.1inch.dev/swap/v6.0/42161/swap?src=${srcToken}&dst=${dstToken}&amount=${amount.toString()}&from=${from}&slippage=${slippage}&receiver=${from}&disableEstimate=true&compatibility=true`;
  console.log(query)
  console.log(token)
  try {
    const response = await fetch(query, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json"
      },
    });
    
    return response.json();
  } catch (error) {
    console.log(error)
    throw error;
  }
}

app.post("/swap-data", async (req, res) => {
  const { srcToken, dstToken, amount, from } = req.body;
  console.log({ srcToken, dstToken, amount, from })
  try {
    res.set('Access-Control-Allow-Origin', '*')
    const data = await getSwapData({ srcToken, dstToken, amount, from });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
