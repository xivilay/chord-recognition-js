import React, { Component } from "react";
import { View } from "react-juce";
import Note from "./Note";
import Spiral from './Spiral'
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View {...styles.container}>
        <View {...styles.content}>
          <Spiral />
          <Note {...styles.content} />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "linear-gradient(45deg, hsla(125, 5%, 44%, 0.3), #e7e9ef 50%)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  content: {
    flex: 1.0,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start"
  }
};

export default App;
