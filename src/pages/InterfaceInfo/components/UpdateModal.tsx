import {
  ProTable
} from '@ant-design/pro-components';
import '@umijs/max';
import {Modal} from 'antd';
import React, {useEffect, useRef} from 'react';
import {ProFormInstance} from "@ant-design/pro-form/lib";

export type props = {
  values: API.InterfaceInfo | undefined
  columns: API.InterfaceInfo[]
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => void;
  open: boolean;
};
const UpdateModal: React.FC<props> = (props) => {
  const {columns, open, onCancel, onSubmit, values} = props;
  const formRef = useRef<ProFormInstance>();
  // 监听values变化，更新表单
  useEffect(() => {
    formRef?.current?.setFieldsValue(values);
  }, [values])
  return (
    <Modal open={open} footer={null} onCancel={() => onCancel()}>
      <ProTable type="form" formRef={formRef} form={
        {
          initialValues: values
        }
      } columns={columns} onSubmit={async (values) => {
        onSubmit(values);
      }}/>
    </Modal>
  )
}
export default UpdateModal;

