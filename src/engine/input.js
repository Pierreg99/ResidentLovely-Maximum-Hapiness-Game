import { audio } from './audio.js';

export const input = {
  moveX: 0,
  moveY: 0,
  keys: {}
};

export function initInput(callbacks) {
  const {
    onToggleInventory,
    onToggleQuestLog,
    onToggleFullMap,
    onContextInteract,
    onFire,
    onSetWeapon,
    onCycleWeapon,
    onCycleViewMode,
    onToggleAim,
    onQuickTurn,
    onRotateCamera
  } = callbacks;

  // Keyboard Event Listeners
  window.addEventListener('keydown', (e) => {
    audio.init();
    input.keys[e.code] = true;
    if (e.code === 'KeyI' || e.code === 'Tab') {
      e.preventDefault();
      onToggleInventory();
    }
    if (e.code === 'KeyQ') onToggleQuestLog();
    if (e.code === 'KeyM') onToggleFullMap();
    if (e.code === 'KeyE') onContextInteract();
    if (e.code === 'KeyV') {
      if (onCycleViewMode) onCycleViewMode();
    }
    if (e.code === 'KeyZ') {
      if (onQuickTurn) onQuickTurn();
    }
    if (e.code === 'Space') {
      if (input.keys['KeyS'] || input.keys['ArrowDown']) {
        if (onQuickTurn) onQuickTurn();
      } else {
        onFire();
      }
    }
    if (e.code === 'Digit1') onSetWeapon('pistol');
    if (e.code === 'Digit2') onSetWeapon('shotgun');
    if (e.code === 'Digit3') onSetWeapon('mortar');
    if (e.code === 'Digit4') onSetWeapon('beam');
  });

  window.addEventListener('keyup', (e) => {
    input.keys[e.code] = false;
  });

  // Touch Virtual Joystick
  const joystickZone = document.getElementById('joystick-zone');
  const joystickStick = document.getElementById('joystick-stick');
  let joystickTouchId = null;
  let joystickOrigin = { x: 0, y: 0 };

  if (joystickZone) {
    joystickZone.addEventListener('touchstart', (e) => {
      audio.init();
      const touch = e.changedTouches[0];
      joystickTouchId = touch.identifier;
      const rect = joystickZone.getBoundingClientRect();
      joystickOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      updateJoystick(touch.clientX, touch.clientY);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (joystickTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId) {
          updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
          break;
        }
      }
    }, { passive: false });

    function resetJoystick() {
      joystickTouchId = null;
      input.moveX = 0;
      input.moveY = 0;
      if (joystickStick) joystickStick.style.transform = `translate3d(0px, 0px, 0px)`;
    }

    window.addEventListener('touchend', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId) {
          resetJoystick();
          break;
        }
      }
    });

    window.addEventListener('touchcancel', resetJoystick);

    function updateJoystick(clientX, clientY) {
      const maxRadius = 42;
      let dx = clientX - joystickOrigin.x;
      let dy = clientY - joystickOrigin.y;
      const dist = Math.hypot(dx, dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      if (joystickStick) joystickStick.style.transform = `translate3d(${dx}px, ${dy}px, 0px)`;
      input.moveX = dx / maxRadius;
      input.moveY = dy / maxRadius;
    }
  }

  // 360° Touch Swipe for Camera Yaw & Pitch Orbit
  let lookTouchId = null;
  let lastTouchX = 0;
  let lastTouchY = 0;

  window.addEventListener('touchstart', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (
        touch.clientX > window.innerWidth * 0.42 &&
        !e.target.closest('.action-cluster') &&
        !e.target.closest('.weapon-dock') &&
        !e.target.closest('.modal-overlay') &&
        !e.target.closest('#piano-modal') &&
        !e.target.closest('#inspect-modal') &&
        !e.target.closest('#save-modal')
      ) {
        if (lookTouchId === null) {
          lookTouchId = touch.identifier;
          lastTouchX = touch.clientX;
          lastTouchY = touch.clientY;
        }
      }
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (lookTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === lookTouchId) {
        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;
        onRotateCamera(deltaX * 0.008, deltaY * 0.005);
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
        break;
      }
    }
  });

  window.addEventListener('touchend', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchId) {
        lookTouchId = null;
        break;
      }
    }
  });

  // UI Button Bindings
  const btnAim = document.getElementById('btn-aim');
  if (btnAim) btnAim.addEventListener('click', onToggleAim);

  const btnFire = document.getElementById('btn-fire');
  if (btnFire) btnFire.addEventListener('click', onFire);

  const btnInteract = document.getElementById('btn-interact');
  if (btnInteract) btnInteract.addEventListener('click', onContextInteract);

  const btnTurn = document.getElementById('btn-quick-turn');
  if (btnTurn) btnTurn.addEventListener('click', onQuickTurn);

  const btnViewMode = document.getElementById('btn-view-mode');
  if (btnViewMode) btnViewMode.addEventListener('click', onCycleViewMode);

  const promptBox = document.getElementById('prompt-box');
  if (promptBox) promptBox.addEventListener('click', onContextInteract);

  const btnInv = document.getElementById('btn-inventory');
  if (btnInv) btnInv.addEventListener('click', onToggleInventory);

  const btnQuest = document.getElementById('btn-quest-log');
  if (btnQuest) btnQuest.addEventListener('click', onToggleQuestLog);

  const questPill = document.getElementById('active-quest-pill');
  if (questPill) questPill.addEventListener('click', onToggleQuestLog);

  const btnMiniMap = document.getElementById('btn-minimap');
  if (btnMiniMap) btnMiniMap.addEventListener('click', onToggleFullMap);

  const btnFullMap = document.getElementById('btn-full-map');
  if (btnFullMap) btnFullMap.addEventListener('click', onToggleFullMap);

  const btnCycle = document.getElementById('btn-cycle-weapon');
  if (btnCycle) btnCycle.addEventListener('click', onCycleWeapon);

  document.querySelectorAll('.weapon-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      onSetWeapon(slot.getAttribute('data-weapon'));
    });
  });

  const btnAudio = document.getElementById('btn-audio-toggle');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      audio.init();
      audio.muted = !audio.muted;
      callbacks.onToast(audio.muted ? 'AUDIO MUTED' : 'AUDIO ACTIVE');
    });
  }
}
