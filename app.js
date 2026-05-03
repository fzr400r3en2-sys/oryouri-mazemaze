const screens = {
  title: document.querySelector('[data-screen="title"]'),
  pick: document.querySelector('[data-screen="pick"]'),
  mix: document.querySelector('[data-screen="mix"]'),
  finish: document.querySelector('[data-screen="finish"]'),
};

const recipeChoices = document.querySelector("#recipeChoices");
const startButton = document.querySelector("#startButton");
const ingredientGrid = document.querySelector("#ingredientGrid");
const pickBowl = document.querySelector("#pickBowl");
const pickBowlItems = document.querySelector("#pickBowlItems");
const pickBowlEffects = document.querySelector("#pickBowlEffects");
const toMixButton = document.querySelector("#toMixButton");
const pickRecipeName = document.querySelector("#pickRecipeName");
const pickRecipeMark = document.querySelector("#pickRecipeMark");
const mixRecipeName = document.querySelector("#mixRecipeName");
const mixRecipeMark = document.querySelector("#mixRecipeMark");
const mixBowl = document.querySelector("#mixBowl");
const mixture = document.querySelector("#mixture");
const mixSwirl = document.querySelector("#mixSwirl");
const mixSpoon = document.querySelector("#mixSpoon");
const mixDots = document.querySelector("#mixDots");
const mixButton = document.querySelector("#mixButton");
const finishRecipeName = document.querySelector("#finishRecipeName");
const finishBurst = document.querySelector("#finishBurst");
const resultPlate = document.querySelector("#resultPlate");
const againButton = document.querySelector("#againButton");
const otherButton = document.querySelector("#otherButton");
const installGuide = document.querySelector("#installGuide");
const installGuideClose = document.querySelector("#installGuideClose");
const installGuideAction = document.querySelector("#installGuideAction");
const installGuideTitle = document.querySelector("#install-guide-title");
const installGuideBody = document.querySelector("#installGuideBody");
const appAssetBase = new URL(".", document.currentScript?.src || window.location.href);

const recipeList = [
  {
    id: "pancake",
    label: "ぱんけーき",
    color: "#e9b55e",
    icon: "pancake",
    resultClass: "pancake-stack",
    resultImage: "assets/images/dishes/pancake.svg",
    ingredients: [
      item("flour", "こな", "#fff5d7", "bag"),
      item("egg", "たまご", "#ffd568", "egg"),
      item("milk", "みるく", "#e9f7ff", "milk"),
      item("banana", "ばなな", "#f7d95e", "banana"),
      item("berry", "いちご", "#eb6f82", "berry"),
      item("butter", "ばたー", "#ffe179", "cube"),
    ],
  },
  {
    id: "curry",
    label: "かれー",
    color: "#d69042",
    icon: "curry",
    resultClass: "curry-rice",
    resultImage: "assets/images/dishes/curry.svg",
    ingredients: [
      item("rice", "ごはん", "#fff8e8", "rice"),
      item("carrot", "にんじん", "#f28b4b", "carrot"),
      item("potato", "いも", "#e2c77b", "potato"),
      item("onion", "たまねぎ", "#f5dfb4", "onion"),
      item("apple", "りんご", "#ef6570", "apple"),
      item("corn", "こーん", "#ffd65d", "corn"),
    ],
  },
  {
    id: "juice",
    label: "じゅーす",
    color: "#e98784",
    icon: "juice",
    resultClass: "juice-cup",
    resultImage: "assets/images/dishes/juice.svg",
    ingredients: [
      item("apple", "りんご", "#ef6570", "apple"),
      item("orange", "みかん", "#f4a24e", "orange"),
      item("berry", "いちご", "#d95f8f", "berry"),
      item("banana", "ばなな", "#f7d95e", "banana"),
      item("milk", "みるく", "#e9f7ff", "milk"),
      item("mint", "はっぱ", "#75bf8d", "leaf"),
    ],
  },
  {
    id: "pudding",
    label: "ぷりん",
    color: "#f2c96d",
    icon: "pudding",
    resultClass: "pudding-cup",
    resultImage: "assets/images/dishes/pudding.svg",
    ingredients: [
      item("egg", "たまご", "#ffd568", "egg"),
      item("milk", "みるく", "#e9f7ff", "milk"),
      item("sugar", "さとう", "#fff6df", "sugar"),
      item("vanilla", "ばにら", "#f7d887", "vanilla"),
      item("butter", "ばたー", "#ffe179", "cube"),
      item("berry", "いちご", "#eb6f82", "berry"),
    ],
  },
  {
    id: "jelly",
    label: "ぜりー",
    color: "#d95f8f",
    icon: "jelly",
    resultClass: "jelly-cup",
    resultImage: "assets/images/dishes/jelly.svg",
    ingredients: [
      item("berry", "いちご", "#d95f8f", "berry"),
      item("grape", "ぶどう", "#8d6ccf", "grape"),
      item("orange", "みかん", "#f4a24e", "orange"),
      item("apple", "りんご", "#ef6570", "apple"),
      item("juice", "じゅーす", "#f39ac0", "juice"),
      item("sugar", "さとう", "#fff6df", "sugar"),
    ],
  },
  {
    id: "icecream",
    label: "あいす",
    color: "#f6d7c7",
    icon: "icecream",
    resultClass: "icecream-cup",
    resultImage: "assets/images/dishes/icecream.svg",
    ingredients: [
      item("milk", "みるく", "#e9f7ff", "milk"),
      item("berry", "いちご", "#d95f8f", "berry"),
      item("banana", "ばなな", "#f7d95e", "banana"),
      item("grape", "ぶどう", "#8d6ccf", "grape"),
      item("chocolate", "ちょこ", "#8b5534", "chocolate"),
      item("vanilla", "ばにら", "#f7d887", "vanilla"),
    ],
  },
];

