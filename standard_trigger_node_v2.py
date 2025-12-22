"""
Standard Trigger Words Loader Node V2
Clickable button tags interface for trigger word management.
"""

import json
import logging
import re
from .standard_trigger_presets import get_preset_tags, get_category_names

logger = logging.getLogger(__name__)


class StandardTriggerWordsLoader:
    """
    Standard Trigger Words Loader - Interactive button-based trigger word management.
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
                    "default": "Initial",
                    "tooltip": "Load preset trigger words from a specific category"
                }),
                "default_active": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "New trigger words start enabled (blue) or disabled (gray)"
                }),
                "allow_strength_adjustment": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Enable (word:1.2) strength syntax for weighted prompts"
                }),
            },
            "optional": {
                "prefix": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "tooltip": "Prefix string to prepend to the trigger words"
                }),
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
    def IS_CHANGED(cls, preset_category, default_active, allow_strength_adjustment, **kwargs):
        """Determine if node needs to re-execute based on input changes."""
        import hashlib
        modify_tags = kwargs.get("modify_tags", "")
        prefix = kwargs.get("prefix", "")
        lora_syntax = kwargs.get("lora_syntax", "")
        
        # Exact string to hash, matching the original's dependency on modify_tags
        input_string = f"{preset_category}_{default_active}_{allow_strength_adjustment}_{modify_tags}_{prefix}_{lora_syntax}"
        return hashlib.md5(input_string.encode()).hexdigest()

    def process_tags(self, preset_category, default_active, allow_strength_adjustment, **kwargs):
        """Process tags and output active trigger words."""
        try:
            # Get hidden tag data - CRITICAL: Hidden widgets come through **kwargs
            modify_tags = kwargs.get("modify_tags", "")
            prefix = kwargs.get("prefix", "")
            lora_syntax = kwargs.get("lora_syntax", "")
            
            # --- CRITICAL LEAK PREVENTION ---
            def is_json_leak(s):
                if not isinstance(s, str): return False
                s_strip = s.strip()
                return (s_strip.startswith('[{"') or s_strip.startswith('{"')) and '"text":' in s_strip

            # Wipe internal JSON leaks if they accidentally hit these inputs
            if is_json_leak(prefix): prefix = ""
            if is_json_leak(lora_syntax): lora_syntax = ""

            # Load the tags
            tags_list = []
            if modify_tags and isinstance(modify_tags, str) and '"text":' in modify_tags:
                try:
                    data = json.loads(modify_tags)
                    # Support both simple list and nested state object
                    if isinstance(data, dict) and "tags" in data:
                        tags_list = data["tags"]
                    elif isinstance(data, list):
                        tags_list = data
                except:
                    tags_list = []
            
            # Fallback to presets if no valid custom data found
            if not tags_list:
                tags_list = get_preset_tags(preset_category, default_active, 1.0)

            # Build active tags
            active_tags = []
            for tag in tags_list:
                if isinstance(tag, dict) and tag.get("active", False):
                    text = str(tag.get("text", "")).strip()
                    if not text or is_json_leak(text):
                        continue
                    
                    try:
                        strength = float(tag.get("strength", 1.0))
                    except:
                        strength = 1.0
                    
                    if allow_strength_adjustment and abs(strength - 1.0) > 0.001:
                        text = f"({text}:{strength:.2f})"
                    
                    active_tags.append(text)

            # --- ORIGINAL OUTPUT LOGIC ---
            # Prefix, Lora, and Tags are joined by spaces.
            # Tags within the group are joined by commas.
            output_parts = []
            if prefix and prefix.strip():
                output_parts.append(prefix.strip())
            if lora_syntax and lora_syntax.strip():
                output_parts.append(lora_syntax.strip())
            if active_tags:
                output_parts.append(", ".join(active_tags))
            
            output = " ".join(output_parts)

            # --- NUCLEAR SCRUBBING ---
            # If any internal keywords remain, wipe the whole thing
            if any(key in output for key in ['"text":', '"active":', '"strength":', '"category":']):
                logger.error("StandardTriggerWords: JSON LEAK DETECTED! Cleaning prompt...")
                output = re.sub(r'[\{\}\[\]"\'\\]', '', output)
                for key in ["text:", "active:", "strength:", "category:", "highlighted:", "true", "false"]:
                    output = output.replace(key, "")
                output = re.sub(r',\s*,', ',', output).strip()
                output = output.strip(',')

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
