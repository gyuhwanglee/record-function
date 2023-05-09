import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import uuid from 'react-uuid';
import { client } from '../../services/Common';
import ReactDOM from 'react-dom';
import * as webix from '@xbs/webix-pro';
import '@xbs/webix-pro/webix.css';
import '@xbs/pivot/codebase/pivot.css';
import ModalPivot from './ModalPivot';
import PivotModal from './PivotModal';
import styled from 'styled-components';

function PivotView({
  dataVal,
  settingData,
  handleModal,
  isModal,
  handleModalClose,
}) {
  const uiPivot = useRef(null);
  const uiContainer = useRef(null);
  const [detailData, setDetailData] = useState([]);
  const [satusData, setSatusData] = useState('');
  const [clickColumData, setClickColumData] = useState([]);
  const [dcId, setDcId] = useState('');
  const [stgatusValue, setStatusValue] = useState([]);
  const [clickDataIndex, setClickDataIndex] = useState();
  const [unixTime, setUnixTime] = useState('');
  // const [isModal, setModal] = useState(false);
  const [dataTrue, setDataTrue] = useState(false);
  // const handleModal = id => {
  //   setModal(!isModal);
  // };
  let random = '';
  const setuuid = () => {
    random = 'white' + uuid() + '@axchange.co';
  };
  useEffect(() => {
    const resObserver = new ResizeObserver(() => {
      if (uiPivot.current) uiPivot.current.adjust();
    });

    const container = ReactDOM.findDOMNode(uiContainer.current);

    webix.ready(() => {
      const pivot = require('@xbs/pivot');

      webix.protoUI(
        {
          name: 'pivot-load',
          load(url, structure, fields) {
            this.clearAll();
            this.$app.config.url = url;
            if (fields) this.$app.config.fields = fields;
            this.getService('local')
              .getData(true)
              .then(() => {
                this.setStructure(
                  this.$app.prepareStructure(structure || {}, true)
                );
              });
          },
          parse(data, structure, fields) {
            this.$app.$data = data;
            this.load(null, structure, fields);
          },
        },
        webix.ui.pivot
      );

      class MyData extends pivot.services.LocalData {
        getOps() {
          const ops = super.getOps();
          ops.forEach(op => {
            op.math = `withStatus(${op.math},status(status))`;
            op.branchMode = 'raw';
          });
          return ops;
        }
      }

      class CustomModes extends pivot.views.mode {
        config() {
          const ui = super.config();
          const segmented = this.Compact ? ui.cols[1] : ui.cols[0];
          segmented.options = [segmented.options[1]];
          segmented.width = 86;
          return ui;
        }
      }

      class ToolbarView extends pivot.views.toolbar {
        config() {
          const ui = super.config();
          ui.hidden = true;
          return ui;
        }
      }

      class CustomTable extends pivot.views.table {
        CellFormat(v) {
          let value = v.value;
          if (!value) value = value === 0 ? '0' : '';
          return `<div class='${
            v.status
          }_div'  data-cy="cellValue"><span class="${v.status}_status">${
            value ? parseInt(value) : value
          }</span></div>`;
        }
        HeaderTemplate(line, _) {
          if (!line.operation || line.operation === 'complex')
            return this.Local.fixMath(line.text);
          else {
            let text = line.text.split(',');
            text = text.map(t => this.Local.getField(t).value).join(', ');
            return `${text}`;
          }
        }
        UpdateTable(data) {
          const state = this.State;
          const rows = state.structure.rows.length;
          if (!data.$ready && state.mode !== 'table' && rows > 1) {
            data.data.map(item => clearGroups(item));
            function clearGroups(item) {
              if (item.data) {
                item.values = item.values.map((v, i) => (!i ? v : ''));
                item.data.map(item => clearGroups(item));
              }
              return item;
            }
          }
          return super.UpdateTable(data);
        }
      }

      class CustomBackend extends pivot.services.Backend {
        data() {
          if (this.app.$data) return webix.promise.resolve(this.app.$data);
          else return super.data();
        }
        url(path) {
          return this.app.config.url + (path || '');
        }
      }

      uiPivot.current = webix.ui({
        view: 'pivot-load',
        readonly: true,
        // structure: uiPivot.current.structure,

        operations: {
          withStatus: {
            hidden: true,
            handler: (value, status) => ({ status, value }),
          },
          status: {
            hidden: true,
            handler: status => {
              let result;
              for (let i = 0; i < status.length; i++) {
                if (!result) result = status[i];
                else if (result !== status[i]) return 'mixed';
              }

              return result;
            },
          },
        },
        mode: 'tree',
        // freezeColumns: false,
        predicates: {
          date: webix.Date.dateToStr(webix.i18n.dateFormat),
        },
        url: 'https://cdn.webix.com/demodata/pivot.json',
        override: new Map([
          [pivot.views.table, CustomTable],
          [pivot.views.mode, CustomModes],
          [pivot.views.toolbar, ToolbarView],
          [pivot.services.LocalData, MyData],
          [pivot.services.Backend, CustomBackend],
        ]),
        container,
        datatable: {
          select: 'cell',
          on: {
            onItemClick: (id, node) => {
              const clickId = String(id.row);

              const structure = uiPivot.current.getStructure();
              const data = uiPivot.current.getService('local')._data;
              const colId = id.column;

              const currentTable = uiPivot.current.queryView({
                localId: 'data',
              });

              const dataResult = [...stgatusValue];

              const clickedItem = currentTable.getItem(id.row);
              const clickColoum = currentTable.getItem(id.column);

              const backend = uiPivot.current.getService('backend').app.$data;

              const aggregatedItem = currentTable.getItem(id);

              setClickDataIndex(id.row - 1);

              dataResult.push(backend[id.row - 1]);
              setClickColumData(backend[id.row - 1]);

              let dcId = '';
              let source;
              let sourceData;
              backend.forEach((el, index) => {
                const rows = [];
                for (const r in structure.rows) {
                  if (el[structure.rows[r]] === clickedItem.values[0]) {
                    rows.push(el);
                  }
                }

                const columns = uiPivot.current
                  .getService('local')
                  .getPivotData().header;
                const col = columns[id.column - 1];

                source = rows.filter(row => {
                  for (let i = 0; i < structure.columns.length; i++) {
                    let n = 1;

                    // find the colspan source

                    if (!col.header[i].text) {
                      while (!columns[id.column - n].header[i].text) {
                        n++;
                      }
                    }
                    const abc = new Date(columns[id.column - n].header[i].text);

                    const c = col.header[i].text
                      ? col.header[i].text
                      : columns[id.column - n].header[i].text;

                    if (c !== row[structure.columns[i]]) {
                      return false;
                    }
                  }

                  return true;
                });
                // console.log('source', source);
                if (source.length > 0) {
                  sourceData = source;
                }
              });
              let time;
              let dcIdjoin;
              let dcIdValue;
              if (sourceData) {
                sourceData.map(el => {
                  const utcTime = new Date(el.unix);
                  time = utcTime.toISOString();
                  dcIdValue = el.dc_id?.join('&dc_id=');
                });
              }
              // const unixTimeResult = Math.floor(
              //   new Date(`${time}`).getTime() / 1000
              // );
              const unixTimeResult = new Date(`${time}`).toISOString();
              setUnixTime(unixTimeResult);
              setDcId(dcIdValue);
              client
                .get(
                  `/orders/timeslot/inventories/${unixTimeResult}?${dcIdValue}`
                )
                .then(res => {
                  if (res.status === 200) {
                    setDetailData(res.data);
                  }
                  if (clickId.length < 13) {
                    handleModal();
                  }
                });
            },
          },
        },
      });
    });
    resObserver.observe(container);

    return () => {
      if (uiPivot.current) {
        uiPivot.current.destructor();
        uiPivot.current = null;
      }
      resObserver.disconnect();
    };
  }, []); // []: do not track any params, call only once

  // replacement of componentDidUpdate
  // https://stackoverflow.com/a/53254028
  useLayoutEffect(() => {
    const { url, data, structure, fields } = dataVal;
    if (uiPivot.current) {
      if (data) uiPivot.current.parse(data, structure, fields);
      else if (url) uiPivot.current.load(url, structure, fields);
    }
  }, [dataVal]);
  console.log('detailData', detailData);
  return (
    <>
      {isModal && (
        // <ModalPivot
        //   handleClickCloseModal={handleModal}
        //   detailData={detailData}
        //   setDetailData={setDetailData}
        //   unixTime={unixTime}
        //   dcId={dcId}
        // />
        <PivotModal
          handleClickCloseModal={handleModal}
          handleModalClose={handleModalClose}
          detailData={detailData}
          setDetailData={setDetailData}
          unixTime={unixTime}
          dcId={dcId}
        />
      )}
      <Container ref={uiContainer} />
    </>
  );
}

