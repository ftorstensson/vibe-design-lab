# VIBE AGENCY: BIO-ID MAP (v2.0)
*The absolute source of truth for all IDs across the 5-Layer Snowball.*

## 0. GLOBAL HUB (Layer: GLOBAL)
- **Project Manager:** `master_pm`
- **Editor-in-Chief:** `global_editor`
- **Registry Location:** `HUB`

## 1. LAYER 1: STRATEGY (The Soul)
- **Dept IDs:** `BIG_IDEA_TEAM`, `MARKET_TEAM`, `AUDIENCE_TEAM`, `STRUCTURE_TEAM`, `FEASIBILITY_TEAM`
- **Agent Prefix:** `strat_[dept_slug]_`
- **Node Type:** `strategy`
- **Data Keys:** 
    - `one_sentence_idea`, `core_problem`, `money_logic`, `critical_assumptions`
    - `market_shape`, `distribution_wedge`, `competition`, `market_gaps`, `how_we_win`
    - `audience_hierarchy`, `hiring_conditions`, `influence_dynamics`, `audience_profiles`, `success_moments`

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