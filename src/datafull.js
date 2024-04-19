let p1ValueTotArray = []; // Define p1ValueTotArray outside the function to make it accessible globally

const datafull = async () => {
    try {
        let currentTimestamp = Math.floor(Date.now() / 1000);
        const timestamp24HoursAgo = currentTimestamp - (24 * 60 * 60);
        const uniValue = parseInt((new Date(caldate).getTime() / 1000).toFixed(0)) - 19800;

        p1ValueTotArray = []; // Reset p1ValueTotArray before populating it

        const promises = mail.map(async (mailItem) => {
            const mailSplit = mailItem.split("-")[0].trim(); // Extracting mail without space and hyphen
            const databaseRef = ref(db, `data/${mailSplit}/timestamp`);
            const queryRef = query(databaseRef, orderByKey(), startAt("" + timestamp24HoursAgo));

            const snapshot = await get(queryRef);
            const record = [];
            let k = 0;
            snapshot.forEach((childSnapshot) => {
                if (mailSplit == "ftb001" && childSnapshot.key > 1663660000) {
                    k = 5400;
                }
                if (childSnapshot.key > uniValue - k && childSnapshot.key < uniValue + 86400 - k) {
                    record.push(childSnapshot);
                }
            });

            setdata(record);

            if (record.length) {
                setDateColor('#8cf35d');
            } else {
                setDateColor('#fc7266');
            }

            return (p1ValueTot / 1000).toFixed(2);
        });

        const results = await Promise.all(promises);

        // Flatten the array of arrays into a single array
        const flattenedArray = results.flat();

        console.log("Flattened Array:", flattenedArray);

        p1ValueTotArray = flattenedArray;

        return flattenedArray;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Return null in case of error
    }
}

// Call datafull function
// datafull().then(result => console.log("Result:", result));