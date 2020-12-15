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
    settingsFromModel: "Arvoja ei voi muuttaa, ne tulevat mallin tiedoista",
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
    incorners: "Soljet kulmissa",
    summary: "Yhteenveto",
    addToCart: "Lisää ostoskoriin",
    close: "Sulje",
    sideview: "SIVUKUVA",
    topview: "YLÄKUVA",
    fieldRequired: "Tämä kenttä on pakollinen",
    fieldMeasurementsFail: "Yhdessä tai useammassa mittakentässä on virheitä",
    oneOrMoreErrors:
        "Yhdessä tai useammassa kentässä on virhe. Ole hyvä, korjaa virheet ja yritä uudelleen.",
};

const LANG_EN: typeof LANG_FI = {
    settingsFromModel: "Values can't be changed, they are defined in the model",
    formTitle: "Custom cover designer",
    poolModelTitle: "Pool brand and model",
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
    incorners: "Spacing equals length",
    summary: "Summary",
    addToCart: "Add to cart",
    close: "Close",
    sideview: "SIDE VIEW",
    topview: "TOP VIEW",
    fieldRequired: "This field is required",
    fieldMeasurementsFail: "One or more measurements has errors",
    oneOrMoreErrors: "One or more of the fields has errors, please fix the errors and try again.",
};

const LANG = document.documentElement.lang == "fi" ? LANG_FI : LANG_EN;

const DEFAULT_PROPS = {
    locale: "",
    closeUrl: "/",
    actionUrl: "",
    modelChoices: [] as ModelChoice[],
    insulationChoices: [] as {
        id: string;
        text: string;
        text2: string;
        price: string;
    }[],
};

type ModelChoice = {
    brand: string;
    model: string;
    shape: PoolShape;
    avalue: number;
    bvalue: number;
    cvalue: number;
    dvalue: number;
    evalue: number;
    incorners: boolean;
};

type PoolColor = "" | "gray" | "burgundi" | "mahogany" | "black";

type PoolShape = "" | "square" | "rounded" | "octagon" | "circular";

