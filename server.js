// If you didn't want to run in 24/7 you can remove it.
const http = require('http');
const express = require('express');
const Discord = require("discord.js");const client = new Discord.Client();
const fs = require("fs");
const app = express();
const Canvas = require('canvas');
const config = require('./config.json');
const moment = require('moment');require('moment-duration-format');
const getYoutubeSubscriber = require('getyoutubesubscriber')
const guildInvites = new Map();
/* FileSync */
let botver = config.mainbot_ver;
let owner = config.ownerid;
let botname = config.botname;
let prefix = config.prefix; // Please change YOURPREFIX to your prefix. (Example: . ! - ; >)
let eprefix = prefix+" ";
let beprefix = " "+eprefix;
let economy_prefix = config.economy_prefix/**/;
var commandlist = [beprefix+"help",beprefix+"profile",beprefix+"prefix",beprefix+"clear",beprefix+"cat"," "+economy_prefix+"help",beprefix+"kawaii/"+eprefix+"kawaii leaderboard"];



/*global Set, Map*/
app.use(express.static('public'));
app.listen(process.env.PORT);
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200); // Here, you can send a response to the website. Example i choosed 200, that means the server was fine, working normally.
  
  // So, if change to 500, response will send a status with 500, that means i'm currently dead, you need to repair my coding/server.
});
// If you didn't want to run in 24/7 you can remove it.


let servers = JSON.parse(fs.readFileSync(__dirname+"/servers.json"));
client.on('shardError', error => {
	 console.error('A websocket connection encountered an error:', error);
});
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
// Message edit event
client.on("messageUpdate", async(oldMessage, newMessage, message) => {
  // First let's also check that the content has actually changed
  if(oldMessage.content === newMessage.content){
    return;
  }
  // Get the log channel
  var logchannel = message.guild.channels.cache.find(channel => channel.name === "bot-logs"); // Replace CHANNEL_ID with your channel id.
  // Log embed
  let logembed = new Discord.MessageEmbed()
  .setAuthor(oldMessage.author.tag, oldMessage.author.avatarURL)
  .setThumbnail(oldMessage.author.avatarURL)
  .setColor("RED")
  .setDescription("Message Edited")
  .addField("Before", oldMessage.content, true)
  .addField("After", newMessage.content, true)
  .setTimestamp()
  // Send the embed
  message.send(logembed)
})

// Message deletion event
client.on("messageDelete", async message => {
  // Get the log channel again
  var logchannel = message.guild.channels.cache.find(channel => channel.name === "bot-logs");
  // Log embed
  var person = message.author;
  let logembed = new Discord.MessageEmbed()
  .setAuthor(person.tag, person.avatarURL)
  .setThumbnail(person.avatarURL)
  .setColor("RED")
  .setDescription(":wastebasket: Message Deleted")
  .addField("Message", message.content, true)
  .setTimestamp()
  // Let's send the embed
  logchannel.send(logembed) })

client.on("channelCreate", async (channel, message) => {
	// Get the log channel again
  var logchannel = message.guild.channels.cache.find(channel => channel.name === "bot-logs");
  // Log embed
  var person = message.author;
  let logembed = new Discord.MessageEmbed()
  .setAuthor(person.tag, person.avatarURL)
  .setThumbnail(person.avatarURL)
  .setColor("RED")
  .setDescription(":wastebasket: Message Deleted")
  .addField("Message", message.content, true)
  .setTimestamp()
  // Let's send the embed
  logchannel.send(logembed)
});




client.on("channelDelete", async (channel,message) => {
	var logs = message.guild.channels.cache.find(channel => channel.name === "bot-logs");
	if (!logs) return console.log("Can't find logs channel.");
	const cembed = new Discord.MessageEmbed()
		.setTitle("Channel Deleted")
		.setColor("RANDOM")
		.setDescription(`A **${channel.type} channel**, by the name of **${channel.name}**, was just deleted!`)
		.setTimestamp(new Date())
	message.send(cembed)
});


