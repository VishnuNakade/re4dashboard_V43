import app from "./firebase"
import { db } from './firebase';
import { ref, onValue, get, query, orderByKey, startAt, endAt } from 'firebase/database';
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import moment from "moment";
import { isNaN } from "lodash";
import './Sidebar.css';
import reImg from './re4billion.png'
import Alart from './components/Alart';
import "./Alldevices.css"
import logoImg from './re4billion.png'
import { Link } from 'react-router-dom'

let prevTime = 24;
let prevTimeOld = 24;
let timeCount = 0;
let p1Value = 0;
let p2Value = 0;
let p3Value = 0;
let p1ValueTot = 0;
let p2ValueTot = 0;
let p3ValueTot = 0;
let flag = 0;
let p1ValueTotFinal = 0;
let p2ValueTotFinal = 0;
let p3ValueTotFinal = 0;
let axisValueCount = 0;
let v1 = 0;
let v2 = 0;
let v3 = 0;
let v4 = 0;
let v5 = 0;
let v6 = 0;
let v7 = 0;
let v8 = 0;
let v9 = 0;
let v10 = 0;
const myArray1 = []
const myArray2 = []
const myArray3 = []
const myArray4 = []
const myArray5 = []
const myArray6 = []
const myArray7 = []
const myArray8 = []
const myArray9 = []
const myArray10 = []
let iterVal = 0;




const History = ({ handleLogout}) => {
    const [data, setdata] = useState([])
    const [timeValueArray, setTimeValueArray] = useState([])
    const [solarVoltageArray, setSolarVoltageArray] = useState([])
    const [solarVoltage, setSolarVoltage] = useState('')
    const [solarCurrent, setSolarCurrent] = useState('')
    const [inverterVoltage, setInverterVoltage] = useState('')
    const [inverterCurrent, setInverterCurrent] = useState('')
    const [gridVoltage, setGridVoltage] = useState('')
    const [gridCurrent, setGridCurrent] = useState('')
    const [batteryVoltage, setBatteryVoltage] = useState('')



    var curr = new Date(new Date());
    curr.setDate(curr.getDate());
    var dateOrg = curr.toISOString().substring(0, 10);
    var dd1 = dateOrg.split('-');

    const [caldate, setCalDate] = useState(dateOrg);
    const [dateColor, setDateColor] = useState('green');
    
    // console.log(caldate)

    
    // Sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('ftb001');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleMenuItemClick = (itemName) => {
        setSelectedItem(itemName);
        // You can perform any other actions here based on the selected item
    };
    //Sidebar end


      //Alarts
  const[alart,setAlart]=useState(null)
  const showAlart=(message,type)=>{
    setAlart({
      msg:message,
      type:type
    })
   // setTimeout(() => {
    //   setAlart(null);
    // },3000);
  }

  const [InverterCheck, setInverterCheck] = useState(null);
  const [BatteryCheck, setBatteryCheck] = useState(null);
  const [SolarCheck, setSolarCheck] = useState(null);

  const InverterAlart = (message) => {
      setInverterCheck({
          msg: message
      })
  }

  const BatteryAlart = (message) => {
      setBatteryCheck({
          msg: message
      })
  }

  const SolarAlart = (message) => {
      setSolarCheck({
          msg: message
      })
  }

  useEffect(() => {
      InverterAlart("hello i am inverter");
      BatteryAlart("Hello i am battery");
      SolarAlart("hello i am solar");
  }, []);



  useEffect(() => {
    // handleMenuItemClick();
    fetchdata();
    fetchdatafull();
}, [caldate, selectedItem] || [])

  

  

const fetchdata = () => {
    const mail = ["ftb001", "ftb002", "stb001", "nrmsv2"];
    mail.forEach(email => {
        const databaseRef = ref(db, `data/${email}/latestValues`);
        get(databaseRef)
            .then((snapshot) => {
                const record = snapshot.val();

                // Create a div element for each email
                const div = document.createElement('div');
                div.classList.add('email-data');

                // Update the content of the div with the email's data
                div.innerHTML = `
                    <h3>Email: ${email}</h3>
                    <p>Solar Voltage: ${record.solarVoltage.toFixed(2)}</p>
                    <p>Solar Current: ${record.solarCurrent.toFixed(2)}</p>
                    <p>Inverter Voltage: ${record.inverterVoltage.toFixed(2)}</p>
                    <p>Inverter Current: ${record.inverterCurrent.toFixed(2)}</p>
                    <p>Grid Voltage: ${record.gridVoltage.toFixed(2)}</p>
                    <p>Grid Current: ${record.gridCurrent.toFixed(2)}</p>
                    <p>Battery Voltage: ${record.batteryVoltage.toFixed(2)}</p>
                `;

                // Append the div to a container in the HTML document
                document.getElementById('data-container').appendChild(div);
            })
            .catch((error) => {
                console.error(`Error fetching data for ${email}:`, error);
            });
    });
};




