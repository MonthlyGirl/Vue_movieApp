<template>
  <div id="app">
      <router-view/>
    <tab-bar v-if="$route.meta.showTabBar"/>
  </div>
</template>

<script>
import TabBar from './components/TabBar/TabBar'
import 'mint-ui/lib/style.css'
import jQuery from 'jquery'
export default {
  name: 'App',
  components: {TabBar},
   created() {
      this.getXYbyIP();
   },
   methods: {
      //https://lbsyun.baidu.com/
      getXYbyIP() {
          let _this = this;
          var url = "https://api.map.baidu.com/location/ip?ak=HQi0eHpVOLlRuIFlsTZNGlYvqLO56un3&coor=bd09ll";
          //百度 根据ip地址获取用户的经纬度（不是很准确）
          // 混合 app hybrid APP(调取底层的硬件设备 gps)
          jQuery.ajax({
              url: url,
              type: 'POST',
              dataType: 'JSONP',
              async: false,
              cache: true, //是否缓存 可以为false
              success: function(data) {
                //入库
                _this.$store.commit('save_address', data.content.address_detail.city);
              },
              error: function(data) {
                return error
              }
          })
        }
   }

}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #app
    width 100%
    height 100%
</style>
