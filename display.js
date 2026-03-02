import fetchData from "./fetchData.js";
// Select elements
const body = document.querySelector("body");
const input = document.querySelector("input");
const submit = document.querySelector(".submit");
const c = document.querySelector(".C");
const f = document.querySelector(".F");
const container = document.querySelector(".container");

class DisplayData {
    constructor() {
        this.status = true;
        this.unit = "metric";
    }
    validInput(input) {
        if (input.length == 0) return false;
        // Ensuring the functionl only works once at a time
        if (!this.status) return false;
        this.status = false;
        return true;
    }
    // DOM manipulation
    updateUI(data) {
        const unit = this.unit;
        if (unit == "metric") {
            c.style.background = "rgb(241, 244, 90)";
            f.style.background = "white";
        }
        else if (unit == "us") {
            f.style.background = "rgb(138, 219, 246)";
            c.style.background = "white";
        }
        container.innerHTML = "";
        const displayWindow = document.createElement("div");
        displayWindow.setAttribute("class", "displayWindow");
        this.formatData(displayWindow, data);
        container.appendChild(displayWindow);
        // Change the background correspondingly
        this.changeBackground(data.precipprob);
    }
    createData(location) {
        const unit = this.unit;
        if (!this.validInput(location)) return false;
        return fetchData(location, unit)
        .then((response) => {
            this.status = true;
            if (response == "No data found") return false;
            return response;
        })
        .catch((error) => {
            this.status = true;
            console.log(error);
            return false;
        });    
    }
    changeUnit(type) {
        if (type == "C") this.unit = "metric";
        else if (type == "F") this.unit = "us";
    }
    async showData(button, location) {
        if (this.status) {
            if (button == c) this.changeUnit("C");
            else if (button == f) this.changeUnit("F");
            else if (button != submit) return;
            const data = await this.createData(location);
            if (data) this.updateUI(data);
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
}

const panel = new DisplayData();
body.addEventListener("click", (e) => {
    panel.showData(e.target, input.value);
});

