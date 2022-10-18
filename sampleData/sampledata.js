const horizontalBarData = [
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

const stackedBarData = [
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

const pieChartData = [
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

const userData = [
    {
        contributor: 'Neil',
        tasksCompleted: 18,
        tasksPending: 0,
        prCompleted: 6,
        prReviewed: 4
    },
    {
        contributor: 'Varsha',
        tasksCompleted: 19,
        tasksPending: 8,
        prCompleted: 7,
        prReviewed: 3
    },
    {
        contributor: 'Nishitha',
        tasksCompleted: 9,
        tasksPending: 4,
        prCompleted: 6,
        prReviewed: 8
    },
    {
        contributor: 'Anisha',
        tasksCompleted: 5,
        tasksPending: 9,
        prCompleted: 6,
        prReviewed: 3
    }
]

exports.horizontalBarData = horizontalBarData;
exports.pieChartData = pieChartData;
exports.stackedBarData = stackedBarData;
exports.userData = userData;