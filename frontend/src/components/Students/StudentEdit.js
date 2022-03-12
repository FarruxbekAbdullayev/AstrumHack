import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Modal, Input, Form, Select, message, DatePicker } from "antd";
import PropTypes from "prop-types";
import { omitUpdateProps, t } from "../../utils";
import { UPDATE_USER } from "../../services/users.service";
import { LANGUAGES } from "../../constants";
import { FETCH_MEMBERSHIP } from "../../services/membership.service";
import { FETCH_TRAINERS } from "../../services/users.service";
import UploadComponent from "../Upload";
import moment from "moment";

const { Option } = Select;

export default function MemberEdit({
  isVisible,
  hideModal,
  fetchData,
  data = {},
}) {
  const [memberships, setMemberships] = useState([]);
  const [trainersData, setTrainers] = useState([]);
  const [inputValues, setInputValues] = useState({
    ...data,
    trainer: data?.trainer?._id,
  });

  const fetchMemberships = async () => {
    const { data } = await FETCH_MEMBERSHIP();
    const { data: trainerData } = await FETCH_TRAINERS();
    if (data && trainerData) {
      setMemberships(data);
      setTrainers(trainerData);
    }
  };
  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleMembership = (membership) => {
    setInputValues((state) => ({ ...state, membership }));
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === "phone" && value.length === 14) {
      return;
    }

    setInputValues((state) => ({ ...state, [name]: value }));
  }, []);

  const handleStatusChange = (status) => {
    setInputValues((state) => ({ ...state, status }));
  };

  const handleLangChange = (value) => {
    setInputValues((state) => ({ ...state, lang: value }));
  };

  const handleFileChange = (info) => {
    setInputValues((state) => ({ ...state, image: info.file?._id }));
  };

  const handleSubmit = async () => {
    const { image, ...updateData } = omitUpdateProps(inputValues);
    if (!image?._id) {
      updateData.image = inputValues.image;
    }
    const { data } = await UPDATE_USER(inputValues._id, {
      ...updateData,
      status: inputValues.status,
    });

    if (data) {
      message.success(t("Student updated successfully"));
      fetchData();
      hideModal();
    }
  };

  const handleDateChange = (date, name) => {
    setInputValues((state) => ({ ...state, [name]: date }));
  };

  const {
    address,
    membership,
    name,
    phone,
    lastName,
  } = { ...inputValues };

  const selectedMembership = useMemo(
    () => memberships.find((item) => item._id === membership),
    [memberships, membership]
  );

  return (
    <Modal
      title={t("Update Student")}
      style={{ top: 20 }}
      visible={isVisible}
      okText={t("Update Student")}
      cancelText={t("Cancel")}
      onOk={handleSubmit}
      centered
      onCancel={hideModal}
    >
      <Form
        name="basic"
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="on"
        layout="vertical"
      >
        <Form.Item label={t("First Name")}>
          <Input
            name="name"
            value={name}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label={t("Last Name")}>
          <Input
            name="lastName"
            value={lastName}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label={t("Phone")}>
          <Input name="phone" value={phone} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t("Address")}>
          <Input name="address" value={address} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t("Course")}>
          <Select
            name="status"
            style={{ width: "100%" }}
            allowClear
            defaultValue={inputValues?.trainer || null}
            onChange={(e) => setInputValues({ ...inputValues, trainer: e })}
          >
            <Option value={null}>{t("Coach is not needed")}</Option>
            {trainersData?.map((item) => (
              <Option value={item?._id}>
                {item.firstName} {item.lastName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t("Group")}>
          <Select
            name="status"
            style={{ width: "100%" }}
            allowClear
            defaultValue={inputValues?.trainer || null}
            onChange={(e) => setInputValues({ ...inputValues, trainer: e })}
          >
            <Option value={null}>{t("Coach is not needed")}</Option>
            {trainersData?.map((item) => (
              <Option value={item?._id}>
                {item.firstName} {item.lastName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

MemberEdit.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
};
