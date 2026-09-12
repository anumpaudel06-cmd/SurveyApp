import 'package:flutter/material.dart';
import '../models/area_point.dart';
import '../services/area_engine.dart';

class UnitConverterScreen extends StatefulWidget {
  const UnitConverterScreen({super.key});

  @override
  State<UnitConverterScreen> createState() => _UnitConverterScreenState();
}

class _UnitConverterScreenState extends State<UnitConverterScreen> {
  LandAreaResult _result = AreaEngine.fromRopaniSubunits(1, 0, 0, 0);

  // Ropani inputs
  final _ropaniCtrl = TextEditingController(text: '1');
  final _aanaCtrl = TextEditingController(text: '0');
  final _paisaCtrl = TextEditingController(text: '0');
  final _daamCtrl = TextEditingController(text: '0');

  // Bigha inputs
  final _bighaCtrl = TextEditingController();
  final _katthaCtrl = TextEditingController();
  final _dhurCtrl = TextEditingController();

  // Sq.Ft/M inputs
  final _sqFtCtrl = TextEditingController();
  final _sqMCtrl = TextEditingController();

  bool _ratesExpanded = true;

  @override
  void dispose() {
    _ropaniCtrl.dispose();
    _aanaCtrl.dispose();
    _paisaCtrl.dispose();
    _daamCtrl.dispose();
    _bighaCtrl.dispose();
    _katthaCtrl.dispose();
    _dhurCtrl.dispose();
    _sqFtCtrl.dispose();
    _sqMCtrl.dispose();
    super.dispose();
  }

  void _convertRopani() {
    final r = double.tryParse(_ropaniCtrl.text) ?? 0.0;
    final a = double.tryParse(_aanaCtrl.text) ?? 0.0;
    final p = double.tryParse(_paisaCtrl.text) ?? 0.0;
    final d = double.tryParse(_daamCtrl.text) ?? 0.0;
    setState(() {
      _result = AreaEngine.fromRopaniSubunits(r, a, p, d);
    });
  }

  void _convertBigha() {
    final b = double.tryParse(_bighaCtrl.text) ?? 0.0;
    final k = double.tryParse(_katthaCtrl.text) ?? 0.0;
    final dh = double.tryParse(_dhurCtrl.text) ?? 0.0;
    setState(() {
      _result = AreaEngine.fromBighaSubunits(b, k, dh);
    });
  }

  void _convertSqFt() {
    final sqft = double.tryParse(_sqFtCtrl.text) ?? 0.0;
    setState(() {
      _result = AreaEngine.fromSqFeet(sqft);
    });
  }

  void _convertSqM() {
    final sqm = double.tryParse(_sqMCtrl.text) ?? 0.0;
    setState(() {
      _result = AreaEngine.fromSqMeters(sqm);
    });
  }

