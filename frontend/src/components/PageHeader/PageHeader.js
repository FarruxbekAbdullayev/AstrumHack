import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { AiOutlineUsergroupAdd, AiOutlinePlusCircle, AiOutlineShop, AiOutlineFilePdf } from 'react-icons/ai';
import { t } from '../../utils';
import { exportToPdf } from '../../utils/exportToPdf';
import {useSelector} from 'react-redux'

import { BiCog, BiDumbbell } from 'react-icons/bi';

import { StyledPageHeader } from './PageHeader.style';
import { COLORS } from '../../constants';
import { pxToRem } from '../../utils';
import useRole from '../../hooks';
import moment from 'moment';

const ICONS = {
  AiOutlineFilePdf: <AiOutlineFilePdf fill="#F40F02" />,
  AiOutlineUsergroupAdd: <AiOutlineUsergroupAdd size={pxToRem(24)} color={COLORS.grey} />,
  AiOutlineShop: <AiOutlineShop size={pxToRem(24)} color={COLORS.grey} />,
  BiDumbbell: <BiDumbbell size={pxToRem(24)} color={COLORS.grey} />,
  BiCog: <BiCog size={pxToRem(24)} color={COLORS.grey} />
};

export default function PageHeader({
  title,
  btnLabel,
  onClick,
  data,
  iconName = 'AiOutlineUsergroupAdd',
  tableId,
  hideButton=false,
  children,
  tableTime
}) {
  const auth = useSelector(state => state.account);
  const PdfPages = ['Equipment', 'Member', 'Payments', 'Product', "Attandance", "Expences", "Dashboard"]

  return (
    <StyledPageHeader className="page-header">
      <div className="page-header__title">
        {ICONS[iconName]}                                             
        <h3>{`${data?.length ?? ''} ${t(title)}`}</h3>
      </div>
      
      <div>
        <h3 style={{fontWeight: 600}}>
          {moment().format('DD.MM.YYYY')}
        </h3>
      </div>
     
        <div className='page__header-btns-wrapper'>
          {
            PdfPages.includes(title) && data?.length > 0 &&
            <AiOutlineFilePdf onClick={() => exportToPdf({tableId, fileName: t(title), auth, tableTime: tableTime})} className='page__header-pdf-btn' />
          }
          {
            !hideButton && btnLabel ? <Button type="primary" size="large" onClick={onClick} icon={<AiOutlinePlusCircle />}>
            {btnLabel}
          </Button> : null 
          }
           {children}
        </div>
    </StyledPageHeader>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  // btnLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  iconName: PropTypes.oneOf(['AiOutlineUsergroupAdd']),
  hideButton: PropTypes.bool
};
