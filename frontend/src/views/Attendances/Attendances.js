import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Table, message, Input } from 'antd';
import PageHeader from '../../components/PageHeader';
import { StyledPage } from '../../styles/StyledPage';
import { createTablePagination, t } from '../../utils';
import Status from '../../components/Status';
import { DELETE_ATTANDANCE, FETCH_ATTANDANCE } from '../../services/attendance.service';
import MoreActions from '../../components/MoreActions';
import moment from 'moment';
import { STYLING_CONFIGS } from '../../constants';
import { useMemo } from 'react';
import useRole from '../../hooks';

const AddModal = lazy(() => import('../../components/Attendances/AttendancesAdd'));

export default function Members() {
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [actionType, setActinType] = useState("create")
  const {isReceptionist} = useRole();
  const [pagination, setPagination] = useState(createTablePagination().pageSize);
  const fetchData = async () => {
    const { data } = await FETCH_ATTANDANCE();

    if (data) {
      setData(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHideModal = useCallback(() => {
    setShow(false);
    setSelectedAttendance(null)
  }, []);

  const handleEditModal = (data) => {
    setActinType('edite')
    setShow(true)
    setSelectedAttendance({
      ...data,
      userId: data.userId
    });
  };

  const handleShowModal = useCallback(() => {
    setActinType('create')
    setShow(true);
  }, []);

  const handleDelete = useCallback(async (userId) => {
    const { data } = await DELETE_ATTANDANCE(userId);
    if (data) {
      message.success(t('Attendance deleted successfully'));
      fetchData();
    }
  }, []);

  const handleSearch = (e) => {
    const {value} = e.target;
    console.log(data);
    if(value) {
      const filteredData = data.filter((item) => {
        const name = item.userId.firstName.toLowerCase();
        if (name.includes(value.toLowerCase())) {
          return item;
        } else {
        }
      });
      setData(filteredData)
    }else {
      fetchData();
    }
  };

  const PAGINATION = useMemo(() => createTablePagination(data.length, pagination),[pagination, data]);

  const columns = [
    {
      title: t('№'),
      dataIndex: 'number',
      render: (value, record, index) => index+1
    },
    {
      title: t('First Name'),
      dataIndex: 'userId',
      render: (text, record) => text? `${text.firstName} ${text.lastName}`:'N/A'
    },
    {
      title: t('Date'),
      dataIndex: 'date',
      render: (text) => moment(text).format('DD.MM.YYYY')
    },
    {
      title: t('Arrived at'),
      dataIndex: 'checkInTime',
      render: (text) => moment(text).format('hh:mm')
    },
    {
      title: t('Leaved at'),
      dataIndex: 'checkOutTime',
      render: (text) => moment(text).format('hh:mm')
    },
    {
      title: t('Membership End Date'),
      dataIndex: 'membershipEndDate',
      render: (value, record) => {
        const hasmembershipDate = moment(record?.userId?.membershipEnd).format('DD.MM.YYYY');
        return <span>{hasmembershipDate}</span>
      }
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
                href: `/members/${record._id}/edit`,
                buttonType: 'dashed',
                onClick: () => handleEditModal(record),
                key: 'edit'
              },
              {
                title: t('Delete'),
                type: 'button',
                buttonType: 'danger',
                href: `/members/${record._id}/edit`,
                hidden: isReceptionist,
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

  return (
    <StyledPage>
      <PageHeader
        btnLabel={t('Add Attendance')}
        iconName="AiOutlineUsergroupAdd"
        title={`${data.length} ${t('Attendance')}`}
        onClick={handleShowModal}
      />
      <Input placeholder={t("Search")} onChange={handleSearch}  style={{width: '220px', marginBottom: '20px'}}/>
      <Table
        rowClassName={(record) => new Date(record.userId?.membershipEnd).getTime() <= new Date().getTime() ? "expired__date-off" : ""}
        size="small"
        rowKey='_id'
        columns={columns}
        scroll={{ x: STYLING_CONFIGS.TABLE_SCROLL_BREAKPOINT }}
        dataSource={data}
        pagination={{...PAGINATION, onChange: (page, pageSize) => setPagination(pageSize)}}
      />

      {show ? (
        <Suspense fallback="Loading...">
          <AddModal 
           isVisible={show} 
           hideModal={handleHideModal} 
           fetchData={fetchData} 
           data={{...selectedAttendance, userId: selectedAttendance?.userId?._id}} 
           actionType={actionType} 
          />
        </Suspense>
      ) : null}
    </StyledPage>
  );
}
