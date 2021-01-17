const functions = require("firebase-functions");
const { Nuxt, Builder } = require("./node_modules/nuxt");
const express = require("express");

const app = express();
const nuxtConfig = require("./nuxt.config.js");

const config = {
...nuxtConfig,
  debug: true,
  dev: true,
  buildDir: './.nuxt',
  rootDir: '.'
};

const nuxt = new Nuxt(config);

async function handleRequest(req, res) {
  console.log('req');
  await nuxt.ready();

  const result = await nuxt.renderRoute(req.path); // Returns { html, error, redirected }
  console.log(result);
  res.send(result.html);
}

app.get("*", handleRequest);
app.use(handleRequest);
app.listen(8000);
exports.nuxtssr = functions
  .runWith({ timeoutSeconds: 300 })
  .https.onRequest(app);
