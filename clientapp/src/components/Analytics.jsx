import React, { Component } from 'react';
import { Header } from '../components/header/header'
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from 'react-bootstrap';
import { VisualArea } from '../components/visual-area/VisualArea';
import { CustomVisualArea } from '../components/custom-visual-pane/CustomVisualArea';
import axios from 'axios';


class Analytics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      barData: null,
      pieData: null,
      stackData: null,
      userData: null,
      snapData: null,
      repositoryData: [],
      selectedRepository: {},
      globalUser: {
        visuals: [],
        id: "",
        snapshots: []
      },
    }
  }

  async componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const code = urlParams.get('code')
    const globalUserResponse = await fetch(`/oauth/token?code=${code}`);
    const globalUser = await globalUserResponse.json();
    const repoResponse = await fetch('/data/repos');
    const repos = await repoResponse.json();
    const pieDataResponse = await fetch(`/data/contributor-issues?repo=${repos[0].name}&owner=${repos[0].owner}`);


    const pieData = await pieDataResponse.json();

    document.title = 'Janet';

    this.setState({
      vizData: pieData,
      currentVisual: 1,
      repositoryData: repos,
      selectedRepository: repos[0],
      globalUser: globalUser
    });
  }


  async saveSnapshot(data) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const snapData = {
      id: (new Date()).toLocaleDateString('en-US', options),
      visual: data.visual,
      data: data.data
    }

    const config = {
      headers: {
        'Content-Type': 'application/JSON'
      }
    };

    const updatedData = await axios.post('/snapshot', JSON.stringify(snapData), config);
    this.setState({ globalUser: updatedData });
  }

  saveCustomVisual = async (data) => {

    const config = {
      headers: {
        'Content-Type': 'application/JSON'
      }
    };

    const uCData = await axios.post('/visual', JSON.stringify(data), config);
    this.setState({ globalUser: uCData.data });
  }

  async loadSnapshot(id) {
    const data = await axios.get(`/snapshot?id=${id}`);
    return data;
  }

  switchRepo = async (repoName) => {
    this.setState({
      selectedRepository: this.state.repositoryData[repoName]
    });
    await this.updateCanvas(this.state.currentVisual, this.state.repositoryData[repoName]);
  }

  setSnapshot = async (snapshotId) => {
    const snapshotResponse = await fetch(`snapshot?id=${snapshotId}`);
    const snapshotData = await snapshotResponse.json();
    await this.updateCanvas(snapshotData.visual, { random: "random" }, snapshotData.data);
  }

  updateCanvas = async (visualType, repo, snapshotData) => {
    let data;
    if (!snapshotData)
      switch (visualType) {
        case 2:
          const horizontalBarDataResponse = await fetch(`/data/milestone-issues?repo=${repo.name}&owner=${repo.owner}`);
          const horizontalBarData = await horizontalBarDataResponse.json();
          data = horizontalBarData;
          break;
        case 3:
          const stackedBarDataResponse = await fetch(`/data/tasks?repo=${repo.name}&owner=${repo.owner}`);
          const stackedBarData = await stackedBarDataResponse.json();
          data = stackedBarData
          break;
        case 4:
          const userDataResponse = await fetch(`/data/contributor-activity?repo=${repo.name}&owner=${repo.owner}`);
          const userData = await userDataResponse.json();
          data = userData
          break;
        default:
          const pieDataResponse = await fetch(`/data/contributor-issues?repo=${repo.name}&owner=${repo.owner}`);
          const pieData = await pieDataResponse.json();
          data = pieData
          break;
      }
    else
      data = snapshotData;
    this.setState({
      currentVisual: visualType,
      vizData: data
    });
  }

  generateCustomVisual = async (visualType, dimension, measure) => {
    const customVisualDataresponse = await fetch(`/data/custom-visual?visual=${parseInt(visualType) + 1}&dimension=${parseInt(dimension) + 1}&measure=${parseInt(measure) + 1}&repo=${this.state.selectedRepository.name}&owner=${this.state.selectedRepository.owner}`);
    const customVisualData = await customVisualDataresponse.json();
    await this.updateCanvas(visualType == 1 ? 3 : 1, this.state.selectedRepository.name, customVisualData);
  }

  render() {
    return (
      <div >
        <Header></Header>
        <Container fluid className='flex-height'>
          <Row className='h-100'>
            <Col sm={3} className='px-0 custom-visual-container'>
              <CustomVisualArea saveCustomVisual={this.saveCustomVisual} generateCustomVisual={this.generateCustomVisual} globalUser={this.state.globalUser} setSnapshot={this.setSnapshot}></CustomVisualArea>
            </Col>
            <Col md={9}>
              <VisualArea switchRepo={this.switchRepo} selectedRepository={this.state.selectedRepository} repositories={this.state.repositoryData} saveSnapshot={this.saveSnapshot} vizData={this.state.vizData} updateCanvas={this.updateCanvas} currentVisual={this.state.currentVisual}></VisualArea>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Analytics;