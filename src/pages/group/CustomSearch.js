import React from "react";
import { Button, Row, Col, InputGroupAddon } from "reactstrap";
import { ReactstrapInput } from "reactstrap-formik";
import { FastField, Form, Formik } from "formik";
import { selectSearch } from "../../redux/selectors/groupSelector.js";
import { connect } from "react-redux";
const CustomSearch = (props) => {
  // const handleEnterKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     handleClick();
  //   }
  // };
  return (
    <Formik
      key={Date.parse(new Date())}
      enableReinitialize
      initialValues={{
        search: props.search ? props.search : "",
      }}
      //   validationSchema={
      //     Yup.object({
      //     minTotalMember: Yup.number()
      //       .positive("Must be greater than 0 and integer")
      //       .integer("Must be greater than 0 and integer"),

      //     maxTotalMember: Yup.number()
      //       .positive("Must be greater than 0 and integer")
      //       .integer("Must be greater than 0 and integer"),
      //   })
      // }
      onSubmit={(value) => {
        // this.props.onFilter(this.getValue())
        props.onSearch(value.search);
      }}
      // validateOnBlur={true}
      // validateOnChange={true}
    >
      <Form>
        <Row style={{ alignItems: "center" }}>
          <Col>
            <FastField
              bsSize="lg"
              type="text"
              name="search"
              placeholder="Search for ...."
              component={ReactstrapInput}
            />
          </Col>
          <Col xs="auto">
            <InputGroupAddon addonType="append" color="primary">
              <Button type="submit" size="xs">
                Go!
              </Button>
            </InputGroupAddon>
          </Col>
        </Row>
      </Form>
    </Formik>
  );
};
const mapGlobalStateToProps = (state) => {
  return {
    search: selectSearch(state),
  };
};
export default connect(mapGlobalStateToProps)(CustomSearch);
