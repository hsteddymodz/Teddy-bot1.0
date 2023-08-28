const {default: makeWASocket, makeInMemoryStore, useMultiFileAuthState, delay, downloadContentFromMessage, DisconnectReason, templateMessage, MediaType, GroupSettingChange, isBaileys, WASocket, WAProto, getStream, relayWAMessage, Miimetype, proto, mentionedJid, processTime, MessageTypeProto, BufferJSON, GroupMetadata, getContentType} = require("@adiwajshing/baileys")

const P = require("pino")
const fs = require("fs")
const util = require("util")
const clui = require("clui")
const ms = require("ms")
const yts = require("yt-search")
const speed = require("performance-now")
const fetch = require("node-fetch")
const axios = require("axios")
const webp = require("node-webpmux")
const chalk = require("chalk")
const cfonts = require("cfonts")
const moment = require("moment-timezone")
const ffmpeg = require("fluent-ffmpeg")
const { Boom } = require("@hapi/boom")
const antilink = JSON.parse(fs.readFileSync('./arquivos/seguranca/antilink.json'))
const { exec, spawn, execSync } = require("child_process")
const { getBuffer, generateMessageTag, tempRuntime, clockString, color, fetchJson, getGroupAdmins, getRandom, parseMention, getExtension, banner, uncache, nocache, isFiltered, addFilter, ia } = require('./arquivos/funções/ferramentas')
const { prefixo, nomebot, nomedono, numerodono } = require('./arquivos/funções/configuração.json')

const options = { timeZone: 'America/Sao_Paulo', hour12: false }
const data = new Date().toLocaleDateString('pt-BR', { ...options, day: '2-digit', month: '2-digit', year: '2-digit' })
const hora = new Date().toLocaleTimeString('pt-BR', options)
const horaAtual = new Date().getHours()
const varping = speed()
const ping = speed() - varping
const timestamp = speed()
const latensi = speed() - timestamp

