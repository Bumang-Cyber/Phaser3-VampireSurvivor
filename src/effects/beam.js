import Phaser from "phaser";

export default class Beam extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, startingPosition, damage, scale) {
    super(scene, startingPosition[0], startingPosition[1], "beam");

    this.SPEED = 100;
    this.DURATION = 1500;

    scene.add.existing(this);
    // 플레이어나 몹 같은 경우는 scene.physics.add.existing()만 해준다.
    // 충돌을 감지할 수 있게 해준다.
    scene.physics.world.enableBody(this);
    scene.m_weaponDynamic.add(this); // 동적 공격
    scene.m_beamSound.play(); // playingScene의 create에 이미 선언되어 있음.

    this.m_damage = damage;
    this.m_scale = scale;
    this.setDepth(30);
    this.setVelocity(); // 속도를 설정
    this.setAngle(); // 각도를 설정

    scene.time.addEvent({
      delay: this.DURATION,
      callback: () => {
        this.destroy();
      },
      loop: false,
    });
  }

  setVelocity() {
    if (!this.scene.m_closest) {
      this.setVelocityY(-250);
      return;
    }

    const _x = this.scene.m_closest.x - this.x; // 적과 beam 사이의 x 차이
    const _y = this.scene.m_closest.y - this.y; // 적과 beam 사이의 y 차이
    const _r = Math.sqrt(_x * _x + _y * _y) / 2; // 반지름

    // 플레이어와 몹의 거리가 멀수록 Beam의 속도가 빨라지는 것을 방지함.
    // 항상 정속을 유지하게?.. 언제나 _x or _y / _r의 비율을 유지하게.
    this.body.velocity.x = (_x / _r) * this.SPEED;
    this.body.velocity.y = (_y / _r) * this.SPEED;
  }

  setAngle() {
    // 이미 두 객체 간의 각도를 구하는게 공식이 있다.
    const angleToMob = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.m_closest.x,
      this.scene.m_closest.y
    );

    // this.rotation = angleToMob
    // this.rotation = angleToMob + Math.PI;
    this.rotation = angleToMob + Math.PI / 2 + Math.PI / 4;

    // 회전 속도를 의미. beam은 회전하지 않는다.
    this.body.setAngularVelocity(0);
  }

  setDamage(damage) {
    this.m_damage = damage;
  }
}
