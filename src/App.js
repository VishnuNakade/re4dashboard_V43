import React, {useState,useEffect} from "react";
import Login from './Login';
import Hero from './Hero';
import './App.css';
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword} from "firebase/auth"
import app from "./firebase" 
import {db} from './firebase';
import {ref,onValue} from 'firebase/database';
import Loading from "./components/Loading";


// Import your audio file
import loginSound from './loginSound.mp3';
import Alldevices from "./Alldevices";
import History from "./History";
import Data from "./Data";
import Location from "./Location";

// import Maps from "./Maps"
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";



function App()  {
  const [user,setUser] = useState('');
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError,setPasswordError] = useState('');
  const [hasAccount,setHasAccount]  = useState(false);
  const [loading, setLoading] = useState(false);

  


  const auth=getAuth(app);

  const clearInputs = () => {
    setEmail('');
    setPassword('');  
  };

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  };

  const handleLogin = () => {
    localStorage.setItem("email",email);
    clearErrors();
    signInWithEmailAndPassword(auth,email,password)

    .then(() => {
      // Play audio clip after successful login
      const audio = new Audio(loginSound);
      audio.play();
    })
    
      .catch(err => {
        switch(err.code){
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
           setEmailError(err.message);
           break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;  
        }
      });

      setLoading(true);
      setTimeout(() => {
        setLoading(false); // Stop loading after some time (replace with actual login logic)
      }, 2000);


  };


  const handleSignup = () => {
    clearErrors();
    createUserWithEmailAndPassword(auth,email,password)
      .catch(err => {
        switch(err.code){
          case "auth/email-already-in-use":
          case "auth/invalid-email":
           setEmailError(err.message);
           break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const authListener = () => {
    auth.onAuthStateChanged((user) => {
      if(user){
        clearInputs();
        setUser(user);
      } else {
        setUser("");
      }
    });
  };




  useEffect(() => {
    authListener();
    setLoading(true); // Show spinner if user is already logged in
      setTimeout(() => {
        setLoading(false); // Hide spinner after some time
      }, 2000);
  },[]);

  return (
    <>
    <Router>
        <div className='App'>
      {/* <Alart alart={alart}/> */}
      {loading ? (
        // Render the Loading component if loading is true
        <Loading />
      ) : user ? (
        <Routes>
        <Route exact path="/" element={ <Location/> }></Route>
        <Route exact path="/Alldevices" element={ <Alldevices/> }></Route>
        <Route exact path="/db" element={<Hero handleLogout={handleLogout}  /> }></Route>
        <Route exact path="/History" element={ <History/> }></Route>
        <Route exact path="/Data" element={ <Data/> }></Route>

        </Routes>
        //  showAlart={showAlart}
       
      ) : (
        <Login 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          hasAccount={hasAccount}
          setHasAccount={setHasAccount}
          emailError={emailError}
          passwordError={passwordError}
        />
      )}
    </div>
    </Router>
    </>

  );
};

export default App;
