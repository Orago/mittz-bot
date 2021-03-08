/* \/ Required node modules, DO NOT DELETE. \/ */
const http = require('http');
const express = require('express');
const Discord = require("discord.js");const client = new Discord.Client();
const fs = require("fs");
const app = express();
const Canvas = require('canvas');
const config = require('./config.json');
const moment = require('moment');require('moment-duration-format');
const getYoutubeSubscriber = require('getyoutubesubscriber');
const guildInvites = new Map();
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
var tinyurl = require('tinyurl');
/* /\ End /\ */

/* \/ Sync from database \/ */
/*This can be changed but make sure all the variables are still correct*/
let server = JSON.parse(fs.readFileSync(__dirname+"/servers.json"));
/* |\/ - These should be left alone.|*/
let botver = config.mainbot_ver;
let creator_id = config.creator_id;
let creator_name = config.creator_id;
let homepage = config.homepage;
let support_url = config.support_url;
var prefix = config.prefix;
var defaultprefix = config.default_prefix;
const swears = server.swears;
var time = new Date();
var votes = {};
/* /\ End /\ */

/* \/ Custom Variables \/ */
var eprefix = prefix+" ";
let beprefix = " "+eprefix;
var commandlist = [`Page 1:\n**${beprefix}help** - Show's more info.\n**${beprefix}vapor** - Create's a vaporwave background with someone's profile.\n**${beprefix}prefix** - Show's the server's prefix.\n**${beprefix}clear <amount>** - Clear's a specific amount of messages Ex. `+eprefix+'`clear 50`'+`.\n**${beprefix}cat** - Sends a random cat image.\n**${beprefix}kawaii**\n**${beprefix}me**\n**${beprefix}filter <on, off>** - Enable's / Disable's swearing Ex. \`${eprefix} filter on\`\n`];
var logchannel;/*Custom channel variables for commands with the database*/
var greetingschannel;/*Custom channel variables for commands with the database*/
var mute_time=10000;/*Time for a member to be muted.*/

/* /\ End /\ */

/* \/ Time conversion tool \/ */
function ms_seconds(x){ return x / 1000;}
function ms_minutes(x){ return x / 1000;}

do_am_pm();
var am_pm;
function do_am_pm(){
  if (time.getHours()-4 < 12){ am_pm = "AM"
  } else if (time.getHours()-4 > 12){ am_pm = "PM"
  } else {am_pm =  "broken??"}
}
/* /\ End /\ */

/* \/ Important \/ */
app.use(express.static('public'));
app.listen(process.env.PORT);
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200); 
});

client.on('shardError', error => {
	 console.error('A websocket connection encountered an error:', error);
});
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
/* /\ End /\ */



//setInterval(() => {http.get(`http://mittz-bot.glitch.me/`);}, 280000);

client.on("message", async (message) => {
  //if (url_check(message.content)){message.delete();message.author.send('Please do not use url\'s in this server!')}
  
  if (message.author.bot) return;
  
  if (message.channel.type === "text") {// beginning of if in chat
    if (server.servers.includes(message.guild.id)){
  if (server.guilds[message.guild.id].prefix){prefix=server.guilds[message.guild.id].prefix; eprefix = prefix+" ";} else {prefix='!v!'; eprefix = prefix+" ";}
    if (message.content.startsWith(eprefix)) {
    if (server.guilds[message.guild.id].commandschannel){if (server.guilds[message.guild.id].commandschannel !== message.channel.id){if(!message.member.hasPermission('ADMINISTRATOR')||message.author.id!==message.guild.ownerID){message.delete(); return message.author.send("**(Server: `"+message.guild.name+")`** Please use this in the commands channel <#"+server.guild[message.guild.id].commandschannel+">.\n`If you think this isn't correct, then please ask the owner to change the commands channel.`")}}}
    }else {prefix='!v!'; eprefix = prefix+" ";}
    
    /* \/ Swear Filter \/ */
   for (let i = 0; i < swears.length; i++) {
  const bad_word = swears[i];
  if ((message.content).toLowerCase().includes(bad_word)) {
    if(!message.guild.me.hasPermission("MANAGE_MESSAGES")){return;}
    if (message.channel.type === "text") {
      if(message.channel.nsfw){return;}
      if(message.author.id===message.guild.ownerID){return;}
      if (server.guilds[message.guild.id].filter){if(server.guilds[message.guild.id].filter==='on'){
        return message.channel.messages.fetch({ limit: 1 }).then(messages => { 
  message.channel.bulkDelete(messages); 
        message.member.send(new Discord.MessageEmbed().setTitle("O.O hey, **" + message.author.username + " **Unwanted language in** " + message.guild.name + "**.").setDescription("```I noticed that you said something that the owner added to the profanity filter, please do not continue to do this or there will be problems. ```\n`You said: "+message.content+"`\n\n`Muted for: "+ms_seconds(mute_time)+" seconds`").setColor("#ffa500"));
 message.channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
    message.channel.send(`${message.author.tag} tried to use profanity, and is muted for ${ms_seconds(mute_time)} seconds.`).then(msg => {msg.delete({ timeout: 5000 })});
          setTimeout( () => {
message.channel.updateOverwrite(message.author, { SEND_MESSAGES: true });
}, mute_time);

});
      } 
    }
    }else if (message.channel.type !== "text"||message.channel.type !== "news") {return message.author.send("``You said: "+message.content+"``");}
}
  }
      }
  /* /\ End of "Swear Filter"/\ */
    
    /* \/ All Commands \/ */   
     
    if (message.content===(eprefix+'create invite')) {
    if(!message.guild.me.hasPermission("CREATE_INSTANT_INVITE")){return message.channel.send("Missing permission `Create Invite`")}
    await message.channel.send( `\n https://cdn.discordapp.com/attachments/549225667267395596/572811777738276866/rainbow.gif`)
    await message.channel.createInvite().then(invite =>message.channel.send(invite.url+" Here is your invite link!"));
    await message.channel.send( `\n https://cdn.discordapp.com/attachments/549225667267395596/572811777738276866/rainbow.gif`)
   }
    var missing_permissions='';
  if (message.content.startsWith(eprefix+'missing permissions')) {
  if(!message.guild.me.hasPermission("MANAGE_MESSAGES")){missing_permissions+='Manage Messages, ';}
  if(!message.guild.me.hasPermission("MANAGE_CHANNELS")){missing_permissions+='Manage Channels, ';}
  if(!message.guild.me.hasPermission("MANAGE_ROLES")){missing_permissions+='Manage Roles, ';}
  if(!message.guild.me.hasPermission("MANAGE_NICKNAMES")){missing_permissions+='MANAGE_NICKNAMES(not needed rn), ';}
  if(!message.guild.me.hasPermission("ADMINISTRATOR")){missing_permissions+='Administrator, ';}
  if(!message.guild.me.hasPermission("SPEAK")){missing_permissions+='Speak, ';}
  if(!message.guild.me.hasPermission("CONNECT")){missing_permissions+='Connect, ';}
  if(!message.guild.me.hasPermission("KICK_MEMBERS")){missing_permissions+='Kick Members, ';}
  if(!message.guild.me.hasPermission("BAN_MEMBERS")){missing_permissions+='Ban Members, ';}
  if(!message.guild.me.hasPermission("CREATE_INSTANT_INVITE")){missing_permissions+='Create Instant Invite, ';}
    if (missing_permissions){
 return message.channel.send("missing permission `"+missing_permissions+"`")
    } else return message.channel.send('All good!')
  }
  }//end of if in chat
  
  function setup_message(){
  message.channel.send(`Please set-up this server with ${eprefix}server-setup`);
}
  if (message.content.startsWith('up')) {message.delete();message.reply('Yep').then(msg => {msg.delete({ timeout: 5000 })});}
  

  
  //Fun-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  if (message.content==(eprefix+"advice")) {
    message.delete();var link = fetch('https://api.adviceslip.com/advice').then(res => res.json());
    link.then(json => {
    const exampleEmbed = {
	color: 0x0099ff,
	title: 'Advice',
	fields: [
		{name:message.author.username+', here you go.',
			value: json.slip.advice
		}
	],
};
  message.channel.send({ embed: exampleEmbed })}).then(msg => {msg.delete({ timeout: 15000 })});
  }
  
 
  
   if (message.content==(eprefix+"channel")) {
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
     const exampleEmbed = {
	color: 0x0099ff,
	title: 'Command Types',
	description: 'Type one of anything in a [ ]',
	thumbnail: {url: message.author.avatarURL({ format: 'jpg' }), },
	fields: [
		{name: 'Lock Channel',value: '[locked]',inline: false,},
		{name: 'Hide Channel',value: '[hidden]',inline: false,},
	],
	timestamp: new Date(),
	footer: {text: client.user.username, icon_url: client.user.avatarURL({ format: "png", dynamic: true }),
	},
};
message.channel.send({ embed: exampleEmbed });
    message.reply('Type your answer in the next message within the next 30 seconds or the command will cancel.').then(() => {
	const filter = m => message.author.id === m.author.id;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messages => {
			if (messages.first().content.includes==prefix) {
    return message.channel.send("There is no need to use a prefix here.");
  }
    if (messages.first().content=="locked") {
    message.reply('Options [true, false]').then(() => {
	const filter = m => message.author.id === m.author.id;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messagestwo => {
			if (messagestwo.first().content.includes==prefix) {
    return message.channel.send("There is no need to use a prefix here.");
  }
    if (messagestwo.first().content=="true") {
     message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }); return message.channel.send("This channel has been `Locked`!");
  }else
    if (messagestwo.first().content=="false") {
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });return message.channel.send("This channel has been `Un-Locked`!");
  }else{message.channel.send("This is not a valid option..")}
  }).catch(() => {message.channel.send('You did not enter any input!');});
})}
    
    if (messages.first().content=="hidden") {
    message.reply('Options [true, false]').then(() => {
	const filter = m => message.author.id === m.author.id;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messagestwo => {
			if (messagestwo.first().content.includes==prefix) {
    return message.channel.send("There is no need to use a prefix here.");
  }
    if (messagestwo.first().content=="true") {
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: false });return message.channel.send("This channel has been `Hidden`!");
  }else
    if (messagestwo.first().content=="false") {
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: true });return message.channel.send("This channel has been `Un-Hidden`!");
  }else{message.channel.send("This is not a valid option..")}
  }).catch(() => {message.channel.send('You did not enter any input!');});
    })}
    
  }).catch(() => {
			message.channel.send('You did not enter any input!');
		});
});
  }
