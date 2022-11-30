import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  CustomInput,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { ReactstrapInput } from "reactstrap-formik";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import LoginApi from "../../api/LoginApi";
import { withRouter } from "react-router-dom";
import storage from "../../storage/Storage";
import { toastr } from "react-redux-toastr";
import UserApi from "../../api/UserApi";
import {
  setUserLoginInfo,
  setTokenInfo,
} from "./../../redux/actions/userLoginInfoActions";
import { connect } from "react-redux";

const showErrorNotification = (title, message) => {
  const options = {
    timeOut: 3000,
    showCloseButton: false,
    progressBar: false,
    position: "top-right",
  };

  toastr.error(title, message, options);
};

const SignIn = (props) => {
  const [isOpenModal, setOpenModal] = useState(false);

  const [email, setEmail] = useState("");

  const [isDisableResendButton, setDisableResendButton] = useState(false);

  const resendEmailToActiveAccount = async () => {
    setDisableResendButton(true);
    await UserApi.resendEmailToActiveAccount(email);
    setDisableResendButton(false);
  };

  const [checkedRememberMe, setCheckedRememberMe] = React.useState(
    storage.isRememberMe()
  );
  return (
    <React.Fragment>
      <div className="text-center mt-4">
        <h2>Welcome to VTI Academy</h2>
        <p className="lead">Sign in to your account to continue</p>
      </div>
      <Formik
        initialValues={{
          userName: "",
          password: "",
        }}
        validationSchema={Yup.object({
          userName: Yup.string()
            .min(6, "Must be between 6 and 50 characters ")
            .max(50, "Must be between 6 and 50 characters ")
            .required("Required"),

          password: Yup.string()
            .min(6, "Must be between 6 and 50 characters ")
            .max(50, "Must be between 6 and 50 characters ")
            .required("Required"),
        })}
        onSubmit={async (values) => {
          try {
            // call api
            const result = await LoginApi.login(
              values.userName,
              values.password
            );

            if (result.token === null || result.token === undefined) {
              console.log(result.token);
              setEmail(result.email);
              setOpenModal(true);
            } else {
              // set rememberMe
              storage.setRememberMe(checkedRememberMe);
              //save token and user to storage
              storage.setToken(result.token);
              storage.setUserInfo(
                result.userName,
                result.email,
                result.firstName,
                result.lastName,
                result.role,
                result.status
              );

              //save token and  userInfo to Redux
              props.setTokenInfo(result.token);
              props.setUserLoginInfo(
                result.userName,
                result.email,
                result.firstName,
                result.lastName,
                result.role,
                result.status
              );
              //redirect to home page
              props.history.push("/dashboard/default");
            }
          } catch (error) {
            if (error.status === 401) {
              showErrorNotification(
                "Login Fail!",
                "Wrong UserName or Password!"
              );
            } else {
              // redirect page error server
              props.history.push("/auth/500");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Card>
            <CardBody>
              <div className="m-sm-4">
                <Form>
                  <FormGroup>
                    <FastField
                      label="User Name"
                      bsSize="lg"
                      type="text"
                      name="userName"
                      placeholder="Enter your user name"
                      component={ReactstrapInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FastField
                      label="Password"
                      bsSize="lg"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      component={ReactstrapInput}
                    />
                    <small>
                      <Link to="/auth/reset-password">Forgot password?</Link>
                    </small>
                    <small className="float-right pull-right">
                      <Link to="/auth/sign-up">SignUp</Link>
                    </small>
                  </FormGroup>
                  <div>
                    <CustomInput
                      type="checkbox"
                      id="rememberMe"
                      label="Remember me next time"
                      defaultChecked={checkedRememberMe}
                      onChange={() => setCheckedRememberMe(!checkedRememberMe)}
                    />
                  </div>
                  <div className="text-center mt-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      color="primary"
                      size="lg"
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
              </div>
            </CardBody>
          </Card>
        )}
      </Formik>
      <Modal isOpen={isOpenModal}>
        <ModalHeader>You need to active your account</ModalHeader>
        <ModalBody>
          <p className="mb-0">Your account is not active.</p>
          <p className="mb-0">
            Please check your email <b>{email}</b> to active account.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={resendEmailToActiveAccount}
            disabled={isDisableResendButton}
          >
            Resent
          </Button>{" "}
          <Button color="primary" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(
  connect(null, { setUserLoginInfo, setTokenInfo })(withRouter(SignIn))
);
