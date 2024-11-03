import Phaser from "phaser";
import Config from "../config";

export default class TopBar extends Phaser.GameObjects.Graphics {
  constructor(scene) {
    super(scene);

    this.fillStyle(0x28288c)
      .fillRect(0, 0, Config.width, 30)
      .setDepth(90)
      .setScrollFactor(0);

    this.m_mob_killed = 0;
    this.m_mob_killedLabel = scene.add
      .bitmapText(
        5,
        1,
        "pixelFont",
        `MOBS KILLED ${this.m_mob_killed.toString().padStart(6, "0")}`,
        40
      )
      .setScrollFactor(0)
      .setDepth(100);

    // 레벨을 멤버 변수로 만들어줍니다. (초기값 1)
    this.m_level = 1;
    // 레벨을 LEVEL이라는 문구 옆에 적습니다.
    this.m_levelLabel = scene.add
      .bitmapText(
        650,
        1,
        "pixelFont",
        `LEVEL ${this.m_level.toString().padStart(3, "0")}`,
        40
      )
      .setScrollFactor(0)
      .setDepth(100);

    // 위에서 추가한 그래픽을 화면에 표시합니다.
    scene.add.existing(this);
  }

  gainMobsKilled() {
    this.m_mob_killed += 1;
    this.m_mob_killedLabel.text = `MOBS KILLED ${this.m_mob_killed
      .toString()
      .padStart(6, "0")}`;
  }

  gainLevel() {
    this.m_level += 1;
    this.m_levelLabel.text = `Level ${this.m_level
      .toString()
      .padStart(3, "0")}`;

    // TODO: 한번에 2번 레벨업도 가능하게 만들기.
    this.scene.m_expBar.m_maxExp += 20;
    this.scene.m_expBar.reset();
  }
}