  @override
  Widget build(BuildContext context) {
    const primaryBlue = Color(0xFF0284C7);
    const resultRed = Color(0xFFDC2626);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Cadastral Unit Converter',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'Convert between Ropani, Bigha, Metric & Imperial land units',
                    style: TextStyle(fontSize: 13, color: Colors.grey),
                  ),
                ],
              ),
              OutlinedButton.icon(
                onPressed: () {
                  _ropaniCtrl.clear();
                  _aanaCtrl.clear();
                  _paisaCtrl.clear();
                  _daamCtrl.clear();
                  _bighaCtrl.clear();
                  _katthaCtrl.clear();
                  _dhurCtrl.clear();
                  _sqFtCtrl.clear();
                  _sqMCtrl.clear();
                  setState(() {
                    _result = AreaEngine.fromSqMeters(0);
                  });
                },
                icon: const Icon(Icons.clear, size: 16),
                label: const Text('Reset'),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // 1. TOP SECTION (INPUTS): Horizontal row of three distinct cards
          const Text(
            'INPUT UNITS',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: primaryBlue,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                // Card 1: Ropani System Input
                _buildInputCard(
                  title: 'Ropani System Input',
                  subtitle: 'Hilly Region (R-A-P-D)',
                  icon: Icons.terrain,
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Expanded(child: _buildSubunitField(_ropaniCtrl, 'Ropani')),
                          const SizedBox(width: 8),
                          Expanded(child: _buildSubunitField(_aanaCtrl, 'Aana')),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: _buildSubunitField(_paisaCtrl, 'Paisa')),
                          const SizedBox(width: 8),
                          Expanded(child: _buildSubunitField(_daamCtrl, 'Daam')),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: _convertRopani,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primaryBlue,
                          foregroundColor: Colors.white,
                          minimumSize: const Size.fromHeight(38),
                        ),
                        child: const Text('Convert Ropani'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),

                // Card 2: Bigha System Input
                _buildInputCard(
                  title: 'Bigha System Input',
                  subtitle: 'Terai Region (B-K-D)',
                  icon: Icons.landscape,
                  child: Column(
                    children: [
                      _buildSubunitField(_bighaCtrl, 'Bigha'),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: _buildSubunitField(_katthaCtrl, 'Kattha')),
                          const SizedBox(width: 8),
                          Expanded(child: _buildSubunitField(_dhurCtrl, 'Dhur')),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: _convertBigha,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primaryBlue,
                          foregroundColor: Colors.white,
                          minimumSize: const Size.fromHeight(38),
                        ),
                        child: const Text('Convert Bigha'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),

                // Card 3: Sq.Ft/M Input
                _buildInputCard(
                  title: 'Sq.Ft/M Input',
                  subtitle: 'Standard Imperial & Metric',
                  icon: Icons.straighten,
                  child: Column(
                    children: [
                      _buildSubunitField(_sqFtCtrl, 'Square Feet (sq.ft)'),
                      const SizedBox(height: 8),
                      _buildSubunitField(_sqMCtrl, 'Square Meters (sq.m)'),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _convertSqFt,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: primaryBlue,
                                foregroundColor: Colors.white,
                              ),
                              child: const Text('Use Sq.Ft', maxLines: 1),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _convertSqM,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: primaryBlue,
                                foregroundColor: Colors.white,
                              ),
                              child: const Text('Use Sq.M', maxLines: 1),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // 2. MIDDLE SECTION (RESULTS)
          // Large bordered container titled "Conversion Results" containing three column-style cards
          Container(
            decoration: BoxDecoration(
              border: Border.all(color: primaryBlue, width: 1.5),
              borderRadius: BorderRadius.circular(12),
              color: Theme.of(context).cardColor,
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Conversion Results',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    Chip(
                      label: Text('Live Sync', style: TextStyle(fontSize: 11, color: primaryBlue)),
                      backgroundColor: Color(0x1F0284C7),
                      padding: EdgeInsets.zero,
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Three column-style cards displaying converted values with unit name on left and red text on right
                _buildResultColumnCard(
                  categoryTitle: 'Ropani System (Hilly Region)',
                  icon: Icons.terrain,
                  summaryLabel: 'Formatted Notation (R-A-P-D)',
                  summaryValue: _result.rapdFormatted,
                  items: [
                    ['Ropani', '${_result.ropaniInt}'],
                    ['Aana', '${_result.aanaInt}'],
                    ['Paisa', '${_result.paisaInt}'],
                    ['Daam', _result.daamDouble.toStringAsFixed(2)],
                    ['Total Decimal Ropani', '${_result.decimalRopani.toStringAsFixed(5)} R'],
                  ],
                  resultRed: resultRed,
                ),
                const SizedBox(height: 12),

                _buildResultColumnCard(
                  categoryTitle: 'Bigha System (Terai Region)',
                  icon: Icons.landscape,
                  summaryLabel: 'Formatted Notation (B-K-D)',
                  summaryValue: _result.bkdFormatted,
                  items: [
                    ['Bigha', '${_result.bighaInt}'],
                    ['Kattha', '${_result.katthaInt}'],
                    ['Dhur', _result.dhurDouble.toStringAsFixed(2)],
                    ['Total Decimal Bigha', '${_result.decimalBigha.toStringAsFixed(5)} B'],
                  ],
                  resultRed: resultRed,
                ),
                const SizedBox(height: 12),

                _buildResultColumnCard(
                  categoryTitle: 'Metric & Imperial Systems',
                  icon: Icons.straighten,
                  summaryLabel: 'Primary Land Footprint',
                  summaryValue: '${_result.sqMeters.toStringAsFixed(2)} sq.m (${_result.sqFeet.toStringAsFixed(2)} sq.ft)',
                  items: [
                    ['Square Meters (sq.m)', _result.sqMeters.toStringAsFixed(2)],
                    ['Square Feet (sq.ft)', _result.sqFeet.toStringAsFixed(2)],
                    ['Hectares (ha)', _result.hectares.toStringAsFixed(4)],
                    ['Acres', _result.acres.toStringAsFixed(4)],
                  ],
                  resultRed: resultRed,
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // 3. BOTTOM SECTION (INFO): Card titled "Conversion Rates"
          Card(
            shape: RoundedCornerShape(12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  InkWell(
                    onTap: () => setState(() => _ratesExpanded = !_ratesExpanded),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.info_outline, color: primaryBlue, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Conversion Rates',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        Icon(_ratesExpanded ? Icons.expand_less : Icons.expand_more),
                      ],
                    ),
                  ),
                  if (_ratesExpanded) ...[
                    const Divider(height: 20),
                    _buildRateSection('Bigha System (Terai Region):', [
                      '1 Bigha = 20 Kattha = 6772.63 sq.m = 72900 sq.ft.',
                      '1 Kattha = 20 Dhur = 338.63 sq.m = 3645 sq.ft.',
                      '1 Dhur = 16.93 sq.m = 182.25 sq.ft.',
                    ]),
                    const Divider(height: 16),
                    _buildRateSection('Ropani System (Hilly Region):', [
                      '1 Ropani = 16 Aana = 508.72 sq.m = 5476 sq.ft.',
                      '1 Aana = 4 Paisa = 31.80 sq.m = 342.25 sq.ft.',
                      '1 Paisa = 4 Daam = 7.95 sq.m = 85.56 sq.ft.',
                      '1 Daam = 1.99 sq.m = 21.39 sq.ft.',
                    ]),
                    const Divider(height: 16),
                    _buildRateSection('General Interconversions:', [
                      '1 Ropani ≈ 0.0752 Bigha | 1 Bigha ≈ 13.31 Ropani | 1 sq.m ≈ 10.7639 sq.ft.',
                      '1 Hectare = 10,000 sq.m | 1 Acre = 43,560 sq.ft. (≈ 4046.86 sq.m)',
                    ]),
                    const Divider(height: 16),
                    _buildRateSection('Angular Equivalents:', [
                      '400g = 360° = 24 hrs = 2π rad = 6400 mils.',
                    ]),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Widget child,
  }) {
    return Container(
      width: 270,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: const Color(0xFF0284C7), size: 20),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _buildSubunitField(TextEditingController ctrl, String label) {
    return TextField(
      controller: ctrl,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 12),
        isDense: true,
        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
      ),
    );
  }

  Widget _buildResultColumnCard({
    required String categoryTitle,
    required IconData icon,
    required String summaryLabel,
    required String summaryValue,
    required List<List<String>> items,
    required Color resultRed,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: const Color(0xFF0284C7), size: 18),
              const SizedBox(width: 8),
              Text(categoryTitle, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0x1F0284C7),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(summaryLabel, style: const TextStyle(fontSize: 12, color: Colors.black87)),
                Text(
                  summaryValue,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: resultRed,
                    fontFamily: 'monospace',
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          ...items.asMap().entries.map((entry) {
            final idx = entry.key;
            final item = entry.value;
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
              color: idx.isEven ? Colors.transparent : Colors.grey.withOpacity(0.08),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(item[0], style: const TextStyle(fontSize: 13)),
                  Text(
                    item[1],
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: resultRed, // Specifically calculated value in red text
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildRateSection(String title, List<String> lines) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        const SizedBox(height: 4),
        ...lines.map((l) => Text('•  $l', style: const TextStyle(fontSize: 12, fontFamily: 'monospace'))),
      ],
    );
  }
}

RoundedCornerShape(double r) => RoundedRectangleBorder(borderRadius: BorderRadius.circular(r));
