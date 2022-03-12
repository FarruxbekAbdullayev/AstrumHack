import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Table, message, Image } from 'antd';
import PageHeader from '../../components/PageHeader';
import { createTablePagination, t } from '../../utils';
import Status from '../../components/Status';
import { DELETE_USER, FETCH_ADMINS, FETCH_TRAINERS} from '../../services/users.service';
import MoreActions from '../../components/MoreActions';
import { STYLING_CONFIGS } from '../../constants';
import { AiOutlinePicture } from 'react-icons/ai';
import { useSelector } from 'react-redux';


const AddModal = lazy(() => import('./MemberAdd'));
const EditModal = lazy(() => import('./MemberEdit'));

export default function Members() {
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState([]);
  const myAccount  = useSelector((state) => (state.account));
  const [pagination, setPagination] = useState(createTablePagination().pageSize);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await FETCH_ADMINS();
    const { data:trainerData } = await FETCH_TRAINERS();

    if (data && trainerData) {
      setData([...data, ...trainerData]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHideEditModal = useCallback(() => {
    setEdit(false);
    setSelectedMembership(null)
  }, []);

  const handleHideModal = useCallback(() => {
    setShow(false);
    setSelectedMembership(null)
  }, []);

  const handleEditModal = (data) => {
    setEdit(true);
    setSelectedMembership({
      ...data,
      membership: data.membership?._id
    });
  };

  const handleShowModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleDelete = useCallback(async (userId) => {
    setLoading(true);
    const { data } = await DELETE_USER(userId);
    if (data) {
      message.success(t('User deleted successfully'));
      fetchData();
    }
  }, []);

  const columns = [
    {
      title: t('№'),
      dataIndex: 'number',
      render: (value, record, index) => index+1
    },
    {
      title: t('Image'),
      dataIndex: 'image',
      render: (image) => {
        return ( image?  
          <Image 
            height={STYLING_CONFIGS.TABLE_IMAGE_HEIGHT} 
            width={STYLING_CONFIGS.TABLE_IMAGE_HEIGHT} 
            style={{objectFit: 'cover'}}
            src={image.url} 
            alt="product"  
          />
          : 
          <AiOutlinePicture color='#999' size={STYLING_CONFIGS.TABLE_IMAGE_HEIGHT}/>
        )
      },
    },
    {
      title: t('First Name'),
      dataIndex: 'firstName',
      render: (text, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: t('Phone'),
      dataIndex: 'phone'
    },
    {
      title: t('Role'),
      dataIndex: 'role',
      filters: [
        {
          text: t("Reception"),
          value: "reception",
        },
        {
          text: t("Trainer"),
          value: "trainer",
        },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      render: (text) => <Status status={text}>{t(text)}</Status>
    },
    {
      title: t('Action'),
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <MoreActions
            actionsList={[
              {
                title: t('Edit'),
                type: 'button',
                href: `/members/${record?._id}/edit`,
                buttonType: 'dashed',
                onClick: () => handleEditModal(record),
                key: 'edit'
              },
              {
                title: t('Delete'),
                type: 'button',
                buttonType: 'danger',
                href: `/members/${record?._id}/edit`,
                hidden: record._id === myAccount?._id,
                onClick: () => {
                  handleDelete(record._id);
                },
                key: 'delete'
              }
            ]}
          />
        </>
      )
    }
  ];

  const PAGINATION = useMemo(() => createTablePagination(data.length, pagination),[pagination, data]);

  return (
    <div>
      <PageHeader
        btnLabel={t('Add Member')}
        iconName="AiOutlineUsergroupAdd"
        title='Member'
        data={data}
        onClick={handleShowModal}
        tableId='membersTable'
        tableTime={new Date()}
      />
      <Table
        size="small"
        id='membersTable'
        columns={columns}
        rowKey='_id'
        scroll={{ x: STYLING_CONFIGS.TABLE_SCROLL_BREAKPOINT }}
        loading={loading}
        dataSource={data}
        pagination={{...PAGINATION, onChange: (page, pageSize) => setPagination(pageSize)}}
      />

      {show ? (
        <Suspense fallback="Loading...">
          <AddModal isVisible={show} hideModal={handleHideModal} fetchData={fetchData} />
        </Suspense>
      ) : null}
      {edit ? (
        <Suspense fallback="Loading...">
          <EditModal
            isVisible={edit}
            hideModal={handleHideEditModal}
            fetchData={fetchData}
            data={selectedMembership}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
