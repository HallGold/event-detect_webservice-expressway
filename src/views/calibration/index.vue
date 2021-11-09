<template>
  <div class="videoContent">
    <div class="videDes">
      <div class="imageDes">校准点参考</div>
      <div class="videoMainDes">实时画面</div>
    </div>
    <div class="videoWrapper">
      <div class="videoImage">
        <div class="presetImg">
          <img v-show="presetImageUrl" :src="presetImageUrl" />
          <div v-show="!presetImageUrl" class="noPreset">无预置点信息</div>
          <canvas
            class="canvasLine"
            width="768"
            height="432"
            ref="presets"
          ></canvas>
        </div>
        <div class="presetBox"></div>
      </div>
      <div class="videoMain">
        <div style="width: 768px; height: 432px" ref="mainDiv">
          <!-- <canvas width="768" height="432" id="videoContent"></canvas> -->
        </div>
        <canvas
          class="canvasLine"
          width="768"
          height="432"
          ref="videPresets"
          v-show="isCalibration"
        ></canvas>
        <div :class="['videoContrl', { disabledStatus: !isCalibration }]">
          <div
            v-show="onvifParams.parameters.tilt_value != 1"
            class="videoIcon videoUp"
            @click="reSetVideo('top')"
          >
            <i></i>
          </div>
          <div
            v-show="onvifParams.parameters.pan_value != -1"
            class="videoIcon videoLeft"
            @click="reSetVideo('left')"
          >
            <i></i>
          </div>
          <div
            v-show="onvifParams.parameters.pan_value != 1"
            class="videoIcon videoRight"
            @click="reSetVideo('right')"
          >
            <i></i>
          </div>
          <div
            v-show="onvifParams.parameters.tilt_value != -1"
            class="videoIcon videoBottom"
            @click="reSetVideo('bottom')"
          >
            <i></i>
          </div>
          <div class="videoIcon zoomin" @click="reSetVideo('zoomin')">
            <i></i>
          </div>
          <div class="videoIcon zoomout" @click="reSetVideo('zoomout')">
            <i></i>
          </div>
        </div>
      </div>
    </div>
    <div class="videoCtrl" style="height: 112px">
      <div class="block clearFix">
        <div class="leftBlock">
          <div class="block">使用说明：</div>
          <div class="block">
            1.点击开始校准按钮进入校准模式，使用goto按钮使相机转动到当前需要校准的预置点，校准模式下可以控制摄像机的转动与缩放及其灵敏度；
          </div>
          <div class="block">
            2.校准时尽量使实时画面中的框选区域和校准点参考图片中的一致；
          </div>
          <div class="block">
            3.校准完毕先点击保存按钮保存校准结果，然后再点击退出校准以使相机设备恢复事件分析计算。
          </div>
        </div>
        <div class="rightBlock" style="width: 768px">
          <div class="inlineBlock ctrlBlock nomargin">
            <div class="block">
              <div class="inlineBlock nomargin">转动灵敏度</div>
              <div class="inlineBlock sliderBlock nomargin">
                <Slider v-model="turnNumber" :min="1" :step="1"></Slider>
              </div>
              <div class="inlineBlock sliderMargin">
                {{ turnNumber }}
              </div>
            </div>
            <div class="block nomargin">
              <div class="inlineBlock nomargin">缩放灵敏度</div>
              <div class="inlineBlock sliderBlock nomargin">
                <Slider v-model="zoomNumber" :min="5" :step="5"></Slider>
              </div>
              <div class="inlineBlock sliderMargin">
                {{ zoomNumber }}
              </div>
            </div>
          </div>
          <div class="inlineBlock nomargin rightBlock">
            <span class="inlineBlock nomargin">
              <Select
                v-model="presetId"
                @on-select="changePreset"
                style="width: 120px"
                placeholder="预置点"
              >
                <Option
                  v-for="(item, index) in presetList"
                  :value="item.presetId"
                  :key="item.presetId"
                  >{{ item.presetName }}</Option
                >
              </Select>
            </span>
            <span class="inlineBlock" style="margin-right: 24px">
              <Button
                type="success"
                :disabled="!isCalibration"
                @click="gotoPreset"
                >Go to</Button
              >
            </span>
            <div class="inlineBlock">
              <Button
                type="success"
                :disabled="getCorrectStatus"
                @click="calibration"
                >{{ setCorrectText }}</Button
              >
            </div>
            <div class="inlineBlock">
              <Button
                type="success"
                :disabled="!isCalibration"
                @click="setPreset"
                >保存</Button
              >
            </div>
            <div class="inlineBlock">
              <Button
                type="error"
                :disabled="!isCalibration"
                @click="cancelSetPreset"
                >退出校准</Button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Ajax from "@/api/tools/customajax";
