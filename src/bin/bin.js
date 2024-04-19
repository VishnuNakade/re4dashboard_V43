const fetchdatafull = () => {
    const mail = ["ftb001", "stb001", "nrmsv2f001", "rmsv3_001","rmsv3_002","rmsv32_001","rmsv33_001","rmsv33_002"];
    let currentTimestamp = Math.floor(Date.now() / 1000);

    if (caldate) {
        currentTimestamp = Math.floor(new Date(caldate).getTime() / 1000);
    }

    const timestamp24HoursAgo = currentTimestamp - (24 * 60 * 60);

    mail.forEach(email => {
        // Fetch All Data
        const databaseRefFull = ref(db, `data/${email}/timestamp`);
        const queryRefFull = query(databaseRefFull, orderByKey(), startAt("" + timestamp24HoursAgo));

        get(queryRefFull)
            .then((snapshot) => {
                const recordFull = [];
                let k = 0;
                snapshot.forEach((childSnapshot) => {
                    if (email === "ftb001" && childSnapshot.key > 1663660000) {
                        k = 5400;
                    }
                    const uniValue = parseInt((new Date(caldate).getTime() / 1000).toFixed(0)) - 19800;
                    if (childSnapshot.key > uniValue - k && childSnapshot.key < uniValue + 86400 - k) {
                        recordFull.push(childSnapshot);
                    }
                });

                // Create a div element for each email's data
                const divFull = document.createElement('div');
                divFull.classList.add('email-data');

                // Update the content of the div with the email's data
                divFull.innerHTML = `
                    <h3><i class="fa-solid fa-microchip" style="padding:7px"></i> ${email}</h3>
                   
                `;
                // <p style="padding:7px"> Status: ${recordFull.length > 0 ? 'Working' : 'Not Working'}</p>
                if (recordFull.length > 0) {
                    divFull.className = 'border border-success';

                    // Fetch Latest Values Data only if recordFull length is not zero
                    const databaseRef = ref(db, `data/${email}/latestValues`);
                    return get(databaseRef)
                        .then((snapshot) => {
                            const record = snapshot.val();

                            // Construct additional data HTML
                            let additionalDataHTML = '';
                           if (record.gridVoltage.toFixed(2) > 0) {
    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block;background-color:#8cf35d;">Grid is available: ${record.gridVoltage.toFixed(2)}V</span>`;
} else {
    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#fc7266;">Grid is not available: ${record.gridVoltage.toFixed(2)}V</span>`;
}

if (record.batteryVoltage.toFixed(2) > 22) {
    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#8cf35d;">Battery works properly: ${record.batteryVoltage.toFixed(2)}V</span>`;
} else {
    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block;
    background-color:#fc7266;">Battery low: ${record.batteryVoltage.toFixed(2)}V</span>`;
}

additionalDataHTML += "<br>"; // Add line break after two paragraphs

if (record.inverterCurrent.toFixed(2) > 4.5) {
    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block;
    background-color:#fc7266;">System is overloaded: ${record.inverterCurrent.toFixed(2)}V</span>`;
} else {
    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block;
    background-color:#8cf35d;">System works properly: ${record.inverterCurrent.toFixed(2)}V</span>`;
}

                            
                            

                            // Append additional data to divFull
                            divFull.innerHTML += additionalDataHTML;

                            document.getElementById('Working').appendChild(divFull); // Append to 'Working' container
                        })
                        .catch((error) => {
                            console.error(`Error fetching data for ${email}:`, error);
                        });
                } else {
                    divFull.className = 'border border-danger';
                    document.getElementById('notWorking').appendChild(divFull); // Append to 'notWorking' container
                }
            })
            .catch((error) => {
                console.error(`Error fetching data for ${email}:`, error);
            });
    });
};

//end

