/* ══════════════════════════════════════════════════════
   LUCKY — Year of the Rat × your star sign
   Everything on this page is derived from the DATE, not
   from random(). Same day = same reading, on any device,
   for anyone. Refreshing won't reroll it, which is the
   whole point of a daily fortune.
   ══════════════════════════════════════════════════════ */

/* ── NAV (shared behaviour, same as HELPFUL) ────────── */
const menuBtn   = document.getElementById('menuBtn');
const menuClose = document.getElementById('menuClose');
const overlay   = document.getElementById('overlay');
const sideMenu  = document.getElementById('sideMenu');

const openMenu  = () => { sideMenu.classList.add('open');    overlay.classList.add('open');    };
const closeMenu = () => { sideMenu.classList.remove('open'); overlay.classList.remove('open'); };

menuBtn?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
overlay?.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });


/* ── SEEDED RANDOM ──────────────────────────────────────
   A date string is turned into a 32-bit seed, then run
   through mulberry32. Each field gets its own salt so
   the colour and the number don't move in lockstep.     */
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* mulberry32's first output still carries a trace of the seed, so
   neighbouring days (seeds one hash apart) were landing on the same
   answer several times in a row. Throwing away three values breaks
   that correlation without touching determinism.                   */
function seeded(dateKey, salt) {
  const rnd = mulberry32(hashStr(dateKey + '::' + salt));
  rnd(); rnd(); rnd();
  return rnd;
}

/** Deterministic pick from `list` for a given date + field. */
function pick(list, dateKey, salt) {
  return list[Math.floor(seeded(dateKey, salt)() * list.length)];
}

/** Deterministic integer in [min, max]. */
function pickInt(min, max, dateKey, salt) {
  return min + Math.floor(seeded(dateKey, salt)() * (max - min + 1));
}


/* ══ THE DATA ═════════════════════════════════════════ */

/* Items lean on what the two signs actually share: water,
   small clever objects, and things you can hold.         */
const ITEMS = [
  { icon: '🔑', name: 'A small silver key',        note: 'Rat luck runs on access. Something opens today that was shut yesterday.' },
  { icon: '🫧', name: 'A blue glass bead',          note: 'Water is the Rat’s own element. Carry a little where you can see it.' },
  { icon: '🕊️', name: 'A folded paper crane',       note: '{sign} makes the wish. Rat does the folding.' },
  { icon: '🖊️', name: 'A green pen',                note: 'Green is a Rat colour. Sign something today, don’t just plan it.' },
  { icon: '🧦', name: 'Mismatched socks',           note: 'The day rewards being slightly off-pattern. Nobody will notice but you.' },
  { icon: '🐚', name: 'A seashell',                 note: 'Hold something the tide already finished shaping.' },
  { icon: '🪙', name: 'Three coins in one pocket',  note: 'Three is a Rat number. Let them clink when you walk.' },
  { icon: '🍃', name: 'A sprig of eucalyptus',      note: 'Clears the head before the afternoon gets loud.' },
  { icon: '🪞', name: 'A pocket mirror',            note: '{sign} sees other people clearly today. Aim it back at yourself once.' },
  { icon: '💧', name: 'A full glass of water on your desk', note: 'The simplest water charm there is. Refill it at 3pm.' },
  { icon: '🎧', name: 'Your headphones',            note: 'Rat listens before it moves. Give yourself the soundtrack.' },
  { icon: '🍊', name: 'Something that smells of citrus', note: 'Cuts straight through a foggy {sign} morning.' },
  { icon: '🧵', name: 'A red string, knotted once', note: 'One knot, one intention. Resist tying a second.' },
  { icon: '📓', name: 'A pocket notebook',          note: 'Write the idea down before you talk yourself out of it.' },
  { icon: '🕯️', name: 'An unlit candle',            note: 'The point is having it ready, not burning it.' },
  { icon: '🪨', name: 'A smooth grey stone',        note: 'Something heavy, for a day that wants to float off.' },
  { icon: '🎫', name: 'An old ticket stub',         note: 'Proof you already did a brave thing once, on a normal Tuesday.' },
  { icon: '🧿', name: 'A blue charm on your bag',   note: 'Water blue, worn facing outward.' },
  { icon: '🥢', name: 'Wooden chopsticks',          note: 'Rat eats first and thinks second. Today, do it deliberately.' },
  { icon: '🔔', name: 'A tiny bell',                note: 'Small sounds move stuck things.' },
  { icon: '☂️', name: 'A blue umbrella',            note: 'Carry it even if the sky disagrees with you.' },
  { icon: '🌱', name: 'The plant you keep forgetting', note: 'Water it. That’s the entire charm.' },
  { icon: '💍', name: 'A ring on your left hand',   note: 'Rat luck sits on the receiving side.' },
  { icon: '📮', name: 'A postcard you never sent',  note: 'Send it, or finally bin it. Either one ends the loop.' },
  { icon: '🧣', name: 'A soft scarf',               note: '{ruler} weather. Dress for a mood you haven’t had yet.' },
  { icon: '🍵', name: 'A sachet of loose-leaf tea', note: 'Ten minutes of doing one thing slowly, on purpose.' },
  { icon: '🖼️', name: 'A photo of the sea',         note: 'The Rat’s element, sitting on your lock screen.' },
  { icon: '🧊', name: 'One ice cube in everything', note: 'Water, but on your terms.' },
  { icon: '🪶', name: 'A feather, real or drawn',   note: 'Let yourself float. For exactly one hour.' },
  { icon: '📎', name: 'A paperclip, straightened',  note: 'Rat fixes things with whatever is already in the drawer.' }
];

