import React, { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { ReactstrapInput } from "reactstrap-formik";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import UserApi from "../../api/UserApi";
import { withRouter } from "react-router-dom";

const SignUp = (props) => {
  const [isOpenModal, setOpenModal] = useState(false);

  const [email, setEmail] = useState("");

  const [isDisableResendButton, setDisableResendButton] = useState(false);

  const resendEmailToActiveAccount = async () => {
    setDisableResendButton(true);
    await UserApi.resendEmailToActiveAccount(email);
    setDisableResendButton(false);
  };

  const redirectToLogin = () => {
    props.history.push("/auth/sign-in");
  };
  return (
    <>
      <div className="text-center mt-4">
        <h1 className="h2">Get started</h1>
        <p className="lead">
          Start creating account to experience in VTI Academy.
        </p>
      </div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(50, "Must be less than 50 characters ")
            .required("Required"),

          lastName: Yup.string()
            .max(50, "Must be less than 50 characters ")
            .required("Required"),

          userName: Yup.string()
            .min(6, "Must be between 6 and 50 characters ")
            .max(50, "Must be between 6 and 50 characters ")
            .required("Required")
            .test(
              "checkExistsUserName",
              "This UserName is already registered.",
              async (userName) => {
                // call api
                const isExists = await UserApi.existsByUserName(userName);
                return !isExists;
              }
            ),

          email: Yup.string()
            .email("Invalid email address")
            .required("Required")
            .test(
              "checkExistsEmail",
              "This email is already registered.",
              async (email) => {
                // call api
                const isExists = await UserApi.existsByEmail(email);
                console.log(isExists);
                return !isExists;
              }
            ),

          password: Yup.string()
            .min(6, "Must be between 6 and 50 characters ")
            .max(50, "Must be between 6 and 50 characters ")
            .required("Required"),

          confirmPassword: Yup.string()
            .required("Required")
            .when("password", {
              is: (val) => (val && val.length > 0 ? true : false),
              then: Yup.string().oneOf(
                [Yup.ref("password")],
                "Confirm password do not match"
              ),
            }),
        })}
        onSubmit={async (values) => {
          try {
            // call api
            await UserApi.create(
              values.firstName,
              values.lastName,
              values.userName,
              values.email,
              values.password
            );
            // message
            setEmail(values.email);
            setOpenModal(true);
          } catch (error) {
            // redirect page error server
            props.history.push("/auth/500");
          }
        }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ isSubmitting }) => (
          <Card>
            <CardBody>
              <div className="m-sm-4">
                <Form>
                  <FormGroup>
                    <FastField
                      label="First Name"
                      bsSize="lg"
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      component={ReactstrapInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FastField
                      label="Last Name"
                      bsSize="lg"
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      component={ReactstrapInput}
                    />
                  </FormGroup>
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
                      label="Email"
                      type="email"
                      bsSize="lg"
                      name="email"
                      placeholder="Enter your email"
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
                  </FormGroup>
                  <FormGroup>
                    <FastField
                      label="Confirm Password"
                      bsSize="lg"
                      type="password"
                      name="confirmPassword"
                      placeholder="Enter confirm password"
                      component={ReactstrapInput}
                    />
                  </FormGroup>
                  <div className="text-center mt-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      color="primary"
                      size="lg"
                    >
                      Sign up
                    </Button>
                  </div>
                </Form>
              </div>
            </CardBody>
          </Card>
        )}
      </Formik>
      <Modal isOpen={isOpenModal}>
        <ModalHeader>You need to confirm your account</ModalHeader>
        <ModalBody>
          <p className="mb-0">
            We have sent an email to <b>{email}</b>.{" "}
          </p>
          <p className="mb-0">Please check your email to active account.</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={resendEmailToActiveAccount}
            disabled={isDisableResendButton}
          >
            Resent
          </Button>{" "}
          <Button color="primary" onClick={redirectToLogin}>
            Login
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default withRouter(SignUp);
