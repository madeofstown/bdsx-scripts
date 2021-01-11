/// <reference types="minecraft-scripting-types-server" />
//------------------------------------------------------------------------------//
//                          Transdimenstion Teleport                            //
//                               script for BDSX                                //
//                              (tdtp.ts/tdtp.js)                               //
//                         by randommouse/madeofstown                           //
//------------------------------------------------------------------------------//
//                                Use/Function:                                 //
//                     Teleport Players Across Dimensions                       //
//------------------------------------------------------------------------------//
//                          Required Custom Scripts:                            //
//                         plyerlist.ts/playerlist.js                           //
//                         Recommended Custom Scripts:                          //
//                              index.ts/index.js                               //
//------------------------------------------------------------------------------//
//                   Thansks to P Jai Rjlin and their work @                    //
// https://github.com/Rjlintkh/bdsx-scripts/blob/main/scripts/pdb_functions.js  //
//------------------------------------------------------------------------------//

import { command, NativeModule } from "bdsx";
import { connectionList } from "./playerlist";

// *** IMPORT kernel32 *** 
// If not using "Set Window Name" from index.ts/index.js, uncomment:
//const kernel32 = new NativeModule("Kernel32.dll");
//
// And remove or comment out: 
import { kernel32 } from "./index";
// ***********************

let GetModuleHandleW: any = kernel32.get('GetModuleHandleW');
let base: any = GetModuleHandleW("bedrock_server.exe");
let system: any = server.registerSystem(0,0);


// EXPORTED tdTeleport function
export function tdTeleport(playerName: string, dimId: number/* 0=overworld, 1=nether, 2=end */, x: number, y: number, z: number) {
    let netId = connectionList.get(playerName);
    let actor = netId.getActor();
    changeDimension(actor, dimId, false);
    system.executeCommand(`tp ${playerName} ${x} ${y} ${z}`, (_cb: any) =>{
        //console.log(_cb);
    });
}

// changeDimension function
function changeDimension(actor: any, dimId: any, respawn: boolean) {
    let ptr = base.clone();
    ptr.move(0xcd3ff0);
    NativeModule.pointerToFunction(ptr)(actor, dimId, respawn);
}

// Hooking '/tdtp <dimId:{0=overworld, 1=nether, 2=end}> <xPos> <yPos> <zPos>' command  
command.hook.on((command, originName) => {
    if (command.startsWith('/tdtp')){
        let cmdData = command.split(' ');
        let dimId = parseInt(cmdData[1]);
        let xPos = parseInt(cmdData[2]);
        let yPos = parseInt(cmdData[3]);
        let zPos = parseInt(cmdData[4]);
        console.log('[COMMAND HOOK] /tdtp ' + dimId + ' ' + xPos + ' ' + yPos + ' ' + zPos + ' @' + originName);
        tdTeleport(originName, dimId, xPos, yPos, zPos);
        return 0;       
    }  
});