/* ==========================================================================
   Page content. Copy marked [brief] is verbatim from the client brief.
   Copy marked [draft] was written from facts in the brief and needs
   client sign-off (see README → "Copy awaiting sign-off").
   ========================================================================== */

/** Brand-voice alt text for every published image. */
export const ALT: Record<string, string> = {
  'kudos-terrace-palace-table': 'A table for four at the Kudos terrace rail — plates out, a cocktail poured — with City Palace and Lake Pichola across the rooftops.',
  'kudos-terrace-sunset-palace': 'The covered rooftop terrace in the late light, long tables laid and facing City Palace and the lake.',
  'kudos-lounge-stage': 'The Kudos stage and DJ booth in black steel and warm screens, waiting for Saturday.',
  'kudos-terrace-dining-day': 'The rooftop dining room by day: striped chairs, black tables, a white canopy and the hills beyond the glass.',
  'kudos-terrace-dining-dusk': 'Tables laid along the open edge of the terrace at dusk, lamps on, the city spreading out below.',
  'kudos-terrace-hill-view': 'Set tables at the terrace rail, with the green hills and rooftops of Udaipur behind them.',
  'kudos-lounge-bar-room': 'The lounge floor with the bar glowing at the far end and a red table lamp in the foreground.',
  'kudos-bar-counter': 'The Kudos bar: a lit herringbone counter, bottles racked overhead, the city through the windows.',
  'kudos-lounge-evening-neon': 'The lounge in the evening — bar lit amber, neon signs on, every table set.',
  'kudos-terrace-night-lights': 'Night on the terrace: tables at the rail and the lights of Udaipur scattered across the hills.',
  'kudos-interior-hall-night': 'The glass-walled dining hall at night, a lamp on every table and the city lights outside.',
  'kudos-interior-dining-night': 'Rows of set tables in the indoor dining room, warm lamps glowing, glass doors open to the terrace.',
  'kudos-dish-wonton': 'Golden wontons in a white Kudos bowl, with a small pot of red dip on the side.',
  'kudos-dish-mexican-rice': 'Mexican rice baked under melted cheese and crowned with tortilla chips, on a wooden board.',
  'kudos-dish-beetroot-tikki': 'Deep-red beetroot tikki, each one topped with a dot of green, in a white Kudos bowl.',
  'kudos-dish-tandoori-chicken': 'A tandoori chicken leg lifted off the plate — charred edges, onions underneath.',
  'kudos-dish-chicken-sheekh-naan': 'Chicken sheekh rolled in naan, sliced and served with a smoking ember.',
  'kudos-dish-sham-savera': 'Sham savera from above: spinach koftas with soft white centres in a bright tomato gravy.',
  'kudos-dish-pasta-barbesca': 'Pasta Barbesca — penne in red sauce with black olives and toasted bread on the side.',
  'kudos-dish-pasta-barbesca-fork': 'A forkful of Pasta Barbesca lifted over the bowl, a basil leaf on top.',
  'kudos-dish-laal-maas': 'Laal maas in a white Kudos bowl, deep red and finished with fresh coriander.',
  'kudos-dish-laal-maas-close': 'Close in on laal maas: the bone, the gravy and the chilli-red colour Rajasthan is known for.',
  'kudos-dish-veg-lasagna': 'A slice of veg lasagna lifted from the tray, the cheese stretching all the way up.',
  'kudos-dish-fried-egg-curry': 'Two sunny fried eggs sitting in a red curry, in a white Kudos bowl.',
};

/** Short printed-index captions (contact sheet + lightbox). */
export const CAPTION: Record<string, string> = {
  'kudos-terrace-palace-table': 'Terrace — palace view',
  'kudos-terrace-sunset-palace': 'Terrace — late light',
  'kudos-lounge-stage': 'Lounge — the stage',
  'kudos-terrace-dining-day': 'Terrace — by day',
  'kudos-terrace-dining-dusk': 'Terrace — dusk',
  'kudos-terrace-hill-view': 'Terrace — the hills',
  'kudos-lounge-bar-room': 'Lounge — bar end',
  'kudos-bar-counter': 'Bar — the counter',
  'kudos-lounge-evening-neon': 'Lounge — evening',
  'kudos-terrace-night-lights': 'Terrace — night',
  'kudos-interior-hall-night': 'Hall — after dark',
  'kudos-interior-dining-night': 'Dining room — night',
  'kudos-dish-wonton': 'Plate — wonton',
  'kudos-dish-mexican-rice': 'Plate — Mexican rice',
  'kudos-dish-beetroot-tikki': 'Plate — beetroot tikki',
  'kudos-dish-tandoori-chicken': 'Plate — tandoori chicken',
  'kudos-dish-chicken-sheekh-naan': 'Plate — sheekh o naan',
  'kudos-dish-sham-savera': 'Plate — sham savera',
  'kudos-dish-pasta-barbesca': 'Plate — pasta barbesca',
  'kudos-dish-pasta-barbesca-fork': 'Plate — barbesca, forked',
  'kudos-dish-laal-maas': 'Plate — laal maas',
  'kudos-dish-laal-maas-close': 'Plate — laal maas, close',
  'kudos-dish-veg-lasagna': 'Plate — veg lasagna',
  'kudos-dish-fried-egg-curry': 'Plate — fried egg curry',
};

