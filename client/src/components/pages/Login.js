import React, { Component } from "react";

function Login(props) {
  const {} = props;

  return (
    <div>
      <h1>Login</h1>
      <div>
        Username <input type="text" />
      </div>
      <div>
        Password <input type="text" />
      </div>
    </div>
  );
}

export default Login;