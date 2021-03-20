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

import { Actor, nethook, NetworkIdentifier, PacketId } from "bdsx";
import colors = require('colors');

export var connectionList = {
    nXNet: new Map(),   /* Name to NetworkId & NetworkId to Name */
    nXXid: new Map(),   /* Name to Xuid & Xuid to Name */
    n2Ent: new Map()    /* Name to Entity */
}

let system = server.registerSystem(0, 0);

//Read Login Packet and Add Player To Connection List
nethook.after(PacketId.Login).on((ptr, networkIdentifier, packetId) => {
    let ip = networkIdentifier.getAddress();
    let cert = ptr.connreq.cert;
    let xuid = cert.getXuid();
    let username = cert.getId();
    if (username) {
        connectionList.nXNet.set(username, networkIdentifier);
        connectionList.nXNet.set(networkIdentifier, username);
        connectionList.nXXid.set(username, xuid);
        connectionList.nXXid.set(xuid, username);
        console.log(colors.grey('[PLAYERLIST] ' + colors.yellow(username) + ' ADDED to CONNECTION LIST (nXNet, nXXid)'));
        // console.log(connectionList.nXNet);
        // console.log(connectionList.nXXid);
    }
});
system.listenForEvent('minecraft:entity_created', ev => {
            const actor = Actor.fromEntity(ev.data.entity);
            let entity = ev.data.entity;
            // console.log(entity)
            if (actor?.isPlayer())
            {
                let playerName = system.getComponent(entity, 'minecraft:nameable');
                // console.log(playerName?.data.name);
                connectionList.n2Ent.set(playerName?.data.name, entity)
                console.log(colors.grey('[PLAYERLIST] ' + colors.yellow(playerName!.data.name) + ' ADDED to CONNECTION LIST (n2Ent)'));
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
    console.log(colors.grey('[PLAYERLIST] ' + colors.yellow(username)  + ' REMOVED from CONNECTION LIST'));
})