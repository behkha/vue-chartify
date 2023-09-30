interface Step {
  size: number,
  count: number
}

export const generateUniqueId = (prefix: string): string => {
  const randomString = Math.random().toString(36).substring(2, 15)
  const uniqueId = prefix + '_' + randomString
  return uniqueId
}

const calculateDecimalPlaces = (stepSize: number): number => {
  const stepString = stepSize.toString();
  const decimalIndex = stepString.indexOf('.');
  if (decimalIndex !== -1) {
    return stepString.length - decimalIndex - 1;
  }
  return 0;
};

const roundToDecimalPlaces = (value: number, decimalPlaces: number): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
};

export const getTicks = (min: number, max: number, mostTicks: number): number[] => {
  const range = max - min
  const idealTicks = [5, 6, 7, 8, 9, 10]
  const stepItems: Step[] = [];

  idealTicks.forEach(item => {
    const epsilon = range / item
    const magnitude = Math.pow(10, Math.floor(Math.log10(epsilon) / Math.log10(item)))
    const residual = epsilon / magnitude
    let tick: number
    if (residual > 5) {
      tick = 10 * magnitude
    } else if (residual > 2) {
      tick = 5 * magnitude
    } else if (residual > 1) {
      tick = 2 * magnitude
    } else {
      tick = magnitude
    }
    const step = {
      size: roundToDecimalPlaces(tick, calculateDecimalPlaces(tick)),
      count: Math.ceil(max / tick) + 1
    }
    stepItems.push(step)
  })

  const filteredSteps = stepItems.filter(step => step.count <= mostTicks);
  const targetStep = filteredSteps.length > 0 ? filteredSteps[filteredSteps.length - 1] : stepItems[0];
  const decimalPlaces = calculateDecimalPlaces(targetStep.size);

  return Array.from({ length: targetStep.count }, (_, index) => {
    const value = index * targetStep.size;
    return Number(value.toFixed(decimalPlaces))
  })
}

export const shortenNumber = (number: number): string => {
  if (number === 0) return '0'
  if (number < 1) {
    const decimalPlaces = calculateDecimalPlaces(number);
    return roundToDecimalPlaces(number, decimalPlaces).toString()
  }
  const suffixes = ['', 'k', 'M', 'B', 'T', 'Q', 'Qu', 'S', 'Se', 'O', 'N', 'D']
  const magnitude = Math.floor(Math.log10(number) / 3)
  const shortenedValue = number / Math.pow(10, magnitude * 3)
  const roundedValue = Math.round(shortenedValue * 10) / 10
  return roundedValue.toString() + suffixes[magnitude]
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
