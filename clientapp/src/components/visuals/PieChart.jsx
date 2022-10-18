import React from 'react';
import Pie from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Text } from '@visx/text';
import { Group } from '@visx/group';
import { GradientPinkBlue } from '@visx/gradient';
import { LegendOrdinal } from '@visx/legend';


const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export default function PieChart({
    width,
    height,
    margin = defaultMargin,
    data = null
}) {
    if (width < 10) return null;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const centerY = innerHeight / 2;
    const centerX = innerWidth / 2;

    // accessor functions
    const frequency = (d) => d.issues;
    const color = (d) => { return getLetterFrequencyColor(d.data.contributor) };

    // color scales
    let getLetterFrequencyColor;
    if (data) {
        getLetterFrequencyColor = scaleOrdinal({
            domain: data.map((l) => l.contributor),
            range: ['#5A0F0F', '#991a1a', '#da2525', '#e56666', '#f0a8a8', '#fbe9e9'],
        });

        return (
            <div style={{ position: 'relative' }}>
                <svg style={{ border: '1px solid' }} width={width} height={height}>
                    <GradientPinkBlue id="visx-pie-gradient" />
                    <Group top={centerY + margin.top + 20} left={centerX + margin.left}>
                        <Pie
                            data={data}
                            pieValue={frequency}
                            pieSortValues={() => -1}
                            outerRadius={radius}
                            fill={color}
                            centroid={(d, a) => {
                                return (<Text fill='#FFFFFF' x={d[0]} y={d[1]}>{a.data.issues}</Text>)
                            }}
                        >
                        </Pie>
                    </Group>
                </svg>
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
                    <LegendOrdinal scale={getLetterFrequencyColor} direction="row" labelMargin="0 15px 0 0" />
                </div>
            </div>
        );
    }
    else {
        return (<></>)
    }
}