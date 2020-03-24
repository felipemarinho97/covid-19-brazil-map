<template>
  <div id="app">
    <div class="info-container">
      <h1>Mapa do COVID-19 por estados brasileiros 🇧🇷</h1>
    </div>
    <div class="map-dashboard">
      <interactive-map
        :departmentsData="departmentsData"
        :metric="metric"
        :center="center"
        :zoom="zoom"
        :zone="regiao"
      ></interactive-map>
      <div class="dash-control">
        <div class="info-container selector">
          <h2>Exibir por:</h2>
          <select v-model="metric">
            <option key="0" value="cases">Casos confirmados</option>
            <option key="1" value="suspects">Casos suspeitos</option>
            <option key="2" value="deaths">Mortes</option>
          </select>
        </div>
        <div class="info-container selector">
          <h2>Região:</h2>
          <select v-model="regiao" @change="onFilterChange()">
            <option key="0" value="Tudo">Tudo</option>
            <option key="1" value="Norte">Norte</option>
            <option key="2" value="Nordeste">Nordeste</option>
            <option key="3" value="Sul">Sul</option>
            <option key="4" value="Sudeste">Sudeste</option>
            <option key="5" value="Centro-Oeste">Centro-Oeste</option>
          </select>
        </div>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import { determineZoom, determineCenter } from "./util";
import axios from "axios";
import InteractiveMap from "./components/InteractiveMap";
import Footer from "./components/Footer";

export default {
  name: "app",
  components: {
    "interactive-map": InteractiveMap,
    "v-footer": Footer
  },
  data() {
    return {
      departmentsData: [],
      center: [-15.752961, -57.854357],
      zoom: 4,
      metric: "cases",
      regiao: "Tudo"
    };
  },
  mounted() {
    axios.get(`https://covid19-brazil-api.now.sh/api/report/v1`).then(res => {
      this.departmentsData = [...res.data.data];
    });
  },
  methods: {
    onFilterChange() {
      this.center = determineCenter(this.regiao);
      this.zoom = determineZoom(this.regiao);
    }
  }
};
</script>

<style>
@import "~leaflet/dist/leaflet.css";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: #202124;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

.map-dashboard {
  display: flex;
}

.dash-control {
  display: flex;
  flex-direction: column;
}

.map-container {
  height: 80vh !important;
  width: 100% !important;
  min-height: 600px !important;
  min-width: 600px !important;
}

.info-container {
  background: #48484a;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin: 1rem;
}

h1,
h2 {
  color: #e5e5e5;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
.info-container > p {
  font-size: 1rem;
  color: rgb(129, 129, 129);
}

.selector {
  padding: 1rem;
  min-width: 150px;
  padding-bottom: 2rem;
}

a {
  text-decoration: none;
  color: #8daac4;
}

@media only screen and (max-width: 600px) {
  .map-container {
    min-width: calc(100% - 0.8rem) !important;
    width: calc(100% - 0.8rem) !important;
  }
  .map-dashboard {
    flex-direction: column-reverse;
  }
  .info-container {
    margin: 0.4rem;
  }

  .info-container > h2 {
    margin: 0.4rem;
  }

  .selector {
    padding-bottom: 1rem;
  }

  .dash-control {
    flex-direction: row;
  }
}
</style>
