export default function changeBackground(weather) {
    const body = document.querySelector("body");
    let str = null;
    if (Number.parseInt(weather) >= 30) str = "a rain";
    else str = "blazing sun";
    const key = "0ZThRkoD_yZyhcActSKTGHNDCqcMR8JD_5g8mcCZsdY"
    fetch(`https://api.unsplash.com/photos/random?query=${str}&client_id=${key}`, {mode: "cors"})
    .then((response) => {
        if (!response.ok) body.style.background = "black";
        else return response.json();
    })
    .then((response) => {
        if (response == undefined) return;
        body.style.background = `url(${response.urls.regular})`;
    })
    .catch((error) => {
        console.log(error);
        body.style.background = "black";
    });
}