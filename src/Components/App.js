import React from "react";
import Header from "./Header";
import Container from "./Container";
import Footer from "./Footer";
//import '../css/styles.css'

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        {/* <Header />  */}

        <br />
        <Container />

        <br />
        {/* <Footer /> */}
      </div>
    );
  }
}

export default App;
