export default class SelectButton extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y, width, height, color) {
    super(scene);

    this.fillStyle(color)
      .fillRect(0, 0, width, height)
      .setDepth(2000)
      .setScrollFactor(0);

    // 위치 설정
    this.setPosition(x, y);

    scene.add.existing(this);
  }
}
