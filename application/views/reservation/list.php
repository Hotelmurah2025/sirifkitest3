<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Daftar Reservasi</h1>

    <?php if ($this->session->flashdata('success')): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <?= $this->session->flashdata('success') ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    <?php endif; ?>

    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">Reservasi Kamar</h6>
            <a href="<?= site_url('reservation/create') ?>" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Tambah Reservasi
            </a>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="reservationTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Tamu</th>
                            <th>Kamar</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($reservations as $reservation): ?>
                            <tr>
                                <td><?= $reservation->id ?></td>
                                <td>
                                    <?= $reservation->guest_name ?><br>
                                    <small class="text-muted"><?= $reservation->guest_email ?></small><br>
                                    <small class="text-muted"><?= $reservation->guest_phone ?></small>
                                </td>
                                <td>
                                    <?= $reservation->room_number ?><br>
                                    <small class="text-muted"><?= $reservation->room_type ?></small>
                                </td>
                                <td><?= date('d/m/Y', strtotime($reservation->check_in_date)) ?></td>
                                <td><?= date('d/m/Y', strtotime($reservation->check_out_date)) ?></td>
                                <td>
                                    <?php
                                    $status_class = [
                                        'pending' => 'warning',
                                        'checked_in' => 'success',
                                        'checked_out' => 'secondary',
                                        'cancelled' => 'danger'
                                    ];
                                    $status_text = [
                                        'pending' => 'Menunggu',
                                        'checked_in' => 'Check In',
                                        'checked_out' => 'Check Out',
                                        'cancelled' => 'Dibatalkan'
                                    ];
                                    ?>
                                    <span class="badge bg-<?= $status_class[$reservation->status] ?>">
                                        <?= $status_text[$reservation->status] ?>
                                    </span>
                                </td>
                                <td>Rp <?= number_format($reservation->total_price, 0, ',', '.') ?></td>
                                <td>
                                    <div class="btn-group">
                                        <?php if ($reservation->status === 'pending'): ?>
                                            <button type="button" class="btn btn-success btn-sm check-in-btn" 
                                                    data-id="<?= $reservation->id ?>"
                                                    data-bs-toggle="tooltip" 
                                                    title="Check In">
                                                <i class="fas fa-check"></i>
                                            </button>
                                        <?php endif; ?>
                                        
                                        <?php if ($reservation->status === 'checked_in'): ?>
                                            <button type="button" class="btn btn-info btn-sm check-out-btn" 
                                                    data-id="<?= $reservation->id ?>"
                                                    data-bs-toggle="tooltip" 
                                                    title="Check Out">
                                                <i class="fas fa-sign-out-alt"></i>
                                            </button>
                                        <?php endif; ?>
                                        
                                        <?php if ($reservation->status === 'pending'): ?>
                                            <a href="<?= site_url('reservation/edit/'.$reservation->id) ?>" 
                                               class="btn btn-primary btn-sm"
                                               data-bs-toggle="tooltip" 
                                               title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <button type="button" class="btn btn-danger btn-sm delete-btn" 
                                                    data-id="<?= $reservation->id ?>"
                                                    data-bs-toggle="tooltip" 
                                                    title="Hapus">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        <?php endif; ?>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Konfirmasi Hapus</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Apakah Anda yakin ingin menghapus reservasi ini?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-danger" id="confirmDelete">Hapus</button>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Initialize DataTable
    $('#reservationTable').DataTable({
        order: [[3, 'asc']], // Sort by check-in date
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Indonesian.json'
        }
    });

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Handle delete button
    let reservationIdToDelete;
    $('.delete-btn').on('click', function() {
        reservationIdToDelete = $(this).data('id');
        $('#deleteModal').modal('show');
    });

    $('#confirmDelete').on('click', function() {
        if (reservationIdToDelete) {
            window.location.href = '<?= site_url('reservation/delete/') ?>' + reservationIdToDelete;
        }
    });

    // Handle check-in button
    $('.check-in-btn').on('click', function() {
        const id = $(this).data('id');
        if (confirm('Proses check-in tamu?')) {
            window.location.href = '<?= site_url('reservation/check_in/') ?>' + id;
        }
    });

    // Handle check-out button
    $('.check-out-btn').on('click', function() {
        const id = $(this).data('id');
        if (confirm('Proses check-out tamu?')) {
            window.location.href = '<?= site_url('reservation/check_out/') ?>' + id;
        }
    });
});
</script>
