const $ = (selector) => document.querySelector(selector);
const app = $("#app");

const CLAUDE_MODEL = "claude-3-5-haiku-latest";
const STORAGE_KEY = "fallen-sun-save-v1";

const classes = {
  Knight: {
    epithet: "An exile sealed in plate, too stubborn to rot.",
    stats: { hp: 120, stamina: 80, str: 14, dex: 9, int: 4, level: 1 },
    gear: ["Grave-Iron Sword", "Cairn Knight Mail", "Ashen Ring", "Estus Flask"],
  },
  Pyromancer: {
    epithet: "A sinner carrying the last warm coal of a dead chapel.",
    stats: { hp: 88, stamina: 72, str: 7, dex: 8, int: 15, level: 1 },
    gear: ["Ember Curved Blade", "Cinder Rags", "Coal-Eater Ring", "Estus Flask"],
  },
  Thief: {
    epithet: "A knife in the dark, hunted even by the moon.",
    stats: { hp: 82, stamina: 102, str: 7, dex: 16, int: 6, level: 1 },
    gear: ["Needle Spear", "Moth-Leather Set", "Raven Ring", "Estus Flask", "Throwing Knives"],
  },
  Herald: {
    epithet: "A broken messenger who forgot the name of the king.",
    stats: { hp: 104, stamina: 86, str: 10, dex: 11, int: 10, level: 1 },
    gear: ["Bell Axe", "Pilgrim Herald Armor", "Martyr Ring", "Estus Flask", "Poison Moss"],
  },
};

const items = {
  "Grave-Iron Sword": { type: "weapon", family: "sword", damage: 16, stamina: 12, scaling: "str", lore: "A sword buried with nameless soldiers and raised before the bodies cooled. Its edge remembers every oath they broke." },
  "Ember Curved Blade": { type: "weapon", family: "curved blade", damage: 12, stamina: 10, scaling: "int", lore: "A crescent of blackened bronze. It glows only when it cuts something that once prayed." },
  "Needle Spear": { type: "weapon", family: "spear", damage: 13, stamina: 9, scaling: "dex", lore: "A plague-doctor's implement made for piercing boils, armor, and pride." },
  "Bell Axe": { type: "weapon", family: "axe", damage: 18, stamina: 15, scaling: "str", lore: "Every swing tolls faintly, calling mourners from graves too shallow to hold them." },
  "Cairn Knight Mail": { type: "armor", armor: 12, weight: 18, lore: "Stone dust fills each ring of mail. The wearer moves like a tomb learning to walk." },
  "Cinder Rags": { type: "armor", armor: 5, weight: 5, lore: "Robes of a fire cult that outlived its flame by feeding it names." },
  "Moth-Leather Set": { type: "armor", armor: 6, weight: 4, lore: "Soft leather powdered with wing scales. It muffles steps and slowly erases footprints." },
  "Pilgrim Herald Armor": { type: "armor", armor: 9, weight: 10, lore: "The brass throat-piece is dented inward, as if the last message tried to claw its way out." },
  "Ashen Ring": { type: "ring", buff: "+10 HP", lore: "A ring of cooled bone ash. It grants the persistence of things that should have ended." },
  "Coal-Eater Ring": { type: "ring", buff: "+3 Intelligence", lore: "Warm to the touch. Those who wear it dream of swallowing stars and waking hungry." },
  "Raven Ring": { type: "ring", buff: "+15% crit", lore: "A black ring that tightens whenever carrion birds gather overhead." },
  "Martyr Ring": { type: "ring", buff: "+8% block", lore: "Forged around a saint's finger. The saint is still trying to pull away." },
  "Estus Flask": { type: "consumable", charges: 3, lore: "Bottled dusk from the First Bonfire. It heals flesh while reminding the soul how to burn." },
  "Poison Moss": { type: "consumable", charges: 2, lore: "Moss that grows in plague graves. Bitter enough to frighten lesser poisons." },
  "Throwing Knives": { type: "consumable", charges: 5, lore: "Thin knives etched with tiny confessions. Each one flies truer toward the guilty." },
  "Fallen God's Splinter": { type: "ring", buff: "+4 all stats, +curse", lore: "Not a relic, but a scab. It pulses with the old god's wound and calls it mercy." },
};


const environmentPalettes = {
  castle: { label: "Ruined Castle", particles: "dust", tone: "Cold blue grey" },
  village: { label: "Plague Village", particles: "miasma", tone: "Sickly green" },
  forest: { label: "Dark Forest", particles: "spores", tone: "Deep purple" },
  cathedral: { label: "Demon Cathedral", particles: "cinders", tone: "Dark red gold" },
};

function environmentBackdrop(areaId = "castle") {
  const renderers = {
    castle: castleBackdrop,
    village: villageBackdrop,
    forest: forestBackdrop,
    cathedral: cathedralBackdrop,
  };
  return `<div class="environment environment-${areaId}" aria-hidden="true">${(renderers[areaId] || castleBackdrop)()}<div class="fx-particles ${environmentPalettes[areaId]?.particles || "dust"}"></div><div class="scene-vignette"></div></div>`;
}

