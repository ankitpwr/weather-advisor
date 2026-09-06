export const policy = {
  schema_version: "1.1",
  sops: [
    {
      sop_id: "SOP-001",
      title: "High UV during peak hours",
      category: "outdoor_exercise",
      severity: "moderate",
      trigger_type: "numeric",
      weather_fields_used: ["uv_index"],
      condition: {
        description:
          "UV index is 8 or higher between 11:00 and 16:00 local time.",
      },
      activity_keywords: [
        "run",
        "running",
        "jog",
        "exercise",
        "workout",
        "walk",
        "outdoor sport",
      ],
      advice_template:
        "UV index is forecast at {uv_index} between 11am and 4pm. Wear sunscreen and a hat, or shift your session to early morning or evening.",
    },
    {
      sop_id: "SOP-002",
      title: "Extreme heat exercise risk",
      category: "outdoor_exercise",
      severity: "high",
      trigger_type: "numeric",
      weather_fields_used: ["apparent_temperature", "temperature_2m"],
      condition: {
        description:
          "Apparent (feels-like) temperature is 38 degrees Celsius or higher.",
      },
      activity_keywords: [
        "run",
        "running",
        "jog",
        "cycling",
        "exercise",
        "sport",
        "gym outdoors",
      ],
      advice_template:
        "Feels-like temperature is {apparent_temperature} degrees C. Postpone strenuous outdoor exercise until it cools down, or move it indoors.",
    },
    {
      sop_id: "SOP-003",
      title: "Strong wind cycling hazard",
      category: "outdoor_exercise",
      severity: "high",
      trigger_type: "numeric",
      weather_fields_used: ["wind_speed_10m", "wind_gusts_10m"],
      condition: {
        description:
          "Sustained wind exceeds 40 km/h, or gusts reach 45 km/h or higher, and the question involves cycling or a two-wheeler.",
      },
      activity_keywords: [
        "cycle",
        "cycling",
        "bike",
        "bicycle",
        "two-wheeler",
        "scooter",
        "motorbike",
        "commute",
        "ride to work",
      ],
      advice_template:
        "Wind is forecast at {wind_speed_10m} km/h with gusts to {wind_gusts_10m} km/h. Treat this as a safety issue, not just discomfort - consider postponing or a sheltered route.",
    },
    {
      sop_id: "SOP-004",
      title: "Thunderstorm or lightning during outdoor activity",
      category: "outdoor_exercise",
      severity: "critical",
      trigger_type: "numeric",
      weather_fields_used: [
        "weathercode",
        "precipitation_probability",
        "wind_gusts_10m",
      ],
      condition: {
        description:
          "Weather code indicates thunderstorm activity (WMO 95-99), or precipitation probability exceeds 80% with gusts above 50 km/h.",
      },
      activity_keywords: [
        "run",
        "cycling",
        "hike",
        "outdoor",
        "sport",
        "walk",
        "picnic",
        "park",
      ],
      advice_template:
        "Conditions point to thunderstorm risk (precipitation probability {precipitation_probability}%, gusts to {wind_gusts_10m} km/h). Postpone any outdoor activity until it clears.",
    },
    {
      sop_id: "SOP-005",
      title: "Travel delays from heavy rain",
      category: "travel",
      severity: "moderate",
      trigger_type: "numeric",
      weather_fields_used: ["precipitation_probability", "precipitation"],
      condition: {
        description:
          "Precipitation probability is 70% or higher and the question is about travel or commuting.",
      },
      activity_keywords: [
        "travel",
        "commute",
        "drive",
        "trip",
        "flight",
        "train",
        "bus",
        "road",
      ],
      advice_template:
        "Precipitation probability is {precipitation_probability}% today. Expect possible delays - check for traffic or transport alerts before you leave.",
    },
    {
      sop_id: "SOP-006",
      title: "Squally coastal wind for marine or coastal travel",
      category: "travel",
      severity: "high",
      trigger_type: "numeric",
      weather_fields_used: ["wind_speed_10m", "wind_gusts_10m"],
      condition: {
        description:
          "Sustained wind is 45-55 km/h or gusts reach 65 km/h or higher, and the question involves coastal, marine, or boat travel.",
      },
      activity_keywords: [
        "boat",
        "ferry",
        "fishing",
        "coast",
        "coastal",
        "sailing",
        "harbour",
        "beach trip",
      ],
      advice_template:
        "Winds of {wind_speed_10m} km/h, gusting to {wind_gusts_10m} km/h, are forecast - unsafe for small craft or open-water activity. Defer fishing or boat departures.",
    },
    {
      sop_id: "SOP-007",
      title: "Low visibility travel",
      category: "travel",
      severity: "moderate",
      trigger_type: "numeric",
      weather_fields_used: ["visibility", "weathercode"],
      condition: {
        description:
          "Visibility drops below 1000 metres, or weather code indicates fog (WMO 45, 48).",
      },
      activity_keywords: ["drive", "travel", "commute", "road", "highway"],
      advice_template:
        "Visibility is reduced to roughly {visibility} metres. Allow extra travel time, use fog lights, and avoid overtaking on unfamiliar roads.",
    },
    {
      sop_id: "SOP-008",
      title: "Heat risk for elderly outings",
      category: "vulnerable_groups",
      severity: "high",
      trigger_type: "numeric",
      weather_fields_used: ["apparent_temperature"],
      condition: {
        description:
          "Apparent temperature is 35 degrees Celsius or higher and the question mentions an elderly or senior person.",
      },
      activity_keywords: ["elderly", "senior", "grandparent", "old age"],
      advice_template:
        "Feels-like temperature is {apparent_temperature} degrees C. Keep outings short, midmorning or evening, with water on hand, or postpone.",
    },
    {
      sop_id: "SOP-009",
      title: "UV and heat exposure for children outdoors",
      category: "vulnerable_groups",
      severity: "moderate",
      trigger_type: "numeric",
      weather_fields_used: ["uv_index", "temperature_2m"],
      condition: {
        description:
          "UV index is 6 or higher, or temperature is 32 degrees Celsius or higher, and the question mentions children or a park visit.",
      },
      activity_keywords: [
        "kid",
        "kids",
        "child",
        "children",
        "toddler",
        "park",
        "playground",
      ],
      advice_template:
        "UV index is {uv_index} and temperature is {temperature_2m} degrees C. Fine for the park with sunscreen, a hat, and shade breaks - avoid 12-3pm with young children.",
    },
    {
      sop_id: "SOP-010",
      title: "Hot pavement risk for pet walks",
      category: "vulnerable_groups",
      severity: "moderate",
      trigger_type: "numeric",
      weather_fields_used: ["temperature_2m"],
      condition: {
        description:
          "Air temperature is 32 degrees Celsius or higher and the question mentions a dog, pet, or animal walk.",
      },
      activity_keywords: ["dog", "pet", "puppy", "walk the dog"],
      advice_template:
        "Temperature is {temperature_2m} degrees C - pavement can burn paws at this level. Walk early morning or evening, or test the pavement with your hand.",
    },
    {
      sop_id: "SOP-011",
      title: "General leisure and picnic suitability",
      category: "leisure",
      severity: "low",
      trigger_type: "fuzzy",
      weather_fields_used: [
        "temperature_2m",
        "precipitation_probability",
        "wind_speed_10m",
        "uv_index",
      ],
      condition: {
        description:
          "No single threshold defines a 'good picnic day' - weigh rain probability, wind, temperature comfort, and UV together and judge whether the combination points to genuine discomfort or a spoiled outing.",
      },
      activity_keywords: [
        "picnic",
        "outing",
        "outdoor lunch",
        "day out",
        "hang out outside",
        "bbq",
        "barbecue",
      ],
      advice_template:
        "Conditions today: {temperature_2m} degrees C, {precipitation_probability}% chance of rain, wind at {wind_speed_10m} km/h. [Model gives a short good/mixed/poor verdict from these numbers only.]",
    },
    {
      sop_id: "SOP-012",
      title: "Active well-marked low-pressure or cyclonic rain system",
      category: "severe_weather_systems",
      severity: "critical",
      trigger_type: "situational_override",
      weather_fields_used: [
        "precipitation_sum",
        "precipitation",
        "precipitation_probability",
        "wind_gusts_10m",
      ],
      condition: {
        description:
          "Daily precipitation_sum is 64.5mm or more with precipitation_probability at 80% or higher, or precipitation_sum is 115.6mm or more regardless of probability (IMD heavy / very heavy rain thresholds). Applies to every activity category, checked before and independent of what the user asked about.",
      },
      activity_keywords: ["*"],
      advice_template:
        "An active heavy-rain system is over this area - rainfall totals of {precipitation_sum}mm, {precipitation_probability}% chance of continued rain. Treat any outdoor plan today as high risk and check local alerts.",
    },
    {
      sop_id: "SOP-013",
      title: "Wet-road hazard for cycling or two-wheeler commuting",
      category: "commute",
      severity: "moderate",
      trigger_type: "numeric",
      weather_fields_used: ["precipitation_probability", "precipitation"],
      condition: {
        description:
          "Precipitation probability is 50% or higher, or measurable rain is forecast, and the question involves cycling or a two-wheeler.",
      },
      activity_keywords: [
        "cycle",
        "cycling",
        "bike",
        "bicycle",
        "two-wheeler",
        "scooter",
        "motorbike",
        "commute",
        "ride to work",
        "cycle to work",
      ],
      advice_template:
        "Precipitation probability is {precipitation_probability}% with {precipitation}mm forecast. Wet roads reduce grip and braking - ride slower, keep more distance from traffic, and consider a rain jacket.",
    },
    {
      sop_id: "SOP-014",
      title: "Rain risk for children, elderly, or pet outdoor plans",
      category: "vulnerable_groups",
      severity: "moderate",
      trigger_type: "numeric",
      weather_fields_used: ["precipitation_probability", "precipitation"],
      condition: {
        description:
          "Precipitation probability is 70% or higher, or measurable rain is forecast, and the question mentions children, elderly, or pets.",
      },
      activity_keywords: [
        "kid",
        "kids",
        "child",
        "children",
        "toddler",
        "park",
        "playground",
        "elderly",
        "senior",
        "grandparent",
        "dog",
        "pet",
        "puppy",
      ],
      advice_template:
        "Rain probability is {precipitation_probability}% with {precipitation}mm forecast. Better to delay, keep it short and close to shelter, or bring rain gear.",
    },
    {
      sop_id: "SOP-015",
      title: "No active hazard - baseline conditions",
      category: "baseline",
      severity: "info",
      trigger_type: "fallback",
      weather_fields_used: [
        "temperature_2m",
        "apparent_temperature",
        "wind_speed_10m",
        "precipitation_probability",
        "uv_index",
      ],
      condition: {
        description:
          "Question matches a recognized activity category but no other SOP's condition was met. Reports the actual numbers rather than declaring 'safe.'",
      },
      activity_keywords: ["*"],
      advice_template:
        "No specific advisory applies right now. Conditions: {temperature_2m} degrees C (feels like {apparent_temperature}), {precipitation_probability}% chance of rain, wind at {wind_speed_10m} km/h, UV index {uv_index}.",
    },
  ],
};
