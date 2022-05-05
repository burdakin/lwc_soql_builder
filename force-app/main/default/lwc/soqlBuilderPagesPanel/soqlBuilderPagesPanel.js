import { LightningElement, wire, track, api } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import soqlResult from "@salesforce/messageChannel/soqlResult__c";

export default class SoqlBuilderPagesPanel extends LightningElement {
  subscription = null;
  totalListOfResult;
  columns = [];
  @track
  listToDisplay;
  @api
  pageNum = 1;
  @api
  totalPages;

  @wire(MessageContext)
  messageContext;

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        soqlResult,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleMessage(message) {
    this.totalListOfResult = message;
    this.getTotalPages();
    this.getColumns(message);
    this.showPagedResults(this.pageNum);
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  getColumns(arrayOfResults) {
    let keySet = Object.keys(arrayOfResults[0]);
    console.log(keySet);
    keySet.forEach((key) => {
      let obj = {};
      console.log(key);
      obj.label = key;
      obj.fieldName = key;
      obj.type = "text";
      obj.sortable = true;
      this.columns.push(obj);
    });
    console.log(this.columns);
  }

  showPagedResults(numberOfPage) {
    let recordsToShow = [];
    if (numberOfPage == 1) {
      for (let i = 0; i < 9; i++) {
        if (this.totalListOfResult[i] != undefined) {
          recordsToShow.push(this.totalListOfResult[i]);
        }
      }
    } else if (numberOfPage > 1) {
      for (let i = numberOfPage * 10 - 1; i < numberOfPage * 10 + 9; i++) {
        if (this.totalListOfResult[i] != undefined) {
          recordsToShow.push(this.totalListOfResult[i]);
        }
      }
    }
    console.log(recordsToShow);
    this.listToDisplay = recordsToShow;
  }

  previousHandler() {
    if (this.pageNum > 1) {
      this.pageNum = this.pageNum - 1;
      this.showPagedResults(this.pageNum);
    }
  }

  nextHandler() {
    this.pageNum = this.pageNum + 1;
    this.showPagedResults(this.pageNum);
  }

  getTotalPages() {
    console.log("total = " + this.totalListOfResult.length);
    console.log("pages = " + this.totalPages);
    if (this.totalListOfResult.length % 10 === 0) {
      this.totalPages = this.totalListOfResult.length / 10;
    } else {
      this.totalPages = Math.round(this.totalListOfResult.length / 10);
    }
  }
}
