// ==========================================
// BIRTHDAY QUEST - MAIN GAME ENGINE
// ==========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

let gameState = "INTRO";
let currentLevel = 1;
let collectedItems = [];
let keysCount = 0;
let keysNeeded = 3;
let activeMessage = null;
let messageTimer = 0;
let popupTimer = null;

// Camera
let cameraX = 0;

// Particles
let particles = [];
let fireworks = [];

// Preload photo images for floating clouds
const photoImages = CONFIG.gallery.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

// Floating clouds carrying couple photos
const floatingClouds = [
  { x: 120, y: 65, speed: 0.35, photoIndex: 0, bobPhase: 0, scale: 0.95 },
  { x: 480, y: 110, speed: 0.25, photoIndex: 1, bobPhase: 1.2, scale: 0.85 },
  { x: 840, y: 60, speed: 0.4, photoIndex: 2, bobPhase: 2.5, scale: 1.0 },
  { x: 1200, y: 115, speed: 0.3, photoIndex: 3, bobPhase: 3.8, scale: 0.9 },
  { x: 1560, y: 75, speed: 0.38, photoIndex: 4, bobPhase: 0.8, scale: 1.05 },
  { x: 1920, y: 110, speed: 0.28, photoIndex: 5, bobPhase: 4.5, scale: 0.88 },
  { x: 2280, y: 70, speed: 0.32, photoIndex: 6, bobPhase: 2.1, scale: 0.95 },
  { x: 2640, y: 105, speed: 0.36, photoIndex: 7, bobPhase: 5.2, scale: 1.0 },
];

// Input handler
const keys = {
  left: false,
  right: false,
  up: false
};

// Player object
const player = {
  x: 60,
  y: 300,
  vx: 0,
  vy: 0,
  width: 28,
  height: 40,
  speed: 3.5,
  jumpPower: -9.5,
  grounded: false,
  facing: "right",
  frame: 0,
  frameTimer: 0,
  invulnerableTimer: 0
};

// Projectiles thrown by enemy cats
let catClaws = [];

// Level definitions
const level1 = {
  width: 2400,
  platforms: [
    { x: 0, y: 380, w: 700, h: 70 },
    { x: 200, y: 300, w: 120, h: 20 },
    { x: 380, y: 240, w: 140, h: 20 },
    { x: 580, y: 310, w: 100, h: 20 },
    { x: 750, y: 380, w: 800, h: 70 },
    { x: 880, y: 280, w: 140, h: 20 },
    { x: 1100, y: 220, w: 140, h: 20 },
    { x: 1300, y: 290, w: 150, h: 20 },
    { x: 1600, y: 380, w: 800, h: 70 },
    { x: 1750, y: 290, w: 120, h: 20 },
    { x: 1950, y: 230, w: 130, h: 20 },
    { x: 2150, y: 300, w: 150, h: 20 },
  ],
  items: [
    { type: "boba", x: 440, y: 200, collected: false },
    { type: "flower", x: 940, y: 240, collected: false },
    { type: "letter", x: 1160, y: 180, collected: false },
    { type: "cat", x: 2000, y: 190, collected: false },
  ],
  cats: [
    { x: 820, y: 356, minX: 770, maxX: 980, vx: 1.2, width: 28, height: 24, throwCooldown: 90, facing: "right", frame: 0 },
    { x: 1320, y: 266, minX: 1300, maxX: 1440, vx: -1.0, width: 28, height: 24, throwCooldown: 120, facing: "left", frame: 0 },
    { x: 1700, y: 356, minX: 1620, maxX: 1880, vx: 1.3, width: 28, height: 24, throwCooldown: 80, facing: "right", frame: 0 }
  ],
  portal: { x: 2300, y: 300, w: 50, h: 80, text: "NEXT STAGE ->" }
};

const level2 = {
  width: 2600,
  platforms: [
    { x: 0, y: 380, w: 500, h: 70 },
    { x: 220, y: 290, w: 130, h: 20 },
    { x: 420, y: 220, w: 140, h: 20 },
    { x: 620, y: 170, w: 140, h: 20 },
    { x: 820, y: 260, w: 150, h: 20 },
    { x: 1050, y: 380, w: 500, h: 70 },
    { x: 1200, y: 270, w: 130, h: 20 },
    { x: 1400, y: 190, w: 140, h: 20 },
    { x: 1650, y: 250, w: 140, h: 20 },
    { x: 1850, y: 320, w: 150, h: 20 },
    { x: 2050, y: 380, w: 550, h: 70 },
    { x: 2200, y: 270, w: 140, h: 20 },
  ],
  items: [
    { type: "key1", x: 680, y: 130, collected: false },
    { type: "key2", x: 1460, y: 150, collected: false },
    { type: "key3", x: 2260, y: 230, collected: false },
  ],
  cats: [
    { x: 840, y: 236, minX: 820, maxX: 960, vx: 1.2, width: 28, height: 24, throwCooldown: 75, facing: "right", frame: 0 },
    { x: 1100, y: 356, minX: 1060, maxX: 1240, vx: 1.4, width: 28, height: 24, throwCooldown: 85, facing: "right", frame: 0 },
    { x: 1660, y: 226, minX: 1650, maxX: 1780, vx: -1.1, width: 28, height: 24, throwCooldown: 95, facing: "left", frame: 0 },
    { x: 2100, y: 356, minX: 2060, maxX: 2300, vx: 1.3, width: 28, height: 24, throwCooldown: 80, facing: "right", frame: 0 }
  ],
  gate: { x: 2450, y: 280, w: 60, h: 100, locked: true }
};

