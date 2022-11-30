import * as types from "../constants";

export function getListGroupAction(
  groups,
  page,
  totalSize,
  minTotalMember,
  maxTotalMember,
  search
) {
  return {
    type: types.GET_LIST_GROUP,
    payload: {
      groups,
      page,
      totalSize,
      minTotalMember,
      maxTotalMember,
      search,
    },
  };
}

export function updateSelectedRowAction(selectedRow) {
  return {
    type: types.GET_LIST_GROUP_SELECTED_ROWS,
    payload: {
      selectedRow,
    },
  };
}
