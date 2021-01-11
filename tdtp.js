"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tdTeleport = void 0;
const bdsx_1 = require("bdsx");
const playerlist_1 = require("./playerlist");
// *** IMPORT kernel32 *** 
// If not using "Set Window Name" from index.ts/index.js, uncomment:
//const kernel32 = new NativeModule("Kernel32.dll");
//
// And remove or comment out: 
const index_1 = require("./index");
// ***********************
let GetModuleHandleW = index_1.kernel32.get('GetModuleHandleW');
let base = GetModuleHandleW("bedrock_server.exe");
let system = server.registerSystem(0, 0);
// EXPORTED tdTeleport function
function tdTeleport(playerName, dimId /* 0=overworld, 1=nether, 2=end */, x, y, z) {
    let netId = playerlist_1.connectionList.get(playerName);
    let actor = netId.getActor();
    changeDimension(actor, dimId, false);
    system.executeCommand(`tp ${playerName} ${x} ${y} ${z}`, (_cb) => {
        //console.log(_cb);
    });
}
exports.tdTeleport = tdTeleport;
// changeDimension function
function changeDimension(actor, dimId, respawn) {
    let ptr = base.clone();
    ptr.move(0xcd3ff0);
    bdsx_1.NativeModule.pointerToFunction(ptr)(actor, dimId, respawn);
}
// Hooking '/tdtp <dimId:{0=overworld, 1=nether, 2=end}> <xPos> <yPos> <zPos>' command  
bdsx_1.command.hook.on((command, originName) => {
    if (command.startsWith('/tdtp')) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRkdHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDtBQUMxRCxrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGOzs7QUFFbEYsK0JBQTZDO0FBQzdDLDZDQUE4QztBQUU5QywyQkFBMkI7QUFDM0Isb0VBQW9FO0FBQ3BFLG9EQUFvRDtBQUNwRCxFQUFFO0FBQ0YsOEJBQThCO0FBQzlCLG1DQUFtQztBQUNuQywwQkFBMEI7QUFFMUIsSUFBSSxnQkFBZ0IsR0FBUSxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzdELElBQUksSUFBSSxHQUFRLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDdkQsSUFBSSxNQUFNLEdBQVEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFHN0MsK0JBQStCO0FBQy9CLFNBQWdCLFVBQVUsQ0FBQyxVQUFrQixFQUFFLEtBQWEsQ0FBQSxrQ0FBa0MsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDM0gsSUFBSSxLQUFLLEdBQUcsMkJBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdCLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQVEsRUFBRSxFQUFFO1FBQ2xFLG1CQUFtQjtJQUN2QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFQRCxnQ0FPQztBQUVELDJCQUEyQjtBQUMzQixTQUFTLGVBQWUsQ0FBQyxLQUFVLEVBQUUsS0FBVSxFQUFFLE9BQWdCO0lBQzdELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25CLG1CQUFZLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUQsd0ZBQXdGO0FBQ3hGLGNBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFO0lBQ3BDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBQztRQUM1QixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFDeEcsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsQ0FBQztLQUNaO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==