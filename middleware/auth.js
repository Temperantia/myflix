// TODO: shit happens on reload, the localStorage is not ready
export default function({ store, redirect }) {
  if (!store.state.localStorage.connected) {
    return redirect("/sign-in");
  }
}
