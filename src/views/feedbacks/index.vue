<template>
    <div class="main">
        <!-- 误报记录 -->
        <div class="feedbacksLeft horn">
            <div class="hornMain">
                <div class="misReport">
                    <div class="partBlockTitle">
                        <span class="partBlockTitleMain">误报记录</span>
                    </div>
                    <div class="table">
                        <table cellpadding="0" border="1" cellspacing="0" width="100%">
                            <tr class="header">
                                <th align="left">文件名</th>
                                <th align="left">生成时间</th>
                                <th align="left">下载</th>
                            </tr>
                            <tr class="td" v-for="item in detectionFile" :key="item.id">
                                <td>{{item.file_name}}</td>
                                <td>{{item.create_time}}</td>
                                <td>
                                    <a :href="item.downloadUrl">下载</a>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="minPage">
                        <Page @on-change="changePageDetectionFile" :total="detectionFileTotal" :page-size="getDetectionFileListParam.length" size="small" show-total />
                    </div>
                </div>
            </div>
        </div>
        <div class="feedbacksRight horn">
            <div class="hornMain">
                <div class="partBlockTitle">
                    <span class="partBlockTitleMain">用户意见收集</span>
                </div>
                <!-- 用户意见列表 -->
                <div class="feedbacksList">
                    <div class="filterBox nopaddingLeftRight minPaddingBottom">
                        <span class="inlineBlock">
                  <DatePicker
                    type="datetime"
                    :options = "opinionInfoParamStartOptions"
                    v-model="getSysOpinionInfoParam.startTime"
                    placeholder="开始时间"
                    style="width:180px"
                    :editable="false"
                    @on-change="changeStartDate"
                  ></DatePicker>
                </span>
                        <span class="inlineBlock">
                  <DatePicker
                    type="datetime"
                    :options = "opinionInfoParamEndOptions"
                    v-model="getSysOpinionInfoParam.endTime"
                    placeholder="结束时间"
                    style="width:180px"
                    :editable="false"
                    @on-change="changeEndDate"
                  ></DatePicker>
                </span>
                        <span class="inlineBlock">
                  <Button @click.native="resetQuery" type="primary">重置</Button>
                </span>
                    </div>
                    <div class="table nopadding maxTabel">
                        <table cellpadding="0" border="1" cellspacing="0" width="100%">
                            <tr class="header">
                                <th align="left" width="150">时间</th>
                                <th align="left">反馈内容</th>
                            </tr>
                            <tr class="td" v-for="item in sysOpinionInfoData" :key="item.id">
                                <td>{{item.create_time}}</td>
                                <td>{{item.opinion_info}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="minPage">
                        <Page @on-change="changeSysOpinionInfoPage" show-sizer :total="pageCount" :current="getSysOpinionInfoParam.page" :page-size="getSysOpinionInfoParam.length" size="small" :page-size-opts="[5,10,15,20]" show-total @on-page-size-change="handleChangePageSize"
                        />
                    </div>
                </div>
                <!-- 用户意见收集 -->
                <div class="collect">
                    <div class="collectMain">
                        <Input class="collectBox" type="textarea" :rows="2" v-model="opinion" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入反馈内容" />
                    </div>
                    <div class="submitCollect">
                        <div class="collectBtn" @click="submitOpinion">提交</div>
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
            pageCount: 0,
            getDetectionFileListParam: {
                page: 1,
                length: 10
            },
            sysOpinionInfoData: [],
            getSysOpinionInfoParam: {
                page: 1,
                length: 5,
                startTime: "",
                endTime: ""
            },
            opinion: "",
            detectionFileTotal: 0,
            detectionFile: []
        };
    },
    mounted() {
        this.getDetectionFileList(); //获取备份文件列表
        this.getSysOpinionInfo();
    },
    computed: {
        opinionInfoParamStartOptions() {
            let self = this;
            let options = {
                disabledDate(date) {
                    return date.valueOf() > new Date(self.getSysOpinionInfoParam.endTime);
                }
            };
            return options;
            //this.statisticParam.startTime;
        },
        opinionInfoParamEndOptions() {
            let self = this;
            let options = {
                disabledDate(date) {
                    return date.valueOf() < new Date(self.$moment(self.getSysOpinionInfoParam.startTime).format("YYYY-MM-DD 00:00:00"));
                }
            };
            return options;
        },
    },
    methods: {
        objToStr(obj) {
            let paramArr = Object.keys(obj).reduce((acc, cur) => {
                if (obj[cur] !== "" && obj[cur] != undefined) acc.push(cur + "=" + obj[cur]);
                return acc;
            }, []);
            return paramArr.join("&");
        },
        //获取备份文件列表
        getDetectionFileList() {
            Ajax.post(
                API_BASEURL +
                "/getDetectionFileList?" +
                this.objToStr(this.getDetectionFileListParam)
            ).then(response => {
                if (response.status == 200) {
                    this.detectionFile = response.data.Data.files;
                    this.detectionFileTotal = response.data.Data.pageCount;
                }
            });
        },
        changePageDetectionFile(n) {
            this.getDetectionFileListParam.page = n;
            this.getDetectionFileList();
        },
        // 提交用户意见
        submitOpinion() {
            if (this.opinion) {
                Ajax.post(API_BASEURL + "/submitOpinion?opinion=" + this.opinion).then(
                    response => {
                        if (response.status == 200) {
                            this.$Message.success({
                                content: "提交成功！"
                            });
                            this.opinion = "";
                            this.changeSysOpinionInfoPage(1);
                        }
                    }
                );
            }
        },
        // 查看意见列表
        getSysOpinionInfo() {
            Ajax.post(
                API_BASEURL +
                "/getSysOpinionInfo?" +
                this.objToStr(this.getSysOpinionInfoParam)
            ).then(response => {
                if (response.status == 200) {
                    this.sysOpinionInfoData = response.data.Data.opinion;
                    this.pageCount = response.data.Data.pageCount;
                } else {
                    this.$Message.error({
                        content: "获取数据失败！"
                    });
                }
            });
        },
        // 意见列表分页
        changeSysOpinionInfoPage(v) {
            this.getSysOpinionInfoParam.page = v;
            this.getSysOpinionInfo();
        },
        handleChangePageSize(n) {
            this.getSysOpinionInfoParam.length = n;
            this.getSysOpinionInfo();
        },
        // 重置条件
        resetQuery() {
            this.getSysOpinionInfoParam = {
                page: 1,
                length: 5,
                startTime: "",
                endTime: ""
            };
            this.getSysOpinionInfo();
        },
        changeStartDate(d, o) {
            this.getSysOpinionInfoParam.page = 1;
            this.getSysOpinionInfoParam.startTime = d;
            this.getSysOpinionInfo();
        },
        changeEndDate(d, o) {
            this.getSysOpinionInfoParam.page = 1;
            this.getSysOpinionInfoParam.endTime = d;
            this.getSysOpinionInfo();
        }
    }
};
</script>
