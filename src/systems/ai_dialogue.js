// =========================================================================
// RESIDENT LOVELY - AI DIALOGUE ENGINE (v6.0)
// Standard: NEXUS PRIVÉ v6.0 | Strict Zero-Emoji Protocol
// =========================================================================

export const AIDialogue = {
  dialogueModal: null,
  textElement: null,
  isTyping: false,
  currentCallback: null,
  llmEndpoint: 'http://localhost:11434/api/generate',

  init() {
    this.createDialogueUI();
  },

  createDialogueUI() {
    const modal = document.createElement('div');
    modal.id = 'ai-dialogue-modal';
    modal.style.position = 'absolute';
    modal.style.bottom = '20px';
    modal.style.left = '50%';
    modal.style.transform = 'translateX(-50%)';
    modal.style.width = '80%';
    modal.style.maxWidth = '800px';
    modal.style.padding = '16px';
    modal.style.background = 'linear-gradient(180deg, rgba(5,7,10,0.9) 0%, rgba(15,23,42,0.95) 100%)';
    modal.style.border = '1px solid #22d3ee';
    modal.style.borderTop = '3px solid #f59e0b';
    modal.style.color = '#e2e8f0';
    modal.style.fontFamily = 'serif';
    modal.style.fontSize = '18px';
    modal.style.lineHeight = '1.5';
    modal.style.zIndex = '1000';
    modal.style.display = 'none';
    modal.style.boxShadow = '0 8px 32px rgba(0,0,0,0.8)';
    
    const textEl = document.createElement('div');
    textEl.id = 'ai-dialogue-text';
    modal.appendChild(textEl);
    
    document.body.appendChild(modal);
    this.dialogueModal = modal;
    this.textElement = textEl;
  },

  async generateResponse(speaker, context, callback) {
    this.dialogueModal.style.display = 'block';
    this.textElement.innerHTML = `<span style="color:#22d3ee">${speaker}:</span> <span style="color:#94a3b8">Thinking...</span>`;
    this.currentCallback = callback;
    
    const prompt = `You are ${speaker} in Resident Lovely. Context: ${context}. Respond strictly in 2-3 sentences. No emojis.`;
    
    try {
      const response = await fetch(this.llmEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3', // Or any local model
          prompt: prompt,
          stream: false
        })
      });
      
      if (!response.ok) throw new Error('LLM unavailable');
      const data = await response.json();
      this.typeText(speaker, data.response);
    } catch (e) {
      console.warn("LLM hook failed, falling back to procedural dialogue:", e);
      this.typeText(speaker, this.getProceduralFallback(speaker, context));
    }
  },

  getProceduralFallback(speaker, context) {
    const ctx = (context || '').toLowerCase();
    
    if (speaker === 'Joy') {
      if (ctx.includes('low') || ctx.includes('hp') || ctx.includes('vitality')) {
        return "Be careful! Your joy vitality is running low. Let's combine some sparkle herbs right away.";
      }
      if (ctx.includes('boss') || ctx.includes('chef') || ctx.includes('clockwork')) {
        return "That powerful aura ahead... It must be the sector guardian! Ready your confetti blaster!";
      }
      if (ctx.includes('puzzle') || ctx.includes('piano') || ctx.includes('valve')) {
        return "There's a subtle harmonic resonance in this chamber. Look closely at the glyph markings.";
      }
      if (ctx.includes('endless') || ctx.includes('dimension') || ctx.includes('void')) {
        return "The Endless Dimension shifts beneath our feet. Keep your guard up and collect the blessing modifiers!";
      }
      return "The air feels warm with stardust. Let's explore every corner of this estate together.";
    }

    if (speaker === 'Gloom Bear') {
      if (ctx.includes('boss')) return "The big boss is scary, but our sparkling friendship is stronger!";
      return "I feel much happier following you! Look, shiny sparkles over there!";
    }

    if (speaker === 'Bun-Bun') {
      if (ctx.includes('low')) return "Hop hop! Quick, munch on a Mega Bliss Cupcake!";
      return "Hop! I smell fresh strawberry confetti around the corner!";
    }

    if (speaker === 'Master Chef') {
      return "The secret ingredient to maximum joy was love and sweetness all along!";
    }

    return "A radiant shimmer of wholesome joy echoes softly through the chamber.";
  },

  typeText(speaker, text) {
    this.isTyping = true;
    let i = 0;
    this.textElement.innerHTML = `<span style="color:#22d3ee;font-weight:bold">${speaker}:</span> `;
    
    const interval = setInterval(() => {
      if (i < text.length) {
        this.textElement.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
        this.isTyping = false;
        setTimeout(() => {
          this.closeDialogue();
        }, 3000);
      }
    }, 30);
  },

  closeDialogue() {
    this.dialogueModal.style.display = 'none';
    if (this.currentCallback) this.currentCallback();
  }
};
