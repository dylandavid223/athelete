document.addEventListener('DOMContentLoaded', () => {
    const athleteTableBody = document.getElementById('athlete-table-body');
    const eventTableBody = document.getElementById('event-table-body');

    // Fetch athletes data
    fetch('/api/athletes')
        .then(response => response.json())
        .then(data => {
            data.forEach(athlete => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${athlete.first_name} ${athlete.last_name}</td>
                    <td>${athlete.specialization}</td>
                    <td>${athlete.county_origin}</td>
                    <td><a href="/admin/athlete/${athlete.id}" class="btn btn-info">View</a></td>
                `;
                athleteTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching athletes:', error));

    // Fetch events data
    fetch('/api/events')
        .then(response => response.json())
        .then(data => {
            data.forEach(event => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${event.event_name}</td>
                    <td>${new Date(event.event_date).toLocaleDateString()}</td>
                    <td>${event.location}</td>
                    <td>${event.is_upcoming ? 'Upcoming' : 'Past'}</td>
                    <td><a href="/admin/events/${event.id}" class="btn btn-info">View</a></td>
                `;
                eventTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching events:', error));
});