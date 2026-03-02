import fetchData from "./fetchData.js";
import changeBackground from "./changeBackground.js";
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
    // Validate the input
    validInput(input) {
        if (input.length == 0) return false;
        // Ensure the function only works once at a time
        if (!this.status) return false;
        this.status = false;
        return true;
    }
    updateUI(data) {
        // Modify unit button's color
        const unit = this.unit;
        if (unit == "metric") {
            c.style.background = "rgb(241, 244, 90)";
            f.style.background = "white";
        }
        else if (unit == "us") {
            f.style.background = "rgb(138, 219, 246)";
            c.style.background = "white";
        }
        // Update the UI using fetched data
        container.innerHTML = "";
        const displayWindow = document.createElement("div");
        displayWindow.setAttribute("class", "displayWindow");
        this.formatData(displayWindow, data);
        container.appendChild(displayWindow);
        // Change the background correspondingly
        changeBackground(data.precipprob);
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
        // Set the unit displayed on the data
        let displayUnit = this.unit == "metric" ? "km/h" : "mile/h"; 
        // Pairs of (displayed name, corresponding name as key of response)
        const pairs = [["Day", "datetime"] , ["Description", "description"], ["Condition", "conditions"], ["Temperature", "temp"], ["Humidity", "humidity"], ["Rain probability", "precipprob"], ["Wind speed", "windspeed"]];
        // Divide the display area into 2 regions: left and right
        const right = document.createElement("div");
        right.setAttribute("class", "right");
        const left = document.createElement("div");
        left.setAttribute("class", "left");
        for (let i = 0, l = pairs.length; i < l; i++) {
            // Add a new weather property to their corresponding region
            const tmp = document.createElement("div");
            tmp.setAttribute("class", "tmp");
            if (i < l / 2 - 1) right.appendChild(tmp);
            else left.appendChild(tmp);
            // Apply specific formats for properties
            const key = pairs[i][1];
            let str = `${pairs[i][0]}: ${response[key]}`;
            if (key == "temp") {
                tmp.setAttribute("id", "temp");
                if (this.unit == "metric") tmp.textContent = response[key] + c.textContent;
                else tmp.textContent = response[key] + f.textContent;
            }
            else if (key == "windspeed") {
                tmp.textContent = str + displayUnit;
            }
            else if (key == "precipprob" || key == "humidity") {
                tmp.textContent = str + "%";
            }
            else tmp.textContent = str;
        }
        where.appendChild(left);
        where.appendChild(right);
    }
}

const panel = new DisplayData();
body.addEventListener("click", (e) => {
    panel.showData(e.target, input.value);
});

