// If you didn't want to run in 24/7 you can remove it.
const http = require('http');
const express = require("express");
const Discord = require("discord.js");const client = new Discord.Client();
const fs = require("fs");
const app = express();
const Canvas = require('canvas');
const config = require('./config.json');
const moment = require('moment');require('moment-duration-format');
const getYoutubeSubscriber = require('getyoutubesubscriber')
const guildInvites = new Map();
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');

/* FileSync */
let server = JSON.parse(fs.readFileSync(__dirname+"/servers.json"));
let botver = config.mainbot_ver;
let owner = config.ownerid;
var prefix = config.kamiko_prefix;
var eprefix = prefix+" ";
let beprefix = " "+eprefix;

var commandlist = [beprefix+"help",beprefix+"cat",beprefix+"nsfw"];
var logchannel;var greetingschannel;

/*global Set, Map*/
app.use(express.static('public'));
app.listen(3002);
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


  var nsfw = {
    "nl neko":{"tag":"neko","type":"nl"},
    "nl nekog":{"tag":"nsfw_neko_gif","type":"nl"},
    "nl eneko":{"tag":"eron","type":"nl"},
    "nl yuri":{"tag":"yuri","type":"nl"},
    "nl gecg":{"tag":"gecg","type":"nl"},
    "nl kuni":{"tag":"kuni","type":"nl"},
    "nl ngif":{"tag":"ngif","type":"nl"},
    "nl femdom":{"tag":"femdom","type":"nl"},
    "nl kemonomimi":{"tag":"kemonomimi","type":"nl"},
    "nl lewdkemo":{"tag":"lewdkemo","type":"nl"},
    "nl erokemo":{"tag":"erokemo","type":"nl"},
    "nl eroyuri":{"tag":"eroyuri","type":"nl"},
    "nl tits":{"tag":"tits","type":"nl"},
    "nl pussy":{"tag":"pussy","type":"nl"},
    "nl lewd":{"tag":"lewd","type":"nl"},
    "nl solo":{"tag":"solo","type":"nl"},
    "nl solog":{"tag":"solog","type":"nl"},
    "nl ero":{"tag":"ero","type":"nl"},
    "nl waifu":{"tag":"waifu","type":"nl"},
    "nl gasm":{"tag":"gasm","type":"nl"},
    "nl pwankg":{"tag":"pwankg","type":"nl"},
    "nl boobs":{"tag":"boobs","type":"nl"},
    "nl trap":{"tag":"trap","type":"nl"},
    "nl bj":{"tag":"bj","type":"nl"},
    "nl blowjob":{"tag":"blowjob","type":"nl"},
    "nl cum":{"tag":"cum_jpg","type":"nl"},
    "nl cumg":{"tag":"cum","type":"nl"},
    "nl anal":{"tag":"anal","type":"nl"},
    "neko":{"tag":"neko","type":"nb"},
    "h neko":{"tag":"hneko","type":"nb"},
    "thigh":{"tag":"thigh","type":"nb"},
    "h thigh":{"tag":"hthigh","type":"nb"},
    "ass":{"tag":"ass","type":"nb"},
    "h ass":{"tag":"hass","type":"nb"},
    "pussy":{"tag":"pussy","type":"nb"},
    "pussy g":{"tag":"pgif","type":"nb"},
    "anal":{"tag":"anal","type":"nb"},
    "h anal":{"tag":"hanal","type":"nb"},
    "h kit":{"tag":"hkitsune","type":"nb"},
    "h midriff":{"tag":"hmidriff","type":"nb"},
    "kemonomimi":{"tag":"kemonomimi","type":"nb"},
    "paizuri":{"tag":"paizuri","type":"nb"},
    "kanna":{"tag":"kanna","type":"nb"},
    "hentai":{"tag":"hentai","type":"nb"},
    "tentacle":{"tag":"tentacle","type":"nb"},
    "coffee":{"tag":"coffee","type":"nb"},
    "food":{"tag":"food","type":"nb"},
    "gonewild":{"tag":"gonewild","type":"nb"},
    "4k":{"tag":"4k","type":"nb"},
    "4k":{"tag":"4k","type":"e621"}
  }

setInterval(() => {
  http.get(`http://mittz-bot.glitch.me/`);
}, 280000);

