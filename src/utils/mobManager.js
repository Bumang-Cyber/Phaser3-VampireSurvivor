import Mob from "../characters/mob";
import { getRandomPosition } from "./math";

export function addMobEvent(
  scene,
  repeatGap,
  mobTexture,
  mobAnim,
  mobHp,
  mobDropRate
) {
  let timer = scene.time.addEvent({
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
