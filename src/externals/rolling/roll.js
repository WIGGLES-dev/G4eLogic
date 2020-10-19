/**
 * Rolling API from foundryVTT
 * @author FOUNDRYVTT
 */

import twist from "./twister.js";

const DICE_ROLL_MODES = {
    PUBLIC: "roll",
    PRIVATE: "gmroll",
    BLIND: "blindroll",
    SELF: "selfroll"
};

export const CONFIG = {
    Dice: {
        types: [Die, FateDie],
        template: "templates/dice/roll.html",
        tooltip: "templates/dice/tooltip.html",
        mathProxy: new Proxy(Math, { has: () => true, get: (t, k) => k === Symbol.unscopables ? undefined : t[k] }),
        rollModes: Object.entries(CONST.DICE_ROLL_MODES).reduce((obj, e) => {
            let [k, v] = e;
            obj[v] = `CHAT.Roll${k.titleCase()}`;
            return obj;
        }, {})
    },
}

/**
 * A dice pool represents a set of Roll expressions which are collectively modified to compute an effective total
 * across all Rolls in the pool. The final total for the pool is defined as the sum over kept rolls, relative to any
 * success count or margin.
 *
 * @example
 * // Consider 3 rolls
 * let r1 = new Roll("4d6");
 * let r2 = new Roll("3d8");
 * let r3 = new Roll("2d10");
 * // Keep the highest of the 3 roll expressions
 * let pool = new DicePool([r1,r2,r3], "kh");
 *
 * @example
 * // Construct a DicePool from a string formula
 * let pool = DicePool.fromFormula("{4d6,3d8,2d10}kh");
 */
class DicePool {
    constructor(rolls = [], modifiers = "") {

        /**
         * The elements of a Dice Pool must be Roll objects
         * @type {Array.<Roll>}
         */
        this.rolls = rolls;

        /**
         * The string modifiers applied to resolve the pool
         * @type {string}
         */
        this.modifiers = modifiers;

        /**
         * An Array of rolled Die instances created through this Pool
         * @type {Array}
         */
        this.dice = [];

        /**
         * The final numeric total resulting from the rolled DicePool
         * @type {number|null}
         */
        this.total = null;
    }

    /* -------------------------------------------- */

    /**
     * For now, for testing purposes, choose the maximum result always
     */
    roll() {

        // Roll everything in the DicePool
        const dice = [];
        for (let r of this.rolls) {
            if (!r._rolled) r.roll();
            dice.push(...r.dice);
        }

        // Identify and sort results in ascending order of total
        const results = this.rolls.map(r => {
            return {
                roll: r,
                total: r.total,
                keep: true
            };
        });
        results.sort((a, b) => a.total - b.total);

        // Parse modifiers
        const mods = this._parseModifiers(this.modifiers);
        for (let mod of mods) {
            this._keepOrDrop(results, mod);
            this._countSuccess(results, mod);
        }

        // The total for the pool is defined as the sum over kept rolls
        const total = results.reduce((total, r) => {
            if (r.keep) total += r.total;
            return total;
        }, 0);

        // Flag the total and return
        this.results = results;
        this.dice = dice;
        this.total = total;
        return this;
    }

    /* -------------------------------------------- */

    /**
     * Parse a modifier query string into an ordered Array of modifiers to apply.
     * @param {string} modifiers
     * @return {Array.<string>}
     * @private
     */
    _parseModifiers(modifiers) {
        let patterns = [DicePool.rgx.keep, DicePool.rgx.success];
        for (let p of patterns) {
            modifiers = modifiers.replace(RegExp(p, "g"), "$&;");
        }
        return modifiers.split(";").filter(m => m !== "");
    }

    /* -------------------------------------------- */

    /**
     * Iterate over the results Array and apply a keep-or-drop modifier
     * @param {Array} results
     * @param {string} mod
     * @private
     */
    _keepOrDrop(results, mod) {
        const kd = mod.match(DicePool.rgx.keep);
        if (!kd) return;

        // Determine the number to keep or drop
        let mode = kd[1];
        let n = parseInt(kd[2] || 1);

        // Highest
        if (["kh", "dl"].includes(mode)) {
            n = (mode === "kh") ? Math.clamped(n, 1, results.length) : Math.clamped(n, 0, results.length - 1);
            results.forEach((r, i) => r.keep = i >= (results.length - n));
        }

        // Lowest
        else {
            n = (mode === "kl") ? Math.clamped(n, 1, results.length) : Math.clamped(n, 0, results.length - 1);
            results.forEach((r, i) => r.keep = i < (results.length - n));
        }
    }

    /* -------------------------------------------- */

    /**
     * Iterate over the results Array and count successes or compute margin of success
     * @param {Array} results
     * @param {string} mod
     * @private
     */
    _countSuccess(results, mod) {
        const cs = mod.match(DicePool.rgx.success);
        if (!cs) return;

        // Determine the threshold for flagging
        let mode = cs[1];
        let operator = cs[2];
        let tgt = parseInt(cs[3]);

        // Count successes
        if (["cs", "cf"].includes(mode)) {
            for (let r of results) {
                if (operator === ">") r.total = Number(r.total > tgt);
                else if (operator === ">=") r.total = Number(r.total >= tgt);
                else if (operator === "<") r.total = Number(r.total < tgt);
                else if (operator === "<=") r.total = Number(r.total <= tgt);
                if (mode === "cf") r.total = 1 - r.total;
            }
        }

        // Margin of success
        else if (mode === "ms") {
            for (let r of results) {
                if ([">", ">=", "="].includes(operator)) r.total = r.total - tgt;
                else r.total = tgt - r.total;
            }
        }
    }

