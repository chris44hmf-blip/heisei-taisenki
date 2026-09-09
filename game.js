/* =========================
   SCREENS
========================= */

const titleScreen =
  document.getElementById("title-screen");

const homeScreen =
  document.getElementById("home-screen");

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

const enhanceScreen =
  document.getElementById(
    "enhance-screen"
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

  document
    .querySelectorAll(".screen")
    .forEach((item) => {

      item.classList.remove("active");

    });

  screen.classList.add("active");

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

const menuButtons =
  document.querySelectorAll(".menu-button");


menuButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const menu =
        button.dataset.menu;

      if (menu === "sortie") {

        showScreen(timelineScreen);

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


      console.log(
        "選択されたメニュー:",
        menu
      );

    }
  );

});


/* =========================
   TIMELINE
========================= */

timelineBack.addEventListener(
  "click",
  () => {

    showScreen(homeScreen);

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


const yearNodes =
  document.querySelectorAll(
    ".year-node.unlocked"
  );


yearNodes.forEach((node) => {

  node.addEventListener(
    "click",
    () => {

      document
        .querySelectorAll(".year-node")
        .forEach((item) => {

          item.classList.remove(
            "selected"
          );

        });


      node.classList.add(
        "selected"
      );


      const year =
        node.dataset.year;

      const title =
        node.dataset.title;

      const stamina =
        node.dataset.stamina;


      document.getElementById(
        "stage-year"
      ).textContent =
        `平成${year === "1" ? "元" : year}年`;


      document.getElementById(
        "stage-title"
      ).textContent =
        title;


      document.getElementById(
        "stage-cost"
      ).textContent =
        stamina;

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

  heisei1: {

    environment: "A"

  }

};


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


/* 拠点 */

let playerBaseHp = 2000;
let playerBaseMaxHp = 2000;

let enemyBaseHp = 2000;
let enemyBaseMaxHp = 2000;

/* =========================
   START BATTLE
========================= */

function startBattle() {

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

  battleCardPage = 0;

  renderBattleUnitCards();

  cameraX = 0;

  zoom = 1;

  applyCamera();

  applyStageEnvironment(
    STAGES.heisei1.environment
  );

moshGauge = 0;

moshActive = false;

updateMoshUI();


  playerUnits = [];

  enemyUnits = [];

  clearProjectiles();


  playerBaseHp = 2000;
enemyBaseHp = 2000;

  unitLayer.innerHTML = "";


  clearInterval(yaniTimer);

  clearInterval(battleTimer);

  clearEnemySpawnTimers();


  updateBattleUI();

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

        updateUnits();

        updateEnemies();

        updateProjectiles();

        updateAttackKnockbackEffects();

        updateUnitCardAvailability();

      },
      30
    );


  /* =========================
   平成元年 ENEMY WAVE
========================= */

startHeisei1Wave();
}


/* =========================
   BATTLE UI
========================= */

function updateBattleUI() {

  yaniNowText.textContent =
    Math.floor(yani);

  yaniMaxText.textContent =
    yaniMax;

  smokingLevelText.textContent =
    smokingLevel;

  smokingCostText.textContent =
    smokingCost;


  updateUnitCardAvailability();

}


/* =========================
   BASE UI
========================= */

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
      ".enhance-filter"
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

    const image =
      document.createElement("img");

    image.src =
      character.images.menu;

    image.alt =
      character.name;

    image.draggable =
      false;

    const menuScale =
      getCharacterMenuScale(
        character
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

    const rarity =
      document.createElement("div");

    rarity.className =
      "enhance-card-rarity";

    rarity.textContent =
      getRarityLabel(
        getCharacterRarity(character)
      );

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

    info.appendChild(rarity);

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

        console.log(
          "強化キャラクター選択:",
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
    ".enhance-filter"
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


const ATTACK_TYPE = {

  MELEE_SINGLE: "meleeSingle",

  MELEE_AOE: "meleeAoE",

  PROJECTILE_SINGLE: "projectileSingle",

  PROJECTILE_AOE: "projectileAoE"

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
      ATTACK_TYPE.PROJECTILE_AOE
  );

}


const CHARACTERS = {

  sena: {

    id: "sena",

    name: "せな",

    group: "令和黎明期",

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

  }

};


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
    plus !== null &&
    plus >= 0
      ? plus
      : defaults.plus;

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


// TEMP STEP 2-7 KAEDE TEST
unlockCharacter("kaede");

if (battleDeck[1] === null) {

  setBattleDeckSlot(
    1,
    "kaede"
  );

}
// TEMP STEP 2-7 KAEDE TEST


// TEMP KAIRI TEST
unlockCharacter("kairi");
// TEMP KAIRI TEST


// TEMP CHRIS TEST
unlockCharacter("chris");
// TEMP CHRIS TEST


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

    return false;

  }

  return true;

}


function getDeployCooldownProgress(characterId) {

  const character =
    CHARACTERS[characterId];

  const duration =
    getDeployCooldownMs(character);

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

  const character =
    CHARACTERS[characterId];

  const duration =
    getDeployCooldownMs(character);

  if (duration <= 0) {

    delete deployCooldownUntil[characterId];

    return;

  }

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


const FORMATION_OWNED_SLOT_LAYOUT = [
  { left: 13.22, top: 31.03, width: 7.24, height: 34.43 },
  { left: 22.31, top: 31.03, width: 7.36, height: 34.43 },
  { left: 31.40, top: 31.03, width: 7.36, height: 34.43 },
  { left: 40.49, top: 31.03, width: 7.36, height: 34.43 }
];

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

  renderFormationScreen();

}


function startFormationEditing() {

  formationDraftDeck =
    copyBattleDeck(battleDeck);

  selectedFormationCharacterId =
    null;

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


function applyFormationMenuScale(image, character) {

  if (!image) {

    return;

  }

  image.style.transform =
    "scale(" +
    getCharacterMenuScale(
      character
    ) +
    ")";

  image.style.transformOrigin =
    "center center";

}


function createFormationCardMetaHtml(character) {

  return `
    <span class="formation-card-meta">
      <strong>${character.name}</strong>
      <span class="formation-card-yani">
        🚬 ${character.stats.yaniCost}
      </span>
    </span>
  `;

}


function createFormationOwnedCard(character, box) {

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

  const menuImage =
    getCharacterImages(
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

    ${createFormationCardMetaHtml(character)}

  `;

  applyFormationPercentBox(card, box);

  applyFormationMenuScale(
    card.querySelector("img"),
    character
  );

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

    const menuImage =
      getCharacterImages(
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

      ${createFormationCardMetaHtml(character)}

    `;

    applyFormationMenuScale(
      slot.querySelector("img"),
      character
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


function renderFormationScreen() {

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


  const visibleOwnedRoster =
    ownedRoster.filter((character) => {

      return characterMatchesRarityFilter(
        character,
        formationRarityFilter
      );

    });


  visibleOwnedRoster.forEach((character, index) => {

    const box =
      FORMATION_OWNED_SLOT_LAYOUT[
        index
      ];

    if (!box) {

      return;

    }

    ownedList.appendChild(
      createFormationOwnedCard(
        character,
        box
      )
    );

  });


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

}


function createBattleUnitCard(character) {

  const yaniCost =
    character.stats.yaniCost;

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


  card.innerHTML = `

    <span class="unit-icon">
      <img
        class="unit-character-image"
        src="${character.images.menu}"
        alt="${character.name}"
      >
    </span>

    <strong>
      ${character.name}
    </strong>

    <small class="unit-card-cost">
      🚬 ${yaniCost}
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

    menuImage.style.transform =
      "scale(" +
      getCharacterMenuScale(
        character
      ) +
      ")";

    menuImage.style.transformOrigin =
      "center center";

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

  return Math.floor(
    BATTLE_DECK_SIZE /
    BATTLE_DECK_FRONT_SIZE
  ) - 1;

}


function updateBattleCardPageDots() {

  const dots =
    document.querySelectorAll(
      ".page-dot"
    );


  dots.forEach((dot) => {

    const page =
      Number(dot.dataset.cardPage);

    dot.classList.toggle(
      "active",
      page === battleCardPage
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


    const yaniCost =
      character.stats.yaniCost;

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
        !isCharacterOwned(
          character.id
        )
      ) {

        return;

      }


      const yaniCost =
        character.stats.yaniCost;


      if (yani < yaniCost) {

        return;

      }


      if (
        isCharacterOnCooldown(
          character.id
        )
      ) {

        return;

      }


      yani -= yaniCost;

      spawnCharacter(
        character.id
      );

      beginDeployCooldown(
        character.id
      );

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


  const element =
    document.createElement("div");


  element.className =
    "battle-unit";


  element.innerHTML = `

    <div class="character-hp">
      <div class="character-hp-bar"></div>
    </div>

    <div class="unit-body">
      <img
        class="unit-sprite"
        src="${data.images.idle}"
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
    data.battle.spriteSize + "px";

  sprite.style.height =
    data.battle.spriteSize + "px";


  applySpawnPosition(
    element,
    getAllySpawnX()
  );


  unitLayer.appendChild(
    element
  );


  const unit = {

    id: data.id,

    type: data.id,

    name: data.name,

    images: data.images,

    battle: data.battle,

    element: element,

    sprite: sprite,

    spriteTimer: null,

    hpBar:
      element.querySelector(
        ".character-hp-bar"
      ),

    hp: data.stats.hp,

    maxHp: data.stats.hp,

    attack: data.stats.attack,

    range: data.stats.range,

    speed: data.stats.speed,

    x: getAllySpawnX(),

    attackCooldown: 0,

    attackInterval:
      data.stats.attackInterval,

    attackBehavior:
      getAttackBehavior(data),

    traits: data.traits || {},

    triggeredHealthKnockbacks:
      new Set(),

    knockbackStartX: 0,

    knockbackTargetX: 0,

    knockbackStartedAt: 0,

    knockbackDurationMs: 0,

    dead: false

  };


  playerUnits.push(unit);

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


function applyHealthKnockbackAfterDamage(
  unit
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

  const ratio =
    unit.hp /
    unit.maxHp;

  const thresholds =
    Array.isArray(trait.thresholds)
      ? trait.thresholds
      : [];

  let crossedAny = false;

  thresholds.forEach(
    (threshold) => {

      if (
        ratio <= threshold &&
        !unit.triggeredHealthKnockbacks.has(
          threshold
        )
      ) {

        unit.triggeredHealthKnockbacks.add(
          threshold
        );

        crossedAny = true;

      }

    }
  );

  if (!crossedAny) {

    return;

  }

  if (
    isHealthKnockbackActive(unit)
  ) {

    return;

  }

  startHealthKnockback(
    unit,
    trait
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

  startHealthKnockback(
    target,
    trait
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
   SALARYMAN
========================= */

function spawnSalaryman() {

  const element =
    document.createElement("div");


  element.className =
    "battle-enemy";


  element.innerHTML = `

    <div class="character-hp">
      <div class="character-hp-bar"></div>
    </div>

    <div class="enemy-body">
      👔
    </div>

    <div class="enemy-label">
      24時間戦う漢
    </div>

  `;


  applySpawnPosition(
    element,
    getEnemySpawnX()
  );


  unitLayer.appendChild(
    element
  );


  const enemy = {

    type: "salaryman",

    element: element,

    hpBar:
      element.querySelector(
        ".character-hp-bar"
      ),

    hp: 180,

    maxHp: 180,

    attack: 22,

    range: 55,

    speed: 0.8,

    x: getEnemySpawnX(),

    attackCooldown: 0,

    attackInterval: 1100,

    yaniReward: 45,

    dead: false

  };


  enemyUnits.push(enemy);

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
        updateHealthKnockbackMotion(
          unit
        )
      ) {

        unit.element.style.left =
          unit.x + "px";

        return;

      }


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
            unit.speed;

        } else {

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
            unit.speed;

        } else {

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
   ENEMY UPDATE
========================= */

function updateEnemies() {

  enemyUnits.forEach(
    (enemy) => {

      if (enemy.dead) {
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
    attacker.attackInterval;


  attacker.element
    .classList.add(
      "attacking"
    );


  setTimeout(
    () => {

      attacker.element
        .classList.remove(
          "attacking"
        );

    },
    180
  );


  showUnitAttack(
    attacker
  );


  if (!playerAttack) {

    damageCharacter(
      target,
      attacker.attack,
      false,
      attacker
    );

    return;

  }


  const behavior =
    getAttackBehavior(attacker);


  if (
    behavior.type ===
    ATTACK_TYPE.MELEE_AOE
  ) {

    applyMeleeAoeDamage(
      attacker,
      behavior
    );

    return;

  }


  if (
    behavior.type ===
      ATTACK_TYPE.PROJECTILE_SINGLE ||
    behavior.type ===
      ATTACK_TYPE.PROJECTILE_AOE
  ) {

    scheduleProjectile(
      attacker,
      behavior
    );

    return;

  }


  damageCharacter(
    target,
    attacker.attack,
    true,
    attacker
  );

}


function applyMeleeAoeDamage(
  attacker,
  behavior
) {

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
        attacker.attack,
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

  pendingProjectiles.push({

    unit: attacker,

    behavior: behavior,

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


function spawnProjectile(
  attacker,
  behavior,
  originX,
  range,
  towardEnemyBase
) {

  if (
    !projectileLayer ||
    !behavior ||
    !behavior.effectImage
  ) {

    return;

  }

  const offsetX =
    typeof behavior.launchOffsetX ===
      "number"
      ? behavior.launchOffsetX
      : 32;

  const startX =
    originX +
    offsetX;

  const maxX =
    towardEnemyBase
      ? ENEMY_BASE_X
      : originX +
        range;

  const element =
    document.createElement("div");

  element.className =
    "battle-projectile";

  const image =
    document.createElement("img");

  image.src =
    behavior.effectImage;

  image.alt = "";

  const effectWidth =
    typeof behavior.effectWidth ===
      "number"
      ? behavior.effectWidth
      : 80;

  image.style.width =
    effectWidth + "px";

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

    speed:
      typeof behavior.projectileSpeed ===
        "number"
        ? behavior.projectileSpeed
        : 180,

    hitRadius:
      typeof behavior.hitRadius ===
        "number"
        ? behavior.hitRadius
        : 24,

    aoeRadius:
      typeof behavior.aoeRadius ===
        "number"
        ? behavior.aoeRadius
        : 0,

    attack: attacker.attack,

    type: behavior.type,

    hitsEnemyBase:
      Boolean(towardEnemyBase),

    baseDamaged: false,

    source: attacker

  });

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

  enemyUnits.forEach((enemy) => {

    if (enemy.dead) {

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


function applyProjectileImpact(
  projectile,
  impactX,
  hitEnemy
) {

  if (
    projectile.type ===
    ATTACK_TYPE.PROJECTILE_SINGLE
  ) {

    if (hitEnemy) {

      damageCharacter(
        hitEnemy,
        projectile.attack,
        true,
        projectile.source
      );

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
        projectile.attack,
        true,
        projectile.source
      );

    }

  });

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
    projectile.attack;

  updateBaseUI();

  if (enemyBaseHp <= 0) {

    winBattle();

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
        pending.towardEnemyBase
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
    unit.attackInterval;


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


  enemyBaseHp -=
    unit.attack;


  updateBaseUI();


  if (
    enemyBaseHp <= 0
  ) {

    winBattle();

  }

}


function attackPlayerBase(enemy) {

  if (
    isHealthKnockbackActive(enemy)
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
    enemy.attackInterval;


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
    target
  );

  tryApplyAttackKnockback(
    source,
    target
  );

}


/* =========================
   DEFEAT CHARACTER
========================= */

function defeatCharacter(
  target,
  playerAttack
) {

  target.dead = true;

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
    target.yaniReward
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

function stopBattle() {

  battleRunning = false;

  isBattlePaused = false;

  battlePausedAt = 0;

  hideBattlePauseMenu();

  deployCooldownUntil = {};

  clearInterval(yaniTimer);
  clearInterval(battleTimer);
  clearEnemySpawnTimers();
  clearInterval(moshTimer);

  clearProjectiles();


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

function winBattle() {

  if (!battleRunning) {
    return;
  }


  stopBattle();


  setTimeout(
    () => {

      alert(
        "平成元年 突破！\n\nバブルの狂騒を乗り越えた。"
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
/* =========================
   平成元年 WAVE
========================= */

function startHeisei1Wave() {

  /*
    序盤
    サラリーマン中心
  */

  scheduleEnemy(1500, "salaryman");
  scheduleEnemy(5000, "salaryman");
  scheduleEnemy(8500, "salaryman");


  /*
    中盤
    ジュリ扇女登場
  */

  scheduleEnemy(12000, "juriana");

  scheduleEnemy(15000, "salaryman");

  scheduleEnemy(18000, "juriana");

  scheduleEnemy(21000, "salaryman");


  /*
    後半
    バブル野郎登場
  */

  scheduleEnemy(25000, "bubble");

  scheduleEnemy(28000, "salaryman");

  scheduleEnemy(31000, "juriana");

  scheduleEnemy(34000, "bubble");


  /*
    ボス前ラッシュ
  */

  scheduleEnemy(38000, "salaryman");

  scheduleEnemy(39500, "salaryman");

  scheduleEnemy(41000, "juriana");


  /*
    BOSS
  */

  scheduleEnemy(45000, "boss");

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

  if (type === "salaryman") {

    spawnSalaryman();

  }


  if (type === "juriana") {

    spawnJuriana();

  }


  if (type === "bubble") {

    spawnBubbleMan();

  }


  if (type === "boss") {

    spawnThreePercent();

  }

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
   ジュリ扇女
========================= */

function spawnJuriana() {

  const element =
    document.createElement("div");


  element.className =
    "battle-enemy";


  element.innerHTML = `

    <div class="character-hp">
      <div class="character-hp-bar"></div>
    </div>

    <div class="enemy-body">
      🪭
    </div>

    <div class="enemy-label">
      ジュリ扇女
    </div>

  `;


  applySpawnPosition(
    element,
    getEnemySpawnX()
  );


  unitLayer.appendChild(element);


  const enemy = {

    type: "juriana",

    element: element,

    hpBar:
      element.querySelector(
        ".character-hp-bar"
      ),

    /* 打たれ弱い */
    hp: 110,

    maxHp: 110,

    /* 攻撃はそこそこ */
    attack: 28,

    /* 遠距離 */
    range: 170,

    /* 普通の速度 */
    speed: 0.7,

    x: getEnemySpawnX(),

    attackCooldown: 0,

    attackInterval: 1400,

    yaniReward: 60,

    dead: false

  };


  enemyUnits.push(enemy);

}
/* =========================
   バブル野郎
========================= */

function spawnBubbleMan() {

  const element =
    document.createElement("div");


  element.className =
    "battle-enemy bubble-enemy";


  element.innerHTML = `

    <div class="character-hp">
      <div class="character-hp-bar"></div>
    </div>

    <div class="enemy-body">
      💰
    </div>

    <div class="enemy-label">
      バブル野郎
    </div>

  `;


  applySpawnPosition(
    element,
    getEnemySpawnX()
  );


  unitLayer.appendChild(element);


  const enemy = {

    type: "bubble",

    element: element,

    hpBar:
      element.querySelector(
        ".character-hp-bar"
      ),

    /* めちゃ硬い */
    hp: 650,

    maxHp: 650,

    attack: 38,

    range: 60,

    /* 鈍足 */
    speed: 0.38,

    x: getEnemySpawnX(),

    attackCooldown: 0,

    attackInterval: 1500,

    yaniReward: 120,

    dead: false

  };


  enemyUnits.push(enemy);

}
/* =========================
   BOSS
   増税獣 サンパーセント
========================= */

function spawnThreePercent() {

  /*
    登場時

    現在ヤニの3%を徴収
  */

  const tax =
    Math.floor(
      yani * 0.03
    );


  yani -= tax;

  updateBattleUI();


  /*
    登場演出
  */

  showBossMessage(
    "増税獣 サンパーセント",
    `ヤニを3%徴収された！ -${tax}`
  );


  const element =
    document.createElement("div");


  element.className =
    "battle-enemy boss-enemy";


  element.innerHTML = `

    <div class="character-hp">
      <div class="character-hp-bar"></div>
    </div>

    <div class="enemy-body">
      👹
    </div>

    <div class="enemy-label">
      増税獣 サンパーセント
    </div>

  `;


  applySpawnPosition(
    element,
    getEnemySpawnX()
  );


  unitLayer.appendChild(element);


  const enemy = {

    type: "threePercent",

    element: element,

    hpBar:
      element.querySelector(
        ".character-hp-bar"
      ),

    hp: 1400,

    maxHp: 1400,

    attack: 70,

    range: 75,

    speed: 0.32,

    x: getEnemySpawnX(),

    attackCooldown: 0,

    attackInterval: 1600,

    yaniReward: 300,

    dead: false,

    boss: true

  };


  enemyUnits.push(enemy);

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