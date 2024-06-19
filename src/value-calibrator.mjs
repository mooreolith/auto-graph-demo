/*
  <value-calibrator
    label="descriptive-name"
    value="0.0">
  </value-calibrator>

  <script type="module">
    import './value-calibrator.mjs';

    const calibrator = document.querySelector('value-calibrator');
*/

class ValueCalibrator extends HTMLElement {
  #label = "descriptive-name";
  #value = 0.0;
  #default = 0.0;

  constructor(){
    super();
    this.attachShadow({mode: 'open'});
    this.subscribers = new Set([]);

    this.renderHTML();
  }

  get observedAttributes(){
    return ["label", "value"]
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(name === "label"){
      this.#label = newValue;
      this.shadowRoot.querySelector('label').textContent = newValue;
    }
    if(name === "value"){
      this.#value = parseFloat(newValue);
      this.shadowRoot.querySelector('output').textContent = this.#value;
      this.shadowRoot.querySelector('.base').value = this.#value % 10;
      this.shadowRoot.querySelector('.exponent').value = Math.log10(this.#value);
    }
  }

  connectedCallback(){
    const value = this.getAttribute("value");
    this.#value = value !== undefined ? parseFloat(value) : 0.0;

    this.renderHTML();
  }

  renderHTML() {
    this.shadowRoot.innerHTML = `
      <style>
        .value-calibrator {
          position: absolute;
          top: 0;
          left: 0;
        }
      </style>

      <div class="value-calibrator">
        <label>${this.getAttribute("label")}</label>
        <output>${this.#value.toExponential(3)}</output>
        <br />

        <label>int</label>
        <input 
          class="base"
          type="range" 
          min="-10.0" 
          max="10.0" 
          step="0.05"
          value="${this.#value % 10}" />
        <br />

        <label>exp</label>
        <input 
          class="exponent"
          type="range" 
          min="-10" 
          max="10" 
          step="1"
          value="${Math.log10(this.#value)}" />

        <a href="#" class="reset">reset</a>
      </div>
    `;
    this.shadowRoot.querySelector('.base').onchange = this.onchange.bind(this);
    this.shadowRoot.querySelector('.exponent').onchange = this.onchange.bind(this);
    this.shadowRoot.querySelector('.reset').onclick = this.reset.bind(this);

    this.output = this.shadowRoot.querySelector('output');
    this.base = this.shadowRoot.querySelector('.base');
    this.exponent = this.shadowRoot.querySelector('.exponent');
    this.label = this.shadowRoot.querySelector('label');
    this.resetBtn = this.shadowRoot.querySelector('.reset');
  }

  onchange(e){
    this.#computeValue();
    this.output.value = this.#value.toExponential(3);
    this.subscribers.forEach(subscriberFn => subscriberFn(this.#value));
  }

  #computeValue(){
    const base = this.base.value;
    const exponent = this.exponent.value;
    this.#value = base * Math.pow(10, exponent);
  }

  addSubscriber(subscriber){
    this.subscribers.add(subscriber);
  }

  removeSubscriber(subscriber){
    this.subscribers.delete(subscriber);
  }

  get default(){
    return this.#default;
  }

  set default(value){
    this.#default = value;
    this.#value = value;
  }

  reset(){
    this.#value = this.#default;
    this.output.value = this.#value.toExponential(3);
    this.base.value = (this.#value % 10);
    this.exponent.value = Math.log10(this.#value);
  }

  get label(){
    return this.#label;
  }

  set label(value){
    this.#label = value;
    this.shadowRoot.querySelector('label').innerHTML = value;
  }

  get value(){
    return this.#value;
  }
  
  set value(value){
    if(value !== this.#value && value !== undefined && value !== null){
      this.#value = value;
    }else{
      this.#value = this.#default;
    }
    this.output.value = this.#value.toExponential(3);
    this.base.value = (this.#value % 10);
    this.exponent.value = Math.log10(this.#value);
  }
}

customElements.define('value-calibrator', ValueCalibrator);
export { ValueCalibrator };