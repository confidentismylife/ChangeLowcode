import { create } from "zustand"

interface components{
    components:string[];
    addComponentDrop:(newComponent:string)=>void;

}
const useComponentsDrop=create<components>((set)=>({
    components: ['Button', 'Container', 'Table', 'Form', 'Yuancheng','Modal'],
    addComponentDrop:(newComponent:string)=>set((state)=>({
        components:[...state.components, newComponent]
    }))
}))
export default useComponentsDrop