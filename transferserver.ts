/// <reference types="minecraft-scripting-types-server" />
/*
 *  *   *   *   *   *   *   *   *   *   *
 *  BDSX2 SCRIPT - transferserver.ts    *
 *  by randmmouse/madeofstown           *
 *  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
 *  USE/FUNCTION:                                                   *
 *  *   Transfer players to other servers!                          *
 *  *   Place inside ./scripts/ folder                              *
 *  *   To use the /transferserver command in game:                 *
 *  *   ADD "import './transferserver';" TO ./scripts/index.ts      *
 *  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
 *  REQUIRED CUSTOM SCRIPTS:        *
 *  *   - playerlist.ts             *
 *  *   *   *   *   *   *   *   *   *
 */

import { command, NetworkIdentifier } from "bdsx";
import { connectionList } from "./playerlist";
import { TransferPacket } from "bdsx/bds/packets";


//Hook and Process the Command '/transferserver <address> <port>'
command.hook.on((command, originName)=>{
    if (command.startsWith('/transferserver')) {
        var splitcmd = command.split(' ')
        if (originName === 'Server') {
            var originNetId = connectionList.nXNet.get(splitcmd[1]);
            var address = splitcmd[2];
            var port = parseInt(splitcmd[3], 10);
            transferServer(originNetId, address, port);
        } else if (originName === 'Script Engine') {
            var originNetId = connectionList.nXNet.get(splitcmd[1]);
            var address = splitcmd[2];
            var port = parseInt(splitcmd[3], 10);
            transferServer(originNetId, address, port);
        } else {
            var originNetId = connectionList.nXNet.get(originName);
            var address = splitcmd[1]
            var port = parseInt(splitcmd[2], 10);
            transferServer(originNetId, address, port);
        }
        console.log(command, originName, address, port);
        return 0;
    }

});

// Transfer Server Function
export function transferServer(networkIdentifier:NetworkIdentifier, address:string, port:number):void {
    if ( Number.isInteger(port) != true ) port = 19132;
    let transferPacket = TransferPacket.create();
    transferPacket.address = address;
    transferPacket.port = port;
    transferPacket.sendTo(networkIdentifier, 0);
    transferPacket.dispose();
}