const COLOURS = [
  { name: 'Deep Water Blue', hex: '#2E5E8C' },
  { name: 'Sea Green',       hex: '#4FA88B' },
  { name: 'Pearl',           hex: '#F1EBDD' },
  { name: 'Lavender',        hex: '#B9A7D6' },
  { name: 'Old Gold',        hex: '#C9A227' },
  { name: 'Aqua',            hex: '#7FC8D8' },
  { name: 'Ink',             hex: '#2B2B2B' },
  { name: 'Plum',            hex: '#7A4A6B' },
  { name: 'Moss',            hex: '#6E8B4E' },
  { name: 'Coral',           hex: '#E08A7A' },
  { name: 'Slate',           hex: '#6B7A8F' },
  { name: 'Warm Sand',       hex: '#DCC9A8' }
];

/* Rat's classic numbers are 2 and 3; Pisces adds 7 and 12.
   The two-digit options are those numbers stuck together. */
const NUMBERS = [2, 3, 7, 12, 23, 27, 32, 37];

const DIRECTIONS = ['Southeast', 'Northeast', 'North', 'Northwest', 'West'];

/* The Chinese double-hours. 11pm–1am is the Rat's own hour. */
const HOURS = [
  { label: '11pm – 1am', note: 'The Rat’s own hour. Ideas land, sleep does not.' },
  { label: '5 – 7am',    note: 'Nobody wants anything from you yet. Use it.' },
  { label: '7 – 9am',    note: 'Decide now and the afternoon can’t argue.' },
  { label: '9 – 11am',   note: 'Your sharpest window. Spend it on the hard thing.' },
  { label: '1 – 3pm',    note: 'Good for people, bad for numbers.' },
  { label: '3 – 5pm',    note: 'Say yes to the small thing, not the big one.' },
  { label: '5 – 7pm',    note: 'The day loosens. Ask for what you want here.' },
  { label: '9 – 11pm',   note: 'Dreaming hour. Write it down, don’t send it.' }
];

/* Fixed cast — these six only, as specified. Names are used as
   plain text; no artwork, since they're all someone else's
   characters.                                                 */
const CHARACTERS = [
  { name: 'Hello Kitty',  note: 'No mouth, all listening. Let someone else fill the silence today.' },
  { name: 'Punch Bear',   note: 'Small, soft, and hits back. Say the firm thing kindly.' },
  { name: 'Bugcat Capoo', note: 'Chaos with good intentions. Your worst idea today is the fun one.' },
  { name: 'Miffy',        note: 'Two dots and a cross. Simplify the thing you have overcomplicated.' },
  { name: 'Mofusand',     note: 'A cat wearing another animal. You are allowed to be two things at once.' },
  { name: 'Pingu',        note: 'Noot noot. Complain loudly, briefly, then get on with it.' }
];