if (message.content==(eprefix+"try")) {
  message.channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
    return message.channel.send("This channel has been `Locked for you`!");
}
  
  
  if (message.content.includes==(eprefix+"channel")) {
    var command = "channel";
    if (message.content==(eprefix+command+" hide")) {
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: false });
    return message.channel.send("This channel has been `Hidden`!");
    } else
    if (message.content==(eprefix+command+" unhide")) {
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: true });
    return message.channel.send("This channel has been `Un-Hidden`!");
    } else
    if (message.content==(eprefix+command+" lock")) {
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
    return message.channel.send("This channel has been `Locked`!");
    }else
    if (message.content==(eprefix+command+" unlock")) {
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
    return message.channel.send("This channel has been `Un-Locked`!");
    }else{return message.channel.send("Options: \n[`hide`, `unhide`]\n[`lock`, `unlock`]");}
}
  
  if (message.content.startsWith(eprefix + 'avatar')) {
  if (!message.mentions.users.size) {
		return message.channel.send(`${message.author.username}'s avatar: ${message.author.avatarURL({ format: "png", dynamic: true })} `);
	}
	const avatarList = message.mentions.users.map(user => {
		return `${user.username}'s avatar: ${user.displayAvatarURL({ format: "png", dynamic: true })}`;
	});
	message.channel.send(avatarList);
  }
  
  if (message.content==(eprefix+"filter")) {
    if (!server.servers.includes(message.guild.id)){return setup_message()}
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`').then(msg => {msg.delete({ timeout: 15000 })});}
    if (server.guilds[message.guild.id].filter){message.reply('filter is currently **'+server.guilds[message.guild.id].filter+'**.').then(msg => {msg.delete({ timeout: 15000 })});}
    message.channel.send('Options `[on , off]` ').then(() => {
	const filter = m => message.author.id === m.author.id;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messages => {
			if (messages.first().content==("on")) {
      if(server.guilds[message.guild.id].filter!=='on'){
      message.channel.send("Profanity is now disallowed").then(msg => {msg.delete({ timeout: 5000 })});
      server.guilds[message.guild.id].filter='on';
      fs.writeFileSync("servers.json", JSON.stringify(server, null, 2));}
      else {message.channel.send("Profanity filter is already on!").then(msg => {msg.delete({ timeout: 5000 })});}
    } else if (messages.first().content==("off")) {
      if(server.guilds[message.guild.id].filter!=='off'){
      message.channel.send("Profanity is now allowed").then(msg => {msg.delete({ timeout: 5000 })});
      server.guilds[message.guild.id]='off';
      fs.writeFileSync("servers.json", JSON.stringify(server, null, 2));}
      else {message.channel.send("Profanity filter is already off!").then(msg => {msg.delete({ timeout: 5000 })});}
    } else {message.channel.send("Just type **on** or **off** after `"+eprefix+"filter`.").then(msg => {msg.delete({ timeout: 5000 })});}
  }).catch(() => {
			message.channel.send('You did not enter any input!');
		});
});
    
  }
  
  
  
  

  
  
  
  
  
  if (message.content.startsWith(eprefix + 'color')) {
try {
       var margs = message.content.split(" ");
        const canvas = Canvas.createCanvas(250, 250);
       const ctx = canvas.getContext('2d');
ctx.fillStyle = margs[2];
ctx.fillRect(0, 0, canvas.width, canvas.height);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');
    message.channel.send(`Here is your color, ${message.author.tag}!`, attachment).then(msg => {msg.delete({ timeout: 7000 })});
    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`).then(msg => {msg.delete({ timeout: 5000 })});
    }
  }
  
  function profile_card(user_type){
    if (!server.profiles.includes(message.author.id)){return}
        const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage(server.users[user_type.id].background).then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
           Canvas.loadImage(user_type.avatarURL({ format: "png", dynamic: true })).then((pfp) => {
             Canvas.loadImage('https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png').then((xp) => {
               Canvas.loadImage('https://www.stickpng.com/assets/images/585e4beacb11b227491c3399.png').then((lb) => {
                  Canvas.loadImage('https://cdn.discordapp.com/attachments/660390332772646922/744094457317818388/discordowner.svg').then((owner) => {
                   Canvas.loadImage('https://discordapp.com/assets/ccebe0b729ff7530c5e37dbbd9f9938c.svg').then((rich) => {
                      let leaderboard = server.xp
                      const ordered = {};
                      Object.keys(leaderboard).sort().forEach(function(key) {
                         ordered[key] = leaderboard[key];
                      });
                     
                     ctx.drawImage(xp, 225, 90, 50, 50);
                     ctx.drawImage(lb, 40, 205, 30, 30);

                     if (server.users[user_type.id].badges.includes("rich")) {
                       ctx.drawImage(rich, 320, 147, 40, 40);}
                     if (message.author.id===message.guild.ownerID) {
                       ctx.drawImage(owner, 185, 50, 55, 40);}
                     ctx.font = '40px sans-serif';
                     ctx.fillStyle = server.user[user_type.id].color;
                     ctx.fillText(`${user_type.tag}`, 240, 90);
                     ctx.font = '25px sans-serif';
                     ctx.fillText(`${server.users[user_type.id].xp}xp`, 270, 125);
                     ctx.fillText(`${server.users[user_type.id].coins} coins`, 270, 170);
                     ctx.fillText(`Bio: ${server.user[user_type.id].description}`, 77, 229);
                    ctx.strokeStyle = '#74037b';
	                   ctx.strokeRect(0, 0, canvas.width, canvas.height);
	                   ctx.beginPath();
	                   ctx.arc(110, 125, 75, 0, Math.PI * 2, true);
	                   ctx.closePath();
	                   ctx.clip();
                     ctx.drawImage(pfp, 30, 45, 150, 150);
                     const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');
                     message.channel.send(`Here is your profile, ${user_type.tag}!`, attachment);
                   })
                 })
               })
             })
       })
       })
  }
  
  if (message.content.startsWith(eprefix + 'profile')) {
  if (!message.mentions.users.size) {
		return profile_card(message.author);
	}
	const avatarList = message.mentions.users.map(user => {
profile_card(user)
	});

  }
  
