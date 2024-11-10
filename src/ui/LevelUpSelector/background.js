export default class Background extends Phaser.GameObjects.Graphics {
  constructor(scene, width, height) {
    super(scene);

    this.fillStyle(0x28288c)
      .fillRect(-width / 2, -height / 2, width, height)
      .lineStyle(4, 0xffffff, 1)
      .strokeRect(-(width + 4) / 2, -(height + 4) / 2, width + 4, height + 4);

    this.setDepth(1000).setScrollFactor(0);

    scene.add.existing(this);
  }
}