const READINGS = [
  'Move early, drift later. The good decision is available before 11am.',
  'Someone will read your quiet as agreement. Say the sentence out loud.',
  'Rat says take the shortcut. You say check who it cuts past. Both are right.',
  'You’ll want to fix a feeling with a purchase. Fix it with a walk instead.',
  'A small yes today is a large obligation by Friday. Choose it on purpose.',
  'The thing you’ve been avoiding takes eleven minutes. It always took eleven minutes.',
  'Feelings flood. Set one boundary before lunch and the afternoon stays dry.',
  'Trust the hunch you had in the shower over the plan you made after it.',
  'Someone older than you has the answer and is waiting to be asked.',
  'You’re closer to finished than the mess suggests. Count what’s done, not what’s left.',
  'Let one thing be imperfect and on time rather than perfect and next week.',
  'An old message resurfaces. Reply to the person, not to the version you remember.',
  'You’re the most prepared person in the room and the least convinced of it.',
  'Say the number first. Whoever says it first sets the range.',
  'Today’s energy is borrowed. Sleep is the repayment, not the reward.',
  'What you lost turns up in the last place you’d look, which is where you left it.',
  'Two people want different things from you. Neither will mind if you pick.',
  'Do the boring half first. The interesting half is a reward you’ll actually collect.'
];

const ACTIONS = [
  'Send the message you’ve drafted three times.',
  'Drink a glass of water before your first screen.',
  'Put one thing back where it belongs.',
  'Ask the question you think is too obvious to ask.',
  'Leave ten minutes early, once.',
  'Write tomorrow’s first task before you sleep.',
  'Thank someone who won’t be expecting it.',
  'Finish the thing that’s already 90% done.',
  'Take the long way home.',
  'Close the twelve tabs. All of them.'
];

const AVOID = [
  'Long arguments conducted entirely over text.',
  'Lending money you’d be quietly annoyed to lose.',
  'Big purchases before noon.',
  'Saying yes to a fifth thing.',
  'Rereading old messages for new information.',
  'Deciding anything important at 4pm.',
  'Measuring your progress against someone’s highlight reel.',
  'Starting a project you can’t yet name.',
  'Skipping lunch to save twenty minutes.',
  'Opening the group chat before you’re properly awake.'
];

const RAT_BRINGS = [
  'a fast read of the room',
  'resourcefulness with very little',
  'knowing exactly when to leave',
  'turning a scrap into a plan',
  'charm that opens a closed door',
  'an instinct for timing'
];

/* ══ THE TWELVE ══════════════════════════════════════
   The Rat is fixed — it's the Chinese zodiac year. What
   the burger menu switches is the Western sign paired
   with it. Each carries its own element, ruler and the
   qualities it lends the day.                          */
