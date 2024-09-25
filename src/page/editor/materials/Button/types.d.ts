// types.d.ts
declare module '@ant-design/icons' {
    import { ComponentType } from 'react';
  
    const icons: {
      [key: string]: ComponentType;
    };
  
    export default icons;
  }