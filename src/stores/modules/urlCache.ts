import { defineStore } from "pinia";

export const useUrlCacheStore = defineStore("urlCache", {
    state: () => ({
        cache: {} as { [key: string]: { url: string; expire: number } },
    }),
    persist: true,
    actions: {
        getUrl(fileUrl: string) {
            const currentTime = Date.now();
            const cached = this.cache[fileUrl];

            if (cached && cached.expire > currentTime) {
                return cached.url;
            }
            return null;
        },
        setUrl(fileUrl: string, url: string, expire: number) {
            this.cache[fileUrl] = { url, expire };
        },
    },
});