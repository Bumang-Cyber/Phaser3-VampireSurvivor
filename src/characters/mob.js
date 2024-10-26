import Phaser from "phaser";

export default class Mob extends Phaser.Physics.Arcade.Sprite {
  // 씬, x, y, 스프라이트, 이름, 첫HP, 드랍률
  constructor(scene, x, y, texture, animKey, initHp, dropRate) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.play(animKey);

    // css의 zIndex와 유사
    this.setDepth(10);
    this.scale = 2;

    this.m_speed = 50;
    this.m_hp = initHp;
    this.m_dropRate = dropRate;

    if (texture === "mob1") {
      // <instance> setBodySize(width, height, [center])
      this.setBodySize(24, 14, false);
      this.setOffset(0, 14); // 바닥에 중심점을 배치
    } else if (texture === "mob2") {
      this.setBodySize(24, 32);
    } else if (texture === "mob3") {
      this.setBodySize(24, 32);
    } else if (texture === "mob4") {
      this.setBodySize(24, 32);
    } else if (texture === "lion") {
      this.setBodySize(40, 64);
    }

    // this.scene.time.addEvent는 timer를 반환한다.
    // reset, pause, resume, remove 등을 할 수 있다.
    const timer = this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        scene.physics.moveToObject(this, scene.m_player, this.m_speed);
      },
      loop: true,
    });

    this.m_events = [];
    this.m_events.push(timer);

    // Phaser.Scene에는 update함수가 있지만
    // Mob은 Phaser.Physics.Arcade.Sprite를 상속한 클래스로 update 함수가 없기 때문에
    // Scene의 update가 실행될 때마다 Mob도 update 함수가 실행되게 한다.

    scene.events.on("update", (time, delta) => {
      this.update(time, delta);
    });
  }

  update() {
    if (!this.body) {
      this.scene.events.off("update", this.update, this);
      return;
    }

    if (this.x < this.scene.m_player.x) {
      this.flipX = true;
    } else {
      this.flipX = false;
    }
  }
}

/*
scene.time.addEvent의 일반적인 구조:

this.scene.time.addEvent({
  delay: 시간(ms),     // 몇 밀리초 후에 실행할지 설정
  callback: 함수,      // 실행될 함수
  callbackScope: this, // 콜백 함수 내에서 'this'가 가리키는 범위를 설정
  loop: true/false     // 반복 여부 설정
});

scene.time.addEvent는 Phaser의 내장함수로, 파라미터로 전달한 config객체에 따라 이벤트를 발생시킨다.

moveToObject라는 Phaser 내장 함수의 파라미터는 다음과 같다.
moveToObject(gameObject, destination, [speed], [maxTime])
*/