import { API_BASEURL, API_HOST_VIDEO, API_ONVIF } from "@/utils/config";
export default {
  data() {
    return {
      videoTimer: "",
      videoId: "",
      player: null,
      isCalibration: false,
      turnNumber: 50,
      zoomNumber: 50,
      serverAddress: "",
      videoData: {
        ctl_ip_addr: "",
        ctl_psw: "",
        ctl_user: "",
        profile_id: "",
        rtsp_addr: "",
      },
      presetId: "",
      profileToken: "",
      presetToken: "",
      presetImageUrl: "",
      size:null,
      presetList: [],
      playUrl: "",
      pushServerAddress: "",
      keyStr:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      onvifParams: {
        id: 1,
        ip: "",
        event: "PTZ",
        parameters: {
          goto: "move_relative",
          pan_value: "",
          profileToken: "",
          tilt_value: "",
          zoom_value: "",
        },
        passwd: "",
        user: "",
      },
      ctx: null,
      cty: null,
    };
  },
  props: {
    rowData: {
      type: Object,
    },
    isShowModal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    turnVal() {
      return (this.turnNumber / 2000).toFixed(3);
    },
    zoomVal() {
      return (this.zoomNumber / 1000).toFixed(3);
    },
    getCorrectStatus() {
      let CalibrationStatus = false
      if (this.rowData) {
        // status 0为正常，1为异常；isRegistered相机状态 1：正常 0:异常；
      if(!this.rowData.streamStatus || this.rowData.status == 1 || this.rowData.isRegistered== 0 || this.isCalibration){
        CalibrationStatus = true
      }
      }
      return CalibrationStatus
    },
    setCorrectText() {
      if (this.rowData) {
        if (this.rowData.isRegistered == 0) {
          return "相机状态异常";
        }
        if (!this.rowData.streamStatus) {
          return "视频读取异常";
        } else if (this.rowData.status == 1) {
          return "正在校准";
        } else {
          return "开始校准";
        }
      }
    },
  },
  mounted() {
    this.getOnvifServerAddress();
    this.getPushServerAddress();
  },
  created() {},
  watch: {
    isShowModal: {
      handler(data) {
        if (!data) {
          if (this.player) {
            this.player.destroy();
            this.player = null;
            clearInterval(this.videoTimer);
          }
        } else {
          this.getVideoData();
          this.setHeartBeat();
        }
      },
    },
    isCalibration: {
      handler(data) {
        if (data) {
          // 设置心跳
          this.videoTimer = setInterval(this.setHeartBeat, 5000);
        } else {
          clearInterval(this.videoTimer);
        }
      },
    },
  },
  methods: {
    objToStr(obj) {
      let paramArr = Object.keys(obj).reduce((acc, cur) => {
        if (obj[cur] !== "" && obj[cur] != undefined)
          acc.push(cur + "=" + obj[cur]);
        return acc;
      }, []);
      return paramArr.join("&");
    },
    // 开始校准
    calibration() {
      Ajax.post(API_BASEURL + "/startCorrect?videoId=" + this.videoId).then(
        (response) => {
          if (response.status == 200) {
            console.log(response)
            if (response.data.Code == 200) {
              this.isCalibration = true;
              this.player.play();
              this.$Message.success({
                content: "您已开始校准！",
              });
            } else {
              this.isCalibration = false;
              this.$Message.error({
                content: response.data.Msg,
              });
            }
          }
        }
      );
    },
    // 更改预置点
    changePreset(data) {
      this.presetId = data.value;
      if (this.presetList.length > 0) {
        let presetObj = this.presetList.find((item) => {
          return item.presetId == this.presetId;
        });
        this.presetImageUrl = presetObj.snapshotUrl;
        this.size = JSON.parse(presetObj.size);
        this.onvifParams.parameters.profileToken = presetObj.profileToken;
        this.onvifParams.parameters.goto = presetObj.presetToken;
        this.presetToken = presetObj.presetToken;
        this.profileToken = presetObj.profileToken;
      }
      this.drawGraphics();
    },
    // 64位转码
    decode(e) {
      var t = "";
      var n, r, i;
      var s, o, u, a;
      var f = 0;
      if (e) {
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
          s = this.keyStr.indexOf(e.charAt(f++));
          o = this.keyStr.indexOf(e.charAt(f++));
          u = this.keyStr.indexOf(e.charAt(f++));
          a = this.keyStr.indexOf(e.charAt(f++));
          n = (s << 2) | (o >> 4);
          r = ((o & 15) << 4) | (u >> 2);
          i = ((u & 3) << 6) | a;
          t = t + String.fromCharCode(n);
          if (u != 64) {
            t = t + String.fromCharCode(r);
          }
          if (a != 64) {
            t = t + String.fromCharCode(i);
          }
        }
        t = this.utf8_decode(t);
        return t;
      }
    },
    utf8_decode: function (e) {
      var t = "";
      var n = 0;
      let r,
        c1,
        c2 = 0;
      while (n < e.length) {
        r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r);
          n++;
        } else if (r > 191 && r < 224) {
          c2 = e.charCodeAt(n + 1);
          t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
          n += 2;
        } else {
          c2 = e.charCodeAt(n + 1);
          c3 = e.charCodeAt(n + 2);
          t += String.fromCharCode(
            ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
          );
          n += 3;
        }
      }
      return t;
    },
    // 获取视频信息
    getVideoData() {
      Ajax.get(
        API_BASEURL + "/getVideoData?" + this.objToStr(this.rowData)
      ).then((response) => {
        if (response.status == 200) {
          this.videoId = this.rowData.videoId;
          this.videoData = response.data.Data;
          this.onvifParams.ip = response.data.Data.ctl_ip_addr;
          this.onvifParams.user = this.decode(response.data.Data.ctl_user);
          this.onvifParams.passwd = this.decode(response.data.Data.ctl_psw);
          this.getVideoUrl();
          this.getPresetList();
        }
      });
    },
    // 设置心跳
    setHeartBeat() {
      Ajax.post(
        API_BASEURL + "/setHeartBeat?videoId=" + this.rowData.videoId
      ).then((response) => {
        if (response.status == 200) {
          if (response.data.Data) {
            this.isCalibration = true;
            // return true;
          } else {
            this.isCalibration = false;
            // return false;
          }
        }
      });
    },

    // 获取视频地址并播放
    getVideoUrl() {
      this.$axios
        .post(
          this.pushServerAddress +
            "?rtspUrl=" +
            this.decode(this.videoData.rtsp_addr) +
            "&rtspId=" +
            this.videoData.profile_id
        )
        .then((response) => {
          if (response.status == 200) {
            let link = document.createElement("canvas");
            link.style.width = "768px";
            link.style.height = "432px";
            link.setAttribute("id", "videoContent");
            this.$refs.mainDiv.append(link);
            let canvas = document.getElementById("videoContent");
            this.player = new JSMpeg.Player(response.data, { canvas: canvas });
          }
        });
    },
    // 获取预置点列表
    getPresetList() {
      this.presetList = [];
      this.presetId = "";
      this.presetImageUrl = "";
      this.profileToken = "";
      this.presetToken = "";
      this.size = null
      Ajax.get(
        API_BASEURL + "/getPresetList?" + this.objToStr(this.rowData)
      ).then((response) => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            this.presetList = response.data.Data;
            if (response.data.Data.length > 0) {
              this.presetId = this.presetList[0].presetId;
              this.presetImageUrl = this.presetList[0].snapshotUrl;
              this.size = JSON.parse(this.presetList[0].size);
              this.profileToken = this.presetList[0].profileToken;
              this.presetToken = this.presetList[0].presetToken;
              this.onvifParams.parameters.profileToken = this.presetList[0].profileToken;
              this.onvifParams.parameters.goto = this.presetList[0].presetToken;
              this.drawGraphics();
            }
          }
        }
      });
      if (this.ctx || this.cty) {
        this.ctx.clearRect(0, 0, 768, 432);
        this.cty.clearRect(0, 0, 768, 432);
      }
    },
    // 绘制预置点
    drawGraphics() {
      let drawAreas = JSON.parse(
        JSON.stringify(
          this.presetList.find((item) => {
            return item.presetId == this.presetId;
          })
        )
      );
        let drawBox = this.$refs.presets;
        let drawVideoBox = this.$refs.videPresets;
        this.ctx = drawBox.getContext("2d");
        this.cty = drawVideoBox.getContext("2d");
        this.ctx.clearRect(0, 0, 768, 432);
        this.cty.clearRect(0, 0, 768, 432);
        let zoomX = (this.size.width / 768).toFixed(4)
        let zoomY = (this.size.height / 432).toFixed(4)
        for (let i = 0; i < drawAreas.areas.length; i++) {
        let points = JSON.parse(drawAreas.areas[i].coordinatesArea);
        this.ctx.beginPath();
        this.cty.beginPath();
        this.ctx.strokeStyle = "red";
        this.cty.strokeStyle = "red";
        this.ctx.moveTo(
          (points[0].x / zoomX).toFixed(2),
          (points[0].y / zoomY).toFixed(2)
        );
        this.cty.moveTo(
          (points[0].x / zoomX).toFixed(2),
          (points[0].y / zoomY).toFixed(2)
        );
        for (let k = 0; k < points.length; k++) {
          let drawPoint = points[k];
          this.ctx.lineTo(
            (drawPoint.x / zoomX).toFixed(2),
            (drawPoint.y / zoomY).toFixed(2)
          );
          this.cty.lineTo(
            (drawPoint.x / zoomX).toFixed(2),
            (drawPoint.y / zoomY).toFixed(2)
          );
        }
        this.ctx.closePath();
        this.cty.closePath();
        this.ctx.stroke();
        this.cty.stroke();
      }
    },
    // 获取控制点
    getOnvifServerAddress() {
      this.$axios
        .get(API_BASEURL + "/getOnvifServerAddress")
        .then((response) => {
          if (response.status == 200) {
            this.serverAddress = response.data;
          }
        });
    },
    getPushServerAddress() {
      this.$axios
        .get(API_BASEURL + "/getPushServerAddress")
        .then((response) => {
          if (response.status == 200) {
            this.pushServerAddress = response.data;
          }
        });
    },
    // 到预置点
    gotoPreset() {
      this.onvifParams.parameters.pan_value = "";
      this.onvifParams.parameters.tilt_value = "";
      this.onvifParams.parameters.zoom_value = "";
      let toPraset = {
        ID: this.onvifParams.id,
        IP: this.onvifParams.ip,
        event: this.onvifParams.event,
        parameters: {
          goto: this.onvifParams.parameters.goto,
          profileToken: this.onvifParams.parameters.profileToken,
        },
        passwd: this.onvifParams.passwd,
        user: this.onvifParams.user,
      };
      Ajax.post(this.serverAddress, toPraset).then((response) => {
        if (response.status == 200) {
        }
      });
    },
    // 转动相机
    reSetVideo(handlerType) {
      if (!this.isCalibration) {
        this.$Message.error({
          content: "未处于校准状态",
        });
        return false;
      }
      // this.setHeartBeat();
      if (handlerType == "top") {
        this.onvifParams.parameters.pan_value = "";
        this.onvifParams.parameters.zoom_value = "";
        this.onvifParams.parameters.tilt_value = this.turnVal;
      }
      if (handlerType == "bottom") {
        this.onvifParams.parameters.pan_value = "";
        this.onvifParams.parameters.zoom_value = "";
        this.onvifParams.parameters.tilt_value = -this.turnVal;
      }
      if (handlerType == "left") {
        this.onvifParams.parameters.tilt_value = "";
        this.onvifParams.parameters.zoom_value = "";
        this.onvifParams.parameters.pan_value = -this.turnVal;
      }
      if (handlerType == "right") {
        this.onvifParams.parameters.tilt_value = "";
        this.onvifParams.parameters.zoom_value = "";
        this.onvifParams.parameters.pan_value = this.turnVal;
      }
      if (handlerType == "zoomout") {
        this.onvifParams.parameters.tilt_value = "";
        this.onvifParams.parameters.pan_value = "";
        this.onvifParams.parameters.zoom_value = this.zoomVal;
      }
      if (handlerType == "zoomin") {
        this.onvifParams.parameters.tilt_value = "";
        this.onvifParams.parameters.pan_value = "";
        this.onvifParams.parameters.zoom_value = -this.zoomVal;
      }
      let toPraset = {
        ID: this.onvifParams.id,
        IP: this.onvifParams.ip,
        event: this.onvifParams.event,
        parameters: {
          goto: "move_relative",
          pan_value: this.onvifParams.parameters.pan_value || "0.0",
          profileToken: this.onvifParams.parameters.profileToken,
          tilt_value: this.onvifParams.parameters.tilt_value || "0.0",
          zoom_value: this.onvifParams.parameters.zoom_value || "0.0",
        },
        passwd: this.onvifParams.passwd,
        user: this.onvifParams.user,
      };
      Ajax.post(this.serverAddress, toPraset).then((response) => {
        if (response.status == 200) {
        }
      });
    },
    // 保存校准
    setPreset() {
      // this.onvifParams.parameters.presetToken = ''
      let preseParams = {
        presetId: this.presetId,
        presetToken: this.presetToken,
        profileToken: this.profileToken,
      };
      Ajax.post(API_BASEURL + "/setPreset?" + this.objToStr(preseParams)).then(
        (response) => {
          if (response.status == 200) {
            if (response.data.Code == 200) {
              this.$Message.success({
                content: "处理成功！",
              });
            } else {
              this.$Message.error({
                content: response.data.Msg,
              });
            }
          }
        }
      );
    },
    // 退出校准
    cancelSetPreset() {

      Ajax.post(
        API_BASEURL + "/cancelSetPreset?videoId=" + this.rowData.videoId
      ).then((response) => {
        console.log(response)
        if (response.status == 200) {
          this.$emit("changeUsed", { videoId: this.videoId, status: 1 });
          this.isCalibration = false;
          this.$Message.success({
            content: "您已退出校准！",
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.videDes {
  position: relative;
  text-align: left;
  color: #fff;
  font-size: 0;
  .imageDes {
    position: relative;
    width: 768px;
    margin-right: 12px;
    line-height: 28px;
    display: inline-block;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    padding-bottom: 6px;
  }
  .videoMainDes {
    position: relative;
    display: inline-block;
    width: 768px;
    line-height: 28px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    padding-bottom: 6px;
  }
}
.videoWrapper {
  position: relative;
}
.videoCtrl {
  padding: 12px 0;
  width: 1548px;
  position: relative;
  text-align: left;
  margin: 0 auto;
  .inlineBlock {
    margin-left: 12px;
    margin-right: 0;
  }
}
.videoContent {
  font-size: 0;
  text-align: center;
  .presetBox {
    padding: 12px;
    position: relative;
    text-align: left;
    z-index: 2;
  }
}
.videoImage {
  position: relative;
  display: inline-block;
  width: 768px;
  height: 432px;
  background-color: rgba(255, 255, 255, 0.2);
  margin-right: 12px;
  vertical-align: top;
  .presetImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    & img {
      width: 100%;
      height: 100%;
    }
  }
  .canvasLine {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.2);
  }
}
.videoMain {
  position: relative;
  display: inline-block;
  width: 768px;
  height: 432px;
  vertical-align: top;
  & canvas {
    width: 100%;
    height: 100%;
  }
  .canvasLine {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .videoContrl {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    .videoIcon {
      position: absolute;
      width: 64px;
      height: 64px;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
    .videoIcon i {
      width: 32px;
      height: 32px;
      left: 50%;
      top: 50%;
      display: inline-block;
      transform: translate(-50%, -50%);
      position: absolute;
      background-repeat: no-repeat;
      background-size: 100%;
      transition: all 0.5s;
    }
    .videoUp {
      left: 50%;
      top: 24px;
      transform: translateX(-50%);
      & i {
        margin-top: -6px;
        background-image: url("../../assets/themes/images/up.png");
      }
    }
    .videoRight {
      right: 72px;
      top: 50%;
      transform: translateY(-50%);
      & i {
        background-image: url("../../assets/themes/images/right.png");
      }
    }
    .videoBottom {
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      & i {
        background-image: url("../../assets/themes/images/bottom.png");
      }
    }
    .videoLeft {
      left: 72px;
      top: 50%;
      transform: translateY(-50%);
      & i {
        background-image: url("../../assets/themes/images/left.png");
      }
    }
    .zoomout {
      right: 112px;
      top: 24px;
      & i {
        background-image: url("../../assets/themes/images/zoomout.png");
      }
    }
    .zoomin {
      right: 24px;
      top: 24px;
      & i {
        background-image: url("../../assets/themes/images/zoomin.png");
      }
    }
  }
  .disabledStatus {
    .videoIcon {
      cursor: default;
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
}
.ctrlBlock {
  color: #fff;
  font-size: 16px;
  height: 36px;
  & .inlineBlock {
    line-height: 36px;
  }
  .sliderBlock {
    width: 100px;
  }
  .sliderMargin {
    margin-right: 6px;
  }
}
.videoCtrl .leftBlock {
  color: #ccc;
  font-size: 14px;
  max-width: 768px;
  line-height: 18px;
}
.videoCtrl .nomargin {
  margin-left: 0;
}
.videoCtrl .minLine {
  line-height: 24px;
}
.noPreset {
  font-size: 16px;
  color: #ccc;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
