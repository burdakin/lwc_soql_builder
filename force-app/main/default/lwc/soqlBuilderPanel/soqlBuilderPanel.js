import { LightningElement, wire, api } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import getFieldsOfObject from "@salesforce/apex/SOQLBuilderController.getFieldsOfObject";
import getAllObjects from "@salesforce/apex/SOQLBuilderController.getAllObjects";
import launchQuery from "@salesforce/apex/SOQLBuilderController.launchQuery";
import soqlResult from "@salesforce/messageChannel/soqlResult__c";

export default class SoqlBuilderPanel extends LightningElement {
  object;
  selectedFields = ["Id"];
  fieldsObject = [];
  isModalOpen = false;
  objects = [];
  whereField;
  whereFieldData;

  @api
  pageNum;

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    getAllObjects()
      .then((result) => {
        let allObjects = [];
        let res = [];
        allObjects = result;
        allObjects.forEach((element) => {
          let obj = {};
          obj.label = element;
          obj.value = element;
          res.push(obj);
        });
        console.log(res);
        this.objects = res;
      })
      .catch((error) => {
        console.log("error = " + error);
      });
  }

  get listOfobjects() {
    return this.objects;
  }

  get fields() {
    return this.fieldsObject;
  }

  getObject(event) {
    this.object = event.detail.value;
    getFieldsOfObject({ objectName: this.object })
      .then((result) => {
        console.log(result);
        this.fieldsObject = this.populateFields(result);
        console.log(this.fieldsObject);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  populateFields(fieldsFromApex) {
    let fields = [];
    fieldsFromApex.forEach((field) => {
      let obj = {};
      obj.label = field;
      obj.value = field;
      fields.push(obj);
    });
    console.log(fields);
    return fields;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    console.log(this.selectedFields);
  }

  selectFields(event) {
    this.selectedFields = event.detail.value;
  }

  pushQuery() {
    launchQuery({
      selectedFields: this.selectedFields,
      objectName: this.object,
      whereField: this.whereField,
      whereData: this.whereFieldData
    }).then((result) => {
      //console.log(result);
      publish(this.messageContext, soqlResult, result);
    });
  }

  setField(event) {
    this.whereField = event.detail.value;
  }

  setWhereData(event) {
    console.log(event.target.value);
    this.whereFieldData = event.target.value;
  }
}
