import Api from "./Api";

const url = "/groups";

const getGroupAll = (
  page = 1,
  size = 10,
  sortField = "id",
  sortType = "desc",
  search = "",
  minTotalMember,
  maxTotalMember
) => {
  const parameters = {
    page,
    size,
    sort: sortField + "," + sortType,
  };
  if (search) {
    parameters.search = search;
  }
  if (minTotalMember !== null && minTotalMember !== undefined) {
    parameters.minTotalMember = minTotalMember;
  }

  if (maxTotalMember !== null && maxTotalMember !== undefined) {
    parameters.maxTotalMember = maxTotalMember;
  }

  return Api.get(`${url}`, { params: parameters });
};

const create = (name) => {
  const body = {
    name: name,
  };
  return Api.post(url, body);
};

const existsByName = (name) => {
  return Api.get(`${url}/name/${name}`);
};

const getById = (id) => {
  return Api.get(`${url}/${id}`);
};

const update = (id, name, totalMember) => {
  const body = {
    name: name,
    totalMember: totalMember,
  };
  return Api.put(`${url}/${id}`, body);
};

const deleteByIds = (ids) => {
  return Api.delete(`${url}/${ids.toString()}`);
};
const GroupsApi = {
  getGroupAll,
  existsByName,
  create,
  getById,
  update,
  deleteByIds,
};

export default GroupsApi;
