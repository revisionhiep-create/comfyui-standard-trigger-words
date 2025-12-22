"""
Preset trigger words for SDXL Illustrious/Pony models.
Organized by category for the Standard Trigger Words Loader node.
"""

# --- POSITIVE TAGS ---

# Quality tags - foundational tags that improve overall image quality
QUALITY_TAGS = [
    "masterpiece",
    "best quality",
    "very aesthetic",
    "absurdres",
    "high quality",
    "ultra high definition",
    "extremely high detail",
    "newest",
    "year 2024",
    "year 2025",
    "highres",
    "8K",
    "HDR",
    "score_9",
    "score_8_up",
    "score_7_up",
]

# Lighting tags - control lighting and atmosphere
LIGHTING_TAGS = [
    "volumetric lighting",
    "ambient occlusion",
    "dramatic lighting",
    "cinematic lighting",
    "rim light",
    "soft lighting",
    "studio lighting",
    "golden hour lighting",
    "natural lighting",
    "sunlight",
    "backlighting",
    "sharp focus",
    "glowing",
    "luminescent background",
    "bioluminescence",
    "ray tracing",
    "reflection",
]

# Composition and camera tags
COMPOSITION_TAGS = [
    "dynamic angle",
    "dynamic pose",
    "low-angle shot",
    "low angle",
    "looking at viewer",
    "from above",
    "from below",
    "upper body focus",
    "full body",
    "portrait",
    "close-up shot",
    "mid shot",
    "cowboy shot",
    "wide angle",
    "cinematic field of view",
    "perfect composition",
    "rule of thirds",
    "symmetrical",
    "asymmetrical",
    "bird's eye view",
]

# Style and technique tags
STYLE_TAGS = [
    "anime illustration",
    "semi-realistic anime illustration",
    "digital painting",
    "cel shading",
    "clean linework",
    "manga style lineart",
    "detailed",
    "highly detailed",
    "intricate details",
    "painterly",
    "flat color",
    "vibrant colors",
    "muted colors",
    "watercolor",
    "sketchy",
]

# Detail enhancement tags
DETAIL_TAGS = [
    "detailed eyes",
    "beautiful eye details",
    "detailed skin features",
    "floating hair",
    "flowing hair",
    "intricate details",
    "excellent depth of field",
    "reflections",
    "glossy",
    "textured",
    "highly detailed background",
]

# Aesthetic quality modifiers
AESTHETIC_TAGS = [
    "eye-catching",
    "beautiful",
    "vivid colors",
    "bright colors",
    "vibrant",
    "high contrast",
    "extreme contrast",
    "balanced colors",
    "atmospheric",
    "depth of field",
    "atmospheric perspective",
    "elegant",
    "stylish",
]

# Motion and dynamic elements
MOTION_TAGS = [
    "dynamic movement",
    "motion lines",
    "foreshortening",
    "wind",
    "floating",
    "flowing",
    "action pose",
    "speed lines",
]

# Poses - character stances and actions
POSES_TAGS = [
    "standing",
    "sitting",
    "lying",
    "squatting",
    "kneeling",
    "dynamic pose",
    "fighting stance",
    "crossed arms",
    "hand on hip",
    "peace sign",
    "holding object",
    "hands behind back",
    "stretching",
    "leaning",
    "jumping",
    "running",
    "crouching",
]

# Expressions - facial expressions and emotions
EXPRESSIONS_TAGS = [
    "smile",
    "grin",
    "laughing",
    "angry",
    "sad",
    "crying",
    "surprised",
    "neutral",
    "seductive",
    "wink",
    "tongue out",
    "blush",
    "pout",
    "closed eyes",
    "looking away",
    "smirk",
    "embarrassed",
    "frown",
    "scared",
]

# --- NEGATIVE TAGS ---

# General Quality Negatives
QUALITY_NEG_TAGS = [
    "worst quality",
    "low quality",
    "normal quality",
    "jpeg artifacts",
    "lowres",
    "blurry",
    "pixelated",
    "distorted",
    "low resolution",
]

# Anatomy and Body Negatives
ANATOMY_NEG_TAGS = [
    "bad anatomy",
    "bad hands",
    "missing fingers",
    "extra digit",
    "fewer digits",
    "extra limbs",
    "extra arms",
    "extra legs",
    "malformed limbs",
    "mutated hands",
    "mutated",
    "mutilated",
    "disfigured",
    "long neck",
    "gross proportions",
    "fused fingers",
    "too many fingers",
]

# Technical and Artifact Negatives
TECHNICAL_NEG_TAGS = [
    "watermark",
    "signature",
    "text",
    "error",
    "username",
    "cropped",
    "out of frame",
    "border",
    "caption",
    "copyright",
]

# Style and Aesthetic Negatives
STYLE_NEG_TAGS = [
    "sketch",
    "monochrome",
    "grayscale",
    "ugly",
    "duplicate",
    "morbid",
    "mutation",
    "deformed",
    "censored",
    "unbalanced colors",
]

