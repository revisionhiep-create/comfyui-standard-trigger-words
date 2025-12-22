/**
 * Standard Trigger Words Loader - Interactive Button Tags UI
 * Similar to Lora Manager's Trigger Word Toggle
 */

import { app } from "../../scripts/app.js";

// Embedded Presets
const TRIGGER_WORD_PRESETS = {
    "Quality": [
        "masterpiece", "best quality", "very aesthetic", "absurdres", "high quality",
        "ultra high definition", "extremely high detail", "newest", "year 2024",
        "year 2025", "highres", "8K", "HDR"
    ],
    "Lighting": [
        "volumetric lighting", "ambient occlusion", "dramatic lighting", "cinematic lighting",
        "rim light", "soft lighting", "studio lighting", "golden hour lighting",
        "natural lighting", "sunlight", "backlighting", "sharp focus", "glowing",
        "luminescent background"
    ],
    "Composition": [
        "dynamic angle", "dynamic pose", "low-angle shot", "low angle", "looking at viewer",
        "from above", "from below", "upper body focus", "full body", "portrait",
        "close-up shot", "mid shot", "cowboy shot", "wide angle", "cinematic field of view",
        "perfect composition", "rule of thirds"
    ],
    "Style": [
        "anime illustration", "semi-realistic anime illustration", "digital painting",
        "cel shading", "clean linework", "manga style lineart", "detailed",
        "highly detailed", "intricate details", "painterly"
    ],
    "Detail": [
        "detailed eyes", "beautiful eye details", "detailed skin features", "detailed face features",
        "detailed hair features", "expressive eyes", "intricate iris", "detailed clothing",
        "detailed background", "fine texture details"
    ],
    "Aesthetic": [
        "beautiful", "amazing", "stunning", "gorgeous", "perfect", "flawless",
        "eye-catching", "stylish", "elegant", "aesthetic"
    ],
    "Motion": [
        "motion blur", "motion lines", "action pose", "dynamic action", "movement",
        "speed lines", "flowing", "fluid motion"
    ]
};

// Combine all categories for "All"
TRIGGER_WORD_PRESETS["All"] = Object.values(TRIGGER_WORD_PRESETS).flat();

function getPresetTags(category, defaultActive = true, defaultStrength = 1.0) {
    if (category === "All") {
        const allTags = [];
        for (const [catName, words] of Object.entries(TRIGGER_WORD_PRESETS)) {
            if (catName === "All") continue;
            words.forEach(text => {
                allTags.push({
                    text: text,
                    active: defaultActive,
                    strength: defaultStrength,
                    category: catName,
                    highlighted: false
                });
            });
        }
        return allTags;
    }
    
    const words = TRIGGER_WORD_PRESETS[category] || [];
    return words.map(text => ({
        text: text,
        active: defaultActive,
        strength: defaultStrength,
        category: category,
        highlighted: false
    }));
}

// Wheel sensitivity cache
let wheelSensitivityCache = null;
let wheelSensitivityTime = 0;

function getWheelSensitivity() {
    const now = Date.now();
    if (wheelSensitivityCache && (now - wheelSensitivityTime) < 5000) {
        return wheelSensitivityCache;
    }
    
    const setting = app.ui.settings.getSettingValue("AegisFlow.WheelScrollSpeed", 0.02);
    wheelSensitivityCache = parseFloat(setting) || 0.02;
    wheelSensitivityTime = now;
    return wheelSensitivityCache;
}

