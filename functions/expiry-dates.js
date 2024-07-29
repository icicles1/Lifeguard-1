function formatDate(date) {
    const now = new Date();
    const diff = date - now;

    const units = [
        { name: 'year', ms: 31536000000 },
        { name: 'month', ms: 2592000000 },
        { name: 'week', ms: 604800000 },
        { name: 'day', ms: 86400000 },
        { name: 'hour', ms: 3600000 },
        { name: 'minute', ms: 60000 },
        { name: 'second', ms: 1000 }
    ];

    let result = '';
    let time = diff;

    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        const value = Math.floor(time / unit.ms);
        if (value > 0) {
            result += `${value} ${unit.name}${value !== 1 ? 's' : ''} `;
            time -= value * unit.ms;

            if (['year', 'month', 'week', 'day'].includes(unit.name) && i + 1 < units.length) {
                const nextUnit = units[i + 1];
                const nextValue = Math.floor(time / nextUnit.ms);
                if (nextValue > 0) {
                    result += `${nextValue} ${nextUnit.name}${nextValue !== 1 ? 's' : ''} `;
                    break;
                }
            } else if (['hour', 'minute', 'second'].includes(unit.name)) {
                break;
            }
        }
    }

    return result.trim();
}

module.exports = { formatDate };
