import {render} from '@testing-library/react';
import {screen} from '@testing-library/react';
import {CustomVisualArea} from './CustomVisualArea';
import React from 'react';
import '@testing-library/jest-dom';
import { waitFor } from "@testing-library/react";

describe('CustomVisualAreaTests', () => {
    const mockUser = {id:"jack", snapshots:["1", "2"], visuals:[1, 2]}
    const mockSaveSnap = jest.fn();
    test('Should render custom visual components', () => {
        render(<CustomVisualArea globalUser={mockUser} setSnapshot={mockSaveSnap}></CustomVisualArea>);
        waitFor(() => expect(screen.queryByTestId('snapshot-dropdown')).toBeInTheDocument());
    });
    // test('Should render custom visual components', () => {
    //     render(<CustomVisualArea></CustomVisualArea>);
    //     const elem = screen.queryByTestId('snapshot-dropdown');
    //     expect(elem).toBeInTheDocument();
    // });

    test('Should display the different types of visuals', () => {
        //render(<CustomVisualArea></CustomVisualArea>);
        render(<CustomVisualArea globalUser={mockUser}
            setSnapshot={mockSaveSnap}></CustomVisualArea>);
        const elem = screen.queryByTestId('vis-dropdown');
        waitFor(() => expect(elem).toBeInTheDocument());
    });

    test('Should display the different types of dimensions', () => {
        //render(<CustomVisualArea></CustomVisualArea>);
        render(<CustomVisualArea globalUser={mockUser}
            setSnapshot={mockSaveSnap}></CustomVisualArea>);
        const elem = screen.queryByTestId('dim-dropdown');
        waitFor(() => expect(elem).toBeInTheDocument());
    });

    test('Should display the different types of measures', () => {
        //render(<CustomVisualArea></CustomVisualArea>);
        render(<CustomVisualArea globalUser={mockUser}
            setSnapshot={mockSaveSnap}></CustomVisualArea>);
        const elem = screen.queryByTestId('measures-dropdown');
        waitFor(() => expect(elem).toBeInTheDocument());
    });

    test('Should display the custom visuals', () => {
        //render(<CustomVisualArea></CustomVisualArea>);
        render(<CustomVisualArea globalUser={mockUser}
            setSnapshot={mockSaveSnap}></CustomVisualArea>);
        const elem = screen.queryByTestId('custom-dropdown');
        waitFor(() => expect(elem).toBeInTheDocument());
    });

    test('Should display the snapshot visuals', () => {
        //render(<CustomVisualArea></CustomVisualArea>);
        render(<CustomVisualArea globalUser={mockUser}
            setSnapshot={mockSaveSnap}></CustomVisualArea>);
        const elem = screen.queryByTestId('snap-dropdown');
        waitFor(() => expect(elem).toBeInTheDocument());
    });

    test('User should be alerted that a custom visual has been saved', () => {
        //render(<CustomVisualArea></CustomVisualArea>);
        render(<CustomVisualArea globalUser={mockUser}
            setSnapshot={mockSaveSnap}></CustomVisualArea>);
        const elem = screen.queryByTestId('save-custom');
        waitFor(() => expect(elem).toBeInTheDocument());
    });

    test('Generation of custom visual should be initiated', () => {
        //render(<CustomVisualArea></CustomVisualArea>);
        render(<CustomVisualArea globalUser={mockUser}
            setSnapshot={mockSaveSnap}></CustomVisualArea>);
        const elem = screen.queryByTestId('gen-custom');
        waitFor(() => expect(elem).toBeInTheDocument());
    });

})