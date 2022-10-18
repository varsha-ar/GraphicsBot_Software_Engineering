import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HorizontalBar from '../visuals/HorizontalBar';
import PieChart from '../visuals/PieChart';
import StackedBar from '../visuals/StackedBar';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { UserCardGroup } from '../visuals/UserCardGroup'
import './VisualArea.css';
import { ButtonGroup, Dropdown } from 'react-bootstrap';

export class VisualArea extends React.Component {
    constructor(props) {
        super(props);
        this.currentData = this.props.data;
        this.state = {
            currentVisual: 1,
            repositories: [],
            timeFrame: "",
        }
    }


    // timeOptions = [
    //     "Jan - Mar",
    //     "April - July"
    // ];

    switchVisual(val) {
        this.props.updateCanvas(val, this.props.selectedRepository);
    }

    updateRepo = (event) => {
        this.props.switchRepo(event);
    }

    updateTime = (event) => {
        this.setState({
            timeFrame: this.timeOptions[event]
        });

    }

    async saveSnapshot() {
        const data = {
            visual: this.props.currentVisual,
            data: this.props.vizData
        }
        await this.props.saveSnapshot(data);
        alert("Snapshot Saved!");
    }

    //     getDefaultOptions(endpoint, method){
    // 	var options = {
    // 		url: urlRoot + endpoint,
    // 		method: method,
    // 		headers: {
    // 			"User-Agent": "CSC510-REST-WORKSHOP",
    // 			"content-type": "application/json",
    // 			"Authorization": `token ${config.token}`
    // 		}
    // 	};
    // 	return options;
    // }



    render() {

        return (
            <Container className='py-4 justify-content-center flex-height h-100'>
                <Row className='mb-4'>
                    <Row className='mb-4 justify-content-space-between'>
                        <Col>
                            <div>Select Repository</div>
                            <Dropdown as={ButtonGroup} className='w-100 dropdown-style' onSelect={(event) => { this.updateRepo(event) }}>
                                <div className='w-100 d-flex align-items-center p-2'>{this.props.selectedRepository?.name}</div>
                                <Dropdown.Toggle split id="dropdown-custom-1" className='dropdown-toggle-style'></Dropdown.Toggle>
                                <Dropdown.Menu className="super-colors w-100" >
                                    {
                                        this.props.repositories.map((x, y) => <Dropdown.Item eventKey={y} key={y} active={this.props.selectedRepository.name === x.name && this.props.selectedRepository.owner === x.owner}>{x.name}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        {/* <Col>
                            <div>Select Time Frame</div>
                            <Dropdown as={ButtonGroup} className='w-100 dropdown-style' onSelect={(event) => { this.updateTime(event) }}>
                                <div className='w-100 d-flex align-items-center p-2'>{this.state.timeFrame}</div>
                                <Dropdown.Toggle split id="dropdown-custom-components" className='dropdown-toggle-style'></Dropdown.Toggle>
                                <Dropdown.Menu className="super-colors w-100">
                                    {
                                        this.timeOptions.map((x, y) => <Dropdown.Item eventKey={y} key={y} active={this.state.timeFrame === x}>{x}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col> */}
                        <Col>
                            <button className='snap-style' onClick={async () => { await this.saveSnapshot();}}>SNAPSHOT</button>
                        </Col>

                    </Row>

                </Row>
                <Row className='mb-4 justify-content-space-between'>
                    <Col>
                        <button className='tab-style' data-testid='issues-button' onClick={() => { this.switchVisual(1) }}>Git Issues</button>
                    </Col>
                    <Col>
                        <button className='tab-style' data-testid='bugs-button' onClick={() => { this.switchVisual(2) }}>Project Bugs</button>
                    </Col>
                    <Col>
                        <button className='tab-style' data-testid='Commits-button' onClick={() => { this.switchVisual(3) }}>Tasks</button>
                    </Col>
                    <Col>
                        <button className='tab-style' data-testid='Activities-button' onClick={() => { this.switchVisual(4) }}>User Contributions</button>
                    </Col>
                </Row>
                <ParentSize className="graph-container" debounceTime={10}>
                    {({ width: visWidth, height: visHeight }) => {
                        switch (this.props.currentVisual) {
                            case 2:
                                return this.props.vizData && this.props.vizData.length > 0 ? (<div data-testid='horizontal-bar'><HorizontalBar width={visWidth} height={visHeight} data={this.props.vizData}></HorizontalBar></div>) : <div style={{ textAlign: 'center' }}>No data available</div>
                            case 3:
                                return this.props.vizData && this.props.vizData.length > 0 ? (<div data-testid='Stacked-bar'><StackedBar width={visWidth} height={visHeight} data={this.props.vizData}></StackedBar></div>) : <div style={{ textAlign: 'center' }}>No data available</div>
                            case 4:
                                return this.props.vizData && this.props.vizData.length > 0 ? (<div data-testid='User-Activity'>
                                    <Row className='mb-4'> <UserCardGroup width={visWidth} height={visHeight} data={this.props.vizData}></UserCardGroup></Row></div>) : <div style={{ textAlign: 'center' }}>No data available</div>
                            default:
                                return this.props.vizData && this.props.vizData.length > 0 ? (<div data-testid='PieChart-bar'><PieChart width={visWidth} height={visHeight} data={this.props.vizData}></PieChart></div>) : <div style={{ textAlign: 'center' }}>No data available</div>
                        }
                    }}
                </ParentSize>
            </Container>);
    }
}