const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const SHOPIFY_API_KEY = process.env.43e5a73a21d0e9b804044451bdc04c1b;
const SHOPIFY_API_PASSWORD = process.env.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;
const SHOPIFY_STORE_URL = process.env.f6f2e6-7c.myshopify.com;

app.post("/wati-reply", async (req, res) => {
  const message = req.body.message?.text?.body?.toLowerCase();
  const phone = req.body.wa_id;

  if (message === "yes") {
    try {
      const response = await axios.get(
        `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_PASSWORD}@${SHOPIFY_STORE_URL}/admin/api/2023-01/orders.json?financial_status=any`
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

module.exports = app;
