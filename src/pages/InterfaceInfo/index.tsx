import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import type {SortOrder} from "antd/lib/table/interface";
import {
  addInterfaceInfoUsingPost, deleteInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingGet, updateInterfaceInfoUsingPost
} from "@/services/yunapi-backend/interfaceInfoController";
import CreateModal from "@/pages/InterfaceInfo/components/CreateModal";
import UpdateModal from "@/pages/InterfaceInfo/components/UpdateModal";

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPost({
        ...fields,
      });
      handleModalOpen(false)
      message.success('创建成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('添加失败' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('修改中...');
    console.log(currentRow)
    try {
      await updateInterfaceInfoUsingPost({
        id: currentRow?.id,
        ...fields,
      });
      hide();
      handleUpdateModalOpen(false)
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('修改失败' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: API.InterfaceInfo) => {
    const hide = message.loading('正在删除...');
    console.log(selectedRows)
    if (!selectedRows) return true;
    try {
      await deleteInterfaceInfoUsingPost({
        id: selectedRows.id
      })
      hide();
      message.success('删除成功');
      // actionRef能够拿到ProTable的控制权，刷新表格数据
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败' + error.message);
      return false;
    }
  };

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true,
          message: '请输入接口名称',
        }],
      }
    },
    {
      title: '描述',
      dataIndex: 'descrpition',
      valueType: 'textarea',
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'textarea',
    },
    {
      title: '接口地址',
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: '接口类型',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: '响应头',
      dataIndex: 'responeHeader',
      valueType: 'textarea',
    },
    {
      title: '使用次数',
      dataIndex: 'callNo',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) => `${val}${'万'}`,
    },
    {
      title: '接口状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      hideInForm: true,
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <a onClick={() => handleRemove(record)} key="subscribeAlert">
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined/> 新建
          </Button>,
        ]}
        tableAlertOptionRender={false}
        request={
          async (params: API.listInterfaceInfoByPageUsingGETParams, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
            // 获取排序字段和顺序
            const sortField = Object.keys(sort)?.[0];
            const sortOrder = sort?.[sortField];

            const res = await listInterfaceInfoByPageUsingGet({
              ...params,
            })
            if (res?.data) {
              return {
                data: res?.data.records || [],
                success: true,
                total: res?.data.total || 0,
              };
            } else {
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          }
        }
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <UpdateModal values={currentRow} columns={columns} onCancel={() => handleUpdateModalOpen(false)}
                   onSubmit={handleUpdate} open={updateModalOpen}/>
      <CreateModal columns={columns} onCancel={() => handleModalOpen(false)} onSubmit={handleAdd}
                   open={createModalOpen}/>
    </PageContainer>
  );
};
export default TableList;

