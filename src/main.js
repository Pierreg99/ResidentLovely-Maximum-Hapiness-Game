import { scene, renderer, updateParticles, spawnConfetti } from './world/scene.js';
import { rooms, initRooms, lanternMeshes, groundItems, spawnGroundItem, updateGroundItems } from './world/rooms.js';
import { destructibles, initDestructibles, updateDestructibles } from './world/destructibles.js';
import { player, initPlayer, updatePlayer, performQuickTurn } from './entities/player.js';
import { grumps, initGrumps, updateGrumps } from './entities/grump.js';
import { triggerWeaponFire, updateProjectiles } from './weapons/arsenal.js';
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
  unlockedDoors: { library: false, garden: false },
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
  cauldronFed: false,
  grumpsUpliftedCount: 0,
  totalGrumps: 5
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
    }
  }
});

const questSystem = new QuestSystem();
const minimapSystem = new MinimapSystem(gameState);
const persistenceSystem = new PersistenceSystem(gameState, lanternMeshes, QUESTS, inventorySystem, questSystem, {
  onToast: showToast
});

// Initialize 3D world & entities
initRooms();
initDestructibles();
initPlayer();
initGrumps();

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
      spawnGroundItem('key_foyer', new THREE.Vector3(6.5, 1.5, -2.5), 'foyer');

      const q1 = QUESTS.find(q => q.id === 'quest_piano');
      if (q1) {
        q1.tasks[1].done = true;
        questSystem.render();
      }
    }
  });
});

// Room Transitions & Authentic Door Loading Cutscene
const doorCurtain = document.getElementById('door-curtain');
const roomNameDisplay = document.getElementById('room-name-display');

function changeRoom(newRoom, targetSpawnPos) {
  audio.playDoorChime();
  if (doorCurtain) doorCurtain.style.display = 'flex';

  setTimeout(() => {
    gameState.room = newRoom;
    player.group.position.copy(targetSpawnPos);

    if (newRoom === 'foyer') roomNameDisplay.textContent = '❖ CHÂTEAU FOYER';
    if (newRoom === 'library') roomNameDisplay.textContent = '❖ EAST WING LIBRARY';
    if (newRoom === 'garden') roomNameDisplay.textContent = '❖ SOLARIUM GARDEN';

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

  for (let i = 0; i < groundItems.length; i++) {
    const item = groundItems[i];
    if (item.userData.roomName === gameState.room) {
      let itemWorldPos = item.position.clone();
      if (gameState.room === 'library') itemWorldPos.add(rooms.library.position);
      if (gameState.room === 'garden') itemWorldPos.add(rooms.garden.position);

      if (pPos.distanceTo(itemWorldPos) < 2.2) {
        const dbItem = ITEMS_DB[item.userData.itemId];
        currentInteractable = { type: 'item', index: i, itemMesh: item, data: dbItem };
        promptText.textContent = `TAKE ${dbItem.name}`;
        promptBox.style.display = 'flex';
        return;
      }
    }
  }

  if (gameState.room === 'foyer') {
    if (pPos.distanceTo(new THREE.Vector3(6.5, 0, -4)) < 3.2) {
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
  }

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

  promptBox.style.display = 'none';
}

function handleContextInteract() {
  if (!currentInteractable) return;

  if (currentInteractable.type === 'item') {
    const added = inventorySystem.addItem(currentInteractable.data.id, 1);
    if (added) {
      audio.playPop();
      showToast(`OBTAINED: ${currentInteractable.data.name}`);
      if (currentInteractable.data.id === 'key_foyer') {
        const q1 = QUESTS.find(q => q.id === 'quest_piano');
        if (q1) {
          q1.tasks[2].done = true;
          questSystem.render();
        }
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

  if (currentInteractable.type === 'save') {
    persistenceSystem.promptSave();
    return;
  }

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
        if (q2) {
          q2.tasks[0].done = true;
          questSystem.render();
        }
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
        if (q3) {
          q3.tasks[1].done = true;
          questSystem.render();
        }
        changeRoom('garden', rooms.garden.position.clone().add(new THREE.Vector3(10, 0, 0)));
      } else {
        showToast('LOCKED! CRAFT MASTER KEY BY COMBINING FOYER KEY + GOLD RIBBON.');
      }
    }
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
}

// Input Integration
initInput({
  onToggleInventory: () => inventorySystem.toggle(),
  onToggleQuestLog: () => questSystem.toggle(),
  onToggleFullMap: () => minimapSystem.toggleFullMap(),
  onContextInteract: handleContextInteract,
  onQuickTurn: performQuickTurn,
  onFire: () => triggerWeaponFire(gameState, cameraController, {
    onToast: showToast,
    onGrumpUplifted: () => {
      const q4 = QUESTS.find(q => q.id === 'quest_uplift');
      if (q4) {
        const t = q4.tasks[0];
        t.count = gameState.grumpsUpliftedCount;
        t.text = `Uplift all 5 Gloomy Grump plushies (${t.count}/5)`;
        if (t.count >= 5) {
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
  onRotateCamera: (deltaX) => { player.rotation -= deltaX; },
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

// Main Animation & Render Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);
  const time = clock.getElapsedTime();

  updatePlayer(delta, time, gameState.room);
  cameraController.update(player, delta);
  updateProjectiles(delta, gameState, {
    onToast: showToast,
    onGrumpUplifted: () => {
      const q4 = QUESTS.find(q => q.id === 'quest_uplift');
      if (q4) {
        const t = q4.tasks[0];
        t.count = gameState.grumpsUpliftedCount;
        t.text = `Uplift all 5 Gloomy Grump plushies (${t.count}/5)`;
        if (t.count >= 5) {
          t.done = true;
          questSystem.checkAllDone();
        }
        questSystem.render();
      }
    }
  });
  updateGrumps(delta, time);
  updateDestructibles(time);
  updateGroundItems(delta, time);
  updateParticles(delta);

  minimapSystem.render(player, grumps, destructibles);
  checkContextualInteractions();

  renderer.render(scene, cameraController.camera);
}

animate();
showToast('❖ KAWAII ENGINE & ACCURATE LOGIC ACTIVE ❖');
