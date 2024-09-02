import { defineStore } from "pinia";
import { UserState } from "../interface";
import  piniaPersistConfig  from "../utils/persist";

export const useUserStore = defineStore({
  id: "mes-user",
  state: (): UserState => ({
    token: "",
    userInfo: { 
      username: "",
      id: -1,
      avatar: "",
      fullName:"",
      phoneNumber:""
    }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    setUserName(username: string) {
      this.userInfo.username = username;
    },
    setUserId(userId: number) {
      this.userInfo.id = userId;
    },
    setFullName(fullName: string) {
      this.userInfo.fullName = fullName;
    },
    setPhoneNumber(phoneNumber: string) {
      this.userInfo.phoneNumber = phoneNumber;
    },
    setAvatar(avatar: string) {
      this.userInfo.avatar = avatar;
    }
  },
  persist: piniaPersistConfig("mes-user")

});