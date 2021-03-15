
import { command, DimensionId } from 'bdsx';
import fs = require('fs');
import { connectionList } from './playerlist';
import { tdTeleport } from './tdtp';
import colors = require('colors');
import { Dimension } from 'bdsx/bds/dimension';

let dbFile = "warplist.json";
let warpDB: any = []
let system = server.registerSystem(0,0);

// Load Database File on Server Start
fs.readFile(dbFile, (err, data: any) =>{
    console.log('[WARP LIST] Database ' + dbFile + ' LOADED');
    if (data){
        warpDB = JSON.parse(data);
        let filedata = JSON.stringify(warpDB);
        console.log(filedata);
        console.log(warpDB);
    }
});

// Save Database File on Server Shutdown
system.shutdown = function(){
    let filedata = JSON.stringify(warpDB);
    fs.writeFile(dbFile, filedata, () => {
        console.log('[WARP LIST] Database ' + dbFile + ' SAVED');
        console.log(filedata);
        console.log(warpDB);
    });
}

// Hook Commands
command.hook.on((cmdString: string, originName: any) =>{
    // /sethome
    if (cmdString.startsWith('/sethome')){
        let warpName: string = '.home'
        warpSet(originName, warpName);
    }
    // /home
    if (cmdString.startsWith('/home')){
        let warpName: string = '.home'
        warpTo(originName, warpName)
    }
    // /warp set <warpName>
    if (cmdString.startsWith('/warp set')) {
        let warpName: string = splitAfter(cmdString, 2);
        console.log(warpName);
        warpSet(originName, warpName);
    }
    // /warp to <warpName>
    if (cmdString.startsWith('/warp to')) {
        let warpName: string = splitAfter(cmdString, 2);
        warpTo(originName, warpName);
    }
    // /warp del <warpName>
    if (cmdString.startsWith('/warp del')) {
        let warpName: string = splitAfter(cmdString, 2);
        warpDel(originName, warpName);
    }
});

// Functions
function tellRaw(playerName: string, text: string){
    system.executeCommand(`/tellraw ${playerName} {"rawtext":[{"text":"${text}"}]}`, () => {});
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

    if (dbObject != undefined){
        let dbIndex = warpDB.indexOf(dbObject);
        let warpObject = dbObject.warp.find((obj: { name: string; }) => obj.name == warpName);

        if (warpObject != undefined){
            tellRaw(playerName, `§gExisting §4${warpObject.name}§g: §4${DimensionId[warpObject.dimId]} §g@ §4${warpObject.x}§g, §4${warpObject.y}§g, §4${warpObject.z}`);
            tellRaw(playerName, `§gOverwriting with: §4${DimensionId[dimId]} §g@ §4${xPos}§g, §4${yPos}§g, §4${zPos}`);
            let warpIndex = warpDB[dbIndex].warp.indexOf(warpObject);
            warpDB[dbIndex].warp[warpIndex] = warpEntry;

        } else {
            tellRaw(playerName, `§2${playerName} §gset new warp §4${warpName}§g:\n§4${DimensionId[dimId]} §g@ §4${xPos}§g, §4${yPos}§g, §4${zPos}`);
            warpDB[dbIndex].warp.push(warpEntry);
        }

    } else {
        tellRaw(playerName, `§2${playerName} §gset new warp §4${warpName}§g:\n§4${DimensionId[dimId]} §g@ §4${xPos}§g, §4${yPos}§g, §4${zPos}`);
        let playerEntry = new PlayerDBEntry(originXuid, playerName);
        playerEntry.addWarp(warpName, dimId, xPos, yPos, xPos);
        warpDB.push(playerEntry);
    }

    let filedata = JSON.stringify(warpDB);
    fs.writeFile(dbFile, filedata, () => {
        console.log('[WARP LIST] Database ' + dbFile + ' SAVED');
        console.log(filedata);
        console.log(warpDB);
    });
}

function warpDel(playerName: string, warpName: string){
    let originXuid = connectionList.nXXid.get(playerName);
    let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == originXuid);

    if (dbObject != undefined){
        let warpObject = dbObject.warp.find((obj: { name: string; }) => obj.name == warpName);
        let dbIndex = warpDB.indexOf(dbObject);

        if (warpObject != undefined){
            let warpIndex: number = warpDB[dbIndex].warp.indexOf(warpObject);
            warpDB[dbIndex].warp.splice(warpIndex, 1);
            console.log(JSON.stringify(warpDB[dbIndex].warp));
            tellRaw(playerName, '§e§l[WARP LIST]');
            tellRaw(playerName, `§eDeleted §3§o${warpObject.name}§r§e\n[§f${DimensionId[warpObject.dimId]} §e@ §4${warpObject.x.toFixed(1)} §a${warpObject.y.toFixed(1)} §9${warpObject.z.toFixed(1)}§e]`);
            tellRaw(playerName, '§e§l* * * * * * *');
        } else {
            tellRaw(playerName, '§e§l[WARP LIST]');
            tellRaw(playerName, `§eNo warp called: §3§o${warpName}`);
            tellRaw(playerName, '§e§l* * * * * * *');
        }

    } else {
        tellRaw(playerName, '§e§l[WARP LIST]');
        tellRaw(playerName, '§c0 §gWarp points set');
        tellRaw(playerName, '§e§l* * * * * * *');
    }
}

function warpTo(playerName: string, warpName: string){
    let originXuid = connectionList.nXXid.get(playerName);
    let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == originXuid);

    if (dbObject != undefined){
        let warpObject = dbObject.warp.find((obj: { name: string; }) => obj.name == warpName);

        if (warpObject != undefined){
            tdTeleport(playerName, warpObject.dimId, warpObject.x, warpObject.y, warpObject.z);
            tellRaw(playerName,`§2${playerName} §gwarped to §4${warpName}§g:\n§4${DimensionId[warpObject.dim]} §g@ §4${warpObject.x}§g, §4${warpObject.y}§g, §4${warpObject.z}`);

        } else {
            tellRaw(playerName,`§2${playerName} §ghas no warp called: §4${warpName}`);
        }

    } else {
        tellRaw(playerName, `§2${playerName} §ghas §40 §gwarps set`);
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
