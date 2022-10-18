import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from '@testing-library/user-event';
import React  from 'react';
import '@testing-library/jest-dom'
import { waitFor } from "@testing-library/react";
window.open = jest.fn();
import { stackedBarData , horizontalBarData, pieChartData, userData} from "../../sampleData/sampledata";




global.fetch = jest.fn((path) => Promise.resolve({
    json: () => {switch (path) {
        case '/data/bugs':
            return horizontalBarData;
            break;
        case '/data/issues':
            return stackedBarData;
            break;

        case '/data/users':
            return userData;
            break;

        case '/data/contributor-issues':
            return pieDataResponse;
            break;
    
        default:
            break;
    }}
}));

describe('App tests', () => {
    test.only('Render test', () => {
        render(<App></App>)
        expect(true);
    })
});