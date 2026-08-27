import { audio } from '../engine/audio.js';

export const ITEMS_DB = {
  herb_green: {
    id: 'herb_green',
    name: 'SPARKLE HERB (GREEN)',
    desc: 'A vibrant peppermint herb emitting emerald sparkles. Restores 35% Joy Vitality.',
    type: 'consumable',
    icon: '<circle cx="12" cy="12" r="8" fill="#10b981"/><path d="M12 4v16M4 12h16" stroke="#05070a" stroke-width="2"/>'
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
    desc: 'Engraved with a smiling sun emblem. Unlocks the East Wing Library.',
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
    desc: 'Ancient alchemical recipe scroll found on the Library Lectern.',
    type: 'quest_item',
    icon: '<rect x="4" y="4" width="16" height="16" rx="2" fill="#a855f7"/><line x1="8" y1="8" x2="16" y2="8" stroke="#fff"/><line x1="8" y1="12" x2="16" y2="12" stroke="#fff"/>'
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

    document.getElementById('inv-close-btn').addEventListener('click', () => this.toggle());

    this.btnInvUse.addEventListener('click', () => this.useSelected());
    this.btnInvCombine.addEventListener('click', () => this.startCombine());
    this.btnInvDrop.addEventListener('click', () => this.dropSelected());
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
    } else {
      this.itemDetailName.textContent = 'SELECT AN ITEM';
      this.itemDetailDesc.textContent = 'Inspect your collected treats, keys, and happiness enhancers.';
      this.btnInvUse.disabled = true;
      this.btnInvCombine.disabled = true;
      this.btnInvDrop.disabled = true;
    }
  }

  useSelected() {
    if (this.gameState.selectedSlot === null) return;
    const slot = this.gameState.inventory[this.gameState.selectedSlot];
    if (!slot) return;

    const item = ITEMS_DB[slot.id];
    if (item.type === 'consumable') {
      audio.playCheer();
      this.gameState.joy = Math.min(100, this.gameState.joy + 40);
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

    if (ids === 'herb_green+powder_red') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('bliss_cupcake', 1);
      audio.playCheer();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: MEGA BLISS CUPCAKE! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('bliss_cupcake');
      return;
    }

    if (ids === 'key_foyer+ribbon_gold') {
      this.consumeSlot(idx1);
      this.consumeSlot(idx2);
      this.addItem('key_master', 1);
      audio.playCheer();
      if (this.callbacks.onToast) this.callbacks.onToast('★ CRAFTED: MASTER BALLROOM KEY! ★');
      if (this.callbacks.onItemCombined) this.callbacks.onItemCombined('key_master');
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
