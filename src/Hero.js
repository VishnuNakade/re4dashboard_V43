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
import { Button, Modal } from 'react-bootstrap';



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
let v11 = 0;
let v12 = 0;
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
const myArray11 = []
const myArray12 = []
let iterVal = 0;




const Hero = ({ handleLogout }) => {
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
    const [batteryCurrent, setBatteryCurrent] = useState('')
    const [tValue, settValue] = useState('')




    var curr = new Date(new Date());
    curr.setDate(curr.getDate());
    var dateOrg = curr.toISOString().substring(0, 10);
    var dd1 = dateOrg.split('-');

    const [caldate, setCalDate] = useState(dateOrg);
    const [dateColor, setDateColor] = useState('#8cf35d');

    // console.log(caldate)


    // Sidebar
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedItem, setSelectedItem] = useState('ftb001');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

const handleMenuItemClick = (itemName) => {
    setSelectedItem(itemName);
    // Save the selected item to localStorage
    localStorage.setItem('selectedItem', itemName);
    // You can perform any other actions here based on the selected item
};

// Add this code to your component to retrieve the selected item from localStorage
useEffect(() => {
    const storedItem = localStorage.getItem('selectedItem');
    if (storedItem) {
        setSelectedItem(storedItem);
    }
}, []); // This effect runs only once when the component mounts

    //Sidebar end


    //Alarts
    const [alart, setAlart] = useState(null)
    const showAlart = (message, type) => {
        setAlart({
            msg: message,
            type: type
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
        var solarValue = solarVoltage * solarCurrent;
    
        // Check if there is a solar failure
        if (isSolarFailure(solarValue)) {
            SolarAlart(`Solar failure detected between 6:00 AM and 5:30 PM. ${(solarCurrent * solarVoltage).toFixed(2)} W`);
        } else {
            SolarAlart(`Solar system is operational. ${(solarCurrent * solarVoltage).toFixed(2)} W`);
        }
        //..........................................Solar check end.............................................
    
        //..........................................Inverter check  Start........................................
    
        function checkInverterStatus(solarVoltage, solarCurrent, batteryCharge, loadStatus, gridAvailability, inverterOutput) {
            // Condition 1: Solar voltage present but zero current during peak time
            if (solarVoltage > 0 && solarCurrent === 0 && isPeakTime()) {
                InverterAlart("Inverter failure: Solar power is not charging.");
            }
    
            // Condition 2: Solar power charged, but load running on Grid
            if (solarVoltage > 0 && batteryCharge === 100 && loadStatus === "Grid") {
                InverterAlart("Inverter failure: Load is running on Grid instead of inverter.");
            }
    
            // Condition 3: Inverter loading only when Grid is available
            if (inverterOutput > 0 && !gridAvailability) {
                InverterAlart("Inverter failure: Inverter only works when Grid is available.");
            }
    
            // Condition 4: Inverter output is zero despite availability of solar, grid, and battery
            if (solarVoltage > 0 && gridAvailability && batteryCharge > 0 && inverterOutput === 0) {
                InverterAlart("Inverter failure: Inverter output is zero.");
            }
    
            // If none of the conditions match, return success
            InverterAlart(`Inverter is functioning properly.  ${(inverterVoltage * inverterCurrent).toFixed(2)} W`);
        }
    
        // Function to check if it's peak time (10am to 2pm)
        function isPeakTime() {
            const currentTime = new Date();
            const currentHour = currentTime.getHours();
            return currentHour >= 10 && currentHour <= 14;
        }
    
        // Example usage:
        const loadStatus = inverterVoltage < gridVoltage ? "Grid" : "Inverter"; // Example load status (can be "Grid" or "Inverter")
        const gridAvailability = gridVoltage > 0; // Example grid availability (true/false)
        const inverterOutput = inverterVoltage * inverterCurrent; // Example inverter output power in watts
        const batteryCharge = 100; 
        checkInverterStatus(solarVoltage, solarCurrent, batteryCharge, loadStatus, gridAvailability, inverterOutput);
    
        //..........................................Inverter check  End..........................................
    
        //..........................................Battery check Start..........................................
        // No battery check code provided
        //..........................................Battery check End............................................
    
        // InverterAlart("hello i am inverter");
        BatteryAlart("Hello i am battery");
        //   SolarAlart("hello i am solar");
    }, [solarVoltage, solarCurrent, inverterVoltage, inverterCurrent, gridVoltage]);

    







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
                settValue((record[0].tValue));
                setBatteryCurrent((record[0].batteryCurrent !== undefined ? (record[0].batteryCurrent).toFixed(2) : 0));




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
                v11 = 0;
                v12 = 0;
                iterVal = 0;
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });



    }
    const LastUpdate = new Date(tValue * 1000);
    const formattedDate = LastUpdate.toLocaleString();





    const fetchdatafull = () => {
        let currentTimestamp = Math.floor(Date.now() / 1000);
    
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
                    if (mail == "ftb001" && childSnapshot.key > 1663660000) {
                        k = 5400;
                    }
                    if (childSnapshot.key > uniValue - k && childSnapshot.key < uniValue + 86400 - k) {
                        record.push(childSnapshot)
                    }
                })
                setdata(record);
    
                // Check conditions and update color after data fetching
                if (record.length) {
                    setDateColor('#8cf35d');
                } else {
                    setDateColor('#fc7266');
                }
    
                if (record.length > 0) {
                    showAlart("This device is working", "success");
                } else {
                    showAlart("This device is not working", "danger");
                }
            })
            .finally(() => {
                // Resetting variables
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
                v11 = 0;
                v12 = 0;
                iterVal = 0;
            });
    }





    p1ValueTot = 0;
    p2ValueTot = 0;
    p3ValueTot = 0;




    const dataCharts = Object.entries(data)
        .map(([key, value]) => {
            let dateForGraph, dateForCalculation;
            var mail = `${selectedItem}`

            if (value.key > 1663660000 && mail == "ftb001") {

                const t = new Date((Number(value.key) + (5400 - 230)) * 1000);
                dateForGraph = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(t);

                dateForCalculation = new Intl.DateTimeFormat('en-US', { hour: '2-digit', hour12: false }).format(t);

                if (prevTime == Number(dateForCalculation)) {
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
                const t = new Date(value.key * 1000);
                dateForGraph = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(t);

                dateForCalculation = new Intl.DateTimeFormat('en-US', { hour: '2-digit', hour12: false }).format(t);


                if (prevTime == Number(dateForCalculation)) {
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

                v11 = Math.abs(value.val().batteryCurrent)
                myArray11.push(v11)

                v12 = Math.abs((value.val().batteryVoltage) * (value.val().batteryCurrent))
                myArray12.push(v12)

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
                myArray11.push(Math.abs(value.val().batteryCurrent))
                myArray12.push(Math.abs((value.val().batteryVoltage) * (value.val().batteryCurrent)))

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
                let sum11 = 0;
                let sum12 = 0;

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
                    sum11 = sum11 + myArray11[i]
                    sum12 = sum12 + myArray12[i]
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
                v11 = sum11 / 10
                v12 = sum12 / 10
            }
            return {
                ccAxisXValue: dateForGraph,
                SolarVoltage: Math.floor(Math.abs(value.val().solarVoltage)),
                SolarCurrent: Math.abs(value.val().solarCurrent).toFixed(2),
                SolarPower: Math.floor( Math.abs((value.val().solarVoltage) * (value.val().solarCurrent))),

                InverterVoltage: Math.floor( Math.abs(value.val().inverterVoltage)),
                InverterCurrent:  Math.abs(value.val().inverterCurrent).toFixed(2),
                InverterPower: Math.floor( Math.abs((value.val().inverterVoltage) * (value.val().inverterCurrent))),

                GridVoltage: Math.floor( Math.abs(value.val().gridVoltage)),
                GridCurrent:Math.abs(value.val().gridCurrent).toFixed(2),
                GridPower:Math.floor( Math.abs((value.val().gridVoltage) * (value.val().gridCurrent))),

                BatteryVoltage: Math.floor( Math.abs(value.val().batteryVoltage)),
                BatteryCurrent: Math.abs(value.val().batteryCurrent).toFixed(2),
                BatteryPower: Math.floor( Math.abs((value.val().batteryVoltage) * (value.val().batteryCurrent))),

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
                BatteryCurrentSmooth: v11,
                BatteryPowerSmooth: v12,

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


    //-------------------card color-------------------------------------

    // Effect to update the color when solarVoltage changes
    const [cardSolarVoltage, setcardSolarVoltage] = useState('card');
    const [cardSolarCurrent, setcardSolarCurrent] = useState('card');
    const [cardInverterVoltage, setcardInverterVoltage] = useState('card');
    const [cardInverterCurrent, setcardInverterCurrent] = useState('card');
    const [cardGridVoltage, setcardGridVoltage] = useState('card');
    const [cardGridCurrent, setcardGridCurrent] = useState('card');
    const [cardBatteryVoltage, setcardBatteryVoltage] = useState('card');
    const [cardBatteryCurrent, setcardBatteryCurrent] = useState('card');


    useEffect(() => {
        // Update the class name based on solarVoltage
        const ClassSolarVoltage = solarVoltage > 2 ? 'card Highl' : 'card Lowl';
        const ClassSolarCurrent = solarCurrent > 0 ? 'card Highl' : 'card Lowl';
        const ClassInverterVoltage = inverterVoltage > 180 ? 'card Highl' : 'card Lowl';
        const ClassInverterCurrent = inverterCurrent > 0 ? 'card Highl' : 'card Lowl';
        const ClassGridVoltage = gridVoltage > 160 ? 'card Highl' : 'card Lowl';
        const ClassGridCurrent = gridCurrent > 0 ? 'card Highl' : 'card Lowl';
        const ClassBatteryVoltage = batteryVoltage > 22 ? 'card Highl' : 'card Lowl';
        const ClassBatteryCurrent = batteryCurrent > 0 ? 'card Highl' : 'card Lowl';


        setcardSolarVoltage(ClassSolarVoltage);
        setcardSolarCurrent(ClassSolarCurrent);
        setcardInverterVoltage(ClassInverterVoltage);
        setcardInverterCurrent(ClassInverterCurrent);
        setcardGridVoltage(ClassGridVoltage);
        setcardGridCurrent(ClassGridCurrent);
        setcardBatteryVoltage(ClassBatteryVoltage);
        setcardBatteryCurrent(ClassBatteryCurrent);

    }, [solarVoltage, solarCurrent, inverterVoltage, inverterCurrent, gridVoltage, gridCurrent, batteryVoltage, batteryCurrent]);

    // console.log(tValue);

    //LineChart Modal

    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal4, setShowModal4] = useState(false);
    const [showModal5, setShowModal5] = useState(false);
    const [showModal6, setShowModal6] = useState(false);
    const [showModal7, setShowModal7] = useState(false);
    const [showModal8, setShowModal8] = useState(false);
    const [showModal9, setShowModal9] = useState(false);
    const [showModal10, setShowModal10] = useState(false);
    const [showModal11, setShowModal11] = useState(false);
    const [showModal12, setShowModal12] = useState(false);

    const handleCloseModal1 = () => setShowModal1(false);
    const handleCloseModal2 = () => setShowModal2(false);
    const handleCloseModal3 = () => setShowModal3(false);
    const handleCloseModal4 = () => setShowModal4(false);
    const handleCloseModal5 = () => setShowModal5(false);
    const handleCloseModal6 = () => setShowModal6(false);
    const handleCloseModal7 = () => setShowModal7(false);
    const handleCloseModal8 = () => setShowModal8(false);
    const handleCloseModal9 = () => setShowModal9(false);
    const handleCloseModal10 = () => setShowModal10(false);
    const handleCloseModal11 = () => setShowModal11(false);
    const handleCloseModal12 = () => setShowModal12(false);

    const handleShowModal1 = () => setShowModal1(true);
    const handleShowModal2 = () => setShowModal2(true);
    const handleShowModal3 = () => setShowModal3(true);
    const handleShowModal4 = () => setShowModal4(true);
    const handleShowModal5 = () => setShowModal5(true);
    const handleShowModal6 = () => setShowModal6(true);
    const handleShowModal7 = () => setShowModal7(true);
    const handleShowModal8 = () => setShowModal8(true);
    const handleShowModal9 = () => setShowModal9(true);  
    const handleShowModal10 = () => setShowModal10(true);
    const handleShowModal11 = () => setShowModal11(true);
    const handleShowModal12 = () => setShowModal12(true);



    return (
        <section className='hero'>

            {/* Navbar and Sidebar */}
            <nav style={{ justifyContent: "space-between" }}>

                {/* <h2>Welcome</h2> */}
                {/* <img style={{ width: 190, height: 60 }} src={reImg} alt="re4billion" />

                <Link to="/">
                <button type="button" className="btn btn-primary" style={{width:'100px'}}><i className="fa-solid fa-bars-progress" style={{padding:'4px'}}></i>Status</button>
                </Link>
                

                <button type="button" className="btn btn-success" onClick={toggleSidebar} style={{width:'100px'}}><i className="fa-solid fa-list" style={{padding:'4px'}}></i>Devices</button>

               

                    <Link to="https://maps.re4billion.ai/">
                    <button type="button" className="btn btn-info" style={{width:'100px'}}><i className="fa-solid fa-location-dot" style={{padding:'4px'}}></i>Location</button>
                    </Link>

<button type="button" className="btn btn-danger"onClick={handleLogout}style={{width:'100px'}}><i className="fa-solid fa-right-from-bracket" style={{padding:"4px"}}></i>Logout</button>

<button type="button" className="btn btn-warning" style={{width:'107px',backgroundColor:'#FFBF00'}}> 
<div id="txt">
<i className="fa-solid fa-clock" style={{padding:'4px'}}></i>
      {time}
    </div>
</button> */}





                <div className="App">
                    {/* Sidebar */}
                    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                        <div className="sidebar-content">
                            <ul>
                                <li style={{ backgroundColor: 'DodgerBlue', color: 'black', fontSize: '23px', position: 'sticky', top: '0' }}>
                                    <i className="fa-solid fa-microchip" style={{ padding: "5px" }}></i>
                                    Devices
                                </li>

                                <li style={{ backgroundColor: selectedItem === 'ftb001' ? 'Orange' : '' }} onClick={() => handleMenuItemClick('ftb001')}>ftb001-Kollar</li>

                                <li style={{ backgroundColor: selectedItem === 'stb001' ? 'red' : '' }} onClick={() => handleMenuItemClick('stb001')}>stb001-Modiyur</li>

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

                                <li style={{ backgroundColor: selectedItem === 'rmsv4_002' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv4_002')}>rmsv4_002-Testing</li>

                                <li style={{ backgroundColor: selectedItem === 'rmsv4_003' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv4_003')}>rmsv4_003-Testing</li>

                                <li style={{ backgroundColor: selectedItem === 'rmsv33_007' ? 'Violet' : '' }} onClick={() => handleMenuItemClick('rmsv33_007')}>rmsv33_007-Testing</li>

                            </ul>
                        </div>


                    </div>


                </div>
            </nav>


            {/* Card section */}
            <div className={`content ${sidebarOpen ? 'shifted' : ''}`}>

                <nav className="navbar navbar-expand-lg navbar-light bg-info stickyTop">
                    <a className="navbar-brand text-white" href="#">Dashboard</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto menu3">
                            <li className="nav-item active">
                                <Link className="nav-link text-white" to="https://re4billion.ai/">Home<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link text-white" onClick={toggleSidebar}>Devices<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link text-white" to="/Alldevices">Status<span className="sr-only">(current)</span></Link>
                            </li>

                            <li className="nav-item active">
                                <Link className="nav-link text-white" to="/" >Location<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link text-white" to="/Data" >Datasheet<span className="sr-only">(current)</span></Link>
                            </li>
                            {/* <li className="nav-item active">
        <Link className="nav-link text-white" to="/History" >History<span className="sr-only">(current)</span></Link>
      </li> */}


                            {/* <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>
      </li> */}

                        </ul>

                        <ul className="navbar-nav ml-auto" style={{ paddingRight: '15px' }}>
                            <li className="nav-item active">
                                <Link className="nav-link text-white">Last update on : {formattedDate}<span className="sr-only">(current)</span></Link>
                            </li>
                        </ul>

                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <Link className="nav-link text-white" onClick={handleLogout}>Logout<span className="sr-only">(current)</span></Link>
                            </li>
                        </ul>

                    </div>
                </nav>
                <hr style={{ margin: '3px 0', borderTop: '0.5px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }} />



                <Alart alart={alart} InverterCheck={InverterCheck} BatteryCheck={BatteryCheck} SolarCheck={SolarCheck} />



                <div className="wrapper">

                    <div className={cardSolarVoltage}>
                        <h2 className="card_title">Solar Voltage</h2>
                        <h3 className="card_value" style={{ paddingLeft: '35px' }}><i class="fa-solid fa-solar-panel" style={{ padding: '10px' }}></i><strong>{solarVoltage} V</strong></h3>
                    </div>

                    <div className={cardSolarCurrent}>
                        <h2 className="card_title">Solar Current</h2>
                        <h3 className="card_value" style={{ paddingLeft: '35px' }}><i class="fa-solid fa-solar-panel" style={{ padding: '10px' }}></i><strong>{solarCurrent} A</strong></h3>
                    </div>

                    <div className={cardInverterVoltage}>
                        <h2 className="card_title">Inverter Voltage</h2>
                        <h3 className="card_value" style={{ paddingLeft: '35px' }}><i class="fa-solid fa-box" style={{ padding: '10px' }}></i><strong>{inverterVoltage} V</strong></h3>
                    </div>

                    <div className={cardInverterCurrent}>
                        <h2 className="card_title">Inverter Current</h2>
                        <h3 className="card_value" style={{ paddingLeft: '35px' }}><i class="fa-solid fa-box" style={{ padding: '10px' }}></i><strong>{inverterCurrent} A</strong></h3>
                    </div>

                    <div className={cardGridVoltage}>
                        <h2 className="card_title">Grid Voltage</h2>
                        <h3 className="card_value" style={{ paddingLeft: '35px' }}><i class="fa-solid fa-bolt" style={{ padding: '10px' }}></i><strong>{gridVoltage} V</strong></h3>
                    </div>

                    <div className={cardGridCurrent}>
                        <h2 className="card_title">Grid Current</h2>
                        <h3 className="card_value" style={{ paddingLeft: '35px' }}><i class="fa-solid fa-bolt" style={{ padding: '10px' }}></i><strong>{gridCurrent} A</strong></h3>
                    </div>

                    <div className={cardBatteryVoltage}>
                        <h2 className="card_title">Battery Voltage</h2>
                        <h3 className="card_value" style={{ paddingLeft: '35px' }}><i class="fa-solid fa-battery-full" style={{ padding: '10px' }}></i><strong>{batteryVoltage} V</strong></h3>
                    </div>

                    {(batteryCurrent !== undefined && batteryCurrent !== 0) && (
                        <div className={cardBatteryCurrent}>
                            <h2 className="card_title">Battery Current</h2>
                            <h3 className="card_value" style={{ paddingLeft: '35px' }}><i class="fa-solid fa-battery-full" style={{ padding: '10px' }}></i><strong>{batteryCurrent} A</strong></h3>
                        </div>
                    )}



                </div>


                <div className="wrapper">
                    <div className="card" style={{ background: "linear-gradient(45deg,#2ed8b6,#59e0c5)", color: "white" }}>
                        <h2 className="card_title">Solar Generation </h2>
                        <h3 className="card_value"><strong>{(p1ValueTot / 1000).toFixed(2)} kWh</strong></h3>
                    </div>

                    <div className="card" style={{ background: "linear-gradient(45deg,#4099ff,#73b4ff)", color: "white" }}>
                        <h2 className="card_title">Grid Energy </h2>
                        <h3 className="card_value"><strong>{(p2ValueTot / 1000).toFixed(2)} kWh</strong></h3>
                    </div>

                    <div className="card" style={{ background: "linear-gradient(45deg,#FF5370,#ff869a)", color: "white" }}>
                        <h2 className="card_title">Load Consumption</h2>
                        <h3 className="card_value"><strong>{(p3ValueTot / 1000).toFixed(2)} kWh</strong></h3>
                    </div>
                </div>
                <hr style={{ margin: '3px 0', borderTop: '0.5px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }} />


                <div className="calenderPlace">
                    <input
                        type="date"
                        defaultValue={dateOrg}
                        onChange={e => { setCalDate(e.target.value) }}
                        style={{ backgroundColor: dateColor }}
                    />
                </div>



                <div className="chartArea">

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal1}></i>
                        <div className="chart">
                            <LineChart width={340} height={280} data={dataCharts}
                                margin={{ top: 0, right: 30, left: 0, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem' }} />
                                <YAxis style={{ fontSize: '0.8rem' }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem' }} />
                                <Tooltip />
                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                <Line type="monotone" dataKey="SolarVoltage" stroke="#1338be" dot={false} />
                                {/* <Line name="Solar Voltage" type="monotone" dataKey="SolarVoltageSmooth"  stroke="#1338be"  dot={false} /> */}
                            </LineChart>
                        </div>
                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal2}></i>
                        <div className="chart">
                            <LineChart width={350} height={280} data={dataCharts}
                                margin={{ top: 0, right: 30, left: 0, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
                                <Tooltip />
                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                <Line type="monotone" dataKey="SolarCurrent" stroke="#03c04a" dot={false} />
                                {/* <Line name="Solar Current" type="monotone" dataKey="SolarCurrentSmooth"  stroke="#ff0000"  dot={false} /> */}
                            </LineChart>
                        </div>
                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal3}></i>
                        <div className="chart">
                            <LineChart width={350} height={280} data={dataCharts}
                                margin={{ top: 0, right: 30, left: 0, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
                                <Tooltip />
                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                <Line type="monotone" dataKey="SolarPower" stroke="#b90e0a" dot={false} />
                                {/* <Line name="Solar Power" type="monotone" dataKey="SolarPowerSmooth"  stroke="#b90e0a"  dot={false} /> */}
                            </LineChart>
                        </div>
                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal4}></i>
                        <div className="chart">
                            <LineChart width={340} height={280} data={dataCharts}
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
                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal5}></i>
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
                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal6}></i>
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

                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal7}></i>
                        <div className="chart">
                            <LineChart width={340} height={280} data={dataCharts}
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
                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal8}></i>
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
                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal9}></i>
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
                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal10}></i>
                        <div className="chart">
                            <LineChart width={340} height={280} data={dataCharts}
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

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal11}></i>
                        <div className="chart">
                            <LineChart width={350} height={280} data={dataCharts}
                                margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
                                <Tooltip />
                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                <Line type="monotone" dataKey="BatteryCurrent" stroke="#03c04a" dot={false} />
                                {/* <Line name="Grid Current" type="monotone" dataKey="GridCurrentSmooth" stroke="#03c04a"  dot={false} /> */}
                            </LineChart>
                        </div>
                    </div>

                    <div className="chart-container">
                        <i class="fa-solid fa-up-right-and-down-left-from-center" style={{ float: 'right', marginTop: '-12px', paddingRight: '5px', cursor: 'pointer' }} onClick={handleShowModal12}></i>
                        <div className="chart">
                            <LineChart width={350} height={280} data={dataCharts}
                                margin={{ top: 35, right: 30, left: 20, bottom: 5, }} >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
                                <Tooltip />
                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                <Line type="monotone" dataKey="BatteryPower" stroke="#b90e0a" dot={false} />
                                {/* <Line name="Grid Power" type="monotone" dataKey="GridPowerSmooth" stroke="#b90e0a"  dot={false} /> */}
                            </LineChart>
                        </div>
                    </div>


                    {/* //////////////////////////////////Modal Start///////////////////////////////////////// */}

                    <Modal show={showModal1} onHide={handleCloseModal1} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Solar Voltage</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal1}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem' }} />
                                                <YAxis style={{ fontSize: '0.8rem' }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem' }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="SolarVoltage" stroke="#1338be" dot={false} />
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal2} onHide={handleCloseModal2} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Solar Current</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal2}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="SolarCurrent" stroke="#03c04a" dot={false} />
                                                {/* <Line name="Solar Current" type="monotone" dataKey="SolarCurrentSmooth"  stroke="#ff0000"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal3} onHide={handleCloseModal3} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Solar Power</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal3}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="SolarPower" stroke="#b90e0a" dot={false} />
                                                {/* <Line name="Solar Power" type="monotone" dataKey="SolarPowerSmooth"  stroke="#b90e0a"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal4} onHide={handleCloseModal4} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Inverter Voltage</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal4}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="InverterVoltage" stroke="#1338be" dot={false} />
                                                {/* <Line name="Inverter Voltage" type="monotone" dataKey="InverterVoltageSmooth"  stroke="#1338be"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal5} onHide={handleCloseModal5} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Inverter Current</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal5}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="InverterCurrent" stroke="#03c04a" dot={false} />
                                                {/* <Line name="Inverter Current" type="monotone" dataKey="InverterCurrentSmooth"  stroke="#03c04a"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal6} onHide={handleCloseModal6} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Inverter Power</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal6}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="InverterPower" stroke="#b90e0a" dot={false} />
                                                {/* <Line name="Inverter Power" type="monotone" dataKey="InverterPowerSmooth"  stroke="#b90e0a"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal7} onHide={handleCloseModal7} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Grid Voltage</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal7}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Volts)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="GridVoltage" stroke="#1338be" dot={false} />
                                                {/* <Line name="Grid Voltage" type="monotone" dataKey="GridVoltageSmooth" stroke="#1338be"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal8} onHide={handleCloseModal8} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Grid Current</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal8}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="GridCurrent" stroke="#03c04a" dot={false} />
                                                {/* <Line name="Grid Current" type="monotone" dataKey="GridCurrentSmooth" stroke="#03c04a"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal9} onHide={handleCloseModal9} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Grid Power</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal9}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="GridPower" stroke="#b90e0a" dot={false} />
                                                {/* <Line name="Grid Power" type="monotone" dataKey="GridPowerSmooth" stroke="#b90e0a"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal10} onHide={handleCloseModal10} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Battery Voltage</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal10}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
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
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal11} onHide={handleCloseModal11} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>Battery Current</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal11}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Amps)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="BatteryCurrent" stroke="#03c04a" dot={false} />
                                                {/* <Line name="Grid Current" type="monotone" dataKey="GridCurrentSmooth" stroke="#03c04a"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal12} onHide={handleCloseModal12} centered dialogClassName="custom-modal-dialog">
                        <Modal.Header>
                            <Modal.Title>BatteryPower</Modal.Title>
                            <i class="fa-solid fa-xmark" style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={handleCloseModal12}></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Increase the width by changing col-12 to a larger value */}
                                        <div className="chart">
                                            <LineChart width={800} height={450} data={dataCharts}
                                                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ccAxisXValue" angle={-15} textAnchor="end" style={{ fontSize: '0.8rem', }} />
                                                <YAxis style={{ fontSize: '0.8rem', }} label={{ dx: -10, value: '(Watts)', angle: -90, fontSize: '0.9rem', }} />
                                                <Tooltip />
                                                <Legend layout="horizontal" verticalAlign="top" align="center" />
                                                <Line type="monotone" dataKey="BatteryPower" stroke="#b90e0a" dot={false} />
                                                {/* <Line name="Grid Power" type="monotone" dataKey="GridPowerSmooth" stroke="#b90e0a"  dot={false} /> */}
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* /////////////////////////////////Modal End //////////////////////////////////////////*/}


                </div>
            </div>

        </section>
    );
};

export default Hero;