module.exports = {
  async beforeUpdate({ params }) {
    //console.log("talent [Lifecycle][beforeUpdate]", params);
    const accepted = params.data.enrollAccepted;
    if (accepted) {
      const talent = await strapi.query("api::talent.talent").findOne({
        where: { id: params.where.id },
        populate: ["users_permissions_user"],
      });

      if (!talent.enrollAccepted) {
        // talent enroll accepted by admin
        console.log("enrollAccepted > talent:", talent);
        const talentEmail = talent.users_permissions_user.email;
        try {
          console.log(`Sending enroll accepted email to ${talentEmail}`);
          await strapi.plugins["email"].services.email.send({
            to: talentEmail,
            //from: "bvtvdev@gmail.com",
            subject: "BVtv - Talent request accepted",
            text: `Congrats, you can login to bvstudio and continue boarding. ${process.env.STUDIO_URL}/dashboard`,
            //html: "Hello world!",
          });
          console.log("Email sent");
        } catch (err) {
          console.log(err);
        }
      }
    }
    const activateRequestAccepted = params.data.activateRequestAccepted;
    if (activateRequestAccepted) {
      const talent = await strapi.query("api::talent.talent").findOne({
        where: { id: params.where.id },
        populate: ["users_permissions_user"],
      });

      if (talent.activateRequestAccepted === false) {
        // talent activate request accepted by admin
        console.log("activateRequestAccepted > talent:", talent);
        if ( talent.users_permissions_user && talent.users_permissions_user.email) {
          const talentEmail = talent.users_permissions_user.email;
          try {
            console.log(
              `Sending activate request accepted email to ${talentEmail}`
            );
            await strapi.plugins["email"].services.email.send({
              to: talentEmail,
              //from: "bvtvdev@gmail.com",
              subject: "BVtv - Profile activation request accepted",
              text: `Congrats, your profile activation request was accepted. Log into studio and check out your profile ${process.env.STUDIO_URL}/dashboard`,
              //html: "Hello world!",
            });
            console.log("Email sent");
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  },
  /*async afterFindOne({ result}) {
    console.log("talent [Lifecycle][afterFindOne]", result);

    var viewCountIncrease = 0
    if (result.viewCount) {
      viewCountIncrease = result.viewCount + 1
    } else {
      viewCountIncrease = 1
    }

    console.log(viewCountIncrease)
  }*/
};