function castleBackdrop() {
  return `<svg class="scene-svg layer sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
    <defs><radialGradient id="castleMoon" cx="50%" cy="12%" r="40%"><stop offset="0" stop-color="#d8e7ff" stop-opacity=".9"/><stop offset=".28" stop-color="#627899" stop-opacity=".38"/><stop offset="1" stop-color="#070b13"/></radialGradient><linearGradient id="castleStone" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#273142"/><stop offset="1" stop-color="#0b0d12"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#castleMoon)"/><circle cx="825" cy="100" r="110" fill="#dce8ff" opacity=".78"/><path d="M650 0 910 0 740 900 560 900Z" fill="#d8e7ff" opacity=".16"/><path d="M875 0 1040 0 1180 900 920 900Z" fill="#b9d0ff" opacity=".09"/>
  </svg><svg class="scene-svg layer far" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
    <rect y="210" width="1600" height="690" fill="url(#castleStone)"/><g fill="#06080d"><path d="M0 210h155v690H0zM310 190h120v710H310zM570 170h160v730H570zM920 180h130v720H920zM1260 200h170v700h-170z"/><path d="M110 310q90-155 180 0v590H110zM430 315q105-165 210 0v585H430zM770 310q90-150 180 0v590H770zM1080 330q100-145 200 0v570h-200z" fill="#111621"/></g><g stroke="#53627a" stroke-opacity=".3" stroke-width="5"><path d="M0 238h1600M0 372h1600M0 520h1600"/><path d="M215 210v690M510 210v690M850 210v690M1168 210v690M1470 210v690"/></g>
  </svg><svg class="scene-svg layer near" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
    <g fill="#09090d"><path d="M0 760 C230 705 385 710 560 760 C770 820 1030 825 1600 735 V900 H0Z"/><path d="M70 375h135v525H70zM1225 350h150v550h-150z"/><path d="M38 375q100-165 200 0h-55q-83-90-130 0zM1198 350q120-190 240 0h-65q-98-120-170 0z"/></g><g class="flames"><ellipse cx="170" cy="742" rx="16" ry="42" fill="#d5a349"/><ellipse cx="170" cy="748" rx="9" ry="27" fill="#ffe2a0"/><ellipse cx="1280" cy="730" rx="18" ry="45" fill="#d5a349"/><ellipse cx="1280" cy="736" rx="9" ry="28" fill="#ffe2a0"/><rect x="163" y="776" width="14" height="65" fill="#1b1512"/><rect x="1273" y="766" width="16" height="70" fill="#1b1512"/></g>
  </svg>`;
}

function villageBackdrop() {
  return `<svg class="scene-svg layer sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="villageSky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#102018"/><stop offset=".45" stop-color="#17251b"/><stop offset="1" stop-color="#040805"/></linearGradient></defs><rect width="1600" height="900" fill="url(#villageSky)"/><circle cx="1220" cy="140" r="85" fill="#b9d58b" opacity=".13"/></svg><svg class="scene-svg layer far" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><g fill="#0a0d09"><path d="M80 290 290 250 315 900 55 900Z"/><path d="M318 325 535 265 610 900 300 900Z"/><path d="M1120 275 1350 320 1395 900 1085 900Z"/><path d="M1365 310 1550 275 1600 900 1340 900Z"/></g><g stroke="#24351d" stroke-width="8"><path d="M90 390h210M325 450h250M1130 430h250M1375 400h210"/></g><g class="lanterns"><path d="M426 324v96" stroke="#1a1208" stroke-width="7"/><ellipse cx="426" cy="438" rx="28" ry="36" fill="#8da04d" opacity=".45"/><ellipse cx="426" cy="438" rx="10" ry="18" fill="#eadf8b"/><path d="M1245 334v98" stroke="#1a1208" stroke-width="7"/><ellipse cx="1245" cy="448" rx="30" ry="38" fill="#8da04d" opacity=".45"/><ellipse cx="1245" cy="448" rx="10" ry="18" fill="#eadf8b"/></g></svg><svg class="scene-svg layer near" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><path d="M0 710 C240 630 420 720 610 675 C870 615 1080 700 1600 650 V900 H0Z" fill="#050805"/><g stroke="#0e100b" stroke-width="20" fill="none"><path d="M150 690c30-130 15-250-20-350M150 485c-70-45-105-92-128-140M156 500c70-52 90-105 118-170M1445 700c-40-140-15-240 30-370M1448 514c-70-28-120-75-160-145M1456 520c80-58 130-110 168-185"/></g><path class="miasma-band" d="M0 760 C250 690 410 805 660 735 C925 665 1105 790 1600 705 V900 H0Z" fill="#79a84a" opacity=".18"/></svg>`;
}

