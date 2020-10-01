import { h, JSX, options, render } from "preact";
import { useState } from "preact/hooks";
import type { FunctionComponent } from "preact";
import style from "./LkConfigurator.scss";

import roundedSvg from "./lampokansi-model-1-rounded-corners.svg";
import squareSvg from "./lampokansi-model-3-square.svg";
import circularSvg from "./lampokansi-model-2-circular.svg";
import octagonSvg from "./lampokansi-model-4-octagon.svg";

const SVG_WORDS = {
    sideview: "SIVUKUVA",
    topview: "YLÄKUVA",
    rounding: "KULMIEN PYÖRISTYS",
    dropping: "Helman pituus",
};

const LANG_FI = {
    formTitle: "Lämpökannen suunnittelu",
    poolModelTitle: "Altaan merkki ja malli",
    chooseSelect: "Valitse",
    poolShapeTitle: "Altaan muoto",
    squareSharp: "Neliö terävät kulmat",
    squareRounded: "Neliö pyöristetyt kulmat",
    octagon: "Kahdeksan kulmainen",
    circular: "Pyöreä",
    colorTitle: "Kannen väri",
    colorGray: "Harmaa",
    colorMahogany: "Mahogany",
    colorBurgundy: "Burgundi",
    colorBlack: "Musta",
    insulationTitle: "Eristepaksuus",
    measurementsTitle: "Kannen mitat",
    measurement: "mitta",
    length: "Pituus",
    width: "Leveys",
    rounding: "Kulmien pyöristys",
    dropping: "Helman pituus",
    spacing: "Solkien väli",
    summary: "Yhteenveto",
    addToCart: "Lisää ostoskoriin",
    close: "Sulje",
    sideview: "SIVUKUVA",
    topview: "YLÄKUVA",
    fieldRequired: "Tämä kenttä on pakollinen",
    oneOrMoreErrors:
        "Yhdessä tai useammassa kentässä on virhe. Ole hyvä, korjaa virheet ja yritä uudelleen.",
};

const LANG_EN: typeof LANG_FI = {
    formTitle: "Custom cover designer",
    poolModelTitle: "Pool model and type",
    chooseSelect: "Choose",
    poolShapeTitle: "Shape of the cover",
    squareSharp: "Square sharp corners",
    squareRounded: "Square rounded corners",
    octagon: "Octagon",
    circular: "Circular",
    colorTitle: "Color of the cover",
    colorGray: "Gray",
    colorMahogany: "Mahogany",
    colorBurgundy: "Burgundy",
    colorBlack: "Black",
    insulationTitle: "Insulation type",
    measurementsTitle: "Cover measurements",
    measurement: "value",
    length: "Length",
    width: "Width",
    rounding: "Corner rounding",
    dropping: "Drop height",
    spacing: "Spacing",
    summary: "Summary",
    addToCart: "Add to cart",
    close: "Close",
    sideview: "SIDE VIEW",
    topview: "TOP VIEW",
    fieldRequired: "This field is required",
    oneOrMoreErrors: "One or more of the fields has errors, please fix the errors and try again.",
};

const LANG = document.documentElement.lang == "fi" ? LANG_FI : LANG_EN;

const DEFAULT_PROPS = {
    locale: "",
    closeUrl: "/",
    actionUrl: "",
};

type PoolColor = "" | "gray" | "burgundi" | "mahogany" | "black";

type PoolInsluationWidths =
    | ""
    | "default-60-65"
    | "default-120-90"
    | "hybrid-90-65"
    | "hybrid-120-90";

type PoolShape = "" | "square" | "rounded" | "octagon" | "circular";

function useRadioButton<T>(value: T) {
    const [state, setState] = useState(value);
    const setter = (t: T) => ({
        value: t,
        checked: state === t,
        onChange: () => setState(t),
    });
    return [state, setter] as [typeof state, typeof setter];
}

function getFill(color: PoolColor): string {
    switch (color) {
        case "black":
            return "#1D1D1D";

        case "":
        case "burgundi":
            return "#481E17";

        case "gray":
            return "#848685";

        case "mahogany":
            return "#473B45";
    }
}

