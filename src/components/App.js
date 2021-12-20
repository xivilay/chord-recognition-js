import React, { Component } from 'react';
import { View } from 'react-juce';
import Note from './Note';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View {...styles.container}>
                <View {...styles.content}>
                    <Note {...styles.content} />
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'linear-gradient(180deg, #222222, #323e44, 50%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        flex: 1.0,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
    },
};

export default App;
