# VIBE AGENCY: BIO-ID MAP (v2.0)
*The absolute source of truth for all IDs across the 5-Layer Snowball.*

## 0. GLOBAL HUB (Layer: GLOBAL)
- **Project Manager:** `master_pm`
- **Editor-in-Chief:** `global_editor`
- **Registry Location:** `HUB`

## 1. LAYER 1: STRATEGY (The Venture Briefs)
- **Dept IDs:** `BIG_IDEA_TEAM`, `OPPORTUNITY_TEAM`, `PEOPLE_TEAM`, `EXPERIENCE_TEAM`, `MVP_TEAM`
- **Slugs:** `the_big_idea`, `the_opportunity`, `the_people`, `the_experience`, `the_mvp` 
- **Agent Prefix:** `strat_[dept_slug]_` 
- **Data Keys (Summary Tab):
    - **P1 (Big Idea):** `insight`, `one_sentence`, `problem`, `money`, `must_be_true`, `anti_vision` 
    - **P2 (Opportunity):** `market`, `gap`, `players`, `timing`, `opportunities`, `edge` 
    - **P3 (People):** `primary_audience`, `secondary_audience`, `drivers`, `pain_points`, `markers`, `tipping_point` 
    - **P4 (Experience):** `overall_arc`, `hook`, `moments`, `mechanics`, `ai_layer`, `social_proof`, `five_percent` 
    - **P5 (MVP):** `one_thing`, `must_haves`, `cut_list`, `success_moment`, `build_order`, `validation_targets`

## 2. LAYER 2: LANDSCAPE (The World)
- **Dept ID:** `LANDSCAPE_TEAM`
- **Agent Prefix:** `land_`
- **Agent Roles:** `visual_scout`, `copy_ethno`, `pattern_librarian`
- **Node Types:** `screenshot_node`, `poi_marker`, `heuristic_finding`
- **Data Keys:** `layout_physics`, `nav_conventions`, `tone_strategy`, `interaction_patterns`

## 3. LAYER 3: JOURNEY (The Logic)
- **Dept ID:** `JOURNEY_TEAM`
- **Agent Prefix:** `jrn_`
- **Agent Roles:** `scenario_arch`, `skeptic`, `plotter`
- **Node Types:** `use_case_node`, `flow_step`, `decision_node`
- **Data Keys:** `happy_path`, `stress_path`, `failure_path`, `detax_anchor_id`

## 4. LAYER 4: STRUCTURE (The Nouns)
- **Dept ID:** `SITEMAP_TEAM`
- **Agent Prefix:** `map_`
- **Agent Roles:** `ooux_modeler`, `narrative_designer`, `ia_lead`
- **Node Types:** `object_node`, `page_node`, `nav_link`
- **Data Keys:** `canonical_objects`, `object_relationships`, `user_actions`

## 5. LAYER 5: WIREFRAME (The Surface)
- **Dept ID:** `WIREFRAME_TEAM`
- **Agent Prefix:** `wire_`
- **Agent Roles:** `ergonomist`, `brutalist`, `librarian`
- **Node Types:** `mobile_screen`, `component_node`, `atomic_element`
- **Data Keys:** `component_id`, `layout_mode`, `95_5_compliance`

## 6. SYSTEM CONSTANTS
- **Decision State:** `provisional`, `locked`, `deprecated`
- **Agent Model Tiers:** `PRO` (Gemini 2.5 Pro), `FLASH` (Gemini 2.5 Flash)