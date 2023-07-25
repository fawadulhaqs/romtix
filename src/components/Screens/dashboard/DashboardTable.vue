<template>
    <table>
      <thead>
        <tr class="red" >
          <th class="pl-1" v-for="(item, i) in header" :key="i">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <v-dialog
            v-model="dialog"
            v-if="listData.length > 0"
        >
            <template v-slot:activator="{ props }">
              <tr 
              v-for="item in listData" 
              :key="item.id"
              v-bind="props"
              @click="callApiService(item)"
              >
                <td class="pl-1">{{ item.name }}</td>
                <td class="pl-1" v-if="item.value1">{{ item.value1 }}</td>
                <td class="pl-1" v-if="item.value2 && !item.value1">Nan</td>
                <td class="pl-1" v-if="item.value2">{{ item.value2 }}</td>
                <td class="pl-1" v-if="item.value3">{{ item.value3 }}</td>
              </tr>
            </template>
            <UiCard :title="cardHeader" min-width="200" max-width="500" height="auto" :loading="!list.length > 0">
              <template v-slot:default>
                <v-card elevation="0" class="overflow-y-auto overflow-x-hidden" height="450">
                  <pre v-for="(item, i) in list" :key="i">{{ item }}</pre>
                </v-card>
              </template>
              <template v-slot:footer>
                <!-- <v-spacer></v-spacer> -->
                <v-btn class="ml-2 bg-primary" :disabled="!list.length > 0" @click="generatePDF">Print</v-btn>
                <v-btn class="ml-2 bg-lightprimary" @click="dialog = false">Cancel</v-btn>
              </template>
            </UiCard>
        </v-dialog>
        <tr v-else>
          <p class="pl-1">No Data Available</p>
        </tr>
      </tbody>
    </table>
  </template>

<script>
import store from '@/store'
import UiCard from '@/components/shared/CardHeaderFooter.vue';
    export default {
      components:{UiCard},
      props:['header','listData','apiLink'],
      data() {
        return {
          dialog:false,
          list:[],
          cardHeader:''
        }
      },
      methods:{
        callApiService(item){
          this.list = []
          this.cardHeader = item.name

          var messageObject = {
            requestType: "get",
            messageType: `${this.apiLink}${item.id}`,
          };
          store.dispatch("callWebService", messageObject)
          .then((result) => {
            if(result.details.text){
              this.list = result.details.text
            }else{
              this.list = result.details
            }
          })
          .catch((response) => {
            console.log(response.data.error);
          })
        },
        generatePDF(){
          this.dialog = false;
          store.dispatch('printDocument',{header: this.cardHeader,content:[...this.list]})
        }
      }
    }
  </script>
  <style scoped>
    body {
      margin: 0;
      height: 50%;
    }
    pre {
        white-space: pre-wrap;       /* Since CSS 2.1 */
        white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
        white-space: -pre-wrap;      /* Opera 4-6 */
        white-space: -o-pre-wrap;    /* Opera 7 */
        word-wrap: break-word;       /* Internet Explorer 5.5+ */
    }
    table {
      text-align: left;
      position: relative;
      width: 100%;
      border-collapse: collapse;
    }
    tr.red th {
        background: #888;
        color: white;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    th {
      background: white;
      position: sticky;
      top: 0; /* Don't forget this, required for the stickiness */
      box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
    }
    tr{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    tr:hover{
      background-color: #ccc;
    }
  </style>