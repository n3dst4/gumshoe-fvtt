/* eslint-disable */

export class Application {//
  constructor (options = {}) {
    /**
     * The options provided to this application upon initialization
     * @type {Object}
     */
    this.options = mergeObject(this.constructor.defaultOptions, options, {
      insertKeys: true,
      insertValues: true,
      overwrite: true,
      inplace: false,
    });

    /**
     * The application ID is a unique incrementing integer which is used to identify every application window
     * drawn by the VTT
     * @type {number}
     */
    this.appId = _appId += 1;

    /**
     * An internal reference to the HTML element this application renders
     * @type {jQuery}
     */
    this._element = null;

    /**
     * Track the current position and dimensions of the Application UI
     * @type {Object}
     */
    this.position = {
      width: this.options.width,
      height: this.options.height,
      left: this.options.left,
      top: this.options.top,
      scale: this.options.scale,
    };

    /**
     * DragDrop workflow handlers which are active for this Application
     * @type {DragDrop[]}
     */
    this._dragDrop = this._createDragDropHandlers();

    /**
     * Tab navigation handlers which are active for this Application
     * @type {Tabs[]}
     */
    this._tabs = this._createTabHandlers();

    /**
     * SearchFilter handlers which are active for this Application
     * @type {SearchFilter[]}
     */
    this._searchFilters = this._createSearchFilters();

    /**
     * Track whether the Application is currently minimized
     * @type {boolean}
     * @private
     */
    this._minimized = false;

    /**
     * Track the render state of the Application
     * @see {Application.RENDER_STATES}
     * @type {number}
     * @private
     */
    this._state = Application.RENDER_STATES.NONE;

    /**
     * Track the most recent scroll positions for any vertically scrolling containers
     * @type {Object|null}
     */
    this._scrollPositions = null;
  }

  /* -------------------------------------------- */

