"use strict";
/// <reference types="minecraft-scripting-types-server" />
//------------------------------------------------------------------------------//
//                               Transfer Server                                //
//                               script for BDSX                                //
//                    (transferserver.ts/transferserver.js)                     //
//                         by randommouse/madeofstown                           //
//------------------------------------------------------------------------------//
//                                Use/Function:                                 //
//                      Transfer Players to Other Servers                       //
//------------------------------------------------------------------------------//
//                          Required Custom Scripts:                            //
//                         plyerlist.ts/playerlist.js                           //
//------------------------------------------------------------------------------//
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferServer = void 0;
const bdsx_1 = require("bdsx");
const playerlist_1 = require("./playerlist");
//Hook and Process the Command
bdsx_1.command.hook.on((command, originName) => {
    if (command.startsWith('/transferserver')) {
        var splitcmd = command.split(' ');
        if (originName === 'Server') {
            var originNetId = playerlist_1.connectionList.get(splitcmd[1]);
            var address = splitcmd[2];
            var port = parseInt(splitcmd[3], 10);
            transferServer(originNetId, address, port);
        }
        else if (originName === 'Script Engine') {
            var originNetId = playerlist_1.connectionList.get(splitcmd[1]);
            var address = splitcmd[2];
            var port = parseInt(splitcmd[3], 10);
            transferServer(originNetId, address, port);
        }
        else {
            var originNetId = playerlist_1.connectionList.get(originName);
            var address = splitcmd[1];
            var port = parseInt(splitcmd[2], 10);
            transferServer(originNetId, address, port);
        }
        console.log(command, originName, address, port);
        return 0;
    }
});
// Transfer Server Function
function transferServer(networkIdentifier, address, port /*integer*/) {
    if (Number.isInteger(port) != true)
        port = 19132;
    let transferPacket = bdsx_1.createPacket(bdsx_1.PacketId.Transfer);
    transferPacket.setCxxString(address, 0x28);
    transferPacket.setUint16(port, 0x48);
    bdsx_1.sendPacket(networkIdentifier, transferPacket);
    transferPacket.dispose();
}
exports.transferServer = transferServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXJzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmFuc2ZlcnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMERBQTBEO0FBQzFELGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGOzs7QUFFbEYsK0JBQXNGO0FBQ3RGLDZDQUE4QztBQUU5Qyw4QkFBOEI7QUFDOUIsY0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFDLEVBQUU7SUFDbkMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7UUFDdkMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNqQyxJQUFJLFVBQVUsS0FBSyxRQUFRLEVBQUU7WUFDekIsSUFBSSxXQUFXLEdBQUcsMkJBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckMsY0FBYyxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDOUM7YUFBTSxJQUFJLFVBQVUsS0FBSyxlQUFlLEVBQUU7WUFDdkMsSUFBSSxXQUFXLEdBQUcsMkJBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckMsY0FBYyxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDOUM7YUFBTTtZQUNILElBQUksV0FBVyxHQUFHLDJCQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN6QixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsQ0FBQztLQUNaO0FBRUwsQ0FBQyxDQUFDLENBQUM7QUFFSCwyQkFBMkI7QUFDM0IsU0FBZ0IsY0FBYyxDQUFDLGlCQUFvQyxFQUFFLE9BQWUsRUFBRSxJQUFZLENBQUEsV0FBVztJQUN6RyxJQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSTtRQUFHLElBQUksR0FBRyxLQUFLLENBQUM7SUFDbkQsSUFBSSxjQUFjLEdBQUcsbUJBQVksQ0FBQyxlQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckQsY0FBYyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckMsaUJBQVUsQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUM5QyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsQ0FBQztBQVBELHdDQU9DIn0=