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

let enemySpawnTimer = null;


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

  clearInterval(enemySpawnTimer);


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


        if (unit === "sena") {

          spawnSena();

        }


        updateBattleUI();

      }
    );

  });


/* =========================
   SENA
========================= */

function spawnSena() {

  const element =
    document.createElement("div");


  element.className =
    "battle-unit";


  element.innerHTML = `

    <div class="character-hp">
      <div class="character-hp-bar"></div>
    </div>

    <div class="unit-body">
      🎸
    </div>

    <div class="unit-label">
      せな
    </div>

  `;


  unitLayer.appendChild(
    element
  );


  const unit = {

    type: "sena",

    element: element,

    hpBar:
      element.querySelector(
        ".character-hp-bar"
      ),

    hp: 300,

    maxHp: 300,

    attack: 45,

    range: 60,

    speed: 1.2,

    x: 110,

    attackCooldown: 0,

    attackInterval: 900,

    dead: false

  };


  playerUnits.push(unit);

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

    x:
      window.innerWidth -
      160,

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
          window.innerWidth -
          150;


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
          120;


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


  target.element
    .classList.add(
      "defeated"
    );


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
  clearInterval(enemySpawnTimer);
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

function scheduleEnemy(
  delay,
  type
) {

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

    x:
      window.innerWidth - 160,

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

    x:
      window.innerWidth - 160,

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

    x:
      window.innerWidth - 170,

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
          window.innerWidth -
          150;


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
      "battle-field"
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

      crowd.classList.add(
        "mosh-crowd-run"
      );

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
   iPhone 画面回転対策
========================= */

function updateAppHeight() {

  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`
  );

}


/* 起動時 */

updateAppHeight();


/* 画面サイズ変更時 */

window.addEventListener(
  "resize",
  () => {

    updateAppHeight();

  }
);


/* 縦横を回転した時 */

window.addEventListener(
  "orientationchange",
  () => {

    setTimeout(
      () => {

        updateAppHeight();

      },
      300
    );

  }
);
/* =========================
   iPhone Safari 高さ補正
========================= */

function updateViewportHeight() {

  const height =
    window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

  document.documentElement.style.setProperty(
    "--app-height",
    `${height}px`
  );

}

updateViewportHeight();

window.addEventListener(
  "resize",
  updateViewportHeight
);

window.addEventListener(
  "orientationchange",
  () => {

    setTimeout(
      updateViewportHeight,
      500
    );

  }
);

if (window.visualViewport) {

  window.visualViewport.addEventListener(
    "resize",
    updateViewportHeight
  );

}