const SIGNS = [
  { key: 'aries', name: 'Aries', glyph: '♈︎', dates: '21 Mar – 19 Apr',
    element: 'Fire', ruler: 'Mars', numbers: [1, 9],
    brings: [
      'going first without being asked',
      'impatience that turns into momentum',
      'saying the blunt thing kindly',
      'starting before you feel ready',
      'a temper that burns out fast',
      'the nerve to ask twice'
    ] },
  { key: 'taurus', name: 'Taurus', glyph: '♉︎', dates: '20 Apr – 20 May',
    element: 'Earth', ruler: 'Venus', numbers: [2, 6],
    brings: [
      'refusing to be hurried',
      'knowing what good actually feels like',
      'stubbornness pointed the right way',
      'finishing what you started last month',
      'comfort that isn’t laziness',
      'a long memory for kindness'
    ] },
  { key: 'gemini', name: 'Gemini', glyph: '♊︎', dates: '21 May – 20 Jun',
    element: 'Air', ruler: 'Mercury', numbers: [5, 7],
    brings: [
      'two good ideas at once',
      'talking your way in',
      'curiosity that outruns the plan',
      'making the boring part funny',
      'changing your mind in public',
      'asking the question nobody asked'
    ] },
  { key: 'cancer', name: 'Cancer', glyph: '♋︎', dates: '21 Jun – 22 Jul',
    element: 'Water', ruler: 'the Moon', numbers: [2, 7],
    brings: [
      'remembering what people need',
      'a hard shell over a soft plan',
      'feeding someone who’s struggling',
      'knowing when to go home',
      'loyalty that outlasts the reason',
      'feeling the mood shift first'
    ] },
  { key: 'leo', name: 'Leo', glyph: '♌︎', dates: '23 Jul – 22 Aug',
    element: 'Fire', ruler: 'the Sun', numbers: [1, 4],
    brings: [
      'warmth that fills a room',
      'taking the credit and sharing it',
      'generosity as a first instinct',
      'performing until you believe it',
      'defending someone loudly',
      'pride that’s earned'
    ] },
  { key: 'virgo', name: 'Virgo', glyph: '♍︎', dates: '23 Aug – 22 Sep',
    element: 'Earth', ruler: 'Mercury', numbers: [5, 6],
    brings: [
      'noticing the one thing that’s off',
      'fixing it before anyone asks',
      'standards you actually meet',
      'a list that survives contact with reality',
      'quiet competence',
      'caring by being useful'
    ] },
  { key: 'libra', name: 'Libra', glyph: '♎︎', dates: '23 Sep – 22 Oct',
    element: 'Air', ruler: 'Venus', numbers: [6, 9],
    brings: [
      'seeing both sides properly',
      'making the room easier',
      'deciding once you’ve weighed it',
      'charm that isn’t a trick',
      'fairness even when it costs you',
      'good taste applied to small things'
    ] },
  { key: 'scorpio', name: 'Scorpio', glyph: '♏︎', dates: '23 Oct – 21 Nov',
    element: 'Water', ruler: 'Pluto', numbers: [8, 11],
    brings: [
      'reading what’s underneath',
      'total focus on one thing',
      'keeping a confidence',
      'loyalty with a long memory',
      'knowing exactly where the line is',
      'intensity you can aim'
    ] },
  { key: 'sagittarius', name: 'Sagittarius', glyph: '♐︎', dates: '22 Nov – 21 Dec',
    element: 'Fire', ruler: 'Jupiter', numbers: [3, 9],
    brings: [
      'the honest answer, cheerfully',
      'optimism that isn’t naive',
      'a plan involving somewhere else',
      'laughing at your own expense',
      'betting on the good outcome',
      'restlessness that finds things'
    ] },
  { key: 'capricorn', name: 'Capricorn', glyph: '♑︎', dates: '22 Dec – 19 Jan',
    element: 'Earth', ruler: 'Saturn', numbers: [4, 8],
    brings: [
      'playing the long game',
      'doing it properly the first time',
      'dry humour under pressure',
      'patience that looks like nothing happening',
      'quiet ambition',
      'keeping your word'
    ] },
  { key: 'aquarius', name: 'Aquarius', glyph: '♒︎', dates: '20 Jan – 18 Feb',
    element: 'Air', ruler: 'Uranus', numbers: [4, 7],
    brings: [
      'the angle nobody considered',
      'caring about the principle',
      'detachment that clears the fog',
      'a plan for everyone, not just you',
      'refusing the obvious',
      'strangeness that turns out right'
    ] },
  { key: 'pisces', name: 'Pisces', glyph: '♓︎', dates: '19 Feb – 20 Mar',
    element: 'Water', ruler: 'Neptune', numbers: [3, 7],
    brings: [
      'hearing what wasn’t said',
      'imagination arriving sideways',
      'forgiveness, possibly too fast',
      'a soft landing for someone else',
      'a dream holding real information',
      'empathy that costs you something'
    ] }
];


/* Rat is a Water sign. What that makes when it meets the
   other element is the whole point of the signs section. */
/* Items and colours that only appear for one element, bolted onto
   the shared lists. A Leo can draw anything a Pisces can, plus four
   of its own — which is what stops the twelve pages reading the
   same on a given day.                                            */
const ELEMENT_ITEMS = {
  Fire: [
    { icon: '🔥', name: 'A lighter you don’t need',      note: 'Fire starts things. Carry the starting thing, even unused.' },
    { icon: '🌶️', name: 'Something too spicy',           note: 'Match the food to your temperature today.' },
    { icon: '🥊', name: 'Your gym shoes, by the door',   note: 'The Rat waits. Your other half doesn’t. Let it go first.' },
    { icon: '🏆', name: 'A medal or badge from years ago', note: 'Proof you have already won something once.' }
  ],
  Earth: [
    { icon: '🪵', name: 'A wooden button or bead',       note: 'Earth wants something with a grain to it.' },
    { icon: '🍞', name: 'Bread, bought warm',            note: 'Slow things are the ones that pay you back today.' },
    { icon: '🪴', name: 'A pot with soil in it',         note: 'Check the roots before you worry about the leaves.' },
    { icon: '🧱', name: 'Anything brick-coloured',       note: 'Build one row today. Not the whole wall.' }
  ],
  Air: [
    { icon: '🪁', name: 'Something that catches wind',   note: 'Air needs proof the world is still moving.' },
    { icon: '📻', name: 'A podcast you haven’t started', note: 'One new idea in your ears before noon.' },
    { icon: '✉️', name: 'A letter you actually post',    note: 'Air moves messages. Move one of yours.' },
    { icon: '🌬️', name: 'A paper fan',                   note: 'Make your own weather when the room won’t.' }
  ],
  Water: [
    { icon: '🌊', name: 'A photo of the tide going out', note: 'Water doubled. Let something leave without chasing it.' },
    { icon: '🫖', name: 'A teapot, not a mug',           note: 'Enough for someone else to have some.' },
    { icon: '🚿', name: 'A very long shower',            note: 'Your element, applied directly.' },
    { icon: '🌙', name: 'Something that glows in the dark', note: 'Water does its best work at night.' }
  ]
};

