---
title: "Education Across the South Bay: A ZIP Code Story"
date: 2026-04-17
summary: Using 2023 Census data to map educational attainment across 54 ZIP codes in 11 South Bay cities, from 18% to 91% with a bachelor's degree.
tags: [data, analysis]
---

I am a statistician by training and a data scientist by profession. I also happen to live in ZIP code 95014, and I have a PhD.

A while back, I came across [this SF Chronicle piece](https://www.sfchronicle.com/sf/article/most-educated-residents-data-21199765.php) mapping educational attainment across the Bay Area. The Chronicle has a good team of data journalists who regularly tackle interesting questions about the world around us. Reading it made me curious about my own neighbors, the people a few blocks away. What does that map actually look like at ZIP code resolution, right here in Cupertino and the surrounding cities?

So, with the help of modern AI tools, I pulled the data and made the maps.

The source is the [U.S. Census Bureau's American Community Survey for 2023](https://www.census.gov/programs-surveys/acs), specifically table B15003, which covers educational attainment for the population aged 25 and older. Geographic boundaries came from the [Census TIGER/Line shapefiles](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html). I used Python, mainly [pandas](https://pandas.pydata.org/), [geopandas](https://geopandas.org/), [plotly](https://plotly.com/python/), and [folium](https://python-visualization.github.io/folium/), to pull, join, and visualize the data across 54 ZIP codes in 11 cities: San Jose, Cupertino, Palo Alto, Mountain View, Los Altos, Sunnyvale, Santa Clara, Campbell, Milpitas, Los Gatos, and Saratoga.

---

## The map

The result is an interactive choropleth. You can switch between education metrics using the dropdown, and hover over any ZIP to see the full breakdown.

<div style="width:100%; height:580px; margin:2rem 0; border-radius:4px; overflow:hidden;">
  <iframe src="south-bay-education-map.html" width="100%" height="580" style="border:none;"></iframe>
</div>

---

## What the data shows

The range is wide. Palo Alto's 94305 ZIP, which covers the Stanford campus, comes in at 90.9% with a bachelor's degree or higher. San Jose's 95122 ZIP, on the East Side, is at 17.9%. The South Bay average across all 54 ZIPs is around 60%, well above the national figure of roughly 35%.[^1]

[plotly: results/education_by_city.html]

A few things stand out at the city level. Cupertino (95014) sits at 83%, with a notably high share of master's degrees and doctorates, reflecting the concentration of tech workers in the area. Los Altos and Saratoga are in the 85-89% range, but their distribution leans more toward professional and doctoral degrees, suggesting a somewhat different mix: more lawyers, doctors, and academics than engineers. Milpitas and Campbell are around 58-59%, roughly at the South Bay average.

San Jose is the most interesting case. Its internal variation is larger than any other city in the dataset. Some ZIP codes sit below 20%, others are close to 75%. It is, in some sense, many cities at once.

[plotly: results/education_by_zip.html]

---

## Degree type breakdown

The chart below breaks each ZIP down by degree type: bachelor's, master's, professional (JD, MD, and similar), and doctorate. In Cupertino and Mountain View, the master's degree bar is nearly as tall as the bachelor's bar, consistent with a lot of engineers who hold graduate degrees. In the Palo Alto ZIPs closest to Stanford, the doctorate share is noticeably high. In the lower-attainment San Jose ZIPs, the bars are dominated almost entirely by bachelor's degrees, with very little above that.

[plotly: results/education_breakdown.html]

---

## The Stanford effect, and my own ZIP

One number in the dataset stood out. ZIP code 94304, in the Palo Alto hills near the Stanford Research Park, has 31% of its adult residents holding a doctorate. One in three. It is a small ZIP, only about 3,700 adults, but the number is striking. If you had to guess which ZIP in the South Bay has the highest concentration of PhDs, you would probably guess somewhere near Stanford, and you would be right.

My own ZIP, 95014, comes in at around 9% with a doctorate and 35% with a master's degree. That is a lot of advanced degrees for a suburban ZIP code, and it reflects what Cupertino largely is: a place where a significant portion of residents work in technical roles that required graduate education. I am, in some sense, typical of my neighborhood, which is a strange thing to realize.

---

The patterns here are not surprising, but they are striking at ZIP code resolution. The South Bay is not one place educationally. Some of it is among the most qualified geographies in the country. Other parts, a short drive away, look closer to the national average.

All data is from the U.S. Census Bureau and publicly available. The code is [on GitHub](https://github.com/ritsinha/education_by_area).

[^1]: One ZIP in the dataset, 95053, is the postal address for the Santa Clara University campus rather than a residential neighborhood. Its 131 adults aged 25+ and 100% bachelor's attainment reflect campus residents, not the surrounding community. It is included in the aggregate figures but should not be read as representative of Santa Clara as a city.

*Ritwik Sinha — Cupertino, CA*
