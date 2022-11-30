import { createSelector } from "@reduxjs/toolkit";

/** Selector **/
const groupSelector = (state) => state.groups;

const selectGroupSelector = createSelector(
  groupSelector,
  (state) => state.groups
);

const selectPageSelector = createSelector(groupSelector, (state) => state.page);

const selectSizeSelector = createSelector(groupSelector, (state) => state.size);

const selectTotalSizeSelector = createSelector(
  groupSelector,
  (state) => state.totalSize
);

const selectMinTotalSelector = createSelector(
  groupSelector,
  (state) => state.minTotalMember
);

const selectMaxTotalSelector = createSelector(
  groupSelector,
  (state) => state.maxTotalMember
);

const selectSearchSelector = createSelector(
  groupSelector,
  (state) => state.search
);

const selectSelectedRowSelector = createSelector(
  groupSelector,
  (state) => state.selectedRow
);

/** function */
export const selectGroup = (state) => {
  return selectGroupSelector(state);
};
export const selectPage = (state) => {
  return selectPageSelector(state);
};
export const selectSize = (state) => {
  return selectSizeSelector(state);
};
export const selectTotalSize = (state) => {
  return selectTotalSizeSelector(state);
};
export const selectMinTotal = (state) => {
  return selectMinTotalSelector(state);
};
export const selectMaxTotal = (state) => {
  return selectMaxTotalSelector(state);
};
export const selectSearch = (state) => {
  return selectSearchSelector(state);
};
export const selectSelectedRow = (state) => {
  return selectSelectedRowSelector(state);
};
