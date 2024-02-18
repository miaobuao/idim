import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

export const breakpoints = useBreakpoints(breakpointsTailwind);

export const screen = {
  gt: {
    sm: breakpoints.greater('sm'),
    md: breakpoints.greater('md'),
    lg: breakpoints.greater('lg'),
    xl: breakpoints.greater('xl'),
    '2xl': breakpoints.greater('2xl'),
  },
  lt: {
    sm: breakpoints.smaller('sm'),
    md: breakpoints.smaller('md'),
    lg: breakpoints.smaller('lg'),
    xl: breakpoints.smaller('xl'),
    '2xl': breakpoints.smaller('2xl'),
  },
  gte: {
    sm: breakpoints.greaterOrEqual('sm'),
    md: breakpoints.greaterOrEqual('md'),
    lg: breakpoints.greaterOrEqual('lg'),
    xl: breakpoints.greaterOrEqual('xl'),
    '2xl': breakpoints.greaterOrEqual('2xl'),
  },
  lte: {
    sm: breakpoints.smallerOrEqual('sm'),
    md: breakpoints.smallerOrEqual('md'),
    lg: breakpoints.smallerOrEqual('lg'),
    xl: breakpoints.smallerOrEqual('xl'),
    '2xl': breakpoints.smallerOrEqual('2xl'),
  },
};
