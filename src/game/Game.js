import * as THREE from 'three';
import Player from './entities/Player';
import Monster from './entities/Monster';
import DungeonManager from './world/DungeonManager';
import CombatSystem from './systems/CombatSystem';
import ProgressionSystem from './systems/ProgressionSystem';

class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
    this.player = null;
    this.monsters = [];
    this.dungeonManager = new DungeonManager(this.scene);
    this.combatSystem = new CombatSystem();
    this.progressionSystem = new ProgressionSystem();
  }

  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    // Setup scene
    this.scene.background = new THREE.Color(0x1a1a2e);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Create player
    this.player = new Player(0, 1, 0);
    this.scene.add(this.player.mesh);

    // Camera follows player
    this.camera.position.set(0, 5, 8);
    this.camera.lookAt(this.player.mesh.position);

    // Create dungeon
    this.dungeonManager.createDungeon(1);
    
    // Spawn initial monsters
    this.spawnMonsters(5);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  spawnMonsters(count) {
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30 + 15;
      const monster = new Monster(x, 1, z, 1); // level 1
      this.scene.add(monster.mesh);
      this.monsters.push(monster);
    }
  }

  update(deltaTime) {
    // Update player
    this.player.update(deltaTime);

    // Update monsters
    this.monsters.forEach(monster => {
      monster.update(deltaTime, this.player);
    });

    // Check collisions
    this.combatSystem.checkCollisions(this.player, this.monsters);

    // Remove dead monsters
    this.monsters = this.monsters.filter(monster => {
      if (monster.health <= 0) {
        this.scene.remove(monster.mesh);
        const exp = monster.getExpReward();
        this.progressionSystem.addExperience(this.player, exp);
        return false;
      }
      return true;
    });

    // Spawn new monsters if count is low
    if (this.monsters.length < 3) {
      this.spawnMonsters(Math.floor(Math.random() * 3) + 1);
    }

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
  }

  start() {
    const clock = new THREE.Clock();
    const animate = () => {
      const deltaTime = clock.getDelta();
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