const ELEMENT_COLOURS = {
  Fire:  [{ name: 'Ember Red', hex: '#C7462F' }, { name: 'Marigold', hex: '#E2A33B' }, { name: 'Rust', hex: '#A6552F' }],
  Earth: [{ name: 'Clay', hex: '#A9714B' }, { name: 'Olive', hex: '#7C8A4E' }, { name: 'Bark', hex: '#6B5340' }],
  Air:   [{ name: 'Sky', hex: '#9FC4E0' }, { name: 'Silver', hex: '#A8AFB8' }, { name: 'Pale Violet', hex: '#C3B6E0' }],
  Water: [{ name: 'Deep Teal', hex: '#2F6B6B' }, { name: 'Storm Blue', hex: '#4A6C8C' }, { name: 'Foam', hex: '#DCEAE6' }]
};

/* The Rat's own numbers are 2 and 3. Each sign adds its traditional
   two, plus the plausible two-digit runs you get from sticking them
   together — so no two signs share a number pool.                  */
function numbersFor(sign) {
  const [a, b] = sign.numbers;
  const pool = [2, 3, a, b];
  if (a < 10 && b < 10) pool.push(Number(`${a}${b}`), Number(`2${a}`), Number(`3${b}`));
  else pool.push(20 + a, 30 + (b % 10));
  return [...new Set(pool)].filter(n => n > 0);
}

const ELEMENT_GLYPH = { Water: '水', Fire: '火', Earth: '土', Air: '風' };

const BLEND = {
  Water: {
    heading: 'Two water signs, one day',
    text: 'The Rat is water in the Chinese zodiac and so are you in the Western one. ' +
          'You got the same element twice — which is why your instincts arrive fast ' +
          'and your decisions arrive slowly.',
    note: 'Doubled. Takes the shape of whatever it is put in, and wears down anything that will not move.'
  },
  Fire: {
    heading: 'Water meets fire',
    text: 'The Rat is water in the Chinese zodiac; your Western sign is fire. ' +
          'One waits and one goes. Most of your good days are the ones where you ' +
          'let the waiting half finish its sentence first.',
    note: 'Steam. Enormous force, briefly, and then you need to sit down.'
  },
  Earth: {
    heading: 'Water meets earth',
    text: 'The Rat is water in the Chinese zodiac; your Western sign is earth. ' +
          'You are the combination that actually finishes things — as long as ' +
          'nobody asks you to hurry.',
    note: 'Growth, or mud. The difference is entirely how much you pour on at once.'
  },
  Air: {
    heading: 'Water meets air',
    text: 'The Rat is water in the Chinese zodiac; your Western sign is air. ' +
          'You think in weather: the mood shifts, the idea arrives, and the plan ' +
          'you made yesterday looks like someone else wrote it.',
    note: 'Waves. Nothing stays flat for long, and that is usually the useful part.'
  }
};

const LUCK_LABELS = [
  [0,  59, 'steady'],
  [60, 71, 'quietly good'],
  [72, 83, 'a good day'],
  [84, 92, 'a strong day'],
  [93, 100, 'rare weather']
];


/* ══ BUILD A DAY ══════════════════════════════════════ */

