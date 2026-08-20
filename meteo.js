"use strict";

const meteo_layout = document.querySelector("#meteo_layout");

// Ajoute le contenu HTML dans l'élément météo
function afficherMeteo(html) {
  meteo_layout.innerHTML = html;
}

async function getWeather() {
  const latitude = -4.2634;
  const longitude = 15.2429;

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données météo");
    }

    const data = await response.json();

    return data.current;
  } catch (error) {
    alert("Une erreur est survenue, veuillez recharger la page");
    console.error(error);
  }
}

function tellTheWeather(weather_code) {
  switch (weather_code) {
    case 0:
      return "soleil";

    case 1:
      return "peu_nuageux";

    case 2:
      return "partiellement_nuageux";

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
      return "pluie";

    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return "neige";

    case 95:
    case 96:
    case 99:
      return "orage";

    default:
      return "inconnu";
  }
}

function formatWeather(data) {
  const mainMesure = renderMainMesure(data);
  const secondaryMesure = renderSecondaryMesure(data);

  return mainMesure + secondaryMesure;
}

function renderMainMesure(data) {
  const temps = tellTheWeather(data.weather_code);
  const description = getDescription(temps);

  const html = `
    <section class="primary-mesure ${temps}">
      <h1 class="city-name">
        Brazzaville, <span class="country-name">Rép. du Congo</span>
      </h1>

      <div class="temperature-container">
        <img
          src="images/${temps}.png"
          alt=""
          class="time-icon"
        >

        <div class="temperature">
          <h2>
            ${data.temperature_2m}°<span class="temperature-unit">c</span>
          </h2>

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
  const temps = tellTheWeather(data.weather_code);

  const html = `
    <section class="secondary-mesures">

    
      <div class="mesure-card">
        <img
          src="images/vent.png"
          alt=""
          class="secondary-icon"
        >
        <h3>${data.wind_speed_10m} km/h</h3>
        <p>Vitesse du vent</p>
      </div>

      <div class="mesure-card">
        <img
          src="images/humidite.png"
          alt=""
          class="secondary-icon"
        >
        <h3>${data.relative_humidity_2m} %</h3>
        <p>Humidité</p>
      </div>

      <div class="mesure-card">
        <img
          src="images/du-froid.png"
          alt=""
          class="secondary-icon"
        >
        <h3>${data.apparent_temperature} °C</h3>
        <p>Ressenti</p>
      </div>

      <div class="mesure-card">
        <img
          src="images/resilience-climatique.png"
          alt=""
          class="secondary-icon"
        >
        <h3>${formatWeatherName(temps)}</h3>
        <p>Conditions</p>
      </div>

    </section>
  `;

  return html;
}

function formatWeatherName(temps) {
  return temps
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function getDescription(temps) {
  const descriptions = {
    soleil: "Une belle journée ensoleillée",

    peu_nuageux: "Quelques nuages à prévoir",

    partiellement_nuageux: "Un ciel partiellement nuageux",

    nuageux: "Un ciel couvert aujourd’hui",

    brouillard: "Du brouillard à prévoir",

    bruine: "De petites averses sont possibles",

    pluie: "De la pluie est attendue aujourd’hui",

    neige: "De la neige est attendue aujourd’hui",

    orage: "Risque d’orages aujourd’hui",

    inconnu: "Conditions météorologiques inconnues",
  };

  return descriptions[temps];
}

getWeather().then((data) => {
  if (data) {
    afficherMeteo(formatWeather(data));
  }
});