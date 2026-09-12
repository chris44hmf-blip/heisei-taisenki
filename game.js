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

      if (menu === "gacha") {

        openGachaLobby();

        return;

      }


      console.log(
        "選択されたメニュー:",
        menu
      );

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

let deployCooldownDurationMs = {};


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

  deployCooldownDurationMs = {};

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
  "traits"
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


function cancelBsGachaPullPresentation() {

  bsGachaSequenceToken += 1;

  clearBsGachaRevealQueue();

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


  card.innerHTML = `

    <span class="unit-icon">
      <img
        class="unit-character-image"
        src="${menuImageSrc}"
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
        form
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

  deployCooldownDurationMs = {};

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