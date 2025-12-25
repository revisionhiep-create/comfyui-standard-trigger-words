/**
 * Standard Trigger Words Loader - Robust Sync & Multi-Category UI
 */

import { app } from "../../scripts/app.js";

// Global presets, initially empty, will be populated from Python
let TRIGGER_WORD_PRESETS = {};

function getWheelSensitivity() {
    return parseFloat(app.ui.settings.getSettingValue("AegisFlow.WheelScrollSpeed", 0.02)) || 0.02;
}

function createTagsWidget(node, name, opts = {}) {
    const mainContainer = document.createElement("div");
    mainContainer.className = "standard-trigger-main-container";
    
    Object.assign(mainContainer.style, {
        display: "flex", flexDirection: "column", gap: "10px", padding: "10px",
        backgroundColor: "#0a0a0c", borderRadius: "10px", width: "100%",
        boxSizing: "border-box", border: "1px solid #2a2a2c", color: "#ffffff",
        flexGrow: "1"
    });

    const header = document.createElement("div");
    Object.assign(header.style, {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: "8px", borderBottom: "1px solid #2a2a2c", width: "100%"
    });

    const menuBtn = document.createElement("button");
    menuBtn.textContent = "☰ Categories";
    Object.assign(menuBtn.style, {
        backgroundColor: "#252527", border: "none", color: "white", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "bold"
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
    const strModeBtn = document.createElement("button");
    strModeBtn.textContent = "STR";
    
    [allOnBtn, allOffBtn, strModeBtn].forEach(btn => {
        Object.assign(btn.style, {
            backgroundColor: "#252527", border: "none", color: "white", borderRadius: "4px", padding: "4px 8px", fontSize: "10px", cursor: "pointer"
        });
    });

    batchControls.appendChild(strModeBtn);
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
        _value: { 
            tags: [], 
            activeCategories: ["Pos: Quality", "Pos: Composition"],
            customCategories: [],
            strengthEnabled: false
        },
        draw: function(ctx, node, widgetWidth, y, widgetHeight) {},
        computeSize: function(width) { 
            // Robust size calculation, especially for pinned nodes
            const nodeHeight = (node.size && node.size[1]) ? node.size[1] : 700;
            const preferredHeight = nodeHeight - 100;
            // If pinned, we allow it to be smaller to avoid breaking the layout
            const minHeight = node.flags?.pinned ? 100 : 400;
            return [width || 750, Math.max(minHeight, preferredHeight)]; 
        },
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
                // Prevent infinite loop by checking if value actually changed
                if (modWidget.value !== json) {
                    modWidget._setting_internally = true;
                    modWidget.value = json;
                    if (modWidget.callback) modWidget.callback(json);
                    delete modWidget._setting_internally;
                }
            }
        }
    };

    menuBtn.onclick = (e) => {
        e.stopPropagation();
        
        // If menu already exists, close it and return
        const existingMenu = document.getElementById("standard-trigger-category-menu");
        if (existingMenu) {
            document.body.removeChild(existingMenu);
            return;
        }

        const rect = menuBtn.getBoundingClientRect();
        const menu = document.createElement("div");
        menu.id = "standard-trigger-category-menu";
        Object.assign(menu.style, {
            position: "fixed", top: `${rect.bottom + 5}px`, left: `${rect.left}px`,
            backgroundColor: "#2c2c2e", border: "1px solid #3a3a3c", borderRadius: "8px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.4)", zIndex: "1000", padding: "6px", minWidth: "180px"
        });

        const allCategories = [...Object.keys(TRIGGER_WORD_PRESETS), ...(widget.value.customCategories || [])];

        allCategories.forEach(cat => {
            const item = document.createElement("div");
            const isActive = widget.value.activeCategories.includes(cat);
            const isCustom = (widget.value.customCategories || []).includes(cat);
            
            Object.assign(item.style, {
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 10px", cursor: "pointer", borderRadius: "4px", fontSize: "12px",
                color: cat.startsWith("Neg") ? "#ff453a" : (cat.startsWith("Pos") ? "#30d158" : "#ffffff")
            });

            const labelArea = document.createElement("div");
            labelArea.style.display = "flex";
            labelArea.style.alignItems = "center";
            labelArea.style.flexGrow = "1";
            
            const checkSpan = document.createElement("span");
            Object.assign(checkSpan.style, { width: "16px", display: "inline-block" });
            checkSpan.textContent = isActive ? "✓" : "";
            
            labelArea.appendChild(checkSpan);
            labelArea.appendChild(document.createTextNode(` ${cat}`));

            item.appendChild(labelArea);

            if (isCustom) {
                const delCatBtn = document.createElement("div");
                delCatBtn.textContent = "×";
                Object.assign(delCatBtn.style, {
                    color: "#ff453a", marginLeft: "10px", padding: "0 4px", fontWeight: "bold", opacity: "0.5"
                });
                delCatBtn.onmouseover = () => delCatBtn.style.opacity = "1";
                delCatBtn.onmouseout = () => delCatBtn.style.opacity = "0.5";
                delCatBtn.onclick = (ev) => {
                    ev.stopPropagation();
                    const newValue = { ...widget.value };
                    newValue.customCategories = newValue.customCategories.filter(c => c !== cat);
                    newValue.activeCategories = newValue.activeCategories.filter(c => c !== cat);
                    newValue.tags = newValue.tags.filter(t => t.category !== cat);
                    widget.value = newValue;
                    if (document.body.contains(menu)) document.body.removeChild(menu);
                };
                item.appendChild(delCatBtn);
            }

            item.onmouseover = () => item.style.backgroundColor = "rgba(255,255,255,0.05)";
            item.onmouseout = () => item.style.backgroundColor = "transparent";
            item.onclick = (ev) => {
                ev.stopPropagation();
                const newValue = { ...widget.value };
                if (isActive) {
                    newValue.activeCategories = newValue.activeCategories.filter(c => c !== cat);
                } else {
                    newValue.activeCategories.push(cat);
                    // Add presets if available and not already present
                    (TRIGGER_WORD_PRESETS[cat] || []).forEach(text => {
                        if (!newValue.tags.find(t => t.text === text && t.category === cat)) {
                            newValue.tags.push({ text, active: false, strength: 1.0, category: cat });
                        }
                    });
                }
                widget.value = newValue;
                if (document.body.contains(menu)) document.body.removeChild(menu);
            };
            menu.appendChild(item);
        });

        // Add New Category Input
        const divider = document.createElement("div");
        Object.assign(divider.style, { height: "1px", backgroundColor: "#3a3a3c", margin: "6px 4px" });
        menu.appendChild(divider);

        const addCatContainer = document.createElement("div");
        Object.assign(addCatContainer.style, { display: "flex", gap: "4px", padding: "4px" });
        
        const addCatInput = document.createElement("input");
        addCatInput.placeholder = "New Category...";
        Object.assign(addCatInput.style, {
            backgroundColor: "#1c1c1e", border: "1px solid #3a3a3c", color: "white",
            borderRadius: "4px", padding: "4px 8px", fontSize: "11px", flexGrow: "1", outline: "none"
        });
        
        const addCatBtn = document.createElement("button");
        addCatBtn.textContent = "+";
        Object.assign(addCatBtn.style, {
            backgroundColor: "#3a3a3c", border: "none", color: "white", borderRadius: "4px",
            padding: "2px 8px", cursor: "pointer", fontSize: "14px"
        });

        const performAddCat = () => {
            const name = addCatInput.value.trim();
            if (name && !allCategories.includes(name)) {
                const newValue = { ...widget.value };
                newValue.customCategories = [...(newValue.customCategories || []), name];
                newValue.activeCategories.push(name);
                widget.value = newValue;
                if (document.body.contains(menu)) document.body.removeChild(menu);
            }
        };

        addCatBtn.onclick = (ev) => { ev.stopPropagation(); performAddCat(); };
        addCatInput.onkeydown = (ev) => { if (ev.key === "Enter") { ev.stopPropagation(); performAddCat(); } };
        addCatInput.onclick = (ev) => ev.stopPropagation();

        addCatContainer.appendChild(addCatInput);
        addCatContainer.appendChild(addCatBtn);
        menu.appendChild(addCatContainer);

        // Add Import/Export Buttons
        const toolDivider = document.createElement("div");
        Object.assign(toolDivider.style, { height: "1px", backgroundColor: "#3a3a3c", margin: "6px 4px" });
        menu.appendChild(toolDivider);

        const toolContainer = document.createElement("div");
        Object.assign(toolContainer.style, { display: "flex", gap: "4px", padding: "4px" });

        const importBtn = document.createElement("button");
        importBtn.textContent = "📥 Import";
        const exportBtn = document.createElement("button");
        exportBtn.textContent = "📤 Export";

        [importBtn, exportBtn].forEach(btn => {
            Object.assign(btn.style, {
                backgroundColor: "#3a3a3c", border: "none", color: "white", borderRadius: "4px",
                padding: "4px 8px", cursor: "pointer", fontSize: "10px", flexGrow: "1"
            });
        });

        exportBtn.onclick = (ev) => {
            ev.stopPropagation();
            const data = {
                version: "2.4.1",
                customCategories: widget.value.customCategories || [],
                tags: widget.value.tags.filter(t => (widget.value.customCategories || []).includes(t.category))
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `trigger_words_custom_collection.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        importBtn.onclick = (ev) => {
            ev.stopPropagation();
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (re) => {
                    try {
                        const imported = JSON.parse(re.target.result);
                        const newValue = { ...widget.value };
                        
                        // Merge custom categories
                        if (imported.customCategories) {
                            imported.customCategories.forEach(cat => {
                                if (!newValue.customCategories.includes(cat)) {
                                    newValue.customCategories.push(cat);
                                }
                                if (!newValue.activeCategories.includes(cat)) {
                                    newValue.activeCategories.push(cat);
                                }
                            });
                        }
                        
                        // Merge tags
                        if (imported.tags) {
                            imported.tags.forEach(tag => {
                                if (!newValue.tags.find(t => t.text === tag.text && t.category === tag.category)) {
                                    newValue.tags.push(tag);
                                }
                            });
                        }
                        
                        widget.value = newValue;
                        if (document.body.contains(menu)) document.body.removeChild(menu);
                    } catch (err) {
                        alert("Error importing collection: " + err.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        };

        toolContainer.appendChild(importBtn);
        toolContainer.appendChild(exportBtn);
        menu.appendChild(toolContainer);

        const closeMenu = (ev) => { if (document.body.contains(menu) && !menu.contains(ev.target)) { document.body.removeChild(menu); window.removeEventListener("click", closeMenu); } };
        setTimeout(() => {
            window.addEventListener("click", closeMenu);
            addCatInput.focus();
        }, 0);
        document.body.appendChild(menu);
    };

    allOnBtn.onclick = () => { 
        widget.value = { ...widget.value, tags: widget.value.tags.map(t => ({...t, active: true})) }; 
        node.setDirtyCanvas(true, false); 
    };
    allOffBtn.onclick = () => { 
        // Reset ALL tags to inactive AND strength 1.0
        widget.value = { ...widget.value, tags: widget.value.tags.map(t => ({...t, active: false, strength: 1.0})) }; 
        node.setDirtyCanvas(true, false); 
    };

    strModeBtn.onclick = () => {
        widget.value = { ...widget.value, strengthEnabled: !widget.value.strengthEnabled };
        node.setDirtyCanvas(true, false);
    };

    const renderAll = () => {
        while (contentArea.firstChild) contentArea.removeChild(contentArea.firstChild);

        // Update STR button color - Muted professional greys
        strModeBtn.style.backgroundColor = widget.value.strengthEnabled ? "#5a5a5e" : "#252527";
        strModeBtn.style.border = widget.value.strengthEnabled ? "1px solid #30d158" : "none"; // Subtle green border for active

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
            addBtn.textContent = "+";
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
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
                gap: "8px", 
                width: "100%" 
            });

            const tagsInCat = widget.value.tags.filter(t => t.category === catName);
            tagsInCat.forEach(tagData => {
                const item = document.createElement("div");
                Object.assign(item.style, {
                    display: "flex", flexDirection: "column", gap: "4px", padding: "6px 8px",
                    backgroundColor: "#121214", borderRadius: "6px", border: "1px solid #2a2a2c", minWidth: "0", width: "100%", boxSizing: "border-box"
                });

                const topRow = document.createElement("div");
                Object.assign(topRow.style, { display: "flex", alignItems: "center", gap: "6px", width: "100%" });

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
                    widget.value = { ...widget.value, tags: widget.value.tags.map(t => {
                        if (t === tagData) {
                            const newActive = !t.active;
                            // Reset strength to 1.0 when turning OFF
                            return { ...t, active: newActive, strength: newActive ? t.strength : 1.0 };
                        }
                        return t;
                    }) };
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
                delBtn.textContent = "×";
                Object.assign(delBtn.style, { color: "#ff453a", cursor: "pointer", padding: "0 4px", fontSize: "14px", fontWeight: "bold", opacity: "0.4" });
                delBtn.onmouseover = () => delBtn.style.opacity = "1";
                delBtn.onmouseout = () => delBtn.style.opacity = "0.4";
                delBtn.onclick = (e) => { 
                    e.stopPropagation(); 
                    widget.value = { ...widget.value, tags: widget.value.tags.filter(t => t !== tagData) };
                };

                topRow.appendChild(toggle);
                topRow.appendChild(label);
                topRow.appendChild(delBtn);
                item.appendChild(topRow);

                if (widget.value.strengthEnabled) {
                    const sliderRow = document.createElement("div");
                    Object.assign(sliderRow.style, { display: "flex", alignItems: "center", gap: "6px", width: "100%" });
                    
                    const slider = document.createElement("input");
                    slider.type = "range";
                    slider.min = "0";
                    slider.max = "2";
                    slider.step = "0.05";
                    slider.value = tagData.strength || 1.0;
                    Object.assign(slider.style, { flexGrow: "1", height: "4px", cursor: "pointer", accentColor: "#5a5a5e" });
                    
                    const valLabel = document.createElement("span");
                    valLabel.textContent = parseFloat(slider.value).toFixed(2);
                    Object.assign(valLabel.style, { fontSize: "9px", opacity: "0.6", minWidth: "25px", textAlign: "right", cursor: "pointer" });
                    
                    valLabel.onclick = (e) => {
                        e.stopPropagation();
                        const input = document.createElement("input");
                        input.type = "number";
                        input.value = tagData.strength || 1.0;
                        input.step = "0.01";
                        input.min = "0";
                        input.max = "2";
                        Object.assign(input.style, {
                            width: "35px", fontSize: "9px", backgroundColor: "#1c1c1e", color: "white", border: "none", outline: "none", textAlign: "right"
                        });
                        
                        const saveValue = () => {
                            let val = parseFloat(input.value);
                            if (isNaN(val)) val = 1.0;
                            val = Math.max(0, Math.min(2, val));
                            tagData.strength = val;
                            slider.value = val;
                            widget.value = { ...widget.value }; // Sync
                        };
                        
                        input.onblur = saveValue;
                        input.onkeydown = (ev) => { if (ev.key === "Enter") saveValue(); };
                        
                        valLabel.textContent = "";
                        valLabel.appendChild(input);
                        input.focus();
                        input.select();
                    };

                    slider.oninput = (e) => {
                        const val = parseFloat(e.target.value);
                        valLabel.textContent = val.toFixed(2);
                        // Update value silently to prevent full re-render on every slider move
                        tagData.strength = val;
                        // Mark modified for serialization
                        const modWidget = node.widgets.find(w => w.name === "modify_tags");
                        if (modWidget) {
                            modWidget.value = JSON.stringify(widget.value);
                        }
                    };
                    
                    slider.onchange = () => {
                        widget.value = { ...widget.value }; // Trigger full update/sync on release
                    };

                    sliderRow.appendChild(slider);
                    sliderRow.appendChild(valLabel);
                    item.appendChild(sliderRow);
                }

                grid.appendChild(item);

                item.addEventListener("wheel", (e) => {
                    // Check if strength mode is ON
                    if (widget.value.strengthEnabled) {
                        e.preventDefault();
                        e.stopPropagation();
                        const sens = getWheelSensitivity();
                        const delta = e.deltaY < 0 ? sens : -sens;
                        const newStrength = Math.max(0, Math.min(2, (tagData.strength || 1.0) + delta));
                        
                        widget.value = { 
                            ...widget.value, 
                            tags: widget.value.tags.map(t => t === tagData ? {...t, strength: newStrength} : t) 
                        };
                        node.setDirtyCanvas(true, false);
                    }
                }, { passive: false });
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
            // SSoT Bootstrap: Extract presets library from the Python definition
            let bootstrapPresets = {};
            try {
                // ComfyUI stores default values for hidden inputs here
                const allPresetsDef = nodeData?.input?.hidden?.all_presets;
                if (allPresetsDef && allPresetsDef[1] && allPresetsDef[1].default) {
                    bootstrapPresets = JSON.parse(allPresetsDef[1].default);
                }
            } catch (e) {
                console.error("StandardTriggerWords: Failed to parse bootstrap presets from nodeData", e);
            }

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function() {
                const r = onNodeCreated?.apply(this, arguments);
                const node = this;

                // Priority 1: Use the bootstrapped presets from registration
                if (Object.keys(bootstrapPresets).length > 0) {
                    TRIGGER_WORD_PRESETS = bootstrapPresets;
                }

                let modifyTagsWidget = node.widgets.find(w => w.name === "modify_tags");
                if (!modifyTagsWidget) {
                    modifyTagsWidget = node.addWidget("text", "modify_tags", "", () => {});
                    modifyTagsWidget.type = "hidden";
                }
                
                modifyTagsWidget.serializeValue = function() { return this.value || ""; };

                const tagsWidget = createTagsWidget(node, "trigger_words_display", { defaultVal: [] });

                const toHide = ["preset_category", "allow_strength_adjustment", "modify_tags", "all_presets"];
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

                // Fetch presets from Python via the hidden widget OR a custom API
                const fetchPresets = () => {
                    // Method 1: Check the hidden 'all_presets' widget (Bootstrap)
                    const allPresetsWidget = node.widgets.find(w => w.name === "all_presets");
                    if (allPresetsWidget && allPresetsWidget.value) {
                        try {
                            const parsed = JSON.parse(allPresetsWidget.value);
                            if (Object.keys(parsed).length > 0) {
                                TRIGGER_WORD_PRESETS = parsed;
                            }
                        } catch (e) {
                            console.error("StandardTriggerWords: Error parsing bootstrap presets", e);
                        }
                    }

                    // Method 2: Use the bootstrapPresets from closure if available
                    if (Object.keys(bootstrapPresets).length > 0 && Object.keys(TRIGGER_WORD_PRESETS).length === 0) {
                        TRIGGER_WORD_PRESETS = bootstrapPresets;
                    }

                    // Method 3: Listen for UI messages from the backend (Live updates)
                    this.onUserMessage = (msg) => {
                        if (msg && msg.presets) {
                            TRIGGER_WORD_PRESETS = msg.presets;
                            // Also update the hidden widget for persistence
                            if (allPresetsWidget) allPresetsWidget.value = JSON.stringify(msg.presets);
                            renderAll();
                        }
                    };
                };
                fetchPresets();

                const updateFromHidden = () => {
                    if (modifyTagsWidget._setting_internally) return;
                    if (modifyTagsWidget.value) {
                        try {
                            const data = JSON.parse(modifyTagsWidget.value);
                            tagsWidget.value = data;
                        } catch (e) {
                            console.error("StandardTriggerWords: Sync error", e);
                        }
                    }
                };

                // Event-driven sync: Listen for changes on the hidden widget
                modifyTagsWidget.callback = () => {
                    updateFromHidden();
                };

                // Robust initial load
                fetchPresets(); 
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
                    tagsWidget.value = { 
                        tags: initialTags, 
                        activeCategories: ["Pos: Quality", "Pos: Composition"],
                        customCategories: [] 
                    };
                }

                // Initial size setup - only if not already set by loader
                if (!node.size || (node.size[0] < 100 && node.size[1] < 100)) {
                    node.setSize([750, 700]);
                }
                
                return r;
            };

            // Hook into ComfyUI's configuration system (restoring from workflow)
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function(config) {
                if (onConfigure) onConfigure.apply(this, arguments);
                
                const modifyTagsWidget = this.widgets?.find(w => w.name === "modify_tags");
                const tagsWidget = this.widgets?.find(w => w.name === "trigger_words_display");
                
                if (modifyTagsWidget?.value && tagsWidget) {
                    try {
                        const data = JSON.parse(modifyTagsWidget.value);
                        // Only sync if the value actually differs to avoid redundant re-renders
                        if (JSON.stringify(tagsWidget.value) !== JSON.stringify(data)) {
                            tagsWidget.value = data;
                        }
                    } catch (e) {
                        console.error("StandardTriggerWords: Error restoring state in onConfigure", e);
                    }
                }
            };
        }
    }
});
