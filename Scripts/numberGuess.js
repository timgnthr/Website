
let RndNumber = Math.floor(Math.random() * 100);
let guesses = 0;

function guessNum() {
    guesses = guesses + 1;
    document.getElementById("versuche").innerHTML = "Versuche: " + guesses;
    if (RndNumber == document.getElementById("input").value) {
        document.getElementById("anweisung").innerHTML = "GEWONNEN!🥳🎉";
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
    }
    else if (RndNumber < document.getElementById("input").value) {
        document.getElementById("letzter").innerHTML = "Letzter Versuch: " + document.getElementById("input").value;
        document.getElementById("anweisung").innerHTML = "Die gesuchte Zahl ist kleiner!";
        document.getElementById("input").value = "";
    }
    else if (RndNumber > document.getElementById("input").value) {
        document.getElementById("letzter").innerHTML = "Letzter Versuch: " + document.getElementById("input").value;
        document.getElementById("anweisung").innerHTML = "Die gesuchte Zahl ist größer!";
        document.getElementById("input").value = "";
    }
    else alert("FEHLER");
}

