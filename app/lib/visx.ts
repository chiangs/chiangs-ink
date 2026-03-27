// visx.ts
// Single import point for @visx/* utilities.
// Add new visx exports here as needed — never import @visx/* directly
// in components or routes.

export { AxisBottom } from "@visx/axis";
export { Group } from "@visx/group";
export { hierarchy, Treemap, treemapSquarify } from "@visx/hierarchy";
export { Graph } from "@visx/network";
export { PatternCircles, PatternLines, PatternWaves } from "@visx/pattern";
export { useParentSize } from "@visx/responsive";
export { scaleBand, scaleLinear, scalePoint } from "@visx/scale";
export { AreaStack } from "@visx/shape";
// d3-shape is a direct dependency of @visx/shape
export {
  curveBasis,
  stack as d3Stack,
  stackOffsetWiggle,
  stackOrderInsideOut,
} from "d3-shape";
