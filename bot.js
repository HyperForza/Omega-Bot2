// Load up the discord.js library
const Discord = require("discord.js");
var SourceQuery = require('sourcequery');

// This is your client. Some people call it `bot`, some people call it `self`, 
const client = new Discord.Client();


// Here we load the config.json file that contains our token and our prefix values. 
// config.token contains the bot's token
// config.prefix contains the message prefix.
const config = require("./config.json");
// Here we load the ip.json file that contains ip of servers
const ip_file = require("./ip.json");


client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`!yardım`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`!yardım`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`!yardım`);
});



client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // Function to query a csgo server , parse server details, make an embed and then sends on the discord
  function queryserver(ip, port) {
    let sq = new SourceQuery(1000); // 1000ms timeout
    console.log(ip + "  " + port);
    sq.open(ip, port);
    sq.getInfo(function (err, info) {
      if (!err) {
        sq.getPlayers(function (err, players) {
          if (!err) {
            console.log(sq.address);
            var counter = 0;
            playersname = "";
            for (i = 0; i < players.length; i++) {
              playersname = playersname + players[i].name + "\n";
              if (counter == players.length - 1) {
                console.log("Discord Message sent");
                message.channel.send({
                  embed: {
                    color: 3447003,
                    author: {

                    },
                    title: "Omega Oyuncu Topluluğu",
                    url: "https://steamcommunity.com/groups/OmegaOyuncuToplulugu",
                    fields: [{
                      name: "⭐ | Sunucu Adı",
                      value: "**" + info.name + "**"
                    },
                    {
                      name: "🔷 | Ip Adresi",
                      value: "**connect " + ip + ":" + port + "**",
                      "inline": true
                    },
                    {
                      name: "🗺️ | Harita ",
                      value: info.map,
                      "inline": true
                    },
                    {
                      name: "👥 | Oyuncular",
                      value: playersname,
 
                    },

                    ],
                    timestamp: new Date(),

                  }
                });
              }
              counter++;
            }
          }
          else {
            console.log("Error in Players query");

          }
        });
      }
      else {
        console.log("Error in info query");
        
      }
    });
  }





    
  
  

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command. 
  const args = message.content.slice(config.prefix.length).trim().split(/ ss/g);
  var arguments = args.shift().toLowerCase();
  arguments = arguments.split(" ");
  const command = arguments[0];
  console.log(arguments);
  console.log(command);

  // Let's go with a few common example commands! Feel free to delete or change those.

  if (command == "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Botun pingi ${m.createdTimestamp - message.createdTimestamp}ms. `);
  }

  if (command == "yardım") {
    // Reply back with the all possible commands and usage 
    const embed = new Discord.RichEmbed()
    .setAuthor('Yardım',)
    .setDescription('Omega Bot')
    .addField('Komutlar:',
    `!yardım
     !sunucu
     !ping` )
    .setColor("BLUE")
    .setFooter('Bu komutu kullanan kullanıcı ' + message.author.tag, )
    message.channel.send(embed)
  }

  if (command == "sunucu") {
    // Function to query all servers at once
    ip_file.IP.forEach((value, key) => {
      console.log(ip_file.IP[key].ip + "  " + ip_file.IP[key].port);
      queryserver(ip_file.IP[key].ip, ip_file.IP[key].port);
    })
  }



});

client.login(process.env.token);
