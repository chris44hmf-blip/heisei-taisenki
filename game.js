/* =========================
   SCREENS
========================= */

const titleScreen =
  document.getElementById("title-screen");

const homeScreen =
  document.getElementById("home-screen");

const sortieSelectScreen =
  document.getElementById(
    "sortie-select-screen"
  );

const timelineScreen =
  document.getElementById("timeline-screen");

const battleScreen =
  document.getElementById("battle-screen");

const formationScreen =
  document.getElementById(
    "formation-screen"
  );

const trainingScreen =
  document.getElementById(
    "training-screen"
  );

const gachaLobbyScreen =
  document.getElementById(
    "gacha-lobby-screen"
  );

const doritikeGachaScreen =
  document.getElementById(
    "doritike-gacha-screen"
  );

const bsGachaScreen =
  document.getElementById(
    "bs-gacha-screen"
  );

const enhanceScreen =
  document.getElementById(
    "enhance-screen"
  );

const enhanceDetailScreen =
  document.getElementById(
    "enhance-detail-screen"
  );

const evolveScreen =
  document.getElementById(
    "evolve-screen"
  );

const evolveDetailScreen =
  document.getElementById(
    "evolve-detail-screen"
  );


/* =========================
   BUTTONS
========================= */

const startButton =
  document.getElementById("start-button");

const timelineBack =
  document.getElementById("timeline-back");

const stageStartButton =
  document.getElementById("stage-start-button");

const battlePauseButton =
  document.getElementById(
    "battle-pause-button"
  );

const battlePauseOverlay =
  document.getElementById(
    "battle-pause-overlay"
  );

const battlePauseResume =
  document.getElementById(
    "battle-pause-resume"
  );

const battleQuit =
  document.getElementById("battle-quit");


/* =========================
   SCREEN CHANGE
========================= */

function showScreen(screen) {

  if (
    homeScreen &&
    screen !== homeScreen &&
    typeof haltHomeTurntableInteraction ===
      "function"
  ) {

    haltHomeTurntableInteraction();

  }

  document
    .querySelectorAll(".screen")
    .forEach((item) => {

      item.classList.remove("active");

    });

  screen.classList.add("active");

  if (screen === homeScreen) {

    refreshHome();

  }

}


/* =========================
   TITLE
========================= */

startButton.addEventListener(
  "click",
  () => {

    titleBgm.pause();
    titleBgm.currentTime = 8;

    menuBgm.currentTime = 0;

    menuBgm
      .play()
      .catch(
        (error) => {
          console.log(
            "メニューBGM再生エラー:",
            error
          );
        }
      );

    showScreen(homeScreen);

  }
);

/* =========================
   HOME
========================= */

const HOME_FRONT_SLOT_COUNT = 5;

const menuButtons =
  document.querySelectorAll(
    "#home-screen .menu-button"
  );


menuButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const menu =
        button.dataset.menu;

      if (menu === "sortie") {

        openSortieSelect();

        return;

      }

      if (menu === "formation") {

        startFormationEditing();

        showScreen(formationScreen);

        return;

      }

      if (menu === "training") {

        showScreen(trainingScreen);

        return;

      }

      if (menu === "gacha") {

        openGachaLobby();

        return;

      }

      if (
        menu === "shop" ||
        menu === "settings" ||
        menu === "quest"
      ) {

        console.log(
          "未実装ホームメニュー:",
          menu
        );

        return;

      }

      console.log(
        "選択されたメニュー:",
        menu
      );

    }
  );

});


function getHomeMenuCharacterImage(
  characterId
) {

  if (
    !characterId ||
    typeof characterId !== "string"
  ) {

    return null;

  }

  const character =
    CHARACTERS[characterId];

  if (!character) {

    return null;

  }

  const displayForm =
    getHighestUnlockedCharacterForm(
      character
    ) || character;

  if (
    displayForm &&
    displayForm.images &&
    displayForm.images.menu
  ) {

    return {
      src: displayForm.images.menu,
      alt: character.name || "",
      characterId: character.id
    };

  }

  if (
    character.images &&
    character.images.menu
  ) {

    return {
      src: character.images.menu,
      alt: character.name || "",
      characterId: character.id
    };

  }

  return null;

}


function updateHomeFrontlineCharacters() {

  if (!homeScreen) {

    return;

  }

  const nodes =
    homeScreen.querySelectorAll(
      ".home-character[data-home-slot]"
    );

  nodes.forEach((node) => {

    const slotIndex =
      Number(node.dataset.homeSlot);

    const image =
      node.querySelector(
        ".home-character-image"
      );

    if (
      !Number.isInteger(slotIndex) ||
      slotIndex < 0 ||
      slotIndex >=
        HOME_FRONT_SLOT_COUNT ||
      !image
    ) {

      node.classList.add("is-empty");

      if (image) {

        image.hidden = true;
        image.removeAttribute("src");
        image.alt = "";

      }

      return;

    }

    const characterId =
      Array.isArray(battleDeck)
        ? battleDeck[slotIndex]
        : null;

    const menuImage =
      getHomeMenuCharacterImage(
        characterId
      );

    if (!menuImage) {

      node.classList.add("is-empty");
      node.removeAttribute(
        "data-character-id"
      );

      image.hidden = true;
      image.removeAttribute("src");
      image.alt = "";

      return;

    }

    node.classList.remove("is-empty");
    node.dataset.characterId =
      menuImage.characterId;

    image.hidden = false;

    if (image.getAttribute("src") !== menuImage.src) {

      image.src = menuImage.src;

    }

    image.alt = menuImage.alt;

  });

  updateHomeTurntableVisuals();

}


const HOME_TURNTABLE_SLOT_STEP_DEG = 72;

/* Tune here: fraction of orbit-layer width ≈ one full turn */
const HOME_TURNTABLE_DRAG_WIDTH_RATIO = 1.0;

const HOME_TURNTABLE_SCALE_FRONT = 1;

const HOME_TURNTABLE_SCALE_BACK = 0.62;

/* Physics (deg/sec). Tune in one place for iPhone feel. */
const HOME_TURNTABLE_VELOCITY_SAMPLE_MS = 100;

const HOME_TURNTABLE_MIN_INERTIA_VELOCITY = 80;

const HOME_TURNTABLE_MAX_INERTIA_VELOCITY = 1200;

const HOME_TURNTABLE_FRICTION_PER_SEC = 0.18;

const HOME_TURNTABLE_STOP_VELOCITY = 10;

const HOME_TURNTABLE_MAX_FRAME_DT_SEC = 0.05;

let homeTurntableRotationDeg = 0;

let homeTurntableAngularVelocity = 0;

let homeTurntableDragging = false;

let homeTurntableInertiaActive = false;

let homeTurntablePointerId = null;

let homeTurntableStartX = 0;

let homeTurntableStartRotationDeg = 0;

let homeTurntablePendingX = null;

let homeTurntableDragRafId = 0;

let homeTurntableInertiaRafId = 0;

let homeTurntableInertiaLastTs = 0;

let homeTurntableVelocitySamples = [];


function getHomeTurntableStage() {

  return homeScreen
    ? homeScreen.querySelector(
        ".home-turntable-stage"
      )
    : null;

}


function getHomeCharacterLayer() {

  return homeScreen
    ? homeScreen.querySelector(
        ".home-character-layer"
      )
    : null;

}


function getHomeTurntableDegPerPx() {

  const layer =
    getHomeCharacterLayer();

  const width =
    layer && layer.clientWidth > 0
      ? layer.clientWidth
      : window.innerWidth;

  const dragWidth =
    Math.max(
      width * HOME_TURNTABLE_DRAG_WIDTH_RATIO,
      1
    );

  return 360 / dragWidth;

}


function getHomeOrbitRadiiPx() {

  const layer =
    getHomeCharacterLayer();

  if (!layer) {

    return { rx: 0, ry: 0 };

  }

  const styles =
    getComputedStyle(layer);

  const rxPct =
    parseFloat(
      styles.getPropertyValue(
        "--home-orbit-rx"
      )
    ) || 41;

  const ryPct =
    parseFloat(
      styles.getPropertyValue(
        "--home-orbit-ry"
      )
    ) || 34;

  return {
    rx: layer.clientWidth * (rxPct / 100),
    ry: layer.clientHeight * (ryPct / 100)
  };

}


function normalizeHomeAngleDeg(angle) {

  let value = angle % 360;

  if (value > 180) {

    value -= 360;

  } else if (value <= -180) {

    value += 360;

  }

  return value;

}


function getHomeSlotAngleDeg(slotIndex) {

  return (
    slotIndex *
      HOME_TURNTABLE_SLOT_STEP_DEG +
    homeTurntableRotationDeg
  );

}


function updateHomeTurntableVisuals() {

  if (!homeScreen) {

    return;

  }

  const nodes =
    homeScreen.querySelectorAll(
      ".home-character[data-home-slot]"
    );

  if (!nodes.length) {

    return;

  }

  const radii =
    getHomeOrbitRadiiPx();

  nodes.forEach((node) => {

    const slotIndex =
      Number(node.dataset.homeSlot);

    if (
      !Number.isInteger(slotIndex) ||
      slotIndex < 0 ||
      slotIndex >=
        HOME_FRONT_SLOT_COUNT
    ) {

      return;

    }

    const angleDeg =
      getHomeSlotAngleDeg(slotIndex);

    const rad =
      (angleDeg * Math.PI) / 180;

    const cos =
      Math.cos(rad);

    const sin =
      Math.sin(rad);

    const x =
      sin * radii.rx;

    const y =
      cos * radii.ry;

    const frontness =
      (cos + 1) * 0.5;

    const scale =
      HOME_TURNTABLE_SCALE_BACK +
      (HOME_TURNTABLE_SCALE_FRONT -
        HOME_TURNTABLE_SCALE_BACK) *
        frontness;

    const zIndex =
      Math.round(
        10 + cos * 10
      );

    node.style.setProperty(
      "--home-angle",
      angleDeg + "deg"
    );

    node.style.setProperty(
      "--home-scale",
      String(scale)
    );

    node.style.transform =
      "translate(-50%, 0) translate(" +
      x.toFixed(2) +
      "px, " +
      y.toFixed(2) +
      "px) scale(" +
      scale.toFixed(4) +
      ")";

    node.style.zIndex =
      String(zIndex);

    node.dataset.homeAngle =
      String(
        Math.round(
          normalizeHomeAngleDeg(angleDeg) *
            10
        ) / 10
      );

  });

}


function resetHomeTurntableVelocitySamples(
  rotationDeg,
  timestamp
) {

  const time =
    typeof timestamp === "number"
      ? timestamp
      : performance.now();

  homeTurntableVelocitySamples = [
    {
      t: time,
      rot: rotationDeg
    }
  ];

}


function recordHomeTurntableVelocitySample(
  rotationDeg
) {

  const now = performance.now();

  homeTurntableVelocitySamples.push({
    t: now,
    rot: rotationDeg
  });

  const cutoff =
    now - HOME_TURNTABLE_VELOCITY_SAMPLE_MS;

  while (
    homeTurntableVelocitySamples.length >
      1 &&
    homeTurntableVelocitySamples[0].t <
      cutoff
  ) {

    homeTurntableVelocitySamples.shift();

  }

}


function getHomeTurntableReleaseVelocity() {

  const samples =
    homeTurntableVelocitySamples;

  if (samples.length < 2) {

    return 0;

  }

  const first = samples[0];

  const last =
    samples[samples.length - 1];

  const dtMs = last.t - first.t;

  if (dtMs < 8) {

    return 0;

  }

  const velocityDegPerSec =
    ((last.rot - first.rot) / dtMs) *
    1000;

  if (
    !Number.isFinite(velocityDegPerSec)
  ) {

    return 0;

  }

  const capped = Math.max(
    -HOME_TURNTABLE_MAX_INERTIA_VELOCITY,
    Math.min(
      HOME_TURNTABLE_MAX_INERTIA_VELOCITY,
      velocityDegPerSec
    )
  );

  return capped;

}


function cancelHomeTurntableDragRaf() {

  if (homeTurntableDragRafId) {

    cancelAnimationFrame(
      homeTurntableDragRafId
    );

    homeTurntableDragRafId = 0;

  }

}


function cancelHomeTurntableInertiaRaf() {

  if (homeTurntableInertiaRafId) {

    cancelAnimationFrame(
      homeTurntableInertiaRafId
    );

    homeTurntableInertiaRafId = 0;

  }

}


function stopHomeTurntableInertia(
  options
) {

  const normalizeRotation =
    !options ||
    options.normalize !== false;

  cancelHomeTurntableInertiaRaf();

  homeTurntableInertiaActive = false;

  homeTurntableAngularVelocity = 0;

  homeTurntableInertiaLastTs = 0;

  if (normalizeRotation) {

    homeTurntableRotationDeg =
      normalizeHomeAngleDeg(
        homeTurntableRotationDeg
      );

  }

}


function flushHomeTurntableDragFrame() {

  homeTurntableDragRafId = 0;

  if (
    !homeTurntableDragging ||
    homeTurntablePendingX === null
  ) {

    return;

  }

  const deltaX =
    homeTurntablePendingX -
    homeTurntableStartX;

  homeTurntableRotationDeg =
    homeTurntableStartRotationDeg +
    deltaX * getHomeTurntableDegPerPx();

  recordHomeTurntableVelocitySample(
    homeTurntableRotationDeg
  );

  updateHomeTurntableVisuals();

}


function scheduleHomeTurntableDragFrame(
  clientX
) {

  homeTurntablePendingX = clientX;

  if (homeTurntableDragRafId) {

    return;

  }

  homeTurntableDragRafId =
    requestAnimationFrame(
      flushHomeTurntableDragFrame
    );

}


function stepHomeTurntableInertia(
  timestamp
) {

  homeTurntableInertiaRafId = 0;

  if (!homeTurntableInertiaActive) {

    return;

  }

  if (
    !homeScreen ||
    !homeScreen.classList.contains(
      "active"
    ) ||
    document.visibilityState ===
      "hidden"
  ) {

    stopHomeTurntableInertia();

    updateHomeTurntableVisuals();

    return;

  }

  const lastTs =
    homeTurntableInertiaLastTs ||
    timestamp;

  let deltaSec =
    (timestamp - lastTs) / 1000;

  if (
    !Number.isFinite(deltaSec) ||
    deltaSec < 0
  ) {

    deltaSec = 0;

  }

  deltaSec = Math.min(
    deltaSec,
    HOME_TURNTABLE_MAX_FRAME_DT_SEC
  );

  homeTurntableInertiaLastTs =
    timestamp;

  homeTurntableRotationDeg +=
    homeTurntableAngularVelocity *
    deltaSec;

  homeTurntableAngularVelocity *=
    Math.pow(
      HOME_TURNTABLE_FRICTION_PER_SEC,
      deltaSec
    );

  updateHomeTurntableVisuals();

  if (
    Math.abs(
      homeTurntableAngularVelocity
    ) <=
    HOME_TURNTABLE_STOP_VELOCITY
  ) {

    stopHomeTurntableInertia();

    updateHomeTurntableVisuals();

    return;

  }

  homeTurntableInertiaRafId =
    requestAnimationFrame(
      stepHomeTurntableInertia
    );

}


function startHomeTurntableInertia(
  velocityDegPerSec
) {

  stopHomeTurntableInertia({
    normalize: false
  });

  homeTurntableAngularVelocity =
    velocityDegPerSec;

  if (
    Math.abs(
      homeTurntableAngularVelocity
    ) <
    HOME_TURNTABLE_MIN_INERTIA_VELOCITY
  ) {

    homeTurntableAngularVelocity = 0;

    homeTurntableRotationDeg =
      normalizeHomeAngleDeg(
        homeTurntableRotationDeg
      );

    updateHomeTurntableVisuals();

    return;

  }

  homeTurntableInertiaActive = true;

  homeTurntableInertiaLastTs = 0;

  homeTurntableInertiaRafId =
    requestAnimationFrame(
      stepHomeTurntableInertia
    );

}


function releaseHomeTurntablePointerCapture() {

  const stage =
    getHomeTurntableStage();

  if (
    !stage ||
    homeTurntablePointerId === null
  ) {

    return;

  }

  try {

    if (
      stage.hasPointerCapture(
        homeTurntablePointerId
      )
    ) {

      stage.releasePointerCapture(
        homeTurntablePointerId
      );

    }

  } catch (error) {

    /* ignore release errors */

  }

}


function finishHomeTurntableDragState() {

  const stage =
    getHomeTurntableStage();

  cancelHomeTurntableDragRaf();

  if (
    homeTurntableDragging &&
    homeTurntablePendingX !== null
  ) {

    const deltaX =
      homeTurntablePendingX -
      homeTurntableStartX;

    homeTurntableRotationDeg =
      homeTurntableStartRotationDeg +
      deltaX * getHomeTurntableDegPerPx();

    recordHomeTurntableVelocitySample(
      homeTurntableRotationDeg
    );

  }

  releaseHomeTurntablePointerCapture();

  homeTurntableDragging = false;

  homeTurntablePointerId = null;

  homeTurntablePendingX = null;

  if (stage) {

    stage.classList.remove(
      "is-dragging"
    );

  }

}


function endHomeTurntableDragWithInertia() {

  if (!homeTurntableDragging) {

    return;

  }

  finishHomeTurntableDragState();

  const velocity =
    getHomeTurntableReleaseVelocity();

  homeTurntableVelocitySamples = [];

  startHomeTurntableInertia(velocity);

}


function endHomeTurntableDragWithoutInertia() {

  if (homeTurntableDragging) {

    finishHomeTurntableDragState();

  }

  homeTurntableVelocitySamples = [];

  stopHomeTurntableInertia();

  updateHomeTurntableVisuals();

}


function haltHomeTurntableInteraction() {

  endHomeTurntableDragWithoutInertia();

}


function onHomeTurntablePointerDown(
  event
) {

  if (
    !homeScreen ||
    !homeScreen.classList.contains(
      "active"
    )
  ) {

    return;

  }

  if (
    event.pointerType === "mouse" &&
    event.button !== 0
  ) {

    return;

  }

  const stage =
    getHomeTurntableStage();

  if (!stage) {

    return;

  }

  /* Grab spinning disc: stop inertia, keep angle, no jump */
  stopHomeTurntableInertia({
    normalize: false
  });

  homeTurntableAngularVelocity = 0;

  homeTurntableDragging = true;

  homeTurntablePointerId =
    event.pointerId;

  homeTurntableStartX =
    event.clientX;

  homeTurntableStartRotationDeg =
    homeTurntableRotationDeg;

  homeTurntablePendingX =
    event.clientX;

  resetHomeTurntableVelocitySamples(
    homeTurntableRotationDeg,
    performance.now()
  );

  stage.classList.add("is-dragging");

  try {

    stage.setPointerCapture(
      event.pointerId
    );

  } catch (error) {

    /* capture optional */

  }

  event.preventDefault();

}


function onHomeTurntablePointerMove(
  event
) {

  if (
    !homeTurntableDragging ||
    event.pointerId !==
      homeTurntablePointerId
  ) {

    return;

  }

  scheduleHomeTurntableDragFrame(
    event.clientX
  );

  event.preventDefault();

}


function onHomeTurntablePointerUp(
  event
) {

  if (
    event.pointerId !==
      homeTurntablePointerId
  ) {

    return;

  }

  if (
    typeof event.clientX === "number"
  ) {

    homeTurntablePendingX =
      event.clientX;

  }

  endHomeTurntableDragWithInertia();

}


function onHomeTurntablePointerCancel(
  event
) {

  if (
    event.pointerId !==
      homeTurntablePointerId
  ) {

    return;

  }

  endHomeTurntableDragWithoutInertia();

}


function onHomeTurntableVisibilityChange() {

  if (
    document.visibilityState ===
      "hidden"
  ) {

    haltHomeTurntableInteraction();

  }

}


function initHomeTurntableDrag() {

  const stage =
    getHomeTurntableStage();

  if (
    !stage ||
    stage.dataset.turntableBound === "1"
  ) {

    return;

  }

  stage.dataset.turntableBound = "1";

  stage.addEventListener(
    "pointerdown",
    onHomeTurntablePointerDown
  );

  stage.addEventListener(
    "pointermove",
    onHomeTurntablePointerMove
  );

  stage.addEventListener(
    "pointerup",
    onHomeTurntablePointerUp
  );

  stage.addEventListener(
    "pointercancel",
    onHomeTurntablePointerCancel
  );

  window.addEventListener(
    "resize",
    updateHomeTurntableVisuals
  );

  document.addEventListener(
    "visibilitychange",
    onHomeTurntableVisibilityChange
  );

  updateHomeTurntableVisuals();

}


function refreshHomeResources() {

  if (
    typeof updateBeatsDisplay ===
    "function"
  ) {

    updateBeatsDisplay();

  }

  if (
    typeof updateDrinkTicketsDisplay ===
    "function"
  ) {

    updateDrinkTicketsDisplay();

  }

  if (
    typeof updateGyaraDisplay ===
    "function"
  ) {

    updateGyaraDisplay();

  }

  if (
    typeof updateBsPassDisplay ===
    "function"
  ) {

    updateBsPassDisplay();

  }

}


function refreshHome() {

  refreshHomeResources();

  updateHomeFrontlineCharacters();

  if (
    typeof updateHomeLocation ===
    "function"
  ) {

    updateHomeLocation();

  }

  updateHomeTurntableVisuals();

}


function openSortieSelect() {

  if (!sortieSelectScreen) {

    return;

  }

  hideSortieSelectNotice();

  showScreen(sortieSelectScreen);

}


function openStoryFromSortieSelect() {

  if (
    typeof renderStageSelect ===
    "function"
  ) {

    renderStageSelect();

  }

  showScreen(timelineScreen);

}


function openTrainingFromSortieSelect() {

  if (
    typeof startTrainingBattle ===
    "function"
  ) {

    startTrainingBattle();

  }

}


let sortieSelectNoticeTimer = null;


function hideSortieSelectNotice() {

  const notice =
    document.getElementById(
      "sortie-select-notice"
    );

  if (notice) {

    notice.classList.remove(
      "is-visible"
    );

    notice.textContent = "";

  }

  if (sortieSelectNoticeTimer) {

    clearTimeout(
      sortieSelectNoticeTimer
    );

    sortieSelectNoticeTimer = null;

  }

}


function showSortieSelectNotice(
  message
) {

  const notice =
    document.getElementById(
      "sortie-select-notice"
    );

  if (!notice) {

    return;

  }

  notice.textContent = message;

  notice.classList.add("is-visible");

  if (sortieSelectNoticeTimer) {

    clearTimeout(
      sortieSelectNoticeTimer
    );

  }

  sortieSelectNoticeTimer =
    setTimeout(() => {

      notice.classList.remove(
        "is-visible"
      );

      sortieSelectNoticeTimer = null;

    }, 1600);

}


function showEventComingSoon() {

  showSortieSelectNotice(
    "イベントは準備中です"
  );

}


const sortieSelectBack =
  document.getElementById(
    "sortie-select-back"
  );


if (sortieSelectBack) {

  sortieSelectBack.addEventListener(
    "click",
    () => {

      showScreen(homeScreen);

    }
  );

}


const sortieSelectPanels =
  document.querySelectorAll(
    "#sortie-select-screen [data-sortie]"
  );


sortieSelectPanels.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const target =
        button.dataset.sortie;

      if (target === "story") {

        openStoryFromSortieSelect();

        return;

      }

      if (target === "training") {

        openTrainingFromSortieSelect();

        return;

      }

      if (target === "event") {

        showEventComingSoon();

      }

    }
  );

});


function openGachaLobby() {

  if (!gachaLobbyScreen) {

    return;

  }

  showScreen(gachaLobbyScreen);

}


function closeGachaLobby() {

  showScreen(homeScreen);

}


const gachaLobbyBack =
  document.getElementById(
    "gacha-lobby-back"
  );


if (gachaLobbyBack) {

  gachaLobbyBack.addEventListener(
    "click",
    () => {

      closeGachaLobby();

    }
  );

}


const gachaLobbyDrip =
  document.getElementById(
    "gacha-lobby-drip"
  );


if (gachaLobbyDrip) {

  gachaLobbyDrip.addEventListener(
    "click",
    () => {

      openDoritikeGacha();

    }
  );

}


const gachaLobbyBs =
  document.getElementById(
    "gacha-lobby-bs"
  );


if (gachaLobbyBs) {

  gachaLobbyBs.addEventListener(
    "click",
    () => {

      openBsGacha();

    }
  );

}


/* =========================
   TIMELINE
========================= */

timelineBack.addEventListener(
  "click",
  () => {

    openSortieSelect();

  }
);


const trainingBack =
  document.getElementById(
    "training-back"
  );


if (trainingBack) {

  trainingBack.addEventListener(
    "click",
    () => {

      showScreen(homeScreen);

    }
  );

}


const trainingChoices =
  document.querySelectorAll(
    ".training-choice"
  );


trainingChoices.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const choice =
        button.dataset.training;

      if (choice === "enhance") {

        openEnhanceList();

        return;

      }

      if (choice === "evolve") {

        openEvolveList();

        return;

      }

      console.log(
        "選択された育成メニュー:",
        choice
      );

    }
  );

});


const formationBack =
  document.getElementById(
    "formation-back"
  );


if (formationBack) {

  formationBack.addEventListener(
    "click",
    () => {

      resetFormationEditing();

      showScreen(homeScreen);

    }
  );

}


const formationAuto =
  document.getElementById(
    "formation-auto"
  );


if (formationAuto) {

  formationAuto.addEventListener(
    "click",
    () => {

      applyAutoFormation();

    }
  );

}


const formationSave =
  document.getElementById(
    "formation-save"
  );


if (formationSave) {

  formationSave.addEventListener(
    "click",
    () => {

      saveFormationDraft();

    }
  );

}


const formationFilterButtons =
  document.querySelectorAll(
    ".formation-hotspot-filter"
  );


formationFilterButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      setFormationRarityFilter(
        button.dataset.filter
      );

    }
  );

});


/* =========================
   BATTLE ELEMENT
========================= */

const yaniNowText =
  document.getElementById("yani-now");

const yaniMaxText =
  document.getElementById("yani-max");

const smokingButton =
  document.getElementById(
    "smoking-area-button"
  );

const smokingLevelText =
  document.getElementById(
    "smoking-level"
  );

const smokingCostText =
  document.getElementById(
    "smoking-cost"
  );

const unitLayer =
  document.getElementById(
    "unit-layer"
  );

const projectileLayer =
  document.getElementById(
    "projectile-layer"
  );

const playerBaseHpBar =
  document.getElementById(
    "player-base-hp-bar"
  );

const playerBaseHpText =
  document.getElementById(
    "player-base-hp-text"
  );

const enemyBase =
  document.getElementById(
    "enemy-base"
  );


/* 敵拠点HP表示を取得 */
const enemyBaseHpBar =
  enemyBase.querySelector(
    ".base-hp-bar"
  );

const enemyBaseHpText =
  enemyBase.querySelector(
    "small"
  );


/* =========================
   BATTLE DATA
========================= */

const WORLD_WIDTH = 1000;

const PLAYER_BASE_X = 80;

const ENEMY_BASE_X = 920;

const CAMERA_EDGE_PADDING = 80;

const ALLY_SPAWN_OFFSET = 30;

const ENEMY_SPAWN_OFFSET = 80;

const BATTLE_MODE = {

  NORMAL: "normal",

  TRAINING: "training"

};

let currentBattleMode =
  BATTLE_MODE.NORMAL;

const DAMAGE_NUMBER_LIFETIME_MS = 480;

const DAMAGE_NUMBER_CAP = 36;

let activeDamageNumbers = [];

const TRAINING_ENEMY_LEVEL_MIN = 1;

const TRAINING_ENEMY_LEVEL_MAX = 10;

const TRAINING_ENEMY_TYPES = {

  MELEE: "training_melee",

  HEAVY: "training_heavy",

  RANGED: "training_ranged"

};

const TRAINING_ENEMY_CARD_ORDER = [
  TRAINING_ENEMY_TYPES.MELEE,
  TRAINING_ENEMY_TYPES.HEAVY,
  TRAINING_ENEMY_TYPES.RANGED
];

const TRAINING_ENEMY_CARD_META = {

  training_melee: {

    shortLabel: "近接",

    fullLabel: "近接人形"

  },

  training_heavy: {

    shortLabel: "重量",

    fullLabel: "重量人形"

  },

  training_ranged: {

    shortLabel: "射撃",

    fullLabel: "射撃人形"

  }

};

let trainingEnemyLevels = {

  training_melee: TRAINING_ENEMY_LEVEL_MIN,

  training_heavy: TRAINING_ENEMY_LEVEL_MIN,

  training_ranged: TRAINING_ENEMY_LEVEL_MIN

};

const TRAINING_STAGE = {

  id: "training",

  year: null,

  title: "訓練所",

  environment: null,

  enemyBase: {

    name: "リハスタ壁",

    emoji: "🧱"

  },

  spawns: [],

  winCondition: "none"

};

const MOSH_CROWD_OFFSCREEN_PX = 450;

const STAGE_ENV_OVERSCAN = 400;

const CAMERA_BACKGROUND_OVERSCAN_X = 250;

const DEFAULT_BACKGROUND_ASPECT = 2;

const STAGE_ENVIRONMENTS = {

  A: {

    background:
      "images/stages/set_a/stage_a1.webp",

    ground:
      "images/stages/set_a/stage_a2.webp",

    backgroundOverscanX: 250

  }

};

const STAGES = {

  1: {

    id: 1,

    year: 1,

    title: "バブルの狂騒",

    environment: "A",

    enemyBase: {

      name: "バブル本社",

      emoji: "🏢",

      monumentId: "year-01",

      image: null

    },

    spawns: [

      { delay: 1500, type: "salaryman" },

      { delay: 5000, type: "salaryman" },

      { delay: 8500, type: "salaryman" },

      { delay: 12000, type: "juriana" },

      { delay: 15000, type: "salaryman" },

      { delay: 18000, type: "juriana" },

      { delay: 21000, type: "salaryman" },

      { delay: 25000, type: "bubble" },

      { delay: 28000, type: "salaryman" },

      { delay: 31000, type: "juriana" },

      { delay: 34000, type: "bubble" },

      { delay: 38000, type: "salaryman" },

      { delay: 39500, type: "salaryman" },

      { delay: 41000, type: "juriana" },

      { delay: 45000, type: "boss" }

    ]

  },

  2: {

    id: 2,

    year: 2,

    title: "夜明け前の熱狂",

    environment: "A",

    enemyBase: {

      name: "黄金のディスコ像",

      emoji: "🕺",

      monumentId: "year-02",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_charitsuu" },

      { delay: 4200, type: "ippan_charitsuu" },

      { delay: 7000, type: "salaryman" },

      { delay: 9500, type: "ippan_charitsuu" },

      { delay: 12500, type: "juriana" },

      { delay: 15000, type: "ippan_charitsuu" },

      { delay: 17500, type: "salaryman" },

      { delay: 20500, type: "ippan_charitsuu" },

      { delay: 23500, type: "juriana" },

      { delay: 26000, type: "ippan_charitsuu" },

      { delay: 29000, type: "salaryman" },

      { delay: 32000, type: "ippan_charitsuu" },

      { delay: 35000, type: "juriana" },

      { delay: 38500, type: "ippan_charitsuu" },

      { delay: 42000, type: "bubble" }

    ]

  },

  3: {

    id: 3,

    year: 3,

    title: "熱気の残響",

    environment: "A",

    enemyBase: {

      name: "黄金の札束",

      emoji: "💴",

      monumentId: "year-03",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_salaryman" },

      { delay: 4000, type: "ippan_charitsuu" },

      { delay: 6500, type: "ippan_salaryman" },

      { delay: 9000, type: "salaryman" },

      { delay: 11500, type: "ippan_charitsuu" },

      { delay: 14000, type: "ippan_salaryman" },

      { delay: 17000, type: "juriana" },

      { delay: 20000, type: "ippan_salaryman" },

      { delay: 23000, type: "ippan_charitsuu" },

      { delay: 26000, type: "salaryman" },

      { delay: 29000, type: "ippan_salaryman" },

      { delay: 32000, type: "juriana" },

      { delay: 35000, type: "ippan_salaryman" },

      { delay: 38500, type: "bubble" },

      { delay: 42500, type: "ippan_salaryman" }

    ]

  },

  4: {

    id: 4,

    year: 4,

    title: "呼び出しの時代",

    environment: "A",

    enemyBase: {

      name: "黄金の呼び出し端末",

      emoji: "📟",

      monumentId: "year-04",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_tissue" },

      { delay: 3800, type: "ippan_charitsuu" },

      { delay: 6200, type: "ippan_tissue" },

      { delay: 8500, type: "ippan_salaryman" },

      { delay: 10800, type: "ippan_tissue" },

      { delay: 13200, type: "salaryman" },

      { delay: 15600, type: "ippan_charitsuu" },

      { delay: 18000, type: "ippan_tissue" },

      { delay: 20500, type: "juriana" },

      { delay: 23000, type: "ippan_salaryman" },

      { delay: 25500, type: "ippan_tissue" },

      { delay: 28500, type: "ippan_charitsuu" },

      { delay: 31500, type: "ippan_tissue" },

      { delay: 35000, type: "bubble" },

      { delay: 39500, type: "ippan_salaryman" }

    ]

  },

  5: {

    id: 5,

    year: 5,

    title: "熱狂のピッチ",

    environment: "A",

    enemyBase: {

      name: "黄金の蹴球像",

      emoji: "⚽",

      monumentId: "year-05",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_gamekid" },

      { delay: 3600, type: "ippan_charitsuu" },

      { delay: 5800, type: "ippan_gamekid" },

      { delay: 8000, type: "ippan_salaryman" },

      { delay: 10300, type: "ippan_tissue" },

      { delay: 12600, type: "ippan_gamekid" },

      { delay: 15000, type: "salaryman" },

      { delay: 17400, type: "ippan_charitsuu" },

      { delay: 19800, type: "ippan_gamekid" },

      { delay: 22400, type: "juriana" },

      { delay: 25000, type: "ippan_salaryman" },

      { delay: 27800, type: "ippan_tissue" },

      { delay: 30800, type: "ippan_gamekid" },

      { delay: 34200, type: "bubble" },

      { delay: 38800, type: "ippan_salaryman" }

    ]

  },

  6: {

    id: 6,

    year: 6,

    title: "街角の記憶",

    environment: "A",

    enemyBase: {

      name: "黄金のルーズ像",

      emoji: "🧦",

      monumentId: "year-06",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_crt" },

      { delay: 3900, type: "ippan_gamekid" },

      { delay: 6500, type: "ippan_charitsuu" },

      { delay: 9200, type: "ippan_crt" },

      { delay: 11800, type: "ippan_tissue" },

      { delay: 14500, type: "ippan_salaryman" },

      { delay: 17200, type: "ippan_crt" },

      { delay: 20000, type: "salaryman" },

      { delay: 22800, type: "ippan_gamekid" },

      { delay: 25800, type: "ippan_crt" },

      { delay: 28800, type: "juriana" },

      { delay: 31800, type: "ippan_salaryman" },

      { delay: 34800, type: "ippan_crt" },

      { delay: 38200, type: "bubble" },

      { delay: 42500, type: "ippan_gamekid" }

    ]

  },

  7: {

    id: 7,

    year: 7,

    title: "記憶を焼き付けろ",

    environment: "A",

    enemyBase: {

      name: "黄金のプリ機",

      emoji: "📸",

      monumentId: "year-07",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_utsurimasu" },

      { delay: 3900, type: "ippan_gamekid" },

      { delay: 6300, type: "ippan_charitsuu" },

      { delay: 8700, type: "ippan_utsurimasu" },

      { delay: 11200, type: "ippan_salaryman" },

      { delay: 13700, type: "ippan_tissue" },

      { delay: 16200, type: "ippan_crt" },

      { delay: 18800, type: "ippan_utsurimasu" },

      { delay: 21500, type: "salaryman" },

      { delay: 24300, type: "ippan_gamekid" },

      { delay: 27200, type: "ippan_utsurimasu" },

      { delay: 30200, type: "juriana" },

      { delay: 33300, type: "ippan_salaryman" },

      { delay: 36500, type: "bubble" },

      { delay: 41000, type: "ippan_utsurimasu" }

    ]

  },

  8: {

    id: 8,

    year: 8,

    title: "育成の鼓動",

    environment: "A",

    enemyBase: {

      name: "黄金の育成端末",

      emoji: "🥚",

      monumentId: "year-08",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_purikura" },

      { delay: 3700, type: "ippan_gamekid" },

      { delay: 5900, type: "ippan_charitsuu" },

      { delay: 8200, type: "ippan_purikura" },

      { delay: 10600, type: "ippan_tissue" },

      { delay: 13000, type: "ippan_salaryman" },

      { delay: 15500, type: "ippan_utsurimasu" },

      { delay: 18100, type: "ippan_purikura" },

      { delay: 20800, type: "ippan_crt" },

      { delay: 23600, type: "salaryman" },

      { delay: 26500, type: "ippan_gamekid" },

      { delay: 29500, type: "ippan_purikura" },

      { delay: 32600, type: "juriana" },

      { delay: 36000, type: "bubble" },

      { delay: 40500, type: "ippan_purikura" }

    ]

  },

  9: {

    id: 9,

    year: 9,

    title: "厚底の街",

    environment: "A",

    enemyBase: {

      name: "黄金の厚底ブーツ",

      emoji: "👢",

      monumentId: "year-09",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_charitsuu" },

      { delay: 3600, type: "ippan_gamekid" },

      { delay: 5800, type: "ippan_tissue" },

      { delay: 8200, type: "ippan_salaryman" },

      { delay: 10600, type: "ippan_purikura" },

      { delay: 13100, type: "ippan_utsurimasu" },

      { delay: 15700, type: "ippan_crt" },

      { delay: 18400, type: "ippan_gamekid" },

      { delay: 21200, type: "ippan_salaryman" },

      { delay: 24100, type: "ippan_purikura" },

      { delay: 27100, type: "ippan_utsurimasu" },

      { delay: 30200, type: "ippan_crt" },

      { delay: 33400, type: "juriana" },

      { delay: 36800, type: "bubble" },

      { delay: 41500, type: "ippan_heisei_senshi_24" }

    ]

  },

  10: {

    id: 10,

    year: 10,

    title: "音を持ち歩く時代",

    environment: "A",

    enemyBase: {

      name: "黄金の携帯音楽端末",

      emoji: "🎧",

      monumentId: "year-10",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_purikura" },

      { delay: 3500, type: "ippan_gamekid" },

      { delay: 5700, type: "ippan_charitsuu" },

      { delay: 8000, type: "ippan_tissue" },

      { delay: 10400, type: "ippan_salaryman" },

      { delay: 12900, type: "ippan_utsurimasu" },

      { delay: 15500, type: "ippan_crt" },

      { delay: 18200, type: "ippan_purikura" },

      { delay: 21000, type: "ippan_gamekid" },

      { delay: 23900, type: "ippan_salaryman" },

      { delay: 26900, type: "ippan_utsurimasu" },

      { delay: 30000, type: "ippan_crt" },

      { delay: 33300, type: "bubble" },

      { delay: 36800, type: "ippan_heisei_senshi_24" },

      { delay: 42000, type: "ippan_prilian" }

    ]

  },

  11: {

    id: 11,

    year: 11,

    title: "折りたたむ時代",

    environment: "A",

    enemyBase: {

      name: "黄金の折りたたみ携帯",

      emoji: "📱",

      monumentId: "year-11",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_gamekid" },

      { delay: 3500, type: "ippan_purikura" },

      { delay: 5700, type: "ippan_charitsuu" },

      { delay: 8000, type: "ippan_tissue" },

      { delay: 10400, type: "ippan_salaryman" },

      { delay: 12900, type: "ippan_utsurimasu" },

      { delay: 15500, type: "ippan_crt" },

      { delay: 18200, type: "ippan_purikura" },

      { delay: 21000, type: "ippan_gamekid" },

      { delay: 23900, type: "ippan_salaryman" },

      { delay: 26900, type: "ippan_utsurimasu" },

      { delay: 30000, type: "ippan_crt" },

      { delay: 33300, type: "ippan_heisei_senshi_24" },

      { delay: 37000, type: "ippan_prilian" },

      { delay: 42500, type: "ippan_garakee" }

    ]

  },

  12: {

    id: 12,

    year: 12,

    title: "ミレニアム前夜",

    environment: "A",

    enemyBase: {

      name: "黄金の2000",

      emoji: "2️⃣",

      monumentId: "year-12",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_yankee_chuugakusei" },

      { delay: 3600, type: "ippan_charitsuu" },

      { delay: 5800, type: "furyou_yankee_chuugakusei" },

      { delay: 8100, type: "ippan_gamekid" },

      { delay: 10500, type: "ippan_salaryman" },

      { delay: 13000, type: "furyou_yankee_chuugakusei" },

      { delay: 15600, type: "ippan_tissue" },

      { delay: 18300, type: "ippan_purikura" },

      { delay: 21100, type: "furyou_yankee_chuugakusei" },

      { delay: 24000, type: "ippan_utsurimasu" },

      { delay: 27000, type: "ippan_crt" },

      { delay: 30100, type: "furyou_yankee_chuugakusei" },

      { delay: 33400, type: "ippan_prilian" },

      { delay: 37000, type: "ippan_garakee" },

      { delay: 42500, type: "furyou_yankee_chuugakusei" }

    ]

  },

  13: {

    id: 13,

    year: 13,

    title: "ネットの向こう側",

    environment: "A",

    enemyBase: {

      name: "黄金のブラウン管PC",

      emoji: "🖥️",

      monumentId: "year-13",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_yankee_chuugakusei" },

      { delay: 3400, type: "furyou_gyaru_o" },

      { delay: 5500, type: "ippan_charitsuu" },

      { delay: 7700, type: "furyou_yankee_chuugakusei" },

      { delay: 10000, type: "ippan_gamekid" },

      { delay: 12400, type: "furyou_gyaru_o" },

      { delay: 14900, type: "ippan_tissue" },

      { delay: 17500, type: "ippan_purikura" },

      { delay: 20200, type: "furyou_yankee_chuugakusei" },

      { delay: 23000, type: "furyou_gyaru_o" },

      { delay: 25900, type: "ippan_salaryman" },

      { delay: 28900, type: "ippan_utsurimasu" },

      { delay: 32000, type: "ippan_garakee" },

      { delay: 35500, type: "furyou_yankee_chuugakusei" },

      { delay: 40500, type: "furyou_gyaru_o" }

    ]

  },

  14: {

    id: 14,

    year: 14,

    title: "熱狂のスタジアム",

    environment: "A",

    enemyBase: {

      name: "黄金のスタジアム像",

      emoji: "🏟️",

      monumentId: "year-14",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_gyaru_o" },

      { delay: 3500, type: "furyou_yankee_chuugakusei" },

      { delay: 5600, type: "furyou_jimoto_senpai" },

      { delay: 7800, type: "ippan_charitsuu" },

      { delay: 10100, type: "furyou_gyaru_o" },

      { delay: 12500, type: "ippan_gamekid" },

      { delay: 15000, type: "furyou_yankee_chuugakusei" },

      { delay: 17600, type: "furyou_jimoto_senpai" },

      { delay: 20300, type: "ippan_salaryman" },

      { delay: 23100, type: "furyou_gyaru_o" },

      { delay: 26000, type: "ippan_utsurimasu" },

      { delay: 29000, type: "furyou_jimoto_senpai" },

      { delay: 32100, type: "ippan_garakee" },

      { delay: 35600, type: "furyou_yankee_chuugakusei" },

      { delay: 40700, type: "furyou_jimoto_senpai" }

    ]

  },

  15: {

    id: 15,

    year: 15,

    title: "写メの時代",

    environment: "A",

    enemyBase: {

      name: "黄金のカメラ付き携帯",

      emoji: "📱",

      monumentId: "year-15",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_gyaru_o" },

      { delay: 3300, type: "furyou_chari_bo" },

      { delay: 5300, type: "furyou_yankee_chuugakusei" },

      { delay: 7400, type: "furyou_jimoto_senpai" },

      { delay: 9600, type: "furyou_chari_bo" },

      { delay: 11900, type: "ippan_charitsuu" },

      { delay: 14300, type: "furyou_gyaru_o" },

      { delay: 16800, type: "furyou_chari_bo" },

      { delay: 19400, type: "ippan_gamekid" },

      { delay: 22100, type: "furyou_jimoto_senpai" },

      { delay: 24900, type: "furyou_yankee_chuugakusei" },

      { delay: 27800, type: "furyou_chari_bo" },

      { delay: 30900, type: "ippan_prilian" },

      { delay: 34400, type: "ippan_garakee" },

      { delay: 39500, type: "furyou_chari_bo" }

    ]

  },

  16: {

    id: 16,

    year: 16,

    title: "日記の向こう側",

    environment: "A",

    enemyBase: {

      name: "黄金の日記表示PC",

      emoji: "💻",

      monumentId: "year-16",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 3400, type: "furyou_bontan" },

      { delay: 5500, type: "furyou_gyaru_o" },

      { delay: 7700, type: "furyou_yankee_chuugakusei" },

      { delay: 10000, type: "furyou_jimoto_senpai" },

      { delay: 12400, type: "furyou_bontan" },

      { delay: 14900, type: "ippan_gamekid" },

      { delay: 17500, type: "furyou_chari_bo" },

      { delay: 20200, type: "furyou_bontan" },

      { delay: 23000, type: "ippan_salaryman" },

      { delay: 25900, type: "furyou_jimoto_senpai" },

      { delay: 28900, type: "furyou_gyaru_o" },

      { delay: 32000, type: "ippan_garakee" },

      { delay: 35500, type: "furyou_bontan" },

      { delay: 40500, type: "furyou_bontan" }

    ]

  },

  17: {

    id: 17,

    year: 17,

    title: "音を持ち歩く日々",

    environment: "A",

    enemyBase: {

      name: "黄金の携帯音楽端末",

      emoji: "🎧",

      monumentId: "year-17",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 3400, type: "furyou_regent" },

      { delay: 5500, type: "furyou_gyaru_o" },

      { delay: 7700, type: "furyou_bontan" },

      { delay: 10000, type: "furyou_yankee_chuugakusei" },

      { delay: 12400, type: "furyou_regent" },

      { delay: 14900, type: "furyou_jimoto_senpai" },

      { delay: 17500, type: "furyou_chari_bo" },

      { delay: 20200, type: "furyou_regent" },

      { delay: 23000, type: "ippan_gamekid" },

      { delay: 25900, type: "furyou_bontan" },

      { delay: 28900, type: "furyou_gyaru_o" },

      { delay: 32000, type: "ippan_garakee" },

      { delay: 35500, type: "furyou_regent" },

      { delay: 40500, type: "furyou_regent" }

    ]

  },

  18: {

    id: 18,

    year: 18,

    title: "動画の向こう側",

    environment: "A",

    enemyBase: {

      name: "黄金の動画モニター",

      emoji: "📺",

      monumentId: "year-18",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 3300, type: "furyou_oraora" },

      { delay: 5300, type: "furyou_gyaru_o" },

      { delay: 7400, type: "furyou_bontan" },

      { delay: 9600, type: "furyou_yankee_chuugakusei" },

      { delay: 11900, type: "furyou_regent" },

      { delay: 14300, type: "furyou_jimoto_senpai" },

      { delay: 16800, type: "furyou_oraora" },

      { delay: 19400, type: "furyou_chari_bo" },

      { delay: 22100, type: "furyou_bontan" },

      { delay: 24900, type: "furyou_regent" },

      { delay: 27800, type: "furyou_gyaru_o" },

      { delay: 30900, type: "furyou_jimoto_senpai" },

      { delay: 34400, type: "ippan_garakee" },

      { delay: 39500, type: "furyou_oraora" }

    ]

  },

  19: {

    id: 19,

    year: 19,

    title: "電子音の街",

    environment: "A",

    enemyBase: {

      name: "黄金のPCとマイク",

      emoji: "🎙️",

      monumentId: "year-19",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 3300, type: "furyou_oraora" },

      { delay: 5300, type: "furyou_gyaru_o" },

      { delay: 7400, type: "furyou_bontan" },

      { delay: 9600, type: "furyou_yankee_chuugakusei" },

      { delay: 11900, type: "furyou_regent" },

      { delay: 14300, type: "furyou_jimoto_senpai" },

      { delay: 16800, type: "furyou_chari_bo" },

      { delay: 19400, type: "furyou_oraora" },

      { delay: 22100, type: "furyou_bontan" },

      { delay: 24900, type: "furyou_regent" },

      { delay: 27800, type: "furyou_gyaru_o" },

      { delay: 30900, type: "ippan_garakee" },

      { delay: 34400, type: "furyou_oraora" },

      { delay: 41000, type: "furyou_jimoto_saikyo" }

    ]

  },

  20: {

    id: 20,

    year: 20,

    title: "デコ盛りの時代",

    environment: "A",

    enemyBase: {

      name: "黄金のデコ盛りガラケー",

      emoji: "📱",

      monumentId: "year-20",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 3300, type: "furyou_oraora" },

      { delay: 5300, type: "furyou_gyaru_o" },

      { delay: 7400, type: "furyou_bontan" },

      { delay: 9600, type: "furyou_regent" },

      { delay: 11900, type: "furyou_jimoto_senpai" },

      { delay: 14300, type: "furyou_yankee_chuugakusei" },

      { delay: 16800, type: "furyou_chari_bo" },

      { delay: 19400, type: "furyou_oraora" },

      { delay: 22100, type: "furyou_bontan" },

      { delay: 24900, type: "furyou_regent" },

      { delay: 27800, type: "furyou_jimoto_saikyo" },

      { delay: 30900, type: "ippan_garakee" },

      { delay: 34400, type: "furyou_oraora" },

      { delay: 41200, type: "furyou_koshipan" }

    ]

  },

  21: {

    id: 21,

    year: 21,

    title: "世代交代",

    environment: "A",

    enemyBase: {

      name: "黄金のガラケーとスマホ",

      emoji: "📱",

      monumentId: "year-21",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 3200, type: "furyou_gyaru_o" },

      { delay: 5100, type: "furyou_oraora" },

      { delay: 7100, type: "furyou_bontan" },

      { delay: 9200, type: "furyou_regent" },

      { delay: 11400, type: "furyou_yankee_chuugakusei" },

      { delay: 13700, type: "furyou_jimoto_senpai" },

      { delay: 16100, type: "furyou_chari_bo" },

      { delay: 18600, type: "furyou_oraora" },

      { delay: 21200, type: "furyou_jimoto_saikyo" },

      { delay: 23900, type: "furyou_gyaru_o" },

      { delay: 26700, type: "furyou_koshipan" },

      { delay: 29800, type: "furyou_chari_bo" },

      { delay: 33300, type: "furyou_oraora" },

      { delay: 40500, type: "furyou_kaizo_chari" }

    ]

  },

  22: {

    id: 22,

    year: 22,

    title: "手のひらの世界",

    environment: "A",

    enemyBase: {

      name: "黄金の巨大スマホ",

      emoji: "📱",

      monumentId: "year-22",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 3200, type: "furyou_gyaru_o" },

      { delay: 5000, type: "ippan_gamekid" },

      { delay: 6900, type: "furyou_oraora" },

      { delay: 8900, type: "furyou_regent" },

      { delay: 11000, type: "ippan_garakee" },

      { delay: 13200, type: "furyou_bontan" },

      { delay: 15500, type: "furyou_chari_bo" },

      { delay: 17900, type: "furyou_jimoto_senpai" },

      { delay: 20400, type: "furyou_oraora" },

      { delay: 23000, type: "furyou_jimoto_saikyo" },

      { delay: 25700, type: "ippan_prilian" },

      { delay: 28600, type: "furyou_regent" },

      { delay: 31800, type: "furyou_koshipan" },

      { delay: 39200, type: "furyou_kaizo_chari" }

    ]

  },

  23: {

    id: 23,

    year: 23,

    title: "つながる時代",

    environment: "A",

    enemyBase: {

      name: "黄金の吹き出し",

      emoji: "💬",

      monumentId: "year-23",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_gyaru_o" },

      { delay: 3100, type: "furyou_chari_bo" },

      { delay: 4800, type: "furyou_yankee_chuugakusei" },

      { delay: 6600, type: "furyou_oraora" },

      { delay: 8500, type: "furyou_jimoto_senpai" },

      { delay: 10500, type: "furyou_regent" },

      { delay: 12600, type: "ippan_purikura" },

      { delay: 14800, type: "furyou_bontan" },

      { delay: 17100, type: "furyou_chari_bo" },

      { delay: 19500, type: "furyou_oraora" },

      { delay: 22000, type: "furyou_koshipan" },

      { delay: 24700, type: "ippan_garakee" },

      { delay: 27600, type: "furyou_jimoto_saikyo" },

      { delay: 30900, type: "furyou_regent" },

      { delay: 38800, type: "furyou_kaizo_chari" }

    ]

  },

  24: {

    id: 24,

    year: 24,

    title: "メッセージの波",

    environment: "A",

    enemyBase: {

      name: "黄金のチャット画面",

      emoji: "💬",

      monumentId: "year-24",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 3000, type: "furyou_oraora" },

      { delay: 4600, type: "furyou_gyaru_o" },

      { delay: 6300, type: "furyou_regent" },

      { delay: 8100, type: "furyou_bontan" },

      { delay: 10000, type: "furyou_jimoto_senpai" },

      { delay: 12000, type: "furyou_chari_bo" },

      { delay: 14100, type: "furyou_oraora" },

      { delay: 16300, type: "furyou_jimoto_saikyo" },

      { delay: 18600, type: "furyou_gyaru_o" },

      { delay: 21000, type: "furyou_koshipan" },

      { delay: 23600, type: "ippan_prilian" },

      { delay: 26400, type: "furyou_regent" },

      { delay: 29600, type: "furyou_kaizo_chari" },

      { delay: 38000, type: "furyou_jimoto_saikyo" }

    ]

  },

  25: {

    id: 25,

    year: 25,

    title: "遊びは手のひらへ",

    environment: "A",

    enemyBase: {

      name: "黄金のスマホゲーム",

      emoji: "🎮",

      monumentId: "year-25",

      image: null

    },

    spawns: [

      { delay: 1500, type: "ippan_gamekid" },

      { delay: 3000, type: "furyou_chari_bo" },

      { delay: 4600, type: "furyou_gyaru_o" },

      { delay: 6300, type: "furyou_oraora" },

      { delay: 8100, type: "furyou_regent" },

      { delay: 10000, type: "furyou_bontan" },

      { delay: 12000, type: "ippan_purikura" },

      { delay: 14100, type: "furyou_jimoto_senpai" },

      { delay: 16300, type: "furyou_oraora" },

      { delay: 18600, type: "furyou_jimoto_saikyo" },

      { delay: 21000, type: "furyou_chari_bo" },

      { delay: 23600, type: "furyou_koshipan" },

      { delay: 26400, type: "ippan_garakee" },

      { delay: 29600, type: "furyou_regent" },

      { delay: 38200, type: "furyou_kaizo_chari" }

    ]

  },

  26: {

    id: 26,

    year: 26,

    title: "自分を映す時代",

    environment: "A",

    enemyBase: {

      name: "黄金の自撮り棒",

      emoji: "🤳",

      monumentId: "year-26",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_gyaru_o" },

      { delay: 2900, type: "furyou_chari_bo" },

      { delay: 4400, type: "furyou_oraora" },

      { delay: 6000, type: "furyou_regent" },

      { delay: 7700, type: "furyou_jimoto_senpai" },

      { delay: 9500, type: "furyou_bontan" },

      { delay: 11400, type: "ippan_purikura" },

      { delay: 13400, type: "furyou_chari_bo" },

      { delay: 15500, type: "furyou_oraora" },

      { delay: 17700, type: "furyou_koshipan" },

      { delay: 20000, type: "furyou_regent" },

      { delay: 22500, type: "furyou_jimoto_saikyo" },

      { delay: 25200, type: "ippan_garakee" },

      { delay: 28300, type: "furyou_kaizo_chari" },

      { delay: 37800, type: "furyou_koshipan" }

    ]

  },

  27: {

    id: 27,

    year: 27,

    title: "配信される日常",

    environment: "A",

    enemyBase: {

      name: "黄金の配信カメラ",

      emoji: "📹",

      monumentId: "year-27",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 2800, type: "furyou_oraora" },

      { delay: 4200, type: "furyou_gyaru_o" },

      { delay: 5700, type: "furyou_regent" },

      { delay: 7300, type: "furyou_bontan" },

      { delay: 9000, type: "furyou_jimoto_senpai" },

      { delay: 10800, type: "furyou_chari_bo" },

      { delay: 12700, type: "furyou_oraora" },

      { delay: 14700, type: "furyou_jimoto_saikyo" },

      { delay: 16800, type: "furyou_koshipan" },

      { delay: 19000, type: "furyou_regent" },

      { delay: 21400, type: "furyou_kaizo_chari" },

      { delay: 24100, type: "ippan_prilian" },

      { delay: 27200, type: "furyou_jimoto_saikyo" },

      { delay: 37200, type: "furyou_kaizo_chari" }

    ]

  },

  28: {

    id: 28,

    year: 28,

    title: "街とスマホがつながる",

    environment: "A",

    enemyBase: {

      name: "黄金の位置ゲースマホ",

      emoji: "📍",

      monumentId: "year-28",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 2800, type: "furyou_oraora" },

      { delay: 4200, type: "furyou_gyaru_o" },

      { delay: 5700, type: "furyou_regent" },

      { delay: 7300, type: "furyou_bontan" },

      { delay: 9000, type: "furyou_jimoto_senpai" },

      { delay: 10800, type: "furyou_chari_bo" },

      { delay: 12700, type: "furyou_jimoto_saikyo" },

      { delay: 14700, type: "furyou_oraora" },

      { delay: 16800, type: "furyou_koshipan" },

      { delay: 19000, type: "furyou_regent" },

      { delay: 21400, type: "furyou_kaizo_chari" },

      { delay: 24100, type: "ippan_garakee" },

      { delay: 27200, type: "furyou_jimoto_saikyo" },

      { delay: 37000, type: "furyou_kaizo_chari" }

    ]

  },

  29: {

    id: 29,

    year: 29,

    title: "映える日常",

    environment: "A",

    enemyBase: {

      name: "黄金のフォトフレーム",

      emoji: "🖼️",

      monumentId: "year-29",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_gyaru_o" },

      { delay: 2700, type: "furyou_chari_bo" },

      { delay: 4000, type: "furyou_oraora" },

      { delay: 5400, type: "furyou_regent" },

      { delay: 6900, type: "furyou_bontan" },

      { delay: 8500, type: "furyou_jimoto_senpai" },

      { delay: 10200, type: "furyou_oraora" },

      { delay: 12000, type: "furyou_jimoto_saikyo" },

      { delay: 13900, type: "furyou_chari_bo" },

      { delay: 15900, type: "furyou_koshipan" },

      { delay: 18000, type: "furyou_regent" },

      { delay: 20300, type: "furyou_kaizo_chari" },

      { delay: 22900, type: "ippan_prilian" },

      { delay: 26000, type: "furyou_jimoto_saikyo" },

      { delay: 36500, type: "furyou_koshipan" }

    ]

  },

  30: {

    id: 30,

    year: 30,

    title: "縦画面の時代",

    environment: "A",

    enemyBase: {

      name: "黄金の縦型動画スマホ",

      emoji: "📱",

      monumentId: "year-30",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 2600, type: "furyou_oraora" },

      { delay: 3800, type: "furyou_regent" },

      { delay: 5100, type: "furyou_gyaru_o" },

      { delay: 6500, type: "furyou_bontan" },

      { delay: 8000, type: "furyou_jimoto_saikyo" },

      { delay: 9600, type: "furyou_chari_bo" },

      { delay: 11300, type: "furyou_koshipan" },

      { delay: 13100, type: "furyou_oraora" },

      { delay: 15000, type: "furyou_kaizo_chari" },

      { delay: 17100, type: "furyou_regent" },

      { delay: 19400, type: "furyou_jimoto_saikyo" },

      { delay: 22000, type: "furyou_koshipan" },

      { delay: 25100, type: "furyou_kaizo_chari" },

      { delay: 36000, type: "furyou_jimoto_saikyo" }

    ]

  },

  31: {

    id: 31,

    year: 31,

    title: "平成に取り残された漢達",

    environment: "A",

    winCondition: "finalBossAndBaseDestroy",

    enemyBase: {

      name: "黄金の《平成》",

      emoji: "平成",

      monumentId: "year-31",

      image: null

    },

    spawns: [

      { delay: 1500, type: "furyou_chari_bo" },

      { delay: 2800, type: "furyou_oraora" },

      { delay: 4200, type: "furyou_regent" },

      { delay: 5700, type: "furyou_gyaru_o" },

      { delay: 7300, type: "furyou_bontan" },

      { delay: 9000, type: "furyou_jimoto_saikyo" },

      { delay: 10800, type: "furyou_chari_bo" },

      { delay: 12700, type: "furyou_koshipan" },

      { delay: 14700, type: "furyou_oraora" },

      { delay: 16800, type: "furyou_kaizo_chari" },

      { delay: 19000, type: "furyou_regent" },

      { delay: 21400, type: "furyou_jimoto_saikyo" },

      { delay: 24100, type: "furyou_koshipan" },

      { delay: 27200, type: "furyou_kaizo_chari" },

      { delay: 42000, type: "heisei_final" }

    ]

  }

};


let currentStageId = 1;

let activeBattleStage = null;

let activeMedalSnapshot = [];


const HEISEI_YEAR_DIGITS = [
  "",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九"
];


function formatJapaneseNumberForHeisei(year) {

  const value =
    Number(year);


  if (
    !Number.isInteger(value) ||
    value < 1 ||
    value > 31
  ) {

    return null;

  }


  if (value === 1) {

    return "元";

  }


  const tens =
    Math.floor(value / 10);

  const ones =
    value % 10;

  const oneDigit =
    ones === 0
      ? ""
      : HEISEI_YEAR_DIGITS[ones];


  if (tens === 0) {

    return HEISEI_YEAR_DIGITS[ones];

  }


  if (tens === 1) {

    return "十" + oneDigit;

  }


  if (tens === 2) {

    return "二十" + oneDigit;

  }


  return "三十" + oneDigit;

}


function formatHeiseiYear(year) {

  const label =
    formatJapaneseNumberForHeisei(year);


  if (!label) {

    return "平成--";

  }


  return "平成" + label + "年";

}


function setCurrentStageId(stageId) {

  currentStageId = stageId;

}


function getCurrentStage() {

  if (
    !Object.prototype
      .hasOwnProperty.call(
        STAGES,
        currentStageId
      )
  ) {

    return null;

  }


  return STAGES[currentStageId];

}


function applyTimelineStageDetail(stage) {

  if (!stage) {

    return;

  }


  const label =
    document.querySelector(
      "#timeline-screen .stage-label"
    );

  const yearEl =
    document.getElementById(
      "stage-year"
    );

  const titleEl =
    document.getElementById(
      "stage-title"
    );


  if (label) {

    label.textContent =
      formatStageCode(stage.id);

  }


  if (yearEl) {

    yearEl.textContent =
      formatHeiseiYear(stage.year);

  }


  if (titleEl) {

    titleEl.textContent = "";

    titleEl.hidden = true;

  }

}


function updateBattleStageHeader(stage) {

  if (!stage) {

    return;

  }


  const yearEl =
    document.getElementById(
      "battle-stage-year"
    );

  const titleEl =
    document.getElementById(
      "battle-stage-title"
    );


  if (yearEl) {

    if (
      stage.id === "training" ||
      isTrainingBattle()
    ) {

      yearEl.textContent =
        "訓練所";

    } else {

      yearEl.textContent =
        formatHeiseiYear(stage.year);

    }

  }


  if (titleEl) {

    titleEl.textContent = "";

    titleEl.hidden = true;

  }

}


function formatStageClearAlert(stage) {

  return (
    formatHeiseiYear(
      stage && stage.year
    ) +
    " 突破！"
  );

}


const STAGE_PROGRESS_KEY =
  "stageProgress";


let stageProgress = {
  highestClearedStage: 0
};


function formatStageCode(stageId) {

  const value =
    Number(stageId);


  if (
    !Number.isFinite(value) ||
    value < 1
  ) {

    return "STAGE --";

  }


  return (
    "STAGE " +
    String(
      Math.floor(value)
    ).padStart(2, "0")
  );

}


function sanitizeStageProgress(value) {

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {

    return {
      highestClearedStage: 0
    };

  }


  const number =
    Number(value.highestClearedStage);


  if (
    !Number.isFinite(number) ||
    number < 0
  ) {

    return {
      highestClearedStage: 0
    };

  }


  return {
    highestClearedStage:
      Math.floor(number)
  };

}


function saveStageProgress() {

  localStorage.setItem(
    STAGE_PROGRESS_KEY,
    JSON.stringify(stageProgress)
  );

}


function loadStageProgress() {

  try {

    const raw =
      localStorage.getItem(
        STAGE_PROGRESS_KEY
      );


    if (
      raw === null ||
      raw === undefined
    ) {

      return {
        highestClearedStage: 0
      };

    }


    return sanitizeStageProgress(
      JSON.parse(raw)
    );

  } catch (error) {

  }


  return {
    highestClearedStage: 0
  };

}


function getStageProgress() {

  return {
    highestClearedStage:
      stageProgress.highestClearedStage
  };

}


function getHighestClearedStage() {

  return stageProgress.highestClearedStage;

}


function setHighestClearedStage(stageId) {

  const number =
    Number(stageId);


  if (
    !Number.isFinite(number) ||
    number < 0
  ) {

    stageProgress = {
      highestClearedStage: 0
    };

  } else {

    stageProgress = {
      highestClearedStage:
        Math.floor(number)
    };

  }


  saveStageProgress();


  return stageProgress.highestClearedStage;

}


function hasStage(stageId) {

  return Object.prototype
    .hasOwnProperty.call(
      STAGES,
      stageId
    );

}


function isStagePlayable(stageId) {

  const id =
    Number(stageId);


  if (
    !Number.isInteger(id) ||
    id < 1 ||
    !hasStage(id)
  ) {

    return false;

  }


  if (id === 1) {

    return true;

  }


  if (!hasStage(id - 1)) {

    return false;

  }


  return (
    getHighestClearedStage() >=
    id - 1
  );

}


function getStageNodeState(stageId) {

  if (!isStagePlayable(stageId)) {

    return "locked";

  }


  const highest =
    getHighestClearedStage();


  if (stageId <= highest) {

    return "cleared";

  }


  if (stageId === highest + 1) {

    return "current";

  }


  return "locked";

}


function markStageCleared(stageId) {

  const previousHighest =
    getHighestClearedStage();

  const id =
    Number(stageId);


  if (
    !Number.isInteger(id) ||
    id < 1 ||
    !hasStage(id)
  ) {

    return {
      previousHighest: previousHighest,
      highestClearedStage: previousHighest,
      isFirstClear: false
    };

  }


  const isFirstClear =
    id === previousHighest + 1 &&
    id > previousHighest;

  const highestClearedStage =
    Math.max(
      previousHighest,
      id
    );


  if (
    highestClearedStage !==
    previousHighest
  ) {

    setHighestClearedStage(
      highestClearedStage
    );

  }


  return {
    previousHighest: previousHighest,
    highestClearedStage: highestClearedStage,
    isFirstClear: isFirstClear
  };

}


function getSortedStages() {

  return Object.values(STAGES)
    .filter((stage) => {

      return (
        stage &&
        Number.isInteger(stage.id) &&
        hasStage(stage.id)
      );

    })
    .sort((a, b) => {

      return a.id - b.id;

    });

}


function getPreferredStageId() {

  const nextId =
    getHighestClearedStage() + 1;


  if (isStagePlayable(nextId)) {

    return nextId;

  }


  let best = null;


  getSortedStages().forEach((stage) => {

    if (isStagePlayable(stage.id)) {

      best = stage.id;

    }

  });


  return best;

}


function getHomeLocationStage() {

  const preferredId =
    getPreferredStageId();


  if (
    preferredId &&
    hasStage(preferredId)
  ) {

    return STAGES[preferredId];

  }


  return null;

}


function updateHomeLocation() {

  const label =
    document.getElementById(
      "home-current-year"
    );

  const stage =
    getHomeLocationStage();


  if (!label || !stage) {

    return;

  }


  label.textContent =
    formatHeiseiYear(stage.year);

}


function updateStageStartAvailability() {

  if (!stageStartButton) {

    return;

  }


  stageStartButton.disabled =
    !isStagePlayable(currentStageId);

}


function bindStageSelectClicks() {

  const scroll =
    document.querySelector(
      "#timeline-screen .timeline-scroll"
    );


  if (
    !scroll ||
    scroll.dataset.stageSelectBound ===
      "1"
  ) {

    return;

  }


  scroll.dataset.stageSelectBound = "1";


  scroll.addEventListener(
    "click",
    (event) => {

      const node =
        event.target.closest(
          ".year-node"
        );


      if (
        !node ||
        node.disabled
      ) {

        return;

      }


      const stageId =
        Number(node.dataset.stageId);


      if (!isStagePlayable(stageId)) {

        return;

      }


      setCurrentStageId(stageId);

      renderStageSelect();

    }
  );

}


function renderStageSelect(options) {

  const scroll =
    document.querySelector(
      "#timeline-screen .timeline-scroll"
    );


  if (!scroll) {

    return;

  }


  bindStageSelectClicks();


  scroll
    .querySelectorAll(".year-node")
    .forEach((node) => {

      node.remove();

    });


  const selectDefault =
    options &&
    options.selectDefault;

  let selectedId =
    currentStageId;


  if (selectDefault) {

    selectedId =
      getPreferredStageId();

  } else if (
    !isStagePlayable(selectedId)
  ) {

    selectedId =
      getPreferredStageId();

  }


  if (selectedId) {

    setCurrentStageId(selectedId);

  }


  getSortedStages().forEach((stage) => {

    const state =
      getStageNodeState(stage.id);

    const button =
      document.createElement("button");

    button.type = "button";

    button.className = "year-node";

    button.dataset.stageId =
      String(stage.id);

    if (state === "locked") {

      button.classList.add("locked");

      button.disabled = true;

    } else {

      button.classList.add("unlocked");

      button.classList.add(
        state === "cleared"
          ? "is-cleared"
          : "is-current"
      );

    }


    if (
      stage.id === currentStageId &&
      state !== "locked"
    ) {

      button.classList.add("selected");

    }


    const circle =
      document.createElement("span");

    circle.className = "year-circle";

    circle.textContent =
      state === "locked"
        ? "🔒"
        : String(stage.id);


    const name =
      document.createElement("strong");

    name.textContent =
      formatHeiseiYear(stage.year);


    const note =
      document.createElement("small");

    note.textContent =
      state === "cleared"
        ? "CLEAR"
        : "";


    button.appendChild(circle);

    button.appendChild(name);

    button.appendChild(note);

    (
      scroll.querySelector(".timeline-track") ||
      scroll
    ).appendChild(button);

  });


  const selectedStage =
    getCurrentStage();


  if (
    selectedStage &&
    isStagePlayable(selectedStage.id)
  ) {

    applyTimelineStageDetail(
      selectedStage
    );

  }


  updateStageStartAvailability();

}


function initStageProgress() {

  stageProgress =
    loadStageProgress();

  saveStageProgress();

  renderStageSelect({
    selectDefault: true
  });

  updateHomeLocation();

}


/* =========================
   MEDALS
   所持とクリア接続。
   clearRoll: 全stage dropRate 0.10。
   effect は次STEPで扱うため null。
========================= */

const MEDALS = {

  1: {
    id: 1,
    name: "バブルのメダル",
    stageId: 1,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  2: {
    id: 2,
    name: "ディスコのメダル",
    stageId: 2,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  3: {
    id: 3,
    name: "札束のメダル",
    stageId: 3,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  4: {
    id: 4,
    name: "呼び出しベルのメダル",
    stageId: 4,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  5: {
    id: 5,
    name: "蹴球のメダル",
    stageId: 5,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  6: {
    id: 6,
    name: "ルーズのメダル",
    stageId: 6,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  7: {
    id: 7,
    name: "プリ帳のメダル",
    stageId: 7,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  8: {
    id: 8,
    name: "育成端末のメダル",
    stageId: 8,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  9: {
    id: 9,
    name: "厚底のメダル",
    stageId: 9,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  10: {
    id: 10,
    name: "携帯音楽のメダル",
    stageId: 10,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  11: {
    id: 11,
    name: "ガラケーのメダル",
    stageId: 11,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  12: {
    id: 12,
    name: "ミレニアムのメダル",
    stageId: 12,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  13: {
    id: 13,
    name: "ネットのメダル",
    stageId: 13,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  14: {
    id: 14,
    name: "熱狂のメダル",
    stageId: 14,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  15: {
    id: 15,
    name: "写メのメダル",
    stageId: 15,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  16: {
    id: 16,
    name: "ブログのメダル",
    stageId: 16,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  17: {
    id: 17,
    name: "着うたのメダル",
    stageId: 17,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  18: {
    id: 18,
    name: "動画のメダル",
    stageId: 18,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  19: {
    id: 19,
    name: "電子音楽のメダル",
    stageId: 19,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  20: {
    id: 20,
    name: "デコ電のメダル",
    stageId: 20,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  21: {
    id: 21,
    name: "世代交代のメダル",
    stageId: 21,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  22: {
    id: 22,
    name: "スマホのメダル",
    stageId: 22,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  23: {
    id: 23,
    name: "つながりのメダル",
    stageId: 23,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  24: {
    id: 24,
    name: "メッセージのメダル",
    stageId: 24,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  25: {
    id: 25,
    name: "ソシャゲのメダル",
    stageId: 25,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  26: {
    id: 26,
    name: "自撮りのメダル",
    stageId: 26,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  27: {
    id: 27,
    name: "配信のメダル",
    stageId: 27,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  28: {
    id: 28,
    name: "位置ゲーのメダル",
    stageId: 28,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  29: {
    id: 29,
    name: "映えのメダル",
    stageId: 29,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  30: {
    id: 30,
    name: "縦動画のメダル",
    stageId: 30,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  },

  31: {
    id: 31,
    name: "平成のメダル",
    stageId: 31,
    grant: "clearRoll",
    dropRate: 0.10,
    effect: null
  }

};


const MEDAL_PROGRESS_KEY =
  "medalProgress";


let medalProgress = {
  owned: {},
  equipped: [null, null, null]
};


function createEmptyMedalProgress() {

  return {
    owned: {},
    equipped: [null, null, null]
  };

}


function isPlainObject(value) {

  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value)
  );

}


function medalIdFromEquippedValue(raw) {

  if (
    raw === null ||
    raw === undefined ||
    typeof raw === "boolean"
  ) {

    return null;

  }


  const id =
    typeof raw === "number"
      ? raw
      : Number(raw);


  if (!Number.isInteger(id)) {

    return null;

  }


  return id;

}


function sanitizeEquippedMedals(
  value,
  owned
) {

  const slots = [null, null, null];

  const seen = {};


  if (!Array.isArray(value)) {

    return slots;

  }


  let index = 0;


  while (index < 3) {

    const raw =
      index < value.length
        ? value[index]
        : null;

    const id =
      medalIdFromEquippedValue(raw);

    const medal =
      id === null
        ? null
        : getMedalDef(id);

    const key =
      medal
        ? String(medal.id)
        : "";


    if (
      medal &&
      owned &&
      owned[key] === true &&
      !seen[key]
    ) {

      slots[index] = medal.id;

      seen[key] = true;

    }

    index += 1;

  }


  return slots;

}


function sanitizeMedalProgress(value) {

  const empty =
    createEmptyMedalProgress();


  if (!isPlainObject(value)) {

    return empty;

  }


  if (isPlainObject(value.owned)) {

    Object.keys(value.owned).forEach(
      (key) => {

        const id =
          Number(key);

        const medal =
          getMedalDef(id);


        if (
          medal &&
          String(medal.id) === String(key) &&
          value.owned[key] === true
        ) {

          empty.owned[String(medal.id)] = true;

        }

      }
    );

  }


  empty.equipped =
    sanitizeEquippedMedals(
      value.equipped,
      empty.owned
    );


  return empty;

}


function saveMedalProgress(progress) {

  if (progress !== undefined) {

    medalProgress =
      sanitizeMedalProgress(progress);

  } else {

    medalProgress =
      sanitizeMedalProgress(
        medalProgress
      );

  }


  localStorage.setItem(
    MEDAL_PROGRESS_KEY,
    JSON.stringify(medalProgress)
  );


  return getMedalProgress();

}


function loadMedalProgress() {

  try {

    const raw =
      localStorage.getItem(
        MEDAL_PROGRESS_KEY
      );


    if (
      raw === null ||
      raw === undefined
    ) {

      return createEmptyMedalProgress();

    }


    return sanitizeMedalProgress(
      JSON.parse(raw)
    );

  } catch (error) {

  }


  return createEmptyMedalProgress();

}


function getMedalProgress() {

  return {
    owned: Object.assign(
      {},
      medalProgress.owned
    ),
    equipped:
      medalProgress.equipped.slice()
  };

}


function initMedalProgress() {

  medalProgress =
    loadMedalProgress();

  saveMedalProgress();

}


function getMedalDef(medalId) {

  const id =
    Number(medalId);


  if (!Number.isInteger(id)) {

    return null;

  }


  if (
    !Object.prototype.hasOwnProperty.call(
      MEDALS,
      id
    )
  ) {

    return null;

  }


  return MEDALS[id];

}


function getMedalCount() {

  return Object.keys(MEDALS).length;

}


function listMedals() {

  const list = [];

  let id = 1;


  while (id <= getMedalCount()) {

    const medal =
      getMedalDef(id);


    if (medal) {

      list.push(medal);

    }

    id += 1;

  }


  return list;

}


function getMedalByStageId(stageId) {

  const medal =
    getMedalDef(stageId);


  if (
    !medal ||
    medal.stageId !== Number(stageId)
  ) {

    return null;

  }


  return medal;

}


function ownsMedal(medalId) {

  const medal =
    getMedalDef(medalId);


  if (!medal) {

    return false;

  }


  return (
    medalProgress.owned[
      String(medal.id)
    ] === true
  );

}


function getEquippedMedals() {

  return medalProgress.equipped.slice();

}


function equipMedal(slotIndex, medalId) {

  if (
    !Number.isInteger(slotIndex) ||
    slotIndex < 0 ||
    slotIndex > 2
  ) {

    return false;

  }


  const medal =
    getMedalDef(medalId);


  if (
    !medal ||
    !ownsMedal(medal.id)
  ) {

    return false;

  }


  const current =
    getEquippedMedals();

  let index = 0;


  while (index < 3) {

    if (
      index !== slotIndex &&
      current[index] === medal.id
    ) {

      return false;

    }

    index += 1;

  }


  if (current[slotIndex] === medal.id) {

    return true;

  }


  current[slotIndex] = medal.id;

  medalProgress.equipped = current;

  saveMedalProgress();


  return true;

}


function unequipMedal(slotIndex) {

  if (
    !Number.isInteger(slotIndex) ||
    slotIndex < 0 ||
    slotIndex > 2
  ) {

    return false;

  }


  const current =
    getEquippedMedals();


  if (current[slotIndex] === null) {

    return true;

  }


  current[slotIndex] = null;

  medalProgress.equipped = current;

  saveMedalProgress();


  return true;

}


function resolveEquippedMedals() {

  const snapshot = [];

  const seen = {};

  const equipped =
    getEquippedMedals();

  let index = 0;


  while (index < equipped.length) {

    const id = equipped[index];

    const medal =
      id === null
        ? null
        : getMedalDef(id);

    const key =
      medal
        ? String(medal.id)
        : "";


    if (
      medal &&
      ownsMedal(medal.id) &&
      !seen[key]
    ) {

      snapshot.push({

        id: medal.id,

        name: medal.name,

        effect: medal.effect

      });

      seen[key] = true;

    }

    index += 1;

  }


  return snapshot;

}


function getActiveMedalSnapshot() {

  return activeMedalSnapshot.map(
    (medal) => {

      return {

        id: medal.id,

        name: medal.name,

        effect: medal.effect

      };

    }
  );

}


function clearActiveMedalSnapshot() {

  activeMedalSnapshot = [];

}


let medalSelectorSlot = null;


function renderMedalEquipment() {

  const root =
    document.getElementById(
      "formation-medal-slots"
    );


  if (!root) {

    return;

  }


  root.innerHTML = "";

  const equipped =
    getEquippedMedals();

  let index = 0;


  while (index < 3) {

    const medalId = equipped[index];

    const medal =
      medalId === null
        ? null
        : getMedalDef(medalId);

    const name =
      medal
        ? medal.name
        : "未装備";

    const button =
      document.createElement("button");


    button.type = "button";

    button.className =
      "formation-medal-slot";

    if (!medal) {

      button.classList.add("is-empty");

    }

    button.dataset.medalSlot =
      String(index);

    button.title = name;

    button.innerHTML = `

      <span class="formation-medal-slot-label">SLOT ${index + 1}</span>
      <span class="formation-medal-slot-name"><span class="formation-medal-mark" aria-hidden="true">◎</span> ${name}</span>

    `;

    button.addEventListener(
      "click",
      () => {

        openMedalSelector(index);

      }
    );

    root.appendChild(button);

    index += 1;

  }

}


function renderMedalSelector() {

  const list =
    document.getElementById(
      "formation-medal-list"
    );

  const empty =
    document.getElementById(
      "formation-medal-empty"
    );


  if (!list) {

    return;

  }


  list.innerHTML = "";

  const owned =
    listMedals().filter((medal) => {

      return ownsMedal(medal.id);

    });

  owned.sort((left, right) => {

    return left.id - right.id;

  });


  if (empty) {

    empty.hidden = owned.length > 0;

  }


  const equipped =
    getEquippedMedals();


  owned.forEach((medal) => {

    const usedAt =
      equipped.indexOf(medal.id);

    const blocked =
      usedAt !== -1 &&
      usedAt !== medalSelectorSlot;

    const button =
      document.createElement("button");


    button.type = "button";

    button.className =
      "formation-medal-option";

    button.disabled = blocked;

    button.textContent =
      blocked
        ? medal.name + "（装備中）"
        : medal.name;

    button.addEventListener(
      "click",
      () => {

        if (
          medalSelectorSlot === null ||
          blocked
        ) {

          return;

        }


        if (
          equipMedal(
            medalSelectorSlot,
            medal.id
          )
        ) {

          closeMedalSelector();

          renderMedalEquipment();

        }

      }
    );

    list.appendChild(button);

  });

}


function openMedalSelector(slotIndex) {

  if (
    !Number.isInteger(slotIndex) ||
    slotIndex < 0 ||
    slotIndex > 2
  ) {

    return;

  }


  const selector =
    document.getElementById(
      "formation-medal-selector"
    );


  if (!selector) {

    return;

  }


  medalSelectorSlot = slotIndex;

  renderMedalSelector();

  selector.hidden = false;

}


function closeMedalSelector() {

  medalSelectorSlot = null;

  const selector =
    document.getElementById(
      "formation-medal-selector"
    );


  if (selector) {

    selector.hidden = true;

  }

}


function bindMedalEquipmentUi() {

  const selector =
    document.getElementById(
      "formation-medal-selector"
    );

  const unequip =
    document.getElementById(
      "formation-medal-unequip"
    );

  const backdrop =
    document.getElementById(
      "formation-medal-selector-backdrop"
    );


  if (
    !selector ||
    selector.dataset.bound === "1"
  ) {

    return;

  }


  selector.dataset.bound = "1";


  if (unequip) {

    unequip.addEventListener(
      "click",
      () => {

        if (medalSelectorSlot === null) {

          return;

        }


        if (
          unequipMedal(
            medalSelectorSlot
          )
        ) {

          closeMedalSelector();

          renderMedalEquipment();

        }

      }
    );

  }


  if (backdrop) {

    backdrop.addEventListener(
      "click",
      () => {

        closeMedalSelector();

      }
    );

  }

}


bindMedalEquipmentUi();


function grantMedal(medalId) {

  const medal =
    getMedalDef(medalId);


  if (!medal) {

    return {
      newlyGranted: false
    };

  }


  const key =
    String(medal.id);


  if (
    medalProgress.owned[key] === true
  ) {

    return {
      newlyGranted: false
    };

  }


  medalProgress.owned[key] = true;

  saveMedalProgress();


  return {
    newlyGranted: true
  };

}


function isPlayableDropRate(rate) {

  return (
    typeof rate === "number" &&
    Number.isFinite(rate) &&
    rate >= 0 &&
    rate <= 1
  );

}


function rollMedalOnClear(stage) {

  if (
    !stage ||
    !Number.isInteger(stage.id)
  ) {

    return {
      newlyGranted: false
    };

  }


  const medal =
    getMedalByStageId(stage.id);


  if (!medal) {

    return {
      newlyGranted: false
    };

  }


  if (medal.grant !== "clearRoll") {

    return {
      newlyGranted: false
    };

  }


  if (ownsMedal(medal.id)) {

    return {
      newlyGranted: false
    };

  }


  if (medal.dropRate === null) {

    return {
      newlyGranted: false
    };

  }


  if (!isPlayableDropRate(medal.dropRate)) {

    return {
      newlyGranted: false
    };

  }


  if (
    !(Math.random() < medal.dropRate)
  ) {

    return {
      newlyGranted: false
    };

  }


  return grantMedal(medal.id);

}


initStageProgress();

initMedalProgress();


function getMoshCrowdEndX() {

  return (
    WORLD_WIDTH +
    MOSH_CROWD_OFFSCREEN_PX
  );

}


function getMoshKnockbackMaxX() {

  return ENEMY_BASE_X;

}


function getAllySpawnX() {

  return (
    PLAYER_BASE_X +
    ALLY_SPAWN_OFFSET
  );

}


function getEnemySpawnX() {

  return (
    ENEMY_BASE_X -
    ENEMY_SPAWN_OFFSET
  );

}


function applySpawnPosition(element, worldX) {

  element.style.left =
    worldX + "px";

  element.style.right =
    "auto";

}


const MIN_ZOOM = 0.65;

const MAX_ZOOM = 2.0;


let cameraX = 0;

let zoom = 1;

let currentStageEnvironmentId = null;


function applyCamera() {

  const world =
    document.getElementById(
      "battle-world"
    );


  if (!world) {

    return;

  }


  world.style.transformOrigin =
    "0 100%";

  world.style.transform =
    `translate(${-cameraX * zoom}px, 0) scale(${zoom})`;

}


function getStageEnvironment(environmentId) {

  if (
    !environmentId ||
    !STAGE_ENVIRONMENTS[environmentId]
  ) {

    return null;

  }

  return STAGE_ENVIRONMENTS[environmentId];

}


function getBackgroundOverscanX(environment) {

  if (
    environment &&
    typeof environment.backgroundOverscanX ===
      "number"
  ) {

    return environment.backgroundOverscanX;

  }

  return CAMERA_BACKGROUND_OVERSCAN_X;

}


function getBackgroundAspect(environment) {

  if (
    environment &&
    typeof environment.backgroundAspect ===
      "number" &&
    environment.backgroundAspect > 0
  ) {

    return environment.backgroundAspect;

  }

  return DEFAULT_BACKGROUND_ASPECT;

}


function applyStageEnvironment(environmentId) {

  const world =
    document.getElementById(
      "battle-world"
    );

  const viewport =
    document.getElementById(
      "battle-viewport"
    );

  const backgroundLayer =
    document.getElementById(
      "battle-env-background"
    );

  const groundLayer =
    document.getElementById(
      "battle-env-ground"
    );

  const environment =
    getStageEnvironment(
      environmentId
    );


  if (
    !world ||
    !backgroundLayer ||
    !groundLayer
  ) {

    return;

  }


  if (!environment) {

    if (viewport) {

      viewport.classList.remove(
        "has-stage-environment"
      );

    }

    world.classList.remove(
      "has-stage-environment"
    );

    backgroundLayer.style.backgroundImage =
      "";

    backgroundLayer.style.height =
      "";

    groundLayer.style.backgroundImage =
      "";

    currentStageEnvironmentId =
      null;

    return;

  }


  const overscanX =
    getBackgroundOverscanX(
      environment
    );

  const backgroundWidth =
    WORLD_WIDTH +
    overscanX * 2;

  const backgroundHeight =
    backgroundWidth /
    getBackgroundAspect(
      environment
    );


  backgroundLayer.style.left =
    -overscanX + "px";

  backgroundLayer.style.width =
    backgroundWidth + "px";

  backgroundLayer.style.height =
    backgroundHeight + "px";

  backgroundLayer.style.backgroundImage =
    'url("' +
    environment.background +
    '")';


  const groundLeft =
    -STAGE_ENV_OVERSCAN;

  const groundWidth =
    WORLD_WIDTH +
    CAMERA_EDGE_PADDING +
    STAGE_ENV_OVERSCAN * 2;


  groundLayer.style.left =
    groundLeft + "px";

  groundLayer.style.width =
    groundWidth + "px";

  groundLayer.style.backgroundImage =
    'url("' +
    environment.ground +
    '")';


  world.classList.add(
    "has-stage-environment"
  );

  currentStageEnvironmentId =
    environmentId;

  if (viewport) {

    viewport.classList.add(
      "has-stage-environment"
    );

  }

}


function getViewportWidth() {

  const viewport =
    document.getElementById(
      "battle-viewport"
    );

  if (!viewport) {

    return window.innerWidth;

  }

  const layoutWidth =
    viewport.clientWidth;

  if (layoutWidth > 0) {

    return layoutWidth;

  }

  const rectWidth =
    viewport.getBoundingClientRect().width;

  if (rectWidth > 0) {

    return rectWidth;

  }

  return window.innerWidth;

}


function getBackgroundLayerLeft() {

  const environment =
    getStageEnvironment(
      currentStageEnvironmentId
    );

  if (!environment) {

    return 0;

  }

  return (
    -getBackgroundOverscanX(
      environment
    )
  );

}


function getBackgroundLayerWidth() {

  const environment =
    getStageEnvironment(
      currentStageEnvironmentId
    );

  if (!environment) {

    return getWorldSpanX();

  }

  return (
    WORLD_WIDTH +
    getBackgroundOverscanX(
      environment
    ) * 2
  );

}


function getMinZoom() {

  const viewportWidth =
    getViewportWidth();

  const backgroundWidth =
    getBackgroundLayerWidth();

  if (
    viewportWidth <= 0 ||
    backgroundWidth <= 0
  ) {

    return MIN_ZOOM;

  }

  return Math.min(
    1,
    viewportWidth /
      backgroundWidth
  );

}


function getWorldSpanX() {

  return (
    WORLD_WIDTH +
    CAMERA_EDGE_PADDING
  );

}


function getVisibleWorldWidth() {

  return getViewportWidth() / zoom;

}


function getCameraMinX() {

  const visibleWorldWidth =
    getVisibleWorldWidth();

  const worldSpanX =
    getWorldSpanX();

  const backgroundLeft =
    getBackgroundLayerLeft();

  const backgroundWidth =
    getBackgroundLayerWidth();


  if (
    visibleWorldWidth >=
    worldSpanX
  ) {

    return (
      backgroundLeft +
      (
        backgroundWidth -
        visibleWorldWidth
      ) /
      2
    );

  }


  return 0;

}


function getCameraMaxX() {

  const visibleWorldWidth =
    getVisibleWorldWidth();

  const worldSpanX =
    getWorldSpanX();

  const backgroundLeft =
    getBackgroundLayerLeft();

  const backgroundWidth =
    getBackgroundLayerWidth();


  if (
    visibleWorldWidth >=
    worldSpanX
  ) {

    return (
      backgroundLeft +
      (
        backgroundWidth -
        visibleWorldWidth
      ) /
      2
    );

  }


  return (
    worldSpanX -
    visibleWorldWidth
  );

}


function clampCameraX(nextX) {

  const minX =
    getCameraMinX();

  const maxX =
    getCameraMaxX();

  return Math.min(
    maxX,
    Math.max(minX, nextX)
  );

}


let cameraDrag = null;

let cameraPinch = null;


function panCameraFromClientX(clientX) {

  if (!cameraDrag) {

    return;

  }


  const dx =
    clientX - cameraDrag.startX;


  cameraX =
    clampCameraX(
      cameraDrag.startCameraX -
      dx / zoom
    );


  applyCamera();

}


function beginCameraPan(clientX, event) {

  if (isBattlePaused) {

    return;

  }


  event.preventDefault();

  cameraDrag = {

    startX: clientX,

    startCameraX: cameraX

  };

}


function endCameraPan() {

  cameraDrag = null;

}


function getTouchDistance(touchA, touchB) {

  return Math.hypot(
    touchA.clientX - touchB.clientX,
    touchA.clientY - touchB.clientY
  );

}


function clampZoom(nextZoom) {

  return Math.min(
    MAX_ZOOM,
    Math.max(getMinZoom(), nextZoom)
  );

}


function beginCameraPinch(touchA, touchB, event) {

  if (isBattlePaused) {

    return;

  }


  event.preventDefault();

  endCameraPan();


  const viewport =
    document.getElementById(
      "battle-viewport"
    );

  const rect =
    viewport.getBoundingClientRect();

  const startMidX =
    (touchA.clientX + touchB.clientX) / 2;

  const startDistance =
    getTouchDistance(touchA, touchB);


  cameraPinch = {

    startDistance:
      startDistance,

    startMidX:
      startMidX,

    startZoom:
      zoom,

    startCameraX:
      cameraX,

    focusWorldX:
      cameraX +
      (startMidX - rect.left) / zoom,

    viewportLeft:
      rect.left

  };

}


function updateCameraPinch(touchA, touchB, event) {

  if (
    !cameraPinch ||
    cameraPinch.startDistance <= 0
  ) {

    return;

  }


  event.preventDefault();


  const scale =
    getTouchDistance(touchA, touchB) /
    cameraPinch.startDistance;

  zoom =
    clampZoom(
      cameraPinch.startZoom * scale
    );

  cameraX =
    clampCameraX(
      cameraPinch.focusWorldX -
      (cameraPinch.startMidX -
        cameraPinch.viewportLeft) /
      zoom
    );


  applyCamera();

}


function endCameraPinch() {

  cameraPinch = null;

}


function setupBattleCameraPan() {

  const viewport =
    document.getElementById(
      "battle-viewport"
    );


  if (!viewport) {

    return;

  }


  const capturePassiveFalse = {
    capture: true,
    passive: false
  };


  const useTouch =
    "ontouchstart" in window;


  if (useTouch) {

    viewport.addEventListener(
      "touchstart",
      (event) => {

        if (event.touches.length >= 2) {

          if (cameraPinch) {

            event.preventDefault();

          } else {

            beginCameraPinch(
              event.touches[0],
              event.touches[1],
              event
            );

          }

          return;

        }


        if (event.touches.length !== 1) {

          endCameraPan();

          return;

        }


        beginCameraPan(
          event.touches[0].clientX,
          event
        );

      },
      capturePassiveFalse
    );


    window.addEventListener(
      "touchmove",
      (event) => {

        if (event.touches.length >= 2) {

          event.preventDefault();

          if (cameraPinch) {

            updateCameraPinch(
              event.touches[0],
              event.touches[1],
              event
            );

          }

          return;

        }


        if (
          !cameraDrag ||
          event.touches.length !== 1
        ) {

          return;

        }


        event.preventDefault();

        panCameraFromClientX(
          event.touches[0].clientX
        );

      },
      capturePassiveFalse
    );


    window.addEventListener(
      "touchend",
      (event) => {

        if (event.touches.length >= 2) {

          return;

        }


        if (event.touches.length === 1) {

          endCameraPinch();

          beginCameraPan(
            event.touches[0].clientX,
            event
          );

          return;

        }


        endCameraPan();

        endCameraPinch();

      },
      capturePassiveFalse
    );


    window.addEventListener(
      "touchcancel",
      () => {

        endCameraPan();

        endCameraPinch();

      },
      capturePassiveFalse
    );


    return;

  }


  viewport.addEventListener(
    "pointerdown",
    (event) => {

      if (!event.isPrimary) {

        return;

      }

      if (event.button !== 0) {

        return;

      }


      viewport.setPointerCapture(
        event.pointerId
      );


      beginCameraPan(
        event.clientX,
        event
      );

    },
    capturePassiveFalse
  );


  viewport.addEventListener(
    "pointermove",
    (event) => {

      if (
        !cameraDrag ||
        !event.isPrimary
      ) {

        return;

      }


      event.preventDefault();

      panCameraFromClientX(
        event.clientX
      );

    },
    capturePassiveFalse
  );


  viewport.addEventListener(
    "pointerup",
    endCameraPan,
    capturePassiveFalse
  );


  viewport.addEventListener(
    "pointercancel",
    endCameraPan,
    capturePassiveFalse
  );

}


setupBattleCameraPan();


let yani = 0;

let yaniMax = 1000;

let yaniSpeed = 20;

let smokingLevel = 1;

let smokingCost = 200;

let battleRunning = false;

let isBattlePaused = false;

let battlePausedAt = 0;

let deployCooldownUntil = {};

let deployCooldownDurationMs = {};

/* battle-local only; never persisted */
let finalBossDefeated = false;

let finalBossDefeatedUnit = null;


function isBattleActive() {

  return (
    battleRunning &&
    !isBattlePaused
  );

}


function showBattlePauseMenu() {

  if (!battlePauseOverlay) {

    return;

  }

  battlePauseOverlay.hidden =
    false;

}


function hideBattlePauseMenu() {

  if (!battlePauseOverlay) {

    return;

  }

  battlePauseOverlay.hidden =
    true;

}


function shiftUnitClocks(unit, pausedMs) {

  if (!unit || pausedMs <= 0) {

    return;

  }

  if (unit.attackCooldown) {

    unit.attackCooldown +=
      pausedMs;

  }

  if (unit.knockbackStartedAt) {

    unit.knockbackStartedAt +=
      pausedMs;

  }

  if (
    unit.pendingFrontAoe &&
    typeof unit.pendingFrontAoe.fireAt ===
      "number"
  ) {

    unit.pendingFrontAoe.fireAt +=
      pausedMs;

  }

  if (
    unit.pendingMeleeImpact &&
    typeof unit.pendingMeleeImpact.fireAt ===
      "number"
  ) {

    unit.pendingMeleeImpact.fireAt +=
      pausedMs;

  }

  if (
    unit.delayedMultiHit &&
    Array.isArray(
      unit.delayedMultiHit.pendingHits
    )
  ) {

    unit.delayedMultiHit.pendingHits
      .forEach(
        (hit) => {

          if (
            hit &&
            typeof hit.fireAt ===
              "number"
          ) {

            hit.fireAt +=
              pausedMs;

          }

        }
      );

  }

  if (
    unit.delayedMultiHit &&
    typeof unit.delayedMultiHit.finishAt ===
      "number"
  ) {

    unit.delayedMultiHit.finishAt +=
      pausedMs;

  }

  if (
    unit.attackDash &&
    typeof unit.attackDash.startedAt ===
      "number"
  ) {

    unit.attackDash.startedAt +=
      pausedMs;

  }

  if (unit.sprintStartedAt) {

    unit.sprintStartedAt +=
      pausedMs;

  }

}


function shiftBattleClocks(pausedMs) {

  if (pausedMs <= 0) {

    return;

  }

  if (lastProjectileUpdateAt) {

    lastProjectileUpdateAt +=
      pausedMs;

  }

  enemySpawnQueue.forEach(
    (item) => {

      item.at += pausedMs;

    }
  );

  pendingProjectiles.forEach(
    (pending) => {

      pending.launchAt +=
        pausedMs;

    }
  );

  attackKnockbackEffects.forEach(
    (effect) => {

      effect.expiresAt +=
        pausedMs;

    }
  );

  activeDropAoeEffects.forEach(
    (drop) => {

      if (!drop) {

        return;

      }

      if (
        typeof drop.spawnAt ===
          "number"
      ) {

        drop.spawnAt +=
          pausedMs;

      }

      if (
        typeof drop.fallEndsAt ===
          "number"
      ) {

        drop.fallEndsAt +=
          pausedMs;

      }

    }
  );

  playerUnits.forEach(
    (unit) => {

      shiftUnitClocks(
        unit,
        pausedMs
      );

    }
  );

  enemyUnits.forEach(
    (enemy) => {

      shiftUnitClocks(
        enemy,
        pausedMs
      );

    }
  );

  Object.keys(
    deployCooldownUntil
  ).forEach(
    (characterId) => {

      deployCooldownUntil[characterId] +=
        pausedMs;

    }
  );

}


function pauseDropAoeAnimations() {

  activeDropAoeEffects.forEach(
    (drop) => {

      if (
        drop &&
        drop.animation &&
        typeof drop.animation.pause ===
          "function"
      ) {

        try {

          drop.animation.pause();

        } catch (error) {

        }

      }

    }
  );

}


function resumeDropAoeAnimations() {

  activeDropAoeEffects.forEach(
    (drop) => {

      if (
        drop &&
        drop.animation &&
        typeof drop.animation.play ===
          "function"
      ) {

        try {

          drop.animation.play();

        } catch (error) {

        }

      }

    }
  );

}


function pauseBattle() {

  if (
    !battleRunning ||
    isBattlePaused
  ) {

    return;

  }

  isBattlePaused = true;

  battlePausedAt =
    Date.now();

  endCameraPan();

  endCameraPinch();

  pauseDropAoeAnimations();

  showBattlePauseMenu();

  battleBgm.pause();

}


function resumeBattle() {

  if (
    !battleRunning ||
    !isBattlePaused
  ) {

    return;

  }

  const pausedMs =
    Date.now() -
    battlePausedAt;

  isBattlePaused = false;

  battlePausedAt = 0;

  shiftBattleClocks(pausedMs);

  resumeDropAoeAnimations();

  hideBattlePauseMenu();

  battleBgm
    .play()
    .catch(
      () => {}
    );

}

/* =========================
   MOSH DATA
========================= */

let moshGauge = 0;

let moshMax = 100;

let moshTimer = null;

let moshActive = false;

const moshButton =
  document.getElementById(
    "mosh-button"
  );

/* タイマー */

let yaniTimer = null;

let battleTimer = null;

let enemySpawnTimers = [];

let enemySpawnQueue = [];


/* 全キャラ */

let playerUnits = [];

let enemyUnits = [];

let projectiles = [];

let pendingProjectiles = [];

let lastProjectileUpdateAt = 0;

let attackKnockbackEffects = [];

let activeGoodsScatterParticles = [];

const GOODS_SCATTER_PARTICLE_CAP = 24;

let activeDropAoeEffects = [];


/* 拠点 */

let playerBaseHp = 2000;
let playerBaseMaxHp = 2000;

let enemyBaseHp = 2000;
let enemyBaseMaxHp = 2000;

function isTrainingBattle() {

  return (
    currentBattleMode ===
    BATTLE_MODE.TRAINING
  );

}


function getTrainingCharacterIds() {

  return Object.keys(CHARACTERS)
    .map((id) => CHARACTERS[id])
    .filter(
      (character) =>
        character &&
        typeof character.number ===
          "number" &&
        character.images &&
        character.images.menu
    )
    .sort(
      (a, b) =>
        a.number -
        b.number
    )
    .map(
      (character) =>
        character.id
    );

}


function syncBattleModeUi() {

  if (!battleScreen) {

    return;

  }

  const training =
    isTrainingBattle();

  battleScreen.classList.toggle(
    "is-training",
    training
  );

  const subtitle =
    document.getElementById(
      "battle-training-subtitle"
    );

  const resetButton =
    document.getElementById(
      "battle-training-reset"
    );

  const exitButton =
    document.getElementById(
      "battle-training-exit"
    );

  const pauseButton =
    document.getElementById(
      "battle-pause-button"
    );

  if (subtitle) {

    subtitle.hidden = !training;

  }

  if (resetButton) {

    resetButton.hidden = !training;

  }

  if (exitButton) {

    exitButton.hidden = !training;

  }

  if (pauseButton) {

    pauseButton.hidden = training;

  }

  if (smokingButton) {

    smokingButton.hidden = training;

  }

  const moshPanel =
    document.querySelector(
      ".mosh-panel"
    );

  if (moshPanel) {

    moshPanel.hidden = training;

  }

  const enemyCards =
    document.getElementById(
      "battle-training-enemy-cards"
    );

  if (enemyCards) {

    enemyCards.hidden = !training;

  }

  if (training) {

    renderTrainingEnemyCards();

  }

}


function clearDamageNumbers() {

  activeDamageNumbers
    .slice()
    .forEach(
      removeDamageNumber
    );

  activeDamageNumbers = [];

}


function removeDamageNumber(entry) {

  if (!entry) {

    return;

  }

  if (
    entry.element &&
    entry.element.parentNode
  ) {

    entry.element.remove();

  }

  activeDamageNumbers =
    activeDamageNumbers.filter(
      (item) =>
        item !== entry
    );

}


function spawnDamageNumber(
  target,
  damage
) {

  if (
    !isTrainingBattle() ||
    !projectileLayer ||
    !target ||
    !Number.isFinite(damage) ||
    damage <= 0
  ) {

    return;

  }

  while (
    activeDamageNumbers.length >=
    DAMAGE_NUMBER_CAP
  ) {

    removeDamageNumber(
      activeDamageNumbers[0]
    );

  }

  const element =
    document.createElement("div");

  element.className =
    "battle-damage-number";

  element.textContent =
    String(
      Math.round(damage)
    );

  const x =
    Number.isFinite(target.x)
      ? target.x
      : 0;

  element.style.left =
    x + "px";

  element.style.bottom =
    "calc(22% + 48px)";

  projectileLayer.appendChild(
    element
  );

  const entry = {

    element: element

  };

  activeDamageNumbers.push(entry);

  window.setTimeout(
    () => {

      removeDamageNumber(entry);

    },
    DAMAGE_NUMBER_LIFETIME_MS
  );

}


function resetTrainingEnemyLevels() {

  TRAINING_ENEMY_CARD_ORDER.forEach(
    (type) => {

      trainingEnemyLevels[type] =
        TRAINING_ENEMY_LEVEL_MIN;

    }
  );

}


function getTrainingEnemySelectedLevel(
  type
) {

  const level =
    Number(
      trainingEnemyLevels[type]
    );

  if (
    !Number.isInteger(level)
  ) {

    return TRAINING_ENEMY_LEVEL_MIN;

  }

  if (
    level < TRAINING_ENEMY_LEVEL_MIN
  ) {

    return TRAINING_ENEMY_LEVEL_MIN;

  }

  if (
    level > TRAINING_ENEMY_LEVEL_MAX
  ) {

    return TRAINING_ENEMY_LEVEL_MAX;

  }

  return level;

}


function adjustTrainingEnemyLevel(
  type,
  delta
) {

  if (
    !isTrainingBattle() ||
    !TRAINING_ENEMY_CARD_META[type]
  ) {

    return;

  }

  const next =
    getTrainingEnemySelectedLevel(
      type
    ) +
    Number(delta || 0);

  if (
    next < TRAINING_ENEMY_LEVEL_MIN ||
    next > TRAINING_ENEMY_LEVEL_MAX
  ) {

    return;

  }

  trainingEnemyLevels[type] =
    next;

  syncTrainingEnemyCardLevels();

}


function syncTrainingEnemyCardLevels() {

  TRAINING_ENEMY_CARD_ORDER.forEach(
    (type) => {

      const levelEl =
        document.querySelector(
          '[data-training-enemy-level="' +
            type +
            '"]'
        );

      if (levelEl) {

        levelEl.textContent =
          "Lv." +
          getTrainingEnemySelectedLevel(
            type
          );

      }

    }
  );

}


function renderTrainingEnemyCards() {

  const host =
    document.getElementById(
      "battle-training-enemy-cards"
    );

  if (!host) {

    return;

  }

  if (host.dataset.ready === "1") {

    syncTrainingEnemyCardLevels();

    return;

  }

  host.innerHTML = "";

  TRAINING_ENEMY_CARD_ORDER.forEach(
    (type) => {

      const meta =
        TRAINING_ENEMY_CARD_META[
          type
        ];

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "battle-training-enemy-card";

      card.dataset.trainingEnemy =
        type;

      card.innerHTML =
        '<button type="button" class="battle-training-enemy-card-spawn" data-training-enemy="' +
        type +
        '" aria-label="' +
        meta.fullLabel +
        'を召喚">' +
        '<span class="battle-training-enemy-card-title">' +
        meta.shortLabel +
        "</span>" +
        "</button>" +
        '<span class="battle-training-enemy-card-controls">' +
        '<button type="button" class="battle-training-enemy-lv-btn" data-training-enemy-delta="-1" data-training-enemy-type="' +
        type +
        '" aria-label="レベルを下げる">−</button>' +
        '<span class="battle-training-enemy-lv" data-training-enemy-level="' +
        type +
        '">Lv.' +
        getTrainingEnemySelectedLevel(
          type
        ) +
        "</span>" +
        '<button type="button" class="battle-training-enemy-lv-btn" data-training-enemy-delta="1" data-training-enemy-type="' +
        type +
        '" aria-label="レベルを上げる">＋</button>' +
        "</span>";

      host.appendChild(card);

    }
  );

  host.dataset.ready = "1";

  syncTrainingEnemyCardLevels();

}


function styleTrainingEnemy(
  enemy,
  def
) {

  if (
    !enemy ||
    !enemy.element
  ) {

    return;

  }

  const visual =
    (
      def &&
      def.trainingVisual
    ) ||
    "melee";

  enemy.element.classList.add(
    "battle-training-enemy"
  );

  enemy.element.classList.add(
    "battle-training-" + visual
  );

  const body =
    enemy.element.querySelector(
      ".enemy-body"
    );

  if (body) {

    body.innerHTML =
      '<div class="training-dummy-figure training-dummy-' +
      visual +
      '" aria-hidden="true">' +
      '<span class="training-dummy-head"></span>' +
      '<span class="training-dummy-torso"></span>' +
      '<span class="training-dummy-arm"></span>' +
      '<span class="training-dummy-base"></span>' +
      "</div>";

  }

}


function spawnTrainingEnemyFromCard(
  type
) {

  if (
    !isTrainingBattle() ||
    !isBattleActive()
  ) {

    return null;

  }

  const def =
    getEnemyDef(type);

  if (
    !def ||
    def.family !== "training"
  ) {

    return null;

  }

  const level =
    getTrainingEnemySelectedLevel(
      type
    );

  const multiplier =
    getLevelStatMultiplier(
      level
    );

  const enemy =
    spawnEnemyFromDef(def);

  if (!enemy) {

    return null;

  }

  enemy.trainingEnemy = true;

  enemy.trainingLevel = level;

  enemy.yaniReward = 0;

  enemy.maxHp =
    Math.max(
      1,
      roundCharacterStat(
        def.hp * multiplier
      )
    );

  enemy.hp =
    enemy.maxHp;

  enemy.attack =
    Math.max(
      0,
      roundCharacterStat(
        def.attack * multiplier
      )
    );

  if (enemy.hpBar) {

    enemy.hpBar.style.width =
      "100%";

  }

  styleTrainingEnemy(enemy, def);

  const label =
    enemy.element &&
    enemy.element.querySelector(
      ".enemy-label"
    );

  if (label) {

    label.textContent =
      def.name +
      " Lv." +
      level;

  }

  return enemy;

}


function clearTrainingUnitStates() {

  playerUnits.slice().forEach(
    (unit) => {

      if (!unit) {

        return;

      }

      clearUnitCombatState(unit);

      if (
        unit.element &&
        unit.element.parentNode
      ) {

        unit.element.remove();

      }

    }
  );

  playerUnits = [];

  enemyUnits.slice().forEach(
    (enemy) => {

      if (!enemy) {

        return;

      }

      clearUnitCombatState(enemy);

      if (
        enemy.element &&
        enemy.element.parentNode
      ) {

        enemy.element.remove();

      }

    }
  );

  enemyUnits = [];

  clearProjectiles();

  clearAllDelayedMultiHits();

  clearAllBattleStatusEffects();

  clearDamageNumbers();

  clearGoodsScatterParticles();

}


function resetTrainingBattle() {

  if (!isTrainingBattle()) {

    return;

  }

  clearTrainingUnitStates();

  deployCooldownUntil = {};

  deployCooldownDurationMs = {};

  if (unitLayer) {

    unitLayer.innerHTML = "";

  }

  if (projectileLayer) {

    projectileLayer
      .querySelectorAll(
        ".battle-damage-number"
      )
      .forEach(
        (node) => {
          node.remove();
        }
      );

  }

  yani = 999999;

  yaniMax = 999999;

  yaniSpeed = 0;

  smokingLevel = 1;

  smokingCost = 200;

  playerBaseHp = 999999;

  playerBaseMaxHp = 999999;

  enemyBaseHp = 999999;

  enemyBaseMaxHp = 999999;

  moshGauge = 0;

  moshActive = false;

  updateMoshUI();

  resetTrainingEnemyLevels();

  syncTrainingEnemyCardLevels();

  cameraX = 0;

  zoom = 1;

  applyCamera();

  updateBattleUI();

  updateBaseUI();

}


function exitTrainingBattle() {

  if (!isTrainingBattle()) {

    openSortieSelect();

    return;

  }

  stopBattle();

  clearTrainingUnitStates();

  clearDamageNumbers();

  currentBattleMode =
    BATTLE_MODE.NORMAL;

  activeBattleStage = null;

  syncBattleModeUi();

  if (unitLayer) {

    unitLayer.innerHTML = "";

  }

  openSortieSelect();

}


function startTrainingBattle() {

  currentBattleMode =
    BATTLE_MODE.TRAINING;

  activeBattleStage =
    TRAINING_STAGE;

  activeMedalSnapshot =
    resolveEquippedMedals();

  finalBossDefeated = false;

  finalBossDefeatedUnit = null;

  menuBgm.pause();

  menuBgm.currentTime = 0;

  battleBgm.currentTime = 0;

  battleBgm
    .play()
    .catch(
      (error) => {

        console.log(
          "戦闘BGM再生エラー:",
          error
        );

      }
    );

  yani = 999999;

  yaniMax = 999999;

  yaniSpeed = 0;

  smokingLevel = 1;

  smokingCost = 200;

  battleRunning = true;

  isBattlePaused = false;

  battlePausedAt = 0;

  hideBattlePauseMenu();

  deployCooldownUntil = {};

  deployCooldownDurationMs = {};

  battleCardPage = 0;

  cameraX = 0;

  zoom = 1;

  applyCamera();

  applyStageEnvironment(
    TRAINING_STAGE.environment
  );

  updateBattleStageHeader(
    TRAINING_STAGE
  );

  syncBattleModeUi();

  moshGauge = 0;

  moshActive = false;

  updateMoshUI();

  clearTrainingUnitStates();

  if (unitLayer) {

    unitLayer.innerHTML = "";

  }

  playerBaseHp = 999999;

  playerBaseMaxHp = 999999;

  enemyBaseHp = 999999;

  enemyBaseMaxHp = 999999;

  clearInterval(yaniTimer);

  clearInterval(battleTimer);

  clearEnemySpawnTimers();

  clearInterval(moshTimer);

  renderBattleUnitCards();

  updateBattleUI();

  applyStageEnemyBase(
    TRAINING_STAGE
  );

  updateBaseUI();

  showScreen(battleScreen);

  resetTrainingEnemyLevels();

  syncBattleModeUi();

  yaniTimer =
    setInterval(
      () => {

        if (!isBattleActive()) {

          return;

        }

        // Training: YANI stays infinite.
        updateBattleUI();

      },
      250
    );

  battleTimer =
    setInterval(
      () => {

        if (!isBattleActive()) {

          return;

        }

        updateEnemySpawns();

        updatePendingCombatDelays();

        updateUnits();

        updateEnemies();

        updateProjectiles();

        updateAttackKnockbackEffects();

        updateUnitCardAvailability();

      },
      30
    );

  return true;

}


/* =========================
   START BATTLE
========================= */

function startBattle() {

  currentBattleMode =
    BATTLE_MODE.NORMAL;

  syncBattleModeUi();

  const stage =
    getCurrentStage();


  if (
    !stage ||
    !isStagePlayable(stage.id)
  ) {

    return false;

  }


  activeBattleStage = stage;

  activeMedalSnapshot =
    resolveEquippedMedals();

  finalBossDefeated = false;

  finalBossDefeatedUnit = null;


 /* 戦闘BGMに切り替え */

  menuBgm.pause();
  menuBgm.currentTime = 0;

  battleBgm.currentTime = 0;

  battleBgm
    .play()
    .catch(
      (error) => {
        console.log(
          "戦闘BGM再生エラー:",
          error
        );
      }
    );

  yani = 0;

  yaniMax = 1000;

  yaniSpeed = 20;

  smokingLevel = 1;

  smokingCost = 200;

  battleRunning = true;

  isBattlePaused = false;

  battlePausedAt = 0;

  hideBattlePauseMenu();

  deployCooldownUntil = {};

  deployCooldownDurationMs = {};

  battleCardPage = 0;

  renderBattleUnitCards();

  cameraX = 0;

  zoom = 1;

  applyCamera();

  applyStageEnvironment(
    stage.environment
  );

  updateBattleStageHeader(stage);

moshGauge = 0;

moshActive = false;

updateMoshUI();


  playerUnits = [];

  enemyUnits = [];

  clearProjectiles();

  clearAllDelayedMultiHits();

  clearAllBattleStatusEffects();


  playerBaseHp = 2000;
enemyBaseHp = 2000;

  unitLayer.innerHTML = "";


  clearInterval(yaniTimer);

  clearInterval(battleTimer);

  clearEnemySpawnTimers();


  updateBattleUI();

  applyStageEnemyBase(stage);

  updateBaseUI();

  showScreen(battleScreen);


  /* ヤニ生成 */

  yaniTimer =
    setInterval(
      () => {

        if (!isBattleActive()) {
          return;
        }

        yani += yaniSpeed / 10;

        if (yani > yaniMax) {
          yani = yaniMax;
        }

        updateBattleUI();

      },
      100
    );

/* =========================
   モッシュゲージ
========================= */

clearInterval(moshTimer);

moshTimer =
  setInterval(
    () => {

      if (!isBattleActive()) {
        return;
      }

      if (moshActive) {
        return;
      }

      /*
        1秒で約2%
      */

      moshGauge += 2;

      if (moshGauge > moshMax) {

        moshGauge =
          moshMax;

      }

      updateMoshUI();

    },
    1000
  );

  /* バトル更新 */

  battleTimer =
    setInterval(
      () => {

        if (!isBattleActive()) {
          return;
        }

        updateEnemySpawns();

        updatePendingCombatDelays();

        updateUnits();

        updateEnemies();

        updateProjectiles();

        updateAttackKnockbackEffects();

        updateUnitCardAvailability();

      },
      30
    );


  scheduleStageSpawns(stage);

  return true;

}


/* =========================
   BATTLE UI
========================= */

function updateBattleUI() {

  if (isTrainingBattle()) {

    yaniNowText.textContent =
      "∞";

    if (yaniMaxText) {

      yaniMaxText.textContent =
        "∞";

    }

  } else {

    yaniNowText.textContent =
      Math.floor(yani);

    yaniMaxText.textContent =
      yaniMax;

  }

  smokingLevelText.textContent =
    smokingLevel;

  smokingCostText.textContent =
    smokingCost;


  updateUnitCardAvailability();

}


/* =========================
   BASE UI
========================= */

function getStageEnemyBase(stage) {

  const display = {

    name: "バブル本社",

    emoji: "🏢",

    monumentId: null,

    image: null

  };

  const source =
    stage &&
    stage.enemyBase;


  if (
    !source ||
    typeof source !== "object" ||
    Array.isArray(source)
  ) {

    return display;

  }


  if (
    typeof source.name === "string" &&
    source.name.length > 0
  ) {

    display.name = source.name;

  }


  if (
    typeof source.emoji === "string" &&
    source.emoji.length > 0
  ) {

    display.emoji = source.emoji;

  }


  if (
    typeof source.monumentId === "string" &&
    source.monumentId.length > 0
  ) {

    display.monumentId = source.monumentId;

  }


  return display;

}


function applyStageEnemyBase(stage) {

  const display =
    getStageEnemyBase(stage);

  const building =
    enemyBase.querySelector(
      ".enemy-building"
    );

  const name =
    enemyBase.querySelector(
      ".base-name"
    );


  if (building) {

    building.textContent =
      display.emoji;

  }


  if (name) {

    name.textContent =
      display.name;

  }


  return display;

}


function resetEnemyBaseDisplay() {

  return applyStageEnemyBase(null);

}


function updateBaseUI() {

  const playerPercent =
    (
      playerBaseHp /
      playerBaseMaxHp
    ) * 100;


  const enemyPercent =
    (
      enemyBaseHp /
      enemyBaseMaxHp
    ) * 100;


  playerBaseHpBar.style.width =
    Math.max(
      0,
      playerPercent
    ) + "%";


  enemyBaseHpBar.style.width =
    Math.max(
      0,
      enemyPercent
    ) + "%";


  playerBaseHpText.textContent =
    `${Math.max(0, Math.floor(playerBaseHp))} / ${playerBaseMaxHp}`;


  enemyBaseHpText.textContent =
    `${Math.max(0, Math.floor(enemyBaseHp))} / ${enemyBaseMaxHp}`;

}


/* =========================
   喫煙所
========================= */

smokingButton.addEventListener(
  "click",
  () => {

    if (!isBattleActive()) {

      return;

    }

    if (isTrainingBattle()) {

      return;

    }

    if (yani < smokingCost) {

      return;

    }


    yani -= smokingCost;

    smokingLevel++;

    yaniSpeed += 7;

    yaniMax += 250;


    smokingCost =
      Math.floor(
        smokingCost * 1.55
      );


    updateBattleUI();

  }
);


/* =========================
   CHARACTERS
========================= */

function getCharacterImages(id) {

  const folder =
    "images/characters/" + id;

  return {

    menu:
      folder + "/" + id + "_menu.webp",

    idle:
      folder + "/" + id + "_idle.webp",

    attack:
      folder + "/" + id + "_attack.webp",

    hurt:
      folder + "/" + id + "_hurt.webp"

  };

}


const CHARACTER_RARITY = {

  IPPANJIN: "IPPANJIN",

  BANDMAN: "BANDMAN",

  HEADLINER: "HEADLINER",

  LEGEND: "LEGEND"

};


const FORMATION_RARITY_FILTER_ALL =
  "ALL";


const FORMATION_RARITY_FILTERS = [
  FORMATION_RARITY_FILTER_ALL,
  CHARACTER_RARITY.IPPANJIN,
  CHARACTER_RARITY.BANDMAN,
  CHARACTER_RARITY.HEADLINER,
  CHARACTER_RARITY.LEGEND
];


function getCharacterRarity(character) {

  if (!character || !character.rarity) {

    return null;

  }

  return character.rarity;

}


function characterMatchesRarityFilter(
  character,
  filter
) {

  if (
    !filter ||
    filter ===
      FORMATION_RARITY_FILTER_ALL
  ) {

    return true;

  }

  return (
    getCharacterRarity(character) ===
    filter
  );

}


function getCharacterGroup(character) {

  if (
    !character ||
    typeof character.group !==
      "string"
  ) {

    return "";

  }

  const group =
    character.group.trim();

  return group;

}


function getAllyCharacterNumberLabel(
  character
) {

  if (!character) {

    return "";

  }

  const number =
    Number(character.number);

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {

    return "";

  }

  return (
    "C-" +
    String(number).padStart(3, "0")
  );

}


function getRarityLabel(rarity) {

  if (
    rarity ===
    CHARACTER_RARITY.BANDMAN
  ) {

    return "★★ BANDMAN";

  }

  if (
    rarity ===
    CHARACTER_RARITY.HEADLINER
  ) {

    return "★★★ HEADLINER";

  }

  if (
    rarity ===
    CHARACTER_RARITY.LEGEND
  ) {

    return "★★★★ LEGEND";

  }

  return "★ IPPANJIN";

}


let enhanceRarityFilter =
  FORMATION_RARITY_FILTER_ALL;


function getEnhanceCardProgress(characterId) {

  ensureCharacterProgressEntry(
    characterId
  );

  const progress =
    getCharacterProgress(
      characterId
    );

  if (progress) {

    return progress;

  }

  return createDefaultCharacterProgress();

}


function openEnhanceList() {

  enhanceRarityFilter =
    FORMATION_RARITY_FILTER_ALL;

  if (ensureOwnedCharacterProgress()) {

    saveCharacterProgress();

  }

  renderEnhanceList();

  showScreen(enhanceScreen);

}


function closeEnhanceList() {

  showScreen(trainingScreen);

}


function setEnhanceRarityFilter(filter) {

  if (
    FORMATION_RARITY_FILTERS.indexOf(
      filter
    ) === -1
  ) {

    return;

  }

  enhanceRarityFilter = filter;

  renderEnhanceList();

}


function renderEnhanceList() {

  const list =
    document.getElementById(
      "enhance-list"
    );

  const filterButtons =
    document.querySelectorAll(
      "#enhance-filters .enhance-filter"
    );


  if (!list) {

    return;

  }


  filterButtons.forEach((button) => {

    button.classList.toggle(
      "is-selected",
      button.dataset.filter ===
        enhanceRarityFilter
    );

  });


  list.innerHTML = "";


  const ownedRoster =
    Object.values(CHARACTERS).filter(
      (character) => {

        return isCharacterOwned(
          character.id
        );

      }
    );

  const visibleRoster =
    ownedRoster.filter(
      (character) => {

        return characterMatchesRarityFilter(
          character,
          enhanceRarityFilter
        );

      }
    );


  if (visibleRoster.length === 0) {

    const empty =
      document.createElement("div");

    empty.className =
      "enhance-empty";

    empty.textContent =
      "該当するキャラクターがいません";

    list.appendChild(empty);

    return;

  }


  visibleRoster.forEach((character) => {

    const progress =
      getEnhanceCardProgress(
        character.id
      );

    const card =
      document.createElement("button");

    card.type = "button";

    card.className =
      "enhance-card";

    card.dataset.characterId =
      character.id;

    const imageWrap =
      document.createElement("div");

    imageWrap.className =
      "enhance-card-image";

    const displayForm =
      getHighestUnlockedCharacterForm(
        character
      ) || character;

    const image =
      document.createElement("img");

    image.src =
      displayForm.images &&
      displayForm.images.menu
        ? displayForm.images.menu
        : character.images.menu;

    image.alt =
      character.name;

    image.draggable =
      false;

    const menuScale =
      getCharacterMenuScale(
        displayForm
      );

    image.style.width =
      menuScale * 100 + "%";

    image.style.height =
      menuScale * 100 + "%";

    imageWrap.appendChild(image);


    const inner =
      document.createElement("div");

    inner.className =
      "enhance-card-inner";


    const info =
      document.createElement("div");

    info.className =
      "enhance-card-info";

    const rarityRow =
      document.createElement("div");

    rarityRow.className =
      "enhance-card-rarity-row";

    const rarity =
      document.createElement("div");

    rarity.className =
      "enhance-card-rarity";

    rarity.textContent =
      getRarityLabel(
        getCharacterRarity(character)
      );

    rarityRow.appendChild(rarity);

    const numberLabel =
      getAllyCharacterNumberLabel(
        character
      );

    if (numberLabel) {

      const number =
        document.createElement("div");

      number.className =
        "enhance-card-number";

      number.textContent =
        numberLabel;

      rarityRow.appendChild(number);

    }

    const name =
      document.createElement("div");

    name.className =
      "enhance-card-name";

    name.textContent =
      character.name;

    const groupName =
      getCharacterGroup(character);

    const progressText =
      document.createElement("div");

    progressText.className =
      "enhance-card-progress";

    progressText.textContent =
      "Lv." +
      progress.level +
      " +" +
      progress.plus;

    info.appendChild(rarityRow);

    info.appendChild(name);

    if (groupName) {

      const group =
        document.createElement("div");

      group.className =
        "enhance-card-group";

      group.textContent =
        groupName;

      info.appendChild(group);

    }

    info.appendChild(progressText);

    inner.appendChild(imageWrap);

    inner.appendChild(info);

    card.appendChild(inner);

    card.addEventListener(
      "click",
      () => {

        openEnhanceDetail(
          character.id
        );

      }
    );

    list.appendChild(card);

  });

}


const enhanceBack =
  document.getElementById(
    "enhance-back"
  );


if (enhanceBack) {

  enhanceBack.addEventListener(
    "click",
    () => {

      closeEnhanceList();

    }
  );

}


const enhanceFilterButtons =
  document.querySelectorAll(
    "#enhance-filters .enhance-filter"
  );


enhanceFilterButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      setEnhanceRarityFilter(
        button.dataset.filter
      );

    }
  );

});


const evolveBack =
  document.getElementById(
    "evolve-back"
  );


if (evolveBack) {

  evolveBack.addEventListener(
    "click",
    () => {

      closeEvolveList();

    }
  );

}


const evolveFilterButtons =
  document.querySelectorAll(
    "#evolve-filters .enhance-filter"
  );


evolveFilterButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      setEvolveRarityFilter(
        button.dataset.filter
      );

    }
  );

});


let selectedEvolveCharacterId =
  null;

let isFormUnlockRevealPlaying =
  false;

let formUnlockRevealTimer =
  null;


function openEvolveDetail(characterId) {

  if (
    !characterId ||
    !CHARACTERS[characterId] ||
    !isCharacterOwned(characterId)
  ) {

    return;

  }

  selectedEvolveCharacterId =
    characterId;

  renderEvolveDetail();

  showScreen(evolveDetailScreen);

}


function closeEvolveDetail() {

  if (isFormUnlockRevealPlaying) {

    return;

  }

  selectedEvolveCharacterId =
    null;

  showScreen(evolveScreen);

  renderEvolveList();

}


function renderEvolveDetail() {

  const characterId =
    selectedEvolveCharacterId;

  const character =
    characterId
      ? CHARACTERS[characterId]
      : null;

  if (
    !character ||
    !evolveDetailScreen
  ) {

    return;

  }

  const progress =
    getEnhanceCardProgress(
      characterId
    );

  const level =
    clampCharacterLevel(
      progress.level
    );

  const plus =
    clampCharacterPlus(
      progress.plus
    );

  const unlockedForms =
    Array.isArray(
      progress.unlockedForms
    )
      ? progress.unlockedForms
      : [1];

  const currentFormNumber =
    getHighestUnlockedCharacterFormNumber(
      character
    );

  const currentForm =
    getHighestUnlockedCharacterForm(
      character
    ) ||
    getCharacterForm(
      character,
      1
    ) ||
    character;

  const nextFormNumber =
    currentFormNumber + 1;

  const nextForm =
    getCharacterForm(
      character,
      nextFormNumber
    );

  const hasNextUnlockFlag =
    unlockedForms.indexOf(
      nextFormNumber
    ) !== -1;

  const canEvolveLevel =
    level >= CHARACTER_LEVEL_MAX;

  const nextFormReady =
    !!(
      nextForm &&
      nextForm.images &&
      nextForm.images.menu
    );

  const canEvolve =
    nextFormReady &&
    canEvolveLevel &&
    !hasNextUnlockFlag &&
    nextFormNumber === 2;


  const labelCurrent =
    document.getElementById(
      "evolve-detail-label-current"
    );

  if (labelCurrent) {

    labelCurrent.textContent =
      getCharacterFormLabel(
        currentFormNumber
      );

  }

  const labelNext =
    document.getElementById(
      "evolve-detail-label-next"
    );

  if (labelNext) {

    labelNext.textContent =
      getCharacterFormLabel(
        nextFormNumber
      );

  }


  const image =
    document.getElementById(
      "evolve-detail-image"
    );

  if (image) {

    image.src =
      currentForm.images &&
      currentForm.images.menu
        ? currentForm.images.menu
        : character.images.menu;

    image.alt =
      character.name;

    const menuScale =
      getCharacterMenuScale(
        currentForm
      );

    image.style.width =
      menuScale * 100 + "%";

    image.style.height =
      menuScale * 100 + "%";

  }

  const numberEl =
    document.getElementById(
      "evolve-detail-number"
    );

  if (numberEl) {

    numberEl.textContent =
      getAllyCharacterNumberLabel(
        character
      );

  }

  const rarityEl =
    document.getElementById(
      "evolve-detail-rarity"
    );

  if (rarityEl) {

    rarityEl.textContent =
      getRarityLabel(
        getCharacterRarity(character)
      );

  }

  const nameEl =
    document.getElementById(
      "evolve-detail-name"
    );

  if (nameEl) {

    nameEl.textContent =
      character.name;

  }

  const groupEl =
    document.getElementById(
      "evolve-detail-group"
    );

  if (groupEl) {

    groupEl.textContent =
      getCharacterGroup(character);

  }

  const levelEl =
    document.getElementById(
      "evolve-detail-level"
    );

  if (levelEl) {

    levelEl.textContent =
      "Lv." +
      level +
      " +" +
      plus;

  }

  const nextWrap =
    document.getElementById(
      "evolve-detail-next-wrap"
    );

  const nextImage =
    document.getElementById(
      "evolve-detail-next-image"
    );

  const nextMark =
    document.getElementById(
      "evolve-detail-next-mark"
    );

  const nextNameEl =
    document.getElementById(
      "evolve-detail-next-name"
    );

  if (nextFormReady) {

    if (nextWrap) {

      nextWrap.classList.toggle(
        "evolve-detail-locked",
        !hasNextUnlockFlag
      );

      nextWrap.classList.toggle(
        "is-silhouette",
        !hasNextUnlockFlag
      );

    }

    if (nextImage) {

      nextImage.hidden = false;

      nextImage.src =
        nextForm.images.menu;

      nextImage.alt =
        hasNextUnlockFlag
          ? character.name
          : "";

      const nextScale =
        getCharacterMenuScale(
          nextForm
        );

      nextImage.style.width =
        nextScale * 100 + "%";

      nextImage.style.height =
        nextScale * 100 + "%";

    }

    if (nextMark) {

      nextMark.hidden = true;

    }

    if (nextNameEl) {

      nextNameEl.textContent =
        hasNextUnlockFlag
          ? character.name
          : "???";

    }

  } else {

    if (nextWrap) {

      nextWrap.classList.add(
        "evolve-detail-locked"
      );

      nextWrap.classList.remove(
        "is-silhouette"
      );

    }

    if (nextImage) {

      nextImage.hidden = true;

      nextImage.removeAttribute(
        "src"
      );

      nextImage.alt = "";

    }

    if (nextMark) {

      nextMark.hidden = false;

    }

    if (nextNameEl) {

      nextNameEl.textContent =
        "???";

    }

  }

  const nextNoteEl =
    document.getElementById(
      "evolve-detail-next-note"
    );

  if (nextNoteEl) {

    nextNoteEl.textContent =
      !nextFormReady
        ? (
            getCharacterFormLabel(
              nextFormNumber
            ) +
            "データ未実装"
          )
        : "";

  }

  const compareHp =
    document.getElementById(
      "evolve-detail-compare-hp"
    );

  const compareAttack =
    document.getElementById(
      "evolve-detail-compare-attack"
    );

  const compareYani =
    document.getElementById(
      "evolve-detail-compare-yani"
    );

  const currentCombat =
    calculateCharacterCombatStats(
      currentForm,
      level,
      plus
    );

  const currentYani =
    Number(
      currentForm.stats &&
      currentForm.stats.yaniCost
    ) || 0;

  if (nextForm && nextForm.stats) {

    const nextCombat =
      calculateCharacterCombatStats(
        nextForm,
        level,
        plus
      );

    const nextYani =
      Number(
        nextForm.stats.yaniCost
      ) || 0;

    if (compareHp) {

      compareHp.textContent =
        currentCombat.hp +
        " → " +
        nextCombat.hp;

    }

    if (compareAttack) {

      compareAttack.textContent =
        currentCombat.attack +
        " → " +
        nextCombat.attack;

    }

    if (compareYani) {

      compareYani.textContent =
        currentYani +
        " → " +
        nextYani;

    }

  } else {

    if (compareHp) {

      compareHp.textContent =
        currentCombat.hp +
        " → ???";

    }

    if (compareAttack) {

      compareAttack.textContent =
        currentCombat.attack +
        " → ???";

    }

    if (compareYani) {

      compareYani.textContent =
        currentYani +
        " → ???";

    }

  }

  const statusEl =
    document.getElementById(
      "evolve-detail-condition-status"
    );

  if (statusEl) {

    if (
      unlockedForms.indexOf(2) !==
      -1 &&
      nextFormNumber > 2
    ) {

      statusEl.textContent =
        "Lv." +
        level +
        " / " +
        CHARACTER_LEVEL_MAX +
        "  解放済み";

      statusEl.classList.add(
        "is-met"
      );

      statusEl.classList.remove(
        "is-unmet"
      );

    } else if (hasNextUnlockFlag) {

      statusEl.textContent =
        "Lv." +
        level +
        " / " +
        CHARACTER_LEVEL_MAX +
        "  解放済み";

      statusEl.classList.add(
        "is-met"
      );

      statusEl.classList.remove(
        "is-unmet"
      );

    } else {

      statusEl.textContent =
        "Lv." +
        level +
        " / " +
        CHARACTER_LEVEL_MAX +
        "  " +
        (
          canEvolveLevel
            ? "達成"
            : "未達成"
        );

      statusEl.classList.toggle(
        "is-met",
        canEvolveLevel
      );

      statusEl.classList.toggle(
        "is-unmet",
        !canEvolveLevel
      );

    }

  }

  const confirmButton =
    document.getElementById(
      "evolve-detail-confirm"
    );

  if (confirmButton) {

    if (hasNextUnlockFlag) {

      confirmButton.disabled =
        true;

      confirmButton.textContent =
        "解放済み";

    } else if (!nextFormReady) {

      confirmButton.disabled =
        true;

      confirmButton.textContent =
        "未実装";

    } else if (canEvolve) {

      confirmButton.disabled =
        false;

      confirmButton.textContent =
        "進化する";

    } else {

      confirmButton.disabled =
        true;

      confirmButton.textContent =
        "条件未達成";

    }

  }

}


const evolveDetailBack =
  document.getElementById(
    "evolve-detail-back"
  );


if (evolveDetailBack) {

  evolveDetailBack.addEventListener(
    "click",
    () => {

      closeEvolveDetail();

    }
  );

}


const evolveDetailConfirm =
  document.getElementById(
    "evolve-detail-confirm"
  );


function canUnlockCharacterForm2(
  characterId
) {

  const character =
    characterId
      ? CHARACTERS[characterId]
      : null;

  if (!character) {

    return false;

  }

  const form2 =
    getCharacterForm(
      character,
      2
    );

  if (
    !form2 ||
    !form2.images ||
    !form2.images.menu
  ) {

    return false;

  }

  const progress =
    getEnhanceCardProgress(
      characterId
    );

  if (
    clampCharacterLevel(
      progress.level
    ) < CHARACTER_LEVEL_MAX
  ) {

    return false;

  }

  const unlockedForms =
    Array.isArray(
      progress.unlockedForms
    )
      ? progress.unlockedForms
      : [1];

  if (
    unlockedForms.indexOf(2) !==
    -1
  ) {

    return false;

  }

  return true;

}


function unlockCharacterForm2(
  characterId
) {

  if (
    !canUnlockCharacterForm2(
      characterId
    )
  ) {

    return null;

  }

  const progress =
    getEnhanceCardProgress(
      characterId
    );

  if (
    !Array.isArray(
      progress.unlockedForms
    )
  ) {

    progress.unlockedForms = [1];

  }

  if (
    progress.unlockedForms
      .indexOf(2) === -1
  ) {

    progress.unlockedForms.push(
      2
    );

  }

  progress.activeForm = 2;

  saveCharacterProgress();

  return progress;

}


function hideFormUnlockReveal() {

  const overlay =
    document.getElementById(
      "form-unlock-overlay"
    );

  if (!overlay) {

    return;

  }

  overlay.classList.remove(
    "is-visible"
  );

  overlay.hidden = true;

}


function playForm2UnlockReveal(
  character,
  form2,
  onComplete
) {

  const overlay =
    document.getElementById(
      "form-unlock-overlay"
    );

  const image =
    document.getElementById(
      "form-unlock-image"
    );

  const label =
    document.getElementById(
      "form-unlock-label"
    );

  const nameEl =
    document.getElementById(
      "form-unlock-name"
    );

  if (
    !overlay ||
    !image ||
    !character ||
    !form2 ||
    !form2.images ||
    !form2.images.menu
  ) {

    if (
      typeof onComplete ===
      "function"
    ) {

      onComplete();

    }

    return;

  }

  if (formUnlockRevealTimer) {

    clearTimeout(
      formUnlockRevealTimer
    );

    formUnlockRevealTimer =
      null;

  }

  image.src =
    form2.images.menu;

  image.alt =
    character.name;

  const menuScale =
    getCharacterMenuScale(
      form2
    );

  image.style.width =
    menuScale * 100 + "%";

  image.style.maxWidth =
    "min(42vw, 160px)";

  if (label) {

    label.textContent =
      "FORM-2 解放！";

  }

  if (nameEl) {

    nameEl.textContent =
      character.name;

  }

  overlay.hidden = false;

  // Force reflow so the fade-in transition runs.
  void overlay.offsetWidth;

  overlay.classList.add(
    "is-visible"
  );

  isFormUnlockRevealPlaying =
    true;

  formUnlockRevealTimer =
    setTimeout(() => {

      formUnlockRevealTimer =
        null;

      overlay.classList.remove(
        "is-visible"
      );

      setTimeout(() => {

        hideFormUnlockReveal();

        isFormUnlockRevealPlaying =
          false;

        if (
          typeof onComplete ===
          "function"
        ) {

          onComplete();

        }

      }, 240);

    }, 1400);

}


function tryEvolveSelectedCharacter() {

  if (isFormUnlockRevealPlaying) {

    return;

  }

  const characterId =
    selectedEvolveCharacterId;

  if (!characterId) {

    return;

  }

  if (
    !canUnlockCharacterForm2(
      characterId
    )
  ) {

    return;

  }

  const character =
    CHARACTERS[characterId];

  const form2 =
    getCharacterForm(
      character,
      2
    );

  const progress =
    unlockCharacterForm2(
      characterId
    );

  if (!progress) {

    return;

  }

  playForm2UnlockReveal(
    character,
    form2,
    () => {

      if (
        selectedEvolveCharacterId ===
        characterId
      ) {

        renderEvolveDetail();

      }

    }
  );

}


if (evolveDetailConfirm) {

  evolveDetailConfirm.addEventListener(
    "click",
    () => {

      tryEvolveSelectedCharacter();

    }
  );

}


let evolveRarityFilter =
  FORMATION_RARITY_FILTER_ALL;


function openEvolveList() {

  evolveRarityFilter =
    FORMATION_RARITY_FILTER_ALL;

  if (ensureOwnedCharacterProgress()) {

    saveCharacterProgress();

  }

  renderEvolveList();

  showScreen(evolveScreen);

}


function closeEvolveList() {

  showScreen(trainingScreen);

}


function setEvolveRarityFilter(filter) {

  if (
    FORMATION_RARITY_FILTERS.indexOf(
      filter
    ) === -1
  ) {

    return;

  }

  evolveRarityFilter = filter;

  renderEvolveList();

}


function renderEvolveList() {

  const list =
    document.getElementById(
      "evolve-list"
    );

  const filterButtons =
    document.querySelectorAll(
      "#evolve-filters .enhance-filter"
    );


  if (!list) {

    return;

  }


  filterButtons.forEach((button) => {

    button.classList.toggle(
      "is-selected",
      button.dataset.filter ===
        evolveRarityFilter
    );

  });


  list.innerHTML = "";


  const ownedRoster =
    Object.values(CHARACTERS).filter(
      (character) => {

        return isCharacterOwned(
          character.id
        );

      }
    );

  const visibleRoster =
    ownedRoster.filter(
      (character) => {

        return characterMatchesRarityFilter(
          character,
          evolveRarityFilter
        );

      }
    );


  if (visibleRoster.length === 0) {

    const empty =
      document.createElement("div");

    empty.className =
      "enhance-empty";

    empty.textContent =
      "該当するキャラクターがいません";

    list.appendChild(empty);

    return;

  }


  visibleRoster.forEach((character) => {

    const progress =
      getEnhanceCardProgress(
        character.id
      );

    const card =
      document.createElement("button");

    card.type = "button";

    card.className =
      "enhance-card";

    card.dataset.characterId =
      character.id;

    const imageWrap =
      document.createElement("div");

    imageWrap.className =
      "enhance-card-image";

    const displayForm =
      getHighestUnlockedCharacterForm(
        character
      ) || character;

    const image =
      document.createElement("img");

    image.src =
      displayForm.images &&
      displayForm.images.menu
        ? displayForm.images.menu
        : character.images.menu;

    image.alt =
      character.name;

    image.draggable =
      false;

    const menuScale =
      getCharacterMenuScale(
        displayForm
      );

    image.style.width =
      menuScale * 100 + "%";

    image.style.height =
      menuScale * 100 + "%";

    imageWrap.appendChild(image);


    const inner =
      document.createElement("div");

    inner.className =
      "enhance-card-inner";


    const info =
      document.createElement("div");

    info.className =
      "enhance-card-info";

    const rarityRow =
      document.createElement("div");

    rarityRow.className =
      "enhance-card-rarity-row";

    const rarity =
      document.createElement("div");

    rarity.className =
      "enhance-card-rarity";

    rarity.textContent =
      getRarityLabel(
        getCharacterRarity(character)
      );

    rarityRow.appendChild(rarity);

    const numberLabel =
      getAllyCharacterNumberLabel(
        character
      );

    if (numberLabel) {

      const number =
        document.createElement("div");

      number.className =
        "enhance-card-number";

      number.textContent =
        numberLabel;

      rarityRow.appendChild(number);

    }

    const name =
      document.createElement("div");

    name.className =
      "enhance-card-name";

    name.textContent =
      character.name;

    const groupName =
      getCharacterGroup(character);

    const progressText =
      document.createElement("div");

    progressText.className =
      "enhance-card-progress";

    progressText.textContent =
      "Lv." +
      progress.level +
      " +" +
      progress.plus;

    info.appendChild(rarityRow);

    info.appendChild(name);

    if (groupName) {

      const group =
        document.createElement("div");

      group.className =
        "enhance-card-group";

      group.textContent =
        groupName;

      info.appendChild(group);

    }

    info.appendChild(progressText);

    inner.appendChild(imageWrap);

    inner.appendChild(info);

    card.appendChild(inner);

    card.addEventListener(
      "click",
      () => {

        openEvolveDetail(
          character.id
        );

      }
    );

    list.appendChild(card);

  });

}


const CHARACTER_LEVEL_MIN = 1;

const CHARACTER_LEVEL_MAX = 10;

const CHARACTER_PLUS_MAX = 10;


let selectedEnhanceCharacterId =
  null;


function clampCharacterLevel(level) {

  const value =
    Number(level);

  if (!Number.isInteger(value)) {

    return CHARACTER_LEVEL_MIN;

  }

  if (value < CHARACTER_LEVEL_MIN) {

    return CHARACTER_LEVEL_MIN;

  }

  if (value > CHARACTER_LEVEL_MAX) {

    return CHARACTER_LEVEL_MAX;

  }

  return value;

}


function clampCharacterPlus(plus) {

  const value =
    Number(plus);

  if (!Number.isInteger(value)) {

    return 0;

  }

  if (value < 0) {

    return 0;

  }

  if (value > CHARACTER_PLUS_MAX) {

    return CHARACTER_PLUS_MAX;

  }

  return value;

}


function getLevelStatMultiplier(level) {

  const lv =
    clampCharacterLevel(level);

  return 1 + 0.1 * (lv - 1);

}


function getPlusStatMultiplier(plus) {

  const value =
    clampCharacterPlus(plus);

  return 1 + 0.02 * value;

}


function roundCharacterStat(value) {

  return Math.round(Number(value) || 0);

}


function getCharacterBaseCombatStats(
  character
) {

  const stats =
    character &&
    character.stats;

  return {

    hp:
      Number(
        stats &&
        stats.hp
      ) || 0,

    attack:
      Number(
        stats &&
        stats.attack
      ) || 0

  };

}


function calculateCharacterCombatStats(
  character,
  level,
  plus
) {

  const base =
    getCharacterBaseCombatStats(
      character
    );

  const multiplier =
    getLevelStatMultiplier(level) *
    getPlusStatMultiplier(plus);

  return {

    hp:
      roundCharacterStat(
        base.hp * multiplier
      ),

    attack:
      roundCharacterStat(
        base.attack * multiplier
      )

  };

}


function getCharacterStatAtProgress(
  character,
  progress
) {

  const level =
    progress &&
    progress.level != null
      ? progress.level
      : CHARACTER_LEVEL_MIN;

  const plus =
    progress &&
    progress.plus != null
      ? progress.plus
      : 0;

  return calculateCharacterCombatStats(
    character,
    level,
    plus
  );

}


const ENHANCE_LEVEL_UP_BEATS_BASE = {

  1: 100,

  2: 150,

  3: 200,

  4: 300,

  5: 450,

  6: 650,

  7: 900,

  8: 1200,

  9: 1500

};


const ENHANCE_RARITY_BEATS_MULTIPLIER = {

  [CHARACTER_RARITY.IPPANJIN]: 1.0,

  [CHARACTER_RARITY.BANDMAN]: 1.5,

  [CHARACTER_RARITY.HEADLINER]: 2.0,

  [CHARACTER_RARITY.LEGEND]: 2.5

};


function getEnhanceRarityBeatsMultiplier(
  rarity
) {

  const multiplier =
    ENHANCE_RARITY_BEATS_MULTIPLIER[
      rarity
    ];

  if (typeof multiplier !== "number") {

    return 1.0;

  }

  return multiplier;

}


function getEnhanceLevelUpBeats(
  character,
  level
) {

  const lv =
    clampCharacterLevel(level);

  if (lv >= CHARACTER_LEVEL_MAX) {

    return null;

  }

  const baseCost =
    ENHANCE_LEVEL_UP_BEATS_BASE[lv];

  if (typeof baseCost !== "number") {

    return null;

  }

  const multiplier =
    getEnhanceRarityBeatsMultiplier(
      getCharacterRarity(character)
    );

  return Math.round(
    baseCost * multiplier
  );

}


function formatEnhanceStatPreview(
  currentValue,
  nextValue,
  isMaxLevel
) {

  if (isMaxLevel) {

    return String(currentValue);

  }

  return (
    currentValue +
    " → " +
    nextValue
  );

}


function openEnhanceDetail(characterId) {

  if (
    !characterId ||
    !CHARACTERS[characterId] ||
    !isCharacterOwned(characterId)
  ) {

    return;

  }

  selectedEnhanceCharacterId =
    characterId;

  renderEnhanceDetail();

  showScreen(enhanceDetailScreen);

}


function closeEnhanceDetail() {

  selectedEnhanceCharacterId =
    null;

  showScreen(enhanceScreen);

  renderEnhanceList();

}


function renderEnhanceDetail() {

  const characterId =
    selectedEnhanceCharacterId;

  const character =
    characterId
      ? CHARACTERS[characterId]
      : null;

  if (
    !character ||
    !enhanceDetailScreen
  ) {

    return;

  }

  const progress =
    getEnhanceCardProgress(
      characterId
    );

  const level =
    clampCharacterLevel(
      progress.level
    );

  const plus =
    clampCharacterPlus(
      progress.plus
    );

  const isMaxLevel =
    level >= CHARACTER_LEVEL_MAX;

  const displayForm =
    getHighestUnlockedCharacterForm(
      character
    ) || character;

  const currentStats =
    calculateCharacterCombatStats(
      displayForm,
      level,
      plus
    );

  const nextStats =
    isMaxLevel
      ? currentStats
      : calculateCharacterCombatStats(
          displayForm,
          level + 1,
          plus
        );

  const needBeats =
    getEnhanceLevelUpBeats(
      character,
      level
    );


  const image =
    document.getElementById(
      "enhance-detail-image"
    );

  if (image) {

    image.src =
      displayForm.images &&
      displayForm.images.menu
        ? displayForm.images.menu
        : character.images.menu;

    image.alt =
      character.name;

    const menuScale =
      getCharacterMenuScale(
        displayForm
      );

    image.style.width =
      menuScale * 100 + "%";

    image.style.height =
      menuScale * 100 + "%";

  }


  const numberEl =
    document.getElementById(
      "enhance-detail-number"
    );

  if (numberEl) {

    numberEl.textContent =
      getAllyCharacterNumberLabel(
        character
      );

  }

  const rarityEl =
    document.getElementById(
      "enhance-detail-rarity"
    );

  if (rarityEl) {

    rarityEl.textContent =
      getRarityLabel(
        getCharacterRarity(character)
      );

  }

  const nameEl =
    document.getElementById(
      "enhance-detail-name"
    );

  if (nameEl) {

    nameEl.textContent =
      character.name;

  }

  const groupEl =
    document.getElementById(
      "enhance-detail-group"
    );

  if (groupEl) {

    groupEl.textContent =
      getCharacterGroup(character);

  }

  const levelEl =
    document.getElementById(
      "enhance-detail-level"
    );

  if (levelEl) {

    if (isMaxLevel) {

      levelEl.textContent =
        "Lv." +
        level +
        " MAX  +" +
        plus;

    } else {

      levelEl.textContent =
        "Lv." +
        level +
        " +" +
        plus;

    }

  }

  const hpEl =
    document.getElementById(
      "enhance-detail-hp"
    );

  if (hpEl) {

    hpEl.textContent =
      formatEnhanceStatPreview(
        currentStats.hp,
        nextStats.hp,
        isMaxLevel
      );

  }

  const attackEl =
    document.getElementById(
      "enhance-detail-attack"
    );

  if (attackEl) {

    attackEl.textContent =
      formatEnhanceStatPreview(
        currentStats.attack,
        nextStats.attack,
        isMaxLevel
      );

  }

  const ownedBeatsEl =
    document.getElementById(
      "enhance-detail-owned-beats"
    );

  if (ownedBeatsEl) {

    ownedBeatsEl.textContent =
      String(getBeats());

  }

  const needBeatsEl =
    document.getElementById(
      "enhance-detail-need-beats"
    );

  if (needBeatsEl) {

    if (
      isMaxLevel ||
      needBeats == null
    ) {

      needBeatsEl.textContent =
        "—";

    } else {

      needBeatsEl.textContent =
        String(needBeats);

    }

  }

  const confirmButton =
    document.getElementById(
      "enhance-detail-confirm"
    );

  if (confirmButton) {

    if (isMaxLevel) {

      confirmButton.disabled =
        true;

      confirmButton.textContent =
        "MAX";

    } else if (
      needBeats == null
    ) {

      confirmButton.disabled =
        true;

      confirmButton.textContent =
        "強化する";

    } else if (
      getBeats() < needBeats
    ) {

      confirmButton.disabled =
        true;

      confirmButton.textContent =
        "ビーツ不足";

    } else {

      confirmButton.disabled =
        false;

      confirmButton.textContent =
        "強化する";

    }

  }

  const isMaxPlus =
    plus >= CHARACTER_PLUS_MAX;

  const needFragments =
    getPlusEnhanceFragmentCost(
      character
    );

  const ownedFragments =
    getCharacterFragmentCount(
      characterId
    );

  const fragmentNameEl =
    document.getElementById(
      "enhance-detail-fragment-name"
    );

  if (fragmentNameEl) {

    fragmentNameEl.textContent =
      getCharacterFragmentLabel(
        character
      );

  }

  const ownedFragmentsEl =
    document.getElementById(
      "enhance-detail-owned-fragments"
    );

  if (ownedFragmentsEl) {

    ownedFragmentsEl.textContent =
      String(ownedFragments);

  }

  const needFragmentsEl =
    document.getElementById(
      "enhance-detail-need-fragments"
    );

  if (needFragmentsEl) {

    needFragmentsEl.textContent =
      isMaxPlus
        ? "—"
        : String(needFragments);

  }

  const plusConfirmButton =
    document.getElementById(
      "enhance-detail-plus-confirm"
    );

  if (plusConfirmButton) {

    if (isMaxPlus) {

      plusConfirmButton.disabled =
        true;

      plusConfirmButton.textContent =
        "MAX";

    } else if (
      ownedFragments < needFragments
    ) {

      plusConfirmButton.disabled =
        true;

      plusConfirmButton.textContent =
        "かけら不足";

    } else {

      plusConfirmButton.disabled =
        false;

      plusConfirmButton.textContent =
        "+強化";

    }

  }

}


function tryEnhanceCharacterLevelUp(
  characterId
) {

  if (
    !characterId ||
    !CHARACTERS[characterId] ||
    !isCharacterOwned(characterId)
  ) {

    return false;

  }

  ensureCharacterProgressEntry(
    characterId
  );

  const progress =
    getCharacterProgress(
      characterId
    );

  if (!progress) {

    return false;

  }

  const level =
    clampCharacterLevel(
      progress.level
    );

  if (level >= CHARACTER_LEVEL_MAX) {

    return false;

  }

  const character =
    CHARACTERS[characterId];

  const cost =
    getEnhanceLevelUpBeats(
      character,
      level
    );

  if (
    cost == null ||
    cost <= 0
  ) {

    return false;

  }

  if (getBeats() < cost) {

    return false;

  }

  if (!spendBeats(cost)) {

    return false;

  }

  const savedProgress =
    getCharacterProgress(
      characterId
    );

  if (!savedProgress) {

    return false;

  }

  const currentLevel =
    clampCharacterLevel(
      savedProgress.level
    );

  if (
    currentLevel >=
    CHARACTER_LEVEL_MAX
  ) {

    return false;

  }

  savedProgress.level =
    currentLevel + 1;

  characterProgress[characterId] =
    sanitizeCharacterProgressEntry(
      savedProgress
    );

  saveCharacterProgress();

  renderEnhanceDetail();

  return true;

}


const enhanceDetailBack =
  document.getElementById(
    "enhance-detail-back"
  );


if (enhanceDetailBack) {

  enhanceDetailBack.addEventListener(
    "click",
    () => {

      closeEnhanceDetail();

    }
  );

}


const enhanceDetailConfirm =
  document.getElementById(
    "enhance-detail-confirm"
  );


if (enhanceDetailConfirm) {

  enhanceDetailConfirm.addEventListener(
    "click",
    () => {

      if (
        !selectedEnhanceCharacterId
      ) {

        return;

      }

      tryEnhanceCharacterLevelUp(
        selectedEnhanceCharacterId
      );

    }
  );

}


const enhanceDetailPlusConfirm =
  document.getElementById(
    "enhance-detail-plus-confirm"
  );


if (enhanceDetailPlusConfirm) {

  enhanceDetailPlusConfirm.addEventListener(
    "click",
    () => {

      if (
        !selectedEnhanceCharacterId
      ) {

        return;

      }

      tryEnhanceCharacterPlus(
        selectedEnhanceCharacterId
      );

    }
  );

}


const ATTACK_TYPE = {

  MELEE_SINGLE: "meleeSingle",

  MELEE_AOE: "meleeAoE",

  FRONT_AOE: "frontAoE",

  DROP_AOE: "dropAoE",

  PROJECTILE_SINGLE: "projectileSingle",

  PROJECTILE_AOE: "projectileAoE",

  PIERCING_PROJECTILE: "piercingProjectile",

  CYCLING_PROJECTILE: "cyclingProjectile",

  DELAYED_MULTI_HIT_SINGLE:
    "delayedMultiHitSingle"

};


function getAttackBehavior(character) {

  if (
    character &&
    character.attackBehavior &&
    character.attackBehavior.type
  ) {

    return character.attackBehavior;

  }

  return {

    type: ATTACK_TYPE.MELEE_SINGLE

  };

}


function isProjectileAttackType(behavior) {

  const type =
    behavior &&
    behavior.type;

  return (
    type ===
      ATTACK_TYPE.PROJECTILE_SINGLE ||
    type ===
      ATTACK_TYPE.PROJECTILE_AOE ||
    type ===
      ATTACK_TYPE.PIERCING_PROJECTILE ||
    type ===
      ATTACK_TYPE.CYCLING_PROJECTILE
  );

}


function getCyclingProjectileStages(
  behavior
) {

  if (
    !behavior ||
    !Array.isArray(
      behavior.stages
    ) ||
    behavior.stages.length < 1
  ) {

    return null;

  }

  return behavior.stages;

}


function getUnitAttackStageIndex(
  unit,
  behavior
) {

  const stages =
    getCyclingProjectileStages(
      behavior
    );

  if (!stages) {

    return 0;

  }

  const raw =
    Number(
      unit &&
      unit.currentAttackStage
    ) || 0;

  const index =
    Math.floor(raw) %
    stages.length;

  return index < 0
    ? index + stages.length
    : index;

}


function getCyclingProjectileStage(
  unit,
  behavior
) {

  const stages =
    getCyclingProjectileStages(
      behavior
    );

  if (!stages) {

    return null;

  }

  return stages[
    getUnitAttackStageIndex(
      unit,
      behavior
    )
  ];

}


function advanceUnitAttackStage(
  unit,
  behavior
) {

  const stages =
    getCyclingProjectileStages(
      behavior
    );

  if (
    !unit ||
    !stages
  ) {

    return;

  }

  unit.currentAttackStage =
    (
      getUnitAttackStageIndex(
        unit,
        behavior
      ) + 1
    ) %
    stages.length;

}


function applyAttackSelfRecoil(
  unit,
  distance,
  durationMs
) {

  if (
    !unit ||
    unit.dead ||
    !(
      typeof distance ===
        "number" &&
      distance > 0
    )
  ) {

    return false;

  }

  if (
    isHealthKnockbackActive(unit)
  ) {

    return false;

  }

  const duration =
    typeof durationMs ===
      "number" &&
    durationMs > 0
      ? durationMs
      : 200;

  const isPlayer =
    playerUnits.indexOf(unit) !==
    -1;

  const startX =
    unit.x;

  const rawTargetX =
    isPlayer
      ? startX - distance
      : startX + distance;

  unit.knockbackStartX =
    startX;

  unit.knockbackTargetX =
    clampHealthKnockbackX(
      unit,
      rawTargetX
    );

  unit.knockbackStartedAt =
    Date.now();

  unit.knockbackDurationMs =
    duration;

  // Shot recoil: slide only.
  // Do not force the hurt sprite.
  return true;

}


const CHARACTERS = {

  sena: {

    id: "sena",

    name: "せな",

    group: "令和黎明期",

    number: 1,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages("sena"),

    stats: {

      hp: 300,

      attack: 45,

      attackInterval: 900,

      speed: 1.2,

      range: 60,

      yaniCost: 150,

      deployCooldownMs: 1500

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 180,

      hurtSpriteMs: 280,

      deathKnockbackPx: 15,

      deathSecondMs: 120,

      deathWaitMs: 380

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE

    },

    unlock: {

      type: "initial"

    }

  },

  kaede: {

    id: "kaede",

    name: "楓",

    group: "令和黎明期",

    number: 2,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages("kaede"),

    stats: {

      hp: 220,

      attack: 16,

      attackInterval: 225,

      speed: 2.4,

      range: 45,

      yaniCost: 100,

      deployCooldownMs: 3000

    },

    battle: {

      spriteSize: 85,

      attackSpriteMs: 180,

      hurtSpriteMs: 280,

      deathKnockbackPx: 15,

      deathSecondMs: 120,

      deathWaitMs: 380

    },

    ui: {

      menuScale: 0.94

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE

    },

    traits: {

      healthKnockback: {

        thresholds: [0.75, 0.50, 0.25],

        distance: 70,

        durationMs: 180

      }

    },

    unlock: {

      type: "story",

      stage: 3

    }

  },

  kairi: {

    id: "kairi",

    name: "カイリ",

    group: "令和黎明期",

    number: 3,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages("kairi"),

    stats: {

      hp: 260,

      attack: 90,

      attackInterval: 2200,

      speed: 0.9,

      range: 150,

      yaniCost: 200,

      deployCooldownMs: 5000

    },

    battle: {

      spriteSize: 100,

      attackSpriteMs: 180,

      hurtSpriteMs: 280,

      deathKnockbackPx: 15,

      deathSecondMs: 120,

      deathWaitMs: 380

    },

    ui: {

      menuScale: 0.92

    },

    attackBehavior: {

      type: ATTACK_TYPE.PROJECTILE_AOE,

      projectileSpeed: 200,

      aoeRadius: 70,

      launchOffsetX: 36,

      launchDelayMs: 90,

      hitRadius: 28,

      effectImage:
        "images/characters/kairi/kairi_effect.webp",

      effectWidth: 96

    },

    unlock: {

      type: "story",

      stage: 5

    }

  },

  chris: {

    id: "chris",

    name: "Chris",

    group: "令和黎明期",

    number: 4,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages("chris"),

    stats: {

      hp: 280,

      attack: 110,

      attackInterval: 1500,

      speed: 1.0,

      range: 105,

      yaniCost: 180,

      deployCooldownMs: 4000

    },

    battle: {

      spriteSize: 90,

      attackSpriteMs: 180,

      hurtSpriteMs: 280,

      deathKnockbackPx: 15,

      deathSecondMs: 120,

      deathWaitMs: 380

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.PROJECTILE_SINGLE,

      projectileSpeed: 200,

      launchOffsetX: 36,

      launchDelayMs: 90,

      hitRadius: 28,

      effectImage:
        "images/characters/chris/chris_effect.webp",

      effectWidth: 100

    },

    traits: {

      attackKnockback: {

        chance: 0.10,

        distance: 80,

        durationMs: 200,

        effect:
          "images/characters/chris/chris_knockback_effect.webp",

        effectWidth: 120,

        effectDurationMs: 280

      },

      healthKnockback: {

        thresholds: [0.50],

        distance: 70,

        durationMs: 180

      }

    },

    unlock: {

      type: "story",

      stage: 7

    }

  },

  saizen_kanri_ojisan: {

    id: "saizen_kanri_ojisan",

    name: "最前管理おじさん",

    group: "ライブハウス民",

    number: 5,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "saizen_kanri_ojisan"
      ),

    stats: {

      hp: 600,

      attack: 8,

      attackInterval: 1500,

      speed: 0.40,

      range: 45,

      yaniCost: 100,

      deployCooldownMs: 1000

    },

    battle: {

      spriteSize: 100,

      attackSpriteMs: 180,

      hurtSpriteMs: 280,

      deathKnockbackPx: 15,

      deathSecondMs: 120,

      deathWaitMs: 380

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE

    },

    unlock: {

      type: "gacha"

    }

  },

  jizou_kids: {

    id: "jizou_kids",

    name: "地蔵キッズ",

    group: "ライブハウス民",

    number: 6,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "jizou_kids"
      ),

    stats: {

      hp: 750,

      attack: 12,

      attackInterval: 1500,

      speed: 0.30,

      range: 45,

      yaniCost: 180,

      deployCooldownMs: 4000

    },

    battle: {

      spriteSize: 95,

      attackSpriteMs: 220,

      hurtSpriteMs: 280,

      deathKnockbackPx: 15,

      deathSecondMs: 120,

      deathWaitMs: 380

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE

    },

    unlock: {

      type: "gacha"

    }

  },

  mosh_kids: {

    id: "mosh_kids",

    name: "モッシュキッズ",

    group: "ライブハウス民",

    number: 7,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "mosh_kids"
      ),

    stats: {

      hp: 230,

      attack: 32,

      attackInterval: 700,

      speed: 1.70,

      range: 42,

      yaniCost: 120,

      deployCooldownMs: 2200

    },

    battle: {

      spriteSize: 95,

      attackSpriteMs: 180,

      hurtSpriteMs: 260,

      deathKnockbackPx: 22,

      deathSecondMs: 120,

      deathWaitMs: 350

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE

    },

    unlock: {

      type: "gacha"

    }

  },

  diver: {

    id: "diver",

    name: "ダイバー",

    group: "ライブハウス民",

    number: 8,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "diver"
      ),

    stats: {

      hp: 90,

      attack: 48,

      attackInterval: 1600,

      speed: 1.10,

      range: 170,

      yaniCost: 140,

      deployCooldownMs: 3200

    },

    battle: {

      spriteSize: 100,

      attackSpriteMs: 260,

      hurtSpriteMs: 250,

      deathKnockbackPx: 30,

      deathSecondMs: 120,

      deathWaitMs: 320

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_AOE,

      aoeRadius: 65,

      dashToTarget: true,

      dashSpeed: 0.55,

      stopDistance: 35

    },

    unlock: {

      type: "gacha"

    }

  },

  deisui_niki: {

    id: "deisui_niki",

    name: "泥酔ニキ",

    group: "IPPANJIN",

    number: 9,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "deisui_niki"
      ),

    stats: {

      hp: 260,

      attack: 38,

      attackInterval: 1100,

      speed: 0.85,

      range: 45,

      yaniCost: 130,

      deployCooldownMs: 2500

    },

    battle: {

      spriteSize: 98,

      attackSpriteMs: 260,

      hurtSpriteMs: 300,

      deathKnockbackPx: 28,

      deathSecondMs: 130,

      deathWaitMs: 360

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE,

      lungeDistance: 55,

      lungeDurationMs: 240,

      lungeStopGap: 12

    },

    traits: {

      staggerWalk: {

        minMultiplier: 0.75,

        maxMultiplier: 1.25,

        periodMs: 1100

      }

    },

    unlock: {

      type: "gacha"

    }

  },

  buppan_gachiota: {

    id: "buppan_gachiota",

    name: "物販ガチオタ",

    group: "IPPANJIN",

    number: 10,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "buppan_gachiota"
      ),

    stats: {

      hp: 500,

      attack: 45,

      attackInterval: 1500,

      speed: 0.45,

      range: 45,

      yaniCost: 180,

      deployCooldownMs: 3500

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 280,

      hurtSpriteMs: 320,

      deathKnockbackPx: 20,

      deathSecondMs: 130,

      deathWaitMs: 360

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE

    },

    traits: {

      knockbackResistance: {

        attackMultiplier: 0.50

      },

      goodsScatter: {

        minCount: 2,

        maxCount: 4,

        lifetimeMs: 400

      }

    },

    unlock: {

      type: "gacha"

    }

  },

  tenkan_aniki: {

    id: "tenkan_aniki",

    name: "転換アニキ",

    group: "IPPANJIN",

    number: 11,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "tenkan_aniki"
      ),

    stats: {

      hp: 620,

      attack: 75,

      attackInterval: 1800,

      speed: 0.50,

      range: 55,

      yaniCost: 190,

      deployCooldownMs: 3800

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 320,

      hurtSpriteMs: 320,

      deathKnockbackPx: 24,

      deathSecondMs: 130,

      deathWaitMs: 380

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE,

      lungeDistance: 45,

      lungeDurationMs: 260,

      lungeStopGap: 12

    },

    unlock: {

      type: "gacha"

    }

  },

  reception_oneesan: {

    id: "reception_oneesan",

    name: "受付のヲ姉さん",

    group: "IPPANJIN",

    number: 12,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "reception_oneesan"
      ),

    stats: {

      hp: 220,

      attack: 38,

      attackInterval: 1250,

      speed: 0.65,

      range: 190,

      yaniCost: 140,

      deployCooldownMs: 2800

    },

    battle: {

      spriteSize: 100,

      attackSpriteMs: 300,

      hurtSpriteMs: 280,

      deathKnockbackPx: 20,

      deathSecondMs: 120,

      deathWaitMs: 350

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.PROJECTILE_SINGLE,

      projectileSpeed: 210,

      launchOffsetX: 34,

      launchDelayMs: 90,

      hitRadius: 28,

      effectImage:
        "images/characters/reception_oneesan/reception_oneesan_effect.webp",

      effectWidth: 72

    },

    unlock: {

      type: "gacha"

    }

  },

  headbang_gal: {

    id: "headbang_gal",

    name: "ヘドバンぎゃる☆",

    group: "IPPANJIN",

    number: 13,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "headbang_gal"
      ),

    stats: {

      hp: 280,

      attack: 52,

      attackInterval: 1000,

      speed: 1.05,

      range: 80,

      yaniCost: 150,

      deployCooldownMs: 2800

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 300,

      hurtSpriteMs: 280,

      deathKnockbackPx: 24,

      deathSecondMs: 120,

      deathWaitMs: 350

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE

    },

    unlock: {

      type: "gacha"

    }

  },

  bandman_girlfriend: {

    id: "bandman_girlfriend",

    name: "多分バンドマンの彼女",

    group: "IPPANJIN",

    number: 14,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "bandman_girlfriend"
      ),

    stats: {

      hp: 260,

      attack: 65,

      attackInterval: 1600,

      speed: 0.60,

      range: 210,

      yaniCost: 170,

      deployCooldownMs: 3300

    },

    battle: {

      spriteSize: 100,

      attackSpriteMs: 320,

      hurtSpriteMs: 280,

      deathKnockbackPx: 20,

      deathSecondMs: 120,

      deathWaitMs: 350

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.PROJECTILE_SINGLE,

      projectileSpeed: 165,

      launchOffsetX: 36,

      launchDelayMs: 100,

      hitRadius: 30,

      effectImage:
        "images/characters/bandman_girlfriend/bandman_girlfriend_effect.webp",

      effectWidth: 88

    },

    unlock: {

      type: "gacha"

    }

  },

  cheki_neki: {

    id: "cheki_neki",

    name: "チェキネキ",

    group: "IPPANJIN",

    number: 15,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "cheki_neki"
      ),

    stats: {

      hp: 180,

      attack: 70,

      attackInterval: 2200,

      speed: 0.90,

      range: 120,

      yaniCost: 160,

      deployCooldownMs: 3200

    },

    battle: {

      spriteSize: 100,

      attackSpriteMs: 340,

      hurtSpriteMs: 300,

      deathKnockbackPx: 24,

      deathSecondMs: 120,

      deathWaitMs: 360

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE,

      dashToTarget: true,

      returnAfterDash: true,

      dashDistance: 90,

      dashDurationMs: 260,

      dashStopGap: 10,

      returnDurationMs: 250

    },

    unlock: {

      type: "gacha"

    }

  },

  nesshou_man: {

    id: "nesshou_man",

    name: "熱唱マン",

    group: "IPPANJIN",

    number: 16,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "nesshou_man"
      ),

    stats: {

      hp: 240,

      attack: 42,

      attackInterval: 1800,

      speed: 0.55,

      range: 230,

      yaniCost: 180,

      deployCooldownMs: 3500

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 340,

      hurtSpriteMs: 280,

      deathKnockbackPx: 22,

      deathSecondMs: 120,

      deathWaitMs: 350

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.PIERCING_PROJECTILE,

      projectileSpeed: 185,

      launchOffsetX: 40,

      launchDelayMs: 100,

      hitRadius: 34,

      pierceTargetCount: 3,

      effectImage:
        "images/characters/nesshou_man/nesshou_man_effect.webp",

      effectWidth: 120

    },

    unlock: {

      type: "gacha"

    }

  },

  soukyu_fist: {

    id: "soukyu_fist",

    name: "蒼穹ヲ衝キ大地ヲ穿ツ拳",

    group: "IPPANJIN",

    number: 17,

    rarity: CHARACTER_RARITY.IPPANJIN,

    images:
      getCharacterImages(
        "soukyu_fist"
      ),

    stats: {

      hp: 400,

      attack: 95,

      attackInterval: 2600,

      speed: 0.45,

      range: 145,

      yaniCost: 220,

      deployCooldownMs: 4200

    },

    battle: {

      spriteSize: 115,

      attackSpriteMs: 420,

      hurtSpriteMs: 320,

      deathKnockbackPx: 18,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.FRONT_AOE,

      impactOffsetX: 95,

      aoeRadius: 58,

      impactDelayMs: 170

    },

    unlock: {

      type: "gacha"

    }

  },

  kimi_ni_utau: {

    id: "kimi_ni_utau",

    name: "君に歌うよ。",

    group: "BANDMAN",

    number: 18,

    rarity: CHARACTER_RARITY.BANDMAN,

    images:
      getCharacterImages(
        "kimi_ni_utau"
      ),

    stats: {

      hp: 360,

      attack: 62,

      attackInterval: 1450,

      speed: 0.75,

      range: 225,

      yaniCost: 240,

      deployCooldownMs: 4200

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 330,

      hurtSpriteMs: 300,

      deathKnockbackPx: 22,

      deathSecondMs: 130,

      deathWaitMs: 370

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type:
        ATTACK_TYPE.CYCLING_PROJECTILE,

      projectileSpeed: 190,

      launchOffsetX: 38,

      launchDelayMs: 90,

      hitRadius: 30,

      stages: [

        {
          effectImage:
            "images/characters/kimi_ni_utau/kimi_ni_utau_effect_1.webp",
          effectWidth: 118,
          damageMultiplier: 1.00,
          pierceTargetCount: 1
        },

        {
          effectImage:
            "images/characters/kimi_ni_utau/kimi_ni_utau_effect_2.webp",
          effectWidth: 118,
          damageMultiplier: 1.25,
          pierceTargetCount: 1
        },

        {
          effectImage:
            "images/characters/kimi_ni_utau/kimi_ni_utau_effect_3.webp",
          effectWidth: 132,
          damageMultiplier: 1.60,
          pierceTargetCount: 1
        }

      ]

    },

    unlock: {

      type: "gacha"

    }

  },

  deathvoice_kato: {

    id: "deathvoice_kato",

    name: "デスボイス加藤",

    group: "BANDMAN",

    number: 19,

    rarity: CHARACTER_RARITY.BANDMAN,

    images:
      getCharacterImages(
        "deathvoice_kato"
      ),

    stats: {

      hp: 430,

      attack: 72,

      attackInterval: 2100,

      speed: 0.70,

      range: 135,

      yaniCost: 270,

      deployCooldownMs: 4700

    },

    battle: {

      spriteSize: 108,

      attackSpriteMs: 360,

      hurtSpriteMs: 300,

      deathKnockbackPx: 22,

      deathSecondMs: 130,

      deathWaitMs: 370

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.FRONT_AOE,

      impactOffsetX: 80,

      aoeRadius: 72,

      impactDelayMs: 120,

      effectImage:
        "images/characters/deathvoice_kato/deathvoice_kato_effect.webp",

      effectWidth: 145,

      effectLifetimeMs: 260

    },

    traits: {

      attackKnockback: {

        chance: 0.30,

        distance: 32,

        durationMs: 200

      }

    },

    unlock: {

      type: "gacha"

    }

  },

  dash_takemoto: {

    id: "dash_takemoto",

    name: "ダッシュ竹本",

    group: "BANDMAN",

    number: 20,

    rarity: CHARACTER_RARITY.BANDMAN,

    images:
      getCharacterImages(
        "dash_takemoto"
      ),

    stats: {

      hp: 300,

      attack: 68,

      attackInterval: 900,

      speed: 1.45,

      range: 48,

      yaniCost: 250,

      deployCooldownMs: 4000

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 280,

      hurtSpriteMs: 300,

      deathKnockbackPx: 28,

      deathSecondMs: 120,

      deathWaitMs: 350

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE

    },

    traits: {

      sprintAcceleration: {

        startMultiplier: 1.0,

        maxMultiplier: 1.52,

        rampDurationMs: 1400

      }

    },

    unlock: {

      type: "gacha"

    }

  },

  slapper_sato: {

    id: "slapper_sato",

    name: "スラッパー佐藤",

    group: "BANDMAN",

    number: 21,

    rarity: CHARACTER_RARITY.BANDMAN,

    images:
      getCharacterImages(
        "slapper_sato"
      ),

    stats: {

      hp: 310,

      attack: 46,

      attackInterval: 950,

      speed: 0.85,

      range: 185,

      yaniCost: 230,

      deployCooldownMs: 3800

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 280,

      hurtSpriteMs: 280,

      deathKnockbackPx: 24,

      deathSecondMs: 120,

      deathWaitMs: 350

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.PROJECTILE_SINGLE,

      projectileSpeed: 260,

      launchOffsetX: 34,

      launchDelayMs: 70,

      hitRadius: 18,

      effectImage:
        "images/characters/slapper_sato/slapper_sato_effect.webp",

      effectWidth: 36

    },

    unlock: {

      type: "gacha"

    }

  },

  breakrab: {

    id: "breakrab",

    name: "ブレイクラブ",

    group: "BANDMAN",

    number: 22,

    rarity: CHARACTER_RARITY.BANDMAN,

    images:
      getCharacterImages(
        "breakrab"
      ),

    stats: {

      hp: 580,

      attack: 125,

      attackInterval: 2400,

      speed: 0.55,

      range: 65,

      yaniCost: 300,

      deployCooldownMs: 5000

    },

    battle: {

      spriteSize: 112,

      attackSpriteMs: 420,

      hurtSpriteMs: 320,

      deathKnockbackPx: 18,

      deathSecondMs: 140,

      deathWaitMs: 390

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE,

      impactDelayMs: 180

    },

    unlock: {

      type: "gacha"

    }

  },

  mc: {

    id: "mc",

    name: "「M」C",

    group: "BANDMAN",

    number: 23,

    rarity: CHARACTER_RARITY.BANDMAN,

    images:
      getCharacterImages(
        "mc"
      ),

    stats: {

      hp: 390,

      attack: 105,

      attackInterval: 2000,

      speed: 0.65,

      range: 90,

      yaniCost: 270,

      deployCooldownMs: 4500

    },

    battle: {

      spriteSize: 108,

      attackSpriteMs: 400,

      hurtSpriteMs: 320,

      deathKnockbackPx: 24,

      deathSecondMs: 130,

      deathWaitMs: 380

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE,

      lungeDistance: 78,

      lungeDurationMs: 300,

      lungeStopGap: 10

    },

    unlock: {

      type: "gacha"

    }

  },

  bass_shika_mitemasen: {

    id: "bass_shika_mitemasen",

    name: "ベースしか見てません",

    group: "BANDMAN",

    number: 24,

    rarity: CHARACTER_RARITY.BANDMAN,

    images:
      getCharacterImages(
        "bass_shika_mitemasen"
      ),

    stats: {

      hp: 340,

      attack: 58,

      attackInterval: 800,

      speed: 0.80,

      range: 85,

      yaniCost: 250,

      deployCooldownMs: 4000

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 240,

      hurtSpriteMs: 280,

      deathKnockbackPx: 24,

      deathSecondMs: 120,

      deathWaitMs: 350

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.MELEE_SINGLE

    },

    unlock: {

      type: "gacha"

    }

  },

  fumi_machigaeta: {

    id: "fumi_machigaeta",

    name: "踏み間違え太",

    group: "BANDMAN",

    number: 25,

    rarity: CHARACTER_RARITY.BANDMAN,

    images:
      getCharacterImages(
        "fumi_machigaeta"
      ),

    stats: {

      hp: 300,

      attack: 220,

      attackInterval: 3000,

      speed: 0.75,

      range: 105,

      yaniCost: 260,

      deployCooldownMs: 5000

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 420,

      hurtSpriteMs: 300,

      deathKnockbackPx: 18,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.FRONT_AOE,

      impactOffsetX: 55,

      aoeRadius: 82,

      impactDelayMs: 180,

      effectImage:
        "images/characters/fumi_machigaeta/fumi_machigaeta_effect.webp",

      effectWidth: 150,

      effectLifetimeMs: 360,

      selfDestructOnImpact: true

    },

    unlock: {

      type: "gacha"

    }

  },

  cutting_samurai: {

    id: "cutting_samurai",

    name: "カッティングサムライ",

    group: "ライブハウス民",

    number: 26,

    rarity: CHARACTER_RARITY.HEADLINER,

    images:
      getCharacterImages(
        "cutting_samurai"
      ),

    stats: {

      hp: 360,

      attack: 20,

      attackInterval: 3300,

      speed: 0.65,

      range: 150,

      yaniCost: 330,

      deployCooldownMs: 6000

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 1200,

      hurtSpriteMs: 280,

      deathKnockbackPx: 20,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type:
        ATTACK_TYPE.DELAYED_MULTI_HIT_SINGLE,

      hitCount: 10,

      chargeMs: 1200,

      postAttackDelayMs: 200,

      hitIntervalMs: 70,

      effectLifetimeMs: 480,

      effectImage:
        "images/characters/cutting_samurai/cutting_samurai_effect.webp",

      effectWidth: 118,

      effectPatterns: [

        {
          rotation: 0,
          offsetX: -12,
          offsetY: -8,
          scaleX: 0.88,
          scaleY: 0.86
        },

        {
          rotation: 78,
          offsetX: 11,
          offsetY: 6,
          scaleX: 0.9,
          scaleY: 0.84
        },

        {
          rotation: -42,
          offsetX: 5,
          offsetY: -12,
          scaleX: 0.86,
          scaleY: 0.9
        },

        {
          rotation: 112,
          offsetX: -9,
          offsetY: 10,
          scaleX: 0.92,
          scaleY: 0.85
        },

        {
          rotation: -78,
          offsetX: 14,
          offsetY: -1,
          scaleX: 0.87,
          scaleY: 0.88
        },

        {
          rotation: 38,
          offsetX: -13,
          offsetY: 8,
          scaleX: 0.91,
          scaleY: 0.86
        },

        {
          rotation: -18,
          offsetX: 8,
          offsetY: -10,
          scaleX: 0.85,
          scaleY: 0.9
        },

        {
          rotation: 98,
          offsetX: -6,
          offsetY: 4,
          scaleX: 0.93,
          scaleY: 0.84
        },

        {
          rotation: -58,
          offsetX: 10,
          offsetY: 7,
          scaleX: 0.89,
          scaleY: 0.87
        },

        {
          rotation: 22,
          offsetX: -8,
          offsetY: -5,
          scaleX: 0.94,
          scaleY: 0.88
        }

      ]

    },

    unlock: {

      type: "gacha"

    }

  },

  shugen_knight: {

    id: "shugen_knight",

    name: "シューゲンナイト",

    group: "ライブハウス民",

    number: 27,

    rarity: CHARACTER_RARITY.HEADLINER,

    images:
      getCharacterImages(
        "shugen_knight"
      ),

    stats: {

      hp: 600,

      attack: 70,

      attackInterval: 2800,

      speed: 0.22,

      range: 330,

      yaniCost: 400,

      deployCooldownMs: 7000

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 260,

      hurtSpriteMs: 280,

      deathKnockbackPx: 20,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.PROJECTILE_AOE,

      projectileSpeed: 150,

      aoeRadius: 80,

      launchOffsetX: 45,

      launchDelayMs: 120,

      hitRadius: 36,

      effectImage:
        "images/characters/shugen_knight/shugen_knight_effect.webp",

      effectWidth: 168

    },

    traits: {

      attackKnockback: {

        chance: 0.30,

        distance: 45,

        durationMs: 200

      },

      healthKnockback: {

        thresholds: [0.50],

        distance: 100,

        durationMs: 220

      }

    },

    unlock: {

      type: "gacha"

    }

  },

  walking_death: {

    id: "walking_death",

    name: "ウォーキングデス",

    group: "ライブハウス民",

    number: 28,

    rarity: CHARACTER_RARITY.HEADLINER,

    images:
      getCharacterImages(
        "walking_death"
      ),

    stats: {

      hp: 420,

      attack: 95,

      attackInterval: 1200,

      speed: 0.75,

      range: 165,

      yaniCost: 300,

      deployCooldownMs: 5500

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 240,

      hurtSpriteMs: 280,

      deathKnockbackPx: 20,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.PROJECTILE_SINGLE,

      projectileSpeed: 160,

      launchOffsetX: 36,

      launchDelayMs: 90,

      hitRadius: 28,

      effectImage:
        "images/characters/walking_death/walking_death_effect.webp",

      effectWidth: 88

    },

    unlock: {

      type: "gacha"

    }

  },

  twin_devil: {

    id: "twin_devil",

    name: "ツインデビル",

    group: "ライブハウス民",

    number: 29,

    rarity: CHARACTER_RARITY.HEADLINER,

    images:
      getCharacterImages(
        "twin_devil"
      ),

    stats: {

      hp: 400,

      attack: 25,

      attackInterval: 850,

      speed: 1.05,

      range: 75,

      yaniCost: 300,

      deployCooldownMs: 5000

    },

    battle: {

      spriteSize: 110,

      attackSpriteMs: 240,

      hurtSpriteMs: 280,

      deathKnockbackPx: 18,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type:
        ATTACK_TYPE.DELAYED_MULTI_HIT_SINGLE,

      hitCount: 2,

      chargeMs: 0,

      postAttackDelayMs: 0,

      hitIntervalMs: 120,

      effectLifetimeMs: 300,

      effectImage:
        "images/characters/twin_devil/twin_devil_effect.webp",

      effectWidth: 140,

      effectPatterns: [

        {
          rotation: 0,
          offsetX: 16,
          offsetY: -6,
          scaleX: 0.96,
          scaleY: 0.92
        },

        {
          rotation: 0,
          offsetX: 28,
          offsetY: -4,
          scaleX: 1.08,
          scaleY: 1
        }

      ]

    },

    unlock: {

      type: "gacha"

    }

  },

  angel_voice: {

    id: "angel_voice",

    name: "エンゼルボイス",

    group: "ライブハウス民",

    number: 30,

    rarity: CHARACTER_RARITY.HEADLINER,

    images:
      getCharacterImages(
        "angel_voice"
      ),

    stats: {

      hp: 320,

      attack: 55,

      attackInterval: 1900,

      speed: 0.55,

      range: 250,

      yaniCost: 350,

      deployCooldownMs: 6000

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 240,

      hurtSpriteMs: 280,

      deathKnockbackPx: 18,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.PROJECTILE_SINGLE,

      projectileSpeed: 175,

      launchOffsetX: 35,

      launchDelayMs: 100,

      hitRadius: 28,

      effectImage:
        "images/characters/angel_voice/angel_voice_effect.webp",

      effectWidth: 78,

      onHitStatus: {

        id: "timeStop",

        chance: 0.30,

        durationMs: 1000

      }

    },

    unlock: {

      type: "gacha"

    }

  },

  reimei_sena: {

    id: "reimei_sena",

    name: "《黎明》せな",

    group: "LEGEND",

    number: 31,

    rarity: CHARACTER_RARITY.LEGEND,

    images:
      getCharacterImages(
        "reimei_sena"
      ),

    stats: {

      hp: 520,

      attack: 150,

      attackInterval: 2400,

      speed: 0.85,

      range: 135,

      yaniCost: 500,

      deployCooldownMs: 8000

    },

    battle: {

      spriteSize: 108,

      attackSpriteMs: 360,

      hurtSpriteMs: 280,

      deathKnockbackPx: 20,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.FRONT_AOE,

      forwardOffset: 90,

      aoeRadius: 82,

      effectImage:
        "images/characters/reimei_sena/reimei_sena_effect.webp",

      effectWidth: 170,

      effectLifetimeMs: 420,

      effectScaleX: -1,

      effectOffsetY: -8

    },

    conditionalBuffs: [

      {

        condition: {

          type: "hpRatioAtMost",

          value: 0.50

        },

        buff: {

          id: "attackUp",

          multiplier: 1.50

        }

      }

    ],

    traits: {

      healthKnockback: {

        thresholds: [0.50],

        distance: 100,

        durationMs: 220

      }

    },

    unlock: {

      type: "gacha"

    }

  },

  reimei_kaede: {

    id: "reimei_kaede",

    name: "《黎明》楓",

    group: "LEGEND",

    number: 32,

    rarity: CHARACTER_RARITY.LEGEND,

    images:
      getCharacterImages(
        "reimei_kaede"
      ),

    stats: {

      hp: 620,

      attack: 58,

      attackInterval: 550,

      speed: 1.35,

      range: 70,

      yaniCost: 480,

      deployCooldownMs: 7500

    },

    battle: {

      spriteSize: 112,

      attackSpriteMs: 200,

      hurtSpriteMs: 280,

      deathKnockbackPx: 22,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.FRONT_AOE,

      forwardOffset: 50,

      aoeRadius: 50,

      effectImage:
        "images/characters/reimei_kaede/reimei_kaede_effect.webp",

      effectWidth: 118,

      effectLifetimeMs: 240,

      effectOffsetY: -4

    },

    traits: {

      bpmOver: {

        intervals: [
          550,
          500,
          450,
          400
        ],

        resetAfterMs: 2000,

        iconAtLevel: 3

      },

      healthKnockback: {

        thresholds: [

          {
            ratio: 0.60,
            distance: 90
          },

          {
            ratio: 0.30,
            distance: 140
          }

        ],

        durationMs: 220

      }

    },

    unlock: {

      type: "gacha"

    }

  },

  reimei_kairi: {

    id: "reimei_kairi",

    name: "《黎明》カイリ",

    group: "LEGEND",

    number: 33,

    rarity: CHARACTER_RARITY.LEGEND,

    images:
      getCharacterImages(
        "reimei_kairi"
      ),

    stats: {

      hp: 500,

      attack: 105,

      attackInterval: 2500,

      speed: 0.65,

      range: 260,

      yaniCost: 520,

      deployCooldownMs: 8000

    },

    battle: {

      spriteSize: 108,

      attackSpriteMs: 360,

      hurtSpriteMs: 280,

      deathKnockbackPx: 20,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type: ATTACK_TYPE.DROP_AOE,

      aoeRadius: 80,

      pullDistance: 25,

      spawnDelayMs: 80,

      fallDurationMs: 800,

      fallDistancePx: 185,

      effectImage:
        "images/characters/reimei_kairi/reimei_kairi_effect.webp",

      effectWidth: 110,

      // Source tip points RIGHT;
      // rotate 90deg CW so tip faces ground.
      effectRotateDeg: 90,

      effectOffsetY: 0,

      impactFlashMs: 280,

      onHitStatus: {

        id: "timeStop",

        chance: 0.30,

        durationMs: 1000

      }

    },

    traits: {

      healthKnockback: {

        thresholds: [0.40],

        distance: 120,

        durationMs: 220

      }

    },

    unlock: {

      type: "gacha"

    }

  },

  reimei_chris: {

    id: "reimei_chris",

    name: "《黎明》Chris",

    group: "LEGEND",

    number: 34,

    rarity: CHARACTER_RARITY.LEGEND,

    images:
      getCharacterImages(
        "reimei_chris"
      ),

    stats: {

      hp: 450,

      attack: 85,

      attackInterval: 1800,

      speed: 0.80,

      range: 230,

      yaniCost: 500,

      deployCooldownMs: 8000

    },

    battle: {

      spriteSize: 108,

      attackSpriteMs: 340,

      hurtSpriteMs: 280,

      deathKnockbackPx: 20,

      deathSecondMs: 140,

      deathWaitMs: 400

    },

    ui: {

      menuScale: 1

    },

    attackBehavior: {

      type:
        ATTACK_TYPE.CYCLING_PROJECTILE,

      projectileSpeed: 195,

      launchOffsetX: 36,

      launchDelayMs: 100,

      hitRadius: 28,

      stages: [

        {
          effectImage:
            "images/characters/reimei_chris/reimei_chris_effect_1.webp",
          effectWidth: 76,
          damageMultiplier: 1.00,
          pierceTargetCount: 1
        },

        {
          effectImage:
            "images/characters/reimei_chris/reimei_chris_effect_2.webp",
          effectWidth: 100,
          damageMultiplier: 1.25,
          pierceTargetCount: 2
        },

        {
          effectImage:
            "images/characters/reimei_chris/reimei_chris_effect_3.webp",
          effectWidth: 152,
          damageMultiplier: 1.75,
          pierceTargetCount: 4,
          selfRecoilDistance: 60,
          selfRecoilDurationMs: 200
        }

      ]

    },

    unlock: {

      type: "gacha"

    }

  }

};


/*
  FORM data foundation:
  Existing top-level images / stats / battle / ui /
  attackBehavior / traits remain the FORM-1 source of truth.
  forms[1] holds the same object references (no duplicated values).
  Additional forms (e.g. forms[2]) are registered separately
  as their own source of truth objects.
*/

const CHARACTER_FORM_DATA_KEYS = [
  "images",
  "stats",
  "battle",
  "ui",
  "attackBehavior",
  "traits",
  "conditionalBuffs"
];


function buildCharacterForm1Data(
  character
) {

  const form = {};

  CHARACTER_FORM_DATA_KEYS.forEach(
    (key) => {

      if (
        Object.prototype
          .hasOwnProperty.call(
            character,
            key
          )
      ) {

        form[key] =
          character[key];

      }

    }
  );

  return form;

}


function cloneCharacterFormData(value) {

  if (
    value === null ||
    typeof value !== "object"
  ) {

    return value;

  }

  if (Array.isArray(value)) {

    return value.map(
      cloneCharacterFormData
    );

  }

  const cloned = {};

  Object.keys(value).forEach((key) => {

    cloned[key] =
      cloneCharacterFormData(
        value[key]
      );

  });

  return cloned;

}


function getCharacterFormImages(
  characterId,
  formNumber
) {

  const folder =
    "images/characters/" +
    characterId;

  if (formNumber === 1) {

    return getCharacterImages(
      characterId
    );

  }

  const prefix =
    folder +
    "/" +
    characterId +
    "_form" +
    formNumber;

  return {

    menu:
      prefix + "_menu.webp",

    idle:
      prefix + "_idle.webp",

    attack:
      prefix + "_attack.webp",

    hurt:
      prefix + "_hurt.webp"

  };

}


function attachCharacterForms(
  characters
) {

  Object.keys(characters).forEach(
    (characterId) => {

      const character =
        characters[characterId];

      if (
        !character ||
        typeof character !== "object"
      ) {

        return;

      }

      const previousForms =
        character.forms &&
        typeof character.forms ===
          "object"
          ? character.forms
          : null;

      character.forms = {

        1: buildCharacterForm1Data(
          character
        )

      };

      if (previousForms) {

        Object.keys(
          previousForms
        ).forEach((key) => {

          if (
            key === "1" ||
            Number(key) === 1
          ) {

            return;

          }

          character.forms[key] =
            previousForms[key];

        });

      }

    }
  );

}


attachCharacterForms(CHARACTERS);


function registerSenaForm2() {

  const sena =
    CHARACTERS.sena;

  if (!sena || !sena.forms) {

    return;

  }

  const form1 =
    getCharacterForm(sena, 1);

  if (!form1 || !form1.stats) {

    return;

  }

  sena.forms[2] = {

    images:
      getCharacterFormImages(
        "sena",
        2
      ),

    stats: {

      hp: 420,

      attack: 65,

      attackInterval: 900,

      speed: 1.2,

      range: 60,

      yaniCost: 220,

      deployCooldownMs:
        form1.stats.deployCooldownMs

    },

    battle:
      cloneCharacterFormData(
        form1.battle
      ),

    attackBehavior:
      cloneCharacterFormData(
        form1.attackBehavior
      ),

    ui:
      cloneCharacterFormData(
        form1.ui
      )

  };

  sena.forms[2].battle.spriteSize =
    90;

}


function resolveCharacterReference(
  characterOrId
) {

  if (!characterOrId) {

    return null;

  }

  if (
    typeof characterOrId ===
    "string"
  ) {

    return (
      CHARACTERS[characterOrId] ||
      null
    );

  }

  if (
    typeof characterOrId ===
    "object"
  ) {

    return characterOrId;

  }

  return null;

}


function getCharacterForm(
  characterOrId,
  formNumber
) {

  const character =
    resolveCharacterReference(
      characterOrId
    );

  if (
    !character ||
    !character.forms ||
    typeof character.forms !==
      "object"
  ) {

    return null;

  }

  const number =
    Number(formNumber);

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {

    return null;

  }

  const form =
    character.forms[number];

  if (
    !form ||
    typeof form !== "object"
  ) {

    return null;

  }

  return form;

}


registerSenaForm2();


function getCharacterFormLabel(
  formNumber
) {

  const number =
    Number(formNumber);

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {

    return "";

  }

  return "FORM-" + number;

}


function getUnlockedCharacterFormNumbers(
  characterOrId
) {

  const character =
    resolveCharacterReference(
      characterOrId
    );

  if (!character) {

    return [];

  }

  const progress =
    getEnhanceCardProgress(
      character.id
    );

  const unlocked =
    Array.isArray(
      progress.unlockedForms
    )
      ? progress.unlockedForms
      : [1];

  const forms = [];

  unlocked.forEach((value) => {

    const formNumber =
      Number(value);

    if (
      !Number.isInteger(formNumber) ||
      formNumber < 1 ||
      forms.indexOf(formNumber) !==
        -1
    ) {

      return;

    }

    const form =
      getCharacterForm(
        character,
        formNumber
      );

    if (
      !form ||
      !form.images ||
      !form.images.menu ||
      !form.stats
    ) {

      return;

    }

    forms.push(formNumber);

  });

  forms.sort((a, b) => a - b);

  return forms;

}


function getSafeActiveFormNumber(
  characterOrId
) {

  const unlocked =
    getUnlockedCharacterFormNumbers(
      characterOrId
    );

  if (!unlocked.length) {

    return 1;

  }

  const character =
    resolveCharacterReference(
      characterOrId
    );

  const progress =
    character
      ? getEnhanceCardProgress(
          character.id
        )
      : null;

  const activeForm =
    progress
      ? Number(progress.activeForm)
      : NaN;

  if (
    unlocked.indexOf(activeForm) !==
    -1
  ) {

    return activeForm;

  }

  if (unlocked.indexOf(1) !== -1) {

    return 1;

  }

  return unlocked[0];

}


function getCharacterFormForDisplay(
  characterOrId,
  formNumber
) {

  const character =
    resolveCharacterReference(
      characterOrId
    );

  if (!character) {

    return null;

  }

  const form =
    getCharacterForm(
      character,
      formNumber
    );

  if (
    form &&
    form.images &&
    form.stats
  ) {

    return form;

  }

  return null;

}


function getCharacterActiveFormForDisplay(
  characterOrId
) {

  const formNumber =
    getSafeActiveFormNumber(
      characterOrId
    );

  return getCharacterFormForDisplay(
    characterOrId,
    formNumber
  );

}


function getActiveCharacterForm(
  characterOrId
) {

  const form =
    getCharacterActiveFormForDisplay(
      characterOrId
    );

  if (form) {

    return form;

  }

  return resolveCharacterReference(
    characterOrId
  );

}


function getHighestUnlockedCharacterFormNumber(
  characterOrId
) {

  const unlocked =
    getUnlockedCharacterFormNumbers(
      characterOrId
    );

  if (!unlocked.length) {

    return 1;

  }

  let highest = unlocked[0];

  unlocked.forEach((formNumber) => {

    if (formNumber > highest) {

      highest = formNumber;

    }

  });

  return highest;

}


function getHighestUnlockedCharacterForm(
  characterOrId
) {

  const formNumber =
    getHighestUnlockedCharacterFormNumber(
      characterOrId
    );

  const form =
    getCharacterFormForDisplay(
      characterOrId,
      formNumber
    );

  if (form) {

    return form;

  }

  const fallbackForm1 =
    getCharacterFormForDisplay(
      characterOrId,
      1
    );

  if (fallbackForm1) {

    return fallbackForm1;

  }

  const unlocked =
    getUnlockedCharacterFormNumbers(
      characterOrId
    );

  let index = 0;

  while (index < unlocked.length) {

    const unlockedForm =
      getCharacterFormForDisplay(
        characterOrId,
        unlocked[index]
      );

    if (unlockedForm) {

      return unlockedForm;

    }

    index += 1;

  }

  return resolveCharacterReference(
    characterOrId
  );

}


const OWNED_CHARACTERS_KEY =
  "ownedCharacters";

let ownedCharacters = {};


function saveOwnedCharacters() {

  localStorage.setItem(
    OWNED_CHARACTERS_KEY,
    JSON.stringify(
      ownedCharacters
    )
  );

}


function loadOwnedCharacters() {

  try {

    const raw =
      localStorage.getItem(
        OWNED_CHARACTERS_KEY
      );

    if (!raw) {

      return {};

    }

    const parsed =
      JSON.parse(raw);

    const owned = {};

    if (Array.isArray(parsed)) {

      parsed.forEach((characterId) => {

        if (
          typeof characterId ===
          "string"
        ) {

          owned[characterId] =
            true;

        }

      });

      return owned;

    }

    if (
      parsed &&
      typeof parsed === "object"
    ) {

      Object.keys(parsed).forEach(
        (characterId) => {

          if (parsed[characterId]) {

            owned[characterId] =
              true;

          }

        }
      );

      return owned;

    }

  } catch (error) {

  }

  return {};

}


function ensureInitialCharactersOwned() {

  let added = false;

  Object.values(CHARACTERS).forEach(
    (character) => {

      if (
        !character ||
        !character.id
      ) {

        return;

      }

      if (
        character.unlock &&
        character.unlock.type ===
          "initial" &&
        !ownedCharacters[character.id]
      ) {

        ownedCharacters[character.id] =
          true;

        added = true;

      }

    }
  );

  return added;

}


function isCharacterOwned(characterId) {

  return Boolean(
    ownedCharacters[characterId]
  );

}


function unlockCharacter(characterId) {

  if (!CHARACTERS[characterId]) {

    return;

  }

  if (
    isCharacterOwned(characterId)
  ) {

    return;

  }

  ownedCharacters[characterId] =
    true;

  saveOwnedCharacters();

  if (
    ensureCharacterProgressEntry(
      characterId
    )
  ) {

    saveCharacterProgress();

  }

}


const CHARACTER_PROGRESS_KEY =
  "characterProgress";

let characterProgress = {};


function createDefaultCharacterProgress() {

  return {

    level: 1,

    plus: 0,

    unlockedForms: [1],

    activeForm: 1

  };

}


function toPositiveInt(value) {

  const number =
    Number(value);

  if (!Number.isInteger(number)) {

    return null;

  }

  return number;

}


function sanitizeCharacterProgressEntry(
  raw
) {

  const defaults =
    createDefaultCharacterProgress();

  const entry =
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw)
      ? raw
      : {};

  const sanitized = {};

  Object.keys(entry).forEach(
    (key) => {

      sanitized[key] =
        entry[key];

    }
  );

  const level =
    toPositiveInt(entry.level);

  sanitized.level =
    level !== null &&
    level >= 1
      ? level
      : defaults.level;

  const plus =
    toPositiveInt(entry.plus);

  sanitized.plus =
    clampCharacterPlus(
      plus !== null &&
      plus >= 0
        ? plus
        : defaults.plus
    );

  const unlockedForms = [];

  if (Array.isArray(entry.unlockedForms)) {

    entry.unlockedForms.forEach(
      (form) => {

        const formId =
          toPositiveInt(form);

        if (
          formId !== null &&
          formId >= 1 &&
          unlockedForms.indexOf(
            formId
          ) === -1
        ) {

          unlockedForms.push(
            formId
          );

        }

      }
    );

  }

  if (unlockedForms.indexOf(1) === -1) {

    unlockedForms.unshift(1);

  }

  sanitized.unlockedForms =
    unlockedForms;

  const activeForm =
    toPositiveInt(entry.activeForm);

  sanitized.activeForm =
    activeForm !== null &&
    unlockedForms.indexOf(
      activeForm
    ) !== -1
      ? activeForm
      : defaults.activeForm;

  return sanitized;

}


function saveCharacterProgress() {

  localStorage.setItem(
    CHARACTER_PROGRESS_KEY,
    JSON.stringify(
      characterProgress
    )
  );

}


function loadCharacterProgress() {

  try {

    const raw =
      localStorage.getItem(
        CHARACTER_PROGRESS_KEY
      );

    if (!raw) {

      return {};

    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {

      return {};

    }

    const loaded = {};

    Object.keys(parsed).forEach(
      (characterId) => {

        loaded[characterId] =
          sanitizeCharacterProgressEntry(
            parsed[characterId]
          );

      }
    );

    return loaded;

  } catch (error) {

  }

  return {};

}


function getCharacterProgress(characterId) {

  if (
    !characterId ||
    !characterProgress[characterId]
  ) {

    return null;

  }

  return characterProgress[characterId];

}


function ensureCharacterProgressEntry(
  characterId
) {

  if (
    !CHARACTERS[characterId] ||
    !isCharacterOwned(characterId)
  ) {

    return false;

  }

  const sanitized =
    sanitizeCharacterProgressEntry(
      characterProgress[characterId]
    );

  const previous =
    JSON.stringify(
      characterProgress[characterId] ||
      null
    );

  const next =
    JSON.stringify(sanitized);

  if (previous === next) {

    return false;

  }

  characterProgress[characterId] =
    sanitized;

  return true;

}


function ensureOwnedCharacterProgress() {

  let changed = false;

  Object.keys(ownedCharacters).forEach(
    (characterId) => {

      if (
        ensureCharacterProgressEntry(
          characterId
        )
      ) {

        changed = true;

      }

    }
  );

  return changed;

}


function initCharacterProgress() {

  characterProgress =
    loadCharacterProgress();

  const filled =
    ensureOwnedCharacterProgress();

  const hasSave =
    localStorage.getItem(
      CHARACTER_PROGRESS_KEY
    );

  if (
    filled ||
    !hasSave
  ) {

    saveCharacterProgress();

  }

}


function initCharacterOwnership() {

  ownedCharacters =
    loadOwnedCharacters();

  const addedInitial =
    ensureInitialCharactersOwned();

  const hasSave =
    localStorage.getItem(
      OWNED_CHARACTERS_KEY
    );

  if (
    addedInitial ||
    !hasSave
  ) {

    saveOwnedCharacters();

  }

}


initCharacterOwnership();

initCharacterProgress();


const BEATS_KEY =
  "beats";

const INITIAL_BEATS =
  1000;

let beats =
  INITIAL_BEATS;


function sanitizeBeats(value) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {

    return INITIAL_BEATS;

  }

  const integer =
    Math.floor(number);

  if (integer < 0) {

    return 0;

  }

  return integer;

}


function saveBeats() {

  localStorage.setItem(
    BEATS_KEY,
    JSON.stringify(beats)
  );

}


function loadBeats() {

  try {

    const raw =
      localStorage.getItem(
        BEATS_KEY
      );

    if (
      raw === null ||
      raw === undefined
    ) {

      return null;

    }

    return sanitizeBeats(
      JSON.parse(raw)
    );

  } catch (error) {

  }

  return INITIAL_BEATS;

}


function getBeats() {

  return beats;

}


function updateBeatsDisplay() {

  const homeBeats =
    document.getElementById(
      "beats"
    );

  if (homeBeats) {

    homeBeats.textContent =
      String(beats);

  }

  const detailBeats =
    document.getElementById(
      "enhance-detail-owned-beats"
    );

  if (detailBeats) {

    detailBeats.textContent =
      String(beats);

  }

}


function setBeats(value) {

  beats =
    sanitizeBeats(value);

  saveBeats();

  updateBeatsDisplay();

  return beats;

}


function addBeats(amount) {

  const add =
    Number(amount);

  if (
    !Number.isFinite(add) ||
    add === 0
  ) {

    return beats;

  }

  return setBeats(
    beats + Math.floor(add)
  );

}


function spendBeats(amount) {

  const cost =
    Number(amount);

  if (
    !Number.isFinite(cost) ||
    cost <= 0
  ) {

    return false;

  }

  const spend =
    Math.floor(cost);

  if (beats < spend) {

    return false;

  }

  setBeats(beats - spend);

  return true;

}


function initBeats() {

  const loaded =
    loadBeats();

  if (loaded === null) {

    beats =
      INITIAL_BEATS;

    saveBeats();

  } else {

    beats =
      loaded;

    if (
      localStorage.getItem(
        BEATS_KEY
      ) !==
      JSON.stringify(beats)
    ) {

      saveBeats();

    }

  }

  updateBeatsDisplay();

}


initBeats();


const DRINK_TICKETS_KEY =
  "drinkTickets";

const INITIAL_DRINK_TICKETS =
  0;

let drinkTickets =
  INITIAL_DRINK_TICKETS;


function sanitizeDrinkTickets(value) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {

    return INITIAL_DRINK_TICKETS;

  }

  const integer =
    Math.floor(number);

  if (integer < 0) {

    return 0;

  }

  return integer;

}


function saveDrinkTickets() {

  localStorage.setItem(
    DRINK_TICKETS_KEY,
    JSON.stringify(drinkTickets)
  );

}


function loadDrinkTickets() {

  try {

    const raw =
      localStorage.getItem(
        DRINK_TICKETS_KEY
      );

    if (
      raw === null ||
      raw === undefined
    ) {

      return null;

    }

    return sanitizeDrinkTickets(
      JSON.parse(raw)
    );

  } catch (error) {

  }

  return INITIAL_DRINK_TICKETS;

}


function getDrinkTickets() {

  return drinkTickets;

}


function updateDrinkTicketsDisplay() {

  const homeDrinkTickets =
    document.getElementById(
      "drink-tickets"
    );

  if (homeDrinkTickets) {

    homeDrinkTickets.textContent =
      String(drinkTickets);

  }

  const doritikeGachaTickets =
    document.getElementById(
      "doritike-gacha-tickets"
    );

  if (doritikeGachaTickets) {

    doritikeGachaTickets.textContent =
      String(drinkTickets);

  }

}


function setDrinkTickets(value) {

  drinkTickets =
    sanitizeDrinkTickets(value);

  saveDrinkTickets();

  updateDrinkTicketsDisplay();

  return drinkTickets;

}


function addDrinkTickets(amount) {

  const add =
    Number(amount);

  if (
    !Number.isFinite(add) ||
    add <= 0
  ) {

    return drinkTickets;

  }

  return setDrinkTickets(
    drinkTickets + Math.floor(add)
  );

}


function spendDrinkTickets(amount) {

  const cost =
    Number(amount);

  if (
    !Number.isFinite(cost) ||
    cost <= 0
  ) {

    return false;

  }

  const spend =
    Math.floor(cost);

  if (drinkTickets < spend) {

    return false;

  }

  setDrinkTickets(
    drinkTickets - spend
  );

  return true;

}


function initDrinkTickets() {

  const loaded =
    loadDrinkTickets();

  if (loaded === null) {

    drinkTickets =
      INITIAL_DRINK_TICKETS;

    saveDrinkTickets();

  } else {

    drinkTickets =
      loaded;

    if (
      localStorage.getItem(
        DRINK_TICKETS_KEY
      ) !==
      JSON.stringify(drinkTickets)
    ) {

      saveDrinkTickets();

    }

  }

  updateDrinkTicketsDisplay();

}


initDrinkTickets();


const GYARA_KEY =
  "gyara";

const INITIAL_GYARA =
  0;

let gyara =
  INITIAL_GYARA;


function sanitizeGyara(value) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {

    return INITIAL_GYARA;

  }

  const integer =
    Math.floor(number);

  if (integer < 0) {

    return 0;

  }

  return integer;

}


function saveGyara() {

  localStorage.setItem(
    GYARA_KEY,
    JSON.stringify(gyara)
  );

}


function loadGyara() {

  try {

    const raw =
      localStorage.getItem(
        GYARA_KEY
      );

    if (
      raw === null ||
      raw === undefined
    ) {

      return null;

    }

    return sanitizeGyara(
      JSON.parse(raw)
    );

  } catch (error) {

  }

  return INITIAL_GYARA;

}


function getGyara() {

  return gyara;

}


function updateGyaraDisplay() {

  const homeGyara =
    document.getElementById(
      "gyara"
    );

  if (homeGyara) {

    homeGyara.textContent =
      String(gyara);

  }

  const bsGachaGyara =
    document.getElementById(
      "bs-gacha-gyara"
    );

  if (bsGachaGyara) {

    bsGachaGyara.textContent =
      String(gyara);

  }

}


function setGyara(value) {

  gyara =
    sanitizeGyara(value);

  saveGyara();

  updateGyaraDisplay();

  return gyara;

}


function addGyara(amount) {

  const add =
    Number(amount);

  if (
    !Number.isFinite(add) ||
    add <= 0
  ) {

    return gyara;

  }

  return setGyara(
    gyara + Math.floor(add)
  );

}


function spendGyara(amount) {

  const cost =
    Number(amount);

  if (
    !Number.isFinite(cost) ||
    cost <= 0
  ) {

    return false;

  }

  const spend =
    Math.floor(cost);

  if (gyara < spend) {

    return false;

  }

  setGyara(gyara - spend);

  return true;

}


function initGyara() {

  const loaded =
    loadGyara();

  if (loaded === null) {

    gyara =
      INITIAL_GYARA;

    saveGyara();

  } else {

    gyara =
      loaded;

    if (
      localStorage.getItem(
        GYARA_KEY
      ) !==
      JSON.stringify(gyara)
    ) {

      saveGyara();

    }

  }

  updateGyaraDisplay();

}


initGyara();


const BS_PASS_KEY =
  "bsPass";

const INITIAL_BS_PASS =
  300;

let bsPass =
  INITIAL_BS_PASS;


function sanitizeBsPass(value) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {

    return INITIAL_BS_PASS;

  }

  const integer =
    Math.floor(number);

  if (integer < 0) {

    return 0;

  }

  return integer;

}


function saveBsPass() {

  localStorage.setItem(
    BS_PASS_KEY,
    JSON.stringify(bsPass)
  );

}


function loadBsPass() {

  try {

    const raw =
      localStorage.getItem(
        BS_PASS_KEY
      );

    if (
      raw === null ||
      raw === undefined
    ) {

      return null;

    }

    return sanitizeBsPass(
      JSON.parse(raw)
    );

  } catch (error) {

  }

  return INITIAL_BS_PASS;

}


function getBsPass() {

  return bsPass;

}


function updateBsPassDisplay() {

  const homeBsPass =
    document.getElementById(
      "bs-pass"
    );

  if (homeBsPass) {

    homeBsPass.textContent =
      String(bsPass);

  }

  const bsGachaPass =
    document.getElementById(
      "bs-gacha-pass"
    );

  if (bsGachaPass) {

    bsGachaPass.textContent =
      String(bsPass);

  }

}


function setBsPass(value) {

  bsPass =
    sanitizeBsPass(value);

  saveBsPass();

  updateBsPassDisplay();

  return bsPass;

}


function addBsPass(amount) {

  const add =
    Number(amount);

  if (
    !Number.isFinite(add) ||
    add <= 0
  ) {

    return bsPass;

  }

  return setBsPass(
    bsPass + Math.floor(add)
  );

}


function spendBsPass(amount) {

  const cost =
    Number(amount);

  if (
    !Number.isFinite(cost) ||
    cost <= 0
  ) {

    return false;

  }

  const spend =
    Math.floor(cost);

  if (bsPass < spend) {

    return false;

  }

  setBsPass(bsPass - spend);

  return true;

}


function initBsPass() {

  const loaded =
    loadBsPass();

  if (loaded === null) {

    bsPass =
      INITIAL_BS_PASS;

    saveBsPass();

  } else {

    bsPass =
      loaded;

    if (
      localStorage.getItem(
        BS_PASS_KEY
      ) !==
      JSON.stringify(bsPass)
    ) {

      saveBsPass();

    }

  }

  updateBsPassDisplay();

}


initBsPass();


const ITEMS = {

  sake: {

    id: "sake",

    name: "酒"

  },

  battleSpeed: {

    id: "battleSpeed",

    name: "戦闘スピードアップ"

  },

  smokingMax: {

    id: "smokingMax",

    name: "喫煙所MAX"

  },

  engine: {

    id: "engine",

    name: "エンジン"

  },

  moshStaff: {

    id: "moshStaff",

    name: "MOSH要員"

  },

  encore: {

    id: "encore",

    name: "アンコール"

  }

};


const PLAYER_ITEMS_KEY =
  "playerItems";

let playerItems = {};


function createEmptyPlayerItems() {

  const empty = {};

  Object.keys(ITEMS).forEach(
    (itemId) => {

      empty[itemId] = 0;

    }
  );

  return empty;

}


function isKnownItemId(itemId) {

  return Boolean(
    itemId &&
    ITEMS[itemId]
  );

}


function sanitizeItemCount(value) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {

    return 0;

  }

  const integer =
    Math.floor(number);

  if (integer < 0) {

    return 0;

  }

  return integer;

}


function sanitizePlayerItems(raw) {

  const sanitized =
    createEmptyPlayerItems();

  if (
    !raw ||
    typeof raw !== "object" ||
    Array.isArray(raw)
  ) {

    return sanitized;

  }

  Object.keys(ITEMS).forEach(
    (itemId) => {

      sanitized[itemId] =
        sanitizeItemCount(
          raw[itemId]
        );

    }
  );

  return sanitized;

}


function savePlayerItems() {

  localStorage.setItem(
    PLAYER_ITEMS_KEY,
    JSON.stringify(playerItems)
  );

}


function loadPlayerItems() {

  try {

    const raw =
      localStorage.getItem(
        PLAYER_ITEMS_KEY
      );

    if (
      raw === null ||
      raw === undefined
    ) {

      return null;

    }

    return sanitizePlayerItems(
      JSON.parse(raw)
    );

  } catch (error) {

  }

  return createEmptyPlayerItems();

}


function getPlayerItems() {

  return sanitizePlayerItems(
    playerItems
  );

}


function getItemCount(itemId) {

  if (!isKnownItemId(itemId)) {

    return 0;

  }

  return sanitizeItemCount(
    playerItems[itemId]
  );

}


function setItemCount(itemId, amount) {

  if (!isKnownItemId(itemId)) {

    return 0;

  }

  const sanitized =
    sanitizeItemCount(amount);

  playerItems =
    sanitizePlayerItems(
      playerItems
    );

  playerItems[itemId] =
    sanitized;

  savePlayerItems();

  return sanitized;

}


function addItem(itemId, amount) {

  if (!isKnownItemId(itemId)) {

    return getItemCount(itemId);

  }

  const add =
    Number(amount);

  if (
    !Number.isFinite(add) ||
    add <= 0
  ) {

    return getItemCount(itemId);

  }

  return setItemCount(
    itemId,
    getItemCount(itemId) +
      Math.floor(add)
  );

}


function spendItem(itemId, amount) {

  if (!isKnownItemId(itemId)) {

    return false;

  }

  const cost =
    Number(amount);

  if (
    !Number.isFinite(cost) ||
    cost <= 0
  ) {

    return false;

  }

  const spend =
    Math.floor(cost);

  const owned =
    getItemCount(itemId);

  if (owned < spend) {

    return false;

  }

  setItemCount(
    itemId,
    owned - spend
  );

  return true;

}


function initPlayerItems() {

  const loaded =
    loadPlayerItems();

  if (loaded === null) {

    playerItems =
      createEmptyPlayerItems();

    savePlayerItems();

  } else {

    playerItems =
      loaded;

    if (
      localStorage.getItem(
        PLAYER_ITEMS_KEY
      ) !==
      JSON.stringify(playerItems)
    ) {

      savePlayerItems();

    }

  }

}


initPlayerItems();


const DORITIKE_GACHA_CATEGORY_WEIGHTS = [

  {
    value: "fragment",
    weight: 50
  },

  {
    value: "beats",
    weight: 30
  },

  {
    value: "item",
    weight: 20
  }

];


const DORITIKE_FRAGMENT_AMOUNT_WEIGHTS = [

  {
    value: 5,
    weight: 65
  },

  {
    value: 10,
    weight: 27
  },

  {
    value: 20,
    weight: 7
  },

  {
    value: 30,
    weight: 1
  }

];


const DORITIKE_BEATS_AMOUNT_WEIGHTS = [

  {
    value: 500,
    weight: 65
  },

  {
    value: 1000,
    weight: 27
  },

  {
    value: 2000,
    weight: 7
  },

  {
    value: 5000,
    weight: 1
  }

];


const DORITIKE_ITEM_GROUP_WEIGHTS = [

  {
    value: "sake",
    weight: 35
  },

  {
    value: "battleConsumable",
    weight: 30
  },

  {
    value: "engine",
    weight: 20
  },

  {
    value: "moshStaff",
    weight: 14
  },

  {
    value: "encore",
    weight: 1
  }

];


const DORITIKE_BATTLE_CONSUMABLE_WEIGHTS = [

  {
    value: "battleSpeed",
    weight: 50
  },

  {
    value: "smokingMax",
    weight: 50
  }

];


const DORITIKE_ITEM_JACKPOT_RATE =
  0.10;

const DORITIKE_GACHA_ROLL_RETRY_MAX =
  20;


function pickWeightedValue(entries) {

  if (
    !Array.isArray(entries) ||
    entries.length === 0
  ) {

    return null;

  }

  let totalWeight = 0;

  const normalized = [];

  entries.forEach((entry) => {

    if (!entry) {

      return;

    }

    const weight =
      Number(entry.weight);

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {

      return;

    }

    normalized.push({
      value: entry.value,
      weight: weight
    });

    totalWeight +=
      weight;

  });

  if (
    normalized.length === 0 ||
    totalWeight <= 0
  ) {

    return null;

  }

  let roll =
    Math.random() * totalWeight;

  let index = 0;

  while (index < normalized.length) {

    roll -=
      normalized[index].weight;

    if (roll < 0) {

      return normalized[index].value;

    }

    index += 1;

  }

  return normalized[
    normalized.length - 1
  ].value;

}


function getDoritikeFragmentCandidates() {

  const candidates = [];

  Object.values(CHARACTERS).forEach(
    (character) => {

      if (
        !character ||
        !character.id
      ) {

        return;

      }

      if (
        !character.unlock ||
        character.unlock.type !==
          "story"
      ) {

        return;

      }

      candidates.push(
        character.id
      );

    }
  );

  return candidates;

}


function pickEqualValue(values) {

  if (
    !Array.isArray(values) ||
    values.length === 0
  ) {

    return null;

  }

  const index =
    Math.floor(
      Math.random() * values.length
    );

  if (
    index < 0 ||
    index >= values.length
  ) {

    return values[0];

  }

  return values[index];

}


function rollDoritikeFragmentResult() {

  const candidates =
    getDoritikeFragmentCandidates();

  if (candidates.length === 0) {

    return null;

  }

  const characterId =
    pickEqualValue(candidates);

  const amount =
    pickWeightedValue(
      DORITIKE_FRAGMENT_AMOUNT_WEIGHTS
    );

  if (
    !characterId ||
    amount == null
  ) {

    return null;

  }

  return {

    category: "fragment",

    characterId: characterId,

    amount: amount

  };

}


function rollDoritikeBeatsResult() {

  const amount =
    pickWeightedValue(
      DORITIKE_BEATS_AMOUNT_WEIGHTS
    );

  if (amount == null) {

    return null;

  }

  return {

    category: "beats",

    amount: amount

  };

}


function rollDoritikeItemResult() {

  const group =
    pickWeightedValue(
      DORITIKE_ITEM_GROUP_WEIGHTS
    );

  let itemId =
    null;

  if (group === "battleConsumable") {

    itemId =
      pickWeightedValue(
        DORITIKE_BATTLE_CONSUMABLE_WEIGHTS
      );

  } else {

    itemId =
      group;

  }

  if (
    !itemId ||
    !ITEMS[itemId]
  ) {

    return null;

  }

  if (itemId === "encore") {

    return {

      category: "item",

      itemId: "encore",

      amount: 1,

      jackpot: false

    };

  }

  const jackpot =
    Math.random() <
    DORITIKE_ITEM_JACKPOT_RATE;

  return {

    category: "item",

    itemId: itemId,

    amount: jackpot ? 2 : 1,

    jackpot: jackpot

  };

}


function rollDoritikeGachaOnce() {

  let attempt = 0;

  while (
    attempt <
    DORITIKE_GACHA_ROLL_RETRY_MAX
  ) {

    attempt += 1;

    const candidates =
      getDoritikeFragmentCandidates();

    const categoryWeights =
      candidates.length === 0
        ? DORITIKE_GACHA_CATEGORY_WEIGHTS.filter(
            (entry) => {

              return (
                entry.value !==
                "fragment"
              );

            }
          )
        : DORITIKE_GACHA_CATEGORY_WEIGHTS;

    const category =
      pickWeightedValue(
        categoryWeights
      );

    let result =
      null;

    if (category === "fragment") {

      result =
        rollDoritikeFragmentResult();

    } else if (category === "beats") {

      result =
        rollDoritikeBeatsResult();

    } else if (category === "item") {

      result =
        rollDoritikeItemResult();

    }

    if (result) {

      return result;

    }

  }

  return rollDoritikeBeatsResult() || {

    category: "beats",

    amount: 500

  };

}


function grantDoritikeGachaResult(result) {

  if (
    !result ||
    typeof result !== "object"
  ) {

    return false;

  }

  if (
    result.category ===
      "fragment"
  ) {

    if (
      !result.characterId ||
      !CHARACTERS[
        result.characterId
      ]
    ) {

      return false;

    }

    addCharacterFragments(
      result.characterId,
      result.amount
    );

    return true;

  }

  if (result.category === "beats") {

    addBeats(result.amount);

    return true;

  }

  if (result.category === "item") {

    if (
      !result.itemId ||
      !ITEMS[result.itemId]
    ) {

      return false;

    }

    addItem(
      result.itemId,
      result.amount
    );

    return true;

  }

  return false;

}


function executeDoritikeGachaPull(
  count
) {

  const pullCount =
    Number(count);

  if (
    !Number.isInteger(pullCount) ||
    pullCount <= 0
  ) {

    return {

      ok: false,

      reason: "invalid_count",

      results: []

    };

  }

  const needTickets =
    pullCount;

  if (
    getDrinkTickets() <
    needTickets
  ) {

    return {

      ok: false,

      reason:
        "insufficient_tickets",

      results: []

    };

  }

  if (
    !spendDrinkTickets(
      needTickets
    )
  ) {

    return {

      ok: false,

      reason:
        "insufficient_tickets",

      results: []

    };

  }

  const results = [];

  let index = 0;

  while (index < pullCount) {

    const result =
      rollDoritikeGachaOnce();

    grantDoritikeGachaResult(
      result
    );

    results.push(result);

    index += 1;

  }

  return {

    ok: true,

    reason: null,

    results: results

  };

}


/* =========================
   BS GACHA BANNER FOUNDATION
========================= */

const BS_GACHA_BANNER_TYPE = {

  NORMAL: "normal",

  PICKUP: "pickup",

  EVENT: "event",

  REPRINT: "reprint"

};


const BS_GACHA_CURRENCY = {

  BS_PASS: "bsPass",

  GYARA: "gyara"

};


const BS_GACHA_RARITY_STAR = {

  [CHARACTER_RARITY.IPPANJIN]: 1,

  [CHARACTER_RARITY.BANDMAN]: 2,

  [CHARACTER_RARITY.HEADLINER]: 3,

  [CHARACTER_RARITY.LEGEND]: 4

};


const BS_GACHA_NORMAL_RATES = [

  {
    rarity: 1,
    weight: 60
  },

  {
    rarity: 2,
    weight: 25
  },

  {
    rarity: 3,
    weight: 12
  },

  {
    rarity: 4,
    weight: 3
  }

];


const BS_GACHA_GUARANTEE_RATES = [

  {
    rarity: 3,
    weight: 90
  },

  {
    rarity: 4,
    weight: 10
  }

];


const BS_GACHA_BANNERS = {

  normal: {

    id: "normal",

    title: "BACKSTAGEガチャ",

    shortTitle: "BSガチャ",

    type: BS_GACHA_BANNER_TYPE.NORMAL,

    enabled: true,

    pool: {

      unlockTypes: [
        "gacha"
      ],

      includeCharacterIds: [],

      excludeCharacterIds: [],

      pickupCharacterIds: []

    },

    rates: BS_GACHA_NORMAL_RATES,

    guarantee: {

      enabled: true,

      minRarity: 3,

      rates: BS_GACHA_GUARANTEE_RATES

    },

    costs: {

      multiCount: 10,

      single: [

        {
          currency: BS_GACHA_CURRENCY.BS_PASS,
          amount: 1
        },

        {
          currency: BS_GACHA_CURRENCY.GYARA,
          amount: 50
        }

      ],

      multi: [

        {
          currency: BS_GACHA_CURRENCY.BS_PASS,
          amount: 10
        },

        {
          currency: BS_GACHA_CURRENCY.GYARA,
          amount: 450
        }

      ]

    },

    pickup: null

  }

};


function createEmptyBsGachaRarityBuckets() {

  return {

    1: [],

    2: [],

    3: [],

    4: []

  };

}


function getBsGachaBanner(bannerId) {

  if (
    typeof bannerId !== "string" ||
    !bannerId
  ) {

    return null;

  }

  const banner =
    BS_GACHA_BANNERS[bannerId];

  if (
    !banner ||
    typeof banner !== "object"
  ) {

    return null;

  }

  return banner;

}


function getEnabledBsGachaBanners() {

  return Object.keys(
    BS_GACHA_BANNERS
  )
    .map((bannerId) => {

      return getBsGachaBanner(
        bannerId
      );

    })
    .filter((banner) => {

      return (
        banner &&
        banner.enabled === true
      );

    });

}


function getBsGachaRarityStar(
  characterOrRarity
) {

  let rarity =
    characterOrRarity;

  if (
    characterOrRarity &&
    typeof characterOrRarity ===
      "object"
  ) {

    rarity =
      characterOrRarity.rarity;

  }

  if (
    rarity ===
      CHARACTER_RARITY.IPPANJIN ||
    rarity === 1 ||
    rarity === "1"
  ) {

    return 1;

  }

  if (
    rarity ===
      CHARACTER_RARITY.BANDMAN ||
    rarity === 2 ||
    rarity === "2"
  ) {

    return 2;

  }

  if (
    rarity ===
      CHARACTER_RARITY.HEADLINER ||
    rarity === 3 ||
    rarity === "3"
  ) {

    return 3;

  }

  if (
    rarity ===
      CHARACTER_RARITY.LEGEND ||
    rarity === 4 ||
    rarity === "4"
  ) {

    return 4;

  }

  if (
    typeof rarity === "string" &&
    BS_GACHA_RARITY_STAR[rarity]
  ) {

    return BS_GACHA_RARITY_STAR[
      rarity
    ];

  }

  return null;

}


function getBsGachaCharacterUnlockType(
  character
) {

  if (
    !character ||
    typeof character !== "object" ||
    !character.unlock ||
    typeof character.unlock !==
      "object"
  ) {

    return null;

  }

  const unlockType =
    character.unlock.type;

  if (typeof unlockType !== "string") {

    return null;

  }

  return unlockType;

}


function isCharacterEligibleForBsBanner(
  character,
  banner
) {

  if (
    !character ||
    typeof character !== "object" ||
    !banner ||
    typeof banner !== "object"
  ) {

    return false;

  }

  const characterId =
    character.id;

  if (
    typeof characterId !== "string" ||
    !characterId
  ) {

    return false;

  }

  if (
    getBsGachaRarityStar(
      character
    ) == null
  ) {

    return false;

  }

  const pool =
    banner.pool &&
    typeof banner.pool === "object"
      ? banner.pool
      : {};

  const excludeIds =
    Array.isArray(
      pool.excludeCharacterIds
    )
      ? pool.excludeCharacterIds
      : [];

  if (
    excludeIds.indexOf(
      characterId
    ) !== -1
  ) {

    return false;

  }

  const includeIds =
    Array.isArray(
      pool.includeCharacterIds
    )
      ? pool.includeCharacterIds
      : [];

  if (
    includeIds.length > 0 &&
    includeIds.indexOf(
      characterId
    ) !== -1
  ) {

    return true;

  }

  const unlockTypes =
    Array.isArray(pool.unlockTypes)
      ? pool.unlockTypes
      : [];

  const unlockType =
    getBsGachaCharacterUnlockType(
      character
    );

  if (
    unlockType &&
    unlockTypes.indexOf(
      unlockType
    ) !== -1
  ) {

    return true;

  }

  return false;

}


function getBsGachaPool(bannerId) {

  const banner =
    getBsGachaBanner(bannerId);

  const byRarity =
    createEmptyBsGachaRarityBuckets();

  if (!banner) {

    return {

      bannerId: bannerId || null,

      all: [],

      byRarity: byRarity

    };

  }

  const all = [];

  Object.keys(CHARACTERS).forEach(
    (characterId) => {

      const character =
        CHARACTERS[characterId];

      if (
        !isCharacterEligibleForBsBanner(
          character,
          banner
        )
      ) {

        return;

      }

      const rarityStar =
        getBsGachaRarityStar(
          character
        );

      if (
        rarityStar == null ||
        !byRarity[rarityStar]
      ) {

        return;

      }

      all.push(characterId);

      byRarity[rarityStar].push(
        characterId
      );

    }
  );

  return {

    bannerId: banner.id,

    all: all,

    byRarity: byRarity

  };

}


/* =========================
   BS GACHA PULL
========================= */

function createBsGachaPullFailure(
  reason
) {

  return {

    ok: false,

    reason: reason,

    results: []

  };

}


function getBsGachaPullCost(
  banner,
  count,
  paymentType
) {

  if (
    !banner ||
    typeof banner !== "object" ||
    !banner.costs ||
    typeof banner.costs !== "object"
  ) {

    return null;

  }

  if (
    paymentType !==
      BS_GACHA_CURRENCY.BS_PASS &&
    paymentType !==
      BS_GACHA_CURRENCY.GYARA
  ) {

    return null;

  }

  let table = null;

  if (count === 1) {

    table = banner.costs.single;

  } else if (
    count ===
    Number(banner.costs.multiCount)
  ) {

    table = banner.costs.multi;

  }

  if (!Array.isArray(table)) {

    return null;

  }

  let amount = null;

  table.forEach((entry) => {

    if (
      amount !== null ||
      !entry ||
      entry.currency !== paymentType
    ) {

      return;

    }

    const nextAmount =
      Number(entry.amount);

    if (
      !Number.isInteger(nextAmount) ||
      nextAmount <= 0
    ) {

      return;

    }

    amount = nextAmount;

  });

  return amount;

}


function getExecutableBsGachaRates(
  rates,
  poolByRarity
) {

  if (
    !Array.isArray(rates) ||
    !poolByRarity ||
    typeof poolByRarity !== "object"
  ) {

    return [];

  }

  const executable = [];

  rates.forEach((entry) => {

    if (!entry) {

      return;

    }

    const rarity =
      getBsGachaRarityStar(
        entry.rarity
      );

    if (rarity == null) {

      return;

    }

    const bucket =
      poolByRarity[rarity];

    if (
      !Array.isArray(bucket) ||
      bucket.length === 0
    ) {

      return;

    }

    const weight =
      Number(entry.weight);

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {

      return;

    }

    executable.push({

      value: rarity,

      weight: weight

    });

  });

  return executable;

}


function bsGachaPullUsesGuarantee(
  banner,
  count,
  index
) {

  if (
    !banner ||
    !banner.guarantee ||
    banner.guarantee.enabled !== true ||
    !banner.costs
  ) {

    return false;

  }

  const multiCount =
    Number(banner.costs.multiCount);

  if (
    !Number.isInteger(multiCount) ||
    multiCount <= 1 ||
    count !== multiCount
  ) {

    return false;

  }

  return index === count - 1;

}


function rollBsGachaCharacter(
  banner,
  pool,
  useGuarantee
) {

  if (
    !banner ||
    !pool ||
    !pool.byRarity
  ) {

    return null;

  }

  const rates =
    useGuarantee
      ? banner.guarantee &&
        banner.guarantee.rates
      : banner.rates;

  const executable =
    getExecutableBsGachaRates(
      rates,
      pool.byRarity
    );

  if (executable.length === 0) {

    return null;

  }

  const rarity =
    pickWeightedValue(executable);

  if (
    getBsGachaRarityStar(rarity) ==
      null
  ) {

    return null;

  }

  const bucket =
    pool.byRarity[rarity];

  if (
    !Array.isArray(bucket) ||
    bucket.length === 0
  ) {

    return null;

  }

  const characterId =
    pickEqualValue(bucket);

  if (
    typeof characterId !== "string" ||
    !CHARACTERS[characterId]
  ) {

    return null;

  }

  const characterRarity =
    getBsGachaRarityStar(
      CHARACTERS[characterId]
    );

  if (characterRarity !== rarity) {

    return null;

  }

  return {

    characterId: characterId,

    rarity: rarity

  };

}


function planBsGachaPull(
  banner,
  pool,
  count
) {

  if (
    !banner ||
    !pool ||
    !pool.byRarity ||
    (count !== 1 && count !== 10)
  ) {

    return createBsGachaPullFailure(
      "empty_pool"
    );

  }

  const needsGuarantee =
    bsGachaPullUsesGuarantee(
      banner,
      count,
      count - 1
    );

  if (needsGuarantee) {

    const guaranteeRates =
      getExecutableBsGachaRates(
        banner.guarantee &&
          banner.guarantee.rates,
        pool.byRarity
      );

    if (guaranteeRates.length === 0) {

      return createBsGachaPullFailure(
        "guarantee_unavailable"
      );

    }

  }

  const needsNormal =
    count > (needsGuarantee ? 1 : 0);

  if (needsNormal) {

    const normalRates =
      getExecutableBsGachaRates(
        banner.rates,
        pool.byRarity
      );

    if (normalRates.length === 0) {

      return createBsGachaPullFailure(
        "empty_pool"
      );

    }

  }

  const plannedOwned = {};

  Object.keys(ownedCharacters).forEach(
    (characterId) => {

      if (ownedCharacters[characterId]) {

        plannedOwned[characterId] =
          true;

      }

    }
  );

  const results = [];

  let index = 0;

  while (index < count) {

    const useGuarantee =
      bsGachaPullUsesGuarantee(
        banner,
        count,
        index
      );

    const roll =
      rollBsGachaCharacter(
        banner,
        pool,
        useGuarantee
      );

    if (
      !roll ||
      !CHARACTERS[roll.characterId] ||
      getBsGachaRarityStar(
        roll.rarity
      ) == null
    ) {

      return createBsGachaPullFailure(
        useGuarantee
          ? "guarantee_unavailable"
          : "empty_pool"
      );

    }

    const alreadyOwned =
      plannedOwned[roll.characterId] ===
      true;

    let fragmentAmount = 0;

    if (alreadyOwned) {

      fragmentAmount =
        getPlusEnhanceFragmentCost(
          roll.characterId
        );

      if (
        !Number.isInteger(
          fragmentAmount
        ) ||
        fragmentAmount <= 0
      ) {

        return createBsGachaPullFailure(
          useGuarantee
            ? "guarantee_unavailable"
            : "empty_pool"
        );

      }

    }

    results.push({

      characterId: roll.characterId,

      rarity: roll.rarity,

      isNew: !alreadyOwned,

      fragmentAmount: fragmentAmount

    });

    plannedOwned[roll.characterId] =
      true;

    index += 1;

  }

  return {

    ok: true,

    reason: null,

    results: results

  };

}


function grantBsGachaPullResults(
  results
) {

  results.forEach((result) => {

    if (result.isNew) {

      unlockCharacter(
        result.characterId
      );

      return;

    }

    addCharacterFragments(
      result.characterId,
      result.fragmentAmount
    );

  });

}


function executeBsGachaPull(
  bannerId,
  count,
  paymentType
) {

  const banner =
    getBsGachaBanner(bannerId);

  if (!banner) {

    return createBsGachaPullFailure(
      "invalid_banner"
    );

  }

  if (banner.enabled !== true) {

    return createBsGachaPullFailure(
      "disabled_banner"
    );

  }

  if (count !== 1 && count !== 10) {

    return createBsGachaPullFailure(
      "invalid_count"
    );

  }

  if (
    paymentType !==
      BS_GACHA_CURRENCY.BS_PASS &&
    paymentType !==
      BS_GACHA_CURRENCY.GYARA
  ) {

    return createBsGachaPullFailure(
      "invalid_payment"
    );

  }

  const cost =
    getBsGachaPullCost(
      banner,
      count,
      paymentType
    );

  if (cost == null) {

    return createBsGachaPullFailure(
      "invalid_payment"
    );

  }

  const balance =
    paymentType ===
    BS_GACHA_CURRENCY.BS_PASS
      ? getBsPass()
      : getGyara();

  if (balance < cost) {

    return createBsGachaPullFailure(
      "insufficient_currency"
    );

  }

  const pool =
    getBsGachaPool(banner.id);

  const plan =
    planBsGachaPull(
      banner,
      pool,
      count
    );

  if (!plan.ok) {

    return plan;

  }

  let valid = true;

  plan.results.forEach((result) => {

    if (!valid) {

      return;

    }

    const character =
      CHARACTERS[result.characterId];

    if (
      !character ||
      result.rarity !==
        getBsGachaRarityStar(
          character
        )
    ) {

      valid = false;

      return;

    }

    if (result.isNew) {

      if (result.fragmentAmount !== 0) {

        valid = false;

      }

      return;

    }

    if (
      result.fragmentAmount !==
      getPlusEnhanceFragmentCost(
        result.characterId
      )
    ) {

      valid = false;

    }

  });

  if (
    !valid ||
    plan.results.length !== count
  ) {

    return createBsGachaPullFailure(
      "empty_pool"
    );

  }

  const spent =
    paymentType ===
    BS_GACHA_CURRENCY.BS_PASS
      ? spendBsPass(cost)
      : spendGyara(cost);

  if (!spent) {

    return createBsGachaPullFailure(
      "insufficient_currency"
    );

  }

  grantBsGachaPullResults(
    plan.results
  );

  return {

    ok: true,

    reason: null,

    results: plan.results

  };

}


/* =========================
   BS GACHA SCREEN
========================= */

let isBsGachaBusy = false;

let bsGachaPrompt = null;

let bsGachaLastOutcome = null;

let bsGachaLightingActive = false;

let bsGachaLightingToken = 0;

let bsGachaRevealActive = false;

let bsGachaRevealReady = false;

let bsGachaRevealClosing = false;

let bsGachaRevealToken = 0;

let bsGachaSequenceToken = 0;

let bsGachaRevealQueue = [];

let bsGachaRevealQueueIndex = -1;

let bsGachaRevealAdvance = null;

let bsGachaRevealCycle = 0;

let bsGachaSummaryOpen = false;

let bsGachaSummaryClosing = false;

let bsGachaSummaryResults = [];

let bsGachaPresentationResults = [];

let bsGachaSkipEnabled = false;

let bsGachaSkipping = false;


const bsGachaBack =
  document.getElementById(
    "bs-gacha-back"
  );

const bsGachaTitle =
  document.getElementById(
    "bs-gacha-title"
  );

const bsGachaPassLabel =
  document.getElementById(
    "bs-gacha-pass"
  );

const bsGachaGyaraLabel =
  document.getElementById(
    "bs-gacha-gyara"
  );

const bsGachaMessage =
  document.getElementById(
    "bs-gacha-message"
  );

const bsGachaGuarantee =
  document.getElementById(
    "bs-gacha-guarantee"
  );

const bsGachaPull1 =
  document.getElementById(
    "bs-gacha-pull-1"
  );

const bsGachaPull10 =
  document.getElementById(
    "bs-gacha-pull-10"
  );

const bsGachaPull1Label =
  document.getElementById(
    "bs-gacha-pull-1-label"
  );

const bsGachaPull10Label =
  document.getElementById(
    "bs-gacha-pull-10-label"
  );

const bsGachaCost1 =
  document.getElementById(
    "bs-gacha-cost-1"
  );

const bsGachaCost10 =
  document.getElementById(
    "bs-gacha-cost-10"
  );

const bsGachaPromptEl =
  document.getElementById(
    "bs-gacha-prompt"
  );

const bsGachaPayStep =
  document.getElementById(
    "bs-gacha-pay-step"
  );

const bsGachaPayNote =
  document.getElementById(
    "bs-gacha-pay-note"
  );

const bsGachaPayPass =
  document.getElementById(
    "bs-gacha-pay-pass"
  );

const bsGachaPayGyara =
  document.getElementById(
    "bs-gacha-pay-gyara"
  );

const bsGachaPayCancel =
  document.getElementById(
    "bs-gacha-pay-cancel"
  );

const bsGachaConfirmStep =
  document.getElementById(
    "bs-gacha-confirm-step"
  );

const bsGachaConfirmText =
  document.getElementById(
    "bs-gacha-confirm-text"
  );

const bsGachaConfirmOk =
  document.getElementById(
    "bs-gacha-confirm-ok"
  );

const bsGachaConfirmCancel =
  document.getElementById(
    "bs-gacha-confirm-cancel"
  );

const bsGachaLighting =
  document.getElementById(
    "bs-gacha-lighting"
  );

const bsGachaLightWhite =
  bsGachaLighting
    ? bsGachaLighting.querySelector(
      ".bs-gacha-light-white"
    )
    : null;

const bsGachaLightBlue =
  bsGachaLighting
    ? bsGachaLighting.querySelector(
      ".bs-gacha-light-blue"
    )
    : null;

const bsGachaLightRed =
  bsGachaLighting
    ? bsGachaLighting.querySelector(
      ".bs-gacha-light-red"
    )
    : null;

const bsGachaLightLegend =
  bsGachaLighting
    ? bsGachaLighting.querySelector(
      ".bs-gacha-light-legend"
    )
    : null;

const bsGachaLightFlash =
  bsGachaLighting
    ? bsGachaLighting.querySelector(
      ".bs-gacha-light-flash"
    )
    : null;

const bsGachaReveal =
  document.getElementById(
    "bs-gacha-reveal"
  );

const bsGachaRevealCharacter =
  bsGachaReveal
    ? bsGachaReveal.querySelector(
      ".bs-gacha-reveal-character"
    )
    : null;

const bsGachaRevealFlash =
  bsGachaReveal
    ? bsGachaReveal.querySelector(
      ".bs-gacha-reveal-flash"
    )
    : null;

const bsGachaRevealNumber =
  bsGachaReveal
    ? bsGachaReveal.querySelector(
      ".bs-gacha-reveal-number"
    )
    : null;

const bsGachaRevealRarity =
  bsGachaReveal
    ? bsGachaReveal.querySelector(
      ".bs-gacha-reveal-rarity"
    )
    : null;

const bsGachaRevealName =
  bsGachaReveal
    ? bsGachaReveal.querySelector(
      ".bs-gacha-reveal-name"
    )
    : null;

const bsGachaRevealGroup =
  bsGachaReveal
    ? bsGachaReveal.querySelector(
      ".bs-gacha-reveal-group"
    )
    : null;

const bsGachaRevealStatus =
  bsGachaReveal
    ? bsGachaReveal.querySelector(
      ".bs-gacha-reveal-status"
    )
    : null;

const bsGachaRevealTap =
  bsGachaReveal
    ? bsGachaReveal.querySelector(
      ".bs-gacha-reveal-tap"
    )
    : null;

const bsGachaRevealProgress =
  bsGachaReveal
    ? bsGachaReveal.querySelector(
      ".bs-gacha-reveal-progress"
    )
    : null;

const bsGachaSummary =
  document.getElementById(
    "bs-gacha-summary"
  );

const bsGachaSummaryGrid =
  bsGachaSummary
    ? bsGachaSummary.querySelector(
      ".bs-gacha-summary-grid"
    )
    : null;

const bsGachaSummaryClose =
  bsGachaSummary
    ? bsGachaSummary.querySelector(
      ".bs-gacha-summary-close"
    )
    : null;

const bsGachaSkip =
  document.getElementById(
    "bs-gacha-skip"
  );


function getBsGachaHighestRarity(results) {

  if (!Array.isArray(results)) {

    return 0;

  }

  let highest = 0;

  for (
    let index = 0;
    index < results.length;
    index += 1
  ) {

    const rarity =
      Number(
        results[index] &&
        results[index].rarity
      );

    if (
      rarity >= 1 &&
      rarity <= 4 &&
      rarity > highest
    ) {

      highest = rarity;

    }

  }

  return highest;

}


function waitBsGachaLighting(ms) {

  return new Promise((resolve) => {

    window.setTimeout(
      resolve,
      ms
    );

  });

}


function isBsGachaLightingToken(token) {

  return token === bsGachaLightingToken;

}


function setBsGachaLightingPhase(phase) {

  if (!bsGachaLighting) {

    return;

  }

  if (phase) {

    bsGachaLighting.dataset.phase =
      phase;

    return;

  }

  delete bsGachaLighting.dataset.phase;

}


function setBsGachaLight(element, opacity) {

  if (!element) {

    return;

  }

  element.style.opacity =
    String(opacity);

}


function resetBsGachaLighting() {

  setBsGachaLight(bsGachaLightWhite, 0);

  setBsGachaLight(bsGachaLightBlue, 0);

  setBsGachaLight(bsGachaLightRed, 0);

  setBsGachaLight(bsGachaLightLegend, 0);

  setBsGachaLight(bsGachaLightFlash, 0);

  if (bsGachaLighting) {

    bsGachaLighting.classList.remove(
      "is-shake",
      "is-strobe",
      "is-burst"
    );

  }

  setBsGachaLightingPhase("");

}


function cancelBsGachaLighting() {

  bsGachaLightingToken += 1;

  bsGachaLightingActive = false;

  resetBsGachaLighting();

}


function prefersBsGachaReducedMotion() {

  return !!(
    window.matchMedia &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  );

}


async function dimBsGachaLighting(
  token,
  ms
) {

  setBsGachaLightingPhase("dim");

  setBsGachaLight(bsGachaLightWhite, 0);

  setBsGachaLight(bsGachaLightBlue, 0);

  setBsGachaLight(bsGachaLightRed, 0);

  setBsGachaLight(bsGachaLightLegend, 0);

  setBsGachaLight(bsGachaLightFlash, 0);

  await waitBsGachaLighting(ms);

  return isBsGachaLightingToken(token);

}


async function playBsGachaWhiteLighting(token) {

  setBsGachaLightingPhase("white");

  setBsGachaLight(bsGachaLightWhite, 0.4);

  await waitBsGachaLighting(180);

  if (!isBsGachaLightingToken(token)) {

    return false;

  }

  setBsGachaLight(bsGachaLightWhite, 0.86);

  await waitBsGachaLighting(520);

  return isBsGachaLightingToken(token);

}


async function playBsGachaBlueLighting(token) {

  setBsGachaLightingPhase("blue");

  setBsGachaLight(bsGachaLightWhite, 0);

  setBsGachaLight(bsGachaLightBlue, 0.9);

  await waitBsGachaLighting(680);

  return isBsGachaLightingToken(token);

}


async function playBsGachaRedLighting(token) {

  setBsGachaLightingPhase("red");

  setBsGachaLight(bsGachaLightBlue, 0);

  setBsGachaLight(bsGachaLightRed, 1);

  if (
    bsGachaLighting &&
    !prefersBsGachaReducedMotion()
  ) {

    bsGachaLighting.classList.remove(
      "is-shake"
    );

    void bsGachaLighting.offsetWidth;

    bsGachaLighting.classList.add(
      "is-shake"
    );

  }

  await waitBsGachaLighting(160);

  if (!isBsGachaLightingToken(token)) {

    return false;

  }

  setBsGachaLight(bsGachaLightRed, 0.86);

  await waitBsGachaLighting(620);

  return isBsGachaLightingToken(token);

}


async function playBsGachaLegendStrobe(token) {

  setBsGachaLightingPhase("strobe");

  if (
    !bsGachaLighting ||
    prefersBsGachaReducedMotion()
  ) {

    setBsGachaLight(
      bsGachaLightLegend,
      0.62
    );

    await waitBsGachaLighting(280);

    return isBsGachaLightingToken(token);

  }

  bsGachaLighting.classList.add(
    "is-strobe"
  );

  const pulses = 3;

  for (
    let pulse = 0;
    pulse < pulses;
    pulse += 1
  ) {

    if (!isBsGachaLightingToken(token)) {

      return false;

    }

    setBsGachaLight(
      bsGachaLightLegend,
      0.88
    );

    setBsGachaLight(
      bsGachaLightFlash,
      0.22
    );

    await waitBsGachaLighting(100);

    if (!isBsGachaLightingToken(token)) {

      return false;

    }

    setBsGachaLight(
      bsGachaLightLegend,
      0.18
    );

    setBsGachaLight(
      bsGachaLightFlash,
      0
    );

    await waitBsGachaLighting(120);

  }

  bsGachaLighting.classList.remove(
    "is-strobe"
  );

  return isBsGachaLightingToken(token);

}


async function playBsGachaLegendLighting(token) {

  const dimmed =
    await dimBsGachaLighting(
      token,
      240
    );

  if (!dimmed) {

    return false;

  }

  setBsGachaLightingPhase("warm");

  setBsGachaLight(
    bsGachaLightLegend,
    0.84
  );

  await waitBsGachaLighting(340);

  if (!isBsGachaLightingToken(token)) {

    return false;

  }

  const strobed =
    await playBsGachaLegendStrobe(token);

  if (!strobed) {

    return false;

  }

  setBsGachaLightingPhase("flash");

  setBsGachaLight(bsGachaLightLegend, 0);

  setBsGachaLight(bsGachaLightRed, 0);

  if (bsGachaLighting) {

    bsGachaLighting.classList.add(
      "is-burst"
    );

  }

  setBsGachaLight(
    bsGachaLightFlash,
    prefersBsGachaReducedMotion()
      ? 0.38
      : 1
  );

  await waitBsGachaLighting(
    prefersBsGachaReducedMotion()
      ? 80
      : 110
  );

  if (!isBsGachaLightingToken(token)) {

    return false;

  }

  setBsGachaLight(bsGachaLightFlash, 0);

  if (bsGachaLighting) {

    bsGachaLighting.classList.remove(
      "is-burst"
    );

  }

  await waitBsGachaLighting(140);

  return isBsGachaLightingToken(token);

}


async function playBsGachaLighting(
  rarity,
  options
) {

  const level = Number(rarity);

  const holdBusy =
    !!(
      options &&
      options.holdBusy
    );

  if (
    bsGachaLightingActive ||
    !bsGachaLighting ||
    level < 1 ||
    level > 4
  ) {

    return false;

  }

  bsGachaLightingActive = true;

  const token =
    bsGachaLightingToken + 1;

  bsGachaLightingToken = token;

  setBsGachaBusy(true);

  resetBsGachaLighting();

  try {

    const showedWhite =
      await playBsGachaWhiteLighting(token);

    if (!showedWhite) {

      return;

    }

    if (level >= 2) {

      const dimmed =
        await dimBsGachaLighting(
          token,
          160
        );

      if (!dimmed) {

        return;

      }

      const showedBlue =
        await playBsGachaBlueLighting(token);

      if (!showedBlue) {

        return;

      }

    }

    if (level >= 3) {

      const dimmed =
        await dimBsGachaLighting(
          token,
          140
        );

      if (!dimmed) {

        return;

      }

      const showedRed =
        await playBsGachaRedLighting(token);

      if (!showedRed) {

        return;

      }

    }

    if (level >= 4) {

      await playBsGachaLegendLighting(token);

      return;

    }

    await dimBsGachaLighting(
      token,
      280
    );

  } finally {

    if (isBsGachaLightingToken(token)) {

      resetBsGachaLighting();

      bsGachaLightingActive = false;

      if (!holdBusy) {

        setBsGachaBusy(false);

      }

      return true;

    }

    return false;

  }

}


function getBsGachaStarRarityKey(star) {

  const level = Number(star);

  const keys =
    Object.keys(BS_GACHA_RARITY_STAR);

  for (
    let index = 0;
    index < keys.length;
    index += 1
  ) {

    if (
      BS_GACHA_RARITY_STAR[keys[index]] ===
      level
    ) {

      return keys[index];

    }

  }

  return null;

}


function getBsGachaStarLabel(star) {

  const key =
    getBsGachaStarRarityKey(star);

  if (!key) {

    return "";

  }

  return getRarityLabel(key);

}


function isBsGachaSingleResult(results) {

  return (
    Array.isArray(results) &&
    results.length === 1
  );

}


function setBsGachaRevealPhase(phase) {

  if (!bsGachaReveal) {

    return;

  }

  if (phase) {

    bsGachaReveal.dataset.phase =
      phase;

    return;

  }

  delete bsGachaReveal.dataset.phase;

}


function resetBsGachaReveal() {

  bsGachaRevealReady = false;

  bsGachaRevealClosing = false;

  if (bsGachaRevealCharacter) {

    bsGachaRevealCharacter.onload = null;

    bsGachaRevealCharacter.onerror = null;

    bsGachaRevealCharacter.removeAttribute(
      "src"
    );

    bsGachaRevealCharacter.alt = "";

    bsGachaRevealCharacter.classList.remove(
      "is-silhouette",
      "is-shown",
      "is-color"
    );

  }

  if (bsGachaRevealFlash) {

    bsGachaRevealFlash.style.opacity = "0";

  }

  if (bsGachaRevealNumber) {

    bsGachaRevealNumber.textContent = "";

  }

  if (bsGachaRevealRarity) {

    bsGachaRevealRarity.textContent = "";

  }

  if (bsGachaRevealName) {

    bsGachaRevealName.textContent = "";

  }

  if (bsGachaRevealGroup) {

    bsGachaRevealGroup.textContent = "";

  }

  if (bsGachaRevealStatus) {

    bsGachaRevealStatus.textContent = "";

    bsGachaRevealStatus.hidden = true;

    bsGachaRevealStatus.classList.remove(
      "is-new",
      "is-fragment"
    );

  }

  if (bsGachaRevealTap) {

    bsGachaRevealTap.hidden = true;

  }

  if (bsGachaRevealProgress) {

    bsGachaRevealProgress.textContent = "";

    bsGachaRevealProgress.hidden = true;

  }

  if (bsGachaReveal) {

    bsGachaReveal.hidden = true;

    bsGachaReveal.setAttribute(
      "aria-hidden",
      "true"
    );

    bsGachaReveal.removeAttribute(
      "tabindex"
    );

  bsGachaReveal.classList.remove(
    "is-open",
    "is-silhouette",
    "is-info",
    "is-ready",
    "is-closing"
  );

  if (bsGachaScreen) {

    bsGachaScreen.classList.remove(
      "is-revealing"
    );

  }

  }

  setBsGachaRevealPhase("");

}


function cancelBsGachaReveal() {

  bsGachaRevealToken += 1;

  bsGachaRevealActive = false;

  settleBsGachaRevealAdvance("cancel");

  resetBsGachaReveal();

}


function enterBsGachaPresentation() {

  if (bsGachaScreen) {

    bsGachaScreen.classList.add(
      "is-presenting"
    );

  }

  closeBsGachaPrompt();

}


function exitBsGachaPresentation() {

  if (!bsGachaScreen) {

    return;

  }

  bsGachaScreen.classList.remove(
    "is-presenting"
  );

}


function hideBsGachaSkip() {

  bsGachaSkipEnabled = false;

  if (!bsGachaSkip) {

    return;

  }

  bsGachaSkip.hidden = true;

  bsGachaSkip.disabled = true;

  bsGachaSkip.setAttribute(
    "aria-hidden",
    "true"
  );

}


function showBsGachaSkipForTenPull() {

  if (!bsGachaSkip) {

    return;

  }

  bsGachaSkipping = false;

  bsGachaSkipEnabled = true;

  bsGachaSkip.disabled = false;

  bsGachaSkip.hidden = false;

  bsGachaSkip.setAttribute(
    "aria-hidden",
    "false"
  );

}


function skipBsGachaTenPullPresentation() {

  if (
    !bsGachaSkipEnabled ||
    bsGachaSkipping ||
    bsGachaSummaryOpen
  ) {

    return;

  }

  const results =
    Array.isArray(
      bsGachaPresentationResults
    )
      ? bsGachaPresentationResults.slice()
      : [];

  if (results.length !== 10) {

    return;

  }

  bsGachaSkipping = true;

  hideBsGachaSkip();

  bsGachaSequenceToken += 1;

  cancelBsGachaLighting();

  cancelBsGachaReveal();

  clearBsGachaRevealQueue();

  const opened =
    openBsGachaSummary(results);

  if (!opened) {

    exitBsGachaPresentation();

    setBsGachaBusy(false);

  }

  bsGachaSkipping = false;

}


function cancelBsGachaPullPresentation() {

  bsGachaSequenceToken += 1;

  clearBsGachaRevealQueue();

  bsGachaPresentationResults = [];

  hideBsGachaSkip();

  cancelBsGachaLighting();

  cancelBsGachaReveal();

  resetBsGachaSummary();

  exitBsGachaPresentation();

  setBsGachaBusy(false);

}


function loadBsGachaRevealImage(src) {

  return new Promise((resolve) => {

    if (
      !bsGachaRevealCharacter ||
      !src
    ) {

      resolve(false);

      return;

    }

    let settled = false;

    const finish = (ok) => {

      if (settled) {

        return;

      }

      settled = true;

      bsGachaRevealCharacter.onload = null;

      bsGachaRevealCharacter.onerror = null;

      resolve(ok);

    };

    bsGachaRevealCharacter.onload = () => {

      finish(
        bsGachaRevealCharacter.naturalWidth > 0
      );

    };

    bsGachaRevealCharacter.onerror = () => {

      finish(false);

    };

    bsGachaRevealCharacter.removeAttribute(
      "src"
    );

    void bsGachaRevealCharacter.offsetWidth;

    bsGachaRevealCharacter.src = src;

    if (bsGachaRevealCharacter.complete) {

      finish(
        bsGachaRevealCharacter.naturalWidth > 0
      );

    }

  });

}


function fillBsGachaRevealCopy(
  character,
  result
) {

  if (bsGachaRevealNumber) {

    bsGachaRevealNumber.textContent =
      getAllyCharacterNumberLabel(
        character
      );

  }

  if (bsGachaRevealRarity) {

    bsGachaRevealRarity.textContent =
      getBsGachaStarLabel(
        result && result.rarity
      );

  }

  if (bsGachaRevealName) {

    bsGachaRevealName.textContent =
      character && character.name
        ? character.name
        : "";

  }

  if (bsGachaRevealGroup) {

    bsGachaRevealGroup.textContent =
      getCharacterGroup(character);

  }

  if (!bsGachaRevealStatus) {

    return;

  }

  bsGachaRevealStatus.textContent = "";

  bsGachaRevealStatus.hidden = true;

  bsGachaRevealStatus.classList.remove(
    "is-new",
    "is-fragment"
  );

  if (result && result.isNew === true) {

    bsGachaRevealStatus.textContent =
      "NEW";

    bsGachaRevealStatus.hidden = false;

    bsGachaRevealStatus.classList.add(
      "is-new"
    );

    bsGachaRevealStatus.hidden = true;

    return;

  }

  const amount =
    Number(
      result && result.fragmentAmount
    );

  const fragments =
    Number.isFinite(amount)
      ? Math.max(0, Math.floor(amount))
      : 0;

  bsGachaRevealStatus.textContent =
    "カケラ +" + String(fragments);

  bsGachaRevealStatus.hidden = false;

  bsGachaRevealStatus.classList.add(
    "is-fragment"
  );

  bsGachaRevealStatus.hidden = true;

}


function clearBsGachaRevealQueue() {

  bsGachaRevealQueue = [];

  bsGachaRevealQueueIndex = -1;

  bsGachaRevealCycle = 0;

}


function settleBsGachaRevealAdvance(reason) {

  const pending = bsGachaRevealAdvance;

  bsGachaRevealAdvance = null;

  if (typeof pending === "function") {

    pending(reason);

  }

}


function armBsGachaRevealAdvance() {

  settleBsGachaRevealAdvance("replaced");

  return new Promise((resolve) => {

    bsGachaRevealAdvance = resolve;

  });

}


function updateBsGachaRevealProgress() {

  if (!bsGachaRevealProgress) {

    return;

  }

  const total = bsGachaRevealQueue.length;

  if (
    total <= 1 ||
    bsGachaRevealQueueIndex < 0
  ) {

    bsGachaRevealProgress.textContent = "";

    bsGachaRevealProgress.hidden = true;

    return;

  }

  bsGachaRevealProgress.textContent =
    String(bsGachaRevealQueueIndex + 1) +
    " / " +
    String(total);

  bsGachaRevealProgress.hidden = false;

}


function getBsGachaRevealTiming(mode, beat) {

  const multi = mode === "multi";

  if (prefersBsGachaReducedMotion()) {

    return {
      silhouette: multi ? 180 : 220,
      flashHold: 70,
      flashPeak: multi ? 0.22 : 0.3,
      flashClear: multi ? 40 : 70,
      beforeInfo: 80,
      beforeReady: 40,
      fade: 16
    };

  }

  if (multi) {

    const opening = beat === "open";

    const closing = beat === "last";

    return {
      silhouette: opening || closing ? 500 : 380,
      flashHold: 90,
      flashPeak: 0.86,
      flashClear: 70,
      beforeInfo: closing ? 280 : 220,
      beforeReady: closing ? 340 : 200,
      fade: 220
    };

  }

  return {
    silhouette: 1080,
    flashHold: 110,
    flashPeak: 0.96,
    flashClear: 70,
    beforeInfo: 240,
    beforeReady: 260,
    fade: 280
  };

}


function replayBsGachaRevealClass(
  element,
  className
) {

  if (!element) {

    return;

  }

  element.classList.remove(className);

  element.style.animation = "none";

  void element.offsetWidth;

  element.style.animation = "";

  element.classList.add(className);

}


function getBsGachaSummaryStarMark(rarity) {

  const label =
    getBsGachaStarLabel(rarity);

  const stars =
    String(label).replace(
      /[^★]/g,
      ""
    );

  return stars || label;

}


function buildBsGachaSummaryCard(
  result,
  index
) {

  const card =
    document.createElement("article");

  card.className =
    "bs-gacha-summary-card";

  card.setAttribute("role", "listitem");

  card.dataset.index = String(index);

  const rarity = Number(
    result && result.rarity
  );

  if (
    rarity >= 1 &&
    rarity <= 4
  ) {

    card.dataset.rarity =
      String(rarity);

  }

  const character =
    result &&
    CHARACTERS[result.characterId];

  const menuSrc =
    character &&
    character.images &&
    character.images.menu;

  const image =
    document.createElement("img");

  image.className =
    "bs-gacha-summary-image";

  image.alt =
    character && character.name
      ? character.name
      : "";

  image.draggable = false;

  if (menuSrc) {

    image.src = menuSrc;

  }

  const rarityEl =
    document.createElement("p");

  rarityEl.className =
    "bs-gacha-summary-rarity";

  const label =
    getBsGachaStarLabel(
      result && result.rarity
    );

  rarityEl.textContent =
    getBsGachaSummaryStarMark(
      result && result.rarity
    );

  if (label) {

    rarityEl.title = label;

    rarityEl.setAttribute(
      "aria-label",
      label
    );

  }

  const nameEl =
    document.createElement("p");

  nameEl.className =
    "bs-gacha-summary-name";

  nameEl.textContent =
    character && character.name
      ? character.name
      : "";

  const statusEl =
    document.createElement("p");

  statusEl.className =
    "bs-gacha-summary-status";

  if (result && result.isNew === true) {

    statusEl.textContent = "NEW";

    statusEl.classList.add("is-new");

  } else {

    const amount = Number(
      result && result.fragmentAmount
    );

    const fragments =
      Number.isFinite(amount)
        ? Math.max(0, Math.floor(amount))
        : 0;

    statusEl.textContent =
      "カケラ +" + String(fragments);

    statusEl.classList.add(
      "is-fragment"
    );

  }

  card.append(
    image,
    rarityEl,
    nameEl,
    statusEl
  );

  return card;

}


function resetBsGachaSummary() {

  bsGachaSummaryOpen = false;

  bsGachaSummaryClosing = false;

  bsGachaSummaryResults = [];

  if (bsGachaSummaryGrid) {

    bsGachaSummaryGrid.replaceChildren();

  }

  if (bsGachaSummaryClose) {

    bsGachaSummaryClose.disabled = false;

  }

  if (!bsGachaSummary) {

    return;

  }

  bsGachaSummary.hidden = true;

  bsGachaSummary.setAttribute(
    "aria-hidden",
    "true"
  );

  bsGachaSummary.classList.remove(
    "is-open",
    "is-closing"
  );

}


function openBsGachaSummary(results) {

  if (
    !bsGachaSummary ||
    !bsGachaSummaryGrid ||
    bsGachaSummaryOpen ||
    !Array.isArray(results) ||
    results.length < 2
  ) {

    return false;

  }

  hideBsGachaSkip();

  bsGachaSummaryResults =
    results.slice();

  bsGachaSummaryGrid.replaceChildren();

  const reduced =
    prefersBsGachaReducedMotion();

  for (
    let index = 0;
    index < bsGachaSummaryResults.length;
    index += 1
  ) {

    const card =
      buildBsGachaSummaryCard(
        bsGachaSummaryResults[index],
        index
      );

    if (!reduced) {

      card.style.animationDelay =
        String(index * 50) + "ms";

    }

    bsGachaSummaryGrid.appendChild(
      card
    );

  }

  bsGachaSummaryOpen = true;

  bsGachaSummaryClosing = false;

  bsGachaSummary.hidden = false;

  bsGachaSummary.setAttribute(
    "aria-hidden",
    "false"
  );

  bsGachaSummary.classList.remove(
    "is-closing"
  );

  void bsGachaSummary.offsetWidth;

  bsGachaSummary.classList.add(
    "is-open"
  );

  if (bsGachaScreen) {

    bsGachaScreen.classList.add(
      "is-presenting"
    );

  }

  setBsGachaBusy(true);

  return true;

}


function finishBsGachaSummary() {

  resetBsGachaSummary();

  resetBsGachaReveal();

  resetBsGachaLighting();

  clearBsGachaRevealQueue();

  bsGachaPresentationResults = [];

  hideBsGachaSkip();

  exitBsGachaPresentation();

  bsGachaRevealActive = false;

  bsGachaRevealReady = false;

  bsGachaRevealClosing = false;

  setBsGachaBusy(false);

}


function closeBsGachaSummary() {

  if (
    !bsGachaSummaryOpen ||
    bsGachaSummaryClosing ||
    !bsGachaSummary
  ) {

    return;

  }

  bsGachaSummaryClosing = true;

  if (bsGachaSummaryClose) {

    bsGachaSummaryClose.disabled = true;

  }

  const token = bsGachaSequenceToken;

  bsGachaSummary.classList.add(
    "is-closing"
  );

  bsGachaSummary.classList.remove(
    "is-open"
  );

  window.setTimeout(() => {

    if (token !== bsGachaSequenceToken) {

      return;

    }

    finishBsGachaSummary();

  }, prefersBsGachaReducedMotion() ? 16 : 200);

}


function finishBsGachaRevealSequence() {

  resetBsGachaReveal();

  resetBsGachaLighting();

  resetBsGachaSummary();

  clearBsGachaRevealQueue();

  hideBsGachaSkip();

  exitBsGachaPresentation();

  bsGachaRevealActive = false;

  bsGachaRevealReady = false;

  bsGachaRevealClosing = false;

  setBsGachaBusy(false);

}


async function presentBsGachaResult(
  result,
  sequenceToken,
  options
) {

  const mode =
    options && options.mode === "multi"
      ? "multi"
      : "single";

  if (
    bsGachaRevealActive ||
    !bsGachaReveal ||
    !bsGachaRevealCharacter ||
    !result
  ) {

    return false;

  }

  const character =
    CHARACTERS[result.characterId];

  const menuSrc =
    character &&
    character.images &&
    character.images.menu;

  if (!character || !menuSrc) {

    return false;

  }

  bsGachaRevealActive = true;

  const token =
    bsGachaRevealToken + 1;

  bsGachaRevealToken = token;

  setBsGachaBusy(true);

  resetBsGachaReveal();

  bsGachaRevealActive = true;

  bsGachaRevealCycle += 1;

  const timing =
    getBsGachaRevealTiming(
      mode,
      options && options.beat
    );

  fillBsGachaRevealCopy(
    character,
    result
  );

  updateBsGachaRevealProgress();

  bsGachaRevealCharacter.alt =
    character.name || "";

  bsGachaRevealCharacter.dataset.cycle =
    String(bsGachaRevealCycle);

  const loaded =
    await loadBsGachaRevealImage(menuSrc);

  if (
    !loaded ||
    token !== bsGachaRevealToken ||
    sequenceToken !== bsGachaSequenceToken
  ) {

    if (token === bsGachaRevealToken) {

      cancelBsGachaReveal();

    }

    return false;

  }

  bsGachaReveal.hidden = false;

  bsGachaReveal.setAttribute(
    "aria-hidden",
    "true"
  );

  if (bsGachaScreen) {

    bsGachaScreen.classList.add(
      "is-revealing"
    );

  }

  bsGachaReveal.classList.add(
    "is-open",
    "is-silhouette"
  );

  replayBsGachaRevealClass(
    bsGachaRevealCharacter,
    "is-silhouette"
  );

  setBsGachaRevealPhase("silhouette");

  await waitBsGachaLighting(20);

  if (token !== bsGachaRevealToken) {

    return false;

  }

  replayBsGachaRevealClass(
    bsGachaRevealCharacter,
    "is-shown"
  );

  await waitBsGachaLighting(
    timing.silhouette
  );

  if (token !== bsGachaRevealToken) {

    return false;

  }

  setBsGachaRevealPhase("flash");

  if (bsGachaRevealFlash) {

    bsGachaRevealFlash.style.opacity = "0";

    void bsGachaRevealFlash.offsetWidth;

    bsGachaRevealFlash.style.opacity =
      String(timing.flashPeak);

  }

  await waitBsGachaLighting(
    timing.flashHold
  );

  if (token !== bsGachaRevealToken) {

    return false;

  }

  bsGachaRevealCharacter.classList.remove(
    "is-silhouette"
  );

  replayBsGachaRevealClass(
    bsGachaRevealCharacter,
    "is-color"
  );

  bsGachaReveal.classList.remove(
    "is-silhouette"
  );

  setBsGachaRevealPhase("color");

  await waitBsGachaLighting(
    timing.flashClear
  );

  if (bsGachaRevealFlash) {

    bsGachaRevealFlash.style.opacity = "0";

  }

  await waitBsGachaLighting(
    timing.beforeInfo
  );

  if (token !== bsGachaRevealToken) {

    return false;

  }

  bsGachaReveal.classList.add("is-info");

  if (bsGachaRevealStatus) {

    bsGachaRevealStatus.hidden = false;

  }

  setBsGachaRevealPhase("info");

  await waitBsGachaLighting(
    timing.beforeReady
  );

  if (token !== bsGachaRevealToken) {

    return false;

  }

  bsGachaRevealReady = true;

  bsGachaReveal.classList.add("is-ready");

  bsGachaReveal.setAttribute(
    "aria-hidden",
    "false"
  );

  bsGachaReveal.tabIndex = 0;

  if (bsGachaRevealTap) {

    bsGachaRevealTap.hidden = false;

  }

  setBsGachaRevealPhase("ready");

  return true;

}


async function playBsGachaSingleReveal(
  result,
  sequenceToken
) {

  return presentBsGachaResult(
    result,
    sequenceToken,
    {
      mode: "single"
    }
  );

}


function closeBsGachaReveal() {

  if (
    !bsGachaRevealReady ||
    bsGachaRevealClosing ||
    !bsGachaRevealActive
  ) {

    return;

  }

  bsGachaRevealReady = false;

  bsGachaRevealClosing = true;

  if (bsGachaReveal) {

    bsGachaReveal.classList.remove(
      "is-ready"
    );

    bsGachaReveal.classList.add(
      "is-closing"
    );

    bsGachaReveal.setAttribute(
      "aria-hidden",
      "true"
    );

  }

  setBsGachaRevealPhase("closing");

  settleBsGachaRevealAdvance("advance");

}


function handleBsGachaRevealTap(event) {

  if (event) {

    event.preventDefault();

  }

  closeBsGachaReveal();

}


async function fadeBsGachaRevealOut(
  sequenceToken
) {

  const token = bsGachaRevealToken;

  const timing =
    getBsGachaRevealTiming(
      bsGachaRevealQueue.length > 1
        ? "multi"
        : "single"
    );

  await waitBsGachaLighting(
    timing.fade
  );

  if (
    sequenceToken !== bsGachaSequenceToken ||
    token !== bsGachaRevealToken
  ) {

    return false;

  }

  resetBsGachaReveal();

  bsGachaRevealActive = false;

  return true;

}


function abortBsGachaRevealSequence(
  sequenceToken
) {

  if (sequenceToken !== bsGachaSequenceToken) {

    return;

  }

  clearBsGachaRevealQueue();

  hideBsGachaSkip();

  resetBsGachaSummary();

  exitBsGachaPresentation();

  bsGachaRevealActive = false;

  setBsGachaBusy(false);

}


async function playBsGachaRevealQueue(
  sequenceToken,
  results
) {

  bsGachaRevealQueue =
    Array.isArray(results)
      ? results.slice()
      : [];

  bsGachaRevealQueueIndex = 0;

  const mode =
    isBsGachaSingleResult(bsGachaRevealQueue)
      ? "single"
      : "multi";

  while (
    bsGachaRevealQueueIndex <
    bsGachaRevealQueue.length
  ) {

    if (sequenceToken !== bsGachaSequenceToken) {

      return;

    }

    const advance =
      armBsGachaRevealAdvance();

    const revealed =
      await presentBsGachaResult(
        bsGachaRevealQueue[
          bsGachaRevealQueueIndex
        ],
        sequenceToken,
        {
          mode: mode,
          beat:
            bsGachaRevealQueueIndex <= 0
              ? "open"
              : (
                bsGachaRevealQueueIndex >=
                bsGachaRevealQueue.length - 1
                  ? "last"
                  : "mid"
              )
        }
      );

    if (sequenceToken !== bsGachaSequenceToken) {

      return;

    }

    if (!revealed) {

      settleBsGachaRevealAdvance("failed");

      abortBsGachaRevealSequence(
        sequenceToken
      );

      return;

    }

    const action = await advance;

    if (
      action !== "advance" ||
      sequenceToken !== bsGachaSequenceToken
    ) {

      return;

    }

    const last =
      bsGachaRevealQueueIndex >=
      bsGachaRevealQueue.length - 1;

    const faded =
      await fadeBsGachaRevealOut(
        sequenceToken
      );

    if (
      !faded ||
      sequenceToken !== bsGachaSequenceToken
    ) {

      return;

    }

    if (last) {

      if (
        mode === "multi" &&
        openBsGachaSummary(
          bsGachaRevealQueue
        )
      ) {

        clearBsGachaRevealQueue();

        return;

      }

      finishBsGachaRevealSequence();

      return;

    }

    bsGachaRevealQueueIndex += 1;

  }

}


async function playBsGachaPullPresentation(
  token,
  rarity,
  results
) {

  const list =
    Array.isArray(results)
      ? results.slice()
      : [];

  const played =
    await playBsGachaLighting(
      rarity,
      {
        holdBusy: true
      }
    );

  if (
    token !== bsGachaSequenceToken ||
    !played
  ) {

    if (
      token === bsGachaSequenceToken &&
      !bsGachaRevealActive
    ) {

      clearBsGachaRevealQueue();

      exitBsGachaPresentation();

      setBsGachaBusy(false);

    }

    return;

  }

  await playBsGachaRevealQueue(
    token,
    list
  );

}


function startBsGachaPullPresentation(outcome) {

  if (
    bsGachaLightingActive ||
    bsGachaRevealActive
  ) {

    return false;

  }

  const results =
    outcome &&
    Array.isArray(outcome.results)
      ? outcome.results.slice()
      : [];

  const rarity =
    getBsGachaHighestRarity(results);

  if (rarity < 1) {

    setBsGachaBusy(false);

    return false;

  }

  const token =
    bsGachaSequenceToken + 1;

  bsGachaSequenceToken = token;

  bsGachaPresentationResults =
    results.slice();

  if (results.length === 10) {

    showBsGachaSkipForTenPull();

  } else {

    hideBsGachaSkip();

  }

  playBsGachaPullPresentation(
    token,
    rarity,
    results
  );

  return true;

}


function getBsGachaScreenBanner() {

  const enabled =
    getEnabledBsGachaBanners();

  if (enabled.length > 0) {

    return enabled[0];

  }

  return getBsGachaBanner("normal");

}


function getBsGachaScreenMultiCount(
  banner
) {

  const count =
    Number(
      banner &&
      banner.costs &&
      banner.costs.multiCount
    );

  if (
    !Number.isInteger(count) ||
    count <= 1
  ) {

    return null;

  }

  return count;

}


function formatBsGachaCostLine(
  banner,
  count
) {

  const passCost =
    getBsGachaPullCost(
      banner,
      count,
      BS_GACHA_CURRENCY.BS_PASS
    );

  const gyaraCost =
    getBsGachaPullCost(
      banner,
      count,
      BS_GACHA_CURRENCY.GYARA
    );

  return (
    "PASS " +
    (
      passCost == null
        ? "—"
        : String(passCost)
    ) +
    " / ギャラ " +
    (
      gyaraCost == null
        ? "—"
        : String(gyaraCost)
    )
  );

}


function getBsGachaFailureMessage(
  reason,
  paymentType
) {

  if (reason === "invalid_banner") {

    return "ガチャを開けません。";

  }

  if (reason === "disabled_banner") {

    return "このガチャは現在利用できません。";

  }

  if (reason === "invalid_count") {

    return "回数を選べません。";

  }

  if (reason === "invalid_payment") {

    return "支払い方法を選べません。";

  }

  if (reason === "insufficient_currency") {

    if (
      paymentType ===
      BS_GACHA_CURRENCY.BS_PASS
    ) {

      return "BS PASSが足りません。";

    }

    if (
      paymentType ===
      BS_GACHA_CURRENCY.GYARA
    ) {

      return "ギャラが足りません。";

    }

    return "通貨が足りません。";

  }

  if (reason === "empty_pool") {

    return "現在、引けるキャラがいません。";

  }

  if (reason === "guarantee_unavailable") {

    return "現在は★3以上の候補がいないため、10連は引けません。";

  }

  return "抽選に失敗しました。";

}


function clearBsGachaMessage() {

  if (!bsGachaMessage) {

    return;

  }

  bsGachaMessage.hidden = true;

  bsGachaMessage.textContent = "";

}


function showBsGachaMessage(text) {

  if (!bsGachaMessage) {

    return;

  }

  bsGachaMessage.textContent = text;

  bsGachaMessage.hidden = false;

}


function isBsGachaPromptOpen() {

  return !!(
    bsGachaPromptEl &&
    bsGachaPromptEl.hidden !== true
  );

}


function closeBsGachaPrompt() {

  bsGachaPrompt = null;

  if (bsGachaPromptEl) {

    bsGachaPromptEl.hidden = true;

  }

  if (bsGachaPayStep) {

    bsGachaPayStep.hidden = false;

  }

  if (bsGachaConfirmStep) {

    bsGachaConfirmStep.hidden = true;

  }

}


function setBsGachaPayButton(
  button,
  label,
  cost,
  balance
) {

  if (!button) {

    return;

  }

  button.classList.remove("is-short");

  button.replaceChildren();

  if (cost == null) {

    button.textContent = label;

    button.disabled = true;

    button.removeAttribute("title");

    return;

  }

  const short = balance < cost;

  const name =
    document.createElement("span");

  name.className = "bs-gacha-pay-label";

  name.textContent = label;

  const need =
    document.createElement("span");

  need.className = "bs-gacha-pay-need";

  need.textContent = short
    ? "不足"
    : "必要 " + String(cost);

  button.append(name, need);

  button.classList.toggle(
    "is-short",
    short
  );

  if (short) {

    button.title = "所持が足りません";

  } else {

    button.removeAttribute("title");

  }

  button.disabled =
    isBsGachaBusy ||
    short;

}


function applyBsGachaPaymentAvailability() {

  const banner =
    getBsGachaScreenBanner();

  const count =
    bsGachaPrompt &&
    bsGachaPrompt.count;

  const passCost =
    getBsGachaPullCost(
      banner,
      count,
      BS_GACHA_CURRENCY.BS_PASS
    );

  const gyaraCost =
    getBsGachaPullCost(
      banner,
      count,
      BS_GACHA_CURRENCY.GYARA
    );

  setBsGachaPayButton(
    bsGachaPayPass,
    "BS PASS",
    passCost,
    getBsPass()
  );

  setBsGachaPayButton(
    bsGachaPayGyara,
    "ギャラ",
    gyaraCost,
    getGyara()
  );

  if (bsGachaPayNote) {

    bsGachaPayNote.textContent =
      "所持 🎟 " +
      String(getBsPass()) +
      " / 💰 " +
      String(getGyara());

  }

  if (bsGachaPayCancel) {

    bsGachaPayCancel.disabled =
      isBsGachaBusy;

  }

  if (bsGachaConfirmOk) {

    bsGachaConfirmOk.disabled =
      isBsGachaBusy;

  }

  if (bsGachaConfirmCancel) {

    bsGachaConfirmCancel.disabled =
      isBsGachaBusy;

  }

}


function syncBsGachaControls() {

  const banner =
    getBsGachaScreenBanner();

  const bannerOff =
    !banner ||
    banner.enabled !== true;

  const multiCount =
    getBsGachaScreenMultiCount(banner);

  if (bsGachaPull1) {

    bsGachaPull1.disabled =
      isBsGachaBusy ||
      bannerOff;

  }

  if (bsGachaPull10) {

    bsGachaPull10.disabled =
      isBsGachaBusy ||
      bannerOff ||
      multiCount == null;

  }

  if (bsGachaBack) {

    bsGachaBack.disabled =
      isBsGachaBusy;

  }

  applyBsGachaPaymentAvailability();

}


function setBsGachaBusy(busy) {

  isBsGachaBusy = !!busy;

  syncBsGachaControls();

}


function renderBsGachaScreen() {

  const banner =
    getBsGachaScreenBanner();

  const multiCount =
    getBsGachaScreenMultiCount(banner);

  if (bsGachaTitle) {

    bsGachaTitle.textContent =
      banner && banner.title
        ? banner.title
        : "";

  }

  if (bsGachaPull1Label) {

    bsGachaPull1Label.textContent =
      "1回引く";

  }

  if (bsGachaPull10Label) {

    bsGachaPull10Label.textContent =
      multiCount == null
        ? ""
        : (
          multiCount === 10
            ? "10連"
            : String(multiCount) + "回引く"
        );

  }

  if (bsGachaCost1) {

    bsGachaCost1.textContent =
      banner
        ? formatBsGachaCostLine(
          banner,
          1
        )
        : "";

  }

  if (bsGachaCost10) {

    bsGachaCost10.textContent =
      banner && multiCount != null
        ? formatBsGachaCostLine(
          banner,
          multiCount
        )
        : "";

  }

  if (bsGachaGuarantee) {

    const guarantee =
      banner &&
      banner.guarantee;

    const minRarity =
      guarantee &&
      getBsGachaRarityStar(
        guarantee.minRarity
      );

    if (
      guarantee &&
      guarantee.enabled === true &&
      multiCount != null &&
      minRarity != null
    ) {

      bsGachaGuarantee.textContent =
        String(multiCount) +
        "連の最後の1枠は★" +
        String(minRarity) +
        "以上";

    } else {

      bsGachaGuarantee.textContent =
        "";

    }

  }

  if (!banner) {

    showBsGachaMessage(
      getBsGachaFailureMessage(
        "invalid_banner"
      )
    );

  } else if (banner.enabled !== true) {

    showBsGachaMessage(
      getBsGachaFailureMessage(
        "disabled_banner"
      )
    );

  }

  syncBsGachaControls();

}


function openBsGachaPayment(count) {

  if (
    isBsGachaBusy ||
    !bsGachaPromptEl
  ) {

    return;

  }

  const banner =
    getBsGachaScreenBanner();

  if (
    !banner ||
    banner.enabled !== true
  ) {

    showBsGachaMessage(
      getBsGachaFailureMessage(
        banner
          ? "disabled_banner"
          : "invalid_banner"
      )
    );

    return;

  }

  const multiCount =
    getBsGachaScreenMultiCount(banner);

  if (
    count !== 1 &&
    count !== multiCount
  ) {

    showBsGachaMessage(
      getBsGachaFailureMessage(
        "invalid_count"
      )
    );

    return;

  }

  bsGachaPrompt = {

    count: count,

    paymentType: null

  };

  if (bsGachaPayStep) {

    bsGachaPayStep.hidden = false;

  }

  if (bsGachaConfirmStep) {

    bsGachaConfirmStep.hidden = true;

  }

  applyBsGachaPaymentAvailability();

  bsGachaPromptEl.hidden = false;

}


function buildBsGachaConfirmText(
  count,
  paymentType,
  cost
) {

  if (
    paymentType ===
    BS_GACHA_CURRENCY.BS_PASS
  ) {

    return (
      "BS PASSを" +
      String(cost) +
      "枚使って" +
      String(count) +
      "回引きますか？"
    );

  }

  return (
    "ギャラを" +
    String(cost) +
    "使って" +
    String(count) +
    "回引きますか？"
  );

}


function openBsGachaConfirm(
  count,
  paymentType
) {

  if (
    isBsGachaBusy ||
    !bsGachaPrompt ||
    bsGachaPrompt.count !== count
  ) {

    return;

  }

  if (
    paymentType !==
      BS_GACHA_CURRENCY.BS_PASS &&
    paymentType !==
      BS_GACHA_CURRENCY.GYARA
  ) {

    showBsGachaMessage(
      getBsGachaFailureMessage(
        "invalid_payment",
        paymentType
      )
    );

    return;

  }

  const banner =
    getBsGachaScreenBanner();

  const cost =
    getBsGachaPullCost(
      banner,
      count,
      paymentType
    );

  if (cost == null) {

    showBsGachaMessage(
      getBsGachaFailureMessage(
        "invalid_payment",
        paymentType
      )
    );

    return;

  }

  bsGachaPrompt.paymentType =
    paymentType;

  if (bsGachaConfirmText) {

    bsGachaConfirmText.textContent =
      buildBsGachaConfirmText(
        count,
        paymentType,
        cost
      );

  }

  if (bsGachaPayStep) {

    bsGachaPayStep.hidden = true;

  }

  if (bsGachaConfirmStep) {

    bsGachaConfirmStep.hidden = false;

  }

  if (bsGachaPromptEl) {

    bsGachaPromptEl.hidden = false;

  }

}


function handoffBsGachaPull(outcome) {

  bsGachaLastOutcome = outcome;

  updateBsPassDisplay();

  updateGyaraDisplay();

  enterBsGachaPresentation();

  showBsGachaMessage("抽選完了");

  const started =
    startBsGachaPullPresentation(outcome);

  if (
    !started &&
    !bsGachaLightingActive &&
    !bsGachaRevealActive
  ) {

    exitBsGachaPresentation();

    setBsGachaBusy(false);

  }

}


function confirmBsGachaPull() {

  if (isBsGachaBusy) {

    return;

  }

  const prompt = bsGachaPrompt;

  if (
    !prompt ||
    !prompt.paymentType
  ) {

    return;

  }

  const banner =
    getBsGachaScreenBanner();

  const count = prompt.count;

  const paymentType =
    prompt.paymentType;

  bsGachaPrompt = null;

  if (
    !banner ||
    banner.enabled !== true
  ) {

    closeBsGachaPrompt();

    showBsGachaMessage(
      getBsGachaFailureMessage(
        banner
          ? "disabled_banner"
          : "invalid_banner",
        paymentType
      )
    );

    return;

  }

  setBsGachaBusy(true);

  let outcome = null;

  try {

    outcome =
      executeBsGachaPull(
        banner.id,
        count,
        paymentType
      );

  } catch (error) {

    outcome = null;

  }

  if (
    !outcome ||
    outcome.ok !== true
  ) {

    closeBsGachaPrompt();

    showBsGachaMessage(
      getBsGachaFailureMessage(
        outcome && outcome.reason,
        paymentType
      )
    );

    updateBsPassDisplay();

    updateGyaraDisplay();

    setBsGachaBusy(false);

    return;

  }

  handoffBsGachaPull(outcome);

}


function openBsGacha() {

  if (!bsGachaScreen) {

    return;

  }

  cancelBsGachaPullPresentation();

  isBsGachaBusy = false;

  closeBsGachaPrompt();

  clearBsGachaMessage();

  renderBsGachaScreen();

  updateBsPassDisplay();

  updateGyaraDisplay();

  showScreen(bsGachaScreen);

}


function closeBsGacha() {

  cancelBsGachaPullPresentation();

  closeBsGachaPrompt();

  clearBsGachaMessage();

  openGachaLobby();

}


function handleBsGachaBack() {

  if (isBsGachaBusy) {

    return;

  }

  if (isBsGachaPromptOpen()) {

    closeBsGachaPrompt();

    return;

  }

  closeBsGacha();

}


if (bsGachaReveal) {

  bsGachaReveal.addEventListener(
    "click",
    (event) => {

      handleBsGachaRevealTap(event);

    }
  );

  bsGachaReveal.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {

        return;

      }

      handleBsGachaRevealTap(event);

    }
  );

}


if (bsGachaSummaryClose) {

  bsGachaSummaryClose.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      closeBsGachaSummary();

    }
  );

}


if (bsGachaSkip) {

  bsGachaSkip.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      event.stopPropagation();

      skipBsGachaTenPullPresentation();

    }
  );

}


if (bsGachaBack) {

  bsGachaBack.addEventListener(
    "click",
    () => {

      handleBsGachaBack();

    }
  );

}


if (bsGachaPull1) {

  bsGachaPull1.addEventListener(
    "click",
    () => {

      openBsGachaPayment(1);

    }
  );

}


if (bsGachaPull10) {

  bsGachaPull10.addEventListener(
    "click",
    () => {

      const banner =
        getBsGachaScreenBanner();

      openBsGachaPayment(
        getBsGachaScreenMultiCount(
          banner
        )
      );

    }
  );

}


if (bsGachaPayPass) {

  bsGachaPayPass.addEventListener(
    "click",
    () => {

      if (
        !bsGachaPrompt ||
        bsGachaPayPass.disabled
      ) {

        return;

      }

      openBsGachaConfirm(
        bsGachaPrompt.count,
        BS_GACHA_CURRENCY.BS_PASS
      );

    }
  );

}


if (bsGachaPayGyara) {

  bsGachaPayGyara.addEventListener(
    "click",
    () => {

      if (
        !bsGachaPrompt ||
        bsGachaPayGyara.disabled
      ) {

        return;

      }

      openBsGachaConfirm(
        bsGachaPrompt.count,
        BS_GACHA_CURRENCY.GYARA
      );

    }
  );

}


if (bsGachaPayCancel) {

  bsGachaPayCancel.addEventListener(
    "click",
    () => {

      if (isBsGachaBusy) {

        return;

      }

      closeBsGachaPrompt();

    }
  );

}


if (bsGachaConfirmOk) {

  bsGachaConfirmOk.addEventListener(
    "click",
    () => {

      confirmBsGachaPull();

    }
  );

}


if (bsGachaConfirmCancel) {

  bsGachaConfirmCancel.addEventListener(
    "click",
    () => {

      if (
        isBsGachaBusy ||
        !bsGachaPrompt
      ) {

        return;

      }

      openBsGachaPayment(
        bsGachaPrompt.count
      );

    }
  );

}


/* =========================
   DORITIKE GACHA SCREEN
========================= */

let isDoritikeGachaBusy =
  false;

let doritikeGachaLastPullCount =
  1;

let doritikeAnimSequenceId =
  0;

let doritikeAnimTimeoutIds =
  [];

let doritikeAnimActive =
  false;

let doritikeAnimPendingResults =
  null;

let doritikeAnimPendingPullCount =
  1;

let doritikeAnimPendingLine =
  "";


const doritikeGachaBack =
  document.getElementById(
    "doritike-gacha-back"
  );

const doritikeGachaMain =
  document.getElementById(
    "doritike-gacha-main"
  );

const doritikeGachaAnimation =
  document.getElementById(
    "doritike-gacha-animation"
  );

const doritikeGachaResult =
  document.getElementById(
    "doritike-gacha-result"
  );

const doritikeGachaMessage =
  document.getElementById(
    "doritike-gacha-message"
  );

const doritikeGachaPull1 =
  document.getElementById(
    "doritike-gacha-pull-1"
  );

const doritikeGachaPull10 =
  document.getElementById(
    "doritike-gacha-pull-10"
  );

const doritikeGachaResultList =
  document.getElementById(
    "doritike-gacha-result-list"
  );

const doritikeGachaAgain =
  document.getElementById(
    "doritike-gacha-again"
  );

const doritikeGachaResultBack =
  document.getElementById(
    "doritike-gacha-result-back"
  );

const doritikeGachaClerkLine =
  document.getElementById(
    "doritike-gacha-clerk-line"
  );

const doritikeGachaRummage =
  document.getElementById(
    "doritike-gacha-rummage"
  );

const doritikeGachaResultLine =
  document.getElementById(
    "doritike-gacha-result-line"
  );


const DORITIKE_CLERK_LINE_ENCORE =
  "……これ、あったわ。";

const DORITIKE_CLERK_LINE_JACKPOT =
  "もう一個持ってけ。";

const DORITIKE_CLERK_LINE_GOOD =
  "お、ええやん。";

const DORITIKE_CLERK_LINE_NORMAL =
  "ほい。";


function formatDoritikeGachaAmount(
  amount
) {

  const number =
    Number(amount);

  if (!Number.isFinite(number)) {

    return String(amount);

  }

  return number.toLocaleString(
    "ja-JP"
  );

}


function getDoritikeGachaResultLabel(
  result
) {

  if (
    !result ||
    typeof result !== "object"
  ) {

    return {
      name: "不明",
      amountText: "",
      jackpot: false
    };

  }

  if (
    result.category ===
    "fragment"
  ) {

    const character =
      CHARACTERS[
        result.characterId
      ];

    const characterName =
      character && character.name
        ? character.name
        : "キャラクター";

    return {
      name:
        characterName +
        "のかけら",
      amountText:
        "×" +
        formatDoritikeGachaAmount(
          result.amount
        ),
      jackpot: false
    };

  }

  if (result.category === "beats") {

    return {
      name: "BEATS",
      amountText:
        "×" +
        formatDoritikeGachaAmount(
          result.amount
        ),
      jackpot: false
    };

  }

  if (result.category === "item") {

    const item =
      ITEMS[result.itemId];

    const itemName =
      item && item.name
        ? item.name
        : "アイテム";

    return {
      name: itemName,
      amountText:
        "×" +
        formatDoritikeGachaAmount(
          result.amount
        ),
      jackpot: !!result.jackpot
    };

  }

  return {
    name: "不明",
    amountText: "",
    jackpot: false
  };

}


function isDoritikeGachaResultGood(
  result
) {

  if (
    !result ||
    typeof result !== "object"
  ) {

    return false;

  }

  if (
    result.category ===
    "fragment"
  ) {

    return (
      Number(result.amount) >=
      20
    );

  }

  if (result.category === "beats") {

    return (
      Number(result.amount) >=
      2000
    );

  }

  if (result.category === "item") {

    if (
      result.itemId ===
      "encore"
    ) {

      return false;

    }

    return (
      result.itemId ===
        "engine" ||
      result.itemId ===
        "moshStaff"
    );

  }

  return false;

}


function getDoritikeClerkLine(
  results
) {

  const list =
    Array.isArray(results)
      ? results
      : results
        ? [results]
        : [];

  let hasEncore =
    false;

  let hasJackpot =
    false;

  let hasGood =
    false;

  list.forEach((result) => {

    if (
      !result ||
      typeof result !== "object"
    ) {

      return;

    }

    if (
      result.category ===
        "item" &&
      result.itemId ===
        "encore"
    ) {

      hasEncore = true;

      return;

    }

    if (result.jackpot === true) {

      hasJackpot = true;

    }

    if (
      isDoritikeGachaResultGood(
        result
      )
    ) {

      hasGood = true;

    }

  });

  if (hasEncore) {

    return DORITIKE_CLERK_LINE_ENCORE;

  }

  if (hasJackpot) {

    return DORITIKE_CLERK_LINE_JACKPOT;

  }

  if (hasGood) {

    return DORITIKE_CLERK_LINE_GOOD;

  }

  return DORITIKE_CLERK_LINE_NORMAL;

}


function prefersDoritikeReducedMotion() {

  return (
    typeof window !==
      "undefined" &&
    typeof window.matchMedia ===
      "function" &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  );

}


function setDoritikeGachaBusy(
  busy
) {

  isDoritikeGachaBusy =
    !!busy;

  const disabled =
    isDoritikeGachaBusy;

  if (doritikeGachaPull1) {

    doritikeGachaPull1.disabled =
      disabled;

  }

  if (doritikeGachaPull10) {

    doritikeGachaPull10.disabled =
      disabled;

  }

  if (doritikeGachaAgain) {

    doritikeGachaAgain.disabled =
      disabled;

  }

  if (doritikeGachaResultBack) {

    doritikeGachaResultBack.disabled =
      disabled;

  }

  if (doritikeGachaBack) {

    doritikeGachaBack.disabled =
      disabled;

  }

}


function clearDoritikeGachaMessage() {

  if (!doritikeGachaMessage) {

    return;

  }

  doritikeGachaMessage.hidden =
    true;

  doritikeGachaMessage.textContent =
    "";

}


function showDoritikeGachaMessage(
  text
) {

  if (!doritikeGachaMessage) {

    return;

  }

  doritikeGachaMessage.textContent =
    text;

  doritikeGachaMessage.hidden =
    false;

}


function clearDoritikeAnimTimeouts() {

  doritikeAnimTimeoutIds.forEach(
    (timeoutId) => {

      clearTimeout(timeoutId);

    }
  );

  doritikeAnimTimeoutIds = [];

}


function scheduleDoritikeAnimTimeout(
  sequenceId,
  delayMs,
  callback
) {

  const timeoutId =
    setTimeout(
      () => {

        if (
          sequenceId !==
          doritikeAnimSequenceId
        ) {

          return;

        }

        callback();

      },
      delayMs
    );

  doritikeAnimTimeoutIds.push(
    timeoutId
  );

}


function clearDoritikeAnimPhaseClasses() {

  if (!doritikeGachaAnimation) {

    return;

  }

  doritikeGachaAnimation.classList.remove(
    "is-x10",
    "phase-ticket",
    "phase-look",
    "phase-hand",
    "phase-rummage",
    "phase-rummage-b",
    "phase-hold",
    "phase-return",
    "phase-reveal",
    "phase-line"
  );

}


function setDoritikeAnimPhase(
  phaseClass
) {

  if (!doritikeGachaAnimation) {

    return;

  }

  doritikeGachaAnimation.classList.remove(
    "phase-ticket",
    "phase-look",
    "phase-hand",
    "phase-rummage",
    "phase-rummage-b",
    "phase-hold",
    "phase-return",
    "phase-reveal",
    "phase-line"
  );

  if (phaseClass) {

    doritikeGachaAnimation.classList.add(
      phaseClass
    );

  }

}


function clearDoritikePresentClasses() {

  if (!doritikeGachaScreen) {

    return;

  }

  doritikeGachaScreen.classList.remove(
    "is-presenting",
    "is-ready",
    "is-x10",
    "is-tone-good",
    "is-tone-jackpot",
    "is-tone-encore"
  );

}


function resetDoritikeGachaAnimation() {

  clearDoritikeAnimTimeouts();

  doritikeAnimActive =
    false;

  doritikeAnimPendingResults =
    null;

  doritikeAnimPendingPullCount =
    1;

  doritikeAnimPendingLine =
    "";

  clearDoritikeAnimPhaseClasses();

  if (doritikeGachaClerkLine) {

    doritikeGachaClerkLine.textContent =
      "";

  }

  if (doritikeGachaRummage) {

    doritikeGachaRummage.textContent =
      "";

  }

  clearDoritikePresentClasses();

  if (doritikeGachaAnimation) {

    doritikeGachaAnimation.hidden =
      true;

  }

}


function hideDoritikeGachaAnimation() {

  if (!doritikeGachaAnimation) {

    return;

  }

  doritikeGachaAnimation.hidden =
    true;

  clearDoritikeAnimPhaseClasses();

}


function setDoritikeGachaResultLine(
  text
) {

  if (!doritikeGachaResultLine) {

    return;

  }

  if (!text) {

    doritikeGachaResultLine.hidden =
      true;

    doritikeGachaResultLine.textContent =
      "";

    return;

  }

  doritikeGachaResultLine.textContent =
    text;

  doritikeGachaResultLine.hidden =
    false;

}


function showDoritikeGachaMainView() {

  hideDoritikeGachaAnimation();

  clearDoritikePresentClasses();

  if (doritikeGachaClerkLine) {

    doritikeGachaClerkLine.textContent =
      "";

  }

  if (doritikeGachaRummage) {

    doritikeGachaRummage.textContent =
      "";

  }

  if (doritikeGachaMain) {

    doritikeGachaMain.hidden =
      false;

  }

  if (doritikeGachaResult) {

    doritikeGachaResult.hidden =
      true;

  }

  if (doritikeGachaResultList) {

    doritikeGachaResultList.innerHTML =
      "";

  }

  setDoritikeGachaResultLine("");

}


function renderDoritikeGachaResults(
  results
) {

  if (!doritikeGachaResultList) {

    return;

  }

  doritikeGachaResultList.innerHTML =
    "";

  const list =
    Array.isArray(results)
      ? results
      : [];

  list.forEach((result) => {

    const label =
      getDoritikeGachaResultLabel(
        result
      );

    const item =
      document.createElement(
        "div"
      );

    item.className =
      "doritike-gacha-result-item";

    if (
      result &&
      result.itemId === "encore"
    ) {

      item.classList.add(
        "is-encore"
      );

    } else if (label.jackpot) {

      item.classList.add(
        "is-jackpot"
      );

    } else if (
      isDoritikeGachaResultGood(
        result
      )
    ) {

      item.classList.add(
        "is-good"
      );

    }

    const nameEl =
      document.createElement(
        "span"
      );

    nameEl.className =
      "doritike-gacha-result-name";

    nameEl.textContent =
      label.name;

    const amountEl =
      document.createElement(
        "span"
      );

    amountEl.className =
      "doritike-gacha-result-amount";

    amountEl.textContent =
      label.amountText;

    item.appendChild(nameEl);

    item.appendChild(amountEl);

    if (label.jackpot) {

      const jackpotEl =
        document.createElement(
          "span"
        );

      jackpotEl.className =
        "doritike-gacha-result-jackpot";

      jackpotEl.textContent =
        "大当たり！";

      item.appendChild(jackpotEl);

    }

    doritikeGachaResultList.appendChild(
      item
    );

  });

}


function revealDoritikeGachaReward(
  results,
  pullCount
) {

  doritikeGachaLastPullCount =
    pullCount;

  if (doritikeGachaAgain) {

    doritikeGachaAgain.textContent =
      pullCount === 10
        ? "もう10回"
        : "もう1回";

  }

  if (doritikeGachaScreen) {

    doritikeGachaScreen.classList.toggle(
      "is-x10",
      pullCount === 10
    );

  }

  renderDoritikeGachaResults(
    results
  );

  setDoritikeGachaResultLine("");

  applyDoritikePresentTone(
    results
  );

  if (doritikeGachaResult) {

    doritikeGachaResult.hidden =
      false;

  }

}


function applyDoritikePresentTone(
  results
) {

  if (!doritikeGachaScreen) {

    return;

  }

  doritikeGachaScreen.classList.remove(
    "is-tone-good",
    "is-tone-jackpot",
    "is-tone-encore"
  );

  const line =
    getDoritikeClerkLine(
      results
    );

  if (
    line ===
    DORITIKE_CLERK_LINE_ENCORE
  ) {

    doritikeGachaScreen.classList.add(
      "is-tone-encore"
    );

    return;

  }

  if (
    line ===
    DORITIKE_CLERK_LINE_JACKPOT
  ) {

    doritikeGachaScreen.classList.add(
      "is-tone-jackpot"
    );

    return;

  }

  if (
    line ===
    DORITIKE_CLERK_LINE_GOOD
  ) {

    doritikeGachaScreen.classList.add(
      "is-tone-good"
    );

  }

}


function showDoritikeGachaResultView(
  results,
  pullCount,
  clerkLine
) {

  revealDoritikeGachaReward(
    results,
    pullCount
  );

  if (doritikeGachaClerkLine) {

    doritikeGachaClerkLine.textContent =
      clerkLine ||
      getDoritikeClerkLine(
        results
      );

  }

  if (doritikeGachaScreen) {

    doritikeGachaScreen.classList.add(
      "is-ready"
    );

  }

}


function finishDoritikeGachaAnimation(
  sequenceId
) {

  if (
    sequenceId !==
    doritikeAnimSequenceId
  ) {

    return;

  }

  clearDoritikeAnimTimeouts();

  doritikeAnimActive =
    false;

  const results =
    doritikeAnimPendingResults ||
    [];

  const pullCount =
    doritikeAnimPendingPullCount;

  const clerkLine =
    doritikeAnimPendingLine ||
    getDoritikeClerkLine(
      results
    );

  doritikeAnimPendingResults =
    null;

  showDoritikeGachaResultView(
    results,
    pullCount,
    clerkLine
  );

  setDoritikeGachaBusy(false);

}


function skipDoritikeGachaAnimation() {

  if (
    !doritikeGachaScreen ||
    !doritikeGachaScreen.classList.contains(
      "is-ready"
    ) ||
    isDoritikeGachaBusy
  ) {

    return;

  }

  clearDoritikeGachaMessage();

  showDoritikeGachaMainView();

  updateDrinkTicketsDisplay();

}


function playDoritikeGachaAnimation(
  results,
  pullCount
) {

  doritikeAnimSequenceId +=
    1;

  const sequenceId =
    doritikeAnimSequenceId;

  clearDoritikeAnimTimeouts();

  clearDoritikeAnimPhaseClasses();

  doritikeAnimActive =
    true;

  doritikeAnimPendingResults =
    Array.isArray(results)
      ? results.slice()
      : [];

  doritikeAnimPendingPullCount =
    pullCount;

  doritikeAnimPendingLine =
    getDoritikeClerkLine(
      doritikeAnimPendingResults
    );

  if (doritikeGachaClerkLine) {

    doritikeGachaClerkLine.textContent =
      "";

  }

  if (doritikeGachaRummage) {

    doritikeGachaRummage.textContent =
      "";

  }

  if (doritikeGachaScreen) {

    doritikeGachaScreen.classList.add(
      "is-presenting"
    );

    doritikeGachaScreen.classList.remove(
      "is-ready",
      "is-tone-good",
      "is-tone-jackpot",
      "is-tone-encore"
    );

    doritikeGachaScreen.classList.toggle(
      "is-x10",
      pullCount === 10
    );

  }

  if (doritikeGachaMain) {

    doritikeGachaMain.hidden =
      true;

  }

  if (doritikeGachaResult) {

    doritikeGachaResult.hidden =
      true;

  }

  if (doritikeGachaMessage) {

    doritikeGachaMessage.hidden =
      true;

  }

  if (!doritikeGachaAnimation) {

    finishDoritikeGachaAnimation(
      sequenceId
    );

    return;

  }

  doritikeGachaAnimation.hidden =
    false;

  doritikeGachaAnimation.classList.toggle(
    "is-x10",
    pullCount === 10
  );

  const reduced =
    prefersDoritikeReducedMotion();

  const timing =
    reduced
      ? {
          ticket: 0,
          look: 60,
          hand: 110,
          rummage: 150,
          rummageB: 180,
          hold: 210,
          back: 240,
          reveal: 270,
          line: 310,
          done: 360
        }
      : pullCount === 10
        ? {
            ticket: 0,
            look: 420,
            hand: 780,
            rummage: 1120,
            rummageB: 1680,
            hold: 2140,
            back: 2420,
            reveal: 2660,
            line: 2980,
            done: 3340
          }
        : {
            ticket: 0,
            look: 380,
            hand: 720,
            rummage: 1040,
            rummageB: 1420,
            hold: 1780,
            back: 2060,
            reveal: 2280,
            line: 2580,
            done: 2920
          };

  setDoritikeAnimPhase(
    "phase-ticket"
  );

  scheduleDoritikeAnimTimeout(
    sequenceId,
    timing.look,
    () => {

      setDoritikeAnimPhase(
        "phase-look"
      );

    }
  );

  scheduleDoritikeAnimTimeout(
    sequenceId,
    timing.hand,
    () => {

      setDoritikeAnimPhase(
        "phase-hand"
      );

    }
  );

  scheduleDoritikeAnimTimeout(
    sequenceId,
    timing.rummage,
    () => {

      if (doritikeGachaRummage) {

        doritikeGachaRummage.textContent =
          "ガサ…";

      }

      setDoritikeAnimPhase(
        "phase-rummage"
      );

    }
  );

  scheduleDoritikeAnimTimeout(
    sequenceId,
    timing.rummageB,
    () => {

      if (doritikeGachaRummage) {

        doritikeGachaRummage.textContent =
          "ゴソ…";

      }

      setDoritikeAnimPhase(
        "phase-rummage-b"
      );

    }
  );

  scheduleDoritikeAnimTimeout(
    sequenceId,
    timing.hold,
    () => {

      setDoritikeAnimPhase(
        "phase-hold"
      );

    }
  );

  scheduleDoritikeAnimTimeout(
    sequenceId,
    timing.back,
    () => {

      if (doritikeGachaRummage) {

        doritikeGachaRummage.textContent =
          "";

      }

      setDoritikeAnimPhase(
        "phase-return"
      );

    }
  );

  scheduleDoritikeAnimTimeout(
    sequenceId,
    timing.reveal,
    () => {

      revealDoritikeGachaReward(
        doritikeAnimPendingResults ||
          [],
        pullCount
      );

      setDoritikeAnimPhase(
        "phase-reveal"
      );

    }
  );

  scheduleDoritikeAnimTimeout(
    sequenceId,
    timing.line,
    () => {

      if (doritikeGachaClerkLine) {

        doritikeGachaClerkLine.textContent =
          doritikeAnimPendingLine;

      }

      setDoritikeAnimPhase(
        "phase-line"
      );

    }
  );

  scheduleDoritikeAnimTimeout(
    sequenceId,
    timing.done,
    () => {

      finishDoritikeGachaAnimation(
        sequenceId
      );

    }
  );

}


function openDoritikeGacha() {

  if (!doritikeGachaScreen) {

    return;

  }

  resetDoritikeGachaAnimation();

  clearDoritikeGachaMessage();

  showDoritikeGachaMainView();

  updateDrinkTicketsDisplay();

  setDoritikeGachaBusy(false);

  showScreen(doritikeGachaScreen);

}


function closeDoritikeGacha() {

  if (isDoritikeGachaBusy) {

    return;

  }

  resetDoritikeGachaAnimation();

  clearDoritikeGachaMessage();

  showDoritikeGachaMainView();

  openGachaLobby();

}


function runDoritikeGachaPull(
  count
) {

  if (isDoritikeGachaBusy) {

    return;

  }

  const pullCount =
    Number(count);

  if (
    !Number.isInteger(pullCount) ||
    (pullCount !== 1 &&
      pullCount !== 10)
  ) {

    return;

  }

  clearDoritikeGachaMessage();

  resetDoritikeGachaAnimation();

  setDoritikeGachaBusy(true);

  const outcome =
    executeDoritikeGachaPull(
      pullCount
    );

  updateDrinkTicketsDisplay();

  if (
    !outcome ||
    !outcome.ok
  ) {

    showDoritikeGachaMainView();

    if (
      outcome &&
      outcome.reason ===
        "insufficient_tickets"
    ) {

      showDoritikeGachaMessage(
        "ドリチケが足りません"
      );

    } else {

      showDoritikeGachaMessage(
        "抽選に失敗しました"
      );

    }

    setDoritikeGachaBusy(false);

    return;

  }

  playDoritikeGachaAnimation(
    outcome.results,
    pullCount
  );

}


if (doritikeGachaBack) {

  doritikeGachaBack.addEventListener(
    "click",
    () => {

      closeDoritikeGacha();

    }
  );

}


if (doritikeGachaPull1) {

  doritikeGachaPull1.addEventListener(
    "click",
    () => {

      runDoritikeGachaPull(1);

    }
  );

}


if (doritikeGachaPull10) {

  doritikeGachaPull10.addEventListener(
    "click",
    () => {

      runDoritikeGachaPull(10);

    }
  );

}


if (doritikeGachaAgain) {

  doritikeGachaAgain.addEventListener(
    "click",
    () => {

      runDoritikeGachaPull(
        doritikeGachaLastPullCount
      );

    }
  );

}


if (doritikeGachaResultBack) {

  doritikeGachaResultBack.addEventListener(
    "click",
    () => {

      if (isDoritikeGachaBusy) {

        return;

      }

      clearDoritikeGachaMessage();

      showDoritikeGachaMainView();

      updateDrinkTicketsDisplay();

    }
  );

}


if (doritikeGachaAnimation) {

  doritikeGachaAnimation.addEventListener(
    "click",
    () => {

      skipDoritikeGachaAnimation();

    }
  );

}


const CHARACTER_FRAGMENTS_KEY =
  "characterFragments";

const DEBUG_FRAGMENT_GRANT_AMOUNT =
  100;

const PLUS_ENHANCE_FRAGMENT_COST = {

  [CHARACTER_RARITY.IPPANJIN]: 10,

  [CHARACTER_RARITY.BANDMAN]: 15,

  [CHARACTER_RARITY.HEADLINER]: 20,

  [CHARACTER_RARITY.LEGEND]: 30

};

let characterFragments = {};


function createEmptyCharacterFragments() {

  return {};

}


function sanitizeCharacterFragmentCount(
  value
) {

  const number =
    Number(value);

  if (
    !Number.isInteger(number) ||
    number < 0
  ) {

    return 0;

  }

  return number;

}


function sanitizeCharacterFragments(
  raw
) {

  const sanitized =
    createEmptyCharacterFragments();

  if (
    !raw ||
    typeof raw !== "object" ||
    Array.isArray(raw)
  ) {

    return sanitized;

  }

  Object.keys(raw).forEach(
    (characterId) => {

      if (
        !CHARACTERS[characterId]
      ) {

        return;

      }

      sanitized[characterId] =
        sanitizeCharacterFragmentCount(
          raw[characterId]
        );

    }
  );

  return sanitized;

}


function saveCharacterFragments() {

  localStorage.setItem(
    CHARACTER_FRAGMENTS_KEY,
    JSON.stringify(
      characterFragments
    )
  );

}


function loadCharacterFragments() {

  try {

    const raw =
      localStorage.getItem(
        CHARACTER_FRAGMENTS_KEY
      );

    if (!raw) {

      characterFragments =
        createEmptyCharacterFragments();

      return characterFragments;

    }

    characterFragments =
      sanitizeCharacterFragments(
        JSON.parse(raw)
      );

  } catch (error) {

    characterFragments =
      createEmptyCharacterFragments();

  }

  return characterFragments;

}


function getCharacterFragmentCount(
  characterId
) {

  if (!CHARACTERS[characterId]) {

    return 0;

  }

  return sanitizeCharacterFragmentCount(
    characterFragments[characterId]
  );

}


function setCharacterFragmentCount(
  characterId,
  count
) {

  if (!CHARACTERS[characterId]) {

    return 0;

  }

  const sanitized =
    sanitizeCharacterFragmentCount(
      count
    );

  characterFragments[characterId] =
    sanitized;

  saveCharacterFragments();

  return sanitized;

}


function addCharacterFragments(
  characterId,
  amount
) {

  if (!CHARACTERS[characterId]) {

    return getCharacterFragmentCount(
      characterId
    );

  }

  const add =
    Number(amount);

  if (
    !Number.isInteger(add) ||
    add <= 0
  ) {

    return getCharacterFragmentCount(
      characterId
    );

  }

  return setCharacterFragmentCount(
    characterId,
    getCharacterFragmentCount(
      characterId
    ) + add
  );

}


function spendCharacterFragments(
  characterId,
  amount
) {

  const spend =
    Number(amount);

  if (
    !Number.isInteger(spend) ||
    spend <= 0
  ) {

    return false;

  }

  const owned =
    getCharacterFragmentCount(
      characterId
    );

  if (owned < spend) {

    return false;

  }

  setCharacterFragmentCount(
    characterId,
    owned - spend
  );

  return true;

}


function getPlusEnhanceFragmentCostByRarity(
  rarity
) {

  const cost =
    PLUS_ENHANCE_FRAGMENT_COST[
      rarity
    ];

  if (typeof cost === "number") {

    return cost;

  }

  return PLUS_ENHANCE_FRAGMENT_COST[
    CHARACTER_RARITY.IPPANJIN
  ];

}


function getPlusEnhanceFragmentCost(
  characterOrId
) {

  const character =
    resolveCharacterReference(
      characterOrId
    );

  if (!character) {

    return getPlusEnhanceFragmentCostByRarity(
      CHARACTER_RARITY.IPPANJIN
    );

  }

  return getPlusEnhanceFragmentCostByRarity(
    getCharacterRarity(character)
  );

}


function getCharacterFragmentLabel(
  characterOrId
) {

  const character =
    resolveCharacterReference(
      characterOrId
    );

  if (!character) {

    return "かけら";

  }

  return character.name + "のかけら";

}


function canEnhanceCharacterPlus(
  characterId
) {

  if (
    !characterId ||
    !CHARACTERS[characterId] ||
    !isCharacterOwned(characterId)
  ) {

    return false;

  }

  const progress =
    getEnhanceCardProgress(
      characterId
    );

  const plus =
    clampCharacterPlus(
      progress.plus
    );

  if (plus >= CHARACTER_PLUS_MAX) {

    return false;

  }

  const need =
    getPlusEnhanceFragmentCost(
      characterId
    );

  return (
    getCharacterFragmentCount(
      characterId
    ) >= need
  );

}


function tryEnhanceCharacterPlus(
  characterId
) {

  if (
    !characterId ||
    !CHARACTERS[characterId] ||
    !isCharacterOwned(characterId)
  ) {

    return false;

  }

  const savedProgress =
    getEnhanceCardProgress(
      characterId
    );

  const currentPlus =
    clampCharacterPlus(
      savedProgress.plus
    );

  if (
    currentPlus >=
    CHARACTER_PLUS_MAX
  ) {

    return false;

  }

  const need =
    getPlusEnhanceFragmentCost(
      characterId
    );

  if (
    !spendCharacterFragments(
      characterId,
      need
    )
  ) {

    return false;

  }

  savedProgress.plus =
    currentPlus + 1;

  characterProgress[characterId] =
    sanitizeCharacterProgressEntry(
      savedProgress
    );

  saveCharacterProgress();

  renderEnhanceDetail();

  return true;

}


loadCharacterFragments();


const DEBUG_BEATS_TAP_COUNT = 5;

const DEBUG_BEATS_TAP_WINDOW_MS =
  2000;

const DEBUG_BEATS_GRANT_AMOUNT =
  99999;

const DEBUG_DRINK_TICKETS_GRANT_AMOUNT =
  100;

const DEBUG_GYARA_GRANT_AMOUNT =
  10000;

const DEBUG_BS_PASS_GRANT_AMOUNT =
  100;

let debugBeatsTapTimes = [];

let debugConfirmOpen = false;


function resetDebugBeatsTapCount() {

  debugBeatsTapTimes = [];

}


function registerDebugBeatsTap() {

  if (debugConfirmOpen) {

    return;

  }

  const now =
    Date.now();

  if (
    debugBeatsTapTimes.length ===
      0 ||
    now -
      debugBeatsTapTimes[0] >
      DEBUG_BEATS_TAP_WINDOW_MS
  ) {

    debugBeatsTapTimes = [now];

    return;

  }

  debugBeatsTapTimes.push(now);

  if (
    debugBeatsTapTimes.length <
    DEBUG_BEATS_TAP_COUNT
  ) {

    return;

  }

  resetDebugBeatsTapCount();

  openDebugMenu();

}


function openDebugMenu() {

  const overlay =
    document.getElementById(
      "debug-confirm-overlay"
    );

  if (!overlay) {

    return;

  }

  if (debugConfirmOpen) {

    return;

  }

  debugConfirmOpen = true;

  overlay.hidden = false;

}


function closeDebugMenu() {

  const overlay =
    document.getElementById(
      "debug-confirm-overlay"
    );

  if (overlay) {

    overlay.hidden = true;

  }

  debugConfirmOpen = false;

  resetDebugBeatsTapCount();

}


function applyDebugBeatsGrant() {

  setBeats(
    Math.max(
      getBeats(),
      DEBUG_BEATS_GRANT_AMOUNT
    )
  );

}


function applyDebugDrinkTicketsGrant() {

  addDrinkTickets(
    DEBUG_DRINK_TICKETS_GRANT_AMOUNT
  );

}


function applyDebugGyaraGrant() {

  addGyara(
    DEBUG_GYARA_GRANT_AMOUNT
  );

}


function applyDebugBsPassGrant() {

  addBsPass(
    DEBUG_BS_PASS_GRANT_AMOUNT
  );

}


function applyDebugFragmentGrant(
  characterId
) {

  if (!CHARACTERS[characterId]) {

    return;

  }

  addCharacterFragments(
    characterId,
    DEBUG_FRAGMENT_GRANT_AMOUNT
  );

  if (
    selectedEnhanceCharacterId ===
    characterId
  ) {

    renderEnhanceDetail();

  }

}


function handleDebugMenuAction(
  action,
  characterId
) {

  if (!debugConfirmOpen) {

    return;

  }

  if (action === "beats") {

    applyDebugBeatsGrant();

    return;

  }

  if (action === "drinkTickets") {

    applyDebugDrinkTicketsGrant();

    return;

  }

  if (action === "gyara") {

    applyDebugGyaraGrant();

    return;

  }

  if (action === "bsPass") {

    applyDebugBsPassGrant();

    return;

  }

  if (action === "fragment") {

    applyDebugFragmentGrant(
      characterId
    );

  }

}


function initDebugCommands() {

  const beatsResource =
    document.getElementById(
      "home-beats-resource"
    ) ||
    document.querySelector(
      ".resource-beats"
    );

  const cancelButton =
    document.getElementById(
      "debug-confirm-cancel"
    );

  const overlay =
    document.getElementById(
      "debug-confirm-overlay"
    );

  if (beatsResource) {

    beatsResource.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        registerDebugBeatsTap();

      }
    );

    beatsResource.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key !== "Enter" &&
          event.key !== " "
        ) {

          return;

        }

        event.preventDefault();

        registerDebugBeatsTap();

      }
    );

  }

  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      () => {

        closeDebugMenu();

      }
    );

  }

  if (overlay) {

    overlay.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          overlay
        ) {

          closeDebugMenu();

          return;

        }

        const button =
          event.target.closest(
            "[data-debug-action]"
          );

        if (
          !button ||
          !overlay.contains(button)
        ) {

          return;

        }

        handleDebugMenuAction(
          button.dataset.debugAction,
          button.dataset.characterId
        );

      }
    );

  }

}


initDebugCommands();


const BATTLE_DECK_KEY =
  "battleDeck";

const BATTLE_DECK_SIZE =
  10;

const BATTLE_DECK_FRONT_SIZE =
  5;

const BATTLE_CARD_SWIPE_PX =
  50;

let battleDeck = [];

let battleCardPage = 0;

let suppressBattleCardClick = false;


function createEmptyBattleDeck() {

  const deck = [];

  let index = 0;

  while (index < BATTLE_DECK_SIZE) {

    deck.push(null);

    index += 1;

  }

  return deck;

}


function createDefaultBattleDeck() {

  const deck =
    createEmptyBattleDeck();

  if (isCharacterOwned("sena")) {

    deck[0] = "sena";

  }

  return deck;

}


function sanitizeBattleDeck(rawDeck) {

  const deck =
    createEmptyBattleDeck();

  const usedIds = {};

  if (!Array.isArray(rawDeck)) {

    return deck;

  }

  let index = 0;

  while (
    index < BATTLE_DECK_SIZE &&
    index < rawDeck.length
  ) {

    const characterId =
      rawDeck[index];

    if (
      typeof characterId ===
        "string" &&
      CHARACTERS[characterId] &&
      isCharacterOwned(characterId) &&
      !usedIds[characterId]
    ) {

      deck[index] =
        characterId;

      usedIds[characterId] =
        true;

    }

    index += 1;

  }

  return deck;

}


function saveBattleDeck() {

  localStorage.setItem(
    BATTLE_DECK_KEY,
    JSON.stringify(battleDeck)
  );

}


function loadBattleDeck() {

  try {

    const raw =
      localStorage.getItem(
        BATTLE_DECK_KEY
      );

    if (!raw) {

      return createDefaultBattleDeck();

    }

    return sanitizeBattleDeck(
      JSON.parse(raw)
    );

  } catch (error) {

    return createDefaultBattleDeck();

  }

}


function getBattleDeckCharacters() {

  const characters = [];

  battleDeck.forEach((characterId) => {

    if (
      characterId &&
      CHARACTERS[characterId]
    ) {

      characters.push(
        CHARACTERS[characterId]
      );

    }

  });

  return characters;

}


function setBattleDeckSlot(
  slotIndex,
  characterId
) {

  if (
    slotIndex < 0 ||
    slotIndex >= BATTLE_DECK_SIZE
  ) {

    return;

  }

  if (characterId === null) {

    battleDeck[slotIndex] = null;

    saveBattleDeck();

    return;

  }

  if (
    !CHARACTERS[characterId] ||
    !isCharacterOwned(characterId)
  ) {

    return;

  }

  const alreadyUsed =
    battleDeck.some(
      (id, index) =>
        id === characterId &&
        index !== slotIndex
    );

  if (alreadyUsed) {

    return;

  }

  battleDeck[slotIndex] =
    characterId;

  saveBattleDeck();

}


function initBattleDeck() {

  const hasSave =
    localStorage.getItem(
      BATTLE_DECK_KEY
    );

  if (!hasSave) {

    battleDeck =
      createDefaultBattleDeck();

    saveBattleDeck();

    return;

  }

  const loaded =
    loadBattleDeck();

  const loadedText =
    JSON.stringify(loaded);

  const rawText =
    localStorage.getItem(
      BATTLE_DECK_KEY
    );

  battleDeck = loaded;

  if (loadedText !== rawText) {

    saveBattleDeck();

  }

}


initBattleDeck();

initHomeTurntableDrag();

if (typeof refreshHome === "function") {

  refreshHome();

}


function getDeployCooldownMs(character) {

  const cooldownMs =
    character &&
    character.stats
      ? Number(
          character.stats.deployCooldownMs
        )
      : 0;

  if (cooldownMs > 0) {

    return cooldownMs;

  }

  return 0;

}


function isCharacterOnCooldown(characterId) {

  const until =
    deployCooldownUntil[characterId];

  if (!until) {

    return false;

  }

  if (Date.now() >= until) {

    delete deployCooldownUntil[characterId];

    delete deployCooldownDurationMs[
      characterId
    ];

    return false;

  }

  return true;

}


function getDeployCooldownProgress(characterId) {

  const storedDuration =
    Number(
      deployCooldownDurationMs[
        characterId
      ]
    );

  const duration =
    storedDuration > 0
      ? storedDuration
      : getDeployCooldownMs(
          getActiveCharacterForm(
            characterId
          )
        );

  if (duration <= 0) {

    return 1;

  }

  const until =
    deployCooldownUntil[characterId];

  if (!until) {

    return 1;

  }

  const remaining =
    until - Date.now();

  if (remaining <= 0) {

    return 1;

  }

  const progress =
    1 - (remaining / duration);

  return Math.min(
    1,
    Math.max(0, progress)
  );

}


function beginDeployCooldown(characterId) {

  const form =
    getActiveCharacterForm(
      characterId
    );

  const duration =
    getDeployCooldownMs(form);

  if (duration <= 0) {

    delete deployCooldownUntil[characterId];

    delete deployCooldownDurationMs[
      characterId
    ];

    return;

  }

  deployCooldownDurationMs[
    characterId
  ] = duration;

  deployCooldownUntil[characterId] =
    Date.now() + duration;

}


function getCharacterMenuScale(character) {

  if (
    character &&
    character.ui &&
    typeof character.ui.menuScale ===
      "number"
  ) {

    return character.ui.menuScale;

  }

  return 1;

}


/* =========================
   ALLY VISUAL (V1 foundation)
   bodyScale / ground / altitude
   are metadata only in V1.
   Display still uses spriteSize /
   menuScale until later STEPs.
   Coordinate: +Y = up on screen
   (increases CSS bottom).
========================= */

const ALLY_VISUAL_DEFAULTS = {
  bodyScale: 1,
  groundOffsetPx: 0,
  altitudeMode: "ground",
  altitudeOffsetPx: 0
};

const ALLY_VISUAL_ALTITUDE_MODES = {
  ground: "ground",
  float: "float",
  air: "air",
  special: "special"
};

/*
  Visual-only depth lanes.
  yPx uses +up convention:
  BACK is slightly higher (farther),
  FRONT is slightly lower (nearer).
*/
const ALLY_VISUAL_LANES = [
  {
    id: "back",
    yPx: 2,
    zIndex: 9
  },
  {
    id: "center",
    yPx: 0,
    zIndex: 10
  },
  {
    id: "front",
    yPx: -2,
    zIndex: 11
  }
];


function sanitizeAllyVisualNumber(
  value,
  fallback
) {

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {

    return fallback;

  }

  return value;

}


function sanitizeAllyBodyScale(value) {

  const scale =
    sanitizeAllyVisualNumber(
      value,
      ALLY_VISUAL_DEFAULTS.bodyScale
    );

  if (scale <= 0) {

    return ALLY_VISUAL_DEFAULTS.bodyScale;

  }

  return scale;

}


function sanitizeAllyAltitudeMode(
  value
) {

  if (
    value ===
      ALLY_VISUAL_ALTITUDE_MODES.float ||
    value ===
      ALLY_VISUAL_ALTITUDE_MODES.air ||
    value ===
      ALLY_VISUAL_ALTITUDE_MODES.special ||
    value ===
      ALLY_VISUAL_ALTITUDE_MODES.ground
  ) {

    return value;

  }

  return ALLY_VISUAL_DEFAULTS.altitudeMode;

}


function normalizeAllyVisualPartial(
  source
) {

  if (
    !source ||
    typeof source !== "object"
  ) {

    return null;

  }

  const visual = {};

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      "bodyScale"
    )
  ) {

    visual.bodyScale =
      sanitizeAllyBodyScale(
        source.bodyScale
      );

  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      "groundOffsetPx"
    )
  ) {

    visual.groundOffsetPx =
      sanitizeAllyVisualNumber(
        source.groundOffsetPx,
        ALLY_VISUAL_DEFAULTS.groundOffsetPx
      );

  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      "altitudeMode"
    )
  ) {

    visual.altitudeMode =
      sanitizeAllyAltitudeMode(
        source.altitudeMode
      );

  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      "altitudeOffsetPx"
    )
  ) {

    visual.altitudeOffsetPx =
      sanitizeAllyVisualNumber(
        source.altitudeOffsetPx,
        ALLY_VISUAL_DEFAULTS.altitudeOffsetPx
      );

  }

  return visual;

}


function getCharacterVisualConfig(
  character,
  form
) {

  const base =
    Object.assign(
      {},
      ALLY_VISUAL_DEFAULTS
    );

  const characterVisual =
    normalizeAllyVisualPartial(
      character && character.visual
    );

  if (characterVisual) {

    Object.assign(
      base,
      characterVisual
    );

  }

  const formVisual =
    normalizeAllyVisualPartial(
      form &&
      form !== character &&
      form.visual
    );

  if (formVisual) {

    Object.assign(
      base,
      formVisual
    );

  }

  base.bodyScale =
    sanitizeAllyBodyScale(
      base.bodyScale
    );

  base.groundOffsetPx =
    sanitizeAllyVisualNumber(
      base.groundOffsetPx,
      ALLY_VISUAL_DEFAULTS.groundOffsetPx
    );

  base.altitudeMode =
    sanitizeAllyAltitudeMode(
      base.altitudeMode
    );

  base.altitudeOffsetPx =
    sanitizeAllyVisualNumber(
      base.altitudeOffsetPx,
      ALLY_VISUAL_DEFAULTS.altitudeOffsetPx
    );

  return base;

}


function pickAllyVisualLane() {

  const index =
    Math.floor(
      Math.random() *
        ALLY_VISUAL_LANES.length
    );

  return ALLY_VISUAL_LANES[
    Math.max(
      0,
      Math.min(
        ALLY_VISUAL_LANES.length - 1,
        index
      )
    )
  ];

}


function getAllyVisualLaneById(
  laneId
) {

  for (
    let i = 0;
    i < ALLY_VISUAL_LANES.length;
    i += 1
  ) {

    if (
      ALLY_VISUAL_LANES[i].id ===
      laneId
    ) {

      return ALLY_VISUAL_LANES[i];

    }

  }

  return ALLY_VISUAL_LANES[1];

}


function getAllyVisualBottomOffsetPx(
  lane,
  visual
) {

  const laneY =
    lane &&
    typeof lane.yPx === "number"
      ? lane.yPx
      : 0;

  const groundY =
    visual &&
    typeof visual.groundOffsetPx ===
      "number"
      ? visual.groundOffsetPx
      : 0;

  const altitudeY =
    visual &&
    typeof visual.altitudeOffsetPx ===
      "number"
      ? visual.altitudeOffsetPx
      : 0;

  return laneY + groundY + altitudeY;

}


function applyAllyBattleVisualPlacement(
  element,
  lane,
  visual
) {

  if (!element) {

    return;

  }

  const resolvedLane =
    lane || ALLY_VISUAL_LANES[1];

  const resolvedVisual =
    visual || ALLY_VISUAL_DEFAULTS;

  const yPx =
    getAllyVisualBottomOffsetPx(
      resolvedLane,
      resolvedVisual
    );

  element.style.setProperty(
    "--ally-visual-y",
    yPx + "px"
  );

  element.style.setProperty(
    "--ally-visual-z",
    String(resolvedLane.zIndex)
  );

  element.dataset.visualLane =
    resolvedLane.id;

}


const FORMATION_FRONT_SLOT_LAYOUT = [
  { left: 52.45, top: 35.92, width: 5.68, height: 11.16 },
  { left: 59.87, top: 35.92, width: 5.68, height: 11.16 },
  { left: 67.28, top: 35.92, width: 5.62, height: 11.16 },
  { left: 74.64, top: 35.92, width: 5.62, height: 11.16 },
  { left: 82.00, top: 35.92, width: 5.68, height: 11.16 }
];

const FORMATION_BACK_SLOT_LAYOUT = [
  { left: 52.45, top: 59.94, width: 5.68, height: 11.26 },
  { left: 59.87, top: 59.94, width: 5.68, height: 11.26 },
  { left: 67.28, top: 59.94, width: 5.62, height: 11.26 },
  { left: 74.64, top: 59.94, width: 5.62, height: 11.26 },
  { left: 82.00, top: 59.94, width: 5.68, height: 11.26 }
];


function applyFormationPercentBox(element, box) {

  if (!element || !box) {

    return;

  }

  element.style.left = box.left + "%";

  element.style.top = box.top + "%";

  element.style.width = box.width + "%";

  element.style.height = box.height + "%";

}


let formationDraftDeck = null;

let selectedFormationCharacterId =
  null;

let formationFormDetailCharacterId =
  null;

let formationFormPreviewNumber =
  null;

let formationRarityFilter =
  FORMATION_RARITY_FILTER_ALL;

let formationNoticeTimer = null;


function copyBattleDeck(sourceDeck) {

  const deck =
    createEmptyBattleDeck();

  if (!Array.isArray(sourceDeck)) {

    return deck;

  }

  let index = 0;

  while (index < BATTLE_DECK_SIZE) {

    deck[index] =
      sourceDeck[index] ||
      null;

    index += 1;

  }

  return deck;

}


function countFormationDraftFilled() {

  if (!formationDraftDeck) {

    return 0;

  }

  let filled = 0;

  let index = 0;

  while (index < BATTLE_DECK_SIZE) {

    if (formationDraftDeck[index]) {

      filled += 1;

    }

    index += 1;

  }

  return filled;

}


function showFormationNotice(message) {

  const notice =
    document.getElementById(
      "formation-notice"
    );

  if (!notice) {

    return;

  }

  notice.textContent = message;

  notice.classList.add("is-visible");

  if (formationNoticeTimer) {

    clearTimeout(
      formationNoticeTimer
    );

  }

  formationNoticeTimer =
    setTimeout(() => {

      notice.classList.remove(
        "is-visible"
      );

      formationNoticeTimer = null;

    }, 1400);

}


function updateFormationRarityFilterButtons() {

  const buttons =
    document.querySelectorAll(
      ".formation-hotspot-filter"
    );

  buttons.forEach((button) => {

    if (
      button.dataset.filter ===
      formationRarityFilter
    ) {

      button.classList.add(
        "is-selected"
      );

    } else {

      button.classList.remove(
        "is-selected"
      );

    }

  });

}


function setFormationRarityFilter(filter) {

  if (
    FORMATION_RARITY_FILTERS.indexOf(
      filter
    ) === -1
  ) {

    return;

  }

  formationRarityFilter = filter;

  selectedFormationCharacterId =
    null;

  renderFormationScreen({
    resetOwnedScroll: true
  });

}


function startFormationEditing() {

  formationDraftDeck =
    copyBattleDeck(battleDeck);

  selectedFormationCharacterId =
    null;

  closeFormationFormDetail(true);

  closeMedalSelector();

  formationRarityFilter =
    FORMATION_RARITY_FILTER_ALL;

  renderFormationScreen();

}


function autoBuildFormation() {

  const deck =
    createEmptyBattleDeck();

  const ownedCharacters =
    Object.values(CHARACTERS).filter(
      (character) => {

        return isCharacterOwned(
          character.id
        );

      }
    );

  let index = 0;

  while (
    index < ownedCharacters.length &&
    index < BATTLE_DECK_SIZE
  ) {

    deck[index] =
      ownedCharacters[index].id;

    index += 1;

  }

  return deck;

}


function applyAutoFormation() {

  if (!formationDraftDeck) {

    return;

  }

  formationDraftDeck =
    autoBuildFormation();

  selectedFormationCharacterId =
    null;

  renderFormationScreen();

}


function saveFormationDraft() {

  if (!formationDraftDeck) {

    return;

  }

  if (countFormationDraftFilled() < 1) {

    showFormationNotice(
      "最低1人は編成してください"
    );

    return;

  }

  battleDeck =
    copyBattleDeck(formationDraftDeck);

  saveBattleDeck();

  formationDraftDeck =
    copyBattleDeck(battleDeck);

  renderFormationScreen();

  showFormationNotice(
    "編成を保存しました"
  );

}


function resetFormationEditing() {

  formationDraftDeck = null;

  selectedFormationCharacterId =
    null;

  closeFormationFormDetail(true);

  closeMedalSelector();

  formationRarityFilter =
    FORMATION_RARITY_FILTER_ALL;

  if (formationNoticeTimer) {

    clearTimeout(
      formationNoticeTimer
    );

    formationNoticeTimer = null;

  }

  const notice =
    document.getElementById(
      "formation-notice"
    );

  if (notice) {

    notice.textContent = "";

    notice.classList.remove(
      "is-visible"
    );

  }

}


function setSelectedFormationCharacter(
  characterId
) {

  if (
    selectedFormationCharacterId ===
    characterId
  ) {

    selectedFormationCharacterId =
      null;

  } else {

    selectedFormationCharacterId =
      characterId;

  }

  renderFormationScreen();

}


function closeFormationFormDetail(
  skipRender
) {

  formationFormDetailCharacterId =
    null;

  formationFormPreviewNumber =
    null;

  const detail =
    document.getElementById(
      "formation-form-detail"
    );

  if (detail) {

    detail.hidden = true;

  }

  if (!skipRender) {

    renderFormationScreen();

  }

}


function openFormationFormDetail(
  characterId
) {

  if (
    !characterId ||
    !CHARACTERS[characterId] ||
    !isCharacterOwned(characterId)
  ) {

    return;

  }

  selectedFormationCharacterId =
    characterId;

  formationFormDetailCharacterId =
    characterId;

  formationFormPreviewNumber =
    getSafeActiveFormNumber(
      characterId
    );

  renderFormationScreen();

  renderFormationFormDetail();

}


function shiftFormationFormPreview(
  direction
) {

  const characterId =
    formationFormDetailCharacterId;

  if (!characterId) {

    return;

  }

  const unlocked =
    getUnlockedCharacterFormNumbers(
      characterId
    );

  if (unlocked.length <= 1) {

    return;

  }

  let index =
    unlocked.indexOf(
      Number(
        formationFormPreviewNumber
      )
    );

  if (index === -1) {

    index = 0;

  }

  const nextIndex =
    (
      index +
      direction +
      unlocked.length
    ) %
    unlocked.length;

  formationFormPreviewNumber =
    unlocked[nextIndex];

  renderFormationFormDetail();

}


function applyFormationFormPreview() {

  const characterId =
    formationFormDetailCharacterId;

  if (!characterId) {

    return;

  }

  const unlocked =
    getUnlockedCharacterFormNumbers(
      characterId
    );

  const preview =
    Number(
      formationFormPreviewNumber
    );

  if (
    unlocked.indexOf(preview) ===
    -1
  ) {

    return;

  }

  const activeForm =
    getSafeActiveFormNumber(
      characterId
    );

  if (preview === activeForm) {

    return;

  }

  const progress =
    getEnhanceCardProgress(
      characterId
    );

  progress.activeForm =
    preview;

  saveCharacterProgress();

  renderFormationFormDetail();

  renderFormationScreen();

}


function renderFormationFormDetail() {

  const detail =
    document.getElementById(
      "formation-form-detail"
    );

  const characterId =
    formationFormDetailCharacterId;

  const character =
    characterId
      ? CHARACTERS[characterId]
      : null;

  if (
    !detail ||
    !character
  ) {

    if (detail) {

      detail.hidden = true;

    }

    return;

  }

  const unlocked =
    getUnlockedCharacterFormNumbers(
      character
    );

  if (!unlocked.length) {

    detail.hidden = true;

    return;

  }

  let preview =
    Number(
      formationFormPreviewNumber
    );

  if (
    unlocked.indexOf(preview) ===
    -1
  ) {

    preview =
      getSafeActiveFormNumber(
        character
      );

    formationFormPreviewNumber =
      preview;

  }

  const form =
    getCharacterFormForDisplay(
      character,
      preview
    );

  if (!form) {

    detail.hidden = true;

    return;

  }

  const progress =
    getEnhanceCardProgress(
      characterId
    );

  const level =
    clampCharacterLevel(
      progress.level
    );

  const plus =
    clampCharacterPlus(
      progress.plus
    );

  const activeForm =
    getSafeActiveFormNumber(
      characterId
    );

  const combat =
    calculateCharacterCombatStats(
      form,
      level,
      plus
    );

  const yaniCost =
    Number(
      form.stats &&
      form.stats.yaniCost
    ) || 0;

  const image =
    document.getElementById(
      "formation-form-detail-image"
    );

  if (image) {

    image.src =
      form.images.menu;

    image.alt =
      character.name;

    image.style.width = "";

    image.style.height = "";

    image.style.transform =
      "scale(" +
      getCharacterMenuScale(
        form
      ) +
      ")";

    image.style.transformOrigin =
      "center center";

  }

  const numberEl =
    document.getElementById(
      "formation-form-detail-number"
    );

  if (numberEl) {

    numberEl.textContent =
      getAllyCharacterNumberLabel(
        character
      );

  }

  const rarityEl =
    document.getElementById(
      "formation-form-detail-rarity"
    );

  if (rarityEl) {

    rarityEl.textContent =
      getRarityLabel(
        getCharacterRarity(character)
      );

  }

  const nameEl =
    document.getElementById(
      "formation-form-detail-name"
    );

  if (nameEl) {

    nameEl.textContent =
      character.name;

  }

  const groupEl =
    document.getElementById(
      "formation-form-detail-group"
    );

  if (groupEl) {

    groupEl.textContent =
      getCharacterGroup(character);

  }

  const levelEl =
    document.getElementById(
      "formation-form-detail-level"
    );

  if (levelEl) {

    levelEl.textContent =
      "Lv." +
      level +
      " +" +
      plus;

  }

  const hpEl =
    document.getElementById(
      "formation-form-detail-hp"
    );

  if (hpEl) {

    hpEl.textContent =
      String(combat.hp);

  }

  const attackEl =
    document.getElementById(
      "formation-form-detail-attack"
    );

  if (attackEl) {

    attackEl.textContent =
      String(combat.attack);

  }

  const yaniEl =
    document.getElementById(
      "formation-form-detail-yani"
    );

  if (yaniEl) {

    yaniEl.textContent =
      String(yaniCost);

  }

  const formLabelEl =
    document.getElementById(
      "formation-form-detail-form-label"
    );

  if (formLabelEl) {

    formLabelEl.textContent =
      getCharacterFormLabel(
        preview
      );

  }

  const canSwitch =
    unlocked.length > 1;

  const prevButton =
    document.getElementById(
      "formation-form-detail-prev"
    );

  const nextButton =
    document.getElementById(
      "formation-form-detail-next"
    );

  if (prevButton) {

    prevButton.disabled =
      !canSwitch;

    prevButton.hidden =
      !canSwitch;

  }

  if (nextButton) {

    nextButton.disabled =
      !canSwitch;

    nextButton.hidden =
      !canSwitch;

  }

  const isActivePreview =
    preview === activeForm;

  const statusEl =
    document.getElementById(
      "formation-form-detail-status"
    );

  if (statusEl) {

    statusEl.textContent =
      isActivePreview
        ? "使用中"
        : "";

  }

  const useButton =
    document.getElementById(
      "formation-form-detail-use"
    );

  if (useButton) {

    if (isActivePreview) {

      useButton.disabled =
        true;

      useButton.textContent =
        "使用中";

    } else {

      useButton.disabled =
        false;

      useButton.textContent =
        "このFORMを使用";

    }

  }

  detail.hidden = false;

}


(
  function initFormationFormDetailControls() {

    const closeButton =
      document.getElementById(
        "formation-form-detail-close"
      );

    const backdrop =
      document.getElementById(
        "formation-form-detail-backdrop"
      );

    const prevButton =
      document.getElementById(
        "formation-form-detail-prev"
      );

    const nextButton =
      document.getElementById(
        "formation-form-detail-next"
      );

    const useButton =
      document.getElementById(
        "formation-form-detail-use"
      );

    if (closeButton) {

      closeButton.addEventListener(
        "click",
        () => {

          closeFormationFormDetail();

        }
      );

    }

    if (backdrop) {

      backdrop.addEventListener(
        "click",
        () => {

          closeFormationFormDetail();

        }
      );

    }

    if (prevButton) {

      prevButton.addEventListener(
        "click",
        () => {

          shiftFormationFormPreview(
            -1
          );

        }
      );

    }

    if (nextButton) {

      nextButton.addEventListener(
        "click",
        () => {

          shiftFormationFormPreview(
            1
          );

        }
      );

    }

    if (useButton) {

      useButton.addEventListener(
        "click",
        () => {

          applyFormationFormPreview();

        }
      );

    }

  }
)();


function placeFormationDraftCharacter(
  characterId,
  slotIndex
) {

  if (
    !formationDraftDeck ||
    slotIndex < 0 ||
    slotIndex >= BATTLE_DECK_SIZE ||
    !CHARACTERS[characterId] ||
    !isCharacterOwned(characterId)
  ) {

    return;

  }

  const fromIndex =
    formationDraftDeck.indexOf(
      characterId
    );

  const occupant =
    formationDraftDeck[slotIndex];

  if (fromIndex === slotIndex) {

    return;

  }

  if (fromIndex === -1) {

    formationDraftDeck[slotIndex] =
      characterId;

    return;

  }

  formationDraftDeck[slotIndex] =
    characterId;

  formationDraftDeck[fromIndex] =
    occupant ||
    null;

}


function unequipFormationDraftSlot(
  slotIndex
) {

  if (
    !formationDraftDeck ||
    slotIndex < 0 ||
    slotIndex >= BATTLE_DECK_SIZE
  ) {

    return false;

  }

  if (!formationDraftDeck[slotIndex]) {

    return false;

  }

  if (countFormationDraftFilled() <= 1) {

    showFormationNotice(
      "最低1人は編成してください"
    );

    return false;

  }

  formationDraftDeck[slotIndex] =
    null;

  selectedFormationCharacterId =
    null;

  return true;

}


function handleFormationSlotTap(
  slotIndex
) {

  if (!formationDraftDeck) {

    return;

  }

  const occupant =
    formationDraftDeck[slotIndex];

  if (!selectedFormationCharacterId) {

    if (occupant) {

      selectedFormationCharacterId =
        occupant;

      renderFormationScreen();

    }

    return;

  }

  if (
    occupant ===
    selectedFormationCharacterId
  ) {

    unequipFormationDraftSlot(
      slotIndex
    );

    renderFormationScreen();

    return;

  }

  placeFormationDraftCharacter(
    selectedFormationCharacterId,
    slotIndex
  );

  renderFormationScreen();

}


function applyFormationMenuScale(image, formOrCharacter) {

  if (!image) {

    return;

  }

  image.style.transform =
    "scale(" +
    getCharacterMenuScale(
      formOrCharacter
    ) +
    ")";

  image.style.transformOrigin =
    "center center";

}


function createFormationCardMetaHtml(
  character,
  form
) {

  const yaniCost =
    form &&
    form.stats &&
    form.stats.yaniCost != null
      ? form.stats.yaniCost
      : character.stats.yaniCost;

  return `
    <span class="formation-card-meta">
      <strong>${character.name}</strong>
      <span class="formation-card-yani">
        🚬 ${yaniCost}
      </span>
    </span>
  `;

}


function getFormationOwnedSortNumber(
  character
) {

  const number =
    Number(
      character &&
      character.number
    );

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {

    return null;

  }

  return number;

}


function compareFormationOwnedCharacters(
  left,
  right
) {

  const leftNumber =
    getFormationOwnedSortNumber(left);

  const rightNumber =
    getFormationOwnedSortNumber(right);

  if (
    leftNumber != null &&
    rightNumber != null &&
    leftNumber !== rightNumber
  ) {

    return leftNumber - rightNumber;

  }

  return 0;

}


function createFormationOwnedCard(character) {

  const card =
    document.createElement("button");

  card.type = "button";

  card.className =
    "formation-owned-card";

  card.dataset.characterId =
    character.id;

  if (
    selectedFormationCharacterId ===
    character.id
  ) {

    card.classList.add("is-selected");

  }

  const activeForm =
    getCharacterActiveFormForDisplay(
      character
    ) || character;

  const menuImage =
    activeForm.images &&
    activeForm.images.menu
      ? activeForm.images.menu
      : getCharacterImages(
          character.id
        ).menu;

  card.innerHTML = `

    <span class="formation-cover"></span>

    <span class="formation-owned-art">
      <img
        src="${menuImage}"
        alt="${character.name}"
      >
    </span>

    ${createFormationCardMetaHtml(character, activeForm)}

    <button
      type="button"
      class="formation-owned-detail-button"
    >
      詳細
    </button>

  `;

  applyFormationMenuScale(
    card.querySelector("img"),
    activeForm
  );

  const detailButton =
    card.querySelector(
      ".formation-owned-detail-button"
    );

  if (detailButton) {

    detailButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        event.stopPropagation();

        openFormationFormDetail(
          character.id
        );

      }
    );

  }

  card.addEventListener(
    "click",
    () => {

      setSelectedFormationCharacter(
        character.id
      );

    }
  );

  return card;

}


function createFormationDeckSlot(
  slotIndex,
  characterId,
  box
) {

  const character =
    characterId &&
    CHARACTERS[characterId] &&
    isCharacterOwned(characterId)
      ? CHARACTERS[characterId]
      : null;

  const slot =
    document.createElement("button");

  slot.type = "button";

  slot.className =
    "formation-slot";

  slot.dataset.slotIndex =
    String(slotIndex);

  if (character) {

    slot.classList.add("filled");

    slot.dataset.characterId =
      character.id;

    const activeForm =
      getCharacterActiveFormForDisplay(
        character
      ) || character;

    const menuImage =
      activeForm.images &&
      activeForm.images.menu
        ? activeForm.images.menu
        : getCharacterImages(
            character.id
          ).menu;

    slot.innerHTML = `

      <span class="formation-cover"></span>

      <span class="formation-slot-art">
        <img
          src="${menuImage}"
          alt="${character.name}"
        >
      </span>

      ${createFormationCardMetaHtml(character, activeForm)}

    `;

    applyFormationMenuScale(
      slot.querySelector("img"),
      activeForm
    );

    if (
      selectedFormationCharacterId ===
      character.id
    ) {

      slot.classList.add("is-selected");

    }

  } else {

    slot.classList.add("empty");

  }

  applyFormationPercentBox(slot, box);

  slot.addEventListener(
    "click",
    () => {

      handleFormationSlotTap(
        slotIndex
      );

    }
  );

  return slot;

}


function renderFormationScreen(
  options
) {

  const ownedList =
    document.getElementById(
      "formation-owned-list"
    );

  const frontSlots =
    document.getElementById(
      "formation-front-slots"
    );

  const backSlots =
    document.getElementById(
      "formation-back-slots"
    );

  const ownedCount =
    document.getElementById(
      "formation-owned-count"
    );

  const deckCount =
    document.getElementById(
      "formation-deck-count"
    );


  if (
    !ownedList ||
    !frontSlots ||
    !backSlots
  ) {

    return;

  }


  const resetOwnedScroll =
    !!(
      options &&
      options.resetOwnedScroll
    );

  const ownedScrollLeft =
    resetOwnedScroll
      ? 0
      : ownedList.scrollLeft;

  ownedList.innerHTML = "";

  frontSlots.innerHTML = "";

  backSlots.innerHTML = "";


  const roster =
    Object.values(CHARACTERS);

  const ownedRoster =
    roster.filter((character) => {

      return isCharacterOwned(
        character.id
      );

    });

  ownedRoster.sort(
    compareFormationOwnedCharacters
  );


  const visibleOwnedRoster =
    ownedRoster.filter((character) => {

      return characterMatchesRarityFilter(
        character,
        formationRarityFilter
      );

    });


  visibleOwnedRoster.forEach((character) => {

    ownedList.appendChild(
      createFormationOwnedCard(
        character
      )
    );

  });

  ownedList.scrollLeft =
    ownedScrollLeft;


  if (ownedCount) {

    ownedCount.textContent =
      ownedRoster.length +
      " / " +
      roster.length;

  }


  let filled = 0;

  let slotIndex = 0;

  const visibleDeck =
    formationDraftDeck ||
    battleDeck;

  while (slotIndex < BATTLE_DECK_SIZE) {

    const characterId =
      visibleDeck[slotIndex];

    if (characterId) {

      filled += 1;

    }

    const isFront =
      slotIndex <
      BATTLE_DECK_FRONT_SIZE;

    const layout =
      isFront
        ? FORMATION_FRONT_SLOT_LAYOUT
        : FORMATION_BACK_SLOT_LAYOUT;

    const layoutIndex =
      isFront
        ? slotIndex
        : slotIndex -
          BATTLE_DECK_FRONT_SIZE;

    const slot =
      createFormationDeckSlot(
        slotIndex,
        characterId,
        layout[layoutIndex]
      );

    if (isFront) {

      frontSlots.appendChild(slot);

    } else {

      backSlots.appendChild(slot);

    }

    slotIndex += 1;

  }


  if (deckCount) {

    deckCount.textContent =
      filled + " / " + BATTLE_DECK_SIZE;

  }


  updateFormationRarityFilterButtons();

  renderMedalEquipment();

}


function createBattleUnitCard(character) {

  const form =
    getActiveCharacterForm(
      character
    ) || character;

  const yaniCost =
    Number(
      form.stats &&
      form.stats.yaniCost
    ) || 0;

  const menuImageSrc =
    form.images &&
    form.images.menu
      ? form.images.menu
      : character.images.menu;

  const card =
    document.createElement(
      "button"
    );


  card.className =
    "unit-card available";

  card.type =
    "button";

  card.dataset.unit =
    character.id;

  const costLabel =
    isTrainingBattle()
      ? "∞"
      : (
        "🚬 " +
        yaniCost
      );

  const rarityLabel =
    getRarityLabel(
      getCharacterRarity(
        character
      )
    ) || "★";

  const rarityStars =
    rarityLabel.split(" ")[0] ||
    "★";

  const metaLabel =
    isTrainingBattle()
      ? (
        "No." +
        String(
          character.number
        ).padStart(3, "0") +
        " " +
        rarityStars
      )
      : character.name;

  const nameHtml =
    isTrainingBattle()
      ? (
        '<span class="unit-card-name">' +
        character.name +
        "</span>"
      )
      : "";


  card.innerHTML = `

    <span class="unit-icon">
      <img
        class="unit-character-image"
        src="${menuImageSrc}"
        alt="${character.name}"
      >
    </span>

    <strong>
      ${metaLabel}
    </strong>

    ${nameHtml}

    <small class="unit-card-cost">
      ${costLabel}
    </small>

    <span class="unit-card-cooldown" hidden>
      <span class="unit-card-cooldown-fill"></span>
    </span>

  `;


  const menuImage =
    card.querySelector(
      ".unit-character-image"
    );


  if (menuImage) {

    const menuScale =
      getCharacterMenuScale(
        form
      );

    if (isTrainingBattle()) {

      // iOS Safari: transform inside
      // overflow-x scroll can hide imgs.
      // Size via width/height instead.
      menuImage.style.width =
        (
          menuScale * 100
        ) + "%";

      menuImage.style.height =
        (
          menuScale * 100
        ) + "%";

      menuImage.style.maxWidth =
        "100%";

      menuImage.style.maxHeight =
        "100%";

      menuImage.style.objectFit =
        "contain";

      menuImage.style.transform =
        "none";

    } else {

      menuImage.style.transform =
        "scale(" +
        menuScale +
        ")";

      menuImage.style.transformOrigin =
        "center center";

    }

  }


  return card;

}


function createLockedBattleUnitCard() {

  const card =
    document.createElement(
      "button"
    );


  card.className =
    "unit-card locked";

  card.type =
    "button";

  card.disabled =
    true;


  card.innerHTML = `

    <span class="unit-icon">
      🔒
    </span>

    <strong>
      未加入
    </strong>

    <small>
      ---
    </small>

  `;


  return card;

}


function renderBattleUnitCards() {

  const container =
    document.getElementById(
      "battle-unit-cards"
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  if (isTrainingBattle()) {

    const ids =
      getTrainingCharacterIds();

    ids.forEach(
      (characterId) => {

        if (
          !characterId ||
          !CHARACTERS[characterId]
        ) {

          return;

        }

        container.appendChild(
          createBattleUnitCard(
            CHARACTERS[
              characterId
            ]
          )
        );

      }
    );

    updateUnitCardAvailability();

    updateBattleCardPageDots();

    return;

  }


  let slotIndex = 0;

  while (
    slotIndex < BATTLE_DECK_FRONT_SIZE
  ) {

    const characterId =
      battleDeck[
        battleCardPage *
        BATTLE_DECK_FRONT_SIZE +
        slotIndex
      ];

    slotIndex += 1;

    if (
      characterId &&
      CHARACTERS[characterId] &&
      isCharacterOwned(characterId)
    ) {

      container.appendChild(
        createBattleUnitCard(
          CHARACTERS[characterId]
        )
      );

      continue;

    }

    container.appendChild(
      createLockedBattleUnitCard()
    );

  }


  updateUnitCardAvailability();

  updateBattleCardPageDots();

}


function getBattleCardPageMax() {

  if (isTrainingBattle()) {

    const count =
      getTrainingCharacterIds()
        .length;

    return Math.max(
      0,
      Math.ceil(
        count /
        BATTLE_DECK_FRONT_SIZE
      ) - 1
    );

  }

  return Math.floor(
    BATTLE_DECK_SIZE /
    BATTLE_DECK_FRONT_SIZE
  ) - 1;

}


function updateBattleCardPageDots() {

  const host =
    document.querySelector(
      ".page-indicator"
    );

  if (!host) {

    return;

  }

  if (isTrainingBattle()) {

    host.hidden = true;

    return;

  }

  host.hidden = false;

  const maxPage =
    getBattleCardPageMax();

  const needed =
    maxPage + 1;

  let dots =
    host.querySelectorAll(
      ".page-dot"
    );

  while (dots.length < needed) {

    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "page-dot";

    button.dataset.cardPage =
      String(dots.length);

    host.appendChild(button);

    dots =
      host.querySelectorAll(
        ".page-dot"
      );

  }

  dots.forEach((dot, index) => {

    if (index > maxPage) {

      dot.hidden = true;

      return;

    }

    dot.hidden = false;

    dot.dataset.cardPage =
      String(index);

    dot.classList.toggle(
      "active",
      index === battleCardPage
    );

  });

}


function setBattleCardPage(page) {

  const maxPage =
    getBattleCardPageMax();

  const nextPage =
    Math.min(
      maxPage,
      Math.max(0, page)
    );


  battleCardPage = nextPage;

  renderBattleUnitCards();

}


function updateUnitCardAvailability() {

  const cards =
    document.querySelectorAll(
      "#battle-unit-cards .unit-card"
    );


  cards.forEach((card) => {

    const character =
      CHARACTERS[card.dataset.unit];


    if (!character) {

      return;

    }


    if (isTrainingBattle()) {

      card.classList.remove(
        "not-enough"
      );

      card.classList.remove(
        "on-cooldown"
      );

      card.disabled = false;

      const cooldownBar =
        card.querySelector(
          ".unit-card-cooldown"
        );

      const cooldownFill =
        card.querySelector(
          ".unit-card-cooldown-fill"
        );

      if (cooldownBar) {

        cooldownBar.hidden = true;

      }

      if (cooldownFill) {

        cooldownFill.style.width =
          "0%";

      }

      return;

    }


    const form =
      getActiveCharacterForm(
        character
      ) || character;

    const yaniCost =
      Number(
        form.stats &&
        form.stats.yaniCost
      ) || 0;

    const notEnough =
      yani < yaniCost;

    const onCooldown =
      isCharacterOnCooldown(
        character.id
      );

    const canDeploy =
      !notEnough &&
      !onCooldown;


    card.classList.toggle(
      "not-enough",
      notEnough
    );

    card.classList.toggle(
      "on-cooldown",
      onCooldown
    );

    card.disabled =
      !canDeploy;


    const cooldownBar =
      card.querySelector(
        ".unit-card-cooldown"
      );

    const cooldownFill =
      card.querySelector(
        ".unit-card-cooldown-fill"
      );


    if (
      cooldownBar &&
      cooldownFill
    ) {

      if (onCooldown) {

        cooldownBar.hidden =
          false;

        cooldownFill.style.width =
          (
            getDeployCooldownProgress(
              character.id
            ) * 100
          ) + "%";

      } else {

        cooldownBar.hidden =
          true;

        cooldownFill.style.width =
          "0%";

      }

    }

  });

}


const battleUnitCards =
  document.getElementById(
    "battle-unit-cards"
  );


if (battleUnitCards) {

  battleUnitCards.addEventListener(
    "click",
    (event) => {

      if (suppressBattleCardClick) {

        event.preventDefault();

        event.stopPropagation();

        return;

      }

      const card =
        event.target.closest(
          ".unit-card"
        );


      if (
        !card ||
        !battleUnitCards.contains(card)
      ) {

        return;

      }


      if (!isBattleActive()) {

        return;

      }


      if (
        card.disabled ||
        card.classList.contains(
          "not-enough"
        ) ||
        card.classList.contains(
          "on-cooldown"
        )
      ) {

        return;

      }


      const character =
        CHARACTERS[card.dataset.unit];


      if (!character) {

        return;

      }


      if (
        !isTrainingBattle() &&
        !isCharacterOwned(
          character.id
        )
      ) {

        return;

      }


      const form =
        getActiveCharacterForm(
          character
        ) || character;

      const yaniCost =
        Number(
          form.stats &&
          form.stats.yaniCost
        ) || 0;


      if (
        !isTrainingBattle() &&
        yani < yaniCost
      ) {

        return;

      }


      if (
        !isTrainingBattle() &&
        isCharacterOnCooldown(
          character.id
        )
      ) {

        return;

      }


      if (!isTrainingBattle()) {

        yani -= yaniCost;

      }

      spawnCharacter(
        character.id
      );

      if (!isTrainingBattle()) {

        beginDeployCooldown(
          character.id
        );

      }

      updateBattleUI();

    }
  );

}


let cardPageSwipe = null;


function setupBattleCardPageSwipe() {

  const cards =
    document.getElementById(
      "battle-unit-cards"
    );


  if (!cards) {

    return;

  }


  const touchOptions = {
    capture: true,
    passive: false
  };


  cards.addEventListener(
    "touchstart",
    (event) => {

      if (isTrainingBattle()) {

        cardPageSwipe = null;

        return;

      }

      if (event.touches.length !== 1) {

        cardPageSwipe = null;

        return;

      }


      cardPageSwipe = {

        startX:
          event.touches[0].clientX,

        startY:
          event.touches[0].clientY,

        swiped: false

      };

    },
    touchOptions
  );


  cards.addEventListener(
    "touchmove",
    (event) => {

      if (isTrainingBattle()) {

        return;

      }

      if (
        !cardPageSwipe ||
        event.touches.length !== 1
      ) {

        return;

      }


      const dx =
        event.touches[0].clientX -
        cardPageSwipe.startX;

      const dy =
        event.touches[0].clientY -
        cardPageSwipe.startY;


      if (
        Math.abs(dx) >= 10 &&
        Math.abs(dx) >= Math.abs(dy)
      ) {

        event.preventDefault();

      }

    },
    touchOptions
  );


  cards.addEventListener(
    "touchend",
    (event) => {

      if (isTrainingBattle()) {

        cardPageSwipe = null;

        return;

      }

      if (!cardPageSwipe) {

        return;

      }


      const touch =
        event.changedTouches[0];

      const dx =
        touch.clientX -
        cardPageSwipe.startX;

      const dy =
        touch.clientY -
        cardPageSwipe.startY;


      const isSwipe =
        Math.abs(dx) >=
          BATTLE_CARD_SWIPE_PX &&
        Math.abs(dx) >
          Math.abs(dy);


      if (isSwipe) {

        event.preventDefault();

        suppressBattleCardClick =
          true;

        setTimeout(
          () => {

            suppressBattleCardClick =
              false;

          },
          400
        );


        if (dx < 0) {

          setBattleCardPage(
            battleCardPage + 1
          );

        } else {

          setBattleCardPage(
            battleCardPage - 1
          );

        }

      }


      cardPageSwipe = null;

    },
    touchOptions
  );


  cards.addEventListener(
    "touchcancel",
    () => {

      cardPageSwipe = null;

    },
    touchOptions
  );

}


setupBattleCardPageSwipe();


const pageIndicator =
  document.querySelector(
    ".page-indicator"
  );


if (pageIndicator) {

  pageIndicator.addEventListener(
    "click",
    (event) => {

      const dot =
        event.target.closest(
          ".page-dot"
        );


      if (!dot) {

        return;

      }


      const page =
        Number(dot.dataset.cardPage);


      if (
        page === 0 ||
        page === 1
      ) {

        setBattleCardPage(page);

      }

    }
  );

}


renderBattleUnitCards();


function isAllyUnit(unit) {

  return Boolean(
    unit &&
    unit.id &&
    CHARACTERS[unit.id] &&
    unit.sprite
  );

}


function spawnCharacter(characterId) {

  const data =
    CHARACTERS[characterId];


  if (!data) {

    return;

  }


  const formNumber =
    getSafeActiveFormNumber(
      characterId
    );

  const form =
    getActiveCharacterForm(
      characterId
    ) || data;

  const formImages =
    form.images || data.images;

  const formStats =
    form.stats || data.stats;

  const formBattle =
    form.battle || data.battle;


  const element =
    document.createElement("div");


  element.className =
    "battle-unit";


  element.innerHTML = `

    <div class="character-hp">
      <div class="character-hp-bar"></div>
    </div>

    <div class="unit-body">
      <div class="unit-buff-icons" aria-hidden="true"></div>
      <img
        class="unit-sprite"
        src="${formImages.idle}"
        alt="${data.name}"
      >
    </div>

    <div class="unit-label">
      ${data.name}
    </div>

  `;


  const sprite =
    element.querySelector(
      ".unit-sprite"
    );


  sprite.style.width =
    formBattle.spriteSize + "px";

  sprite.style.height =
    formBattle.spriteSize + "px";


  const visualConfig =
    getCharacterVisualConfig(
      data,
      form
    );

  const visualLane =
    pickAllyVisualLane();

  applyAllyBattleVisualPlacement(
    element,
    visualLane,
    visualConfig
  );


  applySpawnPosition(
    element,
    getAllySpawnX()
  );


  unitLayer.appendChild(
    element
  );


  const progress =
    getEnhanceCardProgress(
      characterId
    );

  const combatStats =
    getCharacterStatAtProgress(
      form,
      progress
    );


  const unit = {

    id: data.id,

    type: data.id,

    name: data.name,

    formNumber: formNumber,

    images: formImages,

    battle: formBattle,

    visual: visualConfig,

    visualLane: visualLane.id,

    visualLaneYPx: visualLane.yPx,

    element: element,

    sprite: sprite,

    spriteTimer: null,

    hpBar:
      element.querySelector(
        ".character-hp-bar"
      ),

    hp: combatStats.hp,

    maxHp: combatStats.hp,

    attack: combatStats.attack,

    range: formStats.range,

    speed: formStats.speed,

    x: getAllySpawnX(),

    attackCooldown: 0,

    attackInterval:
      formStats.attackInterval,

    attackBehavior:
      getAttackBehavior(form),

    traits:
      form.traits ||
      data.traits ||
      {},

    conditionalBuffs:
      form.conditionalBuffs ||
      data.conditionalBuffs ||
      [],

    activeBuffs: {},

    bpmLevel: 0,

    bpmLastHitAt: 0,

    triggeredHealthKnockbacks:
      new Set(),

    knockbackStartX: 0,

    knockbackTargetX: 0,

    knockbackStartedAt: 0,

    knockbackDurationMs: 0,

    staggerWalkPhaseMs: 0,

    sprintStartedAt: 0,

    currentAttackStage: 0,

    dead: false

  };


  initUnitStaggerWalkPhase(unit);

  playerUnits.push(unit);

  refreshUnitConditionalBuffs(unit);

  return unit;

}


function spawnSena() {

  spawnCharacter("sena");

}


function getHealthKnockbackTrait(unit) {

  if (
    !unit ||
    !unit.traits ||
    !unit.traits.healthKnockback
  ) {

    return null;

  }

  return unit.traits.healthKnockback;

}


function getStaggerWalkTrait(unit) {

  if (
    !unit ||
    !unit.traits ||
    !unit.traits.staggerWalk
  ) {

    return null;

  }

  return unit.traits.staggerWalk;

}


function initUnitStaggerWalkPhase(unit) {

  const trait =
    getStaggerWalkTrait(unit);

  if (!trait || !unit) {

    return;

  }

  const periodMs =
    typeof trait.periodMs ===
      "number" &&
    trait.periodMs > 0
      ? trait.periodMs
      : 1100;

  // Phase offset only — average
  // move speed stays at base.
  unit.staggerWalkPhaseMs =
    Math.floor(
      Math.random() *
      periodMs
    );

}


function getUnitMoveSpeed(unit) {

  const base =
    Number(
      unit &&
      unit.speed
    ) || 0;

  const trait =
    getStaggerWalkTrait(unit);

  let moveSpeed = base;

  if (trait) {

    const periodMs =
      typeof trait.periodMs ===
        "number" &&
      trait.periodMs > 0
        ? trait.periodMs
        : 1100;

    const minMultiplier =
      typeof trait.minMultiplier ===
        "number"
        ? trait.minMultiplier
        : 0.75;

    const maxMultiplier =
      typeof trait.maxMultiplier ===
        "number"
        ? trait.maxMultiplier
        : 1.25;

    const phaseMs =
      Number(
        unit.staggerWalkPhaseMs
      ) || 0;

    const cycle =
      (
        (
          Date.now() +
          phaseMs
        ) %
        periodMs
      ) /
      periodMs;

    // Smooth sine: always > 0, mean 1.0
    // when min/max are symmetric.
    const wave =
      0.5 +
      0.5 *
      Math.sin(
        cycle *
        Math.PI *
        2
      );

    const multiplier =
      minMultiplier +
      (
        maxMultiplier -
        minMultiplier
      ) *
      wave;

    moveSpeed =
      base * multiplier;

  }

  return (
    moveSpeed *
    getUnitSprintMultiplier(
      unit
    )
  );

}


function getSprintAccelerationTrait(unit) {

  if (
    !unit ||
    !unit.traits ||
    !unit.traits.sprintAcceleration
  ) {

    return null;

  }

  return unit.traits.sprintAcceleration;

}


function resetUnitSprintAcceleration(
  unit
) {

  if (!unit) {

    return;

  }

  unit.sprintStartedAt = 0;

}


function getUnitSprintMultiplier(unit) {

  const trait =
    getSprintAccelerationTrait(
      unit
    );

  if (!trait) {

    return 1;

  }

  const startMultiplier =
    typeof trait.startMultiplier ===
      "number"
      ? trait.startMultiplier
      : 1;

  const maxMultiplier =
    typeof trait.maxMultiplier ===
      "number"
      ? trait.maxMultiplier
      : startMultiplier;

  const rampDurationMs =
    typeof trait.rampDurationMs ===
      "number" &&
    trait.rampDurationMs > 0
      ? trait.rampDurationMs
      : 1400;

  if (
    !unit.sprintStartedAt
  ) {

    unit.sprintStartedAt =
      Date.now();

  }

  const elapsed =
    Math.max(
      0,
      Date.now() -
      unit.sprintStartedAt
    );

  const t =
    Math.min(
      1,
      elapsed /
      rampDurationMs
    );

  return (
    startMultiplier +
    (
      maxMultiplier -
      startMultiplier
    ) *
    t
  );

}


function isHealthKnockbackActive(unit) {

  return Boolean(
    unit &&
    !unit.dead &&
    unit.knockbackDurationMs > 0 &&
    unit.knockbackStartedAt &&
    Date.now() <
      unit.knockbackStartedAt +
      unit.knockbackDurationMs
  );

}


function clearHealthKnockback(unit) {

  if (!unit) {

    return;

  }

  unit.knockbackStartX = 0;

  unit.knockbackTargetX = 0;

  unit.knockbackStartedAt = 0;

  unit.knockbackDurationMs = 0;

}


function clampHealthKnockbackX(
  unit,
  worldX
) {

  if (
    playerUnits.indexOf(unit) !==
    -1
  ) {

    return Math.max(
      PLAYER_BASE_X,
      worldX
    );

  }

  return Math.min(
    ENEMY_BASE_X,
    worldX
  );

}


function startHealthKnockback(
  unit,
  trait
) {

  const distance =
    typeof trait.distance ===
      "number"
      ? trait.distance
      : 70;

  const durationMs =
    typeof trait.durationMs ===
      "number"
      ? trait.durationMs
      : 180;

  const isPlayer =
    playerUnits.indexOf(unit) !==
    -1;

  const startX =
    unit.x;

  const rawTargetX =
    isPlayer
      ? startX - distance
      : startX + distance;

  unit.knockbackStartX =
    startX;

  unit.knockbackTargetX =
    clampHealthKnockbackX(
      unit,
      rawTargetX
    );

  unit.knockbackStartedAt =
    Date.now();

  unit.knockbackDurationMs =
    durationMs;

  resetUnitSprintAcceleration(
    unit
  );

  if (unit.element) {

    unit.element.classList.remove(
      "attacking"
    );

  }

  clearUnitSpriteTimer(unit);

  setUnitSprite(
    unit,
    "hurt"
  );

}


function getHealthKnockbackSteps(trait) {

  if (!trait) {

    return [];

  }

  const raw =
    Array.isArray(trait.thresholds)
      ? trait.thresholds
      : [];

  const fallbackDistance =
    typeof trait.distance ===
      "number"
      ? trait.distance
      : 70;

  const steps = [];

  raw.forEach((entry) => {

    if (
      typeof entry === "number"
    ) {

      if (!Number.isFinite(entry)) {

        return;

      }

      steps.push({
        ratio: entry,
        distance: fallbackDistance
      });

      return;

    }

    if (
      !entry ||
      typeof entry !== "object"
    ) {

      return;

    }

    const ratio =
      Number(
        entry.ratio != null
          ? entry.ratio
          : entry.threshold
      );

    if (!Number.isFinite(ratio)) {

      return;

    }

    const distance =
      typeof entry.distance ===
        "number"
        ? entry.distance
        : fallbackDistance;

    steps.push({
      ratio: ratio,
      distance: distance
    });

  });

  return steps;

}


function applyHealthKnockbackAfterDamage(
  unit,
  previousHpRatio
) {

  const trait =
    getHealthKnockbackTrait(unit);

  if (
    !trait ||
    unit.dead ||
    unit.hp <= 0
  ) {

    return;

  }

  if (
    !(
      unit.triggeredHealthKnockbacks instanceof
      Set
    )
  ) {

    unit.triggeredHealthKnockbacks =
      new Set();

  }

  const maxHp =
    Number(unit.maxHp);

  if (
    !Number.isFinite(maxHp) ||
    maxHp <= 0
  ) {

    return;

  }

  const ratio =
    unit.hp /
    maxHp;

  const prevRatio =
    Number.isFinite(
      previousHpRatio
    )
      ? previousHpRatio
      : ratio;

  const steps =
    getHealthKnockbackSteps(trait);

  const crossedSteps = [];

  steps.forEach((step) => {

    const value =
      step.ratio;

    // Future heal: allow the same
    // threshold to fire again after
    // recovering above it.
    if (ratio > value) {

      unit.triggeredHealthKnockbacks.delete(
        value
      );

      return;

    }

    // Trigger only when crossing
    // downward: previous > T && now <= T
    if (
      prevRatio > value &&
      ratio <= value
    ) {

      unit.triggeredHealthKnockbacks.add(
        value
      );

      crossedSteps.push(step);

    }

  });

  if (!crossedSteps.length) {

    return;

  }

  if (
    isHealthKnockbackActive(unit)
  ) {

    return;

  }

  // If multiple thresholds cross in
  // one hit, use the lowest ratio
  // step only (largest retreat).
  let chosen = crossedSteps[0];

  crossedSteps.forEach((step) => {

    if (step.ratio < chosen.ratio) {

      chosen = step;

    }

  });

  startHealthKnockback(
    unit,
    {
      distance: chosen.distance,
      durationMs: trait.durationMs
    }
  );

}


function getAttackKnockbackTrait(unit) {

  if (
    !unit ||
    !unit.traits ||
    !unit.traits.attackKnockback
  ) {

    return null;

  }

  return unit.traits.attackKnockback;

}


function getKnockbackResistanceTrait(unit) {

  if (
    !unit ||
    !unit.traits ||
    !unit.traits.knockbackResistance
  ) {

    return null;

  }

  return unit.traits.knockbackResistance;

}


function getAttackKnockbackResistanceMultiplier(
  unit
) {

  const trait =
    getKnockbackResistanceTrait(
      unit
    );

  if (!trait) {

    return 1;

  }

  const multiplier =
    typeof trait.attackMultiplier ===
      "number"
      ? trait.attackMultiplier
      : 1;

  if (
    !Number.isFinite(
      multiplier
    ) ||
    multiplier < 0
  ) {

    return 1;

  }

  return multiplier;

}


function getGoodsScatterTrait(unit) {

  if (
    !unit ||
    !unit.traits ||
    !unit.traits.goodsScatter
  ) {

    return null;

  }

  return unit.traits.goodsScatter;

}


function removeGoodsScatterParticle(
  particle
) {

  if (!particle) {

    return;

  }

  if (
    particle.animation &&
    typeof particle.animation.cancel ===
      "function"
  ) {

    try {

      particle.animation.cancel();

    } catch (error) {

      // Ignore cancelled animations.

    }

  }

  if (
    particle.element &&
    particle.element.parentNode
  ) {

    particle.element.remove();

  }

  activeGoodsScatterParticles =
    activeGoodsScatterParticles.filter(
      (entry) =>
        entry !== particle
    );

}


function clearGoodsScatterParticles() {

  activeGoodsScatterParticles
    .slice()
    .forEach(
      removeGoodsScatterParticle
    );

  activeGoodsScatterParticles = [];

}


function spawnGoodsScatterParticles(
  unit
) {

  const trait =
    getGoodsScatterTrait(unit);

  if (
    !trait ||
    !unit ||
    unit.dead ||
    !projectileLayer
  ) {

    return;

  }

  if (
    activeGoodsScatterParticles.length >=
    GOODS_SCATTER_PARTICLE_CAP
  ) {

    removeGoodsScatterParticle(
      activeGoodsScatterParticles[0]
    );

  }

  const minCount =
    Number.isInteger(
      trait.minCount
    ) &&
    trait.minCount > 0
      ? trait.minCount
      : 2;

  const maxCount =
    Number.isInteger(
      trait.maxCount
    ) &&
    trait.maxCount >= minCount
      ? trait.maxCount
      : 4;

  const count =
    minCount +
    Math.floor(
      Math.random() *
      (
        maxCount -
        minCount +
        1
      )
    );

  const lifetimeMs =
    typeof trait.lifetimeMs ===
      "number" &&
    trait.lifetimeMs > 0
      ? trait.lifetimeMs
      : 400;

  const shapes = [
    "bag",
    "card",
    "box",
    "strip"
  ];

  const directions = [
    { dx: -28, dy: -42 },
    { dx: 0, dy: -52 },
    { dx: 28, dy: -38 },
    { dx: -36, dy: -18 },
    { dx: 34, dy: -22 },
    { dx: -18, dy: -48 },
    { dx: 22, dy: -46 }
  ];

  for (
    let i = 0;
    i < count;
    i += 1
  ) {

    const element =
      document.createElement("div");

    const shape =
      shapes[
        Math.floor(
          Math.random() *
          shapes.length
        )
      ];

    element.className =
      "battle-goods-scatter-particle battle-goods-scatter-" +
      shape;

    element.style.left =
      unit.x + "px";

    element.style.bottom =
      "calc(14% + 18px)";

    projectileLayer.appendChild(
      element
    );

    const dir =
      directions[
        Math.floor(
          Math.random() *
          directions.length
        )
      ];

    const fallY =
      12 +
      Math.floor(
        Math.random() * 16
      );

    const particle = {

      element: element,

      animation: null

    };

    activeGoodsScatterParticles.push(
      particle
    );

    const animation =
      element.animate(
        [
          {
            transform:
              "translate(-50%, 0) scale(1)",
            opacity: 0.95
          },
          {
            transform:
              "translate(calc(-50% + " +
              dir.dx +
              "px), " +
              dir.dy +
              "px) scale(0.92)",
            opacity: 0.85
          },
          {
            transform:
              "translate(calc(-50% + " +
              dir.dx +
              "px), calc(" +
              (
                dir.dy +
                fallY
              ) +
              "px)) scale(0.78)",
            opacity: 0
          }
        ],
        {
          duration: lifetimeMs,
          easing:
            "cubic-bezier(0.25, 0.8, 0.35, 1)",
          fill: "forwards"
        }
      );

    particle.animation =
      animation;

    const finish =
      () => {

        removeGoodsScatterParticle(
          particle
        );

      };

    if (
      animation &&
      animation.finished &&
      typeof animation.finished.then ===
        "function"
    ) {

      animation.finished
        .then(finish)
        .catch(finish);

    } else {

      window.setTimeout(
        finish,
        lifetimeMs + 16
      );

    }

  }

}


function tryApplyAttackKnockback(
  source,
  target
) {

  const trait =
    getAttackKnockbackTrait(source);

  if (
    !trait ||
    !target ||
    target.dead ||
    target.hp <= 0
  ) {

    return;

  }

  if (
    isHealthKnockbackActive(target)
  ) {

    return;

  }

  const chance =
    typeof trait.chance ===
      "number"
      ? trait.chance
      : 0;

  if (Math.random() >= chance) {

    return;

  }

  const baseDistance =
    typeof trait.distance ===
      "number"
      ? trait.distance
      : 70;

  const resistance =
    getAttackKnockbackResistanceMultiplier(
      target
    );

  const adjustedTrait = {

    ...trait,

    distance:
      baseDistance *
      resistance

  };

  startHealthKnockback(
    target,
    adjustedTrait
  );

  spawnAttackKnockbackEffect(
    trait,
    target.x
  );

}


function spawnAttackKnockbackEffect(
  trait,
  worldX
) {

  if (
    !projectileLayer ||
    !trait ||
    !trait.effect
  ) {

    return;

  }

  const element =
    document.createElement("div");

  element.className =
    "battle-knockback-effect";

  const image =
    document.createElement("img");

  image.src =
    trait.effect;

  image.alt = "";

  const effectWidth =
    typeof trait.effectWidth ===
      "number"
      ? trait.effectWidth
      : 120;

  image.style.width =
    effectWidth + "px";

  element.appendChild(image);

  element.style.left =
    worldX + "px";

  projectileLayer.appendChild(
    element
  );

  const durationMs =
    typeof trait.effectDurationMs ===
      "number"
      ? trait.effectDurationMs
      : 280;

  attackKnockbackEffects.push({

    element: element,

    expiresAt:
      Date.now() +
      durationMs

  });

}


function updateAttackKnockbackEffects() {

  const now =
    Date.now();

  const remaining = [];

  attackKnockbackEffects.forEach(
    (effect) => {

      if (
        now >=
        effect.expiresAt
      ) {

        if (
          effect.element &&
          effect.element.parentNode
        ) {

          effect.element.remove();

        }

        return;

      }

      remaining.push(effect);

    }
  );

  attackKnockbackEffects =
    remaining;

}


function clearAttackKnockbackEffects() {

  attackKnockbackEffects.forEach(
    (effect) => {

      if (
        effect &&
        effect.element &&
        effect.element.parentNode
      ) {

        effect.element.remove();

      }

    }
  );

  attackKnockbackEffects = [];

}


function finishHealthKnockback(unit) {

  clearHealthKnockback(unit);

  if (
    unit &&
    !unit.dead
  ) {

    setUnitSprite(
      unit,
      "idle"
    );

  }

}


function updateHealthKnockbackMotion(
  unit
) {

  if (
    !unit ||
    !unit.knockbackDurationMs ||
    !unit.knockbackStartedAt
  ) {

    return false;

  }

  if (unit.dead) {

    clearHealthKnockback(unit);

    return false;

  }

  const elapsed =
    Date.now() -
    unit.knockbackStartedAt;

  const t =
    Math.min(
      1,
      elapsed /
        unit.knockbackDurationMs
    );

  unit.x =
    unit.knockbackStartX +
    (
      unit.knockbackTargetX -
      unit.knockbackStartX
    ) *
    t;

  if (t >= 1) {

    finishHealthKnockback(unit);

    return false;

  }

  return true;

}


function clearUnitSpriteTimer(unit) {

  if (
    unit &&
    unit.spriteTimer
  ) {

    clearTimeout(
      unit.spriteTimer
    );

    unit.spriteTimer =
      null;

  }

}


function setUnitSprite(unit, state) {

  if (
    !isAllyUnit(unit) ||
    !unit.images[state]
  ) {

    return;

  }

  unit.sprite.src =
    unit.images[state];

}


function showUnitAttack(unit) {

  if (
    !isAllyUnit(unit) ||
    unit.dead ||
    isHealthKnockbackActive(unit)
  ) {

    return;

  }

  clearUnitSpriteTimer(unit);

  setUnitSprite(
    unit,
    "attack"
  );

  unit.spriteTimer =
    setTimeout(
      () => {

        unit.spriteTimer =
          null;

        if (!unit.dead) {

          setUnitSprite(
            unit,
            "idle"
          );

        }

      },
      unit.battle.attackSpriteMs
    );

}


function playAllyDeathKnockback(unit) {

  const element =
    unit.element;

  const knockbackPx =
    unit.battle.deathKnockbackPx;

  const secondMs =
    unit.battle.deathSecondMs;

  const removeMs =
    unit.battle.deathSecondMs +
    unit.battle.deathWaitMs;


  element.style.transition =
    "transform 80ms ease-out";

  element.style.transform =
    `translateX(-${knockbackPx}px)`;


  setTimeout(
    () => {

      if (!element.isConnected) {
        return;
      }

      element.style.transform =
        `translateX(-${knockbackPx * 2}px)`;

    },
    secondMs
  );


  setTimeout(
    () => {

      element.remove();

    },
    removeMs
  );

}


function showUnitKnockbackHurt(unit) {

  if (!isAllyUnit(unit)) {

    return;

  }

  clearUnitSpriteTimer(unit);

  setUnitSprite(
    unit,
    "hurt"
  );

  if (unit.dead) {

    return;

  }

  unit.spriteTimer =
    setTimeout(
      () => {

        unit.spriteTimer =
          null;

        if (!unit.dead) {

          setUnitSprite(
            unit,
            "idle"
          );

        }

      },
      unit.battle.hurtSpriteMs
    );

}


/* =========================
   ENEMIES
   平成元年の既存4体のみ。
   spawn key は STAGES の type と一致。
========================= */

const ENEMIES = {

  training_dummy: {

    id: "training_dummy",

    unitType: "training_dummy",

    name: "練習人形",

    family: "training",

    role: "dummy",

    palette: null,

    emoji: "🧍",

    image: null,

    hp: 999999,

    attack: 0,

    range: 0,

    speed: 0,

    attackInterval: 999999,

    yaniReward: 0,

    spawnOffsetX: 0,

    attackKind: "none",

    className:
      "battle-enemy battle-training-dummy",

    behaviors: []

  },

  training_melee: {

    id: "training_melee",

    unitType: "training_melee",

    name: "近接人形",

    family: "training",

    role: "trainingEnemy",

    palette: null,

    emoji: "🥊",

    image: null,

    hp: 1000,

    attack: 30,

    range: 45,

    speed: 0.80,

    attackInterval: 1200,

    yaniReward: 0,

    spawnOffsetX: 0,

    attackKind: "single",

    trainingVisual: "melee",

    className:
      "battle-enemy battle-training-enemy battle-training-melee",

    behaviors: []

  },

  training_heavy: {

    id: "training_heavy",

    unitType: "training_heavy",

    name: "重量人形",

    family: "training",

    role: "trainingEnemy",

    palette: null,

    emoji: "🪨",

    image: null,

    hp: 1800,

    attack: 40,

    range: 45,

    speed: 0.40,

    attackInterval: 1500,

    yaniReward: 0,

    spawnOffsetX: 0,

    attackKind: "single",

    trainingVisual: "heavy",

    className:
      "battle-enemy battle-training-enemy battle-training-heavy",

    behaviors: []

  },

  training_ranged: {

    id: "training_ranged",

    unitType: "training_ranged",

    name: "射撃人形",

    family: "training",

    role: "trainingEnemy",

    palette: null,

    emoji: "🎯",

    image: null,

    hp: 800,

    attack: 25,

    range: 220,

    speed: 0.55,

    attackInterval: 1500,

    yaniReward: 0,

    spawnOffsetX: 0,

    attackKind: "projectile",

    trainingVisual: "ranged",

    className:
      "battle-enemy battle-training-enemy battle-training-ranged",

    behaviors: []

  },

  salaryman: {

    id: "salaryman",

    unitType: "salaryman",

    name: "24時間戦う漢",

    family: "legacy",

    role: "normal",

    palette: null,

    emoji: "👔",

    image: null,

    hp: 180,

    attack: 22,

    range: 55,

    speed: 0.8,

    attackInterval: 1100,

    yaniReward: 45,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    behaviors: []

  },

  juriana: {

    id: "juriana",

    unitType: "juriana",

    name: "ジュリ扇女",

    family: "legacy",

    role: "normal",

    palette: null,

    emoji: "🪭",

    image: null,

    hp: 110,

    attack: 28,

    range: 170,

    speed: 0.7,

    attackInterval: 1400,

    yaniReward: 60,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    behaviors: []

  },

  bubble: {

    id: "bubble",

    unitType: "bubble",

    name: "バブル野郎",

    family: "legacy",

    role: "normal",

    palette: null,

    emoji: "💰",

    image: null,

    hp: 650,

    attack: 38,

    range: 60,

    speed: 0.38,

    attackInterval: 1500,

    yaniReward: 120,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy bubble-enemy",

    behaviors: []

  },

  boss: {

    id: "boss",

    unitType: "threePercent",

    name: "増税獣 サンパーセント",

    family: "legacy",

    role: "midBoss",

    palette: null,

    emoji: "👹",

    image: null,

    hp: 1400,

    attack: 70,

    range: 75,

    speed: 0.32,

    attackInterval: 1600,

    yaniReward: 300,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy boss-enemy",

    unitBoss: true,

    behaviors: [

      {

        id: "yaniPercentTax",

        rate: 0.03,

        messageBody: "ヤニを3%徴収された！"

      }

    ]

  },

  ippan_charitsuu: {

    id: "ippan_charitsuu",

    unitType: "ippan_charitsuu",

    name: "チャリ通学生",

    family: "ippan",

    role: "normal",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "🚲",

    image: null,

    hp: 140,

    attack: 18,

    range: 42,

    speed: 1.35,

    attackInterval: 950,

    yaniReward: 35,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  ippan_salaryman: {

    id: "ippan_salaryman",

    unitType: "ippan_salaryman",

    name: "サラリーマン",

    family: "ippan",

    role: "normal",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "💼",

    image: null,

    hp: 220,

    attack: 24,

    range: 50,

    speed: 0.95,

    attackInterval: 1050,

    yaniReward: 45,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  ippan_tissue: {

    id: "ippan_tissue",

    unitType: "ippan_tissue",

    name: "ティッシュ配り",

    family: "ippan",

    role: "normal",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "🧻",

    image: null,

    hp: 120,

    attack: 14,

    range: 95,

    speed: 1.1,

    attackInterval: 850,

    yaniReward: 30,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  ippan_gamekid: {

    id: "ippan_gamekid",

    unitType: "ippan_gamekid",

    name: "ゲーセンキッズ",

    family: "ippan",

    role: "normal",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "🕹️",

    image: null,

    hp: 160,

    attack: 20,

    range: 70,

    speed: 1.2,

    attackInterval: 800,

    yaniReward: 40,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  ippan_crt: {

    id: "ippan_crt",

    unitType: "ippan_crt",

    name: "ブラウン管",

    family: "ippan",

    role: "normal",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "📺",

    image: null,

    hp: 300,

    attack: 30,

    range: 48,

    speed: 0.55,

    attackInterval: 1250,

    yaniReward: 55,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  ippan_utsurimasu: {

    id: "ippan_utsurimasu",

    unitType: "ippan_utsurimasu",

    name: "写リます",

    family: "ippan",

    role: "normal",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "📷",

    image: null,

    hp: 150,

    attack: 26,

    range: 130,

    speed: 0.85,

    attackInterval: 1200,

    yaniReward: 45,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  ippan_purikura: {

    id: "ippan_purikura",

    unitType: "ippan_purikura",

    name: "プリ機",

    family: "ippan",

    role: "normal",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "📸",

    image: null,

    hp: 210,

    attack: 22,

    range: 85,

    speed: 0.75,

    attackInterval: 1000,

    yaniReward: 50,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  ippan_heisei_senshi_24: {

    id: "ippan_heisei_senshi_24",

    unitType: "ippan_heisei_senshi_24",

    name: "平成戦士・二十四時",

    family: "ippan",

    role: "midBoss",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "🕛",

    image: null,

    hp: 900,

    attack: 48,

    range: 65,

    speed: 0.45,

    attackInterval: 1400,

    yaniReward: 140,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy boss-enemy",

    unitBoss: true,

    behaviors: []

  },

  ippan_prilian: {

    id: "ippan_prilian",

    unitType: "ippan_prilian",

    name: "プリリアン",

    family: "ippan",

    role: "midBoss",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "👽",

    image: null,

    hp: 760,

    attack: 42,

    range: 145,

    speed: 0.6,

    attackInterval: 1200,

    yaniReward: 150,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy boss-enemy",

    unitBoss: true,

    behaviors: []

  },

  ippan_garakee: {

    id: "ippan_garakee",

    unitType: "ippan_garakee",

    name: "ガラケー",

    family: "ippan",

    role: "midBoss",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "📱",

    image: null,

    hp: 820,

    attack: 46,

    range: 115,

    speed: 0.5,

    attackInterval: 1300,

    yaniReward: 160,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy boss-enemy",

    unitBoss: true,

    behaviors: []

  },

  furyou_yankee_chuugakusei: {

    id: "furyou_yankee_chuugakusei",

    unitType: "furyou_yankee_chuugakusei",

    name: "ヤンキー中学生",

    family: "furyou",

    role: "normal",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "🧑‍🎓",

    image: null,

    hp: 190,

    attack: 28,

    range: 45,

    speed: 1.15,

    attackInterval: 900,

    yaniReward: 45,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  furyou_gyaru_o: {

    id: "furyou_gyaru_o",

    unitType: "furyou_gyaru_o",

    name: "ギャル男",

    family: "furyou",

    role: "normal",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "🕺",

    image: null,

    hp: 150,

    attack: 24,

    range: 50,

    speed: 1.55,

    attackInterval: 750,

    yaniReward: 40,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  furyou_jimoto_senpai: {

    id: "furyou_jimoto_senpai",

    unitType: "furyou_jimoto_senpai",

    name: "地元の先輩",

    family: "furyou",

    role: "normal",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "😎",

    image: null,

    hp: 280,

    attack: 34,

    range: 55,

    speed: 0.9,

    attackInterval: 1100,

    yaniReward: 60,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  furyou_chari_bo: {

    id: "furyou_chari_bo",

    unitType: "furyou_chari_bo",

    name: "チャリ暴",

    family: "furyou",

    role: "normal",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "🚲",

    image: null,

    hp: 170,

    attack: 30,

    range: 48,

    speed: 1.8,

    attackInterval: 850,

    yaniReward: 50,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  furyou_bontan: {

    id: "furyou_bontan",

    unitType: "furyou_bontan",

    name: "ボンタン",

    family: "furyou",

    role: "normal",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "👖",

    image: null,

    hp: 360,

    attack: 26,

    range: 42,

    speed: 0.65,

    attackInterval: 1200,

    yaniReward: 65,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  furyou_regent: {

    id: "furyou_regent",

    unitType: "furyou_regent",

    name: "リーゼント",

    family: "furyou",

    role: "normal",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "🧑‍🎤",

    image: null,

    hp: 240,

    attack: 40,

    range: 58,

    speed: 1.0,

    attackInterval: 1000,

    yaniReward: 60,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  furyou_oraora: {

    id: "furyou_oraora",

    unitType: "furyou_oraora",

    name: "オラオラ男",

    family: "furyou",

    role: "normal",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "💪",

    image: null,

    hp: 300,

    attack: 44,

    range: 46,

    speed: 1.05,

    attackInterval: 950,

    yaniReward: 70,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy",

    unitBoss: false,

    behaviors: []

  },

  furyou_jimoto_saikyo: {

    id: "furyou_jimoto_saikyo",

    unitType: "furyou_jimoto_saikyo",

    name: "地元最強※自称",

    family: "furyou",

    role: "midBoss",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "👑",

    image: null,

    hp: 1050,

    attack: 58,

    range: 62,

    speed: 0.55,

    attackInterval: 1350,

    yaniReward: 170,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy boss-enemy",

    unitBoss: true,

    behaviors: []

  },

  furyou_koshipan: {

    id: "furyou_koshipan",

    unitType: "furyou_koshipan",

    name: "腰パンの頂点",

    family: "furyou",

    role: "midBoss",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "👖",

    image: null,

    hp: 900,

    attack: 64,

    range: 50,

    speed: 0.72,

    attackInterval: 1150,

    yaniReward: 175,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy boss-enemy",

    unitBoss: true,

    behaviors: []

  },

  furyou_kaizo_chari: {

    id: "furyou_kaizo_chari",

    unitType: "furyou_kaizo_chari",

    name: "魔改造チャリ暴",

    family: "furyou",

    role: "midBoss",

    palette: {

      primary: "light purple",

      secondary: "black"

    },

    emoji: "🚲",

    image: null,

    hp: 780,

    attack: 54,

    range: 52,

    speed: 1.45,

    attackInterval: 900,

    yaniReward: 180,

    spawnOffsetX: 0,

    attackKind: "single",

    className: "battle-enemy boss-enemy",

    unitBoss: true,

    behaviors: []

  },

  heisei_final: {

    id: "heisei_final",

    unitType: "heisei_final",

    name: "《平成》",

    family: "ippan",

    role: "finalBoss",

    palette: {

      primary: "white",

      secondary: "black"

    },

    emoji: "平成",

    image: null,

    hp: 5000,

    attack: 85,

    range: 190,

    speed: 0.22,

    attackInterval: 1800,

    yaniReward: 500,

    spawnOffsetX: 180,

    attackKind: "aoe",

    className: "battle-enemy boss-enemy",

    unitBoss: true,

    behaviors: []

  }

};


function getEnemyDef(type) {

  if (
    typeof type !== "string" ||
    !Object.prototype.hasOwnProperty.call(
      ENEMIES,
      type
    )
  ) {

    return null;

  }


  return ENEMIES[type];

}


function getEnemySpawnOffsetX(def) {

  const offset =
    Number(
      def &&
      def.spawnOffsetX
    );


  if (!Number.isFinite(offset)) {

    return 0;

  }


  return offset;

}


function getEnemySpawnWorldX(def) {

  /*
    正の spawnOffsetX は敵拠点側（右・後方）。
    負は player 側（前方）。
    0 なら既存出現Xと一致。
  */

  return (
    getEnemySpawnX() +
    getEnemySpawnOffsetX(def)
  );

}


function applyYaniPercentTax(
  def,
  behavior
) {

  if (
    !behavior ||
    behavior.id !== "yaniPercentTax"
  ) {

    return;

  }


  const tax =
    Math.floor(
      yani * behavior.rate
    );


  yani -= tax;

  updateBattleUI();


  showBossMessage(
    def.name,
    `${behavior.messageBody} -${tax}`
  );

}


function applyEnemySpawnBehaviors(def) {

  const behaviors =
    def &&
    def.behaviors;


  if (!Array.isArray(behaviors)) {

    return;

  }


  behaviors.forEach((behavior) => {

    if (
      !behavior ||
      behavior.id !== "yaniPercentTax"
    ) {

      return;

    }


    applyYaniPercentTax(
      def,
      behavior
    );

  });

}


function createBattleEnemy(def) {

  if (!def) {

    return null;

  }


  const spawnX =
    getEnemySpawnWorldX(def);

  const element =
    document.createElement("div");


  element.className =
    def.className;


  element.innerHTML = `

    <div class="character-hp">
      <div class="character-hp-bar"></div>
    </div>

    <div class="enemy-body">
      ${def.emoji}
    </div>

    <div class="enemy-label">
      ${def.name}
    </div>

  `;


  applySpawnPosition(
    element,
    spawnX
  );


  unitLayer.appendChild(
    element
  );


  const enemy = {

    type: def.unitType,

    element: element,

    hpBar:
      element.querySelector(
        ".character-hp-bar"
      ),

    hp: def.hp,

    maxHp: def.hp,

    attack: def.attack,

    range: def.range,

    speed: def.speed,

    x: spawnX,

    attackCooldown: 0,

    attackInterval: def.attackInterval,

    yaniReward: def.yaniReward,

    family: def.family,

    role: def.role,

    attackKind: def.attackKind,

    spawnOffsetX: getEnemySpawnOffsetX(def),

    dead: false

  };


  if (def.unitBoss === true) {

    enemy.boss = true;

  }


  enemyUnits.push(enemy);


  return enemy;

}


function spawnEnemyFromDef(def) {

  if (!def) {

    return null;

  }


  applyEnemySpawnBehaviors(def);


  return createBattleEnemy(def);

}


function spawnEnemyByType(type) {

  return spawnEnemyFromDef(
    getEnemyDef(type)
  );

}


/* =========================
   PLAYER UPDATE
========================= */

function updateUnits() {

  playerUnits.forEach(
    (unit) => {

      if (unit.dead) {
        return;
      }


      if (
        isAttackDashActive(unit)
      ) {

        resetUnitSprintAcceleration(
          unit
        );

        if (
          isHealthKnockbackActive(
            unit
          )
        ) {

          clearAttackDash(unit);

        } else if (
          updateAttackDashMotion(
            unit
          )
        ) {

          unit.element.style.left =
            unit.x + "px";

          return;

        }

      }


      if (
        isDelayedMultiHitActive(unit)
      ) {

        resetUnitSprintAcceleration(
          unit
        );

        unit.element.style.left =
          unit.x + "px";

        return;

      }


      if (
        isPendingMeleeImpactActive(
          unit
        )
      ) {

        resetUnitSprintAcceleration(
          unit
        );

        unit.element.style.left =
          unit.x + "px";

        return;

      }


      if (
        updateHealthKnockbackMotion(
          unit
        )
      ) {

        resetUnitSprintAcceleration(
          unit
        );

        unit.element.style.left =
          unit.x + "px";

        updateUnitBpmOver(
          unit,
          Date.now()
        );

        return;

      }


      updateUnitBpmOver(
        unit,
        Date.now()
      );


      const target =
        findNearestEnemy(unit);


      if (target) {

        const distance =
          target.x -
          unit.x;


        if (
          distance >
          unit.range
        ) {

          unit.x +=
            getUnitMoveSpeed(
              unit
            );

        } else {

          resetUnitSprintAcceleration(
            unit
          );

          tryAttack(
            unit,
            target,
            true
          );

        }

      } else {

        /*
          敵がいなければ
          敵拠点へ進む
        */

        const enemyBaseX =
          ENEMY_BASE_X;


        const distanceToBase =
          enemyBaseX -
          unit.x;


        if (
          distanceToBase >
          unit.range
        ) {

          unit.x +=
            getUnitMoveSpeed(
              unit
            );

        } else {

          resetUnitSprintAcceleration(
            unit
          );

          attackEnemyBase(
            unit
          );

        }

      }


      unit.element.style.left =
        unit.x + "px";

    }
  );

}


/* =========================
   UNIT STATUS EFFECTS
========================= */

const UNIT_STATUS = {

  TIME_STOP: "timeStop"

};


function ensureUnitStatuses(unit) {

  if (!unit) {

    return null;

  }

  if (
    !unit.statuses ||
    typeof unit.statuses !==
      "object"
  ) {

    unit.statuses = {};

  }

  return unit.statuses;

}


function showTimeStopVisual(unit) {

  if (
    !unit ||
    !unit.element
  ) {

    return;

  }

  unit.element.classList.add(
    "is-time-stopped"
  );

  let overlay =
    unit.element.querySelector(
      ".status-time-stop"
    );

  if (overlay) {

    return;

  }

  overlay =
    document.createElement("div");

  overlay.className =
    "status-time-stop";

  overlay.setAttribute(
    "aria-hidden",
    "true"
  );

  overlay.innerHTML =
    '<span class="status-time-stop-ring"></span>' +
    '<span class="status-time-stop-mark">❚❚</span>';

  unit.element.appendChild(
    overlay
  );

}


function hideTimeStopVisual(unit) {

  if (
    !unit ||
    !unit.element
  ) {

    return;

  }

  unit.element.classList.remove(
    "is-time-stopped"
  );

  const overlay =
    unit.element.querySelector(
      ".status-time-stop"
    );

  if (overlay) {

    overlay.remove();

  }

}


function clearUnitStatusEffect(
  unit,
  statusId
) {

  if (
    !unit ||
    !statusId ||
    !unit.statuses ||
    !unit.statuses[statusId]
  ) {

    return;

  }

  delete unit.statuses[statusId];

  if (
    statusId ===
    UNIT_STATUS.TIME_STOP
  ) {

    hideTimeStopVisual(unit);

  }

}


function clearUnitStatusEffectIfExpired(
  unit,
  statusId,
  token
) {

  if (
    !unit ||
    !unit.statuses ||
    !unit.statuses[statusId]
  ) {

    return;

  }

  const entry =
    unit.statuses[statusId];

  if (entry.token !== token) {

    return;

  }

  if (
    Date.now() <
    entry.expiresAt
  ) {

    return;

  }

  clearUnitStatusEffect(
    unit,
    statusId
  );

}


function applyStatusEffect(
  unit,
  statusId,
  durationMs
) {

  if (
    !unit ||
    unit.dead ||
    !statusId
  ) {

    return false;

  }

  const duration =
    Number(durationMs);

  if (
    !Number.isFinite(duration) ||
    duration <= 0
  ) {

    return false;

  }

  const statuses =
    ensureUnitStatuses(unit);

  if (!statuses) {

    return false;

  }

  const previous =
    statuses[statusId];

  const token =
    previous &&
    Number.isInteger(previous.token)
      ? previous.token + 1
      : 1;

  const expiresAt =
    Date.now() +
    duration;

  statuses[statusId] = {

    id: statusId,

    token: token,

    expiresAt: expiresAt,

    durationMs: duration

  };

  if (
    statusId ===
    UNIT_STATUS.TIME_STOP
  ) {

    showTimeStopVisual(unit);

  }

  window.setTimeout(
    () => {

      clearUnitStatusEffectIfExpired(
        unit,
        statusId,
        token
      );

    },
    duration + 16
  );

  return true;

}


function isUnitStatusActive(
  unit,
  statusId
) {

  if (
    !unit ||
    unit.dead ||
    !statusId ||
    !unit.statuses ||
    !unit.statuses[statusId]
  ) {

    return false;

  }

  const entry =
    unit.statuses[statusId];

  if (
    Date.now() >=
    entry.expiresAt
  ) {

    clearUnitStatusEffect(
      unit,
      statusId
    );

    return false;

  }

  return true;

}


function clearAllStatusEffects(unit) {

  if (
    !unit ||
    !unit.statuses
  ) {

    return;

  }

  Object.keys(
    unit.statuses
  ).forEach((statusId) => {

    clearUnitStatusEffect(
      unit,
      statusId
    );

  });

}


function clearAllBattleStatusEffects() {

  enemyUnits.forEach(
    clearAllStatusEffects
  );

  playerUnits.forEach(
    clearAllStatusEffects
  );

}


/* =========================
   COMMON UNIT BUFF FOUNDATION
========================= */

const UNIT_BUFF = {

  ATTACK_UP: "attackUp",

  ATTACK_SPEED_UP: "attackSpeedUp"

};


const UNIT_BUFF_ICON = {

  [UNIT_BUFF.ATTACK_UP]:
    "images/ui/buffs/attack_up.webp",

  [UNIT_BUFF.ATTACK_SPEED_UP]:
    "images/ui/buffs/attack_speed_up.webp"

};


function ensureUnitActiveBuffs(unit) {

  if (!unit) {

    return null;

  }

  if (
    !unit.activeBuffs ||
    typeof unit.activeBuffs !==
      "object"
  ) {

    unit.activeBuffs = {};

  }

  return unit.activeBuffs;

}


function getUnitConditionalBuffDefs(
  unit
) {

  if (
    !unit ||
    !Array.isArray(
      unit.conditionalBuffs
    )
  ) {

    return [];

  }

  return unit.conditionalBuffs;

}


function isBuffConditionMet(
  unit,
  condition
) {

  if (
    !unit ||
    !condition ||
    typeof condition !== "object"
  ) {

    return false;

  }

  if (
    condition.type ===
    "hpRatioAtMost"
  ) {

    const maxHp =
      Number(unit.maxHp);

    const hp =
      Number(unit.hp);

    const threshold =
      Number(condition.value);

    if (
      !Number.isFinite(maxHp) ||
      maxHp <= 0 ||
      !Number.isFinite(hp) ||
      !Number.isFinite(threshold)
    ) {

      return false;

    }

    return (hp / maxHp) <= threshold;

  }

  return false;

}


function getUnitBuffMultiplier(
  unit,
  buffId
) {

  const active =
    ensureUnitActiveBuffs(unit);

  if (
    !active ||
    !buffId ||
    !active[buffId]
  ) {

    return 1;

  }

  const multiplier =
    Number(
      active[buffId].multiplier
    );

  if (
    !Number.isFinite(multiplier) ||
    multiplier <= 0
  ) {

    return 1;

  }

  return multiplier;

}


function getUnitAttackPower(unit) {

  const base =
    Number(
      unit &&
      unit.attack
    ) || 0;

  const multiplier =
    getUnitBuffMultiplier(
      unit,
      UNIT_BUFF.ATTACK_UP
    );

  return roundCharacterStat(
    base * multiplier
  );

}


/* =========================
   BPM OVER / ATTACK SPEED
========================= */

function getBpmOverTrait(unit) {

  if (
    !unit ||
    !unit.traits ||
    !unit.traits.bpmOver
  ) {

    return null;

  }

  return unit.traits.bpmOver;

}


function getBpmOverIntervals(trait) {

  if (
    !trait ||
    !Array.isArray(trait.intervals) ||
    !trait.intervals.length
  ) {

    return null;

  }

  return trait.intervals;

}


function getUnitAttackInterval(unit) {

  const base =
    Number(
      unit &&
      unit.attackInterval
    ) || 0;

  const trait =
    getBpmOverTrait(unit);

  const intervals =
    getBpmOverIntervals(trait);

  if (!intervals) {

    return base;

  }

  const level =
    Math.max(
      0,
      Math.min(
        Number(unit.bpmLevel) || 0,
        intervals.length - 1
      )
    );

  const value =
    Number(intervals[level]);

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {

    return base;

  }

  return value;

}


function getUnitAttackSpeedMultiplier(
  unit
) {

  const base =
    Number(
      unit &&
      unit.attackInterval
    ) || 0;

  const current =
    getUnitAttackInterval(unit);

  if (
    !Number.isFinite(base) ||
    base <= 0 ||
    !Number.isFinite(current) ||
    current <= 0
  ) {

    return 1;

  }

  return base / current;

}


function getBpmOverIconLevel(trait) {

  const intervals =
    getBpmOverIntervals(trait);

  if (!intervals) {

    return 0;

  }

  if (
    typeof trait.iconAtLevel ===
      "number"
  ) {

    return Math.max(
      0,
      Math.min(
        trait.iconAtLevel,
        intervals.length - 1
      )
    );

  }

  return intervals.length - 1;

}


function applyBpmOverBuffToActiveMap(
  unit,
  activeMap
) {

  const trait =
    getBpmOverTrait(unit);

  if (
    !trait ||
    !activeMap
  ) {

    return;

  }

  const level =
    Number(unit.bpmLevel) || 0;

  const iconLevel =
    getBpmOverIconLevel(trait);

  if (level < iconLevel) {

    return;

  }

  activeMap[
    UNIT_BUFF.ATTACK_SPEED_UP
  ] = {

    id: UNIT_BUFF.ATTACK_SPEED_UP,

    multiplier:
      getUnitAttackSpeedMultiplier(
        unit
      ),

    source: "bpm"

  };

}


function syncUnitBpmOverVisual(unit) {

  if (
    !unit ||
    unit.dead
  ) {

    return;

  }

  const active =
    ensureUnitActiveBuffs(unit) ||
    {};

  const next = {};

  Object.keys(active).forEach(
    (buffId) => {

      if (
        active[buffId] &&
        active[buffId].source !==
          "bpm"
      ) {

        next[buffId] =
          active[buffId];

      }

    }
  );

  applyBpmOverBuffToActiveMap(
    unit,
    next
  );

  unit.activeBuffs = next;

  syncUnitBuffVisuals(unit);

}


function clearUnitBpmOver(unit) {

  if (!unit) {

    return;

  }

  unit.bpmLevel = 0;

  unit.bpmLastHitAt = 0;

  if (
    unit.activeBuffs &&
    unit.activeBuffs[
      UNIT_BUFF.ATTACK_SPEED_UP
    ] &&
    unit.activeBuffs[
      UNIT_BUFF.ATTACK_SPEED_UP
    ].source === "bpm"
  ) {

    delete unit.activeBuffs[
      UNIT_BUFF.ATTACK_SPEED_UP
    ];

  }

  syncUnitBuffVisuals(unit);

}


function noteUnitAttackSuccess(unit) {

  if (
    !unit ||
    unit.dead
  ) {

    return;

  }

  const trait =
    getBpmOverTrait(unit);

  const intervals =
    getBpmOverIntervals(trait);

  if (!intervals) {

    return;

  }

  const maxLevel =
    intervals.length - 1;

  const current =
    Math.max(
      0,
      Number(unit.bpmLevel) || 0
    );

  unit.bpmLevel =
    Math.min(
      maxLevel,
      current + 1
    );

  unit.bpmLastHitAt =
    Date.now();

  syncUnitBpmOverVisual(unit);

}


function updateUnitBpmOver(unit, now) {

  const trait =
    getBpmOverTrait(unit);

  if (
    !trait ||
    !unit ||
    unit.dead
  ) {

    return;

  }

  const level =
    Number(unit.bpmLevel) || 0;

  if (level <= 0) {

    return;

  }

  const resetAfterMs =
    typeof trait.resetAfterMs ===
      "number"
      ? trait.resetAfterMs
      : 2000;

  const lastHit =
    Number(unit.bpmLastHitAt) || 0;

  if (
    now - lastHit >=
    resetAfterMs
  ) {

    clearUnitBpmOver(unit);

  }

}


function getUnitBuffIconHost(unit) {

  if (
    !unit ||
    !unit.element
  ) {

    return null;

  }

  return unit.element.querySelector(
    ".unit-buff-icons"
  );

}


function syncUnitBuffVisuals(unit) {

  const host =
    getUnitBuffIconHost(unit);

  if (!host) {

    return;

  }

  const active =
    ensureUnitActiveBuffs(unit) ||
    {};

  const desiredIds =
    Object.keys(active);

  [...host.children].forEach(
    (child) => {

      const buffId =
        child.dataset &&
        child.dataset.buffId;

      if (
        !buffId ||
        !active[buffId]
      ) {

        child.remove();

      }

    }
  );

  desiredIds.forEach((buffId) => {

    let icon =
      host.querySelector(
        '[data-buff-id="' +
        buffId +
        '"]'
      );

    if (icon) {

      return;

    }

    const src =
      UNIT_BUFF_ICON[buffId];

    if (!src) {

      return;

    }

    icon =
      document.createElement("img");

    icon.className =
      "unit-buff-icon is-appear";

    icon.dataset.buffId =
      buffId;

    icon.src = src;

    icon.alt = "";

    icon.draggable = false;

    icon.setAttribute(
      "aria-hidden",
      "true"
    );

    host.appendChild(icon);

    window.setTimeout(
      () => {

        if (
          icon.isConnected
        ) {

          icon.classList.remove(
            "is-appear"
          );

        }

      },
      320
    );

  });

}


function clearUnitBuffVisuals(unit) {

  const host =
    getUnitBuffIconHost(unit);

  if (!host) {

    return;

  }

  host.innerHTML = "";

}


function clearAllUnitBuffs(unit) {

  if (!unit) {

    return;

  }

  unit.activeBuffs = {};

  unit.bpmLevel = 0;

  unit.bpmLastHitAt = 0;

  clearUnitBuffVisuals(unit);

}


function refreshUnitConditionalBuffs(
  unit
) {

  if (
    !unit ||
    unit.dead
  ) {

    return;

  }

  const active =
    ensureUnitActiveBuffs(unit);

  if (!active) {

    return;

  }

  const next = {};

  getUnitConditionalBuffDefs(
    unit
  ).forEach((entry) => {

    if (
      !entry ||
      !entry.buff ||
      !entry.buff.id
    ) {

      return;

    }

    if (
      !isBuffConditionMet(
        unit,
        entry.condition
      )
    ) {

      return;

    }

    const buffId =
      entry.buff.id;

    const multiplier =
      Number(
        entry.buff.multiplier
      );

    next[buffId] = {

      id: buffId,

      multiplier:
        Number.isFinite(
          multiplier
        ) &&
        multiplier > 0
          ? multiplier
          : 1,

      source: "conditional"

    };

  });

  applyBpmOverBuffToActiveMap(
    unit,
    next
  );

  unit.activeBuffs = next;

  syncUnitBuffVisuals(unit);

}


function spawnFrontAoeEffect(
  attacker,
  behavior,
  impactX
) {

  if (
    !projectileLayer ||
    !behavior ||
    !behavior.effectImage
  ) {

    return;

  }

  const element =
    document.createElement("div");

  element.className =
    "battle-slash-effect battle-front-aoe-effect";

  const image =
    document.createElement("img");

  image.src =
    behavior.effectImage;

  image.alt = "";

  const effectWidth =
    typeof behavior.effectWidth ===
      "number"
      ? behavior.effectWidth
      : 160;

  image.style.width =
    effectWidth + "px";

  element.appendChild(image);

  const offsetY =
    typeof behavior.effectOffsetY ===
      "number"
      ? behavior.effectOffsetY
      : 0;

  const scaleX =
    typeof behavior.effectScaleX ===
      "number"
      ? behavior.effectScaleX
      : 1;

  const scaleY =
    typeof behavior.effectScaleY ===
      "number"
      ? behavior.effectScaleY
      : 1;

  element.style.left =
    impactX + "px";

  element.style.bottom =
    "calc(22% + " +
    offsetY +
    "px)";

  element.style.transform =
    "translate(-50%, 40%) scale(" +
    scaleX +
    ", " +
    scaleY +
    ")";

  projectileLayer.appendChild(
    element
  );

  const lifetimeMs =
    typeof behavior.effectLifetimeMs ===
      "number"
      ? behavior.effectLifetimeMs
      : (
        typeof behavior.effectDurationMs ===
          "number"
          ? behavior.effectDurationMs
          : 400
      );

  window.setTimeout(
    () => {

      if (element.parentNode) {

        element.remove();

      }

    },
    lifetimeMs
  );

}


function applyFrontAoeDamage(
  attacker,
  behavior,
  impactXOverride
) {

  const forwardOffset =
    typeof behavior.impactOffsetX ===
      "number"
      ? behavior.impactOffsetX
      : (
        typeof behavior.forwardOffset ===
          "number"
          ? behavior.forwardOffset
          : 90
      );

  const aoeRadius =
    typeof behavior.aoeRadius ===
      "number"
      ? behavior.aoeRadius
      : 80;

  const impactX =
    Number.isFinite(impactXOverride)
      ? impactXOverride
      : (
        attacker.x +
        forwardOffset
      );

  spawnFrontAoeEffect(
    attacker,
    behavior,
    impactX
  );

  const attackPower =
    getUnitAttackPower(
      attacker
    );

  enemyUnits.forEach((enemy) => {

    if (enemy.dead) {

      return;

    }

    if (enemy.x < attacker.x) {

      return;

    }

    if (
      Math.abs(
        enemy.x -
        impactX
      ) <=
      aoeRadius
    ) {

      damageCharacter(
        enemy,
        attackPower,
        true,
        attacker
      );

    }

  });

  noteUnitAttackSuccess(
    attacker
  );

  maybeSelfDestructOnFrontAoeImpact(
    attacker,
    behavior
  );

}


function applyFrontAoeEnemyBaseAttack(
  attacker,
  behavior,
  impactXOverride
) {

  const forwardOffset =
    typeof behavior.impactOffsetX ===
      "number"
      ? behavior.impactOffsetX
      : (
        typeof behavior.forwardOffset ===
          "number"
          ? behavior.forwardOffset
          : 90
      );

  const impactX =
    Number.isFinite(impactXOverride)
      ? impactXOverride
      : Math.min(
        attacker.x +
        forwardOffset,
        ENEMY_BASE_X
      );

  // Shared FRONT_AOE visual only.
  // Base damage stays single-hit and
  // does not also AoE-hit enemies.
  spawnFrontAoeEffect(
    attacker,
    behavior,
    impactX
  );

  enemyBaseHp -=
    getUnitAttackPower(
      attacker
    );

  updateBaseUI();

  noteUnitAttackSuccess(
    attacker
  );

  if (enemyBaseHp <= 0) {

    tryResolveBattleVictory();

  }

  maybeSelfDestructOnFrontAoeImpact(
    attacker,
    behavior
  );

}


function maybeSelfDestructOnFrontAoeImpact(
  attacker,
  behavior
) {

  if (
    !attacker ||
    attacker.dead ||
    !behavior ||
    behavior.selfDestructOnImpact !==
      true
  ) {

    return;

  }

  // Full self-loss: not fixed damage.
  // Always enter the normal ally
  // death pipeline after impact.
  attacker.hp = 0;

  if (attacker.hpBar) {

    attacker.hpBar.style.width =
      "0%";

  }

  defeatCharacter(
    attacker,
    false
  );

}


function clearPendingFrontAoe(unit) {

  if (
    !unit ||
    !unit.pendingFrontAoe
  ) {

    return;

  }

  unit.pendingFrontAoe = null;

}


function clearPendingMeleeImpact(
  unit
) {

  if (
    !unit ||
    !unit.pendingMeleeImpact
  ) {

    return;

  }

  unit.pendingMeleeImpact =
    null;

}


function isPendingMeleeImpactActive(
  unit
) {

  return !!(
    unit &&
    unit.pendingMeleeImpact
  );

}


function getMeleeImpactDelayMs(
  behavior
) {

  if (
    !behavior ||
    typeof behavior.impactDelayMs !==
      "number" ||
    behavior.impactDelayMs <= 0
  ) {

    return 0;

  }

  return behavior.impactDelayMs;

}


function applyMeleeSingleImpact(
  attacker,
  target,
  towardEnemyBase
) {

  if (
    !attacker ||
    attacker.dead
  ) {

    return;

  }

  if (towardEnemyBase) {

    enemyBaseHp -=
      getUnitAttackPower(
        attacker
      );

    updateBaseUI();

    if (
      enemyBaseHp <= 0
    ) {

      tryResolveBattleVictory();

    }

    return;

  }

  if (
    !target ||
    target.dead
  ) {

    return;

  }

  damageCharacter(
    target,
    getUnitAttackPower(
      attacker
    ),
    true,
    attacker
  );

}


function beginMeleeSingleAttack(
  attacker,
  behavior,
  target,
  options
) {

  if (
    !attacker ||
    attacker.dead ||
    !behavior
  ) {

    return;

  }

  const settings =
    options ||
    {};

  const towardEnemyBase =
    Boolean(
      settings.towardEnemyBase
    );

  const delayMs =
    getMeleeImpactDelayMs(
      behavior
    );

  if (delayMs <= 0) {

    applyMeleeSingleImpact(
      attacker,
      target,
      towardEnemyBase
    );

    return;

  }

  clearPendingMeleeImpact(
    attacker
  );

  attacker.pendingMeleeImpact = {

    fireAt:
      Date.now() +
      delayMs,

    target:
      towardEnemyBase
        ? null
        : target,

    towardEnemyBase:
      towardEnemyBase

  };

}


function beginFrontAoeAttack(
  attacker,
  behavior,
  options
) {

  if (
    !attacker ||
    attacker.dead ||
    !behavior
  ) {

    return;

  }

  const settings =
    options ||
    {};

  const towardEnemyBase =
    Boolean(
      settings.towardEnemyBase
    );

  const forwardOffset =
    typeof behavior.impactOffsetX ===
      "number"
      ? behavior.impactOffsetX
      : (
        typeof behavior.forwardOffset ===
          "number"
          ? behavior.forwardOffset
          : 90
      );

  let impactX =
    attacker.x +
    forwardOffset;

  if (towardEnemyBase) {

    // Do not place the ground fist
    // past the enemy base.
    impactX =
      Math.min(
        impactX,
        ENEMY_BASE_X
      );

  }

  const delayMs =
    typeof behavior.impactDelayMs ===
      "number" &&
    behavior.impactDelayMs > 0
      ? behavior.impactDelayMs
      : 0;

  if (delayMs <= 0) {

    if (towardEnemyBase) {

      applyFrontAoeEnemyBaseAttack(
        attacker,
        behavior,
        impactX
      );

    } else {

      applyFrontAoeDamage(
        attacker,
        behavior,
        impactX
      );

    }

    return;

  }

  clearPendingFrontAoe(attacker);

  attacker.pendingFrontAoe = {

    fireAt:
      Date.now() +
      delayMs,

    impactX: impactX,

    towardEnemyBase:
      towardEnemyBase,

    behavior: behavior

  };

}


function resolveDuePendingFrontAoe(
  unit,
  now
) {

  const pending =
    unit &&
    unit.pendingFrontAoe;

  if (
    !pending ||
    typeof pending.fireAt !==
      "number" ||
    now < pending.fireAt
  ) {

    return;

  }

  const behavior =
    pending.behavior;

  const impactX =
    pending.impactX;

  const towardEnemyBase =
    pending.towardEnemyBase;

  unit.pendingFrontAoe =
    null;

  if (
    !unit ||
    unit.dead ||
    !behavior
  ) {

    return;

  }

  if (towardEnemyBase) {

    applyFrontAoeEnemyBaseAttack(
      unit,
      behavior,
      impactX
    );

  } else {

    applyFrontAoeDamage(
      unit,
      behavior,
      impactX
    );

  }

}


function resolveDuePendingMeleeImpact(
  unit,
  now
) {

  const pending =
    unit &&
    unit.pendingMeleeImpact;

  if (
    !pending ||
    typeof pending.fireAt !==
      "number" ||
    now < pending.fireAt
  ) {

    return;

  }

  unit.pendingMeleeImpact =
    null;

  applyMeleeSingleImpact(
    unit,
    pending.target,
    pending.towardEnemyBase
  );

}


function updatePendingCombatDelays() {

  if (!isBattleActive()) {

    return;

  }

  const now =
    Date.now();

  playerUnits.forEach(
    (unit) => {

      if (
        !unit ||
        unit.dead
      ) {

        return;

      }

      resolveDuePendingFrontAoe(
        unit,
        now
      );

      resolveDuePendingMeleeImpact(
        unit,
        now
      );

      resolveDueDelayedMultiHits(
        unit,
        now
      );

    }
  );

  updateDropAoeEffects(now);

}


function pullUnitTowardX(
  unit,
  centerX,
  maxDistance
) {

  if (
    !unit ||
    unit.dead ||
    !Number.isFinite(centerX)
  ) {

    return 0;

  }

  const limit =
    typeof maxDistance ===
      "number" &&
    maxDistance > 0
      ? maxDistance
      : 0;

  if (limit <= 0) {

    return 0;

  }

  const dx =
    centerX -
    unit.x;

  const distance =
    Math.abs(dx);

  if (distance <= 0) {

    return 0;

  }

  const move =
    Math.min(
      limit,
      distance
    );

  unit.x +=
    Math.sign(dx) *
    move;

  if (unit.element) {

    unit.element.style.left =
      unit.x + "px";

  }

  return move;

}


function getDropAoeTargetsAt(
  impactX,
  aoeRadius
) {

  const radius =
    typeof aoeRadius ===
      "number"
      ? aoeRadius
      : 80;

  const targets = [];

  enemyUnits.forEach((enemy) => {

    if (
      !enemy ||
      enemy.dead
    ) {

      return;

    }

    if (
      Math.abs(
        enemy.x -
        impactX
      ) <=
      radius
    ) {

      targets.push(enemy);

    }

  });

  return targets;

}


function applyDropAoeOnHitStatus(
  targets,
  statusConfig
) {

  if (
    !statusConfig ||
    !statusConfig.id ||
    !Array.isArray(targets)
  ) {

    return;

  }

  targets.forEach((target) => {

    if (
      !target ||
      target.dead
    ) {

      return;

    }

    tryApplyOnHitStatus(
      {
        onHitStatus:
          statusConfig
      },
      target
    );

  });

}


function spawnDropAoeImpactFlash(
  impactX,
  offsetY,
  lifetimeMs
) {

  if (!projectileLayer) {

    return;

  }

  const flash =
    document.createElement("div");

  flash.className =
    "battle-drop-aoe-impact";

  flash.style.left =
    impactX + "px";

  flash.style.bottom =
    "calc(22% + " +
    offsetY +
    "px)";

  projectileLayer.appendChild(
    flash
  );

  window.setTimeout(
    () => {

      if (flash.parentNode) {

        flash.remove();

      }

    },
    lifetimeMs
  );

}


function removeDropAoeEffect(effect) {

  if (!effect) {

    return;

  }

  effect.resolved = true;

  if (
    effect.animation &&
    typeof effect.animation.cancel ===
      "function"
  ) {

    try {

      effect.animation.cancel();

    } catch (error) {

      // Ignore cancelled animations.

    }

  }

  if (
    effect.element &&
    effect.element.parentNode
  ) {

    effect.element.remove();

  }

  activeDropAoeEffects =
    activeDropAoeEffects.filter(
      (entry) =>
        entry !== effect
    );

}


function clearDropAoeEffects() {

  activeDropAoeEffects
    .slice()
    .forEach(
      removeDropAoeEffect
    );

  activeDropAoeEffects = [];

}


function resolveDropAoeImpact(
  drop
) {

  if (
    !drop ||
    drop.resolved
  ) {

    return;

  }

  drop.resolved = true;

  spawnDropAoeImpactFlash(
    drop.impactX,
    drop.effectOffsetY,
    drop.impactFlashMs
  );

  if (drop.towardEnemyBase) {

    enemyBaseHp -=
      drop.attackPower;

    updateBaseUI();

    if (
      drop.source &&
      !drop.source.dead
    ) {

      noteUnitAttackSuccess(
        drop.source
      );

    }

    if (enemyBaseHp <= 0) {

      tryResolveBattleVictory();

    }

    window.setTimeout(
      () => {

        removeDropAoeEffect(drop);

      },
      drop.impactFlashMs
    );

    return;

  }

  const targets =
    getDropAoeTargetsAt(
      drop.impactX,
      drop.aoeRadius
    );

  targets.forEach((enemy) => {

    pullUnitTowardX(
      enemy,
      drop.impactX,
      drop.pullDistance
    );

  });

  targets.forEach((enemy) => {

    if (
      !enemy ||
      enemy.dead
    ) {

      return;

    }

    damageCharacter(
      enemy,
      drop.attackPower,
      true,
      drop.source
    );

  });

  applyDropAoeOnHitStatus(
    targets,
    drop.onHitStatus
  );

  if (
    drop.source &&
    !drop.source.dead
  ) {

    noteUnitAttackSuccess(
      drop.source
    );

  }

  window.setTimeout(
    () => {

      removeDropAoeEffect(drop);

    },
    drop.impactFlashMs
  );

}


function beginDropAoeAttack(
  attacker,
  behavior,
  target,
  options
) {

  if (
    !attacker ||
    !behavior ||
    !projectileLayer
  ) {

    return;

  }

  const settings =
    options ||
    {};

  const towardEnemyBase =
    Boolean(
      settings.towardEnemyBase
    );

  // Snapshot impact at attack start.
  // Do not track the original target.
  const impactX =
    towardEnemyBase
      ? ENEMY_BASE_X
      : (
        target &&
        Number.isFinite(target.x)
          ? target.x
          : attacker.x +
            (
              Number(attacker.range) ||
              0
            )
      );

  const attackPower =
    getUnitAttackPower(
      attacker
    );

  const spawnDelayMs =
    typeof behavior.spawnDelayMs ===
      "number"
      ? behavior.spawnDelayMs
      : 80;

  const fallDurationMs =
    typeof behavior.fallDurationMs ===
      "number"
      ? behavior.fallDurationMs
      : 800;

  const fallDistancePx =
    typeof behavior.fallDistancePx ===
      "number"
      ? behavior.fallDistancePx
      : 185;

  const aoeRadius =
    typeof behavior.aoeRadius ===
      "number"
      ? behavior.aoeRadius
      : 80;

  const pullDistance =
    typeof behavior.pullDistance ===
      "number"
      ? behavior.pullDistance
      : 0;

  const effectWidth =
    typeof behavior.effectWidth ===
      "number"
      ? behavior.effectWidth
      : 110;

  const effectRotateDeg =
    typeof behavior.effectRotateDeg ===
      "number"
      ? behavior.effectRotateDeg
      : 90;

  const effectOffsetY =
    typeof behavior.effectOffsetY ===
      "number"
      ? behavior.effectOffsetY
      : 0;

  const impactFlashMs =
    typeof behavior.impactFlashMs ===
      "number"
      ? behavior.impactFlashMs
      : 280;

  const onHitStatus =
    behavior.onHitStatus
      ? {

        id: behavior.onHitStatus.id,

        chance:
          behavior.onHitStatus.chance,

        durationMs:
          behavior.onHitStatus.durationMs

      }
      : null;

  const drop = {

    resolved: false,

    phase: "waiting",

    spawnAt:
      Date.now() +
      spawnDelayMs,

    fallDurationMs:
      fallDurationMs,

    fallDistancePx:
      fallDistancePx,

    effectImage:
      behavior.effectImage,

    effectWidth: effectWidth,

    effectRotateDeg:
      effectRotateDeg,

    impactX: impactX,

    attackPower: attackPower,

    aoeRadius: aoeRadius,

    pullDistance: pullDistance,

    towardEnemyBase:
      towardEnemyBase,

    source: attacker,

    onHitStatus: onHitStatus,

    effectOffsetY: effectOffsetY,

    impactFlashMs: impactFlashMs,

    element: null,

    animation: null

  };

  activeDropAoeEffects.push(drop);

}


function startDropAoeFall(drop) {

  if (
    !drop ||
    drop.resolved ||
    drop.phase !== "waiting" ||
    !projectileLayer ||
    !drop.effectImage
  ) {

    return;

  }

  const element =
    document.createElement(
      "div"
    );

  element.className =
    "battle-drop-aoe-effect";

  const image =
    document.createElement(
      "img"
    );

  image.src =
    drop.effectImage;

  image.alt = "";

  image.style.width =
    drop.effectWidth + "px";

  image.style.transform =
    "rotate(" +
    drop.effectRotateDeg +
    "deg)";

  element.appendChild(image);

  element.style.left =
    drop.impactX + "px";

  element.style.bottom =
    "calc(22% + " +
    drop.effectOffsetY +
    "px)";

  element.style.transform =
    "translate(-50%, 0) translateY(-" +
    drop.fallDistancePx +
    "px)";

  projectileLayer.appendChild(
    element
  );

  drop.element = element;

  drop.phase = "falling";

  // Fall translate only on the
  // wrapper; tip-down rotate stays
  // on the image for the full fall.
  const animation =
    element.animate(
      [
        {
          transform:
            "translate(-50%, 0) translateY(-" +
            drop.fallDistancePx +
            "px)"
        },
        {
          transform:
            "translate(-50%, 0) translateY(0px)"
        }
      ],
      {
        duration:
          drop.fallDurationMs,
        // Mild ease-in: slow start,
        // slight late accel. Avoid
        // extreme end warp.
        easing:
          "cubic-bezier(0.40, 0.00, 0.70, 1.00)",
        fill: "forwards"
      }
    );

  drop.animation =
    animation;

  drop.fallEndsAt =
    Date.now() +
    drop.fallDurationMs;

}


function updateDropAoeEffects(now) {

  if (!isBattleActive()) {

    return;

  }

  const time =
    typeof now === "number"
      ? now
      : Date.now();

  activeDropAoeEffects
    .slice()
    .forEach(
      (drop) => {

        if (
          !drop ||
          drop.resolved
        ) {

          return;

        }

        if (
          drop.phase ===
            "waiting" &&
          typeof drop.spawnAt ===
            "number" &&
          time >= drop.spawnAt
        ) {

          startDropAoeFall(drop);

          return;

        }

        if (
          drop.phase ===
            "falling" &&
          typeof drop.fallEndsAt ===
            "number" &&
          time >= drop.fallEndsAt
        ) {

          resolveDropAoeImpact(
            drop
          );

        }

      }
    );

}


function tryApplyOnHitStatus(
  projectile,
  target
) {

  if (
    !projectile ||
    !target ||
    target.dead ||
    !projectile.onHitStatus
  ) {

    return false;

  }

  const config =
    projectile.onHitStatus;

  const statusId =
    config.id;

  if (!statusId) {

    return false;

  }

  const chance =
    typeof config.chance ===
      "number"
      ? config.chance
      : 0;

  if (
    chance <= 0 ||
    Math.random() >= chance
  ) {

    return false;

  }

  return applyStatusEffect(
    target,
    statusId,
    config.durationMs
  );

}


/* =========================
   ENEMY UPDATE
========================= */

function updateEnemies() {

  enemyUnits.forEach(
    (enemy) => {

      if (enemy.dead) {
        return;
      }


      if (
        enemy.trainingDummy ||
        enemy.attackKind === "none" ||
        (
          Number(enemy.attack) ||
          0
        ) <= 0
      ) {

        enemy.element.style.left =
          enemy.x + "px";

        return;

      }


      if (
        updateHealthKnockbackMotion(
          enemy
        )
      ) {

        enemy.element.style.left =
          enemy.x + "px";

        return;

      }


      if (
        isUnitStatusActive(
          enemy,
          UNIT_STATUS.TIME_STOP
        )
      ) {

        enemy.element.style.left =
          enemy.x + "px";

        return;

      }


      const target =
        findNearestPlayer(enemy);


      if (target) {

        const distance =
          enemy.x -
          target.x;


        if (
          distance >
          enemy.range
        ) {

          enemy.x -=
            enemy.speed;

        } else {

          tryAttack(
            enemy,
            target,
            false
          );

        }

      } else {

        /*
          味方がいなければ
          機材車へ進む
        */

        const playerBaseX =
          PLAYER_BASE_X;


        const distanceToBase =
          enemy.x -
          playerBaseX;


        if (
          distanceToBase >
          enemy.range
        ) {

          enemy.x -=
            enemy.speed;

        } else {

          attackPlayerBase(
            enemy
          );

        }

      }


      enemy.element.style.left =
        enemy.x + "px";

    }
  );

}


/* =========================
   TARGET SEARCH
========================= */

function findNearestEnemy(unit) {

  let target = null;

  let shortest =
    Infinity;


  enemyUnits.forEach(
    (enemy) => {

      if (enemy.dead) {
        return;
      }


      const distance =
        enemy.x -
        unit.x;


      if (
        distance >= 0 &&
        distance < shortest
      ) {

        shortest =
          distance;

        target =
          enemy;

      }

    }
  );


  return target;

}


function isEnemyAoeAttack(enemy) {

  return Boolean(
    enemy &&
    enemy.attackKind === "aoe"
  );

}


function getAlliedUnitsInEnemyAttackRange(enemy) {

  const targets = [];


  if (!enemy) {

    return targets;

  }


  playerUnits.forEach((unit) => {

    if (
      !unit ||
      unit.dead
    ) {

      return;

    }


    const distance =
      enemy.x -
      unit.x;


    if (
      distance >= 0 &&
      distance <= enemy.range
    ) {

      targets.push(unit);

    }

  });


  return targets;

}


function findNearestPlayer(enemy) {

  let target = null;

  let shortest =
    Infinity;


  playerUnits.forEach(
    (unit) => {

      if (unit.dead) {
        return;
      }


      const distance =
        enemy.x -
        unit.x;


      if (
        distance >= 0 &&
        distance < shortest
      ) {

        shortest =
          distance;

        target =
          unit;

      }

    }
  );


  return target;

}


/* =========================
   ATTACK
========================= */

function tryAttack(
  attacker,
  target,
  playerAttack
) {

  if (
    isHealthKnockbackActive(
      attacker
    )
  ) {

    return;

  }


  if (
    !playerAttack &&
    isUnitStatusActive(
      attacker,
      UNIT_STATUS.TIME_STOP
    )
  ) {

    return;

  }


  if (
    playerAttack &&
    isAttackDashActive(attacker)
  ) {

    return;

  }


  if (
    playerAttack &&
    isDelayedMultiHitActive(attacker)
  ) {

    return;

  }


  if (
    playerAttack &&
    isPendingMeleeImpactActive(
      attacker
    )
  ) {

    return;

  }


  const now =
    Date.now();


  if (
    now <
    attacker.attackCooldown
  ) {

    return;

  }


  attacker.attackCooldown =
    now +
    getUnitAttackInterval(
      attacker
    );

  resetUnitSprintAcceleration(
    attacker
  );


  attacker.element
    .classList.add(
      "attacking"
    );


  setTimeout(
    () => {

      if (
        attacker.element &&
        attacker.element.isConnected
      ) {

        attacker.element
          .classList.remove(
            "attacking"
          );

      }

    },
    180
  );


  const behavior =
    playerAttack
      ? getAttackBehavior(attacker)
      : null;


  if (
    playerAttack &&
    behavior &&
    behavior.type ===
      ATTACK_TYPE.MELEE_AOE &&
    behavior.dashToTarget === true
  ) {

    beginMeleeAoeDash(
      attacker,
      behavior,
      target
    );

    return;

  }


  if (
    playerAttack &&
    behavior &&
    hasMeleeDashReturn(behavior)
  ) {

    beginMeleeDashReturn(
      attacker,
      behavior,
      target
    );

    return;

  }


  if (
    playerAttack &&
    behavior &&
    hasMeleeLunge(behavior)
  ) {

    beginMeleeLunge(
      attacker,
      behavior,
      target
    );

    return;

  }


  showUnitAttack(
    attacker
  );


  if (!playerAttack) {

    if (
      attacker.attackKind ===
      "projectile"
    ) {

      fireTrainingEnemyProjectile(
        attacker,
        target
      );

      return;

    }

    if (isEnemyAoeAttack(attacker)) {

      getAlliedUnitsInEnemyAttackRange(
        attacker
      ).forEach((unit) => {

        damageCharacter(
          unit,
          attacker.attack,
          false,
          attacker
        );

      });

      return;

    }


    damageCharacter(
      target,
      attacker.attack,
      false,
      attacker
    );

    return;

  }


  if (
    behavior.type ===
    ATTACK_TYPE.MELEE_AOE
  ) {

    applyMeleeAoeDamage(
      attacker,
      behavior,
      target
    );

    return;

  }


  if (
    behavior.type ===
    ATTACK_TYPE.FRONT_AOE
  ) {

    beginFrontAoeAttack(
      attacker,
      behavior
    );

    return;

  }


  if (
    behavior.type ===
    ATTACK_TYPE.DROP_AOE
  ) {

    beginDropAoeAttack(
      attacker,
      behavior,
      target
    );

    return;

  }


  if (
    behavior.type ===
    ATTACK_TYPE.DELAYED_MULTI_HIT_SINGLE
  ) {

    beginDelayedMultiHitSingle(
      attacker,
      behavior,
      target
    );

    return;

  }


  if (
    behavior.type ===
    ATTACK_TYPE.MELEE_SINGLE
  ) {

    beginMeleeSingleAttack(
      attacker,
      behavior,
      target
    );

    return;

  }


  if (
    isProjectileAttackType(
      behavior
    )
  ) {

    scheduleProjectile(
      attacker,
      behavior
    );

    return;

  }


  damageCharacter(
    target,
    getUnitAttackPower(attacker),
    true,
    attacker
  );

}


function isAttackDashActive(unit) {

  return !!(
    unit &&
    unit.attackDash &&
    unit.attackDash.active
  );

}


function isDelayedMultiHitActive(unit) {

  return !!(
    unit &&
    unit.delayedMultiHit &&
    unit.delayedMultiHit.active
  );

}


function clearDelayedMultiHit(unit) {

  if (
    !unit ||
    !unit.delayedMultiHit
  ) {

    return;

  }

  const state =
    unit.delayedMultiHit;

  state.active = false;

  state.token += 1;

  if (
    Array.isArray(
      state.timeoutIds
    )
  ) {

    state.timeoutIds.forEach(
      (timerId) => {

        window.clearTimeout(
          timerId
        );

      }
    );

    state.timeoutIds = [];

  }

  if (
    Array.isArray(
      state.effectElements
    )
  ) {

    state.effectElements.forEach(
      (element) => {

        if (
          element &&
          element.parentNode
        ) {

          element.remove();

        }

      }
    );

  }

  unit.delayedMultiHit = null;

}


function clearAllDelayedMultiHits() {

  playerUnits.forEach((unit) => {

    clearDelayedMultiHit(unit);

  });

  if (projectileLayer) {

    projectileLayer
      .querySelectorAll(
        ".battle-slash-effect"
      )
      .forEach((element) => {

        element.remove();

      });

  }

}


function spawnDelayedMultiHitSlash(
  behavior,
  pattern,
  impactX,
  lifetimeMs,
  state
) {

  if (
    !projectileLayer ||
    !behavior ||
    !behavior.effectImage ||
    !state
  ) {

    return;

  }

  const element =
    document.createElement("div");

  element.className =
    "battle-slash-effect";

  const image =
    document.createElement("img");

  image.src =
    behavior.effectImage;

  image.alt = "";

  const effectWidth =
    typeof behavior.effectWidth ===
      "number"
      ? behavior.effectWidth
      : 118;

  image.style.width =
    effectWidth + "px";

  element.appendChild(image);

  const offsetX =
    pattern &&
    typeof pattern.offsetX ===
      "number"
      ? pattern.offsetX
      : 0;

  const offsetY =
    pattern &&
    typeof pattern.offsetY ===
      "number"
      ? pattern.offsetY
      : 0;

  const rotation =
    pattern &&
    typeof pattern.rotation ===
      "number"
      ? pattern.rotation
      : 0;

  const scaleX =
    pattern &&
    typeof pattern.scaleX ===
      "number"
      ? pattern.scaleX
      : 1;

  const scaleY =
    pattern &&
    typeof pattern.scaleY ===
      "number"
      ? pattern.scaleY
      : 1;

  element.style.left =
    (impactX + offsetX) + "px";

  element.style.bottom =
    "calc(22% + " +
    offsetY +
    "px)";

  element.style.transform =
    "translate(-50%, 40%) rotate(" +
    rotation +
    "deg) scale(" +
    scaleX +
    ", " +
    scaleY +
    ")";

  projectileLayer.appendChild(
    element
  );

  state.effectElements.push(
    element
  );

  const removeId =
    window.setTimeout(
      () => {

        if (element.parentNode) {

          element.remove();

        }

      },
      lifetimeMs
    );

  if (
    !Array.isArray(
      state.timeoutIds
    )
  ) {

    state.timeoutIds = [];

  }

  state.timeoutIds.push(removeId);

}


function beginDelayedMultiHitSingle(
  attacker,
  behavior,
  target,
  options
) {

  if (
    !attacker ||
    attacker.dead ||
    !behavior
  ) {

    return;

  }

  clearDelayedMultiHit(attacker);

  const settings =
    options ||
    {};

  const hitCount =
    Number.isInteger(
      behavior.hitCount
    ) &&
    behavior.hitCount > 0
      ? behavior.hitCount
      : 10;

  const chargeMs =
    typeof behavior.chargeMs ===
      "number"
      ? behavior.chargeMs
      : 1200;

  const postAttackDelayMs =
    typeof behavior.postAttackDelayMs ===
      "number"
      ? behavior.postAttackDelayMs
      : 200;

  const hitIntervalMs =
    typeof behavior.hitIntervalMs ===
      "number"
      ? behavior.hitIntervalMs
      : 70;

  const effectLifetimeMs =
    typeof behavior.effectLifetimeMs ===
      "number"
      ? behavior.effectLifetimeMs
      : 480;

  const patterns =
    Array.isArray(
      behavior.effectPatterns
    ) &&
    behavior.effectPatterns.length > 0
      ? behavior.effectPatterns
      : [
        {
          rotation: 0,
          offsetX: 0,
          offsetY: 0,
          scaleX: 1,
          scaleY: 1
        }
      ];

  const towardEnemyBase =
    Boolean(
      settings.towardEnemyBase
    );

  const impactX =
    towardEnemyBase
      ? ENEMY_BASE_X
      : (
        target &&
        Number.isFinite(target.x)
          ? target.x
          : attacker.x +
            attacker.range
      );

  const lockedTarget =
    towardEnemyBase
      ? null
      : target;

  const state = {

    active: true,

    token: 1,

    pendingHits: [],

    finishAt: null,

    effectElements: [],

    timeoutIds: [],

    behavior: behavior,

    patterns: patterns,

    impactX: impactX,

    effectLifetimeMs:
      effectLifetimeMs,

    towardEnemyBase:
      towardEnemyBase,

    lockedTarget: lockedTarget,

    hitCount: hitCount

  };

  attacker.delayedMultiHit =
    state;

  for (
    let hitIndex = 0;
    hitIndex < hitCount;
    hitIndex += 1
  ) {

    state.pendingHits.push({

      hitIndex: hitIndex,

      fireAt:
        Date.now() +
        chargeMs +
        postAttackDelayMs +
        hitIndex *
        hitIntervalMs,

      done: false

    });

  }

}


function resolveDueDelayedMultiHits(
  unit,
  now
) {

  const state =
    unit &&
    unit.delayedMultiHit;

  if (
    !state ||
    !state.active ||
    !Array.isArray(
      state.pendingHits
    )
  ) {

    return;

  }

  if (
    unit.dead ||
    !battleRunning
  ) {

    clearDelayedMultiHit(unit);

    return;

  }

  if (!isBattleActive()) {

    return;

  }

  state.pendingHits.forEach(
    (hit) => {

      if (
        !hit ||
        hit.done ||
        typeof hit.fireAt !==
          "number" ||
        now < hit.fireAt
      ) {

        return;

      }

      hit.done = true;

      if (state.towardEnemyBase) {

        enemyBaseHp -=
          getUnitAttackPower(
            unit
          );

        if (enemyBaseHp < 0) {

          enemyBaseHp = 0;

        }

        updateBaseUI();

        if (enemyBaseHp <= 0) {

          tryResolveBattleVictory();

        }

      } else if (
        state.lockedTarget &&
        !state.lockedTarget.dead
      ) {

        damageCharacter(
          state.lockedTarget,
          getUnitAttackPower(
            unit
          ),
          true,
          unit
        );

      }

      const pattern =
        (
          state.patterns &&
          state.patterns.length > 0
        )
          ? state.patterns[
            hit.hitIndex %
            state.patterns.length
          ]
          : null;

      spawnDelayedMultiHitSlash(
        state.behavior,
        pattern,
        state.impactX,
        state.effectLifetimeMs,
        state
      );

      if (
        hit.hitIndex >=
        state.hitCount - 1
      ) {

        state.finishAt =
          now +
          state.effectLifetimeMs +
          40;

      }

    }
  );

  if (
    typeof state.finishAt ===
      "number" &&
    now >= state.finishAt
  ) {

    clearDelayedMultiHit(unit);

  }

}


function clearAttackDash(unit) {

  if (!unit) {

    return;

  }

  unit.attackDash = null;

}


function hasMeleeLunge(behavior) {

  return !!(
    behavior &&
    typeof behavior.lungeDistance ===
      "number" &&
    behavior.lungeDistance > 0
  );

}


function hasMeleeDashReturn(behavior) {

  return !!(
    behavior &&
    behavior.dashToTarget === true &&
    behavior.returnAfterDash === true &&
    (
      !behavior.type ||
      behavior.type ===
        ATTACK_TYPE.MELEE_SINGLE
    )
  );

}


function beginMeleeDashReturn(
  attacker,
  behavior,
  target,
  options
) {

  if (
    !attacker ||
    attacker.dead ||
    isAttackDashActive(attacker)
  ) {

    return;

  }

  const settings =
    options ||
    {};

  const towardEnemyBase =
    Boolean(
      settings.towardEnemyBase
    );

  const startX =
    attacker.x;

  const stopGap =
    typeof behavior.dashStopGap ===
      "number" &&
    behavior.dashStopGap >= 0
      ? behavior.dashStopGap
      : 10;

  const maxDashDistance =
    typeof behavior.dashDistance ===
      "number" &&
    behavior.dashDistance > 0
      ? behavior.dashDistance
      : 90;

  const durationMs =
    typeof behavior.dashDurationMs ===
      "number" &&
    behavior.dashDurationMs > 0
      ? behavior.dashDurationMs
      : 260;

  const returnDurationMs =
    typeof behavior.returnDurationMs ===
      "number" &&
    behavior.returnDurationMs > 0
      ? behavior.returnDurationMs
      : 250;

  let stopX =
    startX +
    maxDashDistance;

  if (towardEnemyBase) {

    stopX =
      Math.min(
        stopX,
        ENEMY_BASE_X -
        stopGap
      );

  } else if (
    target &&
    Number.isFinite(target.x)
  ) {

    // Approach from the left.
    // Do not pass the target center.
    stopX =
      Math.min(
        stopX,
        target.x -
        stopGap
      );

  }

  stopX =
    Math.max(
      startX,
      stopX
    );

  clearUnitSpriteTimer(attacker);

  setUnitSprite(
    attacker,
    "attack"
  );

  const finishOut = () => {

    attacker.x =
      stopX;

    resolveMeleeLungeImpact(
      attacker,
      behavior,
      towardEnemyBase
        ? null
        : target,
      towardEnemyBase
    );

    showUnitAttack(attacker);

    beginMeleeDashReturnHome(
      attacker,
      behavior,
      startX,
      returnDurationMs
    );

  };

  if (
    stopX - startX <=
    2
  ) {

    finishOut();

    return;

  }

  attacker.attackDash = {

    active: true,

    mode: "dashOut",

    startX: startX,

    stopX: stopX,

    returnToX: startX,

    startedAt: Date.now(),

    durationMs: durationMs,

    returnDurationMs:
      returnDurationMs,

    behavior: behavior,

    primaryTarget:
      towardEnemyBase
        ? null
        : (
          target ||
          null
        ),

    towardEnemyBase:
      towardEnemyBase

  };

}


function beginMeleeDashReturnHome(
  attacker,
  behavior,
  returnToX,
  returnDurationMs
) {

  if (
    !attacker ||
    attacker.dead
  ) {

    clearAttackDash(attacker);

    return;

  }

  const homeX =
    Number.isFinite(returnToX)
      ? returnToX
      : attacker.x;

  const duration =
    typeof returnDurationMs ===
      "number" &&
    returnDurationMs > 0
      ? returnDurationMs
      : 250;

  if (
    Math.abs(
      attacker.x -
      homeX
    ) <= 2
  ) {

    attacker.x =
      homeX;

    clearAttackDash(attacker);

    clearUnitSpriteTimer(attacker);

    setUnitSprite(
      attacker,
      "idle"
    );

    return;

  }

  attacker.attackDash = {

    active: true,

    mode: "dashReturn",

    startX: attacker.x,

    stopX: homeX,

    startedAt: Date.now(),

    durationMs: duration,

    behavior: behavior || null,

    primaryTarget: null,

    towardEnemyBase: false

  };

}


function beginMeleeLunge(
  attacker,
  behavior,
  target,
  options
) {

  if (
    !attacker ||
    attacker.dead ||
    isAttackDashActive(attacker)
  ) {

    return;

  }

  const settings =
    options ||
    {};

  const towardEnemyBase =
    Boolean(
      settings.towardEnemyBase
    );

  const startX =
    attacker.x;

  const lungeDistance =
    behavior.lungeDistance;

  const stopGap =
    typeof behavior.lungeStopGap ===
      "number" &&
    behavior.lungeStopGap >= 0
      ? behavior.lungeStopGap
      : 12;

  const durationMs =
    typeof behavior.lungeDurationMs ===
      "number" &&
    behavior.lungeDurationMs > 0
      ? behavior.lungeDurationMs
      : 240;

  let stopX =
    startX +
    lungeDistance;

  if (towardEnemyBase) {

    stopX =
      Math.min(
        stopX,
        ENEMY_BASE_X -
        stopGap
      );

  } else if (
    target &&
    Number.isFinite(target.x)
  ) {

    // Do not pass through the target.
    stopX =
      Math.min(
        stopX,
        target.x -
        stopGap
      );

  }

  stopX =
    Math.max(
      startX,
      stopX
    );

  clearUnitSpriteTimer(attacker);

  setUnitSprite(
    attacker,
    "attack"
  );

  if (
    stopX - startX <=
    2
  ) {

    attacker.x =
      stopX;

    resolveMeleeLungeImpact(
      attacker,
      behavior,
      towardEnemyBase
        ? null
        : target,
      towardEnemyBase
    );

    showUnitAttack(attacker);

    return;

  }

  attacker.attackDash = {

    active: true,

    mode: "lunge",

    startX: startX,

    stopX: stopX,

    startedAt: Date.now(),

    durationMs: durationMs,

    behavior: behavior,

    primaryTarget:
      towardEnemyBase
        ? null
        : (
          target ||
          null
        ),

    towardEnemyBase:
      towardEnemyBase

  };

}


function resolveMeleeLungeImpact(
  attacker,
  behavior,
  primaryTarget,
  towardEnemyBase
) {

  if (
    !attacker ||
    attacker.dead
  ) {

    return;

  }

  if (towardEnemyBase) {

    enemyBaseHp -=
      getUnitAttackPower(
        attacker
      );

    updateBaseUI();

    noteUnitAttackSuccess(
      attacker
    );

    if (enemyBaseHp <= 0) {

      tryResolveBattleVictory();

    }

    return;

  }

  if (
    !primaryTarget ||
    primaryTarget.dead
  ) {

    // Target died mid-lunge:
    // cancel damage, no retarget.
    return;

  }

  damageCharacter(
    primaryTarget,
    getUnitAttackPower(
      attacker
    ),
    true,
    attacker
  );

}


function beginMeleeAoeDash(
  attacker,
  behavior,
  target
) {

  if (
    !attacker ||
    attacker.dead ||
    isAttackDashActive(attacker)
  ) {

    return;

  }


  const startX =
    attacker.x;

  const targetX =
    target &&
    Number.isFinite(target.x)
      ? target.x
      : startX;


  const stopDistance =
    typeof behavior.stopDistance ===
      "number" &&
    behavior.stopDistance >= 0
      ? behavior.stopDistance
      : 35;


  /*
    Ally advances rightward.
    Stop slightly left of the enemy
    so the diver does not pass through.
  */

  const stopX =
    Math.max(
      startX,
      targetX -
      stopDistance
    );


  const distance =
    Math.max(
      0,
      stopX -
      startX
    );


  clearUnitSpriteTimer(attacker);

  setUnitSprite(
    attacker,
    "attack"
  );


  if (distance <= 8) {

    attacker.x =
      stopX;

    applyMeleeAoeDamage(
      attacker,
      behavior,
      target,
      targetX
    );

    showUnitAttack(attacker);

    return;

  }


  const dashSpeed =
    typeof behavior.dashSpeed ===
      "number" &&
    behavior.dashSpeed > 0
      ? behavior.dashSpeed
      : 0.55;


  const durationMs =
    Math.min(
      350,
      Math.max(
        200,
        distance /
        dashSpeed
      )
    );


  attacker.attackDash = {

    active: true,

    mode: "aoeDash",

    startX: startX,

    stopX: stopX,

    aoeImpactX: targetX,

    startedAt: Date.now(),

    durationMs: durationMs,

    behavior: behavior,

    primaryTarget: target || null,

    towardEnemyBase: false

  };

}


function updateAttackDashMotion(unit) {

  const dash =
    unit &&
    unit.attackDash;


  if (
    !dash ||
    !dash.active
  ) {

    return false;

  }


  if (unit.dead) {

    clearAttackDash(unit);

    return false;

  }


  const elapsed =
    Date.now() -
    dash.startedAt;

  const t =
    Math.min(
      1,
      elapsed /
      dash.durationMs
    );


  unit.x =
    dash.startX +
    (
      dash.stopX -
      dash.startX
    ) *
    t;


  if (t >= 1) {

    finishAttackDash(unit);

  }


  return true;

}


function finishAttackDash(unit) {

  const dash =
    unit &&
    unit.attackDash;


  if (!dash) {

    return;

  }


  dash.active = false;


  if (unit.dead) {

    clearAttackDash(unit);

    return;

  }


  unit.x =
    dash.stopX;


  if (
    dash.mode === "dashReturn"
  ) {

    clearAttackDash(unit);

    clearUnitSpriteTimer(unit);

    setUnitSprite(
      unit,
      "idle"
    );

    return;

  }


  if (
    dash.mode === "dashOut" ||
    hasMeleeDashReturn(dash.behavior)
  ) {

    resolveMeleeLungeImpact(
      unit,
      dash.behavior,
      dash.primaryTarget,
      Boolean(
        dash.towardEnemyBase
      )
    );

    showUnitAttack(unit);

    beginMeleeDashReturnHome(
      unit,
      dash.behavior,
      dash.returnToX,
      dash.returnDurationMs
    );

    return;

  }


  if (
    dash.mode === "lunge" ||
    hasMeleeLunge(dash.behavior)
  ) {

    resolveMeleeLungeImpact(
      unit,
      dash.behavior,
      dash.primaryTarget,
      Boolean(
        dash.towardEnemyBase
      )
    );

  } else {

    applyMeleeAoeDamage(
      unit,
      dash.behavior,
      dash.primaryTarget,
      dash.aoeImpactX
    );

  }


  clearAttackDash(unit);

  clearUnitSpriteTimer(unit);

  setUnitSprite(
    unit,
    "attack"
  );

  unit.spriteTimer =
    setTimeout(
      () => {

        unit.spriteTimer =
          null;

        if (!unit.dead) {

          setUnitSprite(
            unit,
            "idle"
          );

        }

      },
      (
        unit.battle &&
        unit.battle.attackSpriteMs
      ) ||
      180
    );

}


function applyMeleeAoeDamage(
  attacker,
  behavior,
  primaryTarget,
  impactXOverride
) {

  const aoeRadius =
    typeof behavior.aoeRadius ===
      "number"
      ? behavior.aoeRadius
      : null;


  if (aoeRadius != null) {

    let impactX = null;

    if (
      Number.isFinite(
        impactXOverride
      )
    ) {

      impactX =
        impactXOverride;

    } else if (
      primaryTarget &&
      !primaryTarget.dead &&
      Number.isFinite(
        primaryTarget.x
      )
    ) {

      impactX =
        primaryTarget.x;

    }


    if (impactX != null) {

      enemyUnits.forEach((enemy) => {

        if (enemy.dead) {

          return;

        }

        if (
          Math.abs(
            enemy.x -
            impactX
          ) <=
          aoeRadius
        ) {

          damageCharacter(
            enemy,
            getUnitAttackPower(
              attacker
            ),
            true,
            attacker
          );

        }

      });

      return;

    }

  }


  const hitRange =
    typeof behavior.hitRadius ===
      "number"
      ? behavior.hitRadius
      : attacker.range;

  enemyUnits.forEach((enemy) => {

    if (enemy.dead) {

      return;

    }

    const distance =
      enemy.x -
      attacker.x;

    if (
      distance >= 0 &&
      distance <= hitRange
    ) {

      damageCharacter(
        enemy,
        getUnitAttackPower(
          attacker
        ),
        true,
        attacker
      );

    }

  });

}


function scheduleProjectile(
  attacker,
  behavior,
  options
) {

  const settings =
    options ||
    {};

  const cyclingStage =
    behavior &&
    behavior.type ===
      ATTACK_TYPE.CYCLING_PROJECTILE
      ? getCyclingProjectileStage(
          attacker,
          behavior
        )
      : null;

  pendingProjectiles.push({

    unit: attacker,

    behavior: behavior,

    cyclingStage: cyclingStage,

    launchAt:
      Date.now() +
      (
        typeof behavior.launchDelayMs ===
          "number"
          ? behavior.launchDelayMs
          : 90
      ),

    originX: attacker.x,

    range: attacker.range,

    towardEnemyBase:
      Boolean(
        settings.towardEnemyBase
      )

  });

}


function resolveProjectileShotConfig(
  behavior,
  cyclingStage
) {

  const stage =
    cyclingStage ||
    null;

  const effectImage =
    (
      stage &&
      stage.effectImage
    ) ||
    (
      behavior &&
      behavior.effectImage
    ) ||
    null;

  const effectWidth =
    typeof (
      stage &&
      stage.effectWidth
    ) === "number"
      ? stage.effectWidth
      : (
        typeof (
          behavior &&
          behavior.effectWidth
        ) === "number"
          ? behavior.effectWidth
          : 80
      );

  const projectileSpeed =
    typeof (
      stage &&
      stage.projectileSpeed
    ) === "number"
      ? stage.projectileSpeed
      : (
        typeof (
          behavior &&
          behavior.projectileSpeed
        ) === "number"
          ? behavior.projectileSpeed
          : 180
      );

  const hitRadius =
    typeof (
      stage &&
      stage.hitRadius
    ) === "number"
      ? stage.hitRadius
      : (
        typeof (
          behavior &&
          behavior.hitRadius
        ) === "number"
          ? behavior.hitRadius
          : 24
      );

  const aoeRadius =
    typeof (
      stage &&
      stage.aoeRadius
    ) === "number"
      ? stage.aoeRadius
      : (
        typeof (
          behavior &&
          behavior.aoeRadius
        ) === "number"
          ? behavior.aoeRadius
          : 0
      );

  const launchOffsetX =
    typeof (
      stage &&
      stage.launchOffsetX
    ) === "number"
      ? stage.launchOffsetX
      : (
        typeof (
          behavior &&
          behavior.launchOffsetX
        ) === "number"
          ? behavior.launchOffsetX
          : 32
      );

  const damageMultiplier =
    typeof (
      stage &&
      stage.damageMultiplier
    ) === "number" &&
    stage.damageMultiplier > 0
      ? stage.damageMultiplier
      : 1;

  const pierceTargetCount =
    Number.isInteger(
      stage &&
      stage.pierceTargetCount
    ) &&
    stage.pierceTargetCount > 0
      ? stage.pierceTargetCount
      : (
        Number.isInteger(
          behavior &&
          behavior.pierceTargetCount
        ) &&
        behavior.pierceTargetCount > 0
          ? behavior.pierceTargetCount
          : 1
      );

  const selfRecoilDistance =
    typeof (
      stage &&
      stage.selfRecoilDistance
    ) === "number"
      ? stage.selfRecoilDistance
      : 0;

  const selfRecoilDurationMs =
    typeof (
      stage &&
      stage.selfRecoilDurationMs
    ) === "number"
      ? stage.selfRecoilDurationMs
      : 200;

  const onHitStatus =
    (
      stage &&
      stage.onHitStatus
    ) ||
    (
      behavior &&
      behavior.onHitStatus
    ) ||
    null;

  return {

    effectImage: effectImage,

    effectWidth: effectWidth,

    projectileSpeed: projectileSpeed,

    hitRadius: hitRadius,

    aoeRadius: aoeRadius,

    launchOffsetX: launchOffsetX,

    damageMultiplier:
      damageMultiplier,

    pierceTargetCount:
      pierceTargetCount,

    selfRecoilDistance:
      selfRecoilDistance,

    selfRecoilDurationMs:
      selfRecoilDurationMs,

    onHitStatus: onHitStatus

  };

}


function spawnProjectile(
  attacker,
  behavior,
  originX,
  range,
  towardEnemyBase,
  cyclingStage
) {

  if (
    !projectileLayer ||
    !behavior
  ) {

    return;

  }

  const shot =
    resolveProjectileShotConfig(
      behavior,
      cyclingStage
    );

  if (!shot.effectImage) {

    return;

  }

  const startX =
    originX +
    shot.launchOffsetX;

  const maxX =
    towardEnemyBase
      ? ENEMY_BASE_X
      : originX +
        range;

  const attackPower =
    getUnitAttackPower(
      attacker
    );

  const resolvedAttack =
    roundCharacterStat(
      attackPower *
      shot.damageMultiplier
    );

  const element =
    document.createElement("div");

  element.className =
    "battle-projectile";

  if (
    behavior.type ===
    ATTACK_TYPE.CYCLING_PROJECTILE
  ) {

    element.classList.add(
      "battle-projectile-cycling"
    );

  }

  const image =
    document.createElement("img");

  image.src =
    shot.effectImage;

  image.alt = "";

  image.style.width =
    shot.effectWidth + "px";

  // Effects already face RIGHT.
  // No rotate/flip.

  element.appendChild(image);

  element.style.left =
    startX + "px";

  projectileLayer.appendChild(
    element
  );

  projectiles.push({

    element: element,

    x: startX,

    maxX: maxX,

    speed: shot.projectileSpeed,

    hitRadius: shot.hitRadius,

    aoeRadius: shot.aoeRadius,

    attack: attackPower,

    attackPower: attackPower,

    damageMultiplier:
      shot.damageMultiplier,

    resolvedAttack: resolvedAttack,

    pierceTargetCount:
      shot.pierceTargetCount,

    hitEnemies: new Set(),

    type: behavior.type,

    hitsEnemyBase:
      Boolean(towardEnemyBase),

    baseDamaged: false,

    source: attacker,

    onHitStatus:
      shot.onHitStatus
        ? {

          id: shot.onHitStatus.id,

          chance:
            shot.onHitStatus.chance,

          durationMs:
            shot.onHitStatus.durationMs

        }
        : null

  });

  if (
    behavior.type ===
    ATTACK_TYPE.CYCLING_PROJECTILE
  ) {

    // Stage advances on fire, not hit.
    advanceUnitAttackStage(
      attacker,
      behavior
    );

    if (
      shot.selfRecoilDistance > 0
    ) {

      applyAttackSelfRecoil(
        attacker,
        shot.selfRecoilDistance,
        shot.selfRecoilDurationMs
      );

    }

  }

}


function removeProjectile(projectile) {

  if (
    projectile &&
    projectile.element &&
    projectile.element.parentNode
  ) {

    projectile.element.remove();

  }

}


function clearProjectiles() {

  projectiles.forEach(
    removeProjectile
  );

  projectiles = [];

  pendingProjectiles = [];

  lastProjectileUpdateAt = 0;

  if (projectileLayer) {

    projectileLayer.innerHTML = "";

  }

  clearAttackKnockbackEffects();

  clearDropAoeEffects();

  clearGoodsScatterParticles();

}


function findFirstProjectileHit(
  projectile,
  previousX
) {

  let hit = null;

  let hitX = Infinity;

  const minX =
    Math.min(
      previousX,
      projectile.x
    ) -
    projectile.hitRadius;

  const maxX =
    Math.max(
      previousX,
      projectile.x
    ) +
    projectile.hitRadius;

  const hitEnemies =
    projectile.hitEnemies instanceof
      Set
      ? projectile.hitEnemies
      : null;

  enemyUnits.forEach((enemy) => {

    if (enemy.dead) {

      return;

    }

    if (
      hitEnemies &&
      hitEnemies.has(enemy)
    ) {

      return;

    }

    if (
      enemy.x >= minX &&
      enemy.x <= maxX &&
      enemy.x < hitX
    ) {

      hit = enemy;

      hitX = enemy.x;

    }

  });

  return hit;

}


function getProjectileAttackPower(
  projectile
) {

  if (
    projectile &&
    Number.isFinite(
      projectile.resolvedAttack
    )
  ) {

    return projectile.resolvedAttack;

  }

  if (
    projectile &&
    projectile.source
  ) {

    const base =
      getUnitAttackPower(
        projectile.source
      );

    const multiplier =
      typeof projectile.damageMultiplier ===
        "number" &&
      projectile.damageMultiplier > 0
        ? projectile.damageMultiplier
        : 1;

    return roundCharacterStat(
      base * multiplier
    );

  }

  return Number(
    projectile &&
    projectile.attack
  ) || 0;

}


function applyProjectileImpact(
  projectile,
  impactX,
  hitEnemy
) {

  if (
    projectile.type ===
      ATTACK_TYPE.PROJECTILE_SINGLE ||
    projectile.type ===
      ATTACK_TYPE.PIERCING_PROJECTILE ||
    projectile.type ===
      ATTACK_TYPE.CYCLING_PROJECTILE
  ) {

    if (hitEnemy) {

      damageCharacter(
        hitEnemy,
        getProjectileAttackPower(
          projectile
        ),
        true,
        projectile.source
      );

      if (!hitEnemy.dead) {

        tryApplyOnHitStatus(
          projectile,
          hitEnemy
        );

      }

    }

    return;

  }


  enemyUnits.forEach((enemy) => {

    if (enemy.dead) {

      return;

    }

    if (
      Math.abs(
        enemy.x -
        impactX
      ) <=
      projectile.aoeRadius
    ) {

      damageCharacter(
        enemy,
        getProjectileAttackPower(
          projectile
        ),
        true,
        projectile.source
      );

    }

  });

}


function fireTrainingEnemyProjectile(
  attacker,
  target
) {

  if (
    !attacker ||
    !projectileLayer ||
    attacker.dead
  ) {

    return;

  }

  const startX =
    Number.isFinite(attacker.x)
      ? attacker.x
      : getEnemySpawnX();

  const aimX =
    target &&
    Number.isFinite(target.x)
      ? target.x
      : PLAYER_BASE_X;

  const element =
    document.createElement("div");

  element.className =
    "battle-projectile battle-training-enemy-projectile";

  element.style.left =
    startX + "px";

  projectileLayer.appendChild(
    element
  );

  const attackPower =
    Number(attacker.attack) || 0;

  projectiles.push({

    element: element,

    x: startX,

    minX: Math.min(
      aimX - 40,
      PLAYER_BASE_X - 40
    ),

    speed: 180,

    hitRadius: 28,

    aoeRadius: 0,

    attack: attackPower,

    attackPower: attackPower,

    resolvedAttack: attackPower,

    pierceTargetCount: 1,

    hitEnemies: new Set(),

    type: "trainingEnemyProjectile",

    hostile: true,

    hitsPlayerBase: !target,

    baseDamaged: false,

    source: attacker,

    onHitStatus: null

  });

}


function findFirstHostileProjectileHit(
  projectile,
  previousX
) {

  let hit = null;

  let hitX = -Infinity;

  const minX =
    Math.min(
      previousX,
      projectile.x
    ) -
    projectile.hitRadius;

  const maxX =
    Math.max(
      previousX,
      projectile.x
    ) +
    projectile.hitRadius;

  const hitAllies =
    projectile.hitEnemies instanceof
      Set
      ? projectile.hitEnemies
      : null;

  playerUnits.forEach((unit) => {

    if (
      !unit ||
      unit.dead
    ) {

      return;

    }

    if (
      hitAllies &&
      hitAllies.has(unit)
    ) {

      return;

    }

    if (
      unit.x >= minX &&
      unit.x <= maxX &&
      unit.x > hitX
    ) {

      hit = unit;

      hitX = unit.x;

    }

  });

  return hit;

}


function applyHostileProjectileImpact(
  projectile,
  target
) {

  if (
    !projectile ||
    !target
  ) {

    return;

  }

  damageCharacter(
    target,
    getProjectileAttackPower(
      projectile
    ),
    false,
    projectile.source
  );

}


function applyHostileProjectilePlayerBaseDamage(
  projectile
) {

  if (
    !projectile ||
    projectile.baseDamaged
  ) {

    return;

  }

  projectile.baseDamaged = true;

  playerBaseHp -=
    getProjectileAttackPower(
      projectile
    );

  updateBaseUI();

  if (playerBaseHp <= 0) {

    loseBattle();

  }

}


function applyProjectileEnemyBaseDamage(
  projectile
) {

  if (
    !projectile ||
    projectile.baseDamaged
  ) {

    return;

  }

  projectile.baseDamaged = true;

  enemyBaseHp -=
    getProjectileAttackPower(
      projectile
    );

  updateBaseUI();

  if (enemyBaseHp <= 0) {

    tryResolveBattleVictory();

  }

}


function updateProjectiles() {

  const now =
    Date.now();

  const waiting = [];

  pendingProjectiles.forEach(
    (pending) => {

      if (
        !pending.unit ||
        pending.unit.dead
      ) {

        return;

      }

      if (now < pending.launchAt) {

        waiting.push(pending);

        return;

      }

      spawnProjectile(
        pending.unit,
        pending.behavior,
        pending.originX,
        pending.range,
        pending.towardEnemyBase,
        pending.cyclingStage ||
          null
      );

    }
  );

  pendingProjectiles = waiting;


  if (!lastProjectileUpdateAt) {

    lastProjectileUpdateAt = now;

  }

  const elapsed =
    Math.min(
      now - lastProjectileUpdateAt,
      50
    );

  lastProjectileUpdateAt = now;

  const remaining = [];

  projectiles.forEach((projectile) => {

    const previousX =
      projectile.x;

    if (projectile.hostile) {

      projectile.x -=
        projectile.speed *
        (elapsed / 1000);

      projectile.element.style.left =
        projectile.x + "px";

      const allyHit =
        findFirstHostileProjectileHit(
          projectile,
          previousX
        );

      if (allyHit) {

        applyHostileProjectileImpact(
          projectile,
          allyHit
        );

        removeProjectile(projectile);

        return;

      }

      if (
        projectile.hitsPlayerBase &&
        previousX > PLAYER_BASE_X &&
        projectile.x <= PLAYER_BASE_X
      ) {

        applyHostileProjectilePlayerBaseDamage(
          projectile
        );

        removeProjectile(projectile);

        return;

      }

      if (
        projectile.x <=
        (
          Number.isFinite(
            projectile.minX
          )
            ? projectile.minX
            : PLAYER_BASE_X - 80
        )
      ) {

        removeProjectile(projectile);

        return;

      }

      remaining.push(projectile);

      return;

    }

    projectile.x +=
      projectile.speed *
      (elapsed / 1000);

    projectile.element.style.left =
      projectile.x + "px";

    const hit =
      findFirstProjectileHit(
        projectile,
        previousX
      );

    if (hit) {

      applyProjectileImpact(
        projectile,
        projectile.x,
        hit
      );

      if (
        !(
          projectile.hitEnemies instanceof
            Set
        )
      ) {

        projectile.hitEnemies =
          new Set();

      }

      projectile.hitEnemies.add(
        hit
      );

      const pierceLimit =
        Number.isInteger(
          projectile.pierceTargetCount
        ) &&
        projectile.pierceTargetCount > 0
          ? projectile.pierceTargetCount
          : 1;

      if (
        projectile.hitEnemies.size <
        pierceLimit
      ) {

        remaining.push(projectile);

        return;

      }

      removeProjectile(projectile);

      return;

    }

    if (
      projectile.hitsEnemyBase &&
      previousX < ENEMY_BASE_X &&
      projectile.x >= ENEMY_BASE_X
    ) {

      applyProjectileEnemyBaseDamage(
        projectile
      );

      removeProjectile(projectile);

      return;

    }

    if (projectile.x >= projectile.maxX) {

      removeProjectile(projectile);

      return;

    }

    remaining.push(projectile);

  });

  projectiles = remaining;

}


/* =========================
   BASE ATTACK
========================= */

function attackEnemyBase(unit) {

  if (
    isHealthKnockbackActive(unit)
  ) {

    return;

  }


  const now =
    Date.now();


  if (
    now <
    unit.attackCooldown
  ) {

    return;

  }


  unit.attackCooldown =
    now +
    getUnitAttackInterval(
      unit
    );


  unit.element
    .classList.add(
      "attacking"
    );


  setTimeout(
    () => {

      unit.element
        .classList.remove(
          "attacking"
        );

    },
    180
  );


  showUnitAttack(
    unit
  );


  const behavior =
    getAttackBehavior(unit);


  if (
    isProjectileAttackType(
      behavior
    )
  ) {

    scheduleProjectile(
      unit,
      behavior,
      {
        towardEnemyBase: true
      }
    );

    return;

  }


  if (
    behavior.type ===
    ATTACK_TYPE.DELAYED_MULTI_HIT_SINGLE
  ) {

    beginDelayedMultiHitSingle(
      unit,
      behavior,
      null,
      {
        towardEnemyBase: true
      }
    );

    return;

  }


  if (
    behavior.type ===
    ATTACK_TYPE.MELEE_SINGLE &&
    getMeleeImpactDelayMs(
      behavior
    ) > 0
  ) {

    beginMeleeSingleAttack(
      unit,
      behavior,
      null,
      {
        towardEnemyBase: true
      }
    );

    return;

  }


  if (
    behavior.type ===
    ATTACK_TYPE.FRONT_AOE
  ) {

    beginFrontAoeAttack(
      unit,
      behavior,
      {
        towardEnemyBase: true
      }
    );

    return;

  }


  if (
    behavior.type ===
    ATTACK_TYPE.DROP_AOE
  ) {

    beginDropAoeAttack(
      unit,
      behavior,
      null,
      {
        towardEnemyBase: true
      }
    );

    return;

  }


  if (
    hasMeleeDashReturn(behavior)
  ) {

    beginMeleeDashReturn(
      unit,
      behavior,
      null,
      {
        towardEnemyBase: true
      }
    );

    return;

  }


  if (
    hasMeleeLunge(behavior)
  ) {

    beginMeleeLunge(
      unit,
      behavior,
      null,
      {
        towardEnemyBase: true
      }
    );

    return;

  }


  enemyBaseHp -=
    unit.attack;


  updateBaseUI();


  if (
    enemyBaseHp <= 0
  ) {

    tryResolveBattleVictory();

  }

}


function attackPlayerBase(enemy) {

  if (
    isHealthKnockbackActive(enemy)
  ) {

    return;

  }


  if (
    isUnitStatusActive(
      enemy,
      UNIT_STATUS.TIME_STOP
    )
  ) {

    return;

  }


  const now =
    Date.now();


  if (
    now <
    enemy.attackCooldown
  ) {

    return;

  }


  enemy.attackCooldown =
    now +
    getUnitAttackInterval(
      enemy
    );


  if (
    enemy.attackKind ===
    "projectile"
  ) {

    fireTrainingEnemyProjectile(
      enemy,
      null
    );

    return;

  }


  enemy.element
    .classList.add(
      "attacking"
    );


  setTimeout(
    () => {

      enemy.element
        .classList.remove(
          "attacking"
        );

    },
    180
  );


  playerBaseHp -=
    enemy.attack;


  updateBaseUI();


  if (
    playerBaseHp <= 0
  ) {

    loseBattle();

  }

}


/* =========================
   CHARACTER DAMAGE
========================= */

function damageCharacter(
  target,
  damage,
  playerAttack,
  source
) {

  if (target.dead) {
    return;
  }


  const previousHpRatio =
    Number(target.maxHp) > 0
      ? target.hp /
        target.maxHp
      : 0;


  target.hp -= damage;


  if (target.hp < 0) {
    target.hp = 0;
  }


  const hpPercent =
    (
      target.hp /
      target.maxHp
    ) * 100;


  target.hpBar.style.width =
    hpPercent + "%";


  if (
    isTrainingBattle() &&
    damage > 0
  ) {

    if (
      (
        playerAttack &&
        !isAllyUnit(target)
      ) ||
      (
        !playerAttack &&
        isAllyUnit(target)
      )
    ) {

      spawnDamageNumber(
        target,
        damage
      );

    }

  }


  if (isAllyUnit(target)) {

    refreshUnitConditionalBuffs(
      target
    );

  }


  target.element
    .classList.add(
      "damaged"
    );


  setTimeout(
    () => {

      target.element
        .classList.remove(
          "damaged"
        );

    },
    150
  );


  if (
    target.hp <= 0
  ) {

    clearHealthKnockback(
      target
    );

    defeatCharacter(
      target,
      playerAttack
    );

    return;

  }


  applyHealthKnockbackAfterDamage(
    target,
    previousHpRatio
  );

  tryApplyAttackKnockback(
    source,
    target
  );

  if (
    isAllyUnit(target) &&
    getGoodsScatterTrait(target)
  ) {

    if (
      !isHealthKnockbackActive(
        target
      )
    ) {

      showUnitKnockbackHurt(
        target
      );

    }

    spawnGoodsScatterParticles(
      target
    );

  }

}


/* =========================
   DEFEAT CHARACTER
========================= */

function defeatCharacter(
  target,
  playerAttack
) {

  target.dead = true;

  resetUnitSprintAcceleration(
    target
  );

  clearAttackDash(
    target
  );

  clearDelayedMultiHit(
    target
  );

  clearPendingFrontAoe(
    target
  );

  clearPendingMeleeImpact(
    target
  );

  clearAllStatusEffects(
    target
  );

  clearAllUnitBuffs(
    target
  );

  clearHealthKnockback(
    target
  );

  clearUnitSpriteTimer(
    target
  );

  setUnitSprite(
    target,
    "hurt"
  );


  if (!isAllyUnit(target)) {

    target.element
      .classList.add(
        "defeated"
      );

  }


  if (
    playerAttack &&
    target.yaniReward &&
    !isTrainingBattle()
  ) {

    yani +=
      target.yaniReward;

/*
  敵撃破で
  モッシュゲージ上昇
*/

moshGauge += 8;

if (
  moshGauge >
  moshMax
) {

  moshGauge =
    moshMax;

}

updateMoshUI();


    if (
      yani >
      yaniMax
    ) {

      yani =
        yaniMax;

    }


    updateBattleUI();

  }


  if (isAllyUnit(target)) {

    playAllyDeathKnockback(
      target
    );

    return;

  }


  if (
    getActiveBattleWinCondition() ===
      "finalBossAndBaseDestroy" &&
    target.role === "finalBoss"
  ) {

    finalBossDefeated = true;

    finalBossDefeatedUnit = target;

    tryResolveBattleVictory();

  }


  setTimeout(
    () => {

      target.element.remove();

    },
    450
  );

}


/* =========================
   END BATTLE
========================= */

function clearUnitCombatState(unit) {

  if (!unit) {

    return;

  }

  clearAttackDash(unit);

  clearDelayedMultiHit(unit);

  clearPendingFrontAoe(unit);

  clearPendingMeleeImpact(unit);

  clearAllStatusEffects(unit);

  clearAllUnitBuffs(unit);

  clearHealthKnockback(unit);

  resetUnitSprintAcceleration(unit);

  clearUnitSpriteTimer(unit);

  clearUnitBpmOver(unit);

  unit.currentAttackStage = 0;

  unit.triggeredHealthKnockbacks =
    new Set();

}


function clearAllUnitCombatStates() {

  playerUnits.forEach(
    clearUnitCombatState
  );

  enemyUnits.forEach(
    clearUnitCombatState
  );

}


function stopBattle() {

  clearActiveMedalSnapshot();

  battleRunning = false;

  isBattlePaused = false;

  battlePausedAt = 0;

  hideBattlePauseMenu();

  deployCooldownUntil = {};

  deployCooldownDurationMs = {};

  clearInterval(yaniTimer);
  clearInterval(battleTimer);
  clearEnemySpawnTimers();
  clearInterval(moshTimer);

  clearAllUnitCombatStates();

  clearProjectiles();

  clearAllDelayedMultiHits();

  clearAllBattleStatusEffects();

  clearDamageNumbers();

  clearGoodsScatterParticles();

  if (isTrainingBattle()) {

    currentBattleMode =
      BATTLE_MODE.NORMAL;

    syncBattleModeUi();

  }


  /* 戦闘BGM停止 */

  battleBgm.pause();
  battleBgm.currentTime = 0;


  /* メニューBGMに戻す */

  menuBgm.currentTime = 0;

  menuBgm
    .play()
    .catch(
      (error) => {
        console.log(
          "メニューBGM再生エラー:",
          error
        );
      }
    );

}
/* =========================
   WIN
========================= */

function unlockStoryCharactersForStage(
  stageId
) {

  const id =
    Number(stageId);


  if (!Number.isInteger(id)) {

    return;

  }


  Object.values(CHARACTERS).forEach(
    (character) => {

      if (
        !character ||
        !character.id ||
        !character.unlock ||
        character.unlock.type !==
          "story" ||
        character.unlock.stage !== id
      ) {

        return;

      }


      unlockCharacter(character.id);

    }
  );

}


function getActiveBattleWinCondition() {

  const stage =
    activeBattleStage;

  if (
    !stage ||
    stage.winCondition == null
  ) {

    return "baseDestroy";

  }

  return stage.winCondition;

}


function isEnemyBaseDestroyed() {

  return enemyBaseHp <= 0;

}


function isBattleVictoryConditionMet() {

  const condition =
    getActiveBattleWinCondition();

  if (condition === "baseDestroy") {

    return isEnemyBaseDestroyed();

  }

  if (
    condition ===
    "finalBossAndBaseDestroy"
  ) {

    return (
      isEnemyBaseDestroyed() &&
      finalBossDefeated === true
    );

  }

  return false;

}


function tryResolveBattleVictory() {

  if (!battleRunning) {

    return false;

  }

  if (isTrainingBattle()) {

    return false;

  }

  if (!isBattleVictoryConditionMet()) {

    return false;

  }

  winBattle();

  return true;

}


function winBattle() {

  if (!battleRunning) {
    return;
  }

  if (isTrainingBattle()) {

    return;
  }


  const clearedStage =
    activeBattleStage;


  stopBattle();


  if (
    clearedStage &&
    Number.isInteger(clearedStage.id)
  ) {

    const clearResult =
      markStageCleared(
        clearedStage.id
      );


    if (clearResult.isFirstClear) {

      unlockStoryCharactersForStage(
        clearedStage.id
      );

    }


    rollMedalOnClear(
      clearedStage
    );


    if (
      clearResult.isFirstClear &&
      isStagePlayable(
        clearedStage.id + 1
      )
    ) {

      setCurrentStageId(
        clearedStage.id + 1
      );

    } else if (
      isStagePlayable(clearedStage.id)
    ) {

      setCurrentStageId(
        clearedStage.id
      );

    }


    updateHomeLocation();

    renderStageSelect();

  }


  setTimeout(
    () => {

      alert(
        clearedStage
          ? formatStageClearAlert(
              clearedStage
            )
          : "突破！"
      );


      showScreen(
        timelineScreen
      );

    },
    300
  );

}


/* =========================
   LOSE
========================= */

function loseBattle() {

  if (!battleRunning) {
    return;
  }

  if (isTrainingBattle()) {

    return;
  }


  stopBattle();


  setTimeout(
    () => {

      alert(
        "廃車\n\n機材車が破壊された……"
      );


      showScreen(
        timelineScreen
      );

    },
    300
  );

}


/* =========================
   STAGE START
========================= */

stageStartButton.addEventListener(
  "click",
  () => {

    if (
      !isStagePlayable(currentStageId)
    ) {

      return;

    }


    startBattle();

  }
);


/* =========================
   QUIT
========================= */

battleQuit.addEventListener(
  "click",
  () => {

    stopBattle();


    showScreen(
      timelineScreen
    );

  }
);


if (battlePauseButton) {

  battlePauseButton.addEventListener(
    "click",
    () => {

      pauseBattle();

    }
  );

}


if (battlePauseResume) {

  battlePauseResume.addEventListener(
    "click",
    () => {

      resumeBattle();

    }
  );

}


const battleTrainingReset =
  document.getElementById(
    "battle-training-reset"
  );

const battleTrainingExit =
  document.getElementById(
    "battle-training-exit"
  );


if (battleTrainingReset) {

  battleTrainingReset.addEventListener(
    "click",
    () => {

      resetTrainingBattle();

    }
  );

}


if (battleTrainingExit) {

  battleTrainingExit.addEventListener(
    "click",
    () => {

      exitTrainingBattle();

    }
  );

}


const battleTrainingEnemyCards =
  document.getElementById(
    "battle-training-enemy-cards"
  );


if (battleTrainingEnemyCards) {

  battleTrainingEnemyCards.addEventListener(
    "click",
    (event) => {

      if (!isTrainingBattle()) {

        return;

      }

      const lvButton =
        event.target.closest(
          ".battle-training-enemy-lv-btn"
        );

      if (lvButton) {

        event.preventDefault();

        event.stopPropagation();

        const type =
          lvButton.dataset
            .trainingEnemyType;

        const delta =
          Number(
            lvButton.dataset
              .trainingEnemyDelta
          );

        adjustTrainingEnemyLevel(
          type,
          delta
        );

        return;

      }

      const spawnButton =
        event.target.closest(
          ".battle-training-enemy-card-spawn"
        );

      if (!spawnButton) {

        return;

      }

      event.preventDefault();

      spawnTrainingEnemyFromCard(
        spawnButton.dataset
          .trainingEnemy
      );

    }
  );

}


/* =========================
   STAGE SPAWNS
========================= */

function scheduleStageSpawns(stage) {

  if (
    !stage ||
    !Array.isArray(stage.spawns)
  ) {

    return;

  }


  stage.spawns.forEach(
    (spawn) => {

      scheduleEnemy(
        spawn.delay,
        spawn.type
      );

    }
  );

}


/* =========================
   ENEMY SCHEDULER
========================= */

function clearEnemySpawnTimers() {

  enemySpawnTimers.forEach(
    (timerId) => {

      clearTimeout(timerId);

    }
  );

  enemySpawnTimers = [];

  enemySpawnQueue = [];

}


function spawnScheduledEnemy(type) {

  spawnEnemyByType(type);

}


function scheduleEnemy(
  delay,
  type
) {

  enemySpawnQueue.push({

    at:
      Date.now() +
      delay,

    type: type

  });

}


function updateEnemySpawns() {

  if (!isBattleActive()) {

    return;

  }

  const now =
    Date.now();

  const remaining = [];

  enemySpawnQueue.forEach(
    (item) => {

      if (now >= item.at) {

        spawnScheduledEnemy(
          item.type
        );

        return;

      }

      remaining.push(item);

    }
  );

  enemySpawnQueue = remaining;

}
/* =========================
   BOSS MESSAGE
========================= */

function showBossMessage(
  title,
  text
) {

  const message =
    document.createElement("div");


  message.className =
    "boss-message";


  message.innerHTML = `

    <small>
      WARNING
    </small>

    <strong>
      ${title}
    </strong>

    <span>
      ${text}
    </span>

  `;


  battleScreen.appendChild(
    message
  );


  setTimeout(
    () => {

      message.classList.add(
        "boss-message-show"
      );

    },
    50
  );


  setTimeout(
    () => {

      message.classList.remove(
        "boss-message-show"
      );


      setTimeout(
        () => {

          message.remove();

        },
        400
      );

    },
    2200
  );

}

/* =========================
   MOSH UI
========================= */

function updateMoshUI() {

  const percent =
    Math.floor(
      moshGauge
    );


  const gaugeText =
    moshButton.querySelector(
      "small"
    );


  gaugeText.textContent =
    percent + "%";


  if (
    moshGauge >=
    moshMax
  ) {

    moshButton.disabled =
      false;

    moshButton.classList.add(
      "mosh-ready"
    );

  } else {

    moshButton.disabled =
      true;

    moshButton.classList.remove(
      "mosh-ready"
    );

  }

}
/* =========================
   MOSH ACTIVATE
========================= */

moshButton.addEventListener(
  "click",
  () => {

    if (!isBattleActive()) {
      return;
    }

    if (moshGauge < 100) {
      return;
    }

    if (moshActive) {
      return;
    }


    activateMosh();

  }
);


function activateMosh() {

  moshActive = true;

  moshGauge = 0;

  updateMoshUI();


  /*
    画面演出
  */

  battleScreen.classList.add(
    "mosh-shake"
  );


  showMoshMessage();


  /*
    ライブキッズ出現
  */

  spawnMoshCrowd();


  /*
    少し遅れて敵へダメージ
  */

  hitAllEnemiesWithMosh();


  /*
    演出終了
  */

  setTimeout(
    () => {

      battleScreen.classList.remove(
        "mosh-shake"
      );

      moshActive = false;

    },
    1500
  );

}
/* =========================
   MOSH DAMAGE
========================= */

function hitAllEnemiesWithMosh() {

  /*
    実際のモッシュ集団を取得
  */

  const crowd =
    document.querySelector(
      ".mosh-crowd"
    );


  if (!crowd) {
    return;
  }


  /*
    すでにモッシュが当たった敵を記録
  */

  const hitEnemies =
    new Set();


  function checkCollision() {

    if (
      !battleRunning ||
      !crowd.isConnected
    ) {
      return;
    }

    if (isBattlePaused) {

      requestAnimationFrame(
        checkCollision
      );

      return;

    }


    /*
      モッシュ集団の
      現在位置を取得
    */

    const crowdRect =
      crowd.getBoundingClientRect();


    enemyUnits.forEach(
      (enemy) => {

        if (
          enemy.dead ||
          hitEnemies.has(enemy)
        ) {
          return;
        }


        const enemyRect =
          enemy.element
            .getBoundingClientRect();


        /*
          モッシュ集団が
          敵に実際に触れたか判定
        */

        const touching =
          crowdRect.right >=
            enemyRect.left &&
          crowdRect.left <=
            enemyRect.right;


        if (!touching) {
          return;
        }


        /*
          一度だけ当てる
        */

        hitEnemies.add(enemy);


        /*
          ダメージ
        */

        enemy.hp -= 180;


        /*
          ノックバック
        */

        enemy.x += 120;


        const maxX =
          getMoshKnockbackMaxX();


        if (
          enemy.x >
          maxX
        ) {

          enemy.x =
            maxX;

        }


        enemy.element.style.left =
          enemy.x + "px";


        /*
          被弾演出
        */

        enemy.element.classList.add(
          "mosh-hit"
        );


        setTimeout(
          () => {

            enemy.element
              .classList
              .remove(
                "mosh-hit"
              );

          },
          400
        );


        /*
          撃破
        */

        if (
          enemy.hp <= 0
        ) {

          enemy.hp = 0;

          defeatCharacter(
            enemy,
            true
          );

        }

      }
    );


    /*
      次の画面更新でも
      衝突チェック
    */

    requestAnimationFrame(
      checkCollision
    );

  }


  checkCollision();

}
/* =========================
   MOSH CROWD
========================= */

function spawnMoshCrowd() {

  const crowd =
    document.createElement(
      "div"
    );


  crowd.className =
    "mosh-crowd";


  crowd.innerHTML = `
    🏃‍♂️🏃‍♀️🏃‍♂️🏃‍♀️🏃‍♂️🏃‍♀️🏃‍♂️
  `;


  document
    .getElementById(
      "battle-world"
    )
    .appendChild(
      crowd
    );


  /*
    Safariに最初の位置を
    認識させてから突撃
  */

  requestAnimationFrame(
    () => {

      crowd.style.left =
        getMoshCrowdEndX() + "px";

    }
  );


  setTimeout(
    () => {

      crowd.remove();

    },
    4000
  );

}
/* =========================
   MOSH MESSAGE
========================= */

function showMoshMessage() {

  const message =
    document.createElement(
      "div"
    );


  message.className =
    "mosh-message";


  message.innerHTML = `

    <small>
      SPECIAL
    </small>

    <strong>
      MOSH
    </strong>

    <span>
      モッシュ！！
    </span>

  `;


  battleScreen.appendChild(
    message
  );


  requestAnimationFrame(
    () => {

      message.classList.add(
        "mosh-message-show"
      );

    }
  );


  setTimeout(
    () => {

      message.classList.remove(
        "mosh-message-show"
      );

    },
    700
  );


  setTimeout(
    () => {

      message.remove();

    },
    1100
  );

}
/* =========================
   PROLOGUE → TITLE
========================= */

const prologueStart =
  document.getElementById(
    "prologue-start"
  );

const prologueScreen =
  document.getElementById(
    "prologue-screen"
  );


prologueStart.addEventListener(
  "click",
  () => {

    /*
      タイトル画面へ
    */

    showScreen(
      titleScreen
    );


    /*
      タイトルBGM開始
    */

titleBgm.currentTime = 8;

    titleBgm
      .play()
      .catch(
        (error) => {

          console.log(
            "BGM再生エラー:",
            error
          );

        }
      );

  }
);
/* =========================
   BGM SYSTEM
========================= */

const titleBgm =
  new Audio(
    "audio/aibu.mp3"
  );

const menuBgm =
  new Audio(
    "audio/suiten.mp3"
  );

const battleBgm =
  new Audio(
    "audio/sentou.mp3"
  );


/*
  全BGMをループ
*/

titleBgm.loop = true;
menuBgm.loop = true;
battleBgm.loop = true;


/*
  とりあえず音量50%
*/

titleBgm.volume = 0.5;
menuBgm.volume = 1.0;
battleBgm.volume = 0.5;
/* =========================
   画面高さ
========================= */

function updateAppHeight() {

  window.scrollTo(0, 0);

  document.documentElement.scrollTop = 0;

  document.body.scrollTop = 0;

  const height =
    window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

  document.documentElement.style.setProperty(
    "--app-height",
    `${height}px`
  );

}


function scheduleAppHeightUpdate() {

  updateAppHeight();

  setTimeout(
    updateAppHeight,
    300
  );

  setTimeout(
    updateAppHeight,
    500
  );

}


updateAppHeight();


window.addEventListener(
  "resize",
  updateAppHeight
);


window.addEventListener(
  "orientationchange",
  scheduleAppHeightUpdate
);


if (window.visualViewport) {

  window.visualViewport.addEventListener(
    "resize",
    updateAppHeight
  );

}


/* =========================
   Global tap-note UI feedback
   (passive visual only)
========================= */

const TAP_NOTE_ASSETS = [
  "images/ui/tap_notes/tap_note_1.webp",
  "images/ui/tap_notes/tap_note_2.webp",
  "images/ui/tap_notes/tap_note_3.webp"
];

const TAP_NOTE_MAX_ACTIVE = 28;

const TAP_NOTE_LONG_PRESS_MS = 300;

const TAP_NOTE_EMIT_MS = 120;

const TAP_NOTE_DRAG_CANCEL_PX = 14;

const tapNoteActiveEls = [];

const tapNotePointerIds = new Set();

let tapNoteSession = null;

let tapNoteImagesReady = false;


function prefersTapNoteReducedMotion() {

  return !!(
    window.matchMedia &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  );

}


function preloadTapNoteAssets() {

  let loaded = 0;

  TAP_NOTE_ASSETS.forEach((src) => {

    const img = new Image();

    img.onload =
    img.onerror = () => {

      loaded += 1;

      if (
        loaded >=
        TAP_NOTE_ASSETS.length
      ) {

        tapNoteImagesReady = true;

      }

    };

    img.src = src;

  });

}


function pickTapNoteAsset() {

  return TAP_NOTE_ASSETS[
    Math.floor(
      Math.random() *
      TAP_NOTE_ASSETS.length
    )
  ];

}


function clampTapNotePoint(x, y) {

  const margin = 10;

  const maxX =
    Math.max(
      margin,
      window.innerWidth - margin
    );

  const maxY =
    Math.max(
      margin,
      window.innerHeight - margin
    );

  return {
    x: Math.min(maxX, Math.max(margin, x)),
    y: Math.min(maxY, Math.max(margin, y))
  };

}


function cleanupTapNoteEl(el) {

  const idx =
    tapNoteActiveEls.indexOf(el);

  if (idx >= 0) {

    tapNoteActiveEls.splice(idx, 1);

  }

  if (el && el.parentNode) {

    el.parentNode.removeChild(el);

  }

}


function enforceTapNoteDomCap() {

  while (
    tapNoteActiveEls.length >=
    TAP_NOTE_MAX_ACTIVE
  ) {

    const oldest =
      tapNoteActiveEls.shift();

    if (oldest) {

      if (oldest._tapNoteAnim) {

        try {

          oldest._tapNoteAnim.cancel();

        } catch (e) {}

      }

      if (oldest.parentNode) {

        oldest.parentNode.removeChild(
          oldest
        );

      }

    }

  }

}


function spawnTapNoteAt(
  clientX,
  clientY,
  mode
) {

  const reduced =
    prefersTapNoteReducedMotion();

  const point =
    clampTapNotePoint(
      clientX,
      clientY
    );

  enforceTapNoteDomCap();

  const el =
    document.createElement("img");

  el.className = "tap-note-effect";
  el.src = pickTapNoteAsset();
  el.alt = "";
  el.draggable = false;
  el.setAttribute(
    "aria-hidden",
    "true"
  );

  const size =
    reduced ? 24 : 26;

  const half = size / 2;

  const rot =
    (Math.random() * 20) - 10;

  const scalePeak =
    mode === "long"
      ? 0.92 + Math.random() * 0.18
      : 1.02 + Math.random() * 0.16;

  const scaleEnd =
    mode === "long"
      ? 0.78 + Math.random() * 0.12
      : 0.82 + Math.random() * 0.1;

  let dx;
  let dy;
  let duration;

  if (mode === "tap-left") {

    dx = -10 - Math.random() * 10;
    dy = -28 - Math.random() * 14;
    duration =
      reduced
        ? 360
        : 520 + Math.random() * 100;

  } else if (mode === "tap-right") {

    dx = 10 + Math.random() * 10;
    dy = -28 - Math.random() * 14;
    duration =
      reduced
        ? 360
        : 520 + Math.random() * 100;

  } else {

    const side =
      Math.random() < 0.5 ? -1 : 1;

    dx =
      side *
      (6 + Math.random() * 12);

    dy =
      -18 - Math.random() * 16;

    duration =
      reduced
        ? 300
        : 420 + Math.random() * 120;

  }

  if (reduced) {

    dx *= 0.35;
    dy *= 0.45;

  }

  const x0 = point.x - half;
  const y0 = point.y - half;

  el.style.width = size + "px";
  el.style.height = size + "px";
  el.style.transform =
    "translate3d(" +
    x0 +
    "px," +
    y0 +
    "px,0) scale(0.55) rotate(" +
    rot +
    "deg)";

  document.body.appendChild(el);

  tapNoteActiveEls.push(el);

  const anim = el.animate(
    [
      {
        opacity: 0,
        transform:
          "translate3d(" +
          x0 +
          "px," +
          y0 +
          "px,0) scale(0.55) rotate(" +
          rot +
          "deg)"
      },
      {
        opacity: 1,
        transform:
          "translate3d(" +
          (x0 + dx * 0.32) +
          "px," +
          (y0 + dy * 0.22) +
          "px,0) scale(" +
          scalePeak +
          ") rotate(" +
          rot +
          "deg)",
        offset: 0.18
      },
      {
        opacity: 0,
        transform:
          "translate3d(" +
          (x0 + dx) +
          "px," +
          (y0 + dy) +
          "px,0) scale(" +
          scaleEnd +
          ") rotate(" +
          rot +
          "deg)"
      }
    ],
    {
      duration: duration,
      easing: "ease-out",
      fill: "forwards"
    }
  );

  el._tapNoteAnim = anim;

  anim.finished.then(
    () => {
      cleanupTapNoteEl(el);
    },
    () => {
      cleanupTapNoteEl(el);
    }
  );

}


function spawnTapNotePair(
  clientX,
  clientY
) {

  spawnTapNoteAt(
    clientX - 4,
    clientY - 2,
    "tap-left"
  );

  spawnTapNoteAt(
    clientX + 4,
    clientY - 2,
    "tap-right"
  );

}


function clearTapNoteSessionTimers() {

  if (!tapNoteSession) {

    return;

  }

  if (
    tapNoteSession.longTimer != null
  ) {

    clearTimeout(
      tapNoteSession.longTimer
    );

    tapNoteSession.longTimer = null;

  }

  if (
    tapNoteSession.emitTimer != null
  ) {

    clearInterval(
      tapNoteSession.emitTimer
    );

    tapNoteSession.emitTimer = null;

  }

}


function stopTapNoteLongEmit() {

  if (!tapNoteSession) {

    return;

  }

  if (
    tapNoteSession.emitTimer != null
  ) {

    clearInterval(
      tapNoteSession.emitTimer
    );

    tapNoteSession.emitTimer = null;

  }

}


function cancelTapNoteSession() {

  if (!tapNoteSession) {

    return;

  }

  clearTapNoteSessionTimers();

  tapNoteSession.cancelled = true;

  tapNoteSession = null;

}


function emitLongPressTapNote() {

  if (
    !tapNoteSession ||
    tapNoteSession.cancelled
  ) {

    return;

  }

  spawnTapNoteAt(
    tapNoteSession.x,
    tapNoteSession.y,
    "long"
  );

}


function beginTapNoteLongPress() {

  if (
    !tapNoteSession ||
    tapNoteSession.cancelled ||
    tapNoteSession.dragged
  ) {

    return;

  }

  tapNoteSession.isLong = true;

  tapNoteSession.longTimer = null;

  emitLongPressTapNote();

  tapNoteSession.emitTimer =
    setInterval(
      emitLongPressTapNote,
      TAP_NOTE_EMIT_MS
    );

}


function startTapNoteSession(event) {

  cancelTapNoteSession();

  tapNoteSession = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    startX: event.clientX,
    startY: event.clientY,
    isLong: false,
    dragged: false,
    cancelled: false,
    longTimer: null,
    emitTimer: null
  };

  tapNoteSession.longTimer =
    setTimeout(
      beginTapNoteLongPress,
      TAP_NOTE_LONG_PRESS_MS
    );

}


function updateTapNoteSessionMove(
  event
) {

  if (
    !tapNoteSession ||
    tapNoteSession.pointerId !==
      event.pointerId
  ) {

    return;

  }

  tapNoteSession.x = event.clientX;
  tapNoteSession.y = event.clientY;

  if (tapNoteSession.isLong) {

    return;

  }

  const dist = Math.hypot(
    event.clientX -
      tapNoteSession.startX,
    event.clientY -
      tapNoteSession.startY
  );

  if (dist >= TAP_NOTE_DRAG_CANCEL_PX) {

    tapNoteSession.dragged = true;

    clearTapNoteSessionTimers();

    tapNoteSession.cancelled = true;

    tapNoteSession = null;

  }

}


function endTapNoteSession(event) {

  if (
    !tapNoteSession ||
    tapNoteSession.pointerId !==
      event.pointerId
  ) {

    return;

  }

  const session = tapNoteSession;

  const wasLong = session.isLong;

  const wasCancelled =
    session.cancelled ||
    session.dragged;

  const x = session.x;
  const y = session.y;

  clearTapNoteSessionTimers();

  tapNoteSession = null;

  if (wasLong || wasCancelled) {

    return;

  }

  spawnTapNotePair(x, y);

}


function setupGlobalTapNotes() {

  preloadTapNoteAssets();

  const opts = {
    capture: true,
    passive: true
  };

  window.addEventListener(
    "pointerdown",
    (event) => {

      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {

        return;

      }

      tapNotePointerIds.add(
        event.pointerId
      );

      if (tapNotePointerIds.size > 1) {

        cancelTapNoteSession();

        return;

      }

      startTapNoteSession(event);

    },
    opts
  );

  window.addEventListener(
    "pointermove",
    (event) => {

      if (
        tapNotePointerIds.size > 1
      ) {

        return;

      }

      updateTapNoteSessionMove(event);

    },
    opts
  );

  const onPointerEnd = (event) => {

    tapNotePointerIds.delete(
      event.pointerId
    );

    if (tapNotePointerIds.size > 1) {

      cancelTapNoteSession();

      return;

    }

    if (tapNotePointerIds.size === 0) {

      endTapNoteSession(event);

      return;

    }

    // One finger left after multi-touch: do not resume notes.
    cancelTapNoteSession();

  };

  window.addEventListener(
    "pointerup",
    onPointerEnd,
    opts
  );

  window.addEventListener(
    "pointercancel",
    onPointerEnd,
    opts
  );

  window.addEventListener(
    "blur",
    () => {

      tapNotePointerIds.clear();

      cancelTapNoteSession();

    }
  );

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "hidden"
      ) {

        tapNotePointerIds.clear();

        cancelTapNoteSession();

      }

    }
  );

}


setupGlobalTapNotes();