function forestBackdrop() {
  return `<svg class="scene-svg layer sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="forestGlow" cx="50%" cy="45%" r="70%"><stop stop-color="#2d174e"/><stop offset=".55" stop-color="#090815"/><stop offset="1" stop-color="#020104"/></radialGradient></defs><rect width="1600" height="900" fill="url(#forestGlow)"/></svg><svg class="scene-svg layer far" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><g fill="#050408"><path d="M95 0h72l-24 900H62zM305 0h105l-45 900H250zM580 0h90l-20 900H530zM875 0h130l-65 900H820zM1170 0h92l-10 900h-118zM1415 0h105l-35 900h-130z"/></g><g fill="none" stroke="#050408" stroke-width="34" stroke-linecap="round"><path d="M110 585c150 12 198 58 300 130M920 630c150 0 230 35 360 135M560 580c-135 20-190 80-288 160"/></g><g class="watching-eyes" fill="#b37cff"><ellipse cx="465" cy="310" rx="12" ry="5"/><ellipse cx="505" cy="310" rx="12" ry="5"/><ellipse cx="1115" cy="385" rx="10" ry="4"/><ellipse cx="1150" cy="385" rx="10" ry="4"/><ellipse cx="1335" cy="260" rx="8" ry="4"/><ellipse cx="1364" cy="260" rx="8" ry="4"/></g></svg><svg class="scene-svg layer near" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><path d="M0 730 C240 650 420 745 650 705 C935 650 1120 745 1600 680 V900 H0Z" fill="#030204"/><g class="mushrooms"><path d="M310 790q35-70 70 0z" fill="#8757ff"/><rect x="340" y="790" width="18" height="60" fill="#d7c8ff" opacity=".38"/><path d="M960 770q45-92 95 0z" fill="#4bc7ff"/><rect x="1002" y="770" width="20" height="72" fill="#d7f7ff" opacity=".35"/><path d="M1190 805q28-55 58 0z" fill="#ba72ff"/><rect x="1216" y="805" width="13" height="46" fill="#eddcff" opacity=".35"/></g><path class="fog-bank" d="M0 675 C230 620 355 700 520 650 C740 585 900 700 1115 650 C1300 610 1450 650 1600 615 V900 H0Z" fill="#bdb3ff" opacity=".08"/></svg>`;
}

function cathedralBackdrop() {
  return `<svg class="scene-svg layer sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="cathedralCore" cx="50%" cy="35%" r="55%"><stop stop-color="#5b0f12"/><stop offset=".46" stop-color="#190607"/><stop offset="1" stop-color="#030101"/></radialGradient></defs><rect width="1600" height="900" fill="url(#cathedralCore)"/><path d="M580 130h440l55 770H525z" fill="#080304" opacity=".72"/></svg><svg class="scene-svg layer far" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><g fill="#0b0707"><path d="M120 220h170v680H120zM420 120h190v780H420zM790 60h220v840H790zM1190 120h190v780h-190z"/><path d="M420 120q95-130 190 0M790 60q110-165 220 0M1190 120q95-130 190 0"/></g><g class="stained" stroke="#22120d" stroke-width="14"><path d="M470 240q45-95 90 0v220h-90z" fill="#8b1118"/><path d="M850 160q70-130 140 0v315H850z" fill="#b1191f"/><path d="M1235 240q45-95 90 0v220h-90z" fill="#8b1118"/></g><g stroke="#3d2216" stroke-width="5" opacity=".85"><path d="M850 270h140M920 160v315M470 330h90M515 240v220M1235 330h90M1280 240v220"/></g></svg><svg class="scene-svg layer near" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><path d="M0 760 C380 705 640 735 800 610 C980 742 1160 704 1600 760 V900 H0Z" fill="#050202"/><g fill="#120808"><path d="M690 628h240l70 135H620z"/><path d="M760 555h100l25 75H735z"/></g><g class="altar-fire"><ellipse cx="810" cy="552" rx="50" ry="105" fill="#c76420" opacity=".55"/><ellipse cx="810" cy="570" rx="25" ry="62" fill="#ffd27a" opacity=".8"/></g><path d="M0 825h1600v75H0z" fill="#080303"/></svg>`;
}