function dateKey(d) {
  // Local YYYY-MM-DD — not toISOString(), which shifts to UTC and
  // would hand New Zealand yesterday's fortune for half the day.
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function buildDay(date, sign) {
  const key = dateKey(date);

  /* The seed is the date AND the sign. Without the sign in here all
     twelve pages drew the same item on the same day, which rather
     defeated the point of having twelve pages.                     */
  const seed = key + '|' + sign.key;

  const items   = ITEMS.concat(ELEMENT_ITEMS[sign.element]);
  const colours = COLOURS.concat(ELEMENT_COLOURS[sign.element]);
  const numbers = numbersFor(sign);

  const luck = pickInt(56, 97, seed, 'luck');
  const band = LUCK_LABELS.find(b => luck >= b[0] && luck <= b[1]);

  return {
    key,
    date,
    item:      pick(items,         seed, 'item'),
    character: pick(CHARACTERS,    seed, 'character'),
    colour:    pick(colours,       seed, 'colour'),
    number:    pick(numbers,       seed, 'number'),
    direction: pick(DIRECTIONS,    seed, 'direction'),
    hour:      pick(HOURS,         seed, 'hour'),
    reading:   pick(READINGS,      seed, 'reading'),
    action:    pick(ACTIONS,       seed, 'action'),
    avoid:     pick(AVOID,         seed, 'avoid'),
    rat:       pick(RAT_BRINGS,    seed, 'rat'),
    sign,
    signBrings: pick(sign.brings,  seed, 'sign'),
    luck,
    luckLabel: band[2]
  };
}


/* ══ RENDER ═══════════════════════════════════════════ */

const $ = id => document.getElementById(id);
let current = null;

const LONG_DATE = new Intl.DateTimeFormat('en-NZ', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

/* Item notes carry {sign} / {ruler} placeholders so one list of
   thirty works for all twelve pairings instead of naming Pisces. */
function fill(text, sign) {
  return text.replace(/\{sign\}/g, sign.name).replace(/\{ruler\}/g, sign.ruler);
}

function render(day) {
  current = day;
  const sign  = day.sign;
  const blend = BLEND[sign.element];

  document.title = `LUCKY — Rat \u00d7 ${sign.name}`;

  // hero
  $('signLine').textContent = `born under ${sign.name}`;
  $('signGlyph').textContent = sign.glyph;
  $('signName').textContent  = sign.name;
  $('signDates').textContent = sign.dates;

  // the two-signs section
  $('blendHeading').textContent  = blend.heading;
  $('blendText').textContent     = blend.text;
  $('blendNote').textContent     = blend.note;
  $('signBringsHead').textContent = `${sign.name} brings`;
  $('signElemGlyph').textContent  = ELEMENT_GLYPH[sign.element];
  $('signElemName').textContent   = `${sign.name} · ${sign.element}`;

  // horoscope labels
  $('horoHeading').textContent = `Today's ${sign.name} reading`;
  $('horoLabel').textContent   = `Daily horoscope · ${sign.name}`;

  $('heroDate').textContent = LONG_DATE.format(day.date).toUpperCase();

  $('itemIcon').textContent  = day.item.icon;
  $('itemName').textContent  = day.item.name;
  $('itemNote').textContent  = fill(day.item.note, sign);
  $('itemStamp').textContent = 'Drawn for ' + day.key;

  $('readingBubble').textContent = day.reading;

  // ring: r=86 → circumference ≈ 540.35
  const C = 2 * Math.PI * 86;
  const ring = $('ringFill');
  ring.style.strokeDasharray  = C;
  ring.style.strokeDashoffset = C;
  // next frame, so the transition actually runs on re-render
  requestAnimationFrame(() => {
    ring.style.strokeDashoffset = C * (1 - day.luck / 100);
  });
  ring.style.stroke = day.colour.hex;

  $('luckNum').textContent   = day.luck;
  $('luckLabel').textContent = day.luckLabel;

  $('colourSwatch').style.background = day.colour.hex;
  $('colourName').textContent    = day.colour.name;
  $('luckyNumber').textContent   = day.number;
  $('numberNote').textContent    = `Rat runs on 2 and 3. ${sign.name} adds ${sign.numbers.join(' and ')}.`;
  $('luckyDirection').textContent = day.direction;
  $('luckyHour').textContent     = day.hour.label;
  $('hourNote').textContent      = day.hour.note;
  $('charName').textContent      = day.character.name;
  $('charNote').textContent      = day.character.note;
  $('microAction').textContent   = day.action;
  $('avoidThing').textContent    = day.avoid;
  $('ratBrings').textContent     = day.rat;
  $('signBrings').textContent    = day.signBrings;
}


/* ══ WHICH SIGN IS THIS PAGE? ═════════════════════════
   Each star sign gets its own HTML file, and the file
   declares itself with <body data-sign="aries">. That is
   the only difference between the twelve pages — the
   markup, styles and this script are shared.

   index_2.html has no data-sign: it is the chooser, so
   the script only wires the menu and stops.            */
const PAGE_SIGN = document.body.dataset.sign;
const sign = SIGNS.find(x => x.key === PAGE_SIGN);

let offset = 0;

function refresh() {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  render(buildDay(d, sign));
  loadHoroscope(current);
}

/* ── THE MENU: links to the other eleven ────────────── */
$('signList').innerHTML = SIGNS.map(x =>
  `<a href="${x.key}.html"${x.key === PAGE_SIGN ? ' aria-current="page"' : ''}>
     <span class="sign-g">${x.glyph}</span>
     <span class="sign-n">${x.name}</span>
     <span class="sign-d">${x.dates}</span>
   </a>`).join('');
$('signList').querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* ── DAY SWITCH ─────────────────────────────────────── */
$('daySwitch')?.addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;

  [...e.currentTarget.querySelectorAll('.chip')]
    .forEach(c => c.setAttribute('aria-pressed', String(c === btn)));

  offset = Number(btn.dataset.offset);
  refresh();
});


