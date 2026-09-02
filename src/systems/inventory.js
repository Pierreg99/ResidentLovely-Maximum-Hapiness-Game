import { audio } from '../engine/audio.js';

export const ITEMS_DB = {
  herb_green: {
    id: 'herb_green',
    name: 'SPARKLE HERB (GREEN)',
    desc: 'A vibrant peppermint herb emitting emerald sparkles. Restores 35% Joy Vitality.',
    type: 'consumable',
    icon: '<circle cx="12" cy="12" r="8" fill="#10b981"/><path d="M12 4v16M4 12h16" stroke="#05070a" stroke-width="2"/>'
  },
  herb_double: {
    id: 'herb_double',
    name: 'DOUBLE SPARKLE HERB (G+G)',
    desc: 'Two blended green sparkle herbs. Restores 70% Joy Vitality with fresh mint aroma.',
    type: 'consumable',
    icon: '<circle cx="8" cy="12" r="6" fill="#10b981"/><circle cx="16" cy="12" r="6" fill="#10b981"/><path d="M8 8v8M16 8v8" stroke="#05070a" stroke-width="1.5"/>'
  },
  elixir_ultra: {
    id: 'elixir_ultra',
    name: 'ULTRA JOY ELIXIR (G+G+G)',
    desc: 'Triple-concentrated sparkle herb elixir. Restores 100% Joy and grants radiant bliss protection!',
    type: 'consumable',
    icon: '<polygon points="12 2 20 18 4 18" fill="#10b981"/><circle cx="12" cy="13" r="4" fill="#22d3ee"/>'
  },
  powder_red: {
    id: 'powder_red',
    name: 'SWEET POWDER (RED)',
    desc: 'Concentrated strawberry sugar. Combine with Sparkle Herb to create a Mega Bliss Cupcake!',
    type: 'material',
    icon: '<polygon points="12 2 22 22 2 22" fill="#ec4899"/><circle cx="12" cy="15" r="3" fill="#fff"/>'
  },
  bliss_cupcake: {
    id: 'bliss_cupcake',
    name: 'MEGA BLISS CUPCAKE',
    desc: 'Masterwork confection. Place into the Library Cauldron or consume for 100% Joy!',
    type: 'consumable',
    icon: '<path d="M4 14h16l-2 8H6z" fill="#f59e0b"/><circle cx="12" cy="10" r="6" fill="#ec4899"/><circle cx="12" cy="5" r="2" fill="#22d3ee"/>'
  },
  key_foyer: {
    id: 'key_foyer',
    name: 'SILVER FOYER KEY',
    desc: 'Engraved with a smiling sun. Inspect underneath to read the secret inscription: "Harmony unlocks the East Wing".',
    type: 'key',
    icon: '<circle cx="8" cy="8" r="5" fill="none" stroke="#22d3ee" stroke-width="2"/><path d="M12 12l8 8M16 16l2-2M18 18l2-2" stroke="#22d3ee" stroke-width="2"/>'
  },
  ribbon_gold: {
    id: 'ribbon_gold',
    name: 'GOLDEN SPARKLE RIBBON',
    desc: 'Shimmering silk ribbon. Combine with Silver Foyer Key to craft the Master Ballroom Key!',
    type: 'material',
    icon: '<path d="M12 2l4 8-4 4-4-4zM6 14l6 8 6-8" stroke="#f59e0b" stroke-width="2" fill="none"/>'
  },
  key_master: {
    id: 'key_master',
    name: 'MASTER BALLROOM KEY',
    desc: 'Gilded with royal confectionery gold. Unlocks the West Wing Solarium Garden!',
    type: 'key',
    icon: '<circle cx="8" cy="8" r="5" fill="#f59e0b"/><path d="M12 12l9 9M17 15l2 2M19 17l2 2" stroke="#f59e0b" stroke-width="2.5"/>'
  },
  tome_scroll: {
    id: 'tome_scroll',
    name: 'SCROLL OF JOY HARMONY',
    desc: 'Ancient alchemical recipe scroll detailing 3-tier herb blending secrets.',
    type: 'quest_item',
    icon: '<rect x="4" y="4" width="16" height="16" rx="2" fill="#a855f7"/><line x1="8" y1="8" x2="16" y2="8" stroke="#fff"/><line x1="8" y1="12" x2="16" y2="12" stroke="#fff"/>'
  },
  gem_star: {
    id: 'gem_star',
    name: 'STAR SAPPHIRE GEM',
    desc: 'A luminescent celestial gem echoing with starry resonance. Fits the Celestial Astrolabe in the 2F Observatory.',
    type: 'quest_item',
    icon: '<polygon points="12 2 22 12 12 22 2 12" fill="#38bdf8" stroke="#22d3ee" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="#fff"/>'
  },
  crest_royal: {
    id: 'crest_royal',
    name: 'GOLDEN SUN CREST',
    desc: 'An antique gilded emblem salvaged from the Clocktower Sweet Suite pendulum casing.',
    type: 'quest_item',
    icon: '<circle cx="12" cy="12" r="8" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/><polygon points="12 4 14 10 20 12 14 14 12 20 10 14 4 12 10 10" fill="#fff"/>'
  },
  sugar_crystal: {
    id: 'sugar_crystal',
    name: 'PRISMATIC SUGAR CRYSTAL',
    desc: 'Naturally crystallized rainbow sucrose cultivated in the Courtyard Tea Greenhouse.',
    type: 'material',
    icon: '<polygon points="12 3 19 9 16 21 8 21 5 9" fill="#ec4899" stroke="#f472b6" stroke-width="1.5"/><line x1="12" y1="3" x2="12" y2="21" stroke="#fff"/>'
  },
  dynamo_core: {
    id: 'dynamo_core',
    name: 'JOY DYNAMO CORE',
    desc: 'Synthesized power matrix combining the Sun Crest & Prismatic Sugar. Fuels the Subterranean Sugar Lab Dynamo!',
    type: 'quest_item',
    icon: '<circle cx="12" cy="12" r="9" fill="#06b6d4" stroke="#f59e0b" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#ec4899"/>'
  },
  elixir_hyper: {
    id: 'elixir_hyper',
    name: 'HYPER BLISS CONFECTION',
    desc: 'Ultra-luxurious confection granting permanent maximum joy vitality and glowing sparkle aura.',
    type: 'consumable',
    icon: '<path d="M4 14h16l-2 8H6z" fill="#f59e0b"/><circle cx="12" cy="9" r="7" fill="#a855f7"/><polygon points="12 2 14 7 9 7" fill="#22d3ee"/>'
  },
  macaron_rainbow: {
    id: 'macaron_rainbow',
    name: 'RAINBOW STARLIGHT MACARON',
    desc: 'Crisp meringue pastry with stardust cream. Restores 100% Joy and grants 20s Sparkle Dash buff!',
    type: 'consumable',
    icon: '<ellipse cx="12" cy="8" rx="8" ry="4" fill="#f472b6"/><rect x="4" y="8" width="16" height="4" fill="#fff"/><ellipse cx="12" cy="12" rx="8" ry="4" fill="#38bdf8"/>'
  },
  cotton_candy: {
    id: 'cotton_candy',
    name: 'SPARKLE COTTON CANDY',
    desc: 'Fluffy cloud of spun sugar on a golden stick. Fully protects against gloom for 30 seconds!',
    type: 'consumable',
    icon: '<circle cx="12" cy="9" r="7" fill="#ec4899" opacity="0.85"/><line x1="12" y1="14" x2="12" y2="22" stroke="#f59e0b" stroke-width="2"/>'
  },
  diary_page_1: {
    id: 'diary_page_1',
    name: 'CHÂTEAU DIARY: THE GRAND ROTUNDA',
    desc: '"Welcome, Agent of S.M.I.L.E. The Château de la Joie was constructed to harbor eternal laughter. If gloom appears, play the C-E-G sonatina."',
    type: 'lore',
    icon: '<rect x="4" y="3" width="16" height="18" rx="2" fill="#1e293b" stroke="#22d3ee"/><line x1="7" y1="7" x2="17" y2="7" stroke="#22d3ee"/><line x1="7" y1="11" x2="17" y2="11" stroke="#94a3b8"/><line x1="7" y1="15" x2="14" y2="15" stroke="#94a3b8"/>'
  },
  diary_page_2: {
    id: 'diary_page_2',
    name: 'CHÂTEAU DIARY: ALCHEMY OF SWEETS',
    desc: '"A sprinkle of red strawberry powder with emerald sparkle herb creates cupcakes capable of purifying even the deepest sullenness."',
    type: 'lore',
    icon: '<rect x="4" y="3" width="16" height="18" rx="2" fill="#1e293b" stroke="#f59e0b"/><line x1="7" y1="7" x2="17" y2="7" stroke="#f59e0b"/><line x1="7" y1="11" x2="17" y2="11" stroke="#94a3b8"/><line x1="7" y1="15" x2="14" y2="15" stroke="#94a3b8"/>'
  },
  diary_page_3: {
    id: 'diary_page_3',
    name: 'CHÂTEAU DIARY: THE 4 LANTERNS',
    desc: '"The Solarium Garden holds 4 heart lanterns. When all four glow in magenta bliss, the stardust gates to the celestial realm awaken."',
    type: 'lore',
    icon: '<rect x="4" y="3" width="16" height="18" rx="2" fill="#1e293b" stroke="#10b981"/><line x1="7" y1="7" x2="17" y2="7" stroke="#10b981"/><line x1="7" y1="11" x2="17" y2="11" stroke="#94a3b8"/><line x1="7" y1="15" x2="14" y2="15" stroke="#94a3b8"/>'
  },
  diary_page_4: {
    id: 'diary_page_4',
    name: 'CHÂTEAU DIARY: GLOOM BEHEMOTH LORE',
    desc: '"Deep below in the Whispering Crypt sleeps the Grand Gloom Behemoth. He is not evil, just lonely. A direct beam of concentrated joy will restore his smile!"',
    type: 'lore',
    icon: '<rect x="4" y="3" width="16" height="18" rx="2" fill="#1e293b" stroke="#ec4899"/><line x1="7" y1="7" x2="17" y2="7" stroke="#ec4899"/><line x1="7" y1="11" x2="17" y2="11" stroke="#94a3b8"/><line x1="7" y1="15" x2="14" y2="15" stroke="#94a3b8"/>'
  },
  stardust_prism_core: {
    id: 'stardust_prism_core',
    name: 'STARDUST PRISM CORE',
    desc: 'Synthesized matrix of star sapphire and crystalline sugar. Combine with Golden Ribbon for the Astral Supernova Wand!',
    type: 'material',
    icon: '<polygon points="12 2 22 12 12 22 2 12" fill="#38bdf8" stroke="#f59e0b" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="#f472b6"/>'
  },
  astral_supernova_wand: {
    id: 'astral_supernova_wand',
    name: 'ASTRAL SUPERNOVA WAND',
    desc: 'The Sovereign Joy Tool of 5F Astral Spire. Emits concentrated starlight shockwaves that instantly radiate max joy!',
    type: 'weapon',
    icon: '<line x1="4" y1="20" x2="16" y2="8" stroke="#f59e0b" stroke-width="3"/><polygon points="18 4 21 9 16 11 13 6" fill="#38bdf8"/><circle cx="18" cy="6" r="3" fill="#ec4899"/>'
  },
  celestial_elixir: {
    id: 'celestial_elixir',
    name: 'CELESTIAL AMBROSIA ELIXIR',
    desc: 'Divine nectar of the Astral Realm. Permanent 100% Joy Vitality and grants magnetic joy attraction!',
    type: 'consumable',
    icon: '<polygon points="12 2 20 18 4 18" fill="#38bdf8"/><circle cx="12" cy="12" r="5" fill="#f59e0b"/>'
  },
  aurora_sugar_cake: {
    id: 'aurora_sugar_cake',
    name: 'AURORA SUGAR CAKE',
    desc: 'Celestial multi-tiered cake infused with starlight. Restores 100% Joy and triggers companion squad cheer parade!',
    type: 'consumable',
    icon: '<path d="M3 15h18l-2 7H5z" fill="#f472b6"/><path d="M5 10h14l-1 5H6z" fill="#38bdf8"/><circle cx="12" cy="6" r="3" fill="#f59e0b"/>'
  }
};

