/* \/ Required node modules, DO NOT DELETE. \/ */
const http = require('http'),
      express = require('express'),
      Discord = require("discord.js"),
      fs = require("fs"),
      Canvas = require('canvas'),
      config = require('./config.json'),
      moment = require('moment'),
      momentDuration = require('moment-duration-format'),
      getYoutubeSubscriber = require('getyoutubesubscriber'),
      ytdl = require('ytdl-core'),
      fetch = require('node-fetch'),
      tinyurl = require('tinyurl');

/* /\ End /\ */
const app = express();
const guildInvites = new Map();
const client = new Discord.Client();
/* \/ Sync from database \/ */
/*This can be changed but make sure all the variables are still correct*/
let database_location=__dirname+"/servers.json";
let base = JSON.parse(fs.readFileSync(database_location))
let database = base.discord;
/* |\/ - These should be left alone.|*/
let botver = config.mainbot_ver,
    homepage = config.homepage,
    support_url = config.support_url,
    prefix = config.prefix,
    defaultprefix = config.default_prefix,
    swears = config.swears;
var time = new Date();
var votes = {};
/* /\ End /\ */

/* \/ Custom Variables \/ */
var eprefix = prefix+" ";
let beprefix = " "+eprefix;
var commandlist = [`Page 1:\n**${beprefix}help** - Show's more info.\n**${beprefix}vapor** - Create's a vaporwave background with someone's profile.\n**${beprefix}prefix** - Show's the server's prefix.\n**${beprefix}clear <amount>** - Clear's a specific amount of messages Ex. `+eprefix+'`clear 50`'+`.\n**${beprefix}cat** - Sends a random cat image.\n**${beprefix}kawaii**\n**${beprefix}me**\n**${beprefix}filter <on, off>** - Enable's / Disable's swearing Ex. \`${eprefix} filter on\`\n`];
var logChannel;/*Custom channel variables for commands with the database*/
var welcomeChannel;/*Custom channel variables for commands with the database*/
//var mute_time=;/*Time for a member to be muted.*/
let currency = "coins";
let cooldown = {
  users:[],
  user_time:4000,
  mine_time:4000,
  mute_time:10000
}
/* /\ End /\ */


/* \/ Time conversion tool \/ */
function ms_seconds(x){ return x / 1000;}
function ms_minutes(x){ return x / 1000;}

do_am_pm();
var am_pm;
function do_am_pm(){
  if (time.getHours()-4 < 12) am_pm = "AM";
  else if (time.getHours()-4 > 12) am_pm = "PM";
  else am_pm =  "broken??";
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
var num = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
var tens = "twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
var numberUnicode = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]
function num2word(n){
    if (n < 20) return num[n];
    var digit = n%10;
    if (n < 100) return tens[~~(n/10)-2] + (digit? "-" + num[digit]: "");
    if (n < 1000) return num[~~(n/100)] +" hundred" + (n%100 == 0? "": " " + this(n%100));
    return this(~~(n/1000)) + " thousand" + (n%1000 != 0? " " + this(n%1000): "");
}
/*function saveDatabase() {
  fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
  console.log(`Saving Database on bot server!`);
  setTimeout(saveDatabase(), 240000);
}
*/
setInterval(() => {
  http.get(`http://mittz-bot.glitch.me/`);
}, 240000);

