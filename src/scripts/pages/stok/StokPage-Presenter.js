import StokModel from "./StokPage-Model.js";

export default class StokPagePresenter {
  constructor(view) {
    this.view = view;
    this.allStock = [];
    this.itemsPerPage = 8;
    this.currentPage = 1;
  }

  async renderStockList(filter = "all", keyword = "") {
    const stokGrid = document.querySelector("#stokGrid");
    const paginationContainer = document.querySelector(".pagination");
    if (!stokGrid) return;

    try {
      this.allStock = await StokModel.getAllStok();
    } catch (err) {
      console.error("Gagal ambil stok dari API:", err);
      this.allStock = [];
    }

    let filteredStock = this.allStock;
    if (filter !== "all") filteredStock = filteredStock.filter(item => item.kategori === filter);
    if (keyword.trim() !== "") filteredStock = filteredStock.filter(item =>
      item.nama.toLowerCase().includes(keyword.toLowerCase())
    );

    const totalItems = filteredStock.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    if (this.currentPage > totalPages) this.currentPage = totalPages || 1;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedStock = filteredStock.slice(startIndex, startIndex + this.itemsPerPage);

    stokGrid.innerHTML = paginatedStock.map(item => {
      const imageUrl = item.gambar.startsWith("http")
        ? item.gambar
        : `http://localhost:5000${item.gambar}`;

      return `
        <div class="stok-card">
          <img src="${imageUrl}" alt="${item.nama}" class="stok-img" />
          <div class="stok-info">
            <h3>${item.nama}</h3>
            <p>Stok: ${item.stok}</p>
            <p class="price">Rp. ${parseInt(item.harga).toLocaleString("id-ID")}</p>
          </div>
          <div class="stok-actions-card">
            <button class="btn-edit" data-id="${item.id}">
              <img src="/logo/edit.png" alt="Edit Icon" class="icon-btn" />
              Edit
            </button>
            <button class="btn-delete" data-id="${item.id}">Hapus</button>
          </div>
        </div>
      `;
    }).join("");

    if (paginationContainer) {
      if (totalPages <= 1) paginationContainer.style.display = "none";
      else {
        paginationContainer.style.display = "flex";
        paginationContainer.innerHTML = `
          <span class="page-btn" id="prevPage">&lt;</span>
          ${Array.from({ length: totalPages }, (_, i) => `
            <span class="page-number ${i + 1 === this.currentPage ? "active" : ""}">
              ${i + 1}
            </span>
          `).join("")}
          <span class="page-btn" id="nextPage">&gt;</span>
        `;
        this.bindPaginationEvents(filter, keyword, totalPages);
      }
    }

    this.bindEditDeleteEvents();
    this.bindCardClickEvents();
  }

