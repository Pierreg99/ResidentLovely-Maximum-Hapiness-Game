import { audio } from './audio.js';

export const input = {
  moveX: 0,
  moveY: 0,
  keys: {},
  isMouseDown: false,
  lastMouseX: 0,
  lastMouseY: 0,
  lookActive: false,
  fireHeld: false
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

  function triggerHaptic(ms = 12) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  }

  function isUiChrome(el) {
    if (!el || !el.closest) return false;
    return !!(
      el.closest('.action-cluster') ||
      el.closest('#joystick-zone') ||
      el.closest('#look-zone') ||
      el.closest('.weapon-dock') ||
      el.closest('.hud-header') ||
      el.closest('.modal-overlay') ||
      el.closest('#piano-modal') ||
      el.closest('#inspect-modal') ||
      el.closest('#save-modal') ||
      el.closest('#loading-screen') ||
      el.closest('#prompt-box') ||
      el.closest('.btn-hud-icon') ||
      el.closest('.active-quest-pill')
    );
  }

  // Block page scroll / pull-to-refresh while playing (except scrollable modals)
  const blockScroll = (e) => {
    const t = e.target;
    if (t && t.closest && t.closest('.modal-overlay, #piano-modal, #inspect-modal, #save-modal, .map-blueprint-wrapper, .quest-log-body, .inventory-grid')) {
      return;
    }
    if (e.cancelable) e.preventDefault();
  };
  document.addEventListener('touchmove', blockScroll, { passive: false });
  document.addEventListener('gesturestart', (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });

  // Keyboard Event Listeners (desktop unchanged)
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
      if (e.button === 0) {
        input.isMouseDown = true;
        input.lastMouseX = e.clientX;
        input.lastMouseY = e.clientY;
      } else if (e.button === 2) {
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
      if (e.button === 0) input.isMouseDown = false;
    });

    canvasContainer.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // --- Floating Virtual Joystick (dynamic origin, large hit target) ---
  const joystickZone = document.getElementById('joystick-zone');
  const joystickBase = joystickZone ? joystickZone.querySelector('.joystick-base') : null;
  const joystickStick = document.getElementById('joystick-stick');
  let joystickTouchId = null;
  let joystickOrigin = { x: 0, y: 0 };
  const JOY_RADIUS = 52;
  const JOY_DEADZONE = 0.12;

  function setJoystickVisual(dx, dy) {
    if (joystickStick) joystickStick.style.transform = `translate3d(${dx}px, ${dy}px, 0px)`;
    if (joystickBase) joystickBase.classList.toggle('active', Math.hypot(dx, dy) > 2);
  }

  function updateJoystick(clientX, clientY) {
    let dx = clientX - joystickOrigin.x;
    let dy = clientY - joystickOrigin.y;
    const dist = Math.hypot(dx, dy);
    if (dist > JOY_RADIUS) {
      dx = (dx / dist) * JOY_RADIUS;
      dy = (dy / dist) * JOY_RADIUS;
    }
    setJoystickVisual(dx, dy);
    let nx = dx / JOY_RADIUS;
    let ny = -dy / JOY_RADIUS;
    if (Math.abs(nx) < JOY_DEADZONE) nx = 0;
    if (Math.abs(ny) < JOY_DEADZONE) ny = 0;
    input.moveX = nx;
    input.moveY = ny;
  }

  function resetJoystick() {
    joystickTouchId = null;
    input.moveX = 0;
    input.moveY = 0;
    setJoystickVisual(0, 0);
    if (joystickBase) {
      joystickBase.style.left = '';
      joystickBase.style.top = '';
    }
  }

  if (joystickZone) {
    joystickZone.addEventListener('touchstart', (e) => {
      audio.init();
      if (e.cancelable) e.preventDefault();
      const touch = e.changedTouches[0];
      joystickTouchId = touch.identifier;
      const rect = joystickZone.getBoundingClientRect();
      // Floating origin: center under thumb within zone bounds
      const localX = Math.min(Math.max(touch.clientX - rect.left, 40), rect.width - 40);
      const localY = Math.min(Math.max(touch.clientY - rect.top, 40), rect.height - 40);
      joystickOrigin = { x: rect.left + localX, y: rect.top + localY };
      if (joystickBase) {
        const baseW = joystickBase.offsetWidth || 118;
        joystickBase.style.left = `${localX - baseW / 2}px`;
        joystickBase.style.top = `${localY - baseW / 2}px`;
      }
      updateJoystick(touch.clientX, touch.clientY);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (joystickTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId) {
          if (e.cancelable) e.preventDefault();
          updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
          break;
        }
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId) {
          resetJoystick();
          break;
        }
      }
    });

    window.addEventListener('touchcancel', resetJoystick);
  }

  // --- Dedicated Look Zone + right-half canvas look ---
  const lookZone = document.getElementById('look-zone');
  let lookTouchId = null;
  let lastTouchX = 0;
  let lastTouchY = 0;

  function beginLook(touch) {
    lookTouchId = touch.identifier;
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
    input.lookActive = true;
    if (lookZone) lookZone.classList.add('active');
  }

  function endLook() {
    lookTouchId = null;
    input.lookActive = false;
    if (lookZone) lookZone.classList.remove('active');
  }

  if (lookZone) {
    lookZone.addEventListener('touchstart', (e) => {
      audio.init();
      if (e.cancelable) e.preventDefault();
      if (lookTouchId === null) beginLook(e.changedTouches[0]);
    }, { passive: false });
  }

  window.addEventListener('touchstart', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (isUiChrome(e.target) || isUiChrome(touch.target)) continue;
      // Right 55% of screen for look when not on chrome
      if (touch.clientX > window.innerWidth * 0.45 && lookTouchId === null) {
        beginLook(touch);
      }
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (lookTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === lookTouchId) {
        if (e.cancelable) e.preventDefault();
        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;
        onRotateCamera(deltaX * 0.008, deltaY * 0.0045);
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
        break;
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchId) {
        endLook();
        break;
      }
    }
  });

  window.addEventListener('touchcancel', endLook);

  // --- Action buttons: pointer/touch-first (no 300ms click lag) ---
  function bindAction(id, handler, opts = {}) {
    const el = document.getElementById(id);
    if (!el) return;
    let armed = false;

    const press = (e) => {
      audio.init();
      if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
      if (armed && opts.hold) return;
      armed = true;
      el.classList.add('active');
      triggerHaptic(opts.haptic || 14);
      handler(true);
      if (opts.hold) input.fireHeld = true;
    };

    const release = () => {
      if (!armed) return;
      armed = false;
      el.classList.remove('active');
      if (opts.hold) {
        input.fireHeld = false;
        handler(false);
      }
    };

    el.addEventListener('touchstart', press, { passive: false });
    el.addEventListener('touchend', release);
    el.addEventListener('touchcancel', release);
    el.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      press(e);
    });
    el.addEventListener('mouseup', release);
    el.addEventListener('mouseleave', release);
    // Keyboard-accessible fallback
    el.addEventListener('click', (e) => {
      // Ignore synthetic click after touch
      if (e.detail === 0) {
        triggerHaptic(opts.haptic || 12);
        handler(true);
        if (opts.hold) handler(false);
      }
    });
  }

  bindAction('btn-aim', () => onToggleAim(), { haptic: 15 });
  bindAction('btn-fire', (down) => {
    if (down !== false) onFire();
  }, { haptic: 20, hold: true });
  bindAction('btn-interact', () => onContextInteract(), { haptic: 15 });
  bindAction('btn-quick-turn', () => onQuickTurn && onQuickTurn(), { haptic: 18 });
  bindAction('btn-view-mode', () => onCycleViewMode && onCycleViewMode(), { haptic: 12 });
  bindAction('btn-inventory', () => onToggleInventory(), { haptic: 12 });
  bindAction('btn-quest-log', () => onToggleQuestLog(), { haptic: 12 });
  bindAction('btn-minimap', () => onToggleFullMap(), { haptic: 12 });
  bindAction('btn-full-map', () => onToggleFullMap(), { haptic: 12 });
  bindAction('btn-cycle-weapon', () => onCycleWeapon(), { haptic: 15 });

  const promptBox = document.getElementById('prompt-box');
  if (promptBox) {
    const promptPress = (e) => {
      if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
      triggerHaptic(12);
      onContextInteract();
    };
    promptBox.addEventListener('touchstart', promptPress, { passive: false });
    promptBox.addEventListener('click', () => onContextInteract());
  }

  const questPill = document.getElementById('active-quest-pill');
  if (questPill) {
    questPill.addEventListener('touchstart', (e) => {
      if (e.cancelable) e.preventDefault();
      triggerHaptic(12);
      onToggleQuestLog();
    }, { passive: false });
    questPill.addEventListener('click', () => onToggleQuestLog());
  }

  document.querySelectorAll('.weapon-slot').forEach(slot => {
    const fire = (e) => {
      if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
      triggerHaptic(12);
      onSetWeapon(slot.getAttribute('data-weapon'));
    };
    slot.addEventListener('touchstart', fire, { passive: false });
    slot.addEventListener('click', () => onSetWeapon(slot.getAttribute('data-weapon')));
  });

  // Gamepad Polling Loop
  let prevPadButtons = {};

  function pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = gamepads[0] || gamepads[1];
    if (pad) {
      if (Math.abs(pad.axes[0]) > 0.15) input.moveX = pad.axes[0];
      else if (joystickTouchId === null && !input.keys['KeyA'] && !input.keys['KeyD'] && !input.keys['ArrowLeft'] && !input.keys['ArrowRight']) {
        // leave keyboard/touch values alone when stick centered
      }
      if (Math.abs(pad.axes[1]) > 0.15) input.moveY = -pad.axes[1];

      if (Math.abs(pad.axes[2]) > 0.15 || Math.abs(pad.axes[3]) > 0.15) {
        onRotateCamera(pad.axes[2] * 0.04, pad.axes[3] * 0.02);
      }

      if (pad.buttons[0]?.pressed && !prevPadButtons[0]) onContextInteract();
      if (pad.buttons[1]?.pressed && !prevPadButtons[1]) onQuickTurn && onQuickTurn();
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
