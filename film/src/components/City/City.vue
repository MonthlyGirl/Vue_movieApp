<template>
    <div :style="{height:'100%'}">
        <div class="navtitle">
            <span class="center">当前城市 - {{cityName}}</span>
            <b class="back fa fa-angle-left" @click="backHandler"></b>
        </div>
        <div class="search">
            <div class="searchx" :style="{'width':qu ? '88%':'100%'}">
                <i class="iconfont icon-fangdajing"></i>
                <input type="text" placeholder="输入城市名或拼音" @focus="quxiao()" v-model="searchcity" />
            </div>
            <div class="quxiao" v-if="qu" @click="quback()">取消</div>
        </div>
        <div class="cityall" v-show="showy">
            <div class="city_main">
                <div>
                    <div>
                        <p>GPS定位你所在城市</p>
                        <ul>
                            <li @click="citytext($event)">{{cityName}}</li>
                        </ul>
                    </div>
                    <div>
                        <p>热门城市</p>
                        <ul>
                            <li v-for="(item,index) in isHot" :key="index" @click="citytext($event)">{{item}}</li>
                        </ul>
                    </div>
                </div>
                <ul class="bbb">
                    <li v-for="(item,index) in citylist" :key="index" class="cityli" :id="item.lettertop">
                        <p>{{item.lettertop}}</p>
                        <ul>
                            <li v-for="(itemx,index) in item.city" :key="index" @click="citytext($event)">{{itemx}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!-- 右侧字母列表 -->
            <div class="city_letter">
                <ul style="list-style:none">
                    <li v-for="(item,index) in letter" :key="index" @click="lettercity($event)">{{item}}</li>
                </ul>
            </div>
            <div class="showletter" v-if='showx' :class="{addshow:showx}">{{showletterx}}</div>
        </div>
        <div v-show="!showy">
            <div class="searchcityi" v-show="searchn">
                <i class="iconfont icon-chengshi"></i>
                <p>没有找到匹配的城市</p>
            </div>
            <ul class="searchcitym" v-show="!searchn">
                <li v-for="(item,index) in searchm" :key="index" @click="citytext($event)">{{item}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'City',
    data() {
        return {
          cityName:null,
            letter: [],
            isHot: [],
            citylist: [],
            citylistc: [],
            showletterx: "",
            showx: false,
            qu: false,
            searchcity: "",
            showy: true,
            searchm: [],
            searchn: true
        }
    },
    created: function() {
        this.getCityList()
        this.getCityName()
    },
    methods: {
       //获取城市列表
        getCityList(){
            let cityJson = require('../../common/json/city');
            let {cities} = cityJson
            let citylist = cities;
            this.citylistc = cities;
            let cityhead = [],
                newcityhead = [],
                isHotx = [],
                citymain = [];
            for (let i = 0; i < citylist.length; i++) {
                let ishotlist = citylist[i].name;
                let letterx = citylist[i].pinyin.charAt(0).toUpperCase(); //toUpperCase() 方法用于把字符串转换为大写
                if (citylist[i].isHot) {
                    isHotx.push(ishotlist);
                }
                cityhead.push(letterx);
            }
            for (let i = 0; i < cityhead.length; i++) {
                if (newcityhead.indexOf(cityhead[i]) == -1) {
                    newcityhead.push(cityhead[i]);
                }
            }
            newcityhead = newcityhead.sort(function compareFunction(item1, item2) {
                return item1.localeCompare(item2);
            });
            this.isHot = isHotx;
            this.letter = newcityhead;
            //   console.log(newcityhead)
            for (let i = 0; i < newcityhead.length; i++) {
                let obj = new Object();
                //为对象添加动态属性
                obj.lettertop = newcityhead[i];
                obj.city = [];
                for (let j = 0; j < citylist.length; j++) {
                    if (newcityhead[i].toLowerCase() === citylist[j].pinyin.charAt(0)) {
                        obj.city.push(citylist[j].name);
                    }
                }
                citymain.push(obj)
            }
            this.citylist = citymain;
        },
        getCityName(){
            this.cityName = this.$store.state.address
        },
        backmovie() {
            this.$router.push({ name: 'nowplay' });
        },
        backHandler: function() {
            this.$router.go(-1)
        },
        lettercity($event) {
            let text = $event.currentTarget.innerText;
            let _this = this;
            let letter = document.getElementById(text);
            var citym = document.getElementsByClassName("city_main")[0];
            this.showletterx = text;
            this.showx = true;
            setTimeout(function() {
                _this.showx = false;
            }, 1600);
            console.log(letter.offsetTop );
            window.scrollTo(0, letter.offsetTop - 144)
        },
        quxiao() {
            this.qu = true;
        },
        quback() {
            this.qu = false;
            this.searchcity = "";
            this.showy = true;
        },
        citytext($event) {
            this.cityName = $event.target.innerHTML
            //写入仓库
            this.$store.commit('save_address', this.cityName);
            //跳转回上一页
            this.$router.go(-1);//其中login是你定义的一个路由模块
        },
    },
    watch: {
        searchcity: function() {
            var citysearchs = [];
            //判断input输入内容全是空格
            if (this.searchcity != "") {
                this.showy = false;
                for (let i = 0; i < this.citylistc.length; i++) {
                    let str = this.citylistc[i].pinyin;
                    if (str.indexOf(this.searchcity) != -1) {
                        citysearchs.push(this.citylistc[i].name)
                    }
                }
            }
            this.searchm = citysearchs;
            if (this.searchm.length == 0) {
                this.searchn = true
            } else {
                this.searchn = false
            }
        },
    },

}
</script>
<style lang="scss" scoped>
  .center{
    font-size: 0.4rem;
    line-height:0rem;
  }
  .navtitle {
    height: 36px;
    text-align: center;
    line-height: 16px;
    position: relative;
  }

  .search {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding: 10px 20px;
    background: #f4f4f4;
    display: flex;
    justify-content: space-between;

    .searchx {
      width: 100%;
      height: 100%;
      /* position: relative; */
      background: #ffffff;
      border-radius: .05rem;
      border-radius: 3px;
      display: flex;

    }

    .quxiao {

      flex: 1;
      display: flex;
      font-size: .14rem;
      justify-content: flex-end;
      align-items: center;
    }

    i {

      display: flex;
      align-items: center;
      margin: 0 .05rem 0 .1rem;

      color: #797d82;
    }

    input {
      border: none;
      outline: none;
      height: 100%;
      /* margin-left: .3rem; */
      width: 80%;
      font-size: .12rem;
    }
  }

  .cityall {
    width: 100%;
    height: 100%;

    .city_letter {
      width: .15rem;
      text-align: center;
      position: fixed;
      top: .94rem;
      bottom: 0;
      right: 18px;
      font-size: .12rem;

      ul {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .city_main {
      height: 100%;
      overflow-y: scroll;
      margin-right: .15rem;

      >div {
        padding-left: .15rem;

        p {
          font-size: .13rem;
          color: #797d82;
          margin: 10px 0;
        }

        li {
          display: inline-block;
          width: 25%;
          margin: 5px 0 0 14px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          border-radius: 3px;
          background-color: #f4f4f4;
          font-size: 0.14rem;
        }
      }

      .cityli {
        p {
          height: 0.6rem;
          line-height: 0.6rem;
          color: #797d82;
          font-size: .13rem;
          padding-left: .15rem;
          background-color: #f4f4f4;
        }

        ul {
          padding-left: .15rem;

          li {
            // display: inline-block;
            width: 33.3%;
            text-align: center;
            height: 1rem;
            line-height: 1rem;
            overflow: hidden;
            font-size: .14rem;
          }
        }
      }
    }

    .showletter {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;
      width: 50px;
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: .24rem;
      border-radius: .08rem;
      color: #ffffff;
      background: rgba(0, 0, 0, .4);
    }

    .addshow {
      animation: citykey 2s linear;
    }

    @keyframes citykey {
      0% {
        opacity: 0
      }

      40% {
        opacity: 1
      }

      80% {
        opacity: 1
      }

      100% {
        opacity: 0
      }
    }
  }

  .searchcityi {
    color: #bdc0c5;
    font-size: .6rem;
    .iconfont {
      margin-top: .8rem;
      display: block;
      text-align: center;
      font-size: 1rem;
    }

    p {
      text-align: center;
    }
  }

  .searchcitym {
    li {
      height: 1rem;
      line-height: 1rem;
      padding: 0 20px;
      font-size: .14rem;
      border-bottom: 1px solid #ededed;
    }
  }

  .bbb {
    margin-top: 13px
  }

  .back {
    position: absolute;
    top: 5px;
    left: 5px;
    font-size: 26px;
    font-weight: normal
  }
</style>
