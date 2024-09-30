import { create } from "zustand"; // 从 Zustand 导入 create 函数，用于创建状态管理
import { persist } from "zustand/middleware"; // 从 Zustand 导入持久化中间件
import { CSSProperties } from "react"; // 从 React 导入 CSSProperties 类型，用于定义样式
import cloneDeep from "lodash/cloneDeep"; // 从 lodash 导入 cloneDeep 函数，用于深拷贝
import { v4 as uuidv4 } from "uuid"; // 从 uuid 导入 UUID 生成器

// 定义 Component 接口，表示一个组件的结构
interface Component {
  name: string; // 组件的名称，用于唯一标识
  props: any; // 组件的属性
  styles?: CSSProperties; // 组件的样式，可选
  desc: string; // 组件的描述
  children?: Component[]; // 子组件，可选
  parentId?: number; // 父组件的 ID，可选
  uindex?: string | number; // 组件的索引，可选
  project?: string | number; // 组件所属的项目，可选
}

// 定义 FormObject 接口，表示一个表单对象的结构
interface FormObject {
  fname: string; // 表单对象的名称
  componentForm: Component[]; // 表单对象包含的组件列表
}

// 定义 ObjectTotal 接口，表示状态管理的整体结构
interface ObjectTotal {
  objectTotal: FormObject[]; // 所有表单对象的列表
  addFormObject: (newObject: FormObject) => void; // 添加新的表单对象的方法
  removeFormObject: (name: string) => void; // 根据名称移除表单对象的方法
  updateFormObject: (name: string, updatedObject: FormObject) => void; // 根据名称更新表单对象的方法
  addComponentToForm: (formName: string, newComponent: Omit<Component, 'name'>) => void; // 向指定表单对象添加组件的方法
  removeComponentFromForm: (formName: string, componentName: string) => void; // 从指定表单对象移除组件的方法
}

// 创建状态管理实例，并使用持久化中间件进行状态持久化
export const useComponentsStore = create<ObjectTotal>()(
  persist(
    (set) => ({
      objectTotal: [], // 初始化 objectTotal 为空数组

      // 添加新的 FormObject
      addFormObject: (newObject: FormObject) =>
        set((state) => {
          // 检查是否已经存在相同的 fname
          const isDuplicate = state.objectTotal.some((obj) => obj.fname === newObject.fname);
      
          // 如果已经存在相同的 fname，则不添加，并可以执行其他逻辑，如抛出警告
          if (isDuplicate) {
            console.warn(`FormObject with fname "${newObject.fname}" already exists.`);
            return state; // 返回当前状态，不做任何修改
          }
      
          // 如果不存在相同的 fname，则添加新的表单对象
          return {
            objectTotal: [...state.objectTotal, newObject],
          };
        }),
      
      // 根据名称移除指定的 FormObject
      removeFormObject: (name: string) =>
        set((state) => {
          const updatedArray = state.objectTotal.filter((obj) => obj.fname !== name); // 过滤掉指定名称的表单对象
          return { objectTotal: updatedArray }; // 返回更新后的 objectTotal
        }),

      // 根据名称更新指定的 FormObject
      updateFormObject: (name: string, updatedObject: FormObject) =>
        set((state) => {
          const updatedArray = state.objectTotal.map((obj) =>
            obj.fname === name ? updatedObject : obj // 如果名称匹配，则更新表单对象
          );
          return { objectTotal: updatedArray }; // 返回更新后的 objectTotal
        }),

      // 向指定的 FormObject 添加 Component，接收新的组件对象
      addComponentToForm: (formName: string, newComponent:any) =>
        set((state) => {
          const updatedArray = state.objectTotal.map((form) => {
            if (form.fname === formName) {
              // 检查指定名称的表单对象是否存在
              const deepClonedComponent = cloneDeep(newComponent); // 深拷贝新组件
              return {
                ...form,
                componentForm: [
                  ...form.componentForm,
                  { ...deepClonedComponent}, // 添加深拷贝后的组件，生成唯一名称
                ],
              };
            }
            return form; // 如果没有匹配的表单对象，返回原对象
          });
          return { objectTotal: updatedArray }; // 返回更新后的 objectTotal
        }),

      // 从指定的 FormObject 移除 Component，根据组件名称
      removeComponentFromForm: (formName: string, componentName: string) =>
        set((state) => {
          const updatedArray = state.objectTotal.map((form) => {
            if (form.fname === formName) {
              return {
                ...form,
                componentForm: form.componentForm.filter(
                  (component) => component.name !== componentName // 过滤掉指定名称的组件
                ),
              };
            }
            return form; // 如果没有匹配的表单对象，返回原对象
          });
          return { objectTotal: updatedArray }; // 返回更新后的 objectTotal
        }),
    }),
    {
      name: "ALL", // 存储在 localStorage 中的键名
    }
  )
);
