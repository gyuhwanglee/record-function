export const data = {
  data: [],
  structure: {
    rows: ['form', 'name'],
    columns: ['year'],
    values: [{ name: 'oil', operation: ['min', 'sum'] }],
  },
  fields: [],
};

export const CalendarStructureData = {
  data: [],
  structure: {
    rows: ['product', 'departure'],
    columns: ['date'],
    values: [
      { name: 'booked', operation: ['any'] },
      { name: 'inventory', operation: ['any'] },
    ],
  },
  fields: [],
};
