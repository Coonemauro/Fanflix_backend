module.exports = {
  async afterCreate({ params }) {
    console.log("user-email-check [Lifecycle][AfterCrete]" /*, event*/);
    //const { result, params } = event;
    try {
      console.log(`Sending email to ${params.data.email}`);
      await strapi.plugins["email"].services.email.send({
        to: params.data.email,
        //from: "bvtvdev@gmail.com",
        subject: "BVtv - Verification code for order",
        text: `Your code for BVtv verification: ${params.data.code}`,
        //html: "Hello world!",
      });
      console.log("Email sent");
    } catch (err) {
      console.log(err);
    }
  },
};
