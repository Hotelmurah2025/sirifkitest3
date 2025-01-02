<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Kalender Reservasi</h1>

    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">Ketersediaan Kamar</h6>
            <a href="<?= site_url('reservation/create') ?>" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Tambah Reservasi
            </a>
        </div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-4">
                    <select class="form-select" id="room-filter">
                        <option value="">Semua Kamar</option>
                        <?php foreach ($rooms as $room): ?>
                            <option value="<?= $room->id ?>">
                                <?= $room->number ?> - <?= $room->type ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <div id="reservation-calendar"></div>
        </div>
    </div>
</div>

<!-- Event Details Modal -->
<div class="modal fade" id="eventModal" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="eventModalLabel">Detail Reservasi</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <strong>Tamu:</strong>
                    <span id="event-guest"></span>
                </div>
                <div class="mb-3">
                    <strong>Kamar:</strong>
                    <span id="event-room"></span>
                </div>
                <div class="mb-3">
                    <strong>Check-in:</strong>
                    <span id="event-checkin"></span>
                </div>
                <div class="mb-3">
                    <strong>Check-out:</strong>
                    <span id="event-checkout"></span>
                </div>
                <div class="mb-3">
                    <strong>Status:</strong>
                    <span id="event-status"></span>
                </div>
                <div class="mb-3">
                    <strong>Total:</strong>
                    <span id="event-total"></span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                <a href="#" class="btn btn-primary" id="event-edit">Edit</a>
            </div>
        </div>
    </div>
</div>

<link href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/locales/id.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('reservation-calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'id',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: {
            url: '<?= site_url('reservation/get_calendar_events') ?>',
            method: 'GET',
            extraParams: function() {
                return {
                    room_id: $('#room-filter').val()
                };
            }
        },
        eventClick: function(info) {
            // Format date
            const formatDate = (date) => {
                return new Date(date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            };

            // Update modal content
            $('#event-guest').text(info.event.extendedProps.guest_name);
            $('#event-room').text(info.event.extendedProps.room_number + ' - ' + info.event.extendedProps.room_type);
            $('#event-checkin').text(formatDate(info.event.start));
            $('#event-checkout').text(formatDate(info.event.end));
            $('#event-status').text(info.event.extendedProps.status);
            $('#event-total').text('Rp ' + parseInt(info.event.extendedProps.total_price).toLocaleString('id-ID'));
            
            // Update edit button link
            $('#event-edit').attr('href', '<?= site_url('reservation/edit/') ?>' + info.event.extendedProps.id);
            
            // Show modal
            $('#eventModal').modal('show');
        },
        eventContent: function(arg) {
            return {
                html: `
                    <div class="fc-content">
                        <div class="fc-title"><strong>${arg.event.extendedProps.room_number}</strong></div>
                        <div class="fc-description small">${arg.event.extendedProps.guest_name}</div>
                    </div>
                `
            };
        },
        eventDidMount: function(info) {
            // Add status-based colors
            const statusColors = {
                'pending': '#ffc107',
                'checked_in': '#28a745',
                'checked_out': '#6c757d',
                'cancelled': '#dc3545'
            };
            info.el.style.backgroundColor = statusColors[info.event.extendedProps.status];
        }
    });

    calendar.render();

    // Handle room filter
    $('#room-filter').on('change', function() {
        calendar.refetchEvents();
    });
});
</script>

<style>
#reservation-calendar {
    height: 800px;
    margin: 20px 0;
}

.fc-event {
    cursor: pointer;
}

.fc-event:hover {
    opacity: 0.9;
}

.fc-content {
    padding: 2px 4px;
}

.fc-description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
