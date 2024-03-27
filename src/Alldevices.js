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




const Alldevices = ({ handleLogout}) => {
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
    // fetchdata();
    fetchdatafull();
}, [caldate, selectedItem] || [])

  

  

// Function to fetch data for all emails
const fetchdatafull = () => {
    const mail = ["ftb001- Kollar", "stb001- Modiyur", "nrmsv2f001- Ananthapuram", "rmsv3_001- Vengur", "rmsv3_002- Sithalingamadam", "rmsv32_001- Keelathalanur", "rmsv33_001- Perumukkal", "rmsv33_002- Agalur"];
    
    let currentTimestamp = Math.floor(Date.now() / 1000);

    if (caldate) {
        currentTimestamp = Math.floor(new Date(caldate).getTime() / 1000);
    }

    const timestamp24HoursAgo = currentTimestamp - (24 * 60 * 60);

    mail.forEach(email => {
        const emailPrefix = email.split('-')[0].trim();
        
        const databaseRefFull = ref(db, `data/${emailPrefix}/timestamp`);
        const queryRefFull = query(databaseRefFull, orderByKey(), startAt("" + timestamp24HoursAgo));

        get(queryRefFull)
            .then((snapshot) => {
                const recordFull = [];
                let k = 0;
                snapshot.forEach((childSnapshot) => {
                    if (emailPrefix === "ftb001" && childSnapshot.key > 1663660000) {
                        k = 5400;
                    }
                    const uniValue = parseInt((new Date(caldate).getTime() / 1000).toFixed(0)) - 19800;
                    if (childSnapshot.key > uniValue - k && childSnapshot.key < uniValue + 86400 - k) {
                        recordFull.push(childSnapshot);
                    }
                });

                const divFull = document.createElement('div');
                divFull.classList.add('email-data');

                const header = document.createElement('h3');
                header.innerHTML = `<i class="fa-solid fa-microchip" style="padding:7px"></i> ${email}`;
                header.style.marginRight = '10px';
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => {
                    toggleAdditionalData(divFull);
                });
                divFull.appendChild(header);

                const additionalDataDiv = document.createElement('div');
                additionalDataDiv.classList.add('additional-data');
                additionalDataDiv.style.display = 'none';
                let additionalDataHTML = '';
                if (recordFull.length > 0) {
                    additionalDataHTML += '<p>';
                    get(ref(db, `data/${emailPrefix}/latestValues`))
                        .then((snapshot) => {
                            const record = snapshot.val();
                            if (record && record.gridVoltage && record.batteryVoltage && record.inverterCurrent && record.solarVoltage && record.solarCurrent) {
                                if (record.gridVoltage.toFixed(2) > 0) {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block;background-color:#8cf35d; border-radius: 5px">Grid Voltage: ${record.gridVoltage.toFixed(2)} V</span>`;
                                } else {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#fc7266; border-radius: 5px">Grid Voltage is down: ${record.gridVoltage.toFixed(2)} V</span>`;
                                }
                                if (record.batteryVoltage.toFixed(2) > 22) {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#8cf35d; border-radius: 5px">Battery Voltage: ${record.batteryVoltage.toFixed(2)} V</span>`;
                                } else {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#fc7266; border-radius: 5px">Battery Voltage is down: ${record.batteryVoltage.toFixed(2)} V</span>`;
                                }
                                if (record.inverterCurrent.toFixed(2) > 4.5) {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#fc7266; border-radius: 5px">Inverter is overloaded: ${record.inverterCurrent.toFixed(2)} A</span>`;
                                } else {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#8cf35d; border-radius: 5px">Inverter Current: ${record.inverterCurrent.toFixed(2)} A</span>`;
                                }
                                if ((record.solarVoltage*record.solarCurrent).toFixed(2) > 2) {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block;background-color:#8cf35d; border-radius: 5px">Solar power: ${(record.solarVoltage*record.solarCurrent).toFixed(2)} W</span>`;
                                } else {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#fc7266; border-radius: 5px">Solar power is down: ${(record.solarVoltage*record.solarCurrent).toFixed(2)} W</span>`;
                                }
                            }
                            additionalDataHTML += '</p>';
                            additionalDataDiv.innerHTML = additionalDataHTML;
                            divFull.appendChild(additionalDataDiv);
                        })
                        .catch((error) => {
                            console.error(`Error fetching data for ${emailPrefix}:`, error);
                        });
                }

                if (recordFull.length > 0) {
                    divFull.className = 'border border-success';
                    document.getElementById('Working').appendChild(divFull);
                } else {
                    divFull.className = 'border border-danger';
                    document.getElementById('notWorking').appendChild(divFull);
                }
            })
            .catch((error) => {
                console.error(`Error fetching data for ${emailPrefix}:`, error);
            });
    });
};


// Function to toggle additional data display
let currentOpenEmail = null;

function toggleAdditionalData(element) {
    const additionalDataDiv = element.querySelector('.additional-data');
    
    if (!additionalDataDiv) {
        // If additionalDataDiv is null, it means there are no records for this email
        return;
    }
    
    const hasRecords = additionalDataDiv.innerHTML.trim() !== ''; // Check if there are records
    
    // If another email's additional data is currently displayed, hide it
    if (currentOpenEmail && currentOpenEmail !== element && hasRecords) {
        const currentOpenAdditionalDataDiv = currentOpenEmail.querySelector('.additional-data');
        currentOpenAdditionalDataDiv.style.display = 'none';
    }
    
    // Toggle display of additional data for the current email
    if (hasRecords) {
        additionalDataDiv.style.display = (additionalDataDiv.style.display === 'none') ? 'block' : 'none';
        currentOpenEmail = (additionalDataDiv.style.display === 'block') ? element : null;
    }
}














  

    


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

        useEffect(() => {
            // Define a function to check conditions and show alerts
            const checkAndShowAlerts = () => {
              // Check conditions after data is fetched
              if ((p1ValueTot / 1000) > 0 && (p3ValueTot / 1000) > 0) {
                showAlart("This device is working", "success");
              } else {
                showAlart("This device is not working", "danger");
              }
            };
          
            // Delay execution after 3000 milliseconds (3 seconds)
            const delay = 320; // time in milliseconds
            const timerId = setTimeout(checkAndShowAlerts, delay);
          
            // Clean up the timer to avoid memory leaks
            return () => clearTimeout(timerId);
            
          }, [p1ValueTot, p2ValueTot, p3ValueTot,showAlart]);


  

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
        <Link className="nav-link text-white" to="/" >Location<span className="sr-only">(current)</span></Link>
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


<div id="email-containers">
                <div className="flex-container">
            

            <div className="flex-child magenta" id="Working" style={{padding:'8px'}}>
                <h1><i class="fa-solid fa-circle-check" style={{color: 'green',padding:'7px'}}></i>Device are working</h1>
               
            </div>
            
            <div className="flex-child green" id="notWorking" style={{padding:'8px'}}>
            <h1><i class="fa-solid fa-circle-xmark" style={{color:'red',padding:'7px'}}></i>Device are not working</h1>
            
            </div>
            
          </div>
          <div id="data-container"></div>
</div>
  </div>


    );
};

export default Alldevices;