function useRadioButton<T>(value: T) {
    const [state, setState] = useState(value);
    const setter = (t: T) => ({
        value: t,
        // checked: state === t,
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

function getShapeSvg(shape: PoolShape) {
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
}

function getShapeName(shape: PoolShape) {
    switch (shape) {
        case "circular":
            return LANG.circular;

        case "square":
            return LANG.squareSharp;

        case "octagon":
            return LANG.octagon;

        case "rounded":
            return LANG.squareRounded;

        case "":
            return "";
    }
}

function getColorName(shape: PoolColor) {
    switch (shape) {
        case "black":
            return LANG.colorBlack;

        case "burgundi":
            return LANG.colorBurgundy;

        case "gray":
            return LANG.colorGray;

        case "mahogany":
            return LANG.colorMahogany;

        case "":
            return "";
    }
}

const LkConfigurator: FunctionComponent<Partial<typeof DEFAULT_PROPS>> = (propsGiven) => {
    const props = Object.assign({}, DEFAULT_PROPS, propsGiven);
    const [model, setModel] = useState<null | [number, ModelChoice]>(null);
    let [shape, poolShapeRadio] = useRadioButton("" as PoolShape);
    const [showErrors, setShowErrors] = useState(false);

    // const [insulationWidth, insulationWidthRadio] = useRadioButton("" as PoolInsluationWidths);

    const [insulationChoiceId, insulationChoiceRadio] = useRadioButton("");
    const insulationChoice = props.insulationChoices.find((f) => f.id === insulationChoiceId);
    const [color, colorRadio] = useRadioButton("" as PoolColor);
    let [avalue, setAValue] = useState("");
    let [bvalue, setBValue] = useState("");
    let [cvalue, setCValue] = useState("");
    let [dvalue, setDValue] = useState("");
    let [evalue, setEValue] = useState("");
    let [inCorners, setInCorners] = useState(false);
    if (model) {
        shape = model[1].shape;
        avalue = "" + model[1].avalue;
        bvalue = "" + model[1].bvalue;
        cvalue = "" + model[1].cvalue;
        dvalue = "" + model[1].dvalue;
        evalue = "" + model[1].evalue;
        inCorners = model[1].incorners;
    }

    let hasCorners = shape === "" || shape === "rounded" || shape === "square";
    let showSpacingField = shape !== "circular";
    if (inCorners && hasCorners) {
        showSpacingField = false;
        evalue = avalue;
    }
    const errors = {
        colorRequired: color === "",
        shapeRequired: shape === "",
        insulationWidthRequired: insulationChoiceId === "",
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
        } else {
        }
    };

    let svg: string = getShapeSvg(shape);

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

    const Atext = `${LANG.length} (A-${LANG.measurement})`;
    const Btext = `${LANG.width} (B-${LANG.measurement})`;
    const Ctext = `${LANG.rounding} (C-${LANG.measurement})`;
    const Dtext = `${LANG.dropping} (D-${LANG.measurement})`;
    const Etext = `${LANG.spacing} (E-${LANG.measurement})`;

    const text = `
        ${model !== null ? `${LANG.poolModelTitle}: ${model[1].brand}: ${model[1].model}` : ""}
        ${LANG.poolShapeTitle}: ${getShapeName(shape)}
        ${LANG.colorTitle}: ${getColorName(color)}
        ${LANG.insulationTitle}: ${insulationChoice?.text} ${insulationChoice?.text2} ${
        insulationChoice?.price
    }
        ${LANG.measurementsTitle}:
        ${Atext}: ${avalue} cm
        ${Btext}: ${bvalue} cm
        ${(shape === "rounded" && `${Ctext}: ${cvalue} cm`) || ""}    
        ${Dtext}: ${dvalue} cm
        ${(hasCorners && !inCorners && `${Etext}: ${evalue} cm`) || ""}
        ${(hasCorners && inCorners && LANG.incorners) || ""}
    `
        .replace("        ", "")
        .replace("\r\n\r\n", "\r\n")
        .replace("\n\n", "\n");

    let sectionNumber = 1;

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
                {props.modelChoices.length > 0 && (
                    <label class="form-row">
                        <h3>
                            <span class="n">{sectionNumber++}</span> {LANG.poolModelTitle}
                        </h3>
                        <select
                            name="pool_model"
                            id=""
                            class=""
                            value={"" + (model && model[0])}
                            onChange={(e) => {
                                let m = +e.currentTarget.value;
                                if (e.currentTarget.value == "") {
                                    setModel(null);
                                } else if (typeof props.modelChoices[m] !== "undefined") {
                                    setModel([m, props.modelChoices[m]]);
                                } else {
                                    setModel(null);
                                }
                            }}
                        >
                            <option value="">{LANG.chooseSelect}</option>
                            {props.modelChoices.map((f, index) => (
                                <option value={index}>
                                    {f.brand}: {f.model}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                <div class="form-row choose-shape">
                    <h3 class="text">
                        <span class="n">{sectionNumber++}</span> {LANG.poolShapeTitle}
                    </h3>
                    {showErrors && errors.shapeRequired && (
                        <p class="error">{LANG.fieldRequired}</p>
                    )}
                    <div class="shapes">
                        <label class="shape">
                            <input
                                type="radio"
                                name="pool_shape"
                                disabled={model !== null}
                                checked={shape == "square"}
                                {...poolShapeRadio("square")}
                            />
                            <svg viewBox="0 0 100 100">
                                <rect x="2" y="2" width="96" height="96" />
                            </svg>
                            <span class="text">{getShapeName("square")}</span>
                        </label>
                        <label class="shape">
                            <input
                                type="radio"
                                name="pool_shape"
                                disabled={model !== null}
                                checked={shape == "rounded"}
                                {...poolShapeRadio("rounded")}
                            />
                            <svg viewBox="0 0 100 100">
                                <rect x="2" y="2" width="96" height="96" rx="20" />
                            </svg>
                            <span class="text">{getShapeName("rounded")}</span>
                        </label>
                        <label class="shape">
                            <input
                                type="radio"
                                name="pool_shape"
                                disabled={model !== null}
                                checked={shape == "octagon"}
                                {...poolShapeRadio("octagon")}
                            />
                            <svg viewBox="10 10 80 80">
                                <polygon points="34.2,87.4 12.3,65.5 12.3,34.5 34.2,12.6 65.2,12.6 87.1,34.5 87.1,65.5 65.2,87.4" />
                            </svg>
                            <span class="text">{getShapeName("octagon")}</span>
                        </label>
                        <label class="shape">
                            <input
                                type="radio"
                                name="pool_shape"
                                disabled={model !== null}
                                checked={shape == "circular"}
                                {...poolShapeRadio("circular")}
                            />
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" />
                            </svg>
                            <span class="text">{getShapeName("circular")}</span>
                        </label>
                    </div>
                </div>
                <div class="form-row choose-color">
                    <h3 class="text">
                        <span class="n">{sectionNumber++}</span> {LANG.colorTitle}
                    </h3>
                    {showErrors && errors.colorRequired && (
                        <p class="error">{LANG.fieldRequired}</p>
                    )}
                    <div class="shapes">
                        <label class="shape">
                            <input
                                type="radio"
                                name="pool_color"
                                checked={color === "gray"}
                                {...colorRadio("gray")}
                            />
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
                            <span class="text">{getColorName("gray")}</span>
                        </label>
                        <label class="shape">
                            <input
                                type="radio"
                                name="pool_color"
                                checked={color === "mahogany"}
                                {...colorRadio("mahogany")}
                            />
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
                            <span class="text">{getColorName("mahogany")}</span>
                        </label>
                        <label class="shape">
                            <input
                                type="radio"
                                name="pool_color"
                                checked={color === "burgundi"}
                                {...colorRadio("burgundi")}
                            />
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
                            <span class="text">{getColorName("burgundi")}</span>
                        </label>
                        <label class="shape">
                            <input
                                type="radio"
                                name="pool_color"
                                checked={color === "black"}
                                {...colorRadio("black")}
                            />
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
                            <span class="text">{getColorName("black")}</span>
                        </label>
                    </div>
                </div>
                <div class="form-row insulationwidth">
                    <h3 class="text">
                        <span class="n">{sectionNumber++}</span> {LANG.insulationTitle}
                    </h3>

                    {showErrors && errors.insulationWidthRequired && (
                        <p class="error">{LANG.fieldRequired}</p>
                    )}
                    <div class="table">
                        {props.insulationChoices.map((c) => (
                            <label class="form-row">
                                <span class="input">
                                    <input
                                        type="radio"
                                        name="pool_insulationChoice"
                                        checked={c.id == insulationChoice?.id}
                                        {...insulationChoiceRadio(c.id)}
                                    />
                                </span>
                                <span class="text1">{c.text}</span>
                                <span class="text2">{c.text2}</span>
                                <span class="price">{c.price}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <h3>
                    <span class="n">{sectionNumber++}</span> {LANG.measurementsTitle}
                </h3>
                {model && <p class="note">{LANG.settingsFromModel}</p>}
                {showErrors &&
                    (errors.avalueRequired ||
                        errors.bvalueRequired ||
                        errors.cvalueRequired ||
                        errors.dvalueRequired ||
                        errors.evalueRequired) && <p class="error">{LANG.fieldMeasurementsFail}</p>}
                <div class="measurements">
                    <label class="form-row">
                        <span class="before-text">
                            {Atext}
                            {/* {showErrors && errors.avalueRequired && (
                                <span class="error">{LANG.fieldRequired}</span>
                            )} */}
                        </span>
                        <input
                            type="number"
                            name="shape_length"
                            min="0"
                            value={avalue}
                            disabled={model !== null}
                            onChange={(e) => setAValue(e.currentTarget.value)}
                        />
                        <span class="after-text">cm</span>
                    </label>
                    <label class="form-row">
                        <span class="before-text">
                            {Btext}
                            {/* {showErrors && errors.bvalueRequired && (
                                <span class="error">{LANG.fieldRequired}</span>
                            )} */}
                        </span>
                        <input
                            type="number"
                            name="shape_width"
                            min="0"
                            value={bvalue}
                            disabled={model !== null}
                            onChange={(e) => setBValue(e.currentTarget.value)}
                        />
                        <span class="after-text">cm</span>
                    </label>
                    {shape === "rounded" && (
                        <label class="form-row">
                            <span class="before-text">
                                {Ctext}
                                {/* {showErrors && errors.cvalueRequired && (
                                    <span class="error">{LANG.fieldRequired}</span>
                                )} */}
                            </span>
                            <input
                                type="number"
                                name="shape_rounding"
                                min="0"
                                value={cvalue}
                                disabled={model !== null}
                                onChange={(e) => setCValue(e.currentTarget.value)}
                            />
                            <span class="after-text">cm</span>
                        </label>
                    )}

                    <label class="form-row">
                        <span class="before-text">
                            {Dtext}
                            {/* {showErrors && errors.dvalueRequired && (
                                <span class="error">{LANG.fieldRequired}</span>
                            )} */}
                        </span>
                        <input
                            type="number"
                            name="shape_dropping"
                            min="0"
                            value={dvalue}
                            disabled={model !== null}
                            onChange={(e) => setDValue(e.currentTarget.value)}
                        />
                        <span class="after-text">cm</span>
                    </label>

                    {showSpacingField && (
                        <label class="form-row">
                            <span class="before-text">
                                {LANG.spacing} (E-{LANG.measurement})
                                {/* {showErrors && errors.evalueRequired && (
                                    <span class="error">{LANG.fieldRequired}</span>
                                )} */}
                            </span>
                            <input
                                type="number"
                                name="shape_spacing"
                                min="0"
                                value={evalue}
                                disabled={model !== null}
                                onChange={(e) => setEValue(e.currentTarget.value)}
                            />
                            <span class="after-text">cm</span>
                        </label>
                    )}
                </div>{" "}
                {hasCorners && (
                    <label class="form-row checkbox">
                        <span class="input">
                            <input
                                type="checkbox"
                                disabled={model !== null}
                                checked={!!inCorners}
                                onChange={(e) => {
                                    setInCorners(!inCorners);
                                    e.preventDefault();
                                }}
                            />
                        </span>
                        <span class="text">{LANG.incorners}</span>
                    </label>
                )}
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
                <input type="hidden" name="pool_as_text" value={text} />
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
