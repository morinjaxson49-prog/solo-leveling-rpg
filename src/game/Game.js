import * as THREE from 'three';
import Player from './entities/Player';
import Monster from './entities/Monster';
import Boss from './entities/Boss';
import DungeonManager from './world/DungeonManager';
import CombatSystem from './systems/CombatSystem';
import ProgressionSystem from './systems/ProgressionSystem';
import ParticleSystem from './effects/ParticleSystem';
import UIManager from './ui/UIManager';

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
    this.currentDungeonLevel = 1;
    this.gameTime = 0;
    this.killCount = 0;
  }

  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(this.renderer.domElement);

    // Setup scene with fog for depth
    this.scene.background = new THREE.Color(0x0a0e27);
    this.scene.fog = new THREE.Fog(0x0a0e27, 100, 200);
    
    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff8800, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.far = 100;
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Point light for atmosphere
    const pointLight = new THREE.PointLight(0xff00ff, 0.5, 50);
    pointLight.position.set(-20, 10, -20);
    this.scene.add(pointLight);

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

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Handle skill keys
    document.addEventListener('keydown', (e) => this.handleSkillInput(e));
  }

  handleSkillInput(e) {
    if (e.key === '1') this.player.useSkill('slash');
    if (e.key === '2') this.player.useSkill('powerAttack');
    if (e.key === '3') this.player.useSkill('dash');
    if (e.key === '4') this.player.useSkill('heal');
  }

  spawnMonsters(count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const distance = 20 + Math.random() * 10;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const level = Math.min(this.currentDungeonLevel + Math.floor(Math.random() * 2), 10);
      const monster = new Monster(x, 1, z, level);
      this.scene.add(monster.mesh);
      this.monsters.push(monster);
    }
  }

  spawnBoss() {
    if (this.boss) return; // Boss already exists
    const bossLevel = this.currentDungeonLevel * 3;
    this.boss = new Boss(0, 1, 30, bossLevel);
    this.scene.add(this.boss.mesh);
    this.uiManager.showMessage(`⚔️ BOSS APPEARED: ${this.boss.name}`);
  }

  nextDungeon() {
    this.currentDungeonLevel += 1;
    this.dungeonManager.clearDungeon();
    this.scene.clear();
    
    // Recreate lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xff8800, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    this.monsters = [];
    this.boss = null;
    this.player.mesh.position.set(0, 1, 0);
    this.scene.add(this.player.mesh);
    this.dungeonManager.createDungeon(this.currentDungeonLevel);
    this.spawnMonsters(3 + this.currentDungeonLevel);
    this.uiManager.showMessage(`📍 Entered Dungeon Level ${this.currentDungeonLevel}`);
  }

  update(deltaTime) {
    this.gameTime += deltaTime;

    // Update player
    this.player.update(deltaTime);

    // Update monsters
    this.monsters.forEach(monster => {
      monster.update(deltaTime, this.player);
    });

    // Update boss
    if (this.boss) {
      this.boss.update(deltaTime, this.player);
    }

    // Check collisions
    this.combatSystem.checkCollisions(this.player, this.monsters, this.boss, this.particleSystem);

    // Remove dead monsters
    this.monsters = this.monsters.filter(monster => {
      if (monster.health <= 0) {
        this.scene.remove(monster.mesh);
        const exp = monster.getExpReward();
        this.progressionSystem.addExperience(this.player, exp);
        this.particleSystem.createExplosion(monster.mesh.position, 0xff6600);
        this.killCount += 1;
        return false;
      }
      return true;
    });

    // Check boss defeat
    if (this.boss && this.boss.health <= 0) {
      this.scene.remove(this.boss.mesh);
      const exp = this.boss.getExpReward();
      this.progressionSystem.addExperience(this.player, exp * 5);
      this.particleSystem.createExplosion(this.boss.mesh.position, 0xffff00);
      this.uiManager.showMessage(`🏆 BOSS DEFEATED! +${exp * 5} EXP`);
      this.boss = null;
      setTimeout(() => this.nextDungeon(), 3000);
    }

    // Spawn new monsters if count is low and no boss
    if (this.monsters.length < 2 + this.currentDungeonLevel && !this.boss && Math.random() > 0.95) {
      this.spawnMonsters(1);
    }

    // Spawn boss at certain conditions
    if (!this.boss && this.killCount > 0 && this.killCount % 10 === 0) {
      this.spawnBoss();
    }

    // Update particle system
    this.particleSystem.update(deltaTime);

    // Update camera to follow player
    const playerPos = this.player.mesh.position;
    this.camera.position.lerp(
      new THREE.Vector3(
        playerPos.x,
        playerPos.y + 5,
        playerPos.z + 8
      ),
      0.1
    );
    this.camera.lookAt(playerPos);

    // Update UI
    this.uiManager.update(this.player, this.currentDungeonLevel, this.killCount, this.boss);
  }

  start() {
    const clock = new THREE.Clock();
    const animate = () => {
      const deltaTime = Math.min(clock.getDelta(), 0.05); // Cap delta for stability
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