export class InventorySystem {
  constructor(gameState, callbacks) {
    this.gameState = gameState;
    this.callbacks = callbacks;

    this.invModal = document.getElementById('inventory-modal');
    this.invGridSlots = document.getElementById('inv-grid-slots');
    this.itemDetailName = document.getElementById('item-detail-name');
    this.itemDetailDesc = document.getElementById('item-detail-desc');
    this.btnInvUse = document.getElementById('btn-inv-use');
    this.btnInvCombine = document.getElementById('btn-inv-combine');
    this.btnInvDrop = document.getElementById('btn-inv-drop');

    // 3D Inspection Canvas & Setup
    this.inspectModal = document.getElementById('inspect-modal');
    this.inspectCanvas = document.getElementById('inspect-canvas');
    this.inspectCloseBtn = document.getElementById('inspect-close-btn');
    this.btnInvExamine = document.getElementById('btn-inv-examine');

    this.initInspectViewer();

    document.getElementById('inv-close-btn').addEventListener('click', () => this.toggle());

    this.btnInvUse.addEventListener('click', () => this.useSelected());
    this.btnInvCombine.addEventListener('click', () => this.startCombine());
    this.btnInvDrop.addEventListener('click', () => this.dropSelected());
    if (this.btnInvExamine) {
      this.btnInvExamine.addEventListener('click', () => this.examineSelected());
    }
  }

