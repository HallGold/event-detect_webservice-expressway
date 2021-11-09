<template>
  <div class="wrapper">
    <div
      class="content"
      ref="mountNode"
    >
    </div>
  </div>
</template>
<script>
import G6 from "@antv/g6";
export default {
  data() {
    return {
      data: {
        nodes: [
          {
            id: "node1",
            x: 100,
            y: 100,
            // label: "Node 1",
            type: "background-animate",
            color: "#fff",
            labelCfg: {
              position: "top"
            }
          },
          {
            id: "node2",
            x: 300,
            y: 200,
            color: "#fff",
            type: "background-animate",
            // label: "Node 2",
            labelCfg: {
              position: "left",
              offset: 10
            }
          },
          {
            id: "node3",
            x: 400,
            y: 200,
            color: "#fff",
            type: "background-animate",
            // label: "Node 2",
            labelCfg: {
              position: "left",
              offset: 10
            }
          }
        ],
        edges: [
          {
            source: "node1",
            target: "node2"
          },
          {
            source: "node2",
            target: "node1"
          },
          {
            source: "node2",
            target: "node3"
          }
          ,
          {
            source: "node3",
            target: "node2"
          }
        ]
      }
    };
  },
  mounted() {
    this.initTop();
  },
  methods: {
    initTop() {
      let graph = new G6.Graph({
        container: this.$refs.mountNode, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: this.$refs.mountNode.clientWidth, // Number，必须，图的宽度
        height: 500, // Number，必须，图的高度
        // fitView: true,
        modes: {
          default: ["drag-canvas", "drag-node"]
        },
        defaultNode: {
          type: "circle",
          size: 40,
          style: {
            fill: "#ffb400", //节点填充色
            // stroke: "#5B8FF9",//节点的描边颜色
            lineWidth: 0, //节点的描边颜色
            lineDash: false,
            // opacity:0.4,
            cursor: "pointer"
          }
        },
        defaultEdge: {
          type: "quadratic",
          style: {
            lineWidth: 6,//宽度
            stroke: "#3148b6",//颜色
            // lineAppendWidth:8,//鼠标经过时的宽度
            endArrow:false,
            // strokeOpacity:0.4,//透明度
            // lineDash: [2, 4, 4] //虚线
          }
        }
      });
      const lineDash = [4, 2, 1, 2];
      G6.registerEdge(
        "quadratic",
        {
          afterDraw(cfg, group) {
            // 获得该边的第一个图形，这里是边的 path
            const shape = group.get("children")[0];
            let index = 0;
            // 边 path 图形的动画
            shape.animate(
              () => {
                index++;
                if (index > 9) {
                  index = 0;
                }
                const res = {
                  lineDash,
                  lineDashOffset: -index
                };
                // 返回需要修改的参数集，这里修改了 lineDash,lineDashOffset
                return res;
              },
              {
                repeat: true, // 动画重复
                duration: 12000 // 一次动画的时长为 3000
              }
            );
          }
        },
        "cubic"
      );
      // G6.registerNode(
      //   "circle-animate",
      //   {
      //     afterDraw(cfg, group) {
      //       const shape = group.get("children")[0];
      //       shape.animate(
      //         ratio => {
      //           const diff = ratio <= 0.5 ? ratio * 10 : (1 - ratio) * 10;
      //           return {
      //             r: cfg.size / 2 + diff
      //           };
      //         },
      //         {
      //           repeat: true,
      //           duration: 3000,
      //           easing: "easeCubic"
      //         }
      //       );
      //     }
      //   },
      //   "circle"
      // );
      graph.data(this.data); // 读取 Step 2 中的数据源到图上
      graph.render(); // 渲染图
    }
  }
};
</script>
