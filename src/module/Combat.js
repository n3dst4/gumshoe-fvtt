/* eslint-disable */
/**
 * The Combat model definition which defines common behavior of an Combat document between both client and server.
 * Each Combat document contains CombatData which defines its data schema.
 *
 * @extends abstract.Document
 * @extends abstract.Document
 * @extends abstract.BaseCombat
 * @extends ClientDocumentMixin
 *
 * @see {@link data.CombatData}               The Combat data schema
 * @see {@link documents.Combats}             The world-level collection of Combat documents
 * @see {@link embedded.Combatant}            The Combatant embedded document which exists within a Combat document
 * @see {@link applications.CombatConfig}     The Combat configuration application
 *
 * @param {data.CombatData} [data={}]         Initial data provided to construct the Combat document
 */
class Combat extends ClientDocumentMixin(foundry.documents.BaseCombat) {
  constructor (data, context) {
    super(data, context);

    /**
     * Track the sorted turn order of this combat encounter
     * @type {Combatant[]}
     */
    this.turns = this.turns || [];

    /**
     * Record the current round, turn, and tokenId to understand changes in the encounter state
     * @type {{round: number|null, turn: number|null, tokenId: string|null, combatantId: string|null}}
     * @private
     */
    this.current = this.current || {
      round: null,
      turn: null,
      tokenId: null,
      combatantId: null,
    };

    /**
     * Track the previous round, turn, and tokenId to understand changes in the encounter state
     * @type {{round: number|null, turn: number|null, tokenId: string|null, combatantId: string|null}}
     * @private
     */
    this.previous = this.previous || {
      round: null,
      turn: null,
      tokenId: null,
      combatantId: null,
    };

    /**
     * Track whether a sound notification is currently being played to avoid double-dipping
     * @type {boolean}
     * @private
     */
    this._soundPlaying = false;
  }

  /**
   * The configuration setting used to record Combat preferences
   * @type {string}
   */
  static CONFIG_SETTING = "combatTrackerConfig";

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Get the Combatant who has the current turn.
   * @type {Combatant}
   */
  get combatant () {
    return this.turns[this.data.turn];
  }

  /* -------------------------------------------- */

  /**
   * The numeric round of the Combat encounter
   * @type {number}
   */
  get round () {
    return Math.max(this.data.round, 0);
  }

  /* -------------------------------------------- */

  /**
   * A reference to the Scene document within which this Combat encounter occurs.
   * If a specific Scene is not set in the Combat Data, the currently viewed scene is assumed instead.
   * @type {Scene}
   */
  get scene () {
    return game.scenes.get(this.data.scene) || game.scenes.current || undefined;
  }

  /* -------------------------------------------- */

  /**
   * Return the object of settings which modify the Combat Tracker behavior
   * @return {object}
   */
  get settings () {
    return CombatEncounters.settings;
  }

  /* -------------------------------------------- */

  /**
   * Has this combat encounter been started?
   * @type {boolean}
   */
  get started () {
    return (this.turns.length > 0) && (this.round > 0);
  }

  /* -------------------------------------------- */

