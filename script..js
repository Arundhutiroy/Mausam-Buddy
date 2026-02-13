const apiKey = "016d7eef3f44aa7b69223169da55a035";

function goToWeather() {
    const city = document.getElementById("cityInput").value;
    if (city !== "") {
        window.location.href = "weather.html?city=" + city;
    }
}

function goHome() {
    window.location.href = "index.html";
}

if (window.location.pathname.includes("weather.html")) {

    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {

        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].main;
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        document.getElementById("temp").innerHTML = temp + "°C";
        document.getElementById("cityName").innerHTML = city;
        document.getElementById("desc").innerHTML = desc;

        setBackground(desc);

        const map = L.map('map').setView([22.9734, 78.6569], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(map);

        map.setView([lat, lon], 10);

        L.marker([lat, lon]).addTo(map);

        getForecast(lat, lon);
    });
}

function setBackground(weatherType) {

    const hour = new Date().getHours();

    if (weatherType.toLowerCase().includes("rain")) {
        document.body.style.backgroundImage = "url('rain.jpg')";
    }
    else if (hour >= 6 && hour < 18) {
        document.body.style.backgroundImage = "url('morning.jpg')";
    }
    else {
        document.body.style.backgroundImage = "url('night.jpg')";
    }
}

function getForecast(lat, lon) {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {

        const forecastDiv = document.getElementById("forecast");
        forecastDiv.innerHTML = "";

        for (let i = 0; i < 3; i++) {

            const day = data.list[i * 8];
            const date = new Date(day.dt_txt).toDateString();
            const temp = Math.round(day.main.temp);

            forecastDiv.innerHTML += `
                <div>
                    <p>${date}</p>
                    <p>${temp}°C</p>
                </div>
            `;
        }
    });
}
