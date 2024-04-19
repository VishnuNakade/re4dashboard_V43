import React, { useState }  from 'react'
// import PropTypes from 'prop-types'

// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Button, Modal } from 'react-bootstrap'; // Import Bootstrap components


export default function Alart(props) {

    // const capitalize =(word)=>{
    //     const lower=word.toLowerCase();
    //     return lower.charAt(0).toUpperCase()+lower.slice(1);
    // }
    const [show, setShow] = useState(false); // State to manage modal visibility
    const handleClose = () => setShow(false); // Function to close modal
    const handleShow = () => setShow(true); // Function to show modal
  

  return (
  <div style={{ height: '50px',padding:'3px'}}>
    {props.alart && (
      <div className={`alert alert-${props.alart.type} alert-dismissible fade show`} role="alert">
        {props.alart.type === 'success' ? (
         <>
          <i className="fa-solid fa-circle-check" style={{ color: '#217a00',padding:'5px' }}></i>

          <i className="fa-solid fa-circle-info float-right" style={{ fontSize: '20px', cursor: 'pointer',color:'DodgerBlue',paddingTop:'4px' }} onClick={handleShow}></i>
         </>
        ) : (
          <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f31616',padding:'5px' }}></i>
        )}
        {props.alart.msg}

        
    
      </div>
      
    )}

      {/* Modal Start */}
      <Modal show={show} onHide={handleClose} style={{border:'3px solid #17a2b8'}}>
        <Modal.Header >
          <Modal.Title>Device Checkup<i class="fa-solid fa-satellite-dish" style={{padding:'5px',fontSize:'35px'}}></i></Modal.Title>
        </Modal.Header>
        <Modal.Body><i class="fa-solid fa-box" style={{padding:'7px'}}></i>{props.InverterCheck && props.InverterCheck.msg}</Modal.Body>
        <Modal.Body><i class="fa-solid fa-battery-full" style={{padding:'7px'}}></i>{props.BatteryCheck && props.BatteryCheck.msg}</Modal.Body>
        <Modal.Body><i class="fa-solid fa-solar-panel" style={{padding:'7px'}}></i>{props.SolarCheck && props.SolarCheck.msg}</Modal.Body>
       
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} style={{backgroundColor:'DodgerBlue'}}>
            Close
          </Button>
  
        </Modal.Footer>
      </Modal>

  </div>
);


}

{/* <strong>{capitalize(props.alart.type)}</strong> */}