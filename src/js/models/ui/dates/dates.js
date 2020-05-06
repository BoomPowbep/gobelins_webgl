class Dates {
    static fromDateHour(month, day, hour, minute) {
        let hours = document.querySelector('#hours');
        hours.innerHTML = `<span>${day} ${month}</span><br><span>${hour}:${minute}</span>`;
    }
    static fromObject(date) {
        let hours = document.querySelector('#hours');
        hours.innerHTML = `<span>${date.hour}:${date.minute}</span><br><span>${date.day} ${date.month}</span>`;
    }
}

export default Dates;