"use strict";

/**
 * A set of functions called "actions" for `mollie-webhook`
 */

const { createMollieClient } = require("@mollie/api-client");

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

module.exports = {
  webhookController: async (ctx) => {
    try {
      // Extract the ID parameter from the webhook request
      const { id } = ctx.request.body;

      // Fetch the payment status using the Mollie API
      const payment = await mollieClient.payments.get(id);

      console.log(`[mollie webhook] Payment status: ${payment.status}`);

      if (payment.status) {
        await strapi.db.query("api::order.order").update({
          where: { paymentID: id },
          data: {
            paymentStatus: payment.status,
          },
        });
      }

      // Send a response back to Mollie indicating that the webhook has been received
      ctx.send({ received: true });
    } catch (err) {
      console.error(err);
      ctx.throw(400, "Bad Request");
    }
  },
};
