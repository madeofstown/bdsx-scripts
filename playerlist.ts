//------------------------------------------------------------------------------//
//                           Map NAME <--> NetworkID                            //
//                               script for BDSX                                //
//                        (playerlist.ts/playerlist.js)                         //
//                         by randommouse/madeofstown                           //
//------------------------------------------------------------------------------//
//                                Use/Function:                                 //
//                      Create a Map obect that contains:                       //
//           Name -> NetworkID AND NetworkID -> for each active player          // 
//                  (removes players from map when they leave)                  //
//------------------------------------------------------------------------------//
//                          Required Custom Scripts:                            //
//                        playerlist.ts/playerlist.js                           //
//                             forms.ts/forms.js                                //
//------------------------------------------------------------------------------//

import { Actor, netevent, NetworkIdentifier, PacketId } from "bdsx";


export const connectionList = {
    nXNet: new Map(),   /* Name to NetworkId & NetworkId to Name */
    nXXid: new Map(),   /* Name to Xuid & Xuid to Name */
    n2Ent: new Map()    /* Name to Entity */
}

let system = server.registerSystem(0, 0);

//Read Login Packet and Add Player To Connection List
netevent.after(PacketId.Login).on((ptr, networkIdentifier, packetId) => {
    let ip = networkIdentifier.getAddress();
    // let actor = networkIdentifier.getActor();
    let cert = ptr.connreq.cert;
    let xuid = cert.getXuid();
    let username = cert.getId();
    if (username) {
        connectionList.nXNet.set(username, networkIdentifier);
        connectionList.nXNet.set(networkIdentifier, username);
        connectionList.nXXid.set(username, xuid);
        connectionList.nXXid.set(xuid, username);
        console.log(`[SCRIPT INFO] ${username}|${xuid} JOINED from ${ip}`);
        console.log(`[SCRIPT INFO] ${username} ADDED to CONNECTION LIST`);
        console.log(connectionList.nXNet);
        console.log(connectionList.nXXid);
    }
});
system.listenForEvent(ReceiveFromMinecraftServer.EntityCreated, ev => {
            const actor = Actor.fromEntity(ev.data.entity);
            let entity = ev.data.entity;
            // console.log(entity)
            if (actor?.isPlayer())
            {
                let playerName = system.getComponent(entity, MinecraftComponent.Nameable);
                // console.log(playerName?.data.name);
                connectionList.n2Ent.set(playerName?.data.name, entity)
                console.log(connectionList.n2Ent);
            }
});

//Read Disconnect Event and Remove Player From Connection List
NetworkIdentifier.close.on(networkIdentifier => {
    let username = connectionList.nXNet.get(networkIdentifier);
    let xuid = connectionList.nXXid.get(username);
    connectionList.nXNet.delete(networkIdentifier);
    connectionList.nXNet.delete(username);
    connectionList.nXXid.delete(username);
    connectionList.nXXid.delete(xuid);
    connectionList.n2Ent.delete(username);
    console.log(`[SCRIPT INFO] ${username} REMOVED from CONNECTION LIST`);
})