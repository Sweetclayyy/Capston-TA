const API_BASE = "http://localhost:5000";

export default class StokModel {
  static async getAllStok() {
    try {
      const res = await fetch(`${API_BASE}/api/stok`);
      if (!res.ok) throw new Error("Gagal mengambil data stok");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  static async addStok({ nama, kategori, stok, harga, gambarFile }) {
    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("kategori", kategori);
      formData.append("stok", stok);
      formData.append("harga", harga);
      formData.append("gambar", gambarFile);

      const res = await fetch(`${API_BASE}/api/stok`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal menambahkan stok");
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async deleteStok(id) {
    try {
      const res = await fetch(`${API_BASE}/api/stok/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus stok");
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async updateStok(id, { nama, kategori, stok, harga, gambarFile }) {
    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("kategori", kategori);
      formData.append("stok", stok);
      formData.append("harga", harga);
      if (gambarFile) formData.append("gambar", gambarFile);

      const res = await fetch(`${API_BASE}/api/stok/${id}`, { method: "PUT", body: formData });
      if (!res.ok) throw new Error("Gagal update stok");
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
