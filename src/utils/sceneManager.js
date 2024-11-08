export function loseGame(playingScene) {
  playingScene.m_gameOverSound.play();
  playingScene.scene.start("gameOverScene", {
    mobsKilled: playingScene.m_topBar.m_mobsKilled,
    level: playingScene.m_topBar.m_level,
    secondElapsed: playingScene.m_secondElapsed,
    isWin: false,
  });
}

// 게임에서 이겼을 때 이긴 효과음을 재생하고,
// GameClearScene으로 전환시키는 함수입니다.
export function winGame(playingScene) {
  playingScene.m_gameClearSound.play();
  playingScene.scene.start("GameClearScene", {
    mobsKilled: playingScene.m_topBar.m_mobsKilled,
    level: playingScene.m_topBar.m_level,
    secondElapsed: playingScene.m_secondElapsed,
  });
}
