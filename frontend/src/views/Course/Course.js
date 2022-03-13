import React, {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from "react";
import { Table, message, Image, Input, Card } from "antd";
import PageHeader from "../../components/PageHeader";
import StyledCourse from "./Course.style";
import { createTablePagination, t } from "../../utils";
import MoreActions from "../../components/MoreActions";
import { STYLING_CONFIGS } from "../../constants";
import { AiOutlinePicture } from "react-icons/ai";
import { QRCode } from "../../components/QRCode";
import { memo } from "react";
import useRole from "../../hooks";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";

const AddModal = lazy(() => import("../../components/Course/CourseAdd"));

export default function Course() {
  const [data, setData] = useState([{
    name: 'Hello',
    groups: 4,
    teachers: 2,
    duration: 2,
  }]);
  const [show, setShow] = useState(false);

  // const fetchData = async () => {
  //   setLoading(true);
  //   const data = await FETCH_USER();

  //   if (data) {
  //     setData(data);
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const handleSearch = (e) => {
  //   const { value } = e.target;
  //   if (value) {
  //     const filteredData = data.filter((item) => {
  //       const name = item.name.toLowerCase();
  //       if (name.includes(value.toLowerCase())) {
  //         return item;
  //       } else {
  //       }
  //     });
  //     setData(filteredData);
  //   } else {
  //     fetchData();
  //   }
  // };

  // const PAGINATION = useMemo(
  //   () => createTablePagination(data.length, pagination),
  //   [pagination, data]
  // );

  
  const handleShowModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleHideModal = useCallback(() => {
    setShow(false);
  }, []);

  let columns = [
    {
      title: t("№"),
      dataIndex: "number",
      render: (value, record, index) => index + 1,
    },
    {
      title: t("Name"),
      dataIndex: "name",
      render: (text, record) => <Link to={`/course/${record._id}`}>{text}</Link>,
    },
    {
      title: t("Groups"),
      dataIndex: "groups",
    },
    {
      title: t("Teachers"),
      dataIndex: "teachers",
    },
    {
      title: t("Duration"),
      dataIndex: "duration",
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
                // onClick: () => handleEditModal(record),
                key: "edit",
              },
              {
                title: t("Delete"),
                type: "button",
                buttonType: "danger",
                // hidden: isReceptionist,
                href: `/members/${record?._id}/edit`,
                // onClick: () => {
                //   handleDelete(record._id);
                // },
                key: "delete",
              },
            ]}
          />
        </>
      ),
    },
  ];

  return <StyledCourse>
    <PageHeader
        btnLabel={t("Add Course")}
        iconName="AiOutlineUsergroupAdd"
        title="Courses"
        data={data}
        onClick={handleShowModal}
        tableId="coursesTable"
        tableTime={new Date()}
      />
      <Input
        placeholder={t("Search")}
        // onChange={handleSearch}
        style={{ width: "220px", marginBottom: "20px" }}
      />
      <Table
        size="small"
        id="membersTable"
        columns={columns}
        scroll={{ x: STYLING_CONFIGS.TABLE_SCROLL_BREAKPOINT }}
        // loading={loading}
        rowKey="_id"
        dataSource={data}
        // pagination={{
        //   ...PAGINATION,
        //   onChange: (page, pageSize) => setPagination(pageSize),
        // }}
      />
            {show ? (
        <Suspense fallback="Loading...">
          <AddModal
            isVisible={show}
            hideModal={handleHideModal}
            // fetchData={fetchData}
          />
        </Suspense>
      ) : null}
      {/* {edit ? (
        <Suspense fallback="Loading...">
          <EditModal
            isVisible={edit}
            hideModal={handleHideEditModal}
            fetchData={fetchData}
            data={{ ...selectedMembership }}
          />
        </Suspense>
      ) : null} */}
  </StyledCourse>
}