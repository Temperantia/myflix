export default function({ route, redirect, $cookies }) {
  if ($cookies.get("authorized")) {
    return;
  }
  if (route.query.secret !== "myflix$$1234") {
    return redirect("/newsletter");
  }
  $cookies.set("authorized", true);
}