const LkConfigurator: FunctionComponent<Partial<typeof DEFAULT_PROPS>> = (propsGiven) => {
    const props = Object.assign({}, DEFAULT_PROPS, propsGiven);
    const [model, setModel] = useState("");
    const [shape, poolShapeRadio] = useRadioButton("" as PoolShape);
    const [showErrors, setShowErrors] = useState(false);
    const [insulationWidth, insulationWidthRadio] = useRadioButton("" as PoolInsluationWidths);
    const [color, colorRadio] = useRadioButton("" as PoolColor);
    const [avalue, setAValue] = useState("");
    const [bvalue, setBValue] = useState("");
    const [cvalue, setCValue] = useState("");
    const [dvalue, setDValue] = useState("");
    const [evalue, setEValue] = useState("");

    const errors = {
        colorRequired: color === "",
        shapeRequired: shape === "",
        insulationWidthRequired: insulationWidth === "",
        avalueRequired: avalue === "",
        bvalueRequired: bvalue === "",
        cvalueRequired: shape === "rounded" && cvalue === "",
        dvalueRequired: dvalue === "",
        evalueRequired: shape !== "circular" && evalue === "",
    };

    const hasErrors = Object.values(errors).some((d) => d == true);

    const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (e) => {
        setShowErrors(true);
        if (hasErrors) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    let svg: string = (() => {
        switch (shape) {
            case "circular":
                return circularSvg;

            case "square":
                return squareSvg;

            case "octagon":
                return octagonSvg;

            case "rounded":
                return roundedSvg;

            case "":
                return squareSvg;
        }
    })();

    svg = svg.replace(/#5A2524/g, getFill(color));
    svg = svg.replace(/'OpenSans'/g, `'Open Sans'`);
    svg = svg.replace(/'OpenSans-Bold'"/g, `'Open Sans'" font-weight="bold"`);
    svg = svg.replace(/'OpenSans-Light'"/g, `'Open Sans'" font-weight="light"`);
    svg = svg.replace(/>A = .*?</g, `>A = ${+avalue} cm<`);
    svg = svg.replace(/>B = .*?</g, `>B = ${+bvalue} cm<`);
    svg = svg.replace(/>C = .*?</g, `>C = ${+cvalue} cm<`);
    svg = svg.replace(/>D = .*?</g, `>D = ${+dvalue} cm<`);
    svg = svg.replace(/>E = .*?</g, `>E = ${+evalue} cm<`);
    svg = svg.replace(SVG_WORDS.topview, LANG.topview);
    svg = svg.replace(SVG_WORDS.sideview, LANG.sideview);
    svg = svg.replace(SVG_WORDS.dropping, LANG.dropping);
    svg = svg.replace(SVG_WORDS.rounding, LANG.rounding.toUpperCase());

    return (
        <div class="lk-wrapper">
            <style>{style}</style>
            <div class="lk-image" dangerouslySetInnerHTML={{ __html: svg }}></div>
            <form
                action={props.actionUrl}
                method="POST"
                class="newui lk-configurator"
                onSubmit={onSubmit}
            >
                <h2>{LANG.formTitle}</h2>

                <label class="form-row">
                    <h3 class="no-border">
                        <span class="n">1</span> {LANG.poolModelTitle}
                    </h3>
                    <select
                        name="pool_model"
                        id=""
                        class=""
                        value={model}
                        onChange={(e) => setModel(e.currentTarget.value)}
                    >
                        <option value="">{LANG.chooseSelect}</option>
                        <option value="foo">Foo</option>
                    </select>
                </label>

                <div class="form-row choose-shape">
                    <h3 class="text">
                        <span class="n">2</span> {LANG.poolShapeTitle}
                    </h3>
                    {showErrors && errors.shapeRequired && (
                        <p class="error">{LANG.fieldRequired}</p>
                    )}
                    <div class="shapes">
                        <label class="shape">
                            <input type="radio" name="pool_shape" {...poolShapeRadio("square")} />
                            <svg viewBox="0 0 100 100">
                                <rect x="2" y="2" width="96" height="96" />
                            </svg>
                            <span class="text">{LANG.squareSharp}</span>
                        </label>
                        <label class="shape">
                            <input type="radio" name="pool_shape" {...poolShapeRadio("rounded")} />
                            <svg viewBox="0 0 100 100">
                                <rect x="2" y="2" width="96" height="96" rx="20" />
                            </svg>
                            <span class="text">{LANG.squareRounded}</span>
                        </label>
                        <label class="shape">
                            <input type="radio" name="pool_shape" {...poolShapeRadio("octagon")} />
                            <svg viewBox="10 10 80 80">
                                <polygon points="34.2,87.4 12.3,65.5 12.3,34.5 34.2,12.6 65.2,12.6 87.1,34.5 87.1,65.5 65.2,87.4" />
                            </svg>
                            <span class="text">{LANG.octagon}</span>
                        </label>
                        <label class="shape">
                            <input type="radio" name="pool_shape" {...poolShapeRadio("circular")} />
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" />
                            </svg>
                            <span class="text">{LANG.circular}</span>
                        </label>
                    </div>
                </div>

                <div class="form-row choose-color">
                    <h3 class="text">
                        <span class="n">3</span> {LANG.colorTitle}
                    </h3>
                    {showErrors && errors.colorRequired && (
                        <p class="error">{LANG.fieldRequired}</p>
                    )}
                    <div class="shapes">
                        <label class="shape">
                            <input type="radio" name="pool_color" {...colorRadio("gray")} />
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="#fff" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill={getFill("gray")}
                                    stroke="none"
                                />
                            </svg>
                            <span class="text">{LANG.colorGray}</span>
                        </label>
                        <label class="shape">
                            <input type="radio" name="pool_color" {...colorRadio("mahogany")} />
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="#fff" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill={getFill("mahogany")}
                                    stroke="none"
                                />
                            </svg>
                            <span class="text">{LANG.colorMahogany}</span>
                        </label>
                        <label class="shape">
                            <input type="radio" name="pool_color" {...colorRadio("burgundi")} />
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="#fff" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill={getFill("burgundi")}
                                    stroke="none"
                                />
                            </svg>
                            <span class="text">{LANG.colorBurgundy}</span>
                        </label>
                        <label class="shape">
                            <input type="radio" name="pool_color" {...colorRadio("black")} />
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="#fff" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill={getFill("black")}
                                    stroke="none"
                                />
                            </svg>
                            <span class="text">{LANG.colorBlack}</span>
                        </label>
                    </div>
                </div>

                <div class="form-row insulationwidth">
                    <h3 class="text">
                        <span class="n">4</span> {LANG.insulationTitle}
                    </h3>

                    {showErrors && errors.insulationWidthRequired && (
                        <p class="error">{LANG.fieldRequired}</p>
                    )}
                    <div class="table">
                        <label class="form-row">
                            <span class="input">
                                <input
                                    type="radio"
                                    name="pool_insulationwidth"
                                    {...insulationWidthRadio("default-60-65")}
                                />
                            </span>
                            <span class="text1">Vakio</span>
                            <span class="text2">60–65mm</span>
                            <span class="price">499 €</span>
                        </label>
                        <label class="form-row">
                            <input
                                type="radio"
                                name="pool_insulationwidth"
                                {...insulationWidthRadio("default-120-90")}
                            />
                            <span class="text1">Vakio</span>
                            <span class="text2">120–90mm</span>
                            <span class="price">599 €</span>
                        </label>
                        <label class="form-row">
                            <input
                                type="radio"
                                name="pool_insulationwidth"
                                {...insulationWidthRadio("hybrid-90-65")}
                            />
                            <span class="text1">Hybrid</span>
                            <span class="text2">90–65mm</span>
                            <span class="price">699 €</span>
                        </label>
                        <label class="form-row">
                            <input
                                type="radio"
                                name="pool_insulationwidth"
                                {...insulationWidthRadio("hybrid-120-90")}
                            />
                            <span class="text1">Hybrid</span>
                            <span class="text2">120–90mm</span>
                            <span class="price">699 €</span>
                        </label>
                    </div>
                </div>

                <h3>
                    <span class="n">5</span> {LANG.measurementsTitle}
                </h3>
                <div class="measurements">
                    <label class="form-row">
                        <span class="before-text">
                            {LANG.length} (A-{LANG.measurement})
                            {showErrors && errors.avalueRequired && (
                                <span class="error">{LANG.fieldRequired}</span>
                            )}
                        </span>
                        <input
                            type="number"
                            name="length"
                            min="0"
                            value={avalue}
                            onChange={(e) => setAValue(e.currentTarget.value)}
                        />
                        <span class="after-text">cm</span>
                    </label>
                    <label class="form-row">
                        <span class="before-text">
                            {LANG.width} (B-{LANG.measurement})
                            {showErrors && errors.bvalueRequired && (
                                <span class="error">{LANG.fieldRequired}</span>
                            )}
                        </span>
                        <input
                            type="number"
                            name="width"
                            min="0"
                            value={bvalue}
                            onChange={(e) => setBValue(e.currentTarget.value)}
                        />
                        <span class="after-text">cm</span>
                    </label>
                    {shape === "rounded" && (
                        <label class="form-row">
                            <span class="before-text">
                                {LANG.rounding} (C-{LANG.measurement})
                                {showErrors && errors.cvalueRequired && (
                                    <span class="error">{LANG.fieldRequired}</span>
                                )}
                            </span>
                            <input
                                type="number"
                                name="rounding"
                                min="0"
                                value={cvalue}
                                onChange={(e) => setCValue(e.currentTarget.value)}
                            />
                            <span class="after-text">cm</span>
                        </label>
                    )}

                    <label class="form-row">
                        <span class="before-text">
                            {LANG.dropping} (D-{LANG.measurement})
                            {showErrors && errors.dvalueRequired && (
                                <span class="error">{LANG.fieldRequired}</span>
                            )}
                        </span>
                        <input
                            type="number"
                            name="dropping"
                            min="0"
                            value={dvalue}
                            onChange={(e) => setDValue(e.currentTarget.value)}
                        />
                        <span class="after-text">cm</span>
                    </label>

                    {shape !== "circular" && (
                        <label class="form-row">
                            <span class="before-text">
                                {LANG.spacing} (E-{LANG.measurement})
                                {showErrors && errors.evalueRequired && (
                                    <span class="error">{LANG.fieldRequired}</span>
                                )}
                            </span>
                            <input
                                type="number"
                                name="dropping"
                                min="0"
                                value={evalue}
                                onChange={(e) => setEValue(e.currentTarget.value)}
                            />
                            <span class="after-text">cm</span>
                        </label>
                    )}
                </div>

                {/*                     
                <div class="summary">
                    <h3 class="assistive-text">{LANG.summary}</h3>
                    <table class="lk-summary-table">
                        <tbody>
                            <tr>
                                <td>Suunniteltu lämpökansi</td>
                                <td>
                                    <div class="unit-price" />
                                </td>
                            </tr>
                            <tr>
                                <td>Toimituskulut</td>
                                <td>
                                    <div class="shipping-price" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Yhteensä</strong>
                                </td>
                                <td>
                                    <strong class="total-price" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}

                <div class="actions">
                    <button type="submit">{LANG.addToCart}</button>
                </div>

                {showErrors && hasErrors && <p class="error">{LANG.oneOrMoreErrors}</p>}
            </form>

            <a class="close" href={props.closeUrl}>
                <span class="assistive-text">{LANG.close}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" />
                </svg>
            </a>
        </div>
    );
};

export const create = function (props: Partial<typeof DEFAULT_PROPS>, root: Element | ShadowRoot) {
    if ("attachShadow" in root) {
        root = root.attachShadow({ mode: "open" });
    }
    render(h(LkConfigurator, props, []), root);
};
