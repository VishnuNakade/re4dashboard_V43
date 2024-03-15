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
    const mail = ["ftb001", "stb001", "nrmsv2f001", "rmsv3_001","rmsv3_002","rmsv32_001","rmsv33_001","rmsv33_002"];
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
                const record = [];
                let k = 0;
                snapshot.forEach((childSnapshot) => {
                    if (email === "ftb001" && childSnapshot.key > 1663660000) {
                        k = 5400;
                    }
                    const uniValue = parseInt((new Date(caldate).getTime() / 1000).toFixed(0)) - 19800;
                    if (childSnapshot.key > uniValue - k && childSnapshot.key < uniValue + 86400 - k) {
                        record.push(childSnapshot);
                    }
                });

                // Create a div element for each email's data
                const div = document.createElement('div');
                
                div.classList.add('email-data');

              
            
               
                // Update the content of the div with the email's data
                div.innerHTML = `
               
                    <h3> <i class="fa-solid fa-microchip" style="padding:7px"></i> ${email}</h3>
                    
                    <p style="padding:7px> Status: ${record.length > 0 ? 'Working' : 'Not Working'}</p>
                `;
                // <p>Data: ${JSON.stringify(record)}</p>

                if (record.length > 0) {
                    // div.className = 'flex-child magenta';
                    div.className = 'border border-success';
                    div.id = 'Working';
                    document.getElementById('Working').appendChild(div);
                } else {
                    // div.className = 'flex-child green';
                    div.className = 'border border-danger';
                    div.id = 'notWorking';
                    document.getElementById('notWorking').appendChild(div);
                }

                // Append the div to the container in the HTML document
                
            })
            .catch((error) => {
                console.error(`Error fetching data for ${email}:`, error);
            });
             // Reset variables
        prevTime = 24;
        prevTimeOld = 24;
        timeCount = 0;
        p1Value = 0;
        p2Value = 0;
        p3Value = 0;
        p1ValueTot = 0;
        p2ValueTot = 0;
        p3ValueTot = 0;
        flag = 0;
        axisValueCount = 0;
        v1 = 0;
        v2 = 0;
        v3 = 0;
        v4 = 0;
        v5 = 0;
        v6 = 0;
        v7 = 0;
        v8 = 0;
        v9 = 0;
        v10 = 0;
        iterVal = 0;
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
        // <section className='hero'>
             
        //     {/* Navbar and Sidebar */}
        //     <nav style={{ justifyContent:"space-between" }}>

        //             {/* <h2>Welcome</h2> */}
        //         <img style={{ width: 190, height: 60 }} src={reImg} alt="re4billion" />
        //         <button onClick={toggleSidebar} style={{color: "white",width:120,fontSize:18}}><i className="fa-solid fa-list" style={{padding:"3px"}}></i>Devices</button>
        //         <button style={{ color: "white",marginRight:"-350px",fontSize:18,width:120}} onClick={handleLogout}><i className="fa-solid fa-right-from-bracket" style={{padding:"3px",color:"#f94b3e"}}></i>Logout</button>

        //         <div className="App">
        //             {/* Sidebar */}
        //             <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        //                 <ul>
        //                     <li style={{backgroundColor:'DodgerBlue',color:'black',fontSize:'26px'}}><i className="fa-solid fa-microchip" style={{padding:"5px"}}></i>Devices</li>
        //                     <li style={{ backgroundColor: selectedItem === 'ftb001' ? 'Orange' : '' }} onClick={() => handleMenuItemClick('ftb001')}>ftb001-Kollar</li>
        //                     <li style={{ backgroundColor: selectedItem === 'stb001' ? 'red' : '' }}  onClick={() => handleMenuItemClick('stb001')}>stb001-Modiyur</li>
        //                     <li style={{ backgroundColor: selectedItem === 'nrmsv2f001' ? 'DodgerBlue' : '' }} onClick={() => handleMenuItemClick('nrmsv2f001')}>nrmsv2f001-Ananthapuram</li>
        //                     <li style={{ backgroundColor: selectedItem === 'rmsv3_001' ? 'Tomato' : '' }} onClick={() => handleMenuItemClick('rmsv3_001')}>rmsv3_001-Vengur</li>
        //                     <li style={{ backgroundColor: selectedItem === 'rmsv3_002' ? 'MediumSeaGreen' : '' }} onClick={() => handleMenuItemClick('rmsv3_002')}>rmsv3_002-Sithalingamadam</li>
        //                     <li style={{ backgroundColor: selectedItem === 'rmsv32_001' ? 'Gray' : '' }} onClick={() => handleMenuItemClick('rmsv32_001')}>rmsv32_001-Keelathalanur</li>
        //                     <li style={{ backgroundColor: selectedItem === 'rmsv33_001' ? 'SlateBlue' : '' }} onClick={() => handleMenuItemClick('rmsv33_001')}>rmsv33_001-Perumukkal</li>
        //                     <li style={{ backgroundColor: selectedItem === 'rmsv33_002' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv33_002')}>rmsv33_002-Agalur</li>
        //                     <li style={{ backgroundColor: selectedItem === 'rmsv33_003' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv33_003')}>rmsv33_003-Testing</li>
        //                     <li style={{ backgroundColor: selectedItem === 'rmsv33_004' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv33_004')}>rmsv33_004-Testing</li>
        //                     <li style={{ backgroundColor: selectedItem === 'rmsv33_005' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv33_005')}>rmsv33_005-Testing</li>

        //                 </ul>

        //             </div>


        //         </div>
        //     </nav>
          

        //     {/* Card section */}
        //     <div className={`content ${sidebarOpen ? 'shifted' : ''}`}>
        //     <Alart alart={alart} InverterCheck={InverterCheck} BatteryCheck={BatteryCheck} SolarCheck={SolarCheck} />

        //         <div className="wrapper">
        //             <div className="card">
        //                 <h2 className="card_title">Solar Voltage</h2>
        //                 <h3 className="card_value">{solarVoltage} V</h3>
        //             </div>

        //             <div className="card">
        //                 <h2 className="card_title">Solar Current</h2>
        //                 <h3 className="card_value">{solarCurrent} A</h3>
        //             </div>

        //             <div className="card">
        //                 <h2 className="card_title">Inverter Voltage</h2>
        //                 <h3 className="card_value">{inverterVoltage} V</h3>
        //             </div>

        //             <div className="card">
        //                 <h2 className="card_title">Inverter Current</h2>
        //                 <h3 className="card_value">{inverterCurrent} A</h3>
        //             </div>

        //             <div className="card">
        //                 <h2 className="card_title">Grid Voltage</h2>
        //                 <h3 className="card_value">{gridVoltage} V</h3>
        //             </div>

        //             <div className="card">
        //                 <h2 className="card_title">Grid Current</h2>
        //                 <h3 className="card_value">{gridCurrent} A</h3>
        //             </div>

        //             <div className="card">
        //                 <h2 className="card_title">Battery Voltage</h2>
        //                 <h3 className="card_value">{batteryVoltage} V</h3>
        //             </div>

        //         </div>

        //         <div className="wrapper">
        //             <div className="card" style={{ background: "#4CBB17" }}>
        //                 <h2 className="card_title">Solar Generation </h2>
        //                 <h3 className="card_value">{(p1ValueTot / 1000).toFixed(2)} kWh</h3>
        //             </div>

        //             <div className="card" style={{ background: "#1F51FF" }}>
        //                 <h2 className="card_title">Grid Energy </h2>
        //                 <h3 className="card_value">{(p2ValueTot / 1000).toFixed(2)} kWh</h3>
        //             </div>

        //             <div className="card" style={{ background: "#FF4433" }}>
        //                 <h2 className="card_title">Load Consumption</h2>
        //                 <h3 className="card_value">{(p3ValueTot / 1000).toFixed(2)} kWh</h3>
        //             </div>
        //         </div>

        //         <div className="calenderPlace">
        //     <input 
        //         type="date" 
        //         defaultValue={dateOrg} 
        //         onChange={e => { setCalDate(e.target.value) }} 
        //         style={{ backgroundColor: dateColor }} 
        //     />
        // </div>

        //         <div className="chartArea">
        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="SolarVoltage" stroke="#1338be" dot={false} />
        //                     {/* <Line name="Solar Voltage" type="monotone" dataKey="SolarVoltageSmooth"  stroke="#1338be"  dot={false} /> */}
        //                 </LineChart>
        //             </div>

        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="SolarCurrent" stroke="#03c04a" dot={false} />
        //                     {/* <Line name="Solar Current" type="monotone" dataKey="SolarCurrentSmooth"  stroke="#ff0000"  dot={false} /> */}
        //                 </LineChart>
        //             </div>

        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="SolarPower" stroke="#b90e0a" dot={false} />
        //                     {/* <Line name="Solar Power" type="monotone" dataKey="SolarPowerSmooth"  stroke="#b90e0a"  dot={false} /> */}
        //                 </LineChart>
        //             </div>

        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="InverterVoltage" stroke="#1338be" dot={false} />
        //                     {/* <Line name="Inverter Voltage" type="monotone" dataKey="InverterVoltageSmooth"  stroke="#1338be"  dot={false} /> */}
        //                 </LineChart>
        //             </div>

        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="InverterCurrent" stroke="#03c04a" dot={false} />
        //                     {/* <Line name="Inverter Current" type="monotone" dataKey="InverterCurrentSmooth"  stroke="#03c04a"  dot={false} /> */}
        //                 </LineChart>
        //             </div>

        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="InverterPower" stroke="#b90e0a" dot={false} />
        //                     {/* <Line name="Inverter Power" type="monotone" dataKey="InverterPowerSmooth"  stroke="#b90e0a"  dot={false} /> */}
        //                 </LineChart>
        //             </div>

        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="GridVoltage" stroke="#1338be" dot={false} />
        //                     {/* <Line name="Grid Voltage" type="monotone" dataKey="GridVoltageSmooth" stroke="#1338be"  dot={false} /> */}
        //                 </LineChart>
        //             </div>

        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="GridCurrent" stroke="#03c04a" dot={false} />
        //                     {/* <Line name="Grid Current" type="monotone" dataKey="GridCurrentSmooth" stroke="#03c04a"  dot={false} /> */}
        //                 </LineChart>
        //             </div>

        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="GridPower" stroke="#b90e0a" dot={false} />
        //                     {/* <Line name="Grid Power" type="monotone" dataKey="GridPowerSmooth" stroke="#b90e0a"  dot={false} /> */}
        //                 </LineChart>
        //             </div>

        //             <div className="chart">
        //                 <LineChart width={350} height={280} data={dataCharts}
        //                     margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
        //                     <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
        //                     <Tooltip />
        //                     <Legend layout="horizontal" verticalAlign="top" align="center" />
        //                     <Line type="monotone" dataKey="BatteryVoltage" stroke="#1338be" dot={false} />
        //                     {/* <Line name="Battery Voltage" type="monotone" dataKey="BatteryVoltageSmooth" stroke="#1338be"  dot={false} /> */}
        //                 </LineChart>
        //             </div>
        //         </div>
        //     </div>

        // </section>
        // <div id="data-container"></div>

        // <div id="email-containers"></div>
  <div className="big">


{/* <nav className="navbar navbar-light bg-secondary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">
    <img style={{ width: 185, height: 50 }} src={logoImg} alt="re4billion" />  
    </a>
    <Link class="btn btn-primary" to="db" role="button">Go to Dashboard</Link>
  </div>
</nav>
<hr style={{backgroundColor:'green'}}/> */}



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
        <Link className="nav-link text-white" to="db" >Go to Dashboard<span className="sr-only">(current)</span></Link>
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
</div>
  </div>


    );
};

export default Alldevices;