    /* -------------------------------------------- */
    /*  Factory Method                              */
    /* -------------------------------------------- */

    /**
     * Given a string formula, create and return an evaluated DicePool object
     * @param {string} formula    The string formula to parse
     * @return {DicePool|null}    The evaluated DicePool object or null if the formula is invalid
     */
    static fromFormula(formula) {
        const rgx = formula.match(this.rgx.pool);
        if (!rgx) return null;
        let [terms, modifiers] = rgx.slice(1);

        // Transform each term of the pool into a Roll instance
        const rolls = terms.split(',').reduce((arr, t) => {
            t = t.trim();
            arr.push(new Roll(t));
            return arr;
        }, []);

        // Create the Pool object
        modifiers = modifiers || "";
        const pool = new this(rolls, modifiers);
        pool.roll();
        return pool;
    }

    /* -------------------------------------------- */
    /*  Serialization and Storage                   */
    /* -------------------------------------------- */

    /**
     * Convert the DicePool instance into an Object which can be serialized to JSON
     * @return {Object}     The converted data
     */
    toJSON() {
        return {
            class: "DicePool",
            rolls: this.rolls.map(r => r.toJSON()),
            total: this.total,
            modifiers: this.modifiers,
        }
    }

    /* -------------------------------------------- */

    /**
     * Reconstruct a DicePool instance from a provided data Object
     * @param {Object} data   The provided data
     * @return {DicePool}     The constructed Dice Pool
     */
    static fromData(data) {

        // Reconstitute inner rolls
        const rolls = data.rolls.map(r => Roll.fromData(r));

        // Reconstitute the pool itself
        const pool = new this(rolls, data.modifiers);

        // Restore additional data
        pool.total = data.total;
        pool.dice = rolls.reduce((dice, r) => {
            dice.push(...r.dice);
            return dice;
        }, []);

        // Return the restored pool
        return pool;
    }

    /* -------------------------------------------- */

    /**
     * Reconstruct a DicePool instance from a provided data Object
     * @param {string} json   The serialized JSON string
     * @return {DicePool}     The constructed Dice Pool
     */
    static fromJSON(json) {
        return this.fromData(JSON.parse(json))
    }
}

DicePool.rgx = {
    pool: RegExp('{([^}]+)}([A-z]{1}[A-z0-9<=>]+)?'),
    keep: /(kh|kl|dh|dl)([0-9]+)?/,
    success: /(cs|cf|ms)(<=?|>=?|=)?([0-9]+)?/
};

export class Roll {
    constructor(formula, data = {}) {

        /**
         * The original provided data
         * @type {Object}
         */
        this.data = data;

        /**
         * The original "raw" formula before any substitutions or evaluation
         * @type {string}
         */
        this._formula = formula;

        /**
         * The processed formula resulting from substitution and evaluation
         * @type {string}
         */
        this.formula = this._replaceData(formula);

        /**
         * An array of evaluate Roll parts
         * @type {Array}
         */
        this.parts = [];

        /**
         * An Array of Die instance which were included as part of this Roll
         * @type {Array.<Die>}
         * @private
         */
        this._dice = [];

        /**
         * An internal flag for whether the Roll object has been rolled
         * @private
         */
        this._rolled = false;

        /**
         * Cache the rolled total to avoid re-evaluating it multiple times
         */
        this._result = null;

        /**
         * Cache the evaluated total to avoid re-evaluating it
         */
        this._total = null;

        /**
         * Regular expression patterns
         */
        this.rgx = {
            dice: new RegExp(this.constructor.rgx.dice),
            pool: new RegExp(this.constructor.rgx.pool),
            reroll: /r(<=|>=|<|>)?([0-9]+)?/,
            explode: /x(<=|>=|<|>)?([0-9]+)?/,
            keep: this.constructor.rgx.keep,
            success: this.constructor.rgx.success,
            parenthetical: /^\((.*)\)$/
        };
    }

    /* -------------------------------------------- */

    /**
     * Replace referenced data attributes in the roll formula with the syntax `@attr` with the corresponding key from
     * the provided `data` object.
     * @param {String} formula    The original formula within which to replace
     * @private
     */
    _replaceData(formula) {
        let dataRgx = new RegExp(/@([a-z.0-9_\-]+)/gi);
        return formula.replace(dataRgx, (match, term) => {
            let value = getProperty(this.data, term);
            return value ? String(value).trim() : "0";
        });
    }

    /* -------------------------------------------- */
    /*  Properties                                  */
    /* -------------------------------------------- */

    /**
     * The resulting arithmetic expression after rolls have been evaluated
     * @return {String}
     */
    get result() {
        return this._result;
    }

    /**
     * Express the total result of the roll and cache the result to avoid re-evaluating
     * @return {Number}
     */
    get total() {
        if (!this._rolled) return null;
        return this._total;
    }

    /**
     * Get an Array of any Die objects which were rolled as part of the evaluation of this roll
     * @type {Array.<Die>}
     */
    get dice() {
        if (!this._rolled) return null;
        return this._dice;
    }

    /**
     * The regular expression used to identify a Die component of a Roll
     * @private
     * @type {String}
     */
    static get diceRgx() {
        return '([0-9]+)?[dD]([0-9fF]+)([a-z][a-z0-9<=>]+)?';
    }

