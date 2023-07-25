<template>
    <v-card-item class="d-flex justify-center">
        <p class="text-body-1 pa-2">Visit Location</p>
        <v-select v-model="selectedCalendar" class="text-muted mx-21" density="compact" :items="calendarList"
            item-title="name" item-value="id" variant="outlined" placeholder="Select Location" return-object></v-select>
    </v-card-item>
    <v-row class="w-100">
        <v-col cols="12" sm="4">
            <p class="text-body-1 pa-2">Starting Date</p>
            <v-text-field type="date" variant="outlined" density="compact" v-model="date" />
        </v-col>
        <v-col cols="12" sm="4">
            <p class="text-body-1 pa-2">Starting Time</p>
            <v-text-field type="time" variant="outlined" density="compact" v-model="time" />
        </v-col>
        <v-col cols="12" sm="4">
            <p class="text-body-1 pa-2">Duration</p>
            <v-text-field type="number" variant="outlined" density="compact" v-model="duration" />
        </v-col>
    </v-row>
    <v-card-item class="d-flex justify-end">
        <v-btn class="mt-6 bg-primary" @click="submit" :loading="loading">Add Appointment</v-btn>
    </v-card-item>
</template>

<script>
import store from '@/store';

export default ({
    props: ['selectedProvider'],
    mounted() {
        this.selectedCalendar = this.calendarList[0]

        const date = new Date()
        this.date = this.getInitialDate(date)
        this.time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    data() {
        return {
            calendars: store.getters.getCalendar,
            selectedCalendar: null,
            date: null,
            time: null,
            duration: 53,
            loading: false
        };
    },
    watch: {
        selectedProvider(newVal, oldVla) {
        },
        date(newVal, oldVal) {
        },
        time(newVal, oldVal) {
        },
    },
    computed: {
        calendarList() {
            const calendars = this.calendars.find((cal) => cal.id === this.selectedProvider.id)
            return calendars.calendars
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog');
        },
        getInitialDate(newDate) {
            const date = newDate.getDate();
            const months = newDate.getMonth() + 1
            const year = newDate.getFullYear()

            return `${year}-${months.toString().padStart(2, '0')}-${date
                .toString()
                .padStart(2, '0')}`
        },
        getEndDate(min) {
            const fullDate = new Date(`${this.date} ${this.time}`)
            const endDate = new Date(
                fullDate.getTime() + (min) * 60 * 1000
            )
            return endDate;
        },
        getFormatedDate(date) {
            const month = date.getMonth() + 1
            const day = date.getDate()
            const year = date.getFullYear()

            return `${month.toString().padStart(2, '0')}/${day
                .toString()
                .padStart(2, '0')}/${year}`;
        },
        submit() {
            const patId = store.getters.getPatnInfo.id
            const date = new Date(this.date)
            const endDate = this.getEndDate(this.duration)
            
            var messageObject = {
                requestType: "post",
                messageType: `addAppointment`,
                credentials: {
                calendarId: this.selectedCalendar.id,
                userId: this.selectedProvider.id,
                patientId: patId,
                startDate: this.getFormatedDate(date),
                startTime: this.time,
                endDate: this.getFormatedDate(new Date(this.date)),
                endTime: `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
                length: this.duration
            }
            };
            store.dispatch("callWebService", messageObject)
        }
    }
})
</script>