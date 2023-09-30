<template>
  <div class="main">
    <div class="charts">
      <vc-bar-chart
        :data-source="ageDataSource"
        argument-field="state"
        value-field="maleyoung"
        :show-value-axis-line="showValueAxisLine"
        :show-argument-axis-line="showArgumentAxisLine"
        :show-value-titles="showValueTitles"
        :show-argument-titles="showArgumentTitles"
        :show-value-labels="showValueLabels"
        :show-horizontal-grid-lines="showHorizontalGridLines"
        :show-vertical-grid-lines="showVerticalGridLines"
        :bar-colors="['#454d66', '#309975', '#58b368', '#dad873', '#efeeb4', '#454d66', '#309975']"
        :bar-radius="5"
        :animation="true"
        :custom-value-label="getValueLabel"
      />
      <vc-bar-chart
        :data-source="ageDataSource"
        argument-field="state"
        value-field="malemiddle"
        :show-value-axis-line="showValueAxisLine"
        :show-argument-axis-line="showArgumentAxisLine"
        :show-value-titles="showValueTitles"
        :show-argument-titles="showArgumentTitles"
        :show-value-labels="showValueLabels"
        :show-horizontal-grid-lines="showHorizontalGridLines"
        :show-vertical-grid-lines="showVerticalGridLines"
        :bar-colors="['#e0f0ea', '#95adbe', '#574f7d', '#503a65', '#3c2a4d', '#e0f0ea', '#95adbe']"
        :bar-radius="5"
        :animation="true"
        :custom-value-label="getValueLabel"
      />
      <vc-bar-chart
        :data-source="[
          {
            text: 'item 1',
            value: 1
          },
          {
            text: 'item 2',
            value: 2
          },
          {
            text: 'item 3',
            value: 3
          },
          {
            text: 'item 4',
            value: 4
          },
          {
            text: 'item 5',
            value: 5
          },
          {
            text: 'item 5',
            value: 6
          },
          {
            text: 'item 5',
            value: 1
          }
        ]"
        argument-field="text"
        value-field="value"
        :show-value-axis-line="showValueAxisLine"
        :show-argument-axis-line="showArgumentAxisLine"
        :show-value-titles="showValueTitles"
        :show-argument-titles="showArgumentTitles"
        :show-value-labels="showValueLabels"
        :show-horizontal-grid-lines="showHorizontalGridLines"
        :show-vertical-grid-lines="showVerticalGridLines"
        :bar-colors="['#361d32', '#543c52', '#f55951', '#edd2cb', '#f1e8e6', '#361d32', '#543c52']"
        :bar-radius="5"
        :animation="true"
        :custom-value-label="getValueLabel"
      />
    </div>
    <div class="charts">
      <vc-line-chart
        :data-source="dataSource"
        argument-field="continent"
        value-field="area"
        :show-value-axis-line="showValueAxisLine"
        :show-argument-axis-line="showArgumentAxisLine"
        :show-value-titles="showValueTitles"
        :show-argument-titles="showArgumentTitles"
        :show-value-labels="showValueLabels"
        :show-horizontal-grid-lines="showHorizontalGridLines"
        :show-vertical-grid-lines="showVerticalGridLines"
        line-color="#343090"
        :line-width="3"
        :animation="true"
        :custom-value-label="getValueLabel"
        :show-points="true"
      />
      <vc-line-chart
        :data-source="dataSource"
        argument-field="continent"
        value-field="population"
        :show-value-axis-line="showValueAxisLine"
        :show-argument-axis-line="showArgumentAxisLine"
        :show-value-titles="showValueTitles"
        :show-argument-titles="showArgumentTitles"
        :show-value-labels="showValueLabels"
        :show-horizontal-grid-lines="showHorizontalGridLines"
        :show-vertical-grid-lines="showVerticalGridLines"
        line-color="#44c2fd"
        :line-width="3"
        :animation="true"
        :custom-value-label="getValueLabel"
        :show-points="true"
      />
    </div>
    <div class="inputs">
      <div>
        <input v-model="showValueAxisLine" type="checkbox" id="showValueAxisLineCheckbox" />
        <label for="showValueAxisLineCheckbox">Show Value Axis Line</label>
      </div>

      <div>
        <input v-model="showArgumentAxisLine" type="checkbox" id="showArgumentAxisLineCheckbox" />
        <label for="showArgumentAxisLineCheckbox">Show Argument Axis Line</label>
      </div>

      <div>
        <input v-model="showValueTitles" type="checkbox" id="showValueTitles" />
        <label for="showValueTitles">Show Value Titles</label>
      </div>

      <div>
        <input v-model="showArgumentTitles" type="checkbox" id="showArgumentTitles" />
        <label for="showArgumentTitles">Show Argument Titles</label>
      </div>

      <div>
        <input v-model="showValueLabels" type="checkbox" id="showValueLabels" />
        <label for="showValueLabels">Show Value Labels</label>
      </div>

      <div>
        <input v-model="showVerticalGridLines" type="checkbox" id="showVerticalGridLines" />
        <label for="showVerticalGridLines">Show Vertical Grid Lines</label>
      </div>

      <div>
        <input v-model="showHorizontalGridLines" type="checkbox" id="showHorizontalGridLines" />
        <label for="showHorizontalGridLines">Show Horizontal Grid Lines</label>
      </div>

      <div>
        <label for="barColor">Bar Color: </label>
        <input v-model="barColor" id="barColor" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VcLineChart from './components/VcLineChart.vue'
