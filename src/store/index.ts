import { createStore } from 'vuex';
import Cookies from 'js-cookie';
import router from "@/router/index";
import Swal from "sweetalert2";
import ApiService from '@/services/ApiServices';
import auth from '@/services/auth';
import CalendarModules from './calendar/index'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";


const apiStore = {
    state() {
        return {
            user: null,
            patient: null,
            visit: null,
            provider: null,
            calendar: null,
            ptnImage: null,
            overLay: false,
            snackBar: null,
            requestsPending: 0
        };
    },
    mutations: {
        user(state: any, val: any) {
            state.user = val;
        },
        setPatientInfo(state: any, val: any) {
            state.patient = val;
        },
        providers(state: any, val: any) {
            state.provider = val;
        },
        calendar(state: any, val: any) {
            state.calendar = val;
        },
        saveVisit(state: any, val: any) {
            state.visit = val;
        },
        patnImage(state: any, val: any) {
            state.ptnImage = val;
        },
        snackbar(state:any, val:any){
            state.snackBar = val;
        },
        pending(state: any) {
            if (state.requestsPending === 0) {
              state.overLay = true;
            }
            state.requestsPending++;
        },
        done(state: any) {
            if (state.requestsPending >= 1) {
              state.requestsPending--;
            }
      
            if (state.requestsPending <= 0) {
              state.overLay = false;
            }
        }
    },
    actions: {
        onRefresh(context: any, token: any) {
            context.dispatch('getUserInfo');
            context.dispatch('autoLogOut', token);
            context.dispatch('getCalendars');
            context.dispatch('getProviders');
            context.dispatch('reselectPatient');
        },
        reselectPatient(context: any) {
            if (!!auth.getPatientInfo) {
                context.commit('setPatientInfo', auth.getPatientInfo());
            }
            if (!!auth.getPatientImage) {
                context.commit('patnImage', auth.getPatientImage());
            }
            if (!!auth.getVisit) {
                context.commit('saveVisit', auth.getVisit());
            }
        },
        callWebService(context: any, messageObject: any) {
        context.commit('pending');
        var promise = new Promise(function (resolve, reject) {
            if (messageObject.requestType == 'get') {
                ApiService.get(messageObject.messageType)
                .then(({ data }) => {
                    if (data) {
                      if (data.ok) {
                        resolve(data);
                      } else alert(data.error);
                    } else alert('Get User Info: No response return');
                })
                .catch(({ response }: { response: any }) => {
                    context.dispatch('showSnackBar', 'error')
                    reject(response);
                })
                .finally(() => {
                    context.commit('done');
                });
            } else {
                ApiService.post(messageObject.messageType, messageObject.credentials)
                .then(({ data }) => {
                    if (data.ok) {
                      resolve(data);
                    } else alert(data.error);
                })
                .catch(({ response }: { response: any }) => {
                    context.dispatch('showSnackBar', 'error')
                    reject(response);
                })
                .finally(() => {
                    context.commit('done');
                });
            }
            });
        return promise;
        },
        async getPatientInfo(context: any, id: any) {
            var messageObject = {
                requestType: "get",
                messageType: `getPatientInfo?patientId=${id}`,
            };
            context.dispatch("callWebService", messageObject)
            .then((result:any) => {
                context.commit('setPatientInfo', result.ptInfo);
                auth.savePatientData(result.ptInfo);
            })
            .catch((response:any) => {
                console.log(response.data.error);
            })
        },
        async getCalendars(context: any) {
            var messageObject = {
                requestType: "get",
                messageType: `getCalendars`,
            };
            context.dispatch("callWebService", messageObject)
            .then((result:any) => {
                context.commit('calendar', result.calendars);
            })
            .catch((response:any) => {
                console.log(response.data.error);
            })
        },
        async getProviders(context: any) {
            var messageObject = {
                requestType: "get",
                messageType: `getProviders`,
            };
            context.dispatch("callWebService", messageObject)
            .then((result:any) => {
                if (Cookies.get('token')) {
                    context.commit('providers', result.providers);
                } else {
                    alert('Token not saved');
                }
            })
            .catch((response:any) => {
                console.log(response.data.error);
            })
        },
        async getUserInfo(context: any) {
            const token = Cookies.get('token_id');
            var messageObject = {
                requestType: "get",
                messageType: `getUserInfo`,
            };
            context.dispatch("callWebService", messageObject)
            .then((result:any) => {
                auth.saveToken(token!);
                context.commit('user', result.userInfo);
            })
            .catch((response:any) => {
                console.log(response.data.error);
            })
        },
        printDocument(_:any, payLoad:any){
            const docDefinition = {
                pageSize: 'A4',
                pageMargins: [30, 100, 30, 50],
                footer: (currentPage:any, pageCount:any) => {
                  let text = `Pasadena Clinical Group, APC - All rights reserved 2016-2022\nPage ${currentPage.toString()}/${pageCount}`;
                  return [{ text: text, alignment: 'center', fontSize: 8 }];
                },
                header: (currentPage:any, pageCount:any, pageSize:any) => {
                  return [
                    {
                      text: '\nPasadena Clinical Group\n790 E. Colorado Blvd, 9th Fl\nPasadena, CA, 91101\nTel: 626-354-6440\nFax: 323-801-8264',
                      alignment: 'left',
                      margin: [30, 2, 0, 10],
                      fontSize: 8,
                    },
                    {
                      canvas: [
                        {
                          type: 'line',
                          x1: 30,
                          y1: 10,
                          x2: 575,
                          y2: 10,
                          lineWidth: 1,
                        },
                      ],
                    },
                  ];
                },
                content: [
                    {
                      text: `${payLoad.header}`,
                      alignment: 'center',
                      margin: [30, 2, 0, 10],
                      fontSize: 16,
                      bold: true
                    },
                    payLoad.content
                ]
        }
        pdfMake.createPdf(docDefinition, null, null, pdfFonts.pdfMake.vfs).open();
        },
        showSnackBar(context:any , type:any){
            var x = document.getElementById("snackbar")
            if(type === `success`){
                context.commit('snackbar','Success')
                x!.className = "showSuccess";
                setTimeout(function(){ x!.className = x!.className.replace("showSuccess", ""); }, 3000);
            }else{
                context.commit('snackbar','Internal Error')
                x!.className = "showError";
                setTimeout(function(){ x!.className = x!.className.replace("showError", ""); }, 3000);
            }

        }
    },
    getters: {
        getMyInfo(state: any) {
            return state.user;
        },
        getPatnInfo(state: any) {
            return state.patient;
        },
        getPatnImage(state: any) {
            return state.ptnImage;
        },
        getCalendar(state: any) {
            return state.calendar;
        },
        getProviders(state: any) {
            return state.provider;
        },
        getVisit(state: any) {
            return state.visit;
        },
        overLay(state: any) {
            return state.overLay;
        },
        getSnackBar(state:any){
            return state.snackBar
        }
    }
};