const world = [
  {
    id: "castle",
    name: "Ruined Castle of Veyr",
    icon: "🏰",
    text: "Moonlight clots on broken battlements. Something under the throne keeps breathing.",
    rooms: [
      { name: "Gate of Chained Crows", text: "A hundred cages sway without wind. One contains your own voice.", enemy: "Hollow Man-at-Arms", secret: "Raven Ring" },
      { name: "The Banquet Ossuary", text: "Dusty plates are set before seated skeletons. The head chair is freshly warm.", enemy: "Bone Steward", npc: "a jawless seneschal polishing an empty cup" },
      { name: "Kingsmoot Stair", text: "Each stair bears a carved king. All faces have been scratched into the same grin.", enemy: "Cairn Knight" },
    ],
    boss: {
      name: "Lord Veyr, Crown of Worms",
      icon: "♛",
      lore: "The last king fed his crown to the grave and was crowned in return.",
      hp: 150,
      attacks: ["raises the worm-crown for a crushing decree", "drags a rusted blade in a slow royal arc", "opens his ribs and commands the dead to kneel"],
    },
  },
  {
    id: "village",
    name: "Plague Village of Nhal",
    icon: "🕯️",
    text: "Every door is marked with mercy. Every house is locked from the outside.",
    rooms: [
      { name: "Well of Black Milk", text: "The bucket returns full, warm, and whispering.", enemy: "Pox Hound", secret: "Poison Moss" },
      { name: "Leechmire Chapel", text: "Children's prayers are nailed to rafters. The nails bleed green.", enemy: "Leech Acolyte", npc: "a fevered mother nursing a bundle of rags" },
      { name: "The Quarantine Pyre", text: "Ash falls upward from an unlit mound of bodies.", enemy: "Plague Warden" },
    ],
    boss: { name: "Saint Ulma the Swollen", icon: "☣", lore: "She cured the village by taking every sickness into one holy body.", hp: 165, attacks: ["inhales until the room bows inward", "vomits a fan of sainted bile", "blesses her own sores into bursting stars"] },
  },
  {
    id: "forest",
    name: "Dark Forest of Mournroot",
    icon: "🌲",
    text: "Trees lean close to hear your bones. The paths change when named.",
    rooms: [
      { name: "Path of Backward Footprints", text: "Your tracks arrive before you do.", enemy: "Mournroot Stalker", secret: "Needle Spear" },
      { name: "The Witch's Hollow", text: "A hut hangs from branches by its own hair.", enemy: "Briar Witch", npc: "a blind hunter sewing eyelids onto a map" },
      { name: "Deer-God's Grave", text: "Antlers as large as ships pierce the mud. Bells hang from every tine.", enemy: "Antlered Revenant" },
    ],
    boss: { name: "The Old Hart Without Eyes", icon: "🦌", lore: "The forest's god looked upon the fallen sun and tore sight from the world.", hp: 180, attacks: ["listens for your heartbeat and charges", "shakes bells that summon thorn ghosts", "lowers blind antlers for an execution"] },
  },
  {
    id: "cathedral",
    name: "Demon Cathedral of Aster",
    icon: "⛪",
    text: "The cathedral is upside down inside. Choirs sing from beneath the floor.",
    rooms: [
      { name: "Nave of Inverted Saints", text: "Statues hang by their ankles, smiling at the abyss above.", enemy: "Demon Cantor", secret: "Fallen God's Splinter" },
      { name: "Reliquary of Teeth", text: "Glass cases chatter when you pass. They know the shape of your bite.", enemy: "Tooth Collector", npc: "a dying nun cradling a horned skull" },
      { name: "Altar Beneath the World", text: "A black sun rests on the altar, smaller than a fist and heavier than regret.", enemy: "Apostate Fiend" },
    ],
    boss: { name: "Aster, Choir of One Thousand Throats", icon: "☀", lore: "The demon swallowed a cathedral to sing with every mouth that begged for dawn.", hp: 220, attacks: ["sings a note that cracks iron", "unfurls a choir of burning tongues", "prays backward and makes your shadow attack"] },
  },
];

const enemyBook = {
  "Hollow Man-at-Arms": { icon: "⚔️", hp: 46, damage: 14, souls: 42, attacks: ["lifts a chipped spear too high", "steps wide for a shield bash", "mutters a battlecry after forgetting the war"] },
  "Bone Steward": { icon: "🍷", hp: 38, damage: 12, souls: 38, attacks: ["bows with a hidden carving knife", "throws grave-wine into your eyes", "rings a dinner bell for no guests"] },
  "Cairn Knight": { icon: "🛡️", hp: 62, damage: 18, souls: 65, attacks: ["plants his feet for a brutal overhead", "raises a tower shield and waits", "drags stone mail into a lunging thrust"] },
  "Pox Hound": { icon: "🐕", hp: 44, damage: 15, souls: 45, poison: 8, attacks: ["scrapes pus from its teeth", "circles low for the hamstring", "coughs a cloud before leaping"] },
  "Leech Acolyte": { icon: "🪱", hp: 52, damage: 13, souls: 56, poison: 10, attacks: ["chants through a throat full of leeches", "extends a hooked censer", "kneels before lunging upward"] },
  "Plague Warden": { icon: "☠️", hp: 70, damage: 19, souls: 75, poison: 12, attacks: ["uncorks a green-glass lantern", "swings a corpse-hook sideways", "counts your remaining breaths aloud"] },
  "Mournroot Stalker": { icon: "🌑", hp: 55, damage: 18, souls: 66, attacks: ["vanishes behind the nearest tree", "draws back both thorn claws", "copies your stance badly"] },
  "Briar Witch": { icon: "🧙", hp: 58, damage: 17, souls: 72, attacks: ["braids thorns into a spell", "points with too many fingers", "laughs as roots tighten beneath you"] },
  "Antlered Revenant": { icon: "🦴", hp: 80, damage: 21, souls: 90, attacks: ["scrapes antlers along the ceiling", "rears for a grave-stomp", "breathes winter from an empty skull"] },
  "Demon Cantor": { icon: "🎼", hp: 72, damage: 22, souls: 98, attacks: ["draws breath through a split halo", "marks your name in the hymnbook", "hums until candles gutter red"] },
  "Tooth Collector": { icon: "🦷", hp: 78, damage: 23, souls: 105, attacks: ["opens a sack of grinding teeth", "smiles with borrowed jaws", "snaps forceps at your throat"] },
  "Apostate Fiend": { icon: "🔥", hp: 92, damage: 26, souls: 125, attacks: ["cracks a whip of altar flame", "kneels to a god below the floor", "bares the wound where faith escaped"] },
};

let state = freshState();

