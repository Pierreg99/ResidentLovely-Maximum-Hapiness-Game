import { audio } from '../engine/audio.js';

export const QUESTS = [
  {
    id: 'quest_piano',
    name: 'QUEST 1: THE FOYER SONATINA',
    desc: 'Play the harmonic triad [C-E-G] on the Grand Concert Piano to reveal the hidden Library Key.',
    status: 'active',
    tasks: [
      { id: 't_inspect_piano', text: 'Approach and inspect the Grand Piano in the Foyer', done: false },
      { id: 't_play_chords', text: 'Play the 3-Note Triad [C - E - G]', done: false },
      { id: 't_take_key', text: 'Collect the Silver Foyer Key from the piano drawer', done: false }
    ]
  },
  {
    id: 'quest_cauldron',
    name: 'QUEST 2: ALCHEMICAL BLISS BREW',
    desc: 'Brew a Mega Bliss Cupcake in your inventory, then deposit it into the East Wing Cauldron.',
    status: 'active',
    tasks: [
      { id: 't_unlock_lib', text: 'Unlock and enter the East Wing Library', done: false },
      { id: 't_craft_cake', text: 'Combine Green Sparkle Herb + Red Sweet Powder', done: false },
      { id: 't_offer_cauldron', text: 'Place Mega Bliss Cupcake into the Golden Cauldron', done: false }
    ]
  },
  {
    id: 'quest_lanterns',
    name: 'QUEST 3: SOLARIUM HEART LANTERNS',
    desc: 'Unlock the Solarium Garden with the Master Ballroom Key and ignite all 4 Heart Lanterns.',
    status: 'active',
    tasks: [
      { id: 't_craft_master_key', text: 'Craft Master Key (Combine Foyer Key + Gold Ribbon)', done: false },
      { id: 't_unlock_garden', text: 'Unlock and enter the West Wing Solarium Garden', done: false },
      { id: 't_light_lanterns', text: 'Ignite all 4 Heart Lanterns around the fountain (0/4)', done: false, count: 0, max: 4 }
    ]
  },
  {
    id: 'quest_uplift',
    name: 'QUEST 4: CHÂTEAU JOY BRIGADE',
    desc: 'Blast and uplift all Gloomy Grumps across all rooms into dancing celebration buddies.',
    status: 'active',
    tasks: [
      { id: 't_uplift_grumps', text: 'Uplift all 5 Gloomy Grump plushies (0/5)', done: false, count: 0, max: 5 },
      { id: 't_save_gramo', text: 'Save your grand progress at the Golden Gramophone', done: false }
    ]
  }
];

export class QuestSystem {
  constructor() {
    this.questModal = document.getElementById('quest-modal');
    this.questListContainer = document.getElementById('quest-list-container');
    this.activeObjText = document.getElementById('active-obj-text');

    document.getElementById('quest-close-btn').addEventListener('click', () => this.toggle());
  }

  toggle() {
    audio.playPop();
    const isOpen = this.questModal.style.display === 'flex';
    this.questModal.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) this.render();
  }

  render() {
    this.questListContainer.innerHTML = '';
    QUESTS.forEach(q => {
      const isDone = q.tasks.every(t => t.done);
      const card = document.createElement('div');
      card.className = 'quest-card' + (isDone ? ' completed' : '');
      card.innerHTML = `
        <div class="quest-card-header">
          <span class="quest-name">${q.name}</span>
          <span class="quest-badge ${isDone ? 'done' : ''}">${isDone ? 'COMPLETED ✔' : 'IN PROGRESS'}</span>
        </div>
        <div class="quest-desc">${q.desc}</div>
        <div class="quest-tasks">
          ${q.tasks.map(t => `
            <div class="task-item ${t.done ? 'checked' : ''}">
              <span>${t.done ? '✔' : '•'}</span>
              <span>${t.text}</span>
            </div>
          `).join('')}
        </div>
      `;
      this.questListContainer.appendChild(card);
    });
    this.updateActiveBanner();
  }

  updateActiveBanner() {
    for (let q of QUESTS) {
      for (let t of q.tasks) {
        if (!t.done) {
          this.activeObjText.textContent = `OBJECTIVE: ${t.text}`;
          return;
        }
      }
    }
    this.activeObjText.textContent = '★ ALL OBJECTIVES COMPLETE! GRAND PARTY UNLOCKED!';
  }

  checkAllDone() {
    const allDone = QUESTS.every(q => q.tasks.every(t => t.done));
    if (allDone) {
      setTimeout(() => {
        document.getElementById('party-banner').style.display = 'block';
        audio.playCheer();
      }, 1000);
    }
  }
}
