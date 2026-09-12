import 'dms_angle.dart';

enum AdjustmentRule {
  bowditch('Bowditch / Compass Rule', 'Corrections proportional to line length / perimeter'),
  transit('Transit Rule', 'Corrections proportional to latitude/departure components');

  final String displayName;
  final String description;
  const AdjustmentRule(this.displayName, this.description);
}

class TraverseInputRow {
  final String id;
  final String station;
  final String line;
  final DmsAngle correctedAngle;
  final double distance;
  final DmsAngle? initialBearing;

  TraverseInputRow({
    String? id,
    required this.station,
    required this.line,
    required this.correctedAngle,
    required this.distance,
    this.initialBearing,
  }) : id = id ?? DateTime.now().microsecondsSinceEpoch.toString();
}

class TraverseComputedRow {
  final int sn;
  final String station;
  final DmsAngle correctedAngle;
  final String line;
  final DmsAngle bearing;
  final double distance;
  final double deltaE;             // Departure
  final double deltaN;             // Latitude
  final double correctionDeltaE;   // Correction to Easting
  final double correctionDeltaN;   // Correction to Northing
  final double correctedDeltaE;    // Final corrected Departure
  final double correctedDeltaN;    // Final corrected Latitude
  final double correctedEasting;   // Final Easting coordinate
  final double correctedNorthing;  // Final Northing coordinate

  const TraverseComputedRow({
    required this.sn,
    required this.station,
    required this.correctedAngle,
    required this.line,
    required this.bearing,
    required this.distance,
    required this.deltaE,
    required this.deltaN,
    required this.correctionDeltaE,
    required this.correctionDeltaN,
    required this.correctedDeltaE,
    required this.correctedDeltaN,
    required this.correctedEasting,
    required this.correctedNorthing,
  });
}

class TraverseSummary {
  final double totalPerimeter;
  final double sumDeltaE;
  final double sumDeltaN;
  final double sumCorrectedDeltaE;
  final double sumCorrectedDeltaN;
  final double linearMisclosure;
  final int relativePrecisionDenominator;
  final DmsAngle misclosureBearing;
  final AdjustmentRule adjustmentRule;

  const TraverseSummary({
    required this.totalPerimeter,
    required this.sumDeltaE,
    required this.sumDeltaN,
    required this.sumCorrectedDeltaE,
    required this.sumCorrectedDeltaN,
    required this.linearMisclosure,
    required this.relativePrecisionDenominator,
    required this.misclosureBearing,
    required this.adjustmentRule,
  });
}
