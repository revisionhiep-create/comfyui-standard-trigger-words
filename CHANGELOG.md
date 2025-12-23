# Standard Trigger Words Loader - Change Log

## [2.0.0] - 2025-12-22

### Added
- **Major UI/UX Overhaul**: Modern two-column grid layout inspired by EreNodes/Prompt Toggle for faster tag selection.
- **Negative Categories**: Added dedicated sections for Negative Quality, Anatomy, Technical, and Style tags.
- **New Tag Categories**: Integrated "Poses" and "Expressions" with 30+ new specialized trigger words.
- **Multi-Category Management**: Implemented a "☰ Categories" menu to toggle and display multiple tag groups at once.
- **Responsive Design**: Improved grid layout that intelligently uses the full width of the node frame when stretched.
- **Default State**: All buttons now default to "OFF" to allow building prompts from scratch.
- **Inline Tag Management**: Added "+" buttons per category for new tags, double-click to edit text, and "×" buttons for quick removal.
- **Nuclear Scrubbing**: Advanced safety filter to prevent any internal JSON metadata or technical keywords from leaking into the final prompt.

### Fixed
- **Workflow Persistence**: Resolved "Value not in list" errors and "funky link" issues when loading legacy workflows.
- **Data Leakage**: Fixed "weird text" (like 'strength' or 'active') appearing in generated images via aggressive prompt cleaning.
- **UI Responsiveness**: Fixed non-functional "Add word" buttons and ensured the UI updates correctly across all categories.
- **Hidden Widget Sync**: Implemented a robust polling sync engine to ensure the custom UI and hidden serialization widgets are always in lockstep.

### Changed
- Moved `preset_category` and `allow_strength_adjustment` to optional/hidden to reduce UI clutter while maintaining compatibility.
- Updated `pyproject.toml` and `README.md` to reflect the V2 overhaul.

## [1.0.3] - 2025-12-21

### Fixed
- Fixed "disappearing buttons" bug caused by race conditions during node initialization.
- Added robust state synchronization between hidden serialization widget and UI widget.
- Added `onConfigure` hook to ensure tags are correctly restored when loading workflows.
- Fixed backend crash (TypeError) when strength value is missing or null.
- Improved tag consistency between Python backend and JavaScript frontend.
- Added defensive JSON parsing and fallback mechanisms to prevent node execution errors.

## [1.0.2] - 2024-12-19

### Added
- Initial release of Standard Trigger Words Loader
- 50+ preset trigger words optimized for SDXL Illustrious models
- 7 preset categories:
  - Quality (13 tags)
  - Lighting (14 tags)
  - Composition (17 tags)
  - Style (10 tags)
  - Detail (9 tags)
  - Aesthetic (11 tags)
  - Motion (6 tags)
- Interactive UI features:
  - Toggle tags on/off with single click
  - Inline text editing (double-click)
  - Strength adjustment with mouse wheel
  - Visual highlighting for external tags
- 4 output modes: Append, Prepend, Replace, Tagged Only
- Smart merging with external trigger words (Lora Loader compatible)
- 3 merge strategies: Keep Both, Prefer Preset, Prefer Incoming
- Batch operations: Toggle All ON, Toggle All OFF, Clear All
- Auto-deduplication of tags
- Two output pins: output_string and active_triggers
- Performance optimizations:
  - O(N+M) merge algorithm
  - Pre-compiled regex patterns
  - Cached settings
  - Singleton event listeners
- Comprehensive documentation
- MIT License

### Technical Details
- Python backend with modular preset system
- JavaScript frontend with custom widget
- Zero dependencies (uses only ComfyUI APIs)
- Memory efficient (1-2KB per 100 tags)
- Searchable node name: "Standard Trigger Words 📝"
- Category: trigger_words

### Files Structure
```
Standard_trigger_words_loader/
├── __init__.py                    # Node registration
├── standard_trigger_node.py       # Main node logic
├── standard_trigger_presets.py    # Preset data & utilities
├── js/
│   └── standard_trigger_loader.js # Frontend UI
├── README.md                      # Full documentation
├── LICENSE                        # MIT License
├── CHANGELOG.md                   # This file
└── pyproject.toml                 # Package metadata
```

---

## Future Plans

### v2.1.0 (Planned)
- [ ] Import/Export custom preset collections
- [ ] Preset search functionality
- [ ] Drag-and-drop tag reordering
- [ ] Undo/Redo support
- [ ] Custom tag groups
- [ ] Preset templates
- [ ] Tag usage statistics
- [ ] Multi-language support

---

## Contributing

Want to add features or fix bugs? See CONTRIBUTING.md (coming soon) for guidelines.

## Support

- Report bugs: [GitHub Issues](https://github.com/yourusername/Standard_trigger_words_loader/issues)
- Feature requests: [GitHub Discussions](https://github.com/yourusername/Standard_trigger_words_loader/discussions)
