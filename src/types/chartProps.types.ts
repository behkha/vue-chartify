export interface Breakpoint {
  width: string
  gap: string
}

export interface Breakpoints {
  xs: Breakpoint
  sm: Breakpoint
  md: Breakpoint
  lg: Breakpoint
  xl: Breakpoint,
  [key: string]: Breakpoint
}

export interface GridLineOptions {
  stroke: string
  'stroke-width': string
}