import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBXKfM3dSq1p1GzZ-OStwAQwHhE-kAXvgg",
    authDomain: "fireside-70f44.firebaseapp.com",
    databaseURL: "https://fireside-70f44.firebaseio.com",
    projectId: "fireside-70f44",
    storageBucket: "fireside-70f44.appspot.com",
    messagingSenderId: "358175828380",
    appId: "1:358175828380:web:7daff1f9be6e13838e4059",
}

// Get a Firestore instance
firebase.initializeApp(firebaseConfig)
export const fbDb = firebase.firestore()
export const fbAuth = firebase.auth()
// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }

export default fbDb