if (message.content.startsWith (eprefix+'votekick')) {
  if (!message.mentions.users.size) {
		return message.channel.send('You neet to mention someone to kick');
	}
  var user = message.mentions.users.first();
 // if (user.id == message.author.id){return message.channel.send(`You cannot vote for yourself idiot.`)}
 if (votes[message.guild.id][user.id] == undefined||votes[user.id] == null){
  votes[message.guild.id][user.id]=[];}
  if (votes[message.guild.id][user.id].includes(message.author.id)) {return message.channel.send(`You have already voted`)}
  votes[user.id].push(message.author.id)
  message.channel.send(`<@${user.id}> | ${JSON.stringify(votes)} | ${message.guild.members.cache.filter(member => !member.user.bot).size}`);
	message.channel.send(`You voted <@${user.id}> | <@${votes[message.guild.id][user.id][votes[message.guild.id][user.id].length-1]}>`);
  
  }
     
  //if(message.guild.id==728008557244448788&&(message.channel.id!=728025726556569631)){ return;}

  if (message.content == eprefix+'creator') {
    const creator = new Discord.MessageEmbed()
            .setColor(0xf1c40f)
            .setTitle('Programmer & Artist')
            .setAuthor(client.guilds.resolve('396838715894530068').members.resolve('193127888646701056').user.tag, client.user.avatarURL({ format: "png", dynamic: true }))
            .setThumbnail(client.guilds.resolve('396838715894530068').members.resolve('193127888646701056').user.avatarURL())
            .setDescription('')
            .setTimestamp(new Date())
            .setFooter('Orago Dev', 'https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664');
        message.channel.send(creator);
	}
  
  if (message.content.startsWith(eprefix + 'ping')) {
    try {
      message.channel.send("Pinging...").then(msg=>{ 
      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      //.addField("⌛ Latency", `**${message.createdTimestamp -  message.createdTimestamp}ms**`)
      .addField("💓 API", `**${Math.floor(client.ws.ping)}ms**`)
       setTimeout(()=>{
         msg.edit(`🏓 Pong!`, embed)
    },1500)
  })
    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`);
    }
  } 
  
  if (message.content==(eprefix + "help")||message.content==("!v! help")||message.content==("mittz help")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true }))
        .setTitle('__'+client.user.username+' Information__')
        .setDescription('Hello! <:gold:733213975705026620> I\'m '+client.user.username+'.\nI can do lots of things like play audio from a few radio channels, help moderate a server, provide fun commands, run a small economy, and have a decent amount of other utility features. \nUse `'+eprefix+'commandlist` to see what other things i can do.')
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
      message.channel.send(embed).then(msg => {msg.delete({ timeout: 8000 })});
  }
  
 if (message.content==(eprefix + "commands")||message.content==("!v! commands")||message.content==(eprefix+" commandlist")||message.content==("!v! commandlist")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL)
        .setTitle('__'+client.user.username+' Commands__')
        .setDescription('Hello! <:gold:733213975705026620>')
        .addField('__Command List 1__', commandlist, true)
        .setColor(config.color)
        .setFooter(`${client.user.username} | By: Orago`)
      message.author.send(embed);
   message.reply('``A list of commands has been sent to your direct messages.``').then(msg => {msg.delete({ timeout: 5000 })});;
  }


  
  
/*if (message.content.startsWith("mittz")) {
  message.channel.send("The prefix for this guild is "+prefix+" ");   

  }*/
  if (message.channel.type === "text") {
  var kargs = message.content.split(" ").slice(1);
if (message.content.startsWith(eprefix + "leaderboard")) {
  if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
  var registered = false;
  if (!server.servers.includes(message.guild.id)&&!server.profiles.includes(message.author.id)) return message.channel.send("Please ask the server owner to setup "+client.user.username+" economy with `"+eprefix+"guild setup` then set up your profile with`"+eprefix+"self setup`");
  if (!server.profiles.includes(message.author.id)){return message.channel.send("Please setup "+client.user.username+" economy with `"+eprefix+"self setup`")}
  const user = getUserFromMention(kargs[1]);
  if (kargs[1]) {
		if (!user) {
			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
		}
		var person = user;
	} else
var person = message.author;
  if (server.servers.includes(message.guild.id)){var registered = true;}
if (!server.profiles.includes(person.id)){return message.channel.send(`Please ask the user @ ${person.username} to setup `+client.user.username+`economy with `+"`"+eprefix+`self setup`+"`")}
var embed = new Discord.MessageEmbed()
        .setThumbnail(message.author.avatarURL({ format: 'jpg' }))
        .setTitle(`__Guild and ${person.username}'s kawaii leaderboard__`)
        .setDescription(`Here are the scores and validity`)
        .setColor(config.color)
        .addField(`__Guild__`, ".", true)
        .addField(`__owo's__`, server.owo[message.guild.id], true)
        .addField(`__uwu's__`, server.uwu[message.guild.id], true)
        .addField(`__Self__`, ".", true)
        .addField(`__owo's__`, server.owo[person.id], true)
        .addField(`__uwu's__`, server.uwu[person.id], true)
        .addField(`__registered__`, registered, true)
        .setFooter(`${client.user.username} | By: Orago`)
    message.channel.send(embed)
}

if (message.content.startsWith(eprefix + "account")) {
  var registered = false;
  if (!server.servers.includes(message.guild.id)&&!server.profiles.includes(message.author.id)) return message.channel.send("Please ask the server owner to setup "+client.user.username+" economy with `"+eprefix+"guild setup` then set up your profile with`"+eprefix+"self setup`");
  if (!server.profiles.includes(message.author.id)){return message.channel.send("Please setup "+client.user.username+" economy with `"+eprefix+"self setup`")}
  const user = getUserFromMention(kargs[1]);
  if (kargs[1]) {
		if (!user) {
			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
		}
		var person = user;
	} else
var person = message.author;
  if (server.servers.includes(message.guild.id)){var registered = true;}
if (!server.profiles.includes(person.id)){return message.channel.send(`Please ask the user @ ${person.username} to setup `+client.user.username+`economy with `+"`"+eprefix+`self setup`+"`")}
var embed = new Discord.MessageEmbed()
        embed.setThumbnail(client.user.avatarURL({ format: "png", dynamic: true }))
        embed.setTitle(`__Guild and ${person.username}'s kawaii leaderboard__`)
        embed.setDescription(`Here are the scores and validity`)
        embed.setColor(config.color)
        embed.addField(`__coin's__`, server.coins[person.id], true)
        embed.addField(`__exp__`, server.xp[person.id], true)
        embed.addField(`__owo's__`, server.owo[person.id], true)
        embed.addField(`__uwu's__`, server.uwu[person.id], true)
        embed.setFooter(`${client.user.username} | By: Orago`)
    message.channel.send(embed)
}
    
  if (message.content==(eprefix+"self setup")) {
    if (!server.servers.includes(message.guild.id)) return message.channel.send("Please ask the server owner to setup "+client.user.username+" economy with `"+eprefix+"guild setup`");
   if (server.profiles.includes(message.author.id)) return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a profile!");
  message.channel.send("**:unlock: Beep Boop Beep! We're setting up your profile!**").then(msg=>{
       server.profiles.push(message.author.id)
    server.users[message.author.id]=
    { coins:50, xp:0,
     background:"https://convertingcolors.com/plain-2C2F33.svg", description:message.author.id, 
     color:"#000000",
     creation_date:`${(time.getMonth()+1)}/${(time.getDate())}/${(time.getFullYear())} ${time.getHours()-4}:${time.getMinutes()}:${time.getSeconds()} ${am_pm}`
    }
    fs.writeFileSync("servers.json", JSON.stringify(server, null, 2));
       setTimeout(()=>{
         msg.edit(":lock: **Your user has been added.** View the leaderboard with "+eprefix+"`profile`.")
    },1500)
  })
}




  }