client.on("message", (message) => {
  //if(message.guild.id==728008557244448788&&(message.channel.id!=728025726556569631)){ return;}
  if (message.content == eprefix+'stats') {
    message.channel.send(`I am in ${client.guilds.cache.size} servers!`); 
	}
  if (message.content.startsWith(eprefix + "ping")) {
    message.channel.send("Pong!").then(msg => {
      msg.edit(`Pong! ${msg.createdTimestamp - message.createdTimestamp}ms round-trip, ${Math.round(client.ping)}ms API heartbeat!`);   
    });   
  }

  if (message.content === 'invites') {
        var userId = message.author.id;
        var userInvites = message.guild.fetchInvites().then(invites => invites.find(invite => invite.inviter.id === userId));
        var useAmount = userInvites.uses;
        if (useAmount === undefined) {
            message.channel.send(`${message.author.username} has 0 invites`);
        }
        else { message.channel.send(`${message.author.username} has ${useAmount} invites`);
      }
    }

  
  if (message.content==(eprefix + "help")||message.content==(eprefix + "commands")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL)
        .setTitle('__Mittz Information__')
        .setDescription('Hello! <:gold:733213975705026620> I\'m '+botname+'.\nI can do lots of things l-like... Oh! Be a DJ!, send cat pictures!, clear a bit of the chat, and run a failing economy system.  Well... There isn\'nt much else i can do... Use `'+eprefix+'commandlist` to see what other things i can do.')
        .setColor(config.color)
        .addField('__Developer__', '<@193127888646701056>', true)
        .addField('__Library__', 'Discord.js', true)
        .addField('__Server Count__', client.guilds.cache.size, true)
        .addField('__User Count__', client.users.cache.size, true)
        .addField('__Channel Count__', client.channels.cache.size, true)
        .addField('__Emojis Count__', client.emojis.cache.size, true)
        .addField('__Uptime__', moment.duration(client.uptime).format('d[d ]h[h ]m[m ]s[s]'), true)
        .addField(`__Creator's Homepage__`, 'https://mittens.glitch.me', true)
        .addField('__Memory Usage__', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
        .addField('__Prefix__', prefix, true)
        .setFooter(`${client.user.username} | By: Orago`)
      message.channel.send(embed);
  }
 if (message.content==(eprefix + "commandlist")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL)
        .setTitle('__Mittz Commands__')
        .setDescription('Hello! <:gold:733213975705026620>')
        .addField('__Command List 1__', commandlist.toString(), true)
        .setColor(config.color)
        .setFooter(`${client.user.username} | By: Orago`)
      message.author.send(embed);
  }
  
  
  if (message.content.startsWith(eprefix+"subscribers")) {
  const args = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
const role = args.join(' '); // Amount of messages which should be deleted
if (!role.includes("https://www.youtube.com/channel/")){message.channel.bulkDelete(1); return message.reply("not a valid link");}
var url = role.lastIndexOf("l/");var id = role.slice(url+2, Infinity);
if (!role) return message.reply('You haven\'t given a role to remove!'); // Checks if the `amount` parameter is given
//if (!isNaN(role)) return message.reply('Not a real role!'); // Checks if the `amount` parameter is a number. If not, the command throws an error
getYoutubeSubscriber(id).then((data) => {
message.channel.send("This youtube channel has "+data+" subscribers."+message.author.username);
});
  }  
  function lowercase(){
    var lower = message.content
    return lower.toLowerCase;
  }
  
  
if (lowercase==("mittz")||message.mentions.has(client.user)) {
  message.channel.send("My prefix is "+prefix+" ");   
  }
  
  var args = message.content.split(" ").slice(1);
if (message.content.startsWith(eprefix + "kawaii")) {  
  var registered = false;
  if (!servers.servers.includes(message.author.id)){return message.channel.send("Please setup kawaii counter with `"+eprefix+" kawaii self setup`")}
  const user = getUserFromMention(args[1]);
  if (args[1]) {
		if (!user) {
			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
		}
		var person = user;
	} else
var person = message.author;
  if (servers.servers.includes(message.guild.id)){var registered = true;}
if (!servers.servers.includes(person.id)){return message.channel.send(`Please ask the user @ ${person.username} to setup kawaii counter with `+"`"+eprefix+` kawaii self setup`+"`")}
var embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL)
        .setTitle(`__Guild and ${person.username}'s kawaii leaderboard__`)
        .setDescription(`Here are the scores and validity`)
        .setColor(config.color)
        .addField(`__Guild__`, ".", true)
        .addField(`__owo's__`, servers.owo[message.guild.id], true)
        .addField(`__uwu's__`, servers.uwu[message.guild.id], true)
        .addField(`__Self__`, ".", true)
        .addField(`__owo's__`, servers.owo[person.id], true)
        .addField(`__uwu's__`, servers.uwu[person.id], true)
        .addField(`__registered__`, registered, true)
        .setFooter(`${client.user.username} | By: Orago`)
    message.channel.send(embed)
}
  
