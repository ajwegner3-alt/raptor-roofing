// src/content/service-areas.ts

export interface ServiceArea {
  name: string;
  slug: string;
  county: string;
  zipCodes: string[];
  lat?: number;
  lng?: number;
  isPrimary: boolean; // true = featured in footer/homepage
  neighborhoods: string[];       // 5-10 named neighborhoods/subdivisions
  description: string;           // 2-3 paragraphs of localized roofing context
  localChallenges: string[];     // 3-4 area-specific roofing challenges
  housingContext: string;        // 1-2 sentences about housing stock
  funFact?: string;              // Optional local fact for uniqueness
}

export const serviceAreas: ServiceArea[] = [
  {
    name: "Omaha",
    slug: "omaha",
    county: "Douglas",
    zipCodes: [
      "68101", "68102", "68103", "68104", "68105", "68106", "68107",
      "68108", "68110", "68111", "68112", "68114", "68116", "68117",
      "68118", "68122", "68124", "68127", "68130", "68131", "68132",
      "68133", "68134", "68135", "68137", "68138", "68142", "68144",
      "68147", "68152", "68154", "68157", "68164",
    ],
    lat: 41.2565,
    lng: -95.9345,
    isPrimary: true,
    neighborhoods: [
      "Dundee",
      "Benson",
      "Aksarben",
      "Midtown",
      "West Omaha",
      "Blackstone",
      "Florence",
      "North Omaha",
      "South Omaha",
      "Regency",
    ],
    description: `Omaha's roofing needs span nearly a century of construction history. In historic neighborhoods like Dundee and Benson, craftsman bungalows and two-story foursquares built in the 1920s and 1930s are hitting their second or third roof replacement. These homes often have steep pitches, decorative trim, and older decking that requires careful inspection before any new system goes on. Aksarben and Midtown properties from the postwar era present a different set of considerations — lower-slope ranch-style rooflines, original wood decking in some cases, and attic ventilation systems that were never designed for modern insulation loads.

West Omaha is a different story entirely. The rapid residential development along 168th Street and beyond through the 1990s and 2000s produced tens of thousands of homes with builder-grade architectural shingles that are now entering the end of their rated lifespan. Many of these roofs were installed as quickly as the neighborhoods were platted, and deferred maintenance — clogged gutters, failed pipe boots, and granule loss — has accelerated wear on systems that should have another five years of life. Raptor Roofing's crews work across all of Omaha's ZIP codes weekly, so we know what each neighborhood's rooftops actually look like from ten feet up.

Omaha sits squarely in a hail corridor that produces some of the highest storm claim volumes in the Midwest. The I-80 corridor from the Iowa border westward through Douglas County sees multiple significant hail events every spring and summer. Homeowners who received roofing work after the major 2019 or 2022 storms may be approaching the end of their insurance-required repair windows. We provide honest condition assessments — no pressure, no manufactured urgency.`,
    localChallenges: [
      "Severe hail exposure along the I-80 corridor — some of the highest claim density in the Midwest",
      "Aging 3-tab shingles on 1960s–1980s homes in established neighborhoods approaching or past 25-year lifespan",
      "Ice dam formation on low-slope ranch rooflines with inadequate attic insulation and ventilation",
      "High wind events channeled between river bluffs and open plains that lift improperly fastened ridge caps and starter strips",
    ],
    housingContext: `Omaha's housing stock spans from 1920s craftsman bungalows in Dundee and Benson to 1960s–70s ranch homes in the Millard and Ralston corridors, to 2000s-and-newer construction in West Omaha and Elkhorn. This diversity means roofing material choices, decking conditions, and code compliance requirements vary significantly by neighborhood — local knowledge matters.`,
    funFact: "Omaha is consistently ranked among the top 15 most hail-prone metro areas in the United States, with an average of 3–5 hail-producing storms per year reaching 1-inch diameter or larger.",
  },
  {
    name: "Bellevue",
    slug: "bellevue",
    county: "Sarpy",
    zipCodes: ["68005", "68123"],
    lat: 41.1500,
    lng: -95.9145,
    isPrimary: true,
    neighborhoods: [
      "Olde Towne Bellevue",
      "Twin Ridge",
      "Fontenelle Hills",
      "Haworth Park area",
      "Mission Hills",
      "Levi Carter",
    ],
    description: `Bellevue is Nebraska's oldest city, and that history shows on its rooftops. The Olde Towne district and surrounding residential blocks contain homes from the 1940s through 1970s — a mix of brick ranch houses and cape cods that have been maintained (or neglected) through multiple owners. Many carry original or early-replacement roofing systems that are well past their useful life. Fontenelle Hills and the neighborhoods east of Fort Crook Road tend to have more 1980s and early 1990s construction, often with original architectural shingles that are now losing granule coverage at an accelerating rate.

Proximity to the Missouri River corridor introduces a moisture dynamic that homeowners in drier western suburbs don't encounter. Higher ambient humidity through late spring and fall creates conditions that accelerate algae and moss growth, particularly on north-facing roof planes that receive limited sun. Black algae streaking is cosmetic in the short term but left untreated, it retains moisture against the shingle surface and shortens lifespan measurably. Raptor Roofing installs copper-embedded shingles and algae-resistant starter strips in Bellevue as a standard recommendation for this reason.

Offutt Air Force Base's presence gives Bellevue a unique demographic pattern — military families on 2–4 year rotations who may inherit a home's deferred maintenance and need fast, reliable assessments before deciding whether to invest in repairs or a full replacement before PCS orders arrive. We work with military homeowners routinely and understand the time constraints and documentation needs that come with VA-backed homes.`,
    localChallenges: [
      "Missouri River proximity drives elevated humidity that accelerates algae, moss, and lichen growth on north-facing roof planes",
      "High military family turnover near Offutt AFB means deferred maintenance is common — roofs are often assessed under time pressure during PCS moves",
      "Older housing stock in Olde Towne and surrounding blocks has original or early-era decking that may require full replacement rather than overlay",
      "Low-lying areas near the river floodplain see heavier snow accumulation and extended freeze-thaw cycles that stress flashing and valley seams",
    ],
    housingContext: `Bellevue's housing ranges from 1940s–60s brick ranch homes near Olde Towne to 1970s–80s construction in established subdivisions like Fontenelle Hills and Twin Ridge, with newer development pushing south and west toward the Sarpy County line. Older areas in particular have roofs approaching or exceeding 30 years — well past the reliable lifespan of original 3-tab shingles.`,
    funFact: "Bellevue was platted in 1854, making it the oldest continuously occupied settlement in Nebraska — and some of its older neighborhoods have rooflines to prove it.",
  },
  {
    name: "Papillion",
    slug: "papillion",
    county: "Sarpy",
    zipCodes: ["68046", "68133"],
    lat: 41.1548,
    lng: -96.0425,
    isPrimary: true,
    neighborhoods: [
      "Shadow Lake",
      "Tara Hills",
      "Whispering Ridge",
      "Southshore",
      "Papillion Landing",
      "Hallbrook Estates",
    ],
    description: `Papillion has been one of the fastest-growing cities in Nebraska for two decades running, and that growth created a specific roofing challenge: enormous quantities of builder-grade roofing installed rapidly during the 1990s through 2010s boom years. Subdivisions like Shadow Lake, Tara Hills, and Whispering Ridge were built out in large phases, with volume-purchasing decisions often favoring minimum-spec materials over longevity. A home in one of these neighborhoods that was built in 1998–2005 is now sitting on a 20–27-year-old roof — and these roofs were never going to make it to 30 years under Nebraska hail exposure.

Papillion's open suburban topography also means fewer windbreaks than you'd find in older, tree-lined urban neighborhoods. Storm systems rolling in from the southwest hit Sarpy County with minimal obstruction, and the relatively flat terrain allows wind to maintain velocity as it crosses developed areas. This translates to higher lift forces on ridge caps and starter courses, and more frequent debris strikes from landscaping and construction materials in surrounding areas still under development.

The good news: Papillion homeowners have generally maintained their properties well, and homes in this market tend to be well-documented from the original build. We frequently work with original permit records and builder specs to determine whether a system was installed to the minimum standard at the time, which helps us give you an accurate remaining-life assessment rather than a guess.`,
    localChallenges: [
      "Large volumes of builder-grade architectural shingles from 1995–2010 construction now reaching end of rated lifespan",
      "Open suburban terrain with fewer windbreaks allows storm systems to maintain velocity, increasing lift and impact forces",
      "Rapid subdivision build-out means many adjacent homes face simultaneous replacement needs, creating scheduling pressure after major storms",
      "New construction phases on the perimeter create ongoing debris and dust exposure that clogs gutters and accelerates granule loss",
    ],
    housingContext: `Papillion is predominantly 1990s through 2010s single-family residential, with newer construction continuing to push south and west. Builder-grade roofing from the growth boom years now dominates the replacement market — the city's oldest subdivisions are entering the window where full replacement is the only responsible path forward.`,
    funFact: "Papillion has been named one of Money Magazine's 'Best Places to Live' multiple times — and with the roofing replacement cycle hitting its peak in the mid-2020s, it's also one of the busiest roofing markets in the metro.",
  },
  {
    name: "La Vista",
    slug: "la-vista",
    county: "Sarpy",
    zipCodes: ["68128"],
    lat: 41.1833,
    lng: -96.0306,
    isPrimary: true,
    neighborhoods: [
      "Southport area",
      "La Vista Hills",
      "Brentwood",
      "Council Oak",
      "Flagstone",
    ],
    description: `La Vista is a compact, established suburb that sits at the crossroads of I-80 and 84th Street — one of the most heavily traveled corridors in the Omaha metro. That location shapes the roofing environment in ways that aren't always obvious. Debris carried by highway wind currents and turbulence from heavy truck traffic accumulates on rooftops faster than in quieter residential areas. Gutters clog more frequently, and granule abrasion from debris impact is a real factor in premature wear on south- and west-facing roof planes along the I-80 corridor.

The city's housing stock runs predominantly 1970s through early 1990s, which puts a large share of La Vista's homes squarely in the replacement window. These homes were built solidly — sturdy framing, good pitch design — but the original roofing systems they came with are long gone, and many second-replacement roofs installed in the late 1990s and 2000s are now 20+ years old. In our experience, La Vista homeowners tend to stay in their homes longer than the metro average, which means maintenance matters and they're willing to invest in quality systems that will last.

The Southport area near the interchange sees particularly intense weather exposure due to open sightlines on all sides. If you live near the I-80/84th Street area, your roof has been taking punishment for years that a home three blocks north or south may not have experienced at the same intensity.`,
    localChallenges: [
      "Highway proximity along I-80 accelerates debris accumulation and granule abrasion from turbulence and vehicle-generated wind",
      "1970s–90s housing stock means many homes are on their second or even third roof, with older decking that may have absorbed moisture damage over the years",
      "Older ventilation systems — box vents and static turbines from that era — often underperform modern standards, creating heat and moisture buildup that degrades shingles from below",
      "Compact lot sizes mean less tree coverage, leaving rooftops more exposed to UV and storm-driven hail without the buffering that mature canopy provides",
    ],
    housingContext: `La Vista's residential areas are largely built out, with housing concentrated in the 1970s through early 1990s era. The city has limited new construction, meaning the replacement market is driven by age-based wear rather than builder-grade material failures — older homes, older decking, and the accumulated effects of highway exposure.`,
  },
  {
    name: "Elkhorn",
    slug: "elkhorn",
    county: "Douglas",
    zipCodes: ["68022"],
    lat: 41.2847,
    lng: -96.2353,
    isPrimary: true,
    neighborhoods: [
      "Skyline Ranch",
      "Eagle Hills",
      "Arbor View",
      "Shadow Ridge",
      "West Hampton",
      "Autumn Creek",
    ],
    description: `Elkhorn is the western frontier of the Omaha metro, and it shows in both the housing and the weather. The area west of 180th Street and extending toward the Douglas/Sarpy county line sees some of the most direct exposure to the storm systems that roll in from the central plains. There are fewer mature trees, fewer natural windbreaks, and the terrain opens up in ways that allow hailstorms and straight-line wind events to hit residential rooftops with maximum force. We have repaired and replaced hundreds of roofs in Elkhorn's newer subdivisions following spring storm events.

The construction timeline here is recent — the bulk of Elkhorn's residential development happened between 2000 and the present, with major subdivision buildouts in the 2005–2015 range along Eagle Hills, Arbor View, and Skyline Ranch. While newer construction generally uses architectural shingles rather than 3-tab, builder-grade Certainteed or Owens Corning shingles installed at minimum fastening specs are not the same as a properly installed premium system. Settling, thermal cycling, and a few significant hail events are enough to expose those gaps.

We also see a pattern in newer Elkhorn homes related to complex rooflines. The architectural variety in these neighborhoods — with multiple hips, valleys, dormers, and varying pitches on a single home — creates more potential failure points at intersections and transitions. Valleys fill faster, flashing around dormers works loose sooner, and the sheer number of penetrations means more opportunities for water to find its way in. We pay close attention to these details during every inspection.`,
    localChallenges: [
      "Maximum storm exposure on the western metro edge — few natural windbreaks and open terrain allow hail and wind to reach rooftops at full intensity",
      "Complex roofline architecture in newer construction creates multiple valleys, hips, and dormers with proportionally more flashing and transition points to maintain",
      "Builder-grade installation practices in high-volume construction phases means some roofs were fastened and flashed to minimum code, not best practice",
      "New construction continues nearby, meaning dust, debris, and equipment traffic from active development sites affects older homes in established sections",
    ],
    housingContext: `Elkhorn is predominantly 2000s through present construction, with ongoing development continuing to push the boundary westward. The housing is newer, but newer does not mean problem-free — builder-grade materials and complex roof geometries in this market require careful inspection rather than assumptions about condition based on age alone.`,
    funFact: "Elkhorn was an independent city until 2007, when it was annexed by Omaha — making it one of the largest annexations in Nebraska history and connecting its fast-growing subdivisions to the metro grid.",
  },
  {
    name: "Millard",
    slug: "millard",
    county: "Douglas",
    zipCodes: ["68137", "68144"],
    lat: 41.2167,
    lng: -96.1167,
    isPrimary: false,
    neighborhoods: [
      "Applewood",
      "Millard Heights",
      "Chalco Hills",
      "Millard North",
      "Prairie Hills",
      "Old Mill area",
    ],
    description: `Millard is one of Omaha's most established southwestern suburbs, built out primarily through the 1970s, 1980s, and early 1990s. The neighborhood has a settled, mature character — large trees, established landscaping, and homes that have been owned by the same families for decades in many cases. That stability is a mark of quality, but it also means deferred maintenance is real: a homeowner who's been in the same house since 1985 may be looking at a roof that's 20+ years old and hasn't been inspected since the last time someone filed a claim.

The housing in Applewood, Millard Heights, and Chalco Hills is predominantly split-level and ranch-style construction from the 1975–1995 era. These roof systems — originally 3-tab shingles, replaced once or twice since — are at the age where granule loss is visible in gutters, ridge caps are brittle from UV cycling, and flashing has begun to separate at chimneys and pipe penetrations. In our experience, Millard homes that look fine from the street often have hidden wear that only a close inspection reveals.

We see a higher-than-average rate of ice dam damage in Millard compared to newer suburbs. The mature tree canopy that makes these neighborhoods beautiful also creates extended shade on northern roof pitches, keeping ice and snowpack in place longer. Combined with attic insulation levels that were standard in the 1980s but are well below current best practice, many Millard homes experience repeated ice dam formation that drives water under shingles over time.`,
    localChallenges: [
      "Aging asphalt shingles from 1970s–90s construction approaching or exceeding 25-year lifespan — many visible from the street but deteriorated close-up",
      "Ice dam formation on northern pitches driven by mature tree shade and inadequate attic insulation by modern standards",
      "Chimney flashing failures common on 30-40 year old homes as original lead or galvanized flashing reaches end of service life",
      "Long-term ownership patterns mean deferred maintenance has accumulated quietly — roofs that haven't been inspected in a decade are common",
    ],
    housingContext: `Millard's housing is concentrated in the 1975–1995 era — split-levels, ranches, and two-stories that were built solidly but are now in the replacement window for their second or third roof. The neighborhood's long-term ownership demographic means many of these roofs have been quietly aging without regular professional inspection.`,
  },
  {
    name: "Gretna",
    slug: "gretna",
    county: "Sarpy",
    zipCodes: ["68028"],
    lat: 41.1417,
    lng: -96.2369,
    isPrimary: false,
    neighborhoods: [
      "Aspen Creek",
      "Legacy Trails",
      "Gretna Crossing",
      "Traditions",
      "Lakewood",
    ],
    description: `Gretna has become one of the most talked-about growth stories in the Omaha metro. The city's population has more than tripled over the past two decades, and entire new subdivisions — Aspen Creek, Legacy Trails, Gretna Crossing — have been developed in phases that sometimes outpaced the local infrastructure. That growth brings opportunity, but it also brings the roofing industry's most persistent problem: volume-driven, builder-grade installation that prioritizes cost per square foot over long-term performance.

We inspect new construction in Gretna frequently, and we find the same patterns across multiple subdivisions from the same development era. Minimum fastening: four nails per shingle rather than six. Starter strips cut narrow. Attic ventilation at the bottom of the calculation rather than optimized. None of this is illegal, and it may pass inspection, but it doesn't perform as well under Nebraska hail as a properly installed system would. Homeowners who bought in 2008–2015 are now discovering this as their roofs age into their first real stress test.

Gretna also sits in an open, southwestern exposure zone that sees direct storm track exposure without the buffering of urban development to the west. The Platte River valley to the south funnels storm energy northward through the area, and Sarpy County's flat terrain means wind has room to accelerate before hitting residential areas. If you've lived in Gretna through a few serious spring storm seasons, you already know what we're describing.`,
    localChallenges: [
      "Builder-grade materials and minimum-spec installation widespread in high-volume subdivision buildouts from the 2000s–2015 growth era",
      "Open southwestern exposure and Platte River valley terrain that channels storm energy toward residential areas with limited natural buffering",
      "Rapid growth has meant that storm restoration crews — including out-of-area operators — have worked heavily in the area; previous repair quality is often unknown",
      "New construction still underway in surrounding phases means active-site debris, dust, and traffic affect finished neighborhoods nearby",
    ],
    housingContext: `Gretna is predominantly newer construction, with most residential development occurring from 2000 to present. The city's rapid growth means large clusters of homes with similar age roofing systems — when replacement cycles hit, many neighbors face the same need simultaneously. Early inspection is the best way to avoid getting caught in peak-demand delays after a storm event.`,
    funFact: "Gretna has consistently been one of the fastest-growing cities in Nebraska by percentage, transforming from a small rural community to a full-service suburb in under 20 years — a growth pace that has directly shaped the area's roofing market.",
  },
  {
    name: "Ralston",
    slug: "ralston",
    county: "Douglas",
    zipCodes: ["68127"],
    lat: 41.2014,
    lng: -96.0342,
    isPrimary: false,
    neighborhoods: [
      "Central Ralston",
      "Ralston Heights",
      "Near Ralston Arena",
      "South Ralston",
    ],
    description: `Ralston is a small, self-contained community tucked between South Omaha and La Vista — one of those neighborhoods that longtime Omahans know well but outsiders sometimes overlook. The housing stock here is older than most of the surrounding metro, concentrated in the 1950s through 1970s era when Ralston served as a bedroom community for the manufacturing and meatpacking workforce that powered South Omaha's economy. These are well-built, modest homes — brick and frame construction, solid bones — but they carry roofing systems that have aged quietly, often without the professional attention they need.

The typical Ralston home we inspect is on its second or third roof, with the most recent replacement having been done 15–20 years ago using 3-tab or lower-end architectural shingles. At this point in the replacement cycle, the visible signs are everywhere if you know what to look for: curling tabs at the corners, dark algae streaking along the lower third of the roof plane, granule deposits accumulating in downspout extensions, and daylight visible through deteriorated pipe boot collars from inside the attic. These are not emergency situations, but they are roofs that are a single significant storm event away from becoming one.

We give Ralston homeowners the same thorough inspection we bring to every job regardless of the home's market value. A $180,000 home in Ralston deserves honest information and quality workmanship just as much as a $500,000 home in West Omaha. That's how we operate, and it's why a significant portion of our Ralston work comes from word-of-mouth within the neighborhood.`,
    localChallenges: [
      "1950s–70s housing with original or second-generation roofing systems — many homes are due or overdue for full replacement",
      "Aging gutters and downspout systems from the original construction era that no longer drain efficiently, causing water to back up at eaves",
      "Deferred maintenance common in the area — economic pressures and long-term owner demographics mean repairs are often delayed until the damage is visible from inside",
      "Older attic framing and ventilation designs that don't support modern ventilation standards, contributing to heat and moisture buildup under the roof deck",
    ],
    housingContext: `Ralston's housing is predominantly 1950s through 1970s construction — brick and frame homes that were built to last but are now carrying roofing systems well past their serviceable lifespan. The community's tight-knit character and long-term ownership patterns mean roofs often go uninspected for extended periods, and condition surprises at the time of replacement are common.`,
    funFact: "Ralston hosts the annual Ralston Rocktoberfest, one of the metro's longest-running community festivals — and the city's longstanding community pride translates to homeowners who care deeply about maintaining their properties even when budgets are tight.",
  },
];

export function getPrimaryServiceAreas(): ServiceArea[] {
  return serviceAreas.filter((a) => a.isPrimary);
}

export function getServiceAreaBySlug(slug: string): ServiceArea | undefined {
  return serviceAreas.find((a) => a.slug === slug);
}
