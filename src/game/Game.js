import * as THREE from 'three';
import Player from './entities/Player';
import Monster from './entities/Monster';
import Boss from './entities/Boss';
import DungeonManager from './world/DungeonManager';
import CombatSystem from './systems/CombatSystem';
import ProgressionSystem from './systems/ProgressionSystem';
import ParticleSystem from './effects/ParticleSystem';
import UIManager from './ui/UIManager';
import SoundManager from './audio/SoundManager';

class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.player = null;
    this.monsters = [];
    this.boss = null;
    this.dungeonManager = new DungeonManager(this.scene);
    this.combatSystem = new CombatSystem();
    this.progressionSystem = new ProgressionSystem();
    this.particleSystem = new ParticleSystem(this.scene);
    this.uiManager = new UIManager();
    this.soundManager = new SoundManager();
    this.currentDungeonLevel = 1;
    this.gameTime = 0;
    this.killCount = 0;
    this.totalDamageDealt = 0;
  }

  init() {
    // Setup renderer with better quality
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    document.body.appendChild(this.renderer.domElement);

    // Setup scene with better fog
    this.scene.background = new THREE.Color(0x0a0e27);
    this.scene.fog = new THREE.Fog(0x0a0e27, 150, 300);
    
    // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff8800, 1.2);
    directionalLight.position.set(15, 25, 15);
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.far = 150;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Dynamic point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0xff00ff, 0.6, 80);
    pointLight1.position.set(-30, 15, -30);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffff, 0.5, 80);
    pointLight2.position.set(30, 15, 30);
    this.scene.add(pointLight2);

    // Create player
    this.player = new Player(0, 1, 0);
    this.scene.add(this.player.mesh);

    // Camera setup
    this.camera.position.set(0, 5, 8);
    this.camera.lookAt(this.player.mesh.position);

    // Create dungeon
    this.dungeonManager.createDungeon(this.currentDungeonLevel);
    
    // Spawn initial monsters
    this.spawnMonsters(3);

    // Handle events
    window.addEventListener('resize', () => this.onWindowResize());
    document.addEventListener('keydown', (e) => this.handleSkillInput(e));
  }

  handleSkillInput(e) {
    if (e.key === '1') {
      const dmg = this.player.useSkill('slash');
      if (dmg) this.soundManager.play('slash');
    }
    if (e.key === '2') {
      const dmg = this.player.useSkill('powerAttack');
      if (dmg) this.soundManager.play('powerAttack');
    }
    if (e.key === '3') {
      const dmg = this.player.useSkill('dash');
      if (dmg) this.soundManager.play('dash');
    }
    if (e.key === '4') {
      const dmg = this.player.useSkill('heal');
      if (dmg) this.soundManager.play('heal');
    }
  }

  spawnMonsters(count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 20 + Math.random() * 15;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const level = Math.min(this.currentDungeonLevel + Math.floor(Math.random() * 2), 15);
      const monster = new Monster(x, 1, z, level);
      this.scene.add(monster.mesh);
      this.monsters.push(monster);
    }
  }

  spawnBoss() {
    if (this.boss) return;
    const bossLevel = Math.min(this.currentDungeonLevel * 3, 30);
    this.boss = new Boss(0, 1, 35, bossLevel);
    this.scene.add(this.boss.mesh);
    this.uiManager.showMessage(`⚔️ BOSS: ${this.boss.name}`);
    this.soundManager.play('bossAppear');
  }

  nextDungeon() {
    this.currentDungeonLevel += 1;
    this.dungeonManager.clearDungeon();
    this.scene.clear();
    
    // Recreate lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xff8800, 1.2);
    directionalLight.position.set(15, 25, 15);
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0xff00ff, 0.6, 80);
    pointLight1.position.set(-30, 15, -30);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffff, 0.5, 80);
    pointLight2.position.set(30, 15, 30);
    this.scene.add(pointLight2);
    
    this.monsters = [];
    this.boss = null;
    this.player.mesh.position.set(0, 1, 0);
    this.scene.add(this.player.mesh);
    this.dungeonManager.createDungeon(this.currentDungeonLevel);
    this.spawnMonsters(3 + Math.floor(this.currentDungeonLevel * 0.5));
    this.uiManager.showMessage(`📍 Dungeon Level ${this.currentDungeonLevel}`);
    this.soundManager.play('levelUp');
  }

  update(deltaTime) {
    this.gameTime += deltaTime;

    // Update player
    this.player.update(deltaTime);

    // Update monsters with enhanced behavior
    this.monsters.forEach(monster => {
      monster.update(deltaTime, this.player);
    });

    // Update boss
    if (this.boss) {
      this.boss.update(deltaTime, this.player);
    }

    // Check collisions with detailed combat
    this.combatSystem.checkCollisions(this.player, this.monsters, this.boss, this.particleSystem, (damage) => {
      this.totalDamageDealt += damage;
      if (damage > this.player.skill * 2) {
        this.soundManager.play('hit');
      }
    });

    // Remove dead monsters
    this.monsters = this.monsters.filter(monster => {
      if (monster.health <= 0) {
        this.scene.remove(monster.mesh);
        const exp = monster.getExpReward();
        this.progressionSystem.addExperience(this.player, exp);
        this.particleSystem.createExplosion(monster.mesh.position, 0xff6600);
        this.particleSystem.createExplosion(monster.mesh.position, 0xffaa00, 0.5);
        this.killCount += 1;
        this.soundManager.play('kill');
        return false;
      }
      return true;
    });

    // Check boss defeat
    if (this.boss && this.boss.health <= 0) {
      this.scene.remove(this.boss.mesh);
      const exp = this.boss.getExpReward();
      this.progressionSystem.addExperience(this.player, exp * 5);
      this.particleSystem.createExplosion(this.boss.mesh.position, 0xffff00, 2);
      this.particleSystem.createExplosion(this.boss.mesh.position, 0xff00ff, 1.5);
      this.uiManager.showMessage(`🏆 BOSS DEFEATED! +${exp * 5} EXP`);
      this.soundManager.play('bossDefeat');
      this.boss = null;
      setTimeout(() => this.nextDungeon(), 3000);
    }

    // Spawn new monsters
    if (this.monsters.length < 2 + this.currentDungeonLevel && !this.boss && Math.random() > 0.93) {
      this.spawnMonsters(1);
    }

    // Spawn boss
    if (!this.boss && this.killCount > 0 && this.killCount % 10 === 0) {
      this.spawnBoss();
    }

    // Update effects
    this.particleSystem.update(deltaTime);

    // Dynamic camera
    const playerPos = this.player.mesh.position;
    const idealCameraPos = new THREE.Vector3(
      playerPos.x + (this.player.isDashing ? 2 : 0),
      playerPos.y + 5,
      playerPos.z + 8
    );
    this.camera.position.lerp(idealCameraPos, 0.08);
    this.camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);

    // Update UI
    this.uiManager.update(this.player, this.currentDungeonLevel, this.killCount, this.boss, this.gameTime, this.totalDamageDealt);
  }

  start() {
    const clock = new THREE.Clock();
    const animate = () => {
      const deltaTime = Math.min(clock.getDelta(), 0.05);
      this.update(deltaTime);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    animate();
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

export default Game;
