import React, { useRef, useEffect, useState, Component } from 'react';
import ReactDOM from 'react-dom';
import * as webix from '@xbs/webix-pro';
import '@xbs/webix-pro/webix.css';
// import '@xbs/spreadsheet/spreadsheet.css';
// import '@xbs/pivot/codebase/pivot.css';
import '@xbs/pivot/codebase/pivot.css';
// import { pivot } from '@xbs/pivot';
import axios from 'axios';
import { data } from './data';
import ModalPivot from './ModalPivot';
import styled, { css } from 'styled-components';
import { client } from '../../services/Common';
window.webix = webix;

const PivotTable = ({ isSidebar }) => {
  const rootRef = useRef();
  const [pivotData, setPivotData] = useState([]);
  const [data1, setData1] = useState();
  const [dataVal, setDataVal] = useState(data);
  const [isModal, setModal] = useState(false);
  const [values, setValues] = useState([]);
  const handleCencel = () => {
    setModal(false);
  };

  let calender = '';

  useEffect(() => {
    client.get('/orders/timeslot').then(data => {
      console.log('res', data);
      // setDataVal({
      //   ...dataVal,
      //   data: data.data,
      //   structure: data.structure,
      //   fields: data.fields,
      // });
      setPivotData(data.data);
    });
  }, []);
  useEffect(() => {
    pivotData?.map(res => {
      console.log('asdhkjashdkjsahkdsad', res);
      console.log('res123123123', res.depth_combinations[0]?.dates);
      setDataVal(res.depth_combinations[0]?.dates);
    });
  }, [pivotData]);
  useEffect(() => {
    setDataVal({
      ...dataVal,
      data: data.data,
      structure: data.structure,
      fields: data.fields,
    });
  }, [pivotData]);

  const resObserver = new ResizeObserver(() => {
    if (calender) calender.adjust();
  });
  const handleModal = id => {
    setModal(!isModal);
  };

  useEffect(() => {
    const container = ReactDOM.findDOMNode(rootRef.current);
    webix.ready(() => {
      const pivot = require('@xbs/pivot');
      webix.CustomScroll.init();

      class CustomModes extends pivot.views.mode {
        config() {
          const ui = super.config();
          const segmented = this.Compact ? ui.cols[1] : ui.cols[0];
          segmented.options = [segmented.options[1]];
          segmented.width = 86;
          return ui;
        }
      }
      class CustomTable extends pivot.views.table {
        CellFormat(value) {
          console.log('valuevaluevalue');
          if (!value) value = value === 0 ? '0' : '';

          return value ? parseInt(value) : value;
        }
      }
      function mark_votes(value, config) {
        if (value) return 'highlight';
      }
      calender = webix.ui({
        view: 'pivot-load',
        readonly: true,
        // structure: this.props.data.structure,
        predicates: {
          date: webix.Date.dateToStr(webix.i18n.dateFormat),
        },
        // view: 'pivot',
        // url: 'https://cdn.webix.com/demodata/pivot.json',
        // url: data,
        url: `../data/data.json`,
        // data: `${pivotData}`,
        // data: pivotData,
        // data: '../common/dataData.json',
        id: 'pivot',
        datatable: {
          on: {
            onItemClick: function (id, node) {
              console.log('id', id.row);
              const clickId = id.row;
              console.log('node', node);
              const colId = id.column;
              console.log('column', colId);
              const structure = calender.getStructure();
              console.log('structure', structure);
              const clickedItem = this.getItem(id.row);
              console.log('clickedItem.values[0]', clickedItem);
              console.log('clickedItem', clickedItem.values);
              const data = calender.getService('local')._data;

              handleModal();
            },
          },
        },
        structure: dataVal,
        // structure: {
        //   rows: ['form', 'name'],
        //   columns: ['year'],
        //   values: [{ name: 'oil', operation: ['min', 'sum'] }],
        // },
        predicates: {
          date: webix.Date.dateToStr(webix.i18n.dateFormat),
        },

        readonly: true,
        // structure: {
        //   rows: ['product', 'time'],
        //   columns: ['Month'],
        //   values: [
        //     { name: 'participant', operation: ['any'] },
        //     { name: 'inventory', operation: ['any'] },
        //   ],
        // },
        // structure: {
        //   rows: ['product', 'time'],
        //   columns: ['date'],
        //   values: [
        //     { name: 'booked', operation: ['any'] },
        //     { name: 'inventory', operation: ['any'] },
        //   ],
        // },
        override: new Map([
          [pivot.views.mode, CustomModes],
          [pivot.views.table, CustomTable],
        ]),
        container,
      });
      resObserver.observe(container);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (calender) {
        calender.destructor();
      }
      resObserver.disconnect();
    };
  }, []);
  return (
    <ProductDetailsContainer
      isSidebar={isSidebar}
      style={{ height: 'calc(100% - 22px)' }}
    >
      {isModal && <ModalPivot handleClickCloseModal={handleModal} />}
      <div ref={rootRef} style={{ height: '100%', width: '100%' }} />
    </ProductDetailsContainer>
  );
};
const HeadContainer = styled.div`
  display: flex;
`;
const CalenderWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;
const ProductDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 12px 0 0 32px;
  width: ${({ isSidebar }) =>
    isSidebar ? `calc(100vw - 280px)` : `calc(100vw - 100px)`};
  min-width: 960px;
  height: 544px;
`;
export default PivotTable;