// Stage 3: Celebration Room
const celebration = {
  cake: { x: 400, y: 260, w: 140, h: 120 },
  candles: [
    { x: 430, y: 240, lit: true },
    { x: 470, y: 235, lit: true },
    { x: 510, y: 240, lit: true }
  ],
  boyfriend: { x: 280, y: 330, facing: "right" },
  girl: { x: 340, y: 330, facing: "left" },
  candlesBlown: false
};

// Drawing Helpers
function drawPixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

// Procedural Sprite Rendering
function drawCuteGirl(x, y, facing, frame) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  if (facing === "left") {
    ctx.scale(-1, 1);
    ctx.translate(-player.width, 0);
  }

  const bounce = (frame % 2 === 1 && player.vx !== 0) ? -2 : 0;

  // Shadow
  drawPixelRect(2, 38, 24, 4, "rgba(0,0,0,0.2)");

  // Hair Back
  drawPixelRect(2, 6 + bounce, 24, 22, "#4a2810");

  // Legs / Shoes
  const legOffset = (frame % 2 === 1 && player.vx !== 0) ? 3 : 0;
  drawPixelRect(6, 32, 6, 8 - legOffset, "#333");
  drawPixelRect(16, 32, 6, 8 + legOffset, "#333");
  drawPixelRect(4, 38, 8, 4, "#ff70a6");
  drawPixelRect(16, 38, 8, 4, "#ff70a6");

  // Dress
  drawPixelRect(5, 20 + bounce, 18, 14, "#ff85a1");
  drawPixelRect(3, 28 + bounce, 22, 6, "#ff6392");
  drawPixelRect(9, 20 + bounce, 10, 3, "#fff");

  // Head / Skin
  drawPixelRect(6, 4 + bounce, 16, 16, "#ffdfba");

  // Cheeks
  drawPixelRect(7, 14 + bounce, 3, 2, "#ff9ebb");
  drawPixelRect(18, 14 + bounce, 3, 2, "#ff9ebb");

  // Eyes
  drawPixelRect(10, 11 + bounce, 2, 4, "#2d3436");
  drawPixelRect(16, 11 + bounce, 2, 4, "#2d3436");
  drawPixelRect(11, 11 + bounce, 1, 2, "#fff");
  drawPixelRect(17, 11 + bounce, 1, 2, "#fff");

  // Hair Bangs & Front
  drawPixelRect(4, 2 + bounce, 20, 6, "#5c3317");
  drawPixelRect(4, 8 + bounce, 4, 8, "#5c3317");
  drawPixelRect(20, 8 + bounce, 4, 8, "#5c3317");

  // Ribbon Hairclip
  drawPixelRect(18, 2 + bounce, 6, 4, "#e63946");
  drawPixelRect(20, 1 + bounce, 2, 6, "#ff4d6d");

  // Invulnerability blink effect
  if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer / 4) % 2 === 0) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.fillRect(0, 0, player.width, player.height);
  }

  ctx.restore();
}

function drawBoyfriend(x, y, facing) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  if (facing === "left") {
    ctx.scale(-1, 1);
    ctx.translate(-player.width, 0);
  }
  drawPixelRect(2, 38, 24, 4, "rgba(0,0,0,0.2)");

  drawPixelRect(6, 32, 6, 8, "#1d3557");
  drawPixelRect(16, 32, 6, 8, "#1d3557");
  drawPixelRect(4, 38, 8, 4, "#2b2d42");
  drawPixelRect(16, 38, 8, 4, "#2b2d42");

  drawPixelRect(5, 19, 18, 14, "#457b9d");
  drawPixelRect(9, 19, 10, 4, "#a8dadc");

  drawPixelRect(6, 4, 16, 15, "#ffe3d1");

  drawPixelRect(11, 11, 2, 3, "#111");
  drawPixelRect(16, 11, 2, 3, "#111");
  drawPixelRect(13, 15, 3, 1, "#e63946");

  drawPixelRect(4, 1, 20, 6, "#1f2421");
  drawPixelRect(3, 4, 5, 6, "#1f2421");

  drawPixelRect(20, 24, 6, 6, "#ff4d6d");

  ctx.restore();
}

