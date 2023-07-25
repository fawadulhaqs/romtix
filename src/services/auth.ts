const ID_TOKEN_KEY = "token" as string;
import Cookies from 'js-cookie';
/**
 * @description get token form localStorage
 */
export const getMyToken = (): string | null => {
  const token = Cookies.get('token');
  return token || null;
};

export const isAuthenticated = (): boolean | false => {
  return !!getMyToken || null;
};
/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  var expireTimeInMS = 3600 * 1000;
  Cookies.set('token_id',token,{expires: new Date(new Date().getTime() + expireTimeInMS)});
  Cookies.set('token',token);
  Cookies.set('token_expiry_time',`${new Date(new Date().getTime() + expireTimeInMS)}`,{expires: new Date(new Date().getTime() + expireTimeInMS)});
};
export const savePatientData = (patient: any): void => { 
  window.localStorage.setItem('patientInfo', JSON.stringify(patient));
};
export const saveVisit = (visit: any): void => { 
  window.localStorage.setItem('Visit', JSON.stringify(visit));
};
export const getVisit = (): any | null => {
  const data = JSON.parse(window.localStorage.getItem('Visit')!);
  return data || null;
};
export const getPatientInfo = (): any | null => {
  const data = JSON.parse(window.localStorage.getItem('patientInfo')!);
  return data || null;
};
export const savePatientImage = (patient: any): void => { 
  window.localStorage.setItem('patientImage', patient);
};
export const getPatientImage = (): any | null => {
  const imgData = window.localStorage.getItem('patientImage');
  return imgData || null;
};
export const deleteVisit = (): void => { 
  window.localStorage.removeItem('Visit');
};
export const deleteStorage = (): void => { 
  window.localStorage.removeItem('patientImage');
  window.localStorage.removeItem('patientInfo');
  window.localStorage.removeItem('Visit');
};



/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  Cookies.remove('token_id');
  Cookies.remove('token');
  Cookies.remove('token_expiry_time');
};

export default {
  saveToken, 
  destroyToken, 
  deleteVisit,
  getMyToken, 
  savePatientImage,
  getPatientImage,
  savePatientData,
  getPatientInfo,
  deleteStorage,
  saveVisit,
  getVisit
};
