'use strict';

/**
 * user-email-check service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-email-check.user-email-check');
