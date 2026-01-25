const { faker } = require("@faker-js/faker");
const { db } = require("../src/config/db");
const { logger } = require("../src/config/logger");

const LIGHT_LEVELS = ["low", "medium", "bright"];
const WATER_LEVELS = ["low", "medium", "high"];

const TAGS = [
  "indoor",
  "easy",
  "tropical",
  "air-purifying",
  "decorative",
  "succulent",
  "slow-growth",
  "fast-growth",
  "hanging",
  "floor-plant",
  "low-light",
  "beginner-friendly",
];

const PLANT_LIBRARY = [
  { commonName: "Monstera", species: "Monstera deliciosa" },
  { commonName: "Snake Plant", species: "Sansevieria trifasciata" },
  { commonName: "Pothos", species: "Epipremnum aureum" },
  { commonName: "Peace Lily", species: "Spathiphyllum" },
  { commonName: "Aloe Vera", species: "Aloe vera" },
  { commonName: "ZZ Plant", species: "Zamioculcas zamiifolia" },
  { commonName: "Fiddle Leaf Fig", species: "Ficus lyrata" },
  { commonName: "Rubber Plant", species: "Ficus elastica" },
  { commonName: "Spider Plant", species: "Chlorophytum comosum" },
  { commonName: "Calathea", species: "Calathea orbifolia" },
  { commonName: "Philodendron", species: "Philodendron hederaceum" },
  { commonName: "Dracaena", species: "Dracaena marginata" },
  { commonName: "Chinese Evergreen", species: "Aglaonema" },
  { commonName: "Boston Fern", species: "Nephrolepis exaltata" },
  { commonName: "Areca Palm", species: "Dypsis lutescens" },
  { commonName: "Parlor Palm", species: "Chamaedorea elegans" },
  { commonName: "Jade Plant", species: "Crassula ovata" },
  { commonName: "Yucca", species: "Yucca elephantipes" },
  { commonName: "Croton", species: "Codiaeum variegatum" },
  { commonName: "Ponytail Palm", species: "Beaucarnea recurvata" },
  { commonName: "String of Pearls", species: "Senecio rowleyanus" },
  { commonName: "Bird of Paradise", species: "Strelitzia reginae" },
  { commonName: "Money Tree", species: "Pachira aquatica" },
  { commonName: "Swiss Cheese Vine", species: "Monstera adansonii" },
  { commonName: "Prayer Plant", species: "Maranta leuconeura" },
  { commonName: "English Ivy", species: "Hedera helix" },
  { commonName: "Heartleaf Philodendron", species: "Philodendron hederaceum" },
  { commonName: "Dieffenbachia", species: "Dieffenbachia seguine" },
  { commonName: "Anthurium", species: "Anthurium andraeanum" },
  { commonName: "Lavender", species: "Lavandula angustifolia" },
];

