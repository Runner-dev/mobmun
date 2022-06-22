import * as functions from "firebase-functions";
import { google } from "googleapis";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

function getAuthClient(accessToken: string) {
  const client = new google.auth.OAuth2();
  client.setCredentials({ access_token: accessToken });
  return client;
}

export const uploadFile = functions.https.onCall((data, context) => {
  const googleAuth = getAuthClient(token);

  invariant(typeof fileId === "string", "fileId is required");
  const writeStream = await firebaseAdmin
    .storage()
    .bucket()
    .file(`documents/${id}.html`)
    .createWriteStream();
  const readable = await drive.files.export(
    {
      fileId: fileId,
      mimeType: "text/html",
      auth: googleAuth,
    },
    { responseType: "stream" }
  );

  await new Promise((resolve, reject) => {
    readable.data.pipe(writeStream).on("finish", resolve).on("error", reject);
  });
});
