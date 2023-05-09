import React, { useState } from 'react';
import { SelectMedium } from '../Select';
import {
  reasonPartnerReject,
  reasonUnavoidablyCancel,
  rejectionTypeSelect,
} from '../../asset/data/SupplierUnitFilterData';
import styled, { css } from 'styled-components';
function CalendarRejectCard({
  resultOrderList,
  handleRejection,
  handleReason,
  handleTextArea,
  rejectionTypeData,
  descriptionText,
  cardId,
}) {
  if (!resultOrderList) return <div />;
  return (
    <OrderRejectContainer>
      <div className="orderInfo">
        <div className="orderId">
          <span className="title">Order ID</span>
          <span className="value">{resultOrderList?.order_id}</span>
        </div>
        <div className="purchaserName">
          <span className="title">Purchaser name</span>
          <span className="value">{resultOrderList?.purchaser.name}</span>
        </div>
        <div className="productName">
          <span className="title">Product name</span>
          <span className="value">{resultOrderList?.purchaser.name}</span>
        </div>
      </div>
      <div className="selectBoxWrapper">
        <div className="selectBoxContainer">
          <span className="title">Rejection Type</span>
          <SelectMedium
            options={rejectionTypeSelect}
            onChange={e => {
              handleRejection(e, resultOrderList?.order_id, cardId);
            }}
            placeholder="Rejction type"
          />
        </div>
        <div className="selectBoxContainer">
          <span className="title">Reason</span>
          <SelectMedium
            options={
              rejectionTypeData === 1
                ? reasonPartnerReject
                : reasonUnavoidablyCancel
            }
            onChange={e => {
              handleReason(e, cardId);
            }}
            placeholder="Reason"
            isDisabled={rejectionTypeData === 0}
          />
        </div>
      </div>
      <div className="descriptionWrapper">
        <div className="descriptionContainer">
          <span className="title">Description</span>
          <textarea
            value={descriptionText}
            onChange={e => {
              handleTextArea(e, cardId);
            }}
          />
        </div>
      </div>
    </OrderRejectContainer>
  );
}

const C1MFontStyle = css`
  font: ${props => props.theme.Font.caption1Medium};
  letter-spacing: ${props => props.theme.letterSpacing.caption1Medium};
`;

const H5MFontStyle = css`
  font: ${props => props.theme.Font.h5Medium};
  letter-spacing: ${props => props.theme.letterSpacing.h5Medium};
`;

const OrderRejectContainer = styled.div`
  width: 752px;
  margin-top: 8px;
  border: 1px solid ${props => props.theme.Color.coolgrayCG100};
  border-radius: 4px;
  .title {
    display: block;
    margin-bottom: 8px;
    color: ${props => props.theme.Color.coolgrayCG900};
    ${C1MFontStyle}
  }
  .orderInfo {
    display: flex;
    width: 752px;
    margin-top: 16px;
    .value {
      display: block;
      color: ${props => props.theme.Color.coolgrayCG400};
      ${C1MFontStyle}
    }
    .orderId {
      width: 183px;
      margin-left: 16px;
      word-break: break-all;
    }
    .purchaserName {
      width: 153px;
      margin-left: 16px;
      word-break: break-all;
    }
    .productName {
      width: 352px;
      margin-left: 16px;
      word-break: break-all;
    }
  }
  .selectBoxWrapper {
    display: flex;
    width: 752px;
    height: 66px;
    margin-top: 16px;
    .selectBoxContainer {
      width: 352px;
      height: 66px;
      margin-left: 16px;
    }
  }
  .descriptionWrapper {
    margin: 16px 0 16px 0;
    .descriptionContainer {
      margin-left: 16px;
      textarea {
        width: 720px;
        height: 80px;
        padding: 11px 16px;
        box-sizing: border-box;
        border: 1.5px solid ${props => props.theme.Color.coolgrayCG100};
        border-radius: 4px;
        color: ${props => props.theme.Color.coolgrayCG900};
        resize: none;
        ${H5MFontStyle}
        &:hover {
          border: 1.5px solid ${props => props.theme.Color.coolgrayCG300};
        }
        &:focus {
          border: 2px solid ${props => props.theme.Color.primaryP500};
        }
      }
    }
  }
`;

export default CalendarRejectCard;
