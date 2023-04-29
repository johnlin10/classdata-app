importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js')

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

messaging.onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // 获取通知标题和内容
  const notificationTitle = payload.notification.title
  const notificationBody = payload.notification.body
  // 自定义通知
  const notificationOptions = {
    body: notificationBody,
    icon: '/firebase-logo.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})