  initInspectViewer() {
    if (!this.inspectCanvas) return;
    this.inspectScene = new THREE.Scene();
    this.inspectScene.background = new THREE.Color(0x05070a);

    this.inspectCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.inspectCamera.position.set(0, 0, 4);

    this.inspectRenderer = new THREE.WebGLRenderer({ canvas: this.inspectCanvas, antialias: true });
    this.inspectRenderer.setSize(220, 220);

    const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
    light1.position.set(3, 4, 3);
    this.inspectScene.add(light1);

    const light2 = new THREE.AmbientLight(0x38bdf8, 0.6);
    this.inspectScene.add(light2);

    this.inspectMeshGroup = new THREE.Group();
    this.inspectScene.add(this.inspectMeshGroup);

    if (this.inspectCloseBtn) {
      this.inspectCloseBtn.addEventListener('click', () => {
        this.inspectModal.style.display = 'none';
      });
    }

    // Touch / Mouse Orbit on Inspect Canvas
    let isDragging = false;
    let prevX = 0, prevY = 0;

    this.inspectCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      this.inspectMeshGroup.rotation.y += dx * 0.02;
      this.inspectMeshGroup.rotation.x += dy * 0.02;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    this.inspectCanvas.addEventListener('touchstart', (e) => {
      isDragging = true;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      const dx = e.touches[0].clientX - prevX;
      const dy = e.touches[0].clientY - prevY;
      this.inspectMeshGroup.rotation.y += dx * 0.02;
      this.inspectMeshGroup.rotation.x += dy * 0.02;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchend', () => { isDragging = false; });

    // Render loop for inspect viewer
    const animateInspect = () => {
      requestAnimationFrame(animateInspect);
      if (this.inspectModal && this.inspectModal.style.display === 'flex') {
        if (!isDragging) {
          this.inspectMeshGroup.rotation.y += 0.01;
        }
        this.inspectRenderer.render(this.inspectScene, this.inspectCamera);
      }
    };
    animateInspect();
  }

  examineSelected() {
    if (this.gameState.selectedSlot === null) return;
    const slot = this.gameState.inventory[this.gameState.selectedSlot];
    if (!slot) return;

    audio.playPop();
    const item = ITEMS_DB[slot.id];
    document.getElementById('inspect-title').textContent = `INSPECTING: ${item.name}`;
    document.getElementById('inspect-desc').textContent = item.desc;

    // Build 3D item geometry in inspection scene
    while (this.inspectMeshGroup.children.length > 0) {
      this.inspectMeshGroup.remove(this.inspectMeshGroup.children[0]);
    }

    if (slot.id.includes('herb')) {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.4, 12), new THREE.MeshStandardMaterial({ color: 0x065f46 }));
      this.inspectMeshGroup.add(stem);
      for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
        leaf.scale.set(1.5, 0.4, 0.8);
        leaf.position.set(Math.sin(i * 1.5) * 0.4, -0.3 + i * 0.3, Math.cos(i * 1.5) * 0.4);
        this.inspectMeshGroup.add(leaf);
      }
    } else if (slot.id.includes('key')) {
      const head = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 12, 24), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
      head.position.y = 0.6;
      this.inspectMeshGroup.add(head);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
      this.inspectMeshGroup.add(shaft);