// Draw Walking Enemy NPC Cat
function drawEnemyCat(cat) {
  ctx.save();
  ctx.translate(Math.floor(cat.x), Math.floor(cat.y));
  if (cat.facing === "right") {
    ctx.scale(-1, 1);
    ctx.translate(-cat.width, 0);
  }

  const bounce = (Math.floor(cat.frame) % 2 === 1) ? -1 : 0;

  // Shadow
  drawPixelRect(2, 22, 24, 3, "rgba(0,0,0,0.25)");

  // Calico / Mischievous Dark Orange Body
  drawPixelRect(4, 8 + bounce, 18, 12, "#e76f51");
  drawPixelRect(8, 10 + bounce, 6, 6, "#f4a261"); // lighter belly patch

  // Head
  drawPixelRect(16, 4 + bounce, 12, 11, "#e76f51");

  // Pointy Ears
  drawPixelRect(18, 0 + bounce, 3, 4, "#d90429");
  drawPixelRect(25, 0 + bounce, 3, 4, "#d90429");

  // Sneaky / Angry Cat Eyes (glowing yellow/green with slit pupil)
  drawPixelRect(22, 7 + bounce, 3, 3, "#ffea00");
  drawPixelRect(23, 7 + bounce, 1, 3, "#111111");

  // Mischievous smirk / nose
  drawPixelRect(26, 9 + bounce, 2, 2, "#9d0208");

  // Legs walking
  const legShift = (Math.floor(cat.frame) % 2 === 1) ? 2 : -2;
  drawPixelRect(6 + legShift, 20, 4, 3, "#bc4749");
  drawPixelRect(14 - legShift, 20, 4, 3, "#bc4749");

  // Curved Tail wagging
  const tailBob = Math.sin(cat.frame * 0.4) * 2;
  drawPixelRect(1, 4 + bounce + tailBob, 3, 8, "#e76f51");
  drawPixelRect(0, 2 + bounce + tailBob, 3, 3, "#f4a261");

  // Poison aura / skull smoke above cat
  if (Math.floor(cat.frame * 0.5) % 2 === 0) {
    drawPixelRect(14, -6, 3, 3, "#a7c957");
    drawPixelRect(20, -8, 2, 2, "#70e000");
  }

  ctx.restore();
}

// Draw Flying Poison Claw Projectile
function drawPoisonClaw(claw) {
  ctx.save();
  ctx.translate(Math.floor(claw.x), Math.floor(claw.y));
  ctx.rotate(claw.rotation);

  // 3 Curved Poisonous Claws
  ctx.fillStyle = "#38b000"; // Toxic green glow
  ctx.fillRect(-6, -6, 12, 12);

  ctx.fillStyle = "#9ef01a";
  ctx.fillRect(-4, -4, 8, 8);

  ctx.fillStyle = "#ffffff";
  // 3 sharp claw tips
  ctx.fillRect(-5, -5, 2, 4);
  ctx.fillRect(-1, -6, 2, 5);
  ctx.fillRect(3, -5, 2, 4);

  ctx.restore();
}

function drawItemSprite(type, x, y, time) {
  const bob = Math.sin(time * 0.006) * 4;
  const drawY = y + bob;

  if (type === "boba") {
    drawPixelRect(x + 4, drawY + 6, 14, 16, "#f4a261");
    drawPixelRect(x + 2, drawY + 4, 18, 3, "#264653");
    drawPixelRect(x + 10, drawY - 2, 3, 7, "#e76f51");
    drawPixelRect(x + 6, drawY + 16, 3, 3, "#111");
    drawPixelRect(x + 11, drawY + 17, 3, 3, "#111");
    drawPixelRect(x + 8, drawY + 12, 3, 3, "#111");
  } else if (type === "flower") {
    drawPixelRect(x + 7, drawY + 12, 10, 10, "#d4a373");
    drawPixelRect(x + 4, drawY + 4, 7, 7, "#ff006e");
    drawPixelRect(x + 13, drawY + 4, 7, 7, "#ffbe0b");
    drawPixelRect(x + 9, drawY + 1, 6, 6, "#fb5607");
    drawPixelRect(x + 10, drawY + 9, 4, 4, "#55a630");
  } else if (type === "letter") {
    drawPixelRect(x + 2, drawY + 4, 20, 14, "#fdf0d5");
    drawPixelRect(x + 2, drawY + 4, 20, 2, "#c6ac8f");
    drawPixelRect(x + 9, drawY + 8, 6, 5, "#e63946");
  } else if (type === "cat") {
    drawPixelRect(x + 3, drawY + 8, 16, 12, "#ffffff");
    drawPixelRect(x + 4, drawY + 4, 4, 4, "#ffccd5");
    drawPixelRect(x + 14, drawY + 4, 4, 4, "#ffccd5");
    drawPixelRect(x + 7, drawY + 11, 2, 2, "#333");
    drawPixelRect(x + 13, drawY + 11, 2, 2, "#333");
    drawPixelRect(x + 10, drawY + 13, 2, 2, "#ff758f");
    drawPixelRect(x + 18, drawY + 12, 4, 6, "#fff");
  } else if (type.startsWith("key")) {
    drawPixelRect(x + 4, drawY + 4, 10, 10, "#ffb703");
    drawPixelRect(x + 6, drawY + 6, 6, 6, "#3a0ca3");
    drawPixelRect(x + 13, drawY + 8, 10, 4, "#ffb703");
    drawPixelRect(x + 19, drawY + 12, 4, 4, "#fb8500");
    drawPixelRect(x + 15, drawY + 12, 3, 3, "#fb8500");
  }

  if (Math.floor(time / 200) % 2 === 0) {
    drawPixelRect(x - 2, drawY - 2, 3, 3, "#fff");
    drawPixelRect(x + 22, drawY + 10, 2, 2, "#fff");
  }
}

