import SewaModel from "./SewaModel.js";
export default class SewaFormPresenter {
constructor(view) {
  this.view = view;
  this.currentStep = 1;

  this.formData = {
    penyewa: { nama: '', alamat: '', nomorTelepon: '' },
    barang: [{ nama: '', jumlah: 1, includeModel: false }],
    tanggal: { sewa: '', kembali: '' },
  };

  this.availableItems = []; // awal kosong
}

async loadBarangFromAPI() {
  try {
    const data = await SewaModel.getBarang();
    this.availableItems = data.map(item => ({
      id: item.id,
      name: item.nama,
      price: item.harga,
    }));
    this.view.afterRender(); // refresh UI setelah data ada
  } catch (err) {
    console.error(err);
    alert("Gagal memuat barang dari server");
  }
}


  nextStep(step) {
    this.currentStep = step;
    this.view.afterRender();
  }

  updatePenyewaField(field, value) {
    this.formData.penyewa[field] = value;
  }

  updateBarangSelect(index, value) {
    this.formData.barang[index].nama = value;
  }

  updateBarangJumlah(index, increment) {
    let val = this.formData.barang[index].jumlah;
    if (increment === -1 && val > 1) val--;
    if (increment === 1 && val < 10) val++;
    this.formData.barang[index].jumlah = val;
  }

  updateIncludeModel(index, checked) {
    this.formData.barang[index].includeModel = checked;
  }

  addBarang() {
    this.formData.barang.push({ nama: '', jumlah: 1, includeModel: false });
    this.view.afterRender();
  }

  removeBarang(index) {
    this.formData.barang.splice(index, 1);
    this.view.afterRender();
  }

  updateTanggal(field, value) {
    this.formData.tanggal[field] = value;
  }

  // Validation
  validateStep1() {
    const p = this.formData.penyewa;
    return p.nama.trim() && p.alamat.trim() && p.nomorTelepon.trim();
  }

  validateStep2() {
    return this.formData.barang.some(b => b.nama !== '');
  }

  validateStep3() {
    const { sewa, kembali } = this.formData.tanggal;
    if (!sewa || !kembali) return false;
    if (new Date(kembali) < new Date(sewa)) return false;
    return true;
  }

async submitForm() {
  try {
    const response = await fetch("http://localhost:5000/api/sewa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.formData),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Gagal menyimpan sewa");
      return;
    }

    alert("Form berhasil disubmit! ID Sewa: " + result.sewaId);
    window.location.hash = "#/sewa";

  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat mengirim data ke server");
  }
}

}
