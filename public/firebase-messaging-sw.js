importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBGvDoWIsHzOAn4KC5S-k_tdzKfL5zZvgo",
  authDomain: "travel-admin-app.firebaseapp.com",
  projectId: "travel-admin-app",
  storageBucket: "travel-admin-app.firebasestorage.app",
  messagingSenderId: "258759706014",
  appId: "1:258759706014:web:4b38f5cee50a2797e7428f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
