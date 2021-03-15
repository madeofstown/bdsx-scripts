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
// https://github.com/Rjlintkh/bdsx-scripts/blob/main/scripts/minecraftFunctions.ts  //
//------------------------------------------------------------------------------//

import { pdb } from "bdsx/core";
import { SYMOPT_UNDNAME } from "bdsx/common";
import { ProcHacker } from "bdsx/prochacker";
import { Actor, command, DimensionId, RawTypeId } from "bdsx";
import { Vec3 } from "bdsx/bds/blockpos";
import { connectionList } from "./playerlist";

// Open PDB and look for teleport function
pdb.setOptions(SYMOPT_UNDNAME);
const hacker = ProcHacker.load("../pdbcache.ini", [
    "TeleportCommand::teleport"
]);
pdb.setOptions(0);
pdb.close();
const _tdtp = hacker.js("TeleportCommand::teleport", RawTypeId.Void, null, Actor, Vec3, Vec3, RawTypeId.Int32);

// Teleport function
export function tdTeleport(playerName: string, dimensionId: DimensionId = DimensionId.Overworld, x: number, y: number, z:number): void {
    let _netId = connectionList.nXNet.get(playerName);
    let _actor: Actor = _netId.getActor();
    let pos = new Vec3(true);
    pos.x = x;
    pos.y = y;
    pos.z = z;

    _tdtp(_actor, pos, new Vec3(true), dimensionId);
}

// Hooking '/tdtp <dimId:{0=overworld, 1=nether, 2=end}> <xPos> <yPos> <zPos>' command
command.hook.on((command, originName) => {
    if (command.startsWith('/tdtp')){
        let cmdData = command.split(' ');
        let dimId = parseInt(cmdData[1]);
        let xPos: number = parseFloat(cmdData[2]);
        let yPos: number = parseFloat(cmdData[3]);
        let zPos: number = parseFloat(cmdData[4]);
        console.log('[COMMAND HOOK] /tdtp ' + dimId + ' ' + xPos + ' ' + yPos + ' ' + zPos + ' @' + originName);
        tdTeleport(originName, dimId, xPos, yPos, zPos);
        return 0;
    }
});
