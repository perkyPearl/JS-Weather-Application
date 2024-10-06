const key = "669d32e9fd2859a8b938a65ba060a29c";

document.querySelector("form").addEventListener('submit', function(e) {
    e.preventDefault();
});

async function search(ev) {
    const phrase = document.querySelector('input[type="text"]').value;
    
    if (!phrase) return;

    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`);
    
    if (!response.ok) {
        console.error("Error fetching location data:", response.statusText);
        return;
    }
    
    const data = await response.json();
    const ul = document.querySelector("form ul");
    ul.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        const { name, lat, lon, country } = data[i];
        ul.innerHTML += `<li data-lat="${Math.round(lat)}" data-lon="${Math.round(lon)}" data-name="${name}">${name} <span>${country}</span></li>`;
    }
}

const debounceSearch = _.debounce(() => {
    search();
}, 600);

async function showWeather(lat, lon, name) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${Math.round(lat)}&lon=${Math.round(lon)}&appid=${key}&units=metric`);

    if (!response.ok) {
        console.error("Error fetching weather data:", response.statusText);
        return;
    }

    const data = await response.json();
    console.log(data);

    if (!data.main) {
        console.error("Weather data is not available");
        return;
    }

    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    const wind = Math.round(data.wind.speed);
    const icon = data.weather[0].icon;

    document.getElementById('city').innerHTML = name;
    document.getElementById('degrees').innerHTML = temp + "<span>°C</span>";
    document.getElementById('feelsLikeValue').innerHTML = feelsLike + "<span>°C</span>";
    document.getElementById('windValue').innerHTML = wind + "<span>KMPH</span>";
    document.getElementById('humidityValue').innerHTML = humidity + "<span>%</span>";
    document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.querySelector('form').style.display = "none";
    document.getElementById('weather').style.display = "block";
}

document.querySelector('input[type="text"]').addEventListener("keyup", debounceSearch);

document.getElementById('change').addEventListener('click', () => {
    document.getElementById("weather").style.display = "none";
    document.querySelector("form").style.display = "block";
});

document.body.addEventListener("click", ev => {
    const li = ev.target.closest('li');
    if (li) {
        const { lat, lon, name } = li.dataset;

        if (lat && lon) {
            localStorage.setItem("lat", lat);
            localStorage.setItem("lon", lon);
            localStorage.setItem("name", name);
            showWeather(lat, lon, name);
        }
    }
});

document.body.onload = () => {
    const lat = localStorage.getItem("lat") || 0;
    const lon = localStorage.getItem("lon") || 0;
    const name = localStorage.getItem("name") || " ";

    if (lat !== 0 && lon !== 0) {
        showWeather(lat, lon, name);
    }
};
