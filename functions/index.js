const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

// exports.authorizeUser = functions.https.onRequest((request, response) => {
    // when user signs in, check the email. 
        // if email has 4 numbers, assign as a student. 

        // else if email has firstname.lastname, assign as a teacher.

        // finally, if an email is an admin, assign admin role. 

        /* 
            - Do this using custom claims
            - Might need cloud firestore collections and documents
            - The home & calendar pages needs to receive props, which will be the user role. 
            
        */
// });

// exports.userSignedIn = functions.auth.user()