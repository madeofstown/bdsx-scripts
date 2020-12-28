import { NetworkIdentifier } from "bdsx";
import { sendModalForm, SimpleForm } from "./formsapi";
import { transferServer } from "./transferserver";


export function worldSelectForm(networkIdentifier: NetworkIdentifier) {
    let worldSelectForm = new SimpleForm("§lMapSelect", "§l§o§ePlease Pick a World\nOr Custom Server");
    worldSelectForm.addButton("§l§dTEST WORLD");
    worldSelectForm.addButton("§l§bCUSTOM");
    sendModalForm(networkIdentifier, worldSelectForm, (data, networkIdentifier) =>{
        if (data.formData[0] === '0') {
            transferServer(networkIdentifier, 'bds.server.com', 19134);
        }
        if (data.formData[0] === '1') {
            console.log("not finished yet")
        }
    })
    
}