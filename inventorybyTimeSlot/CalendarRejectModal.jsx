import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { toast } from 'react-toastify';
import CalendarRejectCard from './CalendarRejectCard';
import { orderStatusChange } from '../../services/conduit/order';
import { ReactComponent as CancelX } from '../../asset/icon/CancelX.svg';
import styled, { css } from 'styled-components';
function CalendarRejectModal({
  handleCancelBtn,
  total,
  isCheckedOrderListArr,
  resultOrderList,
  handleRest,
}) {
  const [orderCardData, setOrderCardData] = useState([]);
  const [rejectionTypeData, setRejectionTypeSelect] = useState([]);
  const [reason, setReason] = useState([]);
  const [descriptionText, setDescriptionText] = useState([]);
  const [isReject, setIsReject] = useState(false);
  const notify = () =>
    toast.success('Selected order(s) successfully updated.', {});

  const handleRejection = (e, orderId, cardId) => {
    if (e) {
      let rejectionArr = [...rejectionTypeData];
      rejectionArr[cardId] = { id: orderId, value: e.value };
      setRejectionTypeSelect(rejectionArr);
    } else {
      let rejectionArr = [...rejectionTypeData];
      rejectionArr[cardId] = '';
      setRejectionTypeSelect(rejectionArr);
    }
  };

  const handleReason = (e, cardId) => {
    if (e) {
      let reasonArr = [...reason];
      reasonArr[cardId] = e.label;
      setReason(reasonArr);
    } else {
      let reasonArr = [...reason];
      reasonArr[cardId] = '';
      setReason(reasonArr);
    }
  };

  const handleTextArea = (e, cardId) => {
    let descriptionArr = [...descriptionText];
    descriptionArr[cardId] = e.target.value;
    setDescriptionText(descriptionArr);
  };

  const handleRejectOrder = async () => {
    const elements = orderCardData.entries();
    let result = 0;
    for (const [index, element] of elements) {
      let statusCode = 0;
      if (rejectionTypeData[index].value === 1) {
        statusCode = '4';
      } else {
        statusCode = '6';
      }
      const res = await orderStatusChange(rejectionTypeData[index].id, {
        ax_status: statusCode,
        comment: reason[index] + '/' + descriptionText[index],
      });
      if (res.status === 200) {
        // setIsReset(!isReset);
        // setIsCheckedOrderListArr([]);
        // notify();
      } else {
        result += 1;
        alert(
          `Status Code : ${res.status} Status Text : ${res.statusText} Error`
        );
      }
    }
    if (result === 0) {
      handleRest();
      notify();
    }
  };

  useEffect(() => {
    let resultOrderCardData = [];
    isCheckedOrderListArr.forEach((data, index) => {
      if (data && index > 0) {
        resultOrderCardData.push(resultOrderList[index - 1]);
      }
    });
    setOrderCardData(resultOrderCardData);
  }, [resultOrderList]);
  useEffect(() => {
    let result = 0;
    orderCardData.forEach((data, index) => {
      if (
        rejectionTypeData[index] === undefined ||
        rejectionTypeData[index] === ''
      ) {
        result = 1;
      }
      if (reason[index] === undefined || reason[index] === '') {
        result = 1;
      }
      if (
        descriptionText[index] === undefined ||
        descriptionText[index] === ''
      ) {
        result = 1;
      }
    });
    if (result === 0) {
      setIsReject(true);
    } else {
      setIsReject(false);
    }
  }, [orderCardData, rejectionTypeData, reason, descriptionText]);

  if (orderCardData.length === 0) return <div />;

  return (
    <ModalContainer>
      <ModalWrapper>
        <CancelX className="cancelIcon" onClick={handleCancelBtn} />
        <ModalContents>
          <span className="modalTitle">Reject {total} order(s)?</span>
          <ModalMainContents>
            <span className="modalSubTitle">
              This will reject the order(s). Do you still want to continue?
            </span>
            <div className="rejectCardWrapper">
              {orderCardData.map((data, index) => {
                return (
                  <CalendarRejectCard
                    key={index}
                    resultOrderList={data}
                    cardId={index}
                    rejectionTypeData={rejectionTypeData[index]?.value}
                    handleRejection={handleRejection}
                    handleReason={handleReason}
                    handleTextArea={handleTextArea}
                    descriptionText={descriptionText[index]}
                  />
                );
              })}
            </div>
          </ModalMainContents>
          <div className="btnWrapper">
            <div className="cancelBtn">
              <Button
                name="ghostMediumGray"
                buttonName="Cancel"
                isCheck={true}
                handleButtonClick={handleCancelBtn}
              />
            </div>
            <Button
              name="feedbackMedium"
              buttonName="Reject"
              isCheck={isReject}
              type="submit"
              handleButtonClick={handleRejectOrder}
            />
          </div>
        </ModalContents>
      </ModalWrapper>
    </ModalContainer>
  );
}

const H3FontStyle = css`
  font: ${props => props.theme.Font.h3Semibold};
  letter-spacing: ${props => props.theme.letterSpacing.h3Semibold};
`;

const C1MFontStyle = css`
  font: ${props => props.theme.Font.caption1Medium};
  letter-spacing: ${props => props.theme.letterSpacing.caption1Medium};
`;

const C1RFontStyle = css`
  font: ${props => props.theme.Font.caption1Regular};
  letter-spacing: ${props => props.theme.letterSpacing.caption1Regular};
`;

const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 15;
`;

const ModalWrapper = styled.div`
  position: relative;
  width: 800px;
  background: ${props => props.theme.Color.white};
  box-shadow: 5px 14px 39px -2px rgba(49, 50, 69, 0.25);
  border-radius: 6px;
  .cancelIcon {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
  }
`;

const ModalContents = styled.div`
  display: flex;
  flex-direction: column;
  .modalTitle {
    height: 72px;
    padding: 32px 0 0 24px;
    box-sizing: border-box;
    border-bottom: 1px solid ${props => props.theme.Color.coolgrayCG50};
    color: ${props => props.theme.Color.coolgrayCG900};
    ${H3FontStyle}
  }
  img {
    width: 24px;
  }
  .subTitleWrapper {
    display: flex;
    padding: 24px 0 0 24px;
    flex-direction: column;
    box-sizing: border-box;
    color: ${props => props.theme.Color.coolgrayCG900};
    ${C1MFontStyle}
  }
  .btnWrapper {
    display: flex;
    justify-content: flex-end;
    padding: 16px 16px 32px 0;
    border-top: 1px solid ${props => props.theme.Color.coolgrayCG50};
    .cancelBtn {
      margin-right: 8px;
    }
  }
  .filterSelect {
    width: 220px;
  }
  .selectBox {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8px 24px 40px 24px;
  }
  .textFieldWrapper {
    margin: 0 0 0 8px;
  }
`;

const ModalMainContents = styled.div`
  height: 406px;
  overflow: hidden;
  overflow-y: auto;
  .modalSubTitle {
    display: block;
    margin: 16px 0 0 24px;
    color: ${props => props.theme.Color.coolgrayCG700};
    ${C1RFontStyle}
  }
  .rejectCardWrapper {
    margin: 24px 0 20px 24px;
  }
`;

export default CalendarRejectModal;
