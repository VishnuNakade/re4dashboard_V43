import React from "react";
import reImg from './re4billion.png'

const Login = (props) => {

    const {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        handleSignup,
        hasAccount,
        setHasAccount,
        emailError,
        passwordError
    } = props;

    return (
        <section className="login">
            
            <div className="loginContainer" style={{alignItems:"center"}}>
            <img style={{ width: 200, height: 60,marginBottom:"8px"}} src={reImg} alt="re4billion" />
                <h3>Log In</h3>
                <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                    <input
                        type="text"
                        autoFocus
                        required
                        placeholder="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <p className="errorMsg">{emailError}</p>

                <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                    <input
                        type="password"
                        required
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>


                <p className="errorMsg">{passwordError}</p>
                <div className="btnContainer">
                    {hasAccount ? (

                        <>
                            <button onClick={handleSignup} className="btn float-right">Sign up</button>
                            <p className="position-absolute">
                                Have an account ?
                                <span onClick={() => setHasAccount(!hasAccount)}> Login</span>
                            </p>
                        </>

                    ) : (
                        <>
                            <button onClick={handleLogin} className="btn float-right">Login</button>
                            <p className="position-absolute">
                                Don't have an account ?
                                <span onClick={() => setHasAccount(!hasAccount)}> Sign up</span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
};

export default Login;