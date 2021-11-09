<template>
  <div class="popBox">
    <div class="popFormBox">
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">区域名称：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ eventDetail.area_name }}</span>
        </Col>
        <Col span="6">
          <span class="formBlock textAlignRight">路段名称：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ eventDetail.path_line_name }}</span>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">上报节点：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ eventDetail.node_name }}</span>
        </Col>
        <Col span="6">
          <span class="formBlock textAlignRight">视频源名称：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ eventDetail.video_name }}</span>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">事件类型：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ eventDetail.event_type_name }}</span>
        </Col>
        <Col span="6">
          <span class="formBlock textAlignRight">产生时间：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ eventDetail.create_time }}</span>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">事件状态：</span>
        </Col>
        <Col span="3">
          <span class="formBlock">{{ eventDetail.status | statusFilter }}</span>
        </Col>
        <Col span="12">
          <div
            class="btnTd"
            v-if="eventDetail.status == '0' || eventDetail.update"
          >
            <div class="btnGroup">
              <span
                class="ctrlBtn correct"
                @click="upEventStatus(eventDetail, 1)"
                >正报</span
              >
            </div>
            <div class="btnGroup">
              <span
                class="ctrlBtn mistake"
                @click="upEventStatus(eventDetail, 2)"
                >误报</span
              >
            </div>
            <div class="btnGroup">
              <span
                class="ctrlBtn ignore"
                @click="upEventStatus(eventDetail, 3)"
                >忽略</span
              >
            </div>
          </div>
          <div class="btnTd" v-else>
            <div class="btnGroup">
              <span
                class="ctrlBtn correct"
                @click="upEventStatus(eventDetail, 4)"
                >修改</span
              >
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">该区域暂停状态：</span>
        </Col>
        <Col span="3">
          <span class="formBlock">{{ area_pause_time_Text }}</span>
        </Col>
        <Col span="12">
          <div class="btnGroup">
            <Button
              v-if="eventDetail.area_pause_time"
              @click="cancelAreaPuaseTime"
              >取消暂停区域检测</Button
            >
            <Button type="primary" v-else @click="areaPauseTimeModel = true"
              >暂停区域检测</Button
            >
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">所属相机中止状态：</span>
        </Col>
        <Col span="3">
          <span class="formBlock">{{ video_pause_time_Text }}</span>
        </Col>
        <Col span="15">
          <div class="btnGroup">
            <Button
              v-if="eventDetail.video_pause_time"
              @click="cancelVideoPuaseTime"
              >取消相机中止检测</Button
            >
            <Button type="primary" v-else @click="videoPauseTimeModel = true"
              >相机中止检测</Button
            >
            <Button
              type="primary"
              @click="showPreset"
              :style="{'margin-left': eventDetail.video_pause_time?'142px':'170px'}"
              >预置点校准</Button
            >
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align: center">
          <div
            style="
              display: inline-block;
              font-size: 24px;
              vertical-align: middle;
            "
            v-if="relationData && relationData.length > 0"
          >
            当前事件
          </div>
          <div style="display: inline-block; right: 58px; position: absolute">
            <Button
              type="primary"
              @click="showPrev(eventDetail)"
              v-show="currentIndex > 0"
              >上一条</Button
            >
            <Button type="primary" @click="showNext(eventDetail)"
              >下一条</Button
            >
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <div class="sliderBox">
            <div class="hiddenContent">
            <div
              :class="['silerItem', { rightShow: mainBlockShow, leftShowOut:!mainBlockShow}]"
            >
              <div class="playBox">
                <img :src="eventDetail.pic_file" />
              </div>
            </div>
            <div
              :class="['silerItem', { leftShow: !mainBlockShow, rightShowOut:mainBlockShow }]"
            >
              <div class="playBox">
                <video-player
                  class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="playerOptions"
                ></video-player>
              </div>
            </div>
            </div>
            <div
              class="sliderBtn leftSliderBtn"
              v-show="!mainBlockShow"
              @click="mainBlockShowToggle"
            >
              <div class="silderRightIcons"><b></b></div>
              <span>点击查看图像</span>
            </div>
            <div
              class="sliderBtn rightSliderBtn"
              v-show="mainBlockShow"
              @click="mainBlockShowToggle"
            >
            <span>点击查看视频</span>
              <div class="silderLeftIcons"><b></b></div>

            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="popFormBox" v-if="relationData && relationData.length > 0">
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">区域名称：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ relationDetail.area_name }}</span>
        </Col>
        <Col span="6">
          <span class="formBlock textAlignRight">路段名称：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ relationDetail.path_line_name }}</span>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">上报节点：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ relationDetail.node_name }}</span>
        </Col>
        <Col span="6">
          <span class="formBlock textAlignRight">视频源名称：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ relationDetail.video_name }}</span>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">事件类型：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ relationDetail.event_type_name }}</span>
        </Col>
        <Col span="6">
          <span class="formBlock textAlignRight">产生时间：</span>
        </Col>
        <Col span="6">
          <span class="formBlock">{{ relationDetail.create_time }}</span>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">事件状态：</span>
        </Col>
        <Col span="3">
          <span class="formBlock">{{
            relationDetail.status | statusFilter
          }}</span>
        </Col>
        <Col span="12">
          <div
            class="btnTd"
            v-if="relationDetail.status == '0' || relationDetail.update"
          >
            <!-- <div class="btnGroup">
            <span class="ctrlBtn disabled">正报</span>
          </div>
          <div class="btnGroup">
            <span class="ctrlBtn disabled">误报</span>
          </div>
          <div class="btnGroup">
            <span class="ctrlBtn disabled">忽略</span>
          </div> -->
            <div class="btnGroup">
              <span
                class="ctrlBtn correct"
                @click="upEventStatus(relationDetail, 1)"
                >正报</span
              >
            </div>
            <div class="btnGroup">
              <span
                class="ctrlBtn mistake"
                @click="upEventStatus(relationDetail, 2)"
                >误报</span
              >
            </div>
            <div class="btnGroup">
              <span
                class="ctrlBtn ignore"
                @click="upEventStatus(relationDetail, 3)"
                >忽略</span
              >
            </div>
          </div>
          <div class="btnTd" v-else>
            <div class="btnGroup">
              <!-- <span class="ctrlBtn disabled">修改</span> -->
              <span
                class="ctrlBtn correct"
                @click="upEventStatus(relationDetail, 4)"
                >修改</span
              >
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">该区域暂停状态：</span>
        </Col>
        <Col span="3">
          <span class="formBlock">{{ area_pause_time_Text }}</span>
        </Col>
        <Col span="12">
          <div class="btnGroup">
            <Button
              v-if="eventDetail.area_pause_time"
              @click="cancelAreaPuaseTime"
              >取消暂停区域检测</Button
            >
            <Button v-else type="primary" @click="areaPauseTimeModel = true"
              >暂停区域检测</Button
            >
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span class="formBlock textAlignRight">所属相机中止状态：</span>
        </Col>
        <Col span="3">
          <span class="formBlock">{{ video_pause_time_Text }}</span>
        </Col>
        <Col span="12">
          <div class="btnGroup">
            <Button
              v-if="eventDetail.video_pause_time"
              @click="cancelVideoPuaseTime"
              >取消相机中止检测</Button
            >
            <Button v-else type="primary" @click="videoPauseTimeModel = true"
              >相机中止检测</Button
            >
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align: center">
          <div
            style="
              display: inline-block;
              font-size: 24px;
              vertical-align: middle;
            "
          >
            关联事件
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <div class="sliderBox">
            <div class="hiddenContent">
            <div
              :class="['silerItem', { rightShow: relationBlockShow, leftShowOut:!relationBlockShow}]"
            >
              <div class="playBox">
                <img :src="relationDetail.pic_file" />
              </div>
            </div>
            <div
              :class="['silerItem', { leftShow: !relationBlockShow, rightShowOut:relationBlockShow }]"
            >
              <div class="playBox">
                <video-player
                  class="video-player vjs-custom-skin"
                  ref="relationVideoPlayer"
                  :playsinline="true"
                  :options="relationPlayerOptions"
                ></video-player>
              </div>
            </div>
            </div>
            <div
              class="sliderBtn leftSliderBtn"
              v-show="!relationBlockShow"
              @click="relationBlockShowToggle"
            >
              <div class="silderRightIcons"><b></b></div>
              <span>点击查看图像</span>
            </div>
            <div
              class="sliderBtn rightSliderBtn"
              v-show="relationBlockShow"
              @click="relationBlockShowToggle"
            >
              <span>点击查看视频</span>
              <div class="silderLeftIcons"><b></b></div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div style="clear: both" v-if="relationData && relationData.length > 1">
      <Row>
        <Col span="24" style="text-align: left">
          <div
            style="
              display: inline-block;
              font-size: 16px;
              vertical-align: middle;
            "
          >
            关联事件
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align: left">
          <div class="relationList">
            <div
              :class="[
                'videoContent',
                { activeList: item.id == relationDetail.id },
              ]"
              v-for="(item, index) in relationData"
              :key="index"
              @click="selectRelationEvent(item)"
            >
              <div class="videoList">
                <img :src="item.pic_file" />
                <!-- <my-video-player :src="item.video_addr"> </my-video-player> -->
              </div>
              <div class="videoTitle">
                <span>{{ item.video_name }}</span>
                <span>{{ item.event_type_name }}</span>
                <span>{{ item.create_time }}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <!-- 区域暂停检测时间对话框 -->
    <Modal
      v-model="areaPauseTimeModel"
      title="设置区域暂停检测时间"
      okText="确认暂停"
      cancelText="取消操作"
      @on-ok="areaPuaseTime"
    >
      <div class="pauseTimeBox">
        <span
          :class="[
            'pauseTimeItem',
            { pauseTimeItemActive: areaTime == item.value },
          ]"
          v-for="(item, index) in pauseTimeList"
          :key="index"
          @click="setAreaTime(item)"
          >{{ item.name }}</span
        >
      </div>
    </Modal>
    <!-- 相机暂停检测时间对话框 -->
    <Modal
      v-model="videoPauseTimeModel"
      title="设置相机暂停检测时间"
      okText="确认暂停"
      cancelText="取消操作"
      @on-ok="videoPuaseTime"
    >
      <div class="pauseTimeBox">
        <span
          :class="[
            'pauseTimeItem',
            { pauseTimeItemActive: videoTime == item.value },
          ]"
          v-for="(item, index) in pauseTimeList"
          :key="index"
          @click="setVideoTime(item)"
          >{{ item.name }}</span
        >
      </div>
    </Modal>

    <Modal
      title="相机预置点校准"
      :width="1600"
      :mask-closable="false"
      footer-hide
      scrollable
      v-model="isShowModal"
      class-name="vertical-center-modal"
    >
      <calibration :rowData="rowData" :isShowModal="isShowModal"></calibration>
    </Modal>
  </div>
