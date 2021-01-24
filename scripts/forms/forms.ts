/// <reference types="minecraft-scripting-types-server" />
//------------------------------------------------------------------------------//
//                                Example Forms                                 //
//                               script for BDSX                                //
//                             (forms.ts/forms.js)                              //
//                         by randommouse/madeofstown                           //
//------------------------------------------------------------------------------//
//                                Use/Function:                                 //
//                   Example forms built with the forms API                     //
//------------------------------------------------------------------------------//
//                          Required Custom Scripts:                            //
//                          formsapi.ts/formsapi.js                             //
//                    transferserver.ts/transferserver.js                       //
//------------------------------------------------------------------------------//
//            Thansks to P Jai Rjlin and their original forms API @             //
//      https://github.com/Rjlintkh/bdsx-scripts/blob/main/scripts/forms.js     //
//------------------------------------------------------------------------------//

import { NetworkIdentifier } from "bdsx";
import { CustomForm, sendModalForm } from "./formsapi";
import { transferServer } from "../transferserver";


// Example 1:
// Testform - sends a test form to the player, logs the form response in the console, default option opens Transfer Server GUI Form
// **** Check playerinit.ts/playerinit.js to enable sending to player when they join the server ****
export function testForm(networkIdentifier: NetworkIdentifier) {
    let testForm = new CustomForm("§lTest Form")
    testForm.addDropdown("Test Dropdown", ["Yes", "No", "Maybe", "Option 4"], 3);
    testForm.addToggle("Test Toggle");
    testForm.addToggle("Transfer Server GUI?", true);
    testForm.addSlider("Test Slider", 0, 10, 1,);
    sendModalForm(networkIdentifier, testForm, (data, networkIdentifier) =>{
        if (data.formData) {
            console.log(data.formData);
            if(data.formData[2] === true) {
                transferGUI(networkIdentifier);
            };
            return 0;
        };
    });
}

// Example 2:
// Transfer Server GUI - A Form Based UI for tansferring to a custom server
export function transferGUI(networkIdentifier: NetworkIdentifier) {
    let transferGUI = new CustomForm("§lTransfer Server GUI");
    transferGUI.addInput("Server Address", "Server Address");
    transferGUI.addInput("Server Port", "19132", "19132");
    sendModalForm(networkIdentifier, transferGUI, (data, networkIdentifier) => {
        if (data.formData){
            transferServer(networkIdentifier, data.formData[0], parseInt(data.formData[1]));
        }
    }); 
}