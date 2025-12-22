/**
 * Standard Trigger Words Loader - Robust Sync & Multi-Category UI
 */

import { app } from "../../scripts/app.js";

// Embedded Presets
const TRIGGER_WORD_PRESETS = {
    "Pos: Quality": [
        "masterpiece", "best quality", "very aesthetic", "absurdres", "high quality",
        "ultra high definition", "extremely high detail", "newest", "year 2024",
        "year 2025", "highres", "8K", "HDR", "score_9", "score_8_up", "score_7_up"
    ],
    "Pos: Lighting": [
        "volumetric lighting", "ambient occlusion", "dramatic lighting", "cinematic lighting",
        "rim light", "soft lighting", "studio lighting", "golden hour lighting",
        "natural lighting", "sunlight", "backlighting", "sharp focus", "glowing",
        "luminescent background", "bioluminescence", "ray tracing", "reflection"
    ],
    "Pos: Composition": [
        "dynamic angle", "dynamic pose", "low-angle shot", "low angle", "looking at viewer",
        "from above", "from below", "upper body focus", "full body", "portrait",
        "close-up shot", "mid shot", "cowboy shot", "wide angle", "cinematic field of view",
        "perfect composition", "rule of thirds", "symmetrical", "asymmetrical", "bird's eye view"
    ],
    "Pos: Poses": [
        "standing", "sitting", "lying", "squatting", "kneeling", "dynamic pose",
        "fighting stance", "crossed arms", "hand on hip", "peace sign", "holding object",
        "hands behind back", "stretching", "leaning", "jumping", "running", "crouching"
    ],
    "Pos: Expressions": [
        "smile", "grin", "laughing", "angry", "sad", "crying", "surprised", "neutral",
        "seductive", "wink", "tongue out", "blush", "pout", "closed eyes", "looking away",
        "smirk", "embarrassed", "frown", "scared"
    ],
    "Pos: Style": [
        "anime illustration", "semi-realistic anime illustration", "digital painting",
        "cel shading", "clean linework", "manga style lineart", "detailed",
        "highly detailed", "intricate details", "painterly", "flat color",
        "vibrant colors", "muted colors", "watercolor", "sketchy"
    ],
    "Pos: Detail": [
        "detailed eyes", "beautiful eye details", "detailed skin features", "detailed face features",
        "detailed hair features", "expressive eyes", "intricate iris", "detailed clothing",
        "detailed background", "fine texture details", "floating hair", "flowing hair",
        "textured", "highly detailed background"
    ],
    "Pos: Aesthetic": [
        "beautiful", "amazing", "stunning", "gorgeous", "perfect", "flawless",
        "eye-catching", "stylish", "elegant", "aesthetic", "vivid colors",
        "bright colors", "vibrant", "high contrast", "extreme contrast"
    ],
    "Pos: Motion": [
        "dynamic movement", "motion lines", "foreshortening", "wind", "floating",
        "flowing", "action pose", "speed lines"
    ],
    "Neg: Quality": [
        "worst quality", "low quality", "normal quality", "jpeg artifacts", "lowres",
        "blurry", "pixelated", "distorted", "low resolution"
    ],
    "Neg: Anatomy": [
        "bad anatomy", "bad hands", "missing fingers", "extra digit", "fewer digits",
        "extra limbs", "extra arms", "extra legs", "malformed limbs", "mutated hands",
        "mutated", "mutilated", "disfigured", "long neck", "gross proportions",
        "fused fingers", "too many fingers"
    ],
    "Neg: Technical": [
        "watermark", "signature", "text", "error", "username", "cropped",
        "out of frame", "border", "caption", "copyright"
    ],
    "Neg: Style": [
        "sketch", "monochrome", "grayscale", "ugly", "duplicate", "morbid",
        "mutation", "deformed", "censored", "unbalanced colors"
    ]
};

const ALL_CATEGORY_NAMES = Object.keys(TRIGGER_WORD_PRESETS);

function getWheelSensitivity() {
    return parseFloat(app.ui.settings.getSettingValue("AegisFlow.WheelScrollSpeed", 0.02)) || 0.02;
}