if (message.content==(eprefix+'server')) {
  if (message.channel.type !== "text")return;
  var embed = new Discord.MessageEmbed()
      .setAuthor(`${message.guild.name} (${message.guild.id})`, message.guild.iconURL())
        .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true }))
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
        .setColor(config.color)
        .setFooter(client.user.username, client.user.avatarURL({ format: "png", dynamic: true }))
    message.channel.send(embed).then(msg => {msg.delete({ timeout: 8000 })});
}
  
  if (message.content==(eprefix + "members")) {
    message.delete();
    
  const embed = new Discord.MessageEmbed()
  .setAuthor(message.guild.name, message.guild.iconURL())
  .setColor(config.color)
  .setDescription("Members counter.")
  .addField('Members', message.guild.memberCount, true)
  .addField('Real/Active Members', message.guild.members.cache.filter(member => !member.user.bot).size, true)
  .addField('Bots', message.guild.members.cache.filter(member => member.user.bot).size, true)
  .setTimestamp()
message.channel.send(embed).then(msg => {msg.delete({ timeout: 8000 })});
}
  
  
if (message.content==(eprefix + "homepage")) {
  const embed = new Discord.MessageEmbed()
  .setTitle("Visit homepage")
  .setAuthor("Mittens Homepage", "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2F8bitpc%20vaporwave%20blue%20cat.png?v=1594354853240")
  .setColor(config.color)
  .setDescription("This is the homepage for all of the projects made by the same creator of this very bot!")
  .setFooter("Created by Orago", client.user.avatarURL({ format: "png", dynamic: true }))
  .setImage("https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
  .setThumbnail("https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Finbreadspread.png?v=1594354874436")
  .setTimestamp()
  .setURL("https://mittens.glitch.com")
message.channel.send(embed).then(msg => {msg.delete({ timeout: 8000 })});
}
  
  function draw_guys(user_info){
  const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
   Canvas.loadImage('https://cdn.glitch.com/ecec1dd0-4cb5-43ec-8d0f-c30d2f009ea3%2F7xb1nf8cz8ss31.png').then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
           Canvas.loadImage(user_info.avatarURL({ format: 'jpg' })).then((icon) => {
Canvas.loadImage('https://cdn.discordapp.com/attachments/741450918020513813/742241361968758804/boxie32bfull.png').then((boxie) => {            
   ctx.drawImage(boxie, 642, 192, 48, 48);
  ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
ctx.moveTo(110, 75);
	// Pick up the pen
	ctx.beginPath();
	// Start the arc to form a circle
	ctx.arc(410, 130, 40, 0, Math.PI * 2, true);
	// Put the pen down
	ctx.closePath();
	// Clip off the region you drew on
	ctx.clip();
                      ctx.drawImage(icon, 370, 90, 80, 80);//150
                     const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');
                     return message.channel.send(`Here is your profile, ${user_info.tag}!`, attachment);
              })
             })
           })
}
  
function draw_vapor(user_info){
  const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
   Canvas.loadImage('https://img.freepik.com/free-vector/retro-vaporwave-background-cyberpunk-laser-grid-80s-style-abstract-futuristic-landscape_87408-125.jpg').then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
           Canvas.loadImage(user_info.avatarURL({ format: 'jpg' })).then((icon) => {
Canvas.loadImage('https://cdn.discordapp.com/attachments/741450918020513813/742241361968758804/boxie32bfull.png').then((boxie) => {
                     ctx.drawImage(boxie, 642, 192, 48, 48);
                     ctx.font = '40px sans-serif';
                     if (user_info.id===creator_id){ctx.fillStyle = "#deff1a";}
                     else {ctx.fillStyle = "#ffffff";}
                     ctx.fillText(`${user_info.tag}`, 240, 90);
                     ctx.fillStyle = "#ffffff";
                     ctx.font = '25px sans-serif';
                     ctx.fillText(`ID: ${user_info.id}`, 240, 150);
                      ctx.strokeStyle = '#74037b';
	                    ctx.strokeRect(0, 0, canvas.width, canvas.height);
	                    ctx.beginPath();
	                    ctx.arc(100, 125, 75, 0, Math.PI * 2, true);
	                    ctx.closePath();
	                    ctx.clip();
                      ctx.drawImage(icon, 25, 25, 150, 150);
                     const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');
                     return message.channel.send(`Here is your profile, ${user_info.tag}!`, attachment);
              })
             })
           })
}
  
if (message.content.startsWith (eprefix+'vapor')) {
  if (!message.mentions.users.size) {
		return draw_vapor(message.author)
	}
	const avatarList = message.mentions.users.map(user => {
		return draw_vapor(user)
	});
	message.channel.send(avatarList);
  
  }
  if (message.content.startsWith (eprefix+'uh')) {
  if (!message.mentions.users.size) {
		return draw_guys(message.author)
	}
	const avatarList = message.mentions.users.map(user => {
    if (user.id === '193127888646701056'){return message.reply("You Can't uh the great one, but nice try though,").then(msg => {msg.delete({ timeout: 5000 })});}
		return draw_guys(user)
    message.channel.send(avatarList);
	});
	
  
  }
  if (message.content === eprefix+'cat') {
    let width=(Math.random()*1800+200)|0;let height=(Math.random()*1800+200)|0;
		message.channel.send(new Discord.MessageEmbed().setColor("ORANGE").setDescription("**Meow!**").setImage("http://placekitten.com/"+width+"/"+height+"/"));
  }

 
