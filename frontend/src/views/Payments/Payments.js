/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { AiOutlineFilter } from "react-icons/ai";
import {
  Tabs,
  Table,
  message,
  DatePicker,
  Drawer,
  Button,
  Checkbox,
  Space,
  Input,
  Popconfirm,
} from "antd";
import { createTablePagination, t } from "../../utils";
import PageHeader from "../../components/PageHeader";
import StyledPayment from "./Payments.style";
import {
  DELETE_PAYMENT,
  FETCH_PAYMENTS,
  FETCH_STATISTICS,
  UPDATE_PAYMENT,
} from "../../services/payments.service";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import MoreActions from "../../components/MoreActions";
import Status from "../../components/Status";
import { PAYMENT_STATUS, STYLING_CONFIGS } from "../../constants";
import { useSelector } from "react-redux";
import useRole from "../../hooks";
import StatisticsItem from "../../components/Payments/StatisticsItem";

const { TabPane } = Tabs;
const AddModal = lazy(() => import("../../components/Payments/PaymentsAdd"));
const EditModal = lazy(() => import("../../components/Payments/PaymentsEdit"));

function Payments() {
  const account = useSelector((state) => state.account);
  const [period, setPeriod] = useState("");
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(
    createTablePagination().pageSize
  );
  const [edit, setEdit] = useState(false);
  const [activeTab, setActiveTab] = useState(
    new URLSearchParams(window.location.search).get("tab") || "membership"
  );
  const [statistics, setStatistics] = useState({});
  const [filterStatuses, setFilterStatuses] = useState({
    status:
      new URLSearchParams(window.location.search).get("tab") || "membership",
    user: null,
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().add(1, "day").format("YYYY-MM-DD"),
    status: [],
  });
  const [visible, setVisible] = useState(false);
  const { RangePicker } = DatePicker;
  const { status, user, checked, startDate, endDate } = filterStatuses;

  const [data, setData] = useState([]);

  useEffect(() => {
    navigate(`?tab=${activeTab}`);
    setFilterStatuses({ ...filterStatuses, status: "" });
  }, [activeTab]);

  useEffect(() => {
    navigate(`?tab=${activeTab}&status=${status}`);
  }, [activeTab, status]);

  const fetchStatistics = async () => {
    setLoading(true);
    const statistics = await FETCH_STATISTICS(filterStatuses);
    if (statistics) {
      setStatistics(statistics?.data);
    }
    setLoading(false);
  };

  const editHandle = async (_id) => {
    const { data } = await UPDATE_PAYMENT(_id, {
      status: "paid",
      paymentDate: moment(),
    });

    if (data) {
      fetchData();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    if (account.role === "reception") {
      let response = {};
      if (status == "pending") {
        const { data } = await FETCH_PAYMENTS({ status });
        response = data;
      } else {
        const { data } = await FETCH_PAYMENTS({
          status,
          startDate: moment().startOf("day"),
          endDate: moment().endOf("day"),
        });
        response = data;
      }

      setLoading(false);
      if (response) {
        setData(response.payments);
      }
    } else {
      const { data } = await FETCH_PAYMENTS({ status });

      setLoading(false);
      if (data) {
        setData(data.payments);
      }
    }
  };

  useEffect(() => {
    filterData();
    fetchStatistics();
  }, []);

  const filterData = async () => {
    // navigate(`?tab=${activeTab}&status=${checked}&startDate=${startDate}&endDate=${endDate}`)
    setLoading(true);
    const data = await FETCH_PAYMENTS(filterStatuses);
    setLoading(false);
    if (data) {
      setData(data?.data?.payments);
    }
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleHideModal = useCallback(() => {
    setShow(false);
  }, []);

  const handleHideEditModal = useCallback(() => {
    setEdit(false);
  }, []);

  const handleShowModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleEditModal = (data) => {
    setEdit(true);
    setSelectedPayment(data);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const { data } = await DELETE_PAYMENT(id);
    if (data) {
      fetchData();
      message.success(t("Payment deleted successfully"));
    } else {
      setLoading(false);
    }
  };

  const handlePeriod = (e) => {
    setFilterStatuses((state) => ({
      ...state,
      startDate: e?.[0]?._d?.toISOString().slice(0, 10),
      endDate: e?.[1]?._d?.toISOString().slice(0, 10),
    }));
  };

  const handleCheckbox = (value) => {
    setFilterStatuses((state) => ({ ...state, status: [...new Set(value)] }));
  };

  const dataFilterHandle = async (e) => {
    if (Array.isArray(e)) {
      console.log({
        startDate: e[0].startOf("day"),
        endDate: e[1].endOf("day"),
      });

      const { data } = await FETCH_PAYMENTS({
        status,
        startDate: e[0].startOf("day"),
        endDate: e[1].endOf("day"),
      });
      if (data) {
        setData(data?.payments);
      }
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    if (value) {
      const filteredData = data.filter((item) => {
        const name = item.member.firstName.toLowerCase();
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

  useEffect(() => {
    if (activeTab === "membership") {
      fetchData();
    }
  }, [status]);

  const PAGINATION = useMemo(
    () => createTablePagination(data.length, pagination),
    [pagination, data]
  );

  let columns = [
    {
      title: t("№"),
      dataIndex: "number",
      render: (value, record, index) => index + 1,
    },
    {
      title: t("Student"),
      dataIndex: "member",
      render: (value) => `${value?.firstName} ${value?.lastName}`,
    },
    {
      title: t("Price"),
      dataIndex: "price",
      render: (price) => price?.toLocaleString("fi-FI") ?? 0,
    },
    {
      title: t("Payment"),
      dataIndex: "paymentMethod",
    },

    {
      title: t("Date"),
      dataIndex: "paymentDate",
      render: (value) => moment(value).format("DD.MM.YYYY"),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (value, record) => (
        <>
          <Status status={value}>{t(value)}</Status>
          <Popconfirm
            className={value == "pending" ? "pay__btn" : "hide"}
            okText={t("Ok")}
            cancelText={t("Cancel")}
            title={t("Should it be marked as paid?")}
            onConfirm={() => editHandle(record?._id)}
          >
            <Status status={"pay"}>{t("Pay")}</Status>
          </Popconfirm>
        </>
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
      title: t("Action"),
      dataIndex: "action",
      render: (text, record) => (
        <>
          {isAdmin ? (
            <MoreActions
              actionsList={[
                {
                  title: t("Edit"),
                  type: "button",
                  href: `/members/${record._id}/edit`,
                  buttonType: "dashed",
                  onClick: () => handleEditModal(record),
                  key: "edit",
                },
                {
                  title: t("Delete"),
                  type: "button",
                  buttonType: "danger",
                  href: `/members/${record._id}/edit`,
                  onClick: () => {
                    handleDelete(record._id);
                  },
                  key: "delete",
                },
              ]}
            />
          ) : null}
        </>
      ),
    });
  }

  if (account.role === "reception") {
    const columnsFilter = columns.filter(
      (item) =>
        item.dataIndex !== "originalPrice" && item.dataIndex !== "totalPrice"
    );
    columns = columnsFilter;
  }

  const statusOptions = [
    {
      label: t("Paid"),
      value: "paid",
    },
    {
      label: t("Pending"),
      value: "pending",
    },
    {
      label: t("Cancelled"),
      value: "cancelled",
    },
    {
      label: t("Refunded"),
      value: "refunded",
    },
  ];

  return (
    <StyledPayment>
      <Drawer
        title={t("Filter")}
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <RangePicker
          style={{ width: "100%" }}
          onChange={(e) => handlePeriod(e)}
        />
        <Checkbox.Group
          style={{ margin: "15px 0" }}
          onChange={handleCheckbox}
          options={statusOptions}
        />
        <Space size="middle">
          <Button
            type="dashed"
            size="middle"
            onClick={() => window.location.reload()}
          >
            {t("Reset")}
          </Button>
          <Button type="primary" size="middle" onClick={filterData}>
            {t("Filter")}
          </Button>
        </Space>
      </Drawer>

      <div className="body">
        <Tabs
          activeKey={activeTab}
          type="card"
          onChange={(key) => setActiveTab(key)}
        >
          <TabPane tab={t("Course")} key="membership">
            <PageHeader
              btnLabel={t("Add Payment")}
              iconName="AiOutlineShop"
              title="Payments"
              data={data}
              tableId="salesTable"
              tableTime={new Date()}
            />
            <div>
              <DatePicker.RangePicker
                onChange={dataFilterHandle}
                format="DD.MM.YYYY"
                placeholder={[t("From"), t("To")]}
              />
              <Input
                placeholder={t("Search")}
                onChange={handleSearch}
                style={{ width: "220px", marginLeft: "20px" }}
              />
            </div>
            <Tabs
              activeKey={status}
              onChange={(key) =>
                setFilterStatuses({ ...filterStatuses, status: key })
              }
            >
              <TabPane tab={t("All orders")} key="" />
              {Object.values(PAYMENT_STATUS).map((status) => (
                <TabPane tab={t(status.label)} key={status.value} />
              ))}
            </Tabs>
            <Table
              size="small"
              id="paymentTable"
              rowKey="_id"
              columns={columns}
              loading={loading}
              scroll={{ x: STYLING_CONFIGS.TABLE_SCROLL_BREAKPOINT }}
              dataSource={data}
              pagination={{
                ...PAGINATION,
                onChange: (page, pageSize) => setPagination(pageSize),
              }}
              summary={(record) => {
                return (
                  <>
                    <Table.Summary.Row className="fw-600">
                      <Table.Summary.Cell colSpan={2}>
                        {t("Total price")}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell colSpan={4}>
                        <p style={{ padding: 10, margin: 0 }}>
                          {parseInt(
                            record?.reduce((a, b) => a + b?.price, 0) ?? 0
                          ).toLocaleString("ru")}
                        </p>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
          </TabPane>
        </Tabs>
      </div>
      {show ? (
        <Suspense fallback="Loading...">
          <AddModal
            isVisible={show}
            hideModal={handleHideModal}
            fetchData={fetchData}
          />
        </Suspense>
      ) : null}
      {edit ? (
        <Suspense fallback="Loading...">
          <EditModal
            isVisible={edit}
            hideModal={handleHideEditModal}
            fetchData={fetchData}
            data={selectedPayment}
          />
        </Suspense>
      ) : null}
    </StyledPayment>
  );
}

export default Payments;