const fetchdatafull = () => {
    const mail = ["ftb001", "stb001", "nrmsv2f001", "rmsv3_001", "rmsv3_002", "rmsv32_001", "rmsv33_001", "rmsv33_002"];
    let currentTimestamp = Math.floor(Date.now() / 1000);

    if (caldate) {
        currentTimestamp = Math.floor(new Date(caldate).getTime() / 1000);
    }

    const timestamp24HoursAgo = currentTimestamp - (24 * 60 * 60);

    mail.forEach(email => {
        // Fetch All Data
        const databaseRefFull = ref(db, `data/${email}/timestamp`);
        const queryRefFull = query(databaseRefFull, orderByKey(), startAt("" + timestamp24HoursAgo));

        get(queryRefFull)
            .then((snapshot) => {
                const recordFull = [];
                let k = 0;
                snapshot.forEach((childSnapshot) => {
                    if (email === "ftb001" && childSnapshot.key > 1663660000) {
                        k = 5400;
                    }
                    const uniValue = parseInt((new Date(caldate).getTime() / 1000).toFixed(0)) - 19800;
                    if (childSnapshot.key > uniValue - k && childSnapshot.key < uniValue + 86400 - k) {
                        recordFull.push(childSnapshot);
                    }
                });

                // Create a div element for each email's data
                const divFull = document.createElement('div');
                divFull.classList.add('email-data');

                // Update the content of the div with the email's data
                const header = document.createElement('h3');
                header.innerHTML = `<i class="fa-solid fa-microchip" style="padding:7px"></i> ${email}`;
                header.style.marginRight = '10px'; // Add some spacing between elements
                header.style.cursor = 'pointer'; // Change cursor to pointer
                header.addEventListener('click', () => {
                    toggleAdditionalData(divFull);
                });
                divFull.appendChild(header);

                // Construct additional data HTML
                const additionalDataDiv = document.createElement('div');
                additionalDataDiv.classList.add('additional-data');
                additionalDataDiv.style.display = 'none'; // Initially hide additional data
                let additionalDataHTML = '';
                if (recordFull.length > 0) {
                    additionalDataHTML += '<p>';
                    get(ref(db, `data/${email}/latestValues`))
                        .then((snapshot) => {
                            const record = snapshot.val();
                            if (record && record.gridVoltage && record.batteryVoltage && record.inverterCurrent) {
                                if (record.gridVoltage.toFixed(2) > 0) {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block;background-color:#8cf35d;">Grid is available: ${record.gridVoltage.toFixed(2)}V</span>`;
                                } else {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#fc7266;">Grid is not available: ${record.gridVoltage.toFixed(2)}V</span>`;
                                }
                                if (record.batteryVoltage.toFixed(2) > 22) {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#8cf35d;">Battery works properly: ${record.batteryVoltage.toFixed(2)}V</span>`;
                                } else {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#fc7266;">Battery low: ${record.batteryVoltage.toFixed(2)}V</span>`;
                                }
                                if (record.inverterCurrent.toFixed(2) > 4.5) {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#fc7266;">System is overloaded: ${record.inverterCurrent.toFixed(2)}V</span>`;
                                } else {
                                    additionalDataHTML += `<span style="border: 1px solid black; padding: 5px; margin: 10px; display: inline-block; background-color:#8cf35d;">System works properly: ${record.inverterCurrent.toFixed(2)}V</span>`;
                                }
                            }
                            additionalDataHTML += '</p>';
                            additionalDataDiv.innerHTML = additionalDataHTML;
                            divFull.appendChild(additionalDataDiv);
                        })
                        .catch((error) => {
                            console.error(`Error fetching data for ${email}:`, error);
                        });
                }

                // Append divFull to appropriate container
                if (recordFull.length > 0) {
                    divFull.className = 'border border-success';
                    document.getElementById('Working').appendChild(divFull); // Append to 'Working' container
                } else {
                    divFull.className = 'border border-danger';
                    document.getElementById('notWorking').appendChild(divFull); // Append to 'notWorking' container
                }
            })
            .catch((error) => {
                console.error(`Error fetching data for ${email}:`, error);
            });
    });
};

function toggleAdditionalData(element) {
    const additionalDataDiv = element.querySelector('.additional-data');
    if (additionalDataDiv.style.display === 'none') {
        additionalDataDiv.style.display = 'block';
    } else {
        additionalDataDiv.style.display = 'none';
    }
}


//end