//Conexão
const MAX_RECONNECTION_ATTEMPTS = 3
let reconnectionAttempts = 0
async function connectToWhatsApp() {
const store = makeInMemoryStore({ logger: P().child({ level: "silent", stream: "store" }) 
})
console.log(banner.string)
const { state, saveCreds } = await useMultiFileAuthState('./arquivos/qr-code')
const teddy = makeWASocket({
logger: P({ level: "silent" }),
printQRInTerminal: true,
browser: ['Teddy-Bot 1.0 - Teddy', 'macOS', 'desktop'],
auth: state
})
teddy.ev.on("creds.update", saveCreds)
store.bind(teddy.ev)
teddy.ev.on("chats.set", () => {
console.log("Tem conversas", store.chats.all())
})
teddy.ev.on("contacts.set", () => {
console.log("Tem contatos", Object.values(store.contacts))
})
teddy.ev.on("connection.update", (update) => {
const { connection, lastDisconnect } = update
if (connection === "close") {
const shouldReconnect = lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
console.log("Conexão fechada erro:", lastDisconnect.error, "Tentando reconectar...", shouldReconnect)
if (shouldReconnect && reconnectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
reconnectionAttempts++
setTimeout(connectToWhatsApp, 5000)
} else {
console.log("Falha na reconexão. Limite máximo de tentativas atingido.")}
} else if (connection === "open") {
console.log(color(`➱ Conectado com sucesso!\n• Status: online\n• Horário ligado: ${hora}\n• Bem-vindo ao ${nomebot}\n➱ Próximos logs...\n`, 'green'))}
})
teddy.ev.on('messages.upsert', async (m) => {

//Visualização da mensagem, etc...
try {
const info = m.messages[0]
if (!info.message) return 
await teddy.readMessages([info.key])
if (info.key && info.key.remoteJid == 'status@broadcast') return 
const type = Object.keys(info.message)[0] == 'senderKeyDistributionMessage' ? Object.keys(info.message)[2] : (Object.keys(info.message)[0] == 'messageContextInfo') ? Object.keys(info.message)[1] : Object.keys(info.message)[0]
const content = JSON.stringify(info.message)
const from = info.key.remoteJid

var body = (type === 'conversation') ? info.message.conversation : (type == 'imageMessage') ? info.message.imageMessage.caption : (type == 'videoMessage') ? info.message.videoMessage.caption : (type == 'extendedTextMessage') ? info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? info.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? info.message.templateButtonReplyMessage.selectedId : ''

const budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

var pes = (type === 'conversation' && info.message.conversation) ? info.message.conversation : (type == 'imageMessage') && info.message.imageMessage.caption ? info.message.imageMessage.caption : (type == 'videoMessage') && info.message.videoMessage.caption ? info.message.videoMessage.caption : (type == 'extendedTextMessage') && info.message.extendedTextMessage.text ? info.message.extendedTextMessage.text : ''

//Const isGroup, etc...
const isGroup = info.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? info.key.participant : info.key.remoteJid
const groupMetadata = isGroup ? await teddy.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupDesc = isGroup ? groupMetadata.desc : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const nome = info.pushName ? info.pushName : ''
const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isCmd = body.startsWith(prefixo)
const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null 
const mentions = (teks, memberr, id) => {
(id == null || id == undefined || id == false) ? teddy.sendMessage(from, {text: teks.trim(), mentions: memberr}) : teddy.sendMessage(from, {text: teks.trim(), mentions: memberr})}
const quoted = info.quoted ? info.quoted : info
const mime = (quoted.info || quoted).mimetype || ""
const sleep = async (ms) => {return new Promise(resolve => setTimeout(resolve, ms))}

//Outras const...
const isBot = info.key.fromMe ? true : false
const isOwner = numerodono.includes(sender)
const BotNumber = teddy.user.id.split(':')[0]+'@s.whatsapp.net'
const isGroupAdmins = groupAdmins.includes(sender) || false 
const isAntiLink = isGroup ? antilink.includes(from) : false
const isBotGroupAdmins = groupAdmins.includes(BotNumber) || false
const isUrl = (url) => { return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi')) }
const deviceType = info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'IPhone' : 'WhatsApp web'

const enviar = (text) => {
teddy.sendMessage(from, {text: text}, {quoted: info})}

const reply = (text) => {
teddy.sendMessage(from, {text: text}, {quoted: info})}

//Const isQuoted.
const isImage = type == "imageMessage"
const isVideo = type == "videoMessage"
const isAudio = type == "audioMessage"
const isSticker = type == "stickerMessage"
const isContact = type == "contactMessage"
const isLocation = type == "locationMessage"
const isProduct = type == "productMessage"
const isMedia = (type === "imageMessage" || type === "videoMessage" || type === "audioMessage") 
typeMessage = body.substr(0, 50).replace(/\n/g, "")
if (isImage) typeMessage = "Image"
else if (isVideo) typeMessage = "Video"
else if (isAudio) typeMessage = "Audio"
else if (isSticker) typeMessage = "Sticker"
else if (isContact) typeMessage = "Contact"
else if (isLocation) typeMessage = "Location"
else if (isProduct) typeMessage = "Product"
const isQuotedMsg = type === "extendedTextMessage" && content.includes("textMessage")
const isQuotedImage = type === "extendedTextMessage" && content.includes("imageMessage")
const isQuotedVideo = type === "extendedTextMessage" && content.includes("videoMessage")
const isQuotedDocument = type === "extendedTextMessage" && content.includes("documentMessage")
const isQuotedAudio = type === "extendedTextMessage" && content.includes("audioMessage")
const isQuotedSticker = type === "extendedTextMessage" && content.includes("stickerMessage")
const isQuotedContact = type === "extendedTextMessage" && content.includes("contactMessage")
const isQuotedLocation = type === "extendedTextMessage" && content.includes("locationMessage")
const isQuotedProduct = type === "extendedTextMessage" && content.includes("productMessage")

//Obtém o conteúdo de um arquivo em formato de buffer
const getFileBuffer = async (mediakey, MediaType) => {
const stream = await downloadContentFromMessage(mediakey, MediaType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]) }
return buffer}

//Respostas de verificação
resposta = {
espere: "Por favor, aguarde um momento...",
registro: `Olá ${nome}, parece que você ainda não está registrado. Para fazer seu registro, utilize o comando ${prefixo}rg.`,
rg: "Oops! Parece que você já está registrado. Não é possível ter mais de um registro por usuário.",
premium: "Lamentamos, mas você não possui uma assinatura Premium. Este comando é exclusivo para usuários na lista Premium. Aproveite todos os benefícios de se tornar Premium!",
bot: "Este comando só pode ser executado pelo bot.",
dono: "Desculpe, mas apenas o dono do bot pode utilizar este comando.",
grupo: "Este comando só pode ser utilizado em grupos.",
privado: "Este comando só pode ser utilizado em conversas privadas.",
adm: "Apenas administradores do grupo podem utilizar este comando.",
botadm: "Este comando só pode ser utilizado quando o bot é um administrador do grupo.",
erro: "Desculpe, ocorreu um erro. Por favor, tente novamente mais tarde."}

//Verificação anti-spam
if (isCmd) {
if (isFiltered(sender)) {
return enviar('Sem flood amigo... agora espere 5 segundos.')
} else {
addFilter(sender)}}

//Mensagens do console
if (isGroup) {
if (isCmd && !isBot) {
console.log(
color(`\n ⟨ Comando em grupo ⟩`, 'yellow'),
color(`\n➱ Comando: ${comando}`, 'green'),
color(`\n➱ Número: ${sender.split("@")[0]}`, 'green'),
color(`\n➱ Grupo: ${groupName}`, 'green'),
color(`\n➱ Nome: ${nome}`, 'green'),
color(`\n➱ Hora: ${hora}\n`, 'green'))
} else if (!isBot) {
console.log(
color(`\n ⟨ Mensagem em grupo ⟩`, 'yellow'),
color(`\n➱ Comando: ${color('Não', 'red')}`, 'green'),
color(`\n➱ Número: ${sender.split("@")[0]}`, 'green'),
color(`\n➱ Grupo: ${groupName}`, 'green'),
color(`\n➱ Nome: ${nome}`, 'green'),
color(`\n➱ Hora: ${hora}\n`, 'green'))}
} else {
if (isCmd && !isBot) {
console.log(
color(`\n ⟨ Comando no privado ⟩`, 'yellow'),
color(`\n➱ Comando: ${comando}`, 'green'),
color(`\n➱ Número: ${sender.split("@")[0]}`, 'green'),
color(`\n➱ Nome: ${nome}`, 'green'),
color(`\n➱ Hora: ${hora}\n`, 'green'))
} else if (!isBot) {
console.log(
color(`\n ⟨ Mensagem no privado ⟩`, 'yellow'),
color(`\n➱ Comando: ${color('Não', 'red')}`, 'green'),
color(`\n➱ Número: ${sender.split("@")[0]}`, 'green'),
color(`\n➱ Nome: ${nome}`, 'green'),
color(`\n➱ Hora: ${hora}\n`, 'green'))}}

//Aqui começa os comandos com prefixo
switch(comando) {

//Menu
case 'menu':
menu = `╭──「 Menu Texto 」
│• Usuário: @${sender.split("@")[0]}
│• Dispositivo: ${deviceType}
│• Prefixo Atual: ${prefixo}
│• Resposta: ${latensi.toFixed(4)}
│• Nome Bot: ${nomebot}
╰ • Criador: ${nomedono}`
teddy.sendMessage(from, {text: menu, mentions: [sender]}, {quoted: info })
break

case 'buzon2':
//if (!isOwner) return enviar(resposta.dono)
if (!q) return enviar(`Onde quer gerar números (aleatórios) coloque x.\nExemplo:\n\n${prefixo + comando} 55219740xxxx`);
quantidade = 20;
resultados = [];
for (var i = 0; i < quantidade; i++) {
var numeroFormatado = q.replace(/x/g, () => Math.floor(Math.random() * 10))
resultados.push('+'+numeroFormatado)}
await teddy.sendMessage(from, {text: '• Números geradores com sucesso: \n\n' + resultados.join('\n'), 
contextInfo: {
externalAdReply: {
title: `• By: ${nomebot}`, 
mediaType: 0, 
showAdAttribution: false, 
thumbnail: await getBuffer(`https://telegra.ph/file/d1d2eef6096c76737d2c3.jpg`), 
jpegThumbnail: await getBuffer(`https://telegra.ph/file/d1d2eef6096c76737d2c3.jpg`), 
body: `• Nome: ${nome}`, }}})
break

case 'menu2':
menu2 = `╭──「 Menu Foto - Link 」
│• Usuário: @${sender.split("@")[0]}
│• Dispositivo: ${deviceType}
│• Prefixo Atual: ${prefixo}
│• Resposta: ${latensi.toFixed(4)}
│• Nome Bot: ${nomebot}
╰ • Criador: ${nomedono}`
teddy.sendMessage(from, {image: {url: 'https://telegra.ph/file/414bd9e7830c4d828b535.jpg' }, caption: menu2, mentions: [sender]}, {quoted: info })
break

case 'menu3':
menu3 = `╭──「 Menu Foto - Diretório 」
│• Usuário: @${sender.split("@")[0]}
│• Dispositivo: ${deviceType}
│• Prefixo Atual: ${prefixo}
│• Resposta: ${latensi.toFixed(4)}
│• Nome Bot: ${nomebot}
╰ • Criador: ${nomedono}`
teddy.sendMessage(from, {image: fs.readFileSync('./arquivos/logo.jpg'), caption: menu3, mentions: [sender]}, {quoted: info })
break

case 'texto':
teddy.sendMessage(from, {text: 'Seu texto aqui.' }, {quoted: info })
break

case 'audio':
teddy.sendMessage(from, {audio: fs.readFileSync('./arquivos/áudio.mp3')}, {quoted: info })
break

case 'audiovoz':
teddy.sendMessage(from, {audio: fs.readFileSync('./arquivos/áudio.mp3'), mimetype: 'audio/mp4', ptt:true }, {quoted: info })
break

case 'image':
teddy.sendMessage(from, {image: fs.readFileSync('./arquivos/logo.jpg')}, {quoted: info })
break

case 'video':
teddy.sendMessage(from, {video: fs.readFileSync('./arquivos/video.mp4')}, {quoted: info })
break

case 'videotexto':
teddy.sendMessage(from, {video: fs.readFileSync('./arquivos/video.mp4'), caption: 'Legenda'}, {quoted: info })
break

case 'figurinha':
teddy.sendMessage(from, {sticker: fs.readFileSync('./arquivos/figurinha.webp')}, {quoted: info })
break

case 'doc':
teddy.sendMessage(from, {document: fs.readFileSync('./arquivos/documento.zip'), fileName: 'teddy-Base.zip', mimetype: 'application/zip'}, {quoted: info })
break

case 'loc':
teddy.sendMessage(from, {location: fs.readFileSync('./arquivos/localização.loc'), caption: 'Localização'}, {quoted: info })
break

case 'enquete': 
message = {
"messageContextInfo": {
"messageSecret": "eed1zxI49cxiovBTUFLIEWi1shD9HgIOghONuqPDGTk="},
"pollCreationMessage": {
"options": [
{ "optionName": 'Opção 1' },
{ "optionName": 'Opção 2' },
{ "optionName": 'Opção 3' }],
"name": `${data}`,
"selectableOptionsCount": 0
}}
await teddy.relayMessage(from, message, {quoted: info })
break
//DONWLOADS

case 'play3':
reply(`aguarde...`)
try {
data = await fetchJson(`http://s1.japa-hosting.cloud:2032/api/ytsrc/videos?q=${q}&apikey=Paulo`)
teddy.sendMessage(from, {audio: {url: data.resultado.download}, mimetype: "audio/mpeg"}, {quoted: info})
} catch {
reply(`deu errado chefe`)
}
break

//FIM DOWNLOADS

// ADM,DONO

case 'remover': 
case 'ban':
case 'kick':
try {
if (!isGroup) return enviar(resposta.grupo)
if (!isGroupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
if (info.message.extendedTextMessage === undefined || info.message.extendedTextMessage === null) return enviar(`Marque uma mensagem com "${prefixo + comando}" ou marque a pessoa que você quer remover do grupo.`)
if (info.message.extendedTextMessage.contextInfo.participant !== null && info.message.extendedTextMessage.contextInfo.participant != undefined && info.message.extendedTextMessage.contextInfo.participant !== "") {
mentioned = info.message.extendedTextMessage.contextInfo.mentionedJid[0] ? info.message.extendedTextMessage.contextInfo.mentionedJid[0] : info.message.extendedTextMessage.contextInfo.participant
if (numerodono.includes(mentioned)) return enviar('Não posso remover meu dono!')
if (numerobot.includes(mentioned)) return enviar('Não posso remover eu mesmo!')
let responseb = await teddy.groupParticipantsUpdate(from, [mentioned], 'remove')
if (responseb[0].status === "200") teddy.sendMessage(from, {text: `@${mentioned.split("@")[0]}, foi removido do grupo com sucesso.️`, mentions: [mentioned, sender]}, {quoted: info })
else if (responseb[0].status === "406") teddy.sendMessage(from, {text: `@${mentioned.split("@")[0]}, criou esse grupo e não pode ser removido(a) do grupo️`, mentions: [mentioned, sender]}, {quoted: info })
else if (responseb[0].status === "404") teddy.sendMessage(from, {text: `@${mentioned.split("@")[0]}, já foi removido(a) ou saiu do grupo`, mentions: [mentioned, sender]}, {quoted: info })
else teddy.sendMessage(from, {text: resposta.erro, mentions: [sender]}, {quoted: info })
} else if (info.message.extendedTextMessage.contextInfo.mentionedJid != null && info.message.extendedTextMessage.contextInfo.mentionedJid != undefined) {
mentioned = info.message.extendedTextMessage.contextInfo.mentionedJid
if (mentioned.includes(numerodono)) return enviar('Não pode remover meu dono.')
if (mentioned.includes(numerobot)) return enviar('Não posso remover eu mesmo.')
if (mentioned.length > 1) {
if (mentioned.length > groupMembers.length || mentioned.length === groupMembers.length || mentioned.length > groupMembers.length - 3) return enviar('Vai banir todo mundo mesmo?')
participante = 0
for (let banned of mentioned) {
await delay(100)
let responseb2 = await teddy.groupParticipantsUpdate(from, [banned], 'remove')
if (responseb2[0].status === "200") participante = participante + 1}
teddy.sendMessage(from, {text: `${participante}, participantes removido do grupo`, mentions: [sender]}, {quoted: info })
} else {
let responseb3 = await teddy.groupParticipantsUpdate(from, [mentioned[0]], 'remove')
if (responseb3[0].status === "200") teddy.sendMessage(from, {text: `@${mentioned[0].split("@")[0]}, foi removido do grupo com sucesso.️`, mentions: [mentioned[0], sender]}, {quoted: info })
else if (responseb3[0].status === "406") teddy.sendMessage(from, {text: `@${mentioned[0].split("@")[0]}, criou esse grupo e não pode ser removido(a) do grupo️`, mentions: [mentioned[0], sender]}, {quoted: info })
else if (responseb3[0].status === "404") teddy.sendMessage(from, {text: `@${mentioned[0].split("@")[0]}, já foi removido(a) ou saiu do grupo`, mentions: [mentioned[0], sender]}, {quoted: info })}}
} catch (e) {
console.error(e)
enviar(resposta.erro)}
break

case "gp":
if (!isGroup) return enviar(resposta.grupo)
if (!isGroupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
if (q == "a") {
await teddy.groupSettingUpdate(from, "not_announcement")
enviar("Grupo aberto com sucesso")
}
if (q == "f") {
await teddy.groupSettingUpdate(from, "announcement")
enviar("Grupo fechado com sucesso ")
}
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case "mudardk":
if (!isGroup) return enviar(resposta.grupo)
if (!isGroupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
await teddy.groupUpdateDescription(from, `${q}`)
enviar("🧸 Descrição alterada com sucesso ✓ ")
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case "mudarnm":
if (!isGroup) return enviar(resposta.grupo)
if (!isGroupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
await teddy.groupUpdateSubject(from, `${q}`)
enviar("🧸 Nome alterado com sucesso ✓ ")
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'rebaixar':
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (args.length < 1) return enviar('Digite o número, animal')
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
teddy.groupParticipantsUpdate(from, [`${q}@s.whatsapp.net`], 'demote')
enviar(`*🏕 Vixi @${q}. Você foi rebaixado a membro comum. 🤭*`)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'promover':
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (args.length < 1) return enviar('Cade o número, mongolóide')
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
teddy.groupParticipantsUpdate(from, [`${q}@s.whatsapp.net`], 'promote')
enviar(`*🏕 Parabéns @${q}. Você foi promovido a adm. ☺*`)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

// FIM 👋

case 'gado':
const alete = `${Math.floor(Math.random() * 105)}`
enviar('Aguarde, confiscando sua porcentagem...')
await delay(5000)
enviar(`${nome} Sua Porcentagem De Gado(a) é De : ${alete}%`)
break

case 'punheteiro':

const aletl = `${Math.floor(Math.random() * 105)}`
enviar('Aguarde, confiscando sua porcentagem...')
await delay(5000)
enviar(`${nome} Sua Porcentagem De punheteiro(a) é De : ${aletl}%`)
break

case "gplink":

if (!isGroup) return enviar(`${grupo}`)
if (!isGroupAdmins) return enviar(`${adm}`)
if(!isBotGroupAdmins) return enviar(`${botadm}`)
const link = await teddy.groupInviteCode(from)
enviar(`♧ Link do grupo : https://chat.whatsapp.com/${link} `)
break

case "resetarlink":

if (!isGroup) return enviar(`${grupo}`)
if (!isGroupAdmins) return enviar(`${adm}`)
if(!isBotGroupAdmins) return enviar(`${botadm}`)
try {
await teddy.groupRevokeInvite(from)
enviar("♧ Link de convite resetado com sucesso ✓ ")
} catch(e) {
console.log("erro")
enviar(resposta.erro)
}
break

case 'antilink': //Chefin Modder haha
if (!isGroup) return enviar(mess.only.group)
if (!isGroupAdmins) return enviar(mess.only.admin)
if (!isBotGroupAdmins) return enviar(mess.only.Badmin)
if (args.length < 1) return enviar('digite: antilink 1 para ativar! ')
if (Number(args[0]) === 1) {
if (isAntiLink) return enviar('antilink ativo!')
						antilink.push(from)
						fs.writeFileSync('./arquivos/seguranca/antilink.json', JSON.stringify(antilink))
						enviar('antilink ativo!')
					} else if (Number(args[0]) === 0) {			
						antilink.splice(from, 1)
						fs.writeFileSync('./arquivos/seguranca/antilink.json', JSON.stringify(antilink))
						enviar('anti link desativo!')
					} else {
						enviar('1 pra ativar, 0 pra desativar')
					}
					break

case "teste":
teddy.sendMessage(from, {text: `Oi ${nome}`}, {quoted: info})
break

case 'reiniciar':
if (!isOwner) return enviar(resposta.dono)
enviar('Reiniciando...')
await delay(2000)
process.exit()
break

case 'buzon':
//  if(!isPremium) return reply(enviar.msg.premium)
base = args[0]
textobuzon = "números gerados:\n"
for (let i = 0; i < args[1]; i++) {
try {
//12345-6789

numerobuzon = base.replace(/x/g, () => Math.floor(Math.random() * 10));
//await enviar(numerobuzon)
const status = await teddy.fetchStatus(numerobuzon + '@s.whatsapp.net')
const [cuu] = await teddy.onWhatsApp(numerobuzon + '@s.whatsapp.net')

if(!cuu.exists) {
} else {
textobuzon += `👾wa.me/${numerobuzon}👾\n\n`
}
} catch (e) {
}
}
await enviar(textobuzon)
break

case 'toimg':
//if (!isRegistro) return enviar(resposta.registro)
if (!isQuotedSticker) return enviar('*🏕 Marca uma figurinha*')
buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
enviar(resposta.espere)
try {
teddy.sendMessage(from, {image: buff}, {quoted: info})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'reagir':
//if (!isRegistro) return enviar(resposta.registro)
{
teddy.sendMessage(from, { react: { text: '🔥', key: info.key }})               
}
break

case "nsfwloli":{
//essa parte de baixo é os links
const link = [
  "https://i.imgur.com/5Gy4Ae2.jpg",
  "https://i.imgur.com/FXp0hGU.jpg",
  "https://i.imgur.com/tU8GBob.jpg",
  "https://i.imgur.com/RtIXKxC.jpg",
  "https://i.imgur.com/a6pBhe9.png",
  "https://i.imgur.com/xo9ML6M.jpg",
  "https://i.imgur.com/KKlDXsK.jpg",
  "https://i.imgur.com/STBCw2H.png",
  "https://i.imgur.com/TeKeKc4.jpg",
  "https://i.imgur.com/I96qZO1.jpg",
  "https://i.imgur.com/OSV4mr2.jpg",
  "https://i.imgur.com/Vkpw2lP.jpg",
  "https://i.imgur.com/vNkuk9X.jpg",
  "https://i.imgur.com/u0QSm8h.png",
  "https://i.imgur.com/orXLh6Q.png",
  "https://i.imgur.com/XB3ddkI.jpg",
  "https://i.imgur.com/vUvbdkP.jpg",
  "https://i.imgur.com/tT8fpNP.jpg",
  "https://i.imgur.com/jQxRZd6.jpg",
  "https://i.imgur.com/DWTELtS.jpg",
  "https://i.imgur.com/H4Efb3W.jpg",
  "https://i.imgur.com/AG4VSlz.jpg",
  "https://i.imgur.com/IKPk8Fn.jpg",
  "https://i.imgur.com/55tfVR6.jpg",
  "https://i.imgur.com/DH7ZhK2.jpg",
  "https://i.imgur.com/0tpqKAn.jpg",
  "https://i.imgur.com/8HFNNP9.jpg",
  "https://i.imgur.com/VFE29f0.png",
  "https://i.imgur.com/NTB4Ets.jpg",
  "https://i.imgur.com/DP6PAIX.png",
  "https://i.imgur.com/H4QObui.jpg",
  "https://i.imgur.com/Q76FGLD.jpg",
  "https://i.imgur.com/1UsHgyG.jpg",
  "https://i.imgur.com/efugtug.jpg",
  "https://i.imgur.com/oceGGfa.jpg",
  "https://i.imgur.com/LUMcFrc.jpg",
  "https://i.imgur.com/3ghty1m.jpg",
  "https://i.imgur.com/DI2L8QK.jpg",
  "https://i.imgur.com/WTPyukP.jpg",
  "https://i.imgur.com/OOhoCoQ.jpg",
  "https://i.imgur.com/1KqzRgF.jpg",
  "https://i.imgur.com/BMQTV59.jpg",
  "https://i.imgur.com/foosdbg.jpg",
  "https://i.imgur.com/T4I5qmn.jpg",
  "https://i.imgur.com/SZhWCQj.png",
  "https://i.imgur.com/r9Xe3Ku.jpg",
  "https://i.imgur.com/5AjjS3F.jpg",
  "https://i.imgur.com/vwaCltl.jpg",
  "https://i.imgur.com/vAz3s0G.jpg",
  "https://i.imgur.com/A8Rgyz2.jpg",
  "https://i.imgur.com/OMnMukk.jpg",
  "https://i.imgur.com/K5LS2p7.jpg",
  "https://i.imgur.com/Npvdm9T.jpg",
  "https://i.imgur.com/YwpdGCI.jpg",
  "https://i.imgur.com/pYoH5bm.jpg",
  "https://i.imgur.com/6UGTYFV.jpg",
  "https://i.imgur.com/UhzImzH.jpg",
  "https://i.imgur.com/Z37WIwP.jpg",
  "https://i.imgur.com/fzcpkqX.jpg",
  "https://i.imgur.com/QbbEibV.jpg",
  "https://i.imgur.com/KxcTAzy.jpg",
  "https://i.imgur.com/ngSWgTT.jpg",
  "https://i.imgur.com/ss8MumR.jpg",
  "https://i.imgur.com/2JE0VvF.jpg",
  "https://i.imgur.com/WdAdtQi.jpg",
  "https://i.imgur.com/ExfC7t2.jpg",
  "https://i.imgur.com/eIW7iBI.jpg",
  "https://i.imgur.com/ZMLS8Ru.jpg",
  "https://i.imgur.com/4amKFCf.jpg",
  "https://i.imgur.com/S6Gjf0q.jpg",
  "https://i.imgur.com/65eT6Im.jpg",
  "https://i.imgur.com/aSipcLd.jpg",
  "https://i.imgur.com/pxFagWe.jpg",
  "https://i.imgur.com/bwtxjHo.jpg",
  "https://i.imgur.com/NPNF7HK.jpg",
  "https://i.imgur.com/xSGybIA.jpg",
  "https://i.imgur.com/Y5UCft4.jpg",
  "https://i.imgur.com/SrmyNi1.jpg",
  "https://i.imgur.com/daCe3lE.jpg",
  "https://i.imgur.com/UHByRe6.jpg",
  "https://i.imgur.com/prlcgQg.jpg",
  "https://i.imgur.com/nHQp9Jc.jpg",
  "https://i.imgur.com/fsQCEn0.jpg",
  "https://i.imgur.com/XIx0IgX.jpg",
  "https://i.imgur.com/PVOYTDz.jpg",
  "https://i.imgur.com/JUDbqn3.jpg",
  "https://i.imgur.com/7j9DJFD.jpg",
  "https://i.imgur.com/T5NBJP6.jpg",
  "https://i.imgur.com/8sdegHR.jpg",
  "https://i.imgur.com/4417phO.jpg",
  "https://i.imgur.com/QGNVBGE.jpg",
  "https://i.imgur.com/6RXigzC.jpg",
  "https://i.imgur.com/iymw1WJ.jpg",
  "https://i.imgur.com/XWf4bxA.jpg",
  "https://i.imgur.com/1swVUEF.png",
  "https://i.imgur.com/l1qv8CS.png",
  "https://i.imgur.com/7cdN0FF.png",
  "https://i.imgur.com/kFL1d7F.png",
  "https://i.imgur.com/GZAG3Br.png",
  "https://i.imgur.com/MHFoUHu.png",
  "https://i.imgur.com/qtLSDCd.png",
  "https://i.imgur.com/ocsC8sb.png",
  "https://i.imgur.com/4r302Tj.png",
  "https://i.imgur.com/GwxzusL.png",
  "https://i.imgur.com/NjgXtpR.png",
  "https://i.imgur.com/4hEk1Sj.png",
  "https://i.imgur.com/BYtJXbK.png",
  "https://i.imgur.com/wsrqfa6.png",
  "https://i.imgur.com/loG4Ikx.png",
  "https://i.imgur.com/z0XKC8e.png",
  "https://i.imgur.com/xaWsood.png",
  "https://i.imgur.com/yYvpe41.png",
  "https://i.imgur.com/xA4IiRK.png",
  "https://i.imgur.com/FLzX4Ag.png",
  "https://i.imgur.com/G5m0OVU.png",
  "https://i.imgur.com/xXdsjF0.png",
  "https://i.imgur.com/Wvb1tAw.png",
  "https://i.imgur.com/xEX3l29.png",
  "https://i.imgur.com/rVZ6zet.png",
  "https://i.imgur.com/VKyHhAH.png",
  "https://i.imgur.com/h06LAgD.png",
  "https://i.imgur.com/q51mnry.png",
  "https://i.imgur.com/sM23kNv.png",
  "https://i.imgur.com/S2B9dfE.png",
  "https://i.imgur.com/LEqNv2B.png",
  "https://i.imgur.com/GenlAx5.png",
  "https://i.imgur.com/odMI0Qih.jpg"
]

// parte que vai pegar os links 
random = link[Math.floor(Math.random() * link.length)]

//parte que vai chamar o link aleatório
const chama_o_random = {
image: {url:random}
}
teddy.sendMessage(sender, chama_o_random)
enviar(`${nome} foto enviada pro pv chefe🍷🗿`)
}
break

//Aqui é o fim dos comandos sem prefixo, e começo dos sem prefixo
default:
if (budy.includes("VENDENDO")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("VENDENDO")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("sexo")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("Vendendo")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("pika")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("Vendendo")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("Vc é preto")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 racismo detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("macaco")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 racismo detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }		      
		      
if (budy.includes("VENDENDO")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 vendas detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("PIX")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 vendas detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }		      

if (budy.includes("www.")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("Preços")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("preços")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("vendo")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("Pix")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("pix")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes(".br")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }
		      
if (budy.includes("VENDENDO")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("Vendendo")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("VENDO")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }
		      
if (budy.includes("VENDENDO")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("Macaco")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }		      

if (budy.includes("Vendo")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes(".com")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }

if (budy.includes("https://")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*Vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado! 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }
if (budy.includes("wa.me/")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「link detectado!」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {  
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {reply(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }
if (budy.includes("http://")){
		     if (!isGroup) return
		     if (!isAntiLink) return
		     if (isGroupAdmins) return reply(`*${nome}* Você é adm, não vou te banir!`)
		   var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
		    setTimeout( () => {
	    	reply(`*vai com Deuskkkk*`)
	     	}, 100)
	     	reply(`*_「 link detectado 」_*\n*${nome}* você será banido do grupo: *${groupMetadata.subject}* !`)
		    setTimeout( () => {  
		    teddy.groupParticipantsUpdate(from, [Kick], "remove").catch((e) => {enviar(`*ERROR:* ${e}`)}) 
					}, 10)
		      setTimeout( () => {
	          
	          }, 0)
		      }


if (body.startsWith('>')){
try {
if (info.key.fromMe) return 
if (!isOwner) return 
return teddy.sendMessage(from, {text: JSON.stringify(eval(body.slice(2)),null,'\t')}).catch(e => {
return enviar(String(e))})
} catch (e){
return enviar(String(e))}}
}
} catch (e) {
e = String(e)
if (e.includes('this.isZero')) {
return
}
console.error('\n %s', color(`➱ ${e}`, 'yellow'))
console.log(color('\n « ! Crashlog ! »', 'red'), (color('Erro detectado! \n', 'yellow')))
teddy.sendMessage(`${numerodono}`, {text: `Ocorreu um erro: ${e}`})}
})}
connectToWhatsApp()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`O arquivo ${__filename} foi atualizado.\n`)
process.exit()
})