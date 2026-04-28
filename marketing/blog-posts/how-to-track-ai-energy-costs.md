---
SEO title: "How to Track AI Energy Costs for Your Organization or Research Project"
Meta description: "A practical, step-by-step guide to measuring AI energy consumption, water use, and compute costs using free tools and public data sources."
Slug suggestion: "how-to-track-ai-energy-costs"
Target keyword: "how to track AI energy costs"
Secondary keywords:
  - "measure AI energy consumption"
  - "AI compute cost tracking"
  - "data center cost calculator"
  - "AI carbon accounting"
  - "free tools for AI sustainability"
Search intent: Practical / how-to — users want actionable steps to measure and manage AI resource costs.
Suggested OG title: "How to Track AI Energy Costs (Free Tools + Step-by-Step Guide)"
Suggested OG description: "Measure AI water, power, and compute costs without expensive software. A practical guide for researchers and infrastructure teams."
---

# How to Track AI Energy Costs for Your Organization or Research Project

Whether you are a researcher publishing on **AI sustainability**, an infrastructure engineer optimizing cloud spend, or a policy analyst building a case for data center regulation, you need numbers. The good news is that you do not need a proprietary dashboard or a consulting contract to start **measuring AI energy consumption**. Most of the data is public, and the tools are free.

This guide walks you through a practical workflow for tracking AI energy costs, water use, and carbon emissions. It is designed for small teams, indie researchers, and anyone who wants credible data without enterprise software budgets.

## Step 1: Define what you are measuring

Before opening a spreadsheet, clarify your scope. AI resource costs fall into four buckets:

1. **Electricity:** Kilowatt-hours consumed by training or inference workloads
2. **Water:** Liters used for direct cooling and indirect electricity generation
3. **Carbon:** Tons of CO2 equivalent from energy consumption
4. **Money:** Direct cloud or hardware costs, plus indirect grid and water costs

Decide whether you are tracking a single model, a single project, or an entire organization's AI footprint. The method is the same; only the scale changes.

## Step 2: Gather hardware and workload data

You need three basic inputs:

- **Hardware type:** GPU model, TPU version, or CPU family
- **Utilization:** Average load percentage during the measurement window
- **Duration:** Hours the workload ran

If you run workloads on cloud providers, this data is usually available in the billing or monitoring console. AWS, Google Cloud, and Azure all provide instance-level usage metrics.

If you run on-premise hardware, use `nvidia-smi` for NVIDIA GPUs or `ipmitool` for server power readings. For a rough estimate, you can also use the Thermal Design Power (TDP) rating of the chip, though actual consumption is typically 60–80 percent of TDP under sustained AI workloads.

## Step 3: Estimate energy consumption

The simplest formula for a single workload is:

> Energy (kWh) = Power (kW) × Time (hours) × Utilization factor

For example, a 400W GPU running at 80 percent utilization for 24 hours consumes:

> 0.4 kW × 24 h × 0.8 = 7.68 kWh

For multi-GPU training runs, multiply by the number of GPUs. Do not forget the overhead. Data center power usage effectiveness (PUE) accounts for cooling, power distribution, and lighting. A typical PUE is 1.2 to 1.6. Multiply your IT energy by the facility PUE to get total energy:

> Total energy = IT energy × PUE

If you do not know your facility's PUE, use 1.5 as a conservative estimate.

## Step 4: Convert energy to carbon

This is where grid data matters. The carbon intensity of electricity varies dramatically by region and time of day.

Use these free resources:

- **Electricity Maps** (electricitymaps.com) — real-time and historical carbon intensity by country and region
- **EPA eGRID** (for U.S. facilities) — annual average grid carbon intensity by subregion
- **Google Carbon-Free Energy Percentage** — if you use Google Cloud, their sustainability reports show matched carbon-free energy rates

Formula:

> Carbon (kg CO2) = Energy (kWh) × Grid carbon intensity (kg CO2/kWh)

For example, 7.68 kWh in a region with a carbon intensity of 0.4 kg CO2/kWh produces roughly 3.07 kg of CO2.

## Step 5: Estimate water consumption

Water is harder to measure than energy because it involves both direct cooling and indirect electricity generation. Here is a practical approach:

**Direct water:** Ask your data center operator for WUE (water usage effectiveness) or total water consumption. If unavailable, use published averages. Hyperscale facilities often report WUE of 0.2 to 2.0 liters per kWh, depending on climate and cooling technology.

**Indirect water:** Use the water consumption intensity of your local grid. The U.S. Geological Survey and regional water authorities publish data on thermoelectric water use. A rough rule of thumb is 1–2 liters of water per kWh for mixed grids.

