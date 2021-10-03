const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const notesPerOctave = notes.length;

const getNoteIndex = noteNum => noteNum % notesPerOctave;

export const getNoteName = noteNum => {
    const noteIndex = getNoteIndex(noteNum);
    return notes[noteIndex];
}

export const getFullNoteName = noteNum => {
    const noteName = getNoteName(noteNum)
    const octave = Math.floor(noteNum / notesPerOctave) - 1;
    return noteName + octave;
}

export const isBlackNote = noteNum => [1, 3, 6, 8, 10].includes(getNoteIndex(noteNum));

const getIntervals = noteNums => [...new Set(noteNums.map(getNoteIndex).sort((a, b) => a - b))].map((val, i, arr) => {
    const nextIndex = i + 1;
    const lastIndex = arr.length - 1;
    let interval;
    if (i === lastIndex) {
        interval = (arr[0] + notesPerOctave) - val;
    } else {
        interval = arr[nextIndex] - val;
    }
    return { note: val, interval };
});

const isCyclicEqual = (a, b) => {
    if (a.length !== b.length) return;

    const bStartingIndexes = [];
    let i = 0;
    const getStartingIndex = i => b.indexOf(a[0], i);
    while (getStartingIndex(i) >= 0) {
        const index = getStartingIndex(i)
        bStartingIndexes.push(index);
        i = index + 1;
    }

    if (!bStartingIndexes.length) return;

    const isEqualForStartingIndex = (startingIndex) => {
        let bIndex = -1;
        for (let i = 0; i < a.length; i++) {
            const aVal = a[i];
            if (bIndex === -1) {
                bIndex = startingIndex;
            } else {
                if (bIndex === b.length) bIndex = 0;
                if (aVal !== b[bIndex]) return false;
            }
            bIndex++;
        }
        return true;
    }

    return bStartingIndexes.find(isEqualForStartingIndex);
}

const chordMapping = [
    { name: "powerchord", postfix: "5", intervals: [7, 5] },
    { name: "major", postfix: "", intervals: [4, 3, 5] },
    { name: "minor", postfix: "m", intervals: [3, 4, 5] },
    { name: "augmented", postfix: "aug", intervals: [4, 4, 4] },
    { name: "diminished", postfix: "dim", intervals: [3, 3, 6] },
    { name: "suspended", postfix: "sus2", intervals: [2, 5, 5] },
    { name: "suspended", postfix: "sus4", intervals: [5, 2, 5] },
    { name: "7diminished", postfix: "7dim", intervals: [3, 3, 3, 3] },
    { name: "7major", postfix: "7maj", intervals: [4, 3, 4, 1] },
    { name: "7minor", postfix: "7min", intervals: [3, 4, 3, 2] },
    { name: "7augmented", postfix: "7aug", intervals: [4, 4, 2, 2] },
    { name: "7half-diminished", postfix: "7hdim", intervals: [3, 3, 4, 2] },
    { name: "7dominant", postfix: "7dom", intervals: [4, 3, 3, 2] },
    { name: "7minor-major", postfix: "7minmaj", intervals: [3, 4, 4, 1] },
    { name: "7augmented-major", postfix: "7augmaj", intervals: [4, 4, 3, 1] },
];

export const findChord = (notes) => {
    const intervals = getIntervals(notes);
    const interval = intervals.map(i => i.interval);
    const intervalNotes = intervals.map(i => i.note);
    const startPoints = chordMapping.map(c => isCyclicEqual(c.intervals, interval));
    const filtered = chordMapping.filter((c, i) => startPoints[i] != undefined);
    const mapped = filtered.map(val => {
        const index = chordMapping.indexOf(val);
        const startPoint = startPoints[index];
        const note = getNoteName(intervalNotes[startPoint]);
        const { postfix } = val;
        return note + postfix;
    });
    return mapped;
}