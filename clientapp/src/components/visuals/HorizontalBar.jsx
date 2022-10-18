import React from 'react';
import { BarGroupHorizontal, Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft } from '@visx/axis';
import { LegendOrdinal } from '@visx/legend';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';



export const green = '#000000';
export const background = '#612efb';
const defaultMargin = { top: 20, right: 20, bottom: 20, left: 100 };
const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
};

export default function HorizontalBar({
    width,
    height,
    margin = defaultMargin,
    events = false,
    data = null
}) {
    const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
        useTooltip();
    function max(arr, fn) {
        return Math.max(...arr.map(fn));
    }
    const keys = Object.keys(data[0]).filter((d) => d !== 'name');

    // accessors
    const getMilestone = (d) => d.name;

    // scales
    const dateScale = scaleBand({
        domain: data.map(getMilestone),
        padding: 0.2,
    });
    const cityScale = scaleBand({
        domain: keys,
        padding: 0.1,
    });
    const tempScale = scaleLinear({
        domain: [0, max(data, (d) => max(keys, (key) => Number(d[key])))],
    });
    const colorScale = scaleOrdinal({
        domain: keys,
        range: ["#A02525", "#7C1B1B", "#5A0F0F"],
    });

    let tooltipTimeout;

    // bounds
    const xMax = width - margin.left - margin.right - 200;
    const yMax = height - margin.top - margin.bottom;

    // update scale output dimensions
    dateScale.rangeRound([0, yMax]);
    cityScale.rangeRound([0, dateScale.bandwidth()]);
    tempScale.rangeRound([0, xMax]);

    return width < 10 ? null : (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    position: 'absolute',
                    top: margin.top / 2,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '14px',
                }}
            >
                <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" />
            </div>
            <svg width={width} height={height} style={{ border: '1px solid' }}>
                <Group top={margin.top} left={margin.left}>
                    <BarGroupHorizontal
                        data={data}
                        keys={keys}
                        width={xMax}
                        y0={getMilestone}
                        y0Scale={dateScale}
                        y1Scale={cityScale}
                        xScale={tempScale}
                        color={colorScale}
                    >
                        {(barGroups) =>
                            barGroups.map((barGroup) => (
                                <Group
                                    key={`bar-group-horizontal-${barGroup.index}-${barGroup.y0}`}
                                    top={barGroup.y0}
                                >
                                    {barGroup.bars.map((bar) => {
                                        return (
                                        <Bar
                                            key={`${barGroup.index}-${bar.index}-${bar.key}`}
                                            x={bar.x}
                                            y={bar.y}
                                            width={bar.width}
                                            height={bar.height}
                                            fill={bar.color}
                                            rx={4}
                                            onMouseLeave={() => {
                                                tooltipTimeout = window.setTimeout(() => {
                                                    hideTooltip();
                                                }, 300);
                                            }}
                                            onMouseMove={(event) => {
                                                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                                // TooltipInPortal expects coordinates to be relative to containerRef
                                                // localPoint returns coordinates relative to the nearest SVG, which
                                                // is what containerRef is set to in this example.
                                                const eventSvgCoords = localPoint(event);
                                                showTooltip({
                                                    tooltipData: bar,
                                                    tooltipTop: eventSvgCoords?.y,
                                                    tooltipLeft: eventSvgCoords?.x,
                                                });
                                            }}
                                        />
                                    )})}
                                </Group>
                            ))
                        }
                    </BarGroupHorizontal>
                    <AxisLeft
                        scale={dateScale}
                        stroke={green}
                        tickStroke={green}
                        hideAxisLine
                        tickLabelProps={() => ({
                            fill: green,
                            fontSize: 11,
                            textAnchor: 'end',
                            dy: '0.33em',
                        })}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: margin.top / 2 - 10,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '14px',
                        }}
                    >
                    </div>
                </Group>
            </svg>
            {tooltipOpen && tooltipData && (
                <TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                    <div style={{ color: colorScale(tooltipData.key) }}>
                        <strong>{tooltipData.key}</strong>
                    </div>
                    <div>{"Count: " + tooltipData.value}</div>
                </TooltipWithBounds>
            )}
        </div>
    );
}