function freshState() {
  return {
    screen: "cinematic",
    hero: null,
    className: null,
    area: 0,
    room: 0,
    combat: null,
    souls: 0,
    bankedSouls: 0,
    droppedSouls: null,
    inventory: [],
    journal: [],
    log: ["The black road accepts another fool."],
    defeated: {},
    bosses: {},
    secrets: {},
    estus: 3,
    moss: 0,
    knives: 0,
    poison: 0,
    apiKey: localStorage.getItem("anthropic-api-key") || "",
    epitaph: "",
    transitionName: "",
  };
}

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  state = JSON.parse(raw);
  return true;
}
function sound(id) { document.querySelector(`#${id}`)?.play?.(); }
function flashFx(className, duration = 520) {
  document.body.classList.remove(className);
  void document.body.offsetWidth;
  document.body.classList.add(className);
  window.setTimeout(() => document.body.classList.remove(className), duration);
}
function showAreaTransition(name) {
  state.transitionName = name;
  window.setTimeout(() => {
    state.transitionName = "";
    render();
  }, 1450);
}
function transitionOverlay() {
  return state.transitionName ? `<div class="area-transition"><span>${state.transitionName}</span></div>` : "";
}
function addLog(text) { state.log.unshift(text); state.log = state.log.slice(0, 14); }
function addJournal(title, text, kind = "Lore") {
  if (!state.journal.some((j) => j.title === title && j.text === text)) state.journal.unshift({ title, text, kind });
}
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function weapon() { return state.inventory.map((n) => items[n]).find((i) => i.type === "weapon") || items["Grave-Iron Sword"]; }
function armor() { return state.inventory.map((n) => items[n]).find((i) => i.type === "armor") || { armor: 0, weight: 0 }; }
function rings() { return state.inventory.filter((n) => items[n].type === "ring"); }
function maxHp() { return state.hero.maxHp + (rings().includes("Ashen Ring") ? 10 : 0) + (rings().includes("Fallen God's Splinter") ? 16 : 0); }
function maxStamina() { return state.hero.maxStamina + (rings().includes("Fallen God's Splinter") ? 12 : 0); }
function stat(name) { return state.hero[name] + (rings().includes("Fallen God's Splinter") ? 4 : 0) + (name === "int" && rings().includes("Coal-Eater Ring") ? 3 : 0); }
function dodgeSpeed() { return armor().weight > 14 ? "fat" : armor().weight > 8 ? "steady" : "quick"; }

async function claude(kind, prompt, fallback) {
  if (!state.apiKey) return fallback;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": state.apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 120, messages: [{ role: "user", content: `${kind}: Write in bleak cryptic dark fantasy style, 1-3 sentences. ${prompt}` }] }),
    });
    if (!res.ok) throw new Error("Claude request failed");
    const data = await res.json();
    return data.content?.[0]?.text?.trim() || fallback;
  } catch (error) {
    addLog("The distant oracle is silent; old words crawl from memory instead.");
    return fallback;
  }
}

function render() {
  save();
  if (state.screen === "cinematic") return renderCinematic();
  if (state.screen === "creation") return renderCreation();
  if (state.screen === "bossIntro") return renderBossIntro();
  if (state.screen === "death") return renderDeath();
  return renderGame();
}

function renderCinematic() {
  app.innerHTML = `<section class="screen cinematic"><div class="panel scrollbox"><h1>Grave of the Fallen Sun</h1><div class="lore-scroll"><p>The god fell at dusk and did not die.</p><p>Its blood became gold. Its bones became thrones. Its wound became the kingdom.</p><p>Now every bell tolls underground, and every soul crawls toward a fire that cannot forgive.</p></div><button id="begin">Enter the curse</button><button id="load">Load last bonfire</button></div></section>`;
  $("#begin").onclick = () => { state.screen = "creation"; render(); };
  $("#load").onclick = () => { if (load()) render(); };
}

function renderCreation() {
  app.innerHTML = `<section class="screen"><div class="panel"><h1>Choose the condemned</h1><p class="muted">Death is not the end of the world. It is merely the end of you.</p><label>Optional Claude API key for generated item lore, NPC dialogue, and death epitaphs</label><input id="api" type="password" value="${state.apiKey}" placeholder="sk-ant-..." /><div class="class-grid">${Object.entries(classes).map(([name, c]) => `<article class="card"><h3>${name}</h3><p>${c.epithet}</p><p class="muted">HP ${c.stats.hp} · STA ${c.stats.stamina} · STR ${c.stats.str} · DEX ${c.stats.dex} · INT ${c.stats.int}</p><button data-class="${name}">Begin as ${name}</button></article>`).join("")}</div></div></section>`;
  $("#api").onchange = (e) => { state.apiKey = e.target.value.trim(); localStorage.setItem("anthropic-api-key", state.apiKey); };
  document.querySelectorAll("[data-class]").forEach((b) => b.onclick = () => startRun(b.dataset.class));
}

function startRun(className) {
  const c = classes[className];
  state = { ...freshState(), screen: "game", className, apiKey: state.apiKey, inventory: [...c.gear], hero: { maxHp: c.stats.hp, hp: c.stats.hp, maxStamina: c.stats.stamina, stamina: c.stats.stamina, str: c.stats.str, dex: c.stats.dex, int: c.stats.int, level: c.stats.level } };
  state.estus = state.inventory.includes("Estus Flask") ? 3 : 0;
  state.moss = state.inventory.includes("Poison Moss") ? 2 : 0;
  state.knives = state.inventory.includes("Throwing Knives") ? 5 : 0;
  Object.keys(items).forEach((name) => state.inventory.includes(name) && addJournal(name, items[name].lore, "Item"));
  addJournal("The Fallen God", "The kingdom says the god fell to save them. The graves say otherwise.", "World");
  render();
}