  bindPaginationEvents(filter, keyword, totalPages) {
    const prevBtn = document.querySelector("#prevPage");
    const nextBtn = document.querySelector("#nextPage");
    const pageNumbers = document.querySelectorAll(".page-number");

    prevBtn?.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderStockList(filter, keyword);
      }
    });

    nextBtn?.addEventListener("click", () => {
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.renderStockList(filter, keyword);
      }
    });

    pageNumbers.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        this.currentPage = index + 1;
        this.renderStockList(filter, keyword);
      });
    });
  }

  bindEditDeleteEvents() {
    const deleteButtons = document.querySelectorAll(".btn-delete");

deleteButtons.forEach(btn => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const id = btn.dataset.id;
    const confirmDelete = await showDeleteConfirm();
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/stok/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus stok dari server");
      const result = await response.json();
      showToast(result.message || "Stok berhasil dihapus");
      this.renderStockList();
    } catch (error) {
      console.error("Error hapus stok:", error);
      showToast("Terjadi kesalahan saat menghapus stok");
    }
  });
});


    const editButtons = document.querySelectorAll(".btn-edit");
    const formOverlay = document.querySelector("#stokFormOverlay");
    const stokForm = document.querySelector("#stokForm");
    const gambarInput = document.querySelector("#gambarBarang");
    const previewContainer = document.querySelector("#previewContainer");
    const previewImage = document.querySelector("#previewImage");

    editButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = this.allStock.find(stock => stock.id == id);
        if (!item) return;

        stokForm.reset();
        formOverlay.classList.remove("hidden");
        stokForm.dataset.mode = "edit";
        stokForm.dataset.id = id;
        stokForm.querySelector("button[type='submit']").textContent = "Update Stok";

        document.querySelector("#namaBarang").value = item.nama;
        document.querySelector("#kategoriBarang").value = item.kategori;
        document.querySelector("#stokBarang").value = item.stok;
        document.querySelector("#hargaBarang").value = item.harga;

        if (item.gambar) {
          previewImage.src = item.gambar.startsWith("http") 
            ? item.gambar 
            : `http://localhost:5000${item.gambar}`;
          previewContainer.classList.remove("hidden");
        } else {
          previewContainer.classList.add("hidden");
          previewImage.src = "";
        }

        gambarInput.addEventListener("change", () => {
          const file = gambarInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              previewImage.src = reader.result;
              previewContainer.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
          } else {
            previewContainer.classList.add("hidden");
            previewImage.src = "";
          }
        });
      });
    });
  }

  handleFilter() {
    const dropdown = document.querySelector("#filterKategori");
    const searchInput = document.querySelector("#searchInput");
    if (!dropdown || !searchInput) return;

    const updateList = () => {
      const selected = dropdown.value;
      const keyword = searchInput.value;
      this.currentPage = 1;
      this.renderStockList(selected, keyword);
    };

    dropdown.addEventListener("change", updateList);
    searchInput.addEventListener("input", updateList);
  }

  handleAddStock() {
    const addBtn = document.querySelector("#addStockBtn");
    const formOverlay = document.querySelector("#stokFormOverlay");
    const closeFormModal = document.querySelector("#closeFormModal");
    const stokForm = document.querySelector("#stokForm");
    const gambarInput = document.querySelector("#gambarBarang");
    const previewContainer = document.querySelector("#previewContainer");
    const previewImage = document.querySelector("#previewImage");

    if (!addBtn || !formOverlay || !closeFormModal || !stokForm) return;

    gambarInput.addEventListener("change", () => {
      const file = gambarInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          previewImage.src = reader.result;
          previewContainer.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
      } else {
        previewContainer.classList.add("hidden");
        previewImage.src = "";
      }
    });

    addBtn.addEventListener("click", () => {
      stokForm.reset();
      previewContainer.classList.add("hidden");
      formOverlay.classList.remove("hidden");
      stokForm.dataset.mode = "add";
      delete stokForm.dataset.id;
      stokForm.querySelector("button[type='submit']").textContent = "Tambah Stok";
    });

    closeFormModal.addEventListener("click", () => formOverlay.classList.add("hidden"));
    formOverlay.addEventListener("click", (e) => {
      if (e.target === formOverlay) formOverlay.classList.add("hidden");
    });

    stokForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nama = document.querySelector("#namaBarang").value;
      const kategori = document.querySelector("#kategoriBarang").value;
      const stok = parseInt(document.querySelector("#stokBarang").value);
      const harga = parseInt(document.querySelector("#hargaBarang").value);
      const gambarFile = gambarInput.files[0];
      const mode = stokForm.dataset.mode;
      const id = stokForm.dataset.id;

      let result = null;

      if (mode === "edit") {
        const formData = new FormData();
        formData.append("nama", nama);
        formData.append("kategori", kategori);
        formData.append("stok", stok);
        formData.append("harga", harga);
        if (gambarFile) formData.append("gambar", gambarFile);

        try {
          const response = await fetch(`http://localhost:5000/api/stok/${id}`, {
            method: "PUT",
            body: formData,
          });

          if (!response.ok) throw new Error("Gagal update stok");
          const data = await response.json();
          showToast(data.message || "Berhasil update stok");

          formOverlay.classList.add("hidden");
          stokForm.reset();
          this.renderStockList();
        } catch (err) {
          console.error(err);
          showToast("Gagal memperbarui stok");
        }
      } else {
        result = await StokModel.addStok({ nama, kategori, stok, harga, gambarFile });
        if (result) {
          showToast(`Berhasil menambahkan stok: ${nama}`);
          formOverlay.classList.add("hidden");
          stokForm.reset();
          previewContainer.classList.add("hidden");
          this.renderStockList();
        } else showToast("Gagal menambahkan stok, coba lagi.");
      }
    });
  }

  bindCardClickEvents() {
    const cards = document.querySelectorAll(".stok-card");
    const modal = document.querySelector("#stokModal");
    const closeModal = document.querySelector("#closeModal");

    if (!modal || !closeModal) return;

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const id = card.querySelector(".btn-edit")?.dataset.id;
        const item = this.allStock.find(stock => stock.id == id);
        if (!item) return;

        const imageUrl = item.gambar.startsWith("http")
          ? item.gambar
          : `http://localhost:5000${item.gambar}`;

        document.querySelector("#modalImage").src = imageUrl;
        document.querySelector("#modalName").textContent = item.nama;
        document.querySelector("#modalStock").textContent = `Stok: ${item.stok}`;
        document.querySelector("#modalPrice").textContent = `Harga: Rp ${parseInt(item.harga).toLocaleString("id-ID")}`;

        modal.classList.remove("hidden");
      });
    });

    closeModal.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });
  }
}

function showToast(message) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const overlay = document.createElement("div");
  overlay.className = "toast-overlay";

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="checkmark-wrapper">
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
        <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
      </svg>
    </div>
    <span class="toast-text">${message}</span>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(toast);

  setTimeout(() => {
    overlay.classList.add("show");
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    overlay.classList.remove("show");
    toast.classList.remove("show");
    setTimeout(() => {
      overlay.remove();
      toast.remove();
    }, 400);
  }, 3000);
}

function showDeleteConfirm(message = "Yakin ingin menghapus stok ini?") {
  return new Promise((resolve) => {
    // Buat overlay
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";

    // Buat modal
    const modal = document.createElement("div");
    modal.className = "confirm-modal";
    modal.innerHTML = `
      <p>${message}</p>
      <div class="confirm-buttons">
        <button class="btn-cancel">Batal</button>
        <button class="btn-confirm">Hapus</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event tombol
    modal.querySelector(".btn-cancel").addEventListener("click", () => {
      overlay.remove();
      resolve(false);
    });

    modal.querySelector(".btn-confirm").addEventListener("click", () => {
      overlay.remove();
      resolve(true);
    });

    // Klik di luar modal = batal
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    });
  });
}