const recipes = Object.fromEntries(recipeList.map((recipe) => [recipe.id, recipe]));

const state = {
  recipeId: "pancake",
  selected: [],
  mixCount: 0,
  requiredIngredients: 3,
  visibleIngredientLimit: 12,
  requiredMixes: 8,
  isPointerMixing: false,
  lastPointer: null,
  lastMixAt: 0,
};

function item(id, name, color, icon) {
  return { id, name, color, icon };
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle("is-active", key === name);
  });
}

function currentRecipe() {
  return recipes[state.recipeId];
}

function renderRecipeChoices() {
  recipeChoices.innerHTML = recipeList
    .map(
      (recipe) => `
        <button class="recipe-choice ${recipe.id === state.recipeId ? "is-selected" : ""}" type="button" data-recipe="${recipe.id}" aria-pressed="${recipe.id === state.recipeId}">
          ${recipeIcon(recipe.icon, recipe.color)}
          <span>${recipe.label}</span>
        </button>
      `,
    )
    .join("");

  recipeChoices.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.recipeId = button.dataset.recipe;
      renderRecipeChoices();
    });
  });
}

function startPicking(recipeId = state.recipeId) {
  state.recipeId = recipeId;
  state.selected = [];
  state.mixCount = 0;
  const recipe = currentRecipe();

  pickRecipeName.textContent = recipe.label;
  pickRecipeMark.innerHTML = recipeIcon(recipe.icon, recipe.color);
  pickBowl.dataset.recipe = recipe.id;
  ingredientGrid.innerHTML = recipe.ingredients
    .map(
      (ingredient) => `
        <button class="ingredient-card" type="button" data-ingredient="${ingredient.id}">
          ${ingredientIcon(ingredient.icon, ingredient.color)}
          <span>${ingredient.name}</span>
        </button>
      `,
    )
    .join("");

  ingredientGrid.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => chooseIngredient(button));
  });

  renderPickBowl();
  toMixButton.classList.remove("is-ready");
  screens.pick.classList.remove("has-picked", "has-ready");
  showScreen("pick");
}

function chooseIngredient(button) {
  const recipe = currentRecipe();
  const ingredient = recipe.ingredients.find((entry) => entry.id === button.dataset.ingredient);

  button.classList.remove("pop");
  void button.offsetWidth;
  button.classList.add("pop");

  state.selected.push({
    ...ingredient,
    key: `${ingredient.id}-${Date.now()}-${state.selected.length}`,
  });
  flyIngredient(button, ingredient);
  renderPickBowl();
  splashBowl(ingredient.color);

  bump(pickBowl);

  if (state.selected.length >= state.requiredIngredients) {
    toMixButton.classList.add("is-ready");
  }
}

function renderPickBowl() {
  const visibleIngredients = state.selected.slice(-state.visibleIngredientLimit);
  const hiddenCount = Math.max(0, state.selected.length - visibleIngredients.length);
  const bedColor = blendColors(state.selected.map((ingredient) => ingredient.color), currentRecipe().color, 0.5);
  const bedOpacity = Math.min(0.72, Math.max(0, (state.selected.length - 4) * 0.08));

  const bed =
    state.selected.length > 5
      ? `<span class="ingredient-mix-bed" style="--bed-color:${bedColor}; --bed-opacity:${bedOpacity}; --bed-scale:${Math.min(1, state.selected.length / 12).toFixed(2)};"></span>`
      : "";

  pickBowlItems.innerHTML = bed + visibleIngredients
    .map((ingredient, index) => {
      const [left, top] = bowlPiecePosition(index, visibleIngredients.length);
      return ingredientPiece(ingredient, left, top, index, visibleIngredients.length, hiddenCount + index);
    })
    .join("");

  screens.pick.classList.toggle("has-picked", state.selected.length > 0);
  screens.pick.classList.toggle("has-ready", state.selected.length >= state.requiredIngredients);
}

function startMixing() {
  document.querySelectorAll(".fly-ingredient").forEach((element) => element.remove());

  if (state.selected.length === 0) {
    const first = currentRecipe().ingredients[0];
    state.selected.push({ ...first, key: `${first.id}-starter` });
  }

  state.mixCount = 0;
  const recipe = currentRecipe();
  mixRecipeName.textContent = recipe.label;
  mixRecipeMark.innerHTML = recipeIcon(recipe.icon, recipe.color);
  mixBowl.dataset.recipe = recipe.id;
  renderMix();
  showScreen("mix");
}

function addMix() {
  if (state.mixCount >= state.requiredMixes) {
    return;
  }

  state.mixCount += 1;
  renderMix();
  bump(mixBowl);
  makeMixRipple();

  if (state.mixCount >= state.requiredMixes) {
    window.setTimeout(showFinish, 640);
  }
}

