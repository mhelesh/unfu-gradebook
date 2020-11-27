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
admin.initializeApp();

// Cloud Vision
import * as vision from '@google-cloud/vision';
const visionClient = new vision.ImageAnnotatorClient();

const bucketName = 'unfu-gradebook-cloud-vision';

export const imageTagger = functions.storage
    .bucket(bucketName)
    .object()
    .onFinalize(async (object, context) => {
        const filePath = object.name || '';

        const imageUri = `gs://${bucketName}/${filePath}` || '';

        const docId = filePath?.split('.jpg')[0];

        const docRef = admin.firestore().collection('cloud-vision-photos').doc(docId);

        const results = await visionClient.labelDetection(imageUri);

        const labels = results[0].labelAnnotations?.map(obj => obj.description) || [];
        const document = labels.includes('Document');

        return docRef.set({ document, labels });
    });