  /**
   * Create drag-and-drop workflow handlers for this Application
   * @return {DragDrop[]}     An array of DragDrop handlers
   * @private
   */
  _createDragDropHandlers () {
    return this.options.dragDrop.map(d => {
      d.permissions = {
        dragstart: this._canDragStart.bind(this),
        drop: this._canDragDrop.bind(this),
      };
      d.callbacks = {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this),
      };
      return new DragDrop(d);
    });
  }

  /* -------------------------------------------- */

  /**
   * Create tabbed navigation handlers for this Application
   * @return {Tabs[]}     An array of Tabs handlers
   * @private
   */
  _createTabHandlers () {
    return this.options.tabs.map(t => {
      t.callback = this._onChangeTab.bind(this);
      return new Tabs(t);
    });
  }

  /* -------------------------------------------- */

  /**
   * Create search filter handlers for this Application
   * @return {SearchFilter[]}  An array of SearchFilter handlers
   * @private
   */
  _createSearchFilters () {
    return this.options.filters.map(f => {
      f.callback = this._onSearchFilter.bind(this);
      return new SearchFilter(f);
    });
  }

  /* -------------------------------------------- */

  /**
   * Assign the default options configuration which is used by this Application class. The options and values defined
   * in this object are merged with any provided option values which are passed to the constructor upon initialization.
   * Application subclasses may include additional options which are specific to their usage.
   */
  static get defaultOptions () {
    return {
      baseApplication: null,
      width: null,
      height: null,
      top: null,
      left: null,
      popOut: true,
      minimizable: true,
      resizable: false,
      id: "",
      classes: [],
      dragDrop: [],
      tabs: [],
      filters: [],
      title: "",
      template: null,
      scrollY: [],
    };
  }

  /* -------------------------------------------- */

  /**
   * Return the CSS application ID which uniquely references this UI element
   */
  get id () {
    return this.options.id ? this.options.id : `app-${this.appId}`;
  }

  /* -------------------------------------------- */

  /**
   * Return the active application element, if it currently exists in the DOM
   * @type {jQuery|HTMLElement}
   */
  get element () {
    if (this._element) return this._element;
    const selector = "#" + this.id;
    return $(selector);
  }

  /* -------------------------------------------- */

  /**
   * The path to the HTML template file which should be used to render the inner content of the app
   * @type {string}
   */
  get template () {
    return this.options.template;
  }

  /* -------------------------------------------- */

  /**
   * Control the rendering style of the application. If popOut is true, the application is rendered in its own
   * wrapper window, otherwise only the inner app content is rendered
   * @type {boolean}
   */
  get popOut () {
    return (this.options.popOut !== undefined) ? Boolean(this.options.popOut) : true;
  }

  /* -------------------------------------------- */

  /**
   * Return a flag for whether the Application instance is currently rendered
   * @type {boolean}
   */
  get rendered () {
    return this._state === Application.RENDER_STATES.RENDERED;
  }

  /* -------------------------------------------- */

  /**
   * An Application window should define its own title definition logic which may be dynamic depending on its data
   * @type {string}
   */
  get title () {
    return game.i18n.localize(this.options.title);
  }

  /* -------------------------------------------- */
  /* Application rendering
  /* -------------------------------------------- */

  /**
   * An application should define the data object used to render its template.
   * This function may either return an Object directly, or a Promise which resolves to an Object
   * If undefined, the default implementation will return an empty object allowing only for rendering of static HTML
   *
   * @return {Object|Promise}
   */
  getData (options = {}) {
    return {};
  }

  /* -------------------------------------------- */

  /**
   * Render the Application by evaluating it's HTML template against the object of data provided by the getData method
   * If the Application is rendered as a pop-out window, wrap the contained HTML in an outer frame with window controls
   *
   * @param {boolean} force   Add the rendered application to the DOM if it is not already present. If false, the
   *                          Application will only be re-rendered if it is already present.
   * @param {Object} options  Additional rendering options which are applied to customize the way that the Application
   *                          is rendered in the DOM.
   *
   * @param {number} options.left           The left positioning attribute
   * @param {number} options.top            The top positioning attribute
   * @param {number} options.width          The rendered width
   * @param {number} options.height         The rendered height
   * @param {number} options.scale          The rendered transformation scale
   * @param {boolean} options.log           Whether to display a log message that the Application was rendered
   * @param {string} options.renderContext  A context-providing string which suggests what event triggered the render
   * @param {*} options.renderData          The data change which motivated the render request
   *
   */
  render (force = false, options = {}) {
    this._render(force, options).catch(err => {
      err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`;
      console.error(err);
      this._state = Application.RENDER_STATES.ERROR;
    });
    return this;
  }

  /* -------------------------------------------- */

  /**
   * An asynchronous inner function which handles the rendering of the Application
   * @param {boolean} force     Render and display the application even if it is not currently displayed.
   * @param {Object} options    Provided rendering options, see the render function for details
   * @return {Promise<void>}    A Promise that resolves to the Application once rendering is complete
   * @private
   */
  async _render (force = false, options = {}) {
    // Do not render under certain conditions
    const states = Application.RENDER_STATES;
    if ([states.CLOSING, states.RENDERING].includes(this._state)) return;
    if (!force && (this._state <= states.NONE)) return;
    if ([states.NONE, states.CLOSED, states.ERROR].includes(this._state)) {
      console.log(`${vtt} | Rendering ${this.constructor.name}`);
    }
    this._state = states.RENDERING;

    // Get the existing HTML element and application data used for rendering
    const element = this.element;
    const data = await this.getData(options);

    // Store scroll positions
    const scrollY = this.options.scrollY;
    if (element.length && scrollY) this._saveScrollPositions(element, scrollY);

    // Render the inner content
    const inner = await this._renderInner(data, options);
    let html = inner;

    // If the application already exists in the DOM, replace the inner content
    if (element.length) this._replaceHTML(element, html, options);

    // Otherwise render a new app
    else {
      // Wrap a popOut application in an outer frame
      if (this.popOut) {
        html = await this._renderOuter(options);
        html.find(".window-content").append(inner);
        ui.windows[this.appId] = this;
      }

      // Add the HTML to the DOM and record the element
      this._injectHTML(html, options);
    }

    // Activate event listeners on the inner HTML
    this.activateListeners(inner);

    // Set the application position (if it's not currently minimized)
    if (!this._minimized) this.setPosition(this.position);

    // Restore scroll positions
    if (scrollY) this._restoreScrollPositions(html, scrollY);

    // Dispatch Hooks for rendering the base and subclass applications
    for (const cls of this.constructor._getInheritanceChain()) {
      Hooks.call(`render${cls.name}`, this, html, data);
    }
    this._state = states.RENDERED;
  }

  /* -------------------------------------------- */

  /**
   * Return the inheritance chain for this Application class up to (and including) it's base Application class.
   * @return {Application[]}
   * @private
   */
  static _getInheritanceChain () {
    const parents = getParentClasses(this);
    const base = this.defaultOptions.baseApplication;
    const chain = [this];
    for (const cls of parents) {
      chain.push(cls);
      if (cls.name === base) break;
    }
    return chain;
  }

  /* -------------------------------------------- */

  /**
   * Persist the scroll positions of containers within the app before re-rendering the content
   * @param {jQuery} html           The HTML object being traversed
   * @param {string[]} selectors    CSS selectors which designate elements to save
   * @private
   */
  _saveScrollPositions (html, selectors) {
    selectors = selectors || [];
    this._scrollPositions = selectors.reduce((pos, sel) => {
      const el = html.find(sel);
      if (el.length === 1) pos[sel] = el[0].scrollTop;
      return pos;
    }, {});
  }

  /* -------------------------------------------- */

  /**
   * Restore the scroll positions of containers within the app after re-rendering the content
   * @param {jQuery} html           The HTML object being traversed
   * @param {string[]} selectors    CSS selectors which designate elements to restore
   * @private
   */
  _restoreScrollPositions (html, selectors) {
    const positions = this._scrollPositions || {};
    for (const sel of selectors) {
      const el = html.find(sel);
      if (el.length === 1) el[0].scrollTop = positions[sel] || 0;
    }
  }

  /* -------------------------------------------- */

  /**
   * Render the outer application wrapper
   * @return {Promise.<HTMLElement>}   A promise resolving to the constructed jQuery object
   * @private
   */
  async _renderOuter (options) {
    // Gather basic application data
    const classes = options.classes || this.options.classes;
    const windowData = {
      id: this.id,
      classes: classes.join(" "),
      appId: this.appId,
      title: this.title,
      headerButtons: this._getHeaderButtons(),
    };

    // Render the template and return the promise
    let html = await renderTemplate("templates/app-window.html", windowData);
    html = $(html);

    // Activate header button click listeners after a slight timeout to prevent immediate interaction
    setTimeout(() => {
      html.find(".header-button").click(event => {
        event.preventDefault();
        const button = windowData.headerButtons.find(b => event.currentTarget.classList.contains(b.class));
        button.onclick(event);
      });
    }, 500);

    // Make the outer window draggable
    const header = html.find("header")[0];
    new Draggable(this, html, header, this.options.resizable);

    // Make the outer window minimizable
    if (this.options.minimizable) {
      header.addEventListener("dblclick", this._onToggleMinimize.bind(this));
    }

    // Set the outer frame z-index
    if (Object.keys(ui.windows).length === 0) _maxZ = 100 - 1;
    html.css({ zIndex: Math.min(++_maxZ, 9999) });

    // Return the outer frame
    return html;
  }

  /* -------------------------------------------- */

  /**
   * Render the inner application content
   * @param {Object} data         The data used to render the inner template
   * @return {Promise.<jQuery>}   A promise resolving to the constructed jQuery object
   * @private
   */
  async _renderInner (data, options) {
    const html = await renderTemplate(this.template, data);
    if (html === "") throw new Error(`No data was returned from template ${this.template}`);
    return $(html);
  }

  /* -------------------------------------------- */

  /**
   * Customize how inner HTML is replaced when the application is refreshed
   * @param {HTMLElement|jQuery} element  The original HTML element
   * @param {HTMLElement|jQuery} html     New updated HTML
   * @private
   */
  _replaceHTML (element, html, options) {
    if (!element.length) return;

    // For pop-out windows update the inner content and the window title
    if (this.popOut) {
      element.find(".window-content").html(html);
      element.find(".window-title").text(this.title);
    }

    // For regular applications, replace the whole thing
    else {
      element.replaceWith(html);
      this._element = html;
    }
  }

  /* -------------------------------------------- */

  /**
   * Customize how a new HTML Application is added and first appears in the DOC
   * @param html {jQuery}
   * @private
   */
  _injectHTML (html, options) {
    $("body").append(html);
    this._element = html;
    html.hide().fadeIn(200);
  }

  /* -------------------------------------------- */

  /**
   * Specify the set of config buttons which should appear in the Application header.
   * Buttons should be returned as an Array of objects.
   * The header buttons which are added to the application can be modified by the getApplicationHeaderButtons hook.
   * @typedef {{label: string, class: string, icon: string, onclick: Function|null}} ApplicationHeaderButton
   * @fires Application#hook:getApplicationHeaderButtons
   * @return {ApplicationHeaderButton[]}
   * @private
   */
  _getHeaderButtons () {
    const buttons = [
      {
        label: "Close",
        class: "close",
        icon: "fas fa-times",
        onclick: () => this.close(),
      },
    ];
    for (const cls of this.constructor._getInheritanceChain()) {
      Hooks.call(`get${cls.name}HeaderButtons`, this, buttons);
    }
    return buttons;
  }

  /* -------------------------------------------- */
  /* Event Listeners and Handlers
  /* -------------------------------------------- */

  /**
   * Once the HTML for an Application has been rendered, activate event listeners which provide interactivity for
   * the application
   * @param html {jQuery}
   */
  activateListeners (html) {
    const el = html[0];
    this._tabs.forEach(t => t.bind(el));
    this._dragDrop.forEach(d => d.bind(el));
    this._searchFilters.forEach(f => f.bind(el));
  }

  /* -------------------------------------------- */

  /**
   * Handle changes to the active tab in a configured Tabs controller
   * @param {MouseEvent} event    A left click event
   * @param {Tabs} tabs           The Tabs controller
   * @param {string} active       The new active tab name
   * @private
   */
  _onChangeTab (event, tabs, active) {
    this.setPosition();
  }

  /* -------------------------------------------- */

  /**
   * Handle changes to search filtering controllers which are bound to the Application
   * @param {KeyboardEvent} event   The key-up event from keyboard input
   * @param {RegExp} query          The regular expression to test against
   * @param {HTMLElement} html      The HTML element which should be filtered
   * @private
   */
  _onSearchFilter (event, query, html) {}

  /* -------------------------------------------- */

  /**
   * Define whether a user is able to begin a dragstart workflow for a given drag selector
   * @param {string} selector       The candidate HTML selector for dragging
   * @return {boolean}              Can the current user drag this selector?
   * @private
   */
  _canDragStart (selector) {
    return game.user.isGM;
  }

  /* -------------------------------------------- */

  /**
   * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
   * @param {string} selector       The candidate HTML selector for the drop target
   * @return {boolean}              Can the current user drop on this selector?
   * @private
   */
  _canDragDrop (selector) {
    return game.user.isGM;
  }

  /* -------------------------------------------- */

  /**
   * Callback actions which occur at the beginning of a drag start workflow.
   * @param {DragEvent} event       The originating DragEvent
   * @private
   */
  _onDragStart (event) {}

  /* -------------------------------------------- */

  /**
   * Callback actions which occur when a dragged element is over a drop target.
   * @param {DragEvent} event       The originating DragEvent
   * @private
   */
  _onDragOver (event) {}

  /* -------------------------------------------- */

  /**
   * Callback actions which occur when a dragged element is dropped on a target.
   * @param {DragEvent} event       The originating DragEvent
   * @private
   */
  _onDrop (event) {}

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Bring the application to the top of the rendering stack
   */
  bringToTop () {
    const element = this.element[0];
    const z = document.defaultView.getComputedStyle(element).zIndex;
    if (z < _maxZ) {
      element.style.zIndex = Math.min(++_maxZ, 99999);
    }
  }

  /* -------------------------------------------- */

  /**
   * Close the application and un-register references to it within UI mappings
   * This function returns a Promise which resolves once the window closing animation concludes
   * @return {Promise<void>}    A Promise which resolves once the application is closed
   */
  async close (options = {}) {
    const states = Application.RENDER_STATES;
    if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) return;
    this._state = states.CLOSING;

    // Get the element
    const el = this.element;
    if (!el) return this._state = states.CLOSED;
    el.css({ minHeight: 0 });

    // Dispatch Hooks for closing the base and subclass applications
    for (const cls of this.constructor._getInheritanceChain()) {
      Hooks.call(`close${cls.name}`, this, el);
    }

    // Animate closing the element
    return new Promise(resolve => {
      el.slideUp(200, () => {
        el.remove();

        // Clean up data
        this._element = null;
        delete ui.windows[this.appId];
        this._minimized = false;
        this._scrollPositions = null;
        this._state = states.CLOSED;
        resolve();
      });
    });
  }

  /* -------------------------------------------- */

  /**
   * Minimize the pop-out window, collapsing it to a small tab
   * Take no action for applications which are not of the pop-out variety or apps which are already minimized
   * @return {Promise<void>}  A Promise which resolves once the minimization action has completed
   */
  async minimize () {
    if (!this.popOut || [true, null].includes(this._minimized)) return;
    this._minimized = null;

    // Get content
    const window = this.element;
    const header = window.find(".window-header");
    const content = window.find(".window-content");

    // Remove minimum width and height styling rules
    window.css({ minWidth: 100, minHeight: 30 });

    // Slide-up content
    content.slideUp(100);

    // Slide up window height
    return new Promise((resolve) => {
      window.animate({ height: `${header[0].offsetHeight + 1}px` }, 100, () => {
        header.children().not(".window-title").not(".close").hide();
        window.animate({ width: MIN_WINDOW_WIDTH }, 100, () => {
          window.addClass("minimized");
          this._minimized = true;
          resolve();
        });
      });
    });
  }

  /* -------------------------------------------- */

  /**
   * Maximize the pop-out window, expanding it to its original size
   * Take no action for applications which are not of the pop-out variety or are already maximized
   * @return {Promise<void>}    A Promise which resolves once the maximization action has completed
   */
  async maximize () {
    if (!this.popOut || [false, null].includes(this._minimized)) return;
    this._minimized = null;

    // Get content
    const window = this.element;
    const header = window.find(".window-header");
    const content = window.find(".window-content");

    // Expand window
    return new Promise((resolve) => {
      window.animate({ width: this.position.width, height: this.position.height }, 100, () => {
        header.children().show();
        content.slideDown(100, () => {
          window.removeClass("minimized");
          this._minimized = false;
          window.css({ minWidth: "", minHeight: "" });
          this.setPosition(this.position);
          resolve();
        });
      });
    });
  }

  /* -------------------------------------------- */

  /**
   * Set the application position and store it's new location.
   *
   * @param {number|null} left            The left offset position in pixels
   * @param {number|null} top             The top offset position in pixels
   * @param {number|null} width           The application width in pixels
   * @param {number|string|null} height   The application height in pixels
   * @param {number|null} scale           The application scale as a numeric factor where 1.0 is default
   *
   * @returns {{left: number, top: number, width: number, height: number, scale:number}}
   * The updated position object for the application containing the new values
   */
  setPosition ({ left, top, width, height, scale } = {}) {
    if (!this.popOut) return; // Only configure position for popout apps
    const el = this.element[0];
    const p = this.position;
    const pop = this.popOut;
    const styles = window.getComputedStyle(el);

    // If Height is "auto" unset current preference
    if ((height === "auto") || (this.options.height === "auto")) {
      el.style.height = "";
      height = null;
    }

    // Update width if an explicit value is passed, or if no width value is set on the element
    if (!el.style.width || width) {
      const tarW = width || el.offsetWidth;
      const minW = parseInt(styles.minWidth) || (pop ? MIN_WINDOW_WIDTH : 0);
      const maxW = el.style.maxWidth || window.innerWidth;
      p.width = width = Math.clamped(tarW, minW, maxW);
      el.style.width = width + "px";
      if ((width + p.left) > window.innerWidth) left = p.left;
    }
    width = el.offsetWidth;

    // Update height if an explicit value is passed, or if no height value is set on the element
    if (!el.style.height || height) {
      const tarH = height || (el.offsetHeight + 1);
      const minH = parseInt(styles.minHeight) || (pop ? MIN_WINDOW_HEIGHT : 0);
      const maxH = el.style.maxHeight || window.innerHeight;
      p.height = height = Math.clamped(tarH, minH, maxH);
      el.style.height = height + "px";
      if ((height + p.top) > window.innerHeight) top = p.top;
    }
    height = el.offsetHeight;

    // Update Left
    if ((pop && !el.style.left) || Number.isFinite(left)) {
      const tarL = Number.isFinite(left) ? left : (window.innerWidth - width) / 2;
      const maxL = Math.max(window.innerWidth - width, 0);
      p.left = left = Math.clamped(tarL, 0, maxL);
      el.style.left = left + "px";
    }

    // Update Top
    if ((pop && !el.style.top) || Number.isFinite(top)) {
      const tarT = Number.isFinite(top) ? top : (window.innerHeight - height) / 2;
      const maxT = Math.max(window.innerHeight - height, 0);
      p.top = top = Math.clamped(tarT, 0, maxT);
      el.style.top = p.top + "px";
    }

    // Update Scale
    if (scale) {
      p.scale = Math.max(scale, 0);
      if (scale === 1) el.style.transform = "";
      else el.style.transform = `scale(${scale})`;
    }

    // Return the updated position object
    return p;
  }

  /* -------------------------------------------- */

  /**
   * Handle application minimization behavior - collapsing content and reducing the size of the header
   * @param {Event} ev
   * @private
   */
  _onToggleMinimize (ev) {
    ev.preventDefault();
    if (this._minimized) this.maximize(ev);
    else this.minimize(ev);
  }

  /* -------------------------------------------- */

  /**
   * Additional actions to take when the application window is resized
   * @param {Event} event
   * @private
   */
  _onResize (event) {}
}
