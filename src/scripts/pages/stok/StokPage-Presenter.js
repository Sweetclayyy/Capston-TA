export default class StokPagePresenter {
  constructor(view) {
    this.view = view;
    this.allStock = [];
    this.itemsPerPage = 8; // 4 kolom × 2 baris
    this.currentPage = 1;
  }

  async renderStockList(filter = "all", keyword = "") {
    const stokGrid = document.querySelector("#stokGrid");
    const paginationContainer = document.querySelector(".pagination");
    if (!stokGrid) return;

    // === Dummy data ===
    this.allStock = [
      { id: 1, name: "Baju Designer Batik", stock: 2, price: 999999, category: "designer", image: "/images/baju1.jpg" },
      { id: 2, name: "Baju Kostum Merah", stock: 3, price: 899999, category: "kostum", image: "/images/baju2.jpg" },
      { id: 3, name: "Baju Designer Songket", stock: 1, price: 1099999, category: "designer", image: "/images/baju3.jpg" },
      { id: 4, name: "Baju Kostum Kebaya", stock: 4, price: 799999, category: "kostum", image: "/images/baju4.jpg" },
      { id: 5, name: "Baju Designer Modern", stock: 5, price: 1199999, category: "designer", image: "/images/baju4.jpg" },
      { id: 6, name: "Baju Kostum Putih", stock: 2, price: 749999, category: "kostum", image: "/images/baju3.jpg" },
      { id: 7, name: "Baju Designer Elegan", stock: 3, price: 1299999, category: "designer", image: "/images/baju2.jpg" },
      { id: 8, name: "Baju Kostum Pesta", stock: 6, price: 699999, category: "kostum", image: "/images/baju1.jpg" },
      { id: 9, name: "Baju Designer Minimalis", stock: 2, price: 999000, category: "designer", image: "/images/baju4.jpg" },
      { id: 10, name: "Baju Kostum Tradisional", stock: 5, price: 849999, category: "kostum", image: "/images/baju3.jpg" },
    ];

    // === Filter & Search ===
    let filteredStock = this.allStock;

    if (filter !== "all") {
      filteredStock = filteredStock.filter(item => item.category === filter);
    }

    if (keyword.trim() !== "") {
      filteredStock = filteredStock.filter(item =>
        item.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // === Pagination ===
    const totalItems = filteredStock.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);

    // Pastikan currentPage tidak melebihi total
    if (this.currentPage > totalPages) this.currentPage = totalPages || 1;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedStock = filteredStock.slice(startIndex, startIndex + this.itemsPerPage);

    // === Render Card ===
    stokGrid.innerHTML = paginatedStock.map(item => `
      <div class="stok-card">
        <img src="${item.image}" alt="${item.name}" class="stok-img" />
        <div class="stok-info">
          <h3>${item.name}</h3>
          <p>Stok: ${item.stock}</p>
          <p class="price">Rp. ${item.price.toLocaleString("id-ID")}</p>
        </div>
        <div class="stok-actions-card">
          <button class="btn-edit" data-id="${item.id}">
            <img src="/logo/edit.png" alt="Edit Icon" class="icon-btn" />
            Edit
          </button>
          <button class="btn-delete" data-id="${item.id}">Hapus</button>
        </div>
      </div>
    `).join("");

    // === Render Pagination Dinamis ===
    if (paginationContainer) {
      if (totalPages <= 1) {
        paginationContainer.style.display = "none"; // sembunyikan jika cuma 1 halaman
      } else {
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
    const editButtons = document.querySelectorAll(".btn-edit");
    const deleteButtons = document.querySelectorAll(".btn-delete");

    editButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        alert(`Edit stok ID: ${id} (fitur edit nanti dihubungkan ke form edit)`);
      });
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        alert(`Hapus stok ID: ${id} (fitur hapus nanti diimplementasi ke API)`);
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
      this.currentPage = 1; // reset ke halaman 1 saat filter berubah
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

  if (!addBtn || !formOverlay || !closeFormModal || !stokForm) return;

  // ✅ Saat klik tombol "Tambah Stok" → tampilkan overlay
  addBtn.addEventListener("click", () => {
    formOverlay.classList.remove("hidden");
  });

  // ✅ Tutup modal saat klik tanda × atau klik luar
  closeFormModal.addEventListener("click", () => {
    formOverlay.classList.add("hidden");
  });
  formOverlay.addEventListener("click", (e) => {
    if (e.target === formOverlay) formOverlay.classList.add("hidden");
  });

  // ✅ Tangani submit form
  stokForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.querySelector("#namaBarang").value;
    const kategori = document.querySelector("#kategoriBarang").value;
    const stok = parseInt(document.querySelector("#stokBarang").value);
    const harga = parseInt(document.querySelector("#hargaBarang").value);

    showToast(`Berhasil menambahkan stok: ${nama}`);


    formOverlay.classList.add("hidden");
    stokForm.reset();
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

      // isi data ke modal
      document.querySelector("#modalImage").src = item.image;
      document.querySelector("#modalName").textContent = item.name;
      document.querySelector("#modalStock").textContent = `Stok: ${item.stock}`;
      document.querySelector("#modalPrice").textContent = `Harga: Rp ${item.price.toLocaleString("id-ID")}`;

      modal.classList.remove("hidden");
    });
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
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

  // Hilang otomatis setelah 3 detik
  setTimeout(() => {
    overlay.classList.remove("show");
    toast.classList.remove("show");
    setTimeout(() => {
      overlay.remove();
      toast.remove();
    }, 400);
  }, 3000);
}

