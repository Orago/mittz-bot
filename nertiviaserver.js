const Nertivia = require("nertivia.js"),
      fetch = require('node-fetch'),
      Canvas = require('canvas'),
      fs = require("fs");

const client = new Nertivia.Client();
const config = require('./config.json');

/* \/ Sync from database \/ */
/*This can be changed but make sure all the variables are still correct*/
let database_location=__dirname+"/servers.json";
let base = JSON.parse(fs.readFileSync(database_location))
let database = base.nertivia;
/* |\/ - These should be left alone.|*/
let botver = config.mainbot_ver;
let homepage = config.homepage;
let support_url = config.support_url;
var prefix = config.prefix;
var defaultprefix = config.default_prefix;
const swears = config.swears;
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
},
commands=["help","commands","profile","pay","balance","mine","don (Double-or-Nothing)"],
ownerCommands=["save database","eval","restart","setbal"],
adminCommands=["botadmin","say","wipe","createuser"]
/* /\ End /\ */


/* \/ Time conversion tool \/ */
function ms_seconds(x){ return x / 1000;}
function ms_minutes(x){ return x / 1000;}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
var num = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
var tens = "twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
function num2word(n){
    if (n < 20) return num[n];
    var digit = n%10;
    if (n < 100) return tens[~~(n/10)-2] + (digit? "-" + num[digit]: "");
    if (n < 1000) return num[~~(n/100)] +" hundred" + (n%100 == 0? "": " " + num2word(n%100));
    return num2word(~~(n/1000)) + " thousand" + (n%1000 != 0? " " + num2word(n%1000): "");
}
do_am_pm();
var am_pm;
function do_am_pm(){
  if (time.getHours()-4 < 12) am_pm = "AM";
  else if (time.getHours()-4 > 12) am_pm = "PM";
  else am_pm =  "broken??";
}
/* /\ End /\ */

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Id Debug: ${client.user.id}!`);
      let statusArray = [
        `> > help | ${client.guilds.cache.size} guilds`,
        `> > help | ${client.guilds.cache.size} servers!`,
        `> > help | ${client.channels.cache.size} channels!`,
        `> > help | ${client.users.cache.size} users!`,
        `> > help | ${Object.keys(database.user).length} members!`,
      `Invite me | https://nertivia.net/bots/${client.user.id}?perms=2 !`
    ];

    setInterval(function() {
      client.user.setActivity(statusArray[Math.floor(Math.random() * statusArray.length)]);
      client.user.setStatus(`idle`);
      fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
      console.log(`Saving Database on bot server!`);
    }, 100000);
})

