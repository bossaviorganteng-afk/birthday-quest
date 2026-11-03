// ==========================================
// BIRTHDAY QUEST - MAIN GAME ENGINE
// ==========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Responsive game resolution
const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

let gameState = "INTRO"; // INTRO, PLAYING, WON
let currentLevel = 1;
let collectedItems = [];
let keysCount = 0;
let keysNeeded = 3;
let activeMessage = null;
let messageTimer = 0;

// Camera
let cameraX = 0;

// Particles
let particles = [];
let fireworks = [];

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
  frameTimer: 0
};

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

  // Dress (Cute Pink Pastel)
  drawPixelRect(5, 20 + bounce, 18, 14, "#ff85a1");
  drawPixelRect(3, 28 + bounce, 22, 6, "#ff6392");
  // Collar
  drawPixelRect(9, 20 + bounce, 10, 3, "#fff");

  // Head / Skin
  drawPixelRect(6, 4 + bounce, 16, 16, "#ffdfba");

  // Cheeks (blush)
  drawPixelRect(7, 14 + bounce, 3, 2, "#ff9ebb");
  drawPixelRect(18, 14 + bounce, 3, 2, "#ff9ebb");

  // Eyes (Big cute pixel eyes)
  drawPixelRect(10, 11 + bounce, 2, 4, "#2d3436");
  drawPixelRect(16, 11 + bounce, 2, 4, "#2d3436");
  drawPixelRect(11, 11 + bounce, 1, 2, "#fff");
  drawPixelRect(17, 11 + bounce, 1, 2, "#fff");

  // Hair Bangs & Front
  drawPixelRect(4, 2 + bounce, 20, 6, "#5c3317");
  drawPixelRect(4, 8 + bounce, 4, 8, "#5c3317");
  drawPixelRect(20, 8 + bounce, 4, 8, "#5c3317");

  // Cute Red/Pink Ribbon Hairclip
  drawPixelRect(18, 2 + bounce, 6, 4, "#e63946");
  drawPixelRect(20, 1 + bounce, 2, 6, "#ff4d6d");

  ctx.restore();
}

function drawBoyfriend(x, y, facing) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  if (facing === "left") {
    ctx.scale(-1, 1);
    ctx.translate(-player.width, 0);
  }
  // Shadow
  drawPixelRect(2, 38, 24, 4, "rgba(0,0,0,0.2)");

  // Legs & Shoes
  drawPixelRect(6, 32, 6, 8, "#1d3557");
  drawPixelRect(16, 32, 6, 8, "#1d3557");
  drawPixelRect(4, 38, 8, 4, "#2b2d42");
  drawPixelRect(16, 38, 8, 4, "#2b2d42");

  // Hoodie / Jacket (Navy/Teal)
  drawPixelRect(5, 19, 18, 14, "#457b9d");
  drawPixelRect(9, 19, 10, 4, "#a8dadc");

  // Head / Skin
  drawPixelRect(6, 4, 16, 15, "#ffe3d1");

  // Eyes & Smile
  drawPixelRect(11, 11, 2, 3, "#111");
  drawPixelRect(16, 11, 2, 3, "#111");
  drawPixelRect(13, 15, 3, 1, "#e63946");

  // Hair (Dark wavy hair)
  drawPixelRect(4, 1, 20, 6, "#1f2421");
  drawPixelRect(3, 4, 5, 6, "#1f2421");

  // Holding Flowers / Heart
  drawPixelRect(20, 24, 6, 6, "#ff4d6d");

  ctx.restore();
}

// Draw Collectible Sprites
function drawItemSprite(type, x, y, time) {
  const bob = Math.sin(time * 0.006) * 4;
  const drawY = y + bob;

  if (type === "boba") {
    // Cup
    drawPixelRect(x + 4, drawY + 6, 14, 16, "#f4a261");
    // Milk tea top & lid
    drawPixelRect(x + 2, drawY + 4, 18, 3, "#264653");
    // Straw
    drawPixelRect(x + 10, drawY - 2, 3, 7, "#e76f51");
    // Pearls
    drawPixelRect(x + 6, drawY + 16, 3, 3, "#111");
    drawPixelRect(x + 11, drawY + 17, 3, 3, "#111");
    drawPixelRect(x + 8, drawY + 12, 3, 3, "#111");
  } else if (type === "flower") {
    // Bouquet wrap
    drawPixelRect(x + 7, drawY + 12, 10, 10, "#d4a373");
    // Flowers
    drawPixelRect(x + 4, drawY + 4, 7, 7, "#ff006e");
    drawPixelRect(x + 13, drawY + 4, 7, 7, "#ffbe0b");
    drawPixelRect(x + 9, drawY + 1, 6, 6, "#fb5607");
    // Stems
    drawPixelRect(x + 10, drawY + 9, 4, 4, "#55a630");
  } else if (type === "letter") {
    // Envelope
    drawPixelRect(x + 2, drawY + 4, 20, 14, "#fdf0d5");
    drawPixelRect(x + 2, drawY + 4, 20, 2, "#c6ac8f");
    // Heart seal
    drawPixelRect(x + 9, drawY + 8, 6, 5, "#e63946");
  } else if (type === "cat") {
    // White Cat body
    drawPixelRect(x + 3, drawY + 8, 16, 12, "#ffffff");
    // Ears
    drawPixelRect(x + 4, drawY + 4, 4, 4, "#ffccd5");
    drawPixelRect(x + 14, drawY + 4, 4, 4, "#ffccd5");
    // Face
    drawPixelRect(x + 7, drawY + 11, 2, 2, "#333");
    drawPixelRect(x + 13, drawY + 11, 2, 2, "#333");
    drawPixelRect(x + 10, drawY + 13, 2, 2, "#ff758f");
    // Tail
    drawPixelRect(x + 18, drawY + 12, 4, 6, "#fff");
  } else if (type.startsWith("key")) {
    // Golden Key
    drawPixelRect(x + 4, drawY + 4, 10, 10, "#ffb703");
    drawPixelRect(x + 6, drawY + 6, 6, 6, "#3a0ca3"); // ring hole
    drawPixelRect(x + 13, drawY + 8, 10, 4, "#ffb703");
    drawPixelRect(x + 19, drawY + 12, 4, 4, "#fb8500");
    drawPixelRect(x + 15, drawY + 12, 3, 3, "#fb8500");
  }

  // Sparkles around item
  if (Math.floor(time / 200) % 2 === 0) {
    drawPixelRect(x - 2, drawY - 2, 3, 3, "#fff");
    drawPixelRect(x + 22, drawY + 10, 2, 2, "#fff");
  }
}

