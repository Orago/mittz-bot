// [Packages]
const Nertivia = require("nertivia.js"),
      fetch = require('node-fetch'),
      client2 = require('nekos.life'); // https://www.npmjs.com/package/nekos.life
// [Client starters]
const client = new Nertivia.Client(),
      neko = new client2();
// [Details / Variables]
const token = process.env.token,
      prefix = "pp";



client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Id Debug: ${client.user.id}!`);
    client.user.setActivity("I am not straight.");
    client.user.setStatus(`online`);
})

client.on("message", async msg => {
  if (!msg.content
      ||msg.author.id === client.user.id//If person who sends message is the same as the bot.
      ||msg&&!msg.content.includes(prefix)//If the person's message includes the bot's prefix.
     )return;//Cancel message command to not use too much process memory.
  
	  const args = msg.content.slice(" ").trim().split(' '),
          command = args.shift().toLowerCase();
		console.log(args)
  
    if (msg.content.includes(prefix + "dog")) {
    		var dog =  await fetch("https://dog.ceo/api/breeds/image/random").then(res => res.json()),
            dogPic = dog.message.replace(/\\/g,"");
    		console.log(dogPic);
    		return msg.reply("ruff ruff 🐶:\n" + dogPic);
    }
    if (msg.content.includes(prefix + "cat")) {
      let width=(Math.random()*1800+200)|0,
          height=(Math.random()*1800+200)|0;
    		return msg.reply("Meowww 🐱 "+`https://placekitten.com/${width}/${height}/`);
    }
		if (msg.content.includes(prefix + "Rnumber")) {
			let a = Math.floor((Math.random() * args[1]) + args[0]);
			return msg.reply(a);
		}
		if (msg.content.includes(prefix + "help")) {
			return msg.author.send("type pp in the chat and it shows all avaible commands and their arguments")
		}
		if (msg.content.includes(prefix + "owo")&& client.user.id !== msg.author.id) {
  			let owa = await neko.sfw.OwOify({text: `${args}`}),
            uwu = owa.owo.replace(/\\/g,"").replace(/\,/g," ");
  			console.log(owa);
				return msg.channel.send("Here is your owoified text: "+uwu)
		}
		if (msg.content.includes(prefix + "hug")) {
				const argss = msg.content.slice(" ").trim().replace("pphug ","").split()
  			var pp = await neko.sfw.hug();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(ll + ` ${msg.author} gave **${argss}** a big ol hug!`)
		}
		if (msg.content.includes(prefix + "slap")) {
				const argss = msg.content.slice(" ").trim().replace("ppslap ","").split()
  			var pp = await neko.sfw.slap();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(ll + ` Ouch, ${msg.author} gave **${argss}** a painful looking slap! 😬`)
		}
		if (msg.content.includes(prefix + "kiss")) {
				const argss = msg.content.slice(" ").trim().replace("ppkiss ","").split()
  			var pp = await neko.sfw.kiss();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(ll + ` //**MWAAAAAA**//, ${msg.author} gave **${argss}** a SMOOCH! 😘`)
		}
		if (msg.content.includes(prefix + "wallpaper")) {
  			var pp = await neko.sfw.wallpaper();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(`Here is your wallpaper!: ` + ll)
		}
		if (msg.content.includes(prefix + "tickle")) {
				const argss = msg.content.slice(" ").trim().replace("pptickle ","").split()
  			var pp = await neko.sfw.tickle();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(ll + ` ${msg.author} is tickling **${argss}**! 😹`)
		}
		if (msg.content.includes(prefix + "smug")) {
				const argss = msg.content.slice(" ").trim().replace("ppsmug ","").split()
  			var pp = await neko.sfw.smug();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(ll + ` ${msg.author} is acting smug, I wonder why? 😏`)
		}
		if (msg.content.includes(prefix + "poke")) {
				const argss = msg.content.slice(" ").trim().replace("pppoke ","").split()
  			var pp = await neko.sfw.poke();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(ll + ` ${msg.author} just poked ${argss} 🙄👈😁`)
		}
		if (msg.content.includes(prefix + "why")) {
				const argss = msg.content.slice(" ").trim().replace("ppwhy","").split()
  			var pp = await neko.sfw.why();
				var ll = pp.why.replace(/\\/g,"")
				return msg.channel.send(ll)
		}
		if (msg.content.includes(prefix + "fact")) {
				const argss = msg.content.slice(" ").trim().replace("ppwhy","").split()
  			var pp = await neko.sfw.fact();
				var ll = pp.fact.replace(/\\/g,"")
				return msg.channel.send(ll)
		}
		if (msg.content.includes(prefix + "neko")) {
				const argss = msg.content.slice(" ").trim().replace("ppneko ","").split()
  			var pp = await neko.sfw.neko();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(ll)
		}
		if (msg.content.includes(prefix + "lizard")) {
				const argss = msg.content.slice(" ").trim().replace("pplizard","").split()
  			var pp = await neko.sfw.lizard();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(`Woah, a lizard! 🦎 ` + ll)
		}
		if (msg.content.includes(prefix + "waifu")) {
				const argss = msg.content.slice(" ").trim().replace("ppwaifu","").split()
  			var pp = await neko.sfw.waifu();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(`💖😻 ` + ll)
		}
		if (msg.content.includes(prefix + "avatar")) {
				const argss = msg.content.slice(" ").trim().replace("ppavatar","").split()
  			var pp = await neko.sfw.avatar();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(`Here is your avatar: ` + ll)
		}
		if (msg.content.includes(prefix + "kemonomimi")) {
				const argss = msg.content.slice(" ").trim().replace("ppkemonomimi","").split()
  			var pp = await neko.sfw.kemonomimi();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(`Here is your kemonomimi picture: ` + ll)
		}
		if (msg.content.includes(prefix + "holo")) {
				const argss = msg.content.slice(" ").trim().replace("ppholo","").split()
  			var pp = await neko.sfw.holo();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(`Here is your picture: ` + ll)
		}
		if (msg.content.includes(prefix + "foxgirl")) {
				const argss = msg.content.slice(" ").trim().replace("ppfoxgirl","").split()
  			var pp = await neko.sfw.foxGirl();
				var ll = pp.url.replace(/\\/g,"")
				return msg.channel.send(`Here is your foxgirl 🥴: ` + ll)
		}
		if (msg.content.includes(prefix + "feed")) {
  			var pp = await neko.sfw.feed();
				var ll = pp.url.replace(/\\/g,"")
				var args2 = args[1].replace(/\_/g," ")
				return msg.channel.send(`${args[0]} is getting fed ${args2} by ${msg.author}, they better eat up! ` + ll)
		}
})
client.login(`${token}`)