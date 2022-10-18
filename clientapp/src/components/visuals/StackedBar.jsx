import React from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { LegendOrdinal } from '@visx/legend';
import { localPoint } from '@visx/event';


const red1 = '#5A0F0F';
const red2 = '#991a1a';
const red3 = '#da2525';
const red4 = '#e56666';
const red5 = '#f0a8a8';
const red6 = '#fbe9e9';

const background = '#FFFFFF';
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
};

export default function StackedBar({
    width,
    height,
    events = false,
    margin = defaultMargin,
    data = null
}) {
    const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
        useTooltip();
    const keys = Object.keys(data[0]).filter((d) => d !== 'name');

    const temperatureTotals = data.reduce((allTotals, currentDate) => {
        const totalTemperature = keys.reduce((dailyTotal, k) => {
            dailyTotal += Number(currentDate[k]);
            return dailyTotal;
        }, 0);
        allTotals.push(totalTemperature);
        return allTotals;
    }, []);

    const parseDate = timeParse('%Y-%m-%d');
    const format = timeFormat('%b %d');
    const formatDate = (date) => format(parseDate(date));

    // accessors
    const getDate = (d) => d.name;

    // scales
    const dateScale = scaleBand({
        domain: data.map(getDate),
        padding: 0.2,
    });
    const temperatureScale = scaleLinear({
        domain: [0, Math.max(...temperatureTotals)],
        nice: true,
    });
    const colorScale = scaleOrdinal({
        domain: keys,
        range: [red1, red2, red3, red4, red5, red6],
    });

    let tooltipTimeout;

    if (width < 10) return null;
    // bounds
    const xMax = width;
    const yMax = height - margin.top - 100;

    dateScale.rangeRound([0, xMax]);
    temperatureScale.range([yMax, 0]);

    return width < 10 ? null : (
        <div style={{ position: 'relative' }}>
            <svg style={{ border: '1px solid' }} width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
                <Group top={margin.top}>
                    <BarStack
                        data={data}
                        keys={keys}
                        x={getDate}
                        xScale={dateScale}
                        yScale={temperatureScale}
                        color={colorScale}
                    >
                        {(barStacks) =>
                            barStacks.map((barStack) =>
                                barStack.bars.map((bar) => (
                                    <rect
                                        key={`bar-stack-${barStack.index}-${bar.index}`}
                                        x={bar.x}
                                        y={bar.y}
                                        height={bar.height}
                                        width={bar.width}
                                        fill={bar.color}
                                        onClick={() => {
                                            if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                                        }}
                                        onMouseLeave={() => {
                                            tooltipTimeout = window.setTimeout(() => {
                                                hideTooltip();
                                            }, 300);
                                        }}
                                        onMouseMove={(event) => {
                                            if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                            const eventSvgCoords = localPoint(event);
                                            const left = bar.x + bar.width / 2;
                                            showTooltip({
                                                tooltipData: bar,
                                                tooltipTop: eventSvgCoords?.y,
                                                tooltipLeft: left,
                                            });
                                        }}
                                    />
                                )),
                            )
                        }
                    </BarStack>
                </Group>
                <AxisBottom
                    top={yMax + margin.top}
                    scale={dateScale}
                    stroke={red3}
                    tickStroke={red3}
                    tickLabelProps={() => ({
                        fill: red3,
                        fontSize: 11,
                        textAnchor: 'middle',
                    })}
                />
            </svg>
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
                <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" />
            </div>

            {tooltipOpen && tooltipData && (
                <TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                    <div style={{ color: colorScale(tooltipData.key) }}>
                        <strong>{tooltipData.key}</strong>
                    </div>
                    <div>{tooltipData.bar.data[tooltipData.key]}</div>
                </TooltipWithBounds>
            )}
        </div>
    );
}