/*
  if (message.content.startsWith(eprefix+"play")) {
    if(!message.guild.me.hasPermission("CONNECT")){return message.reply('Missing Permission `Connect`')}
    if(!message.guild.me.hasPermission("SPEAK")){return message.reply('Missing Permission `Speak`')}
  //if(message.guild.id==396838715894530068&&(message.channel.id!=741545026055569438)){ return message.author.send("You cant do this here")}
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {return message.reply('please join a voice channel first!');}  
    //if (voiceChannel && voiceChannel.id !== "741450921690791996") {return message.channel.send("please join the music channel")}
  if (message.channel.type !== 'text') return;
  const args = message.content.split(' ').slice(2); 
const type = args.join(' '); 
if (!type) return message.reply('The currently available radio\'s are lofi, vaporwave, jpop, and kpop.\nEx. '+eprefix+' play lofi'); 
if (type == 'lofi') {message.reply('you are now listening to the '+type+' radio.');
voiceChannel.join().then(connection => {
			const dispatcher = connection.play('http://hyades.shoutca.st:8043/stream', { volume: 1 });
			dispatcher.on('finish', () => voiceChannel.leave());
		});} 
else if (type == 'vaporwave') {message.reply('you are now listening to the '+type+' radio.');
voiceChannel.join().then(connection => {
			const dispatcher = connection.play('http://radio.plaza.one/mp3', { volume: 1 });
			dispatcher.on('finish', () => voiceChannel.leave());
		});} 
else if (type == 'jpop') {message.reply('you are now listening to the '+type+' radio. This station is hosted by https://listen.moe/');
voiceChannel.join().then(connection => {
			const dispatcher = connection.play('https://listen.moe/fallback', { volume: 1 });
			dispatcher.on('finish', () => voiceChannel.leave());
		});}
else if (type == 'kpop') {message.reply('you are now listening to the '+type+' radio. This station is hosted by https://listen.moe/');
voiceChannel.join().then(connection => {
			const dispatcher = connection.play('https://listen.moe/kpop/fallback', { volume: 1 });
			dispatcher.on('finish', () => voiceChannel.leave());
		});}
  else message.reply('There is no such radio with this name');
  }
 */ 
 if (message.content === eprefix+'invite bot') {
    const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`Invite ${client.user.username} to your server!`)
			.setURL(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
		message.author.send(embed).then(msg => {msg.delete({ timeout: 9000 })});
   
  }
  /*
 if (message.content === eprefix+'radio source') {
   if(!message.guild.me.hasPermission("EMBED_LINKS")){return message.reply('Missing Permission `Embed Links`')}
 var embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username} (${message.author.id})`)
        .setThumbnail(message.author.avatarURL())
        .addField('Lofi', 'http://hyades.shoutca.st:8043/stream',true)
        .addField('Vaporwave', 'http://radio.plaza.one/mp3',true)
        .addField('Jpop', 'https://listen.moe/fallback,true')
        .addField('Kpop', 'https://listen.moe/kpop/fallback',true)
        .setColor('#5CC5FF')
        .setFooter(client.user.username, "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
    message.author.send(embed)
  }
  */
  if (message.content === eprefix+'permissions') {
if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
 var embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username} (${message.author.id})`)
        .setThumbnail(message.author.avatarURL())
        .addField('Administrator', message.member.hasPermission('ADMINISTRATOR'),true)
        .addField('Ban Members', message.member.hasPermission('BAN_MEMBERS'),true)
        .addField('Kick Members', message.member.hasPermission('KICK_MEMBERS'),true)
        .addField('Manage Channels', message.member.hasPermission('MANAGE_CHANNELS'),true)
        .addField('Manage Guild', message.member.hasPermission('MANAGE_GUILD'),true)
        .addField('Manage Messages', message.member.hasPermission('MANAGE_MESSAGES'),true)
        .addField('Manage Nicknames', message.member.hasPermission('MANAGE_NICKNAMES'),true)
        .addField('Manage Roles', message.member.hasPermission('MANAGE_ROLES'),true)
        .addField('Manage Webhooks', message.member.hasPermission('MANAGE_WEBHOOKS'),true)
        .addField('Manage Emojis', message.member.hasPermission('MANAGE_EMOJIS'),true)
        .addField('Change Nickname', message.member.hasPermission('CHANGE_NICKNAME'),true)
        .addField('Stream', message.member.hasPermission('STREAM'),true)
        .addField('Connect', message.member.hasPermission('CONNECT'),true)
        .addField('Speak', message.member.hasPermission('SPEAK'),true)
        .addField('Priority Speaker', message.member.hasPermission('PRIORITY_SPEAKER'),true)
        .addField('Mute Members', message.member.hasPermission('MUTE_MEMBERS'),true)
        .addField('Deafen Members', message.member.hasPermission('DEAFEN_MEMBERS'),true)
        .addField('Move Members', message.member.hasPermission('MOVE_MEMBERS'),true)
        .addField('Use VAD (voice activity direction)', message.member.hasPermission('USE_VAD'),true)
        .addField('Add Reactions', message.member.hasPermission('ADD_REACTIONS'),true)
        .addField('Send Messages', message.member.hasPermission('SEND_MESSAGES'),true)
        .addField('Send TTS Messages', message.member.hasPermission('SEND_TTS_MESSAGES'),true)
        .addField('Create Instant Invite', message.member.hasPermission('CREATE_INSTANT_INVITE'),true)
        .addField('Embed Links', message.member.hasPermission('EMBED_LINKS'),true)
        .addField('Attach Files', message.member.hasPermission('ATTACH_FILES'),true)
        .addField('Read Message History', message.member.hasPermission('READ_MESSAGE_HISTORY'),true)
        .addField('Mention Everyone', message.member.hasPermission('MENTION_EVERYONE'),true)
        .addField('Use External Emojis', message.member.hasPermission('USE_EXTERNAL_EMOJIS'),true)
        .addField('View Channel', message.member.hasPermission('VIEW_CHANNEL'),true)
        .addField('View Audit Log', message.member.hasPermission('VIEW_AUDIT_LOG'),true)
        .addField('View Guild Insights', message.member.hasPermission('VIEW_GUILD_INSIGHTS'),true)
        .setColor('#5CC5FF')
        .setFooter(client.name, "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
    message.channel.send(embed).then(msg => {msg.delete({ timeout: 15000 })});
  }
  
  
  
  
  /* \/ DM COMMANDS \/ */
  if (message.channel.type === "dm") {
    if (message.content.startsWith("mittz")) {message.channel.send("Ready when you are!").then(msg => {msg.delete({ timeout: 15000 })}).catch(console.error);}
    if (message.content.startsWith("help")) {
    var embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username} (${message.author.id})`)
        .setThumbnail(message.author.avatarURL())
        .addField('Need to contact the bot developer?', '<@193127888646701056>',true)
        .addField('Dont know any commands?','simple! just say `!v! help` or `!v! commandlist`',true)
        .setColor('#5CC5FF')
        .setFooter(client.name, "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
    message.channel.send(embed)
    }
  }
  /* /\ End of "DM COMMANDS" /\ */
  
/* \/ Bot Owner Commands \/ */
  if (message.author.id===creator_id){
if (message.content==(eprefix+"restart")) {
    if (message.author.id!==creator_id){return message.reply("Only the owner of me `"+client.user.username+"` can do this").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error)}
    message.channel.send("restarting now!")
    setTimeout(()=>{
         process.exit();
    },10)
  }
  }/* /\ End of "Bot Owner COmmands"/\ */
  
