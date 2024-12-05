// Mirror Isles Plane Manager
const PLANES = {
  heavens: {
    name: "Heavens",
    effects: {
      weather: "Clear skies and golden sunlight.",
      gameplay: "Advantage on saving throws against fear. Healing spells restore max HP.",
    },
  },
  hells: {
    name: "Hells",
    effects: {
      weather: "Scorching heat and crimson skies.",
      gameplay: "Fire spells deal +1 die of damage. Disadvantage on charm/fear saves.",
    },
  },
  feywild: {
    name: "Feywild",
    effects: {
      weather: "Shifting seasons, bursts of wildflowers, and spontaneous storms.",
      gameplay: "Illusion spells gain increased DC. Daily Wisdom saves to avoid time loss.",
    },
  },
  shadowfell: {
    name: "Shadowfell",
    effects: {
      weather: "Bone-chilling cold and pervasive gloom.",
      gameplay: "Necrotic damage is increased. Shadows lengthen unnaturally.",
    },
  },
  void: {
    name: "Void",
    effects: {
      weather: "Eternal twilight, oppressive silence.",
      gameplay: "Random mutations occur. Disadvantage on saves against exhaustion.",
    },
  },
};

let currentAlignment = {
  heavens: 0,
  hells: 0,
  feywild: 0,
  shadowfell: 0,
  void: 0,
};

function getDominantAlignment() {
  const sortedPlanes = Object.entries(currentAlignment).sort(([, a], [, b]) => b - a);
  return sortedPlanes[0][0];
}

function applyPlaneEffects(dominantPlane) {
  const plane = PLANES[dominantPlane];
  if (!plane) return;

  ui.notifications.info(`The Mirror Isles align with the ${plane.name}: ${plane.effects.weather}`);

  // Example: Apply effects to the environment or gameplay hooks
  // Adjust these hooks based on your campaign needs
  game.settings.set("mirror-isles", "currentWeather", plane.effects.weather);
}

function showPlaneAlignmentMenu() {
  const content = Object.keys(currentAlignment)
    .map((plane) => `
      <div style="margin-bottom: 10px;">
        <label style="width: 150px; display: inline-block;">${PLANES[plane].name}:</label>
        <input type="number" id="${plane}" value="${currentAlignment[plane]}" style="width: 50px;" />
      </div>
    `)
    .join("");

  new Dialog({
    title: "Mirror Isles Alignment Manager",
    content: `<form>${content}</form>`,
    buttons: {
      apply: {
        label: "Apply Changes",
        callback: (html) => {
          Object.keys(currentAlignment).forEach((plane) => {
            const value = parseInt(html.find(`#${plane}`).val());
            currentAlignment[plane] = isNaN(value) ? 0 : value;
          });
          const dominant = getDominantAlignment();
          applyPlaneEffects(dominant);
        },
      },
    },
    default: "apply",
  }).render(true);
}

// Register the module menu
Hooks.once("ready", () => {
  game.settings.registerMenu("mirror-isles", "alignmentMenu", {
    name: "Plane Alignment Manager",
    label: "Open Alignment Manager",
    hint: "Manage the planar alignment of the Mirror Isles.",
    icon: "fas fa-globe",
    type: showPlaneAlignmentMenu,
    restricted: true,
  });

  game.settings.register("mirror-isles", "currentWeather", {
    name: "Current Weather",
    scope: "world",
    config: false,
    default: "Neutral weather",
    type: String,
  });

  console.log("Mirror Isles Plane Manager is ready!");
});