client.on("message", async (message) => {
  //if (url_check(message.content)){message.delete();message.author.send('Please do not use url\'s in this server!')}
  
  if (message.author.bot) return;
  
  if (message.channel.type === "text") {// beginning of if in chat
    if (database.guild[message.guild.id]){
  if (database.guild[message.guild.id].prefix){
    
    prefix=database.guild[message.guild.id].prefix; eprefix = prefix+" ";} else {prefix='!v!'; eprefix = prefix+" ";}
      
    if (message.content.startsWith(eprefix)) {
      
    if (database.guild[message.guild.id]&&database.guild[message.guild.id].channel&&database.guild[message.guild.id].channel.commands){
      
      if (database.guild[message.guild.id].channel&&database.guild[message.guild.id].channel.commands !== message.channel.id){
        if(!message.member.hasPermission('ADMINISTRATOR')||message.author.id!==message.guild.ownerID){
          message.delete(); 
          return message.author.send("**(`"+message.guild.name+")`** Please use this in the commands channel <#"+database.guild[message.guild.id].channel.commands+">.\n`If you think this isn't correct, then please ask the owner to change the commands channel.`")
        }
      }
    }
    
    }else {prefix='!v!'; eprefix = prefix+" ";}
    
    /* \/ Swear Filter \/ */
   for (let i = 0; i < swears.length; i++) {
  const bad_word = swears[i];
  if ((message.content).toLowerCase().includes(bad_word)) {
    if(!message.guild.me.hasPermission("MANAGE_MESSAGES")){return;}
    if (message.channel.type === "text") {
      if(message.channel.nsfw){return;}
      if(message.author.id===message.guild.ownerID){return;}
      if (database.guild[message.guild.id].filter){if(database.guild[message.guild.id].filter==='on'){
        return message.channel.messages.fetch({ limit: 1 }).then(messages => { 
  message.channel.bulkDelete(messages); 
        message.member.send(new Discord.MessageEmbed().setTitle("O.O hey, **" + message.author.username + " **Unwanted language in** " + message.guild.name + "**.").setDescription("```I noticed that you said something that the owner added to the profanity filter, please do not continue to do this or there will be problems. ```\n`You said: "+message.content+"`\n\n`Muted for: "+ms_seconds(cooldown.mute_time)+" seconds`").setColor("#ffa500"));
 message.channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
    message.channel.send(`${message.author.tag} tried to use profanity, and is muted for ${ms_seconds(cooldown.mute_time)} seconds.`).then(msg => {msg.delete({ timeout: 5000 })});
          setTimeout( () => {
message.channel.updateOverwrite(message.author, { SEND_MESSAGES: true });
}, cooldown.mute_time);

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
    if(!message.guild.me.hasPermission("CREATE_INSTANT_INVITE")) return message.channel.send("Missing permission `Create Invite`");
    await message.channel.send( `\n https://cdn.discordapp.com/attachments/549225667267395596/572811777738276866/rainbow.gif`)
    await message.channel.createInvite().then(invite =>message.channel.send(invite.url+" Here is your invite link!"));
    await message.channel.send( `\n https://cdn.discordapp.com/attachments/549225667267395596/572811777738276866/rainbow.gif`)
   }
  }//end of if in chat
  
  function setup_message(){
  message.channel.send(`Please set-up this server with ${eprefix}guild-setup`);
}
  if (message.content.startsWith('up')) {message.delete();message.reply('Yep').then(msg => {msg.delete({ timeout: 5000 })});}

  
  //Fun-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    if (message.content === eprefix+"sendall") {
        client.guilds.cache.each(guild => {
            try {
                const channel = guild.channels.cache.find(channel => channel.name === 'general')
                || database.guild[guild.id]&&database.guild[guild.id].channel.news
                || guild.channels.cache.find(channel => channel.name.includes('general'))
                || guild.channels.cache.find(channel => channel.name.includes('chat'))
                || guild.channels.cache.first();
                if (channel) {
                    channel.send('message');
                } else {
                    console.log('The server ' + guild.name + ' has no channels.');
                }
            } catch (err) {
                console.log('Could not send message to ' + guild.name + '.');
            }
        });
    }
  if (message.content==(eprefix+"advice")) {
    message.delete();
    var link = fetch('https://api.adviceslip.com/advice').then(res => res.json());
    link.then(json => {
    const exampleEmbed = {
	color: 0x0099ff,
	title: 'Advice',
	fields: [{name:message.author.username+', here you go.', value: json.slip.advice}],
};
  message.channel.send({ embed: exampleEmbed })}).then(msg => {msg.delete({ timeout: 15000 })});
  }
  
 
  
   if (message.content==(eprefix+"channel")) {
     if (message.channel.type !== "text") return message.channel.send('Please do this in a server with `'+client.user.username+'`');
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
      message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }); 
      return message.channel.send("This channel has been `Locked`!");
  }else
      if (messagestwo.first().content=="false") {
      message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
    return message.channel.send("This channel has been `Un-Locked`!");
  }else message.channel.send("This is not a valid option..");
  }).catch(() => {message.channel.send('You did not enter any input!');});
})}
    
    if (messages.first().content=="hidden") {
    message.reply('Options [true, false]').then(() => {
	const filter = m => message.author.id === m.author.id;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messagestwo => {
			if (messagestwo.first().content.includes==prefix) return message.channel.send("There is no need to use a prefix here.");

    if (messagestwo.first().content=="true") {
      message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: false });
      return message.channel.send("This channel has been `Hidden`!");
  }else
    if (messagestwo.first().content=="false") {
      message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: true });
      return message.channel.send("This channel has been `Un-Hidden`!");
  }else{message.channel.send("This is not a valid option..")}
  }).catch(() => {message.channel.send('You did not enter any input!');});
    })}
    
  }).catch(() => {
			message.channel.send('You did not enter any input!');
		});
});
  }

  
  if (message.content.startsWith(eprefix+"meown/u")) {
    var args = message.content.split(" ");
   var username=args[2];
    var who 
  var data="Crap";
  
    if (!username) return message.channel.send("No username given.") 
await fetch(`https://beta.meown.tk/api/user/${username}`)
    .then(res => res.json())
    .then(json => data=json);
  if (data.response){
    if(data.response==="name_/_id_/_variant"){message.channel.send("Name / ID / Variant")}else
    if(data.response==="user_from_database"){message.channel.send("There is no user with this name")}else
  if(data.response==="method"){message.channel.send("Error Please include a method!")}else
  if(data.response==="username"){message.channel.send("Please Include a username in the url Ex. https://this.url/?username=<your username>")}
  }
  //await response.send(data);
var user = data.response;
        const Embed = {
	color: 0x0099ff,
	title: username,
  thumbnail: {
		url: user.avatar,
	},
	fields: [
    {name:'Description', value: user.description},
    {name:'Creation Date', value: new Date(Number(user.creationDate))},
    {name:'Coins', value: user.coins}
  ],
    footer: {
		text: 'Meown API',
		icon_url: 'https://cdn.glitch.com/0322d62f-81b5-4f06-9b33-557687636cec%2Fboxie-512px.png',
	},
};
  await message.channel.send({ embed: Embed })
};
  
  
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
    if (!database.guilds[message.guild.id]){return setup_message()}
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`').then(msg => {msg.delete({ timeout: 15000 })});}
    if (database.guild[message.guild.id].filter){
      message.reply('filter is currently **'+database.guild[message.guild.id].filter+'**.').then(msg => {msg.delete({ timeout: 15000 })});
    }
    message.channel.send('Options `[on , off]` ').then(() => {
	const filter = m => message.author.id === m.author.id;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messages => {
			if (messages.first().content==("on")) {
      if(database.guild[message.guild.id].filter!=='on'){
      message.channel.send("Profanity is now disallowed").then(msg => {msg.delete({ timeout: 5000 })});
      database.guild[message.guild.id].filter='on';
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));}
      else {message.channel.send("Profanity filter is already on!").then(msg => {msg.delete({ timeout: 5000 })});}
    } else if (messages.first().content==("off")) {
      if(database.guild[message.guild.id].filter!=='off'){
      message.channel.send("Profanity is now allowed").then(msg => {msg.delete({ timeout: 5000 })});
      database.guild[message.guild.id]='off';
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));}
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
    message.channel.send(`Here is your color, ${message.author.tag}!`, attachment)
    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`).then(msg => {msg.delete({ timeout: 5000 })});
    }
  }
  
  function profile_card(user){
    if (!database.user[user.id]){return message.channel.send(`<@${user.id}> No profile found.`);}
        const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage(database.user[user.id].background).then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
           Canvas.loadImage(user.avatarURL({ format: "png", dynamic: true })).then((pfp) => {
             Canvas.loadImage('https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png').then((xp) => {
               Canvas.loadImage('https://www.stickpng.com/assets/images/585e4beacb11b227491c3399.png').then((lb) => {
                  Canvas.loadImage('https://cdn.discordapp.com/attachments/660390332772646922/744094457317818388/discordowner.svg').then((owner) => {
                   Canvas.loadImage('https://discordapp.com/assets/ccebe0b729ff7530c5e37dbbd9f9938c.svg').then((rich) => {
                     
                     //ctx.drawImage(xp, 225, 90, 50, 50);
                     ctx.drawImage(lb, 40, 205, 30, 30);

                     if (database.user[user.id].badges.includes("rich")) {
                       ctx.drawImage(rich, 320, 147, 40, 40);}
                     if (user.id===message.guild.ownerID||user.id===config.discord.creatorID) {
                       ctx.drawImage(owner, 185, 50, 55, 40);}
                     ctx.font = '40px sans-serif';
                     ctx.fillStyle = database.user[user.id].color;
                     ctx.fillText(`${user.tag}`, 240, 90);
                     ctx.font = '25px sans-serif';
                     //ctx.fillText(`${database.user[user_type.id].xp}xp`, 270, 125);
                     ctx.fillText(`${database.user[user.id].coins} coins`, 270, 170);
                     ctx.fillText(`ID: ${database.user[user.id].description}`, 77, 229);
                    
	                   ctx.strokeRect(0, 0, canvas.width, canvas.height);
                     ctx.strokeStyle = '#74037b';
	                   ctx.beginPath();
	                   ctx.arc(105, 120, 75, 0, Math.PI * 2, true);
	                   ctx.closePath();
	                   ctx.clip();
                     ctx.drawImage(pfp, 30, 45, 150, 150);
                     const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');
                     message.channel.send(`Here is your profile, <@${user.id}>!`, attachment);
                   })
                 })
               })
             })
       })
       })
  }
  
  if (message.content.startsWith(eprefix+"profile")) {
  if (!message.mentions.users.size) {
		return profile_card(message.author);
	}
	const avatarList = message.mentions.users.map(user => {
profile_card(user)
	});

  }
  
