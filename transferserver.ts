/// <reference types="minecraft-scripting-types-server" />

import { PacketId, createPacket, sendPacket, command } from "bdsx";
import { connectionList } from "./playerlist";

//Hook and Process the Command
command.hook.on((command, originName)=>{
    if (command.startsWith('/transferserver')) {
        var splitcmd = command.split(' ')
        if (originName === 'Server') {
            var originNetId = connectionList.get(splitcmd[1]);
            var address = splitcmd[2];
            var port = parseInt(splitcmd[3], 10);
            transferServer(originNetId, address, port);
        } else if (originName === 'Script Engine') {
            var originNetId = connectionList.get(splitcmd[1]);
            var address = splitcmd[2];
            var port = parseInt(splitcmd[3], 10);
            transferServer(originNetId, address, port);
        } else {
            var originNetId = connectionList.get(originName);
            var address = splitcmd[1]
            var port = parseInt(splitcmd[2], 10);
            transferServer(originNetId, address, port);
        }
        console.log(command, originName, address, port);
        return 0;
    }

});

// Transfer Server Function
export function transferServer(networkIdentifier, address: string, port: number/*integer*/) {
    if ( Number.isInteger(port) != true ) port = 19132;
    let transferPacket = createPacket(PacketId.Transfer);
    transferPacket.setCxxString(address, 0x28);
    transferPacket.setUint16(port, 0x48);
    sendPacket(networkIdentifier, transferPacket);
    transferPacket.dispose();
}
