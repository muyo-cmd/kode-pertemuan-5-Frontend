const productDataset = [
  { id: 1, name: "Kopi Robusta", category: "Minuman", price: 35000, stock: 20 },
  { id: 2, name: "Keripik Pisang", category: "Makanan", price: 15000, stock: 50 },
  { id: 3, name: "Batik Jawa", category: "Pakaian", price: 100000, stock: 10 },
  { id: 4, name: "Kopi Arabica", category: "Minuman", price: 30000, stock: 15 },
  { id: 5, name: "Kue Bagiak", category: "Makanan", price: 20000, stock: 40 },
  { id: 6, name: "Kaos Etnik", category: "Pakaian", price: 75000, stock: 25 },
  { id: 7, name: "Sirup Pala", category: "Minuman", price: 15000, stock: 30 },
  { id: 8, name: "Rengginang", category: "Makanan", price: 15000, stock: 60 }
];

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
};

const updateSummary = (dataset) => {
  const statTypes = document.getElementById('stat-total-types');
  const statItems = document.getElementById('stat-total-items');
  const statValue = document.getElementById('stat-total-value');

  let totalItems = 0;
  let totalValuation = 0;

  for (const product of dataset) {
    totalItems += product.stock;
    totalValuation += (product.price * product.stock);
  }

  if (statTypes) statTypes.textContent = `${dataset.length} Entitas`;
  if (statItems) statItems.textContent = `${totalItems} Unit`;
  if (statValue) statValue.textContent = formatRupiah(totalValuation);
};

const renderTable = (dataset) => {
  const tbody = document.getElementById('product-table-body');
  if (!tbody) return;

  if (dataset.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Tidak ada produk yang cocok dengan pencarian.</td></tr>`;
    return;
  }

  let htmlRows = '';
  dataset.forEach((item, index) => {
    htmlRows += `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge">${item.category}</span></td>
        <td>${formatRupiah(item.price)}</td>
        <td>${item.stock} pcs</td>
        <td>
          <button class="btn btn-danger" onclick="deleteProduct(${item.id})">Hapus</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = htmlRows;
};

const deleteProduct = (id) => {
  const targetIndex = productDataset.findIndex(item => item.id === id);
  if (targetIndex !== -1) {
    const deletedItem = productDataset.splice(targetIndex, 1)[0];
    console.log("Produk dihapus:", deletedItem);
    
    applyFilterAndRender();
    updateSummary(productDataset);

    const feedback = document.getElementById('form-feedback');
    if (feedback) {
      feedback.textContent = `Produk '${deletedItem.name}' berhasil dihapus.`;
      feedback.className = "feedback-msg success";
    }
  }
};

const applyFilterAndRender = () => {
  const searchInput = document.getElementById('filter-search');
  const categorySelect = document.getElementById('filter-category');

  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const categoryValue = categorySelect ? categorySelect.value : 'ALL';

  const filtered = productDataset.filter(product => {
    const isNameMatch = product.name.toLowerCase().includes(searchTerm);
    const isCategoryMatch = (categoryValue === 'ALL' || product.category === categoryValue);
    return isNameMatch && isCategoryMatch;
  });

  renderTable(filtered);
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('product-form');
  const feedback = document.getElementById('form-feedback');
  const previewBox = document.getElementById('live-preview');

  const nameInput = document.getElementById('product-name');
  const categoryInput = document.getElementById('product-category');
  const priceInput = document.getElementById('product-price');
  const stockInput = document.getElementById('product-stock');

  const searchInput = document.getElementById('filter-search');
  const categorySelect = document.getElementById('filter-category');

  renderTable(productDataset);
  updateSummary(productDataset);

  const handleLivePreview = () => {
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const price = parseFloat(priceInput.value);
    const stock = parseInt(stockInput.value, 10);

    if (name || category || !isNaN(price) || !isNaN(stock)) {
      const priceFormatted = isNaN(price) ? 'Rp0' : formatRupiah(price);
      const stockFormatted = isNaN(stock) ? 0 : stock;
      
      previewBox.innerHTML = `<strong>Live Preview:</strong> ${name || '...'} | Kategori: ${category || '...'} | ${priceFormatted} | Stok: ${stockFormatted} pcs`;
    } else {
      previewBox.innerHTML = `<strong>Live Preview:</strong> Belum ada input data.`;
    }
  };

  nameInput.addEventListener('input', handleLivePreview);
  categoryInput.addEventListener('change', handleLivePreview);
  priceInput.addEventListener('input', handleLivePreview);
  stockInput.addEventListener('input', handleLivePreview);

  if (searchInput) searchInput.addEventListener('input', applyFilterAndRender);
  if (categorySelect) categorySelect.addEventListener('change', applyFilterAndRender);

  form.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const nameValue = nameInput.value.trim();
    const categoryValue = categoryInput.value;
    const priceValue = parseFloat(priceInput.value);
    const stockValue = parseInt(stockInput.value, 10);

    if (!nameValue || !categoryValue || isNaN(priceValue) || priceValue <= 0 || isNaN(stockValue) || stockValue < 0) {
      feedback.textContent = "Mohon isi nama, kategori, harga (> 0), dan stok (≥ 0) dengan benar!";
      feedback.className = "feedback-msg error";
      return;
    }

    const newProduct = {
      id: productDataset.length > 0 ? Math.max(...productDataset.map(p => p.id)) + 1 : 1,
      name: nameValue,
      category: categoryValue,
      price: priceValue,
      stock: stockValue
    };

    productDataset.push(newProduct);
    console.log("Data produk berhasil disimpan:", newProduct);
    console.log("Dataset Produk Terkini:", productDataset);

    feedback.textContent = `Sukses! Produk '${newProduct.name}' (${newProduct.category}) seharga ${formatRupiah(newProduct.price)} dengan stok ${newProduct.stock} pcs tersimpan.`;
    feedback.className = "feedback-msg success";

    form.reset();
    previewBox.innerHTML = `<strong>Live Preview:</strong> Belum ada input data.`;

    applyFilterAndRender();
    updateSummary(productDataset);
  });
});