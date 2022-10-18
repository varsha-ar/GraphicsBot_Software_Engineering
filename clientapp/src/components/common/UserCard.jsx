import React from "react";
import { Card } from "react-bootstrap";
import octocat from '../../assets/Octocat.png'
import "./UserCard.css";

export class UserCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contributor: '',
			week: 0,
			additions: 0,
			deletions: 0,
			commits: 0, 
          
        }
    }

    render() {
        return (
            <Card className="py-4 justify-content-center flex-height'" style="height: 50px;">

                <div className="d-flex justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                    <div><img src={octocat} alt="Logo" className='logo'/></div>
                        <div className="icon"> <i className="bx bxl-mailchimp"></i> </div>
                        <div className="ms-2 c-details" id="username">
                            <h6 className="bold fs-3">{this.state.contributor}</h6>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="d-flex flex-row justify-content-between">
                    <div className = "fw-normal fs-4 bold">No Of Weeks worked</div>
                    <div className="fw-normal fs-4 bold">{this.state.week}</div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <div className="fw-normal fs-4 bold">Total Number Of Commits</div>
                    <div className="fw-normal fs-4 bold">{this.state.commits}</div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <div className="fw-normal fs-4 bold">Total Number Of Lines Added </div>
                    <div className="fw-normal fs-4 bold">{this.state.additions}</div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <div className="fw-normal fs-4 bold">Total Number Of Lines Deleted </div>
                    <div className="fw-normal fs-4 bold">{this.state.deletions}</div>
                </div>
            </Card>





            
        )
    }
}