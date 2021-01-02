"use strict";
/// <reference types="minecraft-scripting-types-server" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionList = void 0;
const bdsx_1 = require("bdsx");
exports.connectionList = new Map(); // NetworkId -> Name & Name -> NetworkId
//Read Login Packet and Add Player To Connection List
bdsx_1.netevent.after(bdsx_1.PacketId.Login).on((ptr, networkIdentifier, packetId) => {
    let ip = networkIdentifier.getAddress();
    let [xuid, username] = bdsx_1.netevent.readLoginPacket(ptr);
    if (username) {
        exports.connectionList.set(username, networkIdentifier);
        exports.connectionList.set(networkIdentifier, username);
        console.log(`[SCRIPT INFO] ${username}|${xuid} JOINED from ${ip}`);
        console.log(`[SCRIPT INFO] ${username} ADDED to CONNECTION LIST`);
    }
});
//Read Disconnect Event and Remove Player From Connection List
bdsx_1.netevent.close.on(networkIdentifier => {
    let username = exports.connectionList.get(networkIdentifier);
    exports.connectionList.delete(networkIdentifier);
    exports.connectionList.delete(username);
    console.log(`[SCRIPT INFO] ${username} REMOVED from CONNECTION LIST`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVybGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBsYXllcmxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDs7O0FBRTFELCtCQUEwQztBQUU3QixRQUFBLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsd0NBQXdDO0FBRWpGLHFEQUFxRDtBQUNyRCxlQUFRLENBQUMsS0FBSyxDQUFDLGVBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLEVBQUU7SUFDbkUsSUFBSSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDeEMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxlQUFRLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JELElBQUksUUFBUSxFQUFFO1FBQ1Ysc0JBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDaEQsc0JBQWMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsUUFBUSxJQUFJLElBQUksZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsUUFBUSwyQkFBMkIsQ0FBQyxDQUFBO0tBQ3BFO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCw4REFBOEQ7QUFDOUQsZUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBRTtJQUNsQyxJQUFJLFFBQVEsR0FBRyxzQkFBYyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JELHNCQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDekMsc0JBQWMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsUUFBUSwrQkFBK0IsQ0FBQyxDQUFDO0FBQzFFLENBQUMsQ0FBQyxDQUFDIn0=