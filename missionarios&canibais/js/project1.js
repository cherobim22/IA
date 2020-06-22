//this is just stuff to mess with the HTML. 
$(document).ready(function($){
    "use strict"; 

    //if value of misisonaries select box is changed
    $("#missionaries").change(function(){
         var string = "<img src='img/missionary.jpg' class='img-rounded' width='75'><br><img src='img/missionary.jpg' class='img-rounded' width='75'>";
        for (var i = 3; i <= $("#missionaries").val(); i++) {
            string += "<br><img src='img/missionary.jpg' class='img-rounded' width='75'>"
        };
        $("#missionaries1").html(string)
    });


    //if value of cannibals select box is changed
    $("#cannibals").change(function(){
         var string = ""
        for (var i = 1; i <= $("#cannibals").val(); i++) {
            string += "<img src='img/cannibal.jpg' class='img-rounded' width='75'><br>"
        };
        if ($("#cannibals").val() == 0){
            string = ""
        }; 
        $("#cannibals1").html(string)
    });

    //if value of boat select box is changed
    $("#boat").change(function(){
         var string = "<img src='img/boat" + $("#boat").val() + ".jpg' class='img-rounded' width='75'>"

         $("#boat1").html(string)
    });


    //when inputs are submitted
    $("#submit").click(function(){
        solve($("#missionaries").val(), $("#cannibals").val(), $("#boat").val())


    });



});

//function called when you press the run button
function solve(m, c, b){
    var output = "Running with\n" + m + " Missionaries, " + c + " Cannibals, and boat size: " + b
    console.log(output)
    $("#output").html("")//clear output area
    $("#output").append("<h4>" + output + "</h4>")

    //rename the variables because why not
    var cannibals = c
    var missionaries = m
    var boat = b

    //determine set of possible boat configurations from size of boat and and number of c and m
    var actions = getPossibleActions(cannibals, missionaries, boat)
    
    //create data structures for keeping up with states
    var visited = new buckets.Dictionary()
    var queue = new buckets.Queue()

    //let a "node" be a dictionary in the form {"missionaries": 0, "cannibals": 0, "boat": 0, "action": 00, "otherside": node, "parent": node, "direction": "left"}
    var startState = new buckets.Dictionary()
    var otherside = new buckets.Dictionary()

    //set the initial direction
    var direction = "right"

    //initialize otherside node to be empty
    otherside = initializeNode(otherside, 0, 0, 0, otherside, null, null)

    //set inital state to what was provided
    startState = initializeNode(startState, missionaries, cannibals, boat, otherside, null, direction)

    //update otherside's otherside since it didn't exist when we created it
    otherside.set("otherside", startState)

    //add the first state to the queue
    queue.add(startState)

    //perform the BFS
    executeBFS(startState, visited, queue, direction, actions)
}


