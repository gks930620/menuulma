let allItems = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("chicken.json")
    .then(res => res.json())
    .then(data => {
      allItems = data.filter(item => (item["메뉴명"] ?? "").trim() !== "");
      renderList();
    });
    

  document.getElementById("filterSelect").addEventListener("change", renderList);
  document.getElementById("sortSelect").addEventListener("change", renderList);
});

function renderList() {
  const filterValue = document.getElementById("filterSelect").value;
  const sortValue = document.getElementById("sortSelect").value;
  const container = document.getElementById("chickenList");

  let filtered = [...allItems];

  // 필터
  if (filterValue !== "전체") {
    filtered = filtered.filter(item => {
      const type = item["메뉴종류"];
      return Array.isArray(type) ? type.includes(filterValue) : type === filterValue;
    });
  }



  // 정렬
  switch (sortValue) {
    case "가격높은순":
      filtered.sort((a, b) => (b["가격"] ?? 0) - (a["가격"] ?? 0));
      break;
    case "가격낮은순":
      filtered.sort((a, b) => (a["가격"] ?? 0) - (b["가격"] ?? 0));
      break;
    case "100gkcal높은순":
      filtered.sort((a, b) => (b["100g당kcal"] ?? -Infinity) - (a["100g당kcal"] ?? -Infinity));
      break;
    case "100gkcal낮은순":
      filtered.sort((a, b) => (a["100g당kcal"] ?? Infinity) - (b["100g당kcal"] ?? Infinity));
      break;
    default:
      filtered.sort((a, b) => {
        const nameA = a["브랜드명"]?.trim() ?? "";
        const nameB = b["브랜드명"]?.trim() ?? "";
        return nameA.localeCompare(nameB, "ko");
      });
  }

  container.innerHTML = "";

  filtered.forEach(item => {
    const brand = item["브랜드명"] ?? "";
    const name = item["메뉴명"]?.trim() ?? "";
    const price = item["가격"] ?? 0;
    const weight = item["무게"] ?? null;
    const kcalPer100g = item["100g당kcal"] ?? null;
    const brandImage = item["브랜드이미지"] ?? "";
    const menuImage=item["메뉴이미지"] ?? "";

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-body px-4 py-4">
        <div class="d-flex justify-content-between align-items-center" style="min-height: 20px;">
          <div class="d-flex align-items-center" style="flex: 1;">
            <img src="${brandImage}" class="brand-img" alt="브랜드 이미지">
            <div class="fw-semibold" style="font-size: 1.2rem;">${brand} - ${name}</div>
            <img src="${menuImage}" class="menu-img" alt="브랜드 이미지"  style="margin-left: 20px;">
          </div>
          <div class="text-end d-flex flex-column justify-content-center" style="min-width: 160px;">
            <div style="font-size: 1.2rem; color: #66bb6a;">${price.toLocaleString()}원</div>
            ${kcalPer100g ? `<div class="text-muted" style="font-size: 0.9rem;">100g당 ${kcalPer100g}kcal</div>` : ""}
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}