const IMAGE_BY_SLUG = {
  monstera:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIl3b6sXrFIiY_FBD52_-tCRVnyBw3z2zsA2L-i01jSeXXek3zoXxxfiAh2OrDG6_RKbm3cNzS5K3YJinIlcSFoy9iGh1X6u0LG_xZ8Q&s=10",
  "snake-plant":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-oXEEB9yfqkS49mUixAzr6ZUBV16i1RWGJ8_F2QSZrnOiav5w4CERb4eQdySkBoFLeK2bi4Ujo5rOk9lvYmedgL6rSuubClPA8_vJOw&s=10",
  pothos:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCwF664W7zYPxElX_gApSWodO7S_Q2hc3cs3KQdIf9RyXFnctZ3Spz7jAlilQNUrz-7h-oNi0daSJEsjv1tt7HaUcaeVpIqwAnZ-MTLw&s=10",
  "peace-lily":
    "https://www.mydomaine.com/thmb/N3StDx3PyGbF0Pwafv-P9-qiNZU=/900x0/filters:no_upscale():strip_icc()/1566417254329_20190821-1566417255317-b9314f1d9f7a4668a466c5ffb1913a8f.jpg",
  "aloe-vera":
    "https://secretgarden.ro/cdn/shop/articles/Aloe-vera-barbadensis.jpg?v=1705472765",
  "zz-plant":
    "https://cdn.shopify.com/s/files/1/0174/7796/products/8D2A2069.jpg?v=1595400475",
  "fiddle-leaf-fig":
    "https://www.thetutuguru.com.au/wp-content/uploads/2024/07/Ficus-lyrata-Fiddle-Leaf-Fig-Tree-potted-indoors.jpg",
  "rubber-plant":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP2nO0rRm6rsbwFDhNr5Qjb11CrqNhDqV5XX9RlOn3d1kdGn5wNC-uzrKKqD4yrPULbhhEk9q5gtOhnBJ3pNUMSVa81gImztp9G1RWr02ghg&s=10",
  "spider-plant":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Nh0hMHzmNEGUsicxdKGpi9tWjAMHU40deDarduynPVqtkXnqLWjhN_Kv9AkJF73J5ucrTh6rdDFXGe34rTPRMlM7058SGRT0ZR6AdI-k&s=10",
  calathea:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUXfxKnsGTvwCCVi4izGii8T7bQBL_6cQw84rXYhDC19hbOD3RxSBUdwDFsDxQOZD8nuYtDQFxhhvB76Bs1Llg46KjGCS3gfmYgvao-Bs&s=10",
  philodendron:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxLevfhZsdjNNGsI5E3m6yyQy2N-hx05ND4z5LYPOnQR1cYE-726s8m-khJnUe6C5Mf9ulKqnzrZ7N2I1CssFBL1CFX4FLJ9M5AJBaehJG&s=10",
  dracaena:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxpVDlOSkt6cU5IeMVl3pafbvQm5-evab6o-XSzGCjno-0pKT73x0mlZZ2Py89vu7L2-hZSBYnZspKKcQ7ESLMqbEBoDLbxxrAt9frT-U7dw&s=10",
  "chinese-evergreen":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG5Vwcz94j9F0fH8Kkr66ouqTgwj1721d9pValeX_cIX5NKbOWWZoHYrjkfW2iNc9g-YyEOEH-wx1kZpz-w3ngcjn_Os1dHZPB0sfxVcubQA&s=10",
  "boston-fern":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQPp8hgRXzULG6g1EOsiDfhCgHBhnuTYsr4nZITXOwkb7y0xqI9QaeMQyR8viRqom42fenrD3Gpy6EAemRwn2rcyYHFycdOlpk3-1wgsAHLQ&s=10",
  "areca-palm": "https://plantup.ro/cdn/shop/files/areca-1.jpg?v=1696357509",
  "parlor-palm":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrlGeXOvZYAlxFj5UGhqOhfek1v6lNjOqMoATVuYYJcPtJWsU7XQolps0ReaGolfdFF3BdNCSjng6PnlRXFBqemV-ur8Sk_xMOXEeQtbhR&s=10",
  "jade-plant":
    "https://www.rollingnature.com/cdn/shop/products/PLJDCEJRGL-W-Part1.jpg?v=1669452813&width=1946",
  yucca:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ78HpyZUIbQwMxcQ330FQvqRU0ck89199JOEJ6Vzfeb0Sm_YG7LOwrzcBjy78g_ZsYMVuTkHc3GbMZyZuNjORZoSUAWK0g6aEyraARWMB7&s=10",
  croton:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREShgyukTSbF_cx5gaM0kQ3cIECDi5d-wgx5ynYiQdGVkgQX9vGkkHFltaO2TiinzwvVzVYi7ffc1XcnXoXlj7qxHOQGwCQJLQxXM9emKD&s=10",
  "ponytail-palm":
    "https://cdn.shopify.com/s/files/1/0013/3529/6118/products/Nursery-Pot-10_24a71bea-a503-4ef0-acae-29ce81f8eb86.jpg?v=1544499886",
  "string-of-pearls":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAb3FO_prZZaQK6FnUk6C9a5mp7KygqmgrmFC29A5psDmTxy-BU8wCQOVVaoAWSi7tKJCoRXR-uqQ1QEhbWovOYSA1X9cZYg-omXrDhFwcaw&s=10",
  "bird-of-paradise":
    "https://cdn.shopify.com/s/files/1/0150/6262/files/1fe6a122fd3e1c0df9ce057987db9fc0a14eb201-1200x886_1024x1024.webp?v=1728911106",
  "money-tree":
    "https://hips.hearstapps.com/hmg-prod/images/money-tree-64a82aa5f38ea.png?crop=0.5023255813953489xw:1xh;center,top&resize=1200:*",
  "swiss-cheese-vine":
    "https://media.greg.app/cGxhbnQtZGItcGhvdG9zL3N3aXNzX2NoZWVzZV92aW5lLmpwZw==?format=pjpeg&optimize=high&auto=webp&precrop=1000:1000,smart&fit=crop&width=1000&height=1000",
  "prayer-plant":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoNyvgyeKRjnbZHkLPXfjqTl6D77h_xF5XhLB8lSn-pePde47vWvY0iOk4WWbe3ygn-RzMI26ZIzzW_ADadIFY7i2p6ZYuvf9k1f6vQg&s=10",
  "english-ivy":
    "https://cdn.mos.cms.futurecdn.net/ccK7FJMkrVwocW9xM86ajD-1200-80.jpg",
  "heartleaf-philodendron":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnnoVNBROoAqb6lbpIdyLabJojbegn40W_-3Xfl3EF0keK3SfZv6kTHickKRxW1z2yT3oa1XXnpNfTTtHNH9PRpuHx1FHeyFDA0B45Ww&s=10",
  dieffenbachia:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxaraFIl2A3H-jUaXc1m_1Rkq73ssS8QUHJUDLIoKagfUAlp41ZAiiWtGEIL-pemiq6CumP_HrC12AsFmz1Ni29fnQEgaVC4oy3Rzf-7bB6A&s=10",
  anthurium:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8mHA88muXiKvjCLrrIu1Gb-_PfxKszAAh51qNiGfqvbi4Jy8CAVTEUuHJ-uHy3Diif7NcPAYDrXfHCI0atbqwM9k19UOuNZcn9mzpCh7tBQ&s=10",
  lavender:
    "https://cloversgarden.com/cdn/shop/products/CGHidcoteLavenderPrimary_1000x1000.jpg?v=1679602241",
};

