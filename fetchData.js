export default async function fetchData(location, unit) {
    try {
        const key = "PKFFMMP8UB9DSZMJ9835283NC";
        const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${key}&unitGroup=${unit}&include=current`;
        const data = await fetch(link, {
            mode: "cors"
        });
        if (!data.ok) {
            return "No data found";
        }
        const processedData = await data.json();
        const result = processedData.days[0];
        return result;
    } catch {
        return "Something is wrong. Please try again";
    }
}
