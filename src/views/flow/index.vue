<template>
  <div class="main">
    <!-- 节点拓扑图 -->
    <div class="nodePath" ref="nodePath"></div>
    <div class="sectionBox">
      <div class="filterTopoText">区间：</div>
      <div
        :class="[
          'filterTopoItem',
          { filterTopoItemActive: selectStation == index + 1 },
        ]"
        @click="changeStation(item, index)"
        v-for="(item, index) in stationList"
        :key="item.sectionId"
      >
        {{ item.sectionName }}
      </div>
    </div>
    <!-- 右侧信息 -->
    <div class="rightInfo">
      <!-- 流量流速默认 -->
      <div class="defaultStatistics">
        <!-- 全路段总览 -->
        <div class="overViewFlowSpeed horn transparentBg">
          <div class="hornMain">
            <div class="partBlockTitle">
              <span class="partBlockTitleMain">全路段交通参数总览</span>
            </div>
            <div class="flowSpeedFlexInfo">
              <div class="table table180">
                <table cellpadding="0" cellspacing="0" border="1" width="100%">
                  <tr class="header">
                    <th width="60">序号</th>
                    <th>高速路名称</th>
                    <th>当前平均流量</th>
                    <th>当前平均流速</th>
                  </tr>
                  <tr
                    class="td"
                    v-for="(item, index) in overViewData"
                    :key="index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.path_line_name }}</td>
                    <td>{{ item.flow }} 辆/分</td>
                    <td>{{ item.speed }} km/h</td>
                  </tr>
                </table>
              </div>
              <!-- <div class="flowSpeedFlexMain" v-for="item in overViewData" :key="item.id">
                <div class="flowSpeedFlexInfoItem">
                  <div class="flowSpeedFlexBlock paddingBottom18">
                    <span class="inlineBlock largeFont blueFont">{{item.speed}}</span>
                    <span class="inlineBlock init blueFont">km/h</span>
                  </div>
                  <div class="flowSpeedFlexBlock">
                    <span class="inlineBlock grayFont">{{item.path_line_name}}流速</span>
                  </div>
                </div>
                <div class="flowSpeedFlexInfoItem">
                  <div class="flowSpeedFlexBlock paddingBottom18">
                    <span class="inlineBlock largeFont greenFont">{{item.flow}}</span>
                    <span class="inlineBlock init blueFont">辆</span>
                  </div>
                  <div class="flowSpeedFlexBlock">
                    <span class="inlineBlock grayFont">{{item.path_line_name}}流量</span>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <!-- 流量流速态势 -->
        <div class="flowSpeedAnalysis transparentBg horn">
          <div class="hornMain">
            <div
              :class="[
                'flowSpeedAnalysisMain',
                { animationOpacity: showOverall && !showSection },
              ]"
              v-show="showOverall && !showSection"
            >
              <div class="tabToggle">
                <div
                  @click="changeTab(0)"
                  :class="['tabToggleItem', { activeTab: tabActive == 0 }]"
                >
                  路段分析
                </div>
                <div
                  @click="changeTab(1)"
                  :class="['tabToggleItem', { activeTab: tabActive == 1 }]"
                >
                  区间分析
                </div>
              </div>
              <div v-show="tabActive == 0">
                <div class="tabs paddingBottom24">
                  <span
                    :class="[
                      'tabBlock',
                      { activeBlock: statisticsCurrent == '3h' },
                    ]"
                    @click="changesStatisticsCurrent('3h')"
                    >近3小时</span
                  >
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
                    <div
                      class="filters"
                      @click.stop=""
                      v-show="customizeRankQuery"
                    >
                      <div class="dropDown">
                        <div class="filterItems">
                          开始时间:
                          <DatePicker
                            type="datetime"
                            :editable="false"
                            :options="rankParamStartOptions"
                            v-model="rankParam.startTime"
                            placeholder="开始时间"
                            style="width: 180px"
                            :time-picker-options="{ steps: [1, 5, 5] }"
                            @on-change="changeHistoryRankParam"
                          ></DatePicker>
                        </div>
                        <div class="filterItems">
                          结束时间:
                          <DatePicker
                            type="datetime"
                            :editable="false"
                            :options="rankParamEndOptions"
                            v-model="rankParam.endTime"
                            placeholder="结束时间"
                            style="width: 180px"
                            :time-picker-options="{ steps: [1, 5, 5] }"
                            @on-change="changeHistoryRankParam"
                          ></DatePicker>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
                <div class="flowSpeedRank">
                  <div class="flowSpeedRankItem">
                    <div class="flowSpeedRankTitle">
                      <span class="inlineBlock bigFont">流量排行</span>
                      <span
                        class="inlineBlock trend normalTrend"
                        @click="changeFlowRankSort"
                      >
                        <i
                          :class="[
                            'icons',
                            { up: flowRankSort == 'up' },
                            { down: flowRankSort == 'down' },
                          ]"
                        ></i>
                      </span>
                    </div>
                    <div class="flowSpeedIcon flowIcon"></div>
                    <div
                      class="rankItem"
                      v-for="(item, index) in flowRank"
                      :key="index"
                    >
                      <div class="rankNumber">
                        <span class="inlineBlock bigFont blueFont">{{
                          parseInt(item.flow)
                        }}</span>
                        <span class="inlineBlock blueFont">辆/分钟</span>
                      </div>
                      <div class="processStatus">
                        <div
                          class="flowProcess"
                          :style="
                            'width:' +
                            scaleOfRank(item.flow, maxFlowValue) +
                            '%'
                          "
                        ></div>
                      </div>
                      <div>
                        <span class="inlineBlock lightFont minFont boldFont">{{
                          item.path_line_name
                        }}</span>
                      </div>
                      <div class="rankValue">
                        <span class="inlineBlock darkFont minFont">{{
                          item.parent_name
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flowSpeedRankItem">
                    <div class="flowSpeedRankTitle">
                      <span class="inlineBlock bigFont">流速排行</span>
                      <span
                        class="inlineBlock trend normalTrend"
                        @click="changeSpeedRankSort"
                      >
                        <i
                          :class="[
                            'icons',
                            { up: speedRankSort == 'up' },
                            { down: speedRankSort == 'down' },
                          ]"
                        ></i>
                      </span>
                    </div>
                    <div class="flowSpeedIcon speedIcon"></div>
                    <div
                      class="rankItem"
                      v-for="(item, index) in speedRank"
                      :key="index"
                    >
                      <div class="rankNumber">
                        <span class="inlineBlock bigFont greenFont">{{
                          parseInt(item.speed)
                        }}</span>
                        <span class="inlineBlock greenFont">km/h</span>
                      </div>
                      <div class="processStatus">
                        <div
                          class="speedProcess"
                          :style="
                            'width:' +
                            Number(
                              Number(item.speed).toFixed(2) / maxSpeedValue
                            ).toFixed(4) *
                              100 +
                            '%'
                          "
                        ></div>
                      </div>
                      <div>
                        <span class="inlineBlock lightFont boldFont minFont">{{
                          item.path_line_name
                        }}</span>
                      </div>
                      <div class="rankValue">
                        <span class="inlineBlock darkFont minFont">{{
                          item.parent_name
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="centerLine"></div>
                </div>
              </div>
              <div v-show="tabActive == 1">
                <div class="tabs paddingBottom24">
                  <span
                    :class="[
                      'tabBlock',
                      { activeBlock: statisticsCurrentSection == '3h' },
                    ]"
                    @click="changesStatisticsCurrentSection('3h')"
                    >近3小时</span
                  >
                  <span
                    :class="[
                      'tabBlock',
                      { activeBlock: statisticsCurrentSection == 'today' },
                    ]"
                    @click="changesStatisticsCurrentSection('today')"
                    >今日</span
                  >
                  <span
                    :class="[
                      'tabBlock',
                      { activeBlock: statisticsCurrentSection == 'week' },
                    ]"
                    class="tabBlock"
                    @click="changesStatisticsCurrentSection('week')"
                    >近一周</span
                  >
                  <span
                    :class="[
                      'tabBlock',
                      { activeBlock: statisticsCurrentSection == 'month' },
                    ]"
                    class="tabBlock"
                    @click="changesStatisticsCurrentSection('month')"
                    >近一月</span
                  >
                  <span
                    :class="[
                      'filterBlock',
                      { activeBlock: statisticsCurrentSection == 'customize' },
                    ]"
                    @click="changesStatisticsCurrentSection('customize')"
                  >
                    自定义<span class="down"></span>
                    <div
                      class="filters"
                      @click.stop=""
                      v-show="customizeRankQuerySection"
                    >
                      <div class="dropDown">
                        <div class="filterItems">
                          开始时间:
                          <DatePicker
                            type="datetime"
                            :editable="false"
                            :options="rankParamStartOptionsSection"
                            v-model="rankParamSection.startTime"
                            placeholder="开始时间"
                            style="width: 180px"
                            :time-picker-options="{ steps: [1, 5, 5] }"
                            @on-change="changeHistoryRankParamSection"
                          ></DatePicker>
                        </div>
                        <div class="filterItems">
                          结束时间:
                          <DatePicker
                            type="datetime"
                            :editable="false"
                            :options="rankParamEndOptionsSection"
                            v-model="rankParamSection.endTime"
                            placeholder="结束时间"
                            style="width: 180px"
                            :time-picker-options="{ steps: [1, 5, 5] }"
                            @on-change="changeHistoryRankParamSection"
                          ></DatePicker>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
                <div class="flowSpeedRank">
                  <div class="flowSpeedRankItem">
                    <div class="flowSpeedRankTitle">
                      <span class="inlineBlock bigFont">流量排行</span>
                      <span
                        class="inlineBlock trend normalTrend"
                        @click="changeFlowRankSortSection"
                      >
                        <i
                          :class="[
                            'icons',
                            { up: flowRankSortSection == 'up' },
                            { down: flowRankSortSection == 'down' },
                          ]"
                        ></i>
                      </span>
                    </div>
                    <div class="flowSpeedIcon flowIcon"></div>
                    <div
                      class="rankItem"
                      v-for="(item, index) in flowRankSection"
                      :key="index"
                    >
                      <div class="rankNumber">
                        <span class="inlineBlock bigFont blueFont">{{
                          Number(item.flow).toFixed(2)
                        }}</span>
                        <span class="inlineBlock blueFont">辆/分钟</span>
                      </div>
                      <div class="processStatus">
                        <div
                          class="flowProcess"
                          :style="
                            'width:' +
                            scaleOfRank(item.flow, maxFlowValueSection) +
                            '%'
                          "
                        ></div>
                      </div>
                      <div>
                        <span class="inlineBlock lightFont minFont boldFont"
                          ><Tooltip
                            transfer
                            :content="item.sectionName"
                            placement="bottom"
                            >{{ item.sectionName.slice(0, 6) }}</Tooltip
                          ></span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="flowSpeedRankItem">
                    <div class="flowSpeedRankTitle">
                      <span class="inlineBlock bigFont">流速排行</span>
                      <span
                        class="inlineBlock trend normalTrend"
                        @click="changeSpeedRankSortSection"
                      >
                        <i
                          :class="[
                            'icons',
                            { up: speedRankSortSection == 'up' },
                            { down: speedRankSortSection == 'down' },
                          ]"
                        ></i>
                      </span>
                    </div>
                    <div class="flowSpeedIcon speedIcon"></div>
                    <div
                      class="rankItem"
                      v-for="(item, index) in speedRankSection"
                      :key="index"
                    >
                      <div class="rankNumber">
                        <span class="inlineBlock bigFont greenFont">{{
                          Number(item.speed).toFixed(2)
                        }}</span>
                        <span class="inlineBlock greenFont">km/h</span>
                      </div>
                      <div class="processStatus">
                        <div
                          class="speedProcess"
                          :style="
                            'width:' +
                            Number(
                              Number(item.speed).toFixed(2) /
                                maxSpeedValueSection
                            ).toFixed(4) *
                              100 +
                            '%'
                          "
                        ></div>
                      </div>
                      <div>
                        <span class="inlineBlock lightFont boldFont minFont"
                          ><Tooltip
                            transfer
                            :content="item.sectionName"
                            placement="bottom"
                            >{{ item.sectionName.slice(0, 6) }}</Tooltip
                          ></span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="centerLine"></div>
                </div>
              </div>
            </div>
            <!-- 路段分析 -->
            <div
              :class="[
                'flowSpeedAnalysisMain',
                { animationOpacity: !showOverall && !showSection },
              ]"
              v-show="!showOverall && !showSection"
            >
              <div class="partBlockTitle">
                <span class="partBlockTitleMain">路段流量流速</span>
                <div class="closeBtn">
                  <i class="navBtnIcon" @click="closeAnalysis"></i>
                </div>
              </div>
              <div class="tabs">
                <span
                  :class="[
                    'tabBlock',
                    { activeBlock: statisticsChartCurrent == '3h' },
                  ]"
                  @click="changesStatisticsChartCurrent('3h')"
                  >近3小时</span
                >
                <span
                  :class="[
                    'tabBlock',
                    { activeBlock: statisticsChartCurrent == 'today' },
                  ]"
                  @click="changesStatisticsChartCurrent('today')"
                  >今日</span
                >
                <span
                  :class="[
                    'tabBlock',
                    { activeBlock: statisticsChartCurrent == 'week' },
                  ]"
                  class="tabBlock"
                  @click="changesStatisticsChartCurrent('week')"
                  >近一周</span
                >
                <span
                  :class="[
                    'tabBlock',
                    { activeBlock: statisticsChartCurrent == 'month' },
                  ]"
                  class="tabBlock"
                  @click="changesStatisticsChartCurrent('month')"
                  >近一月</span
                >
                <span
                  :class="[
                    'filterBlock',
                    { activeBlock: statisticsChartCurrent == 'customize' },
                  ]"
                  @click="changesStatisticsChartCurrent('customize')"
                >
                  自定义<span class="down"></span>
                  <div class="filters" @click.stop="" v-show="customizeQuery">
                    <div class="dropDown">
                      <div class="filterItems">
                        开始时间:
                        <DatePicker
                          type="datetime"
                          :editable="false"
                          :options="pathSpeedFlowStartOptions"
                          v-model="pathSpeedFlow.startTime"
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
                          :options="pathSpeedFlowEndOptions"
                          v-model="pathSpeedFlow.endTime"
                          placeholder="结束时间"
                          style="width: 180px"
                          :time-picker-options="{ steps: [1, 5, 5] }"
                          @on-change="changeStatisticsDateTime"
                        ></DatePicker>
                      </div>
                      <div class="filterItems">
                        时间刻度:
                        <Select
                          v-model="pathSpeedFlow.timedensity"
                          style="width: 180px"
                          placeholder="时间刻度"
                          filterable
                          clearable
                          @on-change="changeStatisticsDateTime"
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
              <div class="flowSpeedBlock">
                <span class="inlineBlock minFont">高速路名：</span>
                <span class="inlineBlock minFont yellowFont">{{
                  pathSpeedFlow.parentName
                }}</span>
                <span class="inlineBlock minFont">选择路段：</span>
                <span class="inlineBlock minFont blueFont">{{
                  pathSpeedFlow.pathLineName
                }}</span>
              </div>
              <div
                class="noData largeFont errorFont"
                v-show="!showLineStatictis"
              >
                无数据
              </div>
              <div
                style="padding-top: 24px"
                class="flowSpeedBox"
                ref="flowSpeedBox"
              ></div>
            </div>
            <!-- 区间分析 -->
            <div
              :class="[
                'flowSpeedAnalysisMain',
                { animationOpacity: showSection },
              ]"
              v-show="showSection"
            >
              <div class="partBlockTitle">
                <span class="partBlockTitleMain">区间流量流速</span>
                <div class="closeBtn">
                  <i class="navBtnIcon" @click="closeSection"></i>
                </div>
              </div>
              <div class="tabs">
                <span
                  :class="[
                    'tabBlock',
                    { activeBlock: statisticsChartCurrent == '3h' },
                  ]"
                  @click="changesStatisticsChartCurrentSection('3h')"
                  >近3小时</span
                >
                <span
                  :class="[
                    'tabBlock',
                    { activeBlock: statisticsChartCurrent == 'today' },
                  ]"
                  @click="changesStatisticsChartCurrentSection('today')"
                  >今日</span
                >
                <span
                  :class="[
                    'tabBlock',
                    { activeBlock: statisticsChartCurrent == 'week' },
                  ]"
                  class="tabBlock"
                  @click="changesStatisticsChartCurrentSection('week')"
                  >近一周</span
                >
                <span
                  :class="[
                    'tabBlock',
                    { activeBlock: statisticsChartCurrent == 'month' },
                  ]"
                  class="tabBlock"
                  @click="changesStatisticsChartCurrentSection('month')"
                  >近一月</span
                >
                <span
                  :class="[
                    'filterBlock',
                    { activeBlock: statisticsChartCurrent == 'customize' },
                  ]"
                  @click="changesStatisticsChartCurrentSection('customize')"
                >
                  自定义<span class="down"></span>
                  <div
                    class="filters"
                    @click.stop=""
                    v-show="customizeQuerySection"
                  >
                    <div class="dropDown">
                      <div class="filterItems">
                        开始时间:
                        <DatePicker
                          type="datetime"
                          :editable="false"
                          :options="pathSpeedFlowStartOptionsSection"
                          v-model="sectionFlow.startTime"
                          placeholder="开始时间"
                          style="width: 180px"
                          :time-picker-options="{ steps: [1, 5, 5] }"
                          @on-change="changeStatisticsDateTimeSection"
                        ></DatePicker>
                      </div>
                      <div class="filterItems">
                        结束时间:
                        <DatePicker
                          type="datetime"
                          :editable="false"
                          :options="pathSpeedFlowEndOptionsSection"
                          v-model="sectionFlow.endTime"
                          placeholder="结束时间"
                          style="width: 180px"
                          :time-picker-options="{ steps: [1, 5, 5] }"
                          @on-change="changeStatisticsDateTimeSection"
                        ></DatePicker>
                      </div>
                      <div class="filterItems">
                        时间刻度:
                        <Select
                          v-model="sectionFlow.timedensity"
                          style="width: 180px"
                          placeholder="时间刻度"
                          filterable
                          clearable
                          @on-change="changeStatisticsDateTimeSection"
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
              <div
                style="padding-top: 24px"
                class="flowSpeedBox"
                ref="sectionDate"
              ></div>
            </div>
          </div>
        </div>
        <!-- 流量流速排行 -->
      </div>
      <!-- 单路段展示 -->
      <div class="linePathInf"></div>
    </div>
  </div>
