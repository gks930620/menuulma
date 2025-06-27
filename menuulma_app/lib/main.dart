import 'package:flutter/material.dart';
import 'hamburger_list.dart'; // 햄버거 전용 화면

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '메뉴 모음',
      theme: ThemeData(primarySwatch: Colors.orange),
      home: MainMenuScreen(),
    );
  }
}

class MainMenuScreen extends StatelessWidget {
  final List<MenuItem> menuItems = [
    MenuItem(name: '햄버거', screen: HamburgerScreen()),
    MenuItem(name: '치킨', screen: PlaceholderScreen('치킨')),
    MenuItem(name: '피자', screen: PlaceholderScreen('피자')),
    MenuItem(name: '커피', screen: PlaceholderScreen('커피')),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('메뉴 선택')),
      body: ListView.builder(
        itemCount: menuItems.length,
        itemBuilder: (context, index) {
          final item = menuItems[index];
          return ListTile(
            title: Text(item.name),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => item.screen),
              );
            },
          );
        },
      ),
    );
  }
}

class MenuItem {
  final String name;
  final Widget screen;

  MenuItem({required this.name, required this.screen});
}

class PlaceholderScreen extends StatelessWidget {
  final String title;

  PlaceholderScreen(this.title);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('$title 화면')),
      body: Center(
        child: Text('$title 화면은 아직 준비되지 않았습니다.'),
      ),
    );
  }
}
