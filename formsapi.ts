import {netevent ,createPacket, sendPacket, PacketId, NetworkIdentifier } from 'bdsx';

export class SimpleForm {
    [key: string]: any
    constructor(title ="", content ="") {
        this.type = "form";
        this.title = title;
        this.content = content;
        this.buttons = [];
    }
    addButton(text: string, imageType = null, imagePath = "") {
        let content: {[key: string]: any} = {
            text: text
        };
        if (imageType !== null) {
            content.image = {
                type: imageType === 0 ? "path" : "url",
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
    setLeftButton(text: any) {
        this.button1 = text;
    }
    setRightButton(text: any) {
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
    addLabel(text: any) {
        let content = {
            type: "label",
            text: text
        };
        this.content.push(content);
    }
    addToggle(text: any, _default = null) {
        let content: {[key: string]: any} = {
            type: "toggle",
            text: text
        };
        if (_default !== null) {
            content.default = _default;
        }
        this.content.push(content);
    }
    addSlider(text: any, min: any, max: any, step = null, _default = null) {
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
    addStepSlider(text: any, steps: null, defaultIndex = null) {
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
    addDropdown(text: any, options: any, _default = null) {
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
    addInput(text: any, placeholder = "", _default = null) {
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
    formCallback[formId] = callback;
    //console.log(formCallback);
}

netevent.raw(PacketId.ModalFormResponse).on((ptr, _size, networkIdentifier, packetId) => {
    ptr.move(1);
    let data: {[key: string]: any} = {};
    data.packetId = PacketId[packetId];
    data.formId = ptr.readVarUint();
    let rawData =  ptr.readVarString();
    data.formData = rawData.replace( /[\[\]\r\n\1]+|(null,)/gm, "" ).split(',');
    console.log(data.packetId);
    console.log(data.formId);
    console.log(data.formData);
    if (formCallback[data.formId]) {
        formCallback[data.formId](data, networkIdentifier);
        //console.log(formCallback);
        delete formCallback[data.formId];
    }
    //console.log(formCallback);
});