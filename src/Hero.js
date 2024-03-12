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
import { Link } from "react-router-dom";


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




const Hero = ({ handleLogout}) => {
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

    //.................................Solar check Start...................................

    function isSolarFailure(solarValue) {
    // Get the current time
    var currentTime = new Date().getTime();
    
    // Define the time range for solar failure (6:00 AM to 5:30 PM)
    var startTime = new Date();
    startTime.setHours(6);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    
    var endTime = new Date();
    endTime.setHours(17);
    endTime.setMinutes(30);
    endTime.setSeconds(0);
    
    // Check if the current time is within the specified time range and if the solar value is below a certain threshold
    if (currentTime >= startTime.getTime() && currentTime <= endTime.getTime() && solarValue < 0.5) {
        return true;
    } else {
        return false;
    }
}

// Example solar value
var solarValue = solarVoltage*solarCurrent;

// Check if there is a solar failure
if (isSolarFailure(solarValue)) {
    SolarAlart("Solar failure detected between 6:00 AM and 5:30 PM.");
} else {
    SolarAlart("Solar system is operational.");
}

//..........................................Solar check end.............................................

//..........................................Inverter check  Start........................................

//..........................................Inverter check  End..........................................

//..........................................Battery check Start..........................................

//..........................................Battery check End............................................

      InverterAlart("hello i am inverter");
      BatteryAlart("Hello i am battery");
    //   SolarAlart("hello i am solar");
  }, [solarVoltage,solarCurrent]);







  useEffect(() => {
    // handleMenuItemClick();
    fetchdata();
    fetchdatafull();
}, [caldate, selectedItem] || [])

  

  

    const fetchdata = () => {
        var mail = `${selectedItem}`
        
        const databaseRef = ref(db, `data/${mail}/latestValues`);
        get(databaseRef)
            .then((snapshot) => {
                const record = [];
                // console.log(snapshot.key); 

                record.push(snapshot.val());

                setSolarVoltage((record[0].solarVoltage).toFixed(2));
                setSolarCurrent((record[0].solarCurrent).toFixed(2));
                setInverterVoltage((record[0].inverterVoltage).toFixed(2));
                setInverterCurrent((record[0].inverterCurrent).toFixed(2));
                setGridVoltage((record[0].gridVoltage).toFixed(2));
                setGridCurrent((record[0].gridCurrent).toFixed(2));
                setBatteryVoltage((record[0].batteryVoltage).toFixed(2));

                p1ValueTot = 0;
                p2ValueTot = 0;
                p3ValueTot = 0;
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
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
      
    }




    const fetchdatafull = () => {
        let currentTimestamp = Math.floor(Date.now() / 1000);;

        if (caldate) {
            currentTimestamp = Math.floor(new Date(caldate).getTime() / 1000);
        }


        const timestamp24HoursAgo = currentTimestamp - (24 * 60 * 60);
        var mail = `${selectedItem}`
      
        var uniValue = parseInt((new Date(caldate).getTime() / 1000).toFixed(0)) - 19800
        const databaseRef = ref(db, `data/${mail}/timestamp`);
        var queryRef;
        queryRef = query(databaseRef, orderByKey(), startAt("" + timestamp24HoursAgo));

        get(queryRef)
            .then((snapshot) => {
                const record = [];
                let k = 0;
                snapshot.forEach((childSnapshot) => {
                    // console.log(childSnapshot.key)
                    if (mail == "ftb001" && childSnapshot.key > 1663660000) {
                        k = 5400;
                    }
                    if (childSnapshot.key > uniValue - k && childSnapshot.key < uniValue + 86400 - k) {
                        record.push(childSnapshot)
                    }
                })
                setdata(record);

                // Check conditions and update color after data fetching
                if (p1ValueTot === 0 && p2ValueTot === 0 && p3ValueTot === 0) {
                    setDateColor('red');
                } else {
                    setDateColor('green');
                }

            })

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

        //clock
        const [time, setTime] = useState(getCurrentTime());

  function getCurrentTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    return `${h}:${m}:${s}`;
  }

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);



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
        <section className='hero'>
             
            {/* Navbar and Sidebar */}
            <nav style={{ justifyContent:"space-between" }}>

                    {/* <h2>Welcome</h2> */}
                <img style={{ width: 190, height: 60 }} src={reImg} alt="re4billion" />

                <Link to="/">
                <button type="button" class="btn btn-primary" style={{width:'100px'}}><i class="fa-solid fa-bars-progress" style={{padding:'4px'}}></i>Status</button>
                </Link>
                

                <button type="button" class="btn btn-success" onClick={toggleSidebar} style={{width:'100px'}}><i className="fa-solid fa-list" style={{padding:'4px'}}></i>Devices</button>

                {/* <button onClick={toggleSidebar} style={{color: "white",width:120,fontSize:18}}>
                    <i className="fa-solid fa-list" style={{padding:"3px"}}></i>Devices</button> */}

                    <Link to="/Map">
                    <button type="button" class="btn btn-info" style={{width:'100px'}}><i class="fa-solid fa-location-dot" style={{padding:'4px'}}></i>Location</button>
                    </Link>

<button type="button" class="btn btn-danger"onClick={handleLogout}style={{width:'100px'}}><i className="fa-solid fa-right-from-bracket" style={{padding:"4px"}}></i>Logout</button>

<button type="button" class="btn btn-warning" style={{width:'107px',backgroundColor:'#FFBF00'}}> 
<div id="txt">
<i class="fa-solid fa-clock" style={{padding:'4px'}}></i>
      {time}
    </div>
</button>



                {/* <button style={{ color: "white",marginRight:"-350px",fontSize:18,width:120}} onClick={handleLogout}><i className="fa-solid fa-right-from-bracket" style={{padding:"3px",color:"#f94b3e"}}></i>Logout</button> */}

                <div className="App">
                    {/* Sidebar */}
                    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                        <ul>
                            <li style={{backgroundColor:'DodgerBlue',color:'black',fontSize:'26px'}}><i className="fa-solid fa-microchip" style={{padding:"5px"}}></i>Devices</li>
                            <li style={{ backgroundColor: selectedItem === 'ftb001' ? 'Orange' : '' }} onClick={() => handleMenuItemClick('ftb001')}>ftb001-Kollar</li>
                            <li style={{ backgroundColor: selectedItem === 'stb001' ? 'red' : '' }}  onClick={() => handleMenuItemClick('stb001')}>stb001-Modiyur</li>
                            <li style={{ backgroundColor: selectedItem === 'nrmsv2f001' ? 'DodgerBlue' : '' }} onClick={() => handleMenuItemClick('nrmsv2f001')}>nrmsv2f001-Ananthapuram</li>
                            <li style={{ backgroundColor: selectedItem === 'rmsv3_001' ? 'Tomato' : '' }} onClick={() => handleMenuItemClick('rmsv3_001')}>rmsv3_001-Vengur</li>
                            <li style={{ backgroundColor: selectedItem === 'rmsv3_002' ? 'MediumSeaGreen' : '' }} onClick={() => handleMenuItemClick('rmsv3_002')}>rmsv3_002-Sithalingamadam</li>
                            <li style={{ backgroundColor: selectedItem === 'rmsv32_001' ? 'Gray' : '' }} onClick={() => handleMenuItemClick('rmsv32_001')}>rmsv32_001-Keelathalanur</li>
                            <li style={{ backgroundColor: selectedItem === 'rmsv33_001' ? 'SlateBlue' : '' }} onClick={() => handleMenuItemClick('rmsv33_001')}>rmsv33_001-Perumukkal</li>
                            <li style={{ backgroundColor: selectedItem === 'rmsv33_002' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv33_002')}>rmsv33_002-Agalur</li>
                            <li style={{ backgroundColor: selectedItem === 'rmsv33_003' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv33_003')}>rmsv33_003-Testing</li>
                            <li style={{ backgroundColor: selectedItem === 'rmsv33_004' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv33_004')}>rmsv33_004-Testing</li>
                            <li style={{ backgroundColor: selectedItem === 'rmsv33_005' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv33_005')}>rmsv33_005-Testing</li>
                            <li style={{ backgroundColor: selectedItem === 'rmsv4_001' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv4_001')}>rmsv4_001-Testing</li>

                        </ul>

                    </div>


                </div>
            </nav>
          

            {/* Card section */}
            <div className={`content ${sidebarOpen ? 'shifted' : ''}`}>
            <Alart alart={alart} InverterCheck={InverterCheck} BatteryCheck={BatteryCheck} SolarCheck={SolarCheck} />

                <div className="wrapper">
                    <div className="card">
                        <h2 className="card_title">Solar Voltage</h2>
                        <h3 className="card_value">{solarVoltage} V</h3>
                    </div>

                    <div className="card">
                        <h2 className="card_title">Solar Current</h2>
                        <h3 className="card_value">{solarCurrent} A</h3>
                    </div>

                    <div className="card">
                        <h2 className="card_title">Inverter Voltage</h2>
                        <h3 className="card_value">{inverterVoltage} V</h3>
                    </div>

                    <div className="card">
                        <h2 className="card_title">Inverter Current</h2>
                        <h3 className="card_value">{inverterCurrent} A</h3>
                    </div>

                    <div className="card">
                        <h2 className="card_title">Grid Voltage</h2>
                        <h3 className="card_value">{gridVoltage} V</h3>
                    </div>

                    <div className="card">
                        <h2 className="card_title">Grid Current</h2>
                        <h3 className="card_value">{gridCurrent} A</h3>
                    </div>

                    <div className="card">
                        <h2 className="card_title">Battery Voltage</h2>
                        <h3 className="card_value">{batteryVoltage} V</h3>
                    </div>

                </div>

                <div className="wrapper">
                    <div className="card" style={{ background: "#4CBB17" }}>
                        <h2 className="card_title">Solar Generation </h2>
                        <h3 className="card_value">{(p1ValueTot / 1000).toFixed(2)} kWh</h3>
                    </div>

                    <div className="card" style={{ background: "#1F51FF" }}>
                        <h2 className="card_title">Grid Energy </h2>
                        <h3 className="card_value">{(p2ValueTot / 1000).toFixed(2)} kWh</h3>
                    </div>

                    <div className="card" style={{ background: "#FF4433" }}>
                        <h2 className="card_title">Load Consumption</h2>
                        <h3 className="card_value">{(p3ValueTot / 1000).toFixed(2)} kWh</h3>
                    </div>
                </div>

                <div className="calenderPlace">
            <input 
                type="date" 
                defaultValue={dateOrg} 
                onChange={e => { setCalDate(e.target.value) }} 
                style={{ backgroundColor: dateColor }} 
            />
        </div>

                <div className="chartArea">
                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="SolarVoltage" stroke="#1338be" dot={false} />
                            {/* <Line name="Solar Voltage" type="monotone" dataKey="SolarVoltageSmooth"  stroke="#1338be"  dot={false} /> */}
                        </LineChart>
                    </div>

                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="SolarCurrent" stroke="#03c04a" dot={false} />
                            {/* <Line name="Solar Current" type="monotone" dataKey="SolarCurrentSmooth"  stroke="#ff0000"  dot={false} /> */}
                        </LineChart>
                    </div>

                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="SolarPower" stroke="#b90e0a" dot={false} />
                            {/* <Line name="Solar Power" type="monotone" dataKey="SolarPowerSmooth"  stroke="#b90e0a"  dot={false} /> */}
                        </LineChart>
                    </div>

                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="InverterVoltage" stroke="#1338be" dot={false} />
                            {/* <Line name="Inverter Voltage" type="monotone" dataKey="InverterVoltageSmooth"  stroke="#1338be"  dot={false} /> */}
                        </LineChart>
                    </div>

                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="InverterCurrent" stroke="#03c04a" dot={false} />
                            {/* <Line name="Inverter Current" type="monotone" dataKey="InverterCurrentSmooth"  stroke="#03c04a"  dot={false} /> */}
                        </LineChart>
                    </div>

                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="InverterPower" stroke="#b90e0a" dot={false} />
                            {/* <Line name="Inverter Power" type="monotone" dataKey="InverterPowerSmooth"  stroke="#b90e0a"  dot={false} /> */}
                        </LineChart>
                    </div>

                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="GridVoltage" stroke="#1338be" dot={false} />
                            {/* <Line name="Grid Voltage" type="monotone" dataKey="GridVoltageSmooth" stroke="#1338be"  dot={false} /> */}
                        </LineChart>
                    </div>

                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="GridCurrent" stroke="#03c04a" dot={false} />
                            {/* <Line name="Grid Current" type="monotone" dataKey="GridCurrentSmooth" stroke="#03c04a"  dot={false} /> */}
                        </LineChart>
                    </div>

                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="GridPower" stroke="#b90e0a" dot={false} />
                            {/* <Line name="Grid Power" type="monotone" dataKey="GridPowerSmooth" stroke="#b90e0a"  dot={false} /> */}
                        </LineChart>
                    </div>

                    <div className="chart">
                        <LineChart width={350} height={280} data={dataCharts}
                            margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                            <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Line type="monotone" dataKey="BatteryVoltage" stroke="#1338be" dot={false} />
                            {/* <Line name="Battery Voltage" type="monotone" dataKey="BatteryVoltageSmooth" stroke="#1338be"  dot={false} /> */}
                        </LineChart>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Hero;