import Mob from "../characters/mob";
import { getRandomPosition } from "./math";

// 지속적으로 몹을 생성하는 함수
export function addMobEvent(
  scene,
  repeatGap,
  mobTexture,
  mobAnim,
  mobHp,
  mobDropRate
) {
  const timer = scene.time.addEvent({
    delay: repeatGap,
    callback: () => {
      let [x, y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
      scene.m_mobs.add(
        new Mob(scene, x, y, mobTexture, mobAnim, mobHp, mobDropRate)
      ); // scene, x, y, texture, animKey, initHp, dropRate
    },
    loop: true,
  });

  scene.m_mobEvent.push(timer);
}

export function removeOldestMobEvent(scene) {
  scene.m_mobEvent[0].remove();
  scene.m_mobEvent.shift();
}

// 몹을 하나만 생성하는 함수
export function addMob(scene, mobTexture, mobAnim, mobHp) {
  let [x, y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
  scene.m_mobs.add(new Mob(scene, x, y, mobTexture, mobAnim, mobHp, 0));
}

export function removeAllMobEvents(scene) {
  scene.m_mobEvent.forEach((event) => {
    event.remove(); // 타이머 이벤트 제거
  });
  scene.m_mobEvent = []; // 배열 초기화
}
