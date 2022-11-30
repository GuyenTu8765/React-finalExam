import React from "react";
import { Button, FormGroup, Row, Col, InputGroupAddon } from "reactstrap";
import { ReactstrapInput } from "reactstrap-formik";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  selectMaxTotal,
  selectMinTotal,
} from "../../redux/selectors/groupSelector.js";
import { connect } from "react-redux";
const CustomFilter = (props) => {
  return (
    <Formik
      key={Date.parse(new Date())}
      enableReinitialize
      initialValues={{
        minTotalMember: props.minTotalMember ? props.minTotalMember : "",
        maxTotalMember: props.maxTotalMember ? props.maxTotalMember : "",
      }}
      validationSchema={Yup.object({
        minTotalMember: Yup.number()
          .positive("Must be greater than 0 and integer")
          .integer("Must be greater than 0 and integer"),

        maxTotalMember: Yup.number()
          .positive("Must be greater than 0 and integer")
          .integer("Must be greater than 0 and integer"),
      })}
      onSubmit={(value) => {
        // this.props.onFilter(this.getValue())
        props.handleChangeFilter(value.minTotalMember, value.maxTotalMember);
      }}
      validateOnBlur={true}
      validateOnChange={true}
    >
      <Form>
        <fieldset className="filter-border">
          <legend className="filter-border">Filter</legend>
          <div className="control-group">
            <Row style={{ alignItems: "center" }}>
              <Col md="auto">
                <label> Total Member:</label>
              </Col>
              <Col md="2">
                <FormGroup>
                  <FastField
                    bsSize="lg"
                    type="number"
                    name="minTotalMember"
                    placeholder="Min"
                    component={ReactstrapInput}
                  />
                </FormGroup>
              </Col>
              {"-"}
              <Col md="2">
                <FormGroup>
                  <FastField
                    bsSize="lg"
                    type="number"
                    name="maxTotalMember"
                    placeholder="Max"
                    component={ReactstrapInput}
                  />
                </FormGroup>
              </Col>
              <Col xs="auto">
                <InputGroupAddon addonType="append" color="primary">
                  <Button type="submit" size="lg">
                    Filter
                  </Button>
                </InputGroupAddon>
              </Col>
            </Row>
          </div>
        </fieldset>
      </Form>
    </Formik>
  );
};

const mapGlobalStateToProps = (state) => {
  return {
    minTotalMember: selectMinTotal(state),
    maxTotalMember: selectMaxTotal(state),
  };
};
export default connect(mapGlobalStateToProps)(CustomFilter);
