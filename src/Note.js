import React, { Component } from 'react';
import { EventBridge, Text, View } from 'react-juce';
import { findChord, getFullNoteName } from './utils';

class NoteOn extends Component {
    constructor(props) {
        super(props);

        this._onActiveNotesChanged = this._onActiveNotesChanged.bind(this);

        this.state = {
            notes: []
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
                .sort()
        });
    }

    render() {
        const { notes } = this.state;
        const notesText = notes.map(getFullNoteName).join(' ');
        const chords = findChord(notes);
        const chordsText = chords.join('/');

        return (
            <View {...this.props}>
                <Text color='#1AB2B7' {...styles}>{`Note: ${notesText}`}</Text>
                <Text color='#66FDCF' {...styles}>{`Chord: ${chordsText}`}</Text>
            </View>
        );
    }
}

const styles = {
    fontSize: 40.0,
    lineSpacing: 1.6,
    fontStyle: Text.FontStyleFlags.bold
};

export default NoteOn;