function renderMix() {
  const recipe = currentRecipe();
  const progress = Math.min(1, state.mixCount / state.requiredMixes);
  const color = blendColors(state.selected.map((ingredient) => ingredient.color), recipe.color, progress);
  mixture.className = `mixture mix-${recipe.id}`;
  mixture.style.setProperty("--mix-color", color);
  mixture.style.setProperty("--mix-scale", 0.68 + progress * 0.24);
  mixture.style.setProperty("--mix-progress", progress.toFixed(2));
  mixture.innerHTML = createMixContents(recipe, progress);
  mixSwirl.style.setProperty("--swirl-rotation", `${state.mixCount * 74}deg`);
  mixSpoon.style.setProperty("--spoon-rotation", `${-30 + (state.mixCount % 4) * 18}deg`);
  mixBowl.classList.toggle("is-started", state.mixCount > 0);
  screens.mix.classList.toggle("has-mixed", state.mixCount > 0);

  mixDots.innerHTML = Array.from({ length: state.requiredMixes }, (_, index) => {
    return `<span class="mix-dot ${index < state.mixCount ? "is-on" : ""}"></span>`;
  }).join("");
}

function showFinish() {
  const recipe = currentRecipe();
  finishRecipeName.textContent = recipe.label;
  resultPlate.dataset.recipe = recipe.id;
  renderResult(recipe);
  clearTransientCookingLayers();
  makeBurst();
  showScreen("finish");
}

function renderResult(recipe) {
  resultPlate.classList.toggle("has-dish-image", Boolean(recipe.resultImage));

  if (!recipe.resultImage) {
    resultPlate.innerHTML = createFallbackResult(recipe);
    return;
  }

  const imagePath = resolveAssetPath(recipe.resultImage);
  resultPlate.innerHTML = `
    <img class="result-dish-image" src="${imagePath}" alt="${recipe.label}のできあがり" />
  `;

  resultPlate.querySelector(".result-dish-image").addEventListener(
    "error",
    () => {
      if (resultPlate.dataset.recipe === recipe.id) {
        resultPlate.classList.remove("has-dish-image");
        resultPlate.innerHTML = createFallbackResult(recipe);
      }
    },
    { once: true },
  );
}

function resolveAssetPath(path) {
  return new URL(path, appAssetBase).href;
}

function createFallbackResult(recipe) {
  const selectedColors = state.selected.map((ingredient) => ingredient.color);
  const color =
    recipe.id === "curry"
      ? blendColors(
          state.selected
            .filter((ingredient) => ingredient.icon !== "rice")
            .map((ingredient) => ingredient.color),
          "#b86b32",
          0.35,
        )
      : blendColors(selectedColors, recipe.color, 0.82);

  if (recipe.id === "pancake") {
    const fruitDecor = state.selected.some((ingredient) => ["berry", "banana", "apple"].includes(ingredient.icon))
      ? `<span class="pancake-fruit fruit-berry"></span><span class="pancake-fruit fruit-banana"></span>`
      : `<span class="pancake-fruit fruit-butter-dot"></span>`;
    return `
      <div class="plate-base"></div>
      <div class="result-food pancake-result" style="--food-color:${color};">
        <span class="pancake-layer layer-bottom"></span>
        <span class="pancake-layer layer-middle"></span>
        <span class="pancake-layer layer-top"></span>
        <span class="pancake-syrup"></span>
        <span class="pancake-syrup-drip drip-one"></span>
        <span class="pancake-syrup-drip drip-two"></span>
        <span class="pancake-butter"></span>
        <span class="pancake-toast-mark one"></span>
        <span class="pancake-toast-mark two"></span>
        ${fruitDecor}
      </div>
    `;
  }

  if (recipe.id === "curry") {
    return `
      <div class="plate-base"></div>
      <div class="result-food curry-result" style="--food-color:${color};">
        <span class="curry-rice-mound"></span>
        <span class="curry-sauce"></span>
        <span class="curry-sauce-gloss"></span>
        <span class="curry-veg veg-carrot one"></span>
        <span class="curry-veg veg-potato two"></span>
        <span class="curry-veg veg-green three"></span>
        <span class="curry-veg veg-corn four"></span>
        <span class="rice-grain one"></span>
        <span class="rice-grain two"></span>
        <span class="rice-grain three"></span>
        <span class="rice-grain four"></span>
      </div>
    `;
  }

  if (recipe.id === "pudding") {
    return `
      <div class="plate-base"></div>
      <div class="result-food pudding-result" style="--food-color:${color};">
        <span class="pudding-foot"></span>
        <span class="pudding-body"></span>
        <span class="pudding-caramel"></span>
        <span class="pudding-caramel-drip one"></span>
        <span class="pudding-caramel-drip two"></span>
        <span class="pudding-shine"></span>
      </div>
    `;
  }

  if (recipe.id === "jelly") {
    return `
      <div class="plate-base jelly-plate-base"></div>
      <div class="result-food jelly-result" style="--food-color:${color};">
        <span class="jelly-mold"></span>
        <span class="jelly-ridge one"></span>
        <span class="jelly-ridge two"></span>
        <span class="jelly-ridge three"></span>
        <span class="jelly-top"></span>
        <span class="jelly-shine"></span>
        <span class="jelly-fruit one"></span>
        <span class="jelly-fruit two"></span>
        <span class="jelly-fruit three"></span>
      </div>
    `;
  }

  if (recipe.id === "icecream") {
    const hasChocolate = state.selected.some((ingredient) => ingredient.icon === "chocolate");
    const sauce = hasChocolate ? `<span class="icecream-sauce"></span>` : `<span class="icecream-sprinkles"></span>`;
    return `
      <div class="glass-shadow"></div>
      <div class="result-food icecream-result" style="--food-color:${color};">
        <span class="icecream-cup-rim"></span>
        <span class="icecream-cup-base"></span>
        <span class="icecream-cup-lines"></span>
        <span class="icecream-scoop back"></span>
        <span class="icecream-scoop main"></span>
        <span class="icecream-scoop small"></span>
        <span class="icecream-drip one"></span>
        <span class="icecream-drip two"></span>
        <span class="icecream-shine"></span>
        ${sauce}
        <span class="icecream-cherry"></span>
      </div>
    `;
  }

  return `
    <div class="glass-shadow"></div>
    <div class="result-food juice-result" style="--food-color:${color};">
      <span class="juice-fill"></span>
      <span class="juice-rim"></span>
      <span class="juice-ice one"></span>
      <span class="juice-ice two"></span>
      <span class="juice-pulp one"></span>
      <span class="juice-pulp two"></span>
      <span class="juice-shine"></span>
      <span class="juice-bubble one"></span>
      <span class="juice-bubble two"></span>
      <span class="juice-bubble three"></span>
      <span class="juice-straw"></span>
      <span class="juice-fruit-wedge"></span>
    </div>
  `;
}