function renderGame() {
  const area = world[state.area];
  const room = area.rooms[state.room];
  const inCombat = state.combat;
  app.innerHTML = `<section class="game-scene game-scene-${area.id}">${environmentBackdrop(area.id)}<div class="hud-shell ${inCombat ? "combat-mode" : "explore-mode"}">${sidePanel()}<section class="panel main-panel">${inCombat ? combatPanel() : roomPanel(area, room)}</section>${rightPanel()}</div>${transitionOverlay()}</section>`;
  bindGameButtons();
}

function sidePanel() {
  const h = state.hero;
  return `<aside class="panel stats-panel"><h2>${state.className}</h2><div class="stat-row"><span>Soul Level</span><b>${h.level}</b></div><div class="stat-row"><span>Souls carried</span><b class="gold">${state.souls}</b></div><div class="stat-row"><span>Lost souls</span><b class="blood">${state.droppedSouls ? state.droppedSouls.amount : 0}</b></div><p>HP ${h.hp}/${maxHp()}</p><div class="bar"><span class="hp" style="width:${(h.hp / maxHp()) * 100}%"></span></div><p>Stamina ${h.stamina}/${maxStamina()} · ${dodgeSpeed()} roll</p><div class="bar"><span class="stamina" style="width:${(h.stamina / maxStamina()) * 100}%"></span></div>${state.poison ? `<p>Poison ${state.poison}</p><div class="bar"><span class="poison" style="width:${state.poison}%"></span></div>` : ""}<div class="stat-row"><span>STR</span><b>${stat("str")}</b></div><div class="stat-row"><span>DEX</span><b>${stat("dex")}</b></div><div class="stat-row"><span>INT</span><b>${stat("int")}</b></div><h3>Equipment</h3><div class="equip-row"><span>Weapon</span><b>${state.inventory.find((n) => items[n].type === "weapon")}</b></div><div class="equip-row"><span>Armor</span><b>${state.inventory.find((n) => items[n].type === "armor")}</b></div><div class="equip-row"><span>Rings</span><b>${rings().join(", ") || "None"}</b></div><button id="rest">Rest at bonfire</button><button id="level">Level up (${levelCost()} souls)</button></aside>`;
}

function roomPanel(area, room) {
  const cleared = state.defeated[`${state.area}-${state.room}`];
  return `<div class="location-card"><p class="area-kicker">${environmentPalettes[area.id].label} · ${environmentPalettes[area.id].tone}</p><h1 class="room-title">${room.name}</h1><p class="room-copy">${room.text}</p><p class="muted">${area.text}</p></div>${state.droppedSouls && state.droppedSouls.area === state.area && state.droppedSouls.room === state.room ? `<button id="retrieve">Retrieve ${state.droppedSouls.amount} dropped souls</button>` : ""}${!cleared ? `<div class="panel enemy-box"><div class="enemy-tease"><div class="portrait enemy-mini">${enemyBook[room.enemy].icon}</div><div><h2>${room.enemy}</h2><p class="telegraph">${enemyBook[room.enemy].attacks[0]}</p></div></div><button id="engage">Engage</button></div>` : `<p class="gold">The room is still. That is worse than safe.</p>`}${cleared && room.secret && !state.secrets[`${state.area}-${state.room}`] ? `<button id="secret">Search hidden path</button>` : ""}${cleared && room.npc ? `<button id="npc">Speak with ${room.npc}</button>` : ""}<div class="travel-grid"><button id="prev" ${state.room === 0 ? "disabled" : ""}>Previous room</button><button id="next">${state.room === area.rooms.length - 1 ? "Approach boss fog" : "Next room"}</button><button id="areas">Travel crossroads</button></div>`;
}

function combatPanel() {
  const c = state.combat;
  return `<div class="combat-stage"><div class="enemy-portrait"><div class="portrait enemy-glyph">${c.icon}</div><h1>${c.name}</h1><p class="telegraph">${c.telegraph}</p></div><div class="combat-actions"><p>Enemy HP ${c.hp}/${c.maxHp}</p><div class="bar"><span class="hp" style="width:${(c.hp / c.maxHp) * 100}%"></span></div><div class="action-grid"><button data-action="attack">Attack</button><button data-action="heavy">Heavy Attack</button><button data-action="dodge">Dodge</button><button data-action="block">Block</button><button data-action="item">Use Item</button><button data-action="flee">Flee</button><button data-action="knife" ${state.knives <= 0 ? "disabled" : ""}>Throw Knife (${state.knives})</button><button data-action="moss" ${state.moss <= 0 ? "disabled" : ""}>Poison Moss (${state.moss})</button></div></div></div>`;
}

function rightPanel() {
  return `<aside class="panel journal-panel"><h2>Chronicle</h2><div class="log">${state.log.map((l) => `<p>${l}</p>`).join("")}</div><h2>Journal</h2><div class="journal-list">${state.journal.map((j) => `<div class="item-lore"><b class="gold">${j.kind}: ${j.title}</b><p>${j.text}</p></div>`).join("")}</div></aside>`;
}

