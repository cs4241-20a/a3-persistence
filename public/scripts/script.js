const teams = [
    {
        shortName: "G2",
        longName: "G2 Esports",
        players: [
            "Wunder", "Jankos", "Caps", "Perkz", "MikyX"
        ], 
        seed: "1"
    },
    {
        shortName: "TSM",
        longName: "Team SoloMid",
        players: [
            "BrokenBlade", "Spica", "Bjergsen", "Doublelift", "Biofrost"
        ], 
        seed: "2"
    },
    {
        shortName: "TL",
        longName: "Team Liquid",
        players: [
            "Impact", "Broxah", "Jensen", "Tactical", "CoreJJ"
        ], 
        seed: "3"
    },
    {
        shortName: "DWG",
        longName: "Damwon Gaming",
        players: [
            "Nuguri", "Canyon", "Showmaker", "Ghost", "Beryl"
        ], 
        seed: "4"
    },
    {
        shortName: "TES",
        longName: "TOP Esports",
        players: [
            "369", "Karsa", "knight", "JackeyLove", "yuyanjia"
        ], 
        seed: "5"
    },
    {
        shortName: "FNC",
        longName: "Fnatic",
        players: [
            "Bwipo", "Selfmade", "Nemesis", "Rekkles", "Hylissang"
        ], 
        seed: "6"
    },
    {
        shortName: "JDG",
        longName: "Jingdong Gaming",
        players: [
            "Zoom", "Kanavi", "Yagao", "LokeN", "LvMao"
        ], 
        seed: "7"
    },
    {
        shortName: "DRX",
        longName: "DragonX",
        players: [
            "Doran", "Pyosik", "Chovy", "Deft", "Keria"
        ], 
        seed: "8"
    }
    
];

//indicates for each match number what position they are playing for
let matches = [
    {
        resultPlace:"semi1",
        player1: "seed1",
        player2: "seed2"
    },
    {
        resultPlace:"semi2",
        player1: "seed3",
        player2: "seed4"
    },
    {
        resultPlace:"semi3",
        player1: "seed5",
        player2: "seed6"
    },
    {
        resultPlace:"semi4",
        player1: "seed7",
        player2: "seed8"
    },
    {
        resultPlace:"final1",
        player1: "semi1",
        player2: "semi2"
    },
    {
        resultPlace:"final2",
        player1: "semi3",
        player2: "semi4"
    },
    {
        resultPlace:"winner",
        player1: "final1",
        player2: "final2"
    }
]

let pickems = {
    "seed1": getTeamBySeed(1),
    "seed2": getTeamBySeed(2),
    "seed3": getTeamBySeed(3),
    "seed4": getTeamBySeed(4),
    "seed5": getTeamBySeed(5),
    "seed6": getTeamBySeed(6),
    "seed7": getTeamBySeed(7),
    "seed8": getTeamBySeed(8),
}

let leftPick;
let rightPick;
let modifyB;
let deleteB;
let altFuncsContainer;
let username = "";
let userHasPickems = false;

function getTeamBySeed(seed){
    return teams[seed-1]
}

function getTeamByPlace(place){
    return pickems[place];
}

function makePick(team, matchNum){
    pickems[matches[matchNum].resultPlace] = team;
    updatePickems();
    if (matchNum < 6) initPicks(matchNum+1);
    else {
        sendPickems()
        leftPick.onclick = function(){}
        rightPick.onclick = function(){}
        leftPick.innerHTML = "Team 1";
        rightPick.innerHTML = "Team 2";
        document.getElementById("pickem").style.display = "none";
        document.getElementById("altFuncs").style.display = "flex";
    }
}

function initPicks(matchNum){
    document.getElementById("pickem").style.display = "flex";
    let teamL = getTeamByPlace(matches[matchNum].player1);
    let teamR = getTeamByPlace(matches[matchNum].player2);

    leftPick.innerHTML = teamL.shortName;
    rightPick.innerHTML = teamR.shortName;
    
    leftPick.onclick = function(){
        makePick(teamL, matchNum);
    }
    rightPick.onclick = function(){
        makePick(teamR, matchNum);
    }
    
}

function updatePickems(){
    let cell = null;
    for (let i = 1; i < 5; i++){
        if (i<3){
            cell = document.getElementById("final"+i);
            cell.innerHTML = "Final";
        }
        cell = document.getElementById("semi"+i);
        cell.innerHTML = "Semis";
    }
    cell = document.getElementById("winner");
    cell.innerHTML = "Winner"
    Object.keys(pickems).forEach(function(key) {
        cell = document.getElementById(key);
        cell.innerHTML = pickems[key].shortName;
    })
}

function sendPickems(){
    fetch('/add', {
        method:'POST',
        body:JSON.stringify({
            username: username,
            pickdata: pickems
        }),
        headers : {
            "Content-Type":"application/json"
        }
    }).then( response => response.json())
        .then( json => {

        })
}

async function fetchAndUpdatePickems(){
    return fetch('/db', {
        method:'POST',
        body:JSON.stringify({
            username: username
        }),
        headers : {
            "Content-Type":"application/json"
        }
    }).then( response => response.json())
        .then( json => {
            // if the pickems in the server is empty then we want to have 
            // an empty default pickems displayed
            if (json.pickem) {
                console.log("here")
                userHasPickems = true;
                pickems = json.pickem
                updatePickems()
            }   
        })
    
}


function modifyPicks(){
    pickems = {
        "seed1": getTeamBySeed(1),
        "seed2": getTeamBySeed(2),
        "seed3": getTeamBySeed(3),
        "seed4": getTeamBySeed(4),
        "seed5": getTeamBySeed(5),
        "seed6": getTeamBySeed(6),
        "seed7": getTeamBySeed(7),
        "seed8": getTeamBySeed(8),
    }

    userHasPickems = false;
    updatePickems()
    init();
}

async function deletePicks(){
    pickems = {
        "seed1": getTeamBySeed(1),
        "seed2": getTeamBySeed(2),
        "seed3": getTeamBySeed(3),
        "seed4": getTeamBySeed(4),
        "seed5": getTeamBySeed(5),
        "seed6": getTeamBySeed(6),
        "seed7": getTeamBySeed(7),
        "seed8": getTeamBySeed(8),
    }
    return fetch('/delete', {
        method:'POST',
        body:JSON.stringify({
            username: username,
            pickdata: pickems
        }),
        headers : {
            "Content-Type":"application/json"
        }
    }).then( response => response.json())
        .then( json => {

            userHasPickems = false;
            init();
        })
}


function hidePickemUI(){
    leftPick.onclick = function(){}
    rightPick.onclick = function(){}
    leftPick.innerHTML = "Team 1";
    rightPick.innerHTML = "Team 2";
    document.getElementById("pickem").style.display = "none";
}


function init(){
    leftPick  = document.getElementById("team1");
    rightPick = document.getElementById("team2");
    modifyB   = document.getElementById("modify");
    deleteB   = document.getElementById("delete");
    altFuncsContainer = document.getElementById("altFuncs");

    modifyB.onclick = function(){
        modifyPicks();
    }
    deleteB.onclick = async function(){
        await deletePicks();
    }

    if (!userHasPickems) {
        altFuncsContainer.style.display = "none";
        initPicks(0)
    }
    else {
        hidePickemUI();
    }

    updatePickems();
    
}

window.onload = async function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    username = urlParams.get('username');
    let newUser = urlParams.get('newUser');
    if (newUser == "true"){
        alert("An account with that username was not found so one was created")
    }
    else {
        await fetchAndUpdatePickems();
    }
    console.log(userHasPickems)
    init()
};
