import { h, render } from "preact";
import { useState } from "preact/hooks";
import type { FunctionComponent } from "preact";
import style from "./LkConfigurator.scss";

import roundedSvg from "./lampokansi-model-1-rounded-corners.svg";
import squareSvg from "./lampokansi-model-3-square.svg";
import circularSvg from "./lampokansi-model-2-circular.svg";
import octagonSvg from "./lampokansi-model-4-octagon.svg";

const DEFAULT_PROPS = {
    locale: "",
    shareUrl: window.location.href,
    shareTitle: "",
    useFacebook: true,
    useTwitter: true,
    useWhatsapp: true,
    useLink: true,
    useEmail: true,
    useLinkedin: false,
    textShare: "",
    textCopy: "",
    css: "",
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
    const [model, setModel] = useState("");
    const [shape, poolShapeRadio] = useRadioButton("" as PoolShape);
    const [insulationWidth, insulationWidthRadio] = useRadioButton("" as PoolInsluationWidths);
    const [color, colorRadio] = useRadioButton("" as PoolColor);
    const [avalue, setAValue] = useState("200");
    const [bvalue, setBValue] = useState("200");
    const [cvalue, setCValue] = useState("100");
    const [dvalue, setDValue] = useState("10");
    const [evalue, setEValue] = useState("150");

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

    return (
        <div class="lk-wrapper">
            <style>{style}</style>
            <div class="lk-image" dangerouslySetInnerHTML={{ __html: svg }}></div>
            <form class="newui lk-configurator">
                <h2>Lämpökannen suunnittelu</h2>

                <label class="form-row">
                    <h3 class="no-border">
                        <span class="n">1</span> Altaan merkki ja malli
                    </h3>
                    <select
                        name="pool_model"
                        id=""
                        class=""
                        value={model}
                        onChange={(e) => setModel(e.currentTarget.value)}
                    >
                        <option value="">Valitse</option>
                        <option value="foo">Foo</option>
                    </select>
                </label>

                <div class="form-row choose-shape">
                    <h3 class="text">
                        <span class="n">2</span> Altaan muoto
                    </h3>
                    <div class="shapes">
                        <label class="shape">
                            <input type="radio" name="pool_shape" {...poolShapeRadio("square")} />
                            <svg viewBox="0 0 100 100">
                                <rect x="2" y="2" width="96" height="96" />
                            </svg>
                            <span class="text">Neliö terävät kulmat</span>
                        </label>
                        <label class="shape">
                            <input type="radio" name="pool_shape" {...poolShapeRadio("rounded")} />
                            <svg viewBox="0 0 100 100">
                                <rect x="2" y="2" width="96" height="96" rx="20" />
                            </svg>
                            <span class="text">Neliö pyöristetyt kulmat</span>
                        </label>
                        <label class="shape">
                            <input type="radio" name="pool_shape" {...poolShapeRadio("octagon")} />
                            <svg viewBox="10 10 80 80">
                                <polygon points="34.2,87.4 12.3,65.5 12.3,34.5 34.2,12.6 65.2,12.6 87.1,34.5 87.1,65.5 65.2,87.4" />
                            </svg>
                            <span class="text">Kahdeksan kulmainen</span>
                        </label>
                        <label class="shape">
                            <input type="radio" name="pool_shape" {...poolShapeRadio("circular")} />
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" />
                            </svg>
                            <span class="text">Pyöreä</span>
                        </label>
                    </div>
                </div>

                <div class="form-row choose-color">
                    <h3 class="text">
                        <span class="n">3</span> Altaan väri
                    </h3>
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
                            <span class="text">Harmaa</span>
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
                            <span class="text">Mahogany</span>
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
                            <span class="text">Burgundi</span>
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
                            <span class="text">Musta</span>
                        </label>
                    </div>
                </div>

                <div class="form-row insulationwidth">
                    <h3 class="text">
                        <span class="n">4</span> Eristepaksuus
                    </h3>

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
                    <span class="n">5</span> Kannen mitat
                </h3>
                <div class="measurements">
                    <label class="form-row">
                        <span class="before-text">Pituus (A-mitta)</span>
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
                        <span class="before-text">Leveys (B-mitta)</span>
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
                            <span class="before-text">Kulmien pyöristys (C-mitta)</span>
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
                        <span class="before-text">Helman pituus (D-mitta)</span>
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
                            <span class="before-text">Solkien väli (E-mitta)</span>
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

                <div class="summary">
                    <h3 class="assistive-text">Yhteenveto</h3>
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
                </div>
            </form>

            <a class="close" href="">
                <span class="assistive-text">Sulje</span>
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