    static get rgx() {
        return {
            dice: '([0-9]+)?[dD]([0-9fF]+)([a-z][a-z0-9<=>]+)?',
            pool: '{([A-z0-9 ,]+)}([A-z]{1}[A-z0-9<=>]+)'
        }
    }

    /**
     * Record supported arithmetic operators for Roll instances
     * @private
     * @type {Array.<String>}
     */
    static get arithmeticOperators() {
        return ["+", "-", "*", "/"];
    }

    /* -------------------------------------------- */
    /*  Methods                                     */
    /* -------------------------------------------- */

    /**
     * Execute the Roll, replacing dice and evaluating the total result
     * @returns {Roll}    The rolled Roll object, able to be chained into other methods
     *
     * @example
     * let r = new Roll("2d6 + 4 + 1d4");
     * r.roll();
     * > 12
     */
    roll() {
        if (this._rolled) throw new Error("This Roll object has already been rolled.");
        const dice = [];

        // Step 1 - first evaluate parenthetical terms as inner Roll instances
        let terms = this._evalParentheticalTerms(this.formula).map(t => {
            if (t instanceof Roll) {
                t.roll();
                dice.push(...t.dice);
                return t.total;
            }
            return t;
        });
        this.formula = this.constructor.cleanFormula(terms.join(""));

        // Step 2 - evaluate dice pools
        terms = this._evalPoolTerms(this.formula);

        // Step 3 - separate arithmetic terms
        terms = this._expandArithmeticTerms(terms);

        // Step 4 - evaluate remaining Die terms
        const results = terms.reduce((arr, t) => {

            // Dice Pools
            if (t instanceof DicePool) {
                dice.push(...t.dice);
                arr[0].push(t);
                arr[1].push(t.total);
                return arr;
            }

            // Single die
            let die = Die.fromFormula(t);
            if (die) {
                dice.push(die);
                arr[0].push(die);
                arr[1].push(die.total);
                return arr;
            }

            // Arithmetic terms
            arr[0].push(t);
            arr[1].push(t);
            return arr;
        }, [[], []]);
        terms = results[0];
        let result = this._validateResult(results[1].join(" "));

        // Step 5 - safely evaluate the final formula
        const total = this._safeEval(result);
        if (!Number.isNumeric(total)) {
            throw new Error(game.i18n.format("DICE.ErrorNonNumeric", { formula: this.formula }));
        }

        // Step 6 - Store outputs
        this.parts = terms;
        this._dice = dice;
        this._result = result;
        this._total = total;
        this._rolled = true;
        return this;
    }

    /* -------------------------------------------- */

    /**
     * Create a new Roll object using the original provided formula and data
     * Each roll is immutable, so this method returns a new Roll instance using the same data.
     * @returns {Roll}    A new Roll object, rolled using the same formula and data
     */
    reroll() {
        let r = new this.constructor(this.formula, this.data);
        return r.roll();
    }

    /* -------------------------------------------- */
    /*  Helpers
    /* -------------------------------------------- */

    /**
     * Separate a dice roll formula into parenthetical terms to be evaluated first
     * @param {string} formula
     * @return {Array.<string>}
     * @private
     */
    _evalParentheticalTerms(formula) {

        // Replace parentheses with semicolons to use for splitting
        let toSplit = formula.replace(/([A-z]+)?\(/g, (match, prefix) => {
            return prefix in Math ? `;${prefix};(` : ";(";
        }).replace(/\)/g, ");");
        let terms = toSplit.split(";");

        // Match parenthetical groups
        let nOpen = 0;
        terms = terms.reduce((arr, t) => {

            // Handle cases where the prior term is a math function
            const beginMathFn = (t[0] === "(") && (arr[arr.length - 1] in Math);

            // Add terms to the array
            if ((nOpen > 0) || beginMathFn) arr[arr.length - 1] += t;
            else arr.push(t);

            // Increment the number of open parentheses
            if (!beginMathFn && (t === "(")) nOpen++;
            if ((nOpen > 0) && (t === ")")) nOpen--;
            return arr;
        }, []);

        // Convert parenthetical groups to inner Roll objects
        return terms.reduce((arr, t) => {
            if (t === "") return arr;
            let pt = t.match(this.rgx.parenthetical);
            arr.push(pt ? new Roll(pt[1], this.data) : t);
            return arr;
        }, []);
    }

    /* -------------------------------------------- */

    /**
     * Isolate any Dice Pool terms within a formula and evaluate them
     * @param {string} formula
     * @return {Array.<string>}
     * @private
     */
    _evalPoolTerms(formula) {
        let terms = formula.replace(/{/g, ';{').replace(/}([A-z0-9<=>]+)?/g, '$&;').split(";");
        let nOpen = 0;

        // Match outer-bracketed groups
        terms = terms.reduce((arr, t) => {
            if (nOpen > 0) arr[arr.length - 1] += t;
            else arr.push(t);
            if (t === "{") nOpen = Math.max(1, nOpen + 1);
            if (t === "}") nOpen = Math.max(0, nOpen - 1);
            return arr;
        }, []);

        // Convert bracketed groups to inner DicePool objects
        return terms.reduce((arr, t) => {
            if (t === "") return arr;
            const pool = DicePool.fromFormula(t);
            arr.push(pool ? pool : t);
            return arr;
        }, []);
    }

