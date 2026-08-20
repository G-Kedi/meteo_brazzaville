"use strict";

const meteo_layout = document.querySelector("#meteo_layout");

// // Ajoute le contenu HTML dans l'élément tables
function afficherMeteo(html) {
  meteo_layout.innerHTML = html;
}

async function getWeather() {
  const latitude = -4.2634;
  const longitude = 15.2429;
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`,
    );

    if (response.ok) {
      const data = await response.json();
      return data.current;
    }
  } catch (error) {
    alert("une erreur est survenue, veuillez recharger la page");
  }
}

function tellTheWeather(weather_code) {
  switch (weather_code) {
    case 0:
      return "soleil";

    case 1:
    case 2:
      return "peu_nuageux";

    case 3:
      return "nuageux";

    case 45:
    case 48:
      return "brouillard";

    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return "bruine";

    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return "pluie_abondante";

    case 95:
    case 96:
    case 99:
      return "orage";

    default:
      return "soleil";
  }
}

function formatWeather(data) {
  const mainMesure = renderMainMesure(data);
  const secondaryMesure = renderSecondaryMesure(data);
  const html = mainMesure + secondaryMesure;

  return html;
}

function renderMainMesure(data) {
  let temps = tellTheWeather(data.weather_code);
  let description = getDescription(temps);
  let html = `<section class="primary-mesure ${temps}">
            <h1 class="city-name">Brazzaville, <span class="country-name">Rép. du Congo</span></h1>
            <div class="temperature-container">
                <img src="images/${temps}.png" alt="" class="time-icon">
                <div class="temperature">
                    <h2>${data.temperature_2m}°<span class="temperature-unit">c</span></h2>
                    <p class="description">
                        ${description}
                    </p>
                </div>
            </div>
        </section>
    `;

  return html;
}

function renderSecondaryMesure(data) {
  let temps = tellTheWeather(data.weather_code);
  let html = `
    <section class="secondary-mesures">
            <div class="mesure-card">
                <img src="images/vent.png" alt="" class="secondary-icon">
                <h3>${data.wind_speed_10m} km/h</h3>
                <p>Vitesse du vent</p>
            </div>
            <div class="mesure-card">
                <img src="images/humidite.png" alt="" class="secondary-icon">
                <h3>${data.relative_humidity_2m} %</h3>
                <p>Humidité</p>
            </div>
            <div class="mesure-card">
                <img src="images/du-froid.png" alt="" class="secondary-icon">
                <h3>${data.apparent_temperature} °C</h3>
                <p>Ressenti</p>
            </div>
            <div class="mesure-card">
                <img src="images/resilience-climatique.png" alt="" class="secondary-icon">
                <h3>${temps}</h3>
            </div>
        </section>  
    `;

  return html;
}

function getDescription(temps) {
  if (temps === "soleil") {
    return "Une belle journée ensoleillée";
  } else if (temps === "peu_nuageux") {
    return "Quelques nuages à prévoir";
  } else if (temps === "nuageux") {
    return "Un ciel couvert aujourd’hui";
  } else if (temps === "brouillard") {
    return "Du bouilard à prévoir";
  } else if (temps === "pluie_abondante") {
    return "Des pluies sont attendues aujourd’hui";
  } else if (temps === "bruine") {
    return "De petites averses sont possibles";
  } else if (temps === "orage") {
    return "Risque d’orages aujourd’hui";
  }
}

getWeather().then((data) => {
  afficherMeteo(formatWeather(data));
});
