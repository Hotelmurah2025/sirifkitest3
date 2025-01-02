<div class="container">
    <div class="row mb-4">
        <div class="col-md-6">
            <h2>Daftar Kamar</h2>
        </div>
        <div class="col-md-6 text-end">
            <a href="<?php echo base_url('room/create'); ?>" class="btn btn-primary">
                <i class="fas fa-plus"></i> Tambah Kamar
            </a>
        </div>
    </div>

    <?php if($this->session->flashdata('success')): ?>
        <div class="alert alert-success">
            <?php echo $this->session->flashdata('success'); ?>
        </div>
    <?php endif; ?>

    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Nomor Kamar</th>
                            <th>Tipe</th>
                            <th>Harga</th>
                            <th>Status</th>
                            <th>Fasilitas</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if(isset($rooms) && !empty($rooms)): ?>
                            <?php foreach($rooms as $room): ?>
                                <tr>
                                    <td><?php echo $room->number; ?></td>
                                    <td><?php echo $room->type; ?></td>
                                    <td>Rp <?php echo number_format($room->price, 0, ',', '.'); ?></td>
                                    <td>
                                        <span class="badge <?php 
                                            echo $room->status === 'available' ? 'bg-success' : 
                                                ($room->status === 'occupied' ? 'bg-danger' : 'bg-warning'); 
                                        ?>">
                                            <?php echo ucfirst($room->status); ?>
                                        </span>
                                    </td>
                                    <td><?php echo $room->facilities; ?></td>
                                    <td>
                                        <a href="<?php echo base_url('room/edit/'.$room->id); ?>" 
                                           class="btn btn-sm btn-warning">
                                            <i class="fas fa-edit"></i> Edit
                                        </a>
                                        <button type="button" 
                                                class="btn btn-sm btn-danger delete-room" 
                                                data-id="<?php echo $room->id; ?>"
                                                data-number="<?php echo $room->number; ?>">
                                            <i class="fas fa-trash"></i> Hapus
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="6" class="text-center">Tidak ada data kamar</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="deleteModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Konfirmasi Hapus</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Apakah Anda yakin ingin menghapus kamar <span id="roomNumber"></span>?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <form id="deleteForm" method="POST">
                    <input type="hidden" name="room_id" id="roomId">
                    <button type="submit" class="btn btn-danger">Hapus</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Handle delete button click
    $('.delete-room').click(function() {
        var roomId = $(this).data('id');
        var roomNumber = $(this).data('number');
        
        $('#roomId').val(roomId);
        $('#roomNumber').text(roomNumber);
        $('#deleteForm').attr('action', '<?php echo base_url('room/delete/'); ?>' + roomId);
        $('#deleteModal').modal('show');
    });
});
</script>