    /* -------------------------------------------- */

    /**
     * Expand and reallocate an array of terms, separating them based on arithmetic operators
     * @private
     */
    _expandArithmeticTerms(terms) {
        const arith = this.constructor.arithmeticOperators.concat(["(", ")"]);
        let split = new RegExp(arith.map(t => "\\" + t).join("|"), "g");
        return terms.reduce((arr, t) => {
            if (t === "") return arr;
            if (t instanceof DicePool) arr.push(t);
            else {
                let ts = t.replace(split, ';$&;').split(';');
                for (let s of ts) {
                    s = s.trim();
                    if (s !== "") arr.push(s);
                }
            }
            return arr;
        }, []);
    }

    /* -------------------------------------------- */

    /**
     * Replace a dice roll term enclosed in {brackets} with a DicePool instance
     * @param {string} term           The string term being replaced
     * @param {RegExpMatchArray} rgx  The regexp match for the term
     * @return {DicePool}             The replaced DicePool
     * @private
     */
    _replacePool(term, rgx) {
        const pool = new DicePool(rgx[1], rgx[2]);
        pool.roll();
        return pool;
    }

    /* -------------------------------------------- */

    _validateResult(result) {
        const unsafeMath = /([a-zA-Z_{1}][a-zA-Z0-9_]+)(?=[\s+]?\()/g;
        let valid = true;
        result.replace(unsafeMath, fn => {
            if (Math.hasOwnProperty(fn)) return "Math." + fn;
            else valid = false;
        });
        if (!valid) throw new Error("Invalid arithmetic expression!");
        return result;
    }

    /* -------------------------------------------- */

    /**
     * Safely evaluate a formulaic expression using a Proxy environment which is allowed access to Math commands
     * @param {String} expression     The formula expression to evaluate
     * @return {Number}               The returned numeric result
     * @private
     */
    _safeEval(expression) {
        const src = 'with (sandbox) { return ' + expression + '}';
        const evl = new Function('sandbox', src);
        return evl(CONFIG.Dice.mathProxy);
    }

    /* -------------------------------------------- */
    /*  HTML Rendering
    /* -------------------------------------------- */

    /**
     * Render a Roll instance to HTML
     * @param chatOptions {Object}      An object configuring the behavior of the resulting chat message.
     * @return {Promise.<HTMLElement>}  A Promise which resolves to the rendered HTML
     */
    async render(chatOptions = {}) {
        chatOptions = mergeObject({
            user: game.user._id,
            flavor: null,
            template: CONFIG.Dice.template,
            blind: false
        }, chatOptions);
        const isPrivate = chatOptions.isPrivate;

        // Execute the roll, if needed
        if (!this._rolled) this.roll();

        // Define chat data
        const chatData = {
            formula: isPrivate ? "???" : this.formula,
            flavor: isPrivate ? null : chatOptions.flavor,
            user: chatOptions.user,
            tooltip: isPrivate ? "" : await this.getTooltip(),
            total: isPrivate ? "?" : Math.round(this.total * 100) / 100
        };

        // Render the roll display template
        return renderTemplate(chatOptions.template, chatData);
    }

    /* -------------------------------------------- */

    /**
     * Render the tooltip HTML for a Roll instance
     * @return {Promise.<HTMLElement>}
     */
    getTooltip() {
        const data = {
            formula: this.formula,
            total: this.total
        };

        // Prepare dice parts
        data["parts"] = this.dice.map(d => {
            let minRoll = Math.min(...d.sides),
                maxRoll = Math.max(...d.sides);

            // Generate tooltip data
            return {
                formula: d.formula,
                total: d.total,
                faces: d.faces,
                rolls: d.rolls.map(r => {
                    return {
                        result: d._getTooltip(r.roll),
                        classes: [
                            d.constructor.name.toLowerCase(),
                            "d" + d.faces,
                            r.rerolled ? "rerolled" : null,
                            r.exploded ? "exploded" : null,
                            r.discarded ? "discarded" : null,
                            (r.roll === minRoll) ? "min" : null,
                            (r.roll === maxRoll) ? "max" : null
                        ].filter(c => c).join(" ")
                    }
                })
            };
        });

        // Render the tooltip template
        return renderTemplate(CONFIG.Dice.tooltip, data);
    }

    /* -------------------------------------------- */

    /**
     * Transform a Roll instance into a ChatMessage, displaying the roll result.
     * This function can either create the ChatMessage directly, or return the data object that will be used to create.
     *
     * @param {Object} messageData          The data object to use when creating the message
     * @param {string|null} [rollMode=null] The template roll mode to use for the message from CONFIG.Dice.rollModes
     * @param {boolean} [create=true]       Whether to automatically create the chat message, or only return the prepared
     *                                      chatData object.
     * @return {Promise|Object}             A promise which resolves to the created ChatMessage entity, if create is true
     *                                      or the Object of prepared chatData otherwise.
     */
    toMessage(messageData = {}, { rollMode = null, create = true } = {}) {

        // Perform the roll, if it has not yet been rolled
        if (!this._rolled) this.roll();

        // Prepare chat data
        messageData = mergeObject({
            user: game.user._id,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            content: this.total,
            sound: CONFIG.sounds.dice,
        }, messageData);
        messageData.roll = this;

        // Prepare message options
        const messageOptions = { rollMode };

        // Either create the message or just return the chat data
        return create ? CONFIG.ChatMessage.entityClass.create(messageData, messageOptions) : messageData;
    }

    /* -------------------------------------------- */
    /*  Methods
    /* -------------------------------------------- */

    /**
     * Alter the Roll formula by adding or multiplying the number of dice included in each roll term
     *
     * @param add {Number}      A number of dice to add to each Die term
     * @param multiply {Number} A multiplier for the number of dice in each Die term
     *
     * @example
     * let r = new Roll("4d8 + 4 + 2d4");
     * r.alter(1, 2);
     * r.formula;
     * > 9d8 + 4 + 5d4
     */
    alter(add, multiply) {
        if (this._rolled) throw new Error("You may not alter a Roll which has already been rolled");
        const rgx = new RegExp(Die.rgx.die, "g");
        this.formula = this.formula.replace(rgx, (match, nd, d, mods) => {
            nd = (nd * (multiply || 1)) + (add || 0);
            mods = mods || "";
            return nd + "d" + d + mods;
        });
        return this;
    }

    /* -------------------------------------------- */

    /**
     * Clean a dice roll formula, returning the formatted string with proper spacing
     * @param formula
     * @return {*}
     */
    static cleanFormula(formula) {

        // Replace multiple white spaces
        formula = formula.replace(/\s{2,}/, " ");

        // Clean arithmetic
        const arith = this.arithmeticOperators;
        const split = new RegExp(arith.map(t => "\\" + t).join("|"), "g");
        const terms = formula.replace(split, ";$&;").split(";");
        const cleaned = terms.reduce((arr, t) => {
            let ix = arr.length - 1;
            t = t.trim();
            if (t === "") return arr; // Exclude white space
            let prior = arr[ix];

            // De-dupe addition and multiplication
            if (["+", "*"].includes(t) && prior === t) return arr;

            // Negate double subtraction
            if ((t === "-") && (prior === "-")) {
                arr[ix] = "+";
                return arr;
            }

            // Negate double division
            if ((t === "/") && (prior === "/")) {
                arr[ix] = "*";
                return arr;
            }

            // Subtract a negative value
            if (["-+", "+-"].includes(t + prior)) {
                arr[ix] = "-";
                return arr;
            }

            arr.push(t);
            return arr;
        }, []);
        return cleaned.join(" ");
    }

    /* -------------------------------------------- */

    /**
     * Return the minimum possible Dice roll which can result from the given formula
     * @param {string} formula      A dice roll formula to minimize
     * @return {Roll}               A Roll instance representing the minimal roll
     */
    static minimize(formula) {
        const rgx = new RegExp(Die.rgx.die, "g");
        formula = formula.replace(rgx, (match, nd, d, mods) => {
            return `(${nd || 1}*1)`;
        });
        return new this(formula).roll();
    }

    /* -------------------------------------------- */

    /**
     * Return the maximum possible Dice roll which can result from the given formula
     * @param {string} formula      A dice roll formula to maximize
     * @return {Roll}               A Roll instance representing the maximal roll
     */
    static maximize(formula) {
        const rgx = new RegExp(Die.rgx.die, "g");
        formula = formula.replace(rgx, (match, nd, d, mods) => {
            return `(${nd || 1}*${d})`;
        });
        return new this(formula).roll();
    }

    /* -------------------------------------------- */

    static simulate(formula, n) {
        let results = [...Array(n)].reduce((arr, v) => {
            let r = new Roll(formula);
            arr.push(r.roll().total);
            return arr;
        }, []);
        let mean = results.reduce((sum, v) => sum += v, 0) / results.length;
        console.log(`Rolled ${formula} ${n} times. Average result: ${mean}`);
        return results;
    }

    /* -------------------------------------------- */
    /*  Saving and Loading
    /* -------------------------------------------- */

    /**
     * Structure the Roll data as an object suitable for JSON stringification
     * @return {Object}     Structured data which can be serialized into JSON
     */
    toJSON() {

        // Structure rolled dice
        const dice = this.dice.map(d => {
            return {
                class: d.constructor.name,
                faces: d.faces,
                rolls: d.rolls,
                formula: d.formula,
                options: d.options
            };
        });

        // Substitute parts
        const parts = this.parts.map(p => {
            if (p instanceof Die) {
                let idx = this.dice.findIndex(d => d === p);
                return "_d" + idx;
            }
            else if (p instanceof DicePool) {
                return p.toJSON();
            }
            return p;
        });

        // Serialize roll equation
        return {
            class: this.constructor.name,
            formula: this.formula,
            dice: dice,
            parts: parts,
            result: this.result,
            total: this.total
        };
    }

    /* -------------------------------------------- */


    /**
     * Recreate a Roll instance using a provided JSON string
     * @param {string} json   Serialized JSON data representing the Roll
     * @return {Roll}         A revived Roll instance
     */
    static fromJSON(json) {
        return this.fromData(JSON.parse(json));
    }

    /* -------------------------------------------- */

    /**
     * Recreate a Roll instance using a provided JSON string
     * @param {Object} data   Unpacked data representing the Roll
     * @return {Roll}         A revived Roll instance
     */
    static fromData(data) {
        if (data.class !== "Roll") throw new Error("Unable to recreate Roll instance from provided data");

        // Create the instance and assign data
        let roll = new this(data.formula);
        roll._result = data.result;
        roll._total = data.total;

        /// Rehydrate Die rolls
        roll._dice = data.dice.map(d => {
            let cls = CONFIG.Dice.types.find(t => d.class === t.name);
            if (!cls) throw new Error(`Unrecognized die type ${d.class}`);
            let die = new cls(d.faces, d.options);
            die.rolls = d.rolls;
            die.formula = d.formula;
            return die;
        });

        // Re-map dice as parts
        roll.parts = data.parts.map(p => {

            // Dice pools
            if (p.class === "DicePool") {
                return DicePool.fromData(p);
            }

            // Dice rolls
            else if ((typeof p === "string") && p.startsWith("_d")) {
                let idx = parseInt(p.slice(2));
                return roll._dice[idx];
            }

            // String parts
            return p;
        });

        roll._rolled = true;
        return roll;
    }
}

/**
 * The base Die class.
 *
 * Each Die instance represents a distinct term in a roll equation which transacts rolls of an die with some number
 * of faces. The Die instance provides controls for rerolling, exploding, counting, or modifying the set of results
 * from the Die.
 *
 * @param {Number} faces    The number of faces for this Die
 *
 * @example
 * // Define a 6-sided die
 * let die = new Die(6);
 *
 * // Roll the die 4 times
 * die.roll(4);
 *
 * // Roll another 2 times, adding the new results to the existing set
 * die.roll(2);
 *
 * // For all 6 of the initial rolls, reroll if any result was a 1
 * die.reroll([1]);
 *
 * // For set of remaining results, roll a bonus die if any result was a 6
 * die.explode([6]);
 *
 * // Count the total number of rolls which was greater than 3
 * die.countSuccess(3, ">");
 *
 * // Display the total number of successes
 * console.log(die.total);
 */
class Die {
    constructor(faces, options = {}) {

        /**
         * The number of faces for this Die
         * @type {Number}
         *
         * @example
         * let die = new Die(6);    // A 6-sided die has six faces
         * console.log(die.faces)   // 6
         */
        this.faces = this._getFaces(faces);

        /**
         * An Array representing the faces of the die
         * @type {Array}
          *
         * @example
         * let die = new Die(6);    // One side for each of the possible faces
         * console.log(die.sides)   // [1,2,3,4,5,6]
         */
        this.sides = (faces instanceof Array) ?
            faces.map(s => parseInt(s)) :
            Array.from(new Array(parseInt(faces))).map((e, i) => i + 1);

        /**
         * Track all dice which have ever been rolled
         * @type {Array}
         *
         * @example
         * let die = new Die(4);
         * die.roll(4);             // Roll 4d4
         * console.log(die.rolls);  // [{...}, {...}, {...}, {...}]
         */
        this.rolls = [];

        /**
         * Any additional options which may be required by the Die
         */
        this.options = options;
    }