function addSparkles(x, y, color = "#ff70a6", count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random();
    const speed = 1.5 + Math.random() * 3;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      color,
      size: 3 + Math.random() * 3,
      life: 35
    });
  }
}

function addFirework(x, y) {
  const colors = ["#ff007f", "#00f0ff", "#ffea00", "#70e000", "#ff5400", "#ffffff"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4.5;
    fireworks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: 3 + Math.random() * 2,
      life: 50 + Math.random() * 20
    });
  }
}

// Memory Popup Trigger
function showMemoryPopup(item) {
  const popup = document.getElementById("memoryPopup");
  const img = document.getElementById("popupImg");
  const caption = document.getElementById("popupCaption");

  if (popup && img && caption && item.photo) {
    img.src = item.photo;
    caption.textContent = item.name;
    popup.classList.remove("hidden");

    if (popupTimer) clearTimeout(popupTimer);
    popupTimer = setTimeout(() => {
      popup.classList.add("hidden");
    }, 1500);
  }
}

// Update game physics & interactions
function updateGame() {
  if (gameState !== "PLAYING") return;

  if (keys.left) {
    player.vx = -player.speed;
    player.facing = "left";
    player.frameTimer++;
  } else if (keys.right) {
    player.vx = player.speed;
    player.facing = "right";
    player.frameTimer++;
  } else {
    player.vx = 0;
    player.frameTimer = 0;
  }

  if (player.frameTimer > 8) {
    player.frame = (player.frame + 1) % 4;
    player.frameTimer = 0;
  }

  if (keys.up && player.grounded) {
    player.vy = player.jumpPower;
    player.grounded = false;
    audio.jump();
  }

  player.vy += 0.42;
  if (player.vy > 10) player.vy = 10;

  player.x += player.vx;
  player.y += player.vy;

  const currentStage = (currentLevel === 1) ? level1 : level2;
  player.grounded = false;

  for (let plat of currentStage.platforms) {
    if (
      player.x + player.width > plat.x &&
      player.x < plat.x + plat.w &&
      player.y + player.height >= plat.y &&
      player.y + player.height <= plat.y + 16 &&
      player.vy >= 0
    ) {
      player.y = plat.y - player.height;
      player.vy = 0;
      player.grounded = true;
    }
  }

  if (player.y > GAME_HEIGHT) {
    player.x = 60;
    player.y = 200;
    player.vy = 0;
  }

  if (player.invulnerableTimer > 0) {
    player.invulnerableTimer--;
  }

  // Update Cat NPCs (Patrol, Animate & Throw Poison Claws)
  if (currentStage.cats) {
    currentStage.cats.forEach(cat => {
      cat.x += cat.vx;
      cat.frame += 0.15;
      if (cat.x < cat.minX) {
        cat.x = cat.minX;
        cat.vx = Math.abs(cat.vx);
        cat.facing = "right";
      } else if (cat.x > cat.maxX) {
        cat.x = cat.maxX;
        cat.vx = -Math.abs(cat.vx);
        cat.facing = "left";
      }

      // Throw poisonous claws towards player if within range
      cat.throwCooldown--;
      const distToPlayer = Math.hypot((player.x + player.width / 2) - (cat.x + cat.width / 2), (player.y + player.height / 2) - (cat.y + cat.height / 2));
      if (distToPlayer < 400 && cat.throwCooldown <= 0) {
        cat.throwCooldown = 90 + Math.floor(Math.random() * 40);
        const dir = (player.x > cat.x) ? 1 : -1;
        cat.facing = (dir === 1) ? "right" : "left";
        catClaws.push({
          x: cat.x + cat.width / 2,
          y: cat.y + 6,
          vx: dir * (2.8 + Math.random() * 0.8),
          vy: -1.8 + (player.y - cat.y) * 0.008,
          rotation: 0,
          rotSpeed: dir * 0.2,
          life: 140
        });
        audio.clawWhoosh();
      }

      // Direct collision with cat
      if (player.invulnerableTimer <= 0) {
        if (
          player.x + player.width > cat.x &&
          player.x < cat.x + cat.width &&
          player.y + player.height > cat.y &&
          player.y < cat.y + cat.height
        ) {
          triggerPlayerHurt();
        }
      }
    });
  }

  // Update Poison Claws Projectiles
  for (let i = catClaws.length - 1; i >= 0; i--) {
    const claw = catClaws[i];
    claw.x += claw.vx;
    claw.y += claw.vy;
    claw.vy += 0.04;
    claw.rotation += claw.rotSpeed;
    claw.life--;

    // Toxic green sparkle trail
    if (Math.random() < 0.4) {
      particles.push({
        x: claw.x,
        y: claw.y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        color: "#70e000",
        size: 2.5,
        life: 15
      });
    }

    // Check hit player
    if (player.invulnerableTimer <= 0) {
      if (
        claw.x > player.x &&
        claw.x < player.x + player.width &&
        claw.y > player.y &&
        claw.y < player.y + player.height
      ) {
        triggerPlayerHurt();
        addSparkles(claw.x, claw.y, "#70e000", 10);
        catClaws.splice(i, 1);
        continue;
      }
    }

    if (claw.life <= 0 || claw.y > GAME_HEIGHT) {
      catClaws.splice(i, 1);
    }
  }

  const targetCamX = player.x - GAME_WIDTH / 2;
  cameraX += (targetCamX - cameraX) * 0.1;
  cameraX = Math.max(0, Math.min(cameraX, currentStage.width - GAME_WIDTH));

  currentStage.items.forEach(item => {
    if (!item.collected) {
      const dist = Math.hypot((player.x + player.width / 2) - (item.x + 12), (player.y + player.height / 2) - (item.y + 12));
      if (dist < 28) {
        item.collected = true;
        addSparkles(item.x + 12, item.y + 12);
        
        const confItem = CONFIG.collectibles.find(c => c.type === item.type);
        if (confItem) {
          showFloatingNote(confItem.name + ": " + confItem.note);
          showMemoryPopup(confItem);
        }

        if (item.type.startsWith("key")) {
          keysCount++;
          audio.key();
          if (keysCount >= keysNeeded && currentStage.gate) {
            currentStage.gate.locked = false;
            showFloatingNote("Semua kunci terkumpul! Gerbang terbuka!");
          }
        } else {
          audio.collect();
          collectedItems.push(item.type);
        }
      }
    }
  });

  if (currentLevel === 1) {
    const p = level1.portal;
    if (player.x + player.width > p.x && player.x < p.x + p.w && player.y + player.height > p.y) {
      currentLevel = 2;
      player.x = 60;
      player.y = 250;
      catClaws = [];
      cameraX = 0;
      showFloatingNote("STAGE 2: Temukan 3 Kunci Emas! Awas kucing jahil bertambah! 🐱⚡");
      audio.key();
    }
  }

  if (currentLevel === 2) {
    const g = level2.gate;
    if (player.x + player.width > g.x && player.x < g.x + g.w && player.y + player.height > g.y) {
      if (!g.locked) {
        enterCelebration();
      } else {
        showFloatingNote("Gerbang terkunci! Kumpulkan 3 Kunci Emas dulu!");
      }
    }
  }
}

