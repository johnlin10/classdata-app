/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js')

const firebaseConfig = {
  apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
  authDomain: "classdata-app.firebaseapp.com",
  projectId: "classdata-app",
  storageBucket: "classdata-app.appspot.com",
  messagingSenderId: "219989250207",
  appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
  measurementId: "G-WQQCBC6G9C"
};

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || payload.notification.image,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
  if (event.action) {
    clients.openWindow(event.action)
  }
  event.notification.close()
})