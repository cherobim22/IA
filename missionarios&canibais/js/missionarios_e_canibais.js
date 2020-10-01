$(document).ready(function($){
    "use strict"; 

    $("#missionaries").change(function(){
         var string = "<img src='img/missionary.jpg' class='img-rounded' width='75'><br><img src='img/missionary.jpg' class='img-rounded' width='75'>";
        for (var i = 3; i <= $("#missionaries").val(); i++) {
            string += "<br><img src='img/missionary.jpg' class='img-rounded' width='75'>"
        };
        $("#missionaries1").html(string)
    });


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
    
    $("#boat").change(function(){
         var string = "<img src='img/boat" + $("#boat").val() + ".jpg' class='img-rounded' width='75'>"

         $("#boat1").html(string)
    });

    $("#submit").click(function(){
        solve($("#missionaries").val(), $("#cannibals").val(), $("#boat").val())

    });

});

//função que executa na chamada do botao
function solve(m, c, b){
    var output = "Executando com\n" + m + " Missionarios, " + c + " Canibais, capacidade do barco: " + b
    console.log(output)
    $("#output").html("")//limpa a area de saida 
    $("#output").append("<h4>" + output + "</h4>")

    //renomeia as variaveis 
    var cannibals = c
    var missionaries = m
    var boat = b

  
    //deteremina as possiveis soluções partir dos dados inseridos
    var actions = getPossibleActions(cannibals, missionaries, boat)
    
    //cria uma estrutura de chave valor com os dados
    var visited = new buckets.Dictionary()
    var queue = new buckets.Queue()
    var startState = new buckets.Dictionary()
    var otherside = new buckets.Dictionary()

    //direção inicial da fila 
    var direction = "right"

    //inicializa o outro lado da fila 
    otherside = initializeNode(otherside, 0, 0, 0, otherside, null, null)

    //seta o estado inicial da fila 
    startState = initializeNode(startState, missionaries, cannibals, boat, otherside, null, direction)
    
    //atualiza o outro lado, uma vez que ele é criado
    otherside.set("otherside", startState)

    //adiciona o estado inicial a fila 
    queue.add(startState)

    //executa os dados 
    execute(startState, visited, queue, direction, actions)
}