/* \/ Admin & Staff Commands */
if (message.channel.type === "text" &&(message.member.hasPermission('ADMINISTRATOR')||message.author.id===creator_id||message.author.id==="123413327094218753")){

  if (message.content==(eprefix+"server setup")) {
   if (server.servers.includes(message.guild.id)) return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a profile!");
  message.channel.send("**:unlock: Beep Boop Beep! We're setting up your profile!**").then(msg=>{
       server.servers.push(message.guild.id)
    server.guilds[message.guild.id]=
    { prefix:'!v!',filter:'off',commandschannel:undefined,logschannel:undefined,greetingschannel:undefined
    }
    fs.writeFileSync("servers.json", JSON.stringify(server, null, 2));
       setTimeout(()=>{
         msg.edit(":lock: **Your server has been setup.**")
    },1500)
  })
}
  
  if (message.content.startsWith(eprefix+"set-prefix")) {
    if (!server.servers.includes(message.guild.id)){return setup_message}
  const args = message.content.split(' ').slice(2); 
const prefix_given = args.join(' '); 
if (!prefix_given) return message.reply('You haven\'t given a prefix to be set'); 
     if (server.guilds[message.guild.id].prefix!=='!v!') return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a prefix!");
  message.channel.send("**:unlock: Beep Boop Beep! We're updating your prefix**").then(msg=>{
        server.guilds[message.guild.id].prefix=prefix_given;
       fs.writeFileSync("servers.json", JSON.stringify(server, null, 2));
       setTimeout(()=>{
         msg.edit(":lock: **Prefix updated to `"+server.guilds[message.guild.id].prefix+"`**.")
    },1500)
  })
}
  if (message.content==(eprefix+"reset-prefix")||message.content==("mittz reset-prefix")||message.content==("!v! reset-prefix")) {
if (!server.servers.includes(message.guild.id)){return setup_message}
   if (server.guilds[message.guild.id].prefix==='!v!') return message.channel.send(":closed_lock_with_key: **Whoops!** This is already the default prefix!");
  message.channel.send("**:unlock: Beep Boop Beep! We're updating your prefix**").then(msg=>{
      msg.delete({ timeout: 5000 })
        server.guilds[message.guild.id].prefix='!v!';
       fs.writeFileSync("servers.json", JSON.stringify(server, null, 2));
       setTimeout(()=>{msg.edit(":lock: **Prefix reset to `"+server.guilds[message.guild.id].prefix+"`!**.")},1500)
  })
}
  
  
  if (message.content==eprefix+"stop") {
    const voiceChannel = message.member.voice.channel;voiceChannel.leave();message.channel.send("audio ended").then(msg => {msg.delete({ timeout: 10000 })});
  }
  
  if (message.content.startsWith(eprefix+"createrole")) {
    if(!message.guild.me.hasPermission("MANAGE_ROLES")){return message.reply('Missing Permission `Manage Roles`').then(msg => {msg.delete({ timeout: 5000 })})}
  const args = message.content.split(' ').slice(2); 
const name = args.join(' '); 
 var yes = '👍';var no = '👎';
    if (!name) return message.channel.send('Ex. `'+eprefix+'createrole catto`').then(msg => {msg.delete({ timeout: 5000 })}); 
    let role_check = message.member.guild.roles.cache.find(role => role.name === name);
if(!role_check) {
	message.react(yes).then(r => {message.react(no);});
message.guild.roles.create({ data: { name: name, permissions: ['READ_MESSAGE_HISTORY', 'SEND_MESSAGES','VIEW_CHANNEL'] } });
message.reply(`Role "`+name+`" has been created !`).then(msg => {msg.delete({ timeout: 5000 })});
            message.channel.send('Would you also like to get this role').then(msg => {msg.delete({ timeout: 10000 })})
      message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == yes || reaction.emoji.name == no),
                            { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == yes) {
                                      var role= message.member.guild.roles.cache.find(role => role.name === name);
                                      message.member.roles.add(role);
                                      message.reply("You have given yourself the \""+name+"\" role.").then(msg => {msg.delete({ timeout: 5000 })}); 
                                    }
                                    else message.channel.send('Operation canceled.').then(msg => {msg.delete({ timeout: 5000 })});
                            }).catch((err) => {message.channel.send('No reaction after 30 seconds, operation canceled').then(msg => {msg.delete({ timeout: 5000 })});console.log(err)});
}
else {
	message.channel.send("The role \""+name+"\" already exists.").then(msg => {msg.delete({ timeout: 5000 })});
}    
}

  if (message.content.startsWith(eprefix+"createchannel")) {
    if(!message.guild.me.hasPermission("MANAGE_CHANNELS")){return message.reply('Missing Permission `Manage Channels`').then(msg => {msg.delete({ timeout: 5000 })})}
    const args = message.content.split(' ').slice(2);
    const text = args.join(' '); 
    if (!text) {
    message.channel.send('no text given');}
    else if(text){
    message.guild.channels.create(text, {
  type: 'text',
  permissionOverwrites: [
     {id: message.author.id,deny: ['VIEW_CHANNEL'],},
  ],
})
    message.channel.send(`Text channel created ${text}.`);}
  }
  
    if (message.content === eprefix+'leave-server') {
      var yes = '👍';
      var no = '👎';
      message.react(yes).then(r => {message.react(no);});
      message.channel.send('The bot will now leave the server.\n'+ 'Confirm with a thumb up or deny with a thumb down.').then(msg => {msg.delete({ timeout: 5000 })});
      message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == yes || reaction.emoji.name == no),
                            { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == yes) {
                                            message.channel.send(`;w; bye..`);
                                             message.guild.leave().then(g => console.log(`Left the guild ${g}`)).catch(console.error);
                                    }else
                                    message.reply('Operation canceled.').then(msg => {msg.delete({ timeout: 5000 })});
                            }).catch(() => {
                                  message.channel.reply('No reaction after 30 seconds, operation canceled').then(msg => {msg.delete({ timeout: 5000 })});
                            });
    }
  
  if (message.content.startsWith(eprefix+"clear")) {
    if(!message.guild.me.hasPermission("MANAGE_MESSAGES")){return message.reply('Missing Permission `Manage Messages`').then(msg => {msg.delete({ timeout: 5000 })})}
  const args = message.content.split(' ').slice(2); 
const amount = args.join(' '); 
if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!').then(msg => {msg.delete({ timeout: 3000 })}); 
if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!').then(msg => {msg.delete({ timeout: 3000 })}); 
if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!').then(msg => {msg.delete({ timeout: 3000 })});
if (amount < 1) return message.reply('You have to delete at least 1 message!').then(msg => {msg.delete({ timeout: 3000 })});
 message.channel.messages.fetch({ limit: amount }).then(messages => { 
    message.channel.bulkDelete(messages); 
  if(amount > 1){message.reply(":white_check_mark: "+amount+" messages have been deleted").then(msg => {msg.delete({ timeout: 1000 })});} else {message.reply(":white_check_mark: 1 message has been deleted").then(msg => {msg.delete({ timeout: 1000 })});};
});}
  if (message.content.startsWith(eprefix+"channel position")) {
    if(!message.guild.me.hasPermission("MANAGE_MESSAGES")){return message.reply('Missing Permission `Manage Messages`').then(msg => {msg.delete({ timeout: 5000 })})}
  const args = message.content.split(' '); 
const amount = args.splice(3); 
if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!').then(msg => {msg.delete({ timeout: 3000 })}); 
if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!').then(msg => {msg.delete({ timeout: 3000 })}); 
if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!').then(msg => {msg.delete({ timeout: 3000 })});
if (amount < 1) return message.reply('You have to delete at least 1 message!').then(msg => {msg.delete({ timeout: 3000 })});
 message.channel.messages.fetch({ limit: amount }).then(messages => { 
    message.channel.bulkDelete(messages); 
  if(amount > 1){message.reply(":white_check_mark: "+amount+" messages have been deleted").then(msg => {msg.delete({ timeout: 1000 })});} else {message.reply(":white_check_mark: 1 message has been deleted").then(msg => {msg.delete({ timeout: 1000 })});};
});}
 
  //let args = message.content.split(" ").slice(1);
  if (message.content.startsWith(eprefix + "say")) { message.delete();message.channel.send("" + (message.content.split(" ").slice(2)).join(" "))}
  
  