function triggerPlayerHurt() {
  player.invulnerableTimer = 60; // 1 second invulnerability
  audio.hurt();
  showFloatingNote("Aww! Kena cakar kuku beracun! Hati-hati sayang! 🐾⚡");

  // Knockback opposite to facing direction
  player.vy = -5.5;
  player.vx = (player.facing === "right") ? -4 : 4;

  // Hurt sparkles
  addSparkles(player.x + player.width / 2, player.y + player.height / 2, "#9ef01a", 16);
}

function showFloatingNote(text) {
  activeMessage = text;
  messageTimer = 220;
}

function enterCelebration() {
  gameState = "WON";
  catClaws = [];
  document.getElementById("celebrationUI").classList.remove("hidden");
  audio.playHappyBirthdayTune();

  setInterval(() => {
    if (gameState === "WON") {
      addFirework(150 + Math.random() * 500, 80 + Math.random() * 150);
    }
  }, 500);
}

function drawPhotoCloud(cloud, time) {
  const totalWorldWidth = 2800;
  const screenX = ((cloud.x - cameraX * 0.35) % totalWorldWidth + totalWorldWidth) % totalWorldWidth - 150;
  if (screenX < -200 || screenX > GAME_WIDTH + 150) return;

  const bob = Math.sin(time * 0.002 + cloud.bobPhase) * 6;
  const drawY = cloud.y + bob;

  ctx.save();
  ctx.translate(screenX, drawY);
  ctx.scale(cloud.scale, cloud.scale);

  // Soft glowing white cloud puffs
  ctx.fillStyle = "rgba(255, 255, 255, 0.93)";
  ctx.beginPath();
  ctx.arc(-38, 8, 28, 0, Math.PI * 2);
  ctx.arc(-12, -12, 32, 0, Math.PI * 2);
  ctx.arc(22, -14, 34, 0, Math.PI * 2);
  ctx.arc(52, 8, 26, 0, Math.PI * 2);
  ctx.arc(8, 16, 30, 0, Math.PI * 2);
  ctx.fill();

  // Photo circle frame in center of cloud
  const img = photoImages[cloud.photoIndex % photoImages.length];
  const photoRadius = 24;
  const photoCenterX = 5;
  const photoCenterY = 2;

  // Gold & pink border around photo
  ctx.beginPath();
  ctx.arc(photoCenterX, photoCenterY, photoRadius + 3, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd166";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ff70a6";
  ctx.stroke();

  // Clipped circular photo
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
    ctx.clip();
    
    const sDim = Math.min(img.naturalWidth, img.naturalHeight);
    const sX = (img.naturalWidth - sDim) / 2;
    const sY = (img.naturalHeight - sDim) / 2;
    ctx.drawImage(img, sX, sY, sDim, sDim, photoCenterX - photoRadius, photoCenterY - photoRadius, photoRadius * 2, photoRadius * 2);
    ctx.restore();
  }

  // Cute heart icon
  ctx.fillStyle = "#ff0054";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("❤️", photoCenterX + 14, photoCenterY - 14);

  ctx.restore();
}

