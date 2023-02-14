
const getChildrenOfNodeOnSameLayer = (course, nodePositionID) => {
    let children = []
    for(let i = 0; i < course?.nodes.length; i++) {
      if(course.nodes[i].parent[course.nodes[i].parent.length - 1] === nodePositionID) {
        children.push(course.nodes[i]);
      }
    }
    return children;
}

const getCourseMastery = (course, node, students) => {
    let mastery = 0
    for(let i = 0; i < students.length; i++) {
        mastery += getMasteryOfStudent(course, node, students[i].id)
    }

    return Math.round((mastery/(students.length * 100))* 100)
}

const getChildrenOfNode = (course, nodePositionID) => {
    let children = []
    for(let i = 0; i < course?.nodes.length; i++) {
      if(course.nodes[i].parent.indexOf(nodePositionID) != -1) {
        children.push(course.nodes[i]);
      }
    }
    return children;
}

const getMasteryOfStudent = (course, currentNode, userID) => {

    // TODO: will be O(n^2) - future update try to make this faster
    // This computes current nodes progress
    let numOfAssignment = currentNode?.assignments?.length;
    let children = getChildrenOfNode(course, currentNode?.positionID);
    let totalScore = 0;

    if(numOfAssignment == 0 && children.length === 0) {
        return 0;
    }

    for(let i = 0; i < numOfAssignment; i++){
        let assignment = currentNode.assignments[i];
        for(let j = 0; j < assignment.studentScores?.length; j++)
        {
            if(assignment.studentScores[j].studentID === userID)
            {
            totalScore += (assignment?.studentScores[j].studentScore);
            }
        }
    }
    
    let filteredAssignments = []
    for(let i = 0; i < children?.length; i++){
    if(children[i].assignments?.length !== 0)
        {
            for(let j = 0; j < children[i].assignments?.length; j++)
            filteredAssignments.push(children[i].assignments[j]);
        }
    }

    numOfAssignment += filteredAssignments?.length;
    for(let i = 0; i < filteredAssignments?.length; i++){
    let assignment = filteredAssignments[i];
    for(let j = 0; j < assignment.studentScores?.length; j++)
    {
        if(assignment.studentScores[j].studentID === userID)
        {
        totalScore += (assignment?.studentScores[j].studentScore);
        }
    }
    }

    let currNodeMastery = Math.round(((totalScore/100)/numOfAssignment)*100);
    return currNodeMastery
}

const getMasteryOfStudentGraphNode = (course, currentNode, userID) => {

    // TODO: will be O(n^2) - future update try to make this faster
    // This computes current nodes progress
    let numOfAssignment = currentNode?.data.assignments?.length;
    let totalScore = 0;

    if(numOfAssignment == 0) {
        return 0;
    }

    for(let i = 0; i < numOfAssignment; i++){
        let assignment = currentNode.data.assignments[i];
        for(let j = 0; j < assignment.studentScores?.length; j++)
        {
            if(assignment.studentScores[j].studentID === userID)
            {
            totalScore += (assignment?.studentScores[j].studentScore);
            }
        }
    }
    
    let children = getChildrenOfNode(course, currentNode.data.id);
    let filteredAssignments = []
    for(let i = 0; i < children?.length; i++){
    if(children[i].assignments?.length !== 0)
    {
        for(let j = 0; j < children[i].assignments?.length; j++)
        filteredAssignments.push(children[i].assignments[j]);
    }
    }

    numOfAssignment += filteredAssignments?.length;
    for(let i = 0; i < filteredAssignments?.length; i++){
    let assignment = filteredAssignments[i];
    for(let j = 0; j < assignment.studentScores?.length; j++)
    {
        if(assignment.studentScores[j].studentID === userID)
        {
        totalScore += (assignment?.studentScores[j].studentScore);
        }
    }
    }

    let currNodeMastery = Math.round(((totalScore/100)/numOfAssignment)*100);
    return currNodeMastery
}

export  { 
    getMasteryOfStudent, 
    getMasteryOfStudentGraphNode, 
    getChildrenOfNode, 
    getChildrenOfNodeOnSameLayer, 
    getCourseMastery 
};