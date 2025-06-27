class HamburgerItem {
  final String brand;
  final String name;
  final String type;
  final int? price;
  final int? weight;
  final int? calorie;
  final String link;

  HamburgerItem({
    required this.brand,
    required this.name,
    required this.type,
    required this.price,
    required this.weight,
    required this.calorie,
    required this.link,
  });

  factory HamburgerItem.fromJson(Map<String, dynamic> json) {
    return HamburgerItem(
      brand: json["브랜드명"] ?? '',
      name: json["메뉴명 "]?.trim() ?? '',
      type: json["메뉴종류(불고기,새우,대표메뉴)"] ?? '',
      price: json["가격"],
      weight: json["무게"],
      calorie: json["칼로리"],
      link: json["링크"] ?? '',
    );
  }
}