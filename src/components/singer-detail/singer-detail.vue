<template>
  <transition name="slide">
   <musicList :title="title" :bg-image="bgImage" :songs="songs"></musicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {getSingerDetail} from 'api/singer'
  import {createSong} from 'common/js/song'
  import musicList from '../music-list/music-list'
  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    components: {
      musicList
    },
    created() {
      this._getDetail()
      // console.log(this.singer)
    },
    methods: {
      // 抓取详情数据
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('./singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            // console.log(this.songs)
          }
        })
      },
      // 处理数据
      _normalizeSongs(list) {
        let ret = [] // 返回值
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
