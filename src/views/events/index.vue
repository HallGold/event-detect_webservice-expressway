<template>
  <div class="main">
    <div class="leftMain">
      <div class="part">
        <div class="partTitle">
          <div class="names">事件状态统计</div>
          <div class="filters">
            <div class="filterBlock">{{eventsCorrent | selectTime}}</div>
            <div class="dropDown">
              <div
                class="filterItems"
                @click="changeEvensStatistics('today')"
              >今日</div>
              <div
                class="filterItems"
                @click="changeEvensStatistics('week')"
              >近一周</div>
              <div
                class="filterItems"
                @click="changeEvensStatistics('month')"
              >近一月</div>
              <div
                class="filterItems"
                @click="changeEvensStatistics('all')"
              >全部</div>
            </div>
          </div>
        </div>
        <div class="partContent">
          <div class="flexBox paddingBottom30">
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock">
                  <span class="inlineBlock largeFont yellowFont">{{trafficEvent.data_count}}</span>
                </div>
                <div class="statisticsBlock">
                  <span class="inlineBlock grayFont">未处理事件</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flexBox paddingBottom30">
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock">
                  <span class="inlineBlock largeFont blueFont">{{trafficEvent.data_corrent}}</span>
                </div>
                <div class="statisticsBlock">
                  <span class="inlineBlock grayFont">正报</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flexBox paddingBottom30">
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock">
                  <span class="inlineBlock largeFont errorFont">{{trafficEvent.data_error}}</span>
                </div>
                <div class="statisticsBlock">
                  <span class="inlineBlock grayFont">误报</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flexBox">
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock">
                  <span class="inlineBlock largeFont greenFont">{{trafficEvent.data_ignore}}</span>
                </div>
                <div class="statisticsBlock">
                  <span class="inlineBlock grayFont">已忽略</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rightMain">
      <div class="partColumn">事件监控</div>
      <div class="rightContent">
        <div class="filterBox minPaddingBottom">
          <span class="inlineBlock">
            <DatePicker
              type="datetime"
              :options="filterBlockStartOptions"
              v-model="filterBlock.startTime"
              placeholder="开始时间"
              style="width:180px"
              :editable="false"
              @on-change="changeStartDate"
            ></DatePicker>
          </span>
          <span class="inlineBlock">
            <DatePicker
              type="datetime"
              :options="filterBlockEndOptions"
              v-model="filterBlock.endTime"
              placeholder="结束时间"
              style="width:180px"
              :editable="false"
              @on-change="changeEndDate"
            ></DatePicker>
          </span>
          <span class="inlineBlock">
            <Select
              v-model="filterBlock.sectionId"
              style="width:120px"
              placeholder="所属区间"
              filterable
              clearable
              @on-change="queryEvents"
            >
              <Option
                v-for="(item,index) in sectionList"
                :value="item.sectionId"
                :key="item.sectionId"
              >{{ item.sectionName }}</Option>
            </Select>
          </span>
          <span class="inlineBlock">
            <Select
              v-model="filterBlock.node_id"
              style="width:120px"
              placeholder="节点名称"
              filterable
              clearable
              @on-change="queryEventsNode"
            >
              <Option
                v-for="(item,index) in nodeListFilter"
                :value="item.id"
                :key="index"
              >{{ item.node_name }}</Option>
            </Select>
          </span>

          <span class="inlineBlock">
            <Select
              v-model="filterBlock.video_id"
              style="width:120px"
              placeholder="视频名称"
              filterable
              clearable
              @on-change="queryEventsVideo"
              @on-clear="queryEventsChearVideo"
            >
              <Option
                v-for="(item,index) in videoListFilter"
                :value="item.id"
                :key="index"
              >{{ item.video_name }}</Option>
            </Select>
          </span>
          <span class="inlineBlock">
            <Select
              v-model="filterBlock.event_type"
              style="width:100px"
              placeholder="事件类型"
              clearable
              @on-change="queryEvents"
            >
              <Option
                v-for="item in eventList"
                :value="item.event_type"
                :key="item.event_type"
              >{{ item.event_type_name }}</Option>
            </Select>
          </span>
          <span class="inlineBlock">
            <Select
              v-model="filterBlock.event_status"
              style="width:120px"
              placeholder="事件状态"
              clearable
              @on-change="queryEvents"
            >
              <Option
                v-for="item in eventStatus"
                :value="item.event_status"
                :key="item.event_status"
              >{{ item.event_status_name }}</Option>
            </Select>
          </span>
          <span class="inlineBlock">
            <Select
              v-model="filterBlock.alarm_status"
              style="width:100px"
              placeholder="处理状态"
              clearable
              @on-change="queryEvents"
            >
              <Option
                v-for="item in statusList"
                :value="item.event_status"
                :key="item.event_status"
              >{{ item.event_status_name }}</Option>
            </Select>
          </span>
          <span class="inlineBlock">
            <Button
              @click.native="resetQuery"
              type="primary"
            >重置</Button>
          </span>
          <span class="inlineBlock">
            <Button
              @click.native="exportEvents"
              type="success"
            >导出事件列表</Button>
          </span>
        </div>
        <div class="dataContent">
          <div class="dataContentList">
            <div class="table nopadding">
              <table
                cellpadding="0"
                cellspacing="0"
                border="1"
                width="100%"
              >
                <tr class="header">
                  <th width="60">序号</th>
                  <th width="120">日期</th>
                  <th width="120">触发详细时间</th>
                  <th>节点</th>
                  <th>视频源</th>
                  <th>路段名称</th>
                  <th>所属区间</th>
                  <th width="240">事件类型</th>
                  <th width="90">处理状态</th>
                  <!-- <th width="210">操作</th> -->
                </tr>
                <tr
                  class="td"
                  @click="selectEvent(item)"
                  v-for="item in eventsData"
                  :key="item.id"
                >
                  <td class="center">{{item.seq_num}}</td>
                  <td class="center">{{item.date}}</td>
                  <td class="center">{{item.time}}</td>
                  <td class="center">{{item.node_name}}</td>
                  <td class="center">{{item.video_name}}</td>
                  <td class="center">{{item.path_line_name}}</td>
                  <td class="center">{{item.sectionName || "—"}}</td>
                  <td class="center">{{item.event_type_name}}</td>
                  <td
                    v-if="item.status=='0'"
                    class="nonProcess center"
                  >{{item.status | statusFilter}}</td>
                  <td
                    class="center"
                    v-else
                  >{{item.status | statusFilter}}</td>
                  <!-- <td class="center">
                    <div
                      class="tabBtnGroups"
                      v-if="item.status == 0 || item.update"
                    >
                      <span
                        class="tabBtn correct"
                        @click.stop="upEventStatus(item,1)"
                      >正报</span>
                      <span
                        class="tabBtn mistake"
                        @click.stop="upEventStatus(item,2)"
                      >误报</span>
                      <span
                        class="tabBtn ignore"
                        @click.stop="upEventStatus(item,3)"
                      >忽略</span>
                    </div>
                    <div
                      class="tabBtnGroups"
                      v-else
                    >
                      <span
                        class="tabBtn correct"
                        @click.stop="upEventStatus(item,4)"
                      >修改</span>
                    </div>
                  </td> -->
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="pages">
          <Page
            :total="eventTotal"
            @on-change="changePage"
            show-sizer
            show-total
            :current="filterBlock.page"
            :page-size="filterBlock.length"
            :page-size-opts="[10,20,30,40,50]"
            @on-page-size-change="changePageSize"
          />
        </div>
      </div>
    </div>
    <Modal title="事件详情" :width="hasRelation?1488:750" transfer mask-closable footer-hide scrollable v-model="drawerStatus" class-name="vertical-center-modal">
      <event-detail :BindData="selectedEvent" :drawerStatus="drawerStatus" :DataAction="filterBlock.node_name !=''" :SearchParams="filterBlock" @dataChange="changeEventStatus" @relation="changeRelationStatus" @nextData="showNextData"></event-detail>
    </Modal>
  </div>
