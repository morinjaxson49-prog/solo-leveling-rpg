class UIManager {
  constructor() {
    this.messageQueue = [];
    this.setupUI();
  }

  setupUI() {
    const style = document.createElement('style');
    style.textContent = `
      #ui {
        position: absolute;
        top: 20px;
        left: 20px;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 150, 0, 0.4);
        font-weight: bold;
        background: rgba(0, 0, 0, 0.85);
        padding: 20px;
        border: 3px solid #00ff00;
        border-radius: 8px;
        min-width: 300px;
        backdrop-filter: blur(8px);
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.1);
      }
      
      .stat {
        margin: 12px 0;
        font-size: 16px;
        letter-spacing: 1px;
      }
      
      .stat-bar {
        width: 250px;
        height: 20px;
        background: rgba(0, 0, 0, 0.6);
        border: 2px solid #00ff00;
        margin-top: 6px;
        position: relative;
        border-radius: 3px;
        overflow: hidden;
        box-shadow: inset 0 0 5px rgba(0, 255, 0, 0.3);
      }
      
      .stat-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff00, #00cc00, #00aa00);
        transition: width 0.2s ease;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.2);
      }
      
      .stat-bar.mana-bar .stat-bar-fill {
        background: linear-gradient(90deg, #00aaff, #0055ff, #0033aa);
        box-shadow: 0 0 10px rgba(0, 170, 255, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.2);
      }
      
      .stat-bar.stamina-bar .stat-bar-fill {
        background: linear-gradient(90deg, #ffaa00, #ff6600, #ff3300);
        box-shadow: 0 0 10px rgba(255, 170, 0, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.2);
      }
      
      .stat-bar.exp-bar .stat-bar-fill {
        background: linear-gradient(90deg, #ffff00, #ffaa00);
        box-shadow: 0 0 10px rgba(255, 255, 0, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.2);
      }
      
      #skills {
        position: absolute;
        bottom: 30px;
        left: 20px;
        color: #00ff00;
        font-size: 13px;
        background: rgba(0, 0, 0, 0.85);
        padding: 15px;
        border: 2px solid #00ff00;
        border-radius: 8px;
        backdrop-filter: blur(8px);
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
        font-family: 'Courier New', monospace;
      }
      
      .skill-item {
        margin: 8px 0;
        padding: 6px;
        background: rgba(0, 255, 0, 0.1);
        border-radius: 3px;
        border-left: 3px solid #00ff00;
      }
      
      .skill-cooldown {
        color: #ff4444;
        font-weight: bold;
      }
      
      .skill-ready {
        color: #00ff00;
      }
      
      #messages {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
        color: #ffff00;
        font-size: 28px;
        font-weight: bold;
        text-shadow: 0 0 20px rgba(255, 255, 0, 0.8), 0 0 40px rgba(255, 100, 0, 0.6);
        pointer-events: none;
        z-index: 100;
        font-family: 'Courier New', monospace;
      }
      
      .message {
        animation: messageFloat 2.5s ease-out forwards;
        margin: 15px 0;
        text-align: center;
        text-shadow: 0 0 15px rgba(255, 255, 0, 0.6);
      }
      
      @keyframes messageFloat {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-60px) scale(1.2); }
      }
      
      #boss-info {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff00ff;
        font-size: 20px;
        text-shadow: 0 0 20px rgba(255, 0, 255, 0.8);
        background: rgba(0, 0, 0, 0.9);
        padding: 25px;
        border: 3px solid #ff00ff;
        border-radius: 8px;
        display: none;
        min-width: 350px;
        text-align: center;
        z-index: 50;
        box-shadow: 0 0 30px rgba(255, 0, 255, 0.5), inset 0 0 15px rgba(255, 0, 255, 0.1);
        font-family: 'Courier New', monospace;
      }
      
      .boss-bar {
        width: 300px;
        height: 35px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid #ff00ff;
        margin-top: 15px;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: inset 0 0 10px rgba(255, 0, 255, 0.3);
      }
      
      .boss-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff00ff, #ff0088, #ff0055);
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.2);
      }
      
      #stats-overlay {
        position: absolute;
        bottom: 20px;
        right: 20px;
        color: #00ffff;
        font-size: 13px;
        background: rgba(0, 0, 0, 0.85);
        padding: 15px;
        border: 2px solid #00ffff;
        border-radius: 8px;
        backdrop-filter: blur(8px);
        font-family: 'Courier New', monospace;
        min-width: 200px;
      }
    `;
    document.head.appendChild(style);
  }

  update(player, dungeonLevel, killCount, boss, gameTime, totalDamage) {
    let ui = document.getElementById('ui');
    if (!ui) {
      ui = document.createElement('div');
      ui.id = 'ui';
      document.body.appendChild(ui);
    }

    const healthPercent = (player.health / player.maxHealth) * 100;
    const staminaPercent = (player.stamina / player.maxStamina) * 100;
    const manaPercent = (player.mana / player.maxMana) * 100;
    const expPercent = (player.experience / player.experienceToNextLevel) * 100;
    const timeMin = Math.floor(gameTime / 60);
    const timeSec = Math.floor(gameTime % 60);

    ui.innerHTML = `
      <div class="stat">⚔️  LEVEL: ${player.level} | 🎯 SKILL: ${player.skill}</div>
      <div class="stat">🛡️  DEFENSE: ${player.defense} | ⚡ A.SPD: ${(player.attackSpeed * 100).toFixed(0)}%</div>
      <div class="stat">📍 DUNGEON: ${dungeonLevel} | 💀 KILLS: ${killCount}</div>
      
      <div class="stat">
        ❤️  HEALTH: ${Math.ceil(player.health)}/${player.maxHealth}
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: ${Math.max(0, healthPercent)}%"></div>
        </div>
      </div>
      
      <div class="stat">
        🔥 STAMINA: ${Math.ceil(player.stamina)}/${player.maxStamina}
        <div class="stat-bar stamina-bar">
          <div class="stat-bar-fill" style="width: ${staminaPercent}%"></div>
        </div>
      </div>
      
      <div class="stat">
        💙 MANA: ${Math.ceil(player.mana)}/${player.maxMana}
        <div class="stat-bar mana-bar">
          <div class="stat-bar-fill" style="width: ${manaPercent}%"></div>
        </div>
      </div>
      
      <div class="stat">
        📊 EXP: ${expPercent.toFixed(0)}%
        <div class="stat-bar exp-bar">
          <div class="stat-bar-fill" style="width: ${expPercent}%"></div>
        </div>
      </div>
    `;

    // Boss info
    if (boss) {
      let bossInfo = document.getElementById('boss-info');
      if (!bossInfo) {
        bossInfo = document.createElement('div');
        bossInfo.id = 'boss-info';
        document.body.appendChild(bossInfo);
      }
      bossInfo.style.display = 'block';
      
      const bossHealthPercent = (boss.health / boss.maxHealth) * 100;
      bossInfo.innerHTML = `
        <div>⚔️ ${boss.name}</div>
        <div style="font-size: 16px; margin: 10px 0;">Phase: ${boss.phase}</div>
        <div style="font-size: 14px; margin: 5px 0;">${boss.health.toFixed(0)}/${boss.maxHealth} HP</div>
        <div class="boss-bar">
          <div class="boss-bar-fill" style="width: ${Math.max(0, bossHealthPercent)}%"></div>
        </div>
        ${boss.ultimateReady ? '<div style="color: #ffff00; margin-top: 10px; font-size: 18px;">⚡ ULTIMATE READY!</div>' : ''}
      `;
    } else {
      const bossInfo = document.getElementById('boss-info');
      if (bossInfo) bossInfo.style.display = 'none';
    }

    // Skills display
    this.updateSkills(player);
    
    // Stats overlay
    this.updateStatsOverlay(gameTime, totalDamage, killCount);
  }

  updateSkills(player) {
    let skills = document.getElementById('skills');
    if (!skills) {
      skills = document.createElement('div');
      skills.id = 'skills';
      document.body.appendChild(skills);
    }

    const skillList = [
      { key: '1', name: 'Slash', cooldown: player.skillCooldowns['slash'], mana: 15 },
      { key: '2', name: 'Power Atk', cooldown: player.skillCooldowns['powerAttack'], mana: 45 },
      { key: '3', name: 'Dash', cooldown: player.skillCooldowns['dash'], mana: 25 },
      { key: '4', name: 'Heal', cooldown: player.skillCooldowns['heal'], mana: 30 }
    ];

    skills.innerHTML = '<div style="margin-bottom: 8px; border-bottom: 1px solid #00ff00; padding-bottom: 5px;"><strong>⌨️  SKILLS</strong></div>' + skillList.map(skill => `
      <div class="skill-item">
        [${skill.key}] ${skill.name} ${skill.cooldown > 0 ? `<span class="skill-cooldown">${skill.cooldown.toFixed(1)}s</span>` : '<span class="skill-ready">✓</span>'}
      </div>
    `).join('');
  }

  updateStatsOverlay(gameTime, totalDamage, killCount) {
    let stats = document.getElementById('stats-overlay');
    if (!stats) {
      stats = document.createElement('div');
      stats.id = 'stats-overlay';
      document.body.appendChild(stats);
    }

    const timeMin = Math.floor(gameTime / 60);
    const timeSec = Math.floor(gameTime % 60);
    const dps = gameTime > 0 ? (totalDamage / gameTime).toFixed(0) : 0;

    stats.innerHTML = `
      <div style="margin-bottom: 8px; border-bottom: 1px solid #00ffff; padding-bottom: 5px;"><strong>📊 STATS</strong></div>
      <div>⏱️  Time: ${timeMin}m ${timeSec}s</div>
      <div>💔 Total DMG: ${Math.floor(totalDamage)}</div>
      <div>⚔️  DPS: ${dps}</div>
      <div>💀 Kill/Min: ${(killCount / (gameTime / 60 || 1)).toFixed(1)}</div>
    `;
  }

  showMessage(text) {
    let messagesDiv = document.getElementById('messages');
    if (!messagesDiv) {
      messagesDiv = document.createElement('div');
      messagesDiv.id = 'messages';
      document.body.appendChild(messagesDiv);
    }

    const message = document.createElement('div');
    message.className = 'message';
    message.textContent = text;
    messagesDiv.appendChild(message);

    setTimeout(() => message.remove(), 2500);
  }
}

export default UIManager;
