import { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { DatePicker, message, Table, Tabs, Input } from 'antd';
import { DELETE_SALE, FETCH_SALES } from '../../services/sales.service';
import { createTablePagination, t } from '../../utils';
import { useNavigate } from 'react-router-dom';
import MoreActions from '../../components/MoreActions';
import Status from '../Status';
import moment from 'moment';
import { PAYMENT_STATUS, STYLING_CONFIGS } from '../../constants';
import useRole from '../../hooks';
import PageHeader from '../PageHeader';

const SellModal = lazy(() => import('./SalesEdit'));
const { TabPane } = Tabs;

export default function Sales({ status }) {
  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(createTablePagination().pageSize);
  const [edit, setEdit] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState(new URLSearchParams(window.location.search).get('tab') || 'membership');
  const [paymentStatus, setPaymentStatus] = useState(new URLSearchParams(window.location.search).get('status') || '');

  const fetchData = async () => {
    setLoading(true);
    const { data } = await FETCH_SALES({ status: paymentStatus });
    if (data) {
      setData(data.sales);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paymentStatus, activeTab]);

  useEffect(() => {
    navigate(`?tab=${activeTab}&status=${paymentStatus}`);
  }, [activeTab, paymentStatus]);

  const handleEditModal = data => {
    setEdit(true);
    setSelectedPayment(data);
  };

  const handleHideEditModal = () => {
    setEdit(false);
    setSelectedPayment(null);
  };

  const handleDelete = async id => {
    setLoading(true);
    const { data } = await DELETE_SALE(id);
    if (data) {
      fetchData();
      message.success(t('Sale deleted successfully'));
    } else {
      setLoading(false);
    }
  };

  const dataFilterHandle = async e => {
    if (Array.isArray(e)) {
      const { data } = await FETCH_SALES({ status, startDate: e[0].startOf('day'), endDate: e[1].endOf('day') });
      if (data) {
        console.log(data);
        setData(data?.sales);
      }
    }
  };

  const handleSearch = e => {
    const { value } = e.target;
    if (value) {
      const filteredData = data.filter(item => {
        const name = item.product.name.toLowerCase();
        if (name.includes(value.toLowerCase())) {
          return item;
        } else {
        }
      });
      setData(filteredData);
    } else {
      fetchData();
    }
  };

  const columns = [
    {
      title: t('№'),
      dataIndex: 'number',
      render: (value, record, index) => index + 1,
    },
    {
      title: t('Name'),
      dataIndex: 'product',
      render: (value, record) => (value ? `${value.name}` : 'N/A'),
    },

    // {
    //   title: t('Quantity'),
    //   dataIndex: 'quantity',
    //   render: (value, record) => `${value} ${t(record.product?.unit?? 'piece')}`
    // },
    // {
    //   title: t('Price'),
    //   dataIndex: 'price',
    //   render: value => Number(value).toLocaleString('ru')
    // },
    {
      title: t('Quantity'),
      dataIndex: 'quantity',
      // render: (value, record) => `${value} ${t(record.unit)}`
    },
    {
      title: t('Original Price'),
      dataIndex: 'product',
      render: text => text?.originalPrice?.toLocaleString('fi-FI') ?? 0,
    },
    {
      title: t('Total original Price'),
      dataIndex: 'product',
      render: (text, record) => (text?.originalPrice * record?.quantity)?.toLocaleString('fi-FI') ?? 0,
    },
    {
      title: t('Selling price'),
      dataIndex: 'price',
      render: price => price?.toLocaleString('fi-FI') ?? 0,
    },
    {
      title: t('Total selling price'),
      dataIndex: 'total',
      render: text => text?.toLocaleString('fi-FI') ?? 0,
    },
    {
      title: t('Method'),
      dataIndex: 'paymentMethod',
    },
    {
      title: t('Date'),
      dataIndex: 'pdaymentDate',
      render: value => moment(value).format('DD.MM.YYYY'),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      render: value => <Status status={value}>{t(value)}</Status>,
    },
  ];

  if (isAdmin) {
    columns.push({
      title: t('Action'),
      dataIndex: 'action',
      render: (text, record) => (
        <MoreActions
          actionsList={[
            {
              title: t('Edit'),
              type: 'button',
              href: `/members/${record._id}/edit`,
              buttonType: 'dashed',
              onClick: () => handleEditModal(record),
              key: 'edit',
            },
            {
              title: t('Delete'),
              type: 'button',
              buttonType: 'danger',
              href: `/members/${record._id}/edit`,
              onClick: () => {
                handleDelete(record._id);
              },
              key: 'delete',
            },
          ]}
        />
      ),
    });
  }

  const PAGINATION = useMemo(() => createTablePagination(data.length, pagination), [pagination, data]);

  console.log(data);

  return (
    <>
      <PageHeader
        btnLabel={t('Add Payment')}
        iconName="AiOutlineShop"
        title="Payments"
        data={data}
        onClick={() => navigate('/products')}
        tableId="salesTable"
        tableTime={new Date()}
        // hideButton={activeTab === 'products'}
      />
      <div>
        <DatePicker.RangePicker onChange={dataFilterHandle} format="DD.MM.YYYY" placeholder={[t('From'), t('To')]} />
        <Input placeholder={t('Search')} onChange={handleSearch} style={{ width: '220px', marginLeft: '20px' }} />
      </div>

      <Tabs activeKey={paymentStatus} onChange={key => setPaymentStatus(key)}>
        <TabPane tab={t('All orders')} key="" />
        {Object.values(PAYMENT_STATUS).map(status => (
          <TabPane tab={t(status.label)} key={status.value} />
        ))}
      </Tabs>
      <Table
        size="small"
        rowKey="_id"
        id="salesTable"
        dataSource={data}
        loading={loading}
        pagination={{ ...PAGINATION, onChange: (page, pageSize) => setPagination(pageSize) }}
        columns={columns}
        scroll={{ x: STYLING_CONFIGS.TABLE_SCROLL_BREAKPOINT }}
        summary={record => {
          const totalOriginal = record?.reduce((a, b) => a + b?.product?.originalPrice * b?.quantity, 0) ?? 0;
          const totalPrice = record?.reduce((a, b) => a + b?.price * b?.quantity, 0) ?? 0;
          return (
            <>
              <Table.Summary.Row className="fw-600">
                <Table.Summary.Cell colSpan={4}>{t('Total price')}</Table.Summary.Cell>
                <Table.Summary.Cell colSpan={2}>
                  <p style={{ padding: 10, margin: 0 }}>{parseInt(totalOriginal).toLocaleString('ru')}</p>
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={4}>
                  <p style={{ padding: 10, margin: 0 }}>{parseInt(totalPrice).toLocaleString('ru')}</p>
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={1}>
                  <p style={{ padding: 10, margin: 0 }}>{parseInt(totalPrice - totalOriginal).toLocaleString('ru')}</p>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />

      {edit && selectedPayment ? (
        <Suspense fallback="Loading...">
          <SellModal fetchData={fetchData} isVisible={edit} hideModal={handleHideEditModal} data={selectedPayment} edit={true} />
        </Suspense>
      ) : null}
    </>
  );
};