function renderBackground(time = performance.now()) {
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  grad.addColorStop(0, "#ffe5ec");
  grad.addColorStop(0.6, "#ffcad4");
  grad.addColorStop(1, "#b5e2fa");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Background distant clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  for (let i = 0; i < 5; i++) {
    const cx = ((i * 450 - cameraX * 0.15) % (GAME_WIDTH + 200)) - 100;
    const cy = 40 + (i % 2) * 50;
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.arc(cx + 20, cy - 8, 20, 0, Math.PI * 2);
    ctx.arc(cx + 40, cy, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  // Floating Photo Clouds
  floatingClouds.forEach(cloud => {
    drawPhotoCloud(cloud, time);
  });
}

function renderWorld() {
  ctx.save();
  ctx.translate(-Math.floor(cameraX), 0);

  const stage = (currentLevel === 1) ? level1 : level2;

  for (let plat of stage.platforms) {
    drawPixelRect(plat.x, plat.y, plat.w, 6, "#6a994e");
    drawPixelRect(plat.x, plat.y + 6, plat.w, plat.h - 6, "#8c6239");
    for (let dx = 20; dx < plat.w; dx += 60) {
      drawPixelRect(plat.x + dx, plat.y - 4, 4, 4, "#ffb703");
      drawPixelRect(plat.x + dx + 1, plat.y - 6, 2, 2, "#e63946");
    }
  }

  const now = performance.now();
  for (let item of stage.items) {
    if (!item.collected) {
      drawItemSprite(item.type, item.x, item.y, now);
    }
  }

  if (currentLevel === 1) {
    const p = level1.portal;
    drawPixelRect(p.x, p.y, p.w, p.h, "#9b5de5");
    drawPixelRect(p.x + 6, p.y + 6, p.w - 12, p.h - 12, "#f15bb5");
    ctx.fillStyle = "#fff";
    ctx.font = "10px monospace";
    ctx.fillText("NEXT", p.x + 12, p.y - 10);
  } else if (currentLevel === 2) {
    const g = level2.gate;
    const gateCol = g.locked ? "#d90429" : "#38b000";
    drawPixelRect(g.x, g.y, g.w, g.h, gateCol);
    drawPixelRect(g.x + 8, g.y + 8, g.w - 16, g.h - 16, "#ffe3e0");
    drawPixelRect(g.x + 20, g.y + 30, 20, 20, g.locked ? "#8d99ae" : "#ff0054");
    ctx.fillStyle = "#fff";
    ctx.font = "10px monospace";
    ctx.fillText(g.locked ? `LOCKED (${keysCount}/3)` : "OPEN!", g.x - 5, g.y - 12);
  }

  // Draw Enemy NPC Cats
  if (stage.cats) {
    stage.cats.forEach(cat => {
      drawEnemyCat(cat);
    });
  }

  // Draw Poison Claws
  catClaws.forEach(claw => {
    drawPoisonClaw(claw);
  });

  drawCuteGirl(player.x, player.y, player.facing, player.frame);

  ctx.restore();
}

function renderCelebration() {
  ctx.fillStyle = "#fefae0";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  drawPixelRect(0, 370, GAME_WIDTH, 80, "#dda15e");
  const colors = ["#ff70a6", "#70d6ff", "#ffd670", "#e9ff70", "#ff9770"];
  for (let i = 0; i < GAME_WIDTH; i += 30) {
    const col = colors[(i / 30) % colors.length];
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(i, 20);
    ctx.lineTo(i + 30, 20);
    ctx.lineTo(i + 15, 45);
    ctx.closePath();
    ctx.fill();
  }

  const cake = celebration.cake;
  drawPixelRect(cake.x - 20, cake.y + 50, cake.w + 40, 60, "#ffb4a2");
  drawPixelRect(cake.x - 20, cake.y + 50, cake.w + 40, 10, "#ffffff");
  drawPixelRect(cake.x + 10, cake.y, cake.w - 20, 50, "#e5989b");
  drawPixelRect(cake.x + 10, cake.y, cake.w - 20, 10, "#ffffff");
  for (let sx = cake.x + 18; sx < cake.x + cake.w - 10; sx += 22) {
    drawPixelRect(sx, cake.y - 6, 8, 8, "#d90429");
  }

  celebration.candles.forEach((c) => {
    drawPixelRect(c.x, c.y, 8, 25, "#ffe6a7");
    if (c.lit) {
      const flicker = Math.sin(performance.now() * 0.02 + c.x) * 2;
      drawPixelRect(c.x + 1 + flicker * 0.5, c.y - 12, 6, 10, "#ff9e00");
      drawPixelRect(c.x + 2 + flicker * 0.5, c.y - 9, 4, 6, "#ff0000");
      drawPixelRect(c.x + 3, c.y - 6, 2, 3, "#ffffff");
    } else {
      drawPixelRect(c.x + 3, c.y - 4, 2, 4, "#555");
    }
  });

  drawBoyfriend(celebration.boyfriend.x, celebration.boyfriend.y, "right");
  drawCuteGirl(celebration.girl.x, celebration.girl.y, "left", 0);

  const pulse = Math.sin(performance.now() * 0.005) * 4;
  drawPixelRect(310 - pulse / 2, 280 - pulse / 2, 20 + pulse, 20 + pulse, "#ff0054");

  ctx.fillStyle = "#2b2d42";
  ctx.font = "bold 14px 'Courier New', monospace";
  ctx.textAlign = "center";
  if (!celebration.candlesBlown) {
    ctx.fillText("✨ KLIK LILIN DI ATAS KUE UNTUK TIUP LILIN! ✨", GAME_WIDTH / 2, 120);
  } else {
    ctx.fillText("🎉 SELAMAT ULANG TAHUN SAYANG! 🎉", GAME_WIDTH / 2, 120);
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const f = fireworks[i];
    f.x += f.vx;
    f.y += f.vy;
    f.vy += 0.05;
    f.life--;
    if (f.life <= 0) fireworks.splice(i, 1);
  }
}

function renderParticles() {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    drawPixelRect(p.x, p.y, p.size, p.size, p.color);
  }

  for (let i = 0; i < fireworks.length; i++) {
    const f = fireworks[i];
    drawPixelRect(f.x, f.y, f.size, f.size, f.color);
  }
}

function renderHUD() {
  if (gameState !== "PLAYING") return;

  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(10, 10, GAME_WIDTH - 20, 36);

  ctx.fillStyle = "#fff";
  ctx.font = "12px 'Courier New', monospace";
  ctx.textAlign = "left";

  const stageText = currentLevel === 1 ? "STAGE 1: Memory Lane" : "STAGE 2: Golden Keys";
  ctx.fillText(stageText, 24, 32);

  if (currentLevel === 1) {
    ctx.fillText(`Memori: ${collectedItems.length}/4`, 220, 32);
  } else {
    ctx.fillText(`Kunci Emas: ${keysCount}/3`, 220, 32);
  }

  ctx.textAlign = "right";
  ctx.fillText(`Ultah: ${CONFIG.birthdayDate}`, GAME_WIDTH - 24, 32);

  if (activeMessage && messageTimer > 0) {
    messageTimer--;
    const alpha = Math.min(1, messageTimer / 30);
    ctx.fillStyle = `rgba(38, 70, 83, ${0.85 * alpha})`;
    ctx.fillRect(40, GAME_HEIGHT - 60, GAME_WIDTH - 80, 40);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = "bold 13px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(activeMessage, GAME_WIDTH / 2, GAME_HEIGHT - 35);
  }
}

canvas.addEventListener("click", (e) => {
  if (gameState === "INTRO") {
    startGame();
    return;
  }

  if (gameState === "WON") {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    celebration.candles.forEach(c => {
      if (Math.hypot(mouseX - (c.x + 4), mouseY - (c.y + 10)) < 40) {
        c.lit = false;
        audio.blowCandle();
        addSparkles(c.x + 4, c.y, "#ffffff", 20);
      }
    });

    const allBlown = celebration.candles.every(c => !c.lit);
    if (allBlown && !celebration.candlesBlown) {
      celebration.candlesBlown = true;
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          addFirework(200 + Math.random() * 400, 100 + Math.random() * 100);
        }, i * 300);
      }
      setTimeout(() => {
        openBirthdayLetter();
      }, 1200);
    }
  }
});

