export default function ({ store, redirect }) {
  if (!store.state.user || !store.state.user.username) {
    return redirect('/admin/login');
  }
}