<template>
  <div class="mian">
    <div class="correntBox horn">
      <div class="hornMain">
        <div class="videoWrapper">
          <div class="partBlockTitle paddingBottom24">
            <span class="partBlockTitleMain">相机预置点校准</span>
          </div>
          <div class="filterBox minPaddingBottom" style="padding-left: 0">
            <span class="inlineBlock">
              <Select
                v-model="filterBlock.nodeId"
                style="width: 120px"
                placeholder="节点名称"
                filterable
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
                v-model="filterBlock.videoId"
                style="width: 120px"
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
          </div>
          <div class="table table480">
            <table cellpadding="0" cellspacing="0" width="100%" border="1">
              <tr class="header">
                <th width="60">序号</th>
                <th>视频名称</th>
                <th>节点名称</th>
                <th width="100">视频流状态</th>
                <th width="100">设备状态</th>
                <th width="160">校准启用</th>
                <th>操作</th>
              </tr>
              <tr class="td" v-for="(item, index) in cameras" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.videoName }}</td>
                <td>{{ item.nodeName }}</td>
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
                <td>
                  <span
                    :class="[
                      'statusIcon',
                      item.status == '0' ? 'successStatus' : 'errorStatus',
                    ]"
                  ></span>
                  {{ item.statusDesc }}
                </td>
                <td>
                  <div class="btnGroup">
                    <Button type="primary" @click="showVideo(item)"
                      >校准</Button
                    >
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div class="minPage">
            <Page
              @on-change="changeCameraStatusPage"
              :total="cameraTotal"
              :current="filterBlock.page"
              :page-size="filterBlock.length"
              size="small"
              show-total
            />
          </div>
        </div>
      </div>
    </div>
    <Modal
      title="相机预置点校准"
      :width="1600"
      :mask-closable="false"
      footer-hide
      scrollable
      :closable="false"
      v-model="isShowModal"
      class-name="vertical-center-modal"
    >
      <div slot="header" class="modalHeader">
        <div class="headerTitle">相机预置点校准</div>
        <div class="headerBtn" @click="exitModal"></div>
      </div>
      <calibration
        :rowData="rowData"
        ref="correct"
        :isShowModal="isShowModal"
      ></calibration>
    </Modal>
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
      rowData: null,
      isShowModal: false,
      cameras: [],
      cameraTotal: 0,
      nodeListFilter: [],
      videoListFilter: [],
      useList: [
        {
          status: 0,
          name: "未启用",
        },
        {
          status: 1,
          name: "启用",
        },
      ],
      filterBlock: {
        page: 1,
        length: 10,
        videoId: "",
        nodeId: "",
        isUsed: "",
      },
      nodeList: [],
      videoList: [],
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
        if (this.changeData.type == 5) {
          this.getDeviceStatus();
        }
      },
    },
  },
  mounted() {
    // 获取视频
    this.getDeviceStatus();
    // 节点
    this.nodeNameCombobox();
    this.videoCombobox(); //视频源下拉列表
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
    exitModal() {
      if (this.$refs.correct.isCalibration) {
        this.$Modal.confirm({
          title: "关闭提示",
          content: "<p>相机正处于校准中，确认退出校准？</p>",
          onOk: () => {
            this.isShowModal = false;
            this.$refs.correct.cancelSetPreset();
          },
        });
      } else {
        this.isShowModal = false;
      }
    },
    // changeUsed(corr) {
    //   this.cameras.find((item) => {
    //     return item.videoId == corr.videoId;
    //   }).isUsed = corr.status;
    //   this.$set(this.rowData,"status",corr.status);
    // },
    showVideo(item) {
      this.rowData = item;
      this.isShowModal = true;
    },
    changeCameraStatusPage(n) {
      this.filterBlock.page = n;
      this.getDeviceStatus();
    },
    // 设备状态查询
    getDeviceStatus() {
      Ajax.get(
        API_BASEURL + "/getVideoList?" + this.objToStr(this.filterBlock)
      ).then((response) => {
        if (response.status == 200) {
          // console.log(response)
          this.cameras = response.data.Data.data;
          this.cameraTotal = response.data.Data.dataCount;
        }
      });
    },
    queryEvents() {
      this.filterBlock.page = 1;
      this.getDeviceStatus();
    },
    changePageSize(n) {
      this.filterBlock.page = n;
      this.getDeviceStatus();
    },
    // 节点名称下拉列表
    nodeNameCombobox() {
      this.nodeListFilter = [];
      Ajax.post(API_BASEURL + "/nodeNameCombobox").then((response) => {
        if (response.status == 200) {
          this.nodeList = response.data.Data;
          this.nodeListFilter.push(...this.nodeList);
        }
      });
    },
    //视频源下拉列表
    videoCombobox() {
      this.videoListFilter = [];
      Ajax.post(API_BASEURL + "/videoCombobox").then((response) => {
        if (response.status == 200) {
          this.videoList = response.data.Data;
          this.videoListFilter.push(...this.videoList);
        }
      });
    },
    resetQuery() {
      this.filterBlock.videoId = "";
      this.filterBlock.nodeId = "";
      this.filterBlock.isUsed = "";
      this.getDeviceStatus();
    },
  },
};
</script>

    <style lang="less">
.correntBox {
  position: relative;
  width: 1200px;
  margin: 0 auto;
  min-height: 600px;
  top: 100px;
  background-color: rgba(0, 0, 50, 0.8);
  .videoWrapper {
    padding: 24px;
  }
}
.table480 {
  height: 480px;
  overflow-y: auto;
}
</style>
