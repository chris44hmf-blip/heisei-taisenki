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


/* =========================
   BUTTONS
========================= */

const startButton =
  document.getElementById("start-button");

const timelineBack =
  document.getElementById("timeline-back");

const stageStartButton =
  document.getElementById("stage-start-button");

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


  if (visibleWorldWidth >= worldSpanX) {

    return (
      (worldSpanX - visibleWorldWidth) /
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


  if (visibleWorldWidth >= worldSpanX) {

    return (
      (worldSpanX - visibleWorldWidth) /
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
    Math.max(MIN_ZOOM, nextZoom)
  );

}


function beginCameraPinch(touchA, touchB, event) {

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


/* 全キャラ */

let playerUnits = [];

let enemyUnits = [];


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

  cameraX = 0;

  zoom = 1;

  applyCamera();

moshGauge = 0;

moshActive = false;

updateMoshUI();


  playerUnits = [];

  enemyUnits = [];


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

        if (!battleRunning) {
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

      if (!battleRunning) {
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

        if (!battleRunning) {
          return;
        }

        updateUnits();

        updateEnemies();

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


  document
    .querySelectorAll(
      ".unit-card.available"
    )
    .forEach((card) => {

      const cost =
        Number(card.dataset.cost);

      if (yani < cost) {

        card.classList.add(
          "not-enough"
        );

      } else {

        card.classList.remove(
          "not-enough"
        );

      }

    });

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
   UNIT BUTTON
========================= */

document
  .querySelectorAll(
    ".unit-card.available"
  )
  .forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        if (!battleRunning) {
          return;
        }


        const unit =
          card.dataset.unit;

        const cost =
          Number(card.dataset.cost);


        if (yani < cost) {
          return;
        }


        yani -= cost;


        if (CHARACTERS[unit]) {

          spawnCharacter(unit);

        }


        updateBattleUI();

      }
    );

  });


/* =========================
   CHARACTERS
========================= */

const CHARACTERS = {

  sena: {

    id: "sena",

    name: "せな",

    rarity: "sr",

    images: {

      menu:
        "images/characters/sena/sena_menu.webp",

      idle:
        "images/characters/sena/sena_idle.webp",

      attack:
        "images/characters/sena/sena_attack.webp",

      hurt:
        "images/characters/sena/sena_hurt.webp"

    },

    stats: {

      hp: 300,

      attack: 45,

      range: 60,

      speed: 1.2,

      attackInterval: 900,

      yaniCost: 150

    },

    battle: {

      spriteSize: 105,

      attackSpriteMs: 180,

      hurtSpriteMs: 280,

      deathKnockbackPx: 15,

      deathSecondMs: 120,

      deathWaitMs: 380

    },

    unlock: {

      type: "start"

    }

  }

};


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

    dead: false

  };


  playerUnits.push(unit);

}


function spawnSena() {

  spawnCharacter("sena");

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
    unit.dead
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


  damageCharacter(
    target,
    attacker.attack,
    playerAttack
  );

}


/* =========================
   BASE ATTACK
========================= */

function attackEnemyBase(unit) {

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
  playerAttack
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

    defeatCharacter(
      target,
      playerAttack
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

  clearInterval(yaniTimer);
  clearInterval(battleTimer);
  clearEnemySpawnTimers();
  clearInterval(moshTimer);


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

}


function scheduleEnemy(
  delay,
  type
) {

  const timerId =
    setTimeout(
      () => {

        if (!battleRunning) {
          return;
        }


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

      },
      delay
    );

  enemySpawnTimers.push(
    timerId
  );

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

    if (!battleRunning) {
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