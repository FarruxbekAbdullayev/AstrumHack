import styled from 'styled-components';

export const StyledSettings = styled.section`
  .add-btn {
    display: flex;
    align-items: center;
    align-self: flex-end;
    margin-left: auto;
    svg {
      margin-right: 10px;
    }
  }
  .plan-inner {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    column-gap: 50px;
    row-gap: 30px;

    .plan {
      width: 250px;
      padding: 25px;
      background: #fbfafa;
      border-radius: 14px;

      h2 {
        font-size: 22px;
        text-align: center;
        margin: 4;
        margin: 0;
      }
      p {
        margin: 0;
        font-size: 16px;
        text-align: center;
      }
      h1 {
        font-size: 32px;
        text-align: center;
        margin: 0;
        font-weight: bolder;
      }
      span {
        text-align: center;
        display: block;
      }
      .plan__tags {
        margin-top: 25px;
        margin-bottom: 50px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        div {
          display: flex;
          align-items: flex-start;
          column-gap: 10px;
        }
        button {
          width: 100%;
        }
      }
    }
  }
    .tab__profile {
      margin-top: 25px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: flex-start;
      column-gap: 20px;

        img {
            height: 200px;
            border-radius: 50%;
            object-fit: cover;
        }
        .ant-image-mask {
            border-radius: 50%;
        }
        .form__btn {
          width: 96% !important;
          margin-top: 25px;
          text-align: right;

          button {
            width: 100px;
          }
        }
        .image-inner {
          height: fit-content;
          position: relative;

          button {
              position: absolute;
              top: 70%;
              right: 10px;
          }
        }
        form {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            column-gap: 30px;
        }
        .ant-form-vertical .ant-form-item {
            min-width: 45%;
            flex: 1;
        }
    }
    .plan__buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      column-gap: 15px;
      row-gap: 10px;
      flex-wrap: wrap;

      button {
        flex: 1;
      }
    }
`;
