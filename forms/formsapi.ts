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


import {netevent ,createPacket, sendPacket, PacketId, NetworkIdentifier } from 'bdsx';

export class SimpleForm {
    [key: string]: any
    constructor(title ="", content ="") {
        this.type = "form";
        this.title = title;
        this.content = content;
        this.buttons = [];
    }
    addButton(text: string, imageType: 'path' | 'url' | null = null, imagePath = "") {
        let content: {[key: string]: any} = {
            text: text
        };
        if (imageType !== null) {
            content.image = {
                type: imageType,
                data: imagePath
            }
        }
        this.buttons.push(content);
    }
}

export class ModalForm {
    [key: string]: any
    constructor(title = "", content = "") {
        this.type = "modal";
        this.title = title;
        this.content = content;
        this.button1 = "";
        this.button2 = "";
    }
    setLeftButton(text: string) {
        this.button1 = text;
    }
    setRightButton(text: string) {
        this.button2 = text;
    }
}

export class CustomForm {
    [key: string]: any
    constructor(title = "") {
        this.type = "custom_form";
        this.title = title;
        this.content = [];
    }
    addLabel(text: string) {
        let content = {
            type: "label",
            text: text
        };
        this.content.push(content);
    }
    addToggle(text: string, _default: boolean | null = null) {
        let content: {[key: string]: any} = {
            type: "toggle",
            text: text
        };
        if (_default !== null) {
            content.default = _default;
        }
        this.content.push(content);
    }
    addSlider(text: string, min: number, max: number, step: number | null = null , _default: number | null = null) {
        let content: {[key: string]: any} = {
            type: "slider",
            text: text,
            min: min,
            max: max
        }
        if (step !== null) {
            content.step = step;
        }
        if (_default !== null) {
            content.default = _default;
        }
        this.content.push(content);
    }
    addStepSlider(text: string, steps: number | null = null, defaultIndex: number | null = null ) {
        let content: {[key: string]: any} = {
            type: "step_slider",
            text: text,
        }
        if (steps !== null) {
            content.step = steps;
        }
        if (defaultIndex !== null) {
            content.default = defaultIndex;
        }
        this.content.push(content);
    }
    addDropdown(text: string, options: string[], _default: number | null = null) {
        let content: {[key: string]: any} = {
            type: "dropdown",
            text: text,
            options: options
        };
        if (_default !== null) {
            content.default = _default;
        }
        this.content.push(content);
    }
    addInput(text: string, placeholder: string = "", _default: string | null = null) {
        let content: {[key: string]: any} = {
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

const formCallback = {};

export function sendModalForm(networkIdentifier: NetworkIdentifier, form: object, callback: (data: any, networkIdentifier: any) => void = function() {}) {
    let formId = Math.floor(Math.random() * 2147483647) + 1;
    let packet = createPacket(PacketId.ModalFormRequest);
    packet.setUint32(formId, 0x28);
    packet.setCxxString(JSON.stringify(form), 0x30);
    sendPacket(networkIdentifier, packet);
    packet.dispose();
    setTimeout(function(){
        let update = createPacket(PacketId.SetTitle)
        sendPacket(networkIdentifier, update);
        update.dispose();
    }, 100);
    formCallback[formId] = callback;
}

netevent.raw(PacketId.ModalFormResponse).on((ptr, _size, networkIdentifier, packetId) => {
    ptr.move(1);
    let data: {[key: string]: any} = {};
    data.formId = ptr.readVarUint();
    data.formData = JSON.parse(ptr.readVarString());
    console.log(data);
    if (formCallback[data.formId]) {
        formCallback[data.formId](data, networkIdentifier);
        delete formCallback[data.formId];
    }
});