if (message.content.startsWith (eprefix+'votekick')) {
  if (database.guild[message.guild.id].votekick_min<=0){return message.reply(`Vote Kicking is currently disabled`)}
  if (!message.mentions.users.size) {
		return message.channel.send('You neet to mention someone to kick');
	}
  var user = message.mentions.users.first();
  //if (user.id == message.author.id){return message.channel.send(`You cannot vote for yourself genius.`)}
  if (!votes[message.guild.id]){votes[message.guild.id]={}}
 if (!votes[message.guild.id][user.id]){votes[message.guild.id][user.id]=[];}
  //if (votes[message.guild.id][user.id].includes(message.author.id)) {return message.channel.send(`You have already voted`)}
  votes[message.guild.id][user.id].push(message.author.id)
  var voters = votes[message.guild.id][user.id];
  var result=``;
  //message.channel.send(`<@${user.id}> | ${JSON.stringify(votes)} | ${message.guild.members.cache.filter(member => !member.user.bot).size}`);
	result+=`|You voted to kick <@${user.id}>, \n| ${voters.length} / ${database.guild[message.guild.id].votekick}`
  message.channel.send(result);
  if (voters.length>database.guild[message.guild.id].votekick)
    message.guild.members.cache.get(user.id).kick(`You have been votekicked from ${message.guild.name}`);
  }
  
  if (message.content.startsWith(eprefix + 'ping')) {
    try {
      message.channel.send("Pinging...").then(msg=>{ 
      const embed = new Discord.MessageEmbed().setColor("RANDOM")/*.addField("⌛ Latency", `**${message.createdTimestamp -  message.createdTimestamp}ms**`)*/.addField("💓 API", `**${Math.floor(client.ws.ping)}ms**`)
       setTimeout(()=>{msg.edit(`🏓 Pong!`, embed)},1500)
  })
    } catch (error) {return message.channel.send(`Something went wrong: ${error.message}`);}
  } 
  if (message.content==(eprefix + "help")||message.content==("!v! help")||message.content==`<@!${client.user.id}>`||message.mentions.has(client.user)&&message.content.includes("help")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true }))
        .setTitle('__'+client.user.username+' Information__')
        .setDescription(`Hello! I\'m ${client.user.username}. <:boxie:742236479929057380>\nI can do lots of things like play audio from a few radio channels, help moderate a server, provide fun commands, run a small economy, and have a decent amount of other utility features. \nUse \`${eprefix}commands\` to see what other things i can do.`)
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
      message.channel.send(embed)//.then(msg => {msg.delete({ timeout: 8000 })});
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
  var kargs = message.content.split(" ").slice(1);


    
  if (message.content==(eprefix+"self setup")) {
    if (!database.guild[message.guild.id]) return message.channel.send("Please ask the server owner to setup "+client.user.username+" economy with `"+eprefix+"guild setup`");
   if (database.user[message.author.id]) return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a profile!");
  message.channel.send("**:unlock: Beep Boop Beep! We're setting up your profile!**").then(msg=>{
    database.user[message.author.id]=
    { coins:50,
     background:"https://convertingcolors.com/plain-2C2F33.svg", description:message.author.id, 
     color:"#000000",
     badges:[],
     creationDate:`${(time.getMonth()+1)}/${(time.getDate())}/${(time.getFullYear())} ${time.getHours()-4}:${time.getMinutes()}:${time.getSeconds()} ${am_pm}`
    }
    fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
       setTimeout(()=>{
         msg.edit(":lock: **Your user has been added.** View the leaderboard with "+eprefix+"`profile`.")
    },1500)
  })
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
              if (user_info.id===config.discord.creatorID){ctx.fillStyle = "#deff1a";}
              else {ctx.fillStyle = "#ffffff";}
              ctx.fillText(`${user_info.tag}`, 240, 90);
              ctx.fillStyle = "#ffffff";
              ctx.font = '25px sans-serif';
              ctx.fillText(`ID: ${user_info.id}`, 240, 150);
              ctx.strokeStyle = '#74037b';
	            //ctx.strokeRect(0, 0, canvas.width, canvas.height);
              //ctx.strokeStyle = '#74037b';
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

 if (message.content.startsWith(eprefix+"pa")) {
   const args = message.content.split(' ').slice(2); 
const amount = args.join(' '); 
   const voiceChannel = message.member.voice.channel;
   voiceChannel.join().then(connection => {
			const dispatcher = connection.play(amount, { volume: 1 });
			//dispatcher.on('finish', () => voiceChannel.leave());
 })
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
 if (message.content === eprefix+'invite') {
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
        .addField('Lofi', 'http://hyades.shoutca.st:8043/stream',true).addField('Vaporwave', 'http://radio.plaza.one/mp3',true).addField('Jpop', 'https://listen.moe/fallback,true').addField('Kpop', 'https://listen.moe/kpop/fallback',true)
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
  
    function setup_message(user){return message.channel.send(`<@${user.id}> has no profile. Please have them set up a profile with \`${eprefix}self setup\``);}
  function insufficient_amount(user){return message.reply(`You do not have enough coins to do this!`)}
  
      if (message.content.startsWith(eprefix + 'balance')) {
    var args = message.content.split(" "),
        user = message.mentions.users.first();
    if (!user){user = message.author;}
    if (!database.user[user.id]) {return setup_message(user)}
    message.channel.send(`<@${user.id}> has ${database.user[user.id].coins} ${currency}`);
  }
  
  if (message.content.startsWith(eprefix + 'pay')) {
    var args = message.content.split(" "),
        user = message.mentions.users.first(),
        amount=Math.round(args[3]);
    if (!user){return message.reply("No user mentioned.")}
    if (user.id === message.author.id){return message.reply("You cannot pay yourself silly!")}
    if (isNaN(amount)){return message.reply("Amount isn't a number.")}
    if (!database.user[user.id]) {return setup_message(user)};
    if (!database.user[message.author.id]) {return setup_message(message.author)};
    if (database.user[message.author.id].coins < amount||Math.sign(amount)<0){return insufficient_amount()}
    addCoins(user.id,amount);removeCoins(message.author.id,amount)
    message.channel.send(`You have paid <@${user.id}> ${amount} ${currency}, You now have ${database.user[message.author.id].coins} ${currency}`);
  }
  
  if (message.content.startsWith(eprefix + 'mine')) {
    message.delete;
    if (!database.user[message.author.id]) {return setup_message(message.author)}
    if (cooldown.users.includes(message.author.id)){return message.reply(`You need to wait ${cooldown.mine_time/1000} seconds after using the command to do so again.`).then(msg => {msg.delete({ timeout: 7500 })})}
  var amount = (Math.floor(Math.random() * (10 - -4)) + -3)*0.01;
  addCoins(message.author.id,amount)
    cooldown.users.push(message.author.id);
    setTimeout(function(){
      delete cooldown.users[cooldown.users.indexOf(message.author.id)];
    }, cooldown.mine_time);
    return message.reply(`Mined ${amount} coins.\n You now have ${database.user[message.author.id].coins}`).then(msg => {msg.delete({ timeout: 7500 })});
  }
  
  
  function addCoins(id,amount){
    if (!database.user[id]){return console.log(`<@${id}> No profile found.`);}
    else{
      console.log(amount)
      database.user[id].coins+=(amount).toFixed(2);
    }
  }
  
    function removeCoins(id,amount){
      amount = amount * -1;
    addCoins(id,amount)
    }
  
  /* \/ DM COMMANDS \/ */
  if (message.channel.type === "dm") {
    if (message.content.startsWith("mittz")) {
    message.channel.send("Ready when you are!").then(msg => {msg.delete({ timeout: 15000 })}).catch(console.error);}
    if (message.content.startsWith("help")) {
    var embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username} (${message.author.id})`)
        .setThumbnail(message.author.avatarURL())
        .addField('Need to contact the bot developer?', '<@193127888646701056>',true)
        .addField(`Dont know any commands?','simple! just say \`${eprefix}help\` or \`${eprefix}commandlist\``,true)
        .setColor('#5CC5FF')
        .setFooter(client.name, "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
    message.channel.send(embed)
    }
  }
  /* /\ End of "DM COMMANDS" /\ */
  
/* \/ Bot Owner Commands \/ */
  if (message.author.id===config.discord.creatorID){
    if (message.content==(eprefix+"save database")) {
      fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
      message.reply("Database has been saved successfully.")
    }
if (message.content==(eprefix+"restart")) {
    if (message.author.id!==config.discord.creatorID){return message.reply("Only the owner of me `"+client.user.username+"` can do this").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error)}
    message.channel.send("restarting now!")
    setTimeout(()=>{
         process.exit();
    },10)
  }
  }/* /\ End of "Bot Owner COmmands"/\ */
  
/* \/ Admin & Staff Commands */
if (message.channel.type === "text" &&(message.member.hasPermission('ADMINISTRATOR')||message.author.id===config.discord.creatorID||message.author.id==="123413327094218753")){

  if (message.content==(eprefix+"guild setup")) {
   if (database.guild[message.guild.id]) return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a profile!");
  message.channel.send("**:unlock: Beep Boop Beep! We're setting up your profile!**").then(msg=>{
    database.guild[message.guild.id]=
    { prefix:'!v!',filter:'off',votekick:0,channel:{commandschannel:undefined,logschannel:undefined,greetingschannel:undefined}
     
    }
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
       setTimeout(()=>{
         msg.edit(":lock: **Your guild has been setup.**")
    },1500)
  })
}
  
  if (message.content.startsWith(eprefix+"set-prefix")) {
    if (!database.guild[message.guild.id]){return setup_message}
  const args = message.content.split(' ').slice(2); 
const prefix_given = args.join(' '); 
if (!prefix_given) return message.reply('You haven\'t given a prefix to be set'); 
     if (database.guild[message.guild.id].prefix!=='!v!') return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a prefix!");
  message.channel.send("**:unlock: Beep Boop Beep! We're updating your prefix**").then(msg=>{
        database.guild[message.guild.id].prefix=prefix_given;
       fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
       setTimeout(()=>{
         msg.edit(":lock: **Prefix updated to `"+database.guild[message.guild.id].prefix+"`**.")
    },1500)
  })
}
  if (message.content==(eprefix+"reset-prefix")||message.mentions.has(client.user)&&message.content.includes("reset-prefix")||message.content==("!v! reset-prefix")) {
if (!database.guild[message.guild.id]){return setup_message}
   if (database.guild[message.guild.id].prefix==='!v!') return message.channel.send(":closed_lock_with_key: **Whoops!** This is already the default prefix!");
  message.channel.send("**:unlock: Beep Boop Beep! We're updating your prefix**").then(msg=>{
      msg.delete({ timeout: 5000 })
        database.guild[message.guild.id].prefix='!v!';
       fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
       setTimeout(()=>{msg.edit(":lock: **Prefix reset to `"+database.guild[message.guild.id].prefix+"`!**.")},1500)
  })
}
  
  
  if (message.content==eprefix+"stop") {
    const voiceChannel = message.member.voice.channel;voiceChannel.leave();message.channel.send("audio ended").then(msg => {msg.delete({ timeout: 10000 })});
  }
  if (message.content.startsWith(eprefix+"createrole")) {
    if(!message.guild.me.hasPermission("MANAGE_ROLES")){return message.reply('Missing Permission `Manage Roles`').then(msg => {msg.delete({ timeout: 5000 })})}
    const name = message.content.split(' ').slice(2).join(' '); 
    if (message.member.guild.roles.cache.find(role => role.name === name)){message.channel.send("The role \""+name+"\" already exists.").then(msg => {msg.delete({ timeout: 5000 })});}  
    message.guild.roles.create({ data: { name: name, permissions: ['READ_MESSAGE_HISTORY', 'SEND_MESSAGES','VIEW_CHANNEL'] } });
    message.reply(`Role "`+name+`" has been created !`).then(msg => {msg.delete({ timeout: 5000 })});
  }

  if (message.content.startsWith(eprefix+"createchannel")) {
    if(!message.guild.me.hasPermission("MANAGE_CHANNELS")){return message.reply('Missing Permission `Manage Channels`').then(msg => {msg.delete({ timeout: 5000 })})}
    const text = message.content.split(' ').slice(2).join(' '); 
    if (!text) {
    message.channel.send('no text given');}
    else if(text){
    message.guild.channels.create(text, 
      {type: 'text',permissionOverwrites: [{id: message.author.id,deny: ['VIEW_CHANNEL']}]
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
    message.delete();
if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!').then(msg => {msg.delete({ timeout: 3000 })}); 
if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!').then(msg => {msg.delete({ timeout: 3000 })}); 
if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!').then(msg => {msg.delete({ timeout: 3000 })});
if (amount < 1) return message.reply('You have to delete at least 1 message!').then(msg => {msg.delete({ timeout: 3000 })});
 message.channel.messages.fetch({ limit: amount }).then(messages => { 
    message.channel.bulkDelete(messages); 
  if(amount > 1){message.reply(":white_check_mark: "+amount+" messages have been deleted").then(msg => {msg.delete({ timeout: 1000 })});} else {message.reply(":white_check_mark: 1 message has been deleted").then(msg => {msg.delete({ timeout: 1000 })});};
});}
  
 
  //let args = message.content.split(" ").slice(1);
  if (message.content.startsWith(eprefix + "say")) {
    message.delete();message.channel.send(
      "" + 
      (
        message.content.split(" ").slice(2)
      ).join(" ")
    )
  }
  
    //let args = message.content.split(" ").slice(1);
  if (message.content.startsWith(eprefix + "pollold")) {
    message.delete();
message.channel.send(`Poll: `+message.content.split(" ").slice(2))
            .then(function (message) {
              message.react("👍")
              message.react("👎")
              //message.pin()
              //message.delete()
            }).catch(function() {
              //Something
             });
  }
    if(message.content.startsWith(eprefix+"poll")){
    const margs = message.content.split(" ");
if (!margs[2]) return message.reply('you need to provide a type').then(msg => {msg.delete({ timeout: 3000 })});
if (!margs[3]) return message.reply('you need to provide a message').then(msg => {msg.delete({ timeout: 3000 })});
          message.delete();
      if(margs[2]==="yn"){
message.channel.send(`Poll: `+margs.splice(3).join(" "))
            .then(function (message) {
              message.react("👍")
              message.react("👎")
              //message.pin()
              //message.delete()
            }).catch(function() {
              //Something
             });
      }else
      if(!isNaN(margs[2])){
        if (!(0<=margs[2]&&margs[2]<=10))return message.reply("Cannot be less than 0 or greater than 10");
          
message.channel.send(`Number Poll: `+margs.splice(3).join(" "))
            .then(function (message) {
              var i=0;
              while (i<margs[2]){
                var totest = `${numberUnicode(i)}`
                message.react(totest)
                console.log(totest)
                i++
              }
              
              //message.pin()
              //message.delete()
            }).catch(function() {
              //Something
             });
      }
}
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
                                      message.reply(` ${user.tag} has been Banned by ${message.author.tag}`); 
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
    if (!database.guild[message.guild.id]){return setup_message()}
    var options = message.content.split(" ",3)
  if (options[2] === "logs") {
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
      
      database.guild[message.guild.id].channel.logs=message.channel.id;
      fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
    } else
    if (options[2] === "commands") {
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
      
      database.guild[message.guild.id].channel.commands=message.channel.id;
      fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
    }else 
    if (options[2] === "welcome") {
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
      
      database.guild[message.guild.id].greetingschannel=message.channel.id;
      fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
    }else { return message.channel.send(`Options [**logs**, **commands**, **welcome**]\n Ex. ${eprefix}set-welcome\n Current Settings are Logs: <#${database.guild[message.guild.id].logschannel}>, Commands: <#${database.guild[message.guild.id].commandschannel}>, Welcome: <#${database.guild[message.guild.id].greetingschannel}> `);}
  return message.channel.send(`${options[2]} channel changed`);
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
   }// End of nuke
  if (message.content===(eprefix+'clone')) {
     var current_pos
     current_pos = message.channel.position
    if(!message.guild.me.hasPermission("MANAGE_CHANNELS")){return message.channel.send("Missing permission `Manage Channels`")}
     message.channel.send('please type yes to clone the channel and no to cancel the operation `[yes]`').then(() => {
	var filter = m => message.author.id === m.author.id;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messages => {
			if (messages.first().content==("yes")) {  
         setTimeout(async () => {
    await message.channel.send("boop");
    let newch = await message.channel.clone();
    await newch.setPosition(current_pos)
}, 900);
    } else if (messages.first().content==("no")) {
return message.reply("Operation canceled.").then(msg => {msg.delete({ timeout: 8000 })});
    }else {message.channel.send("Just type **on** or **off** after `"+eprefix+"filter`.").then(msg => {msg.delete({ timeout: 10000 })});}
  }).catch(() => {
			message.channel.send('You did not enter any input!').then(msg => {msg.delete({ timeout: 5000 })});;
		});
});
   }// End of nuke
    }/* /\ End of "Admin & Staff Commands" /\ */
  
  /* /\ End of "All Commands" /\ */
  
});

