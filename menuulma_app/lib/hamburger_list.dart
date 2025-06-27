// hamburger_list.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'model/hamburger_item.dart';

class HamburgerScreen extends StatefulWidget {
  @override
  State<HamburgerScreen> createState() => _HamburgerScreenState();
}

class _HamburgerScreenState extends State<HamburgerScreen> {
  List<HamburgerItem> _items = [];
  String _selectedFilter = '전체';
  String _selectedSort = '기본';

  final List<String> _filterOptions = ['전체', 'BULGOGI', 'SHRIMP', 'SIGNATURE'];
  final List<String> _sortOptions = [
    '기본',
    '가격높은순',
    '가격낮은순',
    '칼로리높은순',
    '칼로리낮은순',
    '100g당가격높은순',
    '100g당가격낮은순'
  ];

  @override
  void initState() {
    super.initState();
    loadHamburgerData();
  }

  Future<void> loadHamburgerData() async {
    final jsonString = await rootBundle.loadString('assets/hamburger.json');
    final jsonData = json.decode(jsonString) as List<dynamic>;
    setState(() {
      _items = jsonData
          .where((e) => (e["메뉴명 "] ?? "").toString().trim().isNotEmpty)
          .map((e) => HamburgerItem.fromJson(e))
          .toList();
    });
  }

  List<HamburgerItem> get _filteredItems {
    List<HamburgerItem> result = _items;
    if (_selectedFilter != '전체') {
      result = result.where((item) => item.type == _selectedFilter).toList();
    }

    switch (_selectedSort) {
      case '가격높은순':
        result.sort((a, b) => (b.price ?? 0).compareTo(a.price ?? 0));
        break;
      case '가격낮은순':
        result.sort((a, b) => (a.price ?? 0).compareTo(b.price ?? 0));
        break;
      case '칼로리높은순':
        result.sort((a, b) => (b.calorie ?? 0).compareTo(a.calorie ?? 0));
        break;
      case '칼로리낮은순':
        result.sort((a, b) => (a.calorie ?? 0).compareTo(b.calorie ?? 0));
        break;
      case '100g당가격높은순':
        result.sort((a, b) => ((b.price ?? 0) / ((b.weight ?? 1) == 0 ? 1 : b.weight!))
            .compareTo((a.price ?? 0) / ((a.weight ?? 1) == 0 ? 1 : a.weight!)));
        break;
      case '100g당가격낮은순':
        result.sort((a, b) => ((a.price ?? 0) / ((a.weight ?? 1) == 0 ? 1 : a.weight!))
            .compareTo((b.price ?? 0) / ((b.weight ?? 1) == 0 ? 1 : b.weight!)));
        break;
    }

    return result;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  SizedBox(
                    width: 150,
                    child: DropdownButtonFormField<String>(
                      value: _selectedFilter,
                      decoration: InputDecoration(
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      items: _filterOptions.map((type) {
                        return DropdownMenuItem<String>(
                          value: type,
                          child: Text(type == '전체' ? '-- 전체 --' : type),
                        );
                      }).toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _selectedFilter = value;
                          });
                        }
                      },
                    ),
                  ),
                  SizedBox(width: 8),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _selectedSort,
                      decoration: InputDecoration(
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      items: _sortOptions.map((label) => DropdownMenuItem(
                        value: label,
                        child: Text(label),
                      )).toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _selectedSort = value;
                          });
                        }
                      },
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 8),
            Center(
              child: Container(
                width: 320,
                height: 600,
                padding: EdgeInsets.fromLTRB(8, 0, 8, 8),
                decoration: BoxDecoration(
                  color: Color(0xFFFFF6EC),
                  border: Border.all(color: Colors.blueAccent),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: _filteredItems.isEmpty
                    ? Center(child: Text('결과가 없습니다'))
                    : ListView.builder(
                  itemCount: _filteredItems.length,
                  itemBuilder: (context, index) {
                    final item = _filteredItems[index];
                    final price = item.price ?? 0;
                    final weight = item.weight ?? 0;
                    final calorie = item.calorie ?? 0;

                    final pricePer100g = (weight > 0) ? (price / weight * 100).round() : 0;

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12.0),
                      child: Container(
                        padding: const EdgeInsets.all(12.0),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black12,
                              blurRadius: 4,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${item.brand} - ${item.name}',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 6),
                            Text(
                              '${price}원, ${weight}g, ${calorie}kcal',
                              style: TextStyle(fontSize: 14, color: Colors.grey[700]),
                            ),
                            SizedBox(height: 4),
                            Text(
                              '100g당 ${pricePer100g}원',
                              style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
