<template>
  <div class="loginMain">
    <div class="loginLogo" v-if="false">
      <!-- <div class="describeLogo">XXXX监狱</div> -->
    </div>
    <div class="loginMian" v-if="false">
      <div class="loginTitle">系统登录</div>
      <div class="loginLine">
        <div class="loginLabel">账&nbsp;&nbsp;号：</div>
        <div class="loginBox">
          <Input
            v-model="userInfo.userid"
            placeholder="账号"
            @keyup.enter.native="login"
            style="width:216px"
          />
        </div>
      </div>
      <div class="loginLine">
        <div class="loginLabel">密&nbsp;&nbsp;码：</div>
        <div class="loginBox">
          <Input
            v-model="userInfo.password"
            placeholder="密码"
            @keyup.enter.native="login"
            type="password"
            style="width:216px"
          />
        </div>
      </div>
      <div class="loginBtnBox">
        <button class="loginBtn" @click="login">登录</button>
      </div>
    </div>
    <div class="loginWrapper">
      <div class="wrapperItem leftWrapper">
        <div class="systemTitle">
          <h1 class="systemName">
            <div class="custormerName">{{enterpriseName}}</div>
            <div class="sysName">{{systemName}}</div>
          </h1>
        </div>
      </div>
      <div class="wrapperItem rightWrapper">
        <div class="loginTitle">请登录</div>
        <div class="loginForm">
          <div class="loginLabel">
            <i class="labelIcon loginuser"></i>
            <input
              class="loginformlabel"
              v-model="userInfo.userid"
              placeholder="请输入账号"
              @keyup.enter="login"
            />
          </div>
          <div class="loginLabel nomarginBottom">
            <i class="labelIcon loginpassword"></i>
            <input
              class="loginformlabel"
              v-model="userInfo.password"
              placeholder="密码"
              @keyup.enter="login"
              type="password"
            />
          </div>
          <div class="loginSubmitBox">
            <button class="loginBtn" @click="login">登&nbsp;&nbsp;录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Ajax from "@/api/tools/customajax";
import { API_BASEURL, API_TIMEOUT } from "@/utils/config";
export default {
  data() {
    return {
      userInfo: {
        userid: "",
        password: "",
      },
      configData: []
    };
  },
  computed: {
    systemName() {
      let configName = "";
      if (this.configData.length > 0) {
        let configIndex = this.configData.findIndex(item => {
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
        let configIndex = this.configData.findIndex(item => {
          return item.use_type == "2";
        });
        if (configIndex > -1) {
          configName = this.configData[configIndex].name;
        }
      }
      return configName;
    }
  },
  mounted() {
    this.getSysNameConfig();
  },
  methods: {
    getSysNameConfig() {
      this.configData = [];
      Ajax.post(
        API_BASEURL + "/getSysNameConfig"
      ).then(response => {
        if (response.status == 200) {
          this.configData = response.data.Data;
        }
      });
    },
    login() {
      //判断账号密码是否为空
      if (!this.userInfo.userid) {
        this.$Message.error({
          content: "用户名不能为空！"
        });
        return;
      }
      if (!this.userInfo.password) {
        this.$Message.error({
          content: "密码不能为空！"
        });
        return;
      } else {
        // 请求接口验证账号密码
        const params = {
          userid: this.userInfo.userid,
          password: this.userInfo.password
        };

        // const url = '/api/login'
        Ajax.post(
          API_BASEURL +
            "/login?userid=" +
            this.userInfo.userid +
            "&password=" +
            this.userInfo.password
        )
          .then(response => {
            if (response.status == 200) {
              if (response.data.Code == 200) {
                localStorage.setItem("loginState", true);
                this.$router.push({ path: "/" });
              } else {
                this.$Message.error({
                  content: response.data.Msg
                });
              }
            }
          })
          .catch(err => {});
      }
    }
  }
};
</script>