function bindGameButtons() {
  document.querySelectorAll("[data-action]").forEach((b) => b.onclick = () => playerAction(b.dataset.action));
  $("#engage")?.addEventListener("click", () => startCombat());
  $("#retrieve")?.addEventListener("click", () => { state.souls += state.droppedSouls.amount; addLog(`You reclaim ${state.droppedSouls.amount} souls. They cling like wet hair.`); state.droppedSouls = null; render(); });
  $("#secret")?.addEventListener("click", discoverSecret);
  $("#npc")?.addEventListener("click", speakNpc);
  $("#prev")?.addEventListener("click", () => { state.room--; render(); });
  $("#next")?.addEventListener("click", nextRoom);
  $("#areas")?.addEventListener("click", crossroads);
  $("#rest")?.addEventListener("click", restBonfire);
  $("#level")?.addEventListener("click", levelUp);
}

function startCombat(boss = false) {
  const area = world[state.area];
  const template = boss ? area.boss : enemyBook[area.rooms[state.room].enemy];
  const hp = boss ? template.hp : template.hp;
  state.combat = { boss, name: template.name || area.rooms[state.room].enemy, icon: template.icon, hp, maxHp: hp, damage: template.damage || 30, souls: template.souls || 250 + state.area * 140, attacks: template.attacks, telegraph: template.attacks[Math.floor(Math.random() * template.attacks.length)], guarded: false };
  sound(boss ? "sfx-boss" : "sfx-attack");
  render();
}

function playerAction(action) {
  const cost = { attack: 12, heavy: 24, dodge: dodgeSpeed() === "fat" ? 24 : 14, block: 10, item: 6, flee: 20, knife: 8, moss: 6 }[action];
  if (state.hero.stamina < cost) { addLog("Your limbs fail. The enemy sees the opening."); enemyTurn(true); return render(); }
  state.hero.stamina -= cost;
  if (action === "item") return useEstus();
  if (action === "moss") return useMoss();
  if (action === "flee") return flee();
  if (action === "knife") { state.knives--; damageEnemy(18 + stat("dex"), "A confession-knife buries itself in the foe."); return enemyTurn(); }
  if (action === "attack") { sound("sfx-attack"); const crit = Math.random() < (0.12 + (rings().includes("Raven Ring") ? 0.15 : 0)); damageEnemy(Math.floor(weapon().damage + stat(weapon().scaling) * 1.2) * (crit ? 2 : 1), crit ? "Critical hit. The wound opens like a mouth." : "Steel answers rot."); return enemyTurn(); }
  if (action === "heavy") {
    sound("sfx-heavy");
    flashFx("screen-shake", 420);
    const parry = state.combat.telegraph.includes("raises") || state.combat.telegraph.includes("draws") || Math.random() < 0.18;
    const heavyDamage = Math.floor(weapon().damage * 1.7 + stat("str") * 1.5) + (parry ? 20 : 0);
    damageEnemy(heavyDamage, parry ? "Parry and backstab. For a breath, the world is just." : "A heavy blow shakes old dust loose.");
    return enemyTurn();
  }
  if (action === "dodge") { sound("sfx-dodge"); const ok = Math.random() < (dodgeSpeed() === "quick" ? .78 : dodgeSpeed() === "steady" ? .58 : .35); addLog(ok ? "You pass beneath death's hand." : "The dodge is late. Pain finds you."); return enemyTurn(!ok, ok); }
  if (action === "block") { sound("sfx-block"); state.combat.guarded = true; addLog("You brace behind iron and dread."); return enemyTurn(false, false, true); }
}

function damageEnemy(amount, text) {
  state.combat.hp = clamp(state.combat.hp - amount, 0, state.combat.maxHp);
  addLog(`${text} (${amount} damage)`);
  if (state.combat.hp <= 0) winCombat();
}
function enemyTurn(vulnerable = false, dodged = false, blocked = false) {
  if (!state.combat) return render();
  if (!dodged) {
    let dmg = state.combat.damage + Math.floor(Math.random() * 8) - Math.floor(armor().armor * .6);
    if (blocked) dmg = Math.floor(dmg * (rings().includes("Martyr Ring") ? .35 : .48));
    if (vulnerable) dmg = Math.floor(dmg * 1.55);
    state.hero.hp -= Math.max(3, dmg);
    flashFx("blood-hit", 620);
    addLog(`${state.combat.name} ${state.combat.telegraph}. Blood pays the lesson. (${Math.max(3, dmg)} damage)`);
    if (enemyBook[state.combat.name]?.poison) state.poison = clamp(state.poison + enemyBook[state.combat.name].poison, 0, 100);
  }
  state.hero.stamina = clamp(state.hero.stamina + 18, 0, maxStamina());
  if (state.poison > 0) { state.hero.hp -= Math.ceil(state.poison / 20); state.poison = clamp(state.poison - 4, 0, 100); }
  if (state.hero.hp <= 0) return die();
  state.combat.telegraph = state.combat.attacks[Math.floor(Math.random() * state.combat.attacks.length)];
  render();
}
function winCombat() {
  const c = state.combat;
  state.souls += c.souls;
  addLog(`${c.name} collapses. ${c.souls} souls crawl into your keeping.`);
  if (c.boss) { state.bosses[state.area] = true; addJournal(c.name, world[state.area].boss.lore, "Boss"); }
  else state.defeated[`${state.area}-${state.room}`] = true;
  state.combat = null;
}
function useEstus() {
  if (state.estus <= 0) addLog("The flask is dry. Hope makes no sound inside it.");
  else { state.estus--; state.hero.hp = clamp(state.hero.hp + 55, 0, maxHp()); addLog("Estus burns down your throat and teaches the flesh to remember."); }
  enemyTurn();
}
function useMoss() { state.moss--; state.poison = 0; addLog("Bitter moss murders the plague in your blood."); enemyTurn(); }
function flee() { if (Math.random() < .52) { addLog("You flee, dishonored but breathing."); state.combat = null; render(); } else { addLog("The fog refuses your cowardice."); enemyTurn(true); } }
async function die() {
  sound("sfx-death");
  if (state.droppedSouls) addLog("The older bloodstain fades. Those souls are gone forever.");
  state.droppedSouls = { area: state.area, room: state.room, amount: state.souls };
  state.souls = 0;
  const name = `${state.className} of Soul Level ${state.hero.level}`;
  state.epitaph = await claude("Death epitaph", `The player ${name} died in ${world[state.area].rooms[state.room].name} to ${state.combat?.name || "the curse"}.`, `${name}, undone where the ${world[state.area].rooms[state.room].name} learned to hunger.`);
  addJournal("Death Epitaph", state.epitaph, "Death");
  state.screen = "death";
  render();
}

