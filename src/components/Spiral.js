import React, { Component } from 'react';
import { EventBridge, Canvas, View } from 'react-juce';
import { getNoteName, isBlackNote, notesPerOctave } from '../utils';
import { palette } from '../global-styles';

const octavesToSkip = 2;
const shouldRenderText = true;

const getSpiralEdges = ({ centerX, centerY, stepCount, loopCount, innerDistance, loopSpacing, rotation }) => {
    const stepSize = (2 * Math.PI) / stepCount;
    const endAngle = (2 * Math.PI) * loopCount;
    let finished = false;
    const edges = [];

    for (let angle = 0; !finished; angle += stepSize) {
        if (angle > endAngle) {
            angle = endAngle;
            finished = true;
        }
        const scalar = innerDistance + loopSpacing * angle;
        const rotatedAngle = angle + rotation;
        const x = centerX + scalar * Math.cos(rotatedAngle);
        const y = centerY + scalar * Math.sin(rotatedAngle);

        edges.push([x, y]);
    }
    return edges;
};

const getZones = ({ spiralEdges, stepCount }) => {
    const edges = [...spiralEdges];
    return edges.reduce((acc, edge, i) => {
        const lastEdge = edges[i + stepCount + 1];
        if (lastEdge) {
            acc.push([edge, edges[i + 1], lastEdge, edges[i + stepCount]]);
        }
        return acc;
    }, []);
};

const renderSpiral = ({ spiralEdges, ctx }) => {
    ctx.strokeStyle = styles.colors.LINE_SPIRAL;
    ctx.beginPath();
    ctx.moveTo(...spiralEdges[0]);
    spiralEdges.forEach((edge) => {
        ctx.lineTo(...edge);
    });
    ctx.stroke();
};

const renderNet = ({ spiralEdges, stepCount, ctx }) => {
    ctx.strokeStyle = styles.colors.LINE_NET;
    ctx.beginPath();
    const edges = [...spiralEdges];
    edges.reverse().forEach((edge, i) => {
        const next = edges[i + stepCount];
        if (next) {
            ctx.moveTo(edge[0], edge[1]);
            ctx.lineTo(next[0], next[1]);
        }
    });
    ctx.stroke();
};

const renderSelected = (options) => {
    const zones = getZones(options);
    const { selected, ctx } = options;
    selected.forEach((i) => {
        const zone = zones[i];
        if (zone) {
            
            ctx.beginPath();
            ctx.moveTo(...zone[zone.length-1]);
            zone.forEach((point, index) => {
                ctx.lineTo(...zone[index]);
            });
            ctx.closePath();

            ctx.fillStyle = isBlackNote(i) ? styles.colors.FILL_DARK : styles.colors.FILL_LIGHT;
            ctx.fill();

            if (shouldRenderText) renderZoneText({ctx, zone, text: getNoteName(i)});
        }
    });
};

const renderKeys = (options) => {
    const zones = getZones(options);
    const { ctx } = options;
    
    zones.forEach((zone, i) => {
        ctx.beginPath();
        ctx.moveTo(...zone[zone.length-1]);
        zone.forEach((point, index) => {
            ctx.lineTo(...zone[index]);
        });
        ctx.closePath();
        ctx.fillStyle = isBlackNote(i) ? styles.colors.BACKGROUND_DARK : styles.colors.BACKGROUND_LIGHT;
        ctx.fill();
    });
};

const renderZoneText = ({ctx, zone, text}) => {
    const center = zone.reduce((acc, val, index) => {
        const [x, y] = val;
        acc[0] += x;
        acc[1] += y;
        if (index === zone.length - 1) {
            acc[0] /= zone.length;
            acc[1] /= zone.length;
        }
        return acc;
    }, [0, 0])
    ctx.font = FONT;
    const height = FONT_SIZE;
    const width = FONT_SIZE;

    const [x, y] = center;
    ctx.fillStyle = styles.colors.TEXT;
    ctx.fillText(text, x - width/2, y + height/2);
}

const render = (ctx, notes) => {
    const parameters = getParameters();
    const selected = notes.map(note => note - octavesToSkip * notesPerOctave);

    const width = WIDTH; //ctx.canvas.width;
    const height = HEIGHT; //ctx.canvas.height;
    
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    let options = { centerX, centerY, ctx, ...parameters };
    const spiralEdges = getSpiralEdges(options);
    options = { spiralEdges, ...options };

    renderKeys(options);

    renderSelected({ selected, ...options });

    renderSpiral(options);
    renderNet(options);
};

class Spiral extends Component {
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
        const onDraw = (ctx) => {
            render(ctx, notes);
        };

        return (
            <View {...this.props}>
                <Canvas {...styles.canvas} animate={true} onDraw={onDraw} />
            </View>
        );
    }
}

const getParameters = () => ({
    stepCount: 12,
    loopCount: 6,
    innerDistance: 10,
    loopSpacing: 8,
    rotation: 11,
});

const WIDTH = 700;
const HEIGHT = WIDTH;
const FONT_SIZE = 15;
const FONT = `${FONT_SIZE}px arial`;

const styles = {
    colors: {
        BACKGROUND_LIGHT: palette[0],
        BACKGROUND_DARK: palette[1],
        FILL_LIGHT: palette[2],
        FILL_DARK: palette[3],
        LINE_SPIRAL: palette[4],
        LINE_NET: palette[4],
        TEXT: palette[4]
    },
    canvas: {
        width: WIDTH,
        height: HEIGHT
    }
};

export default Spiral;
