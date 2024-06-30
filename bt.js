console.log("hi");
var startnode = 0;
var nextbtn = 0;
var q = new Array();
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document
  .getElementsByClassName("node E")[0]
  .style.setProperty("--colorrBefore", "black");
document
  .getElementsByClassName("node P")[0]
  .style.setProperty("--colorrBefore", "black");

class node {
  link;
  edges;
  parents;
  removed;
  visited;
  defaultClass;
  constructor(letter) {
    this.link = document.getElementsByClassName("node " + letter)[0];
    this.edges = new Array();
    this.parents = new Array();
    this.removed = 0;
    this.visited = 0;
    this.defaultClass = this.link.className;
  }
  setEdge(node) {
    for (var i = 0; i < this.getEdges().length; ++i)
      if (this.getEdges()[i] == node) return;
    this.edges.push(node);

    for (var i = 0; i < node.getParents().length; ++i)
      if (node.getParents()[i] == this) return;

    node.setParent(this);
  }
  setParent(node) {
    this.parents.push(node);
  }
  getEdges() {
    return this.edges;
  }
  getParents() {
    return this.parents;
  }
  getLink() {
    return this.link;
  }
  nodeReset() {
    this.removed = 0;
    this.visited = 0;
    this.edges.length = 0;
    this.parents.length = 0;
    this.link.className = this.defaultClass;
  }
  setType(val) {
    //1 - in queue
    //2 - visited
    if (val == 1) this.getLink().classList.add("visited");
    if (val == 2) this.getLink().classList.add("done");
  }
  removeNode() {
    console.log(this.link.className);
    if (this.link.className == "node B") {
      document
        .getElementsByClassName("node E")[0]
        .style.setProperty("--colorrBefore", "wheat");
    }
    if (this.link.className == "node E") {
      document
        .getElementsByClassName("node P")[0]
        .style.setProperty("--colorrBefore", "wheat");
    }
    this.removed = 1;
    for (var i = 0; i < this.edges.length; ++i) {
      var remove = 1;
      for (var t = 0; t < this.edges[i].getParents().length; ++t) {
        if (this.edges[i].parents[t].removed == 0) {
          remove = 0;
        }
      }
      if (remove == 1) this.edges[i].removeNode(); //
    }

    for (var i = 0; i < this.parents.length; ++i) {
      for (var t = 0; this.parents[i].edges[t]; ++t) {
        if (this.parents[i].edges[t] == this) {
          this.parents[i].edges[t] = null;
        }
      }
    }

    for (var i = 0; i < this.edges.length; ++i) {
      this.edges.length = 0;
    }

    this.link.classList.add("display_none");
  }
}

var A = new node("A");
var C = new node("C");
var P = new node("P");
var B = new node("B");
var G = new node("G");
var F = new node("F");
var E = new node("E");
var D = new node("D");
var O = new node("O");
var N = new node("N");
var M = new node("M");
var L = new node("L");
var K = new node("K");
var J = new node("J");
var I = new node("I");
var H = new node("H");

A.setEdge(C);
A.setEdge(P);
A.setEdge(B);

C.setEdge(G);
C.setEdge(F);

P.setEdge(E);

B.setEdge(E);
B.setEdge(D);

G.setEdge(O);
G.setEdge(N);

F.setEdge(M);
F.setEdge(L);

E.setEdge(K);
E.setEdge(J);

D.setEdge(I);
D.setEdge(H);

function log(text) {
  document.getElementsByClassName("text")[0].innerHTML = "[" + text + "]";
}
function textPrint(start_queue) {
  var string = "";
  for (var x = 0; x < start_queue.length && run; ++x) {
    if (start_queue.length - 1 == x) {
      string += start_queue[x].defaultClass.split(" ")[1];
    } else string += start_queue[x].defaultClass.split(" ")[1] + ",";
  }
  log(string);
}

async function waitToPressNext() {
  nextbtn = 0;
  while (!nextbtn) {
    await sleep(10);
  }
  nextbtn = 0;
  return;
}

var run = false;

async function bfs(start_queue, algoType) {
  console.log(algoType);
  while (run && start_queue.length) {
    var cur = null;
    if (algoType == "d") {
      cur = start_queue.pop();
    } else {
      cur = start_queue.shift();
    }
    cur.setType(2);
    textPrint(start_queue);
    var curArray = new Array();
    curArray = curArray.concat(cur.getParents(), cur.getEdges());
    console.log(curArray);
    for (var i = 0; run && i < curArray.length; ++i) {
      if (curArray[i].visited == 1 || curArray[i] == null) {
        continue;
      }
      start_queue.push(curArray[i]);
      curArray[i].visited = 1;
      curArray[i].setType(1);
      textPrint(start_queue);
    }
    if (!run) return;

    cur.visited = 1;
    textPrint(start_queue);
    await waitToPressNext();
  }
  if (!run) return;

  log("Done!");
}

function start() {
  if (startnode == 0) {
    log("Select a Starting Node :)");
    return;
  }
  run = true;
  var t = "b";
  if (document.getElementsByName("algo")[0].checked) {
    t = document.getElementsByName("algo")[0].value;
  } else {
    t = document.getElementsByName("algo")[1].value;
  }
  document.getElementsByName("algo")[0].disabled = true;
  document.getElementsByName("algo")[1].disabled = true;

  document.getElementsByClassName("but")[1].classList.add("display_none");
  document.getElementsByClassName("but")[0].classList.remove("display_none");
  bfs(q, t);
}
function next() {
  nextbtn = 1;
}
async function reset() {
  location.reload();
}

function startNode(node) {
  if (startnode == 0) {
    node.setType(1);
    q.push(node);
    log(node.defaultClass.split(" ")[1]);
    startnode++;
  }
}

function setAlgoText(radioBut) {
  if (radioBut.value == "b") {
    document.getElementsByClassName("textalog")[0].innerHTML =
      "Breadth: First In First Out";
  } else {
    document.getElementsByClassName("textalog")[0].innerHTML =
      "Depth: First In Last Out";
  }
}