if (!message.guild) return;
  if (message.content.startsWith(eprefix + 'kick')) {
      if(!message.guild.me.hasPermission("KICK_MEMBERS")){return message.reply('Missing Permission `Kick Members`').then(msg => {msg.delete({ timeout: 5000 })})}
    const user = message.mentions.users.first();
    if (user) {
      if (user==client.user.id) {return message.reply(`sad cat noises 3:\nbut if you really want me to leave use ${eprefix} leave-server`)};
      const member = message.guild.member(user);
      if(member.bot|user.bot||user.id=='193127888646701056') {return message.reply('I cannot kick a bot, you must do this manually.').then(msg => {msg.delete({ timeout: 8000 })});}
      if (member) {var yes = '👍'; var no = '👎';
        message.react(yes).then(r => {message.react(no);});
            message.reply('You are about to kick '+user.tag+'\nConfirm with a thumb up or deny with a thumb down.').then(msg => {msg.delete({ timeout: 8000 })});
      message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == yes || reaction.emoji.name == no),
                            { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == yes) {
                                      
                                            member.kick('Optional reason that will display in the audit logs').then(() => {
                                              user.send(new Discord.MessageEmbed().setTitle("You have been **Yeeted** by, `" + member.tag + "` from `" + member.guild.name + "`, Aka Kicked").setDescription("```- If you think this was accidental, please contact the server Owner or staff\n- If you think this is a bot error contact my developer!```").setColor("#daff00"));
                                            message.channel.send(` ${user.tag} has been **Yeeted** / Kicked by ${message.author.tag}.`);
                                    }).catch(err => {
                                      message.reply('I was unable to kick this member');
                                      user.send("<@"+message.author.tag+"> has attempted to kick you");
                                      console.error(err);
                                    });         
                                    }
                                    else message.reply('Operation canceled.').then(msg => {msg.delete({ timeout: 5000 })});
                            }).catch(() => {
                                    message.reply('No reaction after 30 seconds, operation canceled').then(msg => {msg.delete({ timeout: 5000 })});
                            });
      } else {message.reply('That user isn\'t in this guild!').then(msg => {msg.delete({ timeout: 5000 })});}
    } else {message.reply('You didn\'t mention the user to kick!').then(msg => {msg.delete({ timeout: 5000 })}); }
  }  
  
  if (message.content.startsWith(eprefix + 'ban')) {
    if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {return message.reply(':lock: **You** need `BAN_MEMBERS` Permissions to execute `ban`').then(msg => {msg.delete({ timeout: 5000 })})}
        if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) {return message.reply(':lock: **I** need `BAN_MEMBERS` Permissions to execute `ban`').then(msg => {msg.delete({ timeout: 5000 })})}
    const user = message.mentions.users.first();
    if (user) {
      if (user==client.user.id) {return message.reply(`sad cat noises 3:\nbut if you really want me to leave use ${eprefix} leave-server`)};
      const member = message.guild.member(user);
      if(member.bot|user.bot||user.id=='193127888646701056') {return message.reply('I cannot kick a bot, you must do this manually.').then(msg => {msg.delete({ timeout: 5000 })});}
      if (member) {var yes = '👍'; var no = '👎';
        message.react(yes).then(r => {message.react(no);});
            message.reply('You are about to ban '+user.tag+'\nConfirm with a thumb up or deny with a thumb down.').then(msg => {msg.delete({ timeout: 5000 })});
      message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == yes || reaction.emoji.name == no),
                            { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == yes) {
                                            member.ban('Optional reason that will display in the audit logs').then(() => {
                                              user.send(new Discord.MessageEmbed().setTitle("You have been `Banned` by, `" + member.tag + "` from `" + member.guild.name + "`.").setDescription("```- If you think this was accidental, please contact the server Owner or staff\n- If you think this is a bot error contact my developer!```").setColor("#daff00"));
                                      message.reply(` ${user.tag} has been **beamed outta here** / Banned by ${message.author.tag}, Aka. Banned.`+"\nhttps://cdn.glitch.com/ecec1dd0-4cb5-43ec-8d0f-c30d2f009ea3%2Fluna_bite.gif"); 
                                    }).catch(err => {
                                      message.reply('I was unable to ban this member').then(msg => {msg.delete({ timeout: 5000 })});
                                      user.send("<@"+message.author.tag+"> has attempted to ban you");
                                      console.error(err);
                                    });         
                                    }
                                    else message.reply('Operation canceled.').then(msg => {msg.delete({ timeout: 5000 })});
                            }).catch(() => {
                                    message.reply('No reaction after 30 seconds, operation canceled').then(msg => {msg.delete({ timeout: 5000 })});
                            });
      } else {message.reply('That user isn\'t in this guild!').then(msg => {msg.delete({ timeout: 5000 })});}
    } else {message.reply('You didn\'t mention the user to kick!').then(msg => {msg.delete({ timeout: 5000 })}); }
  }  
  
  if(message.content.startsWith(eprefix+"debug")){
    var args = message.content.split(" ").splice(2)
  try{
    return message.channel.send("Output: "+eval(args.join(" ")))
  } catch(err){
    return message.channel.send("Error:" + err)
  }
}
  if(message.content.startsWith(eprefix+"test")){
    var args = message.content.split(" ").splice(2)
  try{
    return args.join(" ")
  } catch(err){
    return message.channel.send("Error:" + err)
  }
}
  if(message.content.startsWith(eprefix+"dmrole")){
    const margs = message.content.split(" ");
if (!margs[2]) return message.reply('you need to provide a role').then(msg => {msg.delete({ timeout: 3000 })});
if (!margs[3]) return message.reply('you need to provide a message').then(msg => {msg.delete({ timeout: 3000 })});
var role = message.mentions.roles.first()
message.guild.roles.cache.get(role.id).members.forEach(member => member.send(margs[3]))
}
  
  /*--------------------------------------------------------------------*/
  /*--[ Private messaging's ]--*/
  /*--------------------------------------------------------------------*/
if(message.content.startsWith(eprefix+"dm")){
  message.delete();
var margs = message.content.split(" ");
var role = message.mentions.users.first();
if (!margs[2]) return message.reply('you need to provide a user').then(msg => {msg.delete({ timeout: 3000 })});
if (!margs[3]) return message.reply('you need to provide a message\nEx. `'+eprefix+' dm <@'+client.user.id+'> hello`').then(msg => {msg.delete({ timeout: 3000 })});;

client.users.fetch(role.id).then((user) => {
  var exampleEmbed = {
	color: '#4040ff',
	title: 'Private Message',
	fields: [{name:'You have been Dm\'d by '+message.author.tag+'!', value: '`Reason: '+(margs[3] ? margs.splice(3).join(" ") : "Unspecified Reason")+'`\n'+message.url}],
  };
  user.send({ embed: exampleEmbed });
  /*message.channel.send(`Dm sent to <@${user.id}>`).then(msg => {msg.delete({ timeout: 3000 })});*/
});}
  
  
 if(message.content.startsWith(eprefix+"encourage")){
  message.delete();
var margs = message.content.split(" ");
var role = message.mentions.users.first();
if (!margs[2]) return message.reply('you need to provide a user').then(msg => {msg.delete({ timeout: 3000 })});
//if (!margs[3]) return message.reply('you need to provide a message\nEx. `'+eprefix+' dm <@'+client.user.id+'> hello`').then(msg => {msg.delete({ timeout: 3000 })});
client.users.fetch(role.id).then((user) => {
  var exampleEmbed = {
	color: '#cd7f32',
	title: 'Private Message',
	fields: [{name:'You have been Encouraged by '+message.author.tag+'!', value: '`Reason: '+(margs[3] ? margs.splice(3).join(" ") : "Unspecified Reason")+'`\n'+message.url}],
  };user.send({ embed: exampleEmbed });
  /*message.channel.send(`Dm sent to <@${user.id}>`).then(msg => {msg.delete({ timeout: 3000 })});*/
});}
  
  if(message.content.startsWith(eprefix+"warn")){
    message.delete();
var margs = message.content.split(" ");
var member = message.mentions.users.first();
if (!member) return message.reply('you need to mention a member to warn.').then(msg => {msg.delete({ timeout: 3000 })});; 
if (!margs[2]) return message.reply('you need to mention a member to warn.').then(msg => {msg.delete({ timeout: 3000 })});;
if (!margs[3]) return message.reply('you need to provide a message.').then(msg => {msg.delete({ timeout: 3000 })});;
client.users.fetch(member.id).then((user) => {
  const exampleEmbed = {
	color: '#ff0000',
	title: 'Warning',
	fields: [{name:'You have been warned by '+message.author.tag+'!', value: '`Reason: '+(margs[3] ? margs.splice(3).join(" ") : "Unspecified Reason")+'`'}],
};user.send({ embed: exampleEmbed });
});}
  
  if(message.content.startsWith(eprefix+"mute")){
var margs = message.content.split(" ");
var member = message.mentions.users.first();
if (!member) return message.reply('you need to mention a member to mute.').then(msg => {msg.delete({ timeout: 3000 })});; 
if (!margs[2]) return message.reply('you need to mention a member to mute.').then(msg => {msg.delete({ timeout: 3000 })});;
if (!margs[3]) return message.reply('you need to provide a message.').then(msg => {msg.delete({ timeout: 3000 })});;
client.users.fetch(member.id).then((user) => {
  const exampleEmbed = {
	color: '#ff0000',
	title: 'Muted',
	fields: [
		{name:'You have been muted by '+message.author.tag+'!', value: '`Reason: '+margs[3]+'`'}],
};
    user.send({ embed: exampleEmbed });
  if (user === message.guild.ownerID){return message.reply("You Can't mute the owner of this server ").then(msg => {msg.delete({ timeout: 5000 })});}
  message.channel.updateOverwrite(user, { SEND_MESSAGES: false });
});
}
  if(message.content.startsWith(eprefix+"unmute")){
var margs = message.content.split(" ");
var member = message.mentions.users.first();
if (!member) return message.reply('You need to mention a member to unmute.').then(msg => {msg.delete({ timeout: 3000 })});; 
if (!margs[2]) return message.reply('You need to mention a member to unmute.').then(msg => {msg.delete({ timeout: 3000 })});;
if (!margs[3]) return message.reply('You need to provide a message.').then(msg => {msg.delete({ timeout: 3000 })});;
client.users.fetch(member.id).then((user) => {
  const exampleEmbed = {
	color: '#00e600',
	title: 'Unmuted',
	fields: [
		{name:'You have been unmuted by '+message.author.tag+'!', value: '`Reason: '+margs[3]+'`'}],
};
    user.send({ embed: exampleEmbed });
  if (user === message.guild.ownerID){return message.reply("You Can't unmute the owner of this server ").then(msg => {msg.delete({ timeout: 5000 })});}
  message.channel.updateOverwrite(user, { SEND_MESSAGES: true });
});
}
  
  if (message.content.startsWith(eprefix+"set")) {
    if (!server.servers.includes(message.guild.id)){return setup_message()}
  if (message.content==(eprefix+"set-logs")) {
    
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
      message.channel.send("Logs channel changed");
      server.guilds[message.guild.id].logschannel=message.channel.id;
      fs.writeFileSync("servers.json", JSON.stringify(server, null, 2));
    } else
    if (message.content==(eprefix+"set-commands")) {
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
      message.channel.send("Commands channel channel changed");
      server.guilds[message.guild.id].commandschannel=message.channel.id;
      fs.writeFileSync("servers.json", JSON.stringify(server, null, 2));
    }else 
    if (message.content==(eprefix+"set-welcome")) {
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
      message.channel.send("Welcome channel changed");
      server.guilds[message.guild.id].greetingschannel=message.channel.id;
      fs.writeFileSync("servers.json", JSON.stringify(server, null, 2));
    }else { message.channel.send(`Options [**logs**, **commands**, **welcome**]\n Ex. ${eprefix}set-welcome\n Current Settings are Logs: <#${server.guilds[message.guild.id].logschannel}>, Commands: <#${server.guilds[message.guild.id].commandschannel}>, Welcome: <#${server.guilds[message.guild.id].greetingschannel}> `);}
  }
  
  if(message.content.startsWith(eprefix+"shorten")){
    var margs = message.content.split(" ");
if (!margs[2]) return message.reply('You need to provide a link Ex. `'+eprefix+'shorten '+homepage+'`').then(msg => {msg.delete({ timeout: 8000 })});;
//if (!margs[3]) return message.reply('you need to provide a message')
//const role = message.mentions.roles.first()
    await tinyurl.shorten(margs[2], function(res, err) {
  if (err)
    message.channel.send(err).then(msg => {msg.delete({ timeout: 5000 })});
    message.channel.send(res);
});
}
  
  if (message.content===(eprefix+'nuke')) {
     var current_pos
     current_pos = message.channel.position
    if(!message.guild.me.hasPermission("MANAGE_CHANNELS")){return message.channel.send("Missing permission `Manage Channels`")}
     message.channel.send('please type yes to nuke the channel and no to cancel the operation `[yes]`').then(() => {
	var filter = m => message.author.id === m.author.id;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messages => {
			if (messages.first().content==("yes")) {  
         setTimeout(async () => {
    await message.channel.send("boop");
    let newch = await message.channel.clone();
    await message.channel.delete();
    await newch.setPosition(current_pos)
}, 900);
    } else if (messages.first().content==("no")) {
return message.reply("Operation canceled.").then(msg => {msg.delete({ timeout: 8000 })});
    }else {message.channel.send("Just type **on** or **off** after `"+eprefix+"filter`.").then(msg => {msg.delete({ timeout: 10000 })});}
  }).catch(() => {
			message.channel.send('You did not enter any input!').then(msg => {msg.delete({ timeout: 5000 })});;
		});
});
     
  

   }

    }/* /\ End of "Admin & Staff Commands" /\ */
  
  /* /\ End of "All Commands" /\ */
  
});

