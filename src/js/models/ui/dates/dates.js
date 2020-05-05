class Dates {
    static fromDateHour(month, day, hour, minute) {
        let hours = document.querySelector('#hours');
        hours.innerHTML = `<span>${day} ${month}</span><br><span>${hour}:${minute}</span>`;
    }
}

export default Dates;