</template>
<script>
import flowApi from "@/api/flow";
import { Chart } from "@antv/g2";
import Ajax from "@/api/tools/customajax";
import { API_BASEURL, API_TIMEOUT } from "@/utils/config";
import G6 from "@antv/g6";

const lineDash = [4, 2, 1, 2];
// 注册名为 'circle-running' 的边
G6.registerEdge(
  "circle-running",
  {
    afterDraw(cfg, group) {
      let speed = cfg.speed ? Number(cfg.speed) : 1;
      if (speed <= 0) speed = 1;
      // 获得当前边的第一个图形，这里是边本身的 path
      const shape = group.get("children")[0];
      // 边 path 的起点位置
      const startPoint = shape.getPoint(0);

      // 添加红色 circle 图形
      const circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: "#3a5cff",
          r: 16,
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: "circle-shape",
      });

      // 对红色圆点添加动画
      circle.animate(
        (ratio) => {
          // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
          // 根据比例值，获得在边 path 上对应比例的位置。
          const tmpPoint = shape.getPoint(ratio);
          // 返回需要变化的参数集，这里返回了位置 x 和 y
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: true, // 动画重复
          duration: 10000 / speed,
        }
      ); // 一次动画的时间长度
    },
  },
  "quadratic"
); // 该自定义边继承了内置贝塞尔曲线边 quadratic

