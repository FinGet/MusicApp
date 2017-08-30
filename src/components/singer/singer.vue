<template>
  <div class="singer" ref="singer">
    <ListView :data="singers" @select="selectSinger" ref="list"></ListView>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    mixins: [playlistMixin],
    name: 'singer',
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 获取歌手列表
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
            // console.log(this.singers)
          }
        })
      },
      // 将获取的数据，处理成我们需要的格式
      _normalizeSinger(list) {
        let map = {
          // 定义热门数据，默认将数据前10条作为热门数据
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        // 遍历list将前10条数据放入hot(热门数据)
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            // new Singer创健一个singer对象接收两个参数，再获取歌手图片
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        // console.log(map)
        // 为了得到有序列表，需要处理map
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        // 数组排序
        ret.sort((a, b) => {
          // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        // concat() 方法用于连接两个或多个数组。
        return hot.concat(ret)
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style lang="stylus" rel="stylesheet/syulus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
