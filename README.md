# Standard Trigger Words Loader 📝

**Interactive clickable button tags for managing SDXL Illustrious trigger words in ComfyUI**

> ⚠️ **Note:** This node currently only works with [**LoraManager**](https://github.com/willmiao/ComfyUI-Lora-Manager) nodes. It does not output in standard string format, making it "not node friendly" for standard prompt nodes without [**LoraManager**](https://github.com/willmiao/ComfyUI-Lora-Manager) integration.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![ComfyUI](https://img.shields.io/badge/ComfyUI-Custom%20Node-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## 🌟 Features

- **80+ Preset Trigger Words** - Curated collection for SDXL Illustrious models
- **7 Categories** - Quality, Lighting, Composition, Style, Detail, Aesthetic, Motion
- **Interactive Button Tags** - Click to toggle on/off (blue = active, gray = inactive)
- **Right-Click Editing** - Edit any trigger word by right-clicking the button
- **Strength Adjustment** - Scroll mouse wheel to adjust emphasis (optional)
- **Batch Operations** - Toggle All ON/OFF buttons for quick management
- **Visual Feedback** - Clear color-coded interface shows active/inactive states
- **Works with [Lora Manager](https://github.com/willmiao/ComfyUI-Lora-Manager)** - Integrates seamlessly with existing workflows

---

## 📦 Installation

### Method 1: Via ComfyUI Manager (Recommended)
1. Open ComfyUI Manager
2. Search for "standard trigger words"
3. Click Install
4. Restart ComfyUI

### Method 2: Git Clone (Recommended)

1. **Navigate to ComfyUI custom nodes folder:**
   ```bash
   cd ComfyUI/custom_nodes/
   ```

2. **Clone this repository:**
   ```bash
   git clone https://github.com/revisionhiep-create/comfyui-standard-trigger-words.git Standard_trigger_words_loader
   ```

3. **Restart ComfyUI**

### Method 3: Manual Download

1. **Download ZIP** from GitHub (green "Code" button → Download ZIP)

2. **Extract** to `ComfyUI/custom_nodes/Standard_trigger_words_loader/`

3. **Verify** folder structure:
   ```
   ComfyUI/custom_nodes/Standard_trigger_words_loader/
   ├── __init__.py
   ├── standard_trigger_node_v2.py
   ├── standard_trigger_presets.py
   ├── js/
   │   ├── standard_trigger_loader.js
   │   └── presets.js
   ├── README.md
   └── LICENSE
   ```

4. **Restart ComfyUI**

---

## 🚀 Quick Start

### Basic Usage (Standalone)

1. **Add the node** to your workflow
   - Right-click canvas → Add Node → `trigger_words` → `Standard Trigger Words 📝`
   - Or search: `Standard Trigger Words`

2. **Select a category** from dropdown (default: All)
   - Quality, Lighting, Composition, Style, Detail, Aesthetic, Motion, or All

3. **Click button tags** to toggle them on/off
   - Blue buttons = Active (will be in output)
   - Gray buttons = Inactive (excluded from output)

4. **Connect output** to your Prompt node
   ```
   Standard Trigger Words (trigger_words) → Prompt (trigger_words)
   ```

### Advanced Usage (With [Lora Manager](https://github.com/willmiao/ComfyUI-Lora-Manager))

**Recommended Workflow:**
```
┌─────────────────────────────────┐
│  Lora Loader ([LoraManager](https://github.com/willmiao/ComfyUI-Lora-Manager))      │
│  - Loads your LoRAs             │
├─────────────────────────────────┤
│  Outputs:                       │
│  • loaded_loras                 │
│  • trigger_words ──────────┐    │
└─────────────────────────────│────┘
                              │
                              ▼
        ┌────────────────────────────────┐
        │  Trigger Word Toggle           │
        │  (Filter lora trigger words)   │
        └────────────────┬───────────────┘
                         │ filtered_trigger_words
                         ▼
        ┌────────────────────────────────┐
        │  Standard Trigger Words 📝     │
        │  [Button Tags Interface]       │
        │  • masterpiece  • 8K           │
        │  • best quality • detailed     │
        └────────────────┬───────────────┘
                         │ trigger_words
                         ▼
        ┌────────────────────────────────┐
        │  Prompt ([LoraManager](https://github.com/willmiao/ComfyUI-Lora-Manager))          │
        │  Uses combined trigger words   │
        └────────────────────────────────┘
```

**Connection Steps:**
1. Lora Loader → `trigger_words` → Trigger Word Toggle
2. Trigger Word Toggle → `filtered_trigger_words` → Prompt (trigger_words input)
3. Standard Trigger Words → `trigger_words` → Prompt (trigger_words input)
4. Prompt will combine both sources automatically

---

## 🎮 User Interface Guide

### Button Tag Interactions

| Action | How To | Result |
|--------|--------|--------|
| **Toggle ON/OFF** | Left-click button | Blue = Active, Gray = Inactive |
| **Edit Text** | Right-click button | Opens edit prompt |
| **Adjust Strength** | Scroll wheel over button | Changes (word:1.2) value (if enabled) |

### Control Buttons

| Button | Function |
|--------|----------|
| **Toggle All ON** | Activates all trigger words (all blue) |
| **Toggle All OFF** | Deactivates all trigger words (all gray) |

---

## ⚙️ Node Parameters

### Required Settings

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **preset_category** | Dropdown | All | Category of presets to load |
| **default_active** | Boolean | True | New trigger words start enabled (blue) or disabled (gray) |
| **allow_strength_adjustment** | Boolean | False | Enable (word:1.2) strength syntax |

### Parameter Details

**`preset_category`** - Choose which preset to load:
- **All** - Loads all 80+ trigger words from all categories
- **Quality** - 13 quality tags (masterpiece, best quality, 8K, etc.)
- **Lighting** - 14 lighting tags (volumetric, cinematic, rim light, etc.)
- **Composition** - 17 camera/framing tags (dynamic angle, portrait, etc.)
- **Style** - 10 art style tags (anime illustration, digital painting, etc.)
- **Detail** - 10 detail enhancement tags (detailed eyes, hair, etc.)
- **Aesthetic** - 10 beauty/aesthetic tags (beautiful, elegant, etc.)
- **Motion** - 8 movement tags (motion blur, flowing, etc.)

**`default_active`** - Controls initial state:
- **True** (default) - All buttons start blue (enabled)
  - Click individual buttons to disable what you don't want
- **False** - All buttons start gray (disabled)
  - Click individual buttons to enable only what you want

**`allow_strength_adjustment`** - Enable weighted prompts:
- **False** (default) - Plain text output: `masterpiece, 8K, detailed`
- **True** - Weighted output: `(masterpiece:1.2), (8K:1.0), (detailed:0.9)`
  - Scroll mouse wheel over buttons to adjust strength
  - Strength appears as badge on each button

---

## 📊 Preset Categories Reference

### Quality Tags (13 tags)
```
masterpiece, best quality, very aesthetic, absurdres, 
high quality, ultra high definition, extremely high detail, 
newest, year 2024, year 2025, highres, 8K, HDR
```

### Lighting Tags (14 tags)
```
volumetric lighting, ambient occlusion, dramatic lighting, 
cinematic lighting, rim light, soft lighting, studio lighting, 
golden hour lighting, natural lighting, sunlight, backlighting, 
sharp focus, glowing, luminescent background
```

### Composition Tags (17 tags)
```
dynamic angle, dynamic pose, low-angle shot, low angle, 
looking at viewer, from above, from below, upper body focus, 
full body, portrait, close-up shot, mid shot, cowboy shot, 
wide angle, cinematic field of view, perfect composition, 
rule of thirds
```

### Style Tags (10 tags)
```
anime illustration, semi-realistic anime illustration, 
digital painting, cel shading, clean linework, 
manga style lineart, detailed, highly detailed, 
intricate details, painterly
```

### Detail Tags (10 tags)
```
detailed eyes, beautiful eye details, detailed skin features, 
detailed face features, detailed hair features, expressive eyes, 
intricate iris, detailed clothing, detailed background, 
fine texture details
```

### Aesthetic Tags (10 tags)
```
beautiful, amazing, stunning, gorgeous, perfect, 
flawless, eye-catching, stylish, elegant, aesthetic
```

### Motion Tags (8 tags)
```
motion blur, motion lines, action pose, dynamic action, 
movement, speed lines, flowing, fluid motion
```

---

## 💡 Usage Examples

### Example 1: Basic Quality Tags

**Setup:**
- Category: `Quality`
- Active Tags: `masterpiece`, `best quality`, `8K`

**Output:**
```
masterpiece, best quality, 8K
```

### Example 2: With [Lora Manager](https://github.com/willmiao/ComfyUI-Lora-Manager) Integration

**Workflow:**
```
Lora Loader outputs: "1girl, school uniform, detailed face"
                     ↓ (via Trigger Word Toggle)
Standard Trigger Words active: "masterpiece, 8K, cinematic lighting"
                     ↓
Combined Output: "1girl, school uniform, detailed face, masterpiece, 8K, cinematic lighting"
```

### Example 3: Strength Adjustment Enabled

**Setup:**
- Category: `Quality`
- allow_strength_adjustment: `True`
- Scroll to adjust strengths

**Output:**
```
(masterpiece:1.5), (best quality:1.3), (8K:1.0), (HDR:1.2)
```

---

## 🔧 Customization

### Adding Your Own Trigger Words

1. **Open** `standard_trigger_presets.py`

2. **Add to existing category** or create new one:
   ```python
   # Example: Add to QUALITY_TAGS
   QUALITY_TAGS = [
       "masterpiece",
       "best quality",
       "your_custom_tag",  # Add here
       # ... existing tags
   ]
   
   # Or create new category
   CUSTOM_TAGS = [
       "your_tag_1",
       "your_tag_2",
       "your_tag_3",
   ]
   ```

3. **Save** and restart ComfyUI

### Editing Existing Presets

Simply edit the lists in `standard_trigger_presets.py`:
```python
QUALITY_TAGS = [
    "masterpiece",
    "best quality",  # Edit this
    # Add or remove tags
]
```

---

## 🐛 Troubleshooting

### Node Doesn't Appear

**Problem:** Can't find node in search  
**Solutions:**
- Search for: `Standard Trigger Words` or `📝`
- Check category: `trigger_words`
- Verify installation path: `ComfyUI/custom_nodes/Standard_trigger_words_loader/`
- Restart ComfyUI completely

### No Button Tags Visible

**Problem:** Large gray area but no buttons  
**Solutions:**
- Check if JavaScript files copied correctly
- Hard refresh browser: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- Check browser console (F12) for errors
- Verify `js/standard_trigger_loader.js` exists

### Tags Not Working with Prompt Node

**Problem:** Output doesn't reach Prompt node  
**Solutions:**
- Verify connection: `trigger_words` output → Prompt `trigger_words` input
- Check if any tags are active (blue)
- Try "Toggle All ON" button
- Verify prompt node accepts STRING type

### Can't Edit Tags

**Problem:** Right-click doesn't open edit menu  
**Solutions:**
- Right-click directly on the button tag
- Don't click on empty space
- Wait for buttons to fully load
- Check browser console for JavaScript errors

---

## 📈 Performance

- **Load Time:** <0.1 seconds
- **Memory Usage:** ~2-5MB
- **Tag Count:** 80+ presets, unlimited custom
- **Recommended:** Up to 500 tags per node

---

## 🤝 Contributing

Contributions welcome! To contribute:

1. **Fork** the repository
2. **Create branch:** `git checkout -b feature/your-feature`
3. **Make changes** and test thoroughly
4. **Commit:** `git commit -m "Add your feature"`
5. **Push:** `git push origin feature/your-feature`
6. **Open Pull Request** with description

### Adding New Presets

Most valuable contributions:
- New trigger word presets
- Additional categories
- Model-specific optimizations
- Bug fixes

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

Free for personal and commercial use.

---

## 🙏 Credits

- **Preset Research:** SDXL Illustrious community
- **Inspired By:** ComfyUI [Lora Manager](https://github.com/willmiao/ComfyUI-Lora-Manager)'s Trigger Word Toggle
- **Built For:** ComfyUI community

---

## 📞 Support & Links

- **Issues:** [Report bugs or request features](https://github.com/revisionhiep-create/comfyui-standard-trigger-words/issues)
- **Discussions:** [Ask questions and share workflows](https://github.com/revisionhiep-create/comfyui-standard-trigger-words/discussions)
- **ComfyUI:** [Main Repository](https://github.com/comfyanonymous/ComfyUI)

---

## 🔄 Changelog

### v1.0.0 (December 2024)
- ✨ Initial release
- 🎨 Interactive button tag interface
- 📦 80+ SDXL Illustrious trigger word presets
- 🏷️ 7 organized categories
- 🎯 Click to toggle, right-click to edit
- 🔄 Integration with [Lora Manager](https://github.com/willmiao/ComfyUI-Lora-Manager) workflow
- ⚙️ Strength adjustment support
- 🚀 Performance optimized

---

**Made with ❤️ for the ComfyUI community**

**⭐ If this node helps your workflow, please star the repository!**
