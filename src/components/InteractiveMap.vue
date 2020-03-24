<template>
  <l-map class="map-container info-container" :center="center" :zoom="zoom" :options="mapOptions">
    <l-choropleth-layer
      :data="departmentsDataInternal"
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
</template>

<script>
import { LMap } from "vue2-leaflet";
import { InfoControl, ReferenceChart, ChoroplethLayer } from "vue-choropleth";
import brazil from "../data/brazil";

const extraValues = [
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
];

export default {
  name: "app",
  components: {
    LMap,
    "l-info-control": InfoControl,
    "l-reference-chart": ReferenceChart,
    "l-choropleth-layer": ChoroplethLayer
  },
  props: {
    departmentsData: Array,
    center: Array,
    zoom: Number,
    metric: String,
    zone: String
  },
  mounted() {
    this.onUpdate();
  },
  beforeUpdate() {
    this.onUpdate();
  },
  data() {
    return {
      brazilGeoJson: { ...brazil },
      departmentsDataInternal: [],
      chart: {
        title: `Número de casos por unidade federativa`
      },
      colorScale: ["dadada", "f19192", "de4e4e", "b11d1d", "6b0f10", "3e050b"],
      value: {
        key: "cases",
        metric: "Casos confirmados"
      },
      extraValues,
      mapOptions: {
        attributionControl: false
      },
      currentStrokeColor: "3d3213"
    };
  },
  methods: {
    onUpdate() {
      this.extraValues = extraValues.filter(val => val.key !== this.metric);
      this.value = extraValues.filter(val => val.key === this.metric)[0];
      this.chart.title = `Número de ${this.value.metric.toLowerCase()} por unidade federativa`;

      if (this.zone === "Tudo") {
        this.brazilGeoJson.features = [...brazil.features];
      } else {
        this.brazilGeoJson.features = brazil.features.filter(
          feature => feature.properties.REGIAO === this.zone
        );
      }
      let allowedUFs = this.brazilGeoJson.features.map(
        feature => feature.properties.UF_05
      );

      this.departmentsDataInternal = this.departmentsData.filter(dep =>
        allowedUFs.includes(dep.uf)
      );
    },
    updateOnPropChange(newVal, oldVal) {
      if (newVal !== oldVal) this.$forceUpdate();
    }
  },
  watch: {
    departmentsData(...args) {
      this.updateOnPropChange(...args);
    },
    metric(...args) {
      this.updateOnPropChange(...args);
    }
  }
};
</script>

<style>
</style>