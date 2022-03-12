import styled from 'styled-components';

const refunded = `
    display: inline-block;
    color: #84818A;
    background-color: rgba(182, 180, 186, 0.1);
`;
const cancelled = `
    display: inline-block;
    color: #FC3400;
    background-color: rgba(252, 52, 0, 0.1);
`;
const pending = `
    display: inline-block;
    color: #FFA043;
    background-color: rgba(255, 160, 67, 0.1);
`;
const paid = `
    display: inline-block;
    color: #2ACEC6;
    background-color: rgba(32, 201, 172, 0.1);
`;
const active = `
    display: inline-block;
    color: #5542F6;
    background-color: rgba(85, 66, 246, 0.1);
`;
const inactive = `
    display: inline-block;
    color: #FFA043;
    background-color: rgba(255, 160, 67, 0.1);
`;
const pay = `
    display: inline-block;
    color: #359b00;
    background-color: #ddffd2;
`;

const status = {
    pending,
    refunded,
    cancelled,
    paid,
    active,
    inactive,
    pay
};

export const Status = styled.span`
  ${(props) => status[props.status]}
  padding: 2px 8px 4px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-transform: capitalize;
`;

export default Status;
