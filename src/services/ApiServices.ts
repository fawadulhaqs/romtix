import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import Cookies from "js-cookie";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(resource: string): Promise<AxiosResponse> {
    const token = Cookies.get('token_id');
            let config = {
              headers: {
                Authorization: token,
              }
            };
    return ApiService.vueInstance.axios.get(`https://api.romtix.com/api/${resource}` , config);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(resource: string, params: any): Promise<AxiosResponse> {
    const token = Cookies.get('token_id');
            let config = {
              headers: {
                Authorization: token,
              }
            };
            if(resource === 'login'){
              return ApiService.vueInstance.axios.post(`https://api.romtix.com/api/${resource}`, params);
            }
            else{
              return ApiService.vueInstance.axios.post(`https://api.romtix.com/api/${resource}`, params, config);
            }
  }

}

export default ApiService;
