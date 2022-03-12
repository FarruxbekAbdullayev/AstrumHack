import React, { useMemo } from 'react';
import { Menu, Dropdown, Button, Popconfirm } from 'antd';
import { MdMoreHoriz } from 'react-icons/md';
import { t } from '../utils/';


export default function MoreActions({actionsList}) {
  const cancel = (e) => {};
  
  const menu = useMemo(() => {
    return actionsList.filter(i => !i.hidden).map(item => {  
      return (
        <Menu.Item key={item.key}>
          {
            item.type === 'link' ?  
              <a target="_blank" rel="noopener noreferrer" href={item.href}>
                {item.title}
              </a>
            :
            item.buttonType === 'danger'?
            <Popconfirm
             title={t("Are you delete?")} 
             okText={t("Yes")} 
             cancelText={t("No")} 
             onConfirm={item.onClick} 
             onCancel={cancel}
            >
              <Button style={{background: 'transparent', border: 'none', padding: 0, boxShadow: 'none'}} type={item.type}>{item.title}</Button>
            </Popconfirm>
            :
            <Button style={{background: 'transparent', border: 'none', padding: 0, boxShadow: 'none'}} onClick={item.onClick} type={item.type}>{item.title}</Button>
          }
        </Menu.Item>
      )
    })
  },[actionsList]);
  
  return (
    <Dropdown 
      overlayStyle={{
        marginLeft: 10,
        border: 0,
        background: 'transparent',
        boxShadow: 'none'
      }} 
      overlay={<Menu>{menu}</Menu>} 
      placement="topLeft"
    >
      <Button className="more"><MdMoreHoriz size={24} /></Button>
    </Dropdown>
  );
}

MoreActions.propTypes = {
  // actionsList: PropTypes.array({
  //   title: PropTypes.string,
  //   onClick: PropTypes.func,
  //   href: PropTypes.string,
  //   type: PropTypes.oneOf(['link', 'button']),
  //   buttonType: PropTypes.oneOf(['primary', 'danger', 'default', 'dashed', 'link']),
  // })
};