//if (message.content==("what does aouab want")) {message.channel.send("to suck the last unsucked cock.") }
if (message.content.includes("owo")) {
  if (!servers.servers.includes(message.guild.id)) return message.channel.send("Please ask the server owner to setup owo's with `"+eprefix+"kawaii guild setup`");
  if (!servers.servers.includes(message.author.id)) return message.channel.send("Please ask the server owner to setup owo's with `"+eprefix+"self setup`");
servers.owo[message.guild.id]=servers.owo[message.guild.id]+1;
         fs.writeFileSync("kawaii.json", JSON.stringify(servers));
  servers.owo[message.author.id]=servers.owo[message.author.id]+1;
         fs.writeFileSync("kawaii.json", JSON.stringify(servers));
}
  
if (message.content.includes("uwu")) {
   if (!servers.servers.includes(message.guild.id)) return message.channel.send("Please ask the server owner to setup uwu's with `"+eprefix+"kawaii guild setup`");
  if (!servers.servers.includes(message.author.id)) return message.channel.send("Please ask the server owner to setup uwu's with `"+eprefix+"self setup`");
servers.uwu[message.guild.id]=servers.uwu[message.guild.id]+1;
         fs.writeFileSync("kawaii.json", JSON.stringify(servers));
  servers.uwu[message.author.id]=servers.uwu[message.author.id]+1;
         fs.writeFileSync("kawaii.json", JSON.stringify(servers));
}
  
  if (message.content==(eprefix+"self setup")) {
    if (!servers.servers.includes(message.guild.id)) return message.channel.send("Please ask the server owner to setup kawaii counter with `"+eprefix+"kawaii guild setup`");
   if (servers.servers.includes(message.author.id)) return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a profile!");
  message.channel.send("**:unlock: Beep Boop Beep! We're setting up your profile!**").then(msg=>{
       servers.servers.push(message.guild.id)
        servers.owo[message.author.id]=0;
        servers.coins[message.author.id]=0;
        servers.uwu[message.author.id]=0;
       fs.writeFileSync("kawaii.json", JSON.stringify(servers));
       setTimeout(()=>{
         msg.edit(":lock: **Your user has been added.** View the leaderboard with `kawaii leaderboard`.")
    },1500)
  })
}
  if (message.content==(eprefix+"kawaii guild setup")) {
   if (servers.servers.includes(message.guild.id)) return message.channel.send(":closed_lock_with_key: **Whoops!** This guild is already set up!");
  message.channel.send("**:unlock: Beep Boop Beep! We're setting up your profile!**").then(msg=>{
       servers.servers.push(message.guild.id)
        servers.owo[message.guild.id]=0;
        servers.uwu[message.guild.id]=0;
       fs.writeFileSync("kawaii.json", JSON.stringify(servers));
       setTimeout(()=>{
         msg.edit(":lock: **Your guild has been added.** View the leaderboard with `kawaii leaderboard`.")
    },1500)
  })
}
  if(message.content==(eprefix + "collect")){
          if(!message.channel.chest||!message.channel.chest.opened){
              //Chest exists and unopened, do something with the chest value "message.channel.chest.value", for example:
              message.member.money+=message.channel.chest.value;
              //Then at the end:
              message.channel.chest.opened=true;
            message.channel.send("done")
          } else {
              //Chest doesn't exists or already opened!
              message.channel.send("OOF");
          }
      }
