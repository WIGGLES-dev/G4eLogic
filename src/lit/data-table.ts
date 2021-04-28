import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators";
import { unsafeHTML } from "lit/directives/unsafe-html";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";
import { capitalize } from "@utils/strings";
import { observe } from "@utils/lit-directives";
import { Observable } from "rxjs";
import { State } from "rxdeep";
import { map, pluck } from "rxjs/operators";
import { getValueAtPath, Path, updateValueAtPath } from "@utils/path";
import { Tree, TreeHash } from "@utils/tree";
import { v4 } from "uuid";

type EntityTypes = "skill" | "technique" | "spell" | "trait" | "equipment"
type Options = [value: string, label?: string][]
type CellType = "number" | "text" | "checkbox" | Options | "textarea" | "contenteditable" | "processed" | ((value: any, path: Readonly<Path>) => TemplateResult)
type CellShorthand = Readonly<[type: CellType, path: Readonly<Path>, project?: (v) => any, toggle?: boolean]>;
type Cell = CellShorthand;
const pathConverter = {
    fromAttribute(path: string) { return path.split(".") },
    toAttribute(path: string[]) { return path.join(".") }
}
@customElement("data-table")
export class DataTable extends LitElement {
    @property({ type: String })
    type: EntityTypes
    @property({ type: String })
    display: 'row' | 'card' = 'row'
    @property({ type: Number })
    main: number
    @property({ type: String })
    persist: 'indexeddb' | 'localstorage' | 'sessionstorage' = "indexeddb"
    @property({ attribute: false })
    data: Record<string, any>
    @property({ attribute: false })
    processed: Record<string, any>
    @property({ converter: pathConverter })
    togglePath: string[] = ["showingChildren"]
    @property({ converter: pathConverter })
    containerPath: string[] = ["isContainer"]
    @property({ converter: pathConverter })
    branchpath: string[] = ["children"]
    @property({ converter: pathConverter })
    idpath: string[] = ["id"]
    @property({ type: Number })
    maxDepth: number = Number.POSITIVE_INFINITY
    @property({ type: Boolean })
    showCollapsed: boolean = false
    @property({ attribute: false })
    filter: Record<string, any> = {}
    constructor() {
        super();
        this.addEventListener('dragstart', this._handleDragstart);
        this.addEventListener('dragover', this._handleDragover);
        this.addEventListener('dragenter', this._handleDragenter);
        this.addEventListener('drop', this._handleDrop);
        this.addEventListener('dragend', this._handleDragend);
        this.addEventListener('click', this._handleClick);
        this.addEventListener('change', this._handleCellChange)
    }
    static styles = [
        css`
            td>* {
                display: inline-block;
            }
        `
    ]
    private static _headers = {
        "skill": [
            "Skill",
            "Specialization",
            "Signature",
            "Difficulty",
            "Points",
            "Mod",
            "RSL",
            "Level",
            "Reference"
        ],
        "technique": [
            "Technique",
            "Difficulty",
            "Points",
            "Mode",
            "Level",
            "Reference"
        ],
        "spell": [
            "Spell",
            "Signature",
            "Difficulty",
            "Points",
            "Mod",
            "RSL",
            "Level",
            "Resist",
            "Spell Class",
            "Casting Cost",
            "Maintenance Cost",
            "Casting Time",
            "Duration",
            "Reference"
        ],
        "traits": [
            "Traits",
            "Level",
            "Points",
            "Reference"
        ],
        "equipment": [
            "E",
            "#",
            "Equipment",
            "Uses",
            "MaxUses",
            "Value",
            "Weight",
            "EValue",
            "EWeight",
            "Reference"
        ]
    }

    get _menus() {
        const edit = {

        }
        const makeContainer = {

        }
        const remove = {

        }
        const addChild = {

        }
        return {

        }
    }