// Particle System
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

// Update game physics & interactions
function updateGame() {
  if (gameState !== "PLAYING") return;

  // Horizontal movement
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

  // Jumping
  if (keys.up && player.grounded) {
    player.vy = player.jumpPower;
    player.grounded = false;
    audio.jump();
  }

  // Gravity
  player.vy += 0.42;
  if (player.vy > 10) player.vy = 10;

  player.x += player.vx;
  player.y += player.vy;

  // Collision with platforms
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

  // Bottom bounds / Pit safety (respawn on platform)
  if (player.y > GAME_HEIGHT) {
    player.x = 60;
    player.y = 200;
    player.vy = 0;
  }

  // Camera follows player
  const targetCamX = player.x - GAME_WIDTH / 2;
  cameraX += (targetCamX - cameraX) * 0.1;
  cameraX = Math.max(0, Math.min(cameraX, currentStage.width - GAME_WIDTH));

  // Collectibles check
  const now = performance.now();
  currentStage.items.forEach(item => {
    if (!item.collected) {
      const dist = Math.hypot((player.x + player.width / 2) - (item.x + 12), (player.y + player.height / 2) - (item.y + 12));
      if (dist < 28) {
        item.collected = true;
        addSparkles(item.x + 12, item.y + 12);
        
        const confItem = CONFIG.collectibles.find(c => c.type === item.type);
        if (confItem) {
          showFloatingNote(confItem.name + ": " + confItem.note);
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

  // Level 1 Portal to Level 2
  if (currentLevel === 1) {
    const p = level1.portal;
    if (player.x + player.width > p.x && player.x < p.x + p.w && player.y + player.height > p.y) {
      currentLevel = 2;
      player.x = 60;
      player.y = 250;
      cameraX = 0;
      showFloatingNote("STAGE 2: Temukan 3 Kunci Emas untuk membuka Gerbang Ultah!");
      audio.key();
    }
  }

  // Level 2 Gate to Celebration Stage
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

function showFloatingNote(text) {
  activeMessage = text;
  messageTimer = 220; // frames
}

function enterCelebration() {
  gameState = "WON";
  document.getElementById("celebrationUI").classList.remove("hidden");
  audio.playHappyBirthdayTune();

  // Periodic fireworks
  setInterval(() => {
    if (gameState === "WON") {
      addFirework(150 + Math.random() * 500, 80 + Math.random() * 150);
    }
  }, 500);
}

// Render background & scenery
function renderBackground() {
  // Pastel sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  grad.addColorStop(0, "#ffe5ec");
  grad.addColorStop(0.6, "#ffcad4");
  grad.addColorStop(1, "#b5e2fa");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Parallax Clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  for (let i = 0; i < 8; i++) {
    const cx = ((i * 350 - cameraX * 0.3) % (GAME_WIDTH + 200)) - 100;
    const cy = 60 + (i % 3) * 40;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.arc(cx + 25, cy - 10, 25, 0, Math.PI * 2);
    ctx.arc(cx + 50, cy, 30, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Render World
function renderWorld() {
  ctx.save();
  ctx.translate(-Math.floor(cameraX), 0);

  const stage = (currentLevel === 1) ? level1 : level2;

  // Platforms
  for (let plat of stage.platforms) {
    // Top Grass layer
    drawPixelRect(plat.x, plat.y, plat.w, 6, "#6a994e");
    // Dirt/Stone body
    drawPixelRect(plat.x, plat.y + 6, plat.w, plat.h - 6, "#8c6239");
    // Cute flowers/decor on grass
    for (let dx = 20; dx < plat.w; dx += 60) {
      drawPixelRect(plat.x + dx, plat.y - 4, 4, 4, "#ffb703");
      drawPixelRect(plat.x + dx + 1, plat.y - 6, 2, 2, "#e63946");
    }
  }

  // Items
  const now = performance.now();
  for (let item of stage.items) {
    if (!item.collected) {
      drawItemSprite(item.type, item.x, item.y, now);
    }
  }

  // Portal or Gate
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
    // Big Heart on gate
    drawPixelRect(g.x + 20, g.y + 30, 20, 20, g.locked ? "#8d99ae" : "#ff0054");
    ctx.fillStyle = "#fff";
    ctx.font = "10px monospace";
    ctx.fillText(g.locked ? `LOCKED (${keysCount}/3)` : "OPEN!", g.x - 5, g.y - 12);
  }

  // Draw Player
  drawCuteGirl(player.x, player.y, player.facing, player.frame);

  ctx.restore();
}

// Render Celebration Stage
function renderCelebration() {
  // Cozy room background
  ctx.fillStyle = "#fefae0";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Floor
  drawPixelRect(0, 370, GAME_WIDTH, 80, "#dda15e");
  // Wall garlands / Buntings
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

  // Giant Birthday Cake
  const cake = celebration.cake;
  // Tier 1 (bottom)
  drawPixelRect(cake.x - 20, cake.y + 50, cake.w + 40, 60, "#ffb4a2");
  drawPixelRect(cake.x - 20, cake.y + 50, cake.w + 40, 10, "#ffffff"); // icing
  // Tier 2 (top)
  drawPixelRect(cake.x + 10, cake.y, cake.w - 20, 50, "#e5989b");
  drawPixelRect(cake.x + 10, cake.y, cake.w - 20, 10, "#ffffff"); // icing
  // Cherries & Strawberries
  for (let sx = cake.x + 18; sx < cake.x + cake.w - 10; sx += 22) {
    drawPixelRect(sx, cake.y - 6, 8, 8, "#d90429");
  }

  // Candles
  celebration.candles.forEach((c) => {
    drawPixelRect(c.x, c.y, 8, 25, "#ffe6a7");
    if (c.lit) {
      // Candle Flame Animation
      const flicker = Math.sin(performance.now() * 0.02 + c.x) * 2;
      drawPixelRect(c.x + 1 + flicker * 0.5, c.y - 12, 6, 10, "#ff9e00");
      drawPixelRect(c.x + 2 + flicker * 0.5, c.y - 9, 4, 6, "#ff0000");
      drawPixelRect(c.x + 3, c.y - 6, 2, 3, "#ffffff");
    } else {
      // Candle wick (smoke)
      drawPixelRect(c.x + 3, c.y - 4, 2, 4, "#555");
    }
  });

  // Boyfriend & Girl together
  drawBoyfriend(celebration.boyfriend.x, celebration.boyfriend.y, "right");
  drawCuteGirl(celebration.girl.x, celebration.girl.y, "left", 0);

  // Big Heart above couple
  const pulse = Math.sin(performance.now() * 0.005) * 4;
  drawPixelRect(310 - pulse / 2, 280 - pulse / 2, 20 + pulse, 20 + pulse, "#ff0054");

  // Instruction banner
  ctx.fillStyle = "#2b2d42";
  ctx.font = "bold 14px 'Courier New', monospace";
  ctx.textAlign = "center";
  if (!celebration.candlesBlown) {
    ctx.fillText("✨ KLIK LILIN DI ATAS KUE UNTUK TIUP LILIN! ✨", GAME_WIDTH / 2, 120);
  } else {
    ctx.fillText("🎉 SELAMAT ULANG TAHUN SAYANG! 🎉", GAME_WIDTH / 2, 120);
  }
}

// Particle rendering
function renderParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    drawPixelRect(p.x, p.y, p.size, p.size, p.color);
    if (p.life <= 0) particles.splice(i, 1);
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const f = fireworks[i];
    f.x += f.vx;
    f.y += f.vy;
    f.vy += 0.05; // gravity
    f.life--;
    drawPixelRect(f.x, f.y, f.size, f.size, f.color);
    if (f.life <= 0) fireworks.splice(i, 1);
  }
}

// HUD Overlay
function renderHUD() {
  if (gameState !== "PLAYING") return;

  // Level & Items Status Bar
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

  // Floating Notification Note
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

// Candle Click Handler
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

    // Check if clicked near candles
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
}

function startGame() {
  gameState = "PLAYING";
  document.getElementById("startOverlay").classList.add("hidden");
  audio.startBGM();
  showFloatingNote("Gunakan Tombol Panah / WASD untuk jalan dan melompat!");
}

// Game Loop
function loop() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (gameState === "PLAYING" || gameState === "INTRO") {
    renderBackground();
    updateGame();
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

// Populate Letter Content from Config
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

  const waBtn = document.getElementById("btnClaimWA");
  if (waBtn) {
    waBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappText)}`;
  }
}

// Start loop
initLetterDOM();
requestAnimationFrame(loop);
