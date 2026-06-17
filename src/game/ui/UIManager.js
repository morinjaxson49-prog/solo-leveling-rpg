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
        font-family: 'Arial', sans-serif;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
        font-weight: bold;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border: 2px solid #00ff00;
        border-radius: 8px;
        min-width: 280px;
        backdrop-filter: blur(5px);
      }
      
      .stat {
        margin: 12px 0;
        font-size: 16px;
      }
      
      .stat-bar {
        width: 240px;
        height: 18px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid #00ff00;
        margin-top: 6px;
        position: relative;
        border-radius: 3px;
        overflow: hidden;
      }
      
      .stat-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff00, #00aa00);
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
      }
      
      .stat-bar.mana-bar .stat-bar-fill {
        background: linear-gradient(90deg, #00aaff, #0055ff);
        box-shadow: 0 0 10px rgba(0, 170, 255, 0.6);
      }
      
      .stat-bar.stamina-bar .stat-bar-fill {
        background: linear-gradient(90deg, #ffaa00, #ff6600);
        box-shadow: 0 0 10px rgba(255, 170, 0, 0.6);
      }
      
      #skills {
        position: absolute;
        bottom: 30px;
        left: 20px;
        color: #00ff00;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.8);
        padding: 15px;
        border: 2px solid #00ff00;
        border-radius: 8px;
        backdrop-filter: blur(5px);
      }
      
      .skill-item {
        margin: 8px 0;
        padding: 5px;
        background: rgba(0, 255, 0, 0.1);
        border-radius: 3px;
      }
      
      .skill-cooldown {
        color: #ff0000;
      }
      
      #messages {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
        color: #ffff00;
        font-size: 24px;
        text-shadow: 0 0 15px rgba(255, 255, 0, 0.8);
        pointer-events: none;
        z-index: 100;
      }
      
      .message {
        animation: messageFloat 2s ease-out forwards;
        margin: 10px 0;
        text-align: center;
        text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
      }
      
      @keyframes messageFloat {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-50px); }
      }
      
      #boss-info {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff00ff;
        font-size: 18px;
        text-shadow: 0 0 15px rgba(255, 0, 255, 0.8);
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border: 3px solid #ff00ff;
        border-radius: 8px;
        display: none;
        min-width: 300px;
        text-align: center;
        z-index: 50;
      }
      
      .boss-bar {
        width: 250px;
        height: 30px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid #ff00ff;
        margin-top: 10px;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
      }
      
      .boss-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff00ff, #ff0088);
        box-shadow: 0 0 15px rgba(255, 0, 255, 0.8);
      }
    `;
    document.head.appendChild(style);
  }

  update(player, dungeonLevel, killCount, boss) {
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

    ui.innerHTML = `
      <div class="stat">⚔️ Level: <span style="color: #ffaa00;">${player.level}</span></div>
      <div class="stat">🗡️ Skill: ${player.skill} | 🛡️ Def: ${player.defense}</div>
      <div class="stat">📍 Dungeon: Level ${dungeonLevel} | Kills: ${killCount}</div>
      
      <div class="stat">
        Health: ${player.health.toFixed(0)}/${player.maxHealth}
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: ${Math.max(0, healthPercent)}%"></div>
        </div>
      </div>
      
      <div class="stat">
        Stamina: ${player.stamina.toFixed(0)}/${player.maxStamina}
        <div class="stat-bar stamina-bar">
          <div class="stat-bar-fill" style="width: ${staminaPercent}%"></div>
        </div>
      </div>
      
      <div class="stat">
        Mana: ${player.mana.toFixed(0)}/${player.maxMana}
        <div class="stat-bar mana-bar">
          <div class="stat-bar-fill" style="width: ${manaPercent}%"></div>
        </div>
      </div>
      
      <div class="stat">
        Experience: ${expPercent.toFixed(1)}%
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: ${expPercent}%"></div>
        </div>
      </div>
    `;

    // Update boss info
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
        <div>👹 ${boss.name}</div>
        <div style="font-size: 14px; margin-top: 10px;">${boss.health.toFixed(0)}/${boss.maxHealth} HP (Phase ${boss.phase})</div>
        <div class="boss-bar">
          <div class="boss-bar-fill" style="width: ${Math.max(0, bossHealthPercent)}%"></div>
        </div>
      `;
    } else {
      const bossInfo = document.getElementById('boss-info');
      if (bossInfo) bossInfo.style.display = 'none';
    }

    // Update skills
    this.updateSkills(player);
  }

  updateSkills(player) {
    let skills = document.getElementById('skills');
    if (!skills) {
      skills = document.createElement('div');
      skills.id = 'skills';
      document.body.appendChild(skills);
    }

    const skillList = [
      { key: '1', name: 'Slash', cooldown: player.skillCooldowns['slash'] },
      { key: '2', name: 'Power Attack', cooldown: player.skillCooldowns['powerAttack'] },
      { key: '3', name: 'Dash', cooldown: player.skillCooldowns['dash'] },
      { key: '4', name: 'Heal', cooldown: player.skillCooldowns['heal'] }
    ];

    skills.innerHTML = '<div style="margin-bottom: 8px;"><strong>Skills:</strong></div>' + skillList.map(skill => `
      <div class="skill-item">
        [${skill.key}] ${skill.name} ${skill.cooldown > 0 ? `<span class="skill-cooldown">${skill.cooldown.toFixed(1)}s</span>` : '<span style="color: #00ff00;">✓</span>'}
      </div>
    `).join('');
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

    setTimeout(() => message.remove(), 2000);
  }
}

export default UIManager;