function openBirthdayLetter() {
  const modal = document.getElementById("letterModal");
  modal.classList.remove("hidden");
  switchTab("letter");
}

function startGame() {
  gameState = "PLAYING";
  document.getElementById("startOverlay").classList.add("hidden");
  audio.startBGM();
  showFloatingNote("Gunakan Tombol Panah / WASD untuk jalan dan melompat!");
}

let lastFrameTime = performance.now();
let accumulator = 0;
const FIXED_STEP = 1000 / 60; // Standard 60 FPS physics

function loop(currentTime = performance.now()) {
  let elapsed = currentTime - lastFrameTime;
  lastFrameTime = currentTime;

  if (elapsed > 100) elapsed = 100;
  if (elapsed < 0) elapsed = 0;

  accumulator += elapsed;

  while (accumulator >= FIXED_STEP) {
    if (gameState === "PLAYING" || gameState === "INTRO") {
      updateGame();
      floatingClouds.forEach(c => {
        c.x -= c.speed;
        if (c.x < -200) c.x += 2800;
      });
    }
    updateParticles();
    accumulator -= FIXED_STEP;
  }

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (gameState === "PLAYING" || gameState === "INTRO") {
    renderBackground(currentTime);
    renderWorld();
    renderHUD();
  } else if (gameState === "WON") {
    renderCelebration();
  }

  renderParticles();
  requestAnimationFrame(loop);
}

