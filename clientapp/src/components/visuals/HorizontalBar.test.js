import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import HorizontalBarData from './HorizontalBar';

describe('Horizontal bar tests', () => {
    const horizontalBarData = [
        {
            name: "Milestone 1",
            totalBugs: 7,
            bugsOpen: 5,
            bugsClosed: 2
        },
        {
            name: "Milestone 2",
            totalBugs: 9,
            bugsOpen: 3,
            bugsClosed: 6
        },];
    test('Should render', () => {
        const pieChartData = [
            { 
                contributor: 'Neil',
                issues: 55
            },
            { 
                contributor: 'Varsha',
                issues: 22
            }];
        render(<HorizontalBarData data={horizontalBarData} width={200} height={200}></HorizontalBarData>)
        expect(screen.queryAllByText('Neil')).not.toBeNull();
    });
})