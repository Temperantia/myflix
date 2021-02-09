export default function({ route, redirect, store, }) {
  console.log(store.state)
  console.log(route)
  if (store.state.localStorage.cookies["authorized"]) {
    return;
  }
  if (route.query.secret !== "myflix$$1234") {
    return redirect("/newsletter");
  }
  store.commit("localStorage/addCookie", {
    name: "authorized",
    timestamp: Date.now()
  });
}
