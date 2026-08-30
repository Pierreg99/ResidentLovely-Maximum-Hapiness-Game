import { scene, renderer, updateParticles, spawnConfetti, updateStardust, updatePetals, updateSceneLighting } from './world/scene.js';
import { rooms, initRooms, lanternMeshes, groundItems, spawnGroundItem, updateGroundItems } from './world/rooms.js';
import { SECTOR_REGISTRY, getSector } from './world/sectors.js';
import { BackdropManager, createSectorBackdrop } from './world/backdrops.js';
import { surfaceShaderManager, createPostProcessingPipeline } from './world/shaders/surface-shaders.js';
import { destructibles, initDestructibles, updateDestructibles } from './world/destructibles.js';
import { player, initPlayer, updatePlayer, performQuickTurn } from './entities/player.js';
import { grumps, initGrumps, updateGrumps } from './entities/grump.js';
import { initBoss, bossInstance, masterChefBoss } from './entities/boss.js';
import { companionSquad } from './entities/companion.js';
import { triggerWeaponFire, updateProjectiles, updateTargetSights } from './weapons/arsenal.js';
import { audio } from './engine/audio.js';
import { CameraController } from './engine/camera.js';
import { initInput } from './engine/input.js';
import { InventorySystem, ITEMS_DB } from './systems/inventory.js';
import { QuestSystem, QUESTS } from './systems/quests.js';
import { MinimapSystem } from './systems/minimap.js';
import { PersistenceSystem, loadGame } from './systems/persistence.js';

// Global Game State
const gameState = {
  joy: 100,
  room: 'foyer',
  unlockedDoors: { library: false, garden: false, greenhouse: true, observatory: true, clocktower: true, lab: true },
  currentWeapon: 'pistol',
  inventory: [
    { id: 'herb_green', qty: 2 },
    { id: 'powder_red', qty: 1 },
    { id: 'ribbon_gold', qty: 1 },
    null, null, null, null, null
  ],
  selectedSlot: null,
  combineSourceSlot: null,
  pianoSequence: [],
  pianoSolved: false,
  sugarValveSequence: [],
  sugarValvesEqualized: false,
  chefCalmed: false,
  cauldronFed: false,
  astrolabeSolved: false,
  clockSolved: false,
  dynamoActive: false,
  grumpsUpliftedCount: 0,
  totalGrumps: 10
};

// v4.0.0 Graphic Subsystems — lazy-initialised on first animate frame
let backdropManager = null;
let postProcessingComposer = null;
let _graphicsReady = false;

const _initGraphics = () => {
  if (_graphicsReady) return;
  _graphicsReady = true;
  try {
    backdropManager = createSectorBackdrop('S01', { scene });
  } catch (e) {
    console.warn('[v4.0.0] BackdropManager init failed (graceful degradation):', e.message);
    backdropManager = null;
  }
  try {
    postProcessingComposer = createPostProcessingPipeline(renderer, scene, null, {
      bloomStrength: 0.65,
      bloomRadius: 0.4,
      bloomThreshold: 0.72
    });
  } catch (e) {
    // EffectComposer not bundled in Three.js r128 CDN — graceful degradation
    postProcessingComposer = null;
  }
};

// Toast notification helper
const toastMsg = document.getElementById('toast-msg');
let toastTimeout = null;

function showToast(text) {
  toastMsg.textContent = text;
  toastMsg.style.opacity = '1';
  toastMsg.style.transform = 'translate(-50%, 0)';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMsg.style.opacity = '0';
    toastMsg.style.transform = 'translate(-50%, -10px)';
  }, 3000);
}

// Subsystem Initializations
const cameraController = new CameraController();
const questSystem = new QuestSystem();

const inventorySystem = new InventorySystem(gameState, {
  onToast: showToast,
  onItemCombined: (itemId) => {
    if (itemId === 'bliss_cupcake') {
      const q2 = QUESTS.find(q => q.id === 'quest_cauldron');
      if (q2) {
        q2.tasks[1].done = true;
        questSystem.render();
      }
    } else if (itemId === 'key_master') {
      const q3 = QUESTS.find(q => q.id === 'quest_lanterns');
      if (q3) {
        q3.tasks[0].done = true;
        questSystem.render();
      }
    } else if (itemId === 'dynamo_core') {
      const q5 = QUESTS.find(q => q.id === 'quest_dynamo');
      if (q5) {
        q5.tasks[2].done = true;
        questSystem.render();
      }
    }
  }
});

const minimapSystem = new MinimapSystem(gameState);
const persistenceSystem = new PersistenceSystem(gameState, lanternMeshes, QUESTS, inventorySystem, questSystem, {
  onToast: showToast
});

// Initialize 3D world & entities
initRooms();
initDestructibles();
initPlayer();
initGrumps();
initBoss();

// Weapon selection handler
const weaponOrder = ['pistol', 'shotgun', 'mortar', 'beam'];