function renderDeath() {
  app.innerHTML = `<section class="screen cinematic"><div class="panel modal"><h1 class="death-title">You Died</h1><p>${state.epitaph}</p><p class="muted">Your souls lie where you fell. Die before retrieving them, and even memory will refuse you.</p><button id="return">Rise at the last bonfire</button><button id="new">Begin a new run</button></div></section>`;
  $("#return").onclick = () => { state.hero.hp = maxHp(); state.hero.stamina = maxStamina(); state.estus = 3; state.poison = 0; state.combat = null; state.screen = "game"; render(); };
  $("#new").onclick = () => { state = freshState(); render(); };
}

async function discoverSecret() {
  const room = world[state.area].rooms[state.room];
  state.secrets[`${state.area}-${state.room}`] = true;
  if (!state.inventory.includes(room.secret)) state.inventory.push(room.secret);
  const generated = await claude("Item lore", `Item name: ${room.secret}. Existing mechanical type: ${items[room.secret].type}.`, items[room.secret].lore);
  addJournal(room.secret, generated, "Item");
  addLog(`A hidden path coughs up ${room.secret}.`);
  sound("sfx-loot");
  render();
}
async function speakNpc() {
  const room = world[state.area].rooms[state.room];
  const dialogue = await claude("NPC dialogue", `NPC is ${room.npc} in ${room.name}. Mention the fallen god only obliquely.`, `"Do not look for dawn, little ash. Dawn looked for us first."`);
  addJournal(room.npc, dialogue, "NPC");
  addLog(`${room.npc} whispers into the dark.`);
  render();
}
function nextRoom() {
  const area = world[state.area];
  if (state.room < area.rooms.length - 1) state.room++;
  else if (!state.bosses[state.area]) state.screen = "bossIntro";
  else crossroads();
  render();
}
function renderBossIntro() {
  const b = world[state.area].boss;
  const area = world[state.area];
  app.innerHTML = `<section class="game-scene boss-scene game-scene-${area.id}">${environmentBackdrop(area.id)}<div class="boss-reveal"><div class="panel"><div class="sigil">${b.icon}</div><p class="muted">${b.lore}</p><h1>${b.name}</h1><button id="boss">Traverse the fog</button></div></div></section>`;
  $("#boss").onclick = () => { state.screen = "game"; startCombat(true); };
}
function crossroads() {
  app.innerHTML = `<section class="game-scene crossroads-scene">${environmentBackdrop(world[state.area].id)}<div class="panel crossroads-panel"><h1>The Cursed Crossroads</h1><p class="muted">No path leaves the kingdom. Some merely delay the grave.</p><div class="area-grid">${world.map((a, i) => `<article class="card area-card area-${a.id}"><h3>${a.icon} ${a.name}</h3><p>${a.text}</p><button data-area="${i}">Travel</button></article>`).join("")}</div></div>${transitionOverlay()}</section>`;
  document.querySelectorAll("[data-area]").forEach((b) => b.onclick = () => { state.area = Number(b.dataset.area); state.room = 0; showAreaTransition(world[state.area].name); render(); });
}
function restBonfire() {
  state.hero.hp = maxHp(); state.hero.stamina = maxStamina(); state.estus = 3; state.poison = 0; state.defeated = {}; addLog("You rest at the bonfire. The dead remember their hatred and stand again."); sound("sfx-bonfire"); render();
}
function levelCost() { return state.hero.level * 110 + 90; }
function levelUp() {
  const cost = levelCost();
  if (state.souls < cost) { addLog("The fire rejects your poverty."); return render(); }
  state.souls -= cost; state.hero.level++; state.hero.maxHp += 8; state.hero.maxStamina += 4; state.hero.str += 1; state.hero.dex += 1; state.hero.int += 1; state.hero.hp = maxHp(); state.hero.stamina = maxStamina(); addLog("Souls knit into you. Something human comes loose."); render();
}

render();