function execute(startState, visited, queue, direction, actions){
    var finished = false
    var solutionFound = false
    var nodesExpanded = 0
    var finalNode = null
    var startMissionaries = parseInt(startState.get("missionaries"))
    while(!finished && !queue.isEmpty() && (startMissionaries>= startState.get("cannibals"))){
        var currentNode = queue.dequeue()

        //adiciona o respectivo no ao dicionario visitante. A chave sera o respectivo estado do "no"
        var visitedNodeKey = "<" + currentNode.get("missionaries") + ", " + currentNode.get("cannibals") + ", " + currentNode.get("direction") + ">"
        var visitedNodeValue = "<" + (startState.get("missionaries") - currentNode.get("missionaries")) + ", " + (startState.get("cannibals") - currentNode.get("cannibals")) + ">"
        visited.set(visitedNodeKey, visitedNodeValue)
        var currentOtherside = currentNode.get("otherside")

        //expande todas as possibilidades a partir das configurações do "no"
        for(var i = 0; i < actions.length; i++){
            
            var missionaryAction = parseInt(actions[i].charAt(0))
            var cannibalAction = parseInt(actions[i].charAt(1))

            //caso 1: o barco precisa ir da esquerda para a direita, subtrai do respectivo "no", os missionaios e os canibais.
            if (currentNode.get("direction") == "right"){
                
                var m = currentNode.get("missionaries") - missionaryAction
                var c = currentNode.get("cannibals") - cannibalAction
                var b = 0//boat is leaving

                //caso o barco tenha tamanho 0
                if (m == 0 && c == 0){
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

                //adiciona ao outro lado 
                var otherM = currentOtherside.get("missionaries") + missionaryAction
                var otherC = currentOtherside.get("cannibals") + cannibalAction

                //verifica seo numero de missionarios e canibais é valido
                if (m >= 0 && c >= 0 && (m > 0 && (m - c >= 0)) || (m == 0 && c >= 0) && otherM <= startState.get("missionaries") && otherC <= startState.get("cannibals")){
                    if ((otherM> 0 && (otherM - otherC >= 0)) || (otherM == 0 && otherC >= 0)){
                        var visitedNodeKey = "<" + m + ", " + c + ", left>"
                        //verifica se algo ja ocorreu dentro do "no"
                        if (!visited.containsKey(visitedNodeKey)){
                             //inicia o "no" e enfileira
                            var nodeToAdd = new buckets.Dictionary()
                            nodeToAdd = initializeNode(nodeToAdd, m, c, startState.get("boat"), null, currentNode, "left")
                            var tempOtherside = new buckets.Dictionary()
                            tempOtherside = initializeNode(tempOtherside, otherM, otherC, b, nodeToAdd, currentNode.get("parent"), null)
                            nodeToAdd.set("otherside", tempOtherside)
                            queue.enqueue(nodeToAdd)
                            nodesExpanded ++
                        
                        }
                        
                    }
                }
            }//fim caso 1

            //case 2: precisamos sair do lado direito para o essquerdo, adicionando o numero de missiorios e canibais
            else if (currentNode.get("direction") == "left"){
                
                var m = currentNode.get("missionaries") + missionaryAction
                var c = currentNode.get("cannibals") + cannibalAction
                var b = startState.get("boat")

                if (m == 0 && c == 0){
                    //monta o "no" final
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

                //verifica se o numero de missionario e canibais é valido
                if(m <= startState.get("missionaries") && c <= startState.get("cannibals") && (m > 0 && (m - c >= 0)) || (m == 0 && c >= 0) && otherM >= 0 && otherC >= 0){
                    if((otherM> 0 && (otherM - otherC >= 0)) || (otherM == 0 && otherC >= 0)){
                      //verifica se algo ja ocorreu dentro do "no"
                         var visitedNodeKey = "<" + m + ", " + c +", right>"
                         if (!visited.containsKey(visitedNodeKey)){
                           //inicia o "no" e enfileira
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
            }//fim caso 2
        }
    }

    //caso exista uma solução
    if(solutionFound){

        //variaveis de tempo
        var maxMiss = startState.get("missionaries")
        var maxCan = startState.get("cannibals")
        var boatRight = ""
        var boatLeft = ""
        var moveCount = 0
        console.log("Solution:")
        $("#output").append("Solution:")

        var printStack = new buckets.Stack()

        //busca as soluções e enfileira as informções na pilha de saida
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

        //adiciona o estado incial
        printStack.push("<" + maxMiss +"," + maxCan + ",B> <0,0>")

        //imprimindo os movimentos
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
        //nenhuma solução foi encontrada
        var output = "No solution" + "\nTotal nodes expanded: " + nodesExpanded
        console.log(output)
         $("#output").append("<br>" + output)
    }
}

//construtor
function initializeNode(node, m, c, b, othernode, parent, direction){
    node.set("missionaries", m)
    node.set("cannibals", c)
    node.set("boat", b)
    node.set("otherside", othernode)
    node.set("parent", parent)
    node.set("direction", direction)

    return node
}

//função que verifica se é possivel efetuar as ações do usuario
//se o numero de canibais é = ao numero de missionario e se cabem no barco

function getPossibleActions(c, m, b){
    var actionsArray = []
    
    for (var j = 0; j <= m; j++){
        for (var k = 0; k <= c; k++){
            if ((j + k) <= b && (j+k) > 0){
                //console.log(j + "" + k)
                actionsArray.push(j +"" + k)
            };

        };

    };
    //console.log(actionsArray.length)
    return actionsArray
};