client.on("message", async (message) => {
  if (message.author.bot) return;
 
  
  //logchannel = message.guild.channels.cache.get('741450918020513813')
  //else prefix='!v!'; eprefix = prefix+" ";{}
  

  
  
if (message.content === eprefix+'invite') {
    const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`Invite ${client.user.username} to your server!`)
			.setURL(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
		return message.author.send( embed );
  }

  if (message.content === eprefix+'cat') {
    let width=(Math.random()*1800+200)|0;
    let height=(Math.random()*1800+200)|0;
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setDescription("**Meow!**")
        .setImage("http://placekitten.com/"+width+"/"+height+"/"));
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
        .setDescription('Hello! <:gold:733213975705026620> I\'m '+client.user.username+'!\nI can do a few things, but mostly send you lewd photo\'s :p\nUse `'+eprefix+'commandlist` to see what other things i can do.')
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
  if (message.content==(eprefix+"nsfw")) {
    
if(!message.channel.nsfw){return message.channel.send("You can\'t do this here..")}
     if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
    let times = 0;let add = 0;
    message.channel.send('Which nsfw would you like to see today?').then(() => {//times loop start
	const filter = m => message.author.id === m.author.id;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messages1 => {
    if (!messages1.first().content) return message.reply('You haven\'t given an nsfw to send'); 
    if (messages1.first().content === 'list') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }return message.channel.send("There is no **nsfw** with this tag. Current tags are `hl neko`,`nl nekog`,`nl eneko`,`nl yuri`,`nl gecg`,`nl kuni`,`nl ngif`,`nl femdom`,`nl kemonomimi`,`nl lewdkemo`,`nl erokemo`,`nl eroyuri`,`nl tits`,`nl pussy`,`nl lewd`,`nl solo`,`nl solog`,`nl ero`,`nl waifu`,`nl gasm`,`nl pwankg`,`nl boobs`,`nl trap`,`nl bj`,`nl blowjob`,`nl cum`,`nl cumg`,`nl anal`,`neko`,`h neko`,`h thigh`,`thigh`,`ass`,`h ass`,`anal`,`h anal`,`pgif`,`h kit`,`h midriff`,`kemonomimi`,`paizuri`,`kanna`,`hentai`,`tentacle`,`coffee`,`food`,`gonewild`,`4k`.")}

    message.channel.send('How many times?').then(() => {//times loop start
	const filter = m => message.author.id === m.author.id;
      var max=40;
	message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
		.then(messages2 => {
    if (!messages2.first().content) return message.reply('You haven\'t given an amount of messages which should be deleted!'); 
    if (isNaN(messages2.first().content)) return message.reply('The amount parameter isn\'t a number!'); 
    if (messages2.first().content>max) return message.reply('Please do this less than '+max+' times'); 
    var result = "";
      get_url();
async function get_url(){
while (times < messages2.first().content) {
  
  add += times;
  if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!");}
  var options = {};

  
  if (Object.keys(nsfw).includes(messages1.first().content)){
    options.tag=nsfw[messages1.first().content].tag;
    options.type=nsfw[messages1.first().content].type;
    console.log(options.tag+": "+options.type)
    switch (options.type) {
    case "nl":options.url = 'https://nekos.life/api/v2/img/';options.method="url";break;
    case "nb":options.url = 'https://nekobot.xyz/api/image?type=';options.method="message";break;
    
    }
    options.link = options.url+options.tag;
    var link = await fetch(`${options.url}${options.tag}`).then(res => res.json()).then(json => json[options.method]);
    result+=link+" ";console.log(result)
  }
  else {result = "add laterrr"}
  
  times++;
}message.channel.send(result)
}
  });
    })// times loop
});
    })
    
    ;};
 if (message.content==(eprefix + "commandlist")||message.content==("k! commandlist")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL)
        .setTitle('__'+client.user.username+' Commands__')
        .setDescription('Hello! <:gold:733213975705026620>')
        .addField('__Command List 1__', commandlist.toString(), true)
        .setColor(config.color)
        .setFooter(`${client.user.username} | By: Orago`)
      message.author.send(embed);
  }
  

if (message.content.startsWith("kamiko")) {
  message.channel.send("The prefix for this guild is "+prefix+" ");   
  }



if (message.content==(eprefix + "homepage")) {
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
  
  
  
  
  

//Owner Commands
  if (message.author.id===owner){
if (message.content==(eprefix+"restart")) {
    if (message.author.id!==owner){return message.reply("Only the owner of me `"+client.user.username+"` can do this")}
    message.channel.send("restarting now!")
    setTimeout(()=>{
         process.exit();
    },1)
  }
  }
//Admin/server commands
  if (message.channel.type === "text") {
if (message.member.hasPermission('ADMINISTRATOR')||message.author.id===owner){
  
  
  

  

    }
  }
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
   client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
  guild.owner.send('https://cdn.discordapp.com/attachments/704795112575729815/743966704132030627/kamiko1.png')
  guild.owner.send('``Thank you for inviting me!  You can use '+eprefix+'commands \nto discover other commands and what I can do.``')
});

client.on("guildDelete", guild => {
  guild.owner.send('``Owh. Bye then ;-;``')
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "PLAYING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
});


client.on("ready", async () => {
  //client.user.setUsername("Mittz");
  client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "PLAYING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
});
client.login(process.env.discordKamiko);