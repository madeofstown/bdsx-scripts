/// <reference types="minecraft-scripting-types-server" />

import { netevent, PacketId } from "bdsx";

export const connectionList = new Map(); // NetworkId -> Name & Name -> NetworkId

//Read Login Packet and Add Player To Connection List
netevent.after(PacketId.Login).on((ptr, networkIdentifier, packetId) => {
    let ip = networkIdentifier.getAddress();
    let [xuid, username] = netevent.readLoginPacket(ptr);
    if (username) {
        connectionList.set(username, networkIdentifier);
        connectionList.set(networkIdentifier, username);
        console.log(`[SCRIPT INFO] ${username}|${xuid} JOINED from ${ip}`);
        console.log(`[SCRIPT INFO] ${username} ADDED to CONNECTION LIST`)
    }
});

//Read Disconnect Event and Remove Player From Connection List
netevent.close.on(networkIdentifier => {
    let username = connectionList.get(networkIdentifier);
    connectionList.delete(networkIdentifier);
    connectionList.delete(username);
    console.log(`[SCRIPT INFO] ${username} REMOVED from CONNECTION LIST`);
});
