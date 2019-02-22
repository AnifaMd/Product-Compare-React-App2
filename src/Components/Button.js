import React from "react";

const Button = props => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

Button.defaultProps = {
  message: "Click Me!"
};

export default Button;
