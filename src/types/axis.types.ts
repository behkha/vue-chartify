export enum AxisLineType {
  vertical = 'V',
  horizontal = 'H'
}

export interface AxisLine {
  startX: number,
  startY: number,
  type: AxisLineType,
  end: number
}