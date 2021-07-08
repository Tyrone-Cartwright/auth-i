import React from "react";

class form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: " ",
      password: " "
    };
  }
  render() {
    return (
      <div>
        <form>
          <input
            type="text"
            placeholder="username"
            name="username"
            required={true}
          />
          <input
            type="text"
            placeholder="password"
            name="password"
            required={true}
          />
        </form>
      </div>
    );
  }
}

export default form;
