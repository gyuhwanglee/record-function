import { useState, useEffect } from 'react';
import * as webix from '@xbs/webix-pro';
import { data } from './data';
import PivotView from './PivotView';
import { client, fetcher } from '../../services/Common';
import useSWR, { preload } from 'swr';
import styled from 'styled-components';

export default function PivotContainer({
  unixTime,
  startDate,
  searchQuery,
  selectCompanies,
  selectCategory,
  selectTimeZone,
}) {
  const [dataVal, setDataVal] = useState(data);
  const [depthData, setDepthData] = useState([]);
  const [calendarData, setCandarData] = useState([]);
  const [resData, setResData] = useState([]);
  const [axiosData, setAxiosData] = useState([]);
  const [settingData, setSettingData] = useState([]);
  const [isModal, setModal] = useState(false);
  const [complete, setComplete] = useState([]);
  const awsS3StaticCommonDataUrl =
    process.env.REACT_APP_S3_STATIC_COMMON_DATA_URL;
  const { data: filter } = useSWR(awsS3StaticCommonDataUrl, fetcher);
  const handleModal = id => {
    setModal(!isModal);
  };
  const handleModalClose = async () => {
    setModal(false);
    client
      .get(
        `/orders/timeslot?date=${unixTimeResult}${searchQuery}${selectCompanies}${selectCategory}${selectTimeZone}`
      )
      .then(data => {
        if (data.status === 200) {
          setAxiosData(data.data);
        }
      });
  };
  // const unixTimeResult = Math.floor(
  //   new Date(`${startDate.toISOString()}`).getTime() / 1000
  // );
  const unixTimeResult = startDate.toISOString();
  useEffect(() => {
    (async () => {
      client
        .get(
          `/orders/timeslot?date=${unixTimeResult}${searchQuery}${selectCompanies}${selectCategory}${selectTimeZone}`
        )
        .then(data => {
          if (data.status === 200) {
            console.log('Timeslot-List-Data', data);
            setAxiosData(data.data);
          }
        });
    })();
  }, [startDate, searchQuery, selectCompanies, selectCategory, selectTimeZone]);
  console.log('axiosData', axiosData);
  useEffect(() => {
    const axiosResult = [...axiosData];
    let result = [];
    let split = '';
    if (axiosResult.length > 0) {
      axiosResult?.forEach((res, indexA) => {
        res.depth_combinations?.forEach((data, index) => {
          data?.inventories_per_date.forEach((el, index1) => {
            let object = {};
            let weekResult = String(new Date(el.date));
            let abc = el.date.split('-');
            if (abc) {
              split = abc.join(',');
            }
            let monthData = split.substring(5, 7);
            let dayData = split.substring(8, 10);
            let week = weekResult.split(' ', 1).join(':');
            let dateResult = `${week}, ${monthData}/${dayData}`;
            object.product = res?.name;
            object.time = data?.departure_time;
            // object.dc_id = data?.dc_ids[indexA];
            object.dc_id = data?.dc_ids;
            object.unix = el?.date;
            object.date = dateResult;
            object.Booked = el?.booked;
            object.Inventory = el?.total;
            if (el?.status === '1') {
              object.status = 'LowerThanMin';
            } else if (el?.status === '3') {
              object.status = 'Fulled';
            } else if (el?.status === '4') {
              object.status = 'OverBooked';
            } else if (el?.status === '5') {
              object.status = 'Passsed';
            } else if (el?.status === '2') {
              object.status = 'OverMinNumber';
            }
            console.log(
              ' object.status object.status object.status',
              object.status
            );
            result.push(object);
          });
        });
      });
    }
    result.sort((a, b) => {
      if (a.unix > b.unix) return 1;
      if (a.unix < b.unix) return -1;
      return 0;
    });
    setComplete(result);
  }, [axiosData]);
  useEffect(() => {
    setSettingData({
      data: complete,
      structure: {
        rows: ['product', 'time'],
        columns: ['date'],
        values: [
          { name: 'Booked', operation: ['any'] },
          { name: 'Inventory', operation: ['any'] },
          // { name: 'status', operation: ['any'], display: 'none' },
        ],
      },
      fields: [
        { id: 'product', type: 'text', value: 'product' },
        { id: 'time', type: 'text', value: 'time' },
        {
          id: 'date',
          type: 'text',
          // type : 'date',
          value: 'date',
          // predicate: 'date',
        },
        { id: 'Booked', type: 'text', value: 'Booked' },
        {
          id: 'Inventory',
          type: 'text',
          value: 'Inventory',
        },
        { id: 'status', type: 'text', value: 'status' },
      ],
    });
  }, [complete]);
  return (
    <Container className="container">
      <PivotView
        // dataVal={dataVal}
        dataVal={settingData}
        handleModal={handleModal}
        handleModalClose={handleModalClose}
        isModal={isModal}
        setModal={setModal}
        settingData={complete}
      />
      {/* <PivotTable data={dataVal} /> */}
    </Container>
  );
}

const Container = styled.div`
  height: 504px;
  /* width: 100%; */
`;
