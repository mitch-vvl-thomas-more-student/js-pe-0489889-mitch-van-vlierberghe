// gebruikte variabelen - declaratie
let veld, melding, mail, checkBox, index, i, waarde, mailFormat, wachtwoord, herhaal, gebruiker, gemaakteFouten;

// een lege array wordt aangemaakt: errorMessage => hierin zullen foutmeldingen worden opgenomen (of weer uit verwijdert worden) 
let errorMessage = [];

// verplichteVelden is een array met verplichte velden => met behulp van een for loop gaan we testen of deze velden ingevuld zijn
const verplichteVelden = ["voornaam", "achternaam", "gebruikersnaam", "mail", "adres", "land", "provincie", "wachtwoord", "herhaalwachtwoord"];

// betalingsMethodes is een array met betalingsmogelijkheden => met behulp van een for loop gaan we testen dewelke de gebruiker geselecteerd heeft
const betalingsMethodes = ["app", "overschrijving", "visa", "paypal"];

// de kollom meldingen wordt standaard verborgen
document.getElementById("meldingen").style.cssText = "display: none";

// we roepen de  methode validateForm aan wanneer op de button "send" geklikt wordt
document.getElementById("send").addEventListener("click", validateForm, false);


// De validatie wordt gestart => deze functie zal alle andere functies 1 voor 1 aanroepen 
function validateForm() {

    // verplichte velden controleren - deze mogen niet leeg zijn
    for (i = 0; i <= (verplichteVelden.length - 1); i++) {
        veld = verplichteVelden[i]; // veld ontvangt het id van de volgende input. 
        melding = ""; // de variabele melding word leeggehaald, om opnieuw te gebruiken.
        checkEmptyField(veld, melding); // test de inhoud van elke (verplichte) input.
    }

    // validatie van de gebruikersnaam
    userCheck();

    // validatie van de wachtwoorden
    passCheck();

    // validatie van de postcode
    veld = document.getElementById("postcode").value; // veld ontvangt de ingevulde waarde van postcode input 
    checkPostcode(veld);

    // email validatie met regEx
    mail = document.getElementById("mail").value; // mail ontvangt de ingevulde waarde van mail input
    validateEmail(mail);

    // validatie betalingsmethode - welke methode is gekozen?
    for (i = 0; i <= (betalingsMethodes.length - 1); i++) { // loop doorheen betalingsmethodes
        veld = betalingsMethodes[i]; // veld ontvangt het id van de volgende betalingswijze
        validatePayment(veld);
    }

    // test of de checkbox mbt de algemene voorwaarden aangevinkt staat
    checkVoorwaarden();

    // meldingen weergeven en opmaak correct zetten
    meldingWeergeven(checkBox);

    // error messages worden in logboek weergegeven voor debug doeleinden - standaard in commentaar gezet
    // console.log(errorMessage);
    // console.log(errorMessage.length);

     // array met fouten leegmaken
     errorMessage = [];

}



function checkVoorwaarden() {
    // test of er akkoord is gegaan met de algemene voorwaarden
    checkBox = document.getElementById("voorwaarden"); // checkBox ontvangt de waarde TRUE of FALSE (1/0)
    if (!checkBox.checked) {
        // als de checkBox niet werd aangevikt moet er een foutmelding ingesteld worden
        errorMessage.push("U moet akkoord gaan met onze algemene voorwaarden.");
        // als deze foutmelding zich nog niet in de array bevindt voegen we hem (achteraan) toe
    }
}

// functie voor het checken op niet ingevulde velden, met behulp van een array en een loop.
function checkEmptyField(veld, melding) {
    waarde = document.getElementById(veld).value; // waarde ophalen uit elk veld (variable wordt overschreven)
    if (waarde.length === 0 || waarde === "" || waarde === null) { // test op invoer (tekst lengte)
        if (veld === "herhaalwachtwoord") {
            // apparte test omdat het veld herhaalwachtwoord naar de gebruiker toe moet worden weergegeven als "herhaal wachtwoord" (met extra spatie)
            errorMessage.push("Het veld herhaal wachtwoord is vereist.");
        }
        else {
            errorMessage.push("Het veld " + veld + " is vereist.");
        }
    }
}