// Message edit event
client.on("messageUpdate", async(oldMessage, newMessage) => {
  // First let's also check that the content has actually changed
  if(oldMessage.content === newMessage.content){
    return;
  }
  if(!logchannel){return console.log('couldnt find channel');}
  // Log embed
  var person = newMessage.author;
  let logembed = new Discord.MessageEmbed()
  .setAuthor(person.tag, person.avatarURL)
  .setThumbnail(person.avatarURL)
  .setColor("RED")
  .setDescription("✏️ Message Edited")
  .addField("Before", oldMessage.content, true)
  .addField("After", newMessage.content, true)
  .setTimestamp()
  // Let's send the embed
  logchannel.send(logembed) 
})

// Message deletion event
client.on("messageDelete", async message => {
  // Get the log channel again
  if (server.servers.includes(message.guild.id)){
  if (server.guilds[message.guild.id].logschannel){logchannel=client.channels.cache.get(server.guilds[message.guild.id].logschannel);}}
  else {logchannel = message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES'))}
  if(!logchannel){return console.log('couldnt find channel');}
  // Log embed
  var person = message.author;
  if (!message.content){return;}
  let logembed = new Discord.MessageEmbed()
  .setAuthor(person.tag, person.avatarURL)
  .setThumbnail(person.avatarURL)
  .setColor("RED")
  .setDescription(":wastebasket: Message Deleted")
  .addField("Message", message.content, true)
  .setTimestamp()
  // Let's send the embed
  //message.author.send(logchannel);
  logchannel.send(logembed) })


  client.on("guildMemberRemove", member =>{
    if (server.servers.includes(member.guild.id)){
    if (server.greetingschannel[member.guild.id]){greetingschannel=client.channels.cache.get(server.greetingschannel[member.guild.id]);}}
  else {greetingschannel = member.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'))}
  if(!greetingschannel){return console.log('couldnt find channel');}
    greetingschannel.send(`Goodbye, ${member}..`);
    member.send(new Discord.MessageEmbed().setTitle("bye, " + member.displayName + " I noticed you have left " + member.guild.name + ".").setDescription("```See you later!```").setColor("#ffa500"));
});

client.on('guildMemberAdd', async member => {
  if (server.servers.includes(member.guild.id)){
  if (server.prefix[member.guild.id]){prefix=server.prefix[member.guild.id]; eprefix = prefix+" ";}}
  else prefix='!v!'; eprefix = prefix+" ";{}
  if (server.greetingschannel[member.guild.id]){greetingschannel=client.channels.cache.get(server.greetingschannel[member.guild.id]);}
  else {greetingschannel = member.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'))}
  if(!greetingschannel){return console.log('couldnt find channel');}
  member.send(new Discord.MessageEmbed().setTitle("Hey, " + member.displayName + " wecome to " + member.guild.name + " enjoy your stay!").setDescription("```- My prefix is "+prefix+"\n- You can get my attention by typing "+prefix+" help in chat. ```").setColor("5aff00"));
  // Send the message, mentioning the member
  greetingschannel.send(`Welcome to the server, ${member}`);
  const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        const embed = new Discord.MessageEmbed()
            .setDescription(`${member.user.tag} is the ${member.guild.memberCount} to join.\nJoined using ${usedInvite.inviter.tag}\nNumber of uses: ${usedInvite.uses}`)
            .setTimestamp()
            .setTitle(`${usedInvite.url}`);
            greetingschannel.send(embed).catch(err => console.log(err));
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
  
  
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
   client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
  guild.owner.send('https://discordapp.com/channels/@me/704795112575729815/743966704769433620')
  guild.owner.send('`Thank you for inviting me!\n You can use '+eprefix+'commands to discover commands and what I can do.`')
});

client.on("guildDelete", guild => {
  
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
});


/*client.on("ready", async () => {
  //client.user.setUsername("Mittz");
  console.log('Ready!')
  client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
});*/

client.on("ready", function() {
  
      var clientonmessage = `
------------------------------------------------------
> Logging in...
------------------------------------------------------
Logged in as ${client.user.tag}
Working on ${client.guilds.cache.size} servers!
${client.channels.cache.size} channels and ${client.users.cache.size} users cached!
------------------------------------------------------
----------Bot created by Orago#2938-----------
------------------------------------------------------
-----------------Bot's commands logs------------------`
    console.log(clientonmessage);
    //The default game.
    //client.user.setActivity(`${client.guilds.size} servers | ${settings.botPREFIX}help`, { type: settings.statusTYPE });

    // Cool interval loop for the bot's game.
    let statusArray = [
        `${eprefix}help | ${client.guilds.cache.size} servers!`,
        `${eprefix}help | ${client.channels.cache.size} channels!`,
        `${eprefix}help | ${client.users.cache.size} users!`,
      `Invite me | https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8 !`
    ];

    setInterval(function() {
        client.user.setActivity(`${statusArray[~~(Math.random() * statusArray.length)]}`, { type: "STREAMING" });
    }, 100000);
});

client.login(process.env.main_token);