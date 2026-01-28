var champions = [{"name": "Ashe", "line": "ADC", "type": "Marksman"},
                 {"name": "Leona", "line": "Support", "type": "Tank"},
                 {"name": "Ahri", "line": "Mid", "type": "Mage"},
                 {"name": "Garen", "line": "Top", "type": "Fighter"},
                 {"name": "Lee Sin", "line": "Jungle", "type": "Assassin"},
                 {"name": "Soraka", "line": "Support", "type": "Support"},
                 {"name": "Caitlyn", "line": "ADC", "type": "Marksman"},
                 {"name": "Lux", "line": "Mid", "type": "Mage"},
                 {"name": "Thresh", "line": "Support", "type": "Tank"},
                 {"name": "Darius", "line": "Top", "type": "Fighter"},
                 {"name": "Zed", "line": "Mid", "type": "Assassin"},
                 {"name": "Teemo", "line": "Top", "type": "Marksman"},
                 {"name": "Jinx", "line": "ADC", "type": "Marksman"},
                 {"name": "Katarina", "line": "Mid", "type": "Assassin"},
                 {"name": "Blitzcrank", "line": "Support", "type": "Tank"},
                 {"name": "Yasuo", "line": "Mid", "type": "Fighter"},
                 {"name": "Riven", "line": "Top", "type": "Fighter"},
                 {"name": "Graves", "line": "ADC", "type": "Marksman"},
                 {"name": "Evelynn", "line": "Jungle", "type": "Assassin"},
                 {"name": "Syndra", "line": "Mid", "type": "Mage"},
                 {"name": "Ekko", "line": "Mid", "type": "Assassin"}];


var championLine = ["ADC", "Support", "Mid", "Top", "Jungle"];
var championType = ["Marksman", "Mage", "Tank", "Assassin", "Fighter", "Support"];

let championName = '';


function selectChampionLine() {
    var select = prompt("Select your champion line: " + championLine.join(", "));
    if (championLine.includes(select)) {
        alert("✓ You have selected the " + select + " line.");
        return select;
    } else {
        alert("✗ Invalid selection. Please try again.");
        return selectChampionLine();
    }
}

function selectChampionType() {
    var select = prompt("Select your champion type: " + championType.join(", "));
    if (championType.includes(select)) {
        alert("✓ You have selected the " + select + " type.");
        return select;
    } else {
        alert("✗ Invalid selection. Please try again.");
        return selectChampionType();
    }
}


function selectChampion(selectLine, selectType) {
    let posibleChampions = [];
    for (let i = 0; i < champions.length; i++) {
        if(champions[i].line === selectLine && champions[i].type === selectType) {
            posibleChampions.push(champions[i].name);
        }
    }
    if (posibleChampions.length > 0) {
        alert("Available champions for " + selectLine + " (" + selectType + "): \n" + posibleChampions.join(", "));
        var select = prompt("Select your champion from the list above: "+ posibleChampions.join(", "));
        if (posibleChampions.includes(select)) {
            alert("✓ You have selected " + select + " as your champion.");
            return select;
        } else {
            alert("✗ Invalid champion selection. Please try again.");
            return selectChampion(selectLine, selectType);
        }
    } else {
        alert("✗ No champions found for " + selectLine + " (" + selectType + "). Try again.");
        return '';
    }
}

function startSelector() {
    let selectLine = selectChampionLine();
    let selectType = selectChampionType();
    let selectedChampion = selectChampion(selectLine, selectType);
    if (selectedChampion != '') {
        alert("Champion selection completed: " + selectedChampion);
        return selectedChampion;
    } else {
        alert("No champion selected. Starting over...");
        return startSelector();
    }
}



do {
    startSelector();
}while (championName != '' );