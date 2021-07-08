import React from "react";
import axios from "axios";

class users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3300/api/users")
      .then(users => {
        this.setState({ users: users.data });
      })
      .catch(err => {
        console.log("Could not find users");
      });
  }
  render() {
    return (
      <div>
        {this.state.users.map(user => {
          return <div key={user.id}>{user.username}</div>;
        })}
      </div>
    );
  }
}

export default users;
