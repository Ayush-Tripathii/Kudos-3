// Source → published name + crops.
// x / y = focal point (0–1) used when cropping to the target ratio.
// Naming convention: kudos-<zone>-<subject>

export const VENUE = [
  // hero / LCP image: slightly lower AVIF quality (q42) buys ~20 KB on the critical path
  { src: 'venue/DSC08110.jpg',     name: 'kudos-terrace-palace-table',  avifQ: 42, crops: { '4x5': { x: 0.47 }, '3x2': {}, '1x1': { x: 0.45 } } },
  { src: 'venue/DSC8254.jpg',      name: 'kudos-terrace-sunset-palace', crops: { '4x5': { x: 0.4 },  '3x2': {}, '1x1': { x: 0.45 } } },
  { src: 'venue/DSC08527-HDR.jpg', name: 'kudos-lounge-stage',          crops: { '4x5': { x: 0.5 },  '3x2': {}, '1x1': { x: 0.5 } } },
  { src: 'venue/DSC08944.jpg',     name: 'kudos-terrace-dining-day',    crops: { '4x5': { x: 0.5 },  '3x2': {}, '1x1': { x: 0.5 } } },
  { src: 'venue/DSC09016.jpg',     name: 'kudos-terrace-dining-dusk',   crops: { '4x5': { x: 0.45 }, '3x2': {}, '1x1': { x: 0.45 } } },
  { src: 'venue/DSC09061.jpg',     name: 'kudos-terrace-hill-view',     crops: { '4x5': { x: 0.35 }, '3x2': {}, '1x1': { x: 0.4 } } },
  { src: 'venue/DSC09131.jpg',     name: 'kudos-lounge-bar-room',       crops: { '4x5': { x: 0.5 },  '3x2': {}, '1x1': { x: 0.5 } } },
  { src: 'venue/DSC09159.jpg',     name: 'kudos-bar-counter',           crops: { '4x5': { x: 0.48 }, '3x2': {}, '1x1': { x: 0.45 } } },
  { src: 'venue/DSC09270.jpg',     name: 'kudos-lounge-evening-neon',   crops: { '4x5': { x: 0.62 }, '3x2': {}, '1x1': { x: 0.6 } } },
  { src: 'venue/DSC09281.jpg',     name: 'kudos-terrace-night-lights',  crops: { '4x5': { x: 0.38 }, '3x2': {}, '1x1': { x: 0.4 } } },
  { src: 'venue/DSC09284.jpg',     name: 'kudos-interior-hall-night',   crops: { '4x5': { x: 0.5 },  '3x2': {}, '1x1': { x: 0.5 } } },
  { src: 'venue/DSC09293.jpg',     name: 'kudos-interior-dining-night', crops: { '4x5': { x: 0.45 }, '3x2': {}, '1x1': { x: 0.45 } } },
];

export const DISHES = [
  { src: 'dishes/wonton.jpg',              name: 'kudos-dish-wonton',              crops: { '4x5': { x: 0.62 }, '1x1': { x: 0.62 } } },
  { src: 'dishes/mexican-rice.jpg',        name: 'kudos-dish-mexican-rice',        crops: { '4x5': { x: 0.5 },  '1x1': { x: 0.5 } } },
  { src: 'dishes/beetroot-tikki.jpg',      name: 'kudos-dish-beetroot-tikki',      crops: { '4x5': { y: 0.6 },  '1x1': { y: 0.6 } } },
  { src: 'dishes/tandoori-chicken.jpg',    name: 'kudos-dish-tandoori-chicken',    crops: { '4x5': { y: 0.45 }, '1x1': { y: 0.48 } } },
  { src: 'dishes/chicken-sheekh-naan.jpg', name: 'kudos-dish-chicken-sheekh-naan', crops: { '4x5': { y: 0.45 }, '1x1': { y: 0.55 } } },
  { src: 'dishes/sham-savera.jpg',         name: 'kudos-dish-sham-savera',         crops: { '4x5': { y: 0.5 },  '1x1': { y: 0.5 } } },
  { src: 'dishes/pasta-barbesca.jpg',      name: 'kudos-dish-pasta-barbesca',      crops: { '4x5': { y: 0.55 }, '1x1': { y: 0.58 } } },
  { src: 'dishes/pasta-barbesca-alt.jpg',  name: 'kudos-dish-pasta-barbesca-fork', crops: { '4x5': { y: 0.45 }, '1x1': { y: 0.55 } } },
  { src: 'dishes/laal-maas.jpg',           name: 'kudos-dish-laal-maas',           crops: { '4x5': { y: 0.6 },  '1x1': { y: 0.6 } } },
  { src: 'dishes/laal-maas-alt.jpg',       name: 'kudos-dish-laal-maas-close',     crops: { '4x5': { y: 0.5 },  '1x1': { y: 0.5 } } },
  { src: 'dishes/veg-lasagna.jpg',         name: 'kudos-dish-veg-lasagna',         crops: { '4x5': { y: 0.55 }, '1x1': { y: 0.6 } } },
  { src: 'dishes/fried-egg-curry.jpg',     name: 'kudos-dish-fried-egg-curry',     crops: { '4x5': { y: 0.55 }, '1x1': { y: 0.58 } } },
];

export const RATIOS = { '4x5': 4 / 5, '3x2': 3 / 2, '1x1': 1 };
export const WIDTHS = {
  '3x2': [640, 1024, 1600, 2400],
  '4x5': [640, 768, 1024, 1600],
  '1x1': [320, 640],
};
// Byte budgets per output (spec §8)
export const BUDGET = { '3x2': 200_000, '4x5': 200_000, '1x1': 70_000 };
