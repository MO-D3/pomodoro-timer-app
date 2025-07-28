export interface PresetOption {
  label: string;
  work: number;
  break: number;
}

interface PresetSelectorProps {
  presets: PresetOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  includeSettings?: boolean;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({
  presets,
  selectedIndex,
  onSelect,
  includeSettings = false,
}) => {
  const items = includeSettings ? [...presets, { label: 'Settings', work: 0, break: 0 }] : presets;
  return (
    <div
      role="tablist"
      aria-label="Preset selection"
      className="flex space-x-1 flex-wrap w-full justify-center"
      style={{ minWidth: 0 }}
    >
      {items.map((preset, index) => {
        const isSelected = selectedIndex === index;
        const isSettings = includeSettings && index === items.length - 1;
        return (
          <button
            key={index}
            role="tab"
            aria-selected={isSelected}
            aria-controls={isSettings ? 'settings-panel' : 'timer-panel'}
            className={
              'px-2 py-1 rounded-full text-xs font-medium focus:outline-none transition-colors min-w-[60px] mb-1' +
              (isSelected
                ? ' bg-brand-green text-brand-text'
                : ' bg-brand-surface text-brand-text hover:bg-brand-greenMuted')
            }
            onClick={() => onSelect(index)}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
};

export default PresetSelector;
