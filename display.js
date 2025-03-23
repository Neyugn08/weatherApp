import fetchData from "./fetchData.js";
import "./style.css";
const body = document.querySelector("body");
const input = document.querySelector("input");
const submit = document.querySelector(".submit");
const c = document.querySelector(".C");
const f = document.querySelector(".F");
const container = document.querySelector(".container");

let unit = "metric";
body.addEventListener("click", (e) => {
    if (e.target == submit) showData(input.value, unit);
    else if (e.target == c) {
        e.target.style.background = "rgb(241, 244, 90)";
        f.style.background = "transparent";
        unitConve(input.value, "C");
    }
    else if (e.target == f) {
        e.target.style.background = "rgb(138, 219, 246)";
        c.style.background = "transparent";
        unitConve(input.value, "F");
    } 
});


function showData(location, unit) {
    if (location.length == 0) return;
    container.innerHTML = "";
    fetchData(location, unit)
    .then((response) => {
        const displayWindow = document.createElement("div");
        displayWindow.style.border = "1px solid black";
        displayWindow.style.width = "100%";
        displayWindow.style.height = "50vh";
        displayWindow.style.overflowY = "auto";
        displayWindow.style.fontSize = "4vw";
        displayWindow.style.display = "flex";
        displayWindow.style.flexDirection = "column";
        displayWindow.style.justifyContent = "center";
        console.log(response);
        const displayThings = ["datetime", "description", "conditions", "humidity", "precipprob", "temp", "tempmax", "tempmin", "windspeed"];
        for (let i = 0, l = displayThings.length; i < l; i++) {
            displayWindow.innerHTML += `<div>${displayThings[i]}: ${response[displayThings[i]]}<div>`
        }
        container.appendChild(displayWindow);
    })
    .catch((error) => console.log(error));
}

function unitConve(location, type) {
    if (type == "C") unit = "metric";
    else if (type == "F") unit = "uk";
    showData(location, unit);
}