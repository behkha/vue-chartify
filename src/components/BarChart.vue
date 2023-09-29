<template>
  <div class="chart-container">
    <svg v-bind="getChartSvgProps" ref="svg">
      <defs>
        <clipPath :id="`${getId}-round-corner`">
          <rect
            v-for="(value, index) in getValues"
            :key="index"
            :class="{ animation: animation }"
            v-bind="getClipBarProps(index)"
            :ry="barRadius"
          />
        </clipPath>
        <pattern :id="getId" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect
            x="0"
            y="0"
            width="6"
            height="6"
            transform="translate(0,0)"
            :fill="getBarColor(hoveredBarIndex)"
            opacity="0.5"
          ></rect>
          <path
            d="M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9"
            stroke-width="2"
            :stroke="getBarColor(hoveredBarIndex)"
            transform="translate(0,0)"
          ></path>
        </pattern>
      </defs>
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
              v-for="(tick, index) in getValueTicks"
              :key="index"
              v-bind="getVerticalGridLineProps(index)"
            />
          </g>
        </g>
      </g>
      <g class="series-group">
        <g class="series">
          <rect
            class="bar"
            v-for="(value, index) in getValues"
            :key="index"
            :class="{ animation: animation }"
            v-bind="getBarProps(index, false)"
          ></rect>
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

export default defineComponent({
  mixins: [ChartMixin],
  props: {
    barColor: {
      type: String,
      default: 'black'
    },
    barColors: {
      type: Array<string>,
      default: () => []
    },
    barRadius: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      hoveredBarIndex: null
    }
  },
  emits: ['bar:click'],
  computed: {
    getMaxBarHeight(): number {
      return this.getHeight - this.getGap * 2
    }
  },
  methods: {
    getBarColor(index: number): string {
      if (this.barColors.length > 0 && this.barColors.length - 1 >= index) {
        return this.barColors[index]
      }
      return this.barColor
    },
    getBarProps(index: number): object {
      const maxValue = this.getMaxValueTick
      const currentValue = this.getValues[index]
      const y =
        this.getHeight -
        this.getGap * 2 -
        ((currentValue / maxValue) * (this.getMaxBarHeight - this.getGap) || 0)
      const isHovered = this.hoveredBarIndex === index
      const color = isHovered ? `url(#${this.getId})` : this.getBarColor(index)
      const x = Math.max(
        this.getStartFirstSeriesX + index * (this.getSectionWidth + this.getGap),
        0
      )
      const width = Math.max(this.getSectionWidth, 5)
      const height = Math.max(this.getMaxBarHeight - y, 0)
      return {
        x: x,
        y: Math.max(y, 0),
        width: width,
        height: height,
        fill: color,
        style: {
          cursor: isHovered ? 'pointer' : 'normal'
        },
        'clip-path': `url(#${this.getId}-round-corner)`,
        onMouseenter: () => {
          this.hoveredBarIndex = index
        },
        onMouseleave: () => {
          this.hoveredBarIndex = null
        },
        onClick: (event) => {
          this.$emit('bar:click', {
            component: this,
            event: event,
            target: {
              index: index,
              item: this.localDataSource[index]
            }
          })
        }
      }
    },
    getClipBarProps(index: number): object {
      const maxValue = this.getMaxValueTick
      const currentValue = this.getValues[index]
      const y =
        this.getHeight -
        this.getGap * 2 -
        ((currentValue / maxValue) * (this.getMaxBarHeight - this.getGap) || 0)
      const isHovered = this.hoveredBarIndex === index
      const color = isHovered ? `url(#${this.getId})` : this.getBarColor(index)
      const x = Math.max(
        this.getStartFirstSeriesX + index * (this.getSectionWidth + this.getGap),
        0
      )
      return {
        x: x,
        y: Math.max(y, 0),
        width: Math.max(this.getSectionWidth, 5),
        height: Math.max(this.getMaxBarHeight, 0),
        fill: color
      }
    }
  }
})
</script>
