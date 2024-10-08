// SelectBox.js
import React from 'react';
import { Modal, Button, List } from 'antd';

interface SelectBoxProps {
  visible: boolean;
  onClose: () => void;
  data: any[];
  onSelect: (selectedItem: any) => void;
}

const SelectBox: React.FC<SelectBoxProps> = ({ visible, onClose, data, onSelect }) => {
  return (
    <Modal
      title="选择一个 ShowBox"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <List
        bordered
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Button onClick={() => {
              onSelect(item);
              onClose();
            }}>
              {item.fname}
            </Button>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default SelectBox;
