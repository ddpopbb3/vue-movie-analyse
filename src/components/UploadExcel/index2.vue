<template>
  <div>
    <!-- <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" src="./data.xlsx" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop excel file here or
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        Browse
      </el-button>
    </div>-->
    <el-form ref="form" :model="form" label-width="82px">
      <el-form-item label="选择样本：">
        <el-select v-model="value" placeholder="请选择样本" @change="showChart">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div :id="id" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import XLSX from 'xlsx'
import axios from 'axios'
import echarts from 'echarts'
// import resize from '../Charts/mixins/resize'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function,// eslint-disable-line
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '1000px'
    },
    height: {
      type: String,
      default: '440px'
    }
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      },
      excelFile: null,
      form: {
        label: '',
        value: ''
      },
      options: [],
      // [
      //   { value: '选项1', label: '黄金糕' },
      //   { value: '选项2', label: '双皮奶' },
      //   { value: '选项3', label: '蚵仔煎' },
      //   { value: '选项4', label: '龙须面' }
      // ],
      value: null,
      chart: null,
      category: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const API = axios.create({
        baseURL: '/'
      })
      API({
        method: 'get',
        url: './data.xlsx',
        responseType: 'blob',
        type: 'xlsx'
      }).then(response => {
        // const type = response.type || null
        // relType你所下载的文件类型，这里是xlsx
        // const relType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        this.excelFile = response.data
        this.readerData(response.data)
      })
    },
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      // this.onSuccess && this.onSuccess(this.excelData)
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[1]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = 0; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)

        const value = []
        let r
        for (r = 0; r <= range.e.r; ++r) {
          if (C === 0) {
            const rcell = sheet[XLSX.utils.encode_cell({ c: C, r: r })]
            this.category.push(rcell.v)
          } else {
            const rcell = sheet[XLSX.utils.encode_cell({ c: C, r: r })]
            value.push(rcell.v)
          }
        }
        this.options.push({ label: hdr, value: value })
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    },
    showChart(e) {
      this.chart = echarts.init(document.getElementById(this.id))
      const chartData = []
      for (let i = 0; i < this.category.length; ++i) {
        chartData.push({ value: e[i], name: this.category[i] })
      }
      const charOption = {
        title: {
          text: '属性重要性',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.category
        },
        series: [
          {
            name: '属性重要性',
            type: 'pie',
            radius: '75%',
            center: ['50%', '60%'],
            data: chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.chart.setOption(charOption)
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
