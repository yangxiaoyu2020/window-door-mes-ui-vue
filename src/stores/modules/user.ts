import { defineStore } from "pinia";
import { UserState } from "../interface";
import  piniaPersistConfig  from "../utils/persist";

export const useUserStore = defineStore({
  id: "mes-user",
  state: (): UserState => ({
    token: "",
    userInfo: { 
      name: "",
      userId: -1,
      avatar: ""
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
      this.userInfo.name = username;
    },
    setUserId(userId: number) {
      this.userInfo.userId = userId;
    },
    setAvatar(avatar: string) {
      this.userInfo.avatar = avatar;
    }
  },
  persist: piniaPersistConfig("mes-user")

});