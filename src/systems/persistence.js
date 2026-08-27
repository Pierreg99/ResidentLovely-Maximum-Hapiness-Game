import { audio } from '../engine/audio.js';

export class PersistenceSystem {
  constructor(gameState, lanternMeshes, QUESTS, inventorySystem, questSystem, callbacks) {
    this.gameState = gameState;
    this.lanternMeshes = lanternMeshes;
    this.QUESTS = QUESTS;
    this.inventorySystem = inventorySystem;
    this.questSystem = questSystem;
    this.callbacks = callbacks;

    this.saveModal = document.getElementById('save-modal');
    this.btnConfirmSave = document.getElementById('btn-confirm-save');
    this.btnCancelSave = document.getElementById('btn-cancel-save');

    if (this.btnConfirmSave) {
      this.btnConfirmSave.addEventListener('click', () => {
        this.executeSave();
      });
    }

    if (this.btnCancelSave) {
      this.btnCancelSave.addEventListener('click', () => {
        if (this.saveModal) this.saveModal.style.display = 'none';
      });
    }
  }

  promptSave() {
    audio.playPop();
    if (this.saveModal) {
      this.saveModal.style.display = 'flex';
    } else {
      this.executeSave();
    }
  }

  executeSave() {
    audio.playTypewriter();
    saveGame(this.gameState, this.lanternMeshes, this.QUESTS);

    if (this.saveModal) this.saveModal.style.display = 'none';
    if (this.callbacks.onToast) this.callbacks.onToast('★ JOYFUL PROGRESS RECORDED TO MEMORY CARD ★');

    const q4 = this.QUESTS.find(q => q.id === 'quest_uplift');
    if (q4) {
      q4.tasks[1].done = true;
      this.questSystem.checkAllDone();
      this.questSystem.render();
    }
  }
}

export function saveGame(gameState, lanternMeshes, QUESTS) {
  const savePayload = {
    joy: gameState.joy,
    room: gameState.room,
    unlockedDoors: gameState.unlockedDoors,
    inventory: gameState.inventory,
    grumpsUpliftedCount: gameState.grumpsUpliftedCount,
    pianoSolved: gameState.pianoSolved,
    cauldronFed: gameState.cauldronFed,
    litLanterns: lanternMeshes.map(l => l.lit),
    quests: QUESTS
  };
  localStorage.setItem('resident_lovely_save_v3', JSON.stringify(savePayload));
}

export function loadGame(gameState, lanternMeshes, QUESTS, inventorySystem, questSystem) {
  const data = localStorage.getItem('resident_lovely_save_v3');
  if (data) {
    try {
      const p = JSON.parse(data);
      gameState.joy = p.joy || 100;
      gameState.room = p.room || 'foyer';
      gameState.unlockedDoors = p.unlockedDoors || { library: false, garden: false };
      gameState.inventory = p.inventory || gameState.inventory;
      gameState.grumpsUpliftedCount = p.grumpsUpliftedCount || 0;
      gameState.pianoSolved = p.pianoSolved || false;
      gameState.cauldronFed = p.cauldronFed || false;

      if (p.litLanterns) {
        p.litLanterns.forEach((isLit, i) => {
          if (lanternMeshes[i] && isLit) {
            lanternMeshes[i].lit = true;
            lanternMeshes[i].flame.material.color.setHex(0xec4899);
          }
        });
      }

      if (p.quests) {
        p.quests.forEach((savedQ, qIdx) => {
          if (QUESTS[qIdx]) QUESTS[qIdx].tasks = savedQ.tasks;
        });
      }

      inventorySystem.updateVitalityHUD();
      questSystem.render();
    } catch(e) {
      console.error(e);
    }
  }
}