function makeBurst() {
  const colors = ["#f7d86b", "#8ed4b2", "#8ecae6", "#e98a9c", "#f3a557"];
  finishBurst.innerHTML = Array.from({ length: 18 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 18;
    const distance = 132 + (index % 5) * 16 + randomBetween(-10, 18);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 38;
    return `
      <span class="burst-piece" style="
        --piece-color:${colors[index % colors.length]};
        --dx:${dx}px;
        --dy:${dy}px;
        --turn:${120 + index * 23}deg;
        animation-delay:${index * 24}ms;
      "></span>
    `;
  }).join("");
}

function bump(element) {
  element.classList.remove("bump");
  void element.offsetWidth;
  element.classList.add("bump");
}

function ingredientPiece(ingredient, left, top, index, visibleCount, totalIndex) {
  const rotation = [-15, 9, 17, -8, 6, -4, 13, -11][index % 8];
  const scale = visibleCount <= 5 ? 0.92 : visibleCount <= 8 ? 0.72 : 0.58;
  return `
    <span class="ingredient-piece piece-${ingredient.icon}" style="left:${left}%; top:${top}%; --piece-color:${ingredient.color}; --piece-rotate:${rotation}deg; --piece-scale:${scale}; z-index:${3 + totalIndex};">
      ${ingredientIcon(ingredient.icon, ingredient.color)}
    </span>
  `;
}

function bowlPiecePosition(index, count) {
  const presets = [
    [42, 48],
    [27, 43],
    [58, 40],
    [34, 60],
    [64, 58],
  ];

  if (count <= presets.length) {
    return presets[index];
  }

  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count + (index % 2) * 0.18;
  const layer = index % 3;
  const radiusX = count <= 8 ? 24 + layer * 3 : 22 + layer * 4;
  const radiusY = count <= 8 ? 12 + layer * 2 : 11 + layer * 2;
  const left = 50 + Math.cos(angle) * radiusX;
  const top = 52 + Math.sin(angle) * radiusY;
  return [Math.round(left), Math.round(top)];
}

