import type { SVGAttributes } from 'vue'

export interface PolylineAttributes extends SVGAttributes {
  xValues: number[];
  yValues: number[];
}

export interface AxisTitleAttributes extends SVGAttributes {
  width: number
}