export default {
  data() {
    return {
      selectEdgesId:'',
      tabActive: 0,
      stationList: [],
      selectStation: 0,
      tabActive: 0,
      showLineStatictis: false,
      flowRankSort: "down",
      speedRankSort: "down",
      flowRankSortSection: "down",
      speedRankSortSection: "down",
      customizeRankQuery: false,
      customizeRankQuerySection: false,
      customizeQuery: false,
      customizeQuerySection: false,
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
      statisticsCurrent: "3h",
      statisticsCurrentSection: "3h",
      statisticsChartCurrent: "3h",
      graphImg: null,
      showOverall: true,
      showSection: false,
      defaultTab: "today",
      overViewData: [],
      flowSpeedData: [],
      maxFlowValue: 0,
      maxSpeedValue: 0,
      speedRank: [],
      flowRank: [],
      speedRankSection: [],
      flowRankSection: [],
      defaultTime: "",
      speedFlowHistoryRank: "month",
      pathSpeedFlow: {
        parentName: "",
        pathLineName: "",
        pathLineId: "",
        startTime: this.dateTo("3h", "YYYY-MM-DD HH:mm:ss"),
        endTime: this.dateTo("now", "YYYY-MM-DD HH:mm:ss"),
        timedensity: "120",
      },
      pathSpeedFlowSection: {
        parentName: "",
        pathLineName: "",
        pathLineId: "",
        startTime: this.dateTo("3h", "YYYY-MM-DD HH:mm:ss"),
        endTime: this.dateTo("now", "YYYY-MM-DD HH:mm:ss"),
        timedensity: 30,
      },
      sectionFlow: {
        sectionId: "",
        startTime: this.dateTo("3h", "YYYY-MM-DD HH:mm:ss"),
        endTime: this.dateTo("now", "YYYY-MM-DD HH:mm:ss"),
        timedensity: 30,
      },
      overViewShow: {
        startTime: this.dateTo("today", "YYYY-MM-DD HH:mm:ss"),
        endTime: this.dateTo("now", "YYYY-MM-DD HH:mm:ss"),
      },
      rankParam: {
        startTime: this.dateTo("3h", "YYYY-MM-DD HH:mm:ss"),
        endTime: this.dateTo("now", "YYYY-MM-DD HH:mm:ss"),
      },
      rankParamSection: {
        startTime: this.dateTo("3h", "YYYY-MM-DD HH:mm:ss"),
        endTime: this.dateTo("now", "YYYY-MM-DD HH:mm:ss"),
      },
      topography: {
        nodes: [],
        edges: [],
      },
      chartData: [],
      chartCtl: null,
      sectionData: [],
      sectionCtl: null,
      maxFlowValueSection: 0,
      maxSpeedValueSection: 0,
    };
  },
  props: {
    changeData: {
      type: Object,
    },
  },
  watch: {
    "changeData.date": {
      handler(data) {
        if (this.changeData.type == 4) {
          this.getAllStation();
        }
      },
    },
  },
  computed: {
    paramTimeSpan() {
      let timeSpan = 0;
      if (this.pathSpeedFlow.startTime && this.pathSpeedFlow.endTime) {
        timeSpan =
          new Date(this.pathSpeedFlow.endTime) -
          new Date(this.pathSpeedFlow.startTime);
      }
      return timeSpan / 1000 / 60 / 60;
    },
    rankParamStartOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return date.valueOf() > new Date(self.rankParam.endTime);
        },
      };
      return options;
      //this.statisticParam.startTime;
    },
    rankParamEndOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return (
            date.valueOf() <
            new Date(
              self
                .$moment(self.rankParam.startTime)
                .format("YYYY-MM-DD 00:00:00")
            )
          );
        },
      };
      return options;
    },
    rankParamStartOptionsSection() {
      let self = this;
      let options = {
        disabledDate(date) {
          return date.valueOf() > new Date(self.rankParamSection.endTime);
        },
      };
      return options;
      //this.statisticParam.startTime;
    },
    rankParamEndOptionsSection() {
      let self = this;
      let options = {
        disabledDate(date) {
          return (
            date.valueOf() <
            new Date(
              self
                .$moment(self.rankParamSection.startTime)
                .format("YYYY-MM-DD 00:00:00")
            )
          );
        },
      };
      return options;
    },
    pathSpeedFlowStartOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return date.valueOf() > new Date(self.pathSpeedFlow.endTime);
        },
      };
      return options;
      //this.statisticParam.startTime;
    },
    pathSpeedFlowStartOptionsSection() {
      let self = this;
      let options = {
        disabledDate(date) {
          return date.valueOf() > new Date(self.sectionFlow.endTime);
        },
      };
      return options;
      //this.statisticParam.startTime;
    },
    pathSpeedFlowEndOptions() {
      let self = this;
      let options = {
        disabledDate(date) {
          return (
            date.valueOf() <
            new Date(
              self
                .$moment(self.pathSpeedFlow.startTime)
                .format("YYYY-MM-DD 00:00:00")
            )
          );
        },
      };
      return options;
    },
    pathSpeedFlowEndOptionsSection() {
      let self = this;
      let options = {
        disabledDate(date) {
          return (
            date.valueOf() <
            new Date(
              self
                .$moment(self.sectionFlow.startTime)
                .format("YYYY-MM-DD 00:00:00")
            )
          );
        },
      };
      return options;
    },
  },
  created() {
    this.loadFlow();
  },
  mounted() {
    // 获取所有区间
    this.getAllStation();
    this.getEntirePathSpeedFlow();
    this.initLoadInfo();
    this.getSpeedFlowHistoryRank();
    this.initSpeedFlowHistoryRankForStation();
    window.onresize = () => {
      if (!this.resizeWaiter) {
        this.resizeWaiter = true;
        setTimeout(() => {
          this.initTop();
          this.resizeWaiter = false;
        }, 1000);
      }
    };
  },
  methods: {
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
          break;
      }
      return dataTime;
    },
    initLoadInfo() {},
    // 获取所有区间
    getAllStation() {
      Ajax.post(API_BASEURL + "/querySectionRoad").then((response) => {
        if (response.status == 200) {
          this.stationList = response.data.Data;
        }
      });
    },
    changeTab(n) {
      this.tabActive = n;
    },
    clearStation() {
      this.selectStation = 0;
      this.topography.edges.forEach((item) => {
        item.style.stroke = "#303759";
        if (item.exist) {
          item.type = "circle-running";
          if (item.speed == 1) {
            item.style.stroke = "#2344e8";
          } else if (item.speed == 2) {
            item.style.stroke = "#ffd84e";
          } else if (item.speed == 3) {
            item.style.stroke = "#ee5555";
          }
        }
      });
      this.graphImg.changeData(this.topography);
    },
    changeStation(obj, idx) {
      if (this.sectionFlow.sectionId == obj.sectionId) {
        this.sectionFlow.sectionId = "";
        this.selectStation = 0;
        this.showOverall = true;
        this.showSection = false;

        this.clearStation();
      } else {
        this.selectStation = idx + 1;
        let selectData = {
          nodes: this.topography.nodes,
          edges: this.topography.edges,
        };
        for (let i = 0; i < selectData.edges.length; i++) {
          if (selectData.edges[i].sectionId == obj.sectionId) {
            selectData.edges[i].style.stroke = "#04d518";
          } else {
            selectData.edges[i].style.stroke = "#303759";
            if (selectData.edges[i].exist) {
              selectData.edges[i].type = "circle-running";
              if (selectData.edges[i].speed == 1) {
                selectData.edges[i].style.stroke = "#2344e8";
              } else if (selectData.edges[i].speed == 2) {
                selectData.edges[i].style.stroke = "#ffd84e";
              } else if (selectData.edges[i].speed == 3) {
                selectData.edges[i].style.stroke = "#ee5555";
              }
            }
          }
        }
        this.sectionFlow.sectionId = obj.sectionId;
        this.showSection = true;
        this.getSectionSpeedFlow();
        this.graphImg.changeData(selectData);
      }
    },
    // 区间流量流速
    getSectionSpeedFlow() {
      this.sectionData = [];
      if (this.sectionFlow.startTime)
        this.sectionFlow.startTime = this.$moment(
          this.sectionFlow.startTime
        ).format("YYYY-MM-DD HH:mm:ss");
      if (this.sectionFlow.endTime)
        this.sectionFlow.endTime = this.$moment(
          this.sectionFlow.endTime
        ).format("YYYY-MM-DD HH:mm:ss");
      Ajax.post(
        API_BASEURL + "/getSectionSpeedFlow?" + this.objToStr(this.sectionFlow)
      ).then((response) => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            let searchData = response.data.Data;
            searchData.forEach((item) => {
              this.sectionData.push({
                title: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                speed: item.speed,
                flow: item.flow,
              });
            });
            this.showLineStatictis = true;
            this.creatSectionCharts(true);
          } else {
            //if (response.data.Code == 5003) {
            this.showLineStatictis = false;
            this.$Message.error({
              content: response.data.Msg,
            });
            if (this.sectionCtl) {
              this.sectionCtl.destroy();
              this.sectionCtl = null;
            }
          }
        }
      });
    },
    creatSectionCharts(init) {
      let self = this;
      if (self.sectionCtl) {
        self.sectionCtl.destroy();
        self.sectionCtl = null;
      }
      let chart = new Chart({
        container: this.$refs.sectionDate,
        autoFit: true,
        height: this.$refs.sectionDate.clientHeight,
        padding: [20, 50, 50, 50],
      });
      this.sectionCtl = chart;
      let data = self.sectionData;
      chart.data(data);

      chart.scale({
        title: {
          alias: "日期",
        },
        flow: {
          alias: "流量",
          min: 0,
          sync: true, // 将 flow 字段数值同 speed 字段数值进行同步
          nice: true,
        },
        speed: {
          alias: "流速",
          min: 0,
          sync: true, // 将 speed 字段数值同 flow 字段数值进行同步
          nice: true,
        },
        count: {
          alias: "次数",
        },
      });
      chart.axis("title", {
        label: {
          style: { fill: "#fff" },
        },
      });
      chart.axis("flow", {
        grid: null,
        title: {
          style: {
            fill: "#fff",
          },
        },
        label: {
          style: {
            fill: "#fff",
          },
        },
        // axisTitleTextFillColor:"#ffffff",
      });
      chart.axis("speed", {
        title: {
          style: {
            fill: "#fff",
          },
        },
        label: {
          style: {
            fill: "#fff",
          },
        },
        // fill: "#ffffff" // 文本颜色
      });

      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      chart
        .line()
        .position("title*speed")
        .size(4)
        .shape("smooth")
        .tooltip("tooltip*speed", function (item, speed) {
          return {
            title: item,
            name: "流速",
            value: speed,
          };
        })
        .color("#4FAAEB");
      chart
        .line()
        .position("title*flow")
        .size(4)
        .shape("smooth")
        .tooltip("tooltip*flow", function (item, flow) {
          return {
            title: item,
            name: "流量",
            value: flow,
          };
        })
        .color("#9AD681");
      //.shape('dash');

      chart
        .point()
        .position("title*speed")
        .shape("circle")
        .size(6)
        .color("#4FAAEB")
        .tooltip("tooltip*speed", function (item, speed) {
          return {
            title: item,
            name: "流速",
            value: speed,
          };
        })
        .style({
          stroke: "#fff",
          lineWidth: 2,
          fillOpacity: 1,
        });

      chart
        .point()
        .position("title*flow")
        .shape("circle")
        .size(6)
        .color("#9AD681")
        .tooltip("tooltip*flow", function (item, flow) {
          return {
            title: item,
            name: "流量",
            value: flow,
          };
        })
        .style({
          stroke: "#fff",
          lineWidth: 2,
          fillOpacity: 1,
        });
      chart.legend({
        position: "bottom",
        custom: true, // 自定义图例
        offsetY: 2,
        fill: "#ffffff",
        label: {
          style: {
            fill: "#fff",
          },
        },
        itemName: { style: { fill: "#fff" } },
        items: [
          {
            name: "流速(km/h)",
            value: "speed",
            fill: "#ffffff",
            marker: {
              symbol: "circle",
              style: { fill: "#4FAAEB" },
            },
          },
          {
            name: "流量(辆/分)",
            value: "flow",
            fill: "#ffffff",
            marker: { symbol: "circle", style: { fill: "#9AD681" } },
          },
        ],
      });

      chart.theme("newTheme");
      chart.render();
    },
    // 加载所有线路和点
    loadFlow() {
      let self = this;
      self.topography.edges = [];
      self.topography.nodes = [];
      flowApi.getNodeSite().then((response) => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            let flowData = response.data.Data;
            flowData.nodes.forEach((item) => {
              let video = item.videos[0] || "";
              let nodeItem = {
                id: item.node_id,
                label: item.node_name,
                name: item.node_name,
                x: JSON.parse(item.canvas_position).x,
                y: JSON.parse(item.canvas_position).y,
                type: "background-animate",
                video: video,
                unhandle: video ? video.unhandle : false,
                isEnd: video ? video.isEnd : true,
              };
              if (video) {
                //有摄像头
                nodeItem.icon = {
                  show: true,
                  img: "static/images/videoIcon.svg",
                  width: 96,
                  height: 96,
                };
                if (video.unhandle && video.isEnd) {
                  //存在未处理及已结束
                  nodeItem.style = {
                    fill: "#ff9900", //节点填充色
                    lineDash: false,
                    cursor: "pointer",
                  };
                } else if (video.unhandle && !video.isEnd) {
                  //存在未处理及未结束
                  nodeItem.style = {
                    fill: "#ee5555", //节点填充色
                    lineDash: false,
                    cursor: "pointer",
                  };
                } else {
                  //全部已处理
                  nodeItem.style = {
                    fill: "#3a5cff", //节点填充色
                    lineDash: false,
                    cursor: "pointer",
                  };
                }
                if (!video.is_detection) {
                  //设备停止检测
                  nodeItem.type = "circle";
                  nodeItem.icon = {
                    show: true,
                    img: "static/images/videoIconGray.svg",
                    width: 96,
                    height: 96,
                  };
                }
              } else {
                //节点无摄像头
                nodeItem.type = "circle";
                nodeItem.style = {
                  fill: "#3148b6", //节点填充色
                  lineDash: false,
                  cursor: "pointer",
                };
              }
              self.topography.nodes.push(nodeItem);
            });
            flowData.path_lines.forEach((item) => {
              let lineItem = {
                source: item.from_node_id,
                target: item.to_node_id,
                flow: item.flow_count,
                speed: item.flow_speed,
                parentName: item.parent_name,
                name: item.path_line_name,
                exist: item.flow_speed_exist,
                sectionId: item.sectionId,
                sectionName: item.sectionName,
                id: item.id,
                activeStatus: false,
                style: {
                  lineWidth: 16,
                  lineAppendWidth: 24,
                  stroke: "#303759",
                  endArrow: false,
                  cursor: "pointer",
                  strokeOpacity: 1, //透明度
                },
              };

              if (lineItem.exist) {
                lineItem.type = "circle-running";
                if (lineItem.speed == 1) {
                  lineItem.style.stroke = "#2344e8";
                } else if (lineItem.speed == 2) {
                  lineItem.style.stroke = "#ffd84e";
                } else if (lineItem.speed == 3) {
                  lineItem.style.stroke = "#ee5555";
                }
              }
              self.topography.edges.push(lineItem);
            });
            self.initTop();
          } else {
            this.$Message.error({
              content: response.data.Msg,
            });
          }
        }
      });
    },
    // 加载拓扑
    initTop() {
      const lineDash = [4, 2, 1, 2];
      if (this.graphImg) {
        this.graphImg.destroy();
      }
      let graph = new G6.Graph({
        container: this.$refs.nodePath, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: this.$refs.nodePath.clientWidth, // Number，必须，图的宽度
        height: this.$refs.nodePath.clientHeight, // Number，必须，图的高度
        minZoon: 0.01,
        maxZoom: 5,
        fitView: true,
        animate: true,
        fitViewPadding: [0, 20],
        fitCenter: true, //图的中心将对齐到画布中心，但不缩放
        modes: {
          // default: ["drag-canvas", "drag-node"]
          default: ["drag-canvas", "zoom-canvas"], //, "drag-node"] // 允许拖拽画布、放缩画布、拖拽节点
        },
        defaultNode: {
          type: "circle",
          size: 120,
          style: {
            fill: "#3a5cff", //节点填充色
            // stroke: "#5B8FF9",//节点的描边颜色
            lineWidth: 0, //节点的描边颜色
            lineDash: false,
            // opacity: 1,
            cursor: "pointer",
          },
          // 节点上的标签文本配置
          labelCfg: {
            // 节点上的标签文本样式配置
            position: "right",
            offset: 12,
            style: {
              fontSize: 48,
              fill: "#fff", // 节点标签文字颜色
            },
          },
        },
        defaultEdge: {
          type: "quadratic",
          curveOffset: -64,
          style: {
            lineWidth: 16, //宽度
            // stroke: "#3a5cff", //颜色
            // lineAppendWidth:8,//鼠标经过时的宽度
            endArrow: false,
            cursor: "pointer",
            strokeOpacity: 1, //透明度
            // lineDash: [2, 4, 4] //虚线
          },
        },
        edgeStateStyles: {
          hover: {
            stroke: "#00fcff",
          },
          click: {
            stroke: "#00fcff",
            strokeOpacity: 1,
          },
        },
      });
      this.graphImg = graph;
      G6.registerNode(
        "background-animate",
        {
          afterDraw(cfg, group) {
            const r = cfg.size / 2;
            const back1 = group.addShape("circle", {
              zIndex: -3,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: cfg.style.fill,
                opacity: 0.8,
              },
              name: "back1-shape",
            });
            const back2 = group.addShape("circle", {
              zIndex: -2,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: cfg.style.fill,
                opacity: 0.8,
              },
              name: "back2-shape",
            });
            const back3 = group.addShape("circle", {
              zIndex: -1,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: cfg.style.fill,
                opacity: 0.8,
              },
              name: "back3-shape",
            });
            group.sort(); // Sort according to the zIndex
            back1.animate(
              {
                // Magnifying and disappearing
                r: r + 40,
                opacity: 0.2,
              },
              {
                duration: 1000,
                easing: "easeCubic",
                delay: 0,
                repeat: true, // repeat
              }
            ); // no delay
            back2.animate(
              {
                // Magnifying and disappearing
                r: r + 20,
                opacity: 0.4,
              },
              {
                duration: 2000,
                easing: "easeCubic",
                delay: 2000,
                repeat: true, // repeat
              }
            ); // 1s delay
            back3.animate(
              {
                // Magnifying and disappearing
                r: r + 10,
                opacity: 0.4,
              },
              {
                duration: 4000,
                easing: "easeCubic",
                delay: 4000,
                repeat: true, // repeat
              }
            ); // 3s delay
          },
        },
        "circle"
      );
      // 鼠标移动上去后激活节点
      // graph.on("node:dragend", evt => {
      //   const nodeItem = evt.item; // 获取被点击的节点元素对象
      //   let node_id = nodeItem._cfg.model.id;
      //   let node_position_x = nodeItem._cfg.model.x;
      //   let node_position_y = nodeItem._cfg.model.y;
      //   // let node_position =
      //   //   '{"x":' + node_position_x + ',"y":' + node_position_y + '}';
      //   Ajax.post(
      //     API_BASEURL +
      //       "/saveNodeLocation?node_id=" +
      //       node_id +
      //       "&node_position=%7B%22x%22%3A" +
      //       node_position_x +
      //       "%2C%22y%22%3A" +
      //       node_position_y +
      //       "%7D"
      //   ).then(response => {
      //     if (response.status == 200) {
      //     }
      //   });
      // });
      graph.on("edge:mouseenter", (evt) => {
        const { item } = evt;
        graph.setItemState(item, "hover", true);
      });
      graph.on("edge:mouseleave", (evt) => {
        const { item } = evt;
        graph.setItemState(item, "hover", false);
      });
      graph.on("edge:click", (evt) => {
        const nodeItem = evt.item.getModel(); // 获取被点击的节点元素对象
        const clickNodes = graph.findAllByState("edge", "click");
         if(this.selectEdgesId == nodeItem.id){
        this.pathSpeedFlow.pathLineId = "";
        this.pathSpeedFlow.pathLineName = "";
        this.pathSpeedFlow.parentName = "";
          graph.setItemState(evt.item, "click", false);
          this.showLineStatictis = false;
          this.selectStation = 0;
          this.clearStation();
          this.selectEdgesId = "";
          this.chartData = [];
          if (this.chartCtl) {
            this.chartCtl.destroy();
            this.chartCtl = null;
          }
          // this.changesStatisticsCurrent("3h");
        }else{
        this.pathSpeedFlow.pathLineId = nodeItem.id;
        this.pathSpeedFlow.pathLineName = nodeItem.name;
        this.pathSpeedFlow.parentName = nodeItem.parentName;
        if (
          nodeItem.sectionId == "" ||
          nodeItem.sectionId != this.sectionFlow.sectionId
        ) {
          this.selectStation = 0;
          this.clearStation();
          clickNodes.forEach((cn) => {
            graph.setItemState(cn, "click", false);
          });
          graph.setItemState(evt.item, "click", true); // 设置当前节点的 click 状态为 true
          this.selectEdgesId = nodeItem.id
          this.showOverall = false;
          this.showSection = false;
          this.showLineStatictis = true;
          this.changesStatisticsChartCurrent("3h");
        } else {
          this.showLineStatictis = false;
          this.chartData = [];
          if (this.chartCtl) {
            this.chartCtl.destroy();
            this.chartCtl = null;
          }
        }}
      });
      graph.data(this.topography); // 渲染图
      graph.render();
      // graph.zoomTo(0.2, {
      //   x: this.$refs.nodePath.clientWidth / 2,
      //   y: this.$refs.nodePath.clientHeight / 2
      // });
    },
    changesStatisticsCurrent(d) {
      this.statisticsCurrent = d;
      if (this.statisticsCurrent != "customize") {
        this.customizeRankQuery = false;
        this.rankParam.startTime = this.dateTo(d, "YYYY-MM-DD HH:mm:ss");
        this.rankParam.endTime = this.dateTo("now", "YYYY-MM-DD HH:mm:ss");
        this.getSpeedFlowHistoryRank();
      } else this.customizeRankQuery = !this.customizeRankQuery;
    },
    changesStatisticsCurrentSection(d) {
      this.statisticsCurrentSection = d;
      if (this.statisticsCurrentSection != "customize") {
        this.customizeRankQuerySection = false;
        this.rankParamSection.startTime = this.dateTo(d, "YYYY-MM-DD HH:mm:ss");
        this.rankParamSection.endTime = this.dateTo(
          "now",
          "YYYY-MM-DD HH:mm:ss"
        );
        this.initSpeedFlowHistoryRankForStation();
      } else this.customizeRankQuerySection = !this.customizeRankQuerySection;
    },
    changesStatisticsChartCurrent(d) {
      this.statisticsChartCurrent = d;
      this.pathSpeedFlow.endTime = this.dateTo("now", "YYYY-MM-DD HH:mm:ss");
      switch (d) {
        case "3h":
        case "6h":
          this.pathSpeedFlow.startTime = this.dateTo(d, "YYYY-MM-DD HH:mm:ss");
          this.pathSpeedFlow.timedensity = 30;
          break;
        case "today":
          this.pathSpeedFlow.startTime = this.dateTo(d, "YYYY-MM-DD HH:mm:ss");
          this.pathSpeedFlow.timedensity = 60;

          break;
        case "week":
          this.pathSpeedFlow.startTime = this.dateTo(d, "YYYY-MM-DD HH:mm:ss");
          this.pathSpeedFlow.timedensity = 60 * 24;

          break;

        case "month":
          this.pathSpeedFlow.startTime = this.dateTo(d, "YYYY-MM-DD HH:mm:ss");
          this.pathSpeedFlow.timedensity = 60 * 24;

          break;
      }
      if (this.statisticsChartCurrent != "customize") {
        this.customizeQuery = false;
        this.getPathSpeedFlow();
      } else this.customizeQuery = !this.customizeQuery;
    },
    changesStatisticsChartCurrentSection(d) {
      this.statisticsChartCurrent = d;
      this.sectionFlow.endTime = this.dateTo(
        "now",
        "YYYY-MM-DD HH:mm:ss"
      );
      switch (d) {
        case "3h":
        case "6h":
          this.sectionFlow.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.sectionFlow.timedensity = 30;
          break;
        case "today":
          this.sectionFlow.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.sectionFlow.timedensity = 60;
          break;
        case "week":
          this.sectionFlow.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.sectionFlow.timedensity = 60 * 24;
          break;

        case "month":
          this.sectionFlow.startTime = this.dateTo(
            d,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.sectionFlow.timedensity = 60 * 24;
          break;
      }
      if (this.statisticsChartCurrentSection != "customize") {
        this.customizeQuerySectionSection = false;
        this.getSectionSpeedFlow();
      } else
        this.customizeQuerySectionSection = !this.customizeQuerySectionSection;
    },
    changeStatisticsDateTime() {
      this.getPathSpeedFlow();
    },
    changeStatisticsDateTimeSection() {
      this.getSectionSpeedFlow();
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
      let timeSpan = this.paramTimeSpan;
      let timedensity = this.selectStation == 0 ? this.pathSpeedFlow.timedensity :  this.sectionFlow.timedensity;
      switch (parseInt(timedensity)) {
      // switch (this.pathSpeedFlow.timedensity) {
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
      // switch (this.statisticsChartCurrent) {
      //   case "3h":
      //   case "6h":
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
      // }
      return title;
    },
    formatChartTooltip(startTime) {
      let title = "";
      // debugger
      let timedensity = this.selectStation == 0 ? this.pathSpeedFlow.timedensity :  this.sectionFlow.timedensity;
      switch (parseInt(timedensity)) {
        case 5:
        case 10:
        case 15:
        case 30:
        case 60:
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
    // 路线速度和流量查询
    getPathSpeedFlow() {
      this.chartData = [];
      if (this.pathSpeedFlow.startTime)
        this.pathSpeedFlow.startTime = this.$moment(
          this.pathSpeedFlow.startTime
        ).format("YYYY-MM-DD HH:mm:ss");
      if (this.pathSpeedFlow.endTime)
        this.pathSpeedFlow.endTime = this.$moment(
          this.pathSpeedFlow.endTime
        ).format("YYYY-MM-DD HH:mm:ss");
      let pathSpeedFlowParams = {
        pathLineId: this.pathSpeedFlow.pathLineId,
        startTime: this.pathSpeedFlow.startTime,
        endTime: this.pathSpeedFlow.endTime,
        timedensity: this.pathSpeedFlow.timedensity,
      };
      // let {pathLineName,...pathSpeedFlowParams} = this.pathSpeedFlow
      if(this.pathSpeedFlow.pathLineId==""){
        this.$Message.error({
              content: "请选择路段",
            });
            return
      }
      Ajax.post(
        API_BASEURL + "/getPathSpeedFlow?" + this.objToStr(pathSpeedFlowParams)
      ).then((response) => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            let searchData = response.data.Data;
            searchData.forEach((item) => {
              this.chartData.push({
                title: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                speed: item.speed,
                flow: item.flow,
              });
            });
            this.showLineStatictis = true;
            this.creatCharts(true);
          } else {
            //if (response.data.Code == 5003) {
            this.showLineStatictis = false;
            if (this.chartCtl) {
              this.chartCtl.destroy();
              this.chartCtl = null;
            }
            this.$Message.error({
              content: response.data.Msg,
            });
          }
        }
      });
    },
    creatCharts(init) {
      let self = this;
      if (self.chartCtl) {
        self.chartCtl.destroy();
      }
      let chart = new Chart({
        container: this.$refs.flowSpeedBox,
        autoFit: true,
        height: 160,
        padding: [20, 50, 80, 50],
      });
      this.chartCtl = chart;
      let data = self.chartData;
      chart.data(data);

      chart.scale({
        title: {
          alias: "日期",
        },
        flow: {
          alias: "流量",
          min: 0,
          sync: true, // 将 flow 字段数值同 speed 字段数值进行同步
          nice: true,
        },
        speed: {
          alias: "流速",
          min: 0,
          sync: true, // 将 speed 字段数值同 flow 字段数值进行同步
          nice: true,
        },
        count: {
          alias: "次数",
        },
      });
      chart.axis("title", {
        label: {
          style: { fill: "#fff" },
        },
      });
      chart.axis("flow", {
        grid: null,
        title: {
          style: {
            fill: "#fff",
          },
        },
        label: {
          style: {
            fill: "#fff",
          },
        },
        // axisTitleTextFillColor:"#ffffff",
      });
      chart.axis("speed", {
        title: {
          style: {
            fill: "#fff",
          },
        },
        label: {
          style: {
            fill: "#fff",
          },
        },
        // fill: "#ffffff" // 文本颜色
      });

      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      chart
        .line()
        .position("title*speed")
        .size(4)
        .shape("smooth")
        .tooltip("tooltip*speed", function (item, speed) {
          return {
            title: item,
            name: "流速",
            value: speed,
          };
        })
        .color("#4FAAEB");
      chart
        .line()
        .position("title*flow")
        .size(4)
        .shape("smooth")
        .tooltip("tooltip*flow", function (item, flow) {
          return {
            title: item,
            name: "流量",
            value: flow,
          };
        })
        .color("#9AD681");
      //.shape('dash');

      chart
        .point()
        .position("title*speed")
        .shape("circle")
        .size(6)
        .color("#4FAAEB")
        .tooltip("tooltip*speed", function (item, speed) {
          return {
            title: item,
            name: "流速",
            value: speed,
          };
        })
        .style({
          stroke: "#fff",
          lineWidth: 2,
          fillOpacity: 1,
        });

      chart
        .point()
        .position("title*flow")
        .shape("circle")
        .size(6)
        .color("#9AD681")
        .tooltip("tooltip*flow", function (item, flow) {
          return {
            title: item,
            name: "流量",
            value: flow,
          };
        })
        .style({
          stroke: "#fff",
          lineWidth: 2,
          fillOpacity: 1,
        });
      chart.legend({
        position: "bottom",
        custom: true, // 自定义图例
        offsetY: 2,
        textStyle: {
          fill: "#ffffff",
        },
        itemName: { style: { fill: "#fff" } },
        items: [
          {
            name: "流速(km/h)",
            value: "speed",
            marker: {
              symbol: "circle",
              style: { fill: "#4FAAEB" },
            },
          },
          {
            name: "流量(辆/分)",
            value: "flow",
            marker: { symbol: "circle", style: { fill: "#9AD681" } },
          },
        ],
      });

      // chart.theme("newTheme");
      chart.render();
    },
    // 查看整条线路的速度和流量
    getEntirePathSpeedFlow() {
      Ajax.post(
        API_BASEURL +
          "/getEntirePathSpeedFlow?" +
          this.objToStr(this.overViewShow)
      ).then((response) => {
        if (response.status == 200) {
          this.overViewData = response.data.Data;
        }
      });
    },

    closeAnalysis() {
      this.showOverall = true;
      const clickNodes = this.graphImg.findAllByState("edge", "click");
      clickNodes.forEach((cn) => {
        this.graphImg.setItemState(cn, "click", false);
      });
    },
    closeSection() {
      this.showOverall = true;
      this.showSection = false;
      this.clearStation();
      // const clickNodes = this.graphImg.findAllByState("edge", "click");
      // clickNodes.forEach((cn) => {
      //   this.graphImg.setItemState(cn, "click", false);
      // });
    },
    changeFlowRankSort() {
      if (this.flowRankSort == "up") {
        this.flowRankSort = "down";
      } else {
        this.flowRankSort = "up";
      }
      this.flowRank = this.flowRank.reverse();
    },
    changeSpeedRankSort() {
      if (this.speedRankSort == "up") {
        this.speedRankSort = "down";
      } else {
        this.speedRankSort = "up";
      }
      this.speedRank = this.speedRank.reverse();
    },
    changeFlowRankSortSection() {
      if (this.flowRankSortSection == "up") {
        this.flowRankSortSection = "down";
      } else {
        this.flowRankSortSection = "up";
      }
      this.flowRankSection = this.flowRankSection.reverse();
    },
    changeSpeedRankSortSection() {
      if (this.speedRankSortSection == "up") {
        this.speedRankSortSection = "down";
      } else {
        this.speedRankSortSection = "up";
      }
      this.speedRankSection = this.speedRankSection.reverse();
    },
    changeHistoryRankParam() {
      this.getSpeedFlowHistoryRank();
    },
    changeHistoryRankParamSection() {
      this.initSpeedFlowHistoryRankForStation();
    },
    scaleOfRank(val, maxVal) {
      let returnVal = 0;
      returnVal = Number(Number(val).toFixed(2) / maxVal).toFixed(4) * 100;
      return returnVal;
    },
    // 查看流量速度历史排名
    getSpeedFlowHistoryRank() {
      if (this.rankParam.startTime)
        this.rankParam.startTime = this.$moment(
          this.rankParam.startTime
        ).format("YYYY-MM-DD HH:mm:ss");
      if (this.rankParam.endTime)
        this.rankParam.endTime = this.$moment(this.rankParam.endTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      Ajax.post(
        API_BASEURL +
          "/getSpeedFlowHistoryRank?" +
          this.objToStr(this.rankParam)
      ).then((response) => {
        if (response.status == 200) {
          this.maxSpeedValue = 0;
          this.maxFlowValue = 0;
          let speedRank = response.data.Data.speedHistoryRank;
          let flowRank = response.data.Data.flowHistoryRank;
          let speedList = speedRank.map((item) => {
            return item.speed;
          });
          let flowList = flowRank.map((item) => {
            return item.flow;
          });
          if (speedList && speedList.length > 0)
            this.maxSpeedValue = Math.max(...speedList).toFixed(2);
          if (flowList && flowList.length > 0)
            this.maxFlowValue = Math.max(...flowList).toFixed(2);
          this.speedRankSort = "down";
          this.flowRankSort = "down";
          // 流速排名
          this.speedRank = response.data.Data.speedHistoryRank;
          // 流量排名
          this.flowRank = response.data.Data.flowHistoryRank;
        }
      });
    },
    // 流量流速排名-按区间
    initSpeedFlowHistoryRankForStation() {
      if (this.rankParamSection.startTime)
        this.rankParamSection.startTime = this.$moment(
          this.rankParamSection.startTime
        ).format("YYYY-MM-DD HH:mm:ss");
      if (this.rankParamSection.endTime)
        this.rankParamSection.endTime = this.$moment(
          this.rankParamSection.endTime
        ).format("YYYY-MM-DD HH:mm:ss");
      Ajax.post(
        API_BASEURL +
          "/getSectionFlowRank?" +
          this.objToStr(this.rankParamSection)
      ).then((response) => {
        if (response.status == 200) {
          this.maxFlowValueSection = 0;
          let flowRank = response.data.Data;
          let flowList = flowRank.map((item) => {
            return item.flow;
          });
          if (flowList && flowList.length > 0) {
            this.maxFlowValueSection = Math.max(...flowList).toFixed(2);
          }
          this.flowRankSortSection = "down";
          // 流量排名
          this.flowRankSection = flowRank.slice(0, 3);
        }
      });
      Ajax.post(
        API_BASEURL +
          "/getSectionSpeedRank?" +
          this.objToStr(this.rankParamSection)
      ).then((response) => {
        if (response.status == 200) {
          this.maxSpeedValueSection = 0;
          let speedRank = response.data.Data;
          let speedList = speedRank.map((item) => {
            return item.speed;
          });
          if (speedList && speedList.length > 0) {
            this.maxSpeedValueSection = Math.max(...speedList).toFixed(2);
          }
          this.speedRankSortSection = "down";
          // 流量排名
          this.speedRankSection = speedRank.slice(0, 3);
        }
      });
    },
  },
};
</script>