function setWeapon(wType) {
  gameState.currentWeapon = wType;
  document.querySelectorAll('.weapon-slot').forEach(slot => {
    slot.classList.toggle('active', slot.getAttribute('data-weapon') === wType);
  });
  audio.playPop();
  showToast(`EQUIPPED: ${wType.toUpperCase()}`);
  if (wType !== 'beam') {
    player.beamMesh.visible = false;
    audio.stopBeamSound();
  }
}

function cycleWeapon() {
  const curIdx = weaponOrder.indexOf(gameState.currentWeapon);
  const nextIdx = (curIdx + 1) % weaponOrder.length;
  setWeapon(weaponOrder[nextIdx]);
}

// View Mode Toggle Handler
const btnViewModeLabel = document.getElementById('btn-view-mode-label');

function handleCycleViewMode() {
  audio.playPop();
  const label = cameraController.cycleViewMode();
  if (btnViewModeLabel) btnViewModeLabel.textContent = label;
  showToast(`★ ${label} ★`);
}

// Aim Toggle
const reticleLayer = document.getElementById('reticle-layer');
const btnAim = document.getElementById('btn-aim');

function toggleAim() {
  audio.init();
  player.isAiming = !player.isAiming;
  if (btnAim) btnAim.classList.toggle('active', player.isAiming);
  player.laserGuide.visible = player.isAiming;
  if (reticleLayer) reticleLayer.style.opacity = player.isAiming ? '1' : '0';
}

// Piano Puzzle Setup
const pianoModal = document.getElementById('piano-modal');
const pianoCloseBtn = document.getElementById('piano-close-btn');

function openPianoPuzzle() {
  audio.playPop();
  pianoModal.style.display = 'flex';
  gameState.pianoSequence = [];
  const q1 = QUESTS.find(q => q.id === 'quest_piano');
  if (q1) {
    q1.tasks[0].done = true;
    questSystem.render();
  }
}

if (pianoCloseBtn) {
  pianoCloseBtn.addEventListener('click', () => { pianoModal.style.display = 'none'; });
}

