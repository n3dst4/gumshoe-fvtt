/* eslint-disable */
/**
 * The client-side Combatant document which extends the common BaseCombatant model.
 * Each Combatant belongs to the effects collection of its parent Document.
 * Each Combatant contains a CombatantData object which provides its source data.
 *
 * @extends abstract.Document
 * @extends abstract.BaseCombatant
 * @extends ClientDocumentMixin
 *
 * @see {@link data.CombatantData}                  The Combatant data schema
 * @see {@link documents.Combat}                    The Combat document which contains Combatant embedded documents
 *
 * @param {CombatantData} [data={}]    Initial data provided to construct the Combatant document
 * @param {Combat|documents.Item} parent   The parent document to which this Combatant belongs
 */
class Combatant extends ClientDocumentMixin(foundry.documents.BaseCombatant) {
  constructor(data, context) {
    super(data, context);

    /**
     * The current value of the special tracked resource which pertains to this Combatant
     * @type {object|null}
     */
    this.resource = this.resource || null;
  }

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * A convenience alias of Combatant#parent which is more semantically intuitive
   * @type {Combat|null}
   */
  get combat() {
    return this.parent;
  }

  /* -------------------------------------------- */

  /**
   * Determine the image icon path that should be used to portray this Combatant in the combat tracker or elsewhere
   * @type {string}
   */
  get img() {
    return (
      this.data.img ||
      this.token?.data.img ||
      this.actor?.img ||
      CONST.DEFAULT_TOKEN
    );
  }

  /* -------------------------------------------- */

  /**
   * A convenience reference to the current initiative score of this Combatant
   * @type {number|null}
   */
  get initiative() {
    return Number.isNumeric(this.data.initiative)
      ? Number(this.data.initiative)
      : null;
  }

  /* -------------------------------------------- */

  /**
   * This is treated as a non-player combatant if it has no associated actor and no player users who can control it
   * @type {boolean}
   */
  get isNPC() {
    return !this.actor || !this.players.length;
  }

  /* -------------------------------------------- */

  /** @override */
  get isOwner() {
    return game.user.isGM || this.actor?.isOwner || false;
  }

  /* -------------------------------------------- */

  /** @override */
  get visible() {
    return this.isOwner || !this.hidden;
  }

  /* -------------------------------------------- */

  /**
   * Is this Combatant "hidden", either because they are explicitly marked as hidden or because their token is hidden
   * @type {boolean}
   */
  get hidden() {
    return this.data.hidden;
  }

  /* -------------------------------------------- */

  /**
   * The displayed name for the Combatant is based off its own configured data, or the data of its represented Token.
   * @type {string}
   */
  get name() {
    return (
      this.data.name ||
      this.token?.name ||
      this.actor?.name ||
      game.i18n.localize("COMBAT.UnknownCombatant")
    );
  }

  /* -------------------------------------------- */

  /**
   * A reference to the Actor document which this Combatant represents, if any
   * @type {Actor|null}
   */
  get actor() {
    if (this.token) return this.token.actor;
    return game.actors.get(this.data.actorId) || null;
  }

  /* -------------------------------------------- */

  /**
   * A reference to the Token document which this Combatant represents, if any
   * @type {TokenDocument|null}
   */
  get token() {
    const scene = this.data.sceneId
      ? game.scenes.get(this.data.sceneId)
      : this.parent.scene;
    return scene?.tokens.get(this.data.tokenId) || null;
  }

  /* -------------------------------------------- */

  /**
   * An array of User documents who have ownership of this Document
   * @type {User[]}
   */
  get players() {
    const playerOwners = [];
    for (let u of game.users) {
      if (u.isGM) continue;
      if (this.testUserPermission(u, "OWNER")) playerOwners.push(u);
    }
    return playerOwners;
  }

  /* -------------------------------------------- */

  /**
   * Has this combatant been marked as defeated?
   * @type {boolean}
   */
  get isDefeated() {
    return (
      this.data.defeated ||
      this.actor?.effects.some(
        (e) => e.getFlag("core", "statusId") === CONFIG.Combat.defeatedStatusId,
      )
    );
  }

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /** @inheritdoc */
  testUserPermission(user, permission, { exact = false } = {}) {
    // Combatants should be controlled by anyone who can update the Actor they represent
    return this.actor?.canUserModify(user, "update") || false;
  }

  /* -------------------------------------------- */

  /**
   * Get a Roll object which represents the initiative roll for this Combatant.
   * @param {string} formula        An explicit Roll formula to use for the combatant.
   * @return {Roll}                 The unevaluated Roll instance to use for the combatant.
   */
  getInitiativeRoll(formula) {
    formula = formula || this._getInitiativeFormula();
    const rollData = this.actor?.getRollData() || {};
    return Roll.create(formula, rollData);
  }

  /* -------------------------------------------- */

  /**
   * Roll initiative for this particular combatant.
   * @param {string} [formula]      A dice formula which overrides the default for this Combatant.
   * @return {Promise<Combatant>}   The updated Combatant.
   */
  async rollInitiative(formula) {
    const roll = this.getInitiativeRoll(formula);
    await roll.evaluate({ async: true });
    return this.update({ initiative: roll.total });
  }

  /* -------------------------------------------- */

  /** @override */
  prepareDerivedData() {
    if (!this.parent.data) return;
    this.updateResource();
  }

  /* -------------------------------------------- */

  /**
   * Update the value of the tracked resource for this Combatant.
   * @returns {null|object}
   */
  updateResource() {
    if (!this.actor) return (this.resource = null);
    return (this.resource =
      foundry.utils.getProperty(
        this.actor.data.data,
        this.parent.settings.resource,
      ) || null);
  }

  /* -------------------------------------------- */

  /**
   * Acquire the default dice formula which should be used to roll initiative for this combatant.
   * Modules or systems could choose to override or extend this to accommodate special situations.
   * @return {string}               The initiative formula to use for this combatant.
   * @protected
   */
  _getInitiativeFormula() {
    return String(
      CONFIG.Combat.initiative.formula || game.system.data.initiative,
    );
  }

  /* -------------------------------------------- */

  /**
   * @deprecated since v9
   * @ignore
   */
  get isVisible() {
    console.warn(
      "Combatant#isVisible is deprecated in favor of Combatant#visible, support will be removed in v10.",
    );
    return this.visible;
  }
}