/* ── TOAST ──────────────────────────────────────────── */
let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}


/* ── COPY AS TEXT ───────────────────────────────────── */
function asText(d) {
  return [
    `LUCKY — Rat \u00d7 ${d.sign.name}`,
    LONG_DATE.format(d.date),
    ``,
    `Item:      ${d.item.name}`,
    `Colour:    ${d.colour.name}`,
    `Number:    ${d.number}`,
    `Direction: ${d.direction}`,
    `Hour:      ${d.hour.label}`,
    `Character: ${d.character.name}`,
    ``,
    d.reading,
    ``,
    `Do:        ${d.action}`,
    `Go easy:   ${d.avoid}`
  ].join('\n');
}

$('copyBtn')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(asText(current));
    toast('Copied ✓');
  } catch {
    toast('Clipboard blocked — try the image instead');
  }
});


/* ── SAVE AS IMAGE ──────────────────────────────────────
   Same idea as the photo strip download: draw it onto a
   canvas, then hand the browser a data URL.             */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = w;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}

/* The wandering pen outline, in canvas form: a rounded rect
   whose corner radii are all different, like the CSS boxes. */
function doodleRect(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x + 60, y);
  ctx.lineTo(x + w - 14, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + 44);
  ctx.lineTo(x + w, y + h - 60);
  ctx.quadraticCurveTo(x + w, y + h, x + w - 52, y + h);
  ctx.lineTo(x + 16, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - 40);
  ctx.lineTo(x, y + 56);
  ctx.quadraticCurveTo(x, y, x + 60, y);
  ctx.stroke();
}

async function buildCard(d) {
  const W = 1000, H = 1450;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch {}
  }

  // ground
  ctx.fillStyle = '#F5F0E8';
  ctx.fillRect(0, 0, W, H);

  // drawn frame, two passes
  ctx.strokeStyle = '#2B2B2B';
  ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  doodleRect(ctx, 46, 46, W - 92, H - 92);
  ctx.globalAlpha = .22; ctx.lineWidth = 4;
  doodleRect(ctx, 38, 38, W - 76, H - 76);
  ctx.globalAlpha = 1;

  ctx.textAlign = 'center';
  ctx.fillStyle = '#2B2B2B';

  ctx.font = '700 96px Caveat, cursive';
  ctx.fillText('LUCKY', W / 2, 190);

  ctx.font = '600 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#4A4A4A';
  ctx.fillText(`RAT  \u00d7  ${d.sign.name.toUpperCase()}`, W / 2, 236);
  ctx.font = '400 22px "Space Grotesk", sans-serif';
  ctx.fillText(LONG_DATE.format(d.date).toUpperCase(), W / 2, 276);

  // the item
  ctx.font = '120px serif';
  ctx.fillText(d.item.icon, W / 2, 420);

  ctx.fillStyle = '#2B2B2B';
  ctx.font = '700 76px Caveat, cursive';
  let y = wrapText(ctx, d.item.name, W / 2, 520, W - 220, 80);

  ctx.fillStyle = '#4A4A4A';
  ctx.font = '400 26px "Space Grotesk", sans-serif';
  y = wrapText(ctx, fill(d.item.note, d.sign), W / 2, y + 14, W - 240, 40);

  // divider
  ctx.strokeStyle = 'rgba(43,43,43,.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(200, y + 24);
  ctx.quadraticCurveTo(W / 2, y + 14, W - 200, y + 26);
  ctx.stroke();

  // the four stats
  const stats = [
    ['COLOUR',    d.colour.name],
    ['NUMBER',    String(d.number)],
    ['DIRECTION', d.direction],
    ['HOUR',      d.hour.label]
  ];
  let sy = y + 96;
  stats.forEach(([label, value], i) => {
    const cx = i % 2 === 0 ? W * 0.30 : W * 0.70;
    const row = Math.floor(i / 2);
    const ry = sy + row * 150;

    ctx.fillStyle = '#4A4A4A';
    ctx.font = '600 20px "Space Grotesk", sans-serif';
    ctx.fillText(label, cx, ry);

    ctx.fillStyle = '#2B2B2B';
    ctx.font = '700 52px Caveat, cursive';
    ctx.fillText(value, cx, ry + 58);

    if (label === 'COLOUR') {
      ctx.fillStyle = d.colour.hex;
      ctx.beginPath();
      ctx.ellipse(cx, ry + 90, 22, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2B2B2B'; ctx.lineWidth = 3; ctx.stroke();
    }
  });

  // lucky character — name only, no artwork
  ctx.fillStyle = '#4A4A4A';
  ctx.font = '600 20px "Space Grotesk", sans-serif';
  ctx.fillText('LUCKY CHARACTER', W / 2, sy + 250);
  ctx.fillStyle = '#2B2B2B';
  ctx.font = '700 56px Caveat, cursive';
  ctx.fillText(d.character.name, W / 2, sy + 310);

  // the reading
  ctx.fillStyle = '#2B2B2B';
  ctx.font = '700 44px Caveat, cursive';
  let ry = wrapText(ctx, d.reading, W / 2, sy + 410, W - 220, 54);

  ctx.fillStyle = '#9c968c';
  ctx.font = '400 20px "Space Grotesk", sans-serif';
  ctx.fillText('Do: ' + d.action, W / 2, ry + 22);
  ctx.fillText('Go easy on: ' + d.avoid, W / 2, ry + 56);

  return cv;
}

