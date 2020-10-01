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
const ytdl = require('ytdl-core');

const swears = ['fuck', 'shit', 'nigga','nigger','ass','bitch','cunt','porn','cock','penis'];


/* FileSync */
let server = JSON.parse(fs.readFileSync(__dirname+"/servers.json"));
let botver = config.mainbot_ver;
let owner = config.creator_id;
let botname = config.botname;
var prefix = config.home_prefix;
var eprefix = prefix+" ";
let beprefix = " "+eprefix;
var role;
var commandlist = [beprefix+"help",beprefix+"profile",beprefix+"prefix",beprefix+"clear",beprefix+"cat",beprefix+"kawaii"];
var logchannel;var greetingschannel;

/*global Set, Map*/
app.use(express.static('public'));
app.listen(3001);
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




setInterval(() => {
  http.get(`http://mittz-bot.glitch.me/`);
}, 280000);

client.on("message", (message) => {
  if (message.author.bot) return;
 
  
  //logchannel = message.guild.channels.cache.get('741450918020513813')
  //else prefix='!v!'; eprefix = prefix+" ";{}
  

  
  


  
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

        // send the entire array of strings as a message
        // by default, discord.js will `.join()` the array with `\n`
        message.channel.send(creator);
	}
  if (message.content.startsWith(eprefix + 'ping')) {
    try {
      message.channel.send("Pinging...").then(msg=>{ 
      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .addField("⌛ Latency", `**${message.createdTimestamp -  message.createdTimestamp}ms**`)
      .addField("💓 API", `**${Math.floor(client.ws.ping)}ms**`) 
       
       setTimeout(()=>{
         msg.edit(`🏓 Pong!`, embed)
    },1500)
  })
    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`);
      
    }
  } 
  
  if (message.content==(eprefix + "help")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true }))
        .setTitle('__'+client.user.username+' Information__')
        .setDescription('Hello! <:gold:733213975705026620> I\'m '+botname+'.\nI can do lots of things like play audio from a few radio channels, help moderate a server, provide fun commands, run a small economy, and have a decent amount of other utility features. \nUse `'+eprefix+'commandlist` to see what other things i can do.')
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
 if (message.content==(eprefix + "commandlist")||message.content==("!v! commandlist")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL)
        .setTitle('__'+client.user.username+' Commands__')
        .setDescription('Hello! <:gold:733213975705026620>')
        .addField('__Command List 1__', commandlist.toString(), true)
        .setColor(config.color)
        .setFooter(`${client.user.username} | By: Orago`)
      message.author.send(embed);
  }
  
  
 
if (message.content===(eprefix+"update")) {
  if (!message.guild.me.hasPermission("ADMINISTRATOR")){return message.guild.owner.send('`I am missing the permission Manage Channels`')}
  client.channels.cache.get("754784165907398707").setName(`〔Members ｜〔${message.guild.members.cache.filter(member => !member.user.bot).size}〕`)
  .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
  .catch(console.error);
  message.channel.send("The prefix for this guild is "+prefix+" ");   

  }
  
  
if (message.content.startsWith("kitteh")) {
  message.channel.send("The prefix for this guild is "+prefix+" ");   

  }



if (message.content==(eprefix + "website")) {
  const embed = new Discord.MessageEmbed()
  .setTitle("Visit homepage")
  .setAuthor("Mittens Homepage", "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2F8bitpc%20vaporwave%20blue%20cat.png?v=1594354853240")
  .setColor(0x00AE86)
  .setDescription("This is the homepage for all of the projects made by the same creator of this very bot!")
  .setFooter("Created by Orago", client.user.avatarURL({ format: "png", dynamic: true }))
  .setImage("https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664")
  .setThumbnail("https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Finbreadspread.png?v=1594354874436")
  .setTimestamp()
  .setURL("https://mittens.glitch.com")
message.channel.send(embed);
}
  if (message.content.startsWith(eprefix + "role")) {
  message.delete();
    
var margs = message.content.split(" ");
if (!margs[2]) return message.reply('you need to provide a role Ex. `'+eprefix+'role minecraft`, roles are [minecraft, giveaways]')
if (margs[2]==("minecraft")) {role = "741871918625456159";
if(message.member.roles.cache.has(role)){return message.channel.send("``You already have this role!``")};message.channel.send("``Role Given "+margs[2]+".``");message.member.roles.add(role);}

if (margs[2]==("giveaways")) {role = "749012447050072095";
if(message.member.roles.cache.has(role)){return message.channel.send("``You already have this role!``")};message.channel.send("``Role Given "+margs[2]+".``");message.member.roles.add(role);}
}
  
  if (message.content==(eprefix+"verify")) {var verified_role = "741450901742682282";var guest_role = "741450902782738522";
if(message.member.roles.cache.has(verified_role)){return message.channel.send("``You are already verified!``")};if(!message.member.roles.cache.has(guest_role)){return message.channel.send("``You aren't even a guest??!!``")}message.channel.send("``You have been verified!``");message.member.roles.add(verified_role);message.member.roles.remove(guest_role);
}
  
if (message.content==(eprefix+"join")) {var verified_role = "741450901742682282";var guest_role = "741450902782738522";
if(message.member.roles.cache.has(verified_role)){return message.channel.send("``You are already verified here!``")};if(message.member.roles.cache.has(guest_role)){return message.channel.send("``You are already a guest``")}message.channel.send("``You have been accepted to this server!``");message.member.roles.add(guest_role);
}
  
 

  
 

  
  
  
  
  


//Admin/server commands

  }
);

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


client.on("ready", async () => {
  //client.user.setUsername("Mittz");
  client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
  

});
client.login(process.env.kitteh_token);