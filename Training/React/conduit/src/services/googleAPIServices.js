import { gapi } from "gapi-script";

export const initGoogleAPI = () => {
  gapi.client.init({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    scope: "",
  });
};