    /* -------------------------------------------- */

    /**
     * Track the set of kept results out of all rolls
     * @type {Array}
     *
     * @example
     * let die = new Die(6);
     * die.roll(6);               // Roll 6d6
     * console.log(die.results);  // [6,4,1,2,3,4]
     * die.keepHighest(2);        // Keep the 2 best results
     * console.log(die.results);  // [6,4]
     */
    get results() {
        return this.rolls.filter(r => !r.rerolled && !r.discarded).map(r => {
            if (r.success === true) return 1;
            else if (r.success === false) return 0;
            return r.roll;
        });
    }

    /* -------------------------------------------- */

    /**
     * The sum of all kept results
     * @type {Number}
     *
     * @example
     * let die = new Die(20);
     * die.roll(2);               // Roll 2d20
     * console.log(die.results)   // [6,17]
     * console.log(die.total)     // 23
     */
    get total() {
        const total = this.results.reduce((t, n) => t + n, 0);
        if (this.options.marginSuccess) return total - parseInt(this.options.marginSuccess);
        else if (this.options.marginFailure) return parseInt(this.options.marginFailure) - total;
        return total;
    }

    /* -------------------------------------------- */

    _getFaces(f) {
        if (Number.isFinite(f) && f > 0) return f;
        else throw new Error(`Invalid number of faces ${f} for Die class`);
    }

