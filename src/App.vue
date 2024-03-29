<template>
  <div id="app">
    <div class="info-container">
      <h1>Mapa do COVID-19 por estados brasileiros 🇧🇷</h1>
    </div>
    <div class="map-dashboard">
      <div class="dash-control left" style="width:  30%">
        <div class="info-container selector date-selector">
          <h2>Escolher data:</h2>
          <select v-model="selectedDate[1]" @change="onDateChange()">
            <option v-for="day in datesUntilToday" :key="day" :value="day">{{
              day
            }}</option>
          </select>
        </div>
        <div class="info-container selector timer-selector">
          <h2>Controles:</h2>
          <form>
            <input type="checkbox" id="checkbox" v-model="autoUpdates" />
            <label for="checkbox" style="color: rgba(229, 229, 229, 0.77)">
              Auto-atualizar</label
            >
          </form>
        </div>
        <div class="info-container">
          <h2>Curva no {{ regiao }}</h2>
          <line-chart
            id="line"
            :data="lineData"
            xkey="date"
            ykeys='[ "cases", "deaths" ]'
            :resize="true"
            gridTextSize="8"
            smooth="true"
            labels='[ "Casos confirmados", "Mortes" ]'
            line-colors='[ "#36A2EB", "#FF6384" ]'
          >
          </line-chart>
        </div>
      </div>
      <div class="center-container">
        <interactive-map
          :departmentsData="departmentsData"
          :metric="metric"
          :center="center"
          :zoom="zoom"
          :zone="regiao"
        ></interactive-map>
        <vue-slider
          class="date-slider"
          @change="onDateChange()"
          :tooltip="'always'"
          :marks="true"
          :hide-label="true"
          :adsorb="true"
          v-model="selectedDate"
          :data="datesUntilToday"
          :process="true"
          :process-style="{ backgroundColor: '#ccc' }"
          :tooltip-style="{
            backgroundColor: '#1a1a1d',
            borderColor: '#151517'
          }"
        >
          <template v-slot:step="{ label, active }">
            <div :class="['custom-step', { active }]"></div>
          </template>
        </vue-slider>
      </div>
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
            <option key="0" value="Brasil">Brasil</option>
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
import {
  determineZoom,
  determineCenter,
  getDaysArray,
  getAllFullReports,
  getLineData,
  isMobile
} from "./util";
import { get } from "axios";
import InteractiveMap from "./components/InteractiveMap";
import Footer from "./components/Footer";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import LineChart from "vue-morris/src/components/line-chart";

export default {
  name: "app",
  components: {
    VueSlider,
    LineChart,
    "interactive-map": InteractiveMap,
    "v-footer": Footer
  },
  data() {
    return {
      autoUpdates: !isMobile(),
      updater: null,
      lineData: [],
      reports: [],
      selectedDate: ["2020-02-26", new Date().toISOString().slice(0, 10)],
      datesUntilToday: getDaysArray(new Date("2020-02-26")),
      departmentsData: [],
      center: [-15.752961, -57.854357],
      zoom: 4,
      metric: "cases",
      regiao: "Brasil"
    };
  },
  beforeUpdate() {
    const startDate = this.datesUntilToday.indexOf(this.selectedDate[0]);
    this.lineData = getLineData(
      this.reports.slice(startDate),
      this.datesUntilToday.slice(startDate),
      this.regiao
    );
  },
  mounted() {
    get(`https://covid19-brazil-api.now.sh/api/report/v1`).then(res => {
      this.departmentsData = [...res.data.data];
    });

    getAllFullReports(new Date("2020-02-26")).then(res => {
      this.reports = res.reports;
      this.datesUntilToday = res.availableDates;
    });

    if (this.autoUpdates)
      this.updater = setInterval(this.pushDateForward, 2000);
  },
  methods: {
    onFilterChange() {
      this.center = determineCenter(this.regiao);
      this.zoom = determineZoom(this.regiao);
    },
    onDateChange() {
      this.departmentsData = this.reports[
        this.datesUntilToday.indexOf(this.selectedDate[1])
      ];
    },
    pushDateForward() {
      let startIndex = this.datesUntilToday.indexOf(this.selectedDate[0]);
      let index = this.datesUntilToday.indexOf(this.selectedDate[1]) + 1;

      if (this.datesUntilToday[index] == undefined) {
        index = startIndex;
      }

      this.selectedDate = [
        this.datesUntilToday[startIndex],
        this.datesUntilToday[index]
      ];
    }
  },
  watch: {
    selectedDate() {
      this.onDateChange();
    },
    autoUpdates(newProp, oldProp) {
      if (newProp !== oldProp) {
        if (this.autoUpdates) {
          this.updater = setInterval(this.pushDateForward, 2000);
        } else {
          clearInterval(this.updater);
        }
      }
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

.center-container {
  height: 100% !important;
  width: 100% !important;
}

.map-container {
  height: 100% !important;
  width: 100% !important;
  min-height: 600px !important;
  min-width: 400px !important;
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
@media only screen and (min-width: 900px) {
  .date-selector {
    display: none;
  }
}

@media only screen and (max-width: 900px) {
  .map-container {
    min-width: calc(100% - 2rem) !important;
    width: calc(100% - 2rem) !important;
    margin: 1rem !important;
    min-height: 80vh !important;
    max-height: 80vh !important;
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
    margin: auto;
    flex-direction: row;
  }

  .dash-control.left {
    width: 100% !important;
    display: flex;
    flex-direction: column;
  }

  .date-slider {
    display: none !important;
  }
}

.custom-step {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #1a1a1d;
  background-color: #43464d;
}
.custom-step.active {
  box-shadow: 0 0 0 3px #ccc;
  background-color: #ccc;
}

.vue-slider-rail {
  background-color: #1a1a1d;
}
</style>
