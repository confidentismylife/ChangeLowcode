import React from 'react';
import { CommonComponentProps } from '../../interface';

const Container = ({ id, children, styles }: CommonComponentProps) => {
  return (
    <div 
      data-component-id={id}
      style={styles}
      className="min-h-[100px] p-[20px] border-[1px] border-[#000]"
    >
      {children}
    </div>
  );
};

export default Container;
