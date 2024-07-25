async function formatExpirationDates(expirationDate) {
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

    let result = '';
    let remainingTime = diff;

    for (const unit of units) {
        const value = Math.floor(remainingTime / unit.ms);
        if (value > 0) {
            result += `${value} ${unit.name}${value !== 1 ? 's' : ''}`;
            remainingTime -= value * unit.ms;
        }
    }

    return result.trim();
}

module.exports = { formatExpirationDates };