<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Tambah Reservasi</h1>

    <div class="row">
        <div class="col-md-12">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Form Reservasi Kamar</h6>
                </div>
                <div class="card-body">
                    <?php if (validation_errors()): ?>
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <?= validation_errors() ?>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    <?php endif; ?>

                    <form action="<?= site_url('reservation/store') ?>" method="post" id="reservationForm">
                        <div class="row">
                            <!-- Guest Information -->
                            <div class="col-md-6">
                                <h5 class="mb-3">Informasi Tamu</h5>
                                
                                <div class="mb-3">
                                    <label for="guest_name" class="form-label">Nama Tamu <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="guest_name" name="guest_name" 
                                           value="<?= set_value('guest_name') ?>" required>
                                </div>

                                <div class="mb-3">
                                    <label for="guest_email" class="form-label">Email <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control" id="guest_email" name="guest_email" 
                                           value="<?= set_value('guest_email') ?>" required>
                                </div>

                                <div class="mb-3">
                                    <label for="guest_phone" class="form-label">Nomor Telepon <span class="text-danger">*</span></label>
                                    <input type="tel" class="form-control" id="guest_phone" name="guest_phone" 
                                           value="<?= set_value('guest_phone') ?>" required>
                                </div>

                                <div class="mb-3">
                                    <label for="num_guests" class="form-label">Jumlah Tamu <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="num_guests" name="num_guests" 
                                           value="<?= set_value('num_guests', 1) ?>" min="1" required>
                                </div>
                            </div>

                            <!-- Reservation Details -->
                            <div class="col-md-6">
                                <h5 class="mb-3">Detail Reservasi</h5>

                                <div class="mb-3">
                                    <label for="room_id" class="form-label">Kamar <span class="text-danger">*</span></label>
                                    <select class="form-select" id="room_id" name="room_id" required>
                                        <option value="">Pilih Kamar</option>
                                        <?php foreach ($rooms as $room): ?>
                                            <option value="<?= $room->id ?>" 
                                                    data-price="<?= $room->price ?>"
                                                    <?= set_value('room_id') == $room->room_id ? 'selected' : '' ?>>
                                                <?= $room->number ?> - <?= $room->type ?> 
                                                (Rp <?= number_format($room->price, 0, ',', '.') ?>)
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="check_in_date" class="form-label">Tanggal Check-in <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control" id="check_in_date" name="check_in_date" 
                                           value="<?= set_value('check_in_date') ?>" required>
                                </div>

                                <div class="mb-3">
                                    <label for="check_out_date" class="form-label">Tanggal Check-out <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control" id="check_out_date" name="check_out_date" 
                                           value="<?= set_value('check_out_date') ?>" required>
                                </div>

                                <div class="mb-3">
                                    <label for="notes" class="form-label">Catatan</label>
                                    <textarea class="form-control" id="notes" name="notes" rows="3"><?= set_value('notes') ?></textarea>
                                </div>

                                <div class="alert alert-info" id="price-info" style="display: none;">
                                    Total Harga: <strong id="total-price">Rp 0</strong>
                                    <br>
                                    <small>untuk <span id="total-nights">0</span> malam</small>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4">
                            <button type="submit" class="btn btn-primary">Simpan Reservasi</button>
                            <a href="<?= site_url('reservation') ?>" class="btn btn-secondary">Batal</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Form validation
    $('#reservationForm').validate({
        rules: {
            guest_name: {
                required: true,
                minlength: 3
            },
            guest_email: {
                required: true,
                email: true
            },
            guest_phone: {
                required: true,
                minlength: 10
            },
            num_guests: {
                required: true,
                min: 1
            },
            room_id: 'required',
            check_in_date: 'required',
            check_out_date: {
                required: true,
                greaterThan: '#check_in_date'
            }
        },
        messages: {
            guest_name: {
                required: 'Nama tamu harus diisi',
                minlength: 'Nama tamu minimal 3 karakter'
            },
            guest_email: {
                required: 'Email harus diisi',
                email: 'Format email tidak valid'
            },
            guest_phone: {
                required: 'Nomor telepon harus diisi',
                minlength: 'Nomor telepon minimal 10 digit'
            },
            num_guests: {
                required: 'Jumlah tamu harus diisi',
                min: 'Minimal 1 tamu'
            },
            room_id: 'Pilih kamar',
            check_in_date: 'Tanggal check-in harus diisi',
            check_out_date: {
                required: 'Tanggal check-out harus diisi',
                greaterThan: 'Tanggal check-out harus lebih besar dari check-in'
            }
        },
        errorElement: 'span',
        errorPlacement: function(error, element) {
            error.addClass('invalid-feedback');
            element.closest('.mb-3').append(error);
        },
        highlight: function(element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });

    // Custom validation method for date comparison
    $.validator.addMethod('greaterThan', function(value, element, param) {
        var startDate = $(param).val();
        return Date.parse(value) > Date.parse(startDate);
    });

    // Calculate total price
    function calculateTotal() {
        const roomId = $('#room_id').val();
        const checkIn = $('#check_in_date').val();
        const checkOut = $('#check_out_date').val();

        if (roomId && checkIn && checkOut) {
            const price = parseFloat($('#room_id option:selected').data('price'));
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            if (nights > 0) {
                const total = price * nights;
                $('#total-nights').text(nights);
                $('#total-price').text('Rp ' + total.toLocaleString('id-ID'));
                $('#price-info').show();
            } else {
                $('#price-info').hide();
            }
        }
    }

    // Bind calculation to form changes
    $('#room_id, #check_in_date, #check_out_date').on('change', calculateTotal);

    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    $('#check_in_date').attr('min', today);
    
    $('#check_in_date').on('change', function() {
        $('#check_out_date').attr('min', $(this).val());
    });

    // Check room availability
    function checkAvailability() {
        const roomId = $('#room_id').val();
        const checkIn = $('#check_in_date').val();
        const checkOut = $('#check_out_date').val();

        if (roomId && checkIn && checkOut) {
            $.get('<?= site_url('reservation/check_availability') ?>', {
                room_id: roomId,
                check_in: checkIn,
                check_out: checkOut
            }, function(response) {
                if (!response.available) {
                    alert('Kamar tidak tersedia untuk tanggal yang dipilih');
                    $('#room_id').val('');
                    $('#price-info').hide();
                }
            });
        }
    }

    // Check availability when dates or room changes
    $('#room_id, #check_in_date, #check_out_date').on('change', checkAvailability);
});
</script>
