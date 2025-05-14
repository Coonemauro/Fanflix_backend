"use strict";
/**
 * talent controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::talent.talent", ({ strapi }) => ({
  async findOne(ctx) {
    const response = await super.findOne(ctx);
    //console.log(ctx.request.header.origin)
    // TODO: filter frontend requests better than this
    if (ctx.request.header.origin === undefined) {
      //console.log("talent [FRONTEND][Controller][findOne]", response);

      var viewCountIncrease = 0;
      if (response.data.attributes.viewCount) {
        viewCountIncrease = response.data.attributes.viewCount + 1;
      } else {
        viewCountIncrease = 1;
      }

      await strapi.entityService.update(
        "api::talent.talent",
        response.data.id,
        {
          data: {
            viewCount: viewCountIncrease,
          },
        }
      );
    }
    return response;
  },
}));
