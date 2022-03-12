import styled from 'styled-components';

const StyledPayment = styled.section`
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
      font-weight: 600;
      font-size: 32px;
    }
    .header__block {
      display: flex;
      align-items: center;
      column-gap: 24px;

      .ant-input-affix-wrapper {
        height: 48px;
      }
      button {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .statistics__wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
    gap: 20px; 
    margin: 20px 0;
  }


  .hide {
    display: none;
  }

  .pay__btn {
    display: inline-block;
    cursor: pointer;
    margin-left: 10%;
    box-shadow: 0 0 2px lightgray;
  }

  .pay__btn:hover {
    background-color: #83d768;
  }

  .statistics__card {
    box-shadow: 0px 0px 10px #efeff894;
    border-radius: 10px;
    padding: 20px 10px 20px 30px;
    background: #f3f3f3;
    }

    .statistics__title {
      font-size: 16px;
      color: #a3a9b9;
      margin: 0;
    }

    .green--status {
      color: #27AA87;
    }
    
    .red--status {
      color: #E24C82;
    }
    
    .statistics__subtitle {
      font-size: 16px;
    }

    .statistics__amount {
      font-size: 24px;
      font-weight: 600;
      margin: 8px 0;
    }

  .body {
    margin-top: 40px;
  }

  .filter-button {
    display: flex;
    align-items: center;
    column-gap: 5px;
    float: right;
    margin-bottom: 25px;
  }

  .tab__statistic {
    padding: 20px 0;
    display: flex;
    flex-wrap: wrap;
    column-gap: 40px;

    h2 {
      font-size: 26px;
      font-weight: bold;
      margin: 0;
    }
    p {
      font-size: 14px;
      margin-bottom: 0;
      color: gray;
    }
  }
  .table__action {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 16px;

    button {
      border: 0;
      background: transparent;
      cursor: pointer;
    }
  }
`;

export default StyledPayment;