function createTagsWidget(node, name, opts = {}) {
    const mainContainer = document.createElement("div");
    mainContainer.className = "standard-trigger-main-container";
    
    Object.assign(mainContainer.style, {
        display: "flex", flexDirection: "column", gap: "10px", padding: "10px",
        backgroundColor: "#1c1c1e", borderRadius: "10px", width: "100%",
        boxSizing: "border-box", border: "1px solid #3a3a3c", color: "#ffffff",
        flexGrow: "1"
    });

    const header = document.createElement("div");
    Object.assign(header.style, {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: "8px", borderBottom: "1px solid #3a3a3c", width: "100%"
    });

    const menuBtn = document.createElement("button");
    menuBtn.innerHTML = "☰ Categories";
    Object.assign(menuBtn.style, {
        backgroundColor: "#3a3a3c", border: "none", color: "white", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "bold"
    });

    const title = document.createElement("div");
    title.textContent = "Trigger Words";
    Object.assign(title.style, { fontSize: "13px", fontWeight: "bold", opacity: "0.8" });

    const batchControls = document.createElement("div");
    batchControls.style.display = "flex";
    batchControls.style.gap = "4px";

    const allOnBtn = document.createElement("button");
    allOnBtn.textContent = "ON";
    const allOffBtn = document.createElement("button");
    allOffBtn.textContent = "OFF";
    [allOnBtn, allOffBtn].forEach(btn => {
        Object.assign(btn.style, {
            backgroundColor: "#3a3a3c", border: "none", color: "white", borderRadius: "4px", padding: "4px 8px", fontSize: "10px", cursor: "pointer"
        });
    });

    batchControls.appendChild(allOnBtn);
    batchControls.appendChild(allOffBtn);
    header.appendChild(menuBtn);
    header.appendChild(title);
    header.appendChild(batchControls);
    mainContainer.appendChild(header);

    const contentArea = document.createElement("div");
    Object.assign(contentArea.style, {
        display: "flex", flexDirection: "column", gap: "12px", maxHeight: "1200px", overflowY: "auto", paddingRight: "4px", scrollbarWidth: "thin", width: "100%", flexGrow: "1"
    });
    mainContainer.appendChild(contentArea);

    const widget = {
        type: "custom_tags",
        name: name,
        _value: { tags: [], activeCategories: ["Pos: Quality", "Pos: Composition"] },
        draw: function(ctx, node, widgetWidth, y, widgetHeight) {},
        computeSize: function(width) { return [width, Math.max(400, node.size[1] - 150)]; },
        serializeValue: function() { return JSON.stringify(this.value); },
        get value() { return this._value; },
        set value(v) { 
            if (Array.isArray(v)) {
                this._value.tags = v;
            } else if (v && typeof v === 'object') {
                this._value = v;
            }
            renderAll(); 
            const modWidget = node.widgets.find(w => w.name === "modify_tags");
            if (modWidget) {
                const json = JSON.stringify(this._value);
                if (modWidget.value !== json) {
                    modWidget.value = json;
                    if (modWidget.callback) modWidget.callback(json);
                }
            }
        }
    };

    menuBtn.onclick = (e) => {
        e.stopPropagation();
        const rect = menuBtn.getBoundingClientRect();
        const menu = document.createElement("div");
        Object.assign(menu.style, {
            position: "fixed", top: `${rect.bottom + 5}px`, left: `${rect.left}px`,
            backgroundColor: "#2c2c2e", border: "1px solid #3a3a3c", borderRadius: "8px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.4)", zIndex: "1000", padding: "6px", minWidth: "160px"
        });

        ALL_CATEGORY_NAMES.forEach(cat => {
            const item = document.createElement("div");
            const isActive = widget.value.activeCategories.includes(cat);
            item.innerHTML = `<span style="width:16px;display:inline-block">${isActive ? "✓" : ""}</span> ${cat}`;
            Object.assign(item.style, {
                padding: "8px 10px", cursor: "pointer", borderRadius: "4px", fontSize: "12px",
                color: cat.startsWith("Neg") ? "#ff453a" : (cat.startsWith("Pos") ? "#30d158" : "#ffffff")
            });
            item.onmouseover = () => item.style.backgroundColor = "rgba(255,255,255,0.05)";
            item.onmouseout = () => item.style.backgroundColor = "transparent";
            item.onclick = (ev) => {
                ev.stopPropagation();
                const newValue = { ...widget.value };
                if (isActive) {
                    newValue.activeCategories = newValue.activeCategories.filter(c => c !== cat);
                } else {
                    newValue.activeCategories.push(cat);
                    (TRIGGER_WORD_PRESETS[cat] || []).forEach(text => {
                        if (!newValue.tags.find(t => t.text === text && t.category === cat)) {
                            // Default all new words to OFF
                            newValue.tags.push({ text, active: false, strength: 1.0, category: cat });
                        }
                    });
                }
                widget.value = newValue;
                if (document.body.contains(menu)) document.body.removeChild(menu);
            };
            menu.appendChild(item);
        });

        const closeMenu = (ev) => { if (document.body.contains(menu) && !menu.contains(ev.target)) { document.body.removeChild(menu); window.removeEventListener("click", closeMenu); } };
        setTimeout(() => window.addEventListener("click", closeMenu), 0);
        document.body.appendChild(menu);
    };

    allOnBtn.onclick = () => { 
        widget.value = { ...widget.value, tags: widget.value.tags.map(t => ({...t, active: true})) }; 
        node.setDirtyCanvas(true, false); 
    };
    allOffBtn.onclick = () => { 
        widget.value = { ...widget.value, tags: widget.value.tags.map(t => ({...t, active: false})) }; 
        node.setDirtyCanvas(true, false); 
    };

    const renderAll = () => {
        while (contentArea.firstChild) contentArea.removeChild(contentArea.firstChild);

        widget.value.activeCategories.forEach(catName => {
            const section = document.createElement("div");
            Object.assign(section.style, { display: "flex", flexDirection: "column", gap: "6px", width: "100%" });

            const secHeader = document.createElement("div");
            Object.assign(secHeader.style, { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px", width: "100%" });
            const secTitle = document.createElement("div");
            secTitle.textContent = catName;
            Object.assign(secTitle.style, { fontSize: "11px", fontWeight: "bold", color: catName.startsWith("Neg") ? "#ff453a" : "#30d158", opacity: "0.8" });
            
            const addRow = document.createElement("div");
            Object.assign(addRow.style, { display: "flex", gap: "4px", flexGrow: "1", marginLeft: "10px" });
            
            const addInput = document.createElement("input");
            addInput.placeholder = "Add...";
            Object.assign(addInput.style, {
                backgroundColor: "#2c2c2e", border: "1px solid #3a3a3c", color: "white",
                borderRadius: "4px", padding: "2px 6px", fontSize: "10px", flexGrow: "1", outline: "none"
            });
            
            const addBtn = document.createElement("button");
            addBtn.innerHTML = "+";
            Object.assign(addBtn.style, {
                backgroundColor: "#3a3a3c", border: "none", color: "white", borderRadius: "4px",
                padding: "2px 8px", cursor: "pointer", fontSize: "12px"
            });
            
            const performAdd = () => {
                const text = addInput.value.trim();
                if (text) {
                    const newValue = { ...widget.value };
                    newValue.tags = [...newValue.tags, { text, active: false, strength: 1.0, category: catName }];
                    widget.value = newValue;
                    addInput.value = "";
                    node.setDirtyCanvas(true, false);
                }
            };
            addBtn.onclick = (e) => { e.stopPropagation(); performAdd(); };
            addInput.onkeydown = (e) => { if (e.key === "Enter") { e.stopPropagation(); performAdd(); } };

            addRow.appendChild(addInput);
            addRow.appendChild(addBtn);
            secHeader.appendChild(secTitle);
            secHeader.appendChild(addRow);
            section.appendChild(secHeader);

            const grid = document.createElement("div");
            Object.assign(grid.style, { 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(calc(50% - 6px), 1fr))", 
                gap: "6px", 
                width: "100%" 
            });

            const tagsInCat = widget.value.tags.filter(t => t.category === catName);
            tagsInCat.forEach(tagData => {
                const item = document.createElement("div");
                Object.assign(item.style, {
                    display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px",
                    backgroundColor: "#2c2c2e", borderRadius: "6px", border: "1px solid #3a3a3c", minWidth: "0", width: "100%", boxSizing: "border-box"
                });

                const toggle = document.createElement("div");
                Object.assign(toggle.style, {
                    width: "28px", height: "16px",
                    backgroundColor: tagData.active ? (catName.startsWith("Neg") ? "#ff453a" : "#30d158") : "#48484a",
                    borderRadius: "10px", position: "relative", cursor: "pointer", transition: "0.2s", flexShrink: "0"
                });
                const knob = document.createElement("div");
                Object.assign(knob.style, { width: "12px", height: "12px", backgroundColor: "white", borderRadius: "50%", position: "absolute", top: "2px", left: tagData.active ? "14px" : "2px", transition: "0.2s" });
                toggle.appendChild(knob);

                const label = document.createElement("span");
                label.textContent = tagData.text;
                Object.assign(label.style, { fontSize: "11px", color: tagData.active ? "#ffffff" : "#8e8e93", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer", flexGrow: "1", minWidth: "0" });

                const handleToggle = (e) => { 
                    e.stopPropagation(); 
                    widget.value = { ...widget.value, tags: widget.value.tags.map(t => t === tagData ? {...t, active: !t.active} : t) };
                    node.setDirtyCanvas(true, false); 
                };
                toggle.onclick = handleToggle;
                label.onclick = handleToggle;

                label.ondblclick = (e) => {
                    e.stopPropagation();
                    const input = document.createElement("input");
                    input.value = tagData.text;
                    Object.assign(input.style, {
                        width: "100%", fontSize: "11px", backgroundColor: "#1c1c1e", color: "white", border: "none", outline: "none"
                    });
                    const saveEdit = () => {
                        if (input.value.trim() && input.value.trim() !== tagData.text) {
                            widget.value = { ...widget.value, tags: widget.value.tags.map(t => t === tagData ? {...t, text: input.value.trim()} : t) };
                        } else { renderAll(); }
                    };
                    input.onblur = saveEdit;
                    input.onkeydown = (ev) => { if (ev.key === "Enter") saveEdit(); };
                    label.textContent = "";
                    label.appendChild(input);
                    input.focus();
                };

                const delBtn = document.createElement("div");
                delBtn.innerHTML = "×";
                Object.assign(delBtn.style, { color: "#ff453a", cursor: "pointer", padding: "0 4px", fontSize: "14px", fontWeight: "bold", opacity: "0.4" });
                delBtn.onmouseover = () => delBtn.style.opacity = "1";
                delBtn.onmouseout = () => delBtn.style.opacity = "0.4";
                delBtn.onclick = (e) => { 
                    e.stopPropagation(); 
                    widget.value = { ...widget.value, tags: widget.value.tags.filter(t => t !== tagData) };
                };

                item.appendChild(toggle);
                item.appendChild(label);
                item.appendChild(delBtn);
                grid.appendChild(item);

                item.addEventListener("wheel", (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const sens = getWheelSensitivity();
                    widget.value = { ...widget.value, tags: widget.value.tags.map(t => t === tagData ? {...t, strength: Math.max(0, Math.min(2, (t.strength || 1) + (e.deltaY < 0 ? sens : -sens)))} : t) };
                    node.setDirtyCanvas(true, false);
                });
            });

            section.appendChild(grid);
            contentArea.appendChild(section);
        });
    };

    widget.element = mainContainer;
    node.addDOMWidget(name, "custom_tags", mainContainer, {
        getValue() { return widget.value; },
        setValue(v) { widget.value = v; }
    });

    return widget;
}

app.registerExtension({
    name: "StandardTriggerWordsLoader",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "StandardTriggerWordsLoader") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function() {
                const r = onNodeCreated?.apply(this, arguments);
                const node = this;

                let modifyTagsWidget = node.widgets.find(w => w.name === "modify_tags");
                if (!modifyTagsWidget) {
                    modifyTagsWidget = node.addWidget("text", "modify_tags", "", () => {});
                    modifyTagsWidget.type = "hidden";
                }
                
                modifyTagsWidget.serializeValue = function() { return this.value || ""; };

                const tagsWidget = createTagsWidget(node, "trigger_words_display", { defaultVal: [] });

                const toHide = ["preset_category", "allow_strength_adjustment", "modify_tags"];
                const applyHiding = () => {
                    node.widgets.forEach(w => {
                        if (toHide.includes(w.name)) {
                            w.type = "hidden";
                            if (!w.options) w.options = {};
                            w.options.visible = false;
                            w.hidden = true;
                            if (w.element) {
                                w.element.style.display = "none";
                                w.element.style.height = "0px";
                                w.element.style.margin = "0px";
                                w.element.style.padding = "0px";
                            }
                        }
                    });
                };
                
                applyHiding();
                setTimeout(applyHiding, 100);
                setTimeout(applyHiding, 500);

                let lastKnownValue = modifyTagsWidget.value;
                const updateFromHidden = () => {
                    if (modifyTagsWidget.value && modifyTagsWidget.value !== lastKnownValue) {
                        try {
                            const data = JSON.parse(modifyTagsWidget.value);
                            lastKnownValue = modifyTagsWidget.value;
                            tagsWidget.value = data;
                        } catch (e) {
                            console.error("StandardTriggerWords: Sync error", e);
                        }
                    }
                };

                const syncTimer = setInterval(() => {
                    if (!node.graph) { clearInterval(syncTimer); return; }
                    updateFromHidden();
                }, 500);

                if (modifyTagsWidget.value) {
                    updateFromHidden();
                } else {
                    const initialTags = [];
                    // Default all initial words to OFF
                    ["Pos: Quality", "Pos: Composition"].forEach(cat => {
                        (TRIGGER_WORD_PRESETS[cat] || []).forEach(text => {
                            initialTags.push({ text, active: false, strength: 1.0, category: cat });
                        });
                    });
                    tagsWidget.value = { tags: initialTags, activeCategories: ["Pos: Quality", "Pos: Composition"] };
                }

                node.setSize([750, 700]);
                return r;
            };
        }
    }
});
