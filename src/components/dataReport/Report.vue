<template>
  <div class="report">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts';
import _ from 'lodash';
export default {
  name: 'Report',

  data() {
    return {
      // 额外需要添加的数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    };
  },
  created() {},
  // 等数据全部渲染加载后进行操作
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 发起数据请求
    const { data: res } = await this.$http.get('reports/type/1');
    if (res.meta.status != 200) {
      return this.$message.error('获取数据失败');
    }

    // 指定图表的配置项和数据
    const result = _.merge(this.options, res.data);
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
</style>
