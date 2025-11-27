// src/models/SewaModel.js
const API_URL = "http://localhost:5000/api";

class SewaModel {
  static async getBarang() {
    const res = await fetch(`${API_URL}/barang`);
    if (!res.ok) throw new Error("Gagal mengambil data barang");
    return res.json();
  }
}

export default SewaModel;
