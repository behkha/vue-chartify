export const generateUniqueId = (prefix: string): string => {
  const randomString = Math.random().toString(36).substring(2, 15)
  const uniqueId = prefix + '_' + randomString
  return uniqueId
}

export const findNearestMultiple = (number: number): number => {
  const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(number)))
  const nearestMultiple = [0.5, 1, 2, 5, 10].reduce(
    (result, multiple) =>
      Math.abs(multiple * orderOfMagnitude - number) < Math.abs(result * orderOfMagnitude - number)
        ? multiple
        : result,
    1
  )
  return nearestMultiple * orderOfMagnitude
}

export const shortenNumber = (number: number): string => {
  if (number === 0) {
    return '0'
  }

  const suffixes = ['', 'k', 'M', 'B', 'T']
  const magnitude = Math.floor(Math.log10(number) / 3)
  const shortenedValue = number / Math.pow(10, magnitude * 3)
  const roundedValue = Math.round(shortenedValue * 10) / 10
  
  if (roundedValue % 1 === 0) {
    return roundedValue.toString() + suffixes[magnitude]
  } else {
    return roundedValue.toFixed(1) + suffixes[magnitude]
  }
}

export const calculateTickInterval = (dataRange: number): number => {
  const power = Math.floor(Math.log10(dataRange))
  const magnitude = Math.pow(10, power)
  const fraction = dataRange / magnitude

  let tickInterval: number

  if (fraction <= 1.5) {
    tickInterval = 0.1 * magnitude
  } else if (fraction <= 3) {
    tickInterval = 0.2 * magnitude
  } else if (fraction <= 7.5) {
    tickInterval = 0.5 * magnitude
  } else {
    tickInterval = magnitude
  }

  return tickInterval
}

export const calculateWidthOfText = (
  text: string,
  fontFamily: string,
  fontSize: string
): number => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (context) {
    context.font = `${fontSize} ${fontFamily}`
    return context.measureText(text).width
  }
  return 0
}
