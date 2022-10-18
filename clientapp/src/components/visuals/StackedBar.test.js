import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import StackedBar from './StackedBar';

describe('Horizontal bar tests', () => {
    const stackedBarData = [
        {
            name: "Milestone 1",
            documentation: 2,
            development: 3,
            bug: 9,
            design: 2,
            testing: 3
        },
        {
            name: "Milestone 2",
            documentation: 2,
            development: 10,
            bug: 9,
            design: 3,
            testing: 6
        },
        {
            name: "Milestone 3",
            documentation: 1,
            development: 8,
            bug: 9,
            design: 3,
            testing: 5
        }];
    test('Should render', () => {
        render(<StackedBar data={stackedBarData} width={200} height={200}></StackedBar>)
        expect(screen.queryAllByText('Milestone 1')).not.toBeNull();
    });
})