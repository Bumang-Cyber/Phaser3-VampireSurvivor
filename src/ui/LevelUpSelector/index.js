import Phaser from "phaser";
import Config from "../../config";
import Background from "./background";
import SelectButton from "./selectButton";

// Container로 생성해야 다른
export default class LevelUpSelector extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene);

    const WIDTH = Config.width * 0.7;
    const HEIGHT = Config.height * 0.7;
    const TOP_MARGIN = 100;

    // 메인 배경 추가
    const background = new Background(scene, WIDTH, HEIGHT);
    this.add(background);

    // 타이틀 텍스트
    this.drawTitles(WIDTH, HEIGHT);

    // 백그라운드 그리기
    this.drawSelectButtonBackgroundAndSkillName(WIDTH, HEIGHT, TOP_MARGIN);

    // LevelUpSelector 컨테이너 위치 설정
    this.setPosition(Config.width / 2, Config.height / 2);
    this.setDepth(2000);

    // Scene에 추가
    scene.add.existing(this);
  }

  drawSelectButtonBackgroundAndSkillName(
    WIDTH,
    HEIGHT,
    TOP_MARGIN,
    ChooseSkillObject
  ) {
    const FIRST_SELECT_ORIGIN = -WIDTH / 2;
    const SECOND_SELECT_ORIGIN = -WIDTH / 6;
    const THIRD_SELECT_ORIGIN = WIDTH / 6;

    const SELECT_HEIGHT = -HEIGHT / 2 + TOP_MARGIN;

    const FIRST_CENTER = FIRST_SELECT_ORIGIN + WIDTH / 6;
    const SECOND_CENTER = SECOND_SELECT_ORIGIN + WIDTH / 6;
    const THIRD_CENTER = THIRD_SELECT_ORIGIN + WIDTH / 6;

    // 선택 버튼 추가
    const select1 = new SelectButton(
      this.scene,
      FIRST_SELECT_ORIGIN,
      SELECT_HEIGHT,
      WIDTH / 3,
      HEIGHT - TOP_MARGIN,
      0x123123
    );
    const select2 = new SelectButton(
      this.scene,
      SECOND_SELECT_ORIGIN,
      SELECT_HEIGHT,
      WIDTH / 3,
      HEIGHT - TOP_MARGIN,
      0x333123
    );
    const select3 = new SelectButton(
      this.scene,
      THIRD_SELECT_ORIGIN,
      SELECT_HEIGHT,
      WIDTH / 3,
      HEIGHT - TOP_MARGIN,
      0x786423
    );

    this.add([select1, select2, select3]);

    const firstSkill = this.scene.add
      .text(FIRST_CENTER, SELECT_HEIGHT + 8, "FIRST SKILL!", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0); // 텍스트 중심 설정
    this.add(firstSkill); // 컨테이너에 텍스트 추가
    const secondSkill = this.scene.add
      .text(SECOND_CENTER, SELECT_HEIGHT + 8, "SECOND SKILL!", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0); // 텍스트 중심 설정
    this.add(secondSkill); // 컨테이너에 텍스트 추가
    const thirdSkill = this.scene.add
      .text(THIRD_CENTER, SELECT_HEIGHT + 8, "THIRD SKILL!", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0); // 텍스트 중심 설정
    this.add(thirdSkill); // 컨테이너에 텍스트 추가
  }

  drawTitles(WIDTH, HEIGHT) {
    // 텍스트 추가
    const LevelUpTitleText = this.scene.add.text(
      0, //
      -HEIGHT / 2 + 24,
      "Level Up!",
      {
        fontSize: "30px",
        color: "#ffffff",
        // backgroundColor: "#ff0000", // 테스트용 배경색
      }
    );
    LevelUpTitleText.setOrigin(0.5, 0); // 텍스트 중심 설정
    this.add(LevelUpTitleText); // 컨테이너에 텍스트 추가

    const LevelUpDescText = this.scene.add.text(
      0, //
      -HEIGHT / 2 + 64,
      "Choose which skill you want to upgrade",
      {
        fontSize: "18px",
        color: "#999999",
        // backgroundColor: "#ff0000", // 테스트용 배경색
      }
    );
    LevelUpDescText.setOrigin(0.5, 0); // 텍스트 중심 설정
    this.add(LevelUpDescText); // 컨테이너에 텍스트 추가
  }
}
