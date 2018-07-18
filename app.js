const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const mkdirp = require("mkdirp");

client.on("ready", function() {
    console.log("Ready !");
});

client.on("message", function(message) {
    if (message.content.startsWith("!rpg")) {
        handler(message);
    }
});

fs.readFile("token.txt", "utf8", function(err, token) {
    if (err) throw err;
    client.login(token);
})

/* ----------------------------------------------------------------------------------- */

function handler(message) {
    args = message.content.split(" ");
    if (args[1] == "character") {
        if (args[2] == "new") {
            newCharacter(args[3], args[4], args[5], args[6], args[7], args[8], message.guild)
        } else if (args[2] == "display") {
            displayCharacter(name = args[3], channel = message.channel, server = message.guild);
        } else if (args[2] == "set") {
            setCharacterProperty(name = args[3], property = args[4], value = args[5], server = message.guild);
        }
    }
}

function newCharacter(name, strength, agility, defense, perception, psych, server) {
    var character = {
        name: name,
        strength: strength,
        agility: agility,
        defense: defense,
        perception: perception,
        psych: psych,
        money: 0,
        objects: ""
    }

    mkdirp("servers/" + server.id, function(err) {
        if (err) throw err;

        fs.writeFile("servers/" + server.id + "/" + name + ".json", JSON.stringify(character), function(err) { if(err) throw err; })
    })
}

function displayCharacter(name, channel, server) {
    fs.readFile("servers/" + server.id + "/" + name + ".json", function(err, data) {
        if (err) throw err;

        var character = JSON.parse(data);
        channel.send({embed : {
            color: 15725126,
            title: character.name,
            description: "Fiche de personnage",
            fields : [{
                name: "Statisques",
                value: "Force : " + character.strength +
                        "\nAgilité : " + character.agility + 
                        "\nDéfense : " + character.defense +
                        "\nPerception : "  + character.perception +
                        "\nEtat psychologique : " + character.psych 
            },{
                name:"Objets",
                value : " "
            },{
                name:"Argent",
                value: "argent"
            }],
            thumbnail: {
                url: character.thumbnail
            }
        }});
    });
}

function setCharacterProperty(name, property, value, server) {
    fs.readFile("servers/" + server.id + "/" + name + ".json", function(err, data) {
        if (err) throw err;
        
        var character = JSON.parse(data)
        character[property] = value;

        fs.writeFile("servers/" + server.id + "/" + name + ".json", JSON.stringify(character), function(err) { if (err) throw err; });
    });
}