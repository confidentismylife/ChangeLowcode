import { Form as AntdForm, Input } from 'antd';
import React, { useMemo } from 'react';
import { CommonComponentProps } from '../../interface';

function Form({ id, children, onFinish }: CommonComponentProps) {
  const formItems = useMemo(() => {
    return React.Children.map(children, (item: any) => {
      return {
        label: item.props?.label,
        name: item.props?.name,
        id: item.props?.id,
      };
    });
  }, [children]);

  return (
    <div className="w-full p-4 min-h-[100px]" data-component-id={id}>
      <AntdForm
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={(values) => {
          onFinish && onFinish(values);
        }}
      >
        {formItems.map((item: any) => (
          <AntdForm.Item key={item.name} data-component-id={item.id} name={item.name} label={item.label}>
            <Input style={{ pointerEvents: 'none' }} />
          </AntdForm.Item>
        ))}
      </AntdForm>
    </div>
  );
}

export default Form;
