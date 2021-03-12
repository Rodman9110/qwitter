
import firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBBiUzFL5bwTboHzcnpetMTmj7yWKErjhk",
  authDomain: "qwitter-34efc.firebaseapp.com",
  projectId: "qwitter-34efc",
  storageBucket: "qwitter-34efc.appspot.com",
  messagingSenderId: "127957427778",
  appId: "1:127957427778:web:b99fa1ae963088e7b42fdb"
}

firebase.initializeApp(firebaseConfig)

var db = firebase.firestore()

export default db