</template>
<script>
import Ajax from "@/api/tools/customajax";
import { API_BASEURL, API_TIMEOUT } from "@/utils/config";
import eventDetail from "@/views/events/detail.vue";

export default {
  props:{
    refreshData:{
      type:String,
      default:""
    },
    changeData: {
      type: Object,
    }
  },
  watch:{
    'changeData.date': {
      handler(data) {
        if (this.changeData.type == 1 || this.changeData.type == 2) {
          this.handleAutoLoadData();
        }
      }
    }
  },

  data() {
    return {
      hasRelation:false,
      showVideoPlayer: false,
      selectedEvent:{},
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      drawerStatus: false,
      eventTotal: 0,
      eventsCorrent: "today",
      nodeList: [],
      videoList: [],
      nodeListFilter: [],
      videoListFilter: [],
      eventList: [],
      statusList: [],
      sectionList:[],
      filterBlock: {
        page: 1,
        length: 10,
        startTime: "",
        endTime: "",
        node_name: "",
        video_name: "",
        sectionId:'',
        event_type: "",
        event_status: "",
        alarm_status: "",
      },
      trafficEvent: {
        data_ignore: 0,
        data_error: 0,
        data_corrent: 0,
        data_count: 0
      },
      eventsColumns: [
        {
          type: "index",
          align: "center",
          width: 60,
          title: "序号"
        },
        {
          width: 180,
          title: "日期",
          key: "date"
        },
        {
          width: 180,
          title: "触发详细时间",
          key: "time",
          tooltip: true,
          ellipsis: true
        },
        {
          width: 150,
          title: "节点",
          key: "node_name"
        },
        {
          width: 150,
          title: "视频源",
          key: "video_name",
          tooltip: true,
          ellipsis: true
        },
        {
          title: "事件类型",
          key: "statement",
          tooltip: true,
          ellipsis: true
        },

        {
          width: 150,
          slot: "fliterStatus",
          title: "处理状态",
          key: "status"
        },
        {
          width: 200,
          title: "操作",
          slot: "action"
        }
      ],
      minEventsColumns: [
        {
          type: "index",
          align: "center",
          width: 60,
          title: "序号"
        },
        {
          title: "更新时间",
          key: "event_updatetime"
        },
        {
          title: "区域名称",
          width: 120,
          key: "area_name"
        },
        {
          title: "路段名称",
          key: "path_line_name"
        },
        {
          title: "事件类型",
          key: "statement",
          width: 120,
          slot: "statement"
        },
        {
          slot: "fliterStatus",
          title: "处理状态",
          width: 120,
          key: "status"
        },
        {
          slot: "videoBox",
          width: 120,
          title: "查看"
        }
      ],
      eventStatus: [],
      eventsData: [], //事件列表
      pathLineTimer: null,
      autoTimer: null,
      statisticParam: {
        startTime: this.dateTo("today", "YYYY-MM-DD HH:mm:ss"),
        endTime: this.dateTo("now", "YYYY-MM-DD HH:mm:ss")
      },
      queryEvtId: "",
      queryAuto: false
    };
  },
  components:{
    eventDetail
  },
  beforeDestroy() {
     if (this.pathLineTimer) {
            clearInterval(this.pathLineTimer);
            this.pathLineTimer = null;
        }
        if (this.autoTimer) {
            clearInterval(this.autoTimer);
            this.autoTimer = null;
        }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.area_pause_time_Text = "未暂停";
      this.video_pause_time_Text = "未中止";
    }
  },
  filters: {
    // 时间过滤
    selectTime(msg) {
      if (msg == "today") {
        return "今日";
      } else if (msg == "week") {
        return "近一周";
      } else if (msg == "month") {
        return "近一月";
      } else if (msg == "all") {
        return "全部";
      }
    },
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
    }
  },
  mounted() {
    this.initTrafficEvent(); //统计信息
    this.getEventList(); //获取事件
    this.nodeNameCombobox(); // 节点名称下拉列表
    this.queryHandleType(); //处理类型下拉列表
    this.videoCombobox(); //视频源下拉列表
    this.sectionCombobox();//区间源下拉列表
    this.eventCombobox(); // 事件类型下拉列表
    this.eventStatusCombobox(); // 事件起始状态下拉列表
    if (this.$route.query.evtId) {
      this.queryEvtId = this.$route.query.evtId;
      this.queryAuto = this.$route.query.auto;
      this.autoShowEvent();
    }
    // this.autoTimer = setInterval(() => {
    //         this.handleAutoLoadData();
    //     }, 10 * 1000);
  },
  computed: {
    filterBlockStartOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          if(date)
            return date.valueOf() > new Date(self.filterBlock.endTime);
        }
      };
      return options;
      this.statisticParam.startTime;
    },
    filterBlockEndOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          if(date)
            return date.valueOf() < new Date(self.$moment(self.filterBlock.startTime).format("YYYY-MM-DD 00:00:00"));
        }
      };
      return options;
    },
    // 当前选择事件
    trafficEventData() {
      return this.trafficEvent[this.eventsCorrent];
    }
  },
  methods: {
    exportEvents(){
      let filterParams = {
        startTime: this.filterBlock.startTime,
        endTime: this.filterBlock.endTime,
        node_name: this.filterBlock.node_name,
        video_name: this.filterBlock.video_name,
        event_type: this.filterBlock.event_type,
        event_status: this.filterBlock.event_status,
        alarm_status: this.filterBlock.alarm_status,
        sectionId: this.filterBlock.sectionId,
      }
      Ajax.post(API_BASEURL+"/downloadExcelDetectionReport?" + this.objToStr(filterParams)).then(response=>{
        if(response.status ==200){
          window.location.href = response.data.download_url
        }
      })
    },
    handleAutoLoadData() {
            this.getEventList();
            this.initTrafficEvent();
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
    objToStr(obj) {
      let paramArr = Object.keys(obj).reduce((acc, cur) => {
        if (obj[cur] !== "" && obj[cur] != undefined) acc.push(cur + "=" + obj[cur]);
        return acc;
      }, []);
      return paramArr.join("&");
    },
    // 时间格式化
    dateTo(d, formart) {
      let dataTime = "";
      let newDate = new Date();
      var nowDayOfWeek = newDate.getDay() - 1;
      if (nowDayOfWeek < 0) nowDayOfWeek = 6;
      switch (d) {
        case "now":
          dataTime = this.$moment().format(formart);
          break;
        case "3h":
          dataTime = this.$moment()
            .add(-3, "h")
            .format(formart);
          break;
        case "6h":
          dataTime = this.$moment()
            .add(-6, "h")
            .format(formart);
          break;
        case "today":
          dataTime = this.$moment().format("YYYY-MM-DD 00:00:00");
          break;
        case "week":
          // dataTime = this.$moment()
          //   .add(-nowDayOfWeek, "d")
          //   .format("YYYY-MM-DD 00:00:00");
          dataTime = this.$moment()
            .add(-7, "d")
            .format("YYYY-MM-DD 00:00:00");
          break;
        case "month":
          // dataTime = this.$moment().format("YYYY-MM-01 00:00:00");
          dataTime = this.$moment()
            .add(-1, "M")
            .format("YYYY-MM-DD 00:00:00");
          break;
      }
      return dataTime;
    },
    // 获取事件列表
    getEventList() {
      Ajax.post(
        API_BASEURL + "/getEventList?" + this.objToStr(this.filterBlock)
      ).then(response => {
        if (response.status == 200) {
          this.eventsData = response.data.Data.events;
          this.eventTotal = response.data.Data.pageCount;
        }
      });
    },
    handleShowVideo(item) {
      this.$set(this.popupPlayerOptions.sources, 0, {
        type: "video/mp4",
        src: item.video_addr
      });
      this.showVideoPlayer = true;
    },
    updateEventStatus(row, status) {
      Ajax.post(
        API_BASEURL +
          "/updateEventStatus?id=" +
          row.id +
          "&event_status=" +
          status
      ).then(response => {
        if (response.status == 200) {
          // let updateIndex = this.eventsData.findIndex(item => {
          //   return item.id == row.id;
          // });
          // if (updateIndex > -1) {
          //   let oldData = this.eventsData[updateIndex];
          //   oldData.status = status;
          //   oldData.update = false;
          //   this.$set(this.eventsData, updateIndex, oldData);
          // }
          this.initTrafficEvent();
          this.getEventList();
          this.$Message.success({
            content: "操作成功！"
          });
        }
      });
    },
    // 更新列表处理
    upEventStatus(row, status) {
      if (status == 4) {
        let updateIndex = this.eventsData.findIndex(item => {
          return item.id == row.id;
        });
        if (updateIndex > -1) {
          let oldData = this.eventsData[updateIndex];
          oldData.update = true;
          this.$set(this.eventsData, updateIndex, oldData);
        }
      }
      else this.updateEventStatus(row, status);
    },
    changeEventStatus(eventData){
      let updateIndex = this.eventsData.findIndex(item => {
        return item.id == eventData.id;
      });
      if (updateIndex > -1) {
        let oldData = this.eventsData[updateIndex];
        oldData.status = eventData.status;
        oldData.update = eventData.update;
        this.$set(this.eventsData, updateIndex, oldData);
      }
      this.getEventList();
      this.initTrafficEvent();
    },
    changeRelationStatus(val){
      this.hasRelation = val;
    },
    showNextData(data){
      this.selectedEvent = data;
    },
    // 修改统计周期
    changeEvensStatistics(v) {
      this.eventsCorrent = v;
      this.statisticParam.endTime = this.dateTo("now", "YYYY-MM-DD HH:mm:ss");
      switch (this.eventsCorrent) {
        case "today":
          this.statisticParam.startTime = this.dateTo(
            "today",
            "YYYY-MM-DD HH:mm:ss"
          );
          break;
        case "week":
          this.statisticParam.startTime = this.dateTo(
            "week",
            "YYYY-MM-DD HH:mm:ss"
          );
          break;
        case "month":
          this.statisticParam.startTime = this.dateTo(
            "month",
            "YYYY-MM-DD HH:mm:ss"
          );
          break;
        case "all":
          this.statisticParam.startTime = "";
          this.statisticParam.endTime = "";
          break;
      }
      this.initTrafficEvent();
    },
    // 初始化统计
    initTrafficEvent() {
      let self = this;
      Ajax.post(
        API_BASEURL + "/getDetectionClassStatistics?" + this.objToStr(this.statisticParam)
      ).then(response => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            let dataCount = 0;
            let dataHandled = 0;

            // 获取事件信息
            let dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == "上报总数";
            });
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex];
              dataCount = item.data_count;
            }
            dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == "已处理";
            });
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex];
              dataHandled = item.data_count;
            }
            this.trafficEvent.data_count = Number(dataCount - dataHandled);

            dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == "正报";
            });
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex];
              this.trafficEvent.data_corrent = item.data_count;
            }
            dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == "误报";
            });
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex];
              this.trafficEvent.data_error = item.data_count;
            }
            dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == "忽略";
            });
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex];
              this.trafficEvent.data_ignore = item.data_count;
            }
          }
        }
      });
    },
    queryEventsNode(item){
      if(item){
        let nodeIndex = this.nodeList.findIndex(node=>{return node.id == item;})
        if(nodeIndex > -1){
          this.filterBlock.node_name = encodeURIComponent(this.nodeList[nodeIndex].node_name);
        }
        this.queryEvents();
        this.videoListFilter = [];
        Ajax.post(API_BASEURL + "/getVideoNode?nodeId="+item).then(response => {
          if (response.status == 200) {
            let result = response.data.Data;
            if(result && result.video_id){
              let videoIndex = this.videoList.findIndex(node=>{return node.id == result.video_id;})
              if(videoIndex > -1){
                this.videoListFilter.push(this.videoList[videoIndex]);
              }
            }
          }
        });
      }
    },
    queryEventsChearNode(){
      this.filterBlock.node_name = "";
      this.videoListFilter = [];
      this.videoListFilter.push(...this.videoList);
      this.queryEvents();
    },
    queryEventsVideo(item){
      if(item){
        let videoIndex = this.videoList.findIndex(node=>{return node.id == item;})
        if(videoIndex > -1){
          this.filterBlock.video_name = encodeURIComponent(this.videoList[videoIndex].video_name);
        }
        this.queryEvents();
        this.nodeListFilter = [];
        Ajax.post(API_BASEURL + "/getVideoNode?videoId="+item).then(response => {
          if (response.status == 200) {
            let result = response.data.Data;
            if(result && result.node_id){
              let nodeIndex = this.nodeList.findIndex(node=>{return node.id == result.node_id;})
              if(nodeIndex > -1){
                this.nodeListFilter.push(this.nodeList[nodeIndex]);
              }
            }
          }
        });
      }
    },
    queryEventsChearVideo(){
      this.filterBlock.video_name = "";
      this.queryEvents();
      this.nodeListFilter = [];
      this.nodeListFilter.push(...this.nodeList);
    },
    // 公共筛选
    queryEvents() {
      this.filterBlock.page = 1;
      this.getEventList();
    },
    // 修改开始时间
    changeStartDate(d, o) {
      this.filterBlock.startTime = d;
      this.filterBlock.page = 1;
      this.getEventList();
    },
    // 修改结束时间
    changeEndDate(d, o) {
      this.filterBlock.endTime = d;
      this.filterBlock.page = 1;
      this.getEventList();
    },
    //  重置查询条件
    resetQuery() {
      this.filterBlock = {
        page: 1,
        length: 10,
        startTime: "",
        endTime: "",
        node_name: "",
        video_name: "",
        event_type: "",
        event_status: "",
        alarm_status: ""
      };
      this.videoListFilter = [];
      this.videoListFilter.push(...this.videoList);
      this.nodeListFilter = [];
      this.nodeListFilter.push(...this.nodeList);
      this.getEventList();
    },
    // 改变每页显示条数
    changePageSize(n) {
      this.filterBlock.length = n;
      this.getEventList();
    },
    // 分页
    changePage(n) {
      this.filterBlock.page = n;
      this.getEventList();
    },
    // 选择行
    selectEvent(row) {
      this.drawerStatus = true;
      this.selectedEvent = row;
      Ajax.post(API_BASEURL + "/viewDetectionEvent?id=" + row.id).then(
        response => {
          if (response.status == 200) {
            let relationData = [];
            response.data.Data.forEach(item => {
              if (item.is_main) {
              } else {
                relationData.push(item);
              }
            });
            this.drawerStatus = true;
            this.selectedEvent = row;
            this.hasRelation = relationData.length > 0;
          }
        }
      );
    },
    //根据id自动加载详情
    autoShowEvent() {
      this.drawerStatus = true;
      if (!this.queryEvtId) return;
      Ajax.post(API_BASEURL + "/viewDetectionEvent?id=" + this.queryEvtId).then(
        response => {
          if (response.status == 200) {
            this.relationData = [];

            response.data.Data.forEach(item => {
              if (item.is_main) {
                this.eventDetail = item;
                if (
                  this.eventDetail.area_pause_time ||
                  this.eventDetail.video_pause_time
                )
                  this.startTimer();
                this.$set(this.playerOptions.sources, 0, {
                  type: "video/mp4",
                  src: item.video_addr
                });
                if (this.queryAuto) this.playerOptions.autoplay = true;
              } else {
                this.relationData.push(item);
              }
            });
          }
        }
      );
    },
    //处理类型下拉列表
    queryHandleType() {
      Ajax.post(API_BASEURL + "/queryHandleType").then(response => {
        if (response.status == 200) {
          this.statusList = response.data.Data;
        }
      });
    },
    //视频源下拉列表
    videoCombobox() {
      this.videoListFilter = [];
      Ajax.post(API_BASEURL + "/videoCombobox").then(response => {
        if (response.status == 200) {
          this.videoList = response.data.Data;
          this.videoListFilter.push(...this.videoList)
        }
      });
    },
    //区间源下拉列表
    sectionCombobox() {
      Ajax.post(API_BASEURL + "/querySectionRoad").then(response => {
        if (response.status == 200) {
          this.sectionList = response.data.Data;
        }
      });
    },
    // 节点名称下拉列表
    nodeNameCombobox() {
      this.nodeListFilter = [];
      Ajax.post(API_BASEURL + "/nodeNameCombobox").then(response => {
        if (response.status == 200) {
          this.nodeList = response.data.Data;
          this.nodeListFilter.push(...this.nodeList)
        }
      });
    },
    // 事件类型下拉列表
    eventCombobox() {
      Ajax.post(API_BASEURL + "/eventCombobox").then(response => {
        if (response.status == 200) {
          this.eventList = response.data.Data;
        }
      });
    },
    eventStatusCombobox() {
      Ajax.post(API_BASEURL + "/getEventStatus").then(response => {
        if (response.status == 200) {
          this.eventStatus = response.data.Data;
        }
      });
    },
  }
};
</script>
