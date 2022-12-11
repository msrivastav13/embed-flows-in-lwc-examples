import { createElement } from "lwc";
import QuickRecordCreate from "c/quickRecordCreate";
import { getNavigateCalledWith } from "lightning/navigation";

describe("c-quick-record-create", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("renders lightning tabs successfully", () => {
        // Arrange
        const element = createElement("c-quick-record-create", {
            is: QuickRecordCreate
        });

        // Act
        document.body.appendChild(element);

        // Assert
        const tabsets = element.shadowRoot.querySelectorAll("lightning-tab");
        const lwcFlows = element.shadowRoot.querySelectorAll("lightning-flow");
        expect(tabsets.length).toBe(3);
        expect(lwcFlows.length).toBe(3);
        expect(tabsets[0].label).toBe("Account");
        expect(tabsets[1].label).toBe("Contact");
        expect(tabsets[2].label).toBe("Opportunity");
    });

    it("handles onactive event from active tab successfully", () => {
        // Arrange
        const element = createElement("c-quick-record-create", {
            is: QuickRecordCreate
        });

        // Act
        document.body.appendChild(element);

        // Assert
        const tabsets = element.shadowRoot.querySelectorAll("lightning-tab");
        const lwcFlows = element.shadowRoot.querySelectorAll("lightning-flow");

        expect(tabsets.length).toBe(3);
        expect(lwcFlows.length).toBe(3);
        // Select active tab for simulating on active event
        const accountTab = tabsets[0];
        accountTab.dispatchEvent(new CustomEvent("active"));
        return Promise.resolve().then(() => {
            const updateLwcFlows =
                element.shadowRoot.querySelectorAll("lightning-flow");
            const accountFlow = updateLwcFlows[0];
            expect(accountFlow.flowInputVariables[0].name).toBe("ObjectName");
            expect(accountFlow.flowInputVariables[0].type).toBe("String");
            expect(accountFlow.flowInputVariables[0].value).toBe("Account");
        });
    });

    it("handles flow FINISH event", () => {
        // Arrange
        const element = createElement("c-quick-record-create", {
            is: QuickRecordCreate
        });
        // Nav param values to test later
        const NAV_TYPE = "standard__recordPage";
        const NAV_OBJECT_API_NAME = "Account";
        const NAV_ACTION_NAME = "view";
        const NAV_RECORD_ID = "0031700000pJRRWAA4";

        // Act
        document.body.appendChild(element);

        // Assert
        const tabsets = element.shadowRoot.querySelectorAll("lightning-tab");
        const lwcFlows = element.shadowRoot.querySelectorAll("lightning-flow");

        expect(tabsets.length).toBe(3);
        expect(lwcFlows.length).toBe(3);
        // Mock handler for flow FINISH event
        // Select a Flow for simulating on status change event
        const accountFlow = lwcFlows[0];
        accountFlow.dispatchEvent(
            new CustomEvent("statuschange", {
                detail: {
                    status: "FINISHED",
                    outputVariables: [
                        {
                            name: "recordId",
                            value: NAV_RECORD_ID
                        },
                        {
                            name: "ObjectName",
                            value: NAV_OBJECT_API_NAME
                        }
                    ]
                }
            })
        );

        const { pageReference } = getNavigateCalledWith();
        return Promise.resolve().then(() => {
            // Verify component called with correct event type and params
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.objectApiName).toBe(
                NAV_OBJECT_API_NAME
            );
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
            expect(pageReference.attributes.recordId).toBe(NAV_RECORD_ID);
        });
    });
});
