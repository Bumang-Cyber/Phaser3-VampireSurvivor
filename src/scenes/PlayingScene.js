import Phaser from "phaser";
import Config from "../config";
import Player from "../characters/player";
import Mob from "../characters/mob";
import { setBackground } from "../utils/backgroundManager";
import { addMob, addMobEvent, removeOldestMobEvent } from "../utils/mobManager";
import {
  addAttackEvent,
  removeAttack,
  setAttackDamage,
  setAttackScale,
} from "../utils/attackManager";
import TopBar from "../ui/topBar";
import ExpBar from "../ui/expBar";
import { pause } from "../utils/pauseManager";
import { createTime } from "../utils/time";

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    // 사용할 sound들을 추가해놓는 부분입니다.
    // load는 전역적으로 어떤 scene에서든 asset을 사용할 수 있도록 load 해주는 것이고,
    // add는 해당 scene에서 사용할 수 있도록 scene의 멤버 변수로 추가할 때 사용하는 것입니다.
    this.sound.pauseOnBlur = false;
    this.m_beamSound = this.sound.add("audio_beam");
    this.m_scratchSound = this.sound.add("audio_scratch");
    this.m_hitMobSound = this.sound.add("audio_hitMob");
    this.m_growlSound = this.sound.add("audio_growl");
    this.m_explosionSound = this.sound.add("audio_explosion");
    this.m_expUpSound = this.sound.add("audio_expUp");
    this.m_hurtSound = this.sound.add("audio_hurt");
    this.m_nextLevelSound = this.sound.add("audio_nextLevel");
    this.m_gameOverSound = this.sound.add("audio_gameOver");
    this.m_gameClearSound = this.sound.add("audio_gameClear");
    this.m_pauseInSound = this.sound.add("audio_pauseIn");
    this.m_pauseOutSound = this.sound.add("audio_pauseOut");

    // player를 m_player라는 멤버 변수로 추가합니다.
    this.m_player = new Player(this);
    // camera를 m_player를 따라가게 함
    this.cameras.main.startFollow(this.m_player);

    // PlayingScene의 background를 설정합니다.
    setBackground(this, "background1");

    this.m_cursorKeys = this.input.keyboard.createCursorKeys();

    // MOB
    this.m_mobs = this.physics.add.group();
    // 처음 시작하고 바로 생성. 그래서 mob이 필요한 다른 update 내 이벤트들이 에러뜨지 않게 한다.
    this.m_mobs.add(new Mob(this, 0, 0, "mob1", "mob1_anim", 10, 0.9));
    this.m_mobEvent = [];

    // 처음 시작하고 1초 마다 생성
    // scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate
    addMobEvent(this, 1000, "mob2", "mob2_anim", 10, 0.9);

    // ATTACK
    this.m_weaponDynamic = this.add.group();
    this.m_weaponStatic = this.add.group();
    this.m_attackEvents = {};
    //
    addAttackEvent(this, "claw", 10, 2.3, 1500);

    // collisions
    /**
     * 어떤 오브젝트들이 충돌했을 때 동작을 발생시키려면 physics.add.overlap 함수를 사용합니다.
     * @param object1 오버랩되는지 검사할 오브젝트 1
     * @param object2 오버랩되는지 검사할 오브젝트 2
     * @param collideCallback 오브젝트 1과 오브젝트 2가 충돌하면 실행될 콜백함수입니다.
     * @param processCallback 두 오브젝트가 겹치는 경우 추가 검사를 수행할 수 있는 선택적 콜백 함수입니다. 이것이 설정되면 이 콜백이 true를 반환하는 경우에만 collideCallback이 호출됩니다.
     * @param callbackContext 콜백 스코프입니다. (this를 사용하시면 됩니다.)
     */
    // Player와 mob이 부딪혔을 경우 player에 데미지 10을 줍니다.
    // (Player.js에서 hitByMob 함수 확인)
    this.physics.add.overlap(
      this.m_player,
      this.m_mobs,
      () => this.m_player.hitByMob(10),
      null,
      this
    );

    // mob이 dynamic 공격에 부딪혓을 경우 mob에 해당 공격의 데미지만큼 데미지를 줍니다.
    // (Mob.js에서 hitByDynamic 함수 확인)
    this.physics.add.overlap(
      this.m_weaponDynamic,
      this.m_mobs,
      (weapon, mob) => {
        mob.hitByDynamic(weapon, weapon.m_damage);
      },
      null,
      this
    );

    // mob이 static 공격에 부딪혓을 경우 mob에 해당 공격의 데미지만큼 데미지를 줍니다.
    // (Mob.js에서 hitByStatic 함수 확인)
    this.physics.add.overlap(
      this.m_weaponStatic,
      this.m_mobs,
      (weapon, mob) => {
        mob.hitByStatic(weapon.m_damage);
      },
      null,
      this
    );

    // item
    // 몹이 죽을 때 this.scene.m_expUps.add(expUp)를 해줌.
    this.m_expUps = this.physics.add.group();
    this.physics.add.overlap(
      this.m_player,
      this.m_expUps,
      this.pickExpUp,
      null,
      this
    );

    // TopBar, ExpBar
    this.m_topBar = new TopBar(this);
    this.m_expBar = new ExpBar(this, 50);

    // event handler
    this.input.keyboard.on(
      "keydown-ESC", // ESC를 눌렀을 때의 key?
      () => {
        pause(this, "pause");
      },
      this
    );

    this.sceneTime = createTime(this);
  }

  update() {
    this.movePlayerManager();

    /* 
      setX와 setY를 정의한 적이 없는데 사용 가능한 이유:
      이것들은 Phaser.GameObjects.GameObject에 있는 메소드이고,
      Phaser의 모든 오브젝트들은 Phaser.GameObjects.GameObject를 상속하기 때문이다.
      이를 통해 게임 내에서 게임 오브젝트의 위치, 크기, 스케일, 회전, 투명도 등을 제어할 수 있는 많은 기본 도구를 제공한다.
    */
    this.m_background.setX(this.m_player.x - Config.width / 2);
    this.m_background.setY(this.m_player.y - Config.height / 2);

    /*
      Phaser.GameObjects.TileSprite에는 tilePositionX, tilePositionY 등의 메소드가 있다.
      Config.width/2 는 그닥 중요하지 않고 this.m_player.x가 중요한 듯.
     */
    this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
    this.m_background.tilePositionY = this.m_player.y - Config.width / 2;

    /*
      closest를 구하는 메소드가 내장되어 있다.  
    */
    const closest = this.physics.closest(
      this.m_player,
      this.m_mobs.getChildren()
    );
    this.m_closest = closest;

    if (!this.m_mobEvent) {
      this.sceneTime.destroy();
    }
  }

  pickExpUp(player, expUp) {
    expUp.disableBody(true, true);
    expUp.destroy();

    this.m_expUpSound.play();
    // console.log("경험치 ", expUp.m_exp, " 상승");

    this.m_expBar.increase(expUp.m_exp);
    if (this.m_expBar.m_currentExp >= this.m_expBar.m_maxExp) {
      pause(this, "levelUp");
    }
  }

  afterLevelUp() {
    this.m_topBar.gainLevel();

    switch (this.m_topBar.m_level) {
      case 2:
        removeOldestMobEvent(this);
        addMobEvent(this, 1000, "mob2", "mob2_anim", 20, 0.8);
        addAttackEvent(this, "catnip", 20, 2);
        break;
      case 3:
        removeOldestMobEvent(this);
        addMobEvent(this, 1000, "mob3", "mob3_anim", 30, 0.7);
        setAttackScale(this, "catnip", 4);
        setBackground(this, "background2");
        break;
      case 4:
        removeOldestMobEvent(this);
        addMobEvent(this, 1000, "mob4", "mob4_anim", 40, 0.7);
        addAttackEvent(this, "beam", 10, 1, 1000);
        break;
      case 5:
        // 보스몹 추가
        addMob(this, "lion", "lion_anim", 100, 0);
        setBackground(this, "background3");
        break;
    }
  }

  movePlayerManager() {
    if (
      this.m_cursorKeys.left.isDown ||
      this.m_cursorKeys.right.isDown ||
      this.m_cursorKeys.down.isDown ||
      this.m_cursorKeys.up.isDown
    ) {
      if (!this.m_player.m_moving) {
        // play를 중복으로 계속하지 않게 하기위해 !move일때만 if문에서 1회 실행
        this.m_player.play("player_anim");
      }
      this.m_player.m_moving = true;
    } else {
      if (this.m_player.m_moving) {
        this.m_player.play("player_idle");
      }
      this.m_player.m_moving = false;
    }

    let vector = [0, 0];
    if (this.m_cursorKeys.left.isDown) {
      // 가속도가 붙지않음. 왜냐하면 업데이트 할 때 마다 vector도 다시 생성되기 때문에
      vector[0] -= 1;
    }
    if (this.m_cursorKeys.right.isDown) {
      vector[0] += 1;
    }
    if (this.m_cursorKeys.up.isDown) {
      vector[1] -= 1;
    }
    if (this.m_cursorKeys.down.isDown) {
      vector[1] += 1;
    }

    this.m_player.move(vector);

    // static 공격들은 player가 이동하면 그대로 따라오도록 해줍니다.
    this.m_weaponStatic.children.each((weapon) => {
      weapon.move(vector);
    }, this);
  }
}
