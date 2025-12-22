"""
Standard Trigger Words Loader Node V2
Clickable button tags interface for trigger word management.
"""

import json
import logging
from .standard_trigger_presets import get_preset_tags, get_category_names

logger = logging.getLogger(__name__)


class StandardTriggerWordsLoader:
    """
    Standard Trigger Words Loader - Interactive button-based trigger word management.
    
    Features:
    - Clickable button tags for each trigger word
    - Click to toggle on/off
    - Right-click to edit
    - Mouse wheel to adjust strength
    - Outputs comma-separated trigger words for Trigger Word Toggle
    """
    
    DESCRIPTION = (
        "Interactive button-based trigger word management. "
        "Click buttons to toggle on/off, right-click to edit, scroll to adjust strength."
    )
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "preset_category": (get_category_names(), {
                    "default": "All",
                    "tooltip": "Load preset trigger words from a specific category"
                }),
                "default_active": ("BOOLEAN", {
                    "default": True,
                    "tooltip": "New trigger words start enabled (blue) or disabled (gray)"
                }),
                "allow_strength_adjustment": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Enable (word:1.2) strength syntax for weighted prompts"
                }),
            },
            "optional": {
                "lora_syntax": ("STRING", {
                    "forceInput": True,
                    "tooltip": "Connect 'loaded_loras' from Lora Loader for <lora:name:strength> syntax"
                }),
            },
            "hidden": {
                "id": "UNIQUE_ID",
                "prompt": "PROMPT",
                "extra_pnginfo": "EXTRA_PNGINFO",
                "modify_tags": "STRING",  # Hidden widget to store tag states
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("trigger_words",)
    OUTPUT_TOOLTIPS = ("Comma-separated active trigger words (connect to Trigger Word Toggle)",)
    FUNCTION = "process_tags"
    CATEGORY = "trigger_words"
    OUTPUT_NODE = False

    @classmethod
    def VALIDATE_INPUTS(cls, preset_category, default_active, allow_strength_adjustment, **kwargs):
        """Validate inputs before execution."""
        # Validate preset category
        valid_categories = get_category_names()
        if preset_category not in valid_categories:
            return f"Invalid preset_category: {preset_category}. Must be one of {valid_categories}"
        
        # Validate boolean types
        if not isinstance(default_active, bool):
            return "default_active must be a boolean"
        if not isinstance(allow_strength_adjustment, bool):
            return "allow_strength_adjustment must be a boolean"
        
        # Validate modify_tags if present
        if "modify_tags" in kwargs:
            modify_tags = kwargs["modify_tags"]
            if modify_tags:
                try:
                    tags_data = json.loads(modify_tags) if isinstance(modify_tags, str) else modify_tags
                    if not isinstance(tags_data, list):
                        return "modify_tags must be a JSON array"
                    for tag in tags_data:
                        if not isinstance(tag, dict):
                            return "Each tag in modify_tags must be an object"
                        if "text" not in tag:
                            return "Each tag must have a 'text' property"
                except json.JSONDecodeError:
                    return "modify_tags must be valid JSON"
        
        return True

    @classmethod
    def IS_CHANGED(cls, preset_category, default_active, allow_strength_adjustment, **kwargs):
        """Determine if node needs to re-execute based on input changes."""
        import hashlib
        modify_tags = kwargs.get("modify_tags", "")
        input_string = f"{preset_category}_{default_active}_{allow_strength_adjustment}_{modify_tags}"
        return hashlib.md5(input_string.encode()).hexdigest()

    def process_tags(self, preset_category, default_active, allow_strength_adjustment, **kwargs):
        """Process tags and output active trigger words."""
        try:
            # Get custom tag data from hidden widget
            modify_tags_data = kwargs.get("modify_tags", None)
            
            # Parse modify_tags if it's a string (JSON)
            if isinstance(modify_tags_data, str) and modify_tags_data:
                try:
                    tags_list = json.loads(modify_tags_data)
                except json.JSONDecodeError:
                    logger.error(f"Failed to parse modify_tags JSON: {modify_tags_data}")
                    tags_list = []
            elif isinstance(modify_tags_data, list):
                tags_list = modify_tags_data
            else:
                # No custom tags yet, load from preset
                preset_tags = get_preset_tags(preset_category, default_active, 1.0)
                tags_list = preset_tags

            # Filter active tags and build output string from button tags
            active_tags = []
            for tag in tags_list:
                if isinstance(tag, dict) and tag.get("active", False):
                    text = tag.get("text", "")
                    # Ensure strength is a valid float, default to 1.0
                    try:
                        strength = float(tag.get("strength", 1.0))
                    except (TypeError, ValueError):
                        strength = 1.0
                    
                    # Apply strength formatting if enabled and strength != 1.0
                    if allow_strength_adjustment and abs(strength - 1.0) > 0.001:
                        text = f"({text}:{strength:.2f})"
                    
                    if text:
                        active_tags.append(text)

            # Get lora syntax (e.g., <lora:name:strength>)
            lora_syntax = kwargs.get("lora_syntax", "")
            
            # Build final output: lora syntax first, then trigger words
            output_parts = []
            if lora_syntax:
                output_parts.append(lora_syntax.strip())
            if active_tags:
                output_parts.append(", ".join(active_tags))
            
            output = " ".join(output_parts)
            
            logger.info(f"StandardTriggerWordsLoader: Output {len(active_tags)} active trigger words")
            return (output,)
            
        except Exception as e:
            logger.error(f"Error in process_tags: {str(e)}")
            return ("",)


# Node registration
NODE_CLASS_MAPPINGS = {
    "StandardTriggerWordsLoader": StandardTriggerWordsLoader
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "StandardTriggerWordsLoader": "Standard Trigger Words 📝"
}
