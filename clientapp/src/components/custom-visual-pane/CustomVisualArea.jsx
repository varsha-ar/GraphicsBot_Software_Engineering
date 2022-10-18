import * as React from 'react';
import './CustomVisualArea.css';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class CustomVisualArea extends React.Component {
    visualOptions = [
        "Pie",
        "Bar"
    ];

    dimensionOptions = [
        "Issues",
        "Pull Requests"
    ];

    measureOptionsIssues = [
        "Issues per Milestone",
        "Issues per Label",
        "Issues per Status"
    ];

    measureOptionsPullRequests = [
        "Pull Requests per User",
        "Pull Requests per Milestone"
    ];


    constructor(props) {
        super(props);
        this.state = {
            yAxis: -1,
            xAxis: -1,
            visualization: -1,
            customVisual: "",
            snapshot: ""
        }
    }

    updateSelectedVisual = (event) => {
        this.setState({
            visualization: event
        });
    }

    updateDimensions = (event) => {
        this.setState({
            yAxis: event
        });
    }

    updateMeasures = (event) => {
        this.setState({
            xAxis: event
        });
    }

     updateCustoms = async (event) => {
        this.setState({
            customVisual: this.props.globalUser.visuals[event]
        });
        // Get file data
        const file_data = await fetch(`/visual?id=${this.props.globalUser.visuals[event]}`);
        const fData = await file_data.json();

        // call gen custom viz
        this.props.generateCustomVisual(fData.visual, fData.dimension, fData.measures)

    }

    updateSnapshots = async (event) => {
        this.setState({
            snapshot: this.props.globalUser.snapshots[event]
        });
        await this.props.setSnapshot(this.props.globalUser.snapshots[event]);
    }

    saveCustomData = async (event) => {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second:'numeric' };

        const cdata = {
            "id": (new Date()).toLocaleDateString('en-US', options),
            "dimension": parseInt(this.state.yAxis),
            "measures": parseInt(this.state.xAxis),
            "visual": parseInt(this.state.visualization)
        }
        await this.props.saveCustomVisual(cdata);
    }

    render() {
        return (
            <div>
                <div className='heading'>
                    Customization
                </div>

                <div className='py-5 px-4'>
                    <div className='dropdown-container'>
                        <div>Select Visualization</div>
                        <Dropdown as={ButtonGroup} className='w-100 dropdown-style' data-test-id="vis-dropdown" onSelect={(event) => { this.updateSelectedVisual(event) }}>
                            <div className='w-100 d-flex align-items-center p-2'>{this.state.visualization == -1 ? '' : this.visualOptions[this.state.visualization]}</div>
                            <Dropdown.Toggle split id="dropdown-custom-2" className='dropdown-toggle-style'></Dropdown.Toggle>
                            <Dropdown.Menu className="super-colors w-100">
                                {
                                    this.visualOptions.map((x, y) => <Dropdown.Item key={y} eventKey={y} active={this.state.visualization === y}>{x}</Dropdown.Item>)
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className='dropdown-container'>
                        <div>Dimensions</div>
                        <Dropdown as={ButtonGroup} className='w-100 dropdown-style' data-test-id="dim-dropdown" onSelect={(event) => { this.updateDimensions(event) }}>
                            <div className='w-100 d-flex align-items-center p-2'>{this.state.yAxis == -1 ? '' : this.dimensionOptions[this.state.yAxis]}</div>
                            <Dropdown.Toggle split id="dropdown-custom-2" className={`dropdown-toggle-style ${this.state.visualization === -1 ? 'disabled' : ''}`}></Dropdown.Toggle>
                            <Dropdown.Menu className="super-colors w-100">
                                {
                                    this.dimensionOptions.map((x, y) => <Dropdown.Item key={y} eventKey={y} active={this.state.yAxis === y}>{x}</Dropdown.Item>)
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className='dropdown-container'>
                        <div>Measures</div>
                        <Dropdown as={ButtonGroup} className='w-100 dropdown-style' data-test-id="measures-dropdown" onSelect={(event) => { this.updateMeasures(event) }}>
                            <div className='w-100 d-flex align-items-center p-2' >{this.state.xAxis == -1 ? '' : (this.state.yAxis == 0 ? this.measureOptionsIssues[this.state.xAxis] : this.measureOptionsPullRequests[this.state.xAxis])}</div>
                            <Dropdown.Toggle split id="dropdown-custom-2" className={`dropdown-toggle-style ${this.state.yAxis === -1 ? 'disabled' : ''}`}></Dropdown.Toggle>
                            <Dropdown.Menu className="super-colors w-100">
                                {
                                    this.state.yAxis == 0 ? (this.measureOptionsIssues.map((x, y) => <Dropdown.Item key={y} eventKey={y} active={this.state.xAxis === y}>{x}</Dropdown.Item>)) : (this.measureOptionsPullRequests.map((x, y) => <Dropdown.Item key={y} eventKey={y} active={this.state.xAxis === y}>{x}</Dropdown.Item>))
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className='dropdown-container'>
                        <div className='w-100 d-flex align-items-center justify-content-space-between' >
                            <button className='tab-style' data-test-id="gen-custom" disabled={this.state.xAxis === -1} onClick={() => { this.props.generateCustomVisual(this.state.visualization, this.state.yAxis, this.state.xAxis) }}>Generate Custom Visual</button>
                            <button className='tab-style' data-test-id="save-custom" disabled={this.state.xAxis === -1} onClick={async () => { await this.saveCustomData() }}>Save Custom Visual</button>
                        </div>
                    </div>

                    <div className='dropdown-container'>
                        <div>Load Custom Visual</div> 
                        <Dropdown as={ButtonGroup} className='w-100 dropdown-style' data-test-id="custom-dropdown" onSelect={(event) => { this.updateCustoms(event) }}>
                            <div className='w-100 d-flex align-items-center p-2'>{this.state.customVisual}</div>
                            <Dropdown.Toggle split id="dropdown-custom-2" className='dropdown-toggle-style'></Dropdown.Toggle>
                            <Dropdown.Menu className="super-colors w-100">
                                {
                                    this.props.globalUser.visuals.map((x, y) => <Dropdown.Item eventKey={y} key={y} active={this.state.customVisual === x}>{x}</Dropdown.Item>)
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className='dropdown-container'>
                        <div>Load Snapshots</div>
                        <Dropdown as={ButtonGroup} className='w-100 dropdown-style' data-test-id="snap-dropdown" onSelect={async (event) => { await this.updateSnapshots(event) }}>
                            <div className='w-100 d-flex align-items-center p-2'>{this.state.snapshot}</div>
                            <Dropdown.Toggle split id="dropdown-custom-2" className='dropdown-toggle-style'></Dropdown.Toggle>
                            <Dropdown.Menu className="super-colors w-100" id="snapdrop">
                                {
                                    this.props.globalUser.snapshots.map((x, y) => <Dropdown.Item eventKey={y} key={y} active={this.state.snapshot === x}>{x}</Dropdown.Item>)
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>);
    };
}