    /* -------------------------------------------- */

    /**
     * Roll this Die once
     * @return {Number}
     * @private
     */
    _roll() {
        let res = Math.floor(twist.random() * this.sides.length);
        return {
            roll: this.sides[res]
        };
    }

    /* -------------------------------------------- */

    /**
     * Roll the initial set of results for the Die
     * @param {Number} nd     The number of times to roll the die
     * @return {Die}          The updated die containing new rolls
     *
     * @example
     * let die = new Die(6);
     * die.roll(6);               // Roll 6d6
     * console.log(die.results);  // [5,2,4,4,1,6]
     * console.log(die.total);    // 22
     */
    roll(nd) {
        if (nd === 0) return this;
        nd = nd || 1;
        let rolls = [];
        for (let n = 1; n <= nd; n++) {
            rolls.push(this._roll());
        }
        this.rolls = this.rolls.concat(rolls);
        return this;
    }

    /* -------------------------------------------- */

    /**
     * Re-roll any results with results in the provided target set
     * Dice which have already been re-rolled will not be re-rolled again
     * @param {Array} targets       Target results which would trigger a reroll
     * @return {Die}                The updated die containing new rolls
     *
     * @example
     * let die = new Die(4);
     * die.roll(3);               // Roll 3d4
     * console.log(die.results);  // [1,3,4]
     * die.reroll([1,2]);         // Re-roll 1s or 2s
     * console.log(die.results);  // [3,4,2]
     */
    reroll(targets) {
        if (!targets || !targets.length) return this.rolls;

        // Flag dice which are eligible for re-roll
        let eligible = this.rolls.filter(r => {
            if (r.rerolled || r.discarded) return false;
            else if (targets.includes(r.roll)) return r.rerolled = true;
            return false;
        });

        // Roll any eligible dice
        let rolls = eligible.map(r => this._roll());
        this.rolls = this.rolls.concat(rolls);
        return this;
    }

