importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js')

// const firebaseConfig = {
//   apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
//   authDomain: "classdata-app.firebaseapp.com",
//   databaseURL: "https://classdata-app-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "classdata-app",
//   storageBucket: "classdata-app.appspot.com",
//   messagingSenderId: "219989250207",
//   appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
//   measurementId: "G-M7221VNR6W"
// }
const firebaseConfig = {
  apiKey: 'AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg',
  authDomain: 'classdata-app.firebaseapp.com',
  projectId: 'classdata-app',
  storageBucket: 'classdata-app.appspot.com',
  messagingSenderId: '219989250207',
  appId: '1:219989250207:web:5cef212dc7e1496c6952aa',
}
const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging(app)

messaging.setBackgroundMessageHandler((payload) => {
  // do something with payload
  console.log('Background message received:', payload)
});
// BIY9Dq4ACOsylekh3P3pfereOP0O3Bb-LLBrlV8yBE1huNq672CDDDE8rtVMweLVZi8lAFXUTMdcDBmgkUIzrn4