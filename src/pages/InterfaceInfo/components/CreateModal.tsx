import {
  ProTable
} from '@ant-design/pro-components';
import '@umijs/max';
import {Modal} from 'antd';
import React from 'react';

export type props = {
  columns: API.InterfaceInfoVo[]
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfoVo) => void;
  open: boolean;
};
const CreateModal: React.FC<props> = (props) => {
  const {columns, open, onCancel, onSubmit} = props;

  return (
    <Modal open={open} footer={null} onCancel={() => onCancel?.()}>
      <ProTable type="form" columns={columns} onSubmit={async (values) => {
        onSubmit?.(values);
      }}/>
    </Modal>
  )
}
export default CreateModal;