if (message.content==(eprefix + "server")) {
  var embed = new Discord.MessageEmbed()
      .setAuthor(`${message.guild.name} (${message.guild.id})`, message.guild.iconURL())
        .setThumbnail(message.guild.iconURL())
        .addField('Created On', message.guild.createdAt.toLocaleString(), true)
        .addField('Guild Owner', message.guild.owner.user.tag)
        .addField('Members', message.guild.memberCount, true)
        .addField('Real Members', message.guild.members.cache.filter(member => !member.user.bot).size, true)
        .addField('Bots', message.guild.members.cache.filter(member => member.user.bot).size, true)
        .addField('Total Channels', message.guild.channels.cache.size, true)
        .addField('Text Channels', message.guild.channels.cache.filter(ch => ch.type === 'text').size, true)
        .addField('Voice Channels', message.guild.channels.cache.filter(ch => ch.type === 'voice').size, true)
        .addField('Region', message.guild.region, true)
        .addField('Created', message.guild.createdAt, true)
        .addField('Partnered', message.guild.partnered, true)
        .addField('Roles', message.guild.roles.cache.map(role => role.toString()).join(' '), true)
        .setColor('#5CC5FF')
        //.setDescription(`hey`);
        .setFooter(botname, "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
    message.channel.send(embed)
}
if (message.content==(eprefix + "homepage")) {
  const embed = new Discord.MessageEmbed()
  .setTitle("Visit homepage")
  .setAuthor("Mittens Homepage", "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2F8bitpc%20vaporwave%20blue%20cat.png?v=1594354853240")
  .setColor(0x00AE86)
  .setDescription("This is the homepage for all of the projects made by the same creator of this very bot!")
  .setFooter("Created by Orago", "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
  .setImage("https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
  .setThumbnail("https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Finbreadspread.png?v=1594354874436")
  .setTimestamp()
  .setURL("https://mittens.glitch.com")
message.channel.send(embed);
}
  var args = message.content.split(" ").slice(1);
if (message.content.startsWith(eprefix + "profile")) {  
  const user = getUserFromMention(args[1]);
  if (args[1]) {
		if (!user) {
			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
		}
		var person = user;
	} else
var person = message.author;
  const embed = new Discord.MessageEmbed()
  .setTitle(person.username)
  .setAuthor(botname, "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2F8bitpc%20vaporwave%20blue%20cat.png?v=1594354853240")
  .setColor(0x00AE86)
  .setDescription("ID: "+person.id+" ")
  
  .addField(`In ${message.guild.name} since`, message.member.joinedAt)
  .setImage(person.avatarURL())
  .setThumbnail("")
  .setFooter("Created by Orago", "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
  .setTimestamp()
message.channel.send(embed);
}
  
if (message.content.startsWith(eprefix+"createchannel")) {
    const args = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
    const text = args.join(' '); // Amount of messages which should be deleted
    if (!text) {
    message.channel.send('no text given');}
    else if(text){
    message.guild.channels.create(text, {
  type: 'text',
  permissionOverwrites: [
     {
       id: message.author.id,
       deny: ['VIEW_CHANNEL'],
    },
  ],
})
    message.channel.send(`Text channel created ${text}.`);}
  }
  
  

  
  
  if (message.content.startsWith(eprefix+"cat")) {
    
    const args = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
const text = args.join(' '); // Amount of messages which should be deleted
    
    if (!text) {let embed = new Discord.MessageEmbed()
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setColor(0xdd9323)
        .setImage('https://cataas.com/cat/says/%20');

    message.channel.send(embed);}// Checks if the `amount` parameter is given
    else if(text){let embed = new Discord.MessageEmbed()
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setColor(0xdd9323)
        .setImage('https://cataas.com/cat/says/'+text.replace(" ", "%20"));
    message.channel.send(embed);}
  }
  
  
//Owner Commands
if (message.member.roles.cache.find(r => r.name === "🐅 - Moderator")||message.member.roles.cache.find(r => r.name === "🐆 - Server Moderator")||message.member.roles.cache.find(r => r.name === "🐯 - Administrator")||message.author.id ===owner){
  
    if (message.content === eprefix+'leave-server') {
      var yes = '👍';
      var no = '👎';
      message.react(yes).then(r => {
                            message.react(no);
                    });
            message.channel.send('The bot will now leave the server.\n'+ 'Confirm with a thumb up or deny with a thumb down.');
     
      message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == yes || reaction.emoji.name == no),
                            { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == yes) {
                                            message.channel.send(`;w; bye..`);
                                             message.guild.leave()
                                              .then(g => console.log(`Left the guild ${g}`))
                                              .catch(console.error);
                                            
                                    }
                                    else
                                            message.channel.send('Operation canceled.');
                            }).catch(() => {
                                    message.channel.send('No reaction after 30 seconds, operation canceled');
                            });

    }
  
  if (message.content.startsWith(eprefix+"clear")) {
  const args = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
const amount = args.join(' '); // Amount of messages which should be deleted
if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!'); // Checks if the `amount` parameter is given
if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!'); // Checks if the `amount` parameter is a number. If not, the command throws an error
if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
if (amount < 1) return message.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1
 message.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
    message.channel.bulkDelete(messages); // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
  if(amount > 1){message.channel.send(":white_check_mark: "+amount+" messages have been deleted")} else {message.channel.send(":white_check_mark: 1 message has been deleted")};
});}
  
  let args = message.content.split(" ").slice(1);
  if (message.content.startsWith(prefix + "say")) {
    message.delete();
   message.channel.send("" + args.join(" "))
  }
  
