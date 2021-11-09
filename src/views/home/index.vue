<template>
  <div class="main">
    <div class="popupNode" :style="{ top: nodeEventStyle.y + 'px', left: nodeEventStyle.x + 'px' }" v-show="showNodeEvents">
      <div class="popUpIcon">
        <img v-if="showNodeEvents" :src="'static/icons/' + getIcons + '.png'" />
      </div>
      <div class="nodeTitle">{{ nodeEventData.event_type_name }}</div>
      <div class="popUpBtnIcon" @click="hideNodeEvents"></div>
      <div class="nodeDesc">
        <div>高速路：{{ nodeEventData.parent_name }}</div>
        <div>路段：{{ nodeEventData.path_line_name }}</div>
        <div>{{ nodeEventData.create_time }}</div>
        <div class="nodeHandle">
          <!-- <span class="handleItem videoHandleIcon" @click="viewNodeEvents(nodeEventData.id,1)"></span> -->
          <!-- <span class="handleItem videoHandleIcon"></span> -->
          <span class="handleItem detailHandleIcon" @click="viewNodeEvents(nodeEventData.id, 0)"></span>
        </div>
      </div>
    </div>
    <div class="centerPart">
      <Carousel v-model="value" style="height:100%;width:100%">
        <CarouselItem>
          <div id="map" style="height:420px;width:100%"></div>
        </CarouselItem>
        <CarouselItem>
          <div ref="centerPart" style="height:420px;width:100%"></div>
        </CarouselItem>
      </Carousel>
    </div>
    <div class="filterTopo">
      <div class="filterTopoText">区间：</div>
      <div :class="['filterTopoItem', { filterTopoItemActive: selectStation == index + 1 }]" @click="changeStation(item, index)" v-for="(item, index) in stationList" :key="item.sectionId">
        {{ item.sectionName }}
      </div>
    </div>
    <!-- 总览 -->
    <div class="overview horn">
      <div class="overviewMain hornMain" style="font-size: 0">
        <div
          style="
            width: 75%;
            display: inline-block;
            height: 64px;
            vertical-align: top;
            over-flow: hidden;
          "
        >
          <Carousel autoplay :autoplay-speed="4000" v-model="playCurrow" loop dots="none">
            <CarouselItem v-for="(item, index) in pathLineItem" :key="index">
              <!-- <swiper-slide class="swiper-slide" v-for="(item,index) in pathLineItem" :key="index"> -->
              <div class="overviewItem" style="display: inline-block; font-size: 14px; width: 50%">
                <div class="overviewItemMain">
                  <div class="overviewName">{{ item.path_line_name }} 当前平均流量</div>
                  <div class="overviewVal">
                    <span class="inlineBlock largeFont blueFont">{{ item.flow }}</span>
                    <span class="inlineBlock blueFont">辆/分</span>
                    <!-- <span class="inlineBlock trend">
                    <i class="icons up"></i>
                    </span>-->
                  </div>
                </div>
              </div>
              <div class="overviewItem" style="display: inline-block; font-size: 14px; width: 50%">
                <div class="overviewItemMain">
                  <div class="overviewName">{{ item.path_line_name }} 当前平均流速</div>
                  <div class="overviewVal">
                    <span class="inlineBlock largeFont blueFont">{{ item.speed }}</span>
                    <span class="inlineBlock blueFont init">km/h</span>
                    <!-- <span class="inlineBlock trend">
                    <i class="icons down"></i>
                    </span>-->
                  </div>
                </div>
              </div>
            </CarouselItem>
            <!-- </swiper-slide> -->
            <div class="swiper-pagination" slot="pagination"></div>
          </Carousel>
        </div>

        <div
          style="
            width: 25%;
            display: inline-block;
            height: 64px;
            vertical-align: top;
            over-flow: hidden;
          "
        >
          <div class="overviewItem">
            <div class="overviewItemMain">
              <div class="overviewName" style="font-size: 14px">今日事件</div>
              <div class="overviewVal">
                <span class="inlineBlock largeFont blueFont">{{ allEvents }}</span>
                <span class="inlineBlock blueFont init">件</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 左侧 -->
    <div class="leftPart">
      <!-- 路况分析 -->
      <div class="part leftTopPart">
        <div class="partTitle">
          <div class="names">路况分析</div>
          <div class="filters">
            <div class="filterBlock">
              {{ speedFlowHistoryRank | selectTime }}
            </div>
            <div class="dropDown">
              <div class="filterItems" @click="changeflowSpeedTime('today')">
                今日
              </div>
              <div class="filterItems" @click="changeflowSpeedTime('week')">
                近一周
              </div>
              <div class="filterItems" @click="changeflowSpeedTime('month')">
                近一月
              </div>
            </div>
          </div>
        </div>
        <div class="partContent">
          <div class="tabToggle">
            <div @click="changeTab(0)" :class="['tabToggleItem', { activeTab: tabActive == 0 }]">
              按路段
            </div>
            <div @click="changeTab(1)" :class="['tabToggleItem', { activeTab: tabActive == 1 }]">
              按区间
            </div>
          </div>
          <!-- 按线路 -->
          <div class="flexBox paddingBottom12" v-show="tabActive == 0">
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock paddingBottom6">
                  <span class="inlineBlock bigFont">{{ flowRankSort == 'down' ? '最大' : '最小' }}流量</span>
                </div>
                <div class="statisticsBlock">
                  <span class="inlineBlock lightFont minFont boldFont">{{ maxFlowPathLine }}</span>
                </div>
                <div class="statisticsBlock">
                  <span class="inlineBlock darkFont minFont">{{ maxFlowPathName }}</span>
                </div>
                <div class="statisticsBlock paddingTop6">
                  <span class="inlineBlock largeFont blueFont">{{ maxFlow }}</span>
                  <span class="inlineBlock blueFont init">辆/分</span>
                </div>
              </div>
            </div>
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock paddingBottom6">
                  <span class="inlineBlock bigFont">{{ speedRankSort == 'down' ? '最大' : '最小' }}流速</span>
                </div>
                <div class="statisticsBlock">
                  <span class="inlineBlock lightFont minFont boldFont">{{ maxSpeedPathLine }}</span>
                </div>
                <div class="statisticsBlock">
                  <span class="inlineBlock darkFont minFont">{{ maxSpeedPathName }}</span>
                </div>
                <div class="statisticsBlock paddingTop6">
                  <span class="inlineBlock largeFont greenFont">{{ maxSpeed }}</span>
                  <span class="inlineBlock greenFont init">km/h</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flexBox" v-show="tabActive == 0">
            <!-- 流速排行 -->
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock paddingBottom6 paddingTop6">
                  <span class="inlineBlock bigFont">流量排行</span>
                  <span class="inlineBlock trend normalTrend" @click="changeFlowRankSort">
                    <i :class="['icons', { up: flowRankSort == 'up' }, { down: flowRankSort == 'down' }]"></i>
                  </span>
                </div>
                <div class="flexList paddingTop6 rankHeight">
                  <div class="flexListBlock" v-for="(item, index) in flowRank" :key="index">
                    <div class="flexListBlockData boldFont">
                      <span class="inlineBlock">{{ Number(item.flow).toFixed(2) }}</span>
                      <span class="inlineBlock">辆/分</span>
                    </div>
                    <div class="processStatus">
                      <div class="flowProcess" :style="'width:' + scaleOfRank(item.flow, maxFlowValue) + '%'"></div>
                    </div>
                    <div class="flexListBlockName">
                      <span class="inlineBlock lightFont minFont">
                        <Tooltip transfer :content="item.path_line_name" placement="bottom">{{ item.path_line_name.slice(0, 6) }}</Tooltip>
                      </span>
                    </div>
                    <div class="flexListBlockName">
                      <span class="inlineBlock darkFont minFont">{{ item.parent_name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 流量排行 -->
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock paddingBottom6 paddingTop6">
                  <span class="inlineBlock bigFont">流速排行</span>
                  <span class="inlineBlock trend normalTrend" @click="changeSpeedRankSort">
                    <i :class="['icons', { up: speedRankSort == 'up' }, { down: speedRankSort == 'down' }]"></i>
                  </span>
                </div>
                <div class="flexList rankHeight paddingTop6">
                  <div class="flexListBlock" v-for="(item, index) in speedRank" :key="index">
                    <div class="flexListBlockData boldFont">
                      <span class="inlineBlock">{{ Number(item.speed).toFixed(2) }}</span>
                      <span class="inlineBlock">km/h</span>
                    </div>
                    <div class="processStatus">
                      <div class="speedProcess" :style="'width:' + Number(Number(item.speed).toFixed(2) / maxSpeedValue).toFixed(4) * 100 + '%'"></div>
                    </div>
                    <div class="flexListBlockName">
                      <span class="inlineBlock lightFont minFont">
                        <Tooltip transfer :content="item.path_line_name" placement="bottom">{{ item.path_line_name.slice(0, 10) }}</Tooltip>
                      </span>
                    </div>
                    <div class="flexListBlockName">
                      <span class="inlineBlock darkFont minFont">{{ item.parent_name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 按区间 -->
          <div class="flexBox paddingBottom12" v-show="tabActive == 1">
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock paddingBottom6">
                  <span class="inlineBlock bigFont">{{ flowRankSort == 'down' ? '最大' : '最小' }}流量</span>
                </div>

                <div class="statisticsBlock">
                  <span class="inlineBlock darkFont minFont">{{ maxFlowPathNameStation }}</span>
                </div>
                <div class="statisticsBlock paddingTop6">
                  <span class="inlineBlock largeFont blueFont">{{ maxFlowStation }}</span>
                  <span class="inlineBlock blueFont init">辆/分</span>
                </div>
              </div>
            </div>
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock paddingBottom6">
                  <span class="inlineBlock bigFont">{{ speedRankSort == 'down' ? '最大' : '最小' }}流速</span>
                </div>

                <div class="statisticsBlock">
                  <span class="inlineBlock darkFont minFont">{{ maxSpeedPathNameStation }}</span>
                </div>
                <div class="statisticsBlock paddingTop6">
                  <span class="inlineBlock largeFont greenFont">{{ maxSpeedStation }}</span>
                  <span class="inlineBlock greenFont init">km/h</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flexBox" v-show="tabActive == 1">
            <!-- 流速排行 -->
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock paddingBottom6 paddingTop6">
                  <span class="inlineBlock bigFont">流量排行</span>
                  <span class="inlineBlock trend normalTrend" @click="changeFlowRankSort">
                    <i :class="['icons', { up: flowRankSort == 'up' }, { down: flowRankSort == 'down' }]"></i>
                  </span>
                </div>
                <div class="flexList paddingTop6 rankHeight">
                  <div class="flexListBlock" v-for="(item, index) in flowRankStation" :key="index">
                    <div class="flexListBlockData boldFont">
                      <span class="inlineBlock">{{ Number(item.flow).toFixed(2) }}</span>
                      <span class="inlineBlock">辆/分</span>
                    </div>
                    <div class="processStatus">
                      <div class="flowProcess" :style="'width:' + scaleOfRank(item.flow, maxFlowValue) + '%'"></div>
                    </div>
                    <div class="flexListBlockName">
                      <span class="inlineBlock lightFont minFont">
                        <Tooltip transfer :content="item.sectionName" placement="bottom">{{ item.sectionName.slice(0, 6) }}</Tooltip>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 流量排行 -->
            <div class="flexItems">
              <div class="flexItemsWrapper">
                <div class="statisticsBlock paddingBottom6 paddingTop6">
                  <span class="inlineBlock bigFont">流速排行</span>
                  <span class="inlineBlock trend normalTrend" @click="changeSpeedRankSort">
                    <i :class="['icons', { up: speedRankSort == 'up' }, { down: speedRankSort == 'down' }]"></i>
                  </span>
                </div>
                <div class="flexList rankHeight paddingTop6">
                  <div class="flexListBlock" v-for="(item, index) in speedRankStation" :key="index">
                    <div class="flexListBlockData boldFont">
                      <span class="inlineBlock">{{ Number(item.speed).toFixed(2) }}</span>
                      <span class="inlineBlock">km/h</span>
                    </div>
                    <div class="processStatus">
                      <div class="speedProcess" :style="'width:' + Number(Number(item.speed).toFixed(2) / maxSpeedValue).toFixed(4) * 100 + '%'"></div>
                    </div>
                    <div class="flexListBlockName">
                      <span class="inlineBlock lightFont minFont">
                        <Tooltip transfer :content="item.sectionName" placement="bottom">{{ item.sectionName.slice(0, 10) }}</Tooltip>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 系统状态监控 -->
      <div class="part leftBottomPart">
        <div class="partTitle">
          <div class="names">系统状态监控</div>
          <div class="showMore">
            <div class="showMoreBlock" @click="showAllMonitor">更多</div>
          </div>
        </div>
        <div class="partMains">
          <div class="partContent">
            <div class="flexBox">
              <!-- 监控总时长 -->
              <div class="flexItems">
                <div class="flexItemsWrapper">
                  <div class="showDataTitle">
                    <span class="inlineBlock grayFont">监控总时长</span>
                  </div>
                  <div class="showBlock">
                    <span class="inlineBlock blueFont">{{ monitorTime }}</span>
                    <span class="inlineBlock blueFont">小时</span>
                  </div>
                </div>
              </div>
              <!-- 视频设备 -->
              <div class="flexItems">
                <div class="flexItemsWrapper">
                  <div class="showDataTitle">
                    <span class="inlineBlock grayFont">接入视频设备</span>
                  </div>
                  <div class="showBlock">
                    <span class="inlineBlock blueFont">{{ viodeoDevice }}</span>
                    <span class="inlineBlock blueFont">个</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 视频分析服务器 -->
          <div class="partContent">
            <div class="flexBox">
              <div class="flexItems">
                <div class="flexItemsWrapper">
                  <div class="showDataTitle">
                    <span class="inlineBlock grayFont">视频分析服务器</span>
                  </div>
                  <div class="showBlock">
                    <span class="inlineBlock blueFont">{{ videoServer }}</span>
                    <span class="inlineBlock blueFont">台</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="partContent">
            <div class="flexBox">
              <div class="flexItems">
                <div class="flexItemsWrapper">
                  <div class="statisticsBlock">
                    <span class="inlineBlock bigFont blueFont">{{ serverStuts }}</span>
                  </div>
                  <div class="statisticsBlock">
                    <span class="inlineBlock grayFont showArrow">服务器状态</span>
                  </div>
                </div>
              </div>
              <div class="flexItems">
                <div class="flexItemsWrapper">
                  <div class="statisticsBlock">
                    <span class="inlineBlock bigFont greenFont">{{ viodeoHealthy }}</span>
                  </div>
                  <div class="statisticsBlock">
                    <span class="inlineBlock grayFont showArrow">设备健康度</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="rightPart">
      <div class="part rightTopPart">
        <div class="partTitle">
          <div class="names">事件处理结果统计</div>
          <div class="filters">
            <div class="filterBlock">{{ eventsCorrent | selectTime }}</div>
            <div class="dropDown">
              <div class="filterItems" @click="changeEvensStatistics('today')">
                今日
              </div>
              <div class="filterItems" @click="changeEvensStatistics('week')">
                近一周
              </div>
              <div class="filterItems" @click="changeEvensStatistics('month')">
                近一月
              </div>
            </div>
          </div>
        </div>
        <div class="graphical" ref="trafficEvent"></div>
      </div>
      <div class="part rightCenterPart">
        <div class="partTitle">
          <div class="names">新增交通事件</div>
          <div class="showMore">
            <div class="showMoreBlock" @click="showAllEvents">全部</div>
          </div>
        </div>
        <div class="partContent">
          <div class="list">
            <div class="listItem" v-for="item in newEvents" :key="item.id" @mouseenter="handleEventMouseEnter(item)" @mouseleave="handleEventMouseLeave(item)">
              <div class="block">
                <span class="inlineBlock minFont">{{ item.date }} {{ item.time }}</span>
                <span :class="['inlineBlock', 'minFont', { errorFont: item.status == 0 }]">{{ item.status | statusFilter }}</span>
              </div>
              <div class="block">
                <span class="inlineBlock minFont">节点:</span>
                <span class="inlineBlock minFont">{{ item.node_name }}</span>
                <span class="inlineBlock minFont">视频:</span>
                <span class="inlineBlock minFont">{{ item.video_name }}</span>
              </div>
              <div class="block">
                <span class="inlineBlock minFont">路段:</span>
                <span class="inlineBlock minFont">{{ item.path_line_name }}</span>
                <span class="inlineBlock minFont">类型:</span>
                <span class="inlineBlock minFont">{{ item.event_type_name }}</span>
              </div>
              <div class="handle">
                <span class="handleBtn ignore" @click.stop="viewNodeEvents(item.id, 1)">处理</span>
              </div>
              <!-- <div class="handle" v-if="item.status == 0 || item.update">
                    <span class="handleBtn correct" @click.stop="upEventStatus(item,1)">正报</span>
                    <span class="handleBtn mistake" @click.stop="upEventStatus(item,2)">误报</span>
                    <span class="handleBtn ignore" @click.stop="upEventStatus(item,3)">忽略</span>
                  </div>
                  <div class="handle" v-else>
                    <span class="handleBtn correct" @click.stop="upEventStatus(item,4)">修改</span>
              </div>-->
            </div>
          </div>
        </div>
      </div>
      <div class="part rightBottomPart">
        <div class="partTitle">
          <div class="names">事件类型分析</div>
          <div class="filters">
            <div class="filterBlock">{{ trafficTypeCorrent | selectTime }}</div>
            <div class="dropDown">
              <div class="filterItems" @click="changeEvensType('today')">
                今日
              </div>
              <div class="filterItems" @click="changeEvensType('week')">
                近一周
              </div>
              <div class="filterItems" @click="changeEvensType('month')">
                近一月
              </div>
            </div>
          </div>
        </div>
        <div class="graphical" ref="trafficType"></div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="bottomPart">
      <div class="bottomFlex" v-show="selectStation == 0">
        <div class="bottomFlexItem">
          <div class="bottomFlexWrapper">
            <div class="block centerText titleBlock">
              <div class="leftBlock">
                <span class="inlineBlock minFont">选择路段：</span>
                <span class="inlineBlock minFont blueFont">{{ pathSpeedFlow.pathLineName }}</span>
              </div>
              <span class="inlineBlock boldFont titleFont">路段流量流速</span>
              <div class="rightBlock">
                <!-- <span class="inlineBlock minFont">高速路：</span> -->
                <span class="inlineBlock minFont yellowFont">{{ pathSpeedFlow.parentName }}</span>
              </div>
            </div>
            <div class="tabs">
              <span :class="['tabBlock', { activeBlock: statisticsCurrent == '3h' }]" @click="changesStatisticsCurrent('3h')">近3小时</span>
              <span :class="['tabBlock', { activeBlock: statisticsCurrent == '6h' }]" @click="changesStatisticsCurrent('6h')">近6小时</span>
              <span :class="['tabBlock', { activeBlock: statisticsCurrent == 'today' }]" @click="changesStatisticsCurrent('today')">今日</span>
              <span :class="['tabBlock', { activeBlock: statisticsCurrent == 'week' }]" class="tabBlock" @click="changesStatisticsCurrent('week')">近一周</span>
              <span :class="['tabBlock', { activeBlock: statisticsCurrent == 'month' }]" class="tabBlock" @click="changesStatisticsCurrent('month')">近一月</span>
              <span :class="['filterBlock', { activeBlock: statisticsCurrent == 'customize' }]" @click="changesStatisticsCurrent('customize')">
                自定义
                <span class="down"></span>
                <div class="filters" @click.stop v-show="customizeQuery">
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
                        @on-change="changeStatisticsParam"
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
                        @on-change="changeStatisticsParam"
                      ></DatePicker>
                    </div>
                    <div class="filterItems">
                      时间刻度:
                      <Select v-model="pathSpeedFlow.timedensity" style="width: 180px" placeholder="时间刻度" filterable clearable @on-change="changeStatisticsParam">
                        <Option v-for="(item, index) in timedensityList" :value="item.value" :key="index">{{ item.label }}</Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </span>
            </div>
            <!-- <div
              class="noData largeFont errorFont defaultNoDate"
              v-show="!showLineStatictis"
            >
              {{ pathSpeedFlow.pathLineId ? "无数据" : "请点击选择路段" }}
            </div> -->
            <div class="flowDate" ref="flowDate"></div>
          </div>
        </div>
      </div>
      <div class="bottomFlex" v-show="selectStation != 0">
        <div class="bottomFlexItem">
          <div class="bottomFlexWrapper">
            <div class="block centerText titleBlock">
              <div class="leftBlock">
                <span class="inlineBlock minFont">区间：</span>
                <span class="inlineBlock minFont blueFont">{{ sectionName }}</span>
              </div>
              <span class="inlineBlock boldFont titleFont">区间流量流速</span>
            </div>
            <div class="tabs">
              <span :class="['tabBlock', { activeBlock: statisticsCurrentSection == '3h' }]" @click="changesStatisticsCurrentSection('3h')">近3小时</span>
              <span :class="['tabBlock', { activeBlock: statisticsCurrentSection == '6h' }]" @click="changesStatisticsCurrentSection('6h')">近6小时</span>
              <span :class="['tabBlock', { activeBlock: statisticsCurrentSection == 'today' }]" @click="changesStatisticsCurrentSection('today')">今日</span>
              <span :class="['tabBlock', { activeBlock: statisticsCurrentSection == 'week' }]" class="tabBlock" @click="changesStatisticsCurrentSection('week')">近一周</span>
              <span :class="['tabBlock', { activeBlock: statisticsCurrentSection == 'month' }]" class="tabBlock" @click="changesStatisticsCurrentSection('month')">近一月</span>
              <span :class="['filterBlock', { activeBlock: statisticsCurrentSection == 'customize' }]" @click="changesStatisticsCurrentSection('customize')">
                自定义
                <span class="down"></span>
                <div class="filters" @click.stop v-show="customizeQuerySection">
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
                        @on-change="changeStatisticsSectionParam"
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
                        @on-change="changeStatisticsSectionParam"
                      ></DatePicker>
                    </div>
                    <div class="filterItems">
                      时间刻度:
                      <Select v-model="sectionFlow.timedensity" style="width: 180px" placeholder="时间刻度" filterable clearable @on-change="changeStatisticsSectionParam">
                        <Option v-for="(item, index) in timedensityList" :value="item.value" :key="index">{{ item.label }}</Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </span>
            </div>
            <div class="noData largeFont errorFont defaultNoDate" v-show="!showLineStatictis">
              <!-- {{ pathSpeedFlow.pathLineId ? "无数据" : "请选择区间" }} -->
            </div>
            <div class="sectionDate" ref="sectionDate"></div>
          </div>
        </div>
      </div>
    </div>
    <Modal title="事件详情" :width="hasRelation ? 1488 : 750" mask-closable footer-hide scrollable v-model="showEventDetail" class-name="vertical-center-modal" @on-visible-change="showEventDetailChange">
      <event-detail data-action :BindData="selectedEvent" :drawerStatus="showEventDetail" @dataChange="changeEventStatus" @relation="changeRelationStatus" @nextData="showNextData"></event-detail>
    </Modal>
  </div>
</template>

<script>
import flowApi from '@/api/flow'
import { registerTheme, Chart } from '@antv/g2'
import Ajax from '@/api/tools/customajax'
import { API_BASEURL, API_TIMEOUT } from '@/utils/config'
import G6 from '@antv/g6'
import eventDetail from '@/views/events/detail.vue'
import * as maptalks from 'maptalks'
import { MAP_SERVER, MAP_TYPE } from './config'

const lineDash = [4, 2, 1, 2]
// 注册名为 'circle-running' 的边
G6.registerEdge(
  'circle-running',
  {
    afterDraw (cfg, group) {
      let speed = cfg.speed ? Number(cfg.speed) : 1
      if (speed <= 0) speed = 1
      // 获得当前边的第一个图形，这里是边本身的 path
      const shape = group.get('children')[0]
      // 边 path 的起点位置
      const startPoint = shape.getPoint(0)

      // 添加红色 circle 图形
      const circle = group.addShape('circle', {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: '#3a5cff',
          r: 16
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: 'circle-shape'
      })

      // 对红色圆点添加动画
      circle.animate(
        ratio => {
          // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
          // 根据比例值，获得在边 path 上对应比例的位置。
          const tmpPoint = shape.getPoint(ratio)
          // 返回需要变化的参数集，这里返回了位置 x 和 y
          return {
            x: tmpPoint.x,
            y: tmpPoint.y
          }
        },
        {
          repeat: true, // 动画重复
          duration: 10000 / speed
        }
      ) // 一次动画的时间长度
    }
  },
  'quadratic'
) // 该自定义边继承了内置贝塞尔曲线边 quadratic

export default {
  data () {
    return {
      map: null, // 地图
      gLayer: null,
      gLineMaps: {},
      value: 0,
      nodeSite: {},
      selectEdgesId: '',
      sectionName: '',
      stationList: [],
      selectStation: 0,
      playCurrow: 0,
      tabActive: 0,
      swiperOption: {
        // 所有配置均为可选（同Swiper配置）
        initialSlide: 0,
        pagination: '.swiper-pagination', // 这里修改
        // pagination: {
        //  el: '.swiper-pagination'
        // },
        loop: true,
        speed: 400,
        direction: 'horizontal',
        paginationClickable: true,
        mousewheelControl: true,
        autoplay: 1000, // 这里修改
        // autoplay: true,
        autoplayDisableOnInteraction: false,
        observer: true,
        observeParents: true,
        debugger: true,
        onTransitionStart (swiper) {}
      },

      dataChanged: false,
      hasRelation: false,
      selectedEvent: {},
      showLineStatictis: false,
      customizeQuery: false,
      customizeQuerySection: false,
      timedensityList: [
        { label: '5分钟', value: 5 },
        { label: '10分钟', value: 10 },
        { label: '15分钟', value: 15 },
        { label: '30分钟', value: 30 },
        { label: '1小时', value: 60 },
        { label: '2小时', value: 60 * 2 },
        { label: '4小时', value: 60 * 4 },
        { label: '8小时', value: 60 * 8 },
        { label: '天', value: 60 * 24 }
      ],
      flowRankSort: 'down',
      speedRankSort: 'down',
      statisticsCurrent: '3h',
      statisticsCurrentSection: '3h',
      eventsCorrent: 'today',
      trafficTypeCorrent: 'today',
      speedFlowHistoryRank: 'today',
      eventsStatistics: null,
      trafficTypeChart: null,
      graphImg: null,
      pathSpeedFlow: {
        parentName: '',
        pathLineName: '',
        pathLineId: '',
        startTime: this.dateTo('3h', 'YYYY-MM-DD HH:mm:ss'),
        endTime: this.dateTo('now', 'YYYY-MM-DD HH:mm:ss'),
        timedensity: 30
      },
      sectionFlow: {
        sectionId: '',
        startTime: this.dateTo('3h', 'YYYY-MM-DD HH:mm:ss'),
        endTime: this.dateTo('now', 'YYYY-MM-DD HH:mm:ss'),
        timedensity: 30
      },
      serverStuts: '正常',
      // videoHealthy:'100%',
      monitorTime: 0, // 监控总时长
      monitorNumber: 0,
      viodeoDevice: 0,
      viodeoHealthy: '',
      videoServer: 0,
      speedRank: [],
      flowRank: [],
      speedRankStation: [],
      flowRankStation: [],
      allFlow: 0,
      allSpeed: 0,
      pathLines: [],
      pathLineItemIndex: 0,
      pathLineItem: {},
      allEvents: 0,
      newEvents: [],
      topography: {
        nodes: [],
        edges: []
      },
      // 当前选择事件
      trafficEventParam: {
        startTime: this.dateTo('today', 'YYYY-MM-DD HH:mm:ss'),
        endTime: this.dateTo('now', 'YYYY-MM-DD HH:mm:ss')
      },
      trafficEventData: [],
      trafficTypeParam: {
        startTime: this.dateTo('today', 'YYYY-MM-DD HH:mm:ss'),
        endTime: this.dateTo('now', 'YYYY-MM-DD HH:mm:ss')
      },
      trafficTypeData: [],
      trafficType: {
        today: [],
        week: [],
        month: []
      },
      resizeWaiter: false,
      chartData: [],
      sectionData: [],
      chartCtl: null,
      sectionCtl: null,
      autoTimer: null,
      pathLineTimer: null,
      showNodeEvents: false,
      selectedNodeTitle: '',
      selectedNode: null,
      nodeEventData: {},
      nodeEventStyle: {
        x: 0,
        y: 0
      },
      nodeEventCount: 0,
      nodeEventParam: {
        page: 1,
        length: 1,
        node_name: '',
        alarm_status: '0'
      },
      eventDetail: {},
      eventDetailMode: false,
      area_pause_time_Text: '未暂停',
      video_pause_time_Text: '未中止',
      showEventDetail: false,
      playerOptions: {
        techOrder: ['html5'],
        preload: 'auto',
        sourceOrder: true,
        sources: [],
        aspectRatio: '16:9',
        height: 350,
        autoplay: false,
        controls: true,
        language: 'zh-CN',
        fluid: true,
        notSupportedMessage: '此视频暂无法播放，请稍后再试'
      },
      maxFlowValue: 0,
      maxSpeedValue: 0,
      maxFlowValueStation: 0,
      maxSpeedValueStation: 0
    }
  },
  components: {
    eventDetail
  },
  props: {
    refreshData: {
      type: String,
      default: ''
    },
    changeData: {
      type: Object
    }
  },
  watch: {
    'changeData.date': {
      handler (data) {
        if (this.changeData.type == 1) {
          this.handleAutoLoadData()
        }
        if (this.changeData.type == 2) {
          this.getNewEvents()
          this.initTrafficEvent()
          this.initTrafficType()
        }
        if (this.changeData.type == 3) {
          this.getWarningInfo()
        }
        if (this.changeData.type == 4) {
          this.overviewItem()
        }
      }
    }
  },
  beforeDestroy () {
    if (this.pathLineTimer) {
      clearInterval(this.pathLineTimer)
      this.pathLineTimer = null
    }
    if (this.autoTimer) {
      clearInterval(this.autoTimer)
      this.autoTimer = null
    }
  },
  computed: {
    getIcons () {
      let icons = 'jam'
      if (this.nodeEventData && this.nodeEventData.event_type) {
        switch (this.nodeEventData.event_type) {
          case '1':
            icons = 'jam'
            break
          case '11':
            icons = 'throwing'
            break
          case '12':
            icons = 'away'
            break
          case '2':
            icons = 'parking'
            break
          case '4':
            icons = 'retrograde'
            break
          case '5':
            icons = 'pedestrian'
            break
          case '7':
            icons = 'non-motorized'
            break
          case '13':
            icons = 'smoke'
            break
        }
      }

      return icons
    },
    paramTimeSpan () {
      let timeSpan = 0
      if (this.selectStation == 0) {
        if (this.pathSpeedFlow.startTime && this.pathSpeedFlow.endTime) {
          timeSpan = new Date(this.pathSpeedFlow.endTime) - new Date(this.pathSpeedFlow.startTime)
        }
      } else {
        if (this.sectionFlow.startTime && this.sectionFlow.endTime) {
          timeSpan = new Date(this.sectionFlow.endTime) - new Date(this.sectionFlow.startTime)
        }
      }
      return timeSpan / 1000 / 60 / 60
    },
    pathSpeedFlowStartOptions () {
      let self = this
      let options = {
        disabledDate (date) {
          return date.valueOf() > new Date(self.pathSpeedFlow.endTime)
        }
      }
      return options
      // this.statisticParam.startTime;
    },
    pathSpeedFlowStartOptionsSection () {
      let self = this
      let options = {
        disabledDate (date) {
          return date.valueOf() > new Date(self.sectionFlow.endTime)
        }
      }
      return options
      // this.statisticParam.startTime;
    },
    pathSpeedFlowEndOptions () {
      let self = this
      let options = {
        disabledDate (date) {
          return date.valueOf() < new Date(self.$moment(self.pathSpeedFlow.startTime).format('YYYY-MM-DD 00:00:00'))
        }
      }
      return options
    },
    pathSpeedFlowEndOptionsSection () {
      let self = this
      let options = {
        disabledDate (date) {
          return date.valueOf() < new Date(self.$moment(self.sectionFlow.startTime).format('YYYY-MM-DD 00:00:00'))
        }
      }
      return options
    },
    // 今日
    today () {
      let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      // let startTime = endTime - 86400000;
      let startTime = this.dateTo('today', 'YYYY-MM-DD HH:mm:ss')
      return 'startTime=' + startTime + '&endTime=' + endTime
    },
    // 近一周
    oneWeek () {
      let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      let startTime = this.dateTo('week', 'YYYY-MM-DD HH:mm:ss')
      return 'startTime=' + startTime + '&endTime=' + endTime
    },
    // 近一月
    oneMonth () {
      let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      let startTime = this.dateTo('month', 'YYYY-MM-DD HH:mm:ss')
      return 'startTime=' + startTime + '&endTime=' + endTime
    },

    maxSpeed () {
      let speed = 0
      if (this.speedRank && this.speedRank.length > 0) {
        // if (this.speedRankSort == "down")
        speed = this.speedRank[0].speed
        // else
        //  speed = this.speedRank[this.speedRank.length - 1].speed;
      }
      return Number(speed).toFixed(2)
    },
    maxFlow () {
      let flow = 0
      if (this.flowRank && this.flowRank.length > 0) {
        // if (this.flowRankSort == "down")
        flow = this.flowRank[0].flow
        // else
        //  flow = this.flowRank[this.flowRank.length - 1].flow;
      }
      return Number(flow).toFixed(2)
    },
    maxSpeedPathLine () {
      let line = ''
      if (this.speedRank && this.speedRank.length > 0) {
        // if (this.flowRankSort == "down")
        line = this.speedRank[0].path_line_name
        // else line = this.speedRank[this.speedRank.length - 1].path_line_name;
      }
      return line
    },
    maxSpeedPathName () {
      let line = ''
      if (this.speedRank && this.speedRank.length > 0) {
        // if (this.flowRankSort == "down")
        line = this.speedRank[0].parent_name
        // else line = this.speedRank[this.speedRank.length - 1].path_line_name;
      }
      return line
    },
    maxFlowPathLine () {
      let line = ''
      if (this.flowRank && this.flowRank.length > 0) {
        // if (this.flowRankSort == "down")
        line = this.flowRank[0].path_line_name
        // else
        //  line = this.flowRank[this.flowRank.length - 1].path_line_name;
      }
      return line
    },
    maxFlowPathName () {
      let line = ''
      if (this.flowRank && this.flowRank.length > 0) {
        // if (this.flowRankSort == "down")
        line = this.flowRank[0].parent_name
        // else
        //  line = this.flowRank[this.flowRank.length - 1].path_line_name;
      }
      return line
    },
    // 按区间最大流量流速
    maxSpeedStation () {
      let speed = 0
      if (this.speedRankStation && this.speedRankStation.length > 0) {
        // if (this.speedRankSort == "down")
        speed = this.speedRankStation[0].speed
        // else
        //  speed = this.speedRank[this.speedRank.length - 1].speed;
      }
      return Number(speed).toFixed(2)
    },
    maxFlowStation () {
      let flow = 0
      if (this.flowRankStation && this.flowRankStation.length > 0) {
        // if (this.flowRankSort == "down")
        flow = this.flowRankStation[0].flow
        // else
        //  flow = this.flowRank[this.flowRank.length - 1].flow;
      }
      return Number(flow).toFixed(2)
    },
    // 按区间最大流量流速线路名称

    maxSpeedPathNameStation () {
      let line = ''
      if (this.speedRankStation && this.speedRankStation.length > 0) {
        // if (this.flowRankSort == "down")
        line = this.speedRankStation[0].sectionName
        // else line = this.speedRank[this.speedRank.length - 1].path_line_name;
      }
      return line
    },
    maxFlowPathNameStation () {
      let line = ''
      if (this.flowRankStation && this.flowRankStation.length > 0) {
        // if (this.flowRankSort == "down")
        line = this.flowRankStation[0].sectionName
        // else
        //  line = this.flowRank[this.flowRank.length - 1].path_line_name;
      }
      return line
    }
  },
  filters: {
    // 时间过滤
    selectTime (msg) {
      if (msg == 'today') {
        return '今日'
      } else if (msg == 'week') {
        return '近一周'
      } else if (msg == 'month') {
        return '近一月'
      }
    },
    statusFilter (v) {
      if (v == 0) {
        return '未处理'
      } else if (v == 1) {
        return '正报'
      } else if (v == 2) {
        return '误报'
      } else {
        return '忽略'
      }
    },
    statementFilter (val) {
      let returnVal = ''
      if (val && val.indexOf('事件类型:') > -1) {
        returnVal = val.substring(val.indexOf('事件类型:'))
      }
      return returnVal
    },
    statementSubStr (val) {
      let returnVal = ''
      if (val && val.indexOf('事件类型:') > -1) {
        returnVal = val.substring(val.indexOf('事件类型:') + 5)
      }
      return returnVal
    }
  },
  created () {
    this.loadFlow(true)
    this.overviewItem()
    // 获取当前时间
    this.getNowTime()
    // 流量流速排名
    this.initSpeedFlowHistoryRank()
    this.initSpeedFlowHistoryRankForStation()
    // 服务设备状态查询
    this.getWarningInfo()
    // 请求节点
    this.getNodeSite()
  },
  mounted () {
    // 获取所有区间
    this.getAllStation()
    //  this.swiper.slideTo(1, 1000, false)
    this.initTrafficEvent(true)
    this.initTrafficType(true)
    this.initFlowDate()
    // this.initTop();
    this.getNewEvents()

    window.onresize = () => {
      if (!this.resizeWaiter) {
        this.resizeWaiter = true
        setTimeout(() => {
          this.initTop()
          this.resizeWaiter = false
        }, 1000)
      }
    }
  },
  methods: {
    // 获取所有区间
    getAllStation () {
      Ajax.post(API_BASEURL + '/querySectionRoad').then(response => {
        if (response.status == 200) {
          this.stationList = response.data.Data
        }
      })
    },
    changeTab (n) {
      this.tabActive = n
    },
    clearStation () {
      this.selectStation = 0
      this.sectionFlow.sectionId = ''
      this.topography.edges.forEach(item => {
        item.style.stroke = '#303759'
        if (item.exist) {
          item.type = 'circle-running'
          if (item.speed == 1) {
            item.style.stroke = '#2344e8'
          } else if (item.speed == 2) {
            item.style.stroke = '#ffd84e'
          } else if (item.speed == 3) {
            item.style.stroke = '#ee5555'
          }
        }
      })
      this.graphImg.changeData(this.topography)
    },
    changeStation (obj, idx) {
      if (this.sectionFlow.sectionId == obj.sectionId) {
        this.sectionFlow.sectionId = ''
        this.selectStation = 0
        this.clearStation()
      } else {
        this.sectionName = obj.sectionName
        this.selectStation = idx + 1
        let selectData = {
          nodes: this.topography.nodes,
          edges: this.topography.edges
        }
        for (let i = 0; i < selectData.edges.length; i++) {
          let strokeColor = null
          if (selectData.edges[i].sectionId == obj.sectionId) {
            strokeColor = '#04d518'
          } else {
            // strokeColor = '#303759'
            strokeColor = '#B0C4DE'
            if (selectData.edges[i].exist) {
              selectData.edges[i].type = 'circle-running'
              if (selectData.edges[i].speed == 1) {
                strokeColor = '#2344e8'
              } else if (selectData.edges[i].speed == 2) {
                strokeColor = '#ffd84e'
              } else if (selectData.edges[i].speed == 3) {
                strokeColor = '#ee5555'
              }
            }
          }
          if (strokeColor !== null) {
            // 拓扑图更新
            selectData.edges[i].style.stroke = strokeColor
            // 地图更新
            // this.gLayer.filter(['==', 'oid', selectData.edges[i].id])
            //   .forEach(function (feature) {
            //     console.log(feature, 'feature')
            //     feature.updateSymbol({
            //       'lineColor': strokeColor
            //     })
            //   })
            const gLine = this.gLineMaps[selectData.edges[i].id]
            gLine.updateSymbol({
              lineColor: strokeColor
            })
          }
        }
        this.sectionFlow.sectionId = obj.sectionId
        this.getSectionSpeedFlow()
        this.graphImg.changeData(selectData)
      }
    },
    // 定时刷新页面数据
    handleAutoLoadData () {
      // if (this.pathLineTimer) {
      //   clearInterval(this.pathLineTimer);
      //   this.pathLineTimer = null;
      // }
      // 总览
      this.overviewItem()
      // 系统状态
      // this.getWarningInfo();
      // 拓扑图数据
      this.loadFlow(false)
      // 流量流速排名
      // this.initSpeedFlowHistoryRank();
      // 事件处理结果统计
      this.initTrafficEvent()
      // 事件类型分析
      this.initTrafficType()
      // 最新事件
      this.getNewEvents()
    },
    // 格式化状态
    formatStatus (v) {
      if (v == 0) {
        return '未处理'
      } else if (v == 1) {
        return '正报'
      } else if (v == 2) {
        return '误报'
      } else {
        return '忽略'
      }
    },
    changeFlowRankSort () {
      if (this.flowRankSort == 'up') {
        this.flowRankSort = 'down'
      } else {
        this.flowRankSort = 'up'
      }
      this.flowRank = this.flowRank.reverse()
    },
    changeSpeedRankSort () {
      if (this.speedRankSort == 'up') {
        this.speedRankSort = 'down'
      } else {
        this.speedRankSort = 'up'
      }
      this.speedRank = this.speedRank.reverse()
    },
    objToStr (obj) {
      let paramArr = Object.keys(obj).reduce((acc, cur) => {
        if (obj[cur] !== '' && obj[cur] != undefined) {
          acc.push(cur + '=' + obj[cur])
        }
        return acc
      }, [])
      return paramArr.join('&')
    },
    //  获取当前时间
    getNowTime () {
      Ajax.post(API_BASEURL + '/getNowTime').then(response => {
        if (response.status == 200) {
          return new Date(response.data.thisTime).getTime()
        }
      })
    },
    // 时间格式化
    dateTo (d, formart) {
      let dataTime = ''
      let newDate = new Date()
      var nowDayOfWeek = newDate.getDay() - 1
      if (nowDayOfWeek < 0) nowDayOfWeek = 6
      switch (d) {
        case 'now':
          dataTime = this.$moment().format(formart)
          break
        case '3h':
          dataTime = this.$moment()
            .add(-3, 'h')
            .format(formart)
          break
        case '6h':
          dataTime = this.$moment()
            .add(-6, 'h')
            .format(formart)
          break
        case 'today':
          dataTime = this.$moment().format('YYYY-MM-DD 00:00:00')
          break
        case 'week':
          dataTime = this.$moment()
            .add(-7, 'd')
            .format('YYYY-MM-DD 00:00:00')
          break
        case 'month':
          dataTime = this.$moment()
            .add(-1, 'M')
            .format('YYYY-MM-DD 00:00:00')
          break
        // case "week":
        //   dataTime = this.$moment()
        //     .add(-nowDayOfWeek, "d")
        //     .format("YYYY-MM-DD 00:00:00");
        //   break;
        // case "month":
        //   dataTime = this.$moment().format("YYYY-MM-01 00:00:00");
        //   break;
      }
      return dataTime
    },
    // 加载所有线路和点
    loadFlow (init) {
      let self = this
      self.topography.edges = []
      self.topography.nodes = []
      flowApi.getNodeSite().then(response => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            let flowData = response.data.Data
            flowData.nodes.forEach(item => {
              // areaNodes.forEach((item) => {
              let video = item.videos[0] || ''
              let nodeItem = {
                id: item.node_id,
                label: item.node_name,
                name: item.node_name,
                x: JSON.parse(item.canvas_position).x,
                y: JSON.parse(item.canvas_position).y,
                type: 'background-animate',
                video: video,
                unhandle: video ? video.unhandle : false,
                isEnd: video ? video.isEnd : true
              }
              if (video) {
                // 有摄像头
                nodeItem.icon = {
                  show: true,
                  img: 'static/images/videoIcon.svg',
                  width: 96,
                  height: 96
                }
                if (video.unhandle && video.isEnd) {
                  // 存在未处理及已结束
                  nodeItem.style = {
                    fill: '#ff9900', // 节点填充色
                    lineDash: false,
                    cursor: 'pointer'
                  }
                } else if (video.unhandle && !video.isEnd) {
                  // 存在未处理及未结束
                  nodeItem.style = {
                    fill: '#ee5555', // 节点填充色
                    lineDash: false,
                    cursor: 'pointer'
                  }
                } else {
                  // 全部已处理
                  nodeItem.style = {
                    fill: '#3a5cff', // 节点填充色
                    lineDash: false,
                    cursor: 'pointer'
                  }
                }
                if (!video.is_detection) {
                  // 设备停止检测
                  nodeItem.type = 'circle'
                  nodeItem.icon = {
                    show: true,
                    img: 'static/images/videoIconGray.svg',
                    width: 96,
                    height: 96
                  }
                }
              } else {
                // 节点无摄像头
                nodeItem.type = 'circle'
                nodeItem.style = {
                  fill: '#3148b6', // 节点填充色
                  lineDash: false,
                  cursor: 'pointer'
                }
              }
              self.topography.nodes.push(nodeItem)
            })
            flowData.path_lines.forEach(item => {
              // areaLines.forEach((item) => {
              let lineItem = {
                source: item.from_node_id,
                target: item.to_node_id,
                flow: item.flow_count,
                speed: item.flow_speed,
                parentName: item.parent_name,
                name: item.path_line_name,
                exist: item.flow_speed_exist, // 是否存在流量流速
                id: item.id,
                sectionId: item.sectionId,
                sectionName: item.sectionName,
                activeStatus: false,
                style: {
                  lineWidth: 16,
                  lineAppendWidth: 24,
                  stroke: '#303759',
                  endArrow: false,
                  cursor: 'pointer',
                  strokeOpacity: 1 // 透明度
                }
              }

              if (lineItem.exist) {
                lineItem.type = 'circle-running'
                if (lineItem.speed == 1) {
                  lineItem.style.stroke = '#2344e8'
                } else if (lineItem.speed == 2) {
                  lineItem.style.stroke = '#ffd84e'
                } else if (lineItem.speed == 3) {
                  lineItem.style.stroke = '#ee5555'
                }
              }
              self.topography.edges.push(lineItem)
            })
            self.initTop()
          } else {
            this.$Message.error({
              content: response.data.Msg
            })
          }
        }
      })
    },
    setPathLineTimer () {
      if (!this.pathLineTimer) {
        this.pathLineTimer = setInterval(() => {
          this.pathLineItemIndex = this.pathLineItemIndex + 1
          if (this.pathLineItemIndex >= this.pathLines.length) {
            this.pathLineItemIndex = 0
          }
          this.pathLineItem = this.pathLines[this.pathLineItemIndex]
        }, 5000)
      }
    },
    // 总览数据
    overviewItem () {
      let flow = 0
      let speed = 0
      Ajax.post(API_BASEURL + '/getEntirePathSpeedFlow?' + this.today).then(response => {
        if (response.status == 200) {
          this.pathLines = response.data.Data
          this.pathLineItemIndex = 0
          this.pathLineItem = this.pathLines
        }
      })

      // 获取今日事件数量
      Ajax.post(API_BASEURL + '/getDetectionClassStatistics?' + this.today).then(response => {
        if (response.status == 200) {
          let dataIndex = response.data.Data.findIndex(item => {
            return item.detection_type == '上报总数'
          })
          if (dataIndex > -1) {
            let item = response.data.Data[dataIndex]
            this.allEvents = item.data_count
          }
        }
      })
      Ajax.post(API_BASEURL + '/getDetectionHoursAndCount').then(response => {
        if (response.status == 200) {
          // 监控总时长
          this.monitorTime = response.data.Data.preset_duration
          // 监控路数
          this.viodeoDevice = response.data.Data.preset_count
        }
      })
    },
    changesStatisticsCurrent (d) {
      console.log(d, '@@@')
      this.statisticsCurrent = d
      this.pathSpeedFlow.endTime = this.dateTo('now', 'YYYY-MM-DD HH:mm:ss')
      switch (d) {
        case '3h':
        case '6h':
          this.pathSpeedFlow.startTime = this.dateTo(d, 'YYYY-MM-DD HH:mm:ss')
          this.pathSpeedFlow.timedensity = 30
          break
        case 'today':
          this.pathSpeedFlow.startTime = this.dateTo(d, 'YYYY-MM-DD HH:mm:ss')
          this.pathSpeedFlow.timedensity = 60
          break
        case 'week':
          this.pathSpeedFlow.startTime = this.dateTo(d, 'YYYY-MM-DD HH:mm:ss')
          this.pathSpeedFlow.timedensity = 60 * 24
          break

        case 'month':
          this.pathSpeedFlow.startTime = this.dateTo(d, 'YYYY-MM-DD HH:mm:ss')
          this.pathSpeedFlow.timedensity = 60 * 24
          break
      }
      if (this.statisticsCurrent != 'customize') {
        this.customizeQuery = false
        this.getPathSpeedFlow()
      } else this.customizeQuery = !this.customizeQuery
    },
    changesStatisticsCurrentSection (d) {
      console.log(d, '$$$')
      this.statisticsCurrentSection = d
      this.sectionFlow.endTime = this.dateTo('now', 'YYYY-MM-DD HH:mm:ss')
      switch (d) {
        case '3h':
        case '6h':
          this.sectionFlow.startTime = this.dateTo(d, 'YYYY-MM-DD HH:mm:ss')
          this.sectionFlow.timedensity = 30
          break
        case 'today':
          this.sectionFlow.startTime = this.dateTo(d, 'YYYY-MM-DD HH:mm:ss')
          this.sectionFlow.timedensity = 60
          break
        case 'week':
          this.sectionFlow.startTime = this.dateTo(d, 'YYYY-MM-DD HH:mm:ss')
          this.sectionFlow.timedensity = 60 * 24
          break

        case 'month':
          this.sectionFlow.startTime = this.dateTo(d, 'YYYY-MM-DD HH:mm:ss')
          this.sectionFlow.timedensity = 60 * 24
          break
      }
      if (this.statisticsCurrentSection != 'customize') {
        this.customizeQuerySection = false
        this.getSectionSpeedFlow()
      } else this.customizeQuerySection = !this.customizeQuerySection
    },
    changeStatisticsParam () {
      this.getPathSpeedFlow()
    },
    changeStatisticsSectionParam () {
      this.getSectionSpeedFlow()
    },
    formatWeekTitle (weekNum) {
      let title = ''
      switch (weekNum) {
        case 1:
          title = '星期一'
          break
        case 2:
          title = '星期二'
          break
        case 3:
          title = '星期三'
          break
        case 4:
          title = '星期四'
          break
        case 5:
          title = '星期五'
          break
        case 6:
          title = '星期六'
          break
        case 0:
          title = '星期日'
          break
      }
      return title
    },
    formatChartTitle (startTime) {
      let title = ''
      let timeSpan = this.paramTimeSpan
      let timedensity = this.selectStation == 0 ? this.pathSpeedFlow.timedensity : this.sectionFlow.timedensity
      switch (parseInt(timedensity)) {
        case 5:
        case 10:
        case 15:
        case 30:
        case 60:
        case 60 * 2:
        case 60 * 4:
        case 60 * 8:
          if (timeSpan < 24) title = this.$moment(startTime).format('HH:mm')
          else title = this.$moment(startTime).format('MM.DD HH:mm')
          break

        default:
          title = this.$moment(startTime).format('MM.DD')
          break
      }
      return title
    },
    formatChartTooltip (startTime) {
      let title = ''
      let timedensity = this.selectStation == 0 ? this.pathSpeedFlow.timedensity : this.sectionFlow.timedensity
      switch (parseInt(timedensity)) {
        case 5:
        case 10:
        case 15:
        case 30:
        case 60 * 2:
        case 60 * 4:
        case 60 * 8:
          title = this.$moment(startTime).format('YYYY-MM-DD HH:mm')
          break

        default:
          title = this.$moment(startTime).format('YYYY-MM-DD')
          break
      }
      return title
    },
    // 路线速度和流量查询
    getPathSpeedFlow () {
      this.chartData = []
      if (this.pathSpeedFlow.startTime) {
        this.pathSpeedFlow.startTime = this.$moment(this.pathSpeedFlow.startTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.pathSpeedFlow.endTime) {
        this.pathSpeedFlow.endTime = this.$moment(this.pathSpeedFlow.endTime).format('YYYY-MM-DD HH:mm:ss')
      }
      let pathSpeedFlowParams = {
        pathLineId: this.pathSpeedFlow.pathLineId,
        startTime: this.pathSpeedFlow.startTime,
        endTime: this.pathSpeedFlow.endTime,
        timedensity: this.pathSpeedFlow.timedensity
      }
      if (this.pathSpeedFlow.pathLineId == '') {
        this.$Message.error({
          content: '请选择路段'
        })
        return
      }
      Ajax.post(API_BASEURL + '/getPathSpeedFlow?' + this.objToStr(pathSpeedFlowParams)).then(response => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            let searchData = response.data.Data
            searchData.forEach(item => {
              this.chartData.push({
                title: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                speed: item.speed,
                flow: item.flow
              })
            })
            this.showLineStatictis = true
            this.creatCharts(true)
          } else {
            // if (response.data.Code == 5003) {
            this.showLineStatictis = false
            this.$Message.error({
              content: response.data.Msg
            })
            if (this.chartCtl) {
              this.chartCtl.destroy()
              this.chartCtl = null
            }
          }
        }
      })
    },
    creatCharts (init) {
      let self = this
      if (self.chartCtl) {
        self.chartCtl.destroy()
        self.chartCtl = null
      }
      let chart = new Chart({
        container: this.$refs.flowDate,
        autoFit: true,
        height: this.$refs.flowDate.clientHeight,
        padding: [20, 50, 50, 50]
      })
      this.chartCtl = chart
      let data = self.chartData
      chart.data(data)

      chart.scale({
        title: {
          alias: '日期'
        },
        flow: {
          alias: '流量',
          min: 0,
          sync: true, // 将 flow 字段数值同 speed 字段数值进行同步
          nice: true
        },
        speed: {
          alias: '流速',
          min: 0,
          sync: true, // 将 speed 字段数值同 flow 字段数值进行同步
          nice: true
        },
        count: {
          alias: '次数'
        }
      })
      chart.axis('title', {
        label: {
          style: { fill: '#fff' }
        }
      })
      chart.axis('flow', {
        grid: null,
        title: {
          style: {
            fill: '#fff'
          }
        },
        label: {
          style: {
            fill: '#fff'
          }
        }
        // axisTitleTextFillColor:"#ffffff",
      })
      chart.axis('speed', {
        title: {
          style: {
            fill: '#fff'
          }
        },
        label: {
          style: {
            fill: '#fff'
          }
        }
        // fill: "#ffffff" // 文本颜色
      })

      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })

      chart
        .line()
        .position('title*speed')
        .size(4)
        .shape('smooth')
        .tooltip('tooltip*speed', function (item, speed) {
          return {
            title: item,
            name: '流速',
            value: speed
          }
        })
        .color('#4FAAEB')
      chart
        .line()
        .position('title*flow')
        .size(4)
        .shape('smooth')
        .tooltip('tooltip*flow', function (item, flow) {
          return {
            title: item,
            name: '流量',
            value: flow
          }
        })
        .color('#9AD681')
      // .shape('dash');

      chart
        .point()
        .position('title*speed')
        .shape('circle')
        .size(6)
        .color('#4FAAEB')
        .tooltip('tooltip*speed', function (item, speed) {
          return {
            title: item,
            name: '流速',
            value: speed
          }
        })
        .style({
          stroke: '#fff',
          lineWidth: 2,
          fillOpacity: 1
        })

      chart
        .point()
        .position('title*flow')
        .shape('circle')
        .size(6)
        .color('#9AD681')
        .tooltip('tooltip*flow', function (item, flow) {
          return {
            title: item,
            name: '流量',
            value: flow
          }
        })
        .style({
          stroke: '#fff',
          lineWidth: 2,
          fillOpacity: 1
        })
      chart.legend({
        position: 'bottom',
        custom: true, // 自定义图例
        offsetY: 2,
        fill: '#ffffff',
        label: {
          style: {
            fill: '#fff'
          }
        },
        itemName: { style: { fill: '#fff' } },
        items: [
          {
            name: '流速(km/h)',
            value: 'speed',
            fill: '#ffffff',
            marker: {
              symbol: 'circle',
              style: { fill: '#4FAAEB' }
            }
          },
          {
            name: '流量(辆/分)',
            value: 'flow',
            fill: '#ffffff',
            marker: { symbol: 'circle', style: { fill: '#9AD681' } }
          }
        ]
      })

      chart.theme('newTheme')
      chart.render()
    },
    // 区间流量流速
    getSectionSpeedFlow () {
      let self = this
      this.sectionData = []
      if (this.sectionFlow.startTime) {
        this.sectionFlow.startTime = this.$moment(this.sectionFlow.startTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.sectionFlow.endTime) {
        this.sectionFlow.endTime = this.$moment(this.sectionFlow.endTime).format('YYYY-MM-DD HH:mm:ss')
      }
      Ajax.post(API_BASEURL + '/getSectionSpeedFlow?' + this.objToStr(this.sectionFlow)).then(response => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            let searchData = response.data.Data
            searchData.forEach(item => {
              self.sectionData.push({
                title: this.formatChartTitle(item.startTime),
                tooltip: this.formatChartTooltip(item.startTime),
                speed: item.speed,
                flow: item.flow
              })
            })
            this.showLineStatictis = true
            this.creatSectionCharts(true)
          } else {
            // if (response.data.Code == 5003) {
            this.showLineStatictis = false
            this.$Message.error({
              content: response.data.Msg
            })
            if (this.sectionCtl) {
              this.sectionCtl.destroy()
              this.sectionCtl = null
            }
          }
        }
      })
    },
    creatSectionCharts (init) {
      let self = this
      if (self.sectionCtl) {
        self.sectionCtl.destroy()
        self.sectionCtl = null
      }
      let chart = new Chart({
        container: this.$refs.sectionDate,
        autoFit: true,
        height: this.$refs.sectionDate.clientHeight,
        padding: [20, 50, 50, 50]
      })
      this.sectionCtl = chart
      let data = self.sectionData
      chart.data(data)
      chart.scale({
        title: {
          alias: '日期'
        },
        flow: {
          alias: '流量',
          min: 0,
          sync: true, // 将 flow 字段数值同 speed 字段数值进行同步
          nice: true
        },
        speed: {
          alias: '流速',
          min: 0,
          sync: true, // 将 speed 字段数值同 flow 字段数值进行同步
          nice: true
        },
        count: {
          alias: '次数'
        }
      })
      chart.axis('title', {
        label: {
          style: { fill: '#fff' }
        }
      })
      chart.axis('flow', {
        grid: null,
        title: {
          style: {
            fill: '#fff'
          }
        },
        label: {
          style: {
            fill: '#fff'
          }
        }
        // axisTitleTextFillColor:"#ffffff",
      })
      chart.axis('speed', {
        title: {
          style: {
            fill: '#fff'
          }
        },
        label: {
          style: {
            fill: '#fff'
          }
        }
        // fill: "#ffffff" // 文本颜色
      })

      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })

      chart
        .line()
        .position('title*speed')
        .size(4)
        .shape('smooth')
        .tooltip('tooltip*speed', function (item, speed) {
          return {
            title: item,
            name: '流速',
            value: speed
          }
        })
        .color('#4FAAEB')
      chart
        .line()
        .position('title*flow')
        .size(4)
        .shape('smooth')
        .tooltip('tooltip*flow', function (item, flow) {
          return {
            title: item,
            name: '流量',
            value: flow
          }
        })
        .color('#9AD681')
      // .shape('dash');

      chart
        .point()
        .position('title*speed')
        .shape('circle')
        .size(6)
        .color('#4FAAEB')
        .tooltip('tooltip*speed', function (item, speed) {
          return {
            title: item,
            name: '流速',
            value: speed
          }
        })
        .style({
          stroke: '#fff',
          lineWidth: 2,
          fillOpacity: 1
        })

      chart
        .point()
        .position('title*flow')
        .shape('circle')
        .size(6)
        .color('#9AD681')
        .tooltip('tooltip*flow', function (item, flow) {
          return {
            title: item,
            name: '流量',
            value: flow
          }
        })
        .style({
          stroke: '#fff',
          lineWidth: 2,
          fillOpacity: 1
        })
      chart.legend({
        position: 'bottom',
        custom: true, // 自定义图例
        offsetY: 2,
        fill: '#ffffff',
        label: {
          style: {
            fill: '#fff'
          }
        },
        itemName: { style: { fill: '#fff' } },
        items: [
          {
            name: '流速(km/h)',
            value: 'speed',
            fill: '#ffffff',
            marker: {
              symbol: 'circle',
              style: { fill: '#4FAAEB' }
            }
          },
          {
            name: '流量(辆/分)',
            value: 'flow',
            fill: '#ffffff',
            marker: { symbol: 'circle', style: { fill: '#9AD681' } }
          }
        ]
      })

      chart.theme('newTheme')
      chart.render()
    },
    scaleOfRank (val, maxVal) {
      let returnVal = 0
      returnVal = Number(Number(val).toFixed(2) / maxVal).toFixed(4) * 100
      return returnVal
    },
    // 流量流速排名
    initSpeedFlowHistoryRank () {
      let times = ''
      if (this.speedFlowHistoryRank == 'today') {
        times = this.today
      } else if (this.speedFlowHistoryRank == 'week') {
        times = this.oneWeek
      } else {
        times = this.oneMonth
      }
      Ajax.post(API_BASEURL + '/getSpeedFlowHistoryRank?' + times).then(response => {
        if (response.status == 200) {
          let speedRank = response.data.Data.speedHistoryRank
          let flowRank = response.data.Data.flowHistoryRank
          this.maxSpeedValue = 0
          this.maxFlowValue = 0

          let speedList = speedRank.map(item => {
            return item.speed
          })
          let flowList = flowRank.map(item => {
            return item.flow
          })
          if (speedList && speedList.length > 0) {
            this.maxSpeedValue = Math.max(...speedList).toFixed(2)
          }
          if (flowList && flowList.length > 0) {
            this.maxFlowValue = Math.max(...flowList).toFixed(2)
          }
          this.speedRankSort = 'down'
          this.flowRankSort = 'down'
          // 流速排名
          this.speedRank = speedRank.slice(0, 3)
          // 流量排名
          this.flowRank = flowRank.slice(0, 3)
        }
      })
    },
    // 流量流速排名-按区间
    initSpeedFlowHistoryRankForStation () {
      let times = ''
      if (this.speedFlowHistoryRank == 'today') {
        times = this.today
      } else if (this.speedFlowHistoryRank == 'week') {
        times = this.oneWeek
      } else {
        times = this.oneMonth
      }
      Ajax.post(API_BASEURL + '/getSectionFlowRank?' + times).then(response => {
        if (response.status == 200) {
          this.maxFlowValueStation = 0
          let flowRank = response.data.Data
          let flowList = flowRank.map(item => {
            return item.flow
          })
          if (flowList && flowList.length > 0) {
            this.maxFlowValueStation = Math.max(...flowList).toFixed(2)
          }
          this.flowRankSort = 'down'
          // 流量排名
          this.flowRankStation = flowRank.slice(0, 3)
        }
      })
      Ajax.post(API_BASEURL + '/getSectionSpeedRank?' + times).then(response => {
        if (response.status == 200) {
          this.maxSpeedValueStation = 0
          let speedRank = response.data.Data
          let speedList = speedRank.map(item => {
            return item.speed
          })
          if (speedList && speedList.length > 0) {
            this.maxSpeedValueStation = Math.max(...speedList).toFixed(2)
          }
          this.speedRankSort = 'down'
          // 流量排名
          this.speedRankStation = speedRank.slice(0, 3)
        }
      })
    },
    getWarningInfo () {
      let errorviodeo = 0
      Ajax.post(API_BASEURL + '/getDeviceStatus').then(response => {
        if (response.status == 200) {
          let cameras = response.data.Data.cameras
          this.viodeoDevice = cameras.length
          if (this.viodeoDevice) {
            cameras.forEach(item => {
              if (item.isRegistered) {
                errorviodeo += 1
              }
            })
          }
          this.viodeoHealthy = (errorviodeo / cameras.length) * 100 + '%'
        }
      })
      Ajax.post(API_BASEURL + '/getServerStatus').then(response => {
        if (response.status == 200) {
          let servers = response.data.Data.servers
          this.videoServer = response.data.Data.pageCount
          if (this.videoServer) {
            servers.forEach(item => {
              if (!item.status) {
                this.serverStuts = '异常'
              }
            })
          }
          // this.viodeoHealthy = (errorviodeo / cameras.length) * 100 + "%";
        }
      })
    },
    handleEventMouseEnter (item) {
      let edgeIndex = this.graphImg.cfg.edges.findIndex(edge => {
        return edge.getModel().name == item.path_line_name
      })
      if (edgeIndex > -1) {
        let edge = this.graphImg.cfg.edges[edgeIndex]
        this.graphImg.setItemState(edge, 'hover', true)
      }
    },
    handleEventMouseLeave (item) {
      let edgeIndex = this.graphImg.cfg.edges.findIndex(edge => {
        return edge.getModel().name == item.path_line_name
      })
      if (edgeIndex > -1) {
        let edge = this.graphImg.cfg.edges[edgeIndex]
        this.graphImg.setItemState(edge, 'hover', false)
      }
    },
    // 加载拓扑
    initTop () {
      let self = this
      const lineDash = [4, 2, 1, 2]
      if (this.graphImg) {
        this.graphImg.destroy()
      }
      let graph = new G6.Graph({
        container: this.$refs.centerPart, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: this.$refs.centerPart.clientWidth, // Number，必须，图的宽度
        height: this.$refs.centerPart.clientHeight, // Number，必须，图的高度
        minZoom: 0.01,
        maxZoom: 5,
        fitView: true,
        animate: true,
        fitViewPadding: [0, 20],
        fitCenter: true, // 图的中心将对齐到画布中心，但不缩放
        modes: {
          // default: ["drag-canvas", "drag-node"]
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'] // 允许拖拽画布、放缩画布、拖拽节点
        },
        defaultNode: {
          type: 'circle',
          size: 120,
          style: {
            fill: '#3a5cff', // 节点填充色
            // stroke: "#5B8FF9",//节点的描边颜色
            lineWidth: 0, // 节点的描边颜色
            lineDash: false,
            // opacity: 1,
            cursor: 'pointer'
          },
          // 节点上的标签文本配置
          labelCfg: {
            // 节点上的标签文本样式配置
            position: 'right',
            offset: 12,
            style: {
              fontSize: 48,
              fill: '#fff' // 节点标签文字颜色
            }
          }
        },
        defaultEdge: {
          type: 'quadratic',
          curveOffset: -64,
          style: {
            lineWidth: 16, // 宽度
            lineAppendWidth: 16,
            // stroke: "#3a5cff", //颜色
            // lineAppendWidth:8,//鼠标经过时的宽度
            endArrow: true,
            cursor: 'pointer',
            strokeOpacity: 1 // 透明度
            // lineDash: [2, 4, 4] //虚线
          }
        },
        edgeStateStyles: {
          hover: {
            stroke: '#00fcff'
          },
          click: {
            stroke: '#00fcff',
            strokeOpacity: 1
          }
        }
      })
      this.graphImg = graph
      G6.registerNode(
        'background-animate',
        {
          afterDraw (cfg, group) {
            const r = cfg.size / 2
            const back1 = group.addShape('circle', {
              zIndex: -3,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: cfg.style.fill,
                opacity: 0.8
              },
              name: 'back1-shape'
            })
            const back2 = group.addShape('circle', {
              zIndex: -2,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: cfg.style.fill,
                opacity: 0.8
              },
              name: 'back2-shape'
            })
            const back3 = group.addShape('circle', {
              zIndex: -1,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: cfg.style.fill,
                opacity: 0.8
              },
              name: 'back3-shape'
            })
            group.sort() // Sort according to the zIndex
            back1.animate(
              {
                // Magnifying and disappearing
                r: r + 40,
                opacity: 0.2
              },
              {
                duration: 1000,
                easing: 'easeCubic',
                delay: 0,
                repeat: true // repeat
              }
            ) // no delay
            back2.animate(
              {
                // Magnifying and disappearing
                r: r + 20,
                opacity: 0.4
              },
              {
                duration: 2000,
                easing: 'easeCubic',
                delay: 2000,
                repeat: true // repeat
              }
            ) // 1s delay
            back3.animate(
              {
                // Magnifying and disappearing
                r: r + 10,
                opacity: 0.4
              },
              {
                duration: 4000,
                easing: 'easeCubic',
                delay: 4000,
                repeat: true // repeat
              }
            ) // 3s delay
          }
        },
        'circle'
      )
      // 鼠标移动上去后激活节点
      graph.on('node:dragend', evt => {
        const nodeItem = evt.item.getModel() // 获取被点击的节点元素对象
        let node_id = nodeItem.id
        let node_position_x = nodeItem.x
        let node_position_y = nodeItem.y
        if (self.selectedNode) {
          if (node_id == self.selectedNode.id) self.handleShowTooltip(evt.item)
        }
        Ajax.post(API_BASEURL + '/saveNodeLocation?node_id=' + node_id + '&node_position=%7B%22x%22%3A' + node_position_x + '%2C%22y%22%3A' + node_position_y + '%7D').then(response => {
          if (response.status == 200) {
          }
        })
      })
      graph.on('node:click', evt => {
        const nodeItem = evt.item.getModel() // 获取被点击的节点元素对象
        let node_id = nodeItem.id
        let node_name = nodeItem.name
        self.showNodeEvents = false
        if (node_id && node_name && this.selectedNode != nodeItem) {
          self.handleShowTooltip(evt.item)
        } else {
          this.selectedNode = {}
        }
      })
      graph.on('edge:mouseenter', evt => {
        const { item } = evt
        graph.setItemState(item, 'hover', true)
      })
      graph.on('edge:mouseleave', evt => {
        const { item } = evt
        graph.setItemState(item, 'hover', false)
      })
      graph.on('edge:click', evt => {
        const nodeItem = evt.item.getModel() // 获取被点击的节点元素对象
        const clickNodes = graph.findAllByState('edge', 'click')
        if (this.selectEdgesId == nodeItem.id) {
          this.pathSpeedFlow.pathLineId = ''
          this.pathSpeedFlow.pathLineName = ''
          this.pathSpeedFlow.parentName = ''
          graph.setItemState(evt.item, 'click', false)
          this.showLineStatictis = false
          this.selectStation = 0
          this.clearStation()
          this.selectEdgesId = ''
          this.chartData = []
          if (this.chartCtl) {
            this.chartCtl.destroy()
            this.chartCtl = null
          }
          // this.changesStatisticsCurrent("3h");
        } else {
          this.pathSpeedFlow.pathLineId = nodeItem.id
          this.pathSpeedFlow.pathLineName = nodeItem.name
          this.pathSpeedFlow.parentName = nodeItem.parentName
          if (nodeItem.sectionId == '' || nodeItem.sectionId != this.sectionFlow.sectionId) {
            this.selectStation = 0
            this.clearStation()
            clickNodes.forEach(cn => {
              graph.setItemState(cn, 'click', false)
            })
            // 先将所有当前是 click 状态的节点置为非 click 状态
            graph.setItemState(evt.item, 'click', true) // 设置当前节点的 click 状态为 true
            this.selectEdgesId = nodeItem.id
            this.showLineStatictis = false
            this.changesStatisticsCurrent('3h')
          } else {
            this.showLineStatictis = false
            this.chartData = []
            if (this.chartCtl) {
              this.chartCtl.destroy()
              this.chartCtl = null
            }
          }
        }
      })
      graph.on('canvas:dragstart', evt => {
        self.showNodeEvents = false
      })
      graph.on('canvas:dragend', evt => {
        // self.handleShowTooltip(evt.item);
      })
      graph.on('wheelzoom', evt => {
        self.showNodeEvents = false
      })
      graph.data(this.topography) // 渲染图
      graph.render()
      // graph.zoomTo(0.2, {
      //     x: this.$refs.centerPart.clientWidth / 2,
      //     y: this.$refs.centerPart.clientHeight / 2
      // });
      self.handleAutoTooltip()
    },
    handleShowTooltip (node) {
      const { x, y } = node.getModel() // 获得该节点的位置，对应 pointX/pointY 坐标
      const clientXY = this.graphImg.getClientByPoint(x, y)
      this.selectedNode = node.getModel()
      this.nodeEventStyle.x = parseInt(clientXY.x) - 236
      this.nodeEventStyle.y = parseInt(clientXY.y) - 186
      this.selectedNodeTitle = this.selectedNode.name + ' - 未处理事件'
      this.nodeEventParam.page = 1
      this.nodeEventParam.node_name = encodeURIComponent(this.selectedNode.name)
      this.searchEventByNode()
    },
    handleAutoTooltip () {
      let self = this
      let handleNodes = []
      self.graphImg.cfg.nodes.forEach(node => {
        if (node.getModel().video.is_detection && node.getModel().unhandle) {
          handleNodes.push(node)
        }
        node.unlock()
      })
      if (handleNodes.length > 0) {
        // var node = handleNodes[handleNodes.length-1];
        var node = handleNodes[0]

        self.handleShowTooltip(node)
      }
    },
    // 根据节点查看事件列表
    handleShowTooltipByNode (node) {
      const { x, y } = node.getModel() // 获得该节点的位置，对应 pointX/pointY 坐标
      const clientXY = this.graphImg.getClientByPoint(x, y)
      let selectedNode = node.getModel()
      let clientX = parseInt(clientXY.x) - 200
      let clientY = parseInt(clientXY.y) - 186
      let selectedNodeTitle = selectedNode.name + ' - 未处理事件'
      this.nodeEventParam.page = 1
      this.nodeEventParam.node_name = encodeURIComponent(selectedNode.name)
      Ajax.post(API_BASEURL + '/getEventList?' + this.objToStr(this.nodeEventParam)).then(response => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            if (response.data.Data.pageCount > 0) {
              let nodeEventData = response.data.Data.events[0]
              let appendText = '<div class="popupNode" style="top:' + clientX + 'px;left:' + clientY + 'px;">'
              appendText += '<div class="nodeTitle">' + (nodeEventData.statement | this.statementFilter) + '</div>'
              appendText += '<div class="popUpBtnIcon" @click="hideNodeEvents"></div>'
              appendText += '<div class="nodeDesc">'
              appendText += '<div>高速路：' + nodeEventData.parent_name + '</div>'
              appendText += '<div>路段：' + nodeEventData.path_line_name + '</div>'
              appendText += '<div>' + nodeEventData.create_time + '</div>'
              appendText += '<div class="nodeHandle">'
              // appendText += '<span class="handleItem videoHandleIcon"></span>';
              appendText += '<span class="handleItem detailHandleIcon" @click="viewNodeEvents(' + nodeEventData.id + ',0)"></span>'
              appendText += '</div>'
              appendText += '</div>'
              appendText += '</div>'
              document.body.append(appendText)
            }
          }
        }
      })
    },
    handleChangePageIndex (n) {
      this.nodeEventParam.page = n
      this.searchEventByNode()
    },
    handleChangePageSize (n) {
      this.nodeEventParam.length = n
      this.searchEventByNode()
    },
    // 根据节点查看事件列表
    searchEventByNode () {
      let self = this
      self.nodeEventData = {}
      Ajax.post(API_BASEURL + '/getEventList?' + this.objToStr(this.nodeEventParam)).then(response => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            if (response.data.Data.pageCount > 0) {
              self.nodeEventData = response.data.Data.events[0]
              self.nodeEventCount = response.data.Data.pageCount
              self.showNodeEvents = true
            }
          }
        }
      })
    },
    viewNodeEvents (id, mode) {
      this.eventDetailMode = mode == 0
      this.showEventDetail = false
      this.hasRelation = false
      Ajax.post(API_BASEURL + '/viewDetectionEvent?id=' + id).then(response => {
        if (response.status == 200) {
          let result = response.data.Data
          if (result && result.length > 0) {
            this.dataChanged = false
            result.forEach(item => {
              if (item.is_main) {
                this.showEventDetail = true
                this.selectedEvent = item
              }
            })
            if (result.length > 1) this.hasRelation = true
          }
        }
      })
    },
    hideNodeEvents () {
      this.showNodeEvents = false
    },
    showEventDetailChange (visible) {
      if (!visible && this.dataChanged) {
        this.showNodeEvents = false
        this.selectedNode = {}
        // 最新事件
        this.getNewEvents()
      }
    },
    changeEventStatus (eventData) {
      this.dataChanged = true
      let updateIndex = this.newEvents.findIndex(item => {
        return item.id == eventData.id
      })
      if (updateIndex > -1) {
        let oldData = this.newEvents[updateIndex]
        oldData.status = eventData.status
        oldData.update = eventData.update
        this.$set(this.newEvents, updateIndex, oldData)
      }
    },
    changeRelationStatus (val) {
      this.hasRelation = val
    },
    showNextData (data) {
      this.selectedEvent = data
    },
    // 事件处理结果统计
    initTrafficEvent (init) {
      let self = this
      self.trafficEventData = []
      Ajax.post(API_BASEURL + '/getDetectionClassStatistics?' + this.objToStr(this.trafficEventParam)).then(response => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            let dataCount = 0
            let dataHandled = 0

            let data_count = 0
            let data_corrent = 0
            let data_error = 0
            let data_ignore = 0

            // 获取事件信息
            let dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == '上报总数'
            })
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex]
              dataCount = item.data_count
            }
            dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == '已处理'
            })
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex]
              dataHandled = item.data_count
            }
            data_count = Number(dataCount - dataHandled)

            dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == '正报'
            })
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex]
              data_corrent = item.data_count
            }
            dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == '误报'
            })
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex]
              data_error = item.data_count
            }
            dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == '忽略'
            })
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex]
              data_ignore = item.data_count
            }
            self.trafficEventData.push(
              {
                type: '忽略',
                value: data_ignore
              },
              {
                type: '误报',
                value: data_error
              },
              {
                type: '正报',
                value: data_corrent
              },
              {
                type: '未处理',
                value: data_count
              }
            )
            if (init) self.createTrafficEvent()
            else {
              if (self.eventsStatistics) {
                self.eventsStatistics.changeData(self.trafficEventData)
              }
            }
          }
        }
      })
    },
    createTrafficEvent () {
      if (this.eventsStatistics) {
        this.eventsStatistics.destroy()
      }
      let chart = new Chart({
        container: this.$refs.trafficEvent,
        autoFit: true,
        height: this.$refs.trafficEvent.clientHeight,
        padding: [20, 0, 0, 0]
      })
      this.eventsStatistics = chart
      // 装载数据
      chart.changeData(this.trafficEventData)
      // chart.coordinate("theta", {
      //   innerRadius: 0.2,
      //   endAngle: Math.PI
      // });

      chart.axis('type', {
        tickLine: null,
        grid: null,
        line: null
      })
      chart.legend(false)
      chart
        .interval()
        .position('type*value')
        .label('type', {
          style: { fill: '#fff' },
          content: data => {
            return `${data.type}: ${data.value}`
          }
        })
        .shape('line')
        .size(30)
        .color('type', ['#00ffa8', '#d84646', '#ffd84e', '#00fcff'])

      chart.render()
    },
    // 事件类型分析
    initTrafficType (init) {
      let self = this
      self.trafficTypeData = []
      Ajax.post(API_BASEURL + '/getDetectionClassStatistics?' + this.objToStr(this.trafficTypeParam)).then(response => {
        if (response.status == 200) {
          if (response.data.Code == 200) {
            // 获取事件信息
            let dataIndex = response.data.Data.findIndex(item => {
              return item.detection_type == '上报总数'
            })
            if (dataIndex > -1) {
              let item = response.data.Data[dataIndex]

              self.trafficTypeData.push(
                {
                  name: '停车',
                  数量: item.vehicle_stop
                },
                {
                  name: '拥堵',
                  数量: item.traffic_jam
                },
                {
                  name: '行人',
                  数量: item.person
                },
                {
                  name: '非机动车',
                  数量: item.non_motorized_vehicle
                },
                {
                  name: '逆行',
                  数量: item.vehicle_retrograde
                },
                {
                  name: '抛洒物',
                  数量: item.abandoned_object
                },
                {
                  name: '异常驶离',
                  数量: item.bear_off
                }
              )
            }
            if (init) self.createTrafficType()
            else {
              self.trafficTypeChart.changeData(self.trafficTypeData)
            }
          }
        }
      })
    },
    createTrafficType () {
      if (this.trafficTypeChart) {
        this.trafficTypeChart.destroy()
      }
      let chart = new Chart({
        container: this.$refs.trafficType,
        autoFit: true,
        height: this.$refs.trafficType.clientHeight,
        padding: 0
      })
      this.trafficTypeChart = chart
      // 装载数据
      chart.data(this.trafficTypeData)
      chart.legend(false)
      chart.axis('数量', {
        line: null,
        tickLine: null,
        grid: {
          line: {
            type: 'line',
            style: {
              stroke: '#666',
              lineDash: null,
              lineWidth: 2
            }
          }
        },
        label: {
          style: {
            fill: '#fff'
          }
        }
      })
      chart.axis('name', {
        line: null,
        tickLine: null,
        grid: {
          line: {
            type: 'line',
            style: {
              stroke: '#666',
              lineDash: null,
              lineWidth: 2
            }
          }
        },
        label: {
          style: {
            fill: '#fff'
          }
        }
      })

      // chart.scale('数量', {
      //   formatter: (val) => {
      //     val = val + '次';
      //     return val;
      //   },
      // });
      chart.coordinate('polar', {
        radius: 0.8
      })
      chart
        .line()
        .position('name*数量')
        .color('数量', ['#00fcff'])
        .size(2)
      chart
        .point()
        .position('name*数量')
        .color('数量', ['#00fcff'])
        .shape('circle')
        .size(4)
        .style({
          stroke: null,
          lineWidth: 2,
          fillOpacity: 2
        })
      chart
        .area()
        .position('name*数量')
        .color('数量', ['#00fcff'])
      setTimeout(() => {
        chart.render()
      }, 500)
    },
    showAllEvents () {
      this.$router.push('/events')
    },
    showAllMonitor () {
      this.$router.push('/monitor')
    },
    // 初始化流量
    initFlowDate () {
      // this.chartData = this.flowDate;
      // this.creatCharts(true);
    },

    // 事件处理结果统计筛选
    changeEvensStatistics (v) {
      this.eventsCorrent = v
      this.trafficEventParam.endTime = this.dateTo('now', 'YYYY-MM-DD HH:mm:ss')
      switch (this.eventsCorrent) {
        case 'today':
          this.trafficEventParam.startTime = this.dateTo('today', 'YYYY-MM-DD HH:mm:ss')
          break
        case 'week':
          this.trafficEventParam.startTime = this.dateTo('week', 'YYYY-MM-DD HH:mm:ss')
          break
        case 'month':
          this.trafficEventParam.startTime = this.dateTo('month', 'YYYY-MM-DD HH:mm:ss')
          break
        case 'all':
          this.trafficEventParam.startTime = '1900-01-01'
          break
      }
      this.initTrafficEvent()
    },
    // 事件处理结果统计筛选
    changeEvensType (v) {
      this.trafficTypeCorrent = v
      this.trafficTypeParam.endTime = this.dateTo('now', 'YYYY-MM-DD HH:mm:ss')
      switch (this.trafficTypeCorrent) {
        case 'today':
          this.trafficTypeParam.startTime = this.dateTo('today', 'YYYY-MM-DD HH:mm:ss')
          break
        case 'week':
          this.trafficTypeParam.startTime = this.dateTo('week', 'YYYY-MM-DD HH:mm:ss')
          break
        case 'month':
          this.trafficTypeParam.startTime = this.dateTo('month', 'YYYY-MM-DD HH:mm:ss')
          break
        case 'all':
          this.trafficTypeParam.startTime = '1900-01-01'
          break
      }
      this.initTrafficType()
    },
    // 路宽时段筛选
    changeflowSpeedTime (v) {
      this.speedFlowHistoryRank = v
      this.initSpeedFlowHistoryRank()
      this.initSpeedFlowHistoryRankForStation()
    },
    // 最新交通事件
    getNewEvents () {
      let startTime = this.dateTo('today', 'YYYY-MM-DD HH:mm:ss')
      Ajax.post(API_BASEURL + '/getEventList?page=1&length=3&startTime=' + startTime).then(response => {
        if (response.status == 200) {
          this.newEvents = response.data.Data.events
        }
      })
    },
    // 初始化地图
    initMap (data) {
      this.map = new maptalks.Map('map', {
        center: [113.36, 22.95],
        zoom: 10,
        minZoom: 8,
        maxZoom: 18,
        scaleControl: true,
        dragRotatePitch: true,
        baseLayer: new maptalks.TileLayer('基础', {
          urlTemplate: MAP_SERVER + MAP_TYPE.NOMAL + '/{z}/{x}/{y}',
          attribution: '&copy; 高德地图',
          // css filter
          cssFilter: 'sepia(50%) invert(80%) contrast(120%)'
        })
      })
      const layer = new maptalks.VectorLayer('vector').addTo(this.map)
      const markers = [] // 标注集合
      console.log(data)
      const { nodes } = data
      const { path_lines } = data
      const nodeMaps = {}
      for (let i = 0; i < nodes.length; i++) {
        let x = nodes[i].lng // 经度
        let y = nodes[i].lat // 纬度
        const node = new maptalks.Marker([x, y], {
          symbol: [
            {
              markerType: 'ellipse',
              markerFill: nodes[i].videos.length === 0 ? '#1E90FF' : 'rgb(255,127,36)',
              markerFillOpacity: 0.8,
              markerLineColor: '#fff',
              markerLineWidth: 3,
              markerWidth: 35,
              markerHeight: 35
            },
            {
              textName: nodes[i].node_name,
              textSize: 10,
              textFill: '#fff',
              textWrapCharacter: '\n'
            }
          ]
        })
        nodeMaps[nodes[i].node_id] = node
        markers.push(node)
        this.nodeListen(node)
      }
      layer.addGeometry(markers)
      for (let j = 0; j < path_lines.length; j++) {
        const path = path_lines[j]
        var line = new maptalks.ArcConnectorLine(nodeMaps[path.from_node_id], nodeMaps[path.to_node_id], {
          showOn: 'always',
          arcDegree: 20,
          //   arrowStyle: 'classic',
          //   arrowPlacement: 'point', // vertex-first, vertex-last, vertex-firstlast, point
          properties: {
            oid: path.id
          },
          symbol: {
            lineColor: '#B0C4DE',
            lineWidth: 3,
            oid: path.id,
            name: path.path_line_name
          }
        })
        layer.addGeometry(line)
        this.lineListen(line)
        this.gLineMaps[path.id] = line
        this.gLayer = layer
      }
    },
    // 请求节点
    async getNodeSite () {
      try {
        const nodeSite = await flowApi.getNodeSite()
        const {
          data: { Data }
        } = nodeSite
        // 初始化地图
        if (!this.isEmpty(Data.nodes) && !this.isEmpty(Data.path_lines)) {
          this.initMap(Data)
        }
      } catch (error) {
        this.$Message.error(error)
      }
    },
    /**
     * 判断{}, [], '', undefined, null是否为空
     * @param {*} value 输入
     * @returns
     */
    isEmpty (value) {
      return value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0)
    },
    // 坐标
    nodeListen (node) {
      node.on('click', this.onEventNode)
    },
    // 连接线
    lineListen (line) {
      line.on('click', this.onEventLine)
    },
    // 坐标回调
    onEventNode (param) {
      this.nodeEventParam.page = 1
      this.nodeEventParam.node_name = encodeURIComponent(param.target._symbol[1].textName)
      this.searchEventByNode()
    },
    // 连接线回调
    onEventLine (param) {
      for (const key in this.gLineMaps) {
        this.gLineMaps[key].updateSymbol({
          lineColor: '#B0C4DE'
        })
      }
      const selectLienColor = this.gLineMaps[param.target._symbol.oid]
      selectLienColor.updateSymbol({
        lineColor: '#00FF00'
      })
      this.pathSpeedFlow.pathLineId = param.target._symbol.oid
      this.selectEdgesId = param.target._symbol.oid
      this.pathSpeedFlow.pathLineName = param.target._symbol.name
      this.showLineStatictis = false
      this.changesStatisticsCurrent('3h')
    }
  }
}
</script>
<style scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>
