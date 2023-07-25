<script setup lang="ts">
import { ref, shallowRef,watch,computed,onMounted,onUnmounted} from 'vue';
import sidebarItems from './vertical-sidebar/sidebarItem';
// import NavGroup from './vertical-sidebar/NavGroup/index.vue';
import NavItem from './vertical-sidebar/NavItem/index.vue';
import PatientCard from './vertical-header/PatientCard.vue';
import PostingCard from './vertical-header/PostingCard.vue';
import Logo from './logo/Logo.vue';
// Icon Imports
// dropdown imports
import NotificationDD from './vertical-header/NotificationDD.vue';
import ProfileDD from './vertical-header/ProfileDD.vue';
import Selection from '@/layouts/full/vertical-header/Selection.vue'
import store from '@/store';
const rail = ref(true);
const sideBarItem = shallowRef(sidebarItems);
const patntInfo = computed(() => {
    
    return store.getters.getPatnInfo; // Adjust the breakpoint as per your requirements
  });

const userInfo = computed(() => {
    
    return store.getters.getMyInfo; // Adjust the breakpoint as per your requirements
  });

const screenWidth = ref(window.innerWidth);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const isScreenSmallerThanLG = computed(() => {
    
  return screenWidth.value < 960; // Adjust the breakpoint as per your requirements
});

watch(isScreenSmallerThanLG,(newVal,oldVal)=>{
    rail.value = newVal
})

</script>

<template> 
    <!------Sidebar-------->
    <v-navigation-drawer 
    :width="200" 
    left elevation="10" 
    :rail="rail"
    expand-on-hover
    permanent
    >
        <!---Logo part -->
        <div class="pa-1 pt-4">
            <v-list-item
            nav
            >
            <template v-slot:prepend>
                <Logo/>
            </template>
            <v-btn 
                class="mb-1 ml-3" 
                @click="rail = !rail"
                color="ml-2 bg-primary"
                density="compact"
                elevation="3"
                size="large"
                :icon="rail ?  'mdi-chevron-double-right' :  'mdi-chevron-double-left'"
                >
                </v-btn>
            </v-list-item>
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div>
        <perfect-scrollbar class="scrollnavbar">
            <v-list class="pl-2 pr-2">
                
                <template v-for="(item, i) in sideBarItem">
                   
                    <NavItem :item="item" />
                  
                </template>
            </v-list>
        </perfect-scrollbar>
    </div>

    </v-navigation-drawer>
    <!------Header-------->
    <v-app-bar elevation="10" height="70">
        <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center">
                <Selection/>
            </div>
            <div class="d-flex flex-row align-center">
                <PostingCard
                v-if="patntInfo"
                :patient="patntInfo"
                />
                <PatientCard
                    v-if="userInfo"
                    class="px-1 d-none d-sm-block"
                    :heading="userInfo.fullName"
                    :heading2="''"
                    :buttonenable="false"
                    />
                <!-- Notification -->
                <NotificationDD />
                <!-- User Profile -->
                <ProfileDD />
                
            </div>
        </div>
    </v-app-bar>
</template>
