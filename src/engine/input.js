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
    onToggleAim,
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
    if (e.code === 'Space') onFire();
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
    joystickStick.style.transform = `translate3d(0px, 0px, 0px)`;
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

    joystickStick.style.transform = `translate3d(${dx}px, ${dy}px, 0px)`;
    input.moveX = dx / maxRadius;
    input.moveY = dy / maxRadius;
  }

  // Touch Swipe for Camera Rotation
  let lookTouchId = null;
  let lastTouchX = 0;

  window.addEventListener('touchstart', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (
        touch.clientX > window.innerWidth * 0.45 &&
        !e.target.closest('.action-cluster') &&
        !e.target.closest('.weapon-dock') &&
        !e.target.closest('.modal-overlay') &&
        !e.target.closest('#piano-modal')
      ) {
        if (lookTouchId === null) {
          lookTouchId = touch.identifier;
          lastTouchX = touch.clientX;
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
        onRotateCamera(deltaX * 0.007);
        lastTouchX = touch.clientX;
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
  document.getElementById('btn-aim').addEventListener('click', onToggleAim);
  document.getElementById('btn-fire').addEventListener('click', onFire);
  document.getElementById('btn-interact').addEventListener('click', onContextInteract);
  document.getElementById('prompt-box').addEventListener('click', onContextInteract);
  document.getElementById('btn-inventory').addEventListener('click', onToggleInventory);
  document.getElementById('btn-quest-log').addEventListener('click', onToggleQuestLog);
  document.getElementById('active-quest-pill').addEventListener('click', onToggleQuestLog);
  document.getElementById('btn-minimap').addEventListener('click', onToggleFullMap);
  document.getElementById('btn-full-map').addEventListener('click', onToggleFullMap);
  document.getElementById('btn-cycle-weapon').addEventListener('click', onCycleWeapon);

  document.querySelectorAll('.weapon-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      onSetWeapon(slot.getAttribute('data-weapon'));
    });
  });

  document.getElementById('btn-audio-toggle').addEventListener('click', () => {
    audio.init();
    audio.muted = !audio.muted;
    callbacks.onToast(audio.muted ? 'AUDIO MUTED' : 'AUDIO ACTIVE');
  });
}
