import React, { Component } from "react";
import { View } from "react-juce";
import Note from "./Note";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View {...styles.container}>
        <View {...styles.content}>
          <Note />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "linear-gradient(45deg, hsla(225, 15%, 11%, 0.3), #17191f 50%)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1.0,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 24.0,
    maxWidth: 600,
    aspectRatio: 400.0 / 240.0,
  }
};

export default App;
