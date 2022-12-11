import { LightningElement, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class QuickRecordCreate extends NavigationMixin(
    LightningElement
) {
    sObjectToFlowMap;
    @track
    inputVariables = [];

    connectedCallback() {
        this.sObjectToFlowMap = [
            {
                sObject: "Account",
                flowName: "Create_Account"
            },
            {
                sObject: "Contact",
                flowName: "Create_Contact"
            },
            {
                sObject: "Opportunity",
                flowName: "Create_Opportunity"
            }
        ];
    }

    handleTabActive(event) {
        this.inputVariables = [
            {
                name: "ObjectName",
                type: "String",
                value: event.target.value
            }
        ];
    }

    handleAccountStatusChange(event) {
        if (event.detail.status === "FINISHED") {
            let recordId;
            let objectApiName;
            const outputVariables = event.detail.outputVariables;
            for (let i = 0; i < outputVariables.length; i++) {
                const outputVar = outputVariables[i];
                if (outputVar.name === "recordId") {
                    recordId = outputVar.value;
                }
                if (outputVar.name === "ObjectName") {
                    objectApiName = outputVar.value;
                }
            }
            this[NavigationMixin.Navigate]({
                type: "standard__recordPage",
                attributes: {
                    recordId: recordId,
                    objectApiName: objectApiName,
                    actionName: "view"
                }
            });
        }
    }
}
