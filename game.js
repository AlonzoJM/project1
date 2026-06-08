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
  app.innerHTML = `<section class="screen game-layout">${sidePanel()}<section class="panel main-panel">${inCombat ? combatPanel() : roomPanel(area, room)}</section>${rightPanel()}</section>`;
  bindGameButtons();
}

function sidePanel() {
  const h = state.hero;
  return `<aside class="panel"><h2>${state.className}</h2><div class="stat-row"><span>Soul Level</span><b>${h.level}</b></div><div class="stat-row"><span>Souls carried</span><b class="gold">${state.souls}</b></div><div class="stat-row"><span>Lost souls</span><b class="blood">${state.droppedSouls ? state.droppedSouls.amount : 0}</b></div><p>HP ${h.hp}/${maxHp()}</p><div class="bar"><span class="hp" style="width:${(h.hp / maxHp()) * 100}%"></span></div><p>Stamina ${h.stamina}/${maxStamina()} · ${dodgeSpeed()} roll</p><div class="bar"><span class="stamina" style="width:${(h.stamina / maxStamina()) * 100}%"></span></div>${state.poison ? `<p>Poison ${state.poison}</p><div class="bar"><span class="poison" style="width:${state.poison}%"></span></div>` : ""}<div class="stat-row"><span>STR</span><b>${stat("str")}</b></div><div class="stat-row"><span>DEX</span><b>${stat("dex")}</b></div><div class="stat-row"><span>INT</span><b>${stat("int")}</b></div><h3>Equipment</h3><div class="equip-row"><span>Weapon</span><b>${state.inventory.find((n) => items[n].type === "weapon")}</b></div><div class="equip-row"><span>Armor</span><b>${state.inventory.find((n) => items[n].type === "armor")}</b></div><div class="equip-row"><span>Rings</span><b>${rings().join(", ") || "None"}</b></div><button id="rest">Rest at bonfire</button><button id="level">Level up (${levelCost()} souls)</button></aside>`;
}

function roomPanel(area, room) {
  const cleared = state.defeated[`${state.area}-${state.room}`];
  return `<div class="room-art"><div><div class="portrait">${area.icon}</div><h1 class="room-title">${room.name}</h1><p>${room.text}</p></div></div><p class="muted">${area.name}: ${area.text}</p>${state.droppedSouls && state.droppedSouls.area === state.area && state.droppedSouls.room === state.room ? `<button id="retrieve">Retrieve ${state.droppedSouls.amount} dropped souls</button>` : ""}${!cleared ? `<div class="panel enemy-box"><h2>${room.enemy}</h2><p class="telegraph">${enemyBook[room.enemy].attacks[0]}</p><button id="engage">Engage</button></div>` : `<p class="gold">The room is still. That is worse than safe.</p>`}${cleared && room.secret && !state.secrets[`${state.area}-${state.room}`] ? `<button id="secret">Search hidden path</button>` : ""}${cleared && room.npc ? `<button id="npc">Speak with ${room.npc}</button>` : ""}<div class="travel-grid"><button id="prev" ${state.room === 0 ? "disabled" : ""}>Previous room</button><button id="next">${state.room === area.rooms.length - 1 ? "Approach boss fog" : "Next room"}</button><button id="areas">Travel crossroads</button></div>`;
}

function combatPanel() {
  const c = state.combat;
  return `<div class="room-art"><div><div class="portrait">${c.icon}</div><h1 class="room-title">${c.name}</h1><p class="telegraph">${c.telegraph}</p></div></div><p>Enemy HP ${c.hp}/${c.maxHp}</p><div class="bar"><span class="hp" style="width:${(c.hp / c.maxHp) * 100}%"></span></div><div class="action-grid"><button data-action="attack">Attack</button><button data-action="heavy">Heavy Attack</button><button data-action="dodge">Dodge</button><button data-action="block">Block</button><button data-action="item">Use Item</button><button data-action="flee">Flee</button><button data-action="knife" ${state.knives <= 0 ? "disabled" : ""}>Throw Knife (${state.knives})</button><button data-action="moss" ${state.moss <= 0 ? "disabled" : ""}>Poison Moss (${state.moss})</button></div>`;
}

function rightPanel() {
  return `<aside class="panel"><h2>Chronicle</h2><div class="log">${state.log.map((l) => `<p>${l}</p>`).join("")}</div><h2>Journal</h2><div class="journal-list">${state.journal.map((j) => `<div class="item-lore"><b class="gold">${j.kind}: ${j.title}</b><p>${j.text}</p></div>`).join("")}</div></aside>`;
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
  app.innerHTML = `<section class="screen boss-reveal"><div class="panel"><div class="sigil">${b.icon}</div><p class="muted">${b.lore}</p><h1>${b.name}</h1><button id="boss">Traverse the fog</button></div></section>`;
  $("#boss").onclick = () => { state.screen = "game"; startCombat(true); };
}
function crossroads() {
  app.innerHTML = `<section class="screen"><div class="panel"><h1>The Cursed Crossroads</h1><p class="muted">No path leaves the kingdom. Some merely delay the grave.</p><div class="area-grid">${world.map((a, i) => `<article class="card"><h3>${a.icon} ${a.name}</h3><p>${a.text}</p><button data-area="${i}">Travel</button></article>`).join("")}</div></div></section>`;
  document.querySelectorAll("[data-area]").forEach((b) => b.onclick = () => { state.area = Number(b.dataset.area); state.room = 0; render(); });
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
