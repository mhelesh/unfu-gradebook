import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// Firebase
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


// Cloud Vision
import * as vision from '@google-cloud/vision';
const visionClient = new vision.ImageAnnotatorClient();

// Dedicated bucket for cloud function invocation
const bucketName = 'unfu-gradebook-cloud-vision';

export const imageTagger = functions.storage
    .bucket(bucketName)
    .object()
    .onChange(async (event: { data: any; }) => {
        const object = event.data;
        const filePath = object.name;

        const imageUri = `gs://${bucketName}/${filePath}`;

        const docId = filePath.split('.jpg')[0];

        const docRef = admin.firestore().collection('photos').doc(docId);

        const results = await visionClient.labelDetection(imageUri);

        const labels = results[0].labelAnnotations.map(obj => obj.description);
        const hotdog = labels.includes('document');

        return docRef.set({ hotdog, labels })
    });
