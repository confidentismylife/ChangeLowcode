import { Form as AntdForm, DatePicker, Input } from 'antd';
import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useMemo } from 'react';
import { CommonComponentProps } from '../../interface';
import dayjs from 'dayjs';

// 创建一个不包含 ref 的 Props 类型
type FormProps = Omit<CommonComponentProps, 'ref'>;

export interface FormRef {
  submit: () => void;
}

const Form: ForwardRefRenderFunction<FormRef, FormProps> = ({ children, onFinish, ...restProps }, ref) => {
  const [form] = AntdForm.useForm();

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    }
  }), [form]);

  const formItems = useMemo(() => {
    return React.Children.map(children, (item: any) => {
      return {
        label: item.props?.label,
        name: item.props?.name,
        type: item.props?.type,
        id: item.props?.id,
        rules: item.props?.rules,
      };
    });
  }, [children]);

  async function save(values: any) {
    Object.keys(values).forEach(key => {
      if (dayjs.isDayjs(values[key])) {
        values[key] = values[key].format('YYYY-MM-DD');
      }
    });

    onFinish(values);
  }

  return (
    <AntdForm name='form' labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form} onFinish={save} {...restProps}>
      {formItems.map((item: any) => (
        <AntdForm.Item
          key={item.name}
          name={item.name}
          label={item.label}
          rules={
            item.rules === 'required' ? [{
              required: true,
              message: '不能为空',
            }] : []
          }
        >
          {item.type === 'input' && <Input />}
          {item.type === 'date' && <DatePicker />}
        </AntdForm.Item>
      ))}
    </AntdForm>
  );
}

export default forwardRef(Form);
