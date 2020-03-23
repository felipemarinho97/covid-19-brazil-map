<template>
  <div id="app">
    <div class="info-container">
      <h1>Mapa do COVID-19 por estados brasileiros 🇧🇷</h1>
    </div>
    <div style="display: flex">
      <l-map
        :key="value.key"
        class="map-container info-container"
        :center="[-15.752961, -57.854357]"
        :zoom="4"
        :options="mapOptions"
      >
        <l-choropleth-layer
          :data="departmentsData"
          titleKey="state"
          idKey="uid"
          :value="value"
          :extraValues="extraValues"
          geojsonIdKey="GEOCODIGO"
          :geojson="brazilGeoJson"
          :colorScale="colorScale"
        >
          <template slot-scope="props">
            <l-info-control
              :item="props.currentItem"
              :unit="props.unit"
              title="Estado"
              placeholder="Passe o mouse sobre um estado"
            />
            <l-reference-chart
              :title="chart.title"
              :colorScale="colorScale"
              :min="props.min"
              :max="props.max"
              position="topright"
            />
          </template>
        </l-choropleth-layer>
      </l-map>
      <div class="info-container selector">
        <h2>Filtrar por:</h2>
        <select v-model="value" @change="onSelectChange()">
          <option
            v-for="option in selectValues"
            :key="option.metric"
            :value="option"
          >
            {{ option.metric }}
          </option>
        </select>
      </div>
    </div>
    <div class="info-container">
      <a
        class="github-icon"
        href="https://github.com/felipemarinho97/covid-19-brazil-map"
      >
        <svg
          data-v-37df6889=""
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="github-icon material-icons"
        >
          <path
            data-v-37df6889=""
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            class="github-icon"
          ></path>
        </svg>
      </a>
      <p>
        Dados obtidos por
        <a href="https://covid19-brazil-api.now.sh" target="_blank"
          >https://covid19-brazil-api.now.sh</a
        >
        - Copyleft ® Felipe Marinho
      </p>
    </div>
  </div>
</template>

<script>
import { LMap } from "vue2-leaflet";
import { InfoControl, ReferenceChart, ChoroplethLayer } from "vue-choropleth";
import axios from "axios";
import brazil from "./data/brazil.json";

export default {
  name: "app",
  components: {
    LMap,
    "l-info-control": InfoControl,
    "l-reference-chart": ReferenceChart,
    "l-choropleth-layer": ChoroplethLayer
  },
  data() {
    return {
      chart: { title: "Número de casos confirmados por unidade federativa" },
      departmentsData: [],
      brazilGeoJson: brazil,
      colorScale: ["dadada", "f19192", "de4e4e", "b11d1d", "6b0f10", "3e050b"],
      value: {
        key: "cases",
        metric: "Casos confirmados"
      },
      extraValues: [
        {
          key: "cases",
          metric: "Casos confirmados"
        },
        {
          key: "deaths",
          metric: "Mortes"
        },
        {
          key: "suspects",
          metric: "Casos suspeitos"
        }
      ],
      selectValues: [],
      mapOptions: {
        attributionControl: false
      },
      currentStrokeColor: "3d3213"
    };
  },
  mounted() {
    axios.get(`https://covid19-brazil-api.now.sh/api/report/v1`).then(res => {
      this.departmentsData = res.data.data;
      this.selectValues = [...this.extraValues];
      this.extraValues = this.selectValues.filter(
        val => val.key !== this.value.key
      );
    });
  },
  methods: {
    onSelectChange() {
      this.extraValues = this.selectValues.filter(
        val => val.key !== this.value.key
      );
      this.chart.title = `Número de ${this.value.metric.toLowerCase()} por unidade federativa`;
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
  height: 100%;
  min-width: 150px;
  padding-bottom: 2rem;
}

a {
  text-decoration: none;
  color: #8daac4;
}

.github-icon {
  fill: white;
  padding-top: 1rem;
}
</style>
