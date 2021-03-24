
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
command.register('warp', 'Set, Delete, List, or Teleport to Warp Points.').overload((param, origin, output)=>{
    let playerName = origin.getName();
    // /warp list
    if (param.warpCmd == 'list'){
        if (warpListGUI == true) {
            warpListForm(playerName);
        } else {
            warpList(playerName);
        }
    }
    // /warp set "warpName" (use "" if name includes spaces)
    if (param.warpCmd == 'set' && param.warpName !== undefined){ warpSet(playerName, param.warpName) };
    // /warp del "warpName" (use "" if name includes spaces)
    if (param.warpCmd == 'del' && param.warpName !== undefined){ warpDel(playerName, param.warpName) };
    // /warp to "warpName" (use "" if name includes spaces)
    if (param.warpCmd == 'to' && param.warpName !== undefined){ warpTo(playerName, param.warpName) };

}, {warpCmd: CxxString, warpName: [CxxString, true]});

command.register('warp set', '§eSet§7 a Warp Point.');

command.register('warp del', '§eDelete§7 a Warp Point.');

command.register('warp to', '§eTeleport§7 to a Warp Point.');

command.register('warp list', '§eList§7 your Warp Points.');
// /sethome
command.register('sethome', `§eSet§7 your ${homename}§r§o§7 Warp Point.`).overload((param, origin, output)=>{
    warpSet(origin.getName(), homename);
},{});
// /home
command.register('home', `§eTeleport§7 to your ${homename}§r§o§7 Warp Point.`).overload((param, origin, output)=>{
    warpTo(origin.getName(), homename);
},{});;

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
            warpDB.push(new PlayerDBEntry(originXuid, playerName, warpEntry));
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

    tellRaw(playerName, '§e§l[WARP LIST]');
    if (dbObject != undefined){
        if (dbObject.warp.length > 0){
            for (let i = 0; i < dbObject.warp.length; i++) {
                tellRaw(playerName , `§e[${i + 1}] §3§o${dbObject.warp[i].name}§r§e\n    [§f${DimensionId[dbObject.warp[i].dimId]} §e@ §4${dbObject.warp[i].x.toFixed(1)} §a${dbObject.warp[i].y.toFixed(1)} §9${dbObject.warp[i].z.toFixed(1)}§e]`);
            }

        } else {
            tellRaw(playerName, '§c0 §gWarp points set');
        }

    } else {
        tellRaw(playerName, '§c0 §gWarp points set');
    }
    tellRaw(playerName, '§e§l* * * * * * *');
}

function warpListForm(playerName: string) {
    let playerXuid = connectionList.nXXid.get(playerName);
    let playerNetID = connectionList.nXNet.get(playerName);
    let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == playerXuid);
    let warpListForm = new SimpleForm('§0§l[WARP LIST]')

    if (dbObject != undefined) {
        if (dbObject.warp.length >= 0) {
            for (let i = 0; i < dbObject.warp.length; i++) {
                warpListForm.addButton(new FormButton(`§1§o${dbObject.warp[i].name}§r§8\n[§0${DimensionId[dbObject.warp[i].dimId]} §8@ §4${dbObject.warp[i].x.toFixed(1)} §2${dbObject.warp[i].y.toFixed(1)} §9${dbObject.warp[i].z.toFixed(1)}§8]`));
            }
            warpListForm.sendTo(playerNetID, (data, playerNetID) => {
                if (data.response !== undefined && data.response !== null){
                warpTo(playerName, dbObject.warp[data.response].name);
                }
            })
        } else {
            tellRaw(playerName, '§e§l[WARP LIST]');
            tellRaw(playerName, '§c0 §gWarp points set');
            tellRaw(playerName, '§e§l* * * * * * *');
        }

    } else {
        tellRaw(playerName, '§e§l[WARP LIST]');
        tellRaw(playerName, '§c0 §gWarp points set');
        tellRaw(playerName, '§e§l* * * * * * *');
    }
}

// Database Entry Classes
class PlayerDBEntry {
    xuid: string;
    name: string;
    warp: WarpDBEntry;
    constructor(xuid: string, name: string, warp?: WarpDBEntry ){
        this.xuid = xuid;
        this.name = name;
        this.warp = [];
        if (warp != undefined){this.warp.push(warp)}
    }
}

class WarpDBEntry {
    [key: string]: any
    constructor(warpName: string, dimensionId: number, xPos: number, yPos: number, zPos: number){
        this.name = warpName;
        this.dimId = dimensionId;
        this.x = xPos;
        this.y = yPos;
        this.z = zPos;
    }
}
