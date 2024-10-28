import Phaser from "phaser";
import Config from "../config";
import Player from "../characters/player";
import Mob from "../characters/mob";
import { setBackground } from "../utils/backgroundManager";
import { addMobEvent } from "../utils/mobManager";
import { addAttackEvent } from "../utils/attackManager";

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
    addAttackEvent(this, "beam", 10, 1, 1000);

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
  }
}
