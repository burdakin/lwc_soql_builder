import { LightningElement, api } from "lwc";

export default class SoqlBuilderPaginator extends LightningElement {
  @api
  pagenum;
  @api
  totalpages;
  showNext = true;

  previousHandler() {
    this.showNext = true;
    this.dispatchEvent(new CustomEvent("previous"));
  }

  nextHandler() {
    if (this.pagenum < this.totalpages) {
      this.dispatchEvent(new CustomEvent("next"));
    } else if (this.pagenum === this.totalpages) {
      this.showNext = false;
    }
  }
}