      const teeth = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.1), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
      teeth.position.set(0.18, -0.45, 0);
      this.inspectMeshGroup.add(teeth);
    } else if (slot.id === 'bliss_cupcake') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 0.6, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
      this.inspectMeshGroup.add(base);

      const frosting = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), new THREE.MeshStandardMaterial({ color: 0xec4899 }));
      frosting.position.y = 0.5;
      this.inspectMeshGroup.add(frosting);

      const cherry = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0x22d3ee }));
      cherry.position.y = 1.1;
      this.inspectMeshGroup.add(cherry);
    } else {
      const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), new THREE.MeshStandardMaterial({ color: 0xa855f7, wireframe: true }));
      this.inspectMeshGroup.add(orb);
    }

    this.inspectModal.style.display = 'flex';
  }

  toggle() {
    audio.playPop();
    const isOpen = this.invModal.style.display === 'flex';
    this.invModal.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) this.render();
  }

  addItem(itemId, qty = 1) {
    for (let i = 0; i < this.gameState.inventory.length; i++) {
      if (this.gameState.inventory[i] && this.gameState.inventory[i].id === itemId) {
        this.gameState.inventory[i].qty += qty;
        return true;
      }
    }
    for (let i = 0; i < this.gameState.inventory.length; i++) {
      if (this.gameState.inventory[i] === null) {
        this.gameState.inventory[i] = { id: itemId, qty };
        return true;
      }
    }
    return false;
  }

  consumeSlot(idx) {
    if (!this.gameState.inventory[idx]) return;
    this.gameState.inventory[idx].qty--;
    if (this.gameState.inventory[idx].qty <= 0) {
      this.gameState.inventory[idx] = null;
    }
  }

  render() {
    this.invGridSlots.innerHTML = '';
    this.gameState.inventory.forEach((slot, index) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'inv-slot' + (this.gameState.selectedSlot === index ? ' selected' : '') + (this.gameState.combineSourceSlot === index ? ' combine-target' : '');

      if (slot) {
        const item = ITEMS_DB[slot.id];
        slotEl.innerHTML = `
          <svg class="slot-icon" viewBox="0 0 24 24">${item.icon}</svg>
          <div class="slot-label">${item.name}</div>
          ${slot.qty > 1 ? `<span class="slot-qty">x${slot.qty}</span>` : ''}
        `;
      } else {
        slotEl.innerHTML = `<span style="color:var(--text-dim);font-size:9px;">EMPTY</span>`;
      }

      slotEl.addEventListener('click', () => { this.selectSlot(index); });
      this.invGridSlots.appendChild(slotEl);
    });
    this.updateDetails();
  }

  selectSlot(index) {
    audio.playPop();
    if (this.gameState.combineSourceSlot !== null) {
      if (this.gameState.combineSourceSlot === index) {
        this.gameState.combineSourceSlot = null;
        if (this.callbacks.onToast) this.callbacks.onToast('COMBINE CANCELLED');
      } else {
        this.executeCombine(this.gameState.combineSourceSlot, index);
        this.gameState.combineSourceSlot = null;
      }
      this.render();
      return;
    }
    this.gameState.selectedSlot = index;
    this.render();
  }

  updateDetails() {
    const slot = this.gameState.selectedSlot !== null ? this.gameState.inventory[this.gameState.selectedSlot] : null;
    if (slot) {
      const item = ITEMS_DB[slot.id];
      this.itemDetailName.textContent = item.name;
      this.itemDetailDesc.textContent = item.desc;
      this.btnInvUse.disabled = false;
      this.btnInvCombine.disabled = false;
      this.btnInvDrop.disabled = false;
      if (this.btnInvExamine) this.btnInvExamine.disabled = false;
    } else {
      this.itemDetailName.textContent = 'SELECT AN ITEM';
      this.itemDetailDesc.textContent = 'Inspect your collected treats, keys, and happiness enhancers.';
      this.btnInvUse.disabled = true;
      this.btnInvCombine.disabled = true;
      this.btnInvDrop.disabled = true;
      if (this.btnInvExamine) this.btnInvExamine.disabled = true;
    }
  }

  useSelected() {
    if (this.gameState.selectedSlot === null) return;
    const slot = this.gameState.inventory[this.gameState.selectedSlot];
    if (!slot) return;

    const item = ITEMS_DB[slot.id];
    if (item.type === 'consumable') {
      audio.playCheer();
      const healAmount = slot.id === 'herb_green' ? 35 : (slot.id === 'herb_double' ? 70 : 100);
      this.gameState.joy = Math.min(100, this.gameState.joy + healAmount);
      if (this.callbacks.onToast) this.callbacks.onToast(`CONSUMED ${item.name}! JOY RESTORED.`);
      slot.qty--;
      if (slot.qty <= 0) this.gameState.inventory[this.gameState.selectedSlot] = null;
      this.updateVitalityHUD();
      this.render();
    } else {
      if (this.callbacks.onToast) this.callbacks.onToast(`${item.name} CANNOT BE CONSUMED DIRECTLY.`);
    }
  }

  startCombine() {
    if (this.gameState.selectedSlot === null) return;
    const slot = this.gameState.inventory[this.gameState.selectedSlot];
    if (!slot) return;

    this.gameState.combineSourceSlot = this.gameState.selectedSlot;
    if (this.callbacks.onToast) this.callbacks.onToast('SELECT SECOND ITEM TO COMBINE WITH');
    this.render();
  }

  dropSelected() {
    if (this.gameState.selectedSlot === null) return;
    const slot = this.gameState.inventory[this.gameState.selectedSlot];
    if (!slot) return;

    if (this.callbacks.onToast) this.callbacks.onToast(`DISCARDED ${ITEMS_DB[slot.id].name}`);
    this.gameState.inventory[this.gameState.selectedSlot] = null;
    this.gameState.selectedSlot = null;
    this.render();
  }

  executeCombine(idx1, idx2) {
    const item1 = this.gameState.inventory[idx1];
    const item2 = this.gameState.inventory[idx2];
    if (!item1 || !item2) return;

    const ids = [item1.id, item2.id].sort().join('+');

    // 1. Green + Green = Double Herb (70% Heal)
    if (ids === 'herb_green+herb_green') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('herb_double', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: DOUBLE SPARKLE HERB (G+G)! ★');
      return;
    }

    // 2. Double Herb + Green = Ultra Elixir (100% Heal + Shield)
    if (ids === 'herb_double+herb_green') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('elixir_ultra', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: ULTRA JOY ELIXIR (G+G+G)! ★');
      return;
    }

    // 3. Green Herb + Sweet Red Powder = Mega Bliss Cupcake
    if (ids === 'herb_green+powder_red') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('bliss_cupcake', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: MEGA BLISS CUPCAKE! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('bliss_cupcake');
      return;
    }

    // 4. Silver Key + Gold Ribbon = Master Ballroom Key
    if (ids === 'key_foyer+ribbon_gold') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('key_master', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: MASTER BALLROOM KEY! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('key_master');
      return;
    }

    // 5. Golden Sun Crest + Prismatic Sugar = Joy Dynamo Core
    if (ids === 'crest_royal+sugar_crystal') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('dynamo_core', 1);
      audio.playCheer();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: JOY DYNAMO CORE! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('dynamo_core');
      return;
    }

    // 6. Mega Bliss Cupcake + Prismatic Sugar = Hyper Bliss Confection
    if (ids === 'bliss_cupcake+sugar_crystal') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('elixir_hyper', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: HYPER BLISS CONFECTION! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('elixir_hyper');
      return;
    }

    // 7. Double Herb + Prismatic Sugar = Rainbow Starlight Macaron
    if (ids === 'herb_double+sugar_crystal') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('macaron_rainbow', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: RAINBOW STARLIGHT MACARON! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('macaron_rainbow');
      return;
    }

    // 8. Sweet Red Powder + Gold Ribbon = Sparkle Cotton Candy
    if (ids === 'powder_red+ribbon_gold') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('cotton_candy', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: SPARKLE COTTON CANDY! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('cotton_candy');
      return;
    }

    // 9. Star Sapphire Gem + Prismatic Sugar = Stardust Prism Core
    if (ids === 'gem_star+sugar_crystal') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('stardust_prism_core', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: STARDUST PRISM CORE! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('stardust_prism_core');
      return;
    }

    // 10. Stardust Prism Core + Golden Ribbon = Astral Supernova Wand
    if (ids === 'ribbon_gold+stardust_prism_core') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('astral_supernova_wand', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: ASTRAL SUPERNOVA WAND! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('astral_supernova_wand');
      return;
    }

    // 11. Ultra Joy Elixir + Prismatic Sugar = Celestial Ambrosia Elixir
    if (ids === 'elixir_ultra+sugar_crystal') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('celestial_elixir', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: CELESTIAL AMBROSIA ELIXIR! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('celestial_elixir');
      return;
    }

    // 12. Mega Bliss Cupcake + Star Sapphire Gem = Aurora Sugar Cake
    if (ids === 'bliss_cupcake+gem_star') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('aurora_sugar_cake', 1);
      audio.playCheer();
      audio.playKawaiiSparkleChime();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: AURORA SUGAR CAKE! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('aurora_sugar_cake');
      return;
    }

    if (this.callbacks.onToast) this.callbacks.onToast('THESE ITEMS CANNOT BE COMBINED.');
  }

  updateVitalityHUD() {
    const joyVal = document.getElementById('joy-status-val');
    if (this.gameState.joy >= 80) {
      joyVal.textContent = `MAX BLISS ${this.gameState.joy}%`;
      joyVal.style.color = 'var(--emerald-joy)';
    } else if (this.gameState.joy >= 40) {
      joyVal.textContent = `CHEERFUL ${this.gameState.joy}%`;
      joyVal.style.color = 'var(--cyan-glow)';
    } else {
      joyVal.textContent = `GRUMPY ${this.gameState.joy}%`;
      joyVal.style.color = 'var(--gold-accent)';
    }
  }
}
