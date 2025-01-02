<div class="container">
    <div class="row mb-4">
        <div class="col-md-12">
            <h2>Edit Kamar</h2>
        </div>
    </div>

    <?php if(validation_errors()): ?>
        <div class="alert alert-danger">
            <?php echo validation_errors(); ?>
        </div>
    <?php endif; ?>

    <div class="card">
        <div class="card-body">
            <form action="<?php echo base_url('room/update/'.$room->id); ?>" method="POST" id="roomForm">
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="number" class="form-label">Nomor Kamar *</label>
                            <input type="text" class="form-control" id="number" name="number" 
                                   value="<?php echo set_value('number', $room->number); ?>" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="type" class="form-label">Tipe Kamar *</label>
                            <select class="form-select" id="type" name="type" required>
                                <option value="">Pilih Tipe Kamar</option>
                                <option value="Standard" <?php echo set_select('type', 'Standard', ($room->type == 'Standard')); ?>>Standard</option>
                                <option value="Deluxe" <?php echo set_select('type', 'Deluxe', ($room->type == 'Deluxe')); ?>>Deluxe</option>
                                <option value="Suite" <?php echo set_select('type', 'Suite', ($room->type == 'Suite')); ?>>Suite</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="price" class="form-label">Harga per Malam (Rp) *</label>
                            <input type="number" class="form-control" id="price" name="price" 
                                   value="<?php echo set_value('price', $room->price); ?>" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="status" class="form-label">Status *</label>
                            <select class="form-select" id="status" name="status" required>
                                <option value="available" <?php echo set_select('status', 'available', ($room->status == 'available')); ?>>Available</option>
                                <option value="occupied" <?php echo set_select('status', 'occupied', ($room->status == 'occupied')); ?>>Occupied</option>
                                <option value="dirty" <?php echo set_select('status', 'dirty', ($room->status == 'dirty')); ?>>Dirty</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="facilities" class="form-label">Fasilitas</label>
                    <textarea class="form-control" id="facilities" name="facilities" 
                              rows="3"><?php echo set_value('facilities', $room->facilities); ?></textarea>
                    <small class="text-muted">Pisahkan dengan koma untuk multiple fasilitas</small>
                </div>

                <div class="text-end">
                    <a href="<?php echo base_url('room'); ?>" class="btn btn-secondary">Batal</a>
                    <button type="submit" class="btn btn-primary">Update</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Form validation using jQuery
    $('#roomForm').validate({
        rules: {
            number: {
                required: true,
                minlength: 2
            },
            type: {
                required: true
            },
            price: {
                required: true,
                min: 0
            },
            status: {
                required: true
            }
        },
        messages: {
            number: {
                required: "Nomor kamar harus diisi",
                minlength: "Nomor kamar minimal 2 karakter"
            },
            type: {
                required: "Tipe kamar harus dipilih"
            },
            price: {
                required: "Harga kamar harus diisi",
                min: "Harga tidak boleh negatif"
            },
            status: {
                required: "Status kamar harus dipilih"
            }
        },
        errorElement: 'span',
        errorPlacement: function(error, element) {
            error.addClass('invalid-feedback');
            element.closest('.mb-3').append(error);
        },
        highlight: function(element) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function(element) {
            $(element).removeClass('is-invalid');
        }
    });
});
</script>
