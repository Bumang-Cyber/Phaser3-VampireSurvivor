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
  }
}
