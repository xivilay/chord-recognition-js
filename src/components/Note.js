import React, { Component } from 'react';
import { EventBridge, Text, View } from 'react-juce';
import { getFullNoteName } from '../theory/utils';
import { findChord } from '../theory/chords';
import { palette } from '../global-styles';

class Note extends Component {
    constructor(props) {
        super(props);

        this._onActiveNotesChanged = this._onActiveNotesChanged.bind(this);

        this.state = {
            notes: [],
        };
    }

    componentDidMount() {
        EventBridge.addListener('activeNotesChanged', this._onActiveNotesChanged);
    }

    componentWillUnmount() {
        EventBridge.removeListener('activeNotesChanged', this._onActiveNotesChanged);
    }

    _onActiveNotesChanged(notes) {
        this.setState({
            notes: notes
                .split(',')
                .filter((a) => a !== '')
                .sort(),
        });
    }

    render() {
        const { notes } = this.state;
        const notesText = notes.map(getFullNoteName).join(' ');
        const chords = findChord(notes);
        const chordsText = chords.join('/');

        return (
            <View {...this.props}>
                <Text color={`${styles.colors.notes}`} {...styles}>{`Notes: ${notesText}`}</Text>
                <Text color={`${styles.colors.chord}`} {...styles}>{`Chord: ${chordsText}`}</Text>
            </View>
        );
    }
}

const styles = {
    colors: {
        notes: palette[1],
        chord: palette[3],
    },
    fontSize: 40.0,
    lineSpacing: 1.6,
    fontStyle: Text.FontStyleFlags.bold,
};

export default Note;
