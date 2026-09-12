import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../models/area_point.dart';
import '../services/area_engine.dart';

class AreaCalculatorScreen extends StatefulWidget {
  final List<AreaPoint> importedPoints;

  const AreaCalculatorScreen({
    super.key,
    this.importedPoints = const [],
  });

  @override
  State<AreaCalculatorScreen> createState() => _AreaCalculatorScreenState();
}

class _AreaCalculatorScreenState extends State<AreaCalculatorScreen> {
  late List<AreaPoint> _points;
  bool _isClosed = true;
  int _activeTab = 0; // 0 = Canvas, 1 = Table

  @override
  void initState() {
    super.initState();
    _points = widget.importedPoints.isNotEmpty
        ? List.from(widget.importedPoints)
        : [
            AreaPoint(label: 'P1', x: 100.0, y: 100.0),
            AreaPoint(label: 'P2', x: 260.0, y: 120.0),
            AreaPoint(label: 'P3', x: 290.0, y: 270.0),
            AreaPoint(label: 'P4', x: 110.0, y: 250.0),
          ];
  }

  @override
  void didUpdateWidget(covariant AreaCalculatorScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.importedPoints.isNotEmpty && widget.importedPoints != oldWidget.importedPoints) {
      setState(() {
        _points = List.from(widget.importedPoints);
      });
    }
  }

  void _showAddPointDialog([int? editIndex]) {
    final isEditing = editIndex != null;
    final pt = isEditing ? _points[editIndex] : null;

    final labelCtrl = TextEditingController(text: pt?.label ?? 'P${_points.length + 1}');
    final xCtrl = TextEditingController(text: pt != null ? '${pt.x}' : '');
    final yCtrl = TextEditingController(text: pt != null ? '${pt.y}' : '');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(isEditing ? 'Edit Vertex' : 'Add Vertex Coordinate'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: labelCtrl, decoration: const InputDecoration(labelText: 'Label')),
            const SizedBox(height: 8),
            TextField(controller: xCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Easting (X)')),
            const SizedBox(height: 8),
            TextField(controller: yCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Northing (Y)')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              final x = double.tryParse(xCtrl.text) ?? 0.0;
              final y = double.tryParse(yCtrl.text) ?? 0.0;
              final newPt = AreaPoint(label: labelCtrl.text, x: x, y: y);
              setState(() {
                if (isEditing) {
                  _points[editIndex] = newPt;
                } else {
                  _points.add(newPt);
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

    final areaResult = AreaEngine.calculatePolygonArea(_points);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          const Text(
            'Area Calculator & Interactive Plotter',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const Text(
            'Shoelace formula polygon calculation & 2D tap-to-plot canvas',
            style: TextStyle(fontSize: 13, color: Colors.grey),
          ),
          const SizedBox(height: 16),

          // Total Enclosed Area Dynamic Output Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border.all(color: primaryBlue, width: 1.5),
              borderRadius: BorderRadius.circular(12),
              color: Theme.of(context).cardColor,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'TOTAL ENCLOSED AREA',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: primaryBlue, letterSpacing: 1.1),
                        ),
                        Text(
                          '${areaResult.sqMeters.toStringAsFixed(2)} sq.m',
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: resultRed, fontFamily: 'monospace'),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: primaryBlue.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Perimeter', style: TextStyle(fontSize: 10, color: Colors.black54)),
                          Text('${areaResult.perimeterMeters.toStringAsFixed(2)} m', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'monospace')),
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: _buildSystemBox(
                        title: 'Ropani System (Hilly)',
                        primary: areaResult.rapdFormatted,
                        secondary: '${areaResult.decimalRopani.toStringAsFixed(4)} Ropani',
                        resultRed: resultRed,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildSystemBox(
                        title: 'Bigha System (Terai)',
                        primary: areaResult.bkdFormatted,
                        secondary: '${areaResult.decimalBigha.toStringAsFixed(4)} Bigha',
                        resultRed: resultRed,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: _buildSystemBox(
                        title: 'Imperial Units',
                        primary: '${areaResult.sqFeet.toStringAsFixed(2)} sq.ft',
                        secondary: '${areaResult.acres.toStringAsFixed(4)} Acres',
                        resultRed: resultRed,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildSystemBox(
                        title: 'Metric Units',
                        primary: '${areaResult.sqMeters.toStringAsFixed(2)} sq.m',
                        secondary: '${areaResult.hectares.toStringAsFixed(4)} Hectares',
                        resultRed: resultRed,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Tabs
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ChoiceChip(
                label: const Text('Interactive Canvas (Tap-to-Plot)'),
                selected: _activeTab == 0,
                onSelected: (_) => setState(() => _activeTab = 0),
              ),
              const SizedBox(width: 10),
              ChoiceChip(
                label: Text('Coordinate Table (${_points.length} pts)'),
                selected: _activeTab == 1,
                onSelected: (_) => setState(() => _activeTab = 1),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // TAB 0: Interactive Canvas
          if (_activeTab == 0) ...[
            // Requested Action Buttons: "Undo Last Point", "Clear Canvas", "Close Polygon"
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _points.isNotEmpty
                        ? () => setState(() => _points.removeLast())
                        : null,
                    icon: const Icon(Icons.undo, size: 16),
                    label: const Text('Undo Last Point', maxLines: 1),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF334155),
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _points.length >= 3
                        ? () => setState(() => _isClosed = !_isClosed)
                        : null,
                    icon: const Icon(Icons.lock, size: 16),
                    label: Text(_isClosed ? 'Closed' : 'Close Polygon', maxLines: 1),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isClosed ? primaryBlue : const Color(0xFFD97706),
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _points.isNotEmpty
                        ? () => setState(() => _points.clear())
                        : null,
                    icon: const Icon(Icons.clear, size: 16),
                    label: const Text('Clear Canvas', maxLines: 1),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // 2D Canvas Area
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Container(
                height: 350,
                color: const Color(0xFF0F172A),
                child: GestureDetector(
                  onTapUp: (details) {
                    final box = context.findRenderObject() as RenderBox?;
                    final localOffset = details.localPosition;
                    setState(() {
                      _points.add(
                        AreaPoint(
                          label: 'P${_points.length + 1}',
                          x: localOffset.dx,
                          y: localOffset.dy,
                        ),
                      );
                    });
                  },
                  child: CustomPaint(
                    size: const Size(double.infinity, 350),
                    painter: PolygonPainter(
                      points: _points,
                      isClosed: _isClosed,
                    ),
                  ),
                ),
              ),
            ),
          ],

          // TAB 1: Coordinate Table
          if (_activeTab == 1) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Polygon Vertices', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ElevatedButton.icon(
                  onPressed: () => _showAddPointDialog(),
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Add Vertex (X, Y)'),
                  style: ElevatedButton.styleFrom(backgroundColor: primaryBlue, foregroundColor: Colors.white),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Card(
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _points.length,
                separatorBuilder: (_, __) => const Divider(height: 1),
                itemBuilder: (ctx, idx) {
                  final pt = _points[idx];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: primaryBlue,
                      foregroundColor: Colors.white,
                      child: Text(pt.label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                    title: Text(
                      'E: ${pt.x.toStringAsFixed(3)} m  |  N: ${pt.y.toStringAsFixed(3)} m',
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(icon: const Icon(Icons.edit, size: 18), onPressed: () => _showAddPointDialog(idx)),
                        IconButton(icon: const Icon(Icons.delete, size: 18, color: resultRed), onPressed: () => setState(() => _points.removeAt(idx))),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSystemBox({
    required String title,
    required String primary,
    required String secondary,
    required Color resultRed,
  }) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black87)),
          const SizedBox(height: 4),
          Text(primary, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: resultRed, fontFamily: 'monospace')),
          Text(secondary, style: const TextStyle(fontSize: 11, color: Colors.black54, fontFamily: 'monospace')),
        ],
      ),
    );
  }
}

class PolygonPainter extends CustomPainter {
  final List<AreaPoint> points;
  final bool isClosed;

  PolygonPainter({required this.points, required this.isClosed});

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Surveying Grid
    final gridPaint = Paint()
      ..color = const Color(0x1A38BDF8)
      ..strokeWidth = 1;

    for (double x = 0; x < size.width; x += 35) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 0; y < size.height; y += 35) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    if (points.isEmpty) return;

    // Normalization / Bounding box fit
    final minX = points.map((e) => e.x).reduce(math.min);
    final maxX = points.map((e) => e.x).reduce(math.max);
    final minY = points.map((e) => e.y).reduce(math.min);
    final maxY = points.map((e) => e.y).reduce(math.max);

    final rangeX = math.max(maxX - minX, 1.0);
    final rangeY = math.max(maxY - minY, 1.0);

    const pad = 40.0;
    final availW = size.width - (pad * 2);
    final availH = size.height - (pad * 2);

    final needsScaling = maxX > size.width || maxY > size.height || minX < 0 || minY < 0;

    Offset toScreen(AreaPoint pt) {
      if (needsScaling) {
        final scale = math.min(availW / rangeX, availH / rangeY);
        final sx = pad + (pt.x - minX) * scale;
        final sy = size.height - pad - (pt.y - minY) * scale;
        return Offset(sx, sy);
      }
      return Offset(pt.x, pt.y);
    }

    final screenPoints = points.map(toScreen).toList();

    // 2. Draw Polygon
    if (screenPoints.length >= 3) {
      final path = Path()..moveTo(screenPoints[0].dx, screenPoints[0].dy);
      for (int i = 1; i < screenPoints.length; i++) {
        path.lineTo(screenPoints[i].dx, screenPoints[i].dy);
      }
      if (isClosed) path.close();

      // Translucent Fill
      final fillPaint = Paint()
        ..color = const Color(0x330284C7)
        ..style = PaintingStyle.fill;
      canvas.drawPath(path, fillPaint);

      // Stroke
      final strokePaint = Paint()
        ..color = const Color(0xFF0284C7)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3;
      canvas.drawPath(path, strokePaint);
    } else if (screenPoints.length == 2) {
      canvas.drawLine(
        screenPoints[0],
        screenPoints[1],
        Paint()
          ..color = const Color(0xFF0284C7)
          ..strokeWidth = 3,
      );
    }

    // 3. Draw Nodes & Pins
    for (int i = 0; i < screenPoints.length; i++) {
      final pos = screenPoints[i];
      final node = points[i];

      // Glow circle
      canvas.drawCircle(pos, 14, Paint()..color = const Color(0xFFD97706).withOpacity(0.3));
      // Pin circle
      canvas.drawCircle(pos, 8, Paint()..color = const Color(0xFFD97706));
      canvas.drawCircle(pos, 3, Paint()..color = Colors.white);

      // Text label
      final textSpan = TextSpan(
        text: node.label,
        style: const TextStyle(color: Colors.yellow, fontSize: 13, fontWeight: FontWeight.bold),
      );
      final textPainter = TextPainter(text: textSpan, textDirection: TextDirection.ltr)..layout();
      textPainter.paint(canvas, Offset(pos.dx + 10, pos.dy - 10));
    }
  }

  @override
  bool shouldRepaint(covariant PolygonPainter oldDelegate) => true;
}
