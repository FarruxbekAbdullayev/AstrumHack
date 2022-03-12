import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Table, message, Image, Input } from "antd";
import PageHeader from "../../components/PageHeader";
import { StyledEquipment } from "./Students.style";
import { createTablePagination, t } from "../../utils";
import Status from "../../components/Status";
import {
  DELETE_USER,
  FETCH_TRAINERS,
  FETCH_USER,
} from "../../services/users.service";
import MoreActions from "../../components/MoreActions";
import { STYLING_CONFIGS } from "../../constants";
import { AiOutlinePicture } from "react-icons/ai";
import { QRCode } from "../../components/QRCode";
import { memo } from "react";
import useRole from "../../hooks";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";

const AddModal = lazy(() => import("../../components/Students/StudentAdd"));
const EditModal = lazy(() => import("../../components/Students/StudentEdit"));

const QRCodeComponent = memo(QRCode);

export default function Students() {
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState([]);
  const { isReceptionist } = useRole();
  const account = useSelector((state) => state.account);
  const [pagination, setPagination] = useState(
    createTablePagination().pageSize
  );

  const fetchData = async () => {
    setLoading(true);
    const data = await FETCH_USER();

    if (data) {
      setData(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHideEditModal = useCallback(() => {
    setEdit(false);
    setSelectedMembership(null);
  }, []);

  const handleHideModal = useCallback(() => {
    setShow(false);
    setSelectedMembership(null);
  }, []);

  const handleEditModal = (data) => {
    setEdit(true);
    setSelectedMembership({
      ...data,
      membership: data.membership?._id,
    });
  };

  const handleShowModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleDelete = useCallback(async (userId) => {
    setLoading(true);
    const { data } = await DELETE_USER(userId);
    if (data) {
      message.success(t("Student deleted successfully"));
      fetchData();
    }
  }, []);

  const handleSearch = (e) => {
    const { value } = e.target;
    if (value) {
      const filteredData = data.filter((item) => {
        const name = item.name.toLowerCase();
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
    // {
    //   title: t('Image'),
    //   dataIndex: 'image',
    //   render: (image) => {
    //     return ( image?
    //       <Image
    //         height={STYLING_CONFIGS.TABLE_IMAGE_HEIGHT}
    //         width={STYLING_CONFIGS.TABLE_IMAGE_HEIGHT}
    //         style={{objectFit: 'cover'}}
    //         src={image.url}
    //         alt="product"
    //       />
    //       :
    //       <AiOutlinePicture color='#999' size={STYLING_CONFIGS.TABLE_IMAGE_HEIGHT}/>
    //     )
    //   },
    // },
    {
      title: t("First Name"),
      dataIndex: "name",
      render: (text, record) => `${text} ${record.lastName}`,
    },
    {
      title: t("Phone"),
      dataIndex: "phone",
    },

    {
      title: t("QRCode"),
      dataIndex: "qrCode",
      render: (text, record) => (
        <QRCodeComponent value={record._id} size={32} />
      ),
    },
    {
      title: t("Action"),
      dataIndex: "action",
      render: (text, record) => (
        <>
          <MoreActions
            actionsList={[
              {
                title: t("Edit"),
                type: "button",
                href: `/members/${record?._id}/edit`,
                buttonType: "dashed",
                onClick: () => handleEditModal(record),
                key: "edit",
              },
              {
                title: t("Delete"),
                type: "button",
                buttonType: "danger",
                hidden: isReceptionist,
                href: `/members/${record?._id}/edit`,
                onClick: () => {
                  handleDelete(record._id);
                },
                key: "delete",
              },
            ]}
          />
        </>
      ),
    },
  ];

  if (account.role == "reception") {
    const columnsFilter = columns.filter((item) => item.dataIndex !== "action");
    columns = columnsFilter;
  }

  return (
    <StyledEquipment>
      <PageHeader
        btnLabel={t("Add Student")}
        iconName="AiOutlineUsergroupAdd"
        title="Student"
        data={data}
        onClick={handleShowModal}
        tableId="membersTable"
        tableTime={new Date()}
      />
      <Input
        placeholder={t("Search")}
        onChange={handleSearch}
        style={{ width: "220px", marginBottom: "20px" }}
      />
      <Table
        size="small"
        id="membersTable"
        rowClassName={(record) =>
          new Date(record.membershipEnd).getTime() <= new Date().getTime()
            ? "expired__date-off"
            : ""
        }
        columns={columns}
        scroll={{ x: STYLING_CONFIGS.TABLE_SCROLL_BREAKPOINT }}
        loading={loading}
        rowKey="_id"
        dataSource={data}
        pagination={{
          ...PAGINATION,
          onChange: (page, pageSize) => setPagination(pageSize),
        }}
      />

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
            data={{ ...selectedMembership }}
          />
        </Suspense>
      ) : null}
    </StyledEquipment>
  );
}