function createTagsWidget(node, name, opts = {}) {
    // Create container for tags
    const container = document.createElement("div");
    container.className = "comfy-tags-container";
    
    Object.assign(container.style, {
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        padding: "6px",
        backgroundColor: "rgba(40, 44, 52, 0.6)",
        borderRadius: "6px",
        width: "100%",
        boxSizing: "border-box",
        overflow: "auto",
        minHeight: "150px",
        alignItems: "flex-start"
    });

    // Widget object
    const widget = {
        type: "custom_tags",
        name: name,
        value: opts.defaultVal || [],
        options: opts,
        draw: function(ctx, node, widgetWidth, y, widgetHeight) {
            // Don't draw in canvas, we use DOM
        },
        computeSize: function(width) {
            const tagsCount = this.value?.length || 0;
            const TAG_HEIGHT = 26;
            const TAGS_PER_ROW = 3;
            const ROW_GAP = 2;
            const PADDING = 12;
            const rows = Math.max(1, Math.ceil(tagsCount / TAGS_PER_ROW));
            const height = PADDING + (rows * TAG_HEIGHT) + ((rows - 1) * ROW_GAP);
            return [width, Math.max(150, height)];
        },
        serializeValue: function() {
            try {
                if (!Array.isArray(this.value)) {
                    return JSON.stringify([]);
                }
                return JSON.stringify(this.value);
            } catch (error) {
                console.error("StandardTriggerWords: Error serializing tags:", error);
                return JSON.stringify([]);
            }
        },
        mouse: function(event, pos, node) {
            return false; // Let DOM handle events
        }
    };

    // Function to render tags
    const renderTags = (tagsData) => {
        // Clear existing tags
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        if (!Array.isArray(tagsData) || tagsData.length === 0) {
            const emptyMessage = document.createElement("div");
            emptyMessage.textContent = "No trigger words loaded";
            Object.assign(emptyMessage.style, {
                textAlign: "center",
                padding: "20px 0",
                color: "rgba(226, 232, 240, 0.8)",
                fontStyle: "italic",
                userSelect: "none",
                width: "100%"
            });
            container.appendChild(emptyMessage);
            return;
        }

        const showStrength = widget.allowStrengthAdjustment || false;

        tagsData.forEach((tagData, index) => {
            const { text, active, strength } = tagData;
            const tagEl = document.createElement("div");
            tagEl.className = "comfy-tag";

            // Text span
            const textSpan = document.createElement("span");
            textSpan.className = "comfy-tag-text";
            textSpan.textContent = text;
            Object.assign(textSpan.style, {
                display: "inline-block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: "0",
                flexGrow: "1",
            });
            tagEl.appendChild(textSpan);

            // Strength badge
            let strengthBadge = null;
            if (showStrength) {
                strengthBadge = document.createElement("span");
                strengthBadge.className = "comfy-tag-strength";
                strengthBadge.textContent = strength ? strength.toFixed(2) : "1.00";
                Object.assign(strengthBadge.style, {
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "1px 6px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    minWidth: "34px",
                    textAlign: "center",
                    opacity: active ? "1" : "0.3",
                    transition: "opacity 0.2s ease",
                });
                tagEl.appendChild(strengthBadge);
            }

            // Style the tag
            updateTagStyle(tagEl, active, strength);

            // Click to toggle
            tagEl.addEventListener("click", (e) => {
                e.stopPropagation();
                
                const updatedTags = [...widget.value];
                updatedTags[index].active = !updatedTags[index].active;
                updateTagStyle(tagEl, updatedTags[index].active, updatedTags[index].strength);
                
                if (strengthBadge) {
                    strengthBadge.style.opacity = updatedTags[index].active ? "1" : "0.3";
                }
                
                widget.value = updatedTags;
                node.setDirtyCanvas(true, false);
            });

            // Right-click to edit
            tagEl.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const newText = prompt("Edit trigger word:", text);
                if (newText && newText.trim() !== "") {
                    const updatedTags = [...widget.value];
                    updatedTags[index].text = newText.trim();
                    textSpan.textContent = newText.trim();
                    widget.value = updatedTags;
                    node.setDirtyCanvas(true, false);
                }
            });

            // Scroll to adjust strength
            if (showStrength) {
                tagEl.addEventListener("wheel", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const updatedTags = [...widget.value];
                    let currentStrength = updatedTags[index].strength || 1.0;
                    const wheelSensitivity = getWheelSensitivity();
                    
                    if (e.deltaY < 0) {
                        currentStrength += wheelSensitivity;
                    } else {
                        currentStrength -= wheelSensitivity;
                    }
                    
                    currentStrength = Math.max(0, Math.min(2.0, currentStrength));
                    updatedTags[index].strength = currentStrength;
                    
                    if (strengthBadge) {
                        strengthBadge.textContent = currentStrength.toFixed(2);
                    }
                    
                    widget.value = updatedTags;
                    node.setDirtyCanvas(true, false);
                });
            }

            container.appendChild(tagEl);
        });
    };

    // Function to update tag style
    function updateTagStyle(tagEl, active, strength) {
        const baseStyles = {
            padding: "3px 10px",
            borderRadius: "6px",
            maxWidth: "200px",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            border: "1px solid transparent",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            margin: "1px",
            userSelect: "none",
            height: "22px",
            lineHeight: "16px",
        };

        const activeStyles = active ? {
            backgroundColor: "rgba(59, 130, 246, 0.85)",
            color: "#ffffff",
            borderColor: "rgba(96, 165, 250, 0.8)",
        } : {
            backgroundColor: "rgba(100, 116, 139, 0.3)",
            color: "rgba(203, 213, 225, 0.6)",
            borderColor: "rgba(148, 163, 184, 0.4)",
        };

        Object.assign(tagEl.style, { ...baseStyles, ...activeStyles });
    }

    // Store initial value
    widget._value = opts.defaultVal || [];
    
    // Expose renderTags for external access
    widget.renderTags = renderTags;

    // Watch for value changes
    Object.defineProperty(widget, 'value', {
        get() {
            return widget._value || [];
        },
        set(newValue) {
            widget._value = newValue;
            renderTags(newValue);
        }
    });

    // Add DOM widget to node
    widget.element = container;
    const domWidget = node.addDOMWidget(name, "custom_tags", container, {
        getValue() {
            return widget.value;
        },
        setValue(v) {
            widget.value = v;
        }
    });

    // Initial render after DOM widget is added - with error handling
    try {
        renderTags(widget._value);
        // Force canvas redraw to ensure buttons appear
        setTimeout(() => {
            if (node && node.setDirtyCanvas) {
                node.setDirtyCanvas(true, true);
            }
        }, 100);
    } catch (e) {
        console.error("Failed to render initial tags:", e);
        widget._value = [];
        renderTags([]);
    }

    return widget;
}

