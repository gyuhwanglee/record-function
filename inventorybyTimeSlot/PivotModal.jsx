import React, { useEffect, useState, useRef } from 'react';
import useSWR, { preload } from 'swr';
import { client, fetcher } from '../../services/Common';
import { useNavigate } from 'react-router-dom';
import TextField from '../TextField';
import Button from '../Button';
import TextButton from '../TextButton';
import CheckBoxSmall from '../CheckBoxSmall';
import Modal from '../Modal';
import OrderModal from '../order_list/OrderModal';
import CalendarRejectModal from './CalendarRejectModal';
import FilterModal from './FilterModal';
import SendNotificationModal from '../order_list/SendNotificationModal';
import NotificationModal from '../order_list/NotificationModal';
import VoucherModal from '../order_list/VoucherModal';
import { OrderCalenderModalData } from '../../asset/data/ModalData';
import { orderStatusChange } from '../../services/conduit/order';
import { orderInventoryUpdate } from '../../services/conduit/order';
import { orderTravelers } from '../../services/conduit/order';
import { orderVoucher } from '../../services/conduit/order';
// import { channelNameData } from '../../asset/data/ChannelData';
import VoucherSendModal from '../order_list/orderVoucherSendModal';
import FailedVoucherEmailModal from '../order_list/FailedVoucherEmailModal';
import FailedEmailModal from '../order_list/FailedEmailModal';
// import { OrderPurchaserStatusData } from '../../asset/data/OrderPurchaserStatusData';
import { toast } from 'react-toastify';
import Toastify from '../Toastify';
import {
  OrderConfirmData,
  OrderPendData,
  OrderTravelerCancelData,
} from '../../asset/data/ModalData';
import { ReactComponent as CancelX } from '../../asset/icon/CancelX.svg';
import { ReactComponent as Arrow } from '../../asset/icon/ArrowMdiumCU.svg';
import { ReactComponent as FilterIcon } from '../../asset/icon/FilterIcon.svg';
import { ReactComponent as Search } from '../../asset/icon/Search.svg';
import { ReactComponent as AlertExclamation } from '../../asset/icon/AlertExclamation.svg';
import { ReactComponent as ArrowTop } from '../../asset/icon/ArrowTop.svg';
import { ReactComponent as ArrowBottom } from '../../asset/icon/ArrowBottom.svg';
import { ReactComponent as EditPen } from '../../asset/icon/EditPen.svg';
import styled, { css } from 'styled-components';
import { Values } from 'webix';