export default PivotView;

const Container = styled.div`
  display: flex;
  height: 100%;
  /* height: 100%; */
  width: 100%;
  /* .webix_cell:hover {
    background-color: #652bf8;
    cursor: pointer;
  }
  .webix_cell:active {
    background-color: #652bf8;
    cursor: pointer;
  }
  .webix_column > div.webix_cell_select:hover,
  .webix_column > div.webix_column_select:hover,
  .webix_column > div.webix_row_select:hover {
    background-color: none;
  } */
  .webix_column > div.webix_cell_select,
  .webix_column > div.webix_column_select,
  .webix_column > div.webix_row_select {
    background: #e5f1fc;
    cursor: pointer;
  }
  /* .webix_cell:hover {
    background-color: #e5f1fc;
    cursor: pointer;
  }
  .webix_cell:active {
    background-color: #e5f1fc;
    cursor: pointer;
  } */
  /* .webix_column div.webix_cell_select,
  .webix_column div.webix_column_select,
  .webix_column div.webix_row_select {
    background-color:  !important;
  } */
  .webix_column > div {
    padding: 0 0;
  }
  .LowerThanMin_div {
    padding: 0 12px;
    :hover {
      background-color: #e5f1fc;
      cursor: pointer;
    }
  }
  .Fulled_div {
    padding: 0 12px;
    background: #e5f1fc !important;
    :hover {
      background-color: #e5f1fc;
      cursor: pointer;
    }
  }
  .OverBooked_div {
    padding: 0 12px;
    background: #fffce5 !important;
    :hover {
      background-color: #e5f1fc;
      cursor: pointer;
    }
  }
  .Passsed_div {
    padding: 0 12px;
    background: #f9f9fc !important;
    :hover {
      background-color: #e5f1fc;
      cursor: pointer;
    }
  }
  .OverMinNumber_div {
    padding: 0 12px;
    background: #f0f9e9 !important;
    :hover {
      background-color: #e5f1fc;
      cursor: pointer;
    }
  }
  .LowerThanMin_status {
    color: #6c7491 !important;
  }
  .Fulled_status {
    color: #364397 !important;
  }
  .OverBooked_status {
    color: #fb7300 !important;
  }
  .Passsed_status {
    color: #6c7491 !important;
  }
  .OverMinNumber_status {
    color: #266c1d !important;
  }
`;
