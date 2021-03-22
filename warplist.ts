
import { bedrockServer, command, DimensionId } from 'bdsx';
import { FormButton, SimpleForm } from 'bdsx/bds/form';
import { CxxString } from 'bdsx/nativetype';
import fs = require('fs');
import { connectionList } from './playerlist';  /* found @ https://github.com/randommouse/bdsx-scripts/blob/bdsx2/playerlist.ts */
import { tdTeleport } from './tdtp';    /* found @ https://github.com/randommouse/bdsx-scripts/blob/bdsx2/tdtp.ts */

let warpListGUI: boolean = true; //if 'true', uses a form-based GUI for '/warp list' command response
let dbFile = "warplist.json";   //database file location
let warpDB: any = []
let system = server.registerSystem(0,0);
let homename: string = '§5HOME';

// Load Database File on Server Start
fs.readFile(dbFile, (err, data: any) =>{
    console.log('[WARP LIST] Database ' + dbFile + ' LOADED');
    if (data){
        warpDB = JSON.parse(data);
        let _filedata = JSON.stringify(warpDB, null, 2);
        // console.log(_filedata);
    }
});

// Save Database File on Server Shutdown
system.shutdown = function(){
    saveToFile();
}

bedrockServer.close.on(() => {
    saveToFile();
});

// Register Commands
let first: string = '<§eset§f | §edel§f | §etp§f | §elist§f >';
let second: string = '<warpName>';
command.register('warp', 'Your personal Warp Points').override(_param=>{
},[first, CxxString ], [second, CxxString, 'secondIsSet']);
command.register('warp set', '§eSet§7 a Warp Point');
command.register('warp del', '§eDelete§7 a Warp Point');
command.register('warp tp', '§eTeleport§7 to a Warp Point');
command.register('warp list', '§eList§7 your Warp Points');
command.register('sethome', `§eSet§7 your ${homename}§r§o§7 Warp Point`);
command.register('home', `§eTeleport§7 to your ${homename}§r§o§7 Warp Point `);


