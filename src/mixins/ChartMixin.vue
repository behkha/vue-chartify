<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { GridLineOptions, Breakpoints, Breakpoint } from '../types/chartProps.types'
import {
  generateUniqueId,
  getTicks,
  shortenNumber,
  calculateWidthOfText
} from '../utils/general'
import { getAxisLineProps } from '../utils/chart'
import type { SVGAttributes } from 'vue'
import type { AxisTitleAttributes } from '../types/attributes.types'
import { AxisLineType } from '../types/axis.types'

export default defineComponent({
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    dataSource: {
      type: Array<Object>,
      default: () => [],
      required: true
    },
    argumentField: {
      type: String,
      default: '',
      required: true
    },
    valueField: {
      type: String,
      default: '',
      required: true
    },
    showValueLabels: {
      type: Boolean,
      default: false
    },
    showArgumentTitles: {
      type: Boolean,
      default: true
    },
    showValueTitles: {
      type: Boolean,
      default: true
    },
    showValueAxisLine: {
      type: Boolean,
      default: true
    },
    showArgumentAxisLine: {
      type: Boolean,
      default: true
    },
    showHorizontalGridLines: {
      type: Boolean,
      default: false
    },
    showVerticalGridLines: {
      type: Boolean,
      default: false
    },
    horizontalGridLineOptions: {
      type: Object as PropType<GridLineOptions>,
      default: () => ({
        stroke: '#dddddd80',
        'stroke-width': '1px'
      })
    },
    verticalGridLineOptions: {
      type: Object as PropType<GridLineOptions>,
      default: () => ({
        stroke: '#dddddd80',
        'stroke-width': '1px'
      })
    },
    fontSize: {
      type: String,
      default: '12px'
    },
    fontColor: {
      type: String,
      default: 'black'
    },
    fontFamily: {
      type: String,
      default: 'Arial, Helvetica, sans-serif'
    },
    animation: {
      type: Boolean,
      default: true
    },
    animationDuration: {
      type: String,
      default: '0.5s'
    },
    customValueLabel: {
      type: Function,
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      default: (value: number, index: number) => {
        return value
      }
    },
    breakpoints: {
      type: Object as PropType<Breakpoints>,
      default: () => ({
        xs: {
          width: '576px',
          gap: '20px'
        },
        sm: {
          width: '768px',
          gap: '22px'
        },
        md: {
          width: '992px',
          gap: '25px'
        },
        lg: {
          width: '1200px',
          gap: '27px'
        },
        xl: {
          width: '1400px',
          gap: '30px'
        }
      })
    }
  },
  data() {
    return {
      uniqueId: '',
      svgWidth: 0,
      windowWidth: window.innerWidth,
      localDataSource: [...this.dataSource]
    }
  },
  computed: {
    getId(): string {
      return this.uniqueId
    },
    getHeight(): number {
      return parseInt(this.height, 10)
    },
    getWidth(): number {
      return this.svgWidth
    },
    getSvgProps(): SVGAttributes {
      return {
        width: this.width,
        height: this.height
      }
    },
    getMaxBreakpoint(): Breakpoint | null {
      let maxWidth: number = 0
      let maxBreakpoint: Breakpoint | null = null

      Object.keys(this.breakpoints).forEach((key) => {
        const { width } = this.breakpoints[key]
        if (parseInt(width, 10) > maxWidth) {
          maxWidth = parseInt(width, 10)
          maxBreakpoint = this.breakpoints[key]
        }
      })

      return maxBreakpoint
    },
    getCurrentBreakpoint(): Breakpoint | null {
      const windowWidth = this.windowWidth
      const breakpoints = this.breakpoints

      const keys = Object.keys(breakpoints)
      let selectedKey = null
      for (const key of keys) {
        const breakpointWidth = parseInt(breakpoints[key].width, 10)
        if (windowWidth < breakpointWidth) {
          selectedKey = key
          break
        }
      }

      return selectedKey ? breakpoints[selectedKey] : this.getMaxBreakpoint
    },
    getGap(): number {
      const currentBreakpoint = this.getCurrentBreakpoint
      if (!currentBreakpoint) return 30
      return parseInt(currentBreakpoint.gap, 10)
    },
    getChartStartX(): number {
      return this.getGap * 2
    },
    getChartStartY(): number {
      return this.getHeight - this.getGap * 2;
    },
    getChartEndX(): number {
      return this.svgWidth - this.getGap;
    },
    getChartZeroPoint(): {
      x: number
      y: number
    } {
      return {
        x: this.getChartStartX,
        y: this.getChartStartY
      }
    },
    getSeriesStartX(): number {
      return this.getChartStartX + this.getGap;
    },
    getTotalChartGap(): number {
      return (this.getValues.length + 1) * this.getGap
    },
    getSeriesGroupWidth(): number {
      return this.svgWidth - (this.getSeriesStartX + this.getGap)
    },
    getSeriesWidth(): number {
      return this.getSeriesGroupWidth / this.getValues.length - this.getGap
    },
    getValueTicks(): number[] {
      const minValue = Math.min(...this.getValues)
      const maxValue = Math.max(...this.getValues)
      return getTicks(minValue, maxValue, 10)
    },
    getValueTickTitles(): string[] {
      return this.getValueTicks.map((item: number) => shortenNumber(item))
    },
    getMaxValueTick(): number {
      const length = this.getValueTicks.length
      return this.getValueTicks[length - 1]
    },
    getValuesAxisLineProps(): SVGAttributes {
      const zeroPoint = this.getChartZeroPoint
      return getAxisLineProps({
        startX: zeroPoint.x,
        startY: this.getGap,
        type: AxisLineType.vertical,
        end: zeroPoint.y
      })
    },
    getArgumentsAxisLineProps(): SVGAttributes {
      const zeroPoint = this.getChartZeroPoint
      return getAxisLineProps({
        startX: zeroPoint.x,
        startY: zeroPoint.y,
        type: AxisLineType.horizontal,
        end: this.getChartEndX
      })
    },
    getValues(): number[] {
      if (!this.valueField) return []
      return this.localDataSource.map((item: { [key: string]: any }) =>
        parseFloat(item[this.valueField])
      )
    },
    getArguments(): string[] {
      if (!this.argumentField) return []
      return this.localDataSource.map((item: { [key: string]: any }) => item[this.argumentField])
    }
  },
  watch: {
    dataSource: {
      handler(value) {
        this.localDataSource = [...value]
        this.updateSVGSize()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.uniqueId = generateUniqueId('chart')
    this.updateSVGSize()
    window.addEventListener('resize', this.handleResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize)
  },
  updated() {
    this.handleResize()
  },
  methods: {
    handleResize(): void {
      this.windowWidth = window.innerWidth
      this.updateSVGSize()
    },
    updateSVGSize(): void {
      const svg = this.$refs['svg']
      if (!svg) return
      // @ts-ignore
      this.svgWidth = svg.clientWidth
    },
    getSeriesCenterX(index: number): number {
      const seriesWidthWithGap = this.getSeriesWidth + this.getGap
      return this.getSeriesStartX + this.getSeriesWidth / 2 + index * seriesWidthWithGap
    },
    getArgumentTickProps(index: number): SVGAttributes {
      const firstTickX = this.getSeriesStartX + this.getSeriesWidth + this.getGap / 2
      const startX = firstTickX + index * (this.getSeriesWidth + this.getGap)
      const startY = this.getHeight - this.getGap * 2
      const endY = this.getHeight - this.getGap * 2 + 5
      return {
        d: `M${startX} ${startY} V${endY}`,
        stroke: 'black',
        fill: 'none'
      }
    },
    getValueTickProps(index: number): SVGAttributes {
      const lastTicksIndex = this.getValueTicks.length - 1
      const firstTickY = this.getHeight - this.getGap * 2
      const lastTickY = this.getGap
      const normalizedIndex = index / lastTicksIndex
      const tickX = this.getGap * 2
      const tickY = firstTickY + normalizedIndex * (lastTickY - firstTickY)
      const endX = tickX - 5
      return {
        d: `M${tickX} ${tickY} H${endX}`,
        stroke: 'black',
        fill: 'none'
      }
    },
    getArgumentAxisTitleProps(index: number): AxisTitleAttributes {
      const titleX = this.getSeriesCenterX(index)
      const titleY = this.getHeight - this.getGap
      const textWidth = calculateWidthOfText(
        this.getArguments[index],
        this.fontFamily,
        this.fontSize
      )
      let display = 'block'
      if (index > 0) {
        const { x: prevX, width: prevWidth } = this.getArgumentAxisTitleProps(index - 1)
        const prevEndX = prevWidth / 2 + Number(prevX)
        const currentStartX = titleX - textWidth / 2
        const offset = this.getGap / 4
        const overlaps = currentStartX - offset <= prevEndX
        if (overlaps) {
          display = 'none'
        }
      }
      return {
        x: titleX,
        y: titleY,
        'text-anchor': 'middle',
        fill: this.fontColor,
        'font-size': this.fontSize,
        'font-family': this.fontFamily,
        style: {
          display,
          'user-select': 'none'
        },
        width: textWidth
      }
    },
    getValueAxisTitleProps(index: number): SVGAttributes {
      const lastIndex = this.getValueTicks.length - 1
      const firstLabelY = this.getHeight - this.getGap * 2
      const lastLabelY = this.getGap
      const normalizedIndex = index / lastIndex
      const labelX = this.getGap
      const labelY = firstLabelY + normalizedIndex * (lastLabelY - firstLabelY) + this.getGap / 10
      return {
        x: labelX,
        y: labelY,
        'text-anchor': 'middle',
        fill: this.fontColor,
        'font-size': '14px',
        'font-family': this.fontFamily,
        style: {
          'user-select': 'none'
        }
      }
    },
    getHorizontalGridLineProps(index: number): SVGAttributes {
      const lastTicksIndex = this.getValueTicks.length - 1
      const firstTickY = this.getHeight - this.getGap * 2
      const lastTickY = this.getGap
      const normalizedIndex = index / lastTicksIndex
      const tickX = this.getGap * 2
      const tickY = firstTickY + normalizedIndex * (lastTickY - firstTickY)
      const endX = this.svgWidth - this.getGap
      return {
        d: `M${tickX} ${tickY} H${endX}`,
        fill: 'none',
        ...this.horizontalGridLineOptions
      }
    },
    getVerticalGridLineProps(index: number): SVGAttributes {
      const firstTickX = this.getSeriesStartX + this.getSeriesWidth + this.getGap / 2
      const startX = firstTickX + index * (this.getSeriesWidth + this.getGap)
      const startY = this.getHeight - this.getGap * 2
      const endY = this.getGap
      return {
        d: `M${startX} ${startY} V${endY}`,
        fill: 'none',
        ...this.verticalGridLineOptions
      }
    }
  }
})
</script>
