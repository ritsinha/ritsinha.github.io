---
title: "What College Earnings Data Can, and Cannot, Tell You"
date: 2026-10-09
summary: "A planned look at program-level college earnings data, its useful variation, and the causal questions it cannot answer."
tags: [data, education, labor-markets]
draft: true
---

I came across the New York Times guide to college-degree earnings and wanted to look beneath the institution-level framing. A college name is a useful starting point, but the underlying data is reported at the program level, with wide variation by major, credential, location, and cohort size. I built a small explorer around the downloadable data to see what is actually available.

This is a draft for a data post, not yet ready for publication. The finished version should use the companion ScratchPad explorer to make the underlying comparisons inspectable.

## The question

The useful question is not simply, "Which college pays the most?" It is: what does the reported earnings distribution look like for a particular program, and what comparison would be fair enough to inform a decision?

The HEA Group file contains 32,578 reported associate and bachelor's programs. Each figure is median annual earnings four years after completion for a defined group of federal-aid recipients who were working and not enrolled in college. It covers 2017-18 and 2018-19 completers, measured in 2022 and 2023 and converted to 2024 dollars.

## What the data can show

The post should show a few things directly from the explorer:

1. Variation within a major can be substantial, so a single national major average hides meaningful differences.
2. Cohort size matters. A reported median based on a small group is a weaker description of a typical graduate than one based on a large group.
3. The source high-school benchmark can provide context, but it is not a counterfactual for the same students had they not attended college.
4. Published cost-of-attendance budgets can be helpful planning inputs, but four-year sticker cost before aid is not a family's eventual price.

## What it cannot show

Observed earnings gaps are not estimates of a college's causal effect. Students differ in academic preparation, family resources, geography, field selection, labor-market connections, and plans for graduate school. Those differences can create large earnings differences even if institutions have identical educational effects.

The data also omit people outside the source's outcome definition, including some graduates who are still in school four years after completing their program. It is therefore best read as a carefully defined description of observed outcomes, not as an individual earnings forecast or a college ranking.

## Planned companion material

The finished post can include one or two examples from the public portion of the explorer, a brief explanation of the minimum-cohort filter, and a link to the HEA methodology. It should not include a private college shortlist, individual application choices, or family-specific cost assumptions.

## Sources

- [HEA Group earnings data and methodology](https://www.theheagroup.com/blog/earnings-test-data)
- [New York Times college-degree earnings guide](https://www.nytimes.com/interactive/2026/10/07/your-money/college-degree-earnings-guide.html)

---

*Draft, not published.*
