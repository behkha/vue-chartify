export const convertLineChartPointToStackedLineChart = (
  xValues: number[],
  yValues: number[]
): string => {
  // line chart => stacked line chart
  const numPoints = xValues.length
  const interpolatedPoints = []

  for (let i = 0; i < numPoints - 1; i++) {
    const x0 = xValues[i]
    const y0 = yValues[i]
    const x1 = xValues[i + 1]
    const y1 = yValues[i + 1]

    if (i === 0) {
      interpolatedPoints.push(`${x0},${y0}`)
    }

    const controlPointX0 = (x0 + x1) / 2
    const controlPointY0 = y0
    const controlPointX1 = (x0 + x1) / 2
    const controlPointY1 = y1

    interpolatedPoints.push(
      `${controlPointX0},${controlPointY0} ${controlPointX1},${controlPointY1} ${x1},${y1}`
    )

    if (i === numPoints - 2) {
      interpolatedPoints.push(`${x1},${y1}`)
    }
  }

  return interpolatedPoints.join(' ')
}

export const calculateOffset = (yValues: number[], index: number): number => {
  const offsetMultiplier = 0.1 // Adjust the offset multiplier as needed
  const maxValue = Math.max(...yValues)
  const minValue = Math.min(...yValues)
  const valueRange = maxValue - minValue

  // Calculate the offset based on the value range and the offset multiplier
  const offset = valueRange * offsetMultiplier

  // Apply the offset in the positive or negative direction based on the y-value at the given index
  return yValues[index] >= maxValue / 2 ? -offset : offset
}

export const isHighPivot = (values: number[], index: number): boolean => {
  const length = values.length
  if (index === 0) return false
  if (index === length - 1) return true
  const prevValue = values[index - 1]
  const nextValue = values[index + 1]
  const currentValue = values[index]
  if (currentValue > prevValue && currentValue > nextValue) return true
  return false
}
