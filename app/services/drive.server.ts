import { google } from "googleapis";
const drive = google.drive({
  version: "v3",
  auth: "AIzaSyBhMJ1Yfit29OjNmVFItjxtpwZexeB9MGI",
});

export default drive;