$('saveBtn')?.addEventListener('click', async () => {
  const btn = $('saveBtn');
  btn.disabled = true;
  try {
    const cv = await buildCard(current);
    const a = document.createElement('a');
    a.download = `lucky-${current.key}.png`;
    a.href = cv.toDataURL('image/png');
    a.click();
    toast('Saved ✓');
  } catch (err) {
    console.error(err);
    toast('Couldn’t save that one');
  } finally {
    btn.disabled = false;
  }
});


/* ══ LIVE HOROSCOPE ═══════════════════════════════════
   The one piece of real, external data on the page.

   freehoroscopeapi.com: free, no API key, no sign-up. It
   only publishes TODAY, so the Yesterday/Tomorrow chips get
   an honest "today only" message rather than a wrong reading.

   Everything about this is best-effort. The page must still
   work with the wifi off, so a failed request degrades to a
   note in the card and touches nothing else.               */
const HOROSCOPE_API = 'https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=';
const CACHE_PREFIX  = 'lucky:horoscope:';

function setHoro(state, text) {
  const badge = $('horoBadge');
  badge.className = 'horo-badge ' + state;
  badge.textContent = {
    loading: 'loading',
    live:    'live',
    cached:  'saved earlier',
    offline: 'offline',
    future:  'today only'
  }[state] || state;
  $('horoText').textContent = text;
}

/* localStorage is a nice-to-have: it makes the reading survive
   going offline later in the day. Private-mode browsers throw on
   access, so every call is wrapped.                            */
function cacheRead(key) {
  try { return localStorage.getItem(CACHE_PREFIX + key); } catch { return null; }
}
function cacheWrite(key, value) {
  try { localStorage.setItem(CACHE_PREFIX + key, value); } catch { /* full or blocked */ }
}

async function loadHoroscope(day) {
  const todayKey = dateKey(new Date());

  if (day.key !== todayKey) {
    setHoro('future', 'The live horoscope is only published for today — switch back to Today to read it.');
    return;
  }

  const ck = day.sign.key + ':' + day.key;
  const cached = cacheRead(ck);
  if (cached) { setHoro('cached', cached); }
  else        { setHoro('loading', 'Fetching today’s reading…'); }

  // 8s is generous; past that the page is more useful without it
  const ctrl = new AbortController();
  const bail = setTimeout(() => ctrl.abort(), 8000);

  try {
    const res = await fetch(HOROSCOPE_API + day.sign.key, { signal: ctrl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);

    // The docs show { data: {...} } but the live endpoint returns
    // the fields flat. Accept either rather than trusting one.
    const json = await res.json();
    const body = json?.data ?? json;
    const text = body?.horoscope;
    if (!text) throw new Error('no horoscope field in response');

    cacheWrite(ck, text);
    setHoro('live', text);
  } catch (err) {
    console.warn('horoscope unavailable:', err.message);
    if (!cached) {
      setHoro('offline',
        'Couldn’t reach the horoscope service just now. Everything else on this page works without it.');
    }
    // if we had a cached copy, it is already on screen — leave it
  } finally {
    clearTimeout(bail);
  }
}


/* ── GO ─────────────────────────────────────────────── */
/* No sign on <body> means this is the chooser page — the menu
   above is all it needs, so stop before touching the reading. */
if (sign) refresh();
