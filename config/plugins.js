module.exports = ({ env }) => ({
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        talent: {
          field: 'slug',
          references: 'name',
        },
      },
    },
  },
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "noreply@bvtv.app",
        defaultReplyTo: "noreply@bvtv.app",
      },
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  "netlify-deployments": {
    enabled: true,
    config: {
      accessToken: env('NETLIFY_DEPLOYMENTS_PLUGIN_ACCESS_TOKEN'),
      sites: [
        {
          name: 'bvtvfront',
          id: "719de365-3cf6-4614-b201-4e8134def0b1",
          buildHook: "https://api.netlify.com/build_hooks/656ced1ecb669e49665bbe8d",
        }
      ]
    },
  },    
});
