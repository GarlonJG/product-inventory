export const DENSITY_OPTIONS = [
    { label: 'Compact density', value: 'compact' },
    { label: 'Standard density', value: 'standard' },
    { label: 'Comfortable density', value: 'comfortable' },
];

export const SETTINGS_STORAGE_KEY = 'inventory-grid-settings';

export const SETTINGS_DEFAULT = {
    density: 'standard',
    showCellBorders: false,
    showColumnBorders: false,
    view: 'grid',
};

export const getInitialSettings = () => {
    try {
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        return storedSettings ? JSON.parse(storedSettings) : SETTINGS_DEFAULT;
    } catch (error) {
        return SETTINGS_DEFAULT;
    }
};