import type { SVGAttributes } from "vue"
import type { AxisLine } from "@/types/axis.types"


export const getAxisLineProps = (axisLine: AxisLine): SVGAttributes => {
  const { startX, startY, type, end } = axisLine
  return {
    d: `M${startX} ${startY} ${type}${end}`,
    stroke: 'black',
    fill: 'none'
  }
}

