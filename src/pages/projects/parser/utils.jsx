import {Checkbox} from "@blueprintjs/core"
import React from "react"

export function hex3(val: number) {
    return val.toString(16).padStart(3, '0')
}

export const WordClasses = {
    Number: 0x001,
    Punctuation: 0x002,
    Conjunction: 0x004,
    Association: 0x008,
    Proposition: 0x010,
    Article: 0x020,
    QualifyingAdjective: 0x040,
    RelativePronoun: 0x080,
    Noun: 0x100,
    IndicativeVerb: 0x200,
    Adverb: 0x400,
    ImperativeVerb: 0x800
}

export const wordClassMap = {
    'Number': WordClasses.Number,
    'Punctuation': WordClasses.Punctuation,
    'Conjunction': WordClasses.Conjunction,
    'Association': WordClasses.Association,
    'Proposition': WordClasses.Proposition,
    'Article': WordClasses.Article,
    'QualifyingAdjective': WordClasses.QualifyingAdjective,
    'RelativePronoun': WordClasses.RelativePronoun,
    'Noun': WordClasses.Noun,
    'IndicativeVerb': WordClasses.IndicativeVerb,
    'Adverb': WordClasses.Adverb,
    'ImperativeVerb': WordClasses.ImperativeVerb
}

export function classToStr(val: number) {
    const strs = []
    for (const [key, value] of Object.entries(wordClassMap)) {
        if (val & value) strs.push(key)
    }
    return strs.join(', ')
}

export function ClassEditor({value, onChange}: {value: number, onChange: (val: number) => void}) {
    const setFlag = (f: number, on: boolean) => on ? onChange(value | f) : onChange(value & ~f)

    return Object.entries(wordClassMap).map(([name, c]) => (
        <Checkbox key={name}
                  label={name}
                  checked={(value & c) > 0}
                  onChange={(e) => setFlag(c, e.target.checked)}/>
    ))
}