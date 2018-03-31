import * as React from "React";
import * as uuid from "uuid";
import { Constants } from "./shared/Constants";

import "../styles/Shared.less";
import { GradeSelector } from "./shared/GradeSelector";


export interface CreateStudentProperties {

}

export interface CreateStudentState {
    studentName: string;
    studentGrade: string;
    postResult: string;
}

export class CreateStudent extends React.Component<CreateStudentProperties, CreateStudentState> {
    constructor(props: any) {
        super(props);

        this.state = {
            studentName: "",
            studentGrade: "K",
            postResult: null,
        };

        this.onGradeChanged = this.onGradeChanged.bind(this);
    }

    /**
     * TODO: Cleanup the styles... after refactor I broke where all these belong
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="create-student-container">
            <h2 className="unselectable"> Create a new Student! </h2>
            <div className="student-name-input">
                <span className="student-name-input-title">Student Name: </span>
                <span className="student-name-input-text"><input type="text" placeholder="New Student Name" value={this.state.studentName}
                    onChange={this.onStudentNameInputChanged.bind(this)} /></span>
            </div>
            <div className="student-grade-input">
                <span className="student-grade-input-title">Student Grade: </span>
                <span className="student-grade-input-text">
                    <GradeSelector onStudentGradeChanged={this.onGradeChanged} studentGrade={this.state.studentGrade} />
                </span>
            </div>
            <button onClick={this.onSubmitNewStudent.bind(this)}>Submit</button>
            {this.renderPostResult()}</div>;
    }

    /**
     * @returns {}
     */
    private renderPostResult(): JSX.Element {
        if (!this.state.postResult) {
            return null;
        }

        return <div className="create-student-post-result">
            <span>{this.state.postResult}</span>
        </div>;
    }

    private onGradeChanged(studentGrade: string): void {
        this.setState({studentGrade});
    }

    /**
     * not safe to directly access this.state here... changes to state may be pending....
     * TODO: check into how to do this properly?
     */
    private onSubmitNewStudent() {
        this.setState({}, () => {
            const newStudentId = uuid().toString();
            const networkStudentObject: Object = {
                Name: this.state.studentName,
                Grade: this.state.studentGrade,
                Id: newStudentId,
                ProfilePicture: "",
            };

            fetch(Constants.BackendUri + "student", {
                body: JSON.stringify(networkStudentObject),
                headers: {
                    "content-type": "application/json"
                },
                method: "POST",
            }).then((response) => {
                this.setState({ postResult: `Finished: ${response.status.toString()} : ${response.statusText} : ${newStudentId}` });
            }).catch((err) => {
                this.setState({ postResult: `Post Error: ${err}` });
            });
        });
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onStudentNameInputChanged(event: any): void {
        if (!event || !event.target || !event.target.value ||
            typeof event.target.value !== "string") {
            throw "Input type unexpected!";
        }
        this.setState({ studentName: event.target.value });
    }
};