import React, { useState } from "react";

const SignOut = (props) => {
}

export default withRouter(
    connect(null, { setUserLoginInfo, setTokenInfo })(withRouter(SignOut))
  );