  /**
   * The numeric turn of the combat round in the Combat encounter
   * @type {number|null}
   */
  get turn () {
    if (this.data.turn === null) return null;
    return Math.max(this.data.turn, 0);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get visible () {
    return true;
  }

  /* -------------------------------------------- */

  /**
   * Is this combat active in the current scene?
   * @type {boolean}
   */
  get isActive () {
    const inScene = (this.data.scene === null) || (this.data.scene === game.scenes.current?.id);
    return inScene && this.data.active;
  }

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Set the current Combat encounter as active within the Scene.
   * Deactivate all other Combat encounters within the viewed Scene and set this one as active
   * @param {object} [options] Additional context to customize the update workflow
   * @return {Promise<Combat>}
   */
  async activate (options) {
    const updates = this.collection.reduce((arr, c) => {
      if (c.isActive) arr.push({ _id: c.data._id, active: false });
      return arr;
    }, []);
    updates.push({ _id: this.id, active: true });
    return this.constructor.updateDocuments(updates, options);
  }

  /* -------------------------------------------- */

  /**
   * Display a dialog querying the GM whether they wish to end the combat encounter and empty the tracker
   * @return {Promise<Combat>}
   */
  async endCombat () {
    return Dialog.confirm({
      title: game.i18n.localize("COMBAT.EndTitle"),
      content: `<p>${game.i18n.localize("COMBAT.EndConfirmation")}</p>`,
      yes: this.delete.bind(this),
    });
  }

  /* -------------------------------------------- */

  /**
   * Get a Combatant using its Token id
   * @param {string} tokenId   The id of the Token for which to acquire the combatant
   * @return {Combatant}
   */
  getCombatantByToken (tokenId) {
    return this.combatants.find(c => c.data.tokenId === tokenId);
  }

  /* -------------------------------------------- */

  /**
   * Get a Combatant using its Actor id
   * @param {string} actorId The id of the Actor for which to acquire the combatant
   * @return {Combatant}
   */
  getCombatantByActor (actorId) {
    return this.combatants.find(c => c.data.actorId === actorId);
  }

  /* -------------------------------------------- */

  /**
   * Advance the combat to the next round
   * @return {Promise<Combat>}
   */
  async nextRound () {
    let turn = this.data.turn === null ? null : 0; // Preserve the fact that it's no-one's turn currently.
    if (this.settings.skipDefeated && (turn !== null)) {
      turn = this.turns.findIndex(t => !t.isDefeated);
      if (turn === -1) {
        ui.notifications.warn("COMBAT.NoneRemaining", { localize: true });
        turn = 0;
      }
    }
    let advanceTime = Math.max(this.turns.length - (this.data.turn || 0), 0) * CONFIG.time.turnTime;
    advanceTime += CONFIG.time.roundTime;
    return this.update({ round: this.round + 1, turn }, { advanceTime });
  }

  /* -------------------------------------------- */

  /**
   * Advance the combat to the next turn
   * @return {Promise<Combat>}
   */
  async nextTurn () {
    const turn = this.turn ?? -1;
    const skip = this.settings.skipDefeated;

    // Determine the next turn number
    let next = null;
    if (skip) {
      for (const [i, t] of this.turns.entries()) {
        if (i <= turn) continue;
        if (t.isDefeated) continue;
        next = i;
        break;
      }
    } else next = turn + 1;

    // Maybe advance to the next round
    const round = this.round;
    if ((this.round === 0) || (next === null) || (next >= this.turns.length)) {
      return this.nextRound();
    }

    // Update the encounter
    const advanceTime = CONFIG.time.turnTime;
    return this.update({ round: round, turn: next }, { advanceTime });
  }

  /* -------------------------------------------- */

  /** @override */
  prepareDerivedData () {
    if (this.combatants.size && !this.turns?.length) this.setupTurns();
  }

  /* -------------------------------------------- */

  /**
   * Rewind the combat to the previous round
   * @return {Promise<Combat>}
   */
  async previousRound () {
    let turn = (this.round === 0) ? 0 : Math.max(this.turns.length - 1, 0);
    if (this.data.turn === null) turn = null;
    const round = Math.max(this.round - 1, 0);
    let advanceTime = -1 * (this.data.turn || 0) * CONFIG.time.turnTime;
    if (round > 0) advanceTime -= CONFIG.time.roundTime;
    return this.update({ round, turn }, { advanceTime });
  }

  /* -------------------------------------------- */

  /**
   * Rewind the combat to the previous turn
   * @return {Promise<Combat>}
   */
  async previousTurn () {
    if ((this.turn === 0) && (this.round === 0)) return this;
    else if ((this.turn <= 0) && (this.turn !== null)) return this.previousRound();
    const advanceTime = -1 * CONFIG.time.turnTime;
    return this.update({ turn: (this.turn ?? this.turns.length) - 1 }, { advanceTime });
  }

  /* -------------------------------------------- */

  /**
   * Toggle whether this combat is linked to the scene or globally available.
   * @returns {Promise<Combat>}
   */
  async toggleSceneLink () {
    const scene = this.data.scene === null ? game.scenes.current?.id : null;
    if (scene === undefined) return this;
    return this.update({ scene });
  }

  /* -------------------------------------------- */

  /**
   * Reset all combatant initiative scores, setting the turn back to zero
   * @return {Promise<Combat>}
   */
  async resetAll () {
    for (const c of this.combatants) {
      c.data.update({ initiative: null });
    }
    return this.update({ turn: 0, combatants: this.combatants.toObject() }, { diff: false });
  }

  /* -------------------------------------------- */

  /**
   * Roll initiative for one or multiple Combatants within the Combat document
   * @param {string|string[]} ids     A Combatant id or Array of ids for which to roll
   * @param {object} [options={}]     Additional options which modify how initiative rolls are created or presented.
   * @param {string|null} [options.formula]         A non-default initiative formula to roll. Otherwise the system default is used.
   * @param {boolean} [options.updateTurn=true]     Update the Combat turn after adding new initiative scores to keep the turn on the same Combatant.
   * @param {object} [options.messageOptions={}]    Additional options with which to customize created Chat Messages
   * @return {Promise<Combat>}        A promise which resolves to the updated Combat document once updates are complete.
   */
  async rollInitiative (ids, { formula = null, updateTurn = true, messageOptions = {} } = {}) {
    // Structure input data
    ids = typeof ids === "string" ? [ids] : ids;
    const currentId = this.combatant?.id;
    const chatRollMode = game.settings.get("core", "rollMode");

    // Iterate over Combatants, performing an initiative roll for each
    const updates = [];
    const messages = [];
    for (const [i, id] of ids.entries()) {
      // Get Combatant data (non-strictly)
      const combatant = this.combatants.get(id);
      if (!combatant?.isOwner) continue;

      // Produce an initiative roll for the Combatant
      const roll = combatant.getInitiativeRoll(formula);
      await roll.evaluate({ async: true });
      updates.push({ _id: id, initiative: roll.total });

      // Construct chat message data
      const messageData = foundry.utils.mergeObject({
        speaker: ChatMessage.getSpeaker({
          actor: combatant.actor,
          token: combatant.token,
          alias: combatant.name,
        }),
        flavor: game.i18n.format("COMBAT.RollsInitiative", { name: combatant.name }),
        flags: { "core.initiativeRoll": true },
      }, messageOptions);
      const chatData = await roll.toMessage(messageData, { create: false });

      // If the combatant is hidden, use a private roll unless an alternative rollMode was explicitly requested
      chatData.rollMode = "rollMode" in messageOptions
        ? messageOptions.rollMode
        : (combatant.hidden ? CONST.DICE_ROLL_MODES.PRIVATE : chatRollMode);

      // Play 1 sound for the whole rolled set
      if (i > 0) chatData.sound = null;
      messages.push(chatData);
    }
    if (!updates.length) return this;

    // Update multiple combatants
    await this.updateEmbeddedDocuments("Combatant", updates);

    // Ensure the turn order remains with the same combatant
    if (updateTurn && currentId) {
      await this.update({ turn: this.turns.findIndex(t => t.id === currentId) });
    }

    // Create multiple chat messages
    await ChatMessage.implementation.create(messages);
    return this;
  }

  /* -------------------------------------------- */

  /**
   * Roll initiative for all combatants which have not already rolled
   * @param {object} [options={}]   Additional options forwarded to the Combat.rollInitiative method
   */
  async rollAll (options) {
    const ids = this.combatants.reduce((ids, c) => {
      if (c.isOwner && (c.initiative === null)) ids.push(c.id);
      return ids;
    }, []);
    return this.rollInitiative(ids, options);
  }

  /* -------------------------------------------- */

  /**
   * Roll initiative for all non-player actors who have not already rolled
   * @param {object} [options={}]   Additional options forwarded to the Combat.rollInitiative method
   */
  async rollNPC (options = {}) {
    const ids = this.combatants.reduce((ids, c) => {
      if (c.isOwner && c.isNPC && (c.initiative === null)) ids.push(c.id);
      return ids;
    }, []);
    return this.rollInitiative(ids, options);
  }

  /* -------------------------------------------- */

  /**
   * Assign initiative for a single Combatant within the Combat encounter.
   * Update the Combat turn order to maintain the same combatant as the current turn.
   * @param {string} id         The combatant ID for which to set initiative
   * @param {number} value      A specific initiative value to set
   */
  async setInitiative (id, value) {
    const combatant = this.combatants.get(id, { strict: true });
    await combatant.update({ initiative: value });
  }

  /* -------------------------------------------- */

  /**
   * Return the Array of combatants sorted into initiative order, breaking ties alphabetically by name.
   * @return {Combatant[]}
   */
  setupTurns () {
    // Determine the turn order and the current turn
    const turns = this.combatants.contents.sort(this._sortCombatants);
    if (this.turn !== null) this.data.turn = Math.clamped(this.data.turn, 0, turns.length - 1);

	  // Update state tracking
    const c = turns[this.data.turn];
    this.current = {
      round: this.data.round,
      turn: this.data.turn,
      combatantId: c ? c.id : null,
      tokenId: c ? c.data.tokenId : null,
    };
    return this.turns = turns;
  }

  /* -------------------------------------------- */

  /**
   * Begin the combat encounter, advancing to round 1 and turn 1
   * @return {Promise<Combat>}
   */
  async startCombat () {
    return this.update({ round: 1, turn: 0 });
  }

  /* -------------------------------------------- */

  /**
   * Define how the array of Combatants is sorted in the displayed list of the tracker.
   * This method can be overridden by a system or module which needs to display combatants in an alternative order.
   * By default sort by initiative, next falling back to name, lastly tie-breaking by combatant id.
   * @private
   */
  _sortCombatants (a, b) {
    const ia = Number.isNumeric(a.initiative) ? a.initiative : -9999;
    const ib = Number.isNumeric(b.initiative) ? b.initiative : -9999;
    const ci = ib - ia;
    if (ci !== 0) return ci;
    return a.id > b.id ? 1 : -1;
  }

  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  /** @inheritdoc */
  _onCreate (data, options, userId) {
    super._onCreate(data, options, userId);
    if (!this.collection.viewed) ui.combat.initialize({ combat: this, render: false });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onUpdate (data, options, userId) {
	  super._onUpdate(data, options, userId);

    // Set up turn data
    if (["combatants", "round", "turn"].some(k => data.hasOwnProperty(k))) {
      if (data.combatants) this.setupTurns();
      else {
        const c = this.combatant;
        this.previous = this.current;
        this.current = {
          round: this.data.round,
          turn: this.data.turn,
          combatantId: c ? c.id : null,
          tokenId: c ? c.data.tokenId : null,
        };
      }

      return ui.combat.scrollToTurn();
    }

    // Render the sidebar
    if ((data.active === true) && this.isActive) ui.combat.initialize({ combat: this });
    else if ("scene" in data) ui.combat.initialize();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onDelete (options, userId) {
    super._onDelete(options, userId);
    if (this.collection.viewed === this) ui.combat.initialize({ render: false });
    if (userId === game.userId) this.collection.viewed?.activate();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onCreateEmbeddedDocuments (type, documents, result, options, userId) {
    super._onCreateEmbeddedDocuments(type, documents, result, options, userId);

    // Update the turn order and adjust the combat to keep the combatant the same
    const current = this.combatant;
    this.setupTurns();

    // Keep the current Combatant the same after adding new Combatants to the Combat
    if (current) {
      const turn = Math.max(this.turns.findIndex(t => t.id === current.id), 0);
      if (game.user.id === userId) this.update({ turn });
      else this.data.update({ turn });
    }

    // Render the collection
    if (this.data.active && (options.render !== false)) this.collection.render();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onUpdateEmbeddedDocuments (embeddedName, documents, result, options, userId) {
    super._onUpdateEmbeddedDocuments(embeddedName, documents, result, options, userId);
    const current = this.combatant;
    this.setupTurns();
    const turn = current ? this.turns.findIndex(t => t.id === current.id) : this.turn;
    if (turn !== this.turn) {
      if (game.user.id === userId) this.update({ turn });
      else this.data.update({ turn });
    }
    if (this.data.active && (options.render !== false)) this.collection.render();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onDeleteEmbeddedDocuments (embeddedName, documents, result, options, userId) {
    super._onDeleteEmbeddedDocuments(embeddedName, documents, result, options, userId);

    // Update the turn order and adjust the combat to keep the combatant the same (unless they were deleted)
    const current = this.combatant;
    const { prevSurvivor, nextSurvivor } = this.turns.reduce((obj, t, i) => {
      let valid = !result.includes(t.id);
      if (this.settings.skipDefeated) valid &&= !t.isDefeated;
      if (!valid) return obj;
      if (i < this.turn) obj.prevSurvivor = t;
      if (!obj.nextSurvivor && (i >= this.turn)) obj.nextSurvivor = t;
      return obj;
    }, {});
    this.setupTurns();

    // If the current combatant was removed, update the turn order to the next survivor
    let turn = this.data.turn;
    if (result.includes(current?.id)) {
      const survivor = nextSurvivor || prevSurvivor;
      if (survivor) turn = this.turns.findIndex(t => t.id === survivor.id);
    }

    // Otherwise keep the combatant the same
    else turn = this.turns.findIndex(t => t.id === current?.id);

    // Update database or perform a local override
    turn = Math.max(turn, 0);
    if (current) {
      if (game.user.id === userId) this.update({ turn });
      else this.data.update({ turn });
    }

    // Render the collection
    if (this.data.active && (options.render !== false)) this.collection.render();
  }
}
