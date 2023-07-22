const Hapi = require("@hapi/hapi");
const routes = require("./routes");

// Immediately Invoked Function Expression (IIFE)
(async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
  });

  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
})();