var timeout = 0;
const store = createStore({
    modules:{
         apiCalls: apiStore,
        calendar: CalendarModules,
    },
    actions:{
        async login(context, credentials) {
            return await ApiService.post("login", credentials)
              .then(({ data }:{ data:any }) => {
                if(data.ok){
                  auth.saveToken(data.token);
                  context.dispatch("getUserInfo");
                  context.dispatch('autoLogOut',data.token);
                  router.push('/dashboard');
                } else alert(data.error);
              })
              .catch(( response : {response: any}) => {
                console.log(response);
                Swal.fire({
                        text: response.message as string,
                        icon: "error",
                        // buttonsStyling: false,
                        confirmButtonText: "Try again!",
                        heightAuto: false,
                        confirmButtonColor: '#f27474',
                        customClass: {
                          confirmButton: "btn fw-semobold btn-light-danger",
                        },
                      }).then(() => {

                      });
              });
        },
        autoLogOut(context, token) {
            const tokenExpiryTime = Cookies.get('token_expiry_time');
            if (tokenExpiryTime) {
              var milliseconds = Math.abs(
                new Date().getTime() - new Date(tokenExpiryTime).getTime()
              );
              if (timeout) {
                clearTimeout(timeout);
              }
              timeout = setTimeout(() => {
                context.dispatch('Logout',token);
              }, milliseconds);
              setTimeout(() => {
              }, milliseconds/2);
            }
        },
        Logout(context , token) {
            fetch('https://api.romtix.com/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            })
            .then(response => {
                return response.json();
            })
            .then((response) => {
                if (response) {
                if (!response.ok) {
                    console.log(response.error);
                    alert(response.error);
                    return;
                } else {
                    if (timeout) {
                    clearTimeout(timeout);
                    }
                    context.dispatch('clearStore');
                    router.push({ name: "Login" });
                    
                }
                } else alert("Logout: No response return");
            })
            .catch((e) => {
                if (e.response) {
                alert(e.response.error);
                } else if (e.request) {
                alert("Invalid Request");
                } else if (e.message) {
                alert(e.message);
                }
                // commit("overlay", false);
            });
        },
        clearStore(context:any){
          auth.destroyToken();
          auth.deleteStorage();
          context.commit('setPatientInfo',null) 
          context.commit('patnImage',null) 
          context.commit('saveVisit',null) 
        }
    },
    
});

export default store;