function createMixContents(recipe, progress) {
  const ingredients = state.selected;
  const selectedColors = ingredients.map((ingredient) => ingredient.color);
  const early = Math.max(0, 1 - progress * 1.45);
  const late = Math.min(1, progress * 1.25);

  if (recipe.id === "pancake") {
    return `
      <span class="batter-base"></span>
      <span class="batter-ribbon milk" style="--ribbon-opacity:${(0.72 * early).toFixed(2)};"></span>
      <span class="batter-ribbon egg" style="--ribbon-opacity:${(0.84 * early).toFixed(2)};"></span>
      <span class="batter-powder one" style="--powder-opacity:${(0.72 * early).toFixed(2)};"></span>
      <span class="batter-powder two" style="--powder-opacity:${(0.58 * early).toFixed(2)};"></span>
      <span class="batter-lump one" style="--lump-opacity:${(0.62 * early).toFixed(2)};"></span>
      <span class="batter-lump two" style="--lump-opacity:${(0.5 * early).toFixed(2)};"></span>
      <span class="batter-fold one" style="--fold-opacity:${(0.18 + late * 0.22).toFixed(2)};"></span>
      <span class="batter-fold two" style="--fold-opacity:${(0.14 + late * 0.2).toFixed(2)};"></span>
      <span class="batter-whisk-line"></span>
      <span class="batter-bubble one"></span>
      <span class="batter-bubble two"></span>
      <span class="batter-smooth-shine" style="--shine-opacity:${(0.22 + late * 0.24).toFixed(2)};"></span>
    `;
  }

  if (recipe.id === "curry") {
    const chunks = ingredients
      .filter((ingredient) => ingredient.icon !== "rice")
      .slice(0, 8)
      .map((ingredient, index) => {
        const kind = curryChunkKind(ingredient.icon);
        return `<span class="stew-chunk ${kind} pos-${index + 1}" style="--chunk-opacity:${(0.78 - progress * 0.28).toFixed(2)}; --chunk-sink:${Math.round(progress * 10)}px;"></span>`;
      });
    return `
      <span class="stew-base"></span>
      <span class="stew-gloss"></span>
      <span class="stew-oil one"></span>
      <span class="stew-oil two"></span>
      <span class="stew-spice-specks"></span>
      <span class="stew-thick-wave one" style="--wave-opacity:${(0.18 + late * 0.24).toFixed(2)};"></span>
      <span class="stew-thick-wave two" style="--wave-opacity:${(0.12 + late * 0.2).toFixed(2)};"></span>
      ${chunks.join("")}
      <span class="stew-simmer one" style="--simmer-opacity:${(0.1 + progress * 0.22).toFixed(2)};"></span>
      <span class="stew-simmer two" style="--simmer-opacity:${(0.08 + progress * 0.18).toFixed(2)};"></span>
    `;
  }

  if (recipe.id === "pudding") {
    return `
      <span class="custard-base"></span>
      <span class="custard-milk" style="--custard-opacity:${(0.62 * early).toFixed(2)};"></span>
      <span class="custard-egg" style="--custard-opacity:${(0.72 * early).toFixed(2)};"></span>
      <span class="custard-caramel-ribbon" style="--caramel-opacity:${(0.2 + late * 0.28).toFixed(2)};"></span>
      <span class="custard-sugar-specks" style="--speck-opacity:${(0.58 * early).toFixed(2)};"></span>
      <span class="custard-vanilla-specks" style="--speck-opacity:${(0.2 + late * 0.42).toFixed(2)};"></span>
      <span class="custard-fold one" style="--fold-opacity:${(0.16 + late * 0.22).toFixed(2)};"></span>
      <span class="custard-fold two" style="--fold-opacity:${(0.1 + late * 0.18).toFixed(2)};"></span>
      <span class="custard-whisk-line"></span>
      <span class="custard-shine" style="--shine-opacity:${(0.22 + late * 0.28).toFixed(2)};"></span>
    `;
  }

  if (recipe.id === "jelly") {
    const jellyBands = selectedColors.slice(0, 4).map((color, index) => {
      const opacity = Math.max(0.18, 0.52 - progress * 0.22 - index * 0.04);
      return `<span class="jelly-tint band-${index + 1}" style="--jelly-tint:${color}; --jelly-opacity:${opacity.toFixed(2)};"></span>`;
    });
    const jellyBits = ingredients
      .filter((ingredient) => !["juice", "sugar"].includes(ingredient.icon))
      .slice(0, 5)
      .map((ingredient, index) => {
        const opacity = Math.max(0.3, 0.72 - progress * 0.2);
        return `<span class="jelly-fruit-bit ${jellyBitKind(ingredient.icon)} pos-${index + 1}" style="--bit-color:${ingredient.color}; --bit-opacity:${opacity.toFixed(2)};"></span>`;
      });
    return `
      <span class="jelly-liquid-base"></span>
      ${jellyBands.join("")}
      ${jellyBits.join("")}
      <span class="jelly-gel-ring"></span>
      <span class="jelly-set-wave one" style="--jelly-wave-opacity:${(0.18 + late * 0.28).toFixed(2)};"></span>
      <span class="jelly-set-wave two" style="--jelly-wave-opacity:${(0.14 + late * 0.22).toFixed(2)};"></span>
      <span class="jelly-sparkle"></span>
      <span class="jelly-gloss-line"></span>
    `;
  }

  if (recipe.id === "icecream") {
    const flavorStreaks = selectedColors.slice(0, 4).map((color, index) => {
      const opacity = Math.max(0.16, 0.54 - progress * 0.24 - index * 0.05);
      return `<span class="icecream-flavor-streak streak-${index + 1}" style="--streak-color:${color}; --streak-opacity:${opacity.toFixed(2)};"></span>`;
    });
    return `
      <span class="icecream-cream-base"></span>
      ${flavorStreaks.join("")}
      <span class="icecream-soft-peak one"></span>
      <span class="icecream-soft-peak two"></span>
      <span class="icecream-cream-fold one" style="--cream-fold-opacity:${(0.2 + late * 0.24).toFixed(2)};"></span>
      <span class="icecream-cream-fold two" style="--cream-fold-opacity:${(0.16 + late * 0.2).toFixed(2)};"></span>
      <span class="icecream-cold-crystal one"></span>
      <span class="icecream-cold-crystal two"></span>
      <span class="icecream-frost-line"></span>
    `;
  }

  const juiceBands = selectedColors.slice(0, 5).map((color, index) => {
    const opacity = Math.max(0.14, 0.68 - progress * 0.48 - index * 0.06);
    return `<span class="juice-color-band band-${index + 1}" style="--band-color:${color}; --band-opacity:${opacity.toFixed(2)};"></span>`;
  });
  const juicePulp = ingredients.slice(0, 6).map((ingredient, index) => {
    const opacity = Math.max(0.26, 0.68 - progress * 0.22);
    return `<span class="juice-pulp-bit ${juicePulpKind(ingredient.icon)} pulp-${index + 1}" style="--pulp-color:${ingredient.color}; --pulp-opacity:${opacity.toFixed(2)};"></span>`;
  });

  return `
    <span class="juice-liquid-base"></span>
    ${juiceBands.join("")}
    ${juicePulp.join("")}
    <span class="juice-whirl one" style="--whirl-opacity:${(0.22 + late * 0.3).toFixed(2)};"></span>
    <span class="juice-whirl two" style="--whirl-opacity:${(0.16 + late * 0.24).toFixed(2)};"></span>
    <span class="juice-foam-line" style="--foam-opacity:${(0.28 + progress * 0.34).toFixed(2)};"></span>
    <span class="juice-splash-arc"></span>
    <span class="juice-liquid-shine"></span>
  `;
}

function curryChunkKind(icon) {
  if (icon === "carrot" || icon === "apple") {
    return "chunk-orange";
  }
  if (icon === "potato" || icon === "onion") {
    return "chunk-potato";
  }
  if (icon === "rice") {
    return "chunk-rice";
  }
  if (icon === "corn") {
    return "chunk-corn";
  }
  return "chunk-green";
}

function jellyBitKind(icon) {
  if (icon === "orange") {
    return "bit-citrus";
  }
  if (icon === "grape") {
    return "bit-grape";
  }
  if (icon === "apple") {
    return "bit-apple";
  }
  return "bit-berry";
}

