module.exports = {
  routes: [
    {
      method: "POST",
      path: "/mollie-webhook",
      handler: "mollie-webhook.webhookController",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
