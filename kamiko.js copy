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




setInterval(() => {
  http.get(`http://mittz-bot.glitch.me/`);
}, 280000);

client.on("message", (message) => {
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
    let width=(Math.random()*1800+200)|0;let height=(Math.random()*1800+200)|0;message.channel.send(new Discord.MessageEmbed().setColor("ORANGE").setDescription("**Meow!**").setImage("http://placekitten.com/"+width+"/"+height+"/"));
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
while (times < messages2.first().content) {
  times++;
  add += times;
  if (messages1.first().content === 'nl neko') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/neko').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl nekog') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/nsfw_neko_gif').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl eneko') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/eron').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl yuri') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/yuri').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl gecg') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/gecg').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl kuni') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/kuni').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl ngif') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/ngif').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl femdom') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/femdom').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl kemonomimi') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/kemonomimi').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl lewdkemo') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/lewdkemo').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl erokemo') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/erokemo').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl eroyuri') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/eroyuri').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl tits') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/tits').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl pussy') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/pussy').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl lewd') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/lewd').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl solo') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/solo').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl solog') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/solog').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl ero') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/ero').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl waifu') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/waifu').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl gasm') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/gasm').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl pwankg') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/pwankg').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl boobs') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/boobs').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl trap') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/trap').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl bj') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/bj').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl blowjob') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/blowjob').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl cumg') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/cum').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl cum') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/cum_jpg').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'nl anal') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/anal').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'neko') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=neko').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (messages1.first().content === 'h neko') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hneko').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'h thigh') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hthigh').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'thigh') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=thigh').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'ass') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=ass').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'h ass') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hass').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'pussy') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=pussy').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'anal') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=anal').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'h anal') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hanal').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'pgif') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=pgif').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'h kit') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hkitsune').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'h midriff') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hmidriff').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'kemonomimi') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=kemonomimi').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'paizuri') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=paizuri').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'kanna') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=kanna').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'hentai') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hentai').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'tentacle') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=tentacle').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'coffee') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=coffee').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'food') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=food').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === 'gonewild') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=gonewild').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (messages1.first().content === '4k') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=4k').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  
  return message.channel.send("There is no **nsfw** with this tag. Current tags are `hl neko`,`nl nekog`,`nl eneko`,`nl yuri`,`nl gecg`,`nl kuni`,`nl ngif`,`nl femdom`,`nl kemonomimi`,`nl lewdkemo`,`nl erokemo`,`nl eroyuri`,`nl tits`,`nl pussy`,`nl lewd`,`nl solo`,`nl solog`,`nl ero`,`nl waifu`,`nl gasm`,`nl pwankg`,`nl boobs`,`nl trap`,`nl bj`,`nl blowjob`,`nl cum`,`nl cumg`,`nl anal`,`neko`,`h neko`,`h thigh`,`thigh`,`ass`,`h ass`,`anal`,`h anal`,`pgif`,`h kit`,`h midriff`,`kemonomimi`,`paizuri`,`kanna`,`hentai`,`tentacle`,`coffee`,`food`,`gonewild`,`4k`.");
  
  if (message.content.startsWith(eprefix+"st")) {
    return
  }
  
}});})// times loop
});})
    
    ;};
  
if (message.channel.type == "text") {
  if (message.content === eprefix+'nsfw nl neko') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/neko').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl nng') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/nsfw_neko_gif').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl yuri') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/yuri').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl gecg') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/gecg').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl kuni') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/kuni').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl ngif') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/ngif').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl femdom') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/femdom').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl eroyuri') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/eroyuri').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl tits') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/tits').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl pussy') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/pussy').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl lewd') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/lewd').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl solo') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/solo').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl solog') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/solog').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl ero') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/ero').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl waifu') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/waifu').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl gasm') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/gasm').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl pwankg') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/pwankg').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl boobs') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/boobs').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl trap') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/trap').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl bj') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/bj').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl blowjob') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/blowjob').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl cumg') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/cum').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl cum') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/cum_jpg').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw nl anal') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekos.life/api/v2/img/anal').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw neko') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=neko').then(res => res.json());link.then(json => message.channel.send(json.url))}else
  if (message.content === eprefix+'nsfw h neko') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hneko').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw h-thigh') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hthigh').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw thigh') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=thigh').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw ass') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=ass').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw h ass') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hass').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw anal') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=anal').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw h anal') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hanal').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw pgif') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=pgif').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw h kit') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hkitsune').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw h midriff') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hmidriff').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw kemonomimi') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=kemonomimi').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw paizuri') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=paizuri').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw kanna') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=kanna').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw hentai') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=hentai').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw tentacle') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=tentacle').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw coffee') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=coffee').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw food') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=food').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw gonewild') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=gonewild').then(res => res.json());link.then(json => message.channel.send(json.message))}else
  if (message.content === eprefix+'nsfw 4k') {if(!message.channel.nsfw){ message.channel.send("This command can only be used in channels marked nsfw, that means you need to be 18+ to use this!"); return; }var link = fetch('https://nekobot.xyz/api/image?type=4k').then(res => res.json());link.then(json => message.channel.send(json.message))}
  }
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
client.login(process.env.kamiko_token);