app.registerExtension({
    name: "StandardTriggerWordsLoader",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        console.log("StandardTriggerWordsLoader: Extension registered, checking node...", nodeData.name);
        if (nodeData.name === "StandardTriggerWordsLoader") {
            console.log("StandardTriggerWordsLoader: Found matching node, setting up...");
            const onNodeCreated = nodeType.prototype.onNodeCreated;

            nodeType.prototype.onNodeCreated = function() {
                console.log("StandardTriggerWordsLoader: onNodeCreated called");
                const result = onNodeCreated?.apply(this, arguments);
                const node = this;
                console.log("StandardTriggerWordsLoader: Node widgets:", node.widgets.map(w => w.name));

                // Find or create hidden widget for storing tag data
                let modifyTagsWidget = node.widgets.find(w => w.name === "modify_tags");
                if (!modifyTagsWidget) {
                    modifyTagsWidget = node.addWidget("text", "modify_tags", "", () => {});
                    modifyTagsWidget.type = "hidden";
                }
                // Ensure the widget is always hidden and has the correct serialization options
                modifyTagsWidget.serializeValue = function() {
                    return this.value || "";
                };

                // Get other widgets
                const allowStrengthWidget = node.widgets.find(w => w.name === "allow_strength_adjustment");
                const categoryWidget = node.widgets.find(w => w.name === "preset_category");
                const defaultActiveWidget = node.widgets.find(w => w.name === "default_active");
                
                // Create tags widget
                const tagsWidget = createTagsWidget(node, "trigger_words_display", {
                    defaultVal: []
                });
                
                // Link tags widget to hidden widget for serialization
                const originalValueDescriptor = Object.getOwnPropertyDescriptor(tagsWidget, 'value');
                const originalSetter = originalValueDescriptor.set;
                const originalGetter = originalValueDescriptor.get;
                
                Object.defineProperty(tagsWidget, 'value', {
                    get() {
                        return originalGetter.call(tagsWidget);
                    },
                    set(newValue) {
                        // Call original setter (which handles rendering)
                        originalSetter.call(tagsWidget, newValue);
                        // Also update hidden widget for serialization
                        if (modifyTagsWidget) {
                            const serialized = JSON.stringify(newValue);
                            if (modifyTagsWidget.value !== serialized) {
                                modifyTagsWidget.value = serialized;
                            }
                        }
                    }
                });
                
                // CRITICAL: Also link hidden widget changes back to tags widget
                // This handles cases where ComfyUI populates the hidden widget after initialization
                let lastKnownValue = modifyTagsWidget.value;
                const updateFromHidden = () => {
                    if (modifyTagsWidget.value && modifyTagsWidget.value !== lastKnownValue) {
                        try {
                            const tags = JSON.parse(modifyTagsWidget.value);
                            if (Array.isArray(tags)) {
                                lastKnownValue = modifyTagsWidget.value;
                                tagsWidget.value = tags;
                            }
                        } catch (e) {
                            console.error("StandardTriggerWords: Failed to sync from hidden widget:", e);
                        }
                    }
                };
                
                // Set up an interval or a proxy to watch the hidden widget
                // ComfyUI doesn't always trigger callbacks for internal value sets
                const syncTimer = setInterval(() => {
                    if (!node.graph) { // Node was deleted
                        clearInterval(syncTimer);
                        return;
                    }
                    updateFromHidden();
                }, 500);

                // Link strength setting to widget
                tagsWidget.allowStrengthAdjustment = allowStrengthWidget?.value || false;
                
                if (allowStrengthWidget) {
                    const originalCallback = allowStrengthWidget.callback;
                    allowStrengthWidget.callback = function() {
                        tagsWidget.allowStrengthAdjustment = this.value;
                        if (originalCallback) {
                            originalCallback.apply(this, arguments);
                        }
                    };
                }

                // Store node reference in tagsWidget for forced redraws
                tagsWidget._node = node;
                
                // Load presets when category changes
                if (categoryWidget) {
                    const originalCallback = categoryWidget.callback;
                    categoryWidget.callback = function() {
                        const category = this.value;
                        const defaultActive = defaultActiveWidget?.value ?? true;
                        loadPresetForCategory(category, defaultActive, tagsWidget);
                        
                        if (originalCallback) {
                            originalCallback.apply(this, arguments);
                        }
                    };
                    
                    // Initial load - check if we have saved data
                    if (modifyTagsWidget.value && modifyTagsWidget.value !== "") {
                        try {
                            const savedTags = JSON.parse(modifyTagsWidget.value);
                            if (Array.isArray(savedTags) && savedTags.length > 0) {
                                tagsWidget.value = savedTags;
                                // Force redraw after loading saved data
                                setTimeout(() => node.setDirtyCanvas(true, true), 50);
                            } else {
                                throw new Error("Invalid saved tags format");
                            }
                        } catch (e) {
                            console.error("Failed to parse saved tags:", e, "Value:", modifyTagsWidget.value);
                            // Load default preset
                            const initialCategory = categoryWidget.value || "Quality";
                            const initialDefaultActive = defaultActiveWidget?.value ?? true;
                            loadPresetForCategory(initialCategory, initialDefaultActive, tagsWidget);
                        }
                    } else {
                        // Load default preset
                        const initialCategory = categoryWidget.value || "Quality";
                        const initialDefaultActive = defaultActiveWidget?.value ?? true;
                        loadPresetForCategory(initialCategory, initialDefaultActive, tagsWidget);
                    }
                }

                // Add batch operation buttons
                node.addWidget("button", "Toggle All ON", null, () => {
                    const updatedTags = tagsWidget.value.map(tag => ({ ...tag, active: true }));
                    tagsWidget.value = updatedTags;
                    node.setDirtyCanvas(true, false);
                });

                node.addWidget("button", "Toggle All OFF", null, () => {
                    const updatedTags = tagsWidget.value.map(tag => ({ ...tag, active: false }));
                    tagsWidget.value = updatedTags;
                    node.setDirtyCanvas(true, false);
                });

                // Handle state restoration when loading workflows
                const onConfigure = node.onConfigure;
                node.onConfigure = function() {
                    if (onConfigure) onConfigure.apply(this, arguments);
                    if (modifyTagsWidget.value) {
                        try {
                            const tags = JSON.parse(modifyTagsWidget.value);
                            if (Array.isArray(tags) && tags.length > 0) {
                                tagsWidget.value = tags;
                            }
                        } catch (e) {}
                    }
                };

                // Set default node size on first creation
                if (!node.size || node.size[0] < 400) {
                    node.setSize([750, 550]);
                }

                return result;
            };
        }
    }
});

// Helper to load presets
function loadPresetForCategory(category, defaultActive, tagsWidget) {
    try {
        const tags = getPresetTags(category, defaultActive, 1.0);
        console.log(`Loading preset ${category} with ${tags.length} tags`);
        
        if (!tags || tags.length === 0) {
            console.warn("No tags loaded for category:", category);
            tagsWidget.value = [];
            return;
        }
        
        tagsWidget.value = tags;
        
        // Force canvas redraw after loading to ensure buttons appear
        if (tagsWidget._node && tagsWidget._node.setDirtyCanvas) {
            tagsWidget._node.setDirtyCanvas(true, true);
        }
    } catch (e) {
        console.error("Failed to load preset:", e);
        tagsWidget.value = [];
    }
}
