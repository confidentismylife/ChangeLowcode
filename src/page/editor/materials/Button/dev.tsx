import React, { Suspense, useMemo } from 'react';
import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';
import { useDrag } from 'react-dnd';
import type { ComponentType } from 'react';


const Button = ({ id, type, text, styles, icon ,size,color}: CommonComponentProps) => {
  const [_, drag] = useDrag({
    type: 'Button',
    item: {
      type: 'Button',
      dragType: 'move',
      id: id
    }
  });

  // 使用 useMemo 来动态引入图标组件
  const IconComponent = useMemo(() => {
    if (icon) {
      return React.lazy(() => import(`@ant-design/icons`).then(icons => ({ default: icons[icon] as ComponentType })));
    }
    return null;
  }, [icon]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <AntdButton ref={drag} data-component-id={id} type={type} style={styles}  color={color} size={size} icon={IconComponent ? <IconComponent /> : null} >
      {text}
    </AntdButton>
    </Suspense>
  );
}

export default Button;