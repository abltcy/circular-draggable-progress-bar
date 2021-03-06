import range from 'lodash/range';
import React, { useEffect, useState } from 'react';
import { NativeModules, PanResponder, StyleSheet, Text, View, } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop, } from 'react-native-svg';
let _circle;
let _iconPanResponder;
export const CircularDraggableProgressBar = ({ strokeWidth = 40, radius = 145, iconOutSideColor = '#152679', gradientColorFrom = '#6bfd99', gradientColorTo = '#43a813', bgCircleColor = '#0c0a0a', draggable = true, text = 'Amount', max = 100, value = 1, displayNumber = 0, onChange = (value) => {
    console.log(value);
}, handlerPanResponder = (onMove) => {
    console.log(onMove);
}, symbol = '%', symbolPosition = 'right', icon: Icon, individualValue = 1000, }) => {
    const calculateArcCircle = (index0 = 0, segments = 2, radius = 100, startAngle0 = 0, angleLength0 = 2 * Math.PI) => {
        const startAngle = startAngle0 % (2 * Math.PI);
        const angleLength = angleLength0 % (2 * Math.PI);
        const index = index0 + 1;
        const fromAngle = (angleLength / segments) * (index - 1) + startAngle;
        const toAngle = (angleLength / segments) * index + startAngle;
        const fromX = radius * Math.sin(fromAngle);
        const fromY = -radius * Math.cos(fromAngle);
        const realToX = radius * Math.sin(toAngle);
        const realToY = -radius * Math.cos(toAngle);
        const toX = radius * Math.sin(toAngle + 0.005);
        const toY = -radius * Math.cos(toAngle + 0.0);
        return {
            fromX,
            fromY,
            toX,
            toY,
            realToX,
            realToY,
        };
    };
    const getGradientId = (index = 0) => {
        return `gradient${index}`;
    };
    const calculatePercentageFromAngle = (angle = 1, max = 100) => {
        const angleVal = angle / (2 * Math.PI);
        const num = 1;
        const hundred = max;
        const percentage = Math.round((angleVal * hundred) / num);
        return percentage;
    };
    const calculateAngleLengthFromValue = (value = 10, max = 101) => {
        return (value * (2 * Math.PI)) / max;
    };
    const onLayout = () => {
        setCircleCenter();
    };
    const onTouch = () => {
        if (!responderDragging) {
            setAngleLength(calculateAngleLengthFromValue(val < 2 ? val + 1 : val - 1, max));
        }
    };
    const setCircleCenter = () => {
        // @ts-ignore
        _circle === null || _circle === void 0 ? void 0 : _circle.measure((x = 0, y = 0, w = 0, h = 0, px = 0, py = 0) => {
            const halfOfContainer = getContainerWidth() / 2;
            setCircleCenterX(px + halfOfContainer);
            setCircleCenterY(py + halfOfContainer);
        });
    };
    const [val, setVal] = useState(value);
    const [startAngle, setStartAngle] = useState(0); //(Math.PI*2)/10
    const [angleLength, setAngleLength] = useState(calculateAngleLengthFromValue(val, max));
    const [circleCenterX, setCircleCenterX] = useState(0);
    const [circleCenterY, setCircleCenterY] = useState(0);
    const [responderDragging, setResponderDragging] = useState(draggable);
    const [responderMove, setResponderMove] = useState(false);
    const getContainerWidth = () => {
        return strokeWidth + radius * 2 + 2;
    };
    const segments = 2;
    const containerWidth = getContainerWidth();
    const xy = calculateArcCircle(segments - 1, segments, radius, startAngle, angleLength);
    function stopDragging() {
        setResponderDragging(false);
        _iconPanResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponderCapture: () => false,
            onStartShouldSetPanResponderCapture: () => false,
        });
    }
    const angle = (center = { x: 0, y: 0 }, p1 = { x: 0, y: 0 }) => {
        const p0 = {
            x: center.x,
            y: center.y -
                Math.sqrt(Math.abs(p1.x - center.x) * Math.abs(p1.x - center.x) +
                    Math.abs(p1.y - center.y) * Math.abs(p1.y - center.y)),
        };
        return (2 * Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;
    };
    const startDragging = () => {
        _iconPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => false,
            onPanResponderRelease: _handlePanResponderEnd,
            onPanResponderTerminate: _handlePanResponderEnd,
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: () => setCircleCenter(),
            onPanResponderMove: (evt, { moveX, moveY }) => {
                const angleL = angle({ x: circleCenterX, y: circleCenterY }, { x: moveX, y: moveY });
                let newAngleLength = (angleL * Math.PI) / 180;
                newAngleLength = Math.max((360 * Math.PI) / 180 / max / 2.5, Math.min((360 * Math.PI) / 180 - (360 * Math.PI) / 180 / 100 / 2, newAngleLength));
                !responderMove ? setResponderMove(true) : null;
                !responderMove ? handlerPanResponder(true) : null;
                setAngleLength(newAngleLength);
                setStartAngle(startAngle);
                setVal(calculatePercentageFromAngle(newAngleLength));
                onChange(progressAmount);
                calculatePercentageFromAngle(newAngleLength) > max - 1
                    ? stopDragging()
                    : null;
                calculatePercentageFromAngle(newAngleLength) < 1 ? stopDragging() : null;
            },
        });
    };
    const progressAmount = calculatePercentageFromAngle(angleLength, max);
    const _handlePanResponderEnd = () => {
        setResponderMove(false);
        handlerPanResponder(false);
    };
    useEffect(() => {
        startDragging();
    });
    const displayProgress = displayNumber > 0
        ? displayNumber
        : calculatePercentageFromAngle(angleLength, max);
    const centerText = () => {
        return symbolPosition
            ? symbolPosition == 'left'
                ? symbol + displayProgress
                : displayProgress + symbol
            : displayProgress + symbol;
    };
    const styles = StyleSheet.create({
        mainView: {
            height: radius * 2,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 300,
        },
        bgView: {
            width: containerWidth,
            height: containerWidth,
            justifyContent: 'center',
            alignItems: 'center',
        },
        textView: {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            backgroundColor: bgCircleColor,
            width: containerWidth - 20,
            height: containerWidth - 20,
            borderRadius: containerWidth / 2,
            zIndex: -1,
        },
        textHead: {
            color: '#b3b3b3',
        },
        textBig: {
            color: '#fff',
            fontSize: 23,
            padding: 5,
            textAlign: 'center',
        },
    });
    return (React.createElement(View, { style: styles.mainView },
        React.createElement(View, { onTouchStart: onTouch, onLayout: onLayout, style: styles.bgView },
            React.createElement(View, { style: styles.textView },
                Icon && Icon,
                React.createElement(Text, { style: styles.textHead }, text),
                React.createElement(Text, { style: styles.textBig }, centerText()),
                React.createElement(Text, null, (displayProgress * individualValue).toLocaleString())),
            React.createElement(Svg, { strokeLinecap: 'round', height: containerWidth, width: containerWidth, ref: (circle) => (_circle = circle) },
                React.createElement(Defs, null,
                    React.createElement(LinearGradient, { id: getGradientId(0), x1: '0', y1: '0', x2: '100%', y2: '0' },
                        React.createElement(Stop, { offset: '1', stopColor: gradientColorFrom }),
                        React.createElement(Stop, { offset: '0', stopColor: gradientColorTo })),
                    React.createElement(LinearGradient, { id: getGradientId(1), x1: '0', y1: '0', x2: '0', y2: '100%' },
                        React.createElement(Stop, { offset: '1', stopColor: gradientColorTo }),
                        React.createElement(Stop, { offset: '0', stopColor: gradientColorFrom }))),
                React.createElement(G, { transform: {
                        translate: `${strokeWidth / 2 + radius + 1}, ${strokeWidth / 2 + radius + 1}`,
                    } },
                    React.createElement(Circle, { r: radius, strokeWidth: strokeWidth - 12, fill: 'transparent', stroke: bgCircleColor }),
                    range(segments).map((i) => {
                        const { fromX, fromY, toX, toY } = calculateArcCircle(i, segments, radius, startAngle, angleLength);
                        const d = `M ${fromX.toFixed(2)} ${fromY.toFixed(2)} A ${radius} ${radius} 0 0 1 ${toX.toFixed(2)} ${toY.toFixed(2)}`;
                        return (React.createElement(Path, { d: d, key: i, strokeWidth: strokeWidth - 10, stroke: `url(#${getGradientId(i)})`, strokeLinecap: 'round', fill: 'transparent' }));
                    }),
                    React.createElement(G, { fill: gradientColorTo, transform: { translate: `${xy.toX}, ${xy.toY}` }, ..._iconPanResponder === null || _iconPanResponder === void 0 ? void 0 : _iconPanResponder.panHandlers, onPressIn: () => setAngleLength(angleLength + Math.PI / 2) },
                        React.createElement(Circle, { r: (strokeWidth - 1) / 2, fill: '#ffffff', stroke: iconOutSideColor, strokeWidth: '3' })))))));
};
export default NativeModules.RNCircularDraggableProgressBarModule;
//# sourceMappingURL=index.js.map