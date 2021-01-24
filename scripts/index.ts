/// <reference types="minecraft-scripting-types-server" />
/* 
 *  *   *   *   *   *   *   *   *
 *  BDSX2 SCRIPT - index.ts     *
 *  by randommouse/madeofstown  *
 *  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
 *  USE/FUNCTION:                                                       *
 *  *   Set the console window name and call other custom scripts.      *
 *  *   Create ./scripts/ folder and place inside with other custom     *
 *  *   scripts to be loaded.                                           *
 *  *   ADD "import './scripts';" TO ./index.ts                         *                                      
 *  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
 */

import { NativeModule, RawTypeId, VoidPointer } from "bdsx";


// Set Console Window Name  *   *   *   *
let windowName = "BDSX - BedrockServer"
//  *   *   *   *   *   *   *   *   *   *

const kernel32 = NativeModule.load('Kernel32.dll');
const user32 = NativeModule.load('User32.dll');
const GetConsoleWindow = kernel32.getFunction('GetConsoleWindow', VoidPointer);
const SetWindowText = user32.getFunction('SetWindowTextW', RawTypeId.Void, null, VoidPointer, RawTypeId.StringUtf16);
const wnd = GetConsoleWindow();
SetWindowText(wnd, windowName);


// IMPORT playerlist script
import './playerlist';

// IMPORT playerinit scrip
import './playerinit';

//IMPORT transferserver script
import './transferserver';

//IMPORT tdtp (Transdimentional Teleport) script
import './tdtp';

import './warplist';