</template>
<script>
import Ajax from "@/api/tools/customajax";
import { API_BASEURL, API_TIMEOUT, DETAIL_SHOW_PIC_FIRST} from "@/utils/config";
import myVideoPlayer from "@/views/events/myVideoPlayer.vue";
import calibration from "@/views/calibration/index.vue";
export default {
  props: {
    DataAction: {
      type: Boolean,
      default: false,
    },
    BindData: {
      type: Object,
    },
    SearchParams: {
      type: Object,
    },
    drawerStatus: {
      type: Boolean,
    },
  },
  watch: {
    "BindData.id": {
      handler(data) {
        if (this.BindData && this.BindData.id)
          if (!this.eventDetail || this.eventDetail.id != this.BindData.id)
            this.setData(this.BindData.id);
      },
    },
    drawerStatus: {
      handler(data) {
        if (data) {
          this.prevData = [];
          this.currentIndex = 0;
          this.mainBlockShow = DETAIL_SHOW_PIC_FIRST;
          this.relationBlockShow = DETAIL_SHOW_PIC_FIRST;
        }
      },
    },
  },
  components: {
    myVideoPlayer,
  },
  data() {
    return {
      showIndex: 0,
      isShowModal: false,
      rowData: {},
      mainBlockShow: DETAIL_SHOW_PIC_FIRST,//是否默认显示图片，主事件
      relationBlockShow: DETAIL_SHOW_PIC_FIRST,//是否默认显示图片，关联事件
      prevData: [],
      currentIndex: 0,
      prevIndex: -1,
      showPrevButton: false,
      mainEventId: "",
      pauseTimeList: [],
      areaPauseTimeModel: false,
      videoPauseTimeModel: false,
      relationData: [], //关联事件
      eventDetail: {}, //事件详细
      relationDetail: {}, //关联事件详细
      areaTime: 10, // 设置区域暂停检测时间
      videoTime: 10, // 设置相机暂停检测时间
      playerOptions: {
        techOrder: ["html5"],
        preload: "auto",
        sourceOrder: true,
        sources: [],
        aspectRatio: "16:9",
        width:600,
        height: 350,
        autoplay: false,
        controls: true,
        language: "zh-CN",
        fluid: true,
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
      },
      relationPlayerOptions: {
        techOrder: ["html5"],
        preload: "auto",
        sourceOrder: true,
        sources: [],
         aspectRatio: "16:9",
         width:600,
        height: 350,
        autoplay: false,
        controls: true,
        language: "zh-CN",
        fluid: true,
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
      },
      thumbPlayerOptions: {
        techOrder: ["html5"],
        preload: "auto",
        sourceOrder: true,
        sources: [],
        aspectRatio: "16:9",
        height: 50,
        autoplay: false,
        controls: false,
        language: "zh-CN",
        fluid: true,
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
      },
      timer: null,
      area_pause_time_Text: "未暂停",
      video_pause_time_Text: "未中止",
    };
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.area_pause_time_Text = "未暂停";
      this.video_pause_time_Text = "未中止";
    }
  },
  filters: {
    // 格式化状态
    statusFilter(v) {
      if (v == 0) {
        return "未处理";
      } else if (v == 1) {
        return "正报";
      } else if (v == 2) {
        return "误报";
      } else {
        return "忽略";
      }
    },
    statementFilter(val) {
      let returnVal = "";
      if (val && val.indexOf("事件类型:") > -1) {
        returnVal = val.substring(val.indexOf("事件类型:") + 5);
      }
      return returnVal;
    },
  },
  components: {
    calibration,
  },
  mounted() {
    this.getPauseTime(); // 暂停时间下拉列表
  },
  methods: {
    mainBlockShowToggle() {
      this.mainBlockShow = !this.mainBlockShow;
    },
    relationBlockShowToggle() {
      this.relationBlockShow = !this.relationBlockShow;
    },
    objToStr(obj) {
      let paramArr = Object.keys(obj).reduce((acc, cur) => {
        if (obj[cur] !== "" && obj[cur] != undefined)
          acc.push(cur + "=" + obj[cur]);
        return acc;
      }, []);
      return paramArr.join("&");
    },
    showPreset() {
      Ajax.get(
        API_BASEURL +
          "/getVideoList?page=1&length=1&videoId=" +
          this.eventDetail.video_id
      ).then((response) => {
        if (response.status == 200) {
          this.rowData = response.data.Data.data[0];
          this.isShowModal = true;
        }
      });
    },
    setData(formData) {
      this.mainEventId = "";
      Ajax.post(API_BASEURL + "/viewDetectionEvent?id=" + formData).then(
        (response) => {
          if (response.status == 200) {
            this.relationData = [];
            let hasMain = false;
            response.data.Data.forEach((item) => {
              if (item.is_main) {
                this.mainEventId = item.id;

                let eventIndex = this.prevData.findIndex((evt) => {
                  return evt == this.mainEventId;
                });
                if (eventIndex < 0) this.prevData.push(this.mainEventId);
              }

              if (
                (item.event_status == 0 || item.event_status == "0") &&
                !hasMain
              ) {
                hasMain = true;
                this.eventDetail = item;
                if (
                  this.eventDetail.area_pause_time ||
                  this.eventDetail.video_pause_time
                )
                  this.startTimer();
                this.$set(this.playerOptions.sources, 0, {
                  type: "video/mp4",
                  src: item.video_addr,
                });
              } else {
                let itemObj = JSON.parse(JSON.stringify(item));
                this.relationData.push(itemObj);
              }
            });
            this.$emit("relation", this.relationData.length > 0);
            if (this.relationData.length > 0) {
              this.relationDetail = this.relationData[0];

              this.$set(this.relationPlayerOptions.sources, 0, {
                type: "video/mp4",
                src: this.relationDetail.video_addr,
              });
            }
          }
        }
      );
    },
    selectRelationEvent(item) {
      this.relationDetail = item;
      this.$set(this.relationPlayerOptions.sources, 0, {
        type: "video/mp4",
        src: this.relationDetail.video_addr,
      });
    },
    // 暂停时间下拉列表
    getPauseTime() {
      Ajax.post(API_BASEURL + "/getPauseTime").then((response) => {
        if (response.status == 200) {
          this.pauseTimeList = response.data.Data;
        }
      });
    },
    // 设置区域暂停检测时间
    setAreaTime(t) {
      this.areaTime = t.value;
    },
    // 提交区域暂停检测时间
    areaPuaseTime() {
      Ajax.post(
        API_BASEURL +
          "/setAreaPauseTime?id=" +
          this.eventDetail.id +
          "&pause_time=" +
          this.areaTime
      ).then((response) => {
        if (response.status == 200) {
          this.eventDetail.area_pause_time = response.data.Data.area_pause_time;
          this.startTimer();
          this.$Message.success({
            content: "操作成功！",
          });
        }
      });
    },
    // 取消区域暂停检测时间对话框
    cancelGetPauseTime() {
      this.areaPauseTimeModel = false;
    },
    // 取消区域暂停检测时间
    cancelAreaPuaseTime() {
      this.$Modal.confirm({
        title: "取消区域暂停检测",
        content: "您确认取消区域暂停检测吗？",
        onOk: () => {
          Ajax.post(
            API_BASEURL +
              "/setAreaPauseTime?id=" +
              this.eventDetail.id +
              "&pause_time=0"
          ).then((response) => {
            if (response.status == 200) {
              // 修改详情展示数据
              this.eventDetail.area_pause_time = "";
              // 修改列表展示数据
              // for (let i = 0; i < this.eventsData.length; i++) {
              //   if (this.eventsData[i].id == this.eventDetail.id) {
              //     this.eventsData[i].area_pause_time = "";
              //   }
              // }
              this.$Message.success({
                content: "操作成功！",
              });
            }
          });
        },
        onCancel: () => {},
      });
    },
    // 设置相机暂停检测时间
    setVideoTime(t) {
      this.videoTime = t.value;
    },
    // 提交相机暂停检测时间
    videoPuaseTime() {
      Ajax.post(
        API_BASEURL +
          "/setVideoPauseTime?id=" +
          this.eventDetail.id +
          "&pause_time=" +
          this.videoTime
      ).then((response) => {
        if (response.status == 200) {
          this.eventDetail.video_pause_time =
            response.data.Data.video_pause_time;
          this.startTimer();
          this.$Message.success({
            content: "操作成功！",
          });
        }
      });
    },
    cancelVideoPuaseTime() {
      this.videoPauseTimeModel = false;
    },
    // 取消相机暂停检测时间
    cancelVideoPuaseTime() {
      this.$Modal.confirm({
        title: "取消相机暂停检测",
        content: "您确认取消相机暂停检测吗？",
        onOk: () => {
          Ajax.post(
            API_BASEURL +
              "/setVideoPauseTime?id=" +
              this.eventDetail.id +
              "&pause_time=0"
          ).then((response) => {
            if (response.status == 200) {
              // 修改详情展示数据
              this.eventDetail.video_pause_time = "";
              this.$Message.success({
                content: "操作成功！",
              });
            }
          });
        },
        onCancel: () => {},
      });
    },
    closeTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
        this.area_pause_time_Text = "未暂停";
        this.video_pause_time_Text = "未中止";
      }
    },
    startTimer() {
      if (!this.timer) {
        this.timer = setInterval(this.stopTimecount, 1000);
      }
    },
    stopTimecount() {
      if (this.eventDetail.area_pause_time) {
        let text = this.setTimer(this.eventDetail.area_pause_time);
        if (text) this.area_pause_time_Text = text;
        else {
          this.eventDetail.area_pause_time = "";
          this.area_pause_time_Text = "未暂停";
        }
      } else this.area_pause_time_Text = "未暂停";
      if (this.eventDetail.video_pause_time) {
        let text = this.setTimer(this.eventDetail.video_pause_time);
        if (text) this.video_pause_time_Text = text;
        else {
          this.eventDetail.video_pause_time = "";
          this.video_pause_time_Text = "未中止";
        }
      } else this.video_pause_time_Text = "未中止";

      if (
        !this.eventDetail.area_pause_time &&
        !this.eventDetail.video_pause_time
      ) {
        this.closeTimer();
      }
    },
    //  获取当前时间
    getNowTime() {
      Ajax.post(API_BASEURL + "/getNowTime").then((response) => {
        if (response.status == 200) {
          return new Date(response.data.thisTime).getTime();
        }
      });
    },
    setTimer(endTime) {
      let dateBegin = new Date();
      let dateEnd = new Date(endTime);
      let dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
      let duration = this.$moment.duration(dateDiff);

      let hours = duration.hours();
      let minutes = duration.minutes();
      let seconds = duration.seconds();

      let timerText = "";
      if (hours > 0) timerText = timerText + hours + "小时";
      if (minutes > 0) timerText = timerText + minutes + "分";
      if (seconds > 0) timerText = timerText + seconds + "秒";
      return timerText;
    },
    showPrev(row) {
      if (this.prevData.length > 1) {
        if (this.currentIndex > 0) {
          this.mainBlockShow = true;
          // 处理
          this.currentIndex = this.currentIndex - 1;
          let eventData = this.prevData[this.currentIndex];
          if (eventData) {
            this.setData(eventData);
          }
          // this.$set(this.playerOptions.sources, 0, {
          //   type: "video/mp4",
          //   src: this.eventDetail.video_addr,
          // });
        } else {
          this.$Message.error({
            content: "当前为第一条数据",
          });
        }
      }
    },
    // 显示下一条
    showNext(row) {
      let self = this;
      this.drawerStatus = true;
      if (this.prevData.length > this.currentIndex + 1) {
        this.mainBlockShow = true;
        this.currentIndex += 1;
        let eventData = this.prevData[this.currentIndex];
        if (eventData) this.setData(eventData);
        // this.$set(self.playerOptions.sources, 0, {
        //   type: "video/mp4",
        //   src: this.eventDetail.video_addr,
        // });
      } else {
        this.mainBlockShow = true;
        let actionUrl =
          API_BASEURL + "/viewDetectionEventNext?id=" + self.mainEventId;
        if (self.DataAction) {
          actionUrl =
            actionUrl + "&node_name=" + row.node_name + "&alarm_status=0";
        } else {
          let searchParams = JSON.parse(JSON.stringify(self.SearchParams));
          this.$delete(searchParams, "page");
          this.$delete(searchParams, "length");
          let param = self.objToStr(searchParams);
          if (param) actionUrl = actionUrl + "&" + param;
        }
        Ajax.post(actionUrl).then((response) => {
          if (response.status == 200 && response.data.Code == 200) {
            self.relationData = [];
            let hasMain = false;
            response.data.Data.forEach((item) => {
              if (item.is_main) {
                self.mainEventId = item.id;
                let eventIndex = this.prevData.findIndex((evt) => {
                  return evt == this.mainEventId;
                });
                if (eventIndex < 0) this.prevData.push(this.mainEventId);
              }
              if (
                (item.event_status == 0 || item.event_status == "0") &&
                !hasMain
              ) {
                hasMain = true;
                this.currentIndex += 1;
                self.eventDetail = item;
                this.$set(self.playerOptions.sources, 0, {
                  type: "video/mp4",
                  src: item.video_addr,
                });
              } else {
                self.relationData.push(item);
              }
            });
            if (self.relationData.length > 0) {
              self.relationDetail = self.relationData[0];

              this.$set(self.relationPlayerOptions.sources, 0, {
                type: "video/mp4",
                src: self.relationDetail.video_addr,
              });
            }
            this.$emit("nextData", self.eventDetail);
            this.$emit("relation", self.relationData.length > 0);
          } else {
            this.$Message.error({
              content: response.data.Msg,
            });
          }
        });
      }
    },
    // 设置区域暂停检测时间
    setAreaPauseTime() {
      Ajax.post(
        API_BASEURL + "/setAreaPauseTime?id=" + this.eventDetail.id
      ).then((response) => {
        if (response.status == 200) {
        }
      });
    },
    updateEventStatus(row, status) {
      Ajax.post(
        API_BASEURL +
          "/updateEventStatus?id=" +
          row.id +
          "&event_status=" +
          status
      ).then((response) => {
        if (response.status == 200) {
          this.$set(row, "status", status);
          this.$set(row, "update", false);
          this.$emit("dataChange", row);
          this.$Message.success({
            content: "操作成功！",
          });
        }
      });
    },
    // 格式化状态
    formatStatus(v) {
      if (v == 0) {
        return "未处理";
      } else if (v == 1) {
        return "正报";
      } else if (v == 2) {
        return "误报";
      } else {
        return "忽略";
      }
    },
    // 更新列表处理
    upEventStatus(row, status) {
      if (status == 4) {
        this.$set(row, "update", true);
        this.$emit("dataChange", row);
      }
      // else if (status == 3) {
      //   this.$Modal.confirm({
      //     title: "操作确认",
      //     content:
      //       "确认将该事件处理为【" + this.formatStatus(status) + "】吗？",
      //     onOk: () => {
      //       this.updateEventStatus(row, status);
      //     },
      //     onCancel: () => {}
      //   });
      // }
      else this.updateEventStatus(row, status);
    },
  },
};
</script>
<style>
.video-js .vjs-tech{
  width: auto;
  height: auto;
}
</style>