if (!message.guild) return;
  if (message.content.startsWith(eprefix + 'kick')) {
    const user = message.mentions.users.first();
    if (user) {
      if (user=="578319500475105341") {return message.reply(`sad cat noises 3:\nbut if you really want me to leave use ${eprefix} leave-server`)};
      const member = message.guild.member(user);
      if (member) {
        var yes = '👍';
      var no = '👎';

        message.react(yes).then(r => {
                            message.react(no);
                    });
            message.reply('You are about to kick '+user.tag+'\nConfirm with a thumb up or deny with a thumb down.');
     
      message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == yes || reaction.emoji.name == no),
                            { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == yes) {
                                            member.kick('Optional reason that will display in the audit logs').then(() => {
                                      message.reply(`Successfully kicked ${user.tag}`);
                                    }).catch(err => {
                                      message.reply('I was unable to kick this member');
                                      console.error(err);
                                    });
                                            
                                    }
                                    else
                                            message.channel.send('Operation canceled.');
                            }).catch(() => {
                                    message.channel.send('No reaction after 30 seconds, operation canceled');
                            });
      } else {
        message.reply('That user isn\'t in this guild!');
      }
    } else {
      message.reply('You didn\'t mention the user to kick!');
      }
    }
  
  /*var notify = eprefix+'notify-all';
  if (message.guild && message.content.startsWith(notify)) {
  let text = message.content.slice(notify.length); // cuts off the /private partmessage.guild.members.fetch()
     client.guilds.send(text)
  .then(member.send(text))
  .catch(console.error);
  }*/
  

  
  }//else if (message.content.startsWith(prefix)) {message.channel.send("You don't have access to use this")}
  //End of all commands
});

  client.on("guildMemberRemove", function(member){
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-logs');
    channel.send(`Goodbye, ${member}..`);
});
client.on('guildMemberAdd', async member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-logs');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
  const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        const embed = new Discord.MessageEmbed()
            .setDescription(`${member.user.tag} is the ${member.guild.memberCount} to join.\nJoined using ${usedInvite.inviter.tag}\nNumber of uses: ${usedInvite.uses}`)
            .setTimestamp()
            .setTitle(`${usedInvite.url}`);
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === "bot-logs");
        if(welcomeChannel) {
            welcomeChannel.send(embed).catch(err => console.log(err));
        }
    }
    catch(err) {
        console.log(err);
    }
});

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
   client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
});


client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
});


client.on("ready", async () => {
  //client.user.setUsername("Mittz");
  client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
  //client.user.setActivity(`${sprefix} help | ${client.guilds.cache.size} guilds`, { type: 'STREAMING',url:"https://www.youtube.com/watch?v=P4i-VYcrEuc" });
  const interval=600; //in seconds
  setInterval(RandomLoot,interval*1000);
  client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });
});


function RandomLoot(){
//Chest
  var ch=client.channels.cache.get("396838715894530070");
      //var ch=client.guild.channels.cache.find(channel => channel.name === "general");
      ch.send("A chest has been dropped!");
  
      //I bind the chest variable to the channel object
      ch.chest = {
          value:100, //You can change this one
          opened:false
      }

      var disappearsAfter=60; //In seconds
      setTimeout(function(){
          ch.chest.opened=false;
          ch.send("Oh no, disappeared!")
      },disappearsAfter*1000);      

}
client.login(process.env.main_token);