    /* -------------------------------------------- */

    /**
     * Explode the rolls in this set by rolling additional dice for each roll which achieved a certain result
     * Dice which have been re-rolled or have already exploded cannot explode
     * @param {Array} range         The range of target results which would trigger an explode
     * @return {Die}                The updated die containing new rolls
     *
     * @example
     * let die = new Die(8);
     * die.roll(6);               // Roll 6d8
     * console.log(die.results);  // [8,3,6,4,2,7]
     * die.explode([7,8]);        // Explode on 7s and 8s, rolling additional dice
     * console.log(die.results);  // [8,3,6,4,2,7,7,2,3]
     */
    explode(range) {
        if (!range || !range.length || (range.length === this.faces)) return this;

        // Explode until there are no valid results left to explode
        let exploding = true,
            rolls = this.rolls;
        while (exploding) {

            // Get the dice which are eligible to explode
            let eligible = rolls.filter((r, i) => {
                if (r.rerolled || r.discarded || r.exploded) return false;
                if (range.includes(r.roll)) return r.exploded = true;
                return false;
            });

            // Roll any eligible dice
            rolls = eligible.map(r => this._roll());
            exploding = rolls.length > 0;
            this.rolls = this.rolls.concat(rolls);
        }
        return this;
    }

    /* -------------------------------------------- */

    /**
     * Filter the result set, keeping the highest n results in order
     * @param {Number} n    The number of results to keep
     * @return {Die}        The updated die containing new rolls
     *
     * @example
     * let die = new Die(6);
     * die.roll(4);               // Roll 4d6
     * console.log(die.results);  // [6,2,1,5]
     * die.keepHighest(2);        // Keep the best 2 results
     * console.log(die.results);  // [6,5]
     */
    keepHighest(n) {
        let cut = this.results.sort((a, b) => b - a)[n - 1],
            kept = 0;
        let rolls = this.rolls.filter(r => !r.rerolled && !r.discarded);

        // First drop any results that are strictly lower than the cut
        rolls.forEach(r => {
            if (r.roll > cut) ++kept;
            else if (r.roll < cut) r.discarded = true;
        });

        // Next keep ties until we have reached the target
        rolls.filter(r => r.roll === cut).forEach(r => {
            if (kept < n) ++kept;
            else r.discarded = true;
        });
        return this
    }

    /* -------------------------------------------- */

    /**
     * Filter the result set, keeping the lowest n results in order
     * @param {Number} n    The number of results to keep
     * @return {Array}      The filtered results
     *
     * @example
     * let die = new Die(6);
     * die.roll(4);               // Roll 4d6
     * console.log(die.results);  // [6,2,1,5]
     * die.keepLowest(3);         // Kepe the lowest 3 results
     * console.log(die.results);  // [2,1,5]
     */
    keepLowest(n) {
        let cut = this.results.sort((a, b) => a - b)[n - 1],
            kept = 0;
        let rolls = this.rolls.filter(r => !r.rerolled && !r.discarded);

        // First drop any results that are strictly higher than the cut
        rolls.forEach(r => {
            if (r.roll < cut) ++kept;
            else if (r.roll > cut) r.discarded = true;
        });

        // Next keep ties until we have reached the target
        rolls.filter(r => r.roll === cut).forEach(r => {
            if (kept < n) ++kept;
            else r.discarded = true;
        });
        return this;
    }

    /* -------------------------------------------- */

    /**
     * Map results to 0 or 1 depending on whether they match a success condition
     * @param {Number} target     The target result to test against
     * @param {String} operator   The comparison operator against which to test. Default is '>='
     *
     * @example
     * let die = new Die(3);
     * die.roll(6);               // Roll 6d3
     * console.log(die.results);  // [1,3,1,2,2,3]
     * die.countSuccess(3);       // Count the results where a 3 was rolled
     * console.log(die.results);  // [0,1,0,0,0,1]
     * console.log(die.total);    // 2
     */
    countSuccess(target, operator) {
        operator = operator || ">=";
        this.rolls.forEach(r => {
            if (r.rerolled || r.discarded) return;
            if ((operator === '>=') && Number(r.roll >= target)) r.success = true;
            else if ((operator === '>') && Number(r.roll > target)) r.success = true;
            else if ((operator === '=') && Number(r.roll === target)) r.success = true;
            else if ((operator === '<') && Number(r.roll < target)) r.success = true;
            else if ((operator === '<=') && Number(r.roll <= target)) r.success = true;
            else r.success = false;
        });
    }

    /* -------------------------------------------- */

    /**
     * Special Die types may optionally define a tooltip used in lieu of the numeric result
     * @param {Number} result   The rolled die result
     * @private
     */
    _getTooltip(result) {
        return result;
    }

    /* -------------------------------------------- */
    /*  Factory Method                              */
    /* -------------------------------------------- */

