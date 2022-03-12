import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Table, message, Image, Popover, DatePicker, Input } from 'antd';
import PageHeader from '../../components/PageHeader';
import { StyledExpence } from './Expence.style';
import { createTablePagination, t } from '../../utils';
import Status from '../../components/Status';
import { DELETE_EXPENCE, FETCH_EXPENCES } from '../../services/expence.service';
import MoreActions from '../../components/MoreActions';
import { STYLING_CONFIGS } from '../../constants';
import { AiOutlinePicture } from 'react-icons/ai';
import { BiMessageAltDetail } from "react-icons/all";
import { memo } from 'react';
import useRole from '../../hooks';
import {Link} from 'react-router-dom';
import moment from 'moment';

const AddModal = lazy(() => import('../../components/Expences/ExpenceAdd'));
const EditModal = lazy(() => import('../../components/Expences/ExpenceEdite'));


export default function Members() {
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState([]);
  const {isReceptionist} = useRole();
  const [pagination, setPagination] = useState(createTablePagination().pageSize);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await FETCH_EXPENCES();

    if (data) {
      setData(data?.payments);
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

  const handleDelete = useCallback(async (expenceId) => {
    setLoading(true);
    const { data } = await DELETE_EXPENCE(expenceId);
    if (data) {
      message.success(t('Expense deleted successfully'));
      fetchData();
    }
  }, []);

  const PAGINATION = useMemo(() => createTablePagination(data.length, pagination),[pagination, data]);

  let columns = [
    {
      title: t('№'),
      dataIndex: 'number',
      render: (value, record, index) => index+1
    },
    {
      title: t('Purpose'),
      dataIndex: 'purpose',
      render: text => t(text),
      filters:[
        {
          text: t("Rent"),
          value: "rent",
        },
        {
          text: t("Salary"),
          value: 'salary',
        },
        {
          text: t("Debt"),
          value: 'debt',
        },
        {
          text: t("Bill"),
          value: 'bill',
        },
        {
          text: t("Equipment"),
          value: 'inventory',
        },
        {
          text: t("Product"),
          value: 'product',
        },
        {
          text: t("Other"),
          value: 'other',
        },
      ],
        onFilter: (value, record) => record.purpose === value,
    },
    {
      title: t('To whom'),
      dataIndex: 'user',
      render: (text) => <>{text?.firstName ?? ""} {text?.lastName ?? ""}</>
    },
    {
      title: t('Amount'),
      dataIndex: 'amount',
      render: (text, record) => 
        <div style={{display: "flex", gap: 15}}>
          <span>{text?.toLocaleString('ru')}</span>
          <span>{t(record?.expenseType)}</span>
        </div>,
      filters:[
        {
          text: t("Cash"),
          value: "cash",
        },
        {
          text: t("Card"),
          value: 'card',
        },
        {
          text: t("Bank"),
          value: 'bank',
        },
      ],
        onFilter: (value, record) => record.expenseType === value,
    },
    {
      title: t('Note'),
      dataIndex: 'note',
      render: (text) => 
      <div className='expense__note-wrapper'>
        <Popover 
          content={text || t('No note')} 
          trigger={'hover'} 
          className='expense__note-wrapper'
        >
          <BiMessageAltDetail className='expence__note' />
        </Popover>
      </div>
    },
    {
      title: t('Expence date'),
      dataIndex: 'expenseDate',
      render: text => moment(text).format('DD.MM.YYYY')
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
                href: `/expences/${record?._id}/edit`,
                buttonType: 'dashed',
                onClick: () => handleEditModal(record),
                key: 'edit'
              },
              {
                title: t('Delete'),
                type: 'button',
                buttonType: 'danger',
                hidden: isReceptionist,
                href: `/members/${record?._id}/edit`,
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

  const dataFilterHandle = async(e) => {
    if (Array.isArray(e)) {
      console.log({startDate: e[0].startOf("day"), endDate: e[1].endOf("day")});
      const { data } = await FETCH_EXPENCES({startDate: e[0].startOf("day"), endDate: e[1].endOf("day")});
      if (data) {
        console.log(data);
        setData(data?.payments)
      }
    } 
  };

  const handleSearch = (e) => {
    const {value} = e.target;
    if(value) {
      const filteredData = data.filter((item) => {
        const name = item.user.firstName.toLowerCase();
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
  
  return (
    <StyledExpence>
      <PageHeader
        btnLabel={t('Add expence')}
        iconName="AiOutlineUsergroupAdd"
        title='Expences'
        data={data}
        onClick={handleShowModal}
        tableId='expenceTable'
        tableTime={new Date()}
      />
      <div style={{marginBottom: 20}}>
          <DatePicker.RangePicker
            onChange={dataFilterHandle}
            format="DD.MM.YYYY"
            placeholder={[t("From"), t("To")]}
          />
          <Input placeholder={t("Search")} onChange={handleSearch} style={{width: '220px', marginLeft: '20px'}} />
      </div>
      <Table
        size="small"
        id='expenceTable'
        columns={columns}
        scroll={{ x: STYLING_CONFIGS.TABLE_SCROLL_BREAKPOINT }}
        loading={loading}
        rowKey='_id'
        dataSource={data}
        pagination={{...PAGINATION, onChange: (page, pageSize) => setPagination(pageSize)}}
        summary={(record) => {
          return (
            <>
              <Table.Summary.Row className="fw-600">
                <Table.Summary.Cell colSpan={3}>
                  {t("Total expence")}
                </Table.Summary.Cell>
                <Table.Summary.Cell  colSpan={4}>
                  {/* <Text> */}
                  <p style={{padding: 10, margin: 0}}>
                    {parseInt(record?.reduce((a, b) => (a) + (b?.amount), 0) ?? 0).toLocaleString("ru")}
                  {/* </Text> */}
                  </p>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
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
            data={{...selectedMembership}}
          />
        </Suspense>
      ) : null}
    </StyledExpence>
  );
}
