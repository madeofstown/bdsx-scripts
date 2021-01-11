"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const bdsx_1 = require("bdsx");
const playerlist_1 = require("./playerlist");
const forms_1 = require("./forms/forms");
let system = server.registerSystem(0, 0);
// Test for player Initialization
bdsx_1.netevent.after(bdsx_1.PacketId.SetLocalPlayerAsInitializedPacket).on((_ptr, networkIdentifier, _packetId) => {
    if (networkIdentifier) {
        let username = playerlist_1.connectionList.get(networkIdentifier);
        // Player Initialization Console Logging
        console.log(`[SCRIPT INFO] ${username} INITIALIZED`);
        // Teleport Player to World Spawn
        //system.executeCommand(`/tp ${username} 0 100 0`, () => {});
        // Send Test Form to Player
        forms_1.testForm(networkIdentifier);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBsYXllcmluaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDtBQUMxRCxrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGOztBQUlsRiwrQkFBMEM7QUFDMUMsNkNBQThDO0FBQzlDLHlDQUF5QztBQUd6QyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUV6QyxpQ0FBaUM7QUFDakMsZUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFRLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLEVBQUU7SUFDakcsSUFBSSxpQkFBaUIsRUFBRTtRQUNuQixJQUFJLFFBQVEsR0FBRywyQkFBYyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1FBQ3BELHdDQUF3QztRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixRQUFRLGNBQWMsQ0FBQyxDQUFDO1FBRXJELGlDQUFpQztRQUNqQyw2REFBNkQ7UUFFN0QsMkJBQTJCO1FBQzNCLGdCQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUUvQjtBQUNMLENBQUMsQ0FBQyxDQUFDIn0=