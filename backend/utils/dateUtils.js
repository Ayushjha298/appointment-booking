const moment = require('moment');


const generateSlots = (startDate, endDate) => {
    const dates = [];
    let currentDate = moment(startDate);

    while (currentDate <= moment(endDate)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate.add(1, 'days');
    }

    return dates.filter(date => {
        const day = moment(date).day();
        return day >= 1 && day <= 5; 
    });
};

module.exports = { generateSlots };
