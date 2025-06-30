let allItems = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("hamburger.json")
    .then(res => res.json())
    .then(data => {
      allItems = data.filter(item => (item["메뉴명 "] ?? "").trim() !== "");
      renderList();
    });

  document.getElementById("filterSelect").addEventListener("change", renderList);
  document.getElementById("sortSelect").addEventListener("change", renderList);
});

function renderList() {
  const filterValue = document.getElementById("filterSelect").value;
  const sortValue = document.getElementById("sortSelect").value;
  const container = document.getElementById("hamburgerList");

  let filtered = [...allItems];

  // 필터
  if (filterValue !== "전체") {
    filtered = filtered.filter(item => item["메뉴종류(불고기,새우,대표메뉴)"] === filterValue);
  }

  // 정렬
  switch (sortValue) {
    case "가격높은순":
      filtered.sort((a, b) => (b["가격"] ?? 0) - (a["가격"] ?? 0));
      break;
    case "가격낮은순":
      filtered.sort((a, b) => (a["가격"] ?? 0) - (b["가격"] ?? 0));
      break;
    case "100g가격높은순":
      filtered.sort((a, b) => ratioPrice(b) - ratioPrice(a));
      break;
    case "100g가격낮은순":
      filtered.sort((a, b) => ratioPrice(a) - ratioPrice(b));
      break;
    case "100gkcal높은순":
      filtered.sort((a, b) => ratioKcal(b) - ratioKcal(a));
      break;
    case "100gkcal낮은순":
      filtered.sort((a, b) => ratioKcal(a) - ratioKcal(b));
      break;
    default:
      filtered.sort((a, b) => {
        const nameA = a["브랜드명 "]?.trim() ?? "";
        const nameB = b["브랜드명 "]?.trim() ?? "";
        return nameA.localeCompare(nameB, "ko");
      });
  }

  container.innerHTML = "";

  filtered.forEach(item => {
    const brand = item["브랜드명"] ?? "";
    const name = item["메뉴명 "]?.trim() ?? "";
    const price = item["가격"] ?? 0;
    const weight = item["무게"] ?? 0;
    const calorie = item["칼로리"] ?? 0;
    const brandImage = item["브랜드이미지"] ?? "";

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-body px-4 py-4">
        <div class="d-flex justify-content-between align-items-center" style="min-height: 20px;">
          <div class="d-flex align-items-center" style="flex: 1;">
            <img src="${brandImage}" class="burger-img" alt="브랜드 이미지">
            <div class="fw-semibold" style="font-size: 1.2rem;">${brand} - ${name}</div>
          </div>
          <div class="text-end d-flex flex-column justify-content-center" style="min-width: 160px;">
            <div style="font-size: 1.2rem; color: #66bb6a;">${price.toLocaleString()}원</div>
            <div class="text-muted" style="font-size: 0.9rem;">${weight}g · (100g당 ${per100gPrice(price, weight)}원)</div>
            <div class="text-muted" style="font-size: 0.75rem;">${calorie}kcal · (100g당 ${per100gKcal(calorie, weight)}kcal)</div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function ratioPrice(item) {
  const price = item["가격"] ?? 0;
  const weight = item["무게"] ?? 0;
  return weight > 0 ? price / weight * 100 : Infinity;
}

function ratioKcal(item) {
  const calorie = item["칼로리"] ?? 0;
  const weight = item["무게"] ?? 0;
  return weight > 0 ? calorie / weight * 100 : -Infinity;
}

function per100gPrice(price, weight) {
  if (!price || !weight || weight === 0) return '-';
  return Math.round((price / weight) * 100).toLocaleString();
}

function per100gKcal(kcal, weight) {
  if (!kcal || !weight || weight === 0) return '-';
  return Math.round((kcal / weight) * 100);
}
