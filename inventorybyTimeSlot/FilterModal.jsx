import React, { useEffect, useState } from 'react';
import Button from '../Button';
import { SelectIntegrationModal } from '../Select';
import { ReactComponent as CancelX } from '../../asset/icon/CancelX.svg';
import styled, { css } from 'styled-components';

function FilterModal({
  onChangeChannel,
  handleCancelBtn,
  onSubmit,
  channelNameData,
  handleChannelId,
  purchaserName,
  handleStatus,
  handlePurchaser,
  onChangePurchaser,
  onChangeStatus,
  handleUnSelectAll,
  OrderPurchaserStatusData,
}) {
  console.log('channelNameData', channelNameData);
  return (
    <ModalContainer>
      <ModalWrapper>
        <div className="headWrapper">
          <span className="modalTitle">Filters</span>
          <CancelX className="cancelIcon" onClick={handleCancelBtn} />
        </div>
        <ModalContents>
          <div className="combinationWrapper">
            <div className="title">Channel</div>
            <div className="contents">
              <SelectIntegrationModal
                options={channelNameData}
                onChange={handleChannelId}
                value={onChangeChannel}
                // defaultValue={{ label: 'London', value: 2002, id: 'London' }}
              />
            </div>
          </div>
          <div className="combinationWrapper">
            {/* <div className="title">Default duration hour</div> */}
            <div className="title">Purchaser name</div>
            <div className="contents">
              <SelectIntegrationModal
                options={purchaserName}
                onChange={handlePurchaser}
                value={onChangePurchaser}
              />
            </div>
          </div>
          <div className="combinationWrapper">
            {/* <div className="title">Default duration hour</div> */}
            <div className="title">Status</div>
            <div className="contents">
              <SelectIntegrationModal
                options={OrderPurchaserStatusData}
                onChange={handleStatus}
                value={onChangeStatus}
              />
            </div>
          </div>
        </ModalContents>
        <div className="btnWrapper">
          <div className="cancelBtn">
            <Button
              name="ghostSmallGray"
              buttonName="Cencel"
              isCheck={true}
              handleButtonClick={handleCancelBtn}
            />
          </div>
          <div className="rejectBtn">
            <Button
              buttonName="Unselect all"
              name="secondarySmall"
              isCheck={true}
              type="button"
              handleButtonClick={e => {
                //handleModalClick();
                handleUnSelectAll();
              }}
            />
          </div>
          <Button
            buttonName="Search"
            name="primarySmall"
            isCheck={true}
            type="button"
            handleButtonClick={e => {
              //handleModalClick();
              handleCancelBtn();
              onSubmit(e);
            }}
          />
        </div>
      </ModalWrapper>
    </ModalContainer>
  );
}

const c1FontStyle = css`
  color: ${props => props.theme.Color.coolgrayCG900};
  font: ${props => props.theme.Font.caption1Semibold};
  letter-spacing: ${props => props.theme.letterSpacing.caption1Semibold};
`;
const c1RFontStyle = css`
  color: ${props => props.theme.Color.coolgrayCG600};
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
  z-index: 12;
`;

const ModalWrapper = styled.div`
  position: relative;
  background: ${props => props.theme.Color.white};
  box-shadow: 5px 14px 39px -2px rgba(49, 50, 69, 0.25);
  border-radius: 6px;
  .headWrapper {
    margin-top: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${props => props.theme.Color.coolgrayCG50};
  }
  .modalTitle {
    /* position: fixed; */
    color: ${props => props.theme.Color.coolgrayCG900};
    font: ${props => props.theme.Font.h3Semibold};
    letter-spacing: ${props => props.theme.letterSpacing.h3Semibold};
    padding-left: 24px;
  }
  .cancelIcon {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
  }
  .btnWrapper {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid ${props => props.theme.Color.coolgrayCG50};
    margin-top: 32px;
    padding: 16px 24px 32px 0;
    .cancelBtn {
      margin-right: 8px;
    }
  }
  .rejectBtn {
    margin-right: 8px;
  }
`;

const ModalContents = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  margin: 8px 0 0 0;

  .subTitleWrapper {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    ${c1FontStyle}
    .subTitle {
      margin-left: 24px;
    }
  }
  .combinationWrapper {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    /* margin-top: 8px; */
    /* margin-left: 24px; */
    /* border: 1px solid ${props => props.theme.Color.coolgrayCG50};  */
    .title {
      width: 752px;
      padding: 0 0 0 16px;
      color: ${props => props.theme.Color.coolgrayCG900};
      font: ${props => props.theme.Font.caption1Medium};
      letter-spacing: ${props => props.theme.letterSpacing.caption1Medium};
    }
    .contents {
      padding: 8px 0 8px 16px;

      ${c1RFontStyle}
    }
  }
`;

export default FilterModal;
