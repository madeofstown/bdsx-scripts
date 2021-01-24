import { command } from '../bdsx/';
import fs = require('fs');
import { connectionList } from './playerlist';


let warpDB: any = []
// /adddb adds an entry to the warp db (for testing purposes). IF player entry exists for the command user then the the warp location
// is pushed to the existing entry
// /savedb pulls data from warpDB[] and writes it to /bedrock_server/jsondb.json
// /loaddb reads file /bedrock_server/jsondb.json parses it to warpDB[].
// /testdb is only for testing. i use it to try new code ideas.
command.hook.on((command, originName) => {
    if (command.startsWith('/adddb')){
        let originXuid = connectionList.nXXid.get(originName);
        let cmdData = command.split(' ');
        let dbObject = warpDB.find((obj: { xuid: string; }) => obj.xuid == originXuid);
        let dbEntry = addWarp(cmdData[1], parseInt(cmdData[2]), parseFloat(cmdData[3]), parseFloat(cmdData[4]), parseFloat(cmdData[5]));
        if (dbObject != undefined){
            let dbIndex = warpDB.indexOf(dbObject);
            let warpObject = dbObject.warp.find((obj: { name: string; }) => obj.name == cmdData[1]);
            if (warpObject != undefined){
                console.log('Existing: ' + warpObject);
                let warpIndex = warpDB[dbIndex].warp.indexOf(warpObject);
                warpDB[dbIndex].warp[warpIndex] = dbEntry;
                console.log(JSON.stringify(warpDB));
                console.log(warpDB);
                return 0;
            } else {
            warpDB[dbIndex].warp.push(dbEntry);
            console.log(JSON.stringify(warpDB));
            console.log(warpDB);
            return 0;
            }
        } else {
            let player = new PlayerDBEntry(originXuid, originName);
            player.addWarp(cmdData[1], parseInt(cmdData[2]), parseFloat(cmdData[3]), parseFloat(cmdData[4]), parseFloat(cmdData[5]));
            warpDB.push(player);
            console.log(JSON.stringify(warpDB));
            console.log(warpDB);
            return 0;
        }       
    }
    if (command.startsWith('/loaddb')){
        fs.readFile('jsondb.json', (err, data: any) =>{
            console.log('[COMMAND HOOK] ' + command + ' @' + originName);
            warpDB = JSON.parse(data);
            console.log(JSON.stringify(warpDB));
            console.log(warpDB);
        });
        return 0;
    }
    if (command.startsWith('/savedb')){
        let filedata = JSON.stringify(warpDB);
        fs.writeFile('jsondb.json', filedata, () => {
            console.log('[COMMAND HOOK] ' + command + ' @' + originName);
            console.log(filedata);
            console.log(warpDB);    
        });
        return 0;
    }
    if (command.startsWith('/testdb')){
        let dbObject = warpDB.find((obj: { name: string; }) => obj.name == originName)
        console.log(warpDB.indexOf(dbObject));
        console.log(dbObject);
    }  
});
 
function addWarp(name: string, dimensionId: number, xPos: number, yPos: number, zPos: number){
    let content: {[key: string]: any} = {
        name: name,
        dimId: dimensionId,
        xPos: xPos,
        yPos: yPos,
        zPos: zPos
    }
    return content;
}

 


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
            xPos: xPos,
            yPos: yPos,
            zPos: zPos
        }
        this.warp.push(content);
    }
}




