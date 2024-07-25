async function formatDates(expirationDate) {
    const now = new Date();
    const diff = expirationDate - now;
    const units = [
        { name: 'year', ms: 31536000000 },
        { name: 'month', ms: 2592000000 },
        { name: 'week', ms: 604800000 },
        { name: 'day', ms: 86400000 },
        { name: 'hour', ms: 3600000 },
        { name: 'minute', ms: 60000 },
        { name: 'second', ms: 1000 }
    ];

    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        const nextUnit = units[i + 1] || { ms: 1 }; // Use 1ms if it's the last unit
        const halfNextUnit = nextUnit.ms / 2;

        if (diff >= unit.ms - halfNextUnit) {
            const value = Math.round(diff / unit.ms);
            const time = `${value} ${unit.name}${value !== 1 ? 's' : ''}`;
        }
    }

    return 'less than a second';
}

module.exports = { formatDates };