client.on("message", async (message) => {
  if (!message.content||message.author.id === client.user.id||message&&!message.content.includes(prefix))return;
  
  function command(msg,commandValue){
  //let message = values.message,commandValue = values.command;
  console.log(`${msg} : ${commandValue}`)
  return {
    default:
      msg===eprefix+commandValue||msg===prefix+commandValue ? true : false,
    starts:msg.startsWith(eprefix+commandValue)||msg.startsWith(prefix+commandValue) ? true : false
  }
}
    if (message.content==eprefix+"ping") {
        return message.send("pong!")
    }
  
      if (message.content==eprefix+"commands") {
        return message.reply(`Commands: ${commands.toString().replace(/,/g,", ")}`)
    }
    
        function setup_message(user){return message.channel.send(`<@${user.id}> has no profile. Please have them set up a profile with \`${eprefix}self setup\``);}
  function insufficient_amount(user){return message.reply(`You do not have enough coins to do this!`)}
  
      if (message.content.startsWith(eprefix+"balance")||message.content.startsWith(eprefix+"bal")) {
    var args = message.content.split(" "), user = message.mentions.users.first();
    if (!user){user = message.author;}
    if (!database.user[user.id]) {return setup_message(user)}
    return message.channel.send(`<@${user.id}> has ${database.user[user.id].coins} ${currency}`);
  }
  
  if (message.content.startsWith(eprefix+"pay")) {
    var args = message.content.split(" "), user = message.mentions.users.first(), amount=Math.round(args[3])
    if (!user){return message.reply("No user mentioned.")}
    if (user.id === message.author.id){return message.reply("You cannot pay yourself silly!")}
    if (isNaN(amount)){return message.reply("Amount isn't a number.")}
    if (!database.user[user.id]) {return setup_message(user)};
    if (!database.user[message.author.id]) {return setup_message(message.author)};
    if (database.user[message.author.id].coins < amount||Math.sign(amount)<0){return insufficient_amount()}
    addCoins(user.id,amount);removeCoins(message.author.id,amount)
    return message.channel.send(`You have paid <@${user.id}> ${amount} ${currency}, You now have ${database.user[message.author.id].coins} ${currency}`);
  }
      if (message.content.startsWith(eprefix+"n2w")) {
    var args = message.content.split(" "), amount=Math.round(args[2]);
    if (isNaN(amount)){return message.reply("Amount isn't a number.")}
    return message.channel.send(`Result: ${num2word(amount)}`);
  }
    if (message.content.startsWith(eprefix+"don")||message.content.startsWith(eprefix+"doubleornothing")) {
    if (!database.user[message.author.id]) {return setup_message(message.author)};
    var args = message.content.split(" "), amount=Math.round(args[2])
        //Math.round(args[2]);
    if (isNaN(amount)){return message.reply("Amount isn't a number.")}
    if (database.user[message.author.id].coins < amount||Math.sign(amount)<0){return insufficient_amount()}
    var result = random(-1,0), resultAmount = result==0?amount:amount*-1;
    addCoins(message.author.id,resultAmount);
    return message.channel.send(`You took a chance and ${result==0 ? "Won" : "Lost"} ${resultAmount>0?resultAmount:resultAmount*-1} ${currency}.`);
  }
  
  if (message.content == eprefix+"mine") {
    message.delete;
    if (!database.user[message.author.id]) {return setup_message(message.author)}
    if (cooldown.users.includes(message.author.id)){return message.reply(`You need to wait ${cooldown.mine_time/1000} seconds after using the command to do so again.`);}
  var amount = (Math.floor(Math.random() * (10 - -4)) + -3)*0.01;
  addCoins(message.author.id,amount)
    cooldown.users.push(message.author.id);
    setTimeout(function(){
      delete cooldown.users[cooldown.users.indexOf(message.author.id)];
    }, cooldown.mine_time);
    return message.reply(`Mined ${amount} coins.\n You now have ${database.user[message.author.id].coins}`);
  }
  
  
  function addCoins(id,amount){
    if (!database.user[id]){return console.log(`<@${id}> No profile found.`);}
    else{
      console.log(amount)
      database.user[id].coins+=(amount)
    }
  }
  
    function removeCoins(id,amount){
      amount = amount * -1;
    addCoins(id,amount)
    }
    
if (message.content == eprefix+"self setup") {
  //if (!database.guild[message.guild.id]) return message.channel.send("Please ask the server owner to setup "+client.user.username+" economy with `"+eprefix+"guild setup`");
   if (database.user[message.author.id]) return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a profile!");
  message.channel.send("**:unlock: Beep Boop Beep! We're setting up your profile!**").then(msg=>{
    database.user[message.author.id]=
    {
      coins:50,
     background:"https://convertingcolors.com/plain-2C2F33.svg", 
     description:message.author.id, 
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
  
    if (message.content == eprefix+"guild setup") {
   if (database.guild[message.guild.id]) return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a profile!");
  message.channel.send("**:unlock: Beep Boop Beep! We're setting up your profile!**").then(msg=>{
    database.guild[message.guild.id]=
    { prefix:'!v!',filter:'off',votekick:0,channel:{commandschannel:undefined,logschannel:undefined,greetingschannel:undefined}
     
    }
    fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
       setTimeout(()=>{
         return msg.edit(":lock: **Your guild has been setup.**")
    },1500)
  })
}
  function profileCard(username){
    if (!database.user[username.id]) return message.reply(`${username} has no profile.`);
    let user = database.user[username.id];
    let result = `${username.username}:\n
    Coins: ${user.coins}
    Description: ${user.description}
    Badges: ${user.badges[0] ? user.badges : "None"}
    Creation Date: ${user.creationDate}
    Owner: ${database.owner.includes(username.id) ? "Yep" : "No"}
    Admin: ${(database.admin.includes(username.id)||database.owner.includes(username.id)) ? "Yep" : "No"}
    `;
    return message.channel.send(result);
  }
  
    if (message.content.startsWith(eprefix+"profile")) {
  if (!message.mentions.users.size) {
		return profileCard(message.author);
	}
	const avatarList = message.mentions.users.map(user => {
profileCard(user)
	});
  }
  

  
    if (message.content.startsWith(eprefix+"meown/u")) {
    var args = message.content.split(" ");
   var username=args[2];
    var who 
  var data="Crap";
  
    if (!username) return message.channel.send("No username given.") 
await fetch(`https://meown.ml/api/user/${username}`)
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
  return await message.channel.send(
    `
    ${username}\'s Profile:
    ----------
    Description: ${user.description}
    Creation Date: ${new Date(Number(user.creationDate))}
    Coins: ${user.coins}
    ~~~~~~~~~~
    Meown Api
    ${user.avatar}
    `
  )
};
  /*
    if (message.channel.type === "dm") {
    if (message.content.startsWith("meown")) {
    message.channel.send("Ready when you are!").then(msg => {msg.delete({ timeout: 15000 })}).catch(console.error);}
    if (message.content.startsWith("help")) {
    message.channel.send(`> Don't know any commands? then type \> to begin!`)
    }
  }
*/
  if (message.content==eprefix+"botadmin")return message.channel.send((database.admin.includes(message.author.id)||database.owner.includes(message.author.id)) ? "Yep" : "No")
  
  if (database.admin.includes(message.author.id)||database.owner.includes(message.author.id)){
    if (message.content.startsWith(eprefix+"say")) {
      message.delete();
      return message.channel.send("" + (message.content.split(" ").slice(2)).join(" "))
    }
    if (message.content === eprefix+"admin commands") {
      return message.reply(`Admin Commands: ${adminCommands.toString().replace(/,/g,", ")}`)
    }
      if (message.content.startsWith(eprefix+"createuser")) {
    var args = message.content.split(" "),
        user = message.mentions.users.first(),
        amount=Math.round(args[3]);
        if (!database.user[message.author.id]) {return setup_message(message.author)};
        if (!user){return message.reply("No user mentioned.")}
        if (database.user[user.id]) {return message.channel.send(`User Exists!`)};
  message.channel.send(`**:unlock: Beep Boop Beep! We're setting up ${user}\'s profile!**`).then(msg=>{
    database.user[user.id]=
    {
      coins:50,
     background:"https://convertingcolors.com/plain-2C2F33.svg", 
     description:message.author.id, 
     color:"#000000",
     badges:[],
     creationDate:`${(time.getMonth()+1)}/${(time.getDate())}/${(time.getFullYear())} ${time.getHours()-4}:${time.getMinutes()}:${time.getSeconds()} ${am_pm}`
    }
    fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
       setTimeout(()=>{
         msg.edit(`:lock: **${user}\'s user has been added.** View your profile with \`${eprefix}profile\`.`)
    },1500)
  })
  }
    
  if (message.content.startsWith(eprefix+"wipe")) {
    var args = message.content.split(" "),
        user = message.mentions.users.first();
    if (!user){return message.reply("No user mentioned.")}
    if (user.id === message.author.id){return message.reply("You cannot wipe yourself silly!")}
    if (!database.user[user.id]) {return message.channel.send(`${user} has no profile to wipe.`);};
    if (!database.user[message.author.id]) {return setup_message(message.author)};
    delete database.user[user.id]
    return message.channel.send(`You have wiped ${user} Lmao.`);
  }
    
    
  }
  
  
  
if (database.owner.includes(message.author.id)){ 
  
  if (message.content == eprefix+"owner commands") {
    return message.reply(`Owner Commands: ${ownerCommands.toString().replace(/,/g,", ")}`)
  }
    
  if (message.content == eprefix+"save database") {
    fs.writeFileSync(database_location, JSON.stringify(base, null, 2));
    return message.reply("Database has been saved successfully.")
  }
    
if (message.content == eprefix+"restart") {
    if (message.author.id!==config.nertivia.creatorID){return message.reply("Only the owner of me `"+client.user.username+"` can do this").then(msg => {msg.delete({ timeout: 5000 })}).catch(console.error)}
    message.channel.send("restarting now!")
    setTimeout(()=>{
         process.exit();
    },10)
  return;
  }
    
    if (message.content.startsWith(eprefix+"setadmin")) {
    var args = message.content.split(" "),
        user = message.mentions.users.first(),
        who = args[3]
    if (!user){return message.reply("No user mentioned.")}
    if (user.id === message.author.id){return message.reply("You cannot give yourself admin silly!")}
    if (!database.user[user.id]) {return message.channel.send(`${user} has no profile to make admin.`);};
    if (!database.user[message.author.id]) {return setup_message(message.author)};
    database.admin.push(user.id)
    return message.channel.send(`You have given ${user} bot admin O.O!`);
  }
    
      if(message.content.startsWith(eprefix+"debug")){
    var args = message.content.split(" ").splice(2)
  try{
    return message.channel.send("Output: "+eval(args.join(" ")))
  } catch(err){
    return message.channel.send("Error:" + err)
  }
}
    
    if (message.content.startsWith(eprefix+"setbalance")||message.content.startsWith(eprefix+"setbal")) {
    var args = message.content.split(" "),
        user = message.mentions.users.first(),
        amount=Math.round(args[3]);
    if (!user){return message.reply("No user mentioned.")}
    if (!database.user[user.id]) {return message.channel.send(`${user} has no profile.`);};
    if (!database.user[message.author.id]) {return setup_message(message.author)};
    database.user[user.id].coins = amount;
    return message.channel.send(`${user}\'s coins have been set to ${amount}`);
  }
    
  }/* /\ End of "Bot Owner COmmands"/\ */
  
  
  
  
  
  
})
client.login(process.env.nertiviaMeown)


