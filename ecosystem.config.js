// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: "e-book-town-server", // The name of your application
      script: "./dist/server.js", // The script to run your application
      instances: "max", // Scale your app to all available CPUs
      exec_mode: "cluster", // Enable clustering mode
      env: {
        NODE_ENV: "development", // Environment variable for development mode
      },
      env_production: {
        NODE_ENV: "production", // Environment variable for production mode
      },
    },
  ],
};