// Keyboard controls
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
  if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
    keys.up = true;
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
  if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") keys.up = false;
});

// Mobile Onscreen Buttons
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnJump = document.getElementById("btnJump");

if (btnLeft) {
  const setupTouch = (el, keyName) => {
    el.addEventListener("touchstart", (e) => { e.preventDefault(); keys[keyName] = true; });
    el.addEventListener("touchend", (e) => { e.preventDefault(); keys[keyName] = false; });
    el.addEventListener("mousedown", () => { keys[keyName] = true; });
    el.addEventListener("mouseup", () => { keys[keyName] = false; });
  };
  setupTouch(btnLeft, "left");
  setupTouch(btnRight, "right");
  setupTouch(btnJump, "up");
}

// Mute toggle
const btnMute = document.getElementById("btnMute");
if (btnMute) {
  btnMute.addEventListener("click", () => {
    const isMuted = audio.toggleMute();
    btnMute.textContent = isMuted ? "🔇 Unmute" : "🔊 Sound ON";
  });
}

// Modal Tabs
function switchTab(tab) {
  const tabs = ["letter", "gallery", "videos"];
  tabs.forEach(t => {
    const el = document.getElementById("tab" + t.charAt(0).toUpperCase() + t.slice(1));
    const btn = document.getElementById("tab" + t.charAt(0).toUpperCase() + t.slice(1) + "Btn");
    if (el) el.classList.toggle("hidden", t !== tab);
    if (btn) btn.classList.toggle("active", t === tab);
  });
}

// Populate Letter, Gallery, and Videos Content from Config
function initLetterDOM() {
  document.getElementById("letterTitle").textContent = CONFIG.letter.title;
  document.getElementById("letterDate").textContent = CONFIG.letter.date;
  
  const container = document.getElementById("letterParagraphs");
  container.innerHTML = "";
  CONFIG.letter.paragraphs.forEach(p => {
    const pElem = document.createElement("p");
    pElem.textContent = p;
    container.appendChild(pElem);
  });

  document.getElementById("letterSender").textContent = `${CONFIG.letter.closing}\n${CONFIG.letter.sender}`;

  // Gallery
  const galleryGrid = document.getElementById("galleryGrid");
  if (galleryGrid) {
    galleryGrid.innerHTML = "";
    CONFIG.gallery.forEach((photoUrl, idx) => {
      const card = document.createElement("div");
      card.className = "gallery-polaroid";
      card.innerHTML = `<img src="${photoUrl}" alt="Photo ${idx + 1}" loading="lazy">`;
      galleryGrid.appendChild(card);
    });
  }

  // Videos
  const videosContainer = document.getElementById("videosContainer");
  if (videosContainer) {
    videosContainer.innerHTML = "";
    CONFIG.videos.forEach(v => {
      const card = document.createElement("div");
      card.className = "video-card";
      card.innerHTML = `
        <h4>🎬 ${v.title}</h4>
        <video controls playsinline preload="metadata">
          <source src="${v.src}" type="video/mp4">
          Browser kamu tidak mendukung video.
        </video>
      `;
      videosContainer.appendChild(card);
    });
  }

  const waBtn = document.getElementById("btnClaimWA");
  if (waBtn) {
    waBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappText)}`;
  }
}

// Start loop
initLetterDOM();
requestAnimationFrame(loop);
