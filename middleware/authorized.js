export default function({ app, route, redirect }) {
  if (app.$cookies.get("authorized")) {
    return;
  }
  if (route.query.secret !== "myflix$$1234") {
    return redirect("/newsletter");
  }
  app.$cookies.set("authorized", true);
}