const noteFreqs = { 'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23, 'G': 392.00, 'A': 440.00 };

document.querySelectorAll('.piano-key').forEach(key => {
  key.addEventListener('click', () => {
    const note = key.getAttribute('data-note');
    audio.playPianoNote(noteFreqs[note]);
    gameState.pianoSequence.push(note);
    if (gameState.pianoSequence.length > 3) gameState.pianoSequence.shift();

    if (gameState.pianoSequence.join('-') === 'C-E-G' && !gameState.pianoSolved) {
      gameState.pianoSolved = true;
      audio.playCheer();
      showToast('★ HARMONIC TRIAD PLAYED! PIANO DRAWER OPENED! ★');
      pianoModal.style.display = 'none';
      spawnGroundItem('key_foyer', new THREE.Vector3(6.5, 1.5, -2.0), 'foyer');

      const q1 = QUESTS.find(q => q.id === 'quest_piano');
      if (q1) {
        q1.tasks[1].done = true;
        questSystem.render();
      }
    }
  });
});

function checkSugarValvePuzzle() {
  if (gameState.sugarValveSequence.join('-') === 'cyan-gold-emerald' && !gameState.sugarValvesEqualized) {
    gameState.sugarValvesEqualized = true;
    audio.playCheer();
    if (masterChefBoss) {
      masterChefBoss.takeDamage(40, gameState, {
        onToast: showToast,
        onItemAwarded: (itemId) => {
          inventorySystem.addItem(itemId, 1);
        }
      });
    }
    if (rooms.bakery) {
      spawnConfetti(rooms.bakery.position.clone().add(new THREE.Vector3(0, 3, 0)), 80);
    }
    showToast('★ SUGAR PRESSURE EQUALIZED! PERFECT BLISS TART BAKED! ★');
  }
}

// Room Transitions & Authentic Door Loading Cutscene
const doorCurtain = document.getElementById('door-curtain');
const roomNameDisplay = document.getElementById('room-name-display');

function changeRoom(newRoom, targetSpawnPos) {
  audio.playDoorChime();
  if (doorCurtain) doorCurtain.style.display = 'flex';

  setTimeout(() => {
    gameState.room = newRoom;
    player.group.position.copy(targetSpawnPos);

    const sector = getSector(newRoom);
    if (sector) {
      roomNameDisplay.textContent = `❖ ${sector.name.toUpperCase()} (${sector.floor})`;
    } else {
      if (newRoom === 'foyer') roomNameDisplay.textContent = '❖ CHÂTEAU FOYER & MEZZANINE';
      if (newRoom === 'library') roomNameDisplay.textContent = '❖ EAST WING LIBRARY';
      if (newRoom === 'garden') roomNameDisplay.textContent = '❖ SOLARIUM GARDEN';
      if (newRoom === 'greenhouse') roomNameDisplay.textContent = '❖ COURTYARD TEA GREENHOUSE';
      if (newRoom === 'dining') roomNameDisplay.textContent = '❖ GRAND BANQUET DINING HALL';
      if (newRoom === 'gallery') roomNameDisplay.textContent = '❖ HALL OF WHOLESOME PORTRAITS';
      if (newRoom === 'observatory') roomNameDisplay.textContent = '❖ CELESTIAL OBSERVATORY (2F)';
      if (newRoom === 'clocktower') roomNameDisplay.textContent = '❖ CLOCKTOWER SWEET SUITE (2F)';
      if (newRoom === 'mastersuite') roomNameDisplay.textContent = '❖ ROYAL VELVET MASTER SUITE (2F)';
      if (newRoom === 'ballroom') roomNameDisplay.textContent = '❖ GRAND CRYSTAL BALLROOM (2F)';
      if (newRoom === 'lab') roomNameDisplay.textContent = '❖ SUBTERRANEAN SUGAR LAB (B1)';
      if (newRoom === 'crypt') roomNameDisplay.textContent = '❖ WHISPERING CRYPT OF JOY (B2)';
    }

    audio.updateBGMRoom(newRoom);
    const bossHud = document.getElementById('boss-health-bar');
    const isBossRoom = (newRoom === 'crypt' || newRoom === 'bakery' || sector?.slug === 'crypt' || sector?.slug === 'bakery' || sector?.id === 'S18' || sector?.id === 'S07');
    if (bossHud) {
      bossHud.style.display = isBossRoom ? 'block' : 'none';
      const bossTitle = document.getElementById('boss-title');
      if (bossTitle) {
        bossTitle.textContent = (newRoom === 'bakery' || sector?.slug === 'bakery') ? 'THE GRUMPY MASTER CHEF (S07)' : 'GRAND GLOOM BEHEMOTH (S18)';
      }
    }

    updateSceneLighting(newRoom);

    // v4.0.0: Update 2.5D backdrop and activate sector GLSL shaders
    try {
      const sectorData = getSector(newRoom);
      if (backdropManager && sectorData) {
        backdropManager.transitionTo(sectorData.id || newRoom);
      }
      if (surfaceShaderManager && sectorData) {
        surfaceShaderManager.activateSector(sectorData.id || newRoom, scene);
      }
    } catch (e) {
      // Graceful fallback
    }


    setTimeout(() => {
      if (doorCurtain) doorCurtain.style.display = 'none';
    }, 450);
  }, 650);
}

// Contextual Interaction Proximity Check
const promptBox = document.getElementById('prompt-box');
const promptText = document.getElementById('prompt-text');
let currentInteractable = null;

function checkContextualInteractions() {
  currentInteractable = null;
  const pPos = player.group.position;

  // 1. Ground item pickups across all 7 wings
  for (let i = 0; i < groundItems.length; i++) {
    const item = groundItems[i];
    if (item.userData.roomName === gameState.room) {
      let itemWorldPos = item.position.clone();
      if (rooms[gameState.room]) {
        itemWorldPos.add(rooms[gameState.room].position);
      }

      if (pPos.distanceTo(itemWorldPos) < 2.4) {
        const dbItem = ITEMS_DB[item.userData.itemId];
        if (dbItem) {
          currentInteractable = { type: 'item', index: i, itemMesh: item, data: dbItem };
          promptText.textContent = `TAKE ${dbItem.name}`;
          promptBox.style.display = 'flex';
          return;
        }
      }
    }
  }

  // 2. Foyer Interactions (1F Ground vs 2F Balcony)
  if (gameState.room === 'foyer') {
    if (pPos.y < 2.5) {
      // 1F Ground Floor
      if (pPos.distanceTo(new THREE.Vector3(6.5, 0, -3)) < 3.2) {
        currentInteractable = { type: 'piano' };
        promptText.textContent = 'EXAMINE & PLAY GRAND PIANO';
        promptBox.style.display = 'flex';
        return;
      }
      if (pPos.distanceTo(new THREE.Vector3(-8.5, 0, -8.5)) < 2.8) {
        currentInteractable = { type: 'save' };
        promptText.textContent = 'SAVE GAME AT GOLD GRAMOPHONE';
        promptBox.style.display = 'flex';
        return;
      }
      if (pPos.distanceTo(new THREE.Vector3(13.5, 0, 0)) < 2.8) {
        currentInteractable = { type: 'door_library' };
        promptText.textContent = gameState.unlockedDoors.library ? 'ENTER EAST WING LIBRARY' : 'LOCKED: REQUIRES FOYER KEY';
        promptBox.style.display = 'flex';
        return;
      }
      if (pPos.distanceTo(new THREE.Vector3(-13.5, 0, 0)) < 2.8) {
        currentInteractable = { type: 'door_garden' };
        promptText.textContent = gameState.unlockedDoors.garden ? 'ENTER SOLARIUM GARDEN' : 'LOCKED: REQUIRES MASTER KEY';
        promptBox.style.display = 'flex';
        return;
      }
      if (pPos.distanceTo(new THREE.Vector3(0, 0, 13.5)) < 2.8) {
        currentInteractable = { type: 'door_greenhouse' };
        promptText.textContent = 'ENTER COURTYARD TEA GREENHOUSE';
        promptBox.style.display = 'flex';
        return;
      }
      if (pPos.distanceTo(new THREE.Vector3(8.5, 0, 8.5)) < 2.8) {
        currentInteractable = { type: 'trapdoor_lab' };
        promptText.textContent = 'DESCEND TO SUBTERRANEAN SUGAR LAB (B1)';
        promptBox.style.display = 'flex';
        return;
      }
      if (pPos.distanceTo(new THREE.Vector3(0, 0, -5.5)) < 3.0) {
        currentInteractable = { type: 'stairs_up' };
        promptText.textContent = 'ASCEND GRAND STAIRCASE TO 2F MEZZANINE';
        promptBox.style.display = 'flex';
        return;
      }
    } else {
      // 2F Mezzanine Balconies
      if (pPos.distanceTo(new THREE.Vector3(0, 4.5, -11.5)) < 3.0) {
        currentInteractable = { type: 'stairs_down' };
        promptText.textContent = 'DESCEND GRAND STAIRCASE TO 1F FOYER';
        promptBox.style.display = 'flex';
        return;
      }
      if (pPos.distanceTo(new THREE.Vector3(12.5, 4.5, 0)) < 2.8) {
        currentInteractable = { type: 'door_observatory' };
        promptText.textContent = 'ENTER CELESTIAL OBSERVATORY (2F)';
        promptBox.style.display = 'flex';
        return;
      }
      if (pPos.distanceTo(new THREE.Vector3(-12.5, 4.5, 0)) < 2.8) {
        currentInteractable = { type: 'door_clocktower' };
        promptText.textContent = 'ENTER CLOCKTOWER SWEET SUITE (2F)';
        promptBox.style.display = 'flex';
        return;
      }
    }
  }

  // 3. Library Interactions
  if (gameState.room === 'library') {
    const cauldronPos = rooms.library.position.clone().add(new THREE.Vector3(0, 0, -6));
    if (pPos.distanceTo(cauldronPos) < 3.0) {
      currentInteractable = { type: 'cauldron' };
      promptText.textContent = gameState.cauldronFed ? 'ALCHEMICAL CAULDRON: RADIATING BLISS' : 'PLACE MEGA BLISS CUPCAKE IN CAULDRON';
      promptBox.style.display = 'flex';
      return;
    }
    const exitPos = rooms.library.position.clone().add(new THREE.Vector3(-11.5, 0, 0));
    if (pPos.distanceTo(exitPos) < 2.8) {
      currentInteractable = { type: 'door_foyer_from_lib' };
      promptText.textContent = 'RETURN TO FOYER';
      promptBox.style.display = 'flex';
      return;
    }
  }

  // 4. Garden Interactions
  if (gameState.room === 'garden') {
    for (let l of lanternMeshes) {
      const lPos = rooms.garden.position.clone().add(l.group.position);
      if (pPos.distanceTo(lPos) < 2.4) {
        currentInteractable = { type: 'lantern', lantern: l };
        promptText.textContent = l.lit ? 'HEART LANTERN (BURNING WITH JOY)' : 'IGNITE HEART LANTERN WITH JOY';
        promptBox.style.display = 'flex';
        return;
      }
    }
    const exitPos2 = rooms.garden.position.clone().add(new THREE.Vector3(12.5, 0, 0));
    if (pPos.distanceTo(exitPos2) < 2.8) {
      currentInteractable = { type: 'door_foyer_from_garden' };
      promptText.textContent = 'RETURN TO FOYER';
      promptBox.style.display = 'flex';
      return;
    }
  }

  // 5. Greenhouse Interactions
  if (gameState.room === 'greenhouse') {
    const sugarPos = rooms.greenhouse.position.clone().add(new THREE.Vector3(5, 0, 4));
    if (pPos.distanceTo(sugarPos) < 3.0) {
      currentInteractable = { type: 'sugar_harvest' };
      promptText.textContent = 'HARVEST PRISMATIC SUGAR CRYSTAL';
      promptBox.style.display = 'flex';
      return;
    }
    const exitPos = rooms.greenhouse.position.clone().add(new THREE.Vector3(0, 0, -12.5));
    if (pPos.distanceTo(exitPos) < 2.8) {
      currentInteractable = { type: 'door_foyer_from_greenhouse' };
      promptText.textContent = 'RETURN TO FOYER';
      promptBox.style.display = 'flex';
      return;
    }
  }

  // 6. Observatory Interactions
  if (gameState.room === 'observatory') {
    const astrolabePos = rooms.observatory.position.clone().add(new THREE.Vector3(0, 0, 0));
    if (pPos.distanceTo(astrolabePos) < 3.2) {
      currentInteractable = { type: 'astrolabe' };
      promptText.textContent = gameState.astrolabeSolved ? 'ASTROLABE: RADIATING CELESTIAL JOY' : 'INSERT STAR SAPPHIRE GEM INTO ASTROLABE';
      promptBox.style.display = 'flex';
      return;
    }
    const exitPos = rooms.observatory.position.clone().add(new THREE.Vector3(-11.5, 0, 0));
    if (pPos.distanceTo(exitPos) < 2.8) {
      currentInteractable = { type: 'door_foyer_from_observatory' };
      promptText.textContent = 'RETURN TO 2F MEZZANINE';
      promptBox.style.display = 'flex';
      return;
    }
  }

  // 7. Clocktower Interactions
  if (gameState.room === 'clocktower') {
    const clockPos = rooms.clocktower.position.clone().add(new THREE.Vector3(-7, 0, -4));
    if (pPos.distanceTo(clockPos) < 3.0) {
      currentInteractable = { type: 'grandfather_clock' };
      promptText.textContent = gameState.clockSolved ? 'CLOCKWORK: TICKING IN ETERNAL JOY' : 'INSPECT CLOCKWORK & RETRIEVE SUN CREST';
      promptBox.style.display = 'flex';
      return;
    }
    const exitPos = rooms.clocktower.position.clone().add(new THREE.Vector3(11.5, 0, 0));
    if (pPos.distanceTo(exitPos) < 2.8) {
      currentInteractable = { type: 'door_foyer_from_clocktower' };
      promptText.textContent = 'RETURN TO 2F MEZZANINE';
      promptBox.style.display = 'flex';
      return;
    }
  }

  // 8. Subterranean Lab Interactions
  if (gameState.room === 'lab') {
    const dynamoPos = rooms.lab.position.clone().add(new THREE.Vector3(0, 0, -3));
    if (pPos.distanceTo(dynamoPos) < 3.4) {
      currentInteractable = { type: 'dynamo' };
      promptText.textContent = gameState.dynamoActive ? 'JOY DYNAMO: RADIATING HIGH-VOLTAGE BLISS' : 'INSERT JOY DYNAMO CORE INTO GENERATOR';
      promptBox.style.display = 'flex';
      return;
    }
    const exitPos = rooms.lab.position.clone().add(new THREE.Vector3(0, 0, 11.5));
    if (pPos.distanceTo(exitPos) < 2.8) {
      currentInteractable = { type: 'ladder_foyer_from_lab' };
      promptText.textContent = 'CLIMB LADDER TO 1F FOYER';
      promptBox.style.display = 'flex';
      return;
    }
  }

  promptBox.style.display = 'none';
}

function handleContextInteract() {
  if (!currentInteractable) return;

  // Pickup Ground Item
  if (currentInteractable.type === 'item') {
    const added = inventorySystem.addItem(currentInteractable.data.id, 1);
    if (added) {
      audio.playPop();
      showToast(`OBTAINED: ${currentInteractable.data.name}`);
      if (currentInteractable.data.id === 'key_foyer') {
        const q1 = QUESTS.find(q => q.id === 'quest_piano');
        if (q1) { q1.tasks[2].done = true; questSystem.render(); }
      } else if (currentInteractable.data.id === 'gem_star') {
        const q4 = QUESTS.find(q => q.id === 'quest_observatory');
        if (q4) { q4.tasks[1].done = true; questSystem.render(); }
      } else if (currentInteractable.data.id === 'crest_royal') {
        const q5 = QUESTS.find(q => q.id === 'quest_dynamo');
        if (q5) { q5.tasks[0].done = true; questSystem.render(); }
      } else if (currentInteractable.data.id === 'sugar_crystal') {
        const q5 = QUESTS.find(q => q.id === 'quest_dynamo');
        if (q5) { q5.tasks[1].done = true; questSystem.render(); }
      }
      rooms[currentInteractable.itemMesh.userData.roomName].remove(currentInteractable.itemMesh);
      groundItems.splice(currentInteractable.index, 1);
      currentInteractable = null;
      promptBox.style.display = 'none';
    } else {
      showToast('INVENTORY FULL (8/8 SLOTS)');
    }
    return;
  }

  if (currentInteractable.type === 'piano') { openPianoPuzzle(); return; }

  // Stair Traversals
  if (currentInteractable.type === 'stairs_up') {
    audio.playDoorChime();
    player.group.position.set(0, 4.5, -11.5);
    showToast('★ ASCENDED TO 2F MEZZANINE BALCONY ★');
    const q4 = QUESTS.find(q => q.id === 'quest_observatory');
    if (q4) { q4.tasks[0].done = true; questSystem.render(); }
    return;
  }

  if (currentInteractable.type === 'stairs_down') {
    audio.playDoorChime();
    player.group.position.set(0, 0, -5.5);
    showToast('★ DESCENDED TO 1F GRAND FOYER ★');
    return;
  }

  // Cauldron
  if (currentInteractable.type === 'cauldron') {
    if (gameState.cauldronFed) {
      showToast('THE CAULDRON IS ALREADY RADIATING PURE JOY!');
      return;
    }
    const cupcakeIdx = gameState.inventory.findIndex(s => s && s.id === 'bliss_cupcake');
    if (cupcakeIdx !== -1) {
      inventorySystem.consumeSlot(cupcakeIdx);
      gameState.cauldronFed = true;
      audio.playCheer();
      spawnConfetti(rooms.library.position.clone().add(new THREE.Vector3(0, 2, -6)), 40);
      showToast('★ CAULDRON ACTIVATED WITH MEGA BLISS CUPCAKE! ★');
      const q2 = QUESTS.find(q => q.id === 'quest_cauldron');
      if (q2) {
        q2.tasks[2].done = true;
        questSystem.checkAllDone();
        questSystem.render();
      }
    } else {
      showToast('CRAFT A MEGA BLISS CUPCAKE IN INVENTORY FIRST!');
    }
    return;
  }

  // Lanterns
  if (currentInteractable.type === 'lantern') {
    const l = currentInteractable.lantern;
    if (!l.lit) {
      l.lit = true;
      l.flame.material.color.setHex(0xec4899);
      audio.playLanternIgnite();
      spawnConfetti(rooms.garden.position.clone().add(l.group.position).add(new THREE.Vector3(0, 2.5, 0)), 20);
      const q3 = QUESTS.find(q => q.id === 'quest_lanterns');
      if (q3) {
        const t = q3.tasks[2];
        t.count = (t.count || 0) + 1;
        t.text = `Ignite all 4 Heart Lanterns around the fountain (${t.count}/4)`;
        if (t.count >= 4) {
          t.done = true;
          audio.playCheer();
          questSystem.checkAllDone();
        }
        questSystem.render();
      }
      showToast(`★ HEART LANTERN IGNITED! (${q3.tasks[2].count}/4) ★`);
    }
    return;
  }

  // Astrolabe Puzzle
  if (currentInteractable.type === 'astrolabe') {
    if (gameState.astrolabeSolved) {
      showToast('THE CELESTIAL ASTROLABE IS ALREADY ALIGNED WITH THE STARS!');
      return;
    }
    const gemIdx = gameState.inventory.findIndex(s => s && s.id === 'gem_star');
    if (gemIdx !== -1) {
      inventorySystem.consumeSlot(gemIdx);
      gameState.astrolabeSolved = true;
      audio.playCheer();
      spawnConfetti(rooms.observatory.position.clone().add(new THREE.Vector3(0, 3, 0)), 50);
      showToast('★ STAR SAPPHIRE INSERTED! ASTROLABE ALIGNED! ★');
      const q4 = QUESTS.find(q => q.id === 'quest_observatory');
      if (q4) {
        q4.tasks[2].done = true;
        questSystem.checkAllDone();
        questSystem.render();
      }
    } else {
      showToast('FIND AND INSERT THE STAR SAPPHIRE GEM FIRST!');
    }
    return;
  }

  // Grandfather Clock
  if (currentInteractable.type === 'grandfather_clock') {
    if (gameState.clockSolved) {
      showToast('THE CLOCK MECHANISM IS WORKING IN HARMONY.');
      return;
    }
    gameState.clockSolved = true;
    audio.playCheer();
    inventorySystem.addItem('crest_royal', 1);
    showToast('★ CLOCK MECHANISM UNLOCKED! OBTAINED: GOLDEN SUN CREST! ★');
    const q5 = QUESTS.find(q => q.id === 'quest_dynamo');
    if (q5) {
      q5.tasks[0].done = true;
      questSystem.render();
    }
    return;
  }

  // Sugar Harvest
  if (currentInteractable.type === 'sugar_harvest') {
    const added = inventorySystem.addItem('sugar_crystal', 1);
    if (added) {
  // Sugar Pressure Valves in Royal Bakery (S07)
  if (currentInteractable.type === 'sugar_valve_cyan') {
    audio.playValveTurnChime(523.25);
    gameState.sugarValveSequence.push('cyan');
    if (gameState.sugarValveSequence.length > 3) gameState.sugarValveSequence.shift();
    showToast('❖ CYAN SUGAR VALVE ROTATED (HIGH PRESSURE FLOW)');
    checkSugarValvePuzzle();
    return;
  }

  if (currentInteractable.type === 'sugar_valve_gold') {
    audio.playValveTurnChime(659.25);
    gameState.sugarValveSequence.push('gold');
    if (gameState.sugarValveSequence.length > 3) gameState.sugarValveSequence.shift();
    showToast('❖ GOLDEN SUGAR VALVE ROTATED (HARMONIC PRESSURE)');
    checkSugarValvePuzzle();
    return;
  }

  if (currentInteractable.type === 'sugar_valve_emerald') {
    audio.playValveTurnChime(783.99);
    gameState.sugarValveSequence.push('emerald');
    if (gameState.sugarValveSequence.length > 3) gameState.sugarValveSequence.shift();
    showToast('❖ EMERALD SUGAR VALVE ROTATED (PRESSURE STABILIZING)');
    checkSugarValvePuzzle();
    return;
  }

  if (currentInteractable.type === 'royal_oven') {
    if (gameState.sugarValvesEqualized) {
      showToast('★ ROYAL OVEN IS BAKING STRAWBERRY BLISS TARTS AT PEAK HARMONY! ★');
    } else {
      showToast('❖ OVEN PRESSURE REDLINING! TURN VALVES IN HARMONIC SEQUENCE (CYAN ➔ GOLD ➔ EMERALD)!');
    }
    return;
  }


  // Joy Dynamo
  if (currentInteractable.type === 'dynamo') {
    if (gameState.dynamoActive) {
      showToast('THE JOY DYNAMO IS ONLINE AND RADIATING MAXIMUM HAPPINESS!');
      return;
    }
    const coreIdx = gameState.inventory.findIndex(s => s && s.id === 'dynamo_core');
    if (coreIdx !== -1) {
      inventorySystem.consumeSlot(coreIdx);
      gameState.dynamoActive = true;
      audio.playCheer();
      spawnConfetti(rooms.lab.position.clone().add(new THREE.Vector3(0, 3, -3)), 60);
      showToast('★ JOY DYNAMO ACTIVATED! ALL CHÂTEAU PIPELINES CHARGED! ★');
      const q5 = QUESTS.find(q => q.id === 'quest_dynamo');
      if (q5) {
        q5.tasks[2].done = true;
        questSystem.checkAllDone();
        questSystem.render();
      }
    } else {
      showToast('COMBINE GOLDEN SUN CREST + PRISMATIC SUGAR FOR DYNAMO CORE!');
    }
    return;
  }

  if (currentInteractable.type === 'save') {
    persistenceSystem.promptSave();
    return;
  }

  // Room Transitions
  if (currentInteractable.type === 'door_library') {
    if (gameState.unlockedDoors.library) {
      changeRoom('library', rooms.library.position.clone().add(new THREE.Vector3(-9, 0, 0)));
    } else {
      const keyIdx = gameState.inventory.findIndex(slot => slot && slot.id === 'key_foyer');
      if (keyIdx !== -1) {
        gameState.unlockedDoors.library = true;
        audio.playDoorChime();
        showToast('UNLOCKED EAST WING WITH FOYER KEY!');
        const q2 = QUESTS.find(q => q.id === 'quest_cauldron');
        if (q2) { q2.tasks[0].done = true; questSystem.render(); }
        changeRoom('library', rooms.library.position.clone().add(new THREE.Vector3(-9, 0, 0)));
      } else {
        showToast('DOOR IS LOCKED. SOLVE THE PIANO SONATINA FOR THE KEY.');
      }
    }
    return;
  }

  if (currentInteractable.type === 'door_garden') {
    if (gameState.unlockedDoors.garden) {
      changeRoom('garden', rooms.garden.position.clone().add(new THREE.Vector3(10, 0, 0)));
    } else {
      const keyIdx = gameState.inventory.findIndex(slot => slot && slot.id === 'key_master');
      if (keyIdx !== -1) {
        gameState.unlockedDoors.garden = true;
        audio.playDoorChime();
        showToast('UNLOCKED SOLARIUM WITH MASTER BALLROOM KEY!');
        const q3 = QUESTS.find(q => q.id === 'quest_lanterns');
        if (q3) { q3.tasks[1].done = true; questSystem.render(); }
        changeRoom('garden', rooms.garden.position.clone().add(new THREE.Vector3(10, 0, 0)));
      } else {
        showToast('LOCKED! CRAFT MASTER KEY BY COMBINING FOYER KEY + GOLD RIBBON.');
      }
    }
    return;
  }

  if (currentInteractable.type === 'door_greenhouse') {
    changeRoom('greenhouse', rooms.greenhouse.position.clone().add(new THREE.Vector3(0, 0, -10)));
    return;
  }

  if (currentInteractable.type === 'trapdoor_lab') {
    changeRoom('lab', rooms.lab.position.clone().add(new THREE.Vector3(0, 0, 9)));
    return;
  }

  if (currentInteractable.type === 'door_observatory') {
    changeRoom('observatory', rooms.observatory.position.clone().add(new THREE.Vector3(-9, 0, 0)));
    return;
  }

  if (currentInteractable.type === 'door_clocktower') {
    changeRoom('clocktower', rooms.clocktower.position.clone().add(new THREE.Vector3(9, 0, 0)));
    return;
  }

  if (currentInteractable.type === 'door_foyer_from_lib') {
    changeRoom('foyer', new THREE.Vector3(11, 0, 0));
    return;
  }

  if (currentInteractable.type === 'door_foyer_from_garden') {
    changeRoom('foyer', new THREE.Vector3(-11, 0, 0));
    return;
  }

  if (currentInteractable.type === 'door_foyer_from_greenhouse') {
    changeRoom('foyer', new THREE.Vector3(0, 0, 11));
    return;
  }

  if (currentInteractable.type === 'door_foyer_from_observatory') {
    changeRoom('foyer', new THREE.Vector3(11, 4.5, 0));
    return;
  }

  if (currentInteractable.type === 'door_foyer_from_clocktower') {
    changeRoom('foyer', new THREE.Vector3(-11, 4.5, 0));
    return;
  }

  if (currentInteractable.type === 'ladder_foyer_from_lab') {
    changeRoom('foyer', new THREE.Vector3(7, 0, 7));
    return;
  }
}

// Input Integration
initInput({
  onToggleInventory: () => inventorySystem.toggle(),
  onToggleQuestLog: () => questSystem.toggle(),
  onToggleFullMap: () => minimapSystem.toggleFullMap(),
  onContextInteract: handleContextInteract,
  onQuickTurn: performQuickTurn,
  onCycleViewMode: handleCycleViewMode,
  onFire: () => triggerWeaponFire(gameState, cameraController, {
    onToast: showToast,
    onGrumpUplifted: () => {
      const qUplift = QUESTS.find(q => q.id === 'quest_uplift');
      if (qUplift) {
        const t = qUplift.tasks[0];
        t.count = gameState.grumpsUpliftedCount;
        t.text = `Uplift all 10 Gloomy Grump plushies (${t.count}/10)`;
        if (t.count >= 10) {
          t.done = true;
          questSystem.checkAllDone();
        }
        questSystem.render();
      }
    }
  }),
  onSetWeapon: setWeapon,
  onCycleWeapon: cycleWeapon,
  onToggleAim: toggleAim,
  onRotateCamera: (deltaYaw, deltaPitch = 0) => {
    player.rotation -= deltaYaw;
    cameraController.addPitch(deltaPitch);
  },
  onToast: showToast
});

const btnRestart = document.getElementById('btn-restart-party');
if (btnRestart) {
  btnRestart.addEventListener('click', () => {
    document.getElementById('party-banner').style.display = 'none';
    showToast('KEEP SPREADING MAXIMUM HAPPINESS ACROSS THE WORLD!');
  });
}

// Load Save Data & Initial Render
loadGame(gameState, lanternMeshes, QUESTS, inventorySystem, questSystem);
questSystem.render();

window.__petCompanion = (idx) => {
  companionSquad.petCompanion(idx, { onToast: showToast });
};

window.__feedCompanion = (idx) => {
  companionSquad.feedCupcake(idx, inventorySystem, { onToast: showToast });
};

// Main Animation & Render Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);
  const time = clock.getElapsedTime();

  updatePlayer(delta, time, gameState.room, cameraController.pitch);
  cameraController.update(player, delta, gameState.room);
  companionSquad.update(delta, time, gameState.room);
  updateProjectiles(delta, gameState, {
    onToast: showToast,
    onGrumpUplifted: () => {
      const qUplift = QUESTS.find(q => q.id === 'quest_uplift');
      if (qUplift) {
        const t = qUplift.tasks[0];
        t.count = gameState.grumpsUpliftedCount;
        t.text = `Uplift all 10 Gloomy Grump plushies (${t.count}/10)`;
        if (t.count >= 10) {
          t.done = true;
          questSystem.checkAllDone();
        }
        questSystem.render();
      }
    }
  });

  updateGrumps(delta, time, cameraController.camera);
  if (bossInstance && gameState.room === 'crypt') {
    bossInstance.update(delta, time, player.group.position);
  }
  if (masterChefBoss && gameState.room === 'bakery') {
    masterChefBoss.update(delta, time, player.group.position);
  }
  updateDestructibles(time);
  updateGroundItems(delta, time);
  updateParticles(delta);
  updateStardust(time, gameState.room);
  updatePetals(delta, time);
  updateTargetSights(gameState.room);

  minimapSystem.render(player, grumps, destructibles);
  checkContextualInteractions();

  // v4.0.0: tick backdrop parallax
  if (backdropManager) {
    try {
      backdropManager.update(delta, cameraController.camera);
    } catch (e) {
      // Graceful fallback
    }
  }

  // v4.0.0: lazy-init graphics on first frame
  _initGraphics();

  // Primary 3D WebGL render
  try {
    renderer.render(scene, cameraController.camera);
  } catch (e) {
    console.error('[Render Fallback Error]:', e);
  }
}

animate();
showToast('❖ RESIDENT LOVELY v4.0.0 MAXIMAL GRAPHIC OVERHAUL + 32-SECTOR WORLD LOADED');