import VcBarChart from './components/VcBarChart.vue'
export default defineComponent({
  components: { VcLineChart, VcBarChart },
  data() {
    return {
      dataSource: [
        {
          continent: 'Europe',
          population: 740433713,
          area: 22134710,
          density: 33
        },
        {
          continent: 'Africa',
          population: 1460481772,
          area: 29648481,
          density: 49
        },
        {
          continent: 'South America',
          population: 439719009,
          area: 17461112,
          density: 25
        },
        {
          continent: 'North America',
          population: 604182517,
          area: 21330000,
          density: 28
        },
        {
          continent: 'Asia',
          population: 4753079726,
          area: 31033131,
          density: 153
        },
        {
          continent: 'Australia',
          population: 46004866,
          area: 8486460,
          density: 5
        },
        {
          continent: 'Antartica',
          population: 0,
          area: 13720000,
          density: 0
        }
      ],
      ageDataSource: [
        {
          state: 'USA',
          maleyoung: 29.956,
          malemiddle: 90.354,
          maleolder: 14.472,
          femaleyoung: 28.597,
          femalemiddle: 91.827,
          femaleolder: 20.362
        },
        {
          state: 'Brazil',
          maleyoung: 25.607,
          malemiddle: 55.793,
          maleolder: 3.727,
          femaleyoung: 24.67,
          femalemiddle: 57.598,
          femaleolder: 5.462
        },
        {
          state: 'Russia',
          maleyoung: 13.493,
          malemiddle: 48.983,
          maleolder: 5.802,
          femaleyoung: 12.971,
          femalemiddle: 52.14,
          femaleolder: 12.61
        },
        {
          state: 'Japan',
          maleyoung: 9.575,
          malemiddle: 43.363,
          maleolder: 9.024,
          femaleyoung: 9.105,
          femalemiddle: 42.98,
          femaleolder: 12.501
        },
        {
          state: 'Mexico',
          maleyoung: 17.306,
          malemiddle: 30.223,
          maleolder: 1.927,
          femaleyoung: 16.632,
          femalemiddle: 31.868,
          femaleolder: 2.391
        },
        {
          state: 'Germany',
          maleyoung: 6.679,
          malemiddle: 28.638,
          maleolder: 5.133,
          femaleyoung: 6.333,
          femalemiddle: 27.693,
          femaleolder: 8.318
        },
        {
          state: 'United Kindom',
          maleyoung: 5.816,
          malemiddle: 19.622,
          maleolder: 3.864,
          femaleyoung: 5.519,
          femalemiddle: 19.228,
          femaleolder: 5.459
        }
      ],
      showValueAxisLine: true,
      showArgumentAxisLine: true,
      showValueTitles: true,
      showArgumentTitles: true,
      showValueLabels: true,
      showVerticalGridLines: true,
      showHorizontalGridLines: true,
      barColor: 'blue'
    }
  },
  methods: {
    getValueLabel(value: number) {
      if (value > 0 && value < 1) {
        const precision = Math.ceil(-Math.log10(value))
        return value.toFixed(precision)
      }
      return value.toLocaleString()
    }
  }
})
</script>

<style lang="scss" scoped>
.main {
  display: block;
  width: 100%;
}

.charts {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.checkbox-wrapper {
  display: block;
}
</style>