// Message edit event
client.on("messageUpdate", async(oldMessage, newMessage) => {
  // First let's also check that the content has actually changed
  if(oldMessage.content === newMessage.content){
    return;
  }
  if(!logChannel){return console.log('couldnt find channel');}
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
  logChannel.send(logembed) 
})

// Message deletion event
client.on("messageDelete", async message => {
  // Get the log channel again
  if (database.guild[message.guild.id]){
  if (database.guild[message.guild.id].channel.logs){logChannel=client.channels.cache.get(database.guild[message.guild.id].channel.logs);}}
  else {logChannel = message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES'))}
  if(!logChannel){return console.log('couldnt find channel');}
  // Log embed
  var person = message.author;
  if (!message.content){return;}
  let logembed = new Discord.MessageEmbed()
  .setAuthor(person.tag, person.avatarURL)
  .setThumbnail(person.avatarURL)
  .setColor("RED")
  .setDescription(":wastebasket: Deleted Message")
  .addField("Message", message.content, true)
  .setTimestamp()
  // Let's send the embed
  //message.author.send(logchannel);
  logChannel.send(logembed) })


  client.on("guildMemberRemove", member =>{
    if (database.guild[member.guild.id]){
    if (database.guild[member.guild.id].channel.welcome){welcomeChannel=client.channels.cache.get(database.channel.welcome[member.guild.id]);}}
  else {welcomeChannel = member.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'))}
  if(!welcomeChannel){return console.log('couldnt find channel');}
    welcomeChannel.send(`Goodbye, ${member}..`);
    member.send(new Discord.MessageEmbed().setTitle("bye, " + member.displayName + " I noticed you have left " + member.guild.name + ".").setDescription("```See you later!```").setColor("#ffa500"));
});

client.on('guildMemberAdd', async member => {
  if (database.guild[member.guild.id]){
  if (database.prefix[member.guild.id]){prefix=database.prefix[member.guild.id]; eprefix = prefix+" ";}}
  else prefix='!v!'; eprefix = prefix+" ";{}
  if (database.guild[member.guild.id].channel.welcome){welcomeChannel=client.channels.cache.get(database.channel.welcome[member.guild.id]);}
  else {welcomeChannel = member.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'))}
  if(!welcomeChannel){return console.log('couldnt find channel');}
  member.send(new Discord.MessageEmbed().setTitle("Hey, " + member.displayName + " wecome to " + member.guild.name + " enjoy your stay!").setDescription("```- My prefix is "+prefix+"\n- You can get my attention by typing "+prefix+" help in chat. ```").setColor("5aff00"));
  // Send the message, mentioning the member
  welcomeChannel.send(`Welcome to the server, ${member}`);
  const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        const embed = new Discord.MessageEmbed()
            .setDescription(`${member.user.tag} is the ${member.guild.memberCount} to join.\nJoined using ${usedInvite.inviter.tag}\nNumber of uses: ${usedInvite.uses}`)
            .setTimestamp()
            .setTitle(`${usedInvite.url}`);
            welcomeChannel.send(embed).catch(err => console.log(err));
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
----------Bot created by Orago#2938-------------------
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
      client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
    }, 100000);
});

client.login(process.env.discordMeown);
  /*  if (message.content.startsWith(eprefix+"meownverify")) {
    var args = message.content.split(" ");
   var username=args[2];
    var data = "crap";
    await fetch(`https://beta.meown.tk/api/user/${username}`)
    .then(res => res.json())
    .then(json => data=json);
    if (!data.response){return message.channel.send("No Response");}
    else{
      data = data.response;
    }
    if (!data.discord){
      console.log(data)
      return message.channel.send("No Discord Account Linked")
      
    }
      if (message.author.tag !== data.discord){
        return message.channel.send("This account is not connected to your discord tag.")
      }
    return message.channel.send("Success")
  }*/