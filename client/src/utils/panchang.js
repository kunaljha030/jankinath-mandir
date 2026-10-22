// Simple Hindu panchang (tithi, paksha, maas, nakshatra, samvat) computed in the browser.
// Sun and moon longitudes use the low-precision formulas from Meeus, "Astronomical Algorithms"
// (moon accurate to about 0.01°), so tithi changes are right to within a few minutes.
// Values are taken at sunrise at Rewasa Dham (Sikar), the usual panchang convention.

const LAT = 27.6;
const LON = 75.14;
const IST = 5.5;

const rad = (d) => (d * Math.PI) / 180;
const norm = (d) => ((d % 360) + 360) % 360;
const sin = (d) => Math.sin(rad(d));

export const TITHIS = [
  "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी",
  "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी",
];
export const MAAS = [
  "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद",
  "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन",
];
export const NAKSHATRAS = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा",
  "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा",
  "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती",
];
export const VAARS = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

const julianDay = (ms) => ms / 86400000 + 2440587.5;

function sunLongitude(jd) {
  const T = (jd - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = 357.52911 + 35999.05029 * T;
  const C = (1.914602 - 0.004817 * T) * sin(M) + 0.019993 * sin(2 * M) + 0.000289 * sin(3 * M);
  return norm(L0 + C - 0.00569);
}

function moonLongitude(jd) {
  const T = (jd - 2451545) / 36525;
  const L = 218.3164477 + 481267.88123421 * T;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mm = 134.9633964 + 477198.8675055 * T;
  const F = 93.272095 + 483202.0175233 * T;
  const sum =
    6.288774 * sin(Mm) +
    1.274027 * sin(2 * D - Mm) +
    0.658314 * sin(2 * D) +
    0.213618 * sin(2 * Mm) -
    0.185116 * sin(M) -
    0.114332 * sin(2 * F) +
    0.058793 * sin(2 * D - 2 * Mm) +
    0.057066 * sin(2 * D - M - Mm) +
    0.053322 * sin(2 * D + Mm) +
    0.045758 * sin(2 * D - M) -
    0.040923 * sin(M - Mm) -
    0.03472 * sin(D) -
    0.030383 * sin(M + Mm) +
    0.015327 * sin(2 * D - 2 * F) -
    0.012528 * sin(Mm + 2 * F) +
    0.01098 * sin(Mm - 2 * F) +
    0.010675 * sin(4 * D - Mm) +
    0.010034 * sin(3 * Mm) +
    0.008548 * sin(4 * D - 2 * Mm) -
    0.007888 * sin(2 * D + M - Mm) -
    0.006766 * sin(2 * D + M) -
    0.005163 * sin(D - Mm) +
    0.004987 * sin(D + M) +
    0.004036 * sin(2 * D - M + Mm);
  return norm(L + sum);
}

// Lahiri ayanamsa (approximate, good to a few arc-minutes for this century)
const ayanamsa = (jd) => 23.853 + (0.0139689 * (jd - 2451545)) / 365.25;

const elongation = (jd) => norm(moonLongitude(jd) - sunLongitude(jd));

// Sunrise at the mandir for a calendar date, as a UTC timestamp (ms)
export function sunrise(y, m, d) {
  const n = (Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000;
  const B = (360 / 365) * (n - 81);
  const decl = 23.44 * sin(B);
  const eot = 9.87 * sin(2 * B) - 7.53 * Math.cos(rad(B)) - 1.5 * sin(B); // minutes
  const cosH = (sin(-0.833) - sin(LAT) * sin(decl)) / (Math.cos(rad(LAT)) * Math.cos(rad(decl)));
  const H = (Math.acos(cosH) * 180) / Math.PI;
  const noonUtc = 12 - LON / 15 - eot / 60;
  return Date.UTC(y, m - 1, d) + (noonUtc - H / 15) * 3600000;
}

// Time (jd) of the new moon before jd
function previousNewMoon(jd) {
  let t = jd - elongation(jd) / 12.19;
  for (let i = 0; i < 3; i++) {
    let e = elongation(t);
    if (e > 180) e -= 360;
    t -= e / 12.19;
  }
  return t;
}

// Tithi and month at a moment (UTC ms)
function lunarDay(ms) {
  const jd = julianDay(ms);
  const t = Math.floor(elongation(jd) / 12); // 0..29
  const shukla = t < 15;
  // Amanta month: named from the sun's sidereal rashi at the new moon that began it
  const nm = previousNewMoon(jd);
  const rashi = (x) => Math.floor(norm(sunLongitude(x) - ayanamsa(x)) / 30);
  const amanta = (rashi(nm) + 1) % 12;
  // Adhik maas: no sankranti between this new moon and the next one
  const adhik = rashi(previousNewMoon(nm + 31)) === rashi(nm);
  // North India (purnimanta): krishna paksha belongs to the next month (the adhik month stays whole)
  const maas = shukla || adhik ? amanta : (amanta + 1) % 12;
  return { jd, num: (t % 15) + 1, shukla, amanta, maas, adhik };
}

// Panchang for a calendar date (y, m 1-12, d), taken at sunrise
export function panchang(y, m, d) {
  const rise = sunrise(y, m, d);
  const { jd, num, shukla, amanta, maas, adhik } = lunarDay(rise);
  const tithi = num === 15 ? (shukla ? "पूर्णिमा" : "अमावस्या") : TITHIS[num - 1];
  const nak = Math.floor(norm(moonLongitude(jd) - ayanamsa(jd)) / (360 / 27));
  // Vikram samvat starts at Chaitra shukla pratipada
  const samvat = amanta >= 9 && m <= 4 ? y + 56 : y + 57;

  const riseIst = new Date(rise + IST * 3600000);
  return {
    tithi,
    tithiNum: num,
    shukla,
    maasNum: maas,
    adhik,
    paksha: shukla ? "शुक्ल पक्ष" : "कृष्ण पक्ष",
    maas: (adhik ? "अधिक " : "") + MAAS[maas],
    nakshatra: NAKSHATRAS[nak],
    vaar: VAARS[new Date(y, m - 1, d).getDay()],
    samvat,
    sunrise: `${riseIst.getUTCHours()}:${String(riseIst.getUTCMinutes()).padStart(2, "0")}`,
    ekadashi: num === 11,
    purnima: shukla && num === 15,
    amavasya: !shukla && num === 15,
  };
}

// Today's date at the mandir (India)
export function todayInIndia() {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date()).split("-");
  return { y: +y, m: +m, d: +d };
}

// Calendar days from `from` onwards: { y, m, d, offset }
function* daysFrom(from, limit) {
  for (let i = 0; i < limit; i++) {
    const t = new Date(from.y, from.m - 1, from.d + i);
    yield { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate(), offset: i };
  }
}

// Ekadashi names by purnimanta month: [krishna, shukla]
const EKADASHI_NAMES = [
  ["पापमोचनी", "कामदा"], // चैत्र
  ["वरूथिनी", "मोहिनी"], // वैशाख
  ["अपरा", "निर्जला"], // ज्येष्ठ
  ["योगिनी", "देवशयनी"], // आषाढ़
  ["कामिका", "श्रावण पुत्रदा"], // श्रावण
  ["अजा", "परिवर्तिनी"], // भाद्रपद
  ["इन्दिरा", "पापांकुशा"], // आश्विन
  ["रमा", "देवउठनी"], // कार्तिक
  ["उत्पन्ना", "मोक्षदा"], // मार्गशीर्ष
  ["सफला", "पौष पुत्रदा"], // पौष
  ["षटतिला", "जया"], // माघ
  ["विजया", "आमलकी"], // फाल्गुन
];

// Next `count` ekadashis from a date: the first day of each paksha whose sunrise tithi is ekadashi or later
export function nextEkadashis(from, count = 4) {
  const out = [];
  let prev = null;
  const start = new Date(from.y, from.m - 1, from.d - 1);
  for (const day of daysFrom({ y: start.getFullYear(), m: start.getMonth() + 1, d: start.getDate() }, 400)) {
    const p = panchang(day.y, day.m, day.d);
    const entered = p.tithiNum >= 11 && p.tithiNum < 15 && (!prev || prev.shukla !== p.shukla || prev.tithiNum < 11);
    if (prev && entered) {
      const name = p.adhik ? (p.shukla ? "पद्मिनी" : "परमा") : EKADASHI_NAMES[p.maasNum][p.shukla ? 1 : 0];
      out.push({ ...day, offset: day.offset - 1, p, name });
      if (out.length === count) break;
    }
    prev = p;
  }
  return out;
}

// Next date of a festival given by month, paksha and tithi, checked at an hour of the day (IST).
// Takes the first day on which that tithi (or a later one, if it was skipped) is running at that hour.
export function nextFestival(from, { maas, shukla, tithi, hour = 6 }) {
  let prevMatch = false;
  const start = new Date(from.y, from.m - 1, from.d - 1);
  for (const day of daysFrom({ y: start.getFullYear(), m: start.getMonth() + 1, d: start.getDate() }, 400)) {
    const l = lunarDay(Date.UTC(day.y, day.m - 1, day.d) + (hour - IST) * 3600000);
    const match = !l.adhik && l.maas === maas && l.shukla === shukla && l.num >= tithi;
    if (match && !prevMatch && day.offset > 0) return { ...day, offset: day.offset - 1 };
    prevMatch = match;
  }
  return null;
}
