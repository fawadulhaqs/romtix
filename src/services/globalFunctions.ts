import store from "@/store";


export const findDoc = (name: any): void => {
  const provider = store.getters.getProviders;
  const providerData = provider.some((provid:any) => provid.name === name);
  console.log(providerData);
};

export default {
    findDoc, 
};