function pickSomeUnique(arr, min = 1, max = 3) {
  const target = faker.number.int({ min, max });
  const out = new Set();
  let guard = 0;
  while (out.size < target && guard < 60) {
    out.add(faker.helpers.arrayElement(arr));
    guard++;
  }
  return Array.from(out);
}

function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeDescription(commonName, light, water) {
  const lightText =
    light === "low"
      ? "low light"
      : light === "medium"
        ? "medium light"
        : "bright indirect light";
  const waterText =
    water === "low"
      ? "infrequent watering"
      : water === "medium"
        ? "moderate watering"
        : "more frequent watering";

  const patterns = [
    () =>
      `${commonName} is a popular indoor plant that thrives in ${lightText} and prefers ${waterText}.`,
    () =>
      `A great choice for home interiors, ${commonName} does best in ${lightText} with ${waterText}.`,
    () =>
      `${commonName} is easy to style in any room. Keep it in ${lightText} and follow ${waterText} for best results.`,
  ];

  return faker.helpers.arrayElement(patterns)();
}

function derivePetSafe(commonName) {
  const safe = new Set([
    "Spider Plant",
    "Areca Palm",
    "Parlor Palm",
    "Boston Fern",
    "Calathea",
    "Prayer Plant",
  ]);
  const unsafe = new Set([
    "Peace Lily",
    "Pothos",
    "Monstera",
    "Snake Plant",
    "ZZ Plant",
    "Rubber Plant",
    "Croton",
    "Yucca",
    "Fiddle Leaf Fig",
  ]);
  if (safe.has(commonName)) return true;
  if (unsafe.has(commonName)) return false;
  return faker.datatype.boolean();
}

function makeTemplate(libraryItem, idx, usedSlugs) {
  const light = faker.helpers.arrayElement(LIGHT_LEVELS);
  const water = faker.helpers.arrayElement(WATER_LEVELS);

  let slug = slugify(libraryItem.commonName);
  if (usedSlugs.has(slug)) slug = `${slug}-${idx + 1}`;
  usedSlugs.add(slug);

  const tags = pickSomeUnique(TAGS, 2, 4);
  if (light === "low" && !tags.includes("low-light")) tags.push("low-light");
  if (!tags.includes("indoor")) tags.push("indoor");

  return {
    templateId: `tpl_${slug}`,
    slug,
    commonName: libraryItem.commonName,
    species: libraryItem.species,
    description: makeDescription(libraryItem.commonName, light, water),
    tags,
    light,
    water,
    petSafe: derivePetSafe(libraryItem.commonName),
    imageUrl:
      IMAGE_BY_SLUG[slug] ||
      faker.image.urlPicsumPhotos({ width: 800, height: 800 }),
  };
}

async function seedPlants(count = 30) {
  const usedSlugs = new Set();
  const n = Math.max(30, Number(count) || 30);

  let batch = db.batch();
  let ops = 0;

  for (let i = 0; i < n; i++) {
    const item = PLANT_LIBRARY[i % PLANT_LIBRARY.length];
    const doc = makeTemplate(item, i, usedSlugs);

    const ref = db.collection("plantCatalog").doc(doc.templateId);
    batch.set(ref, { id: doc.templateId, ...doc }, { merge: true });

    ops++;

    if (ops === 450) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) await batch.commit();

  logger.info(`✅ Plant templates seeded (upserted: ${n})`);
  return n;
}

module.exports = seedPlants;
