const { createMollieClient } = require("@mollie/api-client");
const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

module.exports = {
  async beforeCreate(event) {
    console.log("order [Lifecycle][BeforeCrete]" /*, event*/);
    const { params } = event;

    const talent = await strapi.entityService.findOne(
      "api::talent.talent",
      params.data.talent,
      {
        fields: ["name", "price"],
      }
    );

    try {
      const payment = await mollieClient.payments.create({
        amount: {
          currency: "EUR",
          value: `${params.data.payedAmount}.00`, // You must send the correct number of decimals, thus we enforce the use of strings
        },
        description: `Order video for ${talent.name} - ${params.data.orderID}`,
        redirectUrl: `${process.env.FRONTEND_URL}/order/${params.data.orderID}`,
        webhookUrl: `${process.env.BACKEND_URL}/api/mollie-webhook`,
        metadata: {
          order_id: `${params.data.orderID}`,
        },
      });
      //console.log("payment LINKS");
      //console.log(payment._links);

      params.data.checkoutURL = payment.getCheckoutUrl();
      params.data.paymentID = payment.id;

      console.log(params.data);
    } catch (error) {
      console.warn(error);
    }
  },

  async afterUpdate(event) {
    console.log("order [Lifecycle][AfterUpdate]"/*, event*/);
    const { result, params } = event;

    // payment status changed for open order (typically mollie webhook changed it)
    if (result.paymentStatus != "open" && result.status === "open") {
      console.log(
        `Sending payment status change email to user: ${result.userEmail}`
      );
      try {
        await strapi.plugins["email"].services.email.send({
          to: result.userEmail,
          subject: "BVtv - Order information",
          text: `Payment status changed to ${result.paymentStatus} for your order #${result.orderID}. We'll email you once your order is ready. You can check back on your order at ${process.env.FRONTEND_URL}/order/${result.orderID}`,
        });
      } catch (err) {
        console.log(err);
      }

      // if paid, then set order to new so it shows up for talent, otherwise pazmentError
      const order = await strapi.entityService.update("api::order.order", result.id, {
        data: {
          status: result.paymentStatus === "paid" ? "new" : "paymentError"
        },
        populate: ["talent.users_permissions_user"],
      });

      // if payment is paid for an open order: notify talent
      if (result.paymentStatus === "paid") {
        const talentEmail = order.talent.users_permissions_user.email;
        console.log(
          `order status "new" -> Sending email to talent: ${talentEmail}`
        );
        try {
          await strapi.plugins["email"].services.email.send({
            to: talentEmail,
            subject: "BVtv - New Order is waiting for you",
            text: `Check out your new order #${result.orderID} at bvstudio. ${process.env.STUDIO_URL}/orders/edit/${result.id}`,
          });
        } catch (err) {
          console.log(err);
        }
      }
    }

    // talent has set the order complete
    if (result.status == "complete") {
      var completeOrderCountIncrease = 0;

      console.log(`order complete -> Sending email to ${result.userEmail}`);
      try {
        await strapi.plugins["email"].services.email.send({
          to: result.userEmail,
          subject: "BVtv - Order complete",
          text: `Your video for order #${result.orderID} is ready at ${process.env.FRONTEND_URL}/order/${result.orderID}`,
        });
        console.log("Email sent");
      } catch (err) {
        console.log(err);
      }
    }
  },
};