function PivotModal({
  isOpenModal,
  handleClickCloseModal,
  detailData,
  unixTime,
  dcId,
  setDetailData,
  handleModalClose,
}) {
  const navigate = useNavigate();
  const [isFilterModal, setIsModalFilter] = useState(false);
  const [optionKeyDatas, setOptionKeyDatas] = useState([]);
  const [optionValueDatas, setOptionValueDatas] = useState([]);
  const [ordersInfo, setOrdersInfo] = useState([]);
  const [ordedrOptionKeyData, setOrderOptionKeyData] = useState([]);
  const [ordedrOptionValueData, setOrderOptionValueData] = useState([]);
  const [isCheckedOrderListArr, setIsCheckedOrderListArr] = useState([]);
  const [minimumNumber, setMinmumNumber] = useState('');
  const [totalNumber, setTotalNumber] = useState('');
  const [isNumberEdit, setIsNumberEdit] = useState(false);
  const [isSaveModal, setIsSaveModal] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isInventory, setIsInventory] = useState(false);
  const [isOrderWrapper, setIsOrderWrapper] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isPendModal, setIsPendModal] = useState(false);
  const [isRejectModal, setIsRejectModal] = useState(false);
  const [isTravelCancelModal, setIsTravelCancelModal] = useState(false);
  const [orderTravelersInfo, setOrderTravelersInfo] = useState([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isPend, setIsPend] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isVoucher, setIsVoucher] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  // const [isVoucherModal, setIsVoucherModal] = useState(false);
  const [isSendNotification, setIsSendNotification] = useState(false);
  const [resultOrderList, setResultOrderList] = useState([]);
  const [checkBoxCount, setCheckBoxCount] = useState(0);
  const [emailTicketArr, setEmailTicketArr] = useState([]);
  const [emailPurchaserArr, setEmailPurchaserArr] = useState([]);
  const [isNext, setIsNext] = useState(false);
  const [channelIdSelect, setChannelSelect] = useState('');
  const [purChaserSelect, setpurChaserSelect] = useState('');
  const [statusSelect, setStatusSelect] = useState('');
  const [onChangeChannel, setOnChangeChannel] = useState();
  const [onChangePurchaser, setOnChangePurchaser] = useState();
  const [onChangeStatus, setOnChangeStatus] = useState();
  const [purchaserName, setPurchaserName] = useState([]);
  const [voucherPurchaserArr, setVoucherPurchaserArr] = useState([]);
  const [voucherTicketArr, setVoucherTicketArr] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [isVoucherModal, setIsVoucherModal] = useState(false);
  const [isNextVoucher, setIsNextVoucher] = useState(false);
  const [isVoucherSend, setIsVoucherSend] = useState(false);
  const [voucherTotal, setVoucherTotal] = useState(0);
  const [isVoucherFailEmail, setIsVoucherFailEmail] = useState(false);
  const [isFailEmailModal, setIsFailEmailModal] = useState(false);
  const [voucherFailedEmail, setVoucherFailedEmail] = useState([]);
  const [sendTotalEmail, setSendTotalEmail] = useState(0);
  const [sendFailEmail, setSendFailEmail] = useState([]);
  const [channelNameData, setChannelNameData] = useState([]);
  const [OrderPurchaserStatusData, setOrderPurchaserStatusData] = useState([]);
  const [isEditButtonState, setIsEditButtonState] = useState([]);
  const [isFoldable, setIsFoldable] = useState([]);
  const [isErrArr, setIsErrArr] = useState([]);
  const [dcIdSave, setDcIdSave] = useState('');
  const awsS3StaticCommonDataUrl =
    process.env.REACT_APP_S3_STATIC_COMMON_DATA_URL;
  const { data: filter } = useSWR(awsS3StaticCommonDataUrl, fetcher);
  const { data: channels, mutate: channelMutate } = useSWR(
    '/channels',
    fetcher
  );
  useEffect(() => {
    const result = channels?.map((data, index) => {
      return data
        ? { id: data?.id, label: data?.name, value: index + 1 }
        : data;
    });
    const PurchaserStatusResult = filter?.order_status?.map((data, index) => {
      return data
        ? {
            id: Object.keys(data),
            label: Object.values(data),
            value: index + 1,
          }
        : data;
    });
    setChannelNameData(result);
    setOrderPurchaserStatusData(PurchaserStatusResult);
  }, [filter, channels]);
  const notify = () => {
    toast.success('The order successfully updated.', {});
  };
  const notifySaved = () => {
    toast.success('Change saved.', {});
  };
  const handleFold = (e, id) => {
    const result = isFoldable.map(data =>
      data.id === id ? { ...data, state: true } : data
    );
    setIsFoldable(result);
  };
  const handleFolded = (e, id) => {
    const result = isFoldable.map(data =>
      data.id === id ? { ...data, state: false } : data
    );
    setIsFoldable(result);
  };
  const searchSupplierUnit = async e => {
    e.preventDefault();
    const result = '&search=' + searchWord;
    setSearchQuery(result);
  };
  const handleInputSearch = e => {
    setSearchWord(e.target.value);
  };
  const handleVoucherModal = () => {
    setIsVoucherModal(!isVoucherModal);
  };
  const handleChannelId = query => {
    let queryResut = '';
    [query].forEach(data => {
      setOnChangeChannel(data);
      if (data[0]?.id === undefined) {
        queryResut = '';
      } else queryResut += '&channel=' + String(data[0].id);
    });
    setChannelSelect(queryResut);
  };
  const handleStatus = query => {
    let queryResut = '';
    [query].forEach(data => {
      setOnChangeStatus(data);
      if (data[0]?.id === undefined) {
        queryResut = '';
      } else queryResut += '&ax_status=' + String(data[0].id);
    });
    setStatusSelect(queryResut);
  };
  const handlePurchaser = query => {
    let queryResut = '';
    [query].forEach(data => {
      setOnChangePurchaser(data);
      if (data[0]?.id === undefined) {
        queryResut = '';
      } else queryResut += '&purchaser_search=' + String(data[0].label);
    });
    setpurChaserSelect(queryResut);
  };

  const handleUnSelectAll = () => {
    setOnChangeChannel('');
    setOnChangePurchaser('');
    setOnChangeStatus('');
    setpurChaserSelect('');
    setChannelSelect('');
    setStatusSelect('');
  };

  useEffect(() => {
    if (onChangeChannel === '') {
      setOnChangeChannel('');
    }
  }, [onChangeChannel]);

  const handleSendNotificationCancelBtn = () => {
    setIsSendNotification(false);
    setEmailTicketArr([]);
    setEmailPurchaserArr([]);
  };
  const handleReset = () => {
    setIsNext(false);
  };
  const handleSendEmailSuccess = (total, failed_emails) => {
    setSendTotalEmail(total);
    setSendFailEmail(failed_emails);
    setIsSendNotification(false);
    setEmailTicketArr([]);
    setEmailPurchaserArr([]);
    setIsNotification(false);
    setIsFailEmailModal(true);
  };

  const handleVoucherSubmit = async () => {
    const res = await orderVoucher({
      purchasers: voucherPurchaserArr,
      travelers: voucherTicketArr,
    });
    if (res.status === 201) {
      setIsVoucherSend(false);
      setVoucherPurchaserArr([]);
      setVoucherTicketArr([]);
      setIsVoucherModal(false);
      setVoucherTotal(res.data.total);
      setVoucherFailedEmail(res.data.failed_emails);
      setIsVoucherFailEmail(true);
    }
  };
  const handleNext = () => {
    setIsNext(true);
    setIsSendNotification(true);
  };
  const handleVoucherSendCancel = () => {
    setVoucherPurchaserArr([]);
    setIsNextVoucher(false);
    setIsVoucherSend(false);
  };
  const handlePurchaserIdInfo = purchaserId => {
    setEmailPurchaserArr(prePurcahserUserId => [
      ...prePurcahserUserId,
      purchaserId,
    ]);
  };
  const handleVoucherFailedModal = () => {
    setIsVoucherFailEmail(false);
  };
  const handleFailedModal = () => {
    setIsFailEmailModal(false);
  };

  const handleVoucherTicketIdInfo = ticketUserId => {
    setVoucherTicketArr(preTicketUserId => [...preTicketUserId, ticketUserId]);
  };

  const handleTicketIdInfo = ticketUserId => {
    setEmailTicketArr(preTicketUserId => [...preTicketUserId, ticketUserId]);
  };

  const handleNotificationModal = () => {
    setIsNotification(!isNotification);
  };

  const handleMoveOrderDetail = id => {
    navigate(`/order/detail/${id}`);
  };
  const handleMoveProductDetail = id => {
    navigate(`/supplierunit/detail/${id}`);
  };
  const handleOrderWrapper = () => {
    setIsOrderWrapper(!isOrderWrapper);
  };
  const handleIsInventory = () => {
    setIsInventory(!isInventory);
  };
  const handleTotalNumber = (e, id) => {
    const result = detailData.options.inventories.map((el, index) => {
      if (id === index) {
        return (el.total = parseInt(e.target.value));
      }
    });

    setTotalNumber(e.target.value);
  };

  const handleMimumNumber = (e, id) => {
    const result = detailData.options.inventories.map((el, index) => {
      if (id === index) {
        return (el.min = parseInt(e.target.value));
      }
    });

    setMinmumNumber(e.target.value);
  };

  const onCheckedOrderAll = () => {
    const newCheckedList = [...isCheckedOrderListArr];
    if (newCheckedList[0] === false || newCheckedList[0] === undefined) {
      newCheckedList[0] = true;
      ordersInfo.forEach((e, index) => {
        newCheckedList[index + 1] = true;
      });
    } else {
      newCheckedList[0] = false;
      ordersInfo.forEach((e, index) => {
        newCheckedList[index + 1] = false;
      });
    }
    setIsCheckedOrderListArr(newCheckedList);
  };
  const onCheckedOrderElement = e => {
    e.stopPropagation();
    const index = parseInt(e.currentTarget.id) + 1;
    const newCheckedList = [...isCheckedOrderListArr];
    if (
      newCheckedList[index] === false ||
      newCheckedList[index] === undefined
    ) {
      newCheckedList[index] = true;
    } else {
      newCheckedList[index] = false;
    }
    let cnt = 0;

    //체크박스 클릭 시 클릭된 체크박스 개수
    newCheckedList.forEach((e, index) => {
      if (newCheckedList[index] && index !== 0) ++cnt;
    });
    if (ordersInfo.length === cnt) {
      //supplier 전체 체크되면 All 체크
      newCheckedList[0] = true;
    } else {
      newCheckedList[0] = false;
    }
    setIsCheckedOrderListArr(newCheckedList);
  };
  const handleStatusSubmit = async status => {
    let statusCode = 0;
    if (status === 'confirm') {
      statusCode = 3;
    } else if (status === 'pend') {
      statusCode = 2;
    } else if (status === 'reject') {
      statusCode = 4;
    } else if (status === 'travelerCanceled') {
      statusCode = 5;
    }
    const elements = isCheckedOrderListArr.entries();
    let result = 0;

    for (const [index, element] of elements) {
      if (element && index > 0) {
        const res = await orderStatusChange(ordersInfo[index - 1].order_id, {
          ax_status: statusCode,
        });
        if (res.status === 200) {
          client
            .get(`/orders/timeslot/inventories/${unixTime}?dc_id=${dcId}`)
            .then(res => {
              setDetailData(res.data);
            });
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
    }
    if (result === 0) {
      setIsReset(!isReset);
      setIsCheckedOrderListArr([]);
      notify();
    }
  };

  const handleSearch = () => {
    client
      .get(
        `/orders/timeslot/inventories/${unixTime}?dc_id=${dcId}${channelIdSelect}${statusSelect}${purChaserSelect}`
      )
      .then(res => {
        if (res.status === 200) {
          setDetailData(res.data);
          handleUnSelectAll();
        }
      });
  };
  useEffect(() => {
    client
      .get(
        `/orders/timeslot/inventories/${unixTime}?dc_id=${dcId}${searchQuery}`
      )
      .then(res => {
        console.log('res~~~~~~res', res);
        setDetailData(res.data);
      });
  }, [searchQuery]);

  const handleConfirmBtn = () => {
    setIsConfirmModal(!isConfirmModal);
  };
  const handlePendBtn = () => {
    setIsPendModal(!isPendModal);
  };

  const handleRejectBtn = () => {
    setIsRejectModal(!isRejectModal);
  };

  const handleTravelerCancelBtn = () => {
    setIsTravelCancelModal(!isTravelCancelModal);
  };
  useEffect(() => {
    isErrArr.map((el, index) => {
      if (parseInt(totalNumber) < parseInt(minimumNumber)) {
        return { ...el, state: true };
      } else {
        return { ...el, state: false };
      }
    });
  }, [minimumNumber, totalNumber]);

  const handleEditNumber = (e, id) => {
    setIsNumberEdit(true);
    setIsIncorrect(false);
    const result = isEditButtonState.map(data =>
      data.id === id ? { ...data, state: true } : data
    );
    setIsEditButtonState(result);
  };
  const handleEditNumberCancel = (e, id) => {
    setIsNumberEdit(false);
    setIsIncorrect(false);
    const result = isEditButtonState.map(data =>
      data.id === id ? { ...data, state: false } : data
    );
    setIsEditButtonState(result);
  };
  const handleSaveModal = (e, dcid) => {
    setDcIdSave(dcid);
    setIsSaveModal(!isSaveModal);
  };
  const handleSaveInventory = async (e, dcIdValue) => {
    if (!isIncorrect) {
      detailData.options.inventories.map(async (el, index) => {
        if (el.dc_id === dcIdValue) {
          const res = await orderInventoryUpdate(unixTime, dcIdValue, {
            max_quantity: el.total,
            min_quantity: el.min,
          });
          if (res.status === 200) {
            setIsSaveModal(!isSaveModal);
            // setIsNumberEdit(false);
            // setIsIncorrect(false);
            const result = isEditButtonState.map(data =>
              data.id === index ? { ...data, state: false } : data
            );
            setIsEditButtonState(result);
            notifySaved();
            client
              .get(`/orders/timeslot/inventories/${unixTime}?dc_id=${dcId}`)
              .then(res => {
                setDetailData(res.data);
              });
          } else {
            alert(
              `Status Code : ${res.status} Status Text : ${res.statusText} Error`
            );
          }
        }
      });
    }
  };
  const handleSendNotification = async () => {
    if (checkBoxCount === 0) {
    } else {
      let orderIdQuery = '';
      isCheckedOrderListArr.map((data, index) => {
        if (data && index > 0) {
          if (index === 1) {
            orderIdQuery += 'order_id=' + ordersInfo[index - 1].order_id;
          } else {
            orderIdQuery += '&order_id=' + ordersInfo[index - 1].order_id;
          }
        }
      });
      const res = await orderTravelers(orderIdQuery);
      if (res.status === 200) {
        console.log(res.data);
        setOrderTravelersInfo(res.data);
        setIsNotification(true);
      } else {
        alert(
          `Status Code : ${res.status} Status Text : ${res.statusText} Error`
        );
      }
    }
  };
  const handleFilterModal = () => {
    setIsModalFilter(!isFilterModal);
  };
  const handleRest = () => {
    setIsRejectModal(false);
    setIsReset(!isReset);
    setIsCheckedOrderListArr([]);
  };
  const handleCancelVoucherBtn = () => {
    setIsVoucherModal(false);
  };

  const handleVoucherPurchaserIdInfo = purchaserId => {
    setVoucherPurchaserArr(prePurcahserUserId => [
      ...prePurcahserUserId,
      purchaserId,
    ]);
  };

  // const handleVoucherSend = async () => {
  //   let Purchaser = [];
  //   let Ticketuser = [];
  //   orderTravelersInfo.map(el => {
  //     console.log('elelele', el.purchaser.purchaser_id);
  //     Purchaser.push(el.purchaser.purchaser_id);
  //     // el.purchaser.purchaser_id;
  //     el.ticket_users.map(data => Ticketuser.push(data.ticket_user_id));
  //   });
  //   console.log('Purchaser', Purchaser);
  //   console.log('Ticketuser', Ticketuser);
  //   // const res = await orderVoucher({
  //   //   purchasers: Purchaser,
  //   //   travelers: Ticketuser,
  //   // });
  // };
  const handleVoucherSend = async () => {
    setIsNextVoucher(true);
    setIsVoucherSend(true);
  };
  const handleVoucherBtn = async () => {
    if (checkBoxCount === 0) {
    } else {
      let orderIdQuery = '';
      isCheckedOrderListArr.map((data, index) => {
        if (data && index > 0) {
          if (index === 1) {
            orderIdQuery += 'order_id=' + ordersInfo[index - 1].order_id;
          } else {
            orderIdQuery += '&order_id=' + ordersInfo[index - 1].order_id;
          }
        }
      });
      const res = await orderTravelers(orderIdQuery);
      if (res.status === 200) {
        setOrderTravelersInfo(res.data);
        setIsVoucherModal(true);
      } else {
        alert(
          `Status Code : ${res.status} Status Text : ${res.statusText} Error`
        );
      }
    }
  };
  console.log('isEditButtonSte', isEditButtonState);
  console.log('isErrArr', isErrArr);
  useEffect(() => {
    const stateResultArr = [...isEditButtonState];
    const stateErrArr = [...isErrArr];
    let foldAble = [...isFoldable];
    for (let i = 0; i <= detailData?.options?.inventories?.length; i++) {
      stateResultArr.push({ id: i, state: false });
      stateErrArr.push({ id: i, state: false });
    }
    setIsEditButtonState(stateResultArr);
    setIsErrArr(stateErrArr);
    for (let i = 0; i <= detailData?.orders?.options?.length; i++) {
      foldAble.push({ id: i, state: false });
    }
    setIsFoldable(foldAble);
    // detailData?.orders?.options?.map((el, index) => {
    //   foldAble.push({ id: index + 1, state: false });

    // });
  }, []);
  console.log('isFoldable', isFoldable);
  useEffect(() => {
    if (detailData.length !== 0) {
      detailData &&
        detailData.orders.options.map(el => {
          el.options.map((data, index) => {
            const resultKey = Object.keys(data.option);
            const resulstChange = resultKey
              .map(data => data.replace(/_/g, ' '))
              .map(data => data.charAt(0).toUpperCase() + data.slice(1));
            const resultValue = Object.values(data.option);
            setOrderOptionKeyData(resulstChange);
            setOrderOptionValueData(resultValue);
          });
        });
      const purchaser = [...purchaserName];
      detailData &&
        detailData.orders.options.map(el => {
          purchaser.push(el.purchaser.name);
          // setPurchaserName(el.purchaser.name);
        });
      const purchaserResult = purchaser.reduce(
        (ac, v) => (ac.includes(v) ? ac : [...ac, v]),
        []
      );
      const purchaserFilterData = purchaserResult.map((el, index) => {
        return el ? { id: index + 1, value: el, label: el } : el;
      });
      if (purchaserName.length === 0) {
        setPurchaserName(purchaserFilterData);
      }

      const result =
        detailData &&
        detailData.orders.options.map(el => {
          if (el.channel === 1) {
            el.channel = 'Coupang';
          } else if (el.channel === 2) {
            el.channel = 'TideSquare';
          } else if (el.channel === 3) {
            el.channel = 'Trip.com';
          }
          if (el.status === '1') {
            el.status = 'NEW';
          } else if (el.status === '2') {
            el.status = 'PARTNER PENDING';
          } else if (el.status === '3') {
            el.status = 'PARTNER CONFIRMED';
          } else if (el.status === '4') {
            el.status = 'PARTNER REJECTED';
          } else if (el.status === '5') {
            el.status = 'TRAVELER CANCELED';
          } else if (el.status === '6') {
            el.status = 'UNAVOIDABLY CANCELED';
          }
          return {
            ...el,
            purchased_at: el.purchased_at
              .split(':', 2)
              .join()
              .split(',')
              .join(':')
              .split('T')
              .join(', '),
          };
        });

      setOrdersInfo(result);
    }
  }, [detailData]);
  useEffect(() => {
    let isConfirmStatus = true;
    let isPendStatus = true;
    let isRejectStatus = true;
    let isCancelStatus = true;
    let isVoucherStatus = true;
    let isCount = 0;

    const result = isCheckedOrderListArr.includes(true);
    if (result) {
      isCheckedOrderListArr.map((data, index) => {
        if (data && index > 0) {
          isCount += 1;
          if (ordersInfo[index - 1]?.status === 'NEW') {
            isVoucherStatus = false;
          } else if (ordersInfo[index - 1]?.status === 'PARTNER PENDING') {
            isPendStatus = false;
            isVoucherStatus = false;
          } else if (ordersInfo[index - 1]?.status === 'PARTNER CONFIRMED') {
            isConfirmStatus = false;
            isPendStatus = false;
          } else if (ordersInfo[index - 1]?.status === 'PARTNER REJECTED') {
            isConfirmStatus = false;
            isPendStatus = false;
            isRejectStatus = false;
            isCancelStatus = false;
            isVoucherStatus = false;
          } else if (ordersInfo[index - 1]?.status === 'TRAVELER CANCELED') {
            isConfirmStatus = false;
            isPendStatus = false;
            isRejectStatus = false;
            isCancelStatus = false;
            isVoucherStatus = false;
          } else if (ordersInfo[index - 1]?.status === 'UNAVOIDABLY CANCELED') {
            isConfirmStatus = false;
            isPendStatus = false;
            isRejectStatus = false;
            isCancelStatus = false;
            isVoucherStatus = false;
          }
        }
      });
      setCheckBoxCount(isCount);
      setIsConfirm(isConfirmStatus);
      setIsPend(isPendStatus);
      setIsReject(isRejectStatus);
      setIsCancel(isCancelStatus);
      setIsVoucher(isVoucherStatus);
    } else {
      setCheckBoxCount(0);
      setIsConfirm(false);
      setIsPend(false);
      setIsReject(false);
      setIsCancel(false);
      setIsVoucher(false); // 1111
    }
  }, [isCheckedOrderListArr]);

  if (detailData.length === 0) return <div />;
  return (
    <StaffListModalWrap isOpenModal={isOpenModal}>
      {isVoucherSend && (
        <VoucherSendModal
          handleCancelBtn={handleVoucherSendCancel}
          onSubmit={handleVoucherSubmit}
        />
      )}
      {isVoucherModal && (
        <VoucherModal
          total={checkBoxCount}
          orderTravelersInfo={orderTravelersInfo}
          handleCancelBtn={handleCancelVoucherBtn}
          onSubmit={handleVoucherSend}
          isVoucherNext={isNextVoucher}
          handlePurchaserIdInfo={handleVoucherPurchaserIdInfo}
          handleTicketIdInfo={handleVoucherTicketIdInfo}
        />
      )}
      {isVoucherFailEmail && (
        <FailedVoucherEmailModal
          handleCancelBtn={handleVoucherFailedModal}
          sendTotalEmail={voucherTotal}
          sendFailEmail={voucherFailedEmail}
        />
      )}
      {isFailEmailModal && (
        <FailedEmailModal
          handleCancelBtn={handleFailedModal}
          sendTotalEmail={sendTotalEmail}
          sendFailEmail={sendFailEmail}
        />
      )}

      {isSaveModal && (
        <Modal
          modalData={OrderCalenderModalData}
          handleCancelBtn={handleSaveModal}
          onSubmit={handleSaveInventory}
          id={dcIdSave}
          isIcon={false}
        />
      )}
      {isConfirmModal && (
        <OrderModal
          modalData={OrderConfirmData}
          total={checkBoxCount}
          handleCancelBtn={handleConfirmBtn}
          onSubmit={() => {
            handleStatusSubmit('confirm');
          }}
        />
      )}
      {isPendModal && (
        <OrderModal
          modalData={OrderPendData}
          total={checkBoxCount}
          handleCancelBtn={handlePendBtn}
          onSubmit={() => {
            handleStatusSubmit('pend');
          }}
        />
      )}
      {isRejectModal && (
        <CalendarRejectModal
          total={checkBoxCount}
          handleCancelBtn={handleRejectBtn}
          isCheckedOrderListArr={isCheckedOrderListArr}
          resultOrderList={ordersInfo}
          handleRest={handleRest}
        />
      )}
      {isTravelCancelModal && (
        <OrderModal
          modalData={OrderTravelerCancelData}
          total={checkBoxCount}
          handleCancelBtn={handleTravelerCancelBtn}
          onSubmit={() => {
            handleStatusSubmit('travelerCanceled');
          }}
        />
      )}
      {isNotification && (
        <NotificationModal
          total={checkBoxCount}
          orderTravelersInfo={orderTravelersInfo}
          handleCancelBtn={handleNotificationModal}
          handleNext={handleNext}
          isNext={isNext}
          handlePurchaserIdInfo={handlePurchaserIdInfo}
          handleTicketIdInfo={handleTicketIdInfo}
        />
      )}
      {isSendNotification && (
        <SendNotificationModal
          total={checkBoxCount}
          emailTicketArr={emailTicketArr}
          emailPurchaserArr={emailPurchaserArr}
          handleCancelBtn={handleSendNotificationCancelBtn}
          handleReset={handleReset}
          handleSendEmailSuccess={handleSendEmailSuccess}
        />
      )}
      {isFilterModal && (
        <FilterModal
          onChangeChannel={onChangeChannel}
          handleCancelBtn={handleFilterModal}
          channelNameData={channelNameData}
          onChangePurchaser={onChangePurchaser}
          purchaserName={purchaserName}
          onChangeStatus={onChangeStatus}
          handleChannelId={handleChannelId}
          handleStatus={handleStatus}
          handlePurchaser={handlePurchaser}
          onSubmit={handleSearch}
          handleUnSelectAll={handleUnSelectAll}
          OrderPurchaserStatusData={OrderPurchaserStatusData}
        />
      )}
      <div className="modalContainer">
        <HeadBarWrapper>
          <div className="headBarTextWrapper">
            <div className="topWrapper">
              <div>Tour</div>
              <div className="IconWrap" onClick={handleModalClose}>
                <CancelX onClick={handleModalClose} />
              </div>
            </div>

            <div className="headBarText">{detailData && detailData.name}</div>
            <div className="orderInfoBox">
              <div className="productKeyBox">
                <div>Product ID</div>
                <div>Company</div>
                <div>Use date, time</div>
              </div>
              <div className="valueBox">
                <div> {detailData && detailData.supplier_unit_common_code}</div>
                <div className="comapnyName">
                  {detailData && detailData.company}
                </div>
                <div>
                  {detailData && detailData.use_date}{' '}
                  {detailData && detailData.departure_time}
                </div>
              </div>
              <div className="viewProduct">
                <TextButton
                  name="mediumPurple"
                  buttonName="View product"
                  isCheck={true}
                  handleButtonClick={e => {
                    handleMoveProductDetail(
                      detailData && detailData.supplier_unit_common_code
                    );
                  }}
                  // IconDirection="Right"
                  // iconUrl="/img/whiteArrow.svg"
                />
                <Arrow style={{ marginLeft: '4px' }} />
              </div>
            </div>
          </div>
        </HeadBarWrapper>
        <ModalWrap>
          <InventoryWrapper>
            <div className="inventoryBox">
              <div className="headBox">
                <div className="personalText">Inventory</div>
                <div className="headContents">
                  <span>Total {detailData && detailData.options.total}, </span>{' '}
                  <span>Booked {detailData && detailData.options.booked}</span>
                </div>
              </div>
              <span className="arrowBox">
                {isInventory ? (
                  <ArrowBottom onClick={handleIsInventory} />
                ) : (
                  <ArrowTop onClick={handleIsInventory} />
                )}
              </span>
            </div>
          </InventoryWrapper>
          <ContentsContainer
            isNumberEdit={isNumberEdit}
            isIncorrect={isIncorrect && isIncorrect}
          >
            <InventoryContainer
              isNumberEdit={isNumberEdit}
              isIncorrect={isIncorrect && isIncorrect}
            >
              {isInventory
                ? ''
                : detailData &&
                  detailData?.options?.inventories?.map((el, index) => {
                    const keys = Object.keys(el.summary_option);
                    const values = Object.values(el.summary_option);
                    const resulstChange = keys
                      .map(data => data.replace(/_/g, ' '))
                      .map(
                        data => data.charAt(0).toUpperCase() + data.slice(1)
                      );
                    return (
                      //mpamamamamamamap
                      <div className="optionBox" key={index}>
                        <div className="optionHead">
                          <div className="title">Option {index + 1}</div>
                          <div className="editPen">
                            <EditPen
                              onClick={e => handleEditNumber(e, index)}
                            />
                          </div>
                        </div>
                        <div className="optionContentsBox">
                          <div className="key">
                            {resulstChange.map((el, index) => {
                              return (
                                <div
                                  className="optionContentsKeyValue"
                                  key={index}
                                >
                                  <div className="optionKeyBox">
                                    <div>{el}</div>
                                  </div>
                                  <div className="optionValueBox">
                                    <div>{values[index]}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="optionNumberBox">
                            {isEditButtonState[index]?.state ? (
                              <EditOptionNumberWrapper>
                                {' '}
                                <div className="optionEditNumberBox">
                                  <div className="numberKeyBox">
                                    <div>Booked</div>
                                    <div className="minimum">Minimum</div>
                                    <div>Total</div>
                                  </div>
                                  <div className="numberValueBox">
                                    <div className="booked">{el?.booked}</div>
                                    <div>
                                      {' '}
                                      <NumberInput
                                        type="number"
                                        min="0"
                                        value={el?.min}
                                        onChange={e =>
                                          handleMimumNumber(e, index)
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label className="totalInventory">
                                        <NumberInput
                                          type="number"
                                          min="0"
                                          onChange={e =>
                                            handleTotalNumber(e, index)
                                          }
                                          value={el?.total}
                                          // value={el.total}
                                          isIncorrect={isIncorrect}
                                        />
                                      </label>{' '}
                                    </div>
                                  </div>
                                </div>
                                <ButtonWrapper isIncorrect={isIncorrect}>
                                  <div className="cancelButton">
                                    {' '}
                                    <Button
                                      name="ghostSmallGray"
                                      buttonName="Cancle"
                                      isCheck={true}
                                      handleButtonClick={e =>
                                        handleEditNumberCancel(e, index)
                                      }
                                      type="button"
                                    />
                                  </div>
                                  <div className="saveButton">
                                    {' '}
                                    <Button
                                      name="primarySmall"
                                      buttonName="Save"
                                      handleButtonClick={e =>
                                        handleSaveModal(e, el?.dc_id)
                                      }
                                      isCheck={true}
                                      type="button"
                                    />
                                  </div>
                                </ButtonWrapper>
                              </EditOptionNumberWrapper>
                            ) : (
                              <>
                                {' '}
                                <div className="numberKeyBox">
                                  <div>Booked</div>
                                  <div>Minimum</div>
                                  <div>Total</div>
                                </div>
                                <div className="numberValueBox">
                                  <div>{el?.booked}</div>
                                  <div>{el?.min}</div>
                                  <div>{el?.total}</div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <ErrorWrapper>
                          {isIncorrect ? (
                            <IncorrectMessage>
                              <AlertExclamation />
                              <span data-testid="incorret">
                                The total must be equal to or greater than the
                                Minimum.
                              </span>
                            </IncorrectMessage>
                          ) : (
                            ''
                          )}
                        </ErrorWrapper>
                      </div>
                      //mapmapamampampampampampamp
                    );
                  })}
            </InventoryContainer>

            <InventoryWrapper>
              <div className="inventoryBox">
                <div className="headBox">
                  <div className="personalText">Orders</div>
                  <div className="headContents">
                    <span>Total {detailData && detailData.orders.total},</span>
                    <span>
                      confirmed {detailData && detailData.orders.confirmed}
                    </span>
                  </div>
                </div>
              </div>
            </InventoryWrapper>
            <OrdersHeaderWrapper>
              <div className="topBox">
                <div
                  className="detailFilterWrapper"
                  onClick={handleFilterModal}
                >
                  <div className="filterBoxs">
                    <div className="filterButton">
                      <span className="icon">
                        {' '}
                        <FilterIcon />
                      </span>
                      <span className="name">Filters</span>
                    </div>
                  </div>
                </div>
                <SerachBar>
                  <form onSubmit={searchSupplierUnit}>
                    <div className="TextFieldWrapper" data-testid="searchInput">
                      <Search
                        className="searchIcon"
                        onClick={searchSupplierUnit}
                      />
                      <TextField
                        name="TextFieldSearchLarge"
                        type="text"
                        placeholder="Search by order ID or channel order ID"
                        onChange={handleInputSearch}
                        value={searchWord}
                      />
                    </div>
                  </form>
                </SerachBar>
              </div>
              <div className="bottomBox">
                <div className="selectBox">
                  <span className="checkBox">
                    <CheckBoxSmall
                      id={0}
                      handleCheckedBox={onCheckedOrderAll}
                      CheckBoxState={isCheckedOrderListArr[0]}
                    />
                  </span>
                  <span>Total {detailData && detailData.orders.total}</span>{' '}
                  <span className="selectNumber">Selected {checkBoxCount}</span>
                </div>
                <div className="buttonBox">
                  <div className="confirmButton">
                    {' '}
                    <Button
                      name="primarySmall"
                      buttonName="Confirm"
                      isCheck={isConfirm}
                      // isCheck={true}
                      handleButtonClick={handleConfirmBtn}
                      type="button"
                    />
                  </div>
                  <div className="rejectButton">
                    {' '}
                    <Button
                      name="primarySmall"
                      buttonName="Pend"
                      isCheck={isPend}
                      handleButtonClick={handlePendBtn}
                      type="button"
                    />
                  </div>
                  <div className="pendButton">
                    {' '}
                    <Button
                      name="primarySmall"
                      buttonName="Reject"
                      isCheck={isReject}
                      handleButtonClick={handleRejectBtn}
                      type="button"
                    />
                  </div>
                  <div className="travelerButton">
                    {' '}
                    <Button
                      name="primarySmall"
                      buttonName="Traveler cancel"
                      isCheck={isCancel}
                      handleButtonClick={handleTravelerCancelBtn}
                      type="button"
                    />
                  </div>
                  <div className="voucherButton">
                    {' '}
                    <Button
                      name="ghostSmallPurple"
                      buttonName="Voucher"
                      isCheck={isVoucher}
                      // isCheck={true}
                      // isCheck={checkBoxCount > 0}
                      // handleButtonClick={handleVoucherBtn}
                      handleButtonClick={handleVoucherBtn}
                      type="button"
                    />
                  </div>
                  <div className="sendButton">
                    {' '}
                    <Button
                      name="ghostSmallPurple"
                      buttonName="Send notification"
                      isCheck={checkBoxCount > 0}
                      // handleButtonClick={handleNotificationModal}
                      handleButtonClick={handleSendNotification}
                      type="button"
                    />
                  </div>
                </div>
              </div>
            </OrdersHeaderWrapper>
            <div className="ordersWrapper">
              {ordersInfo.map((el, index) => {
                return (
                  <div key={index}>
                    <OrderHeadWrapper status={el?.status}>
                      <div className="headerBox">
                        <div className="selectBox">
                          <span className="checkBox" data-cy="checkBoxCypress">
                            <CheckBoxSmall
                              id={index}
                              handleCheckedBox={onCheckedOrderElement}
                              CheckBoxState={isCheckedOrderListArr[index + 1]}
                            />
                          </span>
                          <div className="topBox">
                            <span className="orderName">
                              {el?.purchaser.name}
                            </span>{' '}
                            <span className="arrowBox">
                              {isFoldable[index]?.state ? (
                                <ArrowBottom
                                  id={index}
                                  onClick={e => handleFolded(e, index)}
                                />
                              ) : (
                                <ArrowTop
                                  id={index}
                                  onClick={e => handleFold(e, index)}
                                />
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="statusBox">{el?.status}</div>
                      </div>
                      <div className="orderContents">
                        <div className="textBox">
                          <div className="orderKey">
                            <div>Order ID</div>
                            <div>Channel</div>
                            <div>Purchased date, time</div>
                          </div>
                          <div className="orderValue">
                            <div>{el?.order_id}</div>
                            <div>{el?.channel}</div>
                            <div>{el?.purchased_at}</div>
                          </div>
                        </div>
                        <div className="viewOrder" data-cy="viewOrderCypress">
                          <TextButton
                            name="mediumPurple"
                            buttonName="View order"
                            isCheck={true}
                            handleButtonClick={e => {
                              handleMoveOrderDetail(el?.order_id);
                            }}
                            // IconDirection="Right"
                            // iconUrl="/img/whiteArrow.svg"
                          />
                          <Arrow style={{ marginLeft: '4px' }} />
                        </div>
                      </div>
                    </OrderHeadWrapper>
                    {isFoldable[index]?.state ? (
                      ''
                    ) : (
                      <OrderContentsWrapper>
                        <div className="contentsWrapper">
                          <div className="purchaserWrapper">
                            <div className="header">Purchaser info</div>
                          </div>
                          <div className="bodyContents">
                            <div className="bodyKey">
                              <div>Name</div>
                              <div>Email</div>
                              <div>Phone</div>
                            </div>
                            <div className="bodyValue">
                              <div>{el?.purchaser.name}</div>
                              <div>{el?.purchaser.email}</div>
                              <div>
                                <span>+{el?.purchaser.national_code}</span>{' '}
                                {el?.purchaser.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="orderContentsWrapper">
                          <div className="optionWrapper">
                            <div className="header">Option</div>
                          </div>
                          {/* option data map */}

                          <div className="optionBodyContents">
                            <div className="bodyKey">
                              {ordedrOptionKeyData &&
                                ordedrOptionKeyData.map((el, index) => {
                                  return <div key={index}>{el}</div>;
                                })}
                            </div>
                            <div className="bodyValue">
                              {ordedrOptionValueData &&
                                ordedrOptionValueData.map((el, index) => {
                                  return <div key={index}>{el}</div>;
                                })}
                            </div>
                            <div className="numberBox">
                              <div className="numberKeyBox">
                                <div>Quantity</div>
                              </div>
                              <div className="numberValueBox">
                                <div>
                                  {el?.options.map(el => el.quantity)}
                                  {/* {
                                    el?.options
                                      .agepurchase_unitdeparture_cityguide_languageanother_activity_ticket
                                      .quantity
                                  } */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* option data map */}
                      </OrderContentsWrapper>
                    )}
                    <div className="totalQuantityBox">
                      <div className="quantity">
                        {/* Total quantity <span>3</span> */}
                      </div>
                      <div className="totalPrice">
                        Total price <span>USD {el?.total_price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* <div className="totalQuantityBox">
              <div className="quantity">
                Total quantity <span>3</span>
              </div>
              <div className="totalPrice">
                Total price <span>USD 14,000.00</span>
              </div>
            </div> */}
          </ContentsContainer>
        </ModalWrap>
      </div>
      <div data-cy="toastifyCypress">
        <Toastify />
      </div>
    </StaffListModalWrap>
  );
}
const c1FontStyle = css`
  color: ${props => props.theme.Color.coolgrayCG400};
  font: ${props => props.theme.Font.caption1Medium};
  letter-spacing: ${props => props.theme.letterSpacing.caption1Medium};
`;
const c1MFontStyle = css`
  color: ${props => props.theme.Color.coolgrayCG900};
  font: ${props => props.theme.Font.caption1Medium};
  letter-spacing: ${props => props.theme.letterSpacing.caption1Medium};
`;
const h4FontStyle = css`
  color: ${props => props.theme.Color.coolgrayCG900};
  font: ${props => props.theme.Font.h4Semibold};
  letter-spacing: ${props => props.theme.letterSpacing.h4Semibold};
`;
const H5SemBoldFontStyle = css`
  color: ${props => props.theme.Color.coolgrayCG900};
  font: ${props => props.theme.Font.h5Semibold};
  letter-spacing: ${props => props.theme.letterSpacing.h5Semibold};
`;
const C1SemBoldFontStyle = css`
  color: ${props => props.theme.Color.coolgrayCG900};
  font: ${props => props.theme.Font.caption1Semibold};
  letter-spacing: ${props => props.theme.letterSpacing.caption1Semibold};
`;
const StaffListModalWrap = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  height: 100vh;
  /* width: ${({ isOpenModal }) => (isOpenModal ? '100%' : '0')};
  height: ${({ isOpenModal }) => (isOpenModal ? '100%' : '0')}; */
  margin-top: 64px;
  /* background-color: ${({ isOpenModal }) =>
    isOpenModal ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0)'}; */
  background-color: rgba(0, 0, 0, 0.6);
  transition: background-color ease-in 200ms;
  z-index: 500;
  /* overflow-y: auto; */
  .ordersWrapper {
    /* overflow-y: scroll;
    height: 714px; */
  }
  .modalContainer {
    width: 854px;
    height: 100%;
  }
  .orderInfoBox {
    display: flex;
  }
  .valueBox {
    width: 70%;
  }
  .viewProduct {
    display: flex;
    align-items: center;
    justify-content: center;
    /* width: 119px;
  height: 40px; */
    margin-left: 8px;
    /* resize: horizontal; */

    white-space: nowrap;
    &:hover {
      cursor: pointer;
      background: ${props => props.theme.Color.coolgrayCG20};
      color: ${props => props.theme.Color.coolgrayCG700};
    }
    &:active {
      background: ${props => props.theme.Color.coolgrayCG50};
      color: ${props => props.theme.Color.coolgrayCG900};
    }
    /* span {
      margin-left: 4px;
    } */
  }
`;
const HeadBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: ${props => props.theme.Color.white};
  padding: 24px 0 24px 16px;
  border-top: 1px solid ${props => props.theme.Color.coolgrayCG50};
  border-bottom: 1px solid ${props => props.theme.Color.coolgrayCG50};
  .headBarTextWrapper {
    width: 100%;
  }
  .topWrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .headBarText {
    color: ${props => props.theme.Color.coolgrayCG900};
    font: ${props => props.theme.Font.h4Semibold};
    letter-spacing: ${props => props.theme.letterSpacing.h4Semibold};
  }
  .IconWrap {
    margin-right: 26px;
    cursor: pointer;
  }
  .orderInfoBox {
    margin-top: 24px;
  }
  .productKeyBox {
    width: 144px;
    margin-right: 8px;
    color: ${props => props.theme.Color.coolgrayCG300};
    font: ${props => props.theme.Font.h4Semibold};
    letter-spacing: ${props => props.theme.letterSpacing.h4Semibold};
  }
  .valueBox {
    color: ${props => props.theme.Color.coolgrayCG900};
    font: ${props => props.theme.Font.h4Semibold};
    letter-spacing: ${props => props.theme.letterSpacing.h4Semibold};
    .comapnyName {
      width: 520px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .viewProduct {
    margin-top: 60px;
    padding-right: 40px;
  }
`;

const ModalWrap = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  /* width: 854px; */
  height: 782px;
  background: ${props => props.theme.Color.white};
  /* box-shadow: 8px 0 14px rgba(0, 0, 0, 0.12); */
  transform: ${({ isOpenModal }) =>
    isOpenModal ? 'translateX(500px)' : 'translateX(0)'};
  transition: all ease-out 200ms;
  overflow-y: auto;
`;

const InventoryWrapper = styled.div`
  .inventoryBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 43px;
    margin-top: 16px;
    border: 1px solid ${props => props.theme.Color.coolgrayCG100};
    background: ${props => props.theme.Color.coolgrayCG20};
  }
  .arrowBox {
    margin-right: 20px;
    &:hover {
      cursor: pointer;
      background: ${props => props.theme.Color.coolgrayCG20};
      color: ${props => props.theme.Color.coolgrayCG700};
    }
    &:active {
      background: ${props => props.theme.Color.coolgrayCG50};
      color: ${props => props.theme.Color.coolgrayCG900};
    }
  }
  .headBox {
    display: flex;
    /* height: 43px; */
    /* background: ${props => props.theme.Color.coolgrayCG20}; */
    /* margin-top: 16px; */
    /* border: 1px solid ${props => props.theme.Color.coolgrayCG100}; */
    .headContents {
      display: flex;
      align-items: center;
      margin-left: 8px;
      ${c1FontStyle}
    }
  }
  .personalText {
    display: flex;
    align-items: center;
    margin-left: 16px;
    /* margin: 32px 0 8px 32px; */
    /* width: 576px;
    padding-bottom: 8px; */
    /* border-bottom: 1px solid ${props => props.theme.Color.coolgrayCG50}; */
    ${h4FontStyle}
  }
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 400px; */
  /* height: 882px; */
  margin-top: 16px;
  margin-left: 16px;
  margin-bottom: 100px;

  /* overflow-y: scroll; */
  .optionHead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 35px;
    border: 1px solid ${props => props.theme.Color.coolgrayCG100};
    border-radius: 4px;
    gap: 8px;
    ${H5SemBoldFontStyle}
    .title {
      margin-left: 16px;
    }
    .editPen {
      margin-right: 30px;
      :hover {
        cursor: pointer;
      }
      &:active {
        background: ${props => props.theme.Color.coolgrayCG50};
        color: ${props => props.theme.Color.coolgrayCG900};
      }
    }
  }
  .optionContentsBox {
    display: flex;
    height: ${({ isIncorrect }) => (isIncorrect ? '312px' : '')};
    border: 1px solid ${props => props.theme.Color.coolgrayCG100};
    border-radius: 4px;
    .optionContentsKeyValue {
      display: flex;
      /* flex-direction: column; */
    }
    .key {
      display: flex;
      flex-direction: column;
      margin-bottom: 26px;
    }
    .optionKeyBox {
      width: 188px;
      margin-top: 16px;
      margin-left: 16px;
      div {
        margin-top: 8px;
      }
      .bottomKey {
        margin-bottom: 16px;
      }
      ${c1FontStyle}
    }
    .optionValueBox {
      /* width: ${({ isIncorrect }) => (isIncorrect ? '312px' : '400px')}; */
      width: 400px;
      margin-top: 16px;
      div {
        margin-top: 8px;
      }
      ${c1MFontStyle}
    }
  }
  .optionNumberBox {
    display: flex;
    justify-content: space-between;
    width: 200px;
    /* height: ${({ isNumberEdit }) => (isNumberEdit ? '145px' : '99px')}; */
    /* height: 99px; */
    background: ${props => props.theme.Color.coolgrayCG20};
    border: 1px solid ${props => props.theme.Color.coolgrayCG100};
    margin-top: 16px;
    margin-bottom: 60px;
    /* margin-left: 100px; */
    .numberKeyBox {
      margin: 8px 0 0 16px;
      ${C1SemBoldFontStyle}
      div {
        margin-top: 8px;
      }
      .minimum {
        margin-bottom: ${({ isNumberEdit }) => (isNumberEdit ? '40px' : '8px')};
      }
    }
    .numberValueBox {
      margin: 8px 16px 0 20px;
      ${C1SemBoldFontStyle}
      .booked {
        margin-left: 65px;
        ${c1MFontStyle}
      }
      div {
        margin-top: 8px;
      }
    }
  }
  .numberBox {
    display: flex;
    justify-content: space-between;
    width: 200px;
    height: 99px;
    background: ${props => props.theme.Color.coolgrayCG20};
    border: 1px solid ${props => props.theme.Color.coolgrayCG100};
    margin-top: 16px;
    .numberKeyBox {
      margin: 8px 0 0 16px;
      div {
        margin-top: 8px;
      }
    }
    .numberValueBox {
      margin: 8px 16px 0 0;
      div {
        margin-top: 8px;
      }
    }
  }
  .totalQuantityBox {
    display: flex;
    justify-content: space-between;
    background: ${props => props.theme.Color.coolgrayCG20};

    padding: 8px 0 8px 16px;
    border: 1px solid ${props => props.theme.Color.coolgrayCG100};
    ${H5SemBoldFontStyle}
    .quantity {
      span {
        padding-left: 16px;
      }
    }
    .totalPrice {
      padding-right: 16px;
      span {
        padding-left: 16px;
      }
    }
  }
`;

const OrdersHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.Color.coolgrayCG100};
  .topBox {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 17px;
    margin-bottom: 16px;
  }
  .bottomBox {
    display: flex;
    /* position: fixed; */
    margin-left: 16px;
    margin-bottom: 16px;
    .buttonBox {
      display: flex;
      /* margin-left: 8px; */
      /* margin-right: 16px; */
      button {
        margin-left: 8px;
      }
    }
    .travelerButton {
      /* padding-right: 8px; */
      border-right: 1px solid ${props => props.theme.Color.coolgrayCG100};
    }
  }
  .selectBox {
    display: flex;
    align-items: center;
    width: 143px;
    color: ${props => props.theme.Color.coolgrayCG900};
    font: ${props => props.theme.Font.caption2Regular};
    letter-spacing: ${props => props.theme.letterSpacing.caption2Regular};
    .checkBox {
      margin-right: 10px;
    }
    .selectNumber {
      margin-left: 5px;
    }
  }
  .filterBoxs {
    display: flex;
    align-items: center;
    margin-left: 16px;
    span {
      display: flex;
      align-items: center;
    }
    &:hover {
      cursor: pointer;
      background: ${props => props.theme.Color.coolgrayCG20};
      color: ${props => props.theme.Color.coolgrayCG700};
    }
    &:active {
      background: ${props => props.theme.Color.coolgrayCG50};
      color: ${props => props.theme.Color.coolgrayCG900};
    }
  }
  .filterButton {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 93px;
    height: 39px;
    border-radius: 4px;
    border: 1.5px solid ${props => props.theme.Color.coolgrayCG400};
    font: ${props => props.theme.Font.h5Medium};
    letter-spacing: ${props => props.theme.letterSpacing.h5Medium};
    color: ${props => props.theme.Color.coolgrayCG400};
    .name {
      padding-left: 6.25px;
    }
    :hover {
      cursor: pointer;
    }
  }
`;
const SerachBar = styled.div`
  display: flex;
  margin-right: 16px;
  /* justify-content: flex-end; */
  /* margin-right: 80px;
  margin-bottom: 16px;
  margin-top: 32px;
  min-width: 960px; */
  .TextFieldWrapper {
    position: relative;
    .searchIcon {
      position: absolute;
      top: 11px;
      left: 16px;
      stroke: ${props => props.theme.Color.coolgrayCG300};
      cursor: pointer;
      &:hover {
        background: ${props => props.theme.Color.primaryP50};
        border-radius: 20px;
      }
      &:active {
        stroke: ${props => props.theme.Color.coolgrayCG900};
      }
    }
  }
`;
const OrderHeadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.Color.coolgrayCG100};
  /* height: 400px;
  overflow-x: auto; */
  .headerBox {
    width: 100%;
    margin-left: 16px;
  }
  .selectBox {
    display: flex;
    align-items: center;
    margin-top: 16px;
    ${H5SemBoldFontStyle}
    .checkBox {
      margin-right: 10px;
    }
    .selectNumber {
      margin-left: 5px;
    }
  }
  .topBox {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .arrowBox {
      margin-right: 30px;
      &:hover {
        cursor: pointer;
        background: ${props => props.theme.Color.coolgrayCG20};
        color: ${props => props.theme.Color.coolgrayCG700};
      }
      &:active {
        background: ${props => props.theme.Color.coolgrayCG50};
        color: ${props => props.theme.Color.coolgrayCG900};
      }
    }
  }
  .statusBox {
    /* display: flex; */
    align-items: center;
    text-align: center;
    border-radius: 4px;
    padding: 4px 8px;
    width: 122px;
    background: ${props => props.theme.Color.othercolorOG50};
    font: ${props => props.theme.Font.caption2SemiboldLS_2};
    letter-spacing: ${props => props.theme.letterSpacing.caption2SemiboldLS_2};
    color: ${props => props.theme.Color.coolgrayCG400};
    background: ${({ status, theme }) =>
      (status === 'NEW' && theme.Color.primaryP50) ||
      (status === 'PARTNER REJECTED' && theme.Color.feedbackFR50) ||
      (status === 'TRAVELER CANCELED' && theme.Color.nudgeN50) ||
      (status === 'PARTNER CONFIRMED' && theme.Color.othercolorOB50) ||
      (status === 'PARTNER PENDING' && theme.Color.coolgrayCG50) ||
      (status === 'UNAVOIDABLY CANCELED' && theme.Color.orangeOL50)};
    color: ${({ status, theme }) =>
      (status === 'NEW' && theme.Color.primaryP500) ||
      (status === 'PARTNER REJECTED' && theme.Color.feedbackFR900) ||
      (status === 'TRAVELER CANCELED' && theme.Color.nudgeN900) ||
      (status === 'PARTNER CONFIRMED' && theme.Color.othercolorOB900) ||
      (status === 'PARTNER PENDING' && theme.Color.coolgrayCG500) ||
      (status === 'UNAVOIDABLY CANCELED' && theme.Color.orangeOL900)};
  }

  .orderContents {
    display: flex;
    justify-content: space-between;
    /* width: 529px; */
    margin-top: 8px;
    margin-left: 16px;
    .textBox {
      display: flex;
    }
    .orderKey {
      width: 136px;
      ${c1FontStyle}
      div {
        width: 140px;
        margin-top: 8px;
      }
    }
    .orderValue {
      margin-left: 8px;
      margin-bottom: 16px;
      ${c1MFontStyle}
      div {
        margin-top: 8px;
      }
    }
  }
  .viewOrder {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    margin-left: 220px;
    margin-right: 28px;
  }
`;
const OrderContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.Color.coolgrayCG100};
  padding-top: 8px;
  padding-left: 16px;
  /* padding-bottom: 16px; */
  overflow: auto;
  height: 400px;
  .contentsWrapper {
    border: 1px solid ${props => props.theme.Color.coolgrayCG100};
  }
  .orderContentsWrapper {
    border: 1px solid ${props => props.theme.Color.coolgrayCG100};
    margin-top: 8px;
  }
  .purchaserWrapper {
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${props => props.theme.Color.coolgrayCG100};
    ${C1SemBoldFontStyle}
    .header {
      margin-left: 16px;
    }
  }
  .bodyContents {
    display: flex;
    margin-bottom: 16px;
  }
  .optionBodyContents {
    display: flex;
    margin-bottom: 16px;
    border-bottom: 1px solid ${props => props.theme.Color.coolgrayCG50};
  }
  .bodyKey {
    width: 188px;
    margin-left: 16px;
    margin-right: 8px;
    div {
      margin-top: 8px;
      padding-bottom: 8px;
    }
    ${c1FontStyle}
  }
  .bodyValue {
    ${c1MFontStyle}
    div {
      margin-top: 8px;
      padding-bottom: 8px;
    }
  }
  .optionWrapper {
    padding-top: 8px;
    padding-bottom: 8px;
    border: 1px solid ${props => props.theme.Color.coolgrayCG100};
    ${C1SemBoldFontStyle}
    .header {
      margin-left: 16px;
    }
  }
  .numberBox {
    display: flex;
    justify-content: space-between;
    width: 152px;
    height: 49px;
    background: ${props => props.theme.Color.coolgrayCG20};
    margin-top: 16px;
    margin-left: 350px;
    border-radius: 4px;
    .numberKeyBox {
      margin: 8px 0 0 16px;
      div {
        margin-top: 8px;
      }
    }
    .numberValueBox {
      margin: 8px 16px 0 0;
      div {
        margin-top: 8px;
      }
    }
  }
  .bottomKey {
    margin-bottom: 16px;
  }
`;
const NumberInput = styled.input`
  width: 60px;
  height: 40px;
  padding-left: 16px;
  border-radius: 4px;
  /* border: 1px solid ${props => props.theme.Color.coolgrayCG100}; */
  border: ${({ isIncorrect, theme }) =>
    isIncorrect ? `2px solid red` : `1px solid ${theme.Color.coolgrayCG100}`};
  ${c1MFontStyle}
  &::-webkit-inner-spin-button {
    -webkit-appearance: 'Always Show Up/Down Arrows';
    opacity: 1;
  }
`;
const EditOptionNumberWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 145px;
  .optionEditNumberBox {
    display: flex;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  /* justify-content: flex-end; */
  /* margin: 16px 0 0 45px; */
  margin: ${({ isIncorrect }) =>
    isIncorrect ? '80px 0 0 45px' : '16px 0 0 45px'};
  /* margin-top: 16px; */
  /* margin: ; */
  .cancelButton {
  }
  .saveButton {
    margin-left: 8px;
  }
`;
const ErrorWrapper = styled.div`
  display: flex;
  position: relative;
  bottom: 150px;
  left: 470px;
`;
const IncorrectMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 346px;
  height: 33px;

  margin-top: 16px;
  border-radius: 4px;
  background: ${props => props.theme.Color.feedbackFR50};
  font: ${props => props.theme.Font.caption2SemiboldLS_2};
  letter-spacing: ${props => props.theme.letterSpacing.caption2SemiboldLS_2};
  color: ${props => props.theme.Color.feedbackFR600};
  span {
    padding: 10px;
    /* margin-left: 1px; */
  }
`;

const InventoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* border: 1px solid ${props => props.theme.Color.coolgrayCG100}; */
`;

export default PivotModal;
