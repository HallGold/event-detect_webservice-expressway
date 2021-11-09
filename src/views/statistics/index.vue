<template>
  <div class="main">
    <div class="leftStatistics horn">
      <div class="hornMain">
        <div class="statisticsMain">
          <div class="tabToggle">
            <div
              @click="changeTab(0)"
              :class="['tabToggleItem', { activeTab: tabActive == 0 }]"
            >
              事件趋势分析
            </div>
            <div
              @click="changeTab(1)"
              :class="['tabToggleItem', { activeTab: tabActive == 1 }]"
            >
              事件排行分布
            </div>
          </div>
          <div class="statisticsItem" v-show="tabActive == 0">
            <div class="tabs">
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: statisticsCurrent == 'today' },
                ]"
                @click="changesStatisticsCurrent('today')"
                >今日</span
              >
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: statisticsCurrent == 'week' },
                ]"
                class="tabBlock"
                @click="changesStatisticsCurrent('week')"
                >近一周</span
              >
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: statisticsCurrent == 'month' },
                ]"
                class="tabBlock"
                @click="changesStatisticsCurrent('month')"
                >近一月</span
              >
              <span
                :class="[
                  'filterBlock',
                  { activeBlock: statisticsCurrent == 'customize' },
                ]"
                @click="changesStatisticsCurrent('customize')"
              >
                自定义<span class="down"></span>
                <div class="filters" @click.stop="" v-show="customizeTime">
                  <div class="dropDown">
                    <div class="filterItems">
                      开始时间:
                      <DatePicker
                        type="datetime"
                        :editable="false"
                        :options="statisticByTimeParamStartOptions"
                        v-model="statisticsByTimeParams.startTime"
                        placeholder="开始时间"
                        style="width: 180px"
                        :time-picker-options="{ steps: [1, 5, 5] }"
                        @on-change="changeStatisticsDateTime"
                      ></DatePicker>
                    </div>
                    <div class="filterItems">
                      结束时间:
                      <DatePicker
                        type="datetime"
                        :editable="false"
                        :options="statisticByTimeParamStartOptions"
                        v-model="statisticsByTimeParams.endTime"
                        placeholder="结束时间"
                        style="width: 180px"
                        :time-picker-options="{ steps: [1, 5, 5] }"
                        @on-change="changeStatisticsDateTime"
                      ></DatePicker>
                    </div>
                    <div class="filterItems">
                      时间刻度:
                      <Select
                        v-model="statisticsByTimeParams.timedensity"
                        style="width: 180px"
                        placeholder="时间刻度"
                        filterable
                        clearable
                        @on-change="changestatisticsParams"
                      >
                        <Option
                          v-for="(item, index) in timedensityList"
                          :value="item.value"
                          :key="index"
                          >{{ item.label }}</Option
                        >
                      </Select>
                    </div>
                  </div>
                </div>
              </span>
            </div>
            <div class="filterMin">
              <span class="inlineBlock">
                <Select
                  v-model="statisticsByTimeParams.videoId"
                  style="width: 120px"
                  placeholder="视频名称"
                  filterable
                  clearable
                  @on-change="changestatisticsParamsVideo"
                  @on-clear="chearstatisticsParamsVideo"
                >
                  <Option
                    v-for="(item, index) in videoListFilter"
                    :value="item.id"
                    :key="index"
                    >{{ item.video_name }}</Option
                  >
                </Select>
              </span>
              <span class="inlineBlock">
                <Select
                  v-model="statisticsByTimeParams.sectionId"
                  style="width: 120px"
                  placeholder="所属区间"
                  filterable
                  clearable
                  @on-change="changestatisticsParams"
                >
                  <Option
                    v-for="(item, index) in sectionList"
                    :value="item.sectionId"
                    :key="item.sectionId"
                    >{{ item.sectionName }}</Option
                  >
                </Select>
              </span>
              <span class="inlineBlock">
                <Select
                  v-model="statisticsByTimeParams.nodeId"
                  style="width: 120px"
                  placeholder="节点名称"
                  filterable
                  clearable
                  @on-change="changestatisticsParamsNode"
                  @on-clear="chearstatisticsParamsNode"
                >
                  <Option
                    v-for="(item, index) in nodeListFilter"
                    :value="item.id"
                    :key="index"
                    >{{ item.node_name }}</Option
                  >
                </Select>
              </span>
            </div>
            <div class="statisticsCharts" ref="statisticsCharts"></div>
            <div class="tabs">
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: typeCurrent == '上报总数' },
                ]"
                @click="changesTypeCurrent('上报总数')"
                >上报总数</span
              >
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: typeCurrent == '异常停车' },
                ]"
                class="tabBlock"
                @click="changesTypeCurrent('异常停车')"
                >异常停车</span
              >
              <span
                :class="['tabBlock', { activeBlock: typeCurrent == '拥堵' }]"
                class="tabBlock"
                @click="changesTypeCurrent('拥堵')"
                >拥堵</span
              >
              <span
                :class="['tabBlock', { activeBlock: typeCurrent == '行人' }]"
                class="tabBlock"
                @click="changesTypeCurrent('行人')"
                >行人</span
              >
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: typeCurrent == '非机动车' },
                ]"
                class="tabBlock"
                @click="changesTypeCurrent('非机动车')"
                >非机动车</span
              >
              <span
                :class="['tabBlock', { activeBlock: typeCurrent == '逆行' }]"
                class="tabBlock"
                @click="changesTypeCurrent('逆行')"
                >逆行</span
              >
              <span
                :class="['tabBlock', { activeBlock: typeCurrent == '抛洒物' }]"
                class="tabBlock"
                @click="changesTypeCurrent('抛洒物')"
                >抛洒物</span
              >
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: typeCurrent == '异常驶离' },
                ]"
                class="tabBlock"
                @click="changesTypeCurrent('异常驶离')"
                >异常驶离</span>
                <span
                :class="[
                  'tabBlock',
                  { activeBlock: typeCurrent == '烟雾' },
                ]"
                class="tabBlock"
                @click="changesTypeCurrent('烟雾')"
                >烟雾</span>
            </div>
          </div>
          <div class="statisticsItem" v-show="tabActive == 1">
            <div class="tabs">
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: statisticsCurrentRank == 'today' },
                ]"
                @click="changesStatisticsCurrentRank('today')"
                >今日</span
              >
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: statisticsCurrentRank == 'week' },
                ]"
                class="tabBlock"
                @click="changesStatisticsCurrentRank('week')"
                >近一周</span
              >
              <span
                :class="[
                  'tabBlock',
                  { activeBlock: statisticsCurrentRank == 'month' },
                ]"
                class="tabBlock"
                @click="changesStatisticsCurrentRank('month')"
                >近一月</span
              >
              <span
                :class="[
                  'filterBlock',
                  { activeBlock: statisticsCurrentRank == 'customize' },
                ]"
                @click="changesStatisticsCurrentRank('customize')"
              >
                自定义<span class="down"></span>
                <div class="filters" @click.stop="" v-show="customizeTimeRank">
                  <div class="dropDown">
                    <div class="filterItems">
                      开始时间:
                      <DatePicker
                        type="datetime"
                        :editable="false"
                        :options="statisticByTimeParamStartOptionsRank"
                        v-model="statisticsRankParams.startTime"
                        placeholder="开始时间"
                        style="width: 180px"
                        :time-picker-options="{ steps: [1, 5, 5] }"
                        @on-change="changestatisticsParamsRank"
                      ></DatePicker>
                    </div>
                    <div class="filterItems">
                      结束时间:
                      <DatePicker
                        type="datetime"
                        :editable="false"
                        :options="statisticByTimeParamStartOptionsRank"
                        v-model="statisticsRankParams.endTime"
                        placeholder="结束时间"
                        style="width: 180px"
                        :time-picker-options="{ steps: [1, 5, 5] }"
                        @on-change="changestatisticsParamsRank"
                      ></DatePicker>
                    </div>

                  </div>
                </div>
              </span>
            </div>
            <div class="filterMin">
              <span class="inlineBlock">
                <Select
                  v-model="statisticsRankParams.eventType"
                  style="width: 120px"
                  placeholder="事件类型"
                  filterable
                  clearable
                  @on-change="changestatisticsParamsRank"
                >
                  <Option
                    v-for="(item, index) in eventTypeList"
                    :value="item.event_type"
                    :key="item.event_type"
                    >{{ item.event_type_name }}</Option
                  >
                </Select>
              </span>
              <span class="inlineBlock">
                <Select
                  v-model="statisticsRankParams.eventStatus"
                  style="width: 120px"
                  placeholder="事件状态"
                  filterable
                  clearable
                  @on-change="changestatisticsParamsRank"
                >
                  <Option
                    v-for="(item, index) in eventStatusList"
                    :value="item.event_status"
                    :key="item.event_status"
                    >{{ item.event_status_name }}</Option
                  >
                </Select>
              </span>
            </div>
            <div class="flowSpeedRank">
              <div class="flowSpeedRankItem">
                <div class="flowSpeedRankTitle">
                  <span class="inlineBlock bigFont">节点事件排行</span>
                  <span
                    class="inlineBlock trend normalTrend"
                    @click="changeNodeRankSort"
                  >
                    <i
                      :class="[
                        'icons',
                        { up: nodeRankSort == 'up' },
                        { down: nodeRankSort == 'down' },
                      ]"
                    ></i>
                  </span>
                </div>
                <!-- <div class="flowSpeedIcon flowIcon"></div> -->
                <div
                  class="rankItem"
                  v-for="(item, index) in nodeRank"
                  :key="index"
                  style="margin-bottom:18px"
                >

                  <div class="rankNumber" style="padding-bottom:0">
                    <span class="inlineBlock bigFont blueFont">{{
                      parseInt(item.snum)
                    }}</span>
                    <!-- <span class="inlineBlock blueFont">辆/分钟</span> -->
                  </div>
                  <div>
                    <span class="inlineBlock lightFont minFont boldFont">{{
                      item.nodeName
                    }}</span>
                  </div>
                  <div class="processStatus" >
                    <div
                      class="flowProcess"
                      :style="
                        'width:' + scaleOfRank(item.snum, maxNodeRankValue) + '%'
                      "
                    ></div>
                  </div>
                  <!-- <div class="rankValue">
                    <span class="inlineBlock darkFont minFont">{{
                      item.parent_name
                    }}</span>
                  </div> -->
                </div>
              </div>
              <div class="flowSpeedRankItem">
                <div class="flowSpeedRankTitle">
                  <span class="inlineBlock bigFont">区间事件排行</span>
                  <span
                    class="inlineBlock trend normalTrend"
                    @click="changeSectionRankSort"
                  >
                    <i
                      :class="[
                        'icons',
                        { up: sectionRankSort == 'up' },
                        { down: sectionRankSort == 'down' },
                      ]"
                    ></i>
                  </span>
                </div>
                <!-- <div class="flowSpeedIcon speedIcon"></div> -->
                <div
                  class="rankItem"
                  v-for="(item, index) in sectionRank"
                  :key="index"
                    style="margin-bottom:18px"
                >

                  <div class="rankNumber" style="padding-bottom:0">
                    <span class="inlineBlock bigFont greenFont">{{
                      parseInt(item.snum)
                    }}</span>
                    <!-- <span class="inlineBlock greenFont">km/h</span> -->
                  </div>
                  <div>
                    <span class="inlineBlock lightFont boldFont minFont">{{
                      item.sectionName
                    }}</span>
                  </div>
                  <div class="processStatus">
                    <div
                      class="speedProcess"
                      :style="
                        'width:' +
                        Number(
                          Number(item.snum).toFixed(2) / maxSectionRankValue
                        ).toFixed(4) *
                          100 +
                        '%'
                      "
                    ></div>
                  </div>
                  <!-- <div class="rankValue">
                    <span class="inlineBlock darkFont minFont">{{
                      item.parent_name
                    }}</span>
                  </div> -->
                </div>
              </div>
              <div class="centerLine"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rightStatistics">
      <div class="overStatistics horn">
        <div class="hornMain">
          <div class="overStatisticsMain">
            <div class="partBlockTitle">
              <span class="partBlockTitleMain">事件总览</span>
            </div>
            <div class="tabs">
              <span
                :class="['tabBlock', { activeBlock: overViewDate == 'today' }]"
                @click="changeOverDate('today')"
                >今日</span
              >
              <span
                :class="['tabBlock', { activeBlock: overViewDate == 'week' }]"
                @click="changeOverDate('week')"
                >近一周</span
              >
              <span
                :class="['tabBlock', { activeBlock: overViewDate == 'month' }]"
                @click="changeOverDate('month')"
                >近一月</span
              >
              <span
                :class="['tabBlock', { activeBlock: overViewDate == 'all' }]"
                @click="changeOverDate('all')"
                >全部</span
              >
              <span
                :class="[
                  'filterBlock',
                  { activeBlock: overViewDate == 'customize' },
                ]"
                @click="changeOverDate('customize')"
              >
                自定义<span class="down"></span>
                <div class="filters" @click.stop="" v-show="customizeQuery">
                  <div class="dropDown">
                    <div class="filterItems">
                      开始时间:
                      <DatePicker
                        type="datetime"
                        :editable="false"
                        :options="statisticParamStartOptions"
                        v-model="statisticParam.startTime"
                        placeholder="开始时间"
                        style="width: 180px"
                        :time-picker-options="{ steps: [1, 5, 5] }"
                        @on-change="changeOverDateTime"
                      ></DatePicker>
                    </div>
                    <div class="filterItems">
                      结束时间:
                      <DatePicker
                        type="datetime"
                        :editable="false"
                        :options="statisticParamEndOptions"
                        v-model="statisticParam.endTime"
                        placeholder="结束时间"
                        style="width: 180px"
                        :time-picker-options="{ steps: [1, 5, 5] }"
                        @on-change="changeOverDateTime"
                      ></DatePicker>
                    </div>
                  </div>
                </div>
              </span>
            </div>
            <div class="overData">
              <div
                class="overDataItem"
                v-for="item in setOverViewDate"
                :key="item.status"
              >
                <div class="overDataItemMain">
                  <div class="overDataItemValue blueFont">
                    {{ item.statusCount }}
                  </div>
                  <div class="overDataItemText">
                    {{ item.status | setStatus }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="typesStatistics horn">
        <div class="hornMain">
          <div class="typesStatisticsMain">
            <div class="partBlockTitle">
              <span class="partBlockTitleMain">事件类别与状态统计</span>
            </div>
            <div class="filterBox mofilterPadding">
              <span class="inlineBlock">
                <DatePicker
                  type="datetime"
                  :options="statisticParamsStartOptions"
                  v-model="statisticsParams.startTime"
                  placeholder="开始时间"
                  style="width: 180px"
                  :editable="false"
                  @on-change="changeStartDate"
                ></DatePicker>
              </span>
              <span class="inlineBlock">
                <DatePicker
                  type="datetime"
                  :options="statisticParamsEndOptions"
                  v-model="statisticsParams.endTime"
                  placeholder="结束时间"
                  style="width: 180px"
                  :editable="false"
                  @on-change="changeEndDate"
                ></DatePicker>
              </span>

              <span class="inlineBlock">
                <Select
                  v-model="statisticsParams.sectionId"
                  style="width: 120px"
                  placeholder="所属区间"
                  filterable
                  clearable
                  @on-change="queryEvents"
                >
                  <Option
                    v-for="(item, index) in sectionList"
                    :value="item.sectionId"
                    :key="item.sectionId"
                    >{{ item.sectionName }}</Option
                  >
                </Select>
              </span>
              <span class="inlineBlock">
                <Select
                  v-model="statisticsParams.nodeId"
                  style="width: 150px"
                  filterable
                  placeholder="节点名称"
                  clearable
                  @on-change="queryEvents"
                >
                  <Option
                    v-for="(item, index) in nodeList"
                    :value="item.id"
                    :key="index"
                    >{{ item.node_name }}</Option
                  >
                </Select>
              </span>

              <span class="inlineBlock">
                <Select
                  v-model="statisticsParams.videoId"
                  style="width: 150px"
                  placeholder="视频名称"
                  filterable
                  clearable
                  @on-change="queryEvents"
                >
                  <Option
                    v-for="(item, index) in videoList"
                    :value="item.id"
                    :key="index"
                    >{{ item.video_name }}</Option
                  >
                </Select>
              </span>
              <span class="inlineBlock">
                <Button @click.native="resetQuery" type="primary">重置</Button>
              </span>
              <span class="inlineBlock">
                <Button @click.native="exportReport" type="success"
                  >导出统计报表</Button
                >
              </span>
            </div>
            <div class="table">
              <div class="borderTable">
                <table cellpadding="0" border="1" cellspacing="0" width="100%">
                  <tr class="header borderHeader">
                    <th rowspan="2">名称</th>
                    <th rowspan="2">全部事件</th>
                    <th colspan="3">异常停车</th>
                    <th colspan="3">拥堵</th>
                    <th rowspan="2">行人</th>
                    <th rowspan="2">非机动车</th>
                    <th rowspan="2">逆行</th>
                    <th rowspan="2">抛洒物</th>
                    <th rowspan="2">异常驶离</th>
                    <th rowspan="2">烟雾</th>
                  </tr>
                  <tr class="header borderHeader">
                    <th>停车开始</th>
                    <th>停车结束</th>
                    <th>停车总计</th>
                    <th>拥堵开始</th>
                    <th>拥堵结束</th>
                    <th>拥堵总计</th>
                  </tr>
                  <tr
                    class="td bordertd"
                    v-for="item in stypesStatusStatisticsData"
                    :key="item.detection_type"
                  >
                    <td>
                      {{
                        item.detection_type == "准确率"
                          ? "准确率(%)"
                          : item.detection_type
                      }}
                    </td>
                    <td>{{ item.data_count }}</td>
                    <td>{{ item.vehicle_stop_start }}</td>
                    <td>{{ item.vehicle_stop_end }}</td>
                    <td>{{ item.vehicle_stop }}</td>
                    <td>{{ item.traffic_jam_start }}</td>
                    <td>{{ item.traffic_jam_end }}</td>
                    <td>{{ item.traffic_jam }}</td>
                    <td>{{ item.person }}</td>
                    <td>{{ item.non_motorized_vehicle }}</td>
                    <td>{{ item.vehicle_retrograde }}</td>
                    <td>{{ item.abandoned_object }}</td>
                    <td>{{ item.bear_off }}</td>
                    <td>{{ item.smoke }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="downloadReport">
              <span
                class="reportBtn"
                v-show="isShowDownLoad"
                @click="downloadDetectionReport"
                >生成统计报告</span
              >
              <Button type="primary" v-show="isloadingReport" loading
                >正在生成统计报告</Button
              >
              <a
                class="reportBtn"
                v-show="!isShowDownLoad && !isloadingReport"
                :href="downloadUrl"
              >
                <i class="reportBtnIcon iconfont icon-xiazai"></i>下载统计报告
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "@antv/g2";
import Ajax from "@/api/tools/customajax";
import { API_BASEURL, API_TIMEOUT } from "@/utils/config";
export default {
  data() {
    return {
      tabActive: 0,
      customizeTime: false,
      customizeTimeRank: false,
      customizeQuery: false,
      typeCurrent: "上报总数",
      downloadUrl: "",
      isShowDownLoad: true,
      isloadingReport: false,
      stypesStatusStatisticsData: [],
      overViewDate: "today",
      statisticsCurrent: "today",
      statisticsCurrentRank: "today",
      nodeList: [],
      nodeListFilter: [],
      nodeListFilters: [],
      sectionList: [],
      videoList: [],
      videoListFilter: [],
      videoListFilters: [],
      timedensityList: [
        { label: "5分钟", value: 5 },
        { label: "10分钟", value: 10 },
        { label: "15分钟", value: 15 },
        { label: "30分钟", value: 30 },
        { label: "1小时", value: 60 },
        { label: "2小时", value: 60 * 2 },
        { label: "4小时", value: 60 * 4 },
        { label: "8小时", value: 60 * 8 },
        { label: "天", value: 60 * 24 },
      ],
      setOverViewDate: [],
      statisticsParams: {
        startTime: "",
        endTime: "",
        videoId: "",
        nodeId: "",
        sectionId: "",
      },
      statisticsByTimeParams: {
        startTime: "",
        endTime: "",
        videoId: "",
        nodeId: "",
        sectionId: "",
        timedensity: 60,
      },
      chartData: [],
      chartCtl: null,
      statisticParam: {
        startTime: this.dateTo("today", "YYYY-MM-DD HH:mm:ss"),
        endTime: this.dateTo("now", "YYYY-MM-DD HH:mm:ss"),
      },
      eventStatusList: [],
      eventTypeList: [],
      statisticsRankParams: {
        startTime: "",
        endTime: "",
        eventType: "",
        eventStatus: "",
      },
      nodeRank:[],
      nodeRankSort:'down',
      sectionRank:[],
      sectionRankSort:'down',
      maxNodeRankValue:0,
      maxSectionRankValue:0,
    };
  },
  mounted() {
    this.getStatusStatistics();
    this.videoCombobox();
    this.nodeNameCombobox();
    //this.statisticsByTimeParams.videoId="20200507164222C1688CA1416C422084";
    this.changesStatisticsCurrent("today");
    //this.statisticsByTime();
    this.overStatistics();
    this.sectionCombobox(); //区间源下拉列表
    this.getNodeEventRank(); //节点事件数量排名
    this.getSectionEventRank(); //区间事件数量排名
    this.getEventStatus();
    this.eventCombobox();
  },
  filters: {
    setStatus(d) {
      let iv = "";
      switch (d) {
        case "0":
          iv = "未处理";
          break;
        case "1":
          iv = "正报";
          break;
        case "2":
          iv = "误报";
          break;
        case "3":
          iv = "忽略";
          break;
          case "4":
          iv = "准确率";
          break;
      }
      return iv;
    },
  },
  computed: {
    paramTimeSpan() {
      let timeSpan = 0;
      if (
        this.statisticsByTimeParams.startTime &&
        this.statisticsByTimeParams.endTime
      ) {
        timeSpan =
          new Date(this.statisticsByTimeParams.endTime) -
          new Date(this.statisticsByTimeParams.startTime);
      }
      return timeSpan / 1000 / 60 / 60;
    },
    statisticByTimeParamStartOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return date.valueOf() > new Date(self.statisticsByTimeParams.endTime);
        },
      };
      return options;
    },
    statisticByTimeParamEndOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return (
            date.valueOf() <
            new Date(
              self
                .$moment(self.statisticsByTimeParams.startTime)
                .format("YYYY-MM-DD 00:00:00")
            )
          );
        },
      };
      return options;
    },
    statisticByTimeParamStartOptionsRank() {
      let self = this;
      let options = {
        disabledDate(date) {
          return date.valueOf() > new Date(self.statisticsRankParams.endTime);
        },
      };
      return options;
    },
    statisticByTimeParamEndOptionsRank() {
      let self = this;
      let options = {
        disabledDate(date) {
          return (
            date.valueOf() <
            new Date(
              self
                .$moment(self.statisticsRankParams.startTime)
                .format("YYYY-MM-DD 00:00:00")
            )
          );
        },
      };
      return options;
    },
    statisticParamStartOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return date.valueOf() > new Date(self.statisticParam.endTime);
        },
      };
      return options;
      //this.statisticParam.startTime;
    },
    statisticParamEndOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return (
            date.valueOf() <
            new Date(
              self
                .$moment(self.statisticParam.startTime)
                .format("YYYY-MM-DD 00:00:00")
            )
          );
        },
      };
      return options;
    },
    statisticParamsStartOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return date.valueOf() > new Date(self.statisticsParams.endTime);
        },
      };
      return options;
      //this.statisticParam.startTime;
    },
    statisticParamsEndOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return (
            date.valueOf() <
            new Date(
              self
                .$moment(self.statisticsParams.startTime)
                .format("YYYY-MM-DD 00:00:00")
            )
          );
        },
      };
      return options;
    },
  },
  methods: {
    changeNodeRankSort() {
      if (this.nodeRankSort == "up") {
        this.nodeRankSort = "down";
      } else {
        this.nodeRankSort = "up";
      }
      this.nodeRank = this.nodeRank.reverse();
    },
    changeSectionRankSort() {
      if (this.sectionRankSort == "up") {
        this.sectionRankSort = "down";
      } else {
        this.sectionRankSort = "up";
      }
      this.sectionRank = this.sectionRank.reverse();
    },

    changeTab(n) {
      this.tabActive = n;
    },
    objToStr(obj) {
      let paramArr = Object.keys(obj).reduce((acc, cur) => {
        if (obj[cur] !== "" && obj[cur] != undefined)
          acc.push(cur + "=" + obj[cur]);
        return acc;
      }, []);
      return paramArr.join("&");
    },
        scaleOfRank(val, maxVal) {
      let returnVal = 0;
      returnVal = Number(Number(val).toFixed(2) / maxVal).toFixed(4) * 100;
      return returnVal;
    },

    //节点事件数量排名
    getNodeEventRank() {
      if (!this.statisticsRankParams.startTime) {
        this.statisticsRankParams.startTime = this.$moment(new Date()).format(
          "YYYY-MM-DD 00:00:00"
        );
      }
      if (!this.statisticsRankParams.endTime) {
        this.statisticsRankParams.endTime = this.$moment(new Date()).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }

      if (this.statisticsRankParams.startTime)
        this.statisticsRankParams.startTime = this.$moment(
          this.statisticsRankParams.startTime
        ).format("YYYY-MM-DD HH:mm:ss");
      if (this.statisticsRankParams.endTime)
        this.statisticsRankParams.endTime = this.$moment(
          this.statisticsRankParams.endTime
        ).format("YYYY-MM-DD HH:mm:ss");

      Ajax.get(
        API_BASEURL +
          "/getNodeEventRank?" +
          this.objToStr(this.statisticsRankParams)
      ).then((response) => {
        if (response.status == 200) {
          // window.location.href = response.data.download_url;
          this.nodeRank = response.data.Data.slice(0,6)
          let rankList = this.nodeRank.map(item => {
            return item.snum;
          });
          if (rankList && rankList.length > 0)
            this.maxNodeRankValue = Math.max(...rankList).toFixed(2);
        }
      });
    },
    //区间事件数量排名
    getSectionEventRank() {
      Ajax.get(
        API_BASEURL +
          "/getSectionEventRank?" +
          this.objToStr(this.statisticsRankParams)
      ).then((response) => {
        if (response.status == 200) {
          this.sectionRank = response.data.Data.slice(0,6)
                    let rankList = this.sectionRank.map(item => {
            return item.snum;
          });
          if (rankList && rankList.length > 0)
            this.maxSectionRankValue = Math.max(...rankList).toFixed(2);

          // window.location.href = response.data.download_url;
        }
      });
    },
    getEventStatus() {
      Ajax.post(API_BASEURL + "/getEventStatus").then((response) => {
        if (response.status == 200) {
          this.eventStatusList = response.data.Data;
        }
      });
    },
    eventCombobox() {
      Ajax.post(API_BASEURL + "/eventCombobox").then((response) => {
        if (response.status == 200) {
          this.eventTypeList = response.data.Data;
        }
      });
    },
    exportReport() {
      let filterParams = {
        startTime: this.statisticsParams.startTime,
        endTime: this.statisticsParams.endTime,
        videoId: this.statisticsParams.videoId,
        nodeId: this.statisticsParams.nodeId,
        sectionId: this.statisticsParams.sectionId,
      };
      Ajax.post(
        API_BASEURL + "/downloadExcelStatistics?" + this.objToStr(filterParams)
      ).then((response) => {
        if (response.status == 200) {
          window.location.href = response.data.download_url;
        }
      });
    },
    //区间源下拉列表
    sectionCombobox() {
      Ajax.post(API_BASEURL + "/querySectionRoad").then((response) => {
        if (response.status == 200) {
          this.sectionList = response.data.Data;
        }
      });
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
          dataTime = this.$moment().add(-3, "h").format(formart);
          break;
        case "6h":
          dataTime = this.$moment().add(-6, "h").format(formart);
          break;
        case "today":
          dataTime = this.$moment().format("YYYY-MM-DD 00:00:00");
          break;
        case "week":
          dataTime = this.$moment().add(-7, "d").format("YYYY-MM-DD 00:00:00");
          break;
        case "month":
          dataTime = this.$moment().add(-1, "M").format("YYYY-MM-DD 00:00:00");
          break;
      }
      return dataTime;
    },
    changesTypeCurrent(val) {
      this.typeCurrent = val;
      this.updateCharts();
    },
    updateCharts() {
      let self = this;
      if (self.chartCtl) {
        let data = self.chartData.filter((item) => {
          return item.category == self.typeCurrent;
        });
        self.chartCtl.changeData(data);
      }
    },
    creatCharts(init) {
      let self = this;
      if (self.chartCtl) {
        self.chartCtl.destroy();
      }
      let chart = new Chart({
        container: this.$refs.statisticsCharts,
        autoFit: true,
        height: 160,
        padding: [20, 20, 100, 50],
      });
      this.chartCtl = chart;
      let data = self.chartData.filter((item) => {
        return item.category == self.typeCurrent;
      });
      chart.data(data);
      chart.scale({
        name: {
          range: [0, 1],
        },
        num: {
          nice: true,
        },
      });
      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });
      chart.axis("name", {
        label: {
          style: { fill: "#fff" },
        },
      });
      chart.axis("num", {
        label: {
          style: { fill: "#fff" },
          formatter: (val) => {
            return val + " 次";
          },
        },
      });
      chart
        .line()
        .position("name*num")
        .size(6)
        .tooltip("tooltip*type*num", function (tooltip, type, num) {
          return {
            title: tooltip,
            name: type,
            value: num,
          };
        })
        .color("type", ["#00ffa8", "#d84646", "#ffd84e", "#00fcff"])
        .shape("smooth");

      chart
        .point()
        .position("name*num")
        .color("type", ["#00ffa8", "#d84646", "#ffd84e", "#00fcff"])
        .tooltip("tooltip*type*num", function (tooltip, type, num) {
          return {
            title: tooltip,
            name: type,
            value: num,
          };
        })
        .shape("circle");
      chart.legend("type", { itemName: { style: { fill: "#00fcff" } } });
      //chart.removeInteraction('legend-filter');
      // //chart.interaction('legend-highlight');
      // chart.interaction('legend-filter',{
      //   showEnable: [
      //     { trigger: 'legend-item:mouseenter', action: 'cursor:pointer' },
      //     { trigger: 'legend-item:mouseleave', action: 'cursor:default' },
      //   ],
      //   start: [
      //     { trigger: 'legend-item:click', action: 'list-highlight:highlight' },
      //     { trigger: 'legend-item:click', action: 'element-highlight:highlight' },
      //   ],
      // });
      chart.render();
    },
    //视频源下拉列表
    videoCombobox() {
      this.videoListFilter = [];
      this.videoListFilters = [];
      Ajax.post(API_BASEURL + "/videoCombobox").then((response) => {
        if (response.status == 200) {
          this.videoList = response.data.Data;
          this.videoListFilter.push(...this.videoList);
          this.videoListFilters.push(...this.videoList);
        }
      });
    },
    // 节点名称下拉列表
    nodeNameCombobox() {
      this.nodeListFilter = [];
      this.nodeListFilters = [];
      Ajax.post(API_BASEURL + "/nodeNameCombobox").then((response) => {
        if (response.status == 200) {
          this.nodeList = response.data.Data;
          this.nodeListFilter.push(...this.nodeList);
          this.nodeListFilters.push(...this.nodeList);
        }
      });
    },
    // 获取总览统计数据
    overStatistics() {
      if (this.statisticParam.startTime)
        this.statisticParam.startTime = this.$moment(
          this.statisticParam.startTime
        ).format("YYYY-MM-DD HH:mm:ss");
      if (this.statisticParam.endTime)
        this.statisticParam.endTime = this.$moment(
          this.statisticParam.endTime
        ).format("YYYY-MM-DD HH:mm:ss");
      Ajax.post(
        API_BASEURL +
          "/getDetectionCountByTime?" +
          this.objToStr(this.statisticParam)
      ).then((response) => {
        if (response.status == 200) {
          this.setOverViewDate = response.data.Data;
        }
      });
    },
    // 获取统计数据
    getStatusStatistics() {
      if (this.statisticsParams.startTime)
        this.statisticsParams.startTime = this.$moment(
          this.statisticsParams.startTime
        ).format("YYYY-MM-DD HH:mm:ss");
      if (this.statisticsParams.endTime)
        this.statisticsParams.endTime = this.$moment(
          this.statisticsParams.endTime
        ).format("YYYY-MM-DD HH:mm:ss");
      Ajax.post(
        API_BASEURL +
          "/getDetectionClassStatistics?" +
          this.objToStr(this.statisticsParams)
      ).then((response) => {
        if (response.status == 200) {
          this.stypesStatusStatisticsData = response.data.Data;
        }
      });
    },
    // 下载PDF检测报告
    downloadDetectionReport() {
      this.isloadingReport = true;
      this.isShowDownLoad = false;
      Ajax.post(
        API_BASEURL +
          "/downloadDetectionReport?" +
          this.objToStr(this.statisticsParams)
      ).then((response) => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            this.$Message.success({
              duration: 5,
              content: "已生成报告",
            });
            this.isloadingReport = false;
            this.downloadUrl = response.data.download_url;
          } else {
            this.$Message.error({
              content: response.data.Msg,
            });
            this.isloadingReport = false;
            this.isShowDownLoad = true;
          }
        }
      });
    },
    changeOverDateTime() {
      this.isShowDownLoad = true;
    },
    changeOverDate(d) {
      this.overViewDate = d;
      this.statisticParam.endTime = this.dateTo("now", "YYYY-MM-DD HH:mm:ss");
      switch (this.overViewDate) {
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
      if (this.overViewDate != "customize") {
        this.customizeQuery = false;
        this.isShowDownLoad = true;
      } else this.customizeQuery = !this.customizeQuery;
      this.overStatistics();
    },
    changeStatisticsDateTime() {
      this.statisticsByTime();
    },
    // 事件趋势分析-事件改编
    changesStatisticsCurrent(d) {
      this.statisticsCurrent = d;
      this.statisticsByTimeParams.endTime = this.dateTo(
        "now",
        "YYYY-MM-DD HH:mm:ss"
      );
      switch (d) {
        case "today":
          this.statisticsByTimeParams.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.statisticsByTimeParams.timedensity = 60;
          break;
        case "week":
          this.statisticsByTimeParams.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.statisticsByTimeParams.timedensity = 60 * 24;
          break;

        case "month":
          this.statisticsByTimeParams.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.statisticsByTimeParams.timedensity = 60 * 24;
          break;
        // default:
        //   this.statisticsByTimeParams.timedensity = 60*24;
        //   break;
      }
      if (this.statisticsCurrent != "customize") {
        this.customizeTime = false;
        this.statisticsByTime();
      } else this.customizeTime = !this.customizeTime;
    },
    changesStatisticsCurrentRank(d) {
      this.statisticsCurrentRank = d;
      this.statisticsRankParams.endTime = this.dateTo(
        "now",
        "YYYY-MM-DD HH:mm:ss"
      );
      switch (d) {
        case "today":
          this.statisticsRankParams.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.statisticsRankParams.timedensity = 60;
          break;
        case "week":
          this.statisticsRankParams.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.statisticsRankParams.timedensity = 60 * 24;
          break;

        case "month":
          this.statisticsRankParams.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.statisticsRankParams.timedensity = 60 * 24;
          break;
        // default:
        //   this.statisticsByTimeParams.timedensity = 60*24;
        //   break;
      }
      if (this.statisticsCurrentRank != "customize") {
        this.customizeTimeRank = false;
        // this.statisticsByTime();
        this.getNodeEventRank(); //节点事件数量排名
        this.getSectionEventRank(); //区间事件数量排名
      } else this.customizeTimeRank = !this.customizeTimeRank;
    },
    // 修改开始时间-事件类别与状态统计
    changeStartDate(d, o) {
      this.statisticsParams.startTime = d;
      this.getStatusStatistics();

      this.isShowDownLoad = true;
    },
    // 修改结束时间-事件类别与状态统计
    changeEndDate(d, o) {
      this.statisticsParams.endTime = d;
      this.getStatusStatistics();

      this.isShowDownLoad = true;
    },
    //  重置查询条件
    resetQuery() {
      this.statisticsParams = {
        startTime: "",
        endTime: "",
        videoId: "",
        nodeId: "",
        sectionId: "",
      };
      this.videoListFilters = [];
      this.nodeListFilters = [];
      this.videoListFilters.push(...this.videoList);
      this.nodeListFilters.push(...this.nodeList);
      this.getStatusStatistics();

      this.isShowDownLoad = true;
    },
    queryEventsNode(item) {
      if (item) {
        this.queryEvents();
        this.videoListFilters = [];
        Ajax.post(API_BASEURL + "/getVideoNode?nodeId=" + item).then(
          (response) => {
            if (response.status == 200) {
              let result = response.data.Data;
              if (result && result.videoId) {
                let videoIndex = this.videoList.findIndex((node) => {
                  return node.id == result.videoId;
                });
                if (videoIndex > -1) {
                  this.videoListFilters.push(this.videoList[videoIndex]);
                }
              }
            }
          }
        );
      }
    },
    queryEventsClearNode() {
      this.statisticsParams.nodeId = "";
      this.videoListFilters = [];
      this.videoListFilters.push(...this.videoList);
      this.queryEvents();
    },
    queryEventsVideo(item) {
      if (item) {
        this.queryEvents();
        this.nodeListFilters = [];
        Ajax.post(API_BASEURL + "/getVideoNode?videoId=" + item).then(
          (response) => {
            if (response.status == 200) {
              let result = response.data.Data;
              if (result && result.nodeId) {
                let nodeIndex = this.nodeList.findIndex((node) => {
                  return node.id == result.nodeId;
                });
                if (nodeIndex > -1) {
                  this.nodeListFilters.push(this.nodeList[nodeIndex]);
                }
              }
            }
          }
        );
      }
    },
    queryEventsChearVideo() {
      this.statisticsParams.videoId = "";
      this.nodeListFilters = [];
      this.nodeListFilters.push(...this.nodeList);
      this.queryEvents();
    },
    // 公共筛选
    queryEvents() {
      this.getStatusStatistics();
      this.isloadingReport = false;
      this.isShowDownLoad = true;
    },
    formatWeekTitle(weekNum) {
      let title = "";
      switch (weekNum) {
        case 1:
          title = "星期一";
          break;
        case 2:
          title = "星期二";
          break;
        case 3:
          title = "星期三";
          break;
        case 4:
          title = "星期四";
          break;
        case 5:
          title = "星期五";
          break;
        case 6:
          title = "星期六";
          break;
        case 0:
          title = "星期日";
          break;
      }
      return title;
    },
    formatChartTitle(startTime) {
      let title = "";
      //debugger
      let timeSpan = this.paramTimeSpan;
      switch (this.statisticsByTimeParams.timedensity) {
        case 5:
        case 10:
        case 15:
        case 30:
        case 60:
        case 60 * 2:
        case 60 * 4:
        case 60 * 8:
          if (timeSpan < 24) title = this.$moment(startTime).format("HH:mm");
          else title = this.$moment(startTime).format("MM.DD HH:mm");
          break;

        default:
          title = this.$moment(startTime).format("MM.DD");
          break;
      }

      // switch(this.statisticsCurrent){
      //   case "today":
      //     title = this.$moment(startTime).format("HH:mm");
      //     break;
      //   case "week":
      //     let newDate = new Date(startTime);
      //     var nowDayOfWeek = newDate.getDay();
      //     title = this.formatWeekTitle(nowDayOfWeek);
      //     break;
      //   case "month":
      //     title = this.$moment(startTime).format("MM.DD");
      //     break;

      //   default:
      //     title = this.$moment(startTime).format("MM.DD");
      //     break;
      // }
      return title;
    },
    formatChartTooltip(startTime) {
      let title = "";
      // debugger
      switch (this.statisticsByTimeParams.timedensity) {
        case 5:
        case 10:
        case 15:
        case 30:
        case 60 * 2:
        case 60 * 4:
        case 60 * 8:
          title = this.$moment(startTime).format("YYYY-MM-DD HH:mm");
          break;

        default:
          title = this.$moment(startTime).format("YYYY-MM-DD");
          break;
      }
      return title;
    },
    // 事件趋势分析
    statisticsByTime() {
      // if(!this.statisticsByTimeParams.videoId && !this.statisticsByTimeParams.nodeId)
      //   return;

      if (this.statisticsByTimeParams.startTime)
        this.statisticsByTimeParams.startTime = this.$moment(
          this.statisticsByTimeParams.startTime
        ).format("YYYY-MM-DD HH:mm:ss");
      if (this.statisticsByTimeParams.endTime)
        this.statisticsByTimeParams.endTime = this.$moment(
          this.statisticsByTimeParams.endTime
        ).format("YYYY-MM-DD HH:mm:ss");
      this.chartData = [];
      Ajax.post(
        API_BASEURL +
          "/getDetectionTrend?" +
          this.objToStr(this.statisticsByTimeParams)
      ).then((response) => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            let searchData = response.data.Data;
            searchData.forEach((item) => {
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "上报总数",
                category: "上报总数",
                num: Number(item.data_count),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "异常停车(总数)",
                category: "异常停车",
                num: Number(item.vehicle_stop),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "异常停车(开始)",
                category: "异常停车",
                num: Number(item.vehicle_stop_start),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "异常停车(结束)",
                category: "异常停车",
                num: Number(item.vehicle_stop_end),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "拥堵(总数)",
                category: "拥堵",
                num: Number(item.traffic_jam),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "拥堵(开始)",
                category: "拥堵",
                num: Number(item.traffic_jam_start),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "拥堵(结束)",
                category: "拥堵",
                num: Number(item.traffic_jam_end),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "行人",
                category: "行人",
                num: Number(item.person),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "非机动车",
                category: "非机动车",
                num: Number(item.non_motorized_vehicle),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "逆行",
                category: "逆行",
                num: Number(item.vehicle_retrograde),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "抛洒物",
                category: "抛洒物",
                num: Number(item.abandoned_object),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "异常驶离",
                category: "异常驶离",
                num: Number(item.bear_off),
              });
              this.chartData.push({
                name: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                type: "烟雾",
                category: "烟雾",
                num: Number(item.smoke),
              });
            });
            this.creatCharts(true);
          } else {
            this.$Message.error({
              content: response.data.Msg,
            });
          }
        }
      });
    },
    // 事件趋势分析-视频切换
    changestatisticsParamsVideo(item) {
      if (item) {
        this.statisticsByTime();
        this.nodeListFilter = [];
        Ajax.post(API_BASEURL + "/getVideoNode?videoId=" + item).then(
          (response) => {
            if (response.status == 200) {
              let result = response.data.Data;
              if (result && result.nodeId) {
                let nodeIndex = this.nodeList.findIndex((node) => {
                  return node.id == result.nodeId;
                });
                if (nodeIndex > -1) {
                  this.nodeListFilter.push(this.nodeList[nodeIndex]);
                }
              }
            }
          }
        );
      }
    },
    chearstatisticsParamsVideo() {
      this.statisticsByTimeParams.videoId = "";
      this.nodeListFilter = [];
      this.nodeListFilter.push(...this.nodeList);
      this.statisticsByTime();
    },
    changestatisticsParamsNode(item) {
      if (item) {
        this.statisticsByTime();
        this.videoListFilter = [];
        Ajax.post(API_BASEURL + "/getVideoNode?nodeId=" + item).then(
          (response) => {
            if (response.status == 200) {
              let result = response.data.Data;
              if (result && result.videoId) {
                let videoIndex = this.videoList.findIndex((node) => {
                  return node.id == result.videoId;
                });
                if (videoIndex > -1) {
                  this.videoListFilter.push(this.videoList[videoIndex]);
                }
              }
            }
          }
        );
      }
    },
    chearstatisticsParamsNode() {
      this.statisticsByTimeParams.nodeId = "";
      this.videoListFilter = [];
      this.videoListFilter.push(...this.videoList);
      this.statisticsByTime();
    },
    changestatisticsParams() {
      //  重新加载数据
      this.statisticsByTime();
    },
    changestatisticsParamsRank() {
      this.getNodeEventRank(); //节点事件数量排名
      this.getSectionEventRank(); //区间事件数量排名
    },
  },
};
</script>
