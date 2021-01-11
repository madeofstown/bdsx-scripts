"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferGUI = exports.testForm = void 0;
const formsapi_1 = require("./formsapi");
const transferserver_1 = require("../transferserver");
// Example 1:
// Testform - sends a test form to the player, logs the form response in the console, default option opens Transfer Server GUI Form
// **** Check playerinit.ts/playerinit.js to enable sending to player when they join the server ****
function testForm(networkIdentifier) {
    let testForm = new formsapi_1.CustomForm("§lTest Form");
    testForm.addDropdown("Test Dropdown", ["Yes", "No", "Maybe", "Option 4"], 3);
    testForm.addToggle("Test Toggle");
    testForm.addToggle("Transfer Server GUI?", true);
    testForm.addSlider("Test Slider", 0, 10, 1);
    formsapi_1.sendModalForm(networkIdentifier, testForm, (data, networkIdentifier) => {
        if (data.formData) {
            console.log(data.formData);
            if (data.formData[2] === true) {
                transferGUI(networkIdentifier);
            }
            ;
            return 0;
        }
        ;
    });
}
exports.testForm = testForm;
// Example 2:
// Transfer Server GUI - A Form Based UI for tansferring to a custom server
function transferGUI(networkIdentifier) {
    let transferGUI = new formsapi_1.CustomForm("§lTransfer Server GUI");
    transferGUI.addInput("Server Address", "Server Address");
    transferGUI.addInput("Server Port", "19132", "19132");
    formsapi_1.sendModalForm(networkIdentifier, transferGUI, (data, networkIdentifier) => {
        if (data.formData) {
            transferserver_1.transferServer(networkIdentifier, data.formData[0], parseInt(data.formData[1]));
        }
    });
}
exports.transferGUI = transferGUI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb3Jtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMERBQTBEO0FBQzFELGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjs7O0FBR2xGLHlDQUF1RDtBQUN2RCxzREFBbUQ7QUFHbkQsYUFBYTtBQUNiLG1JQUFtSTtBQUNuSSxvR0FBb0c7QUFDcEcsU0FBZ0IsUUFBUSxDQUFDLGlCQUFvQztJQUN6RCxJQUFJLFFBQVEsR0FBRyxJQUFJLHFCQUFVLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDNUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RSxRQUFRLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2xDLFFBQVEsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUUsQ0FBQztJQUM3Qyx3QkFBYSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFO1FBQ25FLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNCLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQzFCLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQ2xDO1lBQUEsQ0FBQztZQUNGLE9BQU8sQ0FBQyxDQUFDO1NBQ1o7UUFBQSxDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBZkQsNEJBZUM7QUFFRCxhQUFhO0FBQ2IsMkVBQTJFO0FBQzNFLFNBQWdCLFdBQVcsQ0FBQyxpQkFBb0M7SUFDNUQsSUFBSSxXQUFXLEdBQUcsSUFBSSxxQkFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDMUQsV0FBVyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pELFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RCx3QkFBYSxDQUFDLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFO1FBQ3RFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBQztZQUNkLCtCQUFjLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkY7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFURCxrQ0FTQyJ9