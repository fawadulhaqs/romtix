<template>
    <v-card width="500" elevation="0">
        <Label >{{ label }}</label>
        <v-text-field
            hide-details
            density="compact"
            variant="outlined"
            class="search-box"
            :placeholder="selectedItem.name"
            v-model="filterText"
        ></v-text-field>
            <v-card elevation="1">
                <ul style="list-style-type : none;" :style="{height: `${listHieght}px`}" class="pa-0" density="compact">
                <li style="height: 29%;" class="ml-2 text-muted" v-if="filteredList.length <= 0">Search to get Results</li>
                <v-virtual-scroll
                    v-if="filteredList.length > 0"
                    :items="filteredList"
                    height="auto"
                    class="overflow-x-hidden"
                    style="height: 29%;"
                >
                <template v-slot:default="{ item }">
                    <div
                    :class="{ 'item-hover': hoveredItem === item , 'item-active': activeItem === item}"
                    @mouseover="onItemHover(item)"
                    @click="onItemActivate(item), onClickItem(item)"
                >
                <!-- Render your virtual item here -->
                <div class="text-body-1 ml-1 w-100">{{ item.name }}</div>
                    <hr style="border-top: 0.5px grey">
                </div>                  
                </template>
                </v-virtual-scroll>
                    <li>
                        <hr style="border-top: 0.8px grey">
                            <hr class=" ma-2" >
                        <hr style="border-top: 0.8px grey">
                    </li>   
                <v-virtual-scroll
                    :items="dataList"
                    height="auto"
                    class="overflow-x-hidden"
                    style="height: 65%;"
                >
                <template v-slot:default="{ item }">
                    <div
                    :class="{ 'item-hover': hoveredItem === item , 'item-active': activeItem === item}"
                    @mouseover="onItemHover(item)"
                    @click="onItemActivate(item), onClickItem(item)"
                    >
                    <div class="text-body-1 ml-1 w-100">{{ item.name }}</div>                    
                        <hr style="border-top: 0.5px grey">
                    </div>
                </template>
                </v-virtual-scroll>
                </ul>
            </v-card>
    </v-card>
</template>
<style>
.item-active {
  background-color: #5D87FF;
  color: #fff;
}
.item-hover {
  background-color: #f0f0f0;
  color: #1b1b1b;
}
</style>
<script>
export default{
    props:['dataList','listHieght','label'],
    data(){
        return{
            hoveredItem: null,
            activeItem: null,
            filterText: '',
            selectedItem: '',
        }
    },
    computed:{
        filteredList() {
            let filter = this.filterText
            if (!filter.length) {
            return []
            } else {
            return this.dataList.filter(data =>
            data.name.toLowerCase().includes(filter.toLowerCase())
            )
            }
        },
    },
    methods:{
        onItemActivate(item){
            this.activeItem = item
            this.hoveredItem = null
        },
        onItemHover(item){
            this.hoveredItem = item
        },
        onClickItem(value) {
            this.selectedItem = value;
            this.$emit('onClicked',value)
        },
    }
}
</script>