/// <reference types="minecraft-scripting-types-server" />
//------------------------------------------------------------------------------//
//                         Player Initialization Hook                           //
//                               script for BDSX                                //
//                        (playerinit.ts/playerinit.js)                         //
//                         by randommouse/madeofstown                           //
//------------------------------------------------------------------------------//
//                                Use/Function:                                 //
//           Run functions, commands and other things after a player            //
//                  has joined an initialized onto the server                   //
//------------------------------------------------------------------------------//
//                          Required Custom Scripts:                            //
//                        playerlist.ts/playerlist.js                           //
//                             forms.ts/forms.js                                //
//------------------------------------------------------------------------------//

import { netevent, PacketId } from "bdsx";
import { connectionList } from "./playerlist";
// import { transferServer } from "./transferserver";
// import { testForm } from "./forms/forms";


// let system = server.registerSystem(0, 0);

// Test for player Initialization
netevent.after(PacketId.SetLocalPlayerAsInitialized).on((_ptr, networkIdentifier, _packetId) => {
    if (networkIdentifier) {
        let username = connectionList.nXNet.get(networkIdentifier)
        
        // Player Initialization Console Logging
        console.log(`[SCRIPT INFO] ${username} INITIALIZED`);
        
        // Teleport Player to World Spawn
        // system.executeCommand(`/tp ${username} 0 100 0`, () => {});

        // Send Test Form to Player
        // testForm(networkIdentifier);

        // Transfer Player to Another Server
        // transferServer(networkIdentifier, 'stonecraft.rndmm.us', 19132);

    }
});


