import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import PieChart from './PieChart';

describe('PieChart tests', () => {
    test('Should render the pie chart', () => {
        const pieChartData = [
            { 
                contributor: 'Neil',
                issues: 55
            },
            { 
                contributor: 'Varsha',
                issues: 22
            }];
        render(<PieChart data={pieChartData} width={200} height={200}></PieChart>)
        expect(screen.queryAllByText('Neil')).not.toBeNull();
    });
})