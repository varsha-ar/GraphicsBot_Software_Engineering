import { render, screen } from "@testing-library/react";
import { VisualArea } from "../visual-area/VisualArea";
import userEvent from '@testing-library/user-event';
import React  from 'react';
import '@testing-library/jest-dom'
import { waitFor } from "@testing-library/react";

describe('visual Area Test1', ()=> {
    const mockRepositories = [{name: 'asdasd', owner: 'asdasd'}, { name: 'zxczxc', owner: 'zxczxcxz' }]
    const mockSaveSnap = jest.fn();
    const mockcurrentVisual =["1", "2","3", "4" ]
    const mockVizData = [
        { 
            contributor: 'Neil',
            issues: 55
        },
        { 
            contributor: 'Varsha',
            issues: 22
        },
        { 
            contributor: 'Nishitha',
            issues: 11
        },
        { 
            contributor: 'Anisha',
            issues: 91
        },
    ]
    const mockUpdateCanvas = jest.fn();
    const mockSwitchRepo = jest.fn();
    test('clicking the git Issues tab should display the pie chart ', ()=>{
        //render(<VisualArea></VisualArea>)
        render(<VisualArea selectedRepository={mockRepositories[0]} switchRepo={mockSwitchRepo} repositories={mockRepositories} saveSnapshot={mockSaveSnap} vizData={mockVizData} updateCanvas={mockUpdateCanvas} currentVisual={mockcurrentVisual}></VisualArea>)
        expect(screen.queryByTestId('PieChart-bar')).toBeInTheDocument();
        userEvent.click(screen.queryByTestId('issues-button'))
        expect(screen.queryByTestId('PieChart-bar')).toBeInTheDocument();
    })

});

describe('visual Area Test2', ()=> {
    const mockRepositories = [{name: 'asdasd', owner: 'asdasd'}, { name: 'zxczxc', owner: 'zxczxcxz' }]
    const mockSaveSnap = jest.fn();
    const mockcurrentVisual =["1", "2","3", "4" ]
    const mockVizData =  [
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
        },
        {
            name: "Milestone 3",
            totalBugs: 19,
            bugsOpen: 1,
            bugsClosed: 10
        },
        {
            name: "Milestone 4",
            totalBugs: 15,
            bugsOpen: 7,
            bugsClosed: 8
        }
    ]
    const mockUpdateCanvas = jest.fn();
    const mockSwitchRepo = jest.fn();
    test('clicking the Project Bugs tab should display the horizontal chart ', ()=>{
        render(<VisualArea selectedRepository={mockRepositories[0]} switchRepo={mockSwitchRepo} repositories={mockRepositories} saveSnapshot={mockSaveSnap} vizData={mockVizData} updateCanvas={mockUpdateCanvas} currentVisual={mockcurrentVisual}></VisualArea>)
        expect(screen.queryByTestId('horizontal-bar')).not.toBeInTheDocument();
        userEvent.click(screen.queryByTestId('bugs-button'))
        waitFor(() => expect(screen.queryByTestId('horizontal-bar')).toBeInTheDocument());
    })
});

describe('visual Area Test3', ()=> {
    const mockRepositories = [{name: 'asdasd', owner: 'asdasd'}, { name: 'zxczxc', owner: 'zxczxcxz' }]
    const mockSaveSnap = jest.fn();
    const mockcurrentVisual =["1", "2","3", "4" ]
    const mockVizData = [
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
        },
        {
            name: "Milestone 4",
            documentation: 4,
            development: 2,
            bug: 9,
            design: 7,
            testing: 6
        },
        {
            name: "Milestone 5",
            documentation: 4,
            development: 2,
            bug: 9,
            design: 7,
            testing: 6
        },
        {
            name: "Milestone 6",
            documentation: 4,
            development: 2,
            bug: 9,
            design: 7,
            testing: 6
        },
        {
            name: "Milestone 7",
            documentation: 4,
            development: 2,
            bug: 9,
            design: 7,
            testing: 6
        }
    ]
    const mockUpdateCanvas = jest.fn();
    const mockSwitchRepo = jest.fn();
    test('clicking the commits tab should display the stack chart ', ()=>{
        //render(<VisualArea></VisualArea>)
        render(<VisualArea selectedRepository={mockRepositories[0]} switchRepo={mockSwitchRepo} repositories={mockRepositories} saveSnapshot={mockSaveSnap} vizData={mockVizData} updateCanvas={mockUpdateCanvas} currentVisual={mockcurrentVisual}></VisualArea>)
        expect(screen.queryByTestId('Stacked-bar')).not.toBeInTheDocument();
        userEvent.click(screen.queryByTestId('issues-button'))
        waitFor(() => expect(screen.queryByTestId('Stacked-bar')).toBeInTheDocument());
    })

});

describe('visual Area Test4', ()=> {
    const mockRepositories = [{name: 'asdasd', owner: 'asdasd'}, { name: 'zxczxc', owner: 'zxczxcxz' }]
    const mockSaveSnap = jest.fn();
    const mockcurrentVisual =["1", "2","3", "4" ]
    const mockVizData =  [
        {
            contributor: "sam",
				week: 2,
				additions: 2,
				deletions: 2,
				commits: 4
        },
        {
            contributor: "dsfjk",
            week: 4,
            additions: 2,
            deletions: 2,
            commits: 4
        }
    ]
    const mockUpdateCanvas = jest.fn();
    const mockSwitchRepo = jest.fn();
    test('clicking the project activities tab should display the user card ', ()=>{
        render(<VisualArea selectedRepository={mockRepositories[0]} switchRepo={mockSwitchRepo} repositories={mockRepositories} saveSnapshot={mockSaveSnap} vizData={mockVizData} updateCanvas={mockUpdateCanvas} currentVisual={mockcurrentVisual}></VisualArea>)
        expect(screen.queryByTestId('User-Activity')).not.toBeInTheDocument();
        userEvent.click(screen.queryByTestId('Activities-button'))
        waitFor(() => expect(screen.queryByTestId('User-Activity')).toBeInTheDocument());

    })

});