Total water estimate:

> Water (liters) = Energy (kWh) × (Direct WUE + Indirect water intensity)

For a research project, an order-of-magnitude estimate is usually sufficient. For regulatory or corporate reporting, you will need facility-specific data.

## Step 6: Track costs

**Direct costs** are the easiest. Cloud consoles show spend by project, service, or instance. For on-premise hardware, amortize the purchase cost over the expected lifetime and add electricity and maintenance.

**Indirect costs** are harder but increasingly relevant. Some regions now charge for carbon emissions. Water costs are rising in water-stressed areas. Grid congestion can trigger demand charges that spike bills during peak hours.

A simple spreadsheet with these columns works for most teams:

| Date | Workload | Hardware | Hours | kWh | Region | kg CO2 | Liters water | Direct cost | Notes |
|------|----------|----------|-------|-----|--------|--------|--------------|-------------|-------|

## Step 7: Use free tools and calculators

Several free tools can automate or simplify parts of this workflow:

- **MLCO2 Impact Calculator** (mlco2.github.io) — estimates carbon emissions from training runs based on hardware, region, and duration
- **Electricity Maps** — real-time grid carbon intensity
- **WattTime** (free API tier) — marginal emissions data for automated shifting
- **Google Cloud Carbon Footprint** — free for Google Cloud customers
- **Azure Sustainability Calculator** — free for Azure customers
- **AWS Customer Carbon Footprint Tool** — free for AWS customers

For a fully manual approach, combine `nvidia-smi` logs with Electricity Maps data and a spreadsheet. It takes more time but gives you full control and transparency.

## Step 8: Report and benchmark

Once you have data, contextualize it.

- Compare your results against published benchmarks for similar models or hardware
- Track month-over-month changes to spot trends
- Share findings with your team or in public research to contribute to the broader understanding of **AI carbon accounting**

If you are writing a paper, include hardware details, grid region, PUE assumptions, and measurement methodology. Reproducibility matters. Other researchers should be able to replicate or challenge your numbers.

## Step 9: Act on the data

Measurement is only useful if it changes behavior. Common actions include:

- **Shifting workloads to low-carbon hours or regions** using marginal emissions data
- **Reducing model size or training duration** if accuracy gains do not justify cost
- **Upgrading to more efficient hardware** when older chips are retired
- **Requesting renewable energy matching** from your cloud provider or data center
- **Disclosing results publicly** to encourage industry-wide transparency

## Common mistakes to avoid

1. **Ignoring PUE:** Many people measure chip power but forget facility overhead. This underestimates total energy by 20–60 percent.
2. **Using national averages for grid carbon:** Regional and hourly variation is huge. A national average can misrepresent your actual footprint by a factor of two or more.
3. **Forgetting inference:** Training gets attention, but inference is the larger long-term cost. Track both.
4. **Mixing direct and indirect water inconsistently:** Be explicit about what you include and what you exclude.
5. **Reporting without methodology:** Always state your assumptions. Numbers without context are not credible.

## FAQ

**Do I need special hardware to measure AI energy use?**
No. Cloud consoles and free command-line tools like `nvidia-smi` provide enough data for most estimates.

**Can I track costs for models I do not train myself?**
Indirectly, yes. You can estimate per-query costs using published hardware configurations and query volume, though this involves more assumptions.

**What is the cheapest way to start?**
A spreadsheet, `nvidia-smi`, and Electricity Maps. Total cost: zero.

**How accurate are free tools like MLCO2?**
They provide good order-of-magnitude estimates. For precise corporate reporting, you need facility-specific data from your cloud provider or data center operator.

## Internal link suggestions
- [Training vs. Inference: Which Stage of AI Costs More?](/blog-detail/training-vs-inference-water-energy-cost)
- [How Much Water Do AI Data Centers Really Use?](/blog-detail/how-much-water-do-ai-data-centers-use)
- [AI Gas Power Plans Could Emit 129 Million Tons a Year](/blog-detail/ai-gas-power-emissions)

## External link suggestions
- [MLCO2 Impact Calculator](https://mlco2.github.io/impact/)
- [Electricity Maps](https://app.electricitymaps.com)
- [EPA eGRID](https://www.epa.gov/egrid)

## CTA

AI Usage Global publishes daily on AI infrastructure costs, efficiency trends, and regulatory changes. If you are building an AI cost tracking practice, [our archive](/#categories) is a good place to find source-linked data and timely updates. You can also [follow our RSS feed](/rss.xml) to get new posts as they publish.
