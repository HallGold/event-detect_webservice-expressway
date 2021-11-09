<template>
  <div class="mian">
    <div class="leftMain leftmonitor">
      <!-- 系统状态监控 -->
      <div class="part">
        <div class="partTitle">
          <div class="names">系统运行总览</div>
        </div>
        <div class="partContent">
          <div class="flexBox">
            <!-- 监控总时长 -->
            <div class="flexItems">
              <div class="flexItemsWrapper paddingBottom24">
                <div class="showBlock">
                  <span class="inlineBlock blueFont largeFont">{{
                    monitorTime
                  }}</span>
                  <span class="inlineBlock blueFont init">小时</span>
                </div>
                <div class="showDataTitle">
                  <span class="inlineBlock grayFont">监控总时长</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flexBox">
            <!-- 视频设备 -->
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="showBlock">
                  <span class="inlineBlock greenFont largeFont">{{
                    viodeoDevice
                  }}</span>
                  <span class="inlineBlock greenFont init">个</span>
                </div>
                <div class="showDataTitle">
                  <span class="inlineBlock grayFont">接入视频设备</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="centerMain">
      <div class="serverBox transparentBg horn">
        <div class="hornMain">
          <div class="serverBoxMain">
            <div class="partBlockTitle paddingBottom24">
              <span class="partBlockTitleMain">智能分析计算服务</span>
            </div>
            <div class="table table240">
              <table cellpadding="0" cellspacing="0" border="1" width="100%">
                <tr class="header">
                  <th width="60">序号</th>
                  <th>IP地址</th>
                  <th>计算路数</th>
                  <th width="100">状态</th>
                </tr>
                <tr
                  class="td"
                  v-for="(item, index) in deviceStatus.servers"
                  :key="index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.serverIp }}</td>
                  <td>{{ item.cameras.length }}</td>
                  <td>
                    <span
                      :class="[
                        'statusIcon',
                        item.status ? 'successStatus' : 'errorStatus',
                      ]"
                    ></span>
                    {{ item.status ? "正常" : "异常" }}
                  </td>
                </tr>
              </table>
            </div>
            <div class="minPage">
              <Page
                @on-change="changeServerStatusPage"
                :total="serverStatusTotal"
                :current="getServerStatusParam.page"
                :page-size="getServerStatusParam.length"
                size="small"
                show-total
              />
            </div>
          </div>
        </div>
      </div>
      <div class="camerasBox transparentBg horn">
        <div class="hornMain">
          <div class="camerasBoxMain">
            <div class="partBlockTitle">
              <span class="partBlockTitleMain">视频设备状态</span>
            </div>
            <div class="filterBox nopaddingLeftRight minPaddingBottom">
              <span class="inlineBlock">
            <Select
              v-model="getDeviceStatusParam.nodeId"
              style="width:120px"
              placeholder="节点名称"
              filterable
              clearable
              @on-change="queryDeviceStatus"
            >
              <Option
                v-for="(item,index) in nodeList"
                :value="item.id"
                :key="index"
              >{{ item.node_name }}</Option>
            </Select>
          </span>
          <span class="inlineBlock">
            <Select
              v-model="getDeviceStatusParam.videoId"
              style="width:120px"
              placeholder="视频名称"
              filterable
              clearable
              @on-change="queryDeviceStatus"
            >
              <Option
                v-for="(item,index) in videoList"
                :value="item.id"
                :key="index"
              >{{ item.video_name }}</Option>
            </Select>
          </span>

          <span class="inlineBlock">
            <Select
              v-model="getDeviceStatusParam.streamStatus"
              style="width:160px"
              placeholder="视频流读取状态"
              filterable
              clearable
              @on-change="queryDeviceStatus"
            >
              <Option
                v-for="(item,index) in streamStatusList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </span>
           <span class="inlineBlock">
            <Select
              v-model="getDeviceStatusParam.isRegistered"
              style="width:120px"
              placeholder="设备状态"
              filterable
              clearable
              @on-change="queryDeviceStatus"
            >
              <Option
                v-for="(item,index) in isRegisteredList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </span>
            </div>
            <div class="table table180">
              <table cellpadding="0" cellspacing="0" width="100%" border="1">
                <tr class="header">
                  <th width="60">序号</th>
                  <th>视频源名称</th>
                  <th>节点名称</th>
                  <th width="100">视频流读取</th>
                  <th width="100">设备状态</th>
                  <!-- <th>操作</th> -->
                </tr>
                <tr
                  class="td"
                  v-for="(item, index) in deviceStatus.cameras"
                  :key="index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.video_name }}</td>
                  <td>{{ item.node_name }}</td>
                  <td>
                    <span
                      :class="[
                        'statusIcon',
                        item.streamStatus ? 'successStatus' : 'errorStatus',
                      ]"
                    ></span>
                    {{ item.streamStatus ? "正常" : "异常" }}
                  </td>
                  <td>
                    <span
                      :class="[
                        'statusIcon',
                        item.isRegistered == '1'
                          ? 'successStatus'
                          : 'errorStatus',
                      ]"
                    ></span>
                    {{ item.isRegistered == "1" ? "正常" : "异常" }}
                  </td>
                </tr>
              </table>
            </div>
            <div class="minPage">
              <Page
                @on-change="changeCameraStatusPage"
                :total="cameraStatusTotal"
                :current="getDeviceStatusParam.page"
                :page-size="getDeviceStatusParam.length"
                size="small"
                show-total
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="messageMain horn">
      <div class="hornMain">
        <div class="messageWrapper">
          <div class="partBlockTitle">
            <span class="partBlockTitleMain">系统消息列表</span>
          </div>
          <div class="filterBox nopaddingLeftRight minPaddingBottom">
            <span class="inlineBlock">
              <DatePicker
                type="datetime"
                :options="errorDeviceParamStartOptions"
                v-model="getErrorDeviceParam.startTime"
                placeholder="开始时间"
                style="width: 180px"
                :editable="false"
                @on-change="changeStartDate"
              ></DatePicker>
            </span>
            <span class="inlineBlock">
              <DatePicker
                type="datetime"
                :options="errorDeviceParamEndOptions"
                v-model="getErrorDeviceParam.endTime"
                placeholder="结束时间"
                style="width: 180px"
                :editable="false"
                @on-change="changeEndDate"
              ></DatePicker>
            </span>
            <span class="inlineBlock">
              <Select
                v-model="getErrorDeviceParam.handleStatus"
                style="width: 120px"
                placeholder="查看状态"
                @on-change="queryEvents"
              >
                <Option
                  v-for="item in handleStatusParam"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.name }}</Option
                >
              </Select>
            </span>
            <span class="inlineBlock">
              <Button @click.native="resetQuery" type="primary">重置</Button>
            </span>
          </div>
          <div class="messageDataBox">
            <div class="table table520">
              <table cellpadding="0" cellspacing="0" width="100%" border="1">
                <tr class="header">
                  <th width="150">时间</th>
                  <th>设备信息</th>
                  <th width="150">设备状态</th>
                  <th width="100">状态</th>
                  <th width="100">操作</th>
                </tr>
                <tr class="td" v-for="item in errorDeviceData" :key="item.id">
                  <td>{{ item.create_time }}</td>
                  <td>{{ item.device_info }}</td>
                  <td>{{ item.info }}</td>
                  <td>
                    <span
                      :class="[
                        'statusIcon',
                        item.handle_status ? 'successStatus' : 'errorStatus',
                      ]"
                    ></span>
                    {{ item.handle_status ? "已读" : "未读" }}
                  </td>
                  <td>
                    <span
                      class="setCur"
                      v-if="!item.handle_status"
                      @click="updateErrorDevice(item)"
                      >标为已读</span
                    >
                  </td>
                </tr>
              </table>
            </div>
            <div class="minPage">
              <Page
                @on-change="changePage"
                :total="messageTotal"
                :current="getErrorDeviceParam.page"
                :page-size="getErrorDeviceParam.length"
                size="small"
                show-total
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { API_BASEURL, API_TIMEOUT } from "@/utils/config";
import Ajax from "@/api/tools/customajax";
import calibration from "@/views/calibration/index.vue";
export default {
  components: {
    calibration,
  },
  data() {
    return {

      rowData: {
        isRegistered:"",
        streamStatus:"",
        isUsed:"",
        videoId:'',
        video_name:""
      },
      isShowModal: false,
      messageTotal: 0,
      monitorTime: 0,
      viodeoDevice: 0,
      deviceStatus: {
        servers: [],
        cameras: [],
      },
      errorDeviceData: [],
      getErrorDeviceParam: {
        page: 1,
        length: 10,
        handleStatus: "",
        startTime: "",
        endTime: "",
      },
      getServerStatusParam: {
        page: 1,
        length: 5,
      },
      serverStatusTotal: 0,
      getDeviceStatusParam: {
        page: 1,
        length: 5,
        videoId:'',
        nodeId:'',
        streamStatus:'',//true正常，false异常
        isRegistered:''//1正常，0异常
      },
      videoList:[],
      nodeList:[],
      streamStatusList:[
        {
          value:"true",
          label:"正常"
        },
        {
          value:"false",
          label:"异常"
        },
      ],
      isRegisteredList:[
        {
          value:"1",
          label:"正常"
        },
        {
          value:"0",
          label:"异常"
        },
      ],
      cameraStatusTotal: 0,
      handleStatusParam: [
        {
          value: "undefined",
          name: "全部",
        },
        {
          value: 0,
          name: "未查看",
        },
        {
          value: 1,
          name: "已查看",
        },
      ],
    };
  },
  props: {
    changeData: {
      type: Object,
    }
  },
  watch:{
    'changeData.date': {
      handler(data) {
        if (this.changeData.type == 3) {
          this.getDeviceStatus();
        }
      }
    }
  },
  computed: {
    errorDeviceParamStartOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return date.valueOf() > new Date(self.getErrorDeviceParam.endTime);
        },
      };
      return options;
      //this.statisticParam.startTime;
    },
    errorDeviceParamEndOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return (
            date.valueOf() <
            new Date(
              self
                .$moment(self.getErrorDeviceParam.startTime)
                .format("YYYY-MM-DD 00:00:00")
            )
          );
        },
      };
      return options;
    },
  },
  mounted() {
    this.statistics();
    // this.getWarningInfo();
    this.getDeviceStatus();
    this.getServerStatus();
    this.getErrorDevice();
    this.videoCombobox(); //视频源下拉列表
    this.nodeNameCombobox()
  },
  methods: {
     //视频源下拉列表
    videoCombobox() {
      Ajax.post(API_BASEURL + "/videoCombobox").then(response => {
        if (response.status == 200) {
          this.videoList = response.data.Data;
        }
      });
    },
     // 节点名称下拉列表
    nodeNameCombobox() {
      Ajax.post(API_BASEURL + "/nodeNameCombobox").then(response => {
        if (response.status == 200) {
          this.nodeList = response.data.Data;
        }
      });
    },
    queryDeviceStatus(){
      this.getDeviceStatus()
    },
    resetDeviceQuery(){
     this.getDeviceStatusParam = {
        page: 1,
        length: 5,
        videoId:'',
        nodeId:'',
        streamStatus:'',//true正常，false异常
        isRegistered:''//1正常，0异常
      }
      this.getDeviceStatus()
    },
    showVideo(item){
      this.isShowModal = true
      this.rowData = item
    },
    objToStr(obj) {
      let paramArr = Object.keys(obj).reduce((acc, cur) => {
        if (obj[cur] !== "" && obj[cur] != undefined)
          acc.push(cur + "=" + obj[cur]);
        return acc;
      }, []);
      return paramArr.join("&");
    },
    changePage(n) {
      this.getErrorDeviceParam.page = n;
      this.getErrorDevice();
    },
    changeServerStatusPage(n) {
      this.getServerStatusParam.page = n;
      this.getServerStatus();
    },
    changeCameraStatusPage(n) {
      this.getDeviceStatusParam.page = n;
      this.getDeviceStatus();
    },
    statistics() {
      Ajax.post(API_BASEURL + "/getDetectionHoursAndCount").then((response) => {
        if (response.status == 200) {
          // 监控总时长
          this.monitorTime = response.data.Data.preset_duration;
          // 监控路数
          this.viodeoDevice = response.data.Data.preset_count;
        }
      });
    },
    // 设备状态查询
    getDeviceStatus() {
      Ajax.post(
        API_BASEURL +
          "/getDeviceStatus?" +
          this.objToStr(this.getDeviceStatusParam)
      ).then((response) => {
        if (response.status == 200) {
          this.deviceStatus.cameras = response.data.Data.cameras;
          this.cameraStatusTotal = response.data.Data.pageCount;
        }
      });
    },
    // 服务状态查询
    getServerStatus() {
      Ajax.post(
        API_BASEURL +
          "/getServerStatus?" +
          this.objToStr(this.getServerStatusParam)
      ).then((response) => {
        if (response.status == 200) {
          this.deviceStatus.servers = response.data.Data.servers;
          this.serverStatusTotal = response.data.Data.pageCount;
        }
      });
    },
    // 查看设备和服务异常状态
    getErrorDevice() {
      Ajax.post(
        API_BASEURL +
          "/getErrorDevice?" +
          this.objToStr(this.getErrorDeviceParam)
      ).then((response) => {
        if (response.status == 200) {
          this.errorDeviceData = response.data.Data.errorDevice;
          this.messageTotal = response.data.Data.pageCount;
        }
      });
    },
    changeStartDate(d, o) {
      this.getErrorDeviceParam.page = 1;
      this.getErrorDeviceParam.startTime = d;
      this.getErrorDevice();
    },
    changeEndDate(d, o) {
      this.getErrorDeviceParam.page = 1;
      this.getErrorDeviceParam.endTime = d;
      this.getErrorDevice();
    },
    queryEvents() {
      this.getErrorDeviceParam.page = 1;
      this.getErrorDevice();
    },
    resetQuery() {
      this.getErrorDeviceParam = {
        page: 1,
        length: 20,
        handleStatus: "",
        startTime: "",
        endTime: "",
      };
      this.getErrorDevice();
    },
    // 修改设备异常查看状态
    updateErrorDevice(item) {
      Ajax.post(
        API_BASEURL + "/updateErrorDevice?id=" + item.id + "&handleStatus=1"
      ).then((response) => {
        if (response.status == 200) {
          this.errorDeviceData.forEach((list, index) => {
            if (list.id == item.id) {
              this.errorDeviceData[index].handle_status = 1;
            }
          });
          this.$Message.success({
            content: "处理成功！",
          });
        }
      });
    },
  },
};
</script>
