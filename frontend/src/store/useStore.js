import {create} from "zustand"
import {createJSONStorage, persist} from "zustand/middleware"

const useUserStore = create(persist((set) => {
    return {
        user : {},
        setUser : (user) => set(() => {
            return {
                user : user
            }
        }),
    }
}, {
    name: "livepoll",
    storage: createJSONStorage(() => localStorage),
}));

export default useUserStore;