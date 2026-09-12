import 'package:flutter/material.dart';
import 'models/area_point.dart';
import 'screens/area_calculator_screen.dart';
import 'screens/traverse_screen.dart';
import 'screens/unit_converter_screen.dart';

void main() {
  runApp(const SurveyCalcApp());
}

class SurveyCalcApp extends StatelessWidget {
  const SurveyCalcApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Surveying Traverse & Land Area Calculator',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0284C7),
          primary: const Color(0xFF0284C7),
          secondary: const Color(0xFFD97706),
        ),
      ),
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<AreaPoint> _importedPoints = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _onReceivePointsFromTraverse(List<AreaPoint> points) {
    setState(() {
      _importedPoints = points;
      _tabController.animateTo(2); // Switch to Area Calculator
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Surveying Traverse & Land Area Calculator',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: const Color(0xFF0F172A),
        elevation: 2,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF0284C7),
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: const [
            Tab(icon: Icon(Icons.calculate), text: 'Traverse Calculator'),
            Tab(icon: Icon(Icons.swap_horiz), text: 'Unit Converter'),
            Tab(icon: Icon(Icons.crop_free), text: 'Area Calculator'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          TraverseScreen(
            onSendToAreaCalculator: _onReceivePointsFromTraverse,
          ),
          const UnitConverterScreen(),
          AreaCalculatorScreen(
            importedPoints: _importedPoints,
          ),
        ],
      ),
    );
  }
}
