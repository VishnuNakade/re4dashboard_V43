import React from 'react';
import { Link } from 'react-router-dom';

export default function Location({ handleLogout }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-info stickyTop">
        <a className="navbar-brand text-white" href="#">RE4BILLION.AI</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto menu3">
            <li className="nav-item active">
              <Link className="nav-link text-white" to="https://re4billion.ai/">Home<span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link text-white" to="/Alldevices">Dashboard<span className="sr-only">(current)</span></Link>
            </li>

          </ul>

          <ul className="navbar-nav ml-auto menu3">
            <li className="nav-item active">
              <Link className="nav-link text-white" onClick={handleLogout}>Logout<span className="sr-only">(current)</span></Link>
            </li>
          </ul>

          {/* <ul className="navbar-nav ml-auto menu3"> 
            <li className="nav-item active">
              <Link className="nav-link text-white" to="/db" >Go to Dashboard<span className="sr-only">(current)</span></Link>
            </li>
          </ul> */}
        </div>
      </nav>

      <hr style={{ margin: '3px 0', borderTop: '0.5px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }} />

      {/* Map content */}
      <div className='map' style={{ marginTop: '54px' }}>
        <iframe src="https://maps.re4billion.ai/" title="RE4BILLION Map" style={{ width: '100%', height: '600px', border: 'none' }}></iframe>
      </div>
    </div>
  );
}
