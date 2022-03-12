import React from 'react';
import { Divider, Menu, Layout } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { COLORS } from '../../constants';
import { clearAccount } from '../../redux/auth/reducer';
import { MAIN_ROUTES } from '../../router';
import { t } from '../../utils';
import Languages from '../Languages';
import { BiLogOut } from 'react-icons/bi';
import defaultUser from '../../assets/images/user.jpg';
import useRole from '../../hooks';

const { Sider } = Layout;

export default function Sidebar() {
  const dispatch = useDispatch();
  const { firstName, role, lastName, image } = useSelector((state) => state.account);
  const location = useLocation();
  const handleLogOut = async () => {
    Swal.fire({
      title: t('Sign Out'),
      confirmButtonText: t('Confirm'),
      cancelButtonText: t('Cancel'),
      text: t('Do you confirm logging out?'),
      cancelButtonColor: '#E7E9EB',
      confirmButtonColor: COLORS.success,
      showCancelButton: true,
      customClass: 'swal-danger'
    }).then(async ({ value }) => {
      if (value) {
        dispatch(clearAccount());
      }
    });
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="80" className="custom-sidebar br-1" width="250">
      <div className="sidebar-inner-wrapper">
        <Link to="/profile" className="profile">
          <div className="profile-image mb-2">
            <img src={image?.url || defaultUser} alt="Profile" />
          </div>
          <h4>{`${firstName || ''} ${lastName || ''}`}</h4>
          <div>{t(role)}</div>
        </Link>
        <Divider style={{ margin: '3px 5px' }} />
        <Menu mode="inline" id="sidebar-menu" selectedKeys={[location.pathname]}>
          {MAIN_ROUTES.filter(i => !i.hidden && i.allowedRoles.includes(role)).map((item) => {
            const { icon, path, title } = item;
            return (
              <Menu.Item key={path} className="sidebar-item" icon={icon}>
                <NavLink to={path}>{t(title)}</NavLink>
              </Menu.Item>
            );
          })}
          <Menu.Item
            key="logout"
            onClick={handleLogOut}
            className="sidebar-item"
            icon={<BiLogOut />}
          >
            <NavLink to="#">{t('Sign Out')}</NavLink>
          </Menu.Item>
        </Menu>
      </div>
      <Languages />
    </Sider>
  );
}
