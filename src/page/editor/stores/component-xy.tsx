import create from "zustand";
import { persist } from "zustand/middleware";

export const useComponentXy = create(persist(
    (set) => ({
        componentXy: {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            labelTop: 0,
            labelLeft: 0,
        },
        setXy: (top, left, width, height, labelTop, labelLeft) => {
            set({
                componentXy: {
                    top,
                    left,
                    width,
                    height,
                    labelTop,
                    labelLeft,
                },
            });
        },
    }),
    {
        name: "component-xy-storage", // 存储的键名
        getStorage: () => localStorage, // 使用 localStorage 进行持久化
    }
));