function executeBFS(startState, visited, queue, direction, actions){
    var finished = false
    var solutionFound = false
    var nodesExpanded = 0
    var finalNode = null
    var startMissionaries = parseInt(startState.get("missionaries"))//for some reason this is a string when larger than 9
    while(!finished && !queue.isEmpty() && (startMissionaries>= startState.get("cannibals"))){
        var currentNode = queue.dequeue()

        //add the current node to the visited dictionary. The "key" is the current node state, and its "value" is the state of the node (not in memory) opposite of it
        var visitedNodeKey = "<" + currentNode.get("missionaries") + ", " + currentNode.get("cannibals") + ", " + currentNode.get("direction") + ">"
        var visitedNodeValue = "<" + (startState.get("missionaries") - currentNode.get("missionaries")) + ", " + (startState.get("cannibals") - currentNode.get("cannibals")) + ">"//wow so fancy maths
        visited.set(visitedNodeKey, visitedNodeValue)
        var currentOtherside = currentNode.get("otherside")//so we can be less verbose later

        //expand all possibilities from the current node's configuration
        for(var i = 0; i < actions.length; i++){
            
            var missionaryAction = parseInt(actions[i].charAt(0))
            var cannibalAction = parseInt(actions[i].charAt(1))

            //case 1: the boat needs to go from left to right, so subtract from currentNode's missionaries and cannibals
            if (currentNode.get("direction") == "right"){
                

                var m = currentNode.get("missionaries") - missionaryAction
                var c = currentNode.get("cannibals") - cannibalAction
                var b = 0//boat is leaving

                //if both are zero, we're done
                if (m == 0 && c == 0){
                    //console.log("finished")
                    //make final node
                    finalNode = new buckets.Dictionary()
                    finalNode = initializeNode(finalNode, 0, 0, 0, null, currentNode, "left")
                    finalOtherside = new buckets.Dictionary()
                    finalOtherside = initializeNode(finalOtherside, 0, 0, 0, finalNode, null, null)
                    finalNode.set("otherside", finalOtherside)
                    queue.enqueue(finalNode)
                    nodesExpanded ++
                    solutionFound = true
                    finished = true
                    i = actions.length
                }

                //add other to other side
                var otherM = currentOtherside.get("missionaries") + missionaryAction
                var otherC = currentOtherside.get("cannibals") + cannibalAction

                //make sure that there are valid numbers of missionaries and cannibals on each side after the additions and subtractions above
                if (m >= 0 && c >= 0 && (m > 0 && (m - c >= 0)) || (m == 0 && c >= 0) && otherM <= startState.get("missionaries") && otherC <= startState.get("cannibals")){
                    if ((otherM> 0 && (otherM - otherC >= 0)) || (otherM == 0 && otherC >= 0)){
                        var visitedNodeKey = "<" + m + ", " + c + ", left>"
                        //check to see if we've already processed this node
                        if (!visited.containsKey(visitedNodeKey)){
                             //initialize a node and enqueue it
                            var nodeToAdd = new buckets.Dictionary()
                            nodeToAdd = initializeNode(nodeToAdd, m, c, startState.get("boat"), null, currentNode, "left")
                            var tempOtherside = new buckets.Dictionary()
                            tempOtherside = initializeNode(tempOtherside, otherM, otherC, b, nodeToAdd, currentNode.get("parent"), null)
                            nodeToAdd.set("otherside", tempOtherside)
                            queue.enqueue(nodeToAdd)
                            nodesExpanded ++
                            //console.log("node added to queue: " + visitedNodeKey)
                        }
                        else{
                           // console.log("case 1: prevented a node from being expanded twice")
                         }
                    }
                }
            }//end case 1

            //case 2: we need to go from right to left, so add to the number of missionaries and cannibals
            else if (currentNode.get("direction") == "left"){

                //console.log("case 2 met")
                var m = currentNode.get("missionaries") + missionaryAction
                var c = currentNode.get("cannibals") + cannibalAction
                var b = startState.get("boat")

                //like in case 1, if m and c are 0, we're done
                if (m == 0 && c == 0){
                  //  console.log("finished")
                    //make final node
                    finalNode = new buckets.Dictionary()
                    finalNode = initializeNode(finalNode, 0, 0, 0, null, currentNode, "left")
                    finalOtherside = new buckets.Dictionary()
                    finalOtherside = initializeNode(finalOtherside, 0, 0, 0, finalNode, null, null)
                    finalNode.set("otherside", finalOtherside)
                    queue.enqueue(finalNode)
                    nodesExpanded ++
                    finished = true
                    solutionFound = true
                    i = actions.length
                }

                var otherM = currentOtherside.get("missionaries") - missionaryAction
                var otherC = currentOtherside.get("cannibals") - cannibalAction

                //make sure that there are valid numbers of missionaries and cannibals on each side after the additions and subtractions above
                if(m <= startState.get("missionaries") && c <= startState.get("cannibals") && (m > 0 && (m - c >= 0)) || (m == 0 && c >= 0) && otherM >= 0 && otherC >= 0){
                    if((otherM> 0 && (otherM - otherC >= 0)) || (otherM == 0 && otherC >= 0)){
                        //check to see if we've already processed this node
                         var visitedNodeKey = "<" + m + ", " + c +", right>"
                         if (!visited.containsKey(visitedNodeKey)){
                            //initialize a node and enqueue it
                            var nodeToAdd = new buckets.Dictionary()
                            nodeToAdd = initializeNode(nodeToAdd, m, c, b, null, currentNode, "right")
                            var tempOtherside = new buckets.Dictionary()
                            tempOtherside = initializeNode(tempOtherside, otherM, otherC, startState.get("boat"), nodeToAdd, currentNode.get("parent"), null)
                            nodeToAdd.set("otherside", tempOtherside)
                            queue.enqueue(nodeToAdd)
                            nodesExpanded ++
                         }
                         else{
                           // console.log("case 2: prevented a node from being expanded twice")
                         }
                    }
                }
            }//end case 2
        }//end action loop
    }//end while loop

    //there is a solution
    if(solutionFound){

        //some temp variables 
        var maxMiss = startState.get("missionaries")
        var maxCan = startState.get("cannibals")
        var boatRight = ""
        var boatLeft = ""
        var moveCount = 0
        console.log("Solution:")
        $("#output").append("Solution:")

        //make queue so we don't print in reverse order
        var printStack = new buckets.Stack()

        //go up the solution path and enqueue the node information in the output stack
        while (finalNode.get("parent") != null){
            moveCount ++
            var currentMiss = finalNode.get("missionaries")
            var currentCan = finalNode.get("cannibals")
            if(finalNode.get("direction") == "right"){
                boatRight = ",B>"
                boatLeft = "> "
            }
            else{
                boatLeft = ",B>"
                boatRight =">  "
            }

            printStack.push("<" + finalNode.get("missionaries") + "," + finalNode.get("cannibals") + boatRight + " <" + (maxMiss - currentMiss) + "," + (maxCan - currentCan) + boatLeft )
            finalNode = finalNode.get("parent")
        }

        //add start state start state
        printStack.push("<" + maxMiss +"," + maxCan + ",B> <0,0>")

        //pop off each move so it shows up in order
        while(!printStack.isEmpty()){
            var output = printStack.pop()
            console.log(output)
            $("#output").append("<br>" + output)
        }

        var output = "Number of moves required: " + moveCount + "\nTotal nodes expanded: " + nodesExpanded
        console.log(output)
         $("#output").append("<br>" + output)
    }
    else{
        //no solution was found. show number of nodes processed anyhow
        var output = "No solution" + "\nTotal nodes expanded: " + nodesExpanded
        console.log(output)
         $("#output").append("<br>" + output)
    }
}

//"constructor" for node. It just sets the key-value pairs in a dictionary and returns it
function initializeNode(node, m, c, b, othernode, parent, direction){
    node.set("missionaries", m)
    node.set("cannibals", c)
    node.set("boat", b)
    node.set("otherside", othernode)
    node.set("parent", parent)
    node.set("direction", direction)

    return node
}

//comes up with every possible action state from input nubmers
//actions are just strings with two integers appended together in the form XX
//a 10 action means move 1 missionary and 0 cannibals
function getPossibleActions(c, m, b){
    var actionsArray = []
    
    for (var j = 0; j <= m; j++){//number of missionaries
        for (var k = 0; k <= c; k++){//number of cannibals
            if ((j + k) <= b && (j+k) > 0){//make sure they fit on the boat
                //console.log(j + "" + k)
                actionsArray.push(j +"" + k)
            };

        };

    };
    //console.log(actionsArray.length)
    return actionsArray
};
