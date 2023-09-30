<template>
  <div class="chart-container">
    <svg v-bind="getSvgProps" ref="svg">
      <g class="grid">
        <g class="grid-lines">
          <g v-if="showHorizontalGridLines" class="horizontal-grid-lines">
            <path
              v-for="(tick, index) in getValueTicks"
              :key="index"
              v-bind="getHorizontalGridLineProps(index)"
            />
          </g>
          <g v-if="showVerticalGridLines" class="vertical-grid-lines">
            <path
              v-for="(tick, index) in getValues"
              :key="index"
              v-bind="getVerticalGridLineProps(index)"
            />
          </g>
        </g>
      </g>
      <g class="series-group">
        <g class="series">
          <polyline
            class="line"
            :class="{ animation: animation }"
            v-bind="getPolylineProps"
          ></polyline>
          <g v-if="showPoints" class="points">
            <circle
              v-for="(value, index) in getValues"
              :key="index"
              class="point"
              :class="{ animation: animation }"
              v-bind="getPointProps(index)"
            />
          </g>
          <g v-if="showValueLabels">
            <text
              v-for="(value, index) in getValues"
              :key="'value-' + index"
              v-bind="getValueLabelProps(index)"
            >
              {{ customValueLabel(value, index) }}
            </text>
          </g>
        </g>
      </g>
      <g class="axis">
        <g class="val-axis">
          <g v-if="showValueAxisLine" class="val-lines">
            <path v-bind="getValuesAxisLineProps" />
            <path
              v-for="(tick, index) in getValueTicks"
              :key="index"
              v-bind="getValueTickProps(index)"
            />
          </g>
          <g v-if="showValueTitles" class="val-title">
            <text
              v-for="(tick, index) in getValueTickTitles"
              :key="index"
              v-bind="getValueAxisTitleProps(index)"
            >
              {{ tick }}
            </text>
          </g>
        </g>
        <g class="arg-axis">
          <g v-if="showArgumentAxisLine" class="arg-lines">
            <path v-bind="getArgumentsAxisLineProps" />
            <path
              v-for="(value, index) in getValues"
              :key="index"
              v-bind="getArgumentTickProps(index)"
            />
          </g>
          <g v-if="showArgumentTitles" class="arg-title">
            <text
              v-for="(arg, index) in getArguments"
              :key="index"
              v-bind="getArgumentAxisTitleProps(index)"
            >
              {{ arg }}
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChartMixin from '../mixins/ChartMixin.vue'
import { isHighPivot } from '../utils/lineChart'
import type { PolylineAttributes } from '../types/attributes.types'

export default defineComponent({
  mixins: [ChartMixin],
  props: {
    lineColor: {
      type: String,
      default: 'black'
    },
    lineWidth: {
      type: Number,
      default: 3
    },
    showPoints: {
      type: Boolean,
      default: true
    }
  },
  emits: ['point:click'],
  data() {
    return {
      hoveredPoint: -1
    }
  },
  computed: {
    getMaxBarHeight(): number {
      return this.getHeight - this.getGap * 2
    },
    getPolylineProps(): PolylineAttributes {
      const zeroPoint = this.getChartZeroPoint
      const maxValue = this.getMaxValueTick === 0 ? 1 : this.getMaxValueTick
      const firstLineX = this.getSeriesCenterX(0)
      const firstLineY =
        zeroPoint.y - ((this.getValues[0] / maxValue) * (zeroPoint.y - this.getGap) || 0)
      const xValues = [firstLineX]
      const yValues = [firstLineY]
      for (let i = 1; i < this.getValues.length; i++) {
        const x = xValues[i - 1] + (this.getSeriesWidth + this.getGap)
        const y = zeroPoint.y - ((this.getValues[i] / maxValue) * (zeroPoint.y - this.getGap) || 0)

        xValues.push(x)
        yValues.push(y)
      }
      const points = xValues.map((x, i) => `${x},${yValues[i]}`).join(' ')
      return {
        points: points,
        style: {
          fill: 'none',
          stroke: this.lineColor,
          'stroke-width': this.lineWidth
        },
        xValues,
        yValues
      }
    }
  },
  methods: {
    getValueLabelProps(index: number): object {
      const { yValues } = this.getPolylineProps
      const labelX = this.getSeriesCenterX(index)
      const labelY = yValues[index] // Adjust the value label position as needed
      const highPivot = isHighPivot(this.getValues, index)
      const offset = highPivot ? -20 : 20
      const adjustedLabelY = labelY + offset
      return {
        x: labelX,
        y: adjustedLabelY,
        'text-anchor': 'middle',
        fill: this.fontColor,
        'font-size': this.fontSize,
        'font-family': this.fontFamily,
        style: {
          'user-select': 'none'
        }
      }
    },
    getPointProps(index: number): object {
      const { xValues, yValues } = this.getPolylineProps
      const isHovered = this.hoveredPoint === index
      return {
        cx: xValues[index],
        cy: yValues[index],
        r: this.lineWidth * 2,
        stroke: isHovered ? this.lineColor : 'white',
        'stroke-width': this.lineWidth,
        fill: isHovered ? 'white' : this.lineColor,
        style: {
          cursor: isHovered ? 'pointer' : 'normal'
        },
        onMouseenter: () => {
          this.hoveredPoint = index
        },
        onMouseleave: () => {
          this.hoveredPoint = -1
        },
        onClick: (event: Event) => {
          this.$emit('point:click', {
            component: this,
            event: event,
            target: {
              index: index,
              item: this.localDataSource[index]
            }
          })
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>

.chart-container {
  width: 100%;
  display: block;
}

.line.animation {
  animation: drawPolyline 2s linear forwards;
}

@keyframes drawPolyline {
  from {
    stroke-dashoffset: 100%;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
