import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import {
  selectGroup,
  selectPage,
  selectSelectedRow,
  selectSize,
  selectTotalSize,
} from "../../redux/selectors/groupSelector.js";
import * as Yup from "yup";
import { connect } from "react-redux";
import * as Icon from "react-feather";
import CustomSearch from "./CustomSearch.js";
import CustomFilter from "./CustomFilter.js";
import { toastr } from "react-redux-toastr";
import GroupsApi from "../../api/GroupApi.js";
import { FastField, Form, Formik } from "formik";
import { ReactstrapInput } from "reactstrap-formik";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  getListGroupAction,
  updateSelectedRowAction,
} from "./../../redux/actions/groupActions";
import filterFactory, { customFilter } from "react-bootstrap-table2-filter";

const Group = (props) => {
  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <Icon.Edit2
        className="align-middle mr-2"
        size={16}
        onClick={() => updateGroup(row.id)}
      />
    );
  };

  const tableColumns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "totalMember",
      text: "TotalMember",
      sort: true,
      filter: customFilter(),
      filterRenderer: (onFilter, column) => {
        onTotalMemberFilter = onFilter;
        return null;
      },
    },
    {
      dataField: "action",
      text: "",
      formatter: actionFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      },
      align: () => {
        return "center";
      },
    },
  ];

  const getListGroup = props.getListGroupAction;
  const size = props.size;
  let onTotalMemberFilter;

  useEffect(() => {
    const getAllGroup = async () => {
      const result = await GroupsApi.getGroupAll(1, size);
      const groups = result.content;
      const totalSize = result.totalElements;
      getListGroup(groups, 1, totalSize);
    };
    getAllGroup();
  }, [getListGroup, size]);

  const handleTableChange = async (
    type,
    { page, sortField, sortOrder, searchText, filters }
  ) => {
    if (
      sortField === null ||
      sortField === undefined ||
      sortOrder === null ||
      sortOrder === undefined
    ) {
      sortField = "id";
      sortOrder = "desc";
    }

    const filter =
      filters && filters.totalMember && filters.totalMember.filterVal
        ? filters.totalMember.filterVal
        : null;
    const minTotalMember =
      filter && filter.minTotalMember ? filter.minTotalMember : null;
    const maxTotalMember =
      filter && filter.maxTotalMember ? filter.maxTotalMember : null;

    const result = await GroupsApi.getGroupAll(
      page,
      size,
      sortField,
      sortOrder,
      searchText,
      minTotalMember,
      maxTotalMember
    );
    const groups = result.content;
    const totalSize = result.totalElements;

    getListGroup(
      groups,
      page,
      totalSize,
      minTotalMember,
      maxTotalMember,
      searchText
    );
  };

  const [isVisibleFilter, setVisibleFilter] = useState(false);

  const handleChangeFilter = (minTotalMember, maxTotalMember) => {
    onTotalMemberFilter({
      minTotalMember,
      maxTotalMember,
    });
  };

  const refreshFrom = () => {
    props.updateSelectedRowAction([]);

    handleTableChange(null, {
      page: 1,
      sortField: null,
      sortOrder: null,
      searchText: null,
      filters: null,
    });
  };
  
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);

  const showSuccessNotification = (title, message) => {
    const options = {
      timeOut: 3000,
      showCloseButton: false,
      progressBar: false,
      position: "top-right",
    };

    toastr.success(title, message, options);
  };

  const showErrorNotification = (title, message) => {
    const options = {
      timeOut: 3000,
      showCloseButton: false,
      progressBar: false,
      position: "top-right",
    };

    toastr.error(title, message, options);
  };

  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);

  const [groupUpdateInfo, setGroupUpdateInfo] = useState();

  const updateGroup = async (groupId) => {
    setIsOpenModalUpdate(true);
    const groupInfo = await GroupsApi.getById(groupId);
    setGroupUpdateInfo(groupInfo);
  };

  const handleOnSelect = (row, isSelect) => {
    let selected = props.selectedRow;
    if (isSelect) {
      selected = [...props.selectedRow, row.id];
    } else {
      selected = props.selectedRow.filter((x) => x !== row.id);
    }
    props.updateSelectedRowAction(selected);
  };

  const handleOnSelectAll = (isSelect, rows) => {
    let selected = props.selectedRow;

    const ids = rows.map((r) => r.id);
    if (isSelect) {
      selected = ids;
    } else {
      selected = [];
    }
    props.updateSelectedRowAction(selected);
  };

  const deleteGroup = async () => {
    if (props.selectedRow.length !== 0) {
      try {
        await GroupsApi.deleteByIds(props.selectedRow);
        showSuccessNotification("Delete Group", "Delete Group Successfully!");
        refreshFrom();
      } catch (error) {
        // redirect page error server
        props.history.push("/auth/500");
      }
    } else {
      showErrorNotification("Delete Group", "You must select groups");
    }
  };
  return (
    <Container fluid className="p-0">
      <h1 className="h3 mb-3">Group Management</h1>

      <Row>
        <Col>
          <Card>
            <CardBody>
              <ToolkitProvider
                keyField="id"
                data={props.groups}
                columns={tableColumns}
                search
              >
                {(toolkitprops) => (
                  <>
                    {isVisibleFilter && (
                      <Row>
                        <Col md="12">
                          <CustomFilter
                            handleChangeFilter={handleChangeFilter}
                          />
                        </Col>
                      </Row>
                    )}

                    <Row style={{ alignItems: "center" }}>
                      <Col md="3">
                        <CustomSearch {...toolkitprops.searchProps} />
                      </Col>

                      <Col md="9">
                        <div className="float-right pull-right">
                          <Icon.Filter
                            className="align-middle mr-2"
                            size={24}
                            onClick={() => setVisibleFilter(!isVisibleFilter)}
                          />
                          <Icon.RefreshCcw
                            className="align-middle mr-2"
                            size={24}
                            onClick={() => refreshFrom()}
                          />
                          <Icon.PlusCircle
                            className="align-middle mr-2"
                            size={24}
                            onClick={() => setIsOpenModalCreate(true)}
                          />
                          <Icon.Trash2
                            className="align-middle mr-2"
                            size={24}
                            onClick={() => deleteGroup()}
                          />
                        </div>
                      </Col>
                    </Row>

                    <BootstrapTable
                      {...toolkitprops.baseProps}
                      bootstrap4
                      striped
                      hover
                      bordered
                      remote
                      pagination={paginationFactory({
                        page: props.page,
                        sizePerPage: props.size,
                        totalSize: props.totalSize,

                        withFirstAndLast: false,
                        alwaysShowAllBtns: true,
                        hideSizePerPage: true,
                      })}
                      onTableChange={handleTableChange}
                      selectRow={{
                        mode: "checkbox",
                        clickToSelect: true,
                        selected: props.selectedRow,
                        onSelect: handleOnSelect,
                        onSelectAll: handleOnSelectAll,
                      }}
                      filter={filterFactory()}
                    />
                  </>
                )}
              </ToolkitProvider>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal isOpen={isOpenModalCreate}>
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(6, "Must be between 6 and 50 characters ")
              .max(50, "Must be between 6 and 50 characters ")
              .required("Required")
              .test(
                "checkUniqueName",
                "This Name is already registered.",
                async (name) => {
                  // call api
                  const isExists = await GroupsApi.existsByName(name);
                  return !isExists;
                }
              ),
          })}
          onSubmit={async (values) => {
            try {
              // call api
              await GroupsApi.create(values.name);

              showSuccessNotification(
                "Create Group",
                "Create Group Successfully!"
              );

              setIsOpenModalCreate(false);

              refreshFrom();
            } catch (error) {
              setIsOpenModalCreate(false);
              // redirect page error server
              props.history.push("/auth/500");
            }
          }}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader>Create Group</ModalHeader>
              <ModalBody className="m-3">
                <Row style={{ alignItems: "center" }}>
                  <Col md="auto">
                    <label>Group Name:</label>
                  </Col>
                  <Col>
                    <FastField
                      bsSize="lg"
                      type="text"
                      name="name"
                      placeholder="Enter group name"
                      component={ReactstrapInput}
                    />
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  Save
                </Button>
                <Button
                  color="primary"
                  onClick={() => setIsOpenModalCreate(false)}
                >
                  Close
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal isOpen={isOpenModalUpdate}>
        <Formik
          enableReinitialize
          initialValues={{
            name:
              groupUpdateInfo && groupUpdateInfo.name
                ? groupUpdateInfo.name
                : "",
            totalMember:
              groupUpdateInfo &&
              groupUpdateInfo.totalMember !== undefined &&
              groupUpdateInfo.totalMember !== null
                ? groupUpdateInfo.totalMember
                : "",
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(6, "Must be between 6 and 50 characters ")
              .max(50, "Must be between 6 and 50 characters ")
              .required("Required")
              .test(
                "checkUniqueName",
                "This Name is already registered.",
                async (name) => {
                  if (name === groupUpdateInfo.name) {
                    return true;
                  }
                  // call api
                  const isExists = await GroupsApi.existsByName(name);
                  return !isExists;
                }
              ),
            totalMember: Yup.number()
              .min(0, "Must be greater than or equal 0 and integer")
              .integer("Must be greater than or equal 0 and integer"),
          })}
          onSubmit={async (values) => {
            try {
              // call api
              await GroupsApi.update(
                groupUpdateInfo.id,
                values.name,
                values.totalMember
              );

              showSuccessNotification(
                "Update Group",
                "Update Group Successfully!"
              );

              setIsOpenModalUpdate(false);

              refreshFrom();
            } catch (error) {
              setIsOpenModalUpdate(false);
              // redirect page error server
              props.history.push("/auth/500");
            }
          }}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader>Update Group</ModalHeader>
              <ModalBody className="m-3">
                <Row style={{ alignItems: "center" }}>
                  <Col md="auto">
                    <label>Group Name:</label>
                  </Col>
                  <Col>
                    <FastField
                      bsSize="lg"
                      type="text"
                      name="name"
                      placeholder="Enter group name"
                      component={ReactstrapInput}
                    />
                  </Col>
                </Row>
                <Row style={{ alignItems: "center" }}>
                  <Col md="auto">
                    <label>TotalMember:</label>
                  </Col>
                  <Col>
                    <FastField
                      bsSize="lg"
                      type="number"
                      name="totalMember"
                      placeholder="Enter total member"
                      component={ReactstrapInput}
                    />
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  Save
                </Button>
                <Button
                  color="primary"
                  onClick={() => setIsOpenModalUpdate(false)}
                >
                  Close
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </Container>
  );
};

const mapGlobalStateToProps = (state) => {
  return {
    groups: selectGroup(state),
    page: selectPage(state),
    size: selectSize(state),
    totalSize: selectTotalSize(state),
    selectedRow: selectSelectedRow(state),
  };
};
export default connect(mapGlobalStateToProps, {
  getListGroupAction,
  updateSelectedRowAction,
})(Group);