export const SECTIONS = [
  { id: 'top', num: '01', short: 'Top' },
  { id: 'note', num: '02', short: 'Note' },
  { id: 'philosophy', num: '03', short: 'Ethos' },
  { id: 'story', num: '04', short: 'Story' },
  { id: 'moods', num: '05', short: 'Moods' },
  { id: 'food', num: '06', short: 'Food' },
  { id: 'bar', num: '07', short: 'Bar' },
  { id: 'nights', num: '08', short: 'Nights' },
  { id: 'gallery', num: '09', short: 'Look' },
  { id: 'different', num: '10', short: 'Why' },
  { id: 'visit', num: '11', short: 'Book' },
];

export const HEADER_NAV = [
  { href: '#story', label: 'Story' },
  { href: '#food', label: 'Food' },
  { href: '#bar', label: 'Bar' },
  { href: '#nights', label: 'Nights' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#visit', label: 'Visit' },
];

// [brief]
export const PILLARS = [
  { num: '01', title: 'The Right Taste', line: 'Flavour is non-negotiable.', img: 'kudos-dish-laal-maas-close' },
  { num: '02', title: 'The Right Presentation', line: 'Food should look as good as it tastes.', img: 'kudos-dish-beetroot-tikki' },
  { num: '03', title: 'The Right Ingredients', line: 'Quality starts long before the kitchen.', img: 'kudos-dish-pasta-barbesca-fork' },
  { num: '04', title: 'The Right Hygiene', line: 'Not a feature. A responsibility.', img: 'kudos-dish-sham-savera' },
  { num: '05', title: 'The Right Hospitality', line: 'A guest should never feel like a transaction.', img: 'kudos-dish-fried-egg-curry' },
];

// [draft] — chapter bodies built only from facts in the brief
export const CHAPTERS = [
  {
    num: '01', title: 'The Takeover', img: 'kudos-terrace-dining-dusk', crop: '4x5', arch: true,
    body: 'The restaurant was struggling when it changed hands. The easy move was to shut it, change the name and relaunch with a fanfare. We kept the name, kept the doors open, and got to work.',
  },
  {
    num: '02', title: 'The People', img: 'kudos-terrace-hill-view', crop: '4x5', arch: true,
    body: 'People first. Chefs, captains, service professionals — the team that turns up every night is the restaurant. So that is where the rebuild began.',
  },
  {
    num: '03', title: 'The Kitchen', img: 'kudos-dish-tandoori-chicken', crop: '4x5', arch: false,
    body: 'Then the kitchen. Ingredients, prep, consistency, hygiene — all of it written down as standard procedure, so the dish you loved last month tastes the same tonight.',
  },
  {
    num: '04', title: 'The Rhythm', img: 'kudos-terrace-dining-day', crop: '4x5', arch: true,
    body: 'Then the rhythm: how a service flows, how a table is read, how an afternoon turns into an evening. There was no overnight transformation. No dramatic announcement. No shortcut to getting things right.',
  },
  {
    num: '05', title: 'The Next Chapter', img: 'kudos-interior-hall-night', crop: '4x5', arch: true,
    body: 'We chose evolution over disruption. Next up is the atmosphere itself — the music, the light, the energy of the room. Kudos is not just a restaurant that changed. It is a restaurant that continues to evolve.',
  },
];

// [brief] copy; time ranges are descriptive, not opening hours
export const MOODS = [
  {
    title: 'Golden Hour', time: 'Late afternoon → Sunset', img: 'kudos-terrace-sunset-palace',
    lines: ['The calm before the energy. The sun begins to settle over Udaipur.', 'The city changes colour. Lake Pichola reflects the evening sky.'],
  },
  {
    title: 'The Evening', time: 'Sunset → Dinner', img: 'kudos-lounge-evening-neon',
    lines: ['When the city comes alive. The music finds its rhythm.', 'The bar becomes more active. The energy begins to build.'],
  },
  {
    title: 'The Night', time: 'Dinner → Last call', img: 'kudos-terrace-night-lights',
    lines: ['Good music. Great company.', 'The night belongs to the people.'],
  },
];

// Dish names [brief]; grouping + cuisine tags [draft]. No prices — none supplied.
export const MENU = [
  {
    category: 'Small plates',
    dishes: [
      { name: 'Wonton', tag: 'Pan-Asian', img: 'kudos-dish-wonton' },
      { name: 'Beetroot Tikki', tag: 'Indian', img: 'kudos-dish-beetroot-tikki' },
      { name: 'Chicken Sheekh o Naan', tag: 'North Indian', img: 'kudos-dish-chicken-sheekh-naan' },
    ],
  },
  {
    category: 'Tandoor & Rajasthan',
    dishes: [
      { name: 'Tandoori Chicken', tag: 'Tandoor', img: 'kudos-dish-tandoori-chicken' },
      { name: 'Laal Maas', tag: 'Rajasthani', img: 'kudos-dish-laal-maas' },
      { name: 'Sham Savera', tag: 'North Indian', img: 'kudos-dish-sham-savera' },
      { name: 'Fried Egg Curry', tag: 'Indian', img: 'kudos-dish-fried-egg-curry' },
    ],
  },
  {
    category: 'Bakes, pasta & rice',
    dishes: [
      { name: 'Pasta Barbesca', tag: 'Italian', img: 'kudos-dish-pasta-barbesca' },
      { name: 'Veg Lasagna', tag: 'Italian', img: 'kudos-dish-veg-lasagna' },
      { name: 'Mexican Rice', tag: 'Mexican', img: 'kudos-dish-mexican-rice' },
    ],
  },
];

// [draft]
export const NIGHTS = [
  { title: 'Saturday Socials', body: 'The week ends on the rooftop. Good music, a busy bar and a room that gets a little louder as the night goes on.' },
  { title: 'Purani Playlist', body: 'The songs everyone knows the words to. Old favourites, played the way they deserve to be played.' },
  { title: 'Private bookings', body: 'The terrace, the lounge, or a corner of either. Tell us the size of the group and the shape of the evening.' },
  { title: 'Celebrations', body: 'Birthdays, anniversaries, the promotion you have been waiting to toast. Tell us the occasion — we will handle the rest.' },
];

// [draft] — eight points, each traceable to the brief
export const DIFFERENT = [
  { title: 'The view does half the work', body: 'Lake Pichola and City Palace, from a rooftop in the middle of Udaipur.' },
  { title: 'One table, many cuisines', body: 'Rajasthani, North Indian, Italian, Mexican, Pan-Asian. Nobody has to agree on one kind of food.' },
  { title: 'Food that does the talking', body: 'No complicated terminology. You will remember what you ordered — and come back for it.' },
  { title: 'Five non-negotiables', body: 'Taste, presentation, ingredients, hygiene, hospitality. Every plate, every night.' },
  { title: 'Written down, not winged', body: 'Kitchen standards on paper, so the second visit tastes like the first.' },
  { title: 'People, not transactions', body: 'A team rebuilt around genuine hospitality. Not too formal, not too casual.' },
  { title: 'An evening in three moods', body: 'Golden hour, the evening, the night. The room changes with the light — stay for all three.' },
  { title: 'Music with a point of view', body: 'Saturday Socials and the Purani Playlist, set to the mood of the room.' },
];

export const TICKER = [
  'Laal Maas', 'Simple food', 'Wonton', 'Good food', 'Tandoori Chicken', 'No nonsense',
  'Pasta Barbesca', 'Come for the view', 'Sham Savera', 'Stay for the vibe', 'Veg Lasagna',
  'Lake Pichola', 'Beetroot Tikki', 'City Palace', 'Mexican Rice', 'Great evenings',
];

export const GALLERY = [
  'kudos-terrace-palace-table', 'kudos-dish-laal-maas-close', 'kudos-bar-counter',
  'kudos-terrace-sunset-palace', 'kudos-dish-wonton', 'kudos-lounge-evening-neon',
  'kudos-dish-veg-lasagna', 'kudos-terrace-night-lights', 'kudos-dish-beetroot-tikki',
  'kudos-terrace-dining-dusk', 'kudos-lounge-stage', 'kudos-dish-tandoori-chicken',
  'kudos-terrace-hill-view', 'kudos-dish-mexican-rice', 'kudos-interior-hall-night',
  'kudos-dish-sham-savera', 'kudos-lounge-bar-room', 'kudos-dish-pasta-barbesca-fork',
  'kudos-terrace-dining-day', 'kudos-dish-chicken-sheekh-naan', 'kudos-interior-dining-night',
  'kudos-dish-fried-egg-curry', 'kudos-dish-pasta-barbesca', 'kudos-dish-laal-maas',
];
