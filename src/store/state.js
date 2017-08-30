import {playMode} from 'common/js/config'
import {loadSearch, loadPlay} from 'common/js/cache'
const state = {
  singer: {},
  playing: false,
  fullScreen: false, // 全屏播放
  playlist: [], // 播放列表
  sequenceList: [],
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放索引
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: []
}

export default state
