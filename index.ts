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

// Set Window Name
//************
let windowName = "BDSX - BedrockServer"
//************
import { NativeModule, netevent, PacketId } from "bdsx";
export const kernel32 = new NativeModule("Kernel32.dll");
const user32 = new NativeModule("User32.dll");
const GetConsoleWindow: any = kernel32.get("GetConsoleWindow");
const SetWindowText = user32.get("SetWindowTextW")!;
const wnd = GetConsoleWindow();
SetWindowText(wnd, windowName)


// IMPORT playerlist script
import './playerlist';

// IMPORT playerinit scrip
import './playerinit';

//IMPORT transferserver script
import './transferserver';

//IMPORT tdtp (Transdimentional Teleport) script
import './tdtp'