// functie voor e-mail validatie doormiddel van regex
function validateEmail(mail) {
    // bron: https://emailregex.com/
    mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    patroon = new RegExp("@+[0-9]|[a-z]|A-Z]");
    if (mail.length >= 1 && !mail.match(mailFormat)) {
        // test of het e-mail adres een correcte structuur heeft.
        errorMessage.push("E-mailaders is niet correct.");
    }
}

// functie voor het valideren van de betalingsmethode
function validatePayment(veld) {
    if (document.getElementById(veld).checked) {
        switch (veld) {
            // test welke radio button werd aangekruist => reeds aangeduid bij het laden van het document (default) = "Banking app"
            case "overschrijving": document.getElementById("betalingsWijzeDetail").innerHTML = "Je betalingswijze is Overschrijving";
                break;
            case "visa": document.getElementById("betalingsWijzeDetail").innerHTML = "Je betalingswijze is Visa";
                break;
            case "paypal": document.getElementById("betalingsWijzeDetail").innerHTML = "Je betalingswijze is Paypal";
                break;
            default: document.getElementById("betalingsWijzeDetail").innerHTML = "Je betalingswijze is Banking app";
                break;
        }
    }
}

// functie ter controle van de postcode
function checkPostcode(veld) {
    if (veld.length === 0 || veld === "" || veld === null) { // test op ingevulde waarde
        errorMessage.push("Het veld postcode is vereist.");
    }
    else if (veld < 1000 || veld > 9999) { // ALS het veld niet leef is - controleren we de waarde van de postcode
        errorMessage.push("De waarde van postcode moet tussen 1000 en 9999 liggen.");
    }
}

// functie ter controle van de wachtwoorden
function passCheck() {
    wachtwoord = document.getElementById("wachtwoord").value; // waarde ophalen
    herhaal = document.getElementById("herhaalwachtwoord").value; // waarde van de herhaling ophalen

    if ((wachtwoord.length !== 0 && herhaal.length !== 0) &&
        // eerst testen we of de velden niet leeg zijn => errormessage word dan ingesteld door de functie checkEmptyField 
        (wachtwoord.length < 7 && herhaal.length < 7)) {
        // controle of de wachtwoorden lang genoeg zijn => fout indien korter dan 7 karakters
        errorMessage.push("Het wachtwoord is te kort.");
    }

    else if (wachtwoord.length < 7 && wachtwoord !== herhaal) {
        // indien het ingevulde wachtwoord lang genoeg is, maar niet gelijk zijn aan elkaar wordt er een ander foutmelding ingesteld
        errorMessage.push("Je wachtwoorden komen niet overeen.");
    }
}

// functie ter controle van de gebruikersnaam
function userCheck() {
    gebruiker = document.getElementById("gebruikersnaam").value;
    if (gebruiker.indexOf(".") === 0 || gebruiker.indexOf("-") === 0) {
        // test of de gebruikersnaam start met een . of - 
        errorMessage.push("Je gebruikersnaam mag niet starten met een \".\" of een  \"-\".");
    }
}

// funtie ter voorbereiding van de nodige meldingen
function meldingWeergeven(checkBox) {
    // de kollom meldingen word getoond => altijd nadat de validatie is afgerond.
    document.getElementById("meldingen").style.cssText = "display: block";

    if (errorMessage.length == 0 && checkBox.checked) {
        // als er geen foutmeldingen (meer) opgenomen zijn in de errorMessage array
        document.getElementById("fouten").style.cssText = "display: none";
        // verbergen we het block fouten (deze bevat immer wel een standaard tittel en kleur)
        document.getElementById("geenFouten").style.cssText = "display: block";
        // tonen we het block geenFouten
        document.getElementById("betalingsWijze").style.cssText = "display: block";
        // tonen we het block betalingsWijze
    } else {
        gemaakteFouten = "";
        for (i = 0; i < errorMessage.length; i++) {
            gemaakteFouten = gemaakteFouten.concat(errorMessage[i]).concat("<br>");
            // alle foutmeldingen worden opgenomen in 1 string variabele.
        }
        document.getElementById("foutenDetail").innerHTML = gemaakteFouten;
        // de paragraaf foutenDetail word overschreven met de nieuwe lijst van geregistreerde fouten
        document.getElementById("fouten").style.cssText = "display: block";
        // het block fouten wordt weergegeven
        document.getElementById("geenFouten").style.cssText = "display: none";
        // het block geenFouten wordt verborgen
        document.getElementById("betalingsWijze").style.cssText = "display: none";
        // het block fouten wordt verborgen

    }
}