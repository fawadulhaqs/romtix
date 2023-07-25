<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            
            <v-btn icon variant="text"  class="custom-hover-primary ml-0 ml-md-5 text-muted" v-bind="props">
                <v-badge :content="notifications.length" color="primary" offset-x="-5" offset-y="-3">
                    <BellRingingIcon stroke-width="1.5" size="22" />
                </v-badge>
            </v-btn>
        </template>
        <v-card
        elevation="2"
        max-height="200">
        <v-sheet 
        rounded="md"
        width="500"
        elevation="10" 
        class="ma-2"
        >
            <v-list class="py-1" lines="one" density="compact">
                <v-list-item 
                v-for="items in notifications"
                :value="items.alertId" 
                active-color="primary"
                :class="`bg-${items.alert}`"
                class="ma-1 pl-2"
                rounded
                >
                    <p class="ma-0 pa-0 text-body-1">{{ items.text }}</p>
                </v-list-item>
            </v-list>
        </v-sheet>
    </v-card>
    </v-menu>
</template>
<script>

export default({
    data(){
        return{
            notifications:[],
        };
    },
    mounted(){
        var messageObject = {
            requestType: "get",
            messageType: `listUserNotifications`,
        };
        this.$store.dispatch("callWebService", messageObject)
        .then((result) => {
            this.notifications = result.notifications
        })
        .catch((response) => {
            console.log(response.data.error);
        })
    }
})
</script>
