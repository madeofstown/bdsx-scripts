"use strict";
/// <reference types="minecraft-scripting-types-server" />
//------------------------------------------------------------------------------//
//                           Index / Set Window Name                            //
//                               script for BDSX                                //
//                             (index.ts/index.js)                              //
//                         by randommouse/madeofstown                           //
//------------------------------------------------------------------------------//
//                                Use/Function:                                 //
//                        Default script loaded by BDSX.                        //
//  Used for setting the name of the console window and importing other scripts //
//------------------------------------------------------------------------------//
//                          Required Custom Scripts:                            //
//                       None, But Strongly Reccommend:                         //
//                         plyerlist.ts/playerlist.js                           //
//------------------------------------------------------------------------------//
Object.defineProperty(exports, "__esModule", { value: true });
exports.kernel32 = void 0;
// Set Window Name
//************
let windowName = "BDSX - BedrockServer";
//************
const bdsx_1 = require("bdsx");
exports.kernel32 = new bdsx_1.NativeModule("Kernel32.dll");
const user32 = new bdsx_1.NativeModule("User32.dll");
const GetConsoleWindow = exports.kernel32.get("GetConsoleWindow");
const SetWindowText = user32.get("SetWindowTextW");
const wnd = GetConsoleWindow();
SetWindowText(wnd, windowName);
// IMPORT playerlist script
require("./playerlist");
// IMPORT playerinit scrip
require("./playerinit");
//IMPORT transferserver script
require("./transferserver");
//IMPORT tdtp (Transdimentional Teleport) script
require("./tdtp");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMERBQTBEO0FBQzFELGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7OztBQUVsRixrQkFBa0I7QUFDbEIsY0FBYztBQUNkLElBQUksVUFBVSxHQUFHLHNCQUFzQixDQUFBO0FBQ3ZDLGNBQWM7QUFDZCwrQkFBd0Q7QUFDM0MsUUFBQSxRQUFRLEdBQUcsSUFBSSxtQkFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3pELE1BQU0sTUFBTSxHQUFHLElBQUksbUJBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM5QyxNQUFNLGdCQUFnQixHQUFRLGdCQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDL0QsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBRSxDQUFDO0FBQ3BELE1BQU0sR0FBRyxHQUFHLGdCQUFnQixFQUFFLENBQUM7QUFDL0IsYUFBYSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUc5QiwyQkFBMkI7QUFDM0Isd0JBQXNCO0FBRXRCLDBCQUEwQjtBQUMxQix3QkFBc0I7QUFFdEIsOEJBQThCO0FBQzlCLDRCQUEwQjtBQUUxQixnREFBZ0Q7QUFDaEQsa0JBQWUifQ==