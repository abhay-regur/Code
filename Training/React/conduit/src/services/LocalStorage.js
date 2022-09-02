export const LocalStorage = {
  get(token) {
    return localStorage.getItem(token);
  },
  set(token) {
    return localStorage.setItem("jwtToken", token);
  },
  delete(token) {
    return localStorage.removeItem(token);
  },
};
