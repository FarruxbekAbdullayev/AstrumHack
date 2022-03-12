import React, { useState, lazy, Suspense, useCallback, useEffect } from 'react';
import { Tabs, Button, message, Popconfirm } from 'antd';
import { AiFillCheckCircle, AiOutlinePlusCircle,  } from 'react-icons/ai';
import { StyledSettings } from './Settings.style';
import PageHeader from '../../components/PageHeader';
import { t } from '../../utils';
import colors from '../../constants/colors';
import { DELETE_MEMBERSHIP, FETCH_MEMBERSHIP } from '../../services/membership.service';
import useRole from '../../hooks';
import Profile from '../../components/Settings/Profile';

const { TabPane } = Tabs;
const AddModal = lazy(() => import('../../components/Settings/MembershipAdd'));
const EditModal = lazy(() => import('../../components/Settings/MembershipEdit'));
const Admins = lazy(() => import('../../components/Settings/Admins'));

const Settings = () => {
  const {isAdmin} = useRole();
  const [tab, setTab] = useState('plans');
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const { data } = await FETCH_MEMBERSHIP();
    if (data) {
      setData(data);
    }
  };

  function handleActiveTab(key) {
    setTab(key);
  }

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
    setSelectedMembership(data);
  };

  const handleDeleteMembership = async (id) => {
    const { data } = await DELETE_MEMBERSHIP(id);
    if (data) {
      fetchData();
      message.success(t('Membership deleted successfully'));
    }
  };

  const cancel = (e) => {};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StyledSettings>
      <PageHeader
        btnLabel={t('Add Plan')}
        title={t('Settings')}
        iconName="BiCog"
        onClick={handleShowModal}
        hideButton={true}
      />

      <Tabs onChange={handleActiveTab} type="card" activeKey={tab}>
        <TabPane tab={t('Plans')} key="plans">
          <PageHeader
            btnLabel={t('Add Plan')}
            title={`${data.length} ${t('Plans')}`}
            iconName="BiCog"
            onClick={handleShowModal}
          />
          <div className="plan-inner">
            {data?.map((item) => (
              <div className="plan" key={item?._id}>
                <h2>{item?.title}</h2>
                <p>{item?.subTitle}</p>
                <h1>{item?.price?.toLocaleString()}</h1>
                <span>1 {t(item?.duration)}</span>
                <div className="plan__tags">
                  {item?.tags?.map((i) => (
                    <div>
                      <span>
                        <AiFillCheckCircle size={28} color={colors.main} />
                      </span>
                      <span style={{textAlign: 'left'}}>
                        {i}
                      </span>
                    </div>
                  ))}
                </div>
                {isAdmin ? (
                  <div className="plan__buttons">
                    <Button size="middle" type="primary" ghost onClick={() => handleEditModal(item)}>
                      {t('Edit')}
                    </Button>
                    <Popconfirm
                      title={t("Are you delete?")} 
                      okText={t("Yes")} 
                      cancelText={t("No")} 
                      onConfirm={() => handleDeleteMembership(item._id)} 
                      onCancel={cancel}
                    >
                      <Button size="middle" danger>
                        {t('Delete')}
                      </Button>
                    </Popconfirm>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </TabPane>
        <TabPane tab={t("Profile")} key="profile" className="tab__profile">
            <Profile />
        </TabPane>
        {
          isAdmin ? (
            <TabPane tab={t("Employees")} key="employee">
              <Admins />
            </TabPane>
          )
          :
          null
        }
        
      </Tabs>
      {show && isAdmin ? (
        <Suspense fallback="Loading...">
          <AddModal isVisible={show} hideModal={handleHideModal} fetchData={fetchData} />
        </Suspense>
      ) : null}
      {edit && isAdmin ? (
        <Suspense fallback="Loading...">
          <EditModal
            isVisible={edit}
            hideModal={handleHideEditModal}
            fetchData={fetchData}
            data={selectedMembership}
          />
        </Suspense>
      ) : null}
    </StyledSettings>
  );
};

export default Settings;