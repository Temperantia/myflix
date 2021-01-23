const functions = require("firebase-functions");
const { Nuxt } = require("./node_modules/nuxt");
const express = require("express");

const app = express();

const config = {
  debug: true,
  dev: true
};

const nuxt = new Nuxt(config);

async function handleRequest(req, res) {
  await nuxt.ready();
  res.set("Cache-Control", "public, max-age=1, s-maxage=1");

  await nuxt.render(req, res);
}

app.get("*", handleRequest);
app.use(handleRequest);
exports.nuxtssr = functions
  .runWith({ timeoutSeconds: 300 })
  .https.onRequest(app);
