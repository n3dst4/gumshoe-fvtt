// import { Irid } from "./irid";
// import hexToRGB from "./hex-to-rgb";
// import cssRGBToRGB from "./css-rgb-to-rgb";
// import cssHSLToHSL from "./css-hsl-to-hsl";

// export default function canInterpret(candidate: string | Irid) {
//   return (
//     candidate &&
//     (candidate instanceof Irid ||
//       (candidate.h !== undefined &&
//         candidate.s !== undefined &&
//         candidate.l !== undefined) ||
//       (typeof candidate === "string" &&
//         (hexToRGB(candidate) ||
//           cssRGBToRGB(candidate) ||
//           cssHSLToHSL(candidate) ||
//           hexToRGB(Irid.swatches[candidate.toLowerCase()]))) ||
//       (candidate.r !== undefined &&
//         candidate.g !== undefined &&
//         candidate.b !== undefined))
//   );
// }
