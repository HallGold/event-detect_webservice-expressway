<template>
  <div class="wrapper">
    <div :class="['content', { blur: navState }, { blur: messageState }]">
      <div class="logo">
        <div class="custormerName">{{ enterpriseName }}</div>
        <div class="sysName">{{ systemName }}</div>
      </div>
      <div class="nav">
        <div class="navMain">
          <div class="navItem" @click="messageToggle">
            <i class="navIcon messageIcon">
              <Badge :dot="unReadMessages"></Badge>
            </i>
          </div>
          <div class="navItem" @click="navToggle">
            <i class="navIcon moreIcon"></i>
          </div>
        </div>
      </div>
      <router-view :changeData="changeData" />
    </div>
    <div class="maskLayout" v-show="maskState" @click="closeToggle"></div>
    <div :class="['messageList', { transformNav: messageState }]">
      <div class="messageBtn">
        <i class="messageBtnIcon" @click.stop="closeToggle"></i>
      </div>
      <div class="messageListMain" style="height: calc(100% - 95px)">
        <div class="messageBox">
          <div
            :class="['messageItem', { messageCancel: item.handle_status == 1 }]"
            v-for="(item, index) in messageData"
            :key="index"
            @click="updateErrorDevice(item)"
          >
            <div class="messageTime">
              <Time :time="item.create_time" />
              <span
                class="messageState"
                v-html="item.handle_status == 1 ? '已读' : '未读'"
              ></span>
            </div>
            <div class="messageContent">
              {{ itemTitle(item.info + item.device_info, 30) }}
            </div>
          </div>
        </div>
        <div class="moreMessages" @click="handleMoreMessage" v-show="showMore">
          <span>更多消息</span>
        </div>
      </div>
    </div>
    <div :class="['navList', { transformNav: navState }]">
      <div class="navBtn">
        <i class="navBtnIcon" @click.stop="closeToggle"></i>
      </div>
      <div class="navListMain">
        <div class="navItem">
          <router-link class="routerLink" @click.native="changeBlur" to="/">
            <i class="menuIcon iconfont icon-yiji-yingyongjianguan"></i>总览
          </router-link>
        </div>
        <div class="navItem">
          <router-link
            class="routerLink"
            @click.native="changeBlur"
            to="/events"
          >
            <i class="menuIcon iconfont icon-erji-jiankongtubiao"></i>事件监控
          </router-link>
        </div>
        <div class="navItem">
          <router-link class="routerLink" @click.native="changeBlur" to="/flow">
            <i class="menuIcon iconfont icon-erji-lujingguanli"></i>交通参数
          </router-link>
        </div>
        <div class="navItem">
          <router-link
            class="routerLink"
            @click.native="changeBlur"
            to="/statistics"
          >
            <i class="menuIcon iconfont icon-erji-ziyuanji"></i>事件统计
          </router-link>
        </div>
        <div class="navItem">
          <router-link
            class="routerLink"
            @click.native="changeBlur"
            to="/feedbacks"
          >
            <i
              class="menuIcon iconfont icon-erji-zichanloudongsaomiaobaobiao"
            ></i
            >意见反馈
          </router-link>
        </div>
        <div class="navItem">
          <router-link
            class="routerLink"
            @click.native="changeBlur"
            to="/monitor"
          >
            <i class="menuIcon iconfont icon-erji-baobiaocelve"></i>系统状态
          </router-link>
        </div>
        <div class="navItem">
          <router-link
            class="routerLink"
            @click.native="changeBlur"
            to="/correct"
          >
            <i class="menuIcon iconfont icon-yiji-yunweiguanli"></i>设备校准
          </router-link>
        </div>
      </div>
      <div class="navBottom">
        <div class="navItem">
          <i class="menuIcon iconfont icon-erji-gonggaoguanli"></i>
          <span>语音播报</span>
          <i-switch v-model="playVoice" :before-change="handleBeforeChange" />
        </div>
        <div class="navItem">
          <a class="routerLink" @click="logOut">
            <i class="menuIcon iconfont icon-erji-anquanshebei"></i>退出登录
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { API_BASEURL, API_TIMEOUT, API_SOCKET } from "@/utils/config";
import Ajax from "@/api/tools/customajax";
export default {
  data() {
    return {
      playAudio:null,
      changeData: {},
      showMore: false,
      playVoice: true,
      maskState: false,
      messageState: false,
      navState: false,
      websocket: null,
      serverTimeoutObj: null,
      heartCheckTimeout: 10 * 1000,
      timer: null,
      runTimeSeconds: 30,
      voiceData: [],
      configData: [],
      unReadMessages: false,
      getMessageParam: {
        page: 1,
        length: 15,
      },
      messageData: [],
    };
  },
  computed: {
    systemName() {
      let configName = "";
      if (this.configData.length > 0) {
        let configIndex = this.configData.findIndex((item) => {
          return item.use_type == "1";
        });
        if (configIndex > -1) {
          configName = this.configData[configIndex].name;
        }
      }
      return configName;
    },
    enterpriseName() {
      let configName = "";
      if (this.configData.length > 0) {
        let configIndex = this.configData.findIndex((item) => {
          return item.use_type == "2";
        });
        if (configIndex > -1) {
          configName = this.configData[configIndex].name;
        }
      }
      return configName;
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.serverTimeoutObj) {
      clearInterval(this.serverTimeoutObj);
      this.serverTimeoutObj = null;
    }
    if (this.websocket) {
      this.websocket.close(); //离开路由之后断开websocket连接
      this.websocket = null;
    }
  },
  mounted() {
    if (localStorage.getItem("playVoice") == "true") {
      this.playVoice = true;
    } else {
      this.playVoice = false;
    }
    this.loadMessages();
    this.getSysNameConfig();
    //this.startTimer();
    this.getWebSocket();
  },
  methods: {
    itemTitle(t, n) {
      if (t != null && t.length > n) {
        return t.slice(0, n) + "…";
      } else {
        return t;
      }
    },
    objToStr(obj) {
      let paramArr = Object.keys(obj).reduce((acc, cur) => {
        if (obj[cur] !== "" && obj[cur] != undefined)
          acc.push(cur + "=" + obj[cur]);
        return acc;
      }, []);
      return paramArr.join("&");
    },
    startTimer() {
      // setInterval(() => {
      //   this.loadMessages();
      //   this.loadVoice();
      // }, this.runTimeSeconds * 1000);
    },

    loadVoice() {
      this.$axios.post(API_BASEURL + "/getVoiceCaution").then((response) => {
        if (response.status == 200) {
          let voiceData = response.data.Data;
          if (voiceData && voiceData.length > 0)
            this.voiceData.push(...voiceData);
            // this.voiceActiveData = this.voiceData[0].toString();
            this.playVoiceData();
        }
      });
    },
    playVoiceData() {
      if (this.playVoice) {
        // this.voiceData.forEach((item) => {
        //   this.readWords(item);
        // });
        let self = this
        var repeat = 0;
        this.playAudio = new Audio();
        this.playAudio.preload = false;
        this.playAudio.controls = true;
        this.playAudio.hidden = true;
        var src = this.voiceData.pop();
        this.playAudio.src = src;
        this.playAudio.addEventListener("ended", this.playEndedHandler, false);
        this.playAudio.play();
        this.playAudio.loop = false;
      }
    },
    playEndedHandler() {
      if(this.playAudio){
        this.playAudio.src = this.voiceData.pop();
        this.playAudio.play();
        if(this.voiceData.length < 1)
          this.playAudio.removeEventListener("ended", this.playEndedHandler, false); //只有一个元素时解除绑定
      }
    },
    handleMoreMessage() {
      this.getMessageParam.page = this.getMessageParam.page + 1;
      this.getMessage();
    },
    loadMessages() {
      this.unReadMessages = false;
      Ajax.post(
        API_BASEURL + "/getErrorDevice?page=1&length=1&handleStatus=0"
      ).then((response) => {
        if (response.status == 200) {
          this.unReadMessages = response.data.Data.pageCount > 0;
        }
      });
    },
    getMessage() {
      Ajax.post(
        API_BASEURL + "/getErrorDevice?" + this.objToStr(this.getMessageParam)
      ).then((response) => {
        if (response.status == 200) {
          this.messageData.push(...response.data.Data.errorDevice);
          this.maskState = true;
          this.messageState = true;
          this.showMore =
            response.data.Data.pageCount > this.messageData.length;
        }
      });
    },
    updateErrorDevice(item) {
      if (item.handle_status == 1) return;

      Ajax.post(
        API_BASEURL + "/updateErrorDevice?id=" + item.id + "&handleStatus=1"
      ).then((response) => {
        if (response.status == 200) {
          item.handle_status = 1;
          this.$Message.success({
            content: "处理成功！",
          });
        }
      });
    },
    getSysNameConfig() {
      this.configData = [];
      Ajax.post(API_BASEURL + "/getSysNameConfig").then((response) => {
        if (response.status == 200) {
          this.configData = response.data.Data;
        }
      });
    },
    handleBeforeChange() {
      let title =
        "您确认要" + (this.playVoice ? "关闭" : "打开") + "语音播报吗？";
      return new Promise((resolve) => {
        this.$Modal.confirm({
          title: "操作确认",
          content: title,
          onOk: () => {
            // resolve();
            localStorage.setItem("playVoice", !this.playVoice);
            resolve();
          },
        });
      });
    },
    navToggle() {
      this.navState = !this.navState;
      this.maskState = this.navState;
    },
    messageToggle() {
      if (!this.messageState) {
        this.messageData = [];
        this.getMessage();
      }
    },
    closeToggle() {
      this.navState = false;
      this.messageState = false;
      this.maskState = false;
    },
    changeBlur() {
      this.navState = false;
      this.messageState = false;
      this.maskState = false;
    },
    logOut() {
      this.$Modal.confirm({
        title: "操作确认",
        content: "您确认退出系统吗？",
        onOk: () => {
          localStorage.removeItem("loginState");
          this.$router.push({ path: "/login" });
          // Ajax.post(
          //   API_BASEURL +
          //     "/logout"
          // ).then(response => {
          //   if (response.status == 200) {
          //     this.$Message.success({
          //       content: "操作成功！"
          //     });
          //   }
          // });
        },
        onCancel: () => {},
      });
    },
    //获取WebSocket地址
    getWebSocket() {
      //初始化weosocket
      Ajax.get(API_BASEURL + "/getFrontalMark").then((response) => {
        if (response.status == 200) {
          let userId = response.data.Data.id;
          if (userId) {
            this.initWebSocket(userId);
          }
        }
      });
    },
    //创建WebSocket获取系统消息及待办数
    initWebSocket(userId) {
      //初始化weosocket
      if (userId) {
        let originUrl = window.location.origin;
        originUrl = originUrl.replace("http://", "ws://");
        const wsuri = originUrl + API_SOCKET + "/" + userId;
        this.websocket = new WebSocket(wsuri);
        this.websocket.onmessage = this.websocketonmessage;
        this.websocket.onopen = this.websocketonopen;
        this.websocket.onerror = this.websocketonerror;
        this.websocket.onclose = this.websocketclose;
      }
    },
    //WebSocket创建成功
    websocketonopen() {
      //连接建立之后重置心跳检测
      this.resetHeartCheck();
      this.startHeartCheck();
    },
    //连接建立失败重连
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    //接收到后端传输数据
    websocketonmessage(e) {
      let self = this;
      //重置心跳检测
      self.resetHeartCheck();
      self.startHeartCheck();
      if (e.data) {
        //系统消息
        if (e.data.indexOf("Msg") > 0) {
          this.unReadMessages = true;
          //格式化系统消息
          self.formatMessage(e.data);
        }
      }
    },
    //格式化系统消息
    formatMessage(dataStr) {
      let data = JSON.parse(dataStr);
      this.changeData = { date: Date.parse(new Date()), type: data.Code };
      if (data.Code == 1) {
        //新事件产生
        this.loadVoice();
      }
    },
    //数据发送
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    //关闭
    websocketclose(e) {
      //关闭
      //断开连接后重置心跳检测
      this.resetHeartCheck();
      this.startHeartCheck();
    },
    //心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
    resetHeartCheck: function () {
      if (this.serverTimeoutObj) clearTimeout(this.serverTimeoutObj);
    },
    startHeartCheck: function () {
      var self = this;
      self.serverTimeoutObj = setInterval(function () {
        if (self.websocket.readyState == 1) {
          self.websocket.send("ping");
          // 如果获取到消息，说明连接是正常的，重置心跳检测
          self.resetHeartCheck();
          self.startHeartCheck();
        } else {
          self.initWebSocket();
        }
      }, self.heartCheckTimeout);
    },
  },
};
</script>