    get _setups(): Record<string, Cell[]> {
        const to3 = v => +v.toFixed(3);

        const name = ["contenteditable", ["name"]] as const;
        const enabled = ["checkbox", ["enabled"]] as const;
        const reference = ["contenteditable", ["reference"]] as const;

        const specialization = ["contenteditable", ["specialization"]] as const;
        const signature = [this._signatureOptions, ["signature"]] as const;
        const difficulty = [DataTable._difficultyOptions, ["difficulty"]] as const;
        const points = ["number", ["points"]] as const;
        const mod = ["number", ["mod"]] as const;
        const rsl = ["processed", ["relativeLevel"], Math.floor] as const;
        const level = ["processed", ["level"], Math.floor] as const;

        const quantity = ["number", ["quantity"]] as const;
        const uses = ["number", ["uses"]] as const;
        const maxUses = ["number", ["maxUses"]] as const
        const value = ["number", ["value"]] as const;
        const weight = ["number", ["weight"]] as const;
        const eValue = ["processed", ["containedValue"], to3] as const;
        const eWeight = ["processed", ["containedWeight"], to3] as const;
        const traitLevel = ["number", ["level"]] as const;
        const traitCost = ["processed", ["adjustedPoints"]] as const;

        const resist = ["contenteditable", ["resists"]] as const;
        const spellClass = ["contenteditable", ["spellClass"]] as const;
        const castingCost = ["contenteditable", ["castingCost"]] as const;
        const maintenanceCost = ["contenteditable", ["maintenanceCost"]] as const;
        const castingTime = ["contenteditable", ["castingTime"]] as const;
        const duration = ["contenteditable", ["duration"]] as const;

        return {
            "skill": [
                [...name, undefined, true],
                specialization,
                signature,
                difficulty,
                points,
                mod,
                rsl,
                level,
                reference
            ],
            "technique": [
                [...name, undefined, true],
                difficulty,
                points,
                mod,
                level,
                reference
            ],
            "spell": [
                [...name, undefined, true],
                signature,
                difficulty,
                points,
                mod,
                rsl,
                level,
                resist,
                spellClass,
                castingCost,
                maintenanceCost,
                castingTime,
                duration,
                reference
            ],
            "equipment": [
                enabled,
                quantity,
                [...name, undefined, true],
                uses,
                maxUses,
                value,
                weight,
                eValue,
                eWeight,
                reference
            ],
            "trait": [
                [...name, undefined, true],
                traitLevel,
                traitCost,
                reference
            ]
        }
    }
    private static _difficultyOptions: Options = [
        ["E"],
        ["A"],
        ["H"],
        ["VH"],
        ["W"]
    ]
    private _signatureOptions: Options = []
    private _renderOptions(options: Options) {
        return options?.map(([value, label = value]) => html`
            <option value=${value}>${label}</option>
        `)
    }
    addItem(id: string) {

    }
    removeItem(id: string) {

    }
    private _dispatchCellChange(id: string, path: Path, value) {
        const event = new CustomEvent("cellchange", {
            detail: {
                id,
                path,
                value
            },
            bubbles: false,
            composed: true
        });
        this.dispatchEvent(event);
    }
    private _handleCellChange(e: Event) {
        if (e.target instanceof HTMLElement) {
            const { path, type } = e.target.dataset;
            const { id } = e.target.closest(`[data-id]`)?.["dataset"] ?? {}
            let value
            if (e.target instanceof HTMLInputElement) {
                const type = e.target.getAttribute("type");
                if (type === "number") {
                    value = +e.target.value;
                } else if ("checkbox") {
                    value = e.target.checked
                } else {
                    value = e.target.value;
                }
            } else {
                const contenteditable = e.target.isContentEditable;
                if (contenteditable) {
                    value = e.target.innerHTML;
                } else {

                }
            }
            this._dispatchCellChange(id, path.split("."), value);
        }
    }
    private _handleDragstart(e: DragEvent) {
        if (e.target instanceof HTMLElement) {
            if (e.target) {
                const row = e.target.closest<HTMLTableRowElement>(`[data-toggle]`);
                const { id } = row.dataset;
                e.dataTransfer.setData("text/plain", JSON.stringify({ id, type: this.type }));
            }
        }
    }
    private _handleDragover(e: DragEvent) {
        e.preventDefault();
    }
    private _handleDragenter(e: DragEvent) {
        e.preventDefault();
    }
    private _handleDrop(e: DragEvent) {

    }
    private _handleDragend(e: DragEvent) {

    }
    private _handleClick(e: MouseEvent) {
        if (e.target instanceof HTMLElement) {

        }
    }
    private _renderCell(id, type, path: Readonly<Path>, project = (v) => v, toggle = false) {
        const value = getValueAtPath(this.data, path);
        let control: TemplateResult;
        if (type instanceof Array) {
            control = html`
                <select value=${value}>
                    ${this._renderOptions(type)}
                </select>
            `
        } else if (type === "textarea") {
            control = html`
                <textarea value=${value}></textarea>
            `
        } else if (type === "contenteditable") {
            control = html`
                <div contenteditable="true" .innerHTML=${value}></div>
            `
        } else if (type === "processed") {
            const value = getValueAtPath(this.processed?.[id], path);
            control = html`
                <output>${value}</output>
            `
        } else if (typeof type === "string") {
            control = html`
                <input type=${type} value=${value} .checked=${value} />
            `
        } else if (type === "function") {
            control = type(state)
        }
        return html`
            <td
                data-type=${type}
                data-path=${path.join(".")}
                class=""
            >
               ${toggle ? html`<toggle-switch></toggle-switch>` : undefined} ${control}
            </td>
        `
    }
    private _renderHeader(labels: string[]) {
        const headers = labels?.map(header => html`<th>${header}</th>`)
        return html`
            <tr>
                ${headers}
            </tr>
        `
    }
    private _renderTable() {
        const header = this._renderHeader(DataTable._headers[this.type]);
        const hash = Tree.hash(this.data, this.branchpath, this.idpath, this.filter);
        const rows = Object.values(hash.ids).map(id => this._renderRow(id, hash.pathMap[id], hash.depthMap[id], this._setups[this.type]))
        return html`
            <table>
                <caption>
                    <slot name="caption"></slot>
                </caption>
                <thead>
                    <slot name="thead">${header}</slot>
                </thead>
                <tbody>${rows}</tbody>
                <tfoot>
                    <slot name="tfoot"></slot>
                </tfoot>
            </table>
        `
    }
    private _renderRow(id: string, rowPath: Path, indent: number, cells: Cell[]) {
        const tds = cells.map(([type, cellPath, project, toggle]) => this._renderCell(id, type, [...rowPath, ...cellPath], project, toggle))
        return html`
            <tr
                data-id=${id}
            >
                ${tds}
            </tr>
        `
    }
    private _renderCard() { }
    render() {
        const table = this._renderTable();
        console.log(table);
        return table;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "data-table": DataTable,
    }
}