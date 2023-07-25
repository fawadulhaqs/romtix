<template>
  <div class="box" v-if="patient">
    <div class="fixed" :style="rowStyles[0]" ref="row1">
      <div class="column" :style="column1[0]" ref="column11">
        <ActiveProblems
        :patient="patient"
        />
      </div>
      <div class="resize-line" @mousedown="startXResize($event,'x',$refs.column11,'row1',[0,1])"></div>
      <div class="column" :style="column1[1]" ref="column12">
        <Allergies
        :patient="patient"
        />
      </div>
      <div class="resize-line" @mousedown="startXResize($event,'x',$refs.column12,'row1',[1,2])"></div>
      <div class="column" :style="column1[2]" ref="column13">
        <Posting
        :patient="patient"
        />
      </div>
    </div>
    <div class="resize-line-horizontal" @mousedown="startXResize($event,'y',$refs.row1,[0,1])"></div>
    <div class="fixed" :style="rowStyles[1]" ref="row2">
      <div class="column" :style="column2[0]" ref="column21">
        <ActiveMedications
        :patient="patient"
        />
      </div>
      <div class="resize-line" @mousedown="startXResize($event,'x',$refs.column21,'row2')"></div>
      <div class="column" :style="column2[1]" ref="column22">
        <ClinicalReminder
        :patient="patient"
        />
      </div>
    </div>
    <div class="resize-line-horizontal" @mousedown="startXResize($event,'y',$refs.row2,[1,2])"></div>
    <div class="fixed" :style="rowStyles[2]" ref="row3">
      <div class="column" :style="column3[0]" ref="column31">
        <Lab
        :patient="patient"
        />
      </div>
      <div class="resize-line" @mousedown="startXResize($event,'x',$refs.column31,'row3',[0,1])"></div>
      <div class="column" :style="column3[1]" ref="column32">
        <Vitals
        :patient="patient"
        />
      </div>
      <div class="resize-line" @mousedown="startXResize($event,'x',$refs.column32,'row3',[1,2])"></div>
      <div class="column" :style="column3[2]" ref="column33">
        <Visits
        :patient="patient"
        />
      </div>
    </div>
  </div>
  <div class="box d-flex justify-center align-center" v-else>
    No Patient Selected
  </div>
</template>

<script>
import ActiveProblems from './ActiveProblems.vue'
import Allergies from './Allergies.vue'
import ActiveMedications from './ActiveMedications.vue'
import ClinicalReminder from './ClinicalReminder.vue'
import Posting from './Posting.vue'
import Lab from './Lab.vue'
import Vitals from './Vitals.vue'
import Visits from './Visits.vue'
import store from '@/store'
  export default {
    components:{ActiveProblems,Allergies,ActiveMedications,ClinicalReminder,Posting,Lab,Vitals,Visits},
    data() {
      return {
        column1: [{ flex: '1' }, { flex: '5' }, { flex: '1' }],
        column2: [{ flex: '1' }, { flex: '2' }],
        column3: [{ flex: '1' }, { flex: '2' }, { flex: '2' }],
        rowStyles: [{ flex: '1' }, { flex: '2' }, { flex: '1' }],
        resizing: false,
        startX: 0,
        startWidth: 0,
        myAxis: null,
        selectedDiv: null,
        contextArray:null
      }
    },
    methods: {
      startXResize(e, myAxis , myDiv , selectedDiv, contextArray) {
        this.myAxis = myAxis
        this.resizing = true
        this.selectedDiv = selectedDiv;
        this.contextArray = contextArray
        if (myAxis === 'x') {
          this.startX = e.clientX
          this.startWidth = myDiv.offsetWidth

          document.addEventListener('mousemove', this.resizeColumns)
          document.addEventListener('mouseup', this.stopResize)
        } else {
          this.startX = e.clientY
          this.startWidth = myDiv.offsetHeight
          document.addEventListener('mousemove', this.resizeColumns)
          document.addEventListener('mouseup', this.stopResize)
        }
      },
      resizeColumns(e) {
        if (!this.resizing) return
        if (this.myAxis === 'x') {
          const deltaY = e.clientX - this.startX
          const newHeight = this.startWidth + deltaY
          if(this.selectedDiv === 'row1'){

          this.column1[this.contextArray[0]].flex = `${newHeight}px`
          this.column1[this.contextArray[1]].flex = `calc(100% - ${newHeight}px)`
          }
          else if(this.selectedDiv === 'row2'){

          this.column2[0].flex = `${newHeight}px`
          this.column2[1].flex = `calc(100% - ${newHeight}px)`
          }
          else if(this.selectedDiv === 'row3'){

          this.column3[this.contextArray[0]].flex = `${newHeight}px`
          this.column3[this.contextArray[1]].flex = `calc(100% - ${newHeight}px)`
          }

        } 
        else {
        const deltaY = e.clientY - this.startX
        const newHeight = this.startWidth + deltaY
        this.rowStyles[this.selectedDiv[0]].flex = `${newHeight}px`
        this.rowStyles[this.selectedDiv[1]].flex = `calc(100% - ${newHeight}px)`
        }
      },
      stopResize() {
        this.resizing = false
        this.startX= 0,
        this.startWidth= 0,
        this.myAxis= null,
        this.selectedDiv= null,

        document.removeEventListener('mousemove', this.resizeColumns)
        document.removeEventListener('mouseup', this.stopResize)
      },
    },
    computed:{
      patient(){
        return store.getters.getPatnInfo;
      }
    }
  }
</script>

<style scoped>
  .box {
    display: flex;
    flex-flow: column;
    height: 89vh;
  }
  .fixed {
    display: flex;
    margin: 0px;
    border: 1px solid #ccc;
    overflow: auto;
    min-height: 100px;
  }
  .column {
    border: 1px solid #ccc;
    overflow: auto;
    min-width: 200px;
  }
  .column h3 {
    margin: 0;
    padding: 0px;
    background-color: whitesmoke;
  }
  .resize-line {
    width: 3px;
    background-color: #888;
    cursor: col-resize;
  }
  .resize-line:hover {
    background-color: #888;
  }
  .resize-line-horizontal {
    height: 3px;
    cursor: row-resize;
    background-color: #888;
  }
  .resize-line-horizontal:hover {
    background-color: #888;
  }
</style>
