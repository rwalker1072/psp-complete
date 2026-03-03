const fs = require('fs');

const configTemplate = `
  const firebaseConfig = {
    apiKey: "${process.env.FIREBASE_API_KEY}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.FIREBASE_APP_ID}",
    measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}"
  };

  /** * ENVIRONMENT CHECK (Required even in disposable version)
   */

  // 1. For the Browser (index.html)
  if (typeof window !== 'undefined') {
    window.firebaseConfig = firebaseConfig;
  }

  // 2. For Node.js (seed-firebase.js / local scripts)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig };
  }
`;

fs.writeFileSync('firebase-config.js', configTemplate);
console.log('✅ firebase-config.js generated for both Browser and Node environments.');