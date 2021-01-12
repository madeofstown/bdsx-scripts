"use strict";
/// <reference types="minecraft-scripting-types-server" />
//------------------------------------------------------------------------------//
//                         Form Send and Response API                           //
//                               script for BDSX                                //
//                          (formsapi.ts/formsapi.js)                           //
//                         by randommouse/madeofstown                           //
//------------------------------------------------------------------------------//
//                                Use/Function:                                 //
//                   Build and Send FormUI Evnts to Players                     //
//                    Examples found in forms.ts/forms.js                       //
//------------------------------------------------------------------------------//
//                          Required Custom Scripts:                            //
//                                    None                                      //
//------------------------------------------------------------------------------//
//            Thansks to P Jai Rjlin and their original forms API @             //
//      https://github.com/Rjlintkh/bdsx-scripts/blob/main/scripts/forms.js     //
//------------------------------------------------------------------------------//
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendModalForm = exports.CustomForm = exports.ModalForm = exports.SimpleForm = void 0;
const bdsx_1 = require("bdsx");
class SimpleForm {
    constructor(title = "", content = "") {
        this.type = "form";
        this.title = title;
        this.content = content;
        this.buttons = [];
    }
    addButton(text, imageType = null, imagePath = "") {
        let content = {
            text: text
        };
        if (imageType !== null) {
            content.image = {
                type: imageType,
                data: imagePath
            };
        }
        this.buttons.push(content);
    }
}
exports.SimpleForm = SimpleForm;
class ModalForm {
    constructor(title = "", content = "") {
        this.type = "modal";
        this.title = title;
        this.content = content;
        this.button1 = "";
        this.button2 = "";
    }
    setLeftButton(text) {
        this.button1 = text;
    }
    setRightButton(text) {
        this.button2 = text;
    }
}
exports.ModalForm = ModalForm;
class CustomForm {
    constructor(title = "") {
        this.type = "custom_form";
        this.title = title;
        this.content = [];
    }
    addLabel(text) {
        let content = {
            type: "label",
            text: text
        };
        this.content.push(content);
    }
    addToggle(text, _default = null) {
        let content = {
            type: "toggle",
            text: text
        };
        if (_default !== null) {
            content.default = _default;
        }
        this.content.push(content);
    }
    addSlider(text, min, max, step = null, _default = null) {
        let content = {
            type: "slider",
            text: text,
            min: min,
            max: max
        };
        if (step !== null) {
            content.step = step;
        }
        if (_default !== null) {
            content.default = _default;
        }
        this.content.push(content);
    }
    addStepSlider(text, steps = null, defaultIndex = null) {
        let content = {
            type: "step_slider",
            text: text,
        };
        if (steps !== null) {
            content.step = steps;
        }
        if (defaultIndex !== null) {
            content.default = defaultIndex;
        }
        this.content.push(content);
    }
    addDropdown(text, options, _default = null) {
        let content = {
            type: "dropdown",
            text: text,
            options: options
        };
        if (_default !== null) {
            content.default = _default;
        }
        this.content.push(content);
    }
    addInput(text, placeholder = "", _default = null) {
        let content = {
            type: "input",
            text: text,
            placeholder: placeholder
        };
        if (_default !== null) {
            content.default = _default;
        }
        this.content.push(content);
    }
}
exports.CustomForm = CustomForm;
const formCallback = {};
function sendModalForm(networkIdentifier, form, callback = function () { }) {
    let formId = Math.floor(Math.random() * 2147483647) + 1;
    let packet = bdsx_1.createPacket(bdsx_1.PacketId.ModalFormRequest);
    packet.setUint32(formId, 0x28);
    packet.setCxxString(JSON.stringify(form), 0x30);
    bdsx_1.sendPacket(networkIdentifier, packet);
    packet.dispose();
    setTimeout(function () {
        let update = bdsx_1.createPacket(bdsx_1.PacketId.SetTitle);
        bdsx_1.sendPacket(networkIdentifier, update);
        update.dispose();
    }, 100);
    formCallback[formId] = callback;
}
exports.sendModalForm = sendModalForm;
bdsx_1.netevent.raw(bdsx_1.PacketId.ModalFormResponse).on((ptr, _size, networkIdentifier, packetId) => {
    ptr.move(1);
    let data = {};
    data.formId = ptr.readVarUint();
    data.formData = JSON.parse(ptr.readVarString());
    console.log(data);
    if (formCallback[data.formId]) {
        formCallback[data.formId](data, networkIdentifier);
        delete formCallback[data.formId];
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXNhcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb3Jtc2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMERBQTBEO0FBQzFELGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjs7O0FBR2xGLCtCQUFzRjtBQUV0RixNQUFhLFVBQVU7SUFFbkIsWUFBWSxLQUFLLEdBQUUsRUFBRSxFQUFFLE9BQU8sR0FBRSxFQUFFO1FBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFDRCxTQUFTLENBQUMsSUFBWSxFQUFFLFlBQW1DLElBQUksRUFBRSxTQUFTLEdBQUcsRUFBRTtRQUMzRSxJQUFJLE9BQU8sR0FBeUI7WUFDaEMsSUFBSSxFQUFFLElBQUk7U0FDYixDQUFDO1FBQ0YsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO1lBQ3BCLE9BQU8sQ0FBQyxLQUFLLEdBQUc7Z0JBQ1osSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsSUFBSSxFQUFFLFNBQVM7YUFDbEIsQ0FBQTtTQUNKO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsQ0FBQztDQUNKO0FBcEJELGdDQW9CQztBQUVELE1BQWEsU0FBUztJQUVsQixZQUFZLEtBQUssR0FBRyxFQUFFLEVBQUUs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