function juicePulpKind(icon) {
  if (icon === "mint" || icon === "leaf") {
    return "pulp-leaf";
  }
  if (icon === "banana") {
    return "pulp-banana";
  }
  if (icon === "orange") {
    return "pulp-citrus";
  }
  return "pulp-round";
}

function clearTransientCookingLayers() {
  pickBowlItems.innerHTML = "";
  pickBowlEffects.innerHTML = "";
  mixture.innerHTML = "";
  document.querySelectorAll(".fly-ingredient, .mix-ripple").forEach((element) => element.remove());
}

function flyIngredient(button, ingredient) {
  const cardRect = button.getBoundingClientRect();
  const bowlRect = pickBowl.getBoundingClientRect();
  const size = Math.min(96, Math.max(72, cardRect.width * 0.46));
  const startX = cardRect.left + cardRect.width / 2 - size / 2;
  const startY = cardRect.top + cardRect.height / 2 - size / 2;
  const endX = bowlRect.left + bowlRect.width / 2 - size / 2;
  const endY = bowlRect.top + bowlRect.height * 0.44 - size / 2;
  const flyer = document.createElement("div");

  flyer.className = "fly-ingredient";
  flyer.innerHTML = ingredientIcon(ingredient.icon, ingredient.color);
  flyer.style.setProperty("--start-x", `${startX}px`);
  flyer.style.setProperty("--start-y", `${startY}px`);
  flyer.style.setProperty("--fly-x", `${endX - startX}px`);
  flyer.style.setProperty("--fly-y", `${endY - startY}px`);
  document.body.append(flyer);
  window.setTimeout(() => flyer.remove(), 650);
}

function splashBowl(color) {
  pickBowlEffects.innerHTML = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 6 + 0.3;
    const distance = 38 + (index % 3) * 12;
    return `
      <span class="bowl-spark" style="
        --spark-color:${color};
        --spark-x:${Math.cos(angle) * distance}px;
        --spark-y:${Math.sin(angle) * distance - 12}px;
        animation-delay:${index * 22}ms;
      "></span>
    `;
  }).join("");
}