// Hook Commands
command.hook.on((cmdString: string, originName: any) =>{
    // /sethome
    if (cmdString == '/sethome'){
        warpSet(originName, homename);
    }
    // /home
    if (cmdString == '/home'){
        warpTo(originName, homename)
    }
    // /warp set <warpName>
    if (cmdString.startsWith('/warp set')) {
        let warpName: string = splitAfter(cmdString, 2).replace(/^['"]|['"]$/g, '');
        warpSet(originName, warpName);
    }
    // /warp tp <warpName>
    if (cmdString.startsWith('/warp tp')) {
        let warpName: string = splitAfter(cmdString, 2).replace(/^['"]|['"]$/g, '');
        warpTo(originName, warpName);
    }
    // /warp del <warpName>
    if (cmdString.startsWith('/warp del')) {
        let warpName: string = splitAfter(cmdString, 2).replace(/^['"]|['"]$/g, '');
        warpDel(originName, warpName);
    }
    // /warp list
    if (cmdString == '/warp list'){
        if (warpListGUI == true) {
        warpListForm(originName);
        } else {
            warpList(originName);
        }
    }
});

// Functions
function tellRaw(playerName: string, text: string){
    system.executeCommand(`/tellraw ${playerName} {"rawtext":[{"text":"${text}"}]}`, () => {});
}

function saveToFile(dbObject: object = warpDB, file: string = dbFile){
    let filedata = JSON.stringify(dbObject, null, 2);
    fs.writeFile(file, filedata, () => {
        console.log('[WARP LIST] Database ' + dbFile + ' SAVED');
    });
}

function splitAfter(string: string, index: number, separator: string = ' '){
    let stringSplit = string.split(separator);
    let stringArray = [];
    for (let i = index; i < stringSplit.length; i++){
        stringArray.push(stringSplit[i])
    }
    let stringNew: string = stringArray.join(separator);
    return stringNew
}

function warpSet(playerName: string, warpName: string){
    let originActor = connectionList.nXNet.get(playerName).getActor();
    let originEntity = connectionList.n2Ent.get(playerName);
    let originPosition = system.getComponent(originEntity, "minecraft:position");
    let originXuid = connectionList.nXXid.get(playerName);
    let dimId = originActor.getDimension();
    let xPos = originPosition!.data.x;
    let yPos = originPosition!.data.y;
    let zPos = originPosition!.data.z;
    let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == originXuid);
    let warpEntry = new WarpDBEntry(warpName, dimId, xPos, yPos, zPos);
    if (warpName != undefined && warpName != '' && warpName != null ) {
        tellRaw(playerName, '§e§l[WARP LIST]');
        if (dbObject != undefined){
            let dbIndex = warpDB.indexOf(dbObject);
            let warpObject = dbObject.warp.find((obj: { name: string; }) => obj.name == warpName);

            if (warpObject != undefined){
                tellRaw(playerName, `§eExisting §3§o${warpObject.name}§r§e\n    [§f${DimensionId[warpObject.dimId]} §e@ §4${warpObject.x.toFixed(1)} §a${warpObject.y.toFixed(1)} §9${warpObject.z.toFixed(1)}§e]`);
                tellRaw(playerName, `§cOverwriting §3§o${warpName}§r§e\n    [§f${DimensionId[dimId]} §e@ §4${xPos.toFixed(1)} §a${yPos.toFixed(1)} §9${zPos.toFixed(1)}§e]`);
                let warpIndex = warpDB[dbIndex].warp.indexOf(warpObject);
                warpDB[dbIndex].warp[warpIndex] = warpEntry;

            } else {
                tellRaw(playerName, `§eSet §3§o${warpName}§r§e\n    [§f${DimensionId[dimId]} §e@ §4${xPos.toFixed(1)} §a${yPos.toFixed(1)} §9${zPos.toFixed(1)}§e]`);
                if (warpName == homename){
                    warpDB[dbIndex].warp.unshift(warpEntry);
                } else {
                warpDB[dbIndex].warp.push(warpEntry);
                }
            }

        } else {
            tellRaw(playerName, `§eSet §3§o${warpName}§r§e\n    [§f${DimensionId[dimId]} §e@ §4${xPos.toFixed(1)} §a${yPos.toFixed(1)} §9${zPos.toFixed(1)}§e]`);
            let playerEntry = new PlayerDBEntry(originXuid, playerName);
            playerEntry.addWarp(warpName, dimId, xPos, yPos, xPos);
            warpDB.push(playerEntry);
        }
        tellRaw(playerName, '§e§l* * * * * * *');
        // Save warpDB to dbFile
        saveToFile();
    }
}

function warpDel(playerName: string, warpName: string){
    let originXuid = connectionList.nXXid.get(playerName);
    let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == originXuid);

    if (warpName != undefined && warpName != '' && warpName != null ) {
        tellRaw(playerName, '§e§l[WARP LIST]');
        if (dbObject != undefined){
            let warpObject = dbObject.warp.find((obj: { name: string; }) => obj.name == warpName);
            let dbIndex = warpDB.indexOf(dbObject);

            if (warpObject != undefined){
                let warpIndex: number = warpDB[dbIndex].warp.indexOf(warpObject);
                warpDB[dbIndex].warp.splice(warpIndex, 1);
                tellRaw(playerName, `§eDeleted §3§o${warpObject.name}§r§e\n    [§f${DimensionId[warpObject.dimId]} §e@ §4${warpObject.x.toFixed(1)} §a${warpObject.y.toFixed(1)} §9${warpObject.z.toFixed(1)}§e]`);

            } else {
                tellRaw(playerName, `§eNo warp called: §3§o${warpName}`);
            }

        } else {
            tellRaw(playerName, '§c0 §gWarp points set');
        }
        tellRaw(playerName, '§e§l* * * * * * *');
        // Save warpDB to dbFile
        saveToFile();
    }
}

function warpTo(playerName: string, warpName: string){
    let originXuid = connectionList.nXXid.get(playerName);
    let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == originXuid);

    if (warpName != undefined && warpName != '' && warpName != null ) {
        tellRaw(playerName, '§e§l[WARP LIST]');
        if (dbObject != undefined){
            let warpObject = dbObject.warp.find((obj: { name: string; }) => obj.name == warpName);

            if (warpObject != undefined){
                tdTeleport(playerName, warpObject.dimId, warpObject.x, warpObject.y, warpObject.z);
                tellRaw(playerName, `§eWarped to §3§o${warpObject.name}§r§e\n    [§f${DimensionId[warpObject.dimId]} §e@ §4${warpObject.x.toFixed(1)} §a${warpObject.y.toFixed(1)} §9${warpObject.z.toFixed(1)}§e]`);

            } else {
                tellRaw(playerName, `§eNo warp called: §3§o${warpName}`);
            }

        } else {
            tellRaw(playerName, '§c0 §gWarp points set');
        }
        tellRaw(playerName, '§e§l* * * * * * *');
    }
}

function warpList(playerName: string){
    let originXuid = connectionList.nXXid.get(playerName);
    let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == originXuid);

    if (dbObject != undefined){
        tellRaw(playerName, '§e§l[WARP LIST]');
        if (dbObject.warp.length > 0){
            for (let i = 0; i < dbObject.warp.length; i++) {
                tellRaw(playerName , `§e[${i + 1}] §3§o${dbObject.warp[i].name}§r§e\n    [§f${DimensionId[dbObject.warp[i].dimId]} §e@ §4${dbObject.warp[i].x.toFixed(1)} §a${dbObject.warp[i].y.toFixed(1)} §9${dbObject.warp[i].z.toFixed(1)}§e]`);
            }

        } else {
            tellRaw(playerName, '§c0 §gWarp points set');
        }
        tellRaw(playerName, '§e§l* * * * * * *');

    } else {
        tellRaw(playerName, '§e§l[WARP LIST]');
        tellRaw(playerName, '§c0 §gWarp points set');
        tellRaw(playerName, '§e§l* * * * * * *');
    }
}

function warpListForm(playerName: string) {
    let playerXuid = connectionList.nXXid.get(playerName);
    let playerNetID = connectionList.nXNet.get(playerName);
    let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == playerXuid);
    let warpListForm = new SimpleForm('§0§l[WARP LIST]')

    if (dbObject.warp.length > 0) {
        for (let i = 0; i < dbObject.warp.length; i++) {
            warpListForm.addButton(new FormButton(`§1§o${dbObject.warp[i].name}§r§8\n[§0${DimensionId[dbObject.warp[i].dimId]} §8@ §4${dbObject.warp[i].x.toFixed(1)} §2${dbObject.warp[i].y.toFixed(1)} §9${dbObject.warp[i].z.toFixed(1)}§8]`));
        }
        warpListForm.sendTo(playerNetID, (data, playerNetID) => {
            if (data.response !== undefined){
            console.log(data.response);
            warpTo(playerName, dbObject.warp[data.response].name);
            }
        })
    } else {
        tellRaw(playerName, '§e§l[WARP LIST]');
        tellRaw(playerName, '§c0 §gWarp points set');
        tellRaw(playerName, '§e§l* * * * * * *');
    }
}

// Database Entry Classes
class PlayerDBEntry {
    [key: string]: any
    constructor(xuid: string, name: string){
        this.xuid = xuid;
        this.name = name;
        this.warp = [];
    }
    addWarp(name: string, dimensionId: number, xPos: number, yPos: number, zPos: number){
        let content: {[key: string]: any} = {
            name: name,
            dimId: dimensionId,
            x: xPos,
            y: yPos,
            z: zPos
        }
        this.warp.push(content);
    }
}

class WarpDBEntry {
    [key: string]: any
    constructor(name: string, dimensionId: number, xPos: number, yPos: number, zPos: number){
        this.name = name;
        this.dimId = dimensionId;
        this.x = xPos;
        this.y = yPos;
        this.z = zPos;
    }
}
