import fetchData from "./fetchData.js";
const body = document.querySelector("body");
const input = document.querySelector("input");
const submit = document.querySelector(".submit");
const c = document.querySelector(".C");
const f = document.querySelector(".F");
const container = document.querySelector(".container");
class displayData {
    constructor() {
        this.status = true;
        this.unit = "metric";
    }
    createData(location, unit) {
        if (location.length == 0) {
            this.status = true;
            return;
        }
        // Ensuring the functionl only works once at a time
        if (this.status == false) return;
        this.status = false;
        container.innerHTML = "";
        fetchData(location, unit)
        .then((response) => {
            this.status = true;
            if (response == "No data found") return;
            // DOM manipulation
            const displayWindow = document.createElement("div");
            displayWindow.setAttribute("class", "displayWindow");
            console.log(response);
            this.formatData(displayWindow, response);
            container.appendChild(displayWindow);
            // Change the background correspondingly
            this.changeBackground(response.precipprob);
        })
        .catch((error) => console.log(error));
    }
    changeUnit(location, type) {
        if (type == "C") this.unit = "metric";
        else if (type == "F") this.unit = "us";
        this.createData(location, this.unit);
    }
    showData(button, location) {
        console.log(`this status: ${this.status}`);
        if (this.status == true) {
            if (button == submit) {
                this.createData(location, this.unit);
            }
            else if (button == c) {
                button.style.background = "rgb(241, 244, 90)";
                f.style.background = "white";
                this.changeUnit(location, "C");
            }
            else if (button == f) {
                button.style.background = "rgb(138, 219, 246)";
                c.style.background = "white";
                this.changeUnit(location, "F");
            } 
        }
    }
    formatData(where, response) {
        let distUnit = null;
        if (this.unit == "metric") distUnit = "km/h";
        else if (this.unit == "us") distUnit = "mile/h";
        const displayName = ["Day", "Description", "Condition", "Temperature", "Humidity", "Rain probability", "Wind speed"];
        const displayThings = ["datetime", "description", "conditions","temp", "humidity", "precipprob", "windspeed"];
        const right = document.createElement("div");
        right.setAttribute("class", "right");
        const left = document.createElement("div");
        left.setAttribute("class", "left");
        for (let i = 0, l = displayThings.length; i < l; i++) {
            const tmp = document.createElement("div");
            tmp.style.display = "flex";
            tmp.style.justifyContent = "center";
            tmp.style.alignItems = "center";
            tmp.style.padding = "0px 8px";
            tmp.style.fontSize = "50%";
            if (i < l / 2 - 1) right.appendChild(tmp);
            else left.appendChild(tmp);
            // Specilising for each properties
            let str = `${displayName[i]}: ${response[displayThings[i]]}`;
            if (displayThings[i] == "temp") {
                tmp.style.gridArea = "1 / 1 / -1 / 1";
                tmp.style.fontSize = "80%";
                if (this.unit == "metric") tmp.textContent = response[displayThings[i]] + c.textContent;
                else tmp.textContent = response[displayThings[i]] + f.textContent;
            }
            else if (displayThings[i] == "windspeed") {
                tmp.textContent = str + distUnit;
            }
            else if (displayThings[i] == "precipprob" || displayThings[i] == "humidity") {
                tmp.textContent = str + "%";
            }
            else tmp.textContent = str;
        }
        where.appendChild(left);
        where.appendChild(right);
    }
    changeBackground(weather) {
        let str = null;
        console.log(Number.parseInt(weather));
        if (Number.parseInt(weather) >= 30) str = "a rain";
        else str = "blazing sun";
        fetch(`https://api.unsplash.com/photos/random?query=${str}&client_id=${'0ZThRkoD_yZyhcActSKTGHNDCqcMR8JD_5g8mcCZsdY'}`, {mode: "cors"})
        .then((response) => {
            if (!response.ok) body.style.background = "black";
            else return response.json();
        })
        .then((response) => {
            if (response == undefined) return;
            console.log(response);
            body.style.background = `url(${response.urls.regular})`;
        })
        .catch((error) => {
            console.log(error);
            body.style.background = "black";
        });
    }
}
const panel = new displayData();
body.addEventListener("click", (e) => {
    panel.showData(e.target, input.value);
});

