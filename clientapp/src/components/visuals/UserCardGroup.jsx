import React from "react";
import "../common/UserCard.css";
import octocat from '../../assets/Octocat.png'
import { Card } from "react-bootstrap";

export class UserCardGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.data.map((card, i) => (
                    <Card key={i} className="container2">
                        <div >
                            <div className="d-flex flex-row align-items-center">
                                <div><img src={octocat} alt="Logo" className='logo' /></div>
                                <div className="icon"> <i className="bx bxl-mailchimp"></i> </div>
                                <div className="ms-2 c-details">
                                    <h6 className="bold fs-3">{card.contributor}</h6>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="d-flex justify-content-between">
                            <div className="text_study">No Of Weeks worked</div>
                            <div className="text_study2">{card.week}</div>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <div className="text_study">Total Number Of Commits</div>
                            <div className="text_study2">{card.commits}</div>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <div className="text_study">Total Number Of Lines Added </div>
                            <div className="text_study2">{card.additions}</div>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <div className="text_study">Total Number Of Lines Deleted </div>
                            <div className="text_study2">{card.deletions}</div>
                        </div>
                    </Card>
                ))}

            </div>
        )
    }
}