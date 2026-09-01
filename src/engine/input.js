import { audio } from './audio.js';

export const input = {
  moveX: 0,
  moveY: 0,
  keys: {},
  isMouseDown: false,
  lastMouseX: 0,
  lastMouseY: 0
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
    if (e.code === 'KeyT') window.dispatchEvent(new CustomEvent('AI_DIALOGUE_TRIGGER'));
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

  // Desktop Mouse Look Navigation on Canvas
  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    canvasContainer.addEventListener('mousedown', (e) => {
      audio.init();
      if (e.button === 0) { // Left-click drag look
        input.isMouseDown = true;
        input.lastMouseX = e.clientX;
        input.lastMouseY = e.clientY;
      } else if (e.button === 2) { // Right-click aim toggle
        e.preventDefault();
        onToggleAim();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!input.isMouseDown) return;
      const deltaX = e.clientX - input.lastMouseX;
      const deltaY = e.clientY - input.lastMouseY;
      onRotateCamera(deltaX * 0.005, deltaY * 0.003);
      input.lastMouseX = e.clientX;
      input.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        input.isMouseDown = false;
      }
    });

    canvasContainer.addEventListener('contextmenu', (e) => e.preventDefault());
  }

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
      input.moveY = -dy / maxRadius; // Up is forward (+Z)
    }
  }

  // 360° Touch Drag for Camera & Player Rotation
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
        onRotateCamera(deltaX * 0.007, deltaY * 0.004);
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

  // Haptic Feedback Helper
  function triggerHaptic(ms = 12) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  }

  // UI Button Bindings with Haptic Responses
  const btnAim = document.getElementById('btn-aim');
  if (btnAim) btnAim.addEventListener('click', () => { triggerHaptic(15); onToggleAim(); });

  const btnFire = document.getElementById('btn-fire');
  if (btnFire) btnFire.addEventListener('click', () => { triggerHaptic(20); onFire(); });

  const btnInteract = document.getElementById('btn-interact');
  if (btnInteract) btnInteract.addEventListener('click', () => { triggerHaptic(15); onContextInteract(); });

  const btnTurn = document.getElementById('btn-quick-turn');
  if (btnTurn) btnTurn.addEventListener('click', () => { triggerHaptic(18); onQuickTurn(); });

  const btnViewMode = document.getElementById('btn-view-mode');
  if (btnViewMode) btnViewMode.addEventListener('click', () => { triggerHaptic(12); onCycleViewMode(); });

  const promptBox = document.getElementById('prompt-box');
  if (promptBox) promptBox.addEventListener('click', () => { triggerHaptic(12); onContextInteract(); });

  const btnInv = document.getElementById('btn-inventory');
  if (btnInv) btnInv.addEventListener('click', () => { triggerHaptic(12); onToggleInventory(); });

  const btnQuest = document.getElementById('btn-quest-log');
  if (btnQuest) btnQuest.addEventListener('click', () => { triggerHaptic(12); onToggleQuestLog(); });

  const questPill = document.getElementById('active-quest-pill');
  if (questPill) questPill.addEventListener('click', () => { triggerHaptic(12); onToggleQuestLog(); });

  const btnMiniMap = document.getElementById('btn-minimap');
  if (btnMiniMap) btnMiniMap.addEventListener('click', () => { triggerHaptic(12); onToggleFullMap(); });

  const btnFullMap = document.getElementById('btn-full-map');
  if (btnFullMap) btnFullMap.addEventListener('click', () => { triggerHaptic(12); onToggleFullMap(); });

  const btnCycle = document.getElementById('btn-cycle-weapon');
  if (btnCycle) btnCycle.addEventListener('click', () => { triggerHaptic(15); onCycleWeapon(); });

  document.querySelectorAll('.weapon-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      triggerHaptic(12);
      onSetWeapon(slot.getAttribute('data-weapon'));
    });
  });

  // Gamepad Polling Loop
  let prevPadButtons = {};

  function pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = gamepads[0] || gamepads[1];
    if (pad) {
      // Left Analog Stick Movement
      if (Math.abs(pad.axes[0]) > 0.15) input.moveX = pad.axes[0];
      if (Math.abs(pad.axes[1]) > 0.15) input.moveY = -pad.axes[1];

      // Right Analog Stick Camera Look
      if (Math.abs(pad.axes[2]) > 0.15 || Math.abs(pad.axes[3]) > 0.15) {
        onRotateCamera(pad.axes[2] * 0.04, pad.axes[3] * 0.02);
      }

      // Buttons
      if (pad.buttons[0]?.pressed && !prevPadButtons[0]) onContextInteract();
      if (pad.buttons[1]?.pressed && !prevPadButtons[1]) onQuickTurn();
      if (pad.buttons[2]?.pressed && !prevPadButtons[2]) onFire();
      if (pad.buttons[3]?.pressed && !prevPadButtons[3]) onToggleInventory();
      if (pad.buttons[5]?.pressed && !prevPadButtons[5]) onCycleWeapon();
      if (pad.buttons[6]?.pressed && !prevPadButtons[6]) onToggleAim();
      if (pad.buttons[7]?.pressed && !prevPadButtons[7]) onFire();
      if (pad.buttons[9]?.pressed && !prevPadButtons[9]) onToggleFullMap();

      pad.buttons.forEach((b, idx) => { prevPadButtons[idx] = b.pressed; });
    }
    requestAnimationFrame(pollGamepad);
  }
  requestAnimationFrame(pollGamepad);
}
