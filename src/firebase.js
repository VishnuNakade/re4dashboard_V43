import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";





const config = {
  apiKey: "AIzaSyCwZn_G2BIVZuY_hWjKGKddjRRp6On5tE4",
  authDomain: "rmstesting-d5aa6.firebaseapp.com",
  databaseURL: "https://rmstesting-d5aa6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rmstesting-d5aa6",
  storageBucket: "rmstesting-d5aa6.appspot.com",
  messagingSenderId: "413006652770",
  appId: "1:413006652770:web:d25937a42992df3817f83b"
  };
  
  const app=initializeApp(config);


  export default app
  
  
  export const db=getDatabase(app);