# Combine all categories
ALL_CATEGORIES = {
    "Pos: Quality": QUALITY_TAGS,
    "Pos: Composition": COMPOSITION_TAGS,
    "Pos: Lighting": LIGHTING_TAGS,
    "Pos: Style": STYLE_TAGS,
    "Pos: Detail": DETAIL_TAGS,
    "Pos: Aesthetic": AESTHETIC_TAGS,
    "Pos: Motion": MOTION_TAGS,
    "Pos: Poses": POSES_TAGS,
    "Pos: Expressions": EXPRESSIONS_TAGS,
    "Neg: Quality": QUALITY_NEG_TAGS,
    "Neg: Anatomy": ANATOMY_NEG_TAGS,
    "Neg: Technical": TECHNICAL_NEG_TAGS,
    "Neg: Style": STYLE_NEG_TAGS,
}


def get_preset_tags(category="All", default_active=True, default_strength=None):
    """
    Get preset tags for a specific category.
    
    Args:
        category: Category name or "All" for all categories
        default_active: Default active state for tags
        default_strength: Default strength value (None for no strength)
        
    Returns:
        List of tag dictionaries with text, active, strength, and category
    """
    # Map legacy names to new names
    legacy_map = {
        "Quality": "Pos: Quality",
        "Lighting": "Pos: Lighting",
        "Composition": "Pos: Composition",
        "Style": "Pos: Style",
        "Detail": "Pos: Detail",
        "Aesthetic": "Pos: Aesthetic",
        "Motion": "Pos: Motion"
    }
    if category in legacy_map:
        category = legacy_map[category]

    tags = []
    
    if category == "All":
        for cat_name, cat_tags in ALL_CATEGORIES.items():
            for tag in cat_tags:
                tags.append({
                    "text": tag,
                    "active": default_active,
                    "strength": default_strength,
                    "category": cat_name,
                    "highlighted": False,
                })
    elif category == "Initial":
        # Default load: Quality and Composition
        for cat in ["Pos: Quality", "Pos: Composition"]:
            if cat in ALL_CATEGORIES:
                for tag in ALL_CATEGORIES[cat]:
                    tags.append({
                        "text": tag,
                        "active": default_active,
                        "strength": default_strength,
                        "category": cat,
                        "highlighted": False,
                    })
    elif category in ALL_CATEGORIES:
        for tag in ALL_CATEGORIES[category]:
            tags.append({
                "text": tag,
                "active": default_active,
                "strength": default_strength,
                "category": category,
                "highlighted": False,
            })
    
    return tags


def get_category_names():
    """Get list of all category names plus 'All' and 'Initial'."""
    legacy_names = ["Quality", "Lighting", "Composition", "Style", "Detail", "Aesthetic", "Motion"]
    return ["Initial", "All"] + list(ALL_CATEGORIES.keys()) + legacy_names


def merge_tags(preset_tags, incoming_tags, merge_strategy="keep_both"):
    """
    Merge preset tags with incoming tags (e.g., from other nodes).
    
    Args:
        preset_tags: List of preset tag dictionaries
        incoming_tags: List of incoming tag dictionaries
        merge_strategy: How to handle duplicates
            - "keep_both": Keep both, mark incoming as highlighted
            - "prefer_preset": Keep preset version, discard incoming duplicate
            - "prefer_incoming": Keep incoming version, discard preset duplicate
            
    Returns:
        Merged list of tags
    """
    if not incoming_tags:
        return preset_tags
    
    if not preset_tags:
        return incoming_tags
    
    # Build index map for O(1) lookups - maps normalized text to (index, tag)
    preset_map = {tag["text"].lower().strip(): (i, tag) for i, tag in enumerate(preset_tags)}
    result = list(preset_tags)  # Start with all presets
    
    for incoming_tag in incoming_tags:
        normalized_text = incoming_tag["text"].lower().strip()
        
        if normalized_text in preset_map:
            # Duplicate found
            if merge_strategy == "keep_both":
                # Mark as highlighted and add
                incoming_tag["highlighted"] = True
                result.append(incoming_tag)
            elif merge_strategy == "prefer_incoming":
                # Replace preset with incoming using indexed lookup (O(1))
                idx, _ = preset_map[normalized_text]
                result[idx] = incoming_tag
            # For "prefer_preset", do nothing (already in result)
        else:
            # Not a duplicate, add it
            incoming_tag["highlighted"] = True
            result.append(incoming_tag)
    
    return result


def deduplicate_tags(tags, case_sensitive=False):
    """
    Remove duplicate tags, keeping the first occurrence.
    
    Args:
        tags: List of tag dictionaries
        case_sensitive: Whether to consider case in duplicates
        
    Returns:
        List of unique tags
    """
    seen = set()
    result = []
    
    for tag in tags:
        key = tag["text"] if case_sensitive else tag["text"].lower().strip()
        if key not in seen:
            seen.add(key)
            result.append(tag)
    
    return result
