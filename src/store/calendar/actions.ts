import ApiService from "@/services/ApiServices"
export default {
  async  getUserCalendars(){
        return await ApiService.get('getCalendars', )
        .then(response =>{
          return response.data
        }).catch(error =>{
          console.log('failed to get Calendars ',error)
        })
    },  
    getAppointments( _: any, body:any) {
      return ApiService.post('listAppointments',body, )
      .then(response =>{
        return response.data;
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
      });
    },

    getListAvailability(_ :any,body:any) {
      return ApiService.post('listAvailability',body, )
      .then(response =>{
        return response.data;
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
      });
    },
    async getPatientList(){
      try {
        const response = await ApiService.get('getAllPatients')
        return response.data
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
  },
  async addAppointment( _: any, body:any){
    try {
      const response = await ApiService.post('addAppointment', body,)
      return response
    } catch (error) {
      console.log('failed to get Calendars ', error)
    }
  },
   async editAppointment ( _: any, body:any){
    try {
       const response = await ApiService.post('editAppointment', body,)
       return response
     } catch (error) {
       return error
     }
  },
  async availabilityList ( _: any, body:any){
    try {
      const response = await ApiService.post('listAvailability', body,)
      return response.data
    } catch (error) {
      return error
    }
  },
  async cancelAppointment ( _: any, body:any){
    try {
      const response = await ApiService.post('cancelAppointment', body,)
      return response.data
    } catch (error) {
      return error
    }
  },
  async checkInAppointment ( _: any, body:any){
    try {
      const response = await ApiService.post('checkinAppointment', body,)
      return response.data
    } catch (error) {
      return error
    }
  },
  async getCancelReasons (){
    try {
      const response = await ApiService.get('getCancelReasons')
      return response.data
    } catch (error) {
      return error
    }
  },
  async markNoShowAppointments ( _: any, body:any){
    try {
      const response = await ApiService.post('noShowAppointment', body,)
      return response.data
    } catch (error) {
      return error
    }   
  },
  async CancelNoShowAppointment ( _: any, body:any){
    try {
      const response = await ApiService.post('cancelNoShowAppointment', body,)
      return response.data
    } catch (error) {
      return error
    }   
  },
  async CancelCheckInAppointments ( _: any, body:any){
    try {
      const response = await ApiService.post('cancelAppointmentCheckin', body,)
      return response.data
    } catch (error) {
      return error
    }   
  },
  async addAppointmentHours( _: any, body:any){
    try {
      const response = await ApiService.post('addAppointmentAvailability', body,)
      return response.data
    } catch (error) {
      return error
    }   
  
  },
  async deleteActiveHours(  _: any, body:any){
    try {
      const response = await ApiService.get(`deleteAvailability?userId=${body.userId}&calendarId=${body.calendarId}&availabilityId=${body.availabilityId}`)
      return response.data
    } catch (error) {
      return error
    }   
  },
  
}