const fetchdatafull = () => {
    const mail = ["ftb001", "stb001", "nrmsv2f001", "rmsv3_001","rmsv3_002","rmsv32_001","rmsv33_001","rmsv33_002"];
    let currentTimestamp = Math.floor(Date.now() / 1000);

    if (caldate) {
        currentTimestamp = Math.floor(new Date(caldate).getTime() / 1000);
    }

    const timestamp24HoursAgo = currentTimestamp - (24 * 60 * 60);

    mail.forEach(email => {
        // Fetch All Data
        const databaseRefFull = ref(db, `data/${email}/timestamp`);
        const queryRefFull = query(databaseRefFull, orderByKey(), startAt("" + timestamp24HoursAgo));

        get(queryRefFull)
            .then((snapshot) => {
                const recordFull = [];
                let k = 0;
                snapshot.forEach((childSnapshot) => {
                    if (email === "ftb001" && childSnapshot.key > 1663660000) {
                        k = 5400;
                    }
                    const uniValue = parseInt((new Date(caldate).getTime() / 1000).toFixed(0)) - 19800;
                    if (childSnapshot.key > uniValue - k && childSnapshot.key < uniValue + 86400 - k) {
                        recordFull.push(childSnapshot);
                    }
                });

                // Create a div element for each email's data
                const divFull = document.createElement('div');
                divFull.classList.add('email-data');
                divFull.style.display = 'flex'; // Use flexbox to display elements in a row

                // Update the content of the div with the email's data
                const header = document.createElement('h3');
                header.innerHTML = `<i class="fa-solid fa-microchip" style="padding:7px"></i> ${email}`;
                header.style.marginRight = '10px'; // Add some spacing between elements
                divFull.appendChild(header);
                
                // Check if the record is not working
                if (recordFull.length === 0) {
                    divFull.className = 'border border-danger';
                    document.getElementById('notWorking').appendChild(divFull); // Append to 'notWorking' container
                } else {
                    divFull.className = 'border border-success';

                    // Construct dropdown
                    const dropdown = document.createElement('select');

                    // Apply margin, padding, and size styles
                    dropdown.style.margin = '5px'; // Adjust margin as needed
                    dropdown.style.padding = '5px';
                    dropdown.style.width = '70px'; // Adjust the width as needed
                    dropdown.style.height = '30px'; // Adjust the height as needed

                    // Construct additional data options for dropdown based on if-else conditions
                    let dropdownOptionsHTML = '';
                    dropdownOptionsHTML += `<option value="working">More</option>`;
                    // Append dropdown options to select element
                    dropdown.innerHTML = dropdownOptionsHTML;

                    // Append dropdown to divFull
                    divFull.appendChild(dropdown);

                    // Fetch Latest Values Data only if recordFull length is not zero
                    const databaseRef = ref(db, `data/${email}/latestValues`);
                    return get(databaseRef)
                        .then((snapshot) => {
                            const record = snapshot.val();

                            // Construct additional data HTML here...
                            let additionalDataHTML = '';
                            if (record.gridVoltage && record.batteryVoltage && record.inverterCurrent) {
                                if (record.gridVoltage.toFixed(2) > 0) {
                                    additionalDataHTML += `<option value="grid-available">Grid is available: ${record.gridVoltage.toFixed(2)}V</option>`;
                                } else {
                                    additionalDataHTML += `<option value="grid-not-available">Grid is not available: ${record.gridVoltage.toFixed(2)}V</option>`;
                                }
                                if (record.batteryVoltage.toFixed(2) > 22) {
                                    additionalDataHTML += `<option value="battery-working">Battery works properly: ${record.batteryVoltage.toFixed(2)}V</option>`;
                                } else {
                                    additionalDataHTML += `<option value="battery-low">Battery low: ${record.batteryVoltage.toFixed(2)}V</option>`;
                                }
                                if (record.inverterCurrent.toFixed(2) > 4.5) {
                                    additionalDataHTML += `<option value="system-overloaded">System is overloaded: ${record.inverterCurrent.toFixed(2)}V</option>`;
                                } else {
                                    additionalDataHTML += `<option value="system-working">System works properly: ${record.inverterCurrent.toFixed(2)}V</option>`;
                                }
                            }

                            // Append additional data options to dropdown
                            dropdown.innerHTML += additionalDataHTML;

                            // Append divFull to appropriate container
                            document.getElementById('Working').appendChild(divFull); // Append to 'Working' container
                        })
                        .catch((error) => {
                            console.error(`Error fetching data for ${email}:`, error);
                        });
                }
            })
            .catch((error) => {
                console.error(`Error fetching data for ${email}:`, error);
            });
    });
};

//end

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
            setBatteryCurrent((record[0].batteryCurrent).toFixed(2));
            settValue((record[0].tValue));



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


//To update the code in the fetchdatafull function and reset p1ValueTot, p2ValueTot, and p3ValueTot to 0, you can simply set them to 0 after the previous values are being used. Here's the updated function:

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

// This code will reset p1ValueTot, p2ValueTot, and p3ValueTot to 0 after the fetchdatafull function has fetched data and performed any necessary operations on it.


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
            if (record.length) {
                setDateColor('#8cf35d');
            } else {
                setDateColor('#fc7266');
            }


            if ((record.length) > 0) {
                showAlart("This device is working", "success");
            } else {
                showAlart("This device is not working", "danger");
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
    v11 = 0;
    v12 = 0;

    iterVal = 0;


}








