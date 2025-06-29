let allItems = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("hamburger.json")
    .then(res => res.json())
    .then(data => {
      allItems = data.filter(e => (e["메뉴명 "] ?? "").toString().trim() !== "");
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

  if (filterValue !== "전체") {
    filtered = filtered.filter(
      item => item["메뉴종류(불고기,새우,대표메뉴)"] === filterValue
    );
  }

  switch (sortValue) {
    case "가격높은순":
      filtered.sort((a, b) => (b["가격"] ?? 0) - (a["가격"] ?? 0));
      break;
    case "가격낮은순":
      filtered.sort((a, b) => (a["가격"] ?? 0) - (b["가격"] ?? 0));
      break;
    case "칼로리높은순":
      filtered.sort((a, b) => (b["칼로리"] ?? 0) - (a["칼로리"] ?? 0));
      break;
    case "칼로리낮은순":
      filtered.sort((a, b) => (a["칼로리"] ?? 0) - (b["칼로리"] ?? 0));
      break;
    case "100g당가격높은순":
      filtered.sort((a, b) => pricePer100g(b) - pricePer100g(a));
      break;
    case "100g당가격낮은순":
      filtered.sort((a, b) => pricePer100g(a) - pricePer100g(b));
      break;
  }

  container.innerHTML = "";

  filtered.forEach(item => {
    const brand = item["브랜드명"] ?? "";
    const name = item["메뉴명 "]?.trim() ?? "";
    const type = item["메뉴종류(불고기,새우,대표메뉴)"] ?? "";
    const price = item["가격"] ?? 0;
    const weight = item["무게"] ?? 0;
    const calorie = item["칼로리"] ?? 0;
    const per100g = pricePer100g(item);

    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
    <div class="card h-100 border-0 shadow-sm rounded-4" style="background-color: #fffdf5;">
      <div class="card-body d-flex flex-column justify-content-between" style="padding: 20px;">
        <div>
          <div class="fw-bold fs-5 mb-2">${brand} - ${name}</div>
          <div class="text-muted mb-1" style="font-size: 15px;">
            🍔 종류: ${type}
          </div>
          <div class="mb-2" style="font-size: 14px;">
            💰 ${price}원 /  
            ⚖️ ${weight}g /
            🔥 ${calorie}kcal
          </div>
        </div>
        <div class="text-end text-secondary" style="font-size: 13px;">
          100g당 가격: <span class="fw-semibold">${per100g}원</span>
        </div>
      </div>
    </div>
  `;
  

    container.appendChild(col);
  });
}

function pricePer100g(item) {
  const price = item["가격"] ?? 0;
  const weight = item["무게"] ?? 0;
  return weight > 0 ? Math.round((price / weight) * 100) : 999999;
}
