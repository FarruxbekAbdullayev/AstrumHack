import { createGlobalStyle } from 'styled-components';
import { pxToRem } from './utils';

export default createGlobalStyle`
  body {
    font-family: 'Manrope', sans-serif;
  }
  button:focus, .swal2-styled.swal2-default-outline:focus {
    box-shadow: none;
  }
  .ant-form-item {
    margin-bottom: ${pxToRem(8)};
  }
`;
