const { initializeApp } = require("@firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDb5HJ-t1BUkT4KC7rIUis72YuDbD-w8Wk",
  authDomain: "projectsnap-47388.firebaseapp.com",
  projectId: "projectsnap-47388",
  storageBucket: "projectsnap-47388.appspot.com",
  messagingSenderId: "326750537675",
  appId: "1:326750537675:web:333abd16eab2c3819e184e",
};

const fireBaseApp = initializeApp(firebaseConfig);
const storage = getStorage(fireBaseApp);

module.exports = storage;
