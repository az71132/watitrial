const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json()); 

app.post("/wati-reply", async (req, res) => {
  try {
    console.log("Received webhook payload:", JSON.stringify(req.body, null, 2));
    const message = req.body.message?.text?.body?.toLowerCase();
    const phone = req.body.wa_id;

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;

app.post("/wati-reply", async (req, res) => {
  const message = req.body.message?.text?.body?.toLowerCase();
  const phone = req.body.wa_id;

  if (message === "yes") {
    try {
      const response = await axios.get(
        `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_PASSWORD}@${SHOPIFY_STORE_URL}/admin/api/2023-01/orders.json?financial_status=any&limit=10&order=created_at desc`
      );


      const matchedOrder = response.data.orders.find((order) =>
        order.phone?.includes(phone)
      );

      if (matchedOrder) {
        await axios.put(
          `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_PASSWORD}@${SHOPIFY_STORE_URL}/admin/api/2023-01/orders/${matchedOrder.id}.json`,
          {
            order: {
              id: matchedOrder.id,
              tags: "Confirmed on WhatsApp",
            },
          }
        );
        return res.status(200).send("Order confirmed.");
      } else {
        return res.status(404).send("Order not found.");
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error processing order.");
    }
  } else {
    return res.status(200).send("No action taken.");
  }
});

const serverless = require("serverless-http");
module.exports = serverless(app);