const fetchdatafull = () => {
    const mail = ["ftb001", "stb001", "nrmsv2f001", "rmsv3_001", "rmsv3_002", "rmsv32_001", "rmsv33_001", "rmsv33_002","rmsv4_001"];
    let currentTimestamp = Math.floor(Date.now() / 1000);

    if (caldate) {
        currentTimestamp = Math.floor(new Date(caldate).getTime() / 1000);
    }

    const timestamp24HoursAgo = currentTimestamp - (24 * 60 * 60);

    mail.forEach(email => {
        const databaseRef = ref(db, `data/${email}/timestamp`);
        const queryRef = query(databaseRef, orderByKey(), startAt("" + timestamp24HoursAgo));

        get(queryRef)
            .then((snapshot) => {
                const records = [];
                snapshot.forEach((childSnapshot) => {
                    records.push(childSnapshot);
                });

                // Sort records in descending order based on timestamp
                records.sort((a, b) => b.key - a.key);

                const lastRecord = records.length > 0 ? records[0] : null;
                
                // const lastdata= JSON.parse(JSON.stringify(lastRecord))
                // // console.log(lastdata.tValue);
                // const myDate = new Date((lastdata.tValue)* 1000);

                // Create a div element for each email's data
                const div = document.createElement('div');
                div.classList.add('email-data');

                // Update the content of the div with the email's data
                div.innerHTML = `
                    <h3>Email: ${email}</h3>
                    <p>Data: ${JSON.stringify(lastRecord)}</p>
                   
                    <p>Status: ${lastRecord ? 'Working' : 'Not Working'}</p>
                    
                    
                `;

                // Append the div to the container in the HTML document
                document.getElementById('email-container').appendChild(div);
            })
            .catch((error) => {
                console.error(`Error fetching data for ${email}:`, error);
            });
    });
};

  

    


    p1ValueTot = 0;
    p2ValueTot = 0;
    p3ValueTot = 0;




    const dataCharts = Object.entries(data)
        .map(([key, value]) => {
            let date;
            var mail = `${selectedItem}`

            if (value.key > 1663660000 && mail == "ftb001") {

                const t = new Date((Number(value.key) + (5400 - 230)) * 1000)
                date = new Intl.DateTimeFormat('en-US', { hour: '2-digit', hour12: false }).format(t);

                if (prevTime == Number(date)) {
                    flag = 1;
                    if (!(isNaN((value.val().solarVoltage) * (value.val().solarCurrent))) && !(isNaN((value.val().gridVoltage) * (value.val().gridCurrent))) && !(isNaN((value.val().inverterVoltage) * (value.val().inverterCurrent)))) {
                        timeCount = timeCount + 1;

                        p1Value = p1Value + (value.val().solarVoltage) * (value.val().solarCurrent)
                        p2Value = p2Value + (value.val().gridVoltage) * (value.val().gridCurrent)
                        p3Value = p3Value + (value.val().inverterVoltage) * (value.val().inverterCurrent)
                    }
                    // console.log("prevTime")
                    // console.log(prevTime)            

                } else {

                    if (flag == 1) {

                        p1ValueTot = p1ValueTot + p1Value / timeCount;
                        p2ValueTot = p2ValueTot + p2Value / timeCount;
                        p3ValueTot = p3ValueTot + p3Value / timeCount;

                        if (isNaN(p1ValueTot)) {
                            p1ValueTot = 0;

                        }

                        if (isNaN(p2ValueTot)) {
                            p2ValueTot = 0;

                        }

                        if (isNaN(p3ValueTot)) {
                            p3ValueTot = 0;

                        }

                        // console.log("p3ValueTot")
                        // console.log(p3ValueTot)

                        if (!(isNaN((value.val().solarVoltage) * (value.val().solarCurrent))) && !(isNaN((value.val().gridVoltage) * (value.val().gridCurrent))) && !(isNaN((value.val().inverterVoltage) * (value.val().inverterCurrent)))) {
                            timeCount = 1;
                            p1Value = (value.val().solarVoltage) * (value.val().solarCurrent);
                            p2Value = (value.val().gridVoltage) * (value.val().gridCurrent);
                            p3Value = (value.val().inverterVoltage) * (value.val().inverterCurrent);
                        }
                        if (prevTime == 24) {
                            prevTime = 1;
                        } else {
                            prevTime = prevTime + 1;
                        }
                    }
                }

            } else {
                const t = new Date(value.key * 1000)
                date = new Intl.DateTimeFormat('en-US', { hour: '2-digit', hour12: false }).format(t);


                if (prevTime == Number(date)) {
                    flag = 1;
                    if (!(isNaN((value.val().solarVoltage) * (value.val().solarCurrent))) && !(isNaN((value.val().gridVoltage) * (value.val().gridCurrent))) && !(isNaN((value.val().inverterVoltage) * (value.val().inverterCurrent)))) {
                        timeCount = timeCount + 1;

                        p1Value = p1Value + (value.val().solarVoltage) * (value.val().solarCurrent)
                        p2Value = p2Value + (value.val().gridVoltage) * (value.val().gridCurrent)
                        p3Value = p3Value + (value.val().inverterVoltage) * (value.val().inverterCurrent)
                    }
                    // console.log("prevTime")
                    // console.log(prevTime)            

                } else {

                    if (flag == 1) {

                        p1ValueTot = p1ValueTot + p1Value / timeCount;
                        p2ValueTot = p2ValueTot + p2Value / timeCount;
                        p3ValueTot = p3ValueTot + p3Value / timeCount;

                        if (isNaN(p1ValueTot)) {
                            p1ValueTot = 0;

                        }

                        if (isNaN(p2ValueTot)) {
                            p2ValueTot = 0;

                        }

                        if (isNaN(p3ValueTot)) {
                            p3ValueTot = 0;

                        }

                        // console.log("p3ValueTot")
                        // console.log(p3ValueTot)

                        if (!(isNaN((value.val().solarVoltage) * (value.val().solarCurrent))) && !(isNaN((value.val().gridVoltage) * (value.val().gridCurrent))) && !(isNaN((value.val().inverterVoltage) * (value.val().inverterCurrent)))) {
                            timeCount = 1;
                            p1Value = (value.val().solarVoltage) * (value.val().solarCurrent);
                            p2Value = (value.val().gridVoltage) * (value.val().gridCurrent);
                            p3Value = (value.val().inverterVoltage) * (value.val().inverterCurrent);
                        }
                        if (prevTime == 24) {
                            prevTime = 1;
                        } else {
                            prevTime = prevTime + 1;
                        }
                    }
                }
            }


            axisValueCount = axisValueCount + 1;

            if (axisValueCount < 10) {
                v1 = Math.abs(value.val().solarVoltage)
                myArray1.push(v1)

                v2 = Math.abs(value.val().solarCurrent)
                myArray2.push(v2)

                v3 = Math.abs((value.val().solarVoltage) * (value.val().solarCurrent))
                myArray3.push(v3)

                v4 = Math.abs(value.val().inverterVoltage)
                myArray4.push(v4)

                v5 = Math.abs(value.val().inverterCurrent)
                myArray5.push(v5)

                v6 = Math.abs((value.val().inverterVoltage) * (value.val().inverterCurrent))
                myArray6.push(v6)

                v7 = Math.abs(value.val().gridVoltage)
                myArray7.push(v7)

                v8 = Math.abs(value.val().gridCurrent)
                myArray8.push(v8)

                v9 = Math.abs((value.val().gridVoltage) * (value.val().gridCurrent))
                myArray9.push(v9)

                v10 = Math.abs(value.val().batteryVoltage)
                myArray10.push(v10)

            } else {
                myArray1.push(Math.abs(value.val().solarVoltage))
                myArray2.push(Math.abs(value.val().solarCurrent))
                myArray3.push(Math.abs((value.val().solarVoltage) * (value.val().solarCurrent)))
                myArray4.push(Math.abs(value.val().inverterVoltage))
                myArray5.push(Math.abs(value.val().inverterCurrent))
                myArray6.push(Math.abs((value.val().inverterVoltage) * (value.val().inverterCurrent)))
                myArray7.push(Math.abs(value.val().gridVoltage))
                myArray8.push(Math.abs(value.val().gridCurrent))
                myArray9.push(Math.abs((value.val().gridVoltage) * (value.val().gridCurrent)))
                myArray10.push(Math.abs(value.val().batteryVoltage))

                let sum1 = 0;
                let sum2 = 0;
                let sum3 = 0;
                let sum4 = 0;
                let sum5 = 0;
                let sum6 = 0;
                let sum7 = 0;
                let sum8 = 0;
                let sum9 = 0;
                let sum10 = 0;

                for (var i = iterVal; i < iterVal + 10; i++) {
                    sum1 = sum1 + myArray1[i]
                    sum2 = sum2 + myArray2[i]
                    sum3 = sum3 + myArray3[i]
                    sum4 = sum4 + myArray4[i]
                    sum5 = sum5 + myArray5[i]
                    sum6 = sum6 + myArray6[i]
                    sum7 = sum7 + myArray7[i]
                    sum8 = sum8 + myArray8[i]
                    sum9 = sum9 + myArray9[i]
                    sum10 = sum10 + myArray10[i]
                }
                // console.log("sum2")
                // console.log(sum2)
                iterVal = iterVal + 1;
                v1 = sum1 / 10
                v2 = sum2 / 10
                v3 = sum3 / 10
                v4 = sum4 / 10
                v5 = sum5 / 10
                v6 = sum6 / 10
                v7 = sum7 / 10
                v8 = sum8 / 10
                v9 = sum9 / 10
                v10 = sum10 / 10
            }
            return {
                ccAxisXValue: date,
                SolarVoltage: Math.abs(value.val().solarVoltage),
                SolarCurrent: Math.abs(value.val().solarCurrent),
                SolarPower: Math.abs((value.val().solarVoltage) * (value.val().solarCurrent)),
                InverterVoltage: Math.abs(value.val().inverterVoltage),
                InverterCurrent: Math.abs(value.val().inverterCurrent),
                InverterPower: Math.abs((value.val().inverterVoltage) * (value.val().inverterCurrent)),
                GridVoltage: Math.abs(value.val().gridVoltage),
                GridCurrent: Math.abs(value.val().gridCurrent),
                GridPower: Math.abs((value.val().gridVoltage) * (value.val().gridCurrent)),
                BatteryVoltage: Math.abs(value.val().batteryVoltage),

                SolarVoltageSmooth: v1,
                SolarCurrentSmooth: v2,
                SolarPowerSmooth: v3,
                InverterVoltageSmooth: v4,
                InverterCurrentSmooth: v5,
                InverterPowerSmooth: v6,
                GridVoltageSmooth: v7,
                GridCurrentSmooth: v8,
                GridPowerSmooth: v9,
                BatteryVoltageSmooth: v10,

            }

        })

        //Alerts

        // useEffect(() => {
        //     // Define a function to check conditions and show alerts
        //     const checkAndShowAlerts = () => {
        //       // Check conditions after data is fetched
        //       if ((p1ValueTot / 1000) > 0 && (p3ValueTot / 1000) > 0) {
        //         showAlart("This device is working", "success");
        //       } else {
        //         showAlart("This device is not working", "danger");
        //       }
        //     };
          
        //     // Delay execution after 3000 milliseconds (3 seconds)
        //     const delay = 320; // time in milliseconds
        //     const timerId = setTimeout(checkAndShowAlerts, delay);
          
        //     // Clean up the timer to avoid memory leaks
        //     return () => clearTimeout(timerId);
            
        //   }, [p1ValueTot, p2ValueTot, p3ValueTot,showAlart]);


  

    return (
       
  <div className="big">

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
        <Link className="nav-link text-white" to="https://maps.re4billion.ai/" >Location<span className="sr-only">(current)</span></Link>
      </li>
    </ul>
   
    <ul className="navbar-nav ml-auto menu3"> 
      <li className="nav-item active">
        <Link className="nav-link text-white" to="/db" >Go to Dashboard<span className="sr-only">(current)</span></Link>
      </li>
    </ul>
    
  </div>
</nav>
<hr style={{ margin: '3px 0', borderTop: '0.5px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }} />


<div id="email-container" style={{padding:'50px'}}></div>

  </div>


    );
};

export default History;