function makeMixRipple() {
  const ripple = document.createElement("span");
  ripple.className = `mix-ripple ripple-${currentRecipe().id}`;
  ripple.style.setProperty("--ripple-rotation", `${state.mixCount * 31}deg`);
  mixBowl.append(ripple);
  window.setTimeout(() => ripple.remove(), 620);
}

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function blendColors(colors, fallback, recipeWeight = 0.7) {
  const source = colors.length ? colors : [fallback];
  const totals = source.reduce(
    (memo, color) => {
      const rgb = hexToRgb(color);
      memo.r += rgb.r;
      memo.g += rgb.g;
      memo.b += rgb.b;
      return memo;
    },
    { r: 0, g: 0, b: 0 },
  );
  const average = {
    r: totals.r / source.length,
    g: totals.g / source.length,
    b: totals.b / source.length,
  };
  const base = hexToRgb(fallback);
  return rgbToHex({
    r: average.r * recipeWeight + base.r * (1 - recipeWeight),
    g: average.g * recipeWeight + base.g * (1 - recipeWeight),
    b: average.b * recipeWeight + base.b * (1 - recipeWeight),
  });
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function recipeIcon(kind, color) {
  if (kind === "pancake") {
    return `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <ellipse cx="60" cy="90" rx="48" ry="14" fill="#e9eef0"/>
        <ellipse cx="60" cy="73" rx="39" ry="15" fill="${color}"/>
        <ellipse cx="56" cy="56" rx="36" ry="14" fill="#f0c06d"/>
        <ellipse cx="63" cy="40" rx="33" ry="13" fill="#f7d27d"/>
        <rect x="51" y="24" width="18" height="16" rx="4" fill="#ffe37c"/>
      </svg>
    `;
  }

  if (kind === "curry") {
    return `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <ellipse cx="60" cy="76" rx="48" ry="28" fill="#ffffff"/>
        <ellipse cx="45" cy="72" rx="26" ry="18" fill="#fff8e8"/>
        <ellipse cx="70" cy="74" rx="31" ry="20" fill="${color}"/>
        <circle cx="72" cy="67" r="5" fill="#f28b4b"/>
        <circle cx="83" cy="79" r="5" fill="#e2c77b"/>
      </svg>
    `;
  }

  if (kind === "pudding") {
    return `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <ellipse cx="60" cy="92" rx="40" ry="12" fill="#e9eef0"/>
        <path d="M33 43h54l-7 43c-2 13-38 13-40 0z" fill="${color}" stroke="#e7b75e" stroke-width="5"/>
        <ellipse cx="60" cy="43" rx="29" ry="11" fill="#8f5226"/>
        <path d="M45 56c9 6 22 6 31 0" fill="none" stroke="#fff3b1" stroke-width="5" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (kind === "jelly") {
    return `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <ellipse cx="60" cy="92" rx="38" ry="10" fill="#e9eef0"/>
        <path d="M34 34h52l-6 55H40z" fill="#ffffff" opacity=".55"/>
        <path d="M40 47h40l-5 39H45z" fill="${color}" opacity=".72"/>
        <ellipse cx="60" cy="47" rx="22" ry="7" fill="#ffffff" opacity=".58"/>
        <path d="M48 66c8 5 19 5 26 0" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".58"/>
      </svg>
    `;
  }

  if (kind === "icecream") {
    return `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M42 64h36l-18 40z" fill="#dca75d" stroke="#bd8141" stroke-width="5" stroke-linejoin="round"/>
        <path d="M48 78h24M52 90h16" stroke="#f4ca82" stroke-width="4" stroke-linecap="round"/>
        <circle cx="60" cy="45" r="27" fill="${color}" stroke="#ffffff" stroke-width="6"/>
        <circle cx="49" cy="36" r="7" fill="#ffffff" opacity=".45"/>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M35 32h50l-7 66H42z" fill="#ffffff" opacity=".88"/>
      <path d="M41 49h38l-5 43H46z" fill="${color}"/>
      <ellipse cx="60" cy="49" rx="20" ry="6" fill="#fff4e8"/>
      <path d="M73 22c-5 2-9 7-11 14" fill="none" stroke="#75bf8d" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `;
}

function ingredientIcon(kind, color) {
  const shapes = {
    bag: `<path d="M36 36h48l9 54H27z" fill="${color}" stroke="#d9c6a1" stroke-width="5"/><path d="M43 35c4-15 30-15 34 0" fill="none" stroke="#d9c6a1" stroke-width="5"/>`,
    egg: `<ellipse cx="60" cy="60" rx="29" ry="37" fill="${color}" stroke="#fff8dc" stroke-width="7"/>`,
    milk: `<path d="M40 30h32l9 13v51H39V43z" fill="${color}" stroke="#b8d8e6" stroke-width="5"/><path d="M41 45h39" stroke="#b8d8e6" stroke-width="5"/>`,
    banana: `<path d="M23 70c11 26 53 32 78-15 3-6-5-12-10-7-18 19-40 26-59 10-5-4-12 5-9 12z" fill="${color}" stroke="#c99a25" stroke-width="5" stroke-linejoin="round"/><path d="M36 68c16 10 37 7 53-10" fill="none" stroke="#fff1a6" stroke-width="6" stroke-linecap="round"/><path d="M24 69c-3 4-2 9 3 12" stroke="#8a5d2a" stroke-width="6" stroke-linecap="round"/><path d="M96 51c5-2 9 1 10 5" stroke="#8a5d2a" stroke-width="6" stroke-linecap="round"/>`,
    berry: `<path d="M60 35c22 0 32 16 24 35-5 13-17 24-24 28-7-4-19-15-24-28-8-19 2-35 24-35z" fill="${color}"/><path d="M50 35c6-9 16-9 22 0" fill="#75bf8d"/>`,
    cube: `<rect x="34" y="42" width="52" height="40" rx="8" fill="${color}" stroke="#e3bf49" stroke-width="5"/><path d="M40 53h40" stroke="#fff2a3" stroke-width="5" stroke-linecap="round"/>`,
    sugar: `<rect x="34" y="54" width="25" height="25" rx="5" fill="${color}" stroke="#dfd0aa" stroke-width="5"/><rect x="58" y="38" width="26" height="26" rx="5" fill="#ffffff" stroke="#dfd0aa" stroke-width="5"/><rect x="61" y="67" width="22" height="22" rx="5" fill="#fff8e8" stroke="#dfd0aa" stroke-width="5"/>`,
    vanilla: `<path d="M42 88c7-25 22-43 41-57" fill="none" stroke="#8b5534" stroke-width="10" stroke-linecap="round"/><path d="M51 82c9-19 21-33 37-44" fill="none" stroke="#f7d887" stroke-width="5" stroke-linecap="round"/><path d="M38 39c12-9 26-8 34 2-14 11-26 12-34-2z" fill="#fff1a6" stroke="#e2c15d" stroke-width="4"/>`,
    grape: `<circle cx="54" cy="46" r="13" fill="${color}"/><circle cx="70" cy="50" r="13" fill="${color}"/><circle cx="45" cy="64" r="13" fill="${color}"/><circle cx="62" cy="68" r="13" fill="${color}"/><circle cx="78" cy="70" r="13" fill="${color}"/><path d="M58 31c9-9 22-9 30-1" stroke="#75bf8d" stroke-width="7" stroke-linecap="round"/>`,
    chocolate: `<rect x="34" y="38" width="52" height="54" rx="8" fill="${color}" stroke="#6f3f25" stroke-width="5"/><path d="M60 40v50M36 56h48M36 74h48" stroke="#b77a50" stroke-width="5"/>`,
    juice: `<path d="M40 30h36l9 13v51H39V43z" fill="#ffffff" stroke="#e0d2c8" stroke-width="5"/><path d="M43 55h38v35H43z" fill="${color}" opacity=".82"/><path d="M62 31v19" stroke="#8ecae6" stroke-width="6" stroke-linecap="round"/>`,
    rice: `<ellipse cx="60" cy="63" rx="34" ry="25" fill="${color}" stroke="#e6dec8" stroke-width="5"/><circle cx="48" cy="57" r="5" fill="#ffffff"/><circle cx="62" cy="54" r="5" fill="#ffffff"/><circle cx="72" cy="63" r="5" fill="#ffffff"/>`,
    carrot: `<path d="M43 31c20 10 32 27 36 56-28-6-43-18-51-38z" fill="${color}"/><path d="M43 31c8-10 19-9 25 1" stroke="#75bf8d" stroke-width="7" stroke-linecap="round"/>`,
    potato: `<ellipse cx="60" cy="62" rx="34" ry="27" fill="${color}" stroke="#caa85a" stroke-width="5"/><circle cx="50" cy="57" r="3" fill="#b28d4a"/><circle cx="68" cy="68" r="3" fill="#b28d4a"/>`,
    onion: `<path d="M60 27c22 16 31 34 24 53-5 14-17 22-24 24-7-2-19-10-24-24-7-19 2-37 24-53z" fill="${color}" stroke="#d7be91" stroke-width="5"/>`,
    apple: `<circle cx="52" cy="62" r="25" fill="${color}"/><circle cx="69" cy="62" r="25" fill="${color}"/><path d="M62 33c4-9 12-13 21-11" stroke="#75bf8d" stroke-width="7" stroke-linecap="round"/>`,
    corn: `<ellipse cx="60" cy="63" rx="24" ry="38" fill="${color}" stroke="#dfb73e" stroke-width="5"/><path d="M43 80c12-10 25-10 34 0" stroke="#75bf8d" stroke-width="7" stroke-linecap="round"/>`,
    orange: `<circle cx="60" cy="62" r="32" fill="${color}" stroke="#e38237" stroke-width="5"/><path d="M37 62h46M60 39v46M44 45l32 32M76 45 44 77" stroke="#ffd6a3" stroke-width="4"/>`,
    leaf: `<path d="M31 77c18-39 47-51 62-46-3 27-27 51-62 46z" fill="${color}"/><path d="M40 72c19-10 33-23 45-38" stroke="#e7fff0" stroke-width="5" stroke-linecap="round"/>`,
  };

  return `
    <svg viewBox="0 0 120 120" aria-hidden="true">
      ${shapes[kind]}
    </svg>
  `;
}

function handlePointerMove(event) {
  if (!state.isPointerMixing) {
    return;
  }

  const point = { x: event.clientX, y: event.clientY };
  if (!state.lastPointer) {
    state.lastPointer = point;
    return;
  }

  const distance = Math.hypot(point.x - state.lastPointer.x, point.y - state.lastPointer.y);
  const now = Date.now();
  if (distance > 22 && now - state.lastMixAt > 150) {
    state.lastPointer = point;
    state.lastMixAt = now;
    addMix();
  }
}

function setupInstallGuide() {
  if (!installGuide || !installGuideClose) {
    return;
  }

  const userAgent = navigator.userAgent || "";
  const isIos = /iPhone|iPad|iPod/i.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);
  const isStandalone = window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
  const storageKey = "oryouri-install-guide-dismissed";
  const dismissed = window.localStorage.getItem(storageKey) === "1";

  let deferredPrompt = null;

  function showGuide({ title, body, actionLabel }) {
    if (installGuideTitle) installGuideTitle.textContent = title;
    if (installGuideBody) installGuideBody.textContent = body;
    if (installGuideAction) {
      if (actionLabel) {
        installGuideAction.textContent = actionLabel;
        installGuideAction.hidden = false;
      } else {
        installGuideAction.hidden = true;
      }
    }
    installGuide.hidden = false;
  }

  function hideGuide(persist) {
    installGuide.hidden = true;
    if (persist) {
      window.localStorage.setItem(storageKey, "1");
    }
  }

  installGuideClose.addEventListener("click", () => hideGuide(true));

  if (isStandalone) {
    return;
  }

  if (isIos && !dismissed) {
    showGuide({
      title: "iPhoneでは Safari の共有から",
      body: "「ホーム画面に追加」→「追加」で、次からアイコンで開けます。",
      actionLabel: null,
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (dismissed) {
      return;
    }
    showGuide({
      title: "ホーム画面に追加できます",
      body: "ボタンをおして、アイコンから ひらけるように しよう。",
      actionLabel: "ついか",
    });
  });

  if (installGuideAction) {
    installGuideAction.addEventListener("click", async () => {
      if (!deferredPrompt) {
        return;
      }
      const promptEvent = deferredPrompt;
      deferredPrompt = null;
      installGuideAction.disabled = true;
      try {
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === "accepted") {
          hideGuide(true);
        } else {
          installGuideAction.hidden = true;
        }
      } catch (_) {
        installGuideAction.hidden = true;
      } finally {
        installGuideAction.disabled = false;
      }
    });
  }

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    hideGuide(true);
  });

  if (isAndroid && !dismissed) {
    setTimeout(() => {
      if (!deferredPrompt && installGuide.hidden) {
        showGuide({
          title: "ホーム画面に追加",
          body: "ブラウザのメニュー（︙）から「ホーム画面に追加」をえらんでください。",
          actionLabel: null,
        });
      }
    }, 2500);
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {});
  });
}

startButton.addEventListener("click", () => startPicking());
toMixButton.addEventListener("click", startMixing);
mixButton.addEventListener("click", addMix);
againButton.addEventListener("click", () => startPicking(state.recipeId));
otherButton.addEventListener("click", () => {
  const currentIndex = recipeList.findIndex((recipe) => recipe.id === state.recipeId);
  state.recipeId = recipeList[(currentIndex + 1) % recipeList.length].id;
  renderRecipeChoices();
  showScreen("title");
});

mixBowl.addEventListener("pointerdown", (event) => {
  state.isPointerMixing = true;
  state.lastPointer = { x: event.clientX, y: event.clientY };
  mixBowl.setPointerCapture(event.pointerId);
  addMix();
});

mixBowl.addEventListener("pointermove", handlePointerMove);
mixBowl.addEventListener("pointerup", () => {
  state.isPointerMixing = false;
  state.lastPointer = null;
});
mixBowl.addEventListener("pointercancel", () => {
  state.isPointerMixing = false;
  state.lastPointer = null;
});
mixBowl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    addMix();
  }
});

state.recipeId = recipeList[Math.floor(Math.random() * recipeList.length)].id;
renderRecipeChoices();
setupInstallGuide();
registerServiceWorker();
