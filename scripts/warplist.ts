
import { Actor, command, NetworkIdentifier } from 'bdsx';
import fs = require('fs');
import { connectionList } from './playerlist';
import { tdTeleport } from './tdtp';

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
    if (cmdString.startsWith('/sethome')){
        // 
        let originActor = connectionList.nXNet.get(originName).getActor();
        let originEntity = connectionList.n2Ent.get(originName);
        let originPosition = system.getComponent(originEntity, MinecraftComponent.Position)
        let originXuid = connectionList.nXXid.get(originName);
        let dimId = originActor.getDimension();
        let xPos = originPosition!.data.x;
        let yPos = originPosition!.data.y;
        let zPos = originPosition!.data.z;
        let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == originXuid);
        let warpEntry = new WarpDBEntry('.home', dimId, xPos, yPos, zPos)
        // 
        if (dbObject != undefined){
            let dbIndex = warpDB.indexOf(dbObject);
            let warpObject = dbObject.warp.find((obj: { name: string; }) => obj.name == '.home');
            if (warpObject != undefined){
                console.log('Existing: ' + warpObject.name);
                let warpIndex = warpDB[dbIndex].warp.indexOf(warpObject);
                warpDB[dbIndex].warp[warpIndex] = warpEntry;
                console.log(JSON.stringify(warpDB));
                console.log(warpDB);
                return 0;
            } else {
                warpDB[dbIndex].warp.push(warpEntry);
                console.log(JSON.stringify(warpDB));
                console.log(warpDB);
                return 0;
            }
        } else {
            let playerEntry = new PlayerDBEntry(originXuid, originName);
            playerEntry.addWarp('.home', dimId, xPos, yPos, xPos);
            warpDB.push(playerEntry);
        }
        console.log(JSON.stringify(warpDB));
    }
    if (cmdString.startsWith('/home')){
        // 
        let originActor = connectionList.nXNet.get(originName).getActor();
        let originXuid = connectionList.nXXid.get(originName);
        let oiriginDimId = originActor.getDimension();
        let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == originXuid);
        // 
        if (dbObject != undefined){
            let dbIndex = warpDB.indexOf(dbObject);
            let warpObject = dbObject.warp.find((obj: { name: string; }) => obj.name == '.home');
            console.log(warpObject)
            if (warpObject != undefined){
                if (warpObject.dimId == oiriginDimId){
                    system.executeCommand(`tp ${originName} ${warpObject.x} ${warpObject.y} ${warpObject.z}`, cb => {});
                    return 0; 
                } else {
                    tdTeleport(originName, warpObject.dimId, warpObject.x, warpObject.y, warpObject.z);
                }
            }
        }
    }
});

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