    /**
     * Given a string formula, create and return a rolled Die object
     * @param {string} formula    The string formula to parse
     * @return {Die|null}         The rolled Die object if the formula was valid, null otherwise
     */
    static fromFormula(formula) {
        const rgx = formula.match(this.rgx.die);
        if (!rgx) return null;
        let [number, sides, modifiers] = rgx.slice(1);

        // Get die sides
        let cls = this;
        if (/f|F/.test(sides)) cls = FateDie;
        else sides = parseInt(sides);
        if (sides > 10000) throw new Error("You may not roll dice with more than 10000 sides");

        // Get number of dice
        number = Number.isNumeric(number) ? parseInt(number) : 1;
        if (!Number.isFinite(number) || number < 0) throw new Error("Invalid number of rolled dice.");
        if (number > 100) throw new Error("You may not roll more than 100 dice at a time");

        // Create the Die and roll it
        let die = new cls(sides);
        die.roll(number);

        // Apply modifiers
        modifiers = modifiers || "";
        die.applyModifiers(modifiers);
        die.formula = `${number}d${sides}${modifiers.toLowerCase()}`;

        // Return the created and rolled Die
        return die;
    }

    /* -------------------------------------------- */
    /*  Roll Modifiers                              */
    /* -------------------------------------------- */

    /**
     * Apply suffix options and modifiers to the result of this Die roll
     * @param {string} query
     */
    applyModifiers(query) {

        // Step 1 - parse query to an Array of modifiers
        let mods = [];
        if (query) {
            for (let r of Object.values(Die.rgx)) {
                query = query.replace(RegExp(r, "g"), match => match + ";");
            }
            mods = query.split(";").filter(o => o !== "");
        }

        // Step 2 - apply modifiers
        for (let mod of mods) {
            this._applyReroll(mod);
            this._applyExplode(mod);
            this._applyKeepDrop(mod);
            this._applySuccess(mod);
        }

        // Return the modified Die
        return this;
    }

    /* -------------------------------------------- */

    /**
     * Reroll a single die by parsing the option string
     * @private
     */
    _applyReroll(option) {
        let rr = option.match(Die.rgx.reroll);
        if (!rr) return;

        // Determine the reroll range
        let target, nrr = parseInt(rr[2] || 1);
        if (rr[1]) {
            if (rr[1] === "<") target = Array.fromRange(nrr);
            else if (rr[1] === "<=") target = Array.fromRange(nrr).map(n => n + 1);
            else if (rr[1] === ">") target = Array.fromRange(this.faces - nrr).map(n => n + nrr + 1);
            else if (rr[1] === ">=") target = Array.fromRange(this.faces - nrr + 1).map(n => n + nrr);
        }
        else target = [nrr];

        // Reroll the die
        this.reroll(target);
    }

    /* -------------------------------------------- */

    /**
     * Explode a single die by parsing the option string
     * @private
     */
    _applyExplode(option) {
        let ex = option.match(Die.rgx.explode);
        if (!ex) return;
        let operator = ex[1];
        let target = parseInt(ex[2] || this.faces);

        // Define target arrays
        let range = this.sides.filter(s => {
            if (operator === "<") return s < target;
            else if (operator === "<=") return s <= target;
            else if (operator === ">") return s > target;
            else if (operator === ">=") return s >= target;
            return s === target;
        });

        // Explode the die
        this.explode(range);
    }

    /* -------------------------------------------- */

    /**
     * Keep or drop die by parsing the option string
     * @private
     */
    _applyKeepDrop(option) {
        let kd = option.match(Die.rgx.keep);
        if (!kd) return;
        let nr = this.results.length,
            mode = kd[1],
            num = parseInt(kd[2] || 1);

        // Highest
        if (["kh", "dl"].includes(mode)) {
            if (mode === "dl") num = Math.max(nr - num, 1);
            this.keepHighest(num);
        }

        // Lowest
        else if (["kl", "dh"].includes(mode)) {
            if (mode === "dh") num = Math.min(nr - num);
            this.keepLowest(num);
        }
    }

    /* -------------------------------------------- */

    /**
     * Count successes or margin of success
     * @private
     */
    _applySuccess(option) {
        let cs = option.match(Die.rgx.success);
        if (!cs) return;
        let mode = cs[1],
            operator = cs[2],
            target = parseInt(cs[3]);

        // Count successes or failures
        if (["cs", "cf"].includes(mode)) {

            // Flip the operator for counting failures
            if (mode === "cf") {
                operator = {
                    ">=": "<",
                    ">": "<=",
                    "<": ">=",
                    "<=": ">"
                }[operator];
            }

            // Apply the die function
            this.countSuccess(target, operator);
        }

        // Margin of success or failure
        else if (mode === "ms") {
            if ([">", ">=", "=", undefined].includes(operator)) this.options["marginSuccess"] = target;
            else if (["<", "<="].includes(operator)) this.options["marginFailure"] = target;
        }
    }
}


/**
 * Define regular expression option matches for the Die class
 * @type {Object}
 */
Die.rgx = {
    die: new RegExp('([0-9]+)?[dD]([0-9fF]+)([a-z][a-z0-9<=>]+)?'),
    reroll: /r(<=|>=|<|>)?([0-9]+)?/,
    explode: /x(<=|>=|<|>)?([0-9]+)?/,
    keep: /(kh|kl|dh|dl)([0-9]+)?/,
    success: /(cs|cf|ms)(<=?|>=?|=)?([0-9]+)?/,
};