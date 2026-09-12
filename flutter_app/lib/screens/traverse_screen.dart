import 'package:flutter/material.dart';
import '../models/area_point.dart';
import '../models/dms_angle.dart';
import '../models/traverse_models.dart';
import '../services/traverse_engine.dart';

class TraverseScreen extends StatefulWidget {
  final ValueChanged<List<AreaPoint>> onSendToAreaCalculator;

  const TraverseScreen({
    super.key,
    required this.onSendToAreaCalculator,
  });

  @override
  State<TraverseScreen> createState() => _TraverseScreenState();
}

class _TraverseScreenState extends State<TraverseScreen> {
  List<TraverseInputRow> _inputs = TraverseEngine.getSampleTraverse();
  AdjustmentRule _rule = AdjustmentRule.bowditch;
  final _startECtrl = TextEditingController(text: '1000.000');
  final _startNCtrl = TextEditingController(text: '1000.000');

  @override
  void dispose() {
    _startECtrl.dispose();
    _startNCtrl.dispose();
    super.dispose();
  }

  void _showAddDialog([int? editIndex]) {
    final isEditing = editIndex != null;
    final row = isEditing ? _inputs[editIndex] : null;
    final isFirst = isEditing ? editIndex == 0 : _inputs.isEmpty;

    final stationCtrl = TextEditingController(text: row?.station ?? 'P${_inputs.length + 1}');
    final lineCtrl = TextEditingController(text: row?.line ?? (_inputs.isNotEmpty ? '${_inputs.last.station}-P${_inputs.length + 1}' : '1-2'));
    final degCtrl = TextEditingController(text: '${row?.correctedAngle.degrees ?? 90}');
    final minCtrl = TextEditingController(text: '${row?.correctedAngle.minutes ?? 0}');
    final secCtrl = TextEditingController(text: '${row?.correctedAngle.seconds ?? 0.0}');
    final distCtrl = TextEditingController(text: '${row?.distance ?? 100.0}');

    final bDegCtrl = TextEditingController(text: '${row?.initialBearing?.degrees ?? 45}');
    final bMinCtrl = TextEditingController(text: '${row?.initialBearing?.minutes ?? 0}');
    final bSecCtrl = TextEditingController(text: '${row?.initialBearing?.seconds ?? 0.0}');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(isEditing ? 'Edit Station' : 'Add Traverse Station'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(child: TextField(controller: stationCtrl, decoration: const InputDecoration(labelText: 'Station'))),
                  const SizedBox(width: 8),
                  Expanded(child: TextField(controller: lineCtrl, decoration: const InputDecoration(labelText: 'Line'))),
                ],
              ),
              const SizedBox(height: 8),
              TextField(
                controller: distCtrl,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(labelText: 'Distance (m)'),
              ),
              const SizedBox(height: 12),
              const Text('Corrected Angle (DMS):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              Row(
                children: [
                  Expanded(child: TextField(controller: degCtrl, decoration: const InputDecoration(labelText: 'Deg (°)'))),
                  const SizedBox(width: 4),
                  Expanded(child: TextField(controller: minCtrl, decoration: const InputDecoration(labelText: "Min (')"))),
                  const SizedBox(width: 4),
                  Expanded(child: TextField(controller: secCtrl, decoration: const InputDecoration(labelText: 'Sec (")'))),
                ],
              ),
              if (isFirst) ...[
                const SizedBox(height: 12),
                const Text('Initial Bearing (DMS) - Station 1 Only:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0284C7))),
                Row(
                  children: [
                    Expanded(child: TextField(controller: bDegCtrl, decoration: const InputDecoration(labelText: 'Deg (°)'))),
                    const SizedBox(width: 4),
                    Expanded(child: TextField(controller: bMinCtrl, decoration: const InputDecoration(labelText: "Min (')"))),
                    const SizedBox(width: 4),
                    Expanded(child: TextField(controller: bSecCtrl, decoration: const InputDecoration(labelText: 'Sec (")'))),
                  ],
                ),
              ],
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              final angle = DmsAngle(
                degrees: int.tryParse(degCtrl.text) ?? 0,
                minutes: int.tryParse(minCtrl.text) ?? 0,
                seconds: double.tryParse(secCtrl.text) ?? 0.0,
              );
              final bearing = DmsAngle(
                degrees: int.tryParse(bDegCtrl.text) ?? 0,
                minutes: int.tryParse(bMinCtrl.text) ?? 0,
                seconds: double.tryParse(bSecCtrl.text) ?? 0.0,
              );
              final newRow = TraverseInputRow(
                station: stationCtrl.text,
                line: lineCtrl.text,
                distance: double.tryParse(distCtrl.text) ?? 0.0,
                correctedAngle: angle,
                initialBearing: isFirst ? bearing : null,
              );

              setState(() {
                if (isEditing) {
                  _inputs[editIndex] = newRow;
                } else {
                  _inputs.add(newRow);
                }
              });
              Navigator.pop(ctx);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const primaryBlue = Color(0xFF0284C7);
    const resultRed = Color(0xFFDC2626);

    final startE = double.tryParse(_startECtrl.text) ?? 1000.0;
    final startN = double.tryParse(_startNCtrl.text) ?? 1000.0;

    final (computedRows, summary) = TraverseEngine.computeTraverse(
      _inputs,
      rule: _rule,
      startEasting: startE,
      startNorthing: startN,
    );

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
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
                    'Traverse Computation Engine',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'Closed loop traverse with Bowditch and Transit adjustment',
                    style: TextStyle(fontSize: 13, color: Colors.grey),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () {
                  setState(() {
                    _inputs = TraverseEngine.getSampleTraverse();
                  });
                },
                icon: const Icon(Icons.refresh, size: 16),
                label: const Text('Sample Loop'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF334155),
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Balancing Rule & Datum card
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Balancing Rule:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Row(
                        children: [
                          ChoiceChip(
                            label: const Text('Bowditch (Compass)'),
                            selected: _rule == AdjustmentRule.bowditch,
                            onSelected: (val) => setState(() => _rule = AdjustmentRule.bowditch),
                          ),
                          const SizedBox(width: 8),
                          ChoiceChip(
                            label: const Text('Transit Rule'),
                            selected: _rule == AdjustmentRule.transit,
                            onSelected: (val) => setState(() => _rule = AdjustmentRule.transit),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _startECtrl,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          decoration: const InputDecoration(
                            labelText: 'Initial Easting E₀ (m)',
                            isDense: true,
                          ),
                          onChanged: (_) => setState(() {}),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: TextField(
                          controller: _startNCtrl,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          decoration: const InputDecoration(
                            labelText: 'Initial Northing N₀ (m)',
                            isDense: true,
                          ),
                          onChanged: (_) => setState(() {}),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Misclosure Analysis Card
          if (summary != null) ...[
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: primaryBlue.withOpacity(0.05),
                border: Border.all(color: primaryBlue.withOpacity(0.4)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Traverse Closure & Precision Analysis',
                        style: TextStyle(fontWeight: FontWeight.bold, color: primaryBlue),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: summary.relativePrecisionDenominator >= 5000 ? const Color(0xFF059669) : resultRed,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          summary.relativePrecisionDenominator > 0
                              ? '1 : ${summary.relativePrecisionDenominator}'
                              : 'N/A',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildMetric('Perimeter (L)', '${summary.totalPerimeter.toStringAsFixed(3)} m'),
                      _buildMetric('Misclosure (e)', '${summary.linearMisclosure.toStringAsFixed(4)} m'),
                      _buildMetric('Error Bearing', summary.misclosureBearing.toFormattedString()),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildMetric('Σ Raw ΔE', '${summary.sumDeltaE >= 0 ? "+" : ""}${summary.sumDeltaE.toStringAsFixed(4)} m'),
                      _buildMetric('Σ Raw ΔN', '${summary.sumDeltaN >= 0 ? "+" : ""}${summary.sumDeltaN.toStringAsFixed(4)} m'),
                      _buildMetric('Balancing', summary.adjustmentRule.displayName.split(' ')[0]),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Toolbar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  ElevatedButton.icon(
                    onPressed: () => _showAddDialog(),
                    icon: const Icon(Icons.add, size: 16),
                    label: const Text('Add Station'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryBlue,
                      foregroundColor: Colors.white,
                    ),
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton(
                    onPressed: () => setState(() => _inputs.clear()),
                    child: const Text('Clear'),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: computedRows.isEmpty
                    ? null
                    : () {
                        final points = computedRows
                            .map((r) => AreaPoint(
                                  label: r.station,
                                  x: r.correctedEasting,
                                  y: r.correctedNorthing,
                                ))
                            .toList();
                        widget.onSendToAreaCalculator(points);
                      },
                icon: const Icon(Icons.send, size: 16),
                label: const Text('Send to Area Calc'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF059669),
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Dynamic Table with exact columns in order:
          // S.N., STATION, CORRECTED ANGLES, LINE, BEARING, DISTANCE (m),
          // ΔE, ΔN, Corrected ΔE, Corrected ΔN, Corrected Easting, Corrected Northing
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingRowColor: WidgetStateProperty.all(const Color(0xFF0F172A)),
              headingTextStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
              dataTextStyle: const TextStyle(fontSize: 12, fontFamily: 'monospace'),
              columns: const [
                DataColumn(label: Text('S.N.')),
                DataColumn(label: Text('STATION')),
                DataColumn(label: Text('CORRECTED ANGLES')),
                DataColumn(label: Text('LINE')),
                DataColumn(label: Text('BEARING')),
                DataColumn(label: Text('DISTANCE (m)')),
                DataColumn(label: Text('ΔE')),
                DataColumn(label: Text('ΔN')),
                DataColumn(label: Text('Corrected ΔE')),
                DataColumn(label: Text('Corrected ΔN')),
                DataColumn(label: Text('Corrected Easting')),
                DataColumn(label: Text('Corrected Northing')),
                DataColumn(label: Text('ACTIONS')),
              ],
              rows: computedRows.asMap().entries.map((entry) {
                final idx = entry.key;
                final r = entry.value;
                return DataRow(
                  cells: [
                    DataCell(Text('${r.sn}', style: const TextStyle(fontWeight: FontWeight.bold))),
                    DataCell(Text(r.station, style: const TextStyle(fontWeight: FontWeight.bold))),
                    DataCell(Text(r.correctedAngle.toFormattedString())),
                    DataCell(Text(r.line, style: const TextStyle(color: primaryBlue))),
                    DataCell(Text(r.bearing.toFormattedString(), style: const TextStyle(color: primaryBlue))),
                    DataCell(Text(r.distance.toStringAsFixed(3))),
                    DataCell(Text(r.deltaE.toStringAsFixed(3))),
                    DataCell(Text(r.deltaN.toStringAsFixed(3))),
                    DataCell(Text(r.correctedDeltaE.toStringAsFixed(3), style: const TextStyle(color: resultRed, fontWeight: FontWeight.bold))),
                    DataCell(Text(r.correctedDeltaN.toStringAsFixed(3), style: const TextStyle(color: resultRed, fontWeight: FontWeight.bold))),
                    DataCell(Text(r.correctedEasting.toStringAsFixed(3), style: const TextStyle(fontWeight: FontWeight.bold))),
                    DataCell(Text(r.correctedNorthing.toStringAsFixed(3), style: const TextStyle(fontWeight: FontWeight.bold))),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.edit, size: 16),
                          onPressed: () => _showAddDialog(idx),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete, size: 16, color: resultRed),
                          onPressed: () => setState(() => _inputs.removeAt(idx)),
                        ),
                      ],
                    )),
                  ],
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetric(String label, String val) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
        Text(val, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'monospace')),
      ],
    );
  }
}
