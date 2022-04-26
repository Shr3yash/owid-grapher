import React from "react"
import ReactDOM from "react-dom"
import { useState, useEffect, useRef } from "react"
import { MultiEmbedderSingleton } from "../../site/multiembedder/MultiEmbedder.js"
import { RelatedChart } from "../../clientUtils/owidTypes.js"
import { BAKED_GRAPHER_EXPORTS_BASE_URL } from "../../settings/clientSettings.js"

export const RELATED_CHARTS_CLASS_NAME = "related-charts"

export const RelatedCharts = ({ charts }: { charts: RelatedChart[] }) => {
    const refChartContainer = useRef<HTMLDivElement>(null)
    const [currentChart, setCurrentChart] = useState<RelatedChart>(charts[0])

    useEffect(() => {
        if (refChartContainer.current)
            // Track newly injected <figure> elements in embedder
            MultiEmbedderSingleton.observeFigures(refChartContainer.current)
    }, [currentChart])

    return (
        <div className={RELATED_CHARTS_CLASS_NAME}>
            <div className="wp-block-columns is-style-sticky-right">
                <div className="wp-block-column">
                    <ul>
                        {charts.map((chart) => (
                            <li
                                className={
                                    currentChart &&
                                    currentChart.slug === chart.slug
                                        ? "active"
                                        : ""
                                }
                                key={chart.slug}
                            >
                                <a
                                    href={`/grapher/${chart.slug}`}
                                    onClick={(event) => {
                                        // Allow opening charts in new tab/window with ⌘+CLICK
                                        if (
                                            !event.metaKey &&
                                            !event.shiftKey &&
                                            !event.ctrlKey
                                        ) {
                                            setCurrentChart({
                                                title: chart.title,
                                                slug: chart.slug,
                                            })
                                            event.preventDefault()
                                        }
                                    }}
                                >
                                    <img
                                        src={`${BAKED_GRAPHER_EXPORTS_BASE_URL}/${chart.slug}.svg`}
                                        loading="lazy"
                                        data-no-lightbox
                                        data-no-img-formatting
                                        width={850}
                                        height={600}
                                    ></img>
                                    <span>{chart.title}</span>
                                </a>
                                {chart.variantName ? (
                                    <span className="variantName">
                                        {chart.variantName}
                                    </span>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </div>
                <div
                    className="wp-block-column"
                    id="all-charts-preview"
                    ref={refChartContainer}
                >
                    <figure
                        // Use unique `key` to force React to re-render tree
                        key={currentChart.slug}
                        data-grapher-src={`/grapher/${currentChart.slug}`}
                    />
                </div>
            </div>
        </div>
    )
}

export const runRelatedCharts = (charts: RelatedChart[]) => {
    const relatedChartsEl = document.querySelector<HTMLElement>(
        `.${RELATED_CHARTS_CLASS_NAME}`
    )
    if (relatedChartsEl) {
        const relatedChartsWrapper = relatedChartsEl.parentElement
        ReactDOM.hydrate(
            <RelatedCharts charts={charts} />,
            relatedChartsWrapper
        )
    }
}
