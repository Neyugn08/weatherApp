export default async function fetchData(location, unit) {
    try {
        const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=PKFFMMP8UB9DSZMJ9835283NC&unitGroup=${unit}`;
        const data = await fetch(link, {
            mode: "cors"
        })
        if (!data.ok) {
            return "No data found";
        }
        const processedData = await data.json();
        // It's too expensive to forecast 7 days per round
        /*let result = [];
        for (let i = 0; i < 7; i++) {
            result.push(processedData.days[i]);
        }*/
        const result = processedData.days[0];
        return result;
    } catch {
        return "Something is wrong. Please try again";
    }
}
