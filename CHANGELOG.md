# Standard Trigger Words Loader - Change Log

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

### v1.1.0 (Planned)
- [ ] Import/Export custom preset collections
- [ ] Preset search functionality
- [ ] Drag-and-drop tag reordering
- [ ] Tag categorization in UI
- [ ] Undo/Redo support

### v1.2.0 (Planned)
- [ ] Custom tag groups
- [ ] Preset templates
- [ ] Tag usage statistics
- [ ] Negative prompt presets
- [ ] Multi-language support

### v2.0.0 (Planned)
- [ ] AI-powered tag suggestions
- [ ] Tag conflict detection
- [ ] Advanced tag filtering
- [ ] Preset marketplace integration
- [ ] Workflow templates

---

## Contributing

Want to add features or fix bugs? See CONTRIBUTING.md (coming soon) for guidelines.

## Support

- Report bugs: [GitHub Issues](https://github.com/yourusername/Standard_trigger_words_loader/issues)
- Feature requests: [GitHub Discussions](https://github.com/yourusername/Standard_trigger_words_loader/discussions)
