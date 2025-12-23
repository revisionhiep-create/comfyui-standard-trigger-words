# Standard Trigger Words Loader 📝

**Interactive, two-column trigger word manager for SDXL Illustrious/Pony models in ComfyUI**

> ⚠️ **Note:** This node currently only works with [**LoraManager**](https://github.com/willmiao/ComfyUI-Lora-Manager) nodes. It does not output in standard string format, making it "not node friendly" for standard prompt nodes without [**LoraManager**](https://github.com/willmiao/ComfyUI-Lora-Manager) integration.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![ComfyUI](https://img.shields.io/badge/ComfyUI-Custom%20Node-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## 🌟 Features (V2 Overhaul)

- **New Two-Column UI** - Inspired by EreNodes, providing a clean and organized layout.
- **120+ Preset Trigger Words** - Comprehensive collection for modern image generation models.
- **13 Categories** - Quality, Lighting, Composition, Poses, Expressions, Style, Detail, Aesthetic, Motion, and specialized Negative categories.
- **Multi-Category Selection** - View and manage tags from multiple categories simultaneously.
- **Default OFF State** - All tags start disabled, letting you build your prompt precisely.
- **Responsive Layout** - UI automatically expands to fill the node space when resized.
- **Inline Tag Management** - Add tags instantly within any category, double-click to edit, and "×" to remove.
- **Nuclear Scrubbing** - Advanced prompt cleaning ensures no technical metadata leaks into your images.
- **Robust Workflow Sync** - Remembers your category selections and tag states across sessions.
- **Works with [Lora Manager](https://github.com/willmiao/ComfyUI-Lora-Manager)** - Integrates seamlessly with existing workflows

---

## 📦 Installation

### Method 1: Via ComfyUI Manager (Recommended)
1. Open ComfyUI Manager
2. Search for "standard trigger words"
3. Click Install
4. Restart ComfyUI

### Method 2: Git Clone
1. **Navigate to ComfyUI custom nodes folder:**
   ```bash
   cd ComfyUI/custom_nodes/
   ```
2. **Clone this repository:**
   ```bash
   git clone https://github.com/revisionhiep-create/comfyui-standard-trigger-words.git
   ```
3. **Restart ComfyUI**

---

## 🚀 Quick Start

1. **Add the node**: Search for `Standard Trigger Words 📝`.
2. **Select Categories**: Click the **☰ Categories** button to open the multi-select menu.
3. **Toggle Tags**: Click the switches to enable/disable tags (Green/Red = Active, Gray = Inactive).
4. **Add/Edit**: 
   - Type in the "Add..." box within a category and hit `+`.
   - Double-click any tag text to edit it.
   - Click the red `×` to delete a tag.
5. **Adjust Strength**: Scroll your mouse wheel over any tag to adjust its prompt weight.

---

## ⚙️ Node Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| **default_active** | Boolean | Controls if newly added tags start enabled or disabled (Default: False). |
| **prefix** | String | A custom string (like "masterpiece,") to always prepend to the output. |
| **lora_syntax** | String | Connect `loaded_loras` from Lora Loader for `<lora:name:1.0>` syntax. |

---

## 🔄 Changelog

### v2.0.0 (December 2024)
- 🎨 **Complete UI Redesign**: Switched to a modern two-column grid layout.
- 📂 **Multi-Category Support**: New menu allows selecting multiple active groups at once.
- 🧘 **New Presets**: Added high-quality Poses and Expressions categories.
- 🚫 **Negative Categories**: Dedicated sections for Negative Quality, Anatomy, Technical, and Style.
- 🛠️ **Inline Editing**: Added direct text editing (double-click) and deletion (x button).
- 🧼 **Nuclear Scrubbing**: Implemented regex-based prompt cleaning to prevent JSON leaks in images.
- 🔄 **State Persistence**: Improved serialization to remember category selections in workflows.
- 📏 **Responsive UI**: Fixed stretching issues to ensure tags use the full node width.

### v1.0.0
- ✨ Initial release with basic button tag interface.

---

**Made with ❤️ for the ComfyUI community**

**⭐ If this node helps your workflow, please star the repository!**

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
```

**Connection Steps:**
1. Lora Loader → `trigger_words` → Trigger Word Toggle
2. Trigger Word Toggle → `filtered_trigger_words` → Prompt (trigger_words input)
3. Standard Trigger Words → `trigger_words` → Prompt (trigger_words